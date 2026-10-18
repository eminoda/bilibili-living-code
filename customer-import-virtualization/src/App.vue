<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import { CustomerImportView } from '@/features/customer-import'
import CommentsFeedView from '@/features/comments/CommentsFeedView.vue'
import RenderModeEntry from '@/features/customer-import/components/RenderModeEntry.vue'
import type { DemoMode, RenderMode } from '@/features/customer-import/types'

const demoMode = shallowRef<DemoMode | null>(readMode())

const isComments = computed(() => demoMode.value === 'comments')
const renderMode = computed(() =>
  demoMode.value === 'standard' || demoMode.value === 'virtual' ? demoMode.value : null,
)

function readMode(): DemoMode | null {
  const mode = new URLSearchParams(window.location.search).get('mode')
  if (mode === '1') return 'standard'
  if (mode === '2') return 'virtual'
  if (mode === '3') return 'comments'
  return null
}

function syncMode() {
  demoMode.value = readMode()
}

function modeToQuery(mode: DemoMode): string {
  if (mode === 'standard') return '1'
  if (mode === 'virtual') return '2'
  return '3'
}

function updateMode(mode: DemoMode | RenderMode | null) {
  const url = new URL(window.location.href)
  if (mode) url.searchParams.set('mode', modeToQuery(mode))
  else url.searchParams.delete('mode')

  window.history.pushState(null, '', url)
  demoMode.value = mode
}

onMounted(() => window.addEventListener('popstate', syncMode))
onUnmounted(() => window.removeEventListener('popstate', syncMode))
</script>

<template>
  <div class="min-h-screen bg-[#f5f7f6] text-foreground">
    <RenderModeEntry v-if="!demoMode" @select="updateMode" />
    <main v-else class="mx-auto max-w-[1320px] px-5 pb-10 pt-7 sm:px-8 sm:pt-9">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ isComments ? '评论区加载' : '客户数据导入' }}
        </h1>
        <Button size="sm" variant="outline" @click="updateMode(null)">选择演示场景</Button>
      </div>
      <CommentsFeedView v-if="isComments" />
      <CustomerImportView
        v-else-if="renderMode"
        :mode="renderMode"
        @update:mode="updateMode"
      />
    </main>
  </div>
</template>
