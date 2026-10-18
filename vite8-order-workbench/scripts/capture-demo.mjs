import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const label = process.argv[2] ?? 'default'
const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const outputRoot = path.join(projectRoot, 'captures')
const port = process.env.CAPTURE_PORT ?? '5178'
const url = `http://127.0.0.1:${port}/orders`
const origin = new URL(url).origin

await mkdir(outputRoot, { recursive: true })
const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
})
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
const page = await context.newPage()
const requests = []
const failures = []
let mainFrameNavigations = 0
page.on('request', (request) => requests.push({ url: request.url(), type: request.resourceType() }))
page.on('requestfailed', (request) => failures.push({ url: request.url(), error: request.failure()?.errorText }))
page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) mainFrameNavigations += 1 })

async function collect(labelForShot) {
  const main = page.getByTestId('orders-main')
  await main.getByTestId('orders-stats').locator('.kpi-card').first().waitFor({ state: 'visible' })
  await main.getByTestId('orders-table').locator('.el-table__body tbody tr').first().waitFor({ state: 'visible' })
  await page.waitForFunction(() => performance.getEntriesByName('orders-main-ready').length > 0, undefined, { timeout: 15_000 })
  await page.screenshot({ path: path.join(outputRoot, `${labelForShot}.png`), fullPage: false })
  await page.waitForLoadState('networkidle', { timeout: 120_000 })
  const timings = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    const business = performance.getEntriesByName('orders-main-ready')[0]
    return {
      navigationStart: 0,
      firstContentfulPaintMs: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime ?? null,
      ordersMainReadyMarkerMs: business?.startTime ?? null,
      domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? null,
      loadEventMs: navigation?.loadEventEnd ?? null,
    }
  })
  const sameOrigin = requests.filter((request) => request.url.startsWith(`${origin}/`))
  const sameOriginJs = sameOrigin.filter((request) => request.type === 'script')
  const sourceModules = sameOrigin.filter((request) => /\/src\/|\/node_modules\/\.vite\//.test(request.url))
  const requestTypes = Object.fromEntries(
    [...new Set(sameOrigin.map((request) => request.type))]
      .sort()
      .map((type) => [type, sameOrigin.filter((request) => request.type === type).length]),
  )
  return {
    totalRequests: requests.length,
    sameOriginRequests: sameOrigin.length,
    sameOriginJsRequests: sameOriginJs.length,
    sameOriginJsUrls: sameOriginJs.map((request) => request.url),
    sourceModuleRequests: sourceModules.length,
    requestTypes,
    timings,
    sourceModuleUrls: sourceModules.map((request) => request.url),
  }
}

try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  const firstVisit = await collect(label)
  firstVisit.mainFrameNavigations = mainFrameNavigations
  requests.length = 0
  const navigationsBeforeReload = mainFrameNavigations
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 })
  const fullReload = await collect(`${label}-reload`)
  fullReload.mainFrameNavigations = mainFrameNavigations - navigationsBeforeReload
  const result = {
    label, url, chrome: browser.version(),
    cacheProtocol: '每次运行新建非持久化浏览器上下文，首次访问浏览器缓存为空且保持启用；同一上下文和服务器内执行普通刷新。依赖预构建缓存预热与新服务器由录制者按 README 准备。',
    businessReadyDefinition: '订单统计卡与订单表格第一行均在 1920×1080 视口内可见；orders-main-ready 是随后一帧的辅助标记。',
    note: '截图在固定 Ready 条件满足后保存；请求数截至 Network 空闲。单次记录仅供核对，正式页面时间需按同一协议多次采集。',
    firstVisit, fullReload, failures,
  }
  await writeFile(path.join(outputRoot, `${label}.json`), JSON.stringify(result, null, 2))
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
} finally {
  await browser.close()
}
