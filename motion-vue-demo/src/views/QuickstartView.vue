<script setup lang="ts">
import { ref } from 'vue'
import EnterAnimationDemo from '@/components/quickstart/EnterAnimationDemo.vue'
import ExitAnimationDemo from '@/components/quickstart/ExitAnimationDemo.vue'
import GestureDemo from '@/components/quickstart/GestureDemo.vue'
import LayoutDemo from '@/components/quickstart/LayoutDemo.vue'
import ScrollDemo from '@/components/quickstart/ScrollDemo.vue'
import ScrollTriggeredDemo from '@/components/quickstart/ScrollTriggeredDemo.vue'
import StateAnimationDemo from '@/components/quickstart/StateAnimationDemo.vue'

const sidebarExpanded = ref(false)
</script>

<template>
  <div class="quickstart-page">
    <div class="quickstart-layout" :class="{ 'quickstart-layout--sidebar-collapsed': !sidebarExpanded }">
      <aside class="chapter-sidebar">
        <p class="sidebar-heading">本页内容</p>
        <nav class="chapter-nav" aria-label="快速开始章节">
          <a href="#animate"><span>01</span>旋转</a>
          <a href="#enter"><span>02</span>进场动画</a>
          <a href="#exit"><span>03</span>离场动画</a>
          <a href="#gestures"><span>04</span>手势交互</a>
          <a href="#while-in-view"><span>05</span>滚动触发</a>
          <a href="#scroll"><span>06</span>滚动联动</a>
          <a href="#layout"><span>07</span>布局动画</a>
        </nav>
        <div class="sidebar-meta"><span class="sidebar-dot" />7 组 CSS / Motion 对照</div>
      </aside>

      <main class="quickstart-main">
        <div class="quickstart-toolbar">
          <button
            class="sidebar-toggle"
            type="button"
            :aria-expanded="sidebarExpanded"
            :aria-label="sidebarExpanded ? '收起左侧目录' : '展开左侧目录'"
            @click="sidebarExpanded = !sidebarExpanded"
          >
            <span aria-hidden="true">{{ sidebarExpanded ? '←' : '☰' }}</span>
            {{ sidebarExpanded ? '收起目录' : '展开目录' }}
          </button>
          <div class="breadcrumbs"><span>Motion for Vue</span><b>/</b><strong>Quickstart</strong></div>
        </div>
        <header class="page-intro">
          <h1>快速开始</h1>
        </header>

        <StateAnimationDemo />
        <EnterAnimationDemo />
        <ExitAnimationDemo />
        <GestureDemo />
        <ScrollTriggeredDemo />
        <ScrollDemo />
        <LayoutDemo />

        <footer class="docs-footer"><span>Motion for Vue · Quickstart</span><a href="https://motion.dev/docs/vue" target="_blank" rel="noreferrer">查看官方文档 ↗</a></footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
.quickstart-page { min-height: calc(100vh - 62px); background: #09090b; color: #ededf0; }
.quickstart-layout { display: grid; width: min(1740px, calc(100% - 56px)); grid-template-columns: 190px minmax(0, 1fr); gap: 48px; margin: 0 auto; padding: 34px 0 60px; transition: grid-template-columns 220ms ease, gap 220ms ease; }
.quickstart-layout--sidebar-collapsed { grid-template-columns: minmax(0, 1fr); gap: 0; }
.quickstart-layout--sidebar-collapsed .chapter-sidebar { display: none; }
.chapter-sidebar { position: sticky; top: 88px; align-self: start; padding-top: 45px; }
.sidebar-heading { margin: 0 0 13px 10px; color: #777781; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.chapter-nav { display: grid; gap: 3px; }
.chapter-nav a { display: flex; min-height: 37px; align-items: center; gap: 11px; padding: 0 10px; border-left: 2px solid transparent; border-radius: 0 7px 7px 0; color: #a0a0aa; font-size: 13px; text-decoration: none; transition: color 140ms ease, background 140ms ease, border-color 140ms ease; }
.chapter-nav a span { color: #696973; font: 10px 'DM Mono', monospace; }
.chapter-nav a:hover { border-left-color: #8978f5; background: #17151f; color: #d8d0ff; }
.sidebar-meta { display: flex; align-items: center; gap: 8px; margin: 21px 10px 0; color: #73737e; font-size: 10px; }
.sidebar-dot { width: 7px; height: 7px; border-radius: 50%; background: #6d5ce7; box-shadow: 0 0 0 3px #ebe8ff; }
.quickstart-main { width: min(100%, 1600px); min-width: 0; justify-self: center; padding: 0; }
.quickstart-toolbar { display: flex; align-items: center; gap: 16px; }
.sidebar-toggle { display: inline-flex; min-height: 30px; align-items: center; gap: 7px; padding: 0 9px; border: 1px solid #292930; border-radius: 7px; background: #111114; color: #a7a7b0; font: inherit; font-size: 11px; cursor: pointer; transition: border-color 140ms ease, color 140ms ease, background 140ms ease; }
.sidebar-toggle:hover { border-color: #514a77; background: #1b1926; color: #d8d0ff; }
.sidebar-toggle > span { color: #b9aaff; font-size: 14px; line-height: 1; }
.breadcrumbs { display: flex; align-items: center; gap: 9px; color: #777781; font-size: 11px; }
.breadcrumbs b { color: #44444c; font-weight: 400; }
.breadcrumbs strong { color: #d7d7dc; font-weight: 600; }
.page-intro { padding: 27px 0 25px; border-bottom: 1px solid #25252b; }
.page-intro h1 { margin: 13px 0 9px; color: #f1f1f3; font-size: clamp(34px, 4vw, 42px); font-weight: 700; letter-spacing: -.05em; }
.docs-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; padding-top: 15px; border-top: 1px solid #25252b; color: #898994; font-size: 11px; }
.docs-footer a { color: #b9aaff; text-decoration: none; white-space: nowrap; }
.docs-footer a:hover { color: #d6ceff; }
@media (max-width: 920px) {
  .quickstart-layout { width: min(100% - 36px, 760px); grid-template-columns: 1fr; gap: 14px; padding-top: 20px; }
  .chapter-sidebar { position: static; padding: 0; }
  .sidebar-heading, .sidebar-meta { display: none; }
  .chapter-nav { display: flex; overflow-x: auto; gap: 5px; padding: 0 0 10px; border-bottom: 1px solid #25252b; scrollbar-width: none; }
  .chapter-nav::-webkit-scrollbar { display: none; }
  .chapter-nav a { flex: 0 0 auto; min-height: 32px; gap: 7px; padding: 0 9px; border: 1px solid #292930; border-radius: 7px; background: #111114; }
  .chapter-nav a:hover { border-color: #514a77; background: #1b1926; }
  .quickstart-layout--sidebar-collapsed .chapter-sidebar { display: none; }
  .quickstart-toolbar { flex-wrap: wrap; gap: 10px; }
}
.quickstart-page :deep(.section-index) { border-color: #303039; background: #121216; color: #9c9ca7; }
.quickstart-page :deep(.section-heading h2) { color: #f0f0f2; }
.quickstart-page :deep(.section-heading p) { color: #a5a5af; }
.quickstart-page :deep(.anchor-link) { color: #777781; }
.quickstart-page :deep(.comparison-card) { border-color: #29292f; background: #101013; box-shadow: 0 10px 28px rgb(0 0 0 / 20%); }
.quickstart-page :deep(.comparison-card--motion) { border-color: #39334f; }
.quickstart-page :deep(.card-heading) { border-bottom-color: #29292f; background: #111114; color: #d1d1d6; }
.quickstart-page :deep(.demo-stage) { background: linear-gradient(180deg, #111114, #0d0d10); }
.quickstart-page :deep(.code-block) { border-top-color: #29292f; background: #0b0b0e; color: #d0d0d7; scrollbar-color: #45454f transparent; }
.quickstart-page :deep(.section-note) { color: #a2a2ad; }
.quickstart-page :deep(.rotate-button),
.quickstart-page :deep(.replay-button),
.quickstart-page :deep(.toggle-button),
.quickstart-page :deep(.layout-button) { border-color: #3a3a44; background: #19191e; color: #d1d1d8; }
.quickstart-page :deep(.rotate-button:hover),
.quickstart-page :deep(.replay-button:hover),
.quickstart-page :deep(.toggle-button:hover),
.quickstart-page :deep(.layout-button:hover) { border-color: #555462; background: #222127; }
.quickstart-page :deep(.rotate-button--motion),
.quickstart-page :deep(.layout-button--motion) { border-color: #51487a; background: #201d2d; color: #d0c7ff; }
.quickstart-page :deep(.gesture-hint),
.quickstart-page :deep(.layout-caption) { color: #a0a0ab; }
.quickstart-page :deep(.reveal-scroll),
.quickstart-page :deep(.scroll-pane) { border-color: #33333c; background: #15151a; scrollbar-color: #555562 transparent; }
.quickstart-page :deep(.scroll-progress) { background: #2b2b33; }
.quickstart-page :deep(.reveal-content > strong),
.quickstart-page :deep(.scroll-content strong) { color: #e7e7ec; }
.quickstart-page :deep(.reveal-content ol),
.quickstart-page :deep(.scroll-content ol) { color: #b6b6c0; }
.quickstart-page :deep(.reveal-content > p),
.quickstart-page :deep(.reveal-demo > small),
.quickstart-page :deep(.scroll-content > span),
.quickstart-page :deep(.scroll-demo > small) { color: #9b9ba7; }
@media (max-width: 600px) {
  .quickstart-layout { width: calc(100% - 28px); padding-top: 16px; }
  .page-intro { padding: 21px 0 20px; }
  .docs-footer { flex-direction: column; }
}
</style>
