async function parseBody(response) {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Expected JSON from ${response.url}, got: ${text.slice(0, 200)}`)
  }
}

export async function requestJson({ url, method = 'GET', token, body }) {
  const headers = { Accept: 'application/json' }
  if (token) {
    headers.token = token
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const payload = await parseBody(response)

  if (response.status === 401) {
    throw new Error(payload.message || 'Unauthorized (401). Token is missing or invalid.')
  }
  if (!response.ok || payload.status === 'fail') {
    throw new Error(payload.message || `Request failed: ${response.status} ${url}`)
  }
  if (payload.status && payload.status !== 'success') {
    throw new Error(payload.message || `Unexpected status: ${payload.status}`)
  }
  return payload
}
