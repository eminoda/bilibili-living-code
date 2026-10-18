import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function renderMarkdown(source: string): string {
  if (!source) return ''

  const html = marked.parse(source, { async: false }) as string

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  })
}
