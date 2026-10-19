import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { apiUrl, DEFAULT_BASE_URL, TOKEN_FILE } from './config.mjs'
import { requestJson } from './http.mjs'
import { saveToken } from './tokenStore.mjs'

/**
 * Login to ZenTao and persist only the returned token.
 * Account and password are runtime inputs and are never written to disk.
 */
export async function loginAuth({
  account,
  password,
  baseUrl = DEFAULT_BASE_URL,
  tokenFile = TOKEN_FILE,
} = {}) {
  if (!account || !password) {
    throw new Error('loginAuth requires account and password as runtime arguments.')
  }

  const payload = await requestJson({
    url: apiUrl('/users/login', baseUrl),
    method: 'POST',
    body: { account, password },
  })

  if (!payload.token) {
    throw new Error('Login succeeded without a token in the response.')
  }

  const savedTo = await saveToken(payload.token, tokenFile)
  return { token: payload.token, savedTo }
}

function readCliValue(flag, envName) {
  const index = process.argv.indexOf(flag)
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1]
  }
  return process.env[envName]
}

async function runCli() {
  const account = readCliValue('--account', 'ZENTAO_ACCOUNT')
  const password = readCliValue('--password', 'ZENTAO_PASSWORD')
  const baseUrl = readCliValue('--base-url', 'ZENTAO_BASE_URL') || DEFAULT_BASE_URL

  const result = await loginAuth({ account, password, baseUrl })
  console.log(JSON.stringify({
    ok: true,
    savedTo: result.savedTo,
    tokenPreview: `${result.token.slice(0, 6)}...`,
  }, null, 2))
}

function isMainModule() {
  const entry = process.argv[1]
  if (!entry) return false
  return import.meta.url === pathToFileURL(path.resolve(entry)).href
}

if (isMainModule()) {
  runCli().catch((error) => {
    console.error(error.message)
    console.error('Usage: node src/loginAuth.mjs --account <account> --password <password> [--base-url <url>]')
    console.error('Or set ZENTAO_ACCOUNT and ZENTAO_PASSWORD in the environment for this run only.')
    process.exitCode = 1
  })
}
