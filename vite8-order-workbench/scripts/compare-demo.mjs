import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const outputRoot = path.join(projectRoot, 'captures')
const defaultLabel = process.argv[2] ?? 'default'
const bundledLabel = process.argv[3] ?? 'bundled'

async function readCapture(label) {
  const source = path.join(outputRoot, `${label}.json`)
  const capture = JSON.parse(await readFile(source, 'utf8'))
  if (!capture.firstVisit || !capture.fullReload) {
    throw new Error(`${source} 缺少首次访问或全量刷新记录`)
  }
  if (!Number.isInteger(capture.firstVisit.sameOriginJsRequests) || !Number.isInteger(capture.fullReload.sameOriginJsRequests)) {
    throw new Error(`${source} 缺少新口径的同源 JS 请求数，请重新运行 capture-demo.mjs`)
  }
  return capture
}

const before = await readCapture(defaultLabel)
const after = await readCapture(bundledLabel)
if (before.url !== after.url) {
  throw new Error('两组记录的访问路由不同，不能生成对照草稿')
}

const lines = [
  '# Vite 8 订单工作台：结果卡草稿',
  '',
  '> 单次本机冒烟记录。请求数量可用于核对模块图；页面时间与 ready 须由正式多次同步录屏填写。以下空白不可直接发布。',
  '',
  `项目路由：\`${before.url}\`  ·  Chrome：${before.chrome} / ${after.chrome}`,
  '',
  '| 指标 | 默认开发模式 | 实验性开发打包 |',
  '|---|---:|---:|',
  '| 终端 ready | 待正式录制 | 待正式录制 |',
  '| 首次访问到业务主内容 | 待正式录制 | 待正式录制 |',
  '| 全量刷新到业务主内容 | 待正式录制 | 待正式录制 |',
  `| 同源 JS 请求数（首访 / 刷新，单次草稿） | ${before.firstVisit.sameOriginJsRequests} / ${before.fullReload.sameOriginJsRequests} | ${after.firstVisit.sameOriginJsRequests} / ${after.fullReload.sameOriginJsRequests} |`,
  '',
  '| S06 功能观察 | 默认开发模式 | 实验性开发打包 |',
  '|---|---|---|',
  '| OrderStatus.vue 改文案后的 HMR | 待正式录屏 | 待正式录屏 |',
  '| 插件与页面功能 | 待逐项核对 | 待逐项核对 |',
  '',
  '首访与刷新可剪成一段实验；Network 揭晓须使用与正式录屏对应的原始记录。请求减少不自动证明业务主内容更早出现。',
  '',
]

const destination = path.join(outputRoot, 'comparison-draft.md')
await writeFile(destination, lines.join('\n'), 'utf8')
process.stdout.write(`${destination}\n`)
