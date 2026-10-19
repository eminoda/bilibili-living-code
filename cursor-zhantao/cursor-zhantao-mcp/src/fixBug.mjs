import { isMainModule, readCliValue } from './cli.mjs'
import { apiUrl, DEFAULT_BASE_URL, TOKEN_FILE } from './config.mjs'
import { requestJson } from './http.mjs'
import { loadToken } from './tokenStore.mjs'

const RESOLUTIONS = [
  'fixed',
  'notrepro',
  'bydesign',
  'duplicate',
  'external',
  'postponed',
  'willnotfix',
  'tostory',
]

/**
 * Resolve a bug (change its status) using the saved token.
 * Default resolution is `fixed`. Account and password are not used.
 */
export async function fixBug({
  bugId,
  resolution = 'fixed',
  resolvedDate,
  resolvedBuild,
  assignedTo,
  comment,
  baseUrl = DEFAULT_BASE_URL,
  tokenFile = TOKEN_FILE,
} = {}) {
  if (!bugId) {
    throw new Error('fixBug requires bugId.')
  }
  if (!RESOLUTIONS.includes(resolution)) {
    throw new Error(`resolution must be one of: ${RESOLUTIONS.join(', ')}`)
  }

  const token = await loadToken(tokenFile)
  const body = { resolution }
  if (resolvedDate) body.resolvedDate = resolvedDate
  if (resolvedBuild) body.resolvedBuild = resolvedBuild
  if (assignedTo) body.assignedTo = assignedTo
  if (comment) body.comment = comment

  const payload = await requestJson({
    url: apiUrl(`/bugs/${encodeURIComponent(bugId)}/resolve`, baseUrl),
    method: 'PUT',
    token,
    body,
  })

  return {
    status: payload.status,
    bugId: String(bugId),
    resolution,
  }
}

async function runCli() {
  const bugId = readCliValue('--bug-id') || readCliValue('--id')
  const result = await fixBug({
    bugId,
    resolution: readCliValue('--resolution') || 'fixed',
    resolvedDate: readCliValue('--resolved-date'),
    resolvedBuild: readCliValue('--resolved-build'),
    assignedTo: readCliValue('--assigned-to'),
    comment: readCliValue('--comment'),
  })
  console.log(JSON.stringify({ ok: true, ...result }, null, 2))
}

if (isMainModule(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message)
    console.error('Usage: node src/fixBug.mjs --bug-id <id> [--resolution fixed] [--resolved-build trunk] [--assigned-to <account>] [--comment <text>]')
    process.exitCode = 1
  })
}
