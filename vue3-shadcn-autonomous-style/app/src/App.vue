<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div
    class="min-h-full flex flex-col items-center justify-center gap-6 p-8 bg-background text-foreground"
  >
    <nav
      class="flex flex-wrap gap-2 justify-center text-sm"
      data-testid="demo-nav"
    >
      <RouterLink
        class="px-3 py-1.5 rounded-md border border-border hover:bg-card"
        to="/pain"
        >痛点</RouterLink
      >
      <RouterLink
        class="px-3 py-1.5 rounded-md border border-border hover:bg-card"
        to="/ownership"
        >源码在仓</RouterLink
      >
      <RouterLink
        class="px-3 py-1.5 rounded-md border border-border hover:bg-card"
        to="/theme"
        >主题切换</RouterLink
      >
      <RouterLink
        class="px-3 py-1.5 rounded-md border border-border hover:bg-card"
        to="/table"
        >表格</RouterLink
      >
    </nav>
    <div class="w-full max-w-3xl flex-1 flex flex-col justify-center">
      <RouterView />
    </div>
  </div>
</template>
