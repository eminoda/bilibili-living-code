<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { ThemedToken } from 'shiki'
import type { CodeLanguage } from '@/utils/shikiHighlighter'

const props = defineProps<{
  code: string
  language: CodeLanguage
  label: string
}>()

const tokenLines = shallowRef<ThemedToken[][] | null>(null)
const codeElement = ref<HTMLElement | null>(null)
const isNearViewport = shallowRef(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isNearViewport.value = true
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      isNearViewport.value = true
      observer?.disconnect()
    }
  }, { rootMargin: '120px' })

  if (codeElement.value) observer.observe(codeElement.value)
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => [props.code, props.language, isNearViewport.value] as const,
  async ([code, language, visible], _previous, onCleanup) => {
    if (!visible) return
    let cancelled = false
    onCleanup(() => { cancelled = true })

    try {
      const { highlightSnippet } = await import('@/utils/shikiHighlighter')
      const tokens = await highlightSnippet(code, language)
      if (!cancelled) tokenLines.value = tokens
    } catch {
      if (!cancelled) tokenLines.value = null
    }
  },
  { immediate: true },
)
</script>

<template>
  <pre ref="codeElement" class="code-block" :aria-label="`${label} code`"><code v-if="tokenLines"><span v-for="(line, lineIndex) in tokenLines" :key="lineIndex" class="code-line"><span v-for="(token, tokenIndex) in line" :key="tokenIndex" :style="{ color: token.color }">{{ token.content }}</span><span v-if="line.length === 0">&nbsp;</span></span></code><code v-else>{{ code }}</code></pre>
</template>

<style scoped>
.code-block { overflow: auto; min-height: 96px; max-height: 220px; margin: 0; padding: 14px 16px 17px; border-top: 1px solid #edf0f4; background: #f8f9fb; color: #4d596a; font: 10px/1.75 'DM Mono', Consolas, monospace; tab-size: 2; white-space: pre; }
.code-line { display: block; min-height: 1.75em; }
</style>
