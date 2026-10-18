<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isQuickstart = computed(() => route.path === '/quickstart' || route.path === '/')
const isCases = computed(() => route.path === '/cases')
const isAdminPage = computed(() => route.path === '/admin')
const isLearningPage = computed(() => isQuickstart.value || isCases.value || isAdminPage.value)
</script>

<template>
  <div class="app-frame">
    <header class="topbar" :class="{ 'topbar--light': isAdminPage }">
      <RouterLink class="wordmark" to="/quickstart" aria-label="Motion Vue Lab 首页">
        <img class="wordmark-symbol" src="https://motion.dev/favicon.svg" alt="" />
        <span>motion<span class="wordmark-muted">/</span>vue</span>
        <span class="version-tag">2.6</span>
      </RouterLink>

      <nav class="topnav" aria-label="主导航">
        <template v-if="isLearningPage">
          <RouterLink to="/quickstart" :class="{ 'nav-link--active': isQuickstart }">Quickstart</RouterLink>
          <RouterLink to="/admin" :class="{ 'nav-link--active': isAdminPage }">后管页面</RouterLink>
          <RouterLink to="/cases" :class="{ 'nav-link--active': isCases }">案例</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/quickstart">快速开始</RouterLink>
          <RouterLink to="/examples" :class="{ 'nav-link--active': route.path === '/examples' }">示例</RouterLink>
          <a href="https://motion.dev/docs/vue" target="_blank" rel="noreferrer">文档 <span aria-hidden="true">↗</span></a>
        </template>
      </nav>

      <a v-if="!isLearningPage" class="github-link" href="https://github.com/motiondivision/motion-vue" target="_blank" rel="noreferrer" aria-label="Motion for Vue on GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.2 1.16-2.98-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.1-1.43 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.16 1.76 1.16 2.98 0 4.27-2.61 5.21-5.1 5.49.4.34.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
      </a>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-frame { min-height: 100vh; }
.topbar { position: sticky; z-index: 20; top: 0; display: flex; height: 62px; align-items: center; justify-content: space-between; padding: 0 max(32px, calc((100vw - 1440px) / 2)); border-bottom: 1px solid #242428; background: rgb(10 10 12 / 90%); backdrop-filter: blur(18px); }
.wordmark { display: inline-flex; align-items: center; gap: 9px; color: #f2f2f3; font-size: 14px; font-weight: 720; letter-spacing: -.04em; text-decoration: none; }
.wordmark-symbol { display: block; width: 24px; height: 24px; border-radius: 6px; object-fit: cover; }
.wordmark-muted { color: #77777e; font-weight: 400; }
.version-tag { margin-left: 2px; padding: 3px 5px; border: 1px solid #29292e; border-radius: 5px; color: #a4a4aa; font: 9px 'DM Mono', monospace; }
.topnav { display: flex; height: 100%; align-items: center; gap: 27px; }
.topnav a { display: inline-flex; height: 100%; align-items: center; border-bottom: 1px solid transparent; color: #929298; font-size: 12px; text-decoration: none; transition: color 150ms ease, border-color 150ms ease; }
.topnav a:hover, .topnav .nav-link--active { border-color: #e8e8eb; color: #f5f5f6; }
.topnav a span { margin-left: 4px; color: #6e6e74; font-size: 10px; }
.topbar--light { border-bottom-color: #e2e6ed; background: rgb(247 248 250 / 94%); }
.topbar--light .wordmark { color: #202632; }
.topbar--light .wordmark-muted { color: #8993a1; }
.topbar--light .version-tag { border-color: #e0e5ec; color: #778292; }
.topbar--light .topnav a { border-color: transparent; color: #556274; }
.topbar--light .topnav .nav-link--active { border-color: #409eff; color: #337ecc; }
.github-link { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid #29292e; border-radius: 8px; color: #a3a3a9; }
.github-link:hover { color: #f2f2f3; border-color: #494950; }
.github-link svg { width: 15px; height: 15px; fill: currentColor; }
@media (max-width: 640px) {
  .topbar { height: 56px; padding: 0 16px; }
  .wordmark { font-size: 12px; }
  .topnav { gap: 13px; }
  .topnav a { font-size: 11px; }
  .github-link { display: none; }
}
</style>
