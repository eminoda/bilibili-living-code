import path from 'node:path'
import { pathToFileURL } from 'node:url'

export function isMainModule(metaUrl) {
  const entry = process.argv[1]
  if (!entry) return false
  return metaUrl === pathToFileURL(path.resolve(entry)).href
}

export function readCliValue(flag, envName) {
  const index = process.argv.indexOf(flag)
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1]
  }
  return envName ? process.env[envName] : undefined
}
