<script setup lang="ts">
import type { DemoMode } from '../types'

const emit = defineEmits<{ select: [mode: DemoMode] }>()

const modes = [
  {
    value: 'standard',
    title: '普通渲染',
    description: '一次渲染全部 100,000 行',
    icon: '📋',
  },
  {
    value: 'virtual',
    title: 'Virtual 虚拟渲染',
    description: '只渲染当前视口附近的行',
    icon: '⚡',
  },
  {
    value: 'comments',
    title: '评论区无限加载',
    description: '触底追加评论，同时虚拟化已加载列表',
    icon: '💬',
  },
] as const satisfies ReadonlyArray<{
  value: DemoMode
  title: string
  description: string
  icon: string
}>
</script>

<template>
  <main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
    <div class="mb-7">
      <p class="mb-2 text-sm font-medium text-emerald-700">列表虚拟化演示</p>
      <h1 class="text-2xl font-semibold tracking-tight">选择演示场景</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        对比全量渲染、虚拟列表，以及评论区无限加载。
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-3">
      <button
        v-for="mode in modes"
        :key="mode.value"
        type="button"
        class="group relative flex min-h-32 w-full items-center gap-3 rounded-xl border border-border bg-white p-4 pr-9 text-left shadow-sm transition hover:border-emerald-700/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 sm:flex-col sm:items-start sm:gap-4 sm:p-5 sm:pr-5"
        @click="emit('select', mode.value)"
      >
        <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-2xl" aria-hidden="true">
          {{ mode.icon }}
        </span>
        <span class="min-w-0">
          <span class="block font-medium leading-5">{{ mode.title }}</span>
          <span class="mt-1 block text-sm leading-5 text-muted-foreground">{{ mode.description }}</span>
        </span>
        <span
          class="absolute right-4 top-4 text-sm text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground sm:right-5 sm:top-5"
          aria-hidden="true"
          >→</span
        >
      </button>
    </div>
  </main>
</template>
