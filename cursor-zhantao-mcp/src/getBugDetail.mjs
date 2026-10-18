import { isMainModule, readCliValue } from './cli.mjs'
import { apiUrl, DEFAULT_BASE_URL, TOKEN_FILE } from './config.mjs'
import { requestJson } from './http.mjs'
import { loadToken } from './tokenStore.mjs'

/**
 * Fetch a single bug by ID using the saved token.
 */
export async function getBugDetail({
  bugId,
  baseUrl = DEFAULT_BASE_URL,
  tokenFile = TOKEN_FILE,
} = {}) {
  if (!bugId) {
    throw new Error('getBugDetail requires bugId.')
  }

  const token = await loadToken(tokenFile)
  const payload = await requestJson({
    url: apiUrl(`/bugs/${encodeURIComponent(bugId)}`, baseUrl),
    token,
  })

  if (!payload.bug) {
    throw new Error(`Bug ${bugId} was not found in the response.`)
  }

  return { bug: payload.bug }
}

async function runCli() {
  const bugId = readCliValue('--bug-id') || readCliValue('--id')
  const result = await getBugDetail({ bugId })
  console.log(JSON.stringify({
    ok: true,
    bug: result.bug,
  }, null, 2))
}

if (isMainModule(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message)
    console.error('Usage: node src/getBugDetail.mjs --bug-id <id>')
    process.exitCode = 1
  })
}
