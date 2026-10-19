import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { TOKEN_FILE } from './config.mjs'

export async function saveToken(token, tokenFile = TOKEN_FILE) {
  if (!token || typeof token !== 'string') {
    throw new Error('Cannot save an empty token.')
  }
  await mkdir(path.dirname(tokenFile), { recursive: true })
  await writeFile(tokenFile, `${token.trim()}\n`, { encoding: 'utf8', mode: 0o600 })
  return tokenFile
}

export async function loadToken(tokenFile = TOKEN_FILE) {
  try {
    const token = (await readFile(tokenFile, 'utf8')).trim()
    if (!token) {
      throw new Error('Token file is empty.')
    }
    return token
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(`Token not found at ${tokenFile}. Run loginAuth first.`)
    }
    throw error
  }
}
