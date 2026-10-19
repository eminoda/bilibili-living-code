import { apiUrl } from './config.mjs'
import { requestJson } from './http.mjs'

export const PAGE_SIZE = 1000

export async function fetchAllPages(pathWithQuery, { token, baseUrl, listKey }) {
  const items = []
  let pageID = 1
  while (true) {
    const separator = pathWithQuery.includes('?') ? '&' : '?'
    const payload = await requestJson({
      url: apiUrl(`${pathWithQuery}${separator}recPerPage=${PAGE_SIZE}&pageID=${pageID}`, baseUrl),
      token,
    })
    const pageItems = payload[listKey] || []
    items.push(...pageItems)
    if (pageItems.length < PAGE_SIZE) break
    pageID += 1
  }
  return items
}
