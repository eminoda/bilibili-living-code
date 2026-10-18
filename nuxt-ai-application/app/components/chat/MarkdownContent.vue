<script setup lang="ts">
import { renderMarkdown } from '~/utils/markdown'

const props = defineProps<{
  content: string
}>()

const html = computed(() => renderMarkdown(props.content))
</script>

<template>
  <div
    class="markdown-content"
    data-testid="markdown-content"
    v-html="html"
  />
</template>

<style scoped>
.markdown-content {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #0d0d0d;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.markdown-content :deep(:first-child) {
  margin-top: 0;
}

.markdown-content :deep(:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(p),
.markdown-content :deep(ul),
.markdown-content :deep(ol),
.markdown-content :deep(blockquote),
.markdown-content :deep(pre),
.markdown-content :deep(table) {
  margin: 0 0 0.875rem;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin: 1.25rem 0 0.625rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.markdown-content :deep(h1) {
  font-size: 1.375rem;
}

.markdown-content :deep(h2) {
  font-size: 1.25rem;
}

.markdown-content :deep(h3) {
  font-size: 1.125rem;
}

.markdown-content :deep(h4) {
  font-size: 1rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.375rem;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

.markdown-content :deep(li > p) {
  margin: 0;
}

.markdown-content :deep(blockquote) {
  padding: 0.125rem 0 0.125rem 0.875rem;
  border-left: 3px solid #d4d4d4;
  color: #525252;
}

.markdown-content :deep(a) {
  color: #0d0d0d;
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.markdown-content :deep(hr) {
  margin: 1.25rem 0;
  border: none;
  border-top: 1px solid #e5e5e5;
}

.markdown-content :deep(code) {
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875em;
  background: #f4f4f4;
}

.markdown-content :deep(pre) {
  padding: 0.875rem 1rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #f7f7f7;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  overflow-x: auto;
  display: block;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e5e5;
  text-align: left;
}

.markdown-content :deep(th) {
  font-weight: 600;
  background: #fafafa;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
</style>
