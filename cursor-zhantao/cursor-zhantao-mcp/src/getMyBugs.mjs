import { isMainModule } from './cli.mjs'
import { DEFAULT_BASE_URL, TOKEN_FILE } from './config.mjs'
import { fetchAllPages } from './pagedList.mjs'
import { loadToken } from './tokenStore.mjs'

/**
 * Query bugs assigned to the current token user.
 * Uses saved token only; does not accept or store account/password.
 */
export async function getMyBugs({
  baseUrl = DEFAULT_BASE_URL,
  tokenFile = TOKEN_FILE,
  browseType = 'assigntome',
} = {}) {
  const token = await loadToken(tokenFile)
  const products = await fetchAllPages('/products?browseType=noclosed', {
    token,
    baseUrl,
    listKey: 'products',
  })

  const bugPages = await Promise.all(
    products.map((product) => fetchAllPages(
      `/products/${encodeURIComponent(product.id)}/bugs?browseType=${encodeURIComponent(browseType)}`,
      { token, baseUrl, listKey: 'bugs' },
    )),
  )

  const bugsById = new Map()
  for (const bug of bugPages.flat()) {
    bugsById.set(String(bug.id), bug)
  }

  return {
    bugs: [...bugsById.values()],
    productCount: products.length,
  }
}

async function runCli() {
  const result = await getMyBugs()
  console.log(JSON.stringify({
    ok: true,
    productCount: result.productCount,
    bugCount: result.bugs.length,
    bugs: result.bugs.map((bug) => ({
      id: bug.id,
      title: bug.title,
      status: bug.status,
      assignedTo: bug.assignedTo,
      product: bug.product,
      pri: bug.pri,
      severity: bug.severity,
    })),
  }, null, 2))
}

if (isMainModule(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
