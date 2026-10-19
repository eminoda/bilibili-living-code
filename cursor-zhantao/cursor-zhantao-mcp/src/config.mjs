import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const DEFAULT_BASE_URL = process.env.ZENTAO_BASE_URL || 'http://localhost:5182'
export const TOKEN_FILE = process.env.ZENTAO_TOKEN_FILE || path.join(projectRoot, '.zentao-token')
export const FEISHU_HOOK_URL = process.env.FEISHU_HOOK_URL
  || 'https://open.feishu.cn/open-apis/bot/v2/hook/8922b4e0-2a39-4be0-aed0-6f7c98b1400c'
export const BUG_WATCH_INTERVAL_MS = Number(process.env.BUG_WATCH_INTERVAL_MS) || 10_000

export function normalizeBaseUrl(baseUrl = DEFAULT_BASE_URL) {
  return String(baseUrl).replace(/\/+$/, '')
}

export function apiUrl(pathname, baseUrl = DEFAULT_BASE_URL) {
  const prefix = normalizeBaseUrl(baseUrl)
  const suffix = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${prefix}/api.php/v2${suffix}`
}
