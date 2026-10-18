import { chromium } from 'playwright'
import { mkdir, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'

const baseUrl = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173'
const outputDir = join(process.cwd(), 'public', 'recordings')
const viewport = { width: 1360, height: 765 }
const execFile = promisify(execFileCallback)

await mkdir(outputDir, { recursive: true })

async function settle(page) {
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => document.body.innerText.includes('100,000'))
  await page.waitForTimeout(1200)
}

async function measure(page) {
  return page.evaluate(() => ({
    rows: document.querySelectorAll('[role="row"][aria-rowindex]').length,
    scrollHeight: document.querySelector('[role="table"]')?.scrollHeight ?? 0,
    scrollTop: document.querySelector('[role="table"]')?.scrollTop ?? 0,
  }))
}

async function record(name, setup) {
  const context = await browser.newContext({
    viewport,
    screen: viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: outputDir, size: viewport },
  })
  const page = await context.newPage()
  await page.goto(`${baseUrl}/`)
  await settle(page)
  await setup(page)
  await page.waitForTimeout(500)
  await context.close()

  const videoPath = await page.video()?.path()
  if (!videoPath) throw new Error(`No video was produced for ${name}`)
  const webmPath = join(outputDir, `${name}.webm`)
  const mp4Path = join(outputDir, `${name}.mp4`)
  await rename(videoPath, webmPath)
  await execFile('ffmpeg', [
    '-y',
    '-i',
    webmPath,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    mp4Path,
  ])
  await rm(webmPath)
}

const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ??
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
})

try {
  await record('customer-standard', async (page) => {
    await page.getByRole('button', { name: '普通渲染' }).click()
    await page.waitForTimeout(1800)
    for (const ratio of [0.18, 0.52, 0.96]) {
      await page.evaluate((value) => {
        const element = document.querySelector('[role="table"]')
        if (element) element.scrollTop = element.scrollHeight * value
      }, ratio)
      await page.waitForTimeout(900)
    }
    console.log('customer-standard', await measure(page))
  })

  await record('customer-virtual', async (page) => {
    await page.getByRole('button', { name: 'Virtual' }).click()
    await page.waitForTimeout(900)
    for (const ratio of [0.18, 0.52, 0.96, 0]) {
      await page.evaluate((value) => {
        const element = document.querySelector('[role="table"]')
        if (element) element.scrollTop = element.scrollHeight * value
      }, ratio)
      await page.waitForTimeout(900)
    }
    console.log('customer-virtual', await measure(page))
  })

  await record('comments-infinite-virtual', async (page) => {
    await page.getByRole('button', { name: '评论区加载' }).click()
    await page.waitForTimeout(700)
    const list = page.getByRole('list', { name: '评论' })
    for (let index = 0; index < 7; index += 1) {
      await list.evaluate((element) => {
        element.parentElement.scrollTop = element.parentElement.scrollHeight
      })
      await page.waitForTimeout(700)
    }
    console.log('comments-infinite-virtual', await page.evaluate(() => ({
      loaded: document.body.innerText.match(/已加载评论\s*(\d+)/)?.[1],
      rendered: document.body.innerText.match(/当前渲染行数\s*(\d+)/)?.[1],
    })))
  })
} finally {
  await browser.close()
}
