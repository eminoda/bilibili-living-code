<script setup lang="ts">
import { useImplementationMode } from '@/composables/useImplementationMode'

const { mode } = useImplementationMode()
</script>

<template>
  <div class="app-frame">
    <header class="topbar">
      <div class="topbar-brand" aria-label="Vue Tutorial 系列">
        <svg class="topbar-brand-mark" viewBox="0 0 40 32" aria-hidden="true">
          <path d="M1 3h8l11 18L31 3h8L20 30z" fill="#42b883" />
          <path d="M10 3h6l4 7 4-7h6L20 21z" fill="#35495e" />
        </svg>
        <span><strong>Vue</strong> Tutorial</span>
      </div>
      <div class="topbar-actions">
        <span class="compare-label">实现方式</span>
        <div class="mode-toggle" role="group" aria-label="切换实现方式">
          <button :class="{ selected: mode === 'vueuse' }" @click="mode = 'vueuse'">VueUse</button>
          <button :class="{ selected: mode === 'native' }" @click="mode = 'native'">原始实现</button>
        </div>
      </div>
    </header>

    <main class="main-area">
      <div class="page-wrap">
        <RouterView v-slot="{ Component }">
          <component :is="Component" :implementation="mode" />
        </RouterView>
      </div>
    </main>
  </div>
</template>
