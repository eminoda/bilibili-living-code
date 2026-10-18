import { codeToTokens } from 'shiki/dist/bundle-web.mjs'
import type { BundledLanguage, ThemedToken } from 'shiki/dist/bundle-web.mjs'

export type CodeLanguage = 'css' | 'vue'

const tokenCache = new Map<string, Promise<ThemedToken[][]>>()

export function highlightSnippet(code: string, language: CodeLanguage) {
  const cacheKey = `${language}:${code}`
  const cached = tokenCache.get(cacheKey)
  if (cached) return cached

  const pending = codeToTokens(code, {
    lang: language as BundledLanguage,
    theme: 'github-dark',
  })
    .then(({ tokens }) => tokens)
    .catch((error: unknown) => {
      tokenCache.delete(cacheKey)
      throw error
    })

  tokenCache.set(cacheKey, pending)
  return pending
}
