<script setup lang="ts">
import { computed, shallowRef } from 'vue'

import BasicStateDemo from '@/components/BasicStateDemo.vue'
import CssListPanel from '@/components/CssListPanel.vue'
import GestureComparison from '@/components/GestureComparison.vue'
import MotionListPanel from '@/components/MotionListPanel.vue'
import PresenceDemo from '@/components/PresenceDemo.vue'
import ScrollLinkedDemo from '@/components/ScrollLinkedDemo.vue'
import StaggerDemo from '@/components/StaggerDemo.vue'
import type { DemoItem, ListAction } from '@/types'

const initialItems: DemoItem[] = [
  { id: 1, title: '梳理用户反馈', description: '产品体验 · 3 条待跟进', color: 'lilac' },
  { id: 2, title: '更新设计稿', description: '工作台改版 · 今天 15:00', color: 'blue' },
  { id: 3, title: '准备周会材料', description: '团队协作 · 还有 2 天', color: 'peach' },
  { id: 4, title: '检查接口联调', description: '开发任务 · 进行中', color: 'mint' },
  { id: 5, title: '整理迭代计划', description: '版本发布 · 5 个事项', color: 'yellow' },
]

const items = shallowRef<DemoItem[]>([...initialItems])
const actionLabel = shallowRef('等待操作')
const itemCount = computed(() => `${String(items.value.length).padStart(2, '0')} 个任务`)

function runAction(action: ListAction) {
  if (action === 'shuffle') {
    const next = [...items.value]
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[next[index], next[swapIndex]] = [next[swapIndex]!, next[index]!]
    }
    if (next.every((item, index) => item.id === items.value[index]?.id)) {
      next.push(next.shift()!)
    }
    items.value = next
    actionLabel.value = '随机重排'
  } else if (action === 'reverse') {
    items.value = [...items.value].reverse()
    actionLabel.value = '反转顺序'
  } else {
    items.value = [...initialItems]
    actionLabel.value = '恢复初始顺序'
  }

}

const cssSnippet = `.task-card { transition: transform 560ms ease; }
/* CSS transition 不会自动得知重排前后的位置 */`

const motionSnippet = `<motion.li
  v-for="item in items"
  :key="item.id"
  layout
/>`
</script>

<template>
  <div class="legacy-page">
  <main class="page-shell">
    <header class="site-header">
      <a class="brand" href="#top" aria-label="动画对照实验室首页">
        <span class="brand-mark"><span /><span /><span /></span>
        <span>motion<span class="brand-light">/</span>lab</span>
      </a>
      <div class="header-meta"><span class="live-dot" />交互式演示 <span class="meta-divider">/</span> Vue 3</div>
    </header>

    <section id="top" class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="eyebrow-line" />MOTION FOR VUE · 交互示例</span>
        <h1>从简单到复杂，<br /><span>动画可以这样学。</span></h1>
        <p>六个能亲手操作的例子。从状态切换开始，逐步走到进出场、动画编排、布局、手势和滚动联动。</p>
      </div>
      <div class="hero-stamp" aria-hidden="true">
        <span>01—06</span>
        <span>从简单开始<br />逐步深入</span>
      </div>
    </section>

    <BasicStateDemo />
    <PresenceDemo />
    <StaggerDemo />

    <section class="list-section" aria-labelledby="layout-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow">04 · 布局动画</span>
          <h2 id="layout-title">重排任务列表</h2>
          <p>列表换了顺序，卡片怎么知道自己该从哪里滑到哪里？</p>
        </div>
        <div class="list-actions">
          <span class="item-count">{{ itemCount }}</span>
          <button class="action-button" type="button" @click="runAction('shuffle')">
            <span aria-hidden="true">⤨</span> 随机重排
          </button>
          <button class="action-button action-button--quiet" type="button" @click="runAction('reverse')">反转</button>
          <button class="icon-button" type="button" aria-label="恢复初始顺序" title="恢复初始顺序" @click="runAction('reset')">↺</button>
        </div>
      </div>

      <div class="comparison-grid">
        <article class="comparison-panel">
          <div class="panel-topline">
            <div class="method-label"><span class="method-dot method-dot--css" />CSS</div>
            <span class="method-note">顺序更新 · 位置直接跳变</span>
          </div>
          <div class="panel-body">
            <CssListPanel :items="items" />
          </div>
          <div class="panel-code">
            <div class="code-title"><span>CSS 能力边界</span><span>无法插值列表布局位置</span></div>
            <pre><code>{{ cssSnippet }}</code></pre>
          </div>
        </article>

        <article class="comparison-panel comparison-panel--motion">
          <div class="panel-topline">
            <div class="method-label"><span class="method-dot method-dot--motion" />Motion for Vue</div>
            <span class="method-note">layout · 自动补间</span>
          </div>
          <div class="panel-body">
            <MotionListPanel :items="items" />
          </div>
          <div class="panel-code">
            <div class="code-title"><span>核心写法</span><span>声明布局动画</span></div>
            <pre><code>{{ motionSnippet }}</code></pre>
          </div>
        </article>
      </div>

      <div class="takeaway">
        <span class="takeaway-mark">↳</span>
        <p><strong>看这里：</strong>CSS 能画卡片，也能过渡可插值的属性；但单靠 `transition` 不知道列表重排前后每张卡片的位置。Motion 的 <code>layout</code> 会测量并补间这些位置。</p>
        <span class="action-status">最近操作：{{ actionLabel }}</span>
      </div>
    </section>

    <GestureComparison />
    <ScrollLinkedDemo />

    <footer class="page-footer">
      <span>一个从状态动画走到滚动联动的 Motion for Vue 迷你实验室</span>
      <span>01 <span class="footer-arrow">→</span> 06</span>
    </footer>
  </main>
  </div>
</template>

<style scoped>
.page-shell { width: min(1120px, calc(100% - 56px)); margin: 0 auto; }
.site-header { display: flex; align-items: center; justify-content: space-between; height: 72px; border-bottom: 1px solid #e7e5dc; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: #222a25; font-size: 14px; font-weight: 780; letter-spacing: -0.04em; text-decoration: none; }
.brand-mark { display: flex; align-items: end; gap: 3px; height: 20px; padding: 4px; border-radius: 7px; background: #293d2d; }
.brand-mark span { width: 3px; border-radius: 5px; background: #d8f1c5; }
.brand-mark span:nth-child(1) { height: 6px; }
.brand-mark span:nth-child(2) { height: 11px; }
.brand-mark span:nth-child(3) { height: 8px; }
.brand-light { color: #8b958b; font-weight: 450; }
.header-meta { display: flex; align-items: center; gap: 8px; color: #777e76; font-size: 11px; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #72ad73; box-shadow: 0 0 0 3px #e3eee0; }
.meta-divider { color: #c3c5bc; }
.hero { display: flex; align-items: center; justify-content: space-between; min-height: 278px; padding: 38px 0 34px; }
.eyebrow { display: inline-flex; align-items: center; gap: 9px; color: #80877e; font-size: 9px; font-weight: 760; letter-spacing: 0.16em; }
.eyebrow-line { display: inline-block; width: 20px; height: 1px; background: #84a47e; }
.hero h1 { margin: 15px 0 11px; color: #202722; font-size: clamp(42px, 6vw, 64px); font-weight: 720; letter-spacing: -0.07em; line-height: 1.04; }
.hero h1 span { color: #75936f; }
.hero-copy p { max-width: 540px; margin: 0; color: #747b72; font-size: 13px; line-height: 1.8; }
.hero-stamp { display: grid; width: 118px; height: 118px; align-content: center; justify-items: center; gap: 5px; margin-right: 6%; border: 1px solid #d9dfd2; border-radius: 50%; color: #89967f; transform: rotate(9deg); }
.hero-stamp span:first-child { font-size: 20px; font-weight: 450; letter-spacing: -0.07em; }
.hero-stamp span:last-child { font-size: 7px; font-weight: 740; letter-spacing: 0.1em; line-height: 1.5; text-align: center; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
.section-heading h2 { margin: 8px 0 5px; color: #202722; font-size: clamp(22px, 3vw, 29px); letter-spacing: -0.05em; }
.section-heading p { margin: 0; color: #747b72; font-size: 12px; }
.list-actions { display: flex; align-items: center; gap: 7px; }
.item-count { margin-right: 5px; color: #858b82; font-size: 10px; white-space: nowrap; }
.action-button, .icon-button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 34px; padding: 0 11px; border: 1px solid #d9e3d4; border-radius: 9px; background: #edf4e9; color: #48684a; cursor: pointer; font: inherit; font-size: 10px; font-weight: 650; transition: background 160ms ease, border-color 160ms ease; }
.action-button:hover, .icon-button:hover { border-color: #b8cbb2; background: #e2efdc; }
.action-button > span { font-size: 16px; }
.action-button--quiet, .icon-button { border-color: #e4e3dc; background: #fffefa; color: #616960; }
.icon-button { width: 34px; padding: 0; font-size: 16px; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.comparison-panel { overflow: hidden; border: 1px solid #e7e5dc; border-radius: 19px; background: #fffefa; }
.comparison-panel--motion { border-color: #cfded0; box-shadow: 0 10px 30px rgb(71 111 76 / 7%); }
.panel-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 15px 18px; border-bottom: 1px solid #f0eee7; }
.method-label { display: inline-flex; align-items: center; gap: 8px; color: #343b35; font-size: 11px; font-weight: 690; }
.method-dot { width: 8px; height: 8px; border-radius: 50%; }
.method-dot--css { background: #bc9a71; }
.method-dot--motion { background: #5c9e67; }
.method-note { color: #90958d; font-size: 9px; }
.panel-body { min-height: 388px; padding: 18px; }
.panel-code { border-top: 1px solid #eeece5; background: #faf9f5; }
.code-title { display: flex; justify-content: space-between; padding: 12px 17px 0; color: #8c9189; font-size: 9px; }
.code-title span:first-child { color: #4d564d; font-weight: 690; }
.panel-code pre { overflow-x: auto; margin: 0; padding: 10px 17px 17px; color: #39413b; font-family: 'DM Mono', 'Cascadia Code', Consolas, monospace; font-size: 10px; line-height: 1.75; tab-size: 2; }
.takeaway { display: flex; align-items: center; gap: 12px; min-height: 58px; margin-top: 12px; padding: 11px 15px; border: 1px solid #e4e9dd; border-radius: 12px; background: #f4f7ef; }
.takeaway-mark { color: #6f966c; font-size: 19px; }
.takeaway p { flex: 1; margin: 0; color: #626b60; font-size: 10px; line-height: 1.65; }
.takeaway p strong { color: #3f6342; }
.takeaway code { padding: 2px 4px; border-radius: 4px; background: #e5edde; color: #4f7852; font-size: 10px; }
.action-status { color: #899087; font-size: 9px; white-space: nowrap; }
.page-footer { display: flex; justify-content: space-between; margin: 42px 0 28px; padding-top: 15px; border-top: 1px solid #e7e5dc; color: #8a9087; font-size: 10px; }
.footer-arrow { padding: 0 4px; color: #70936e; }

@media (max-width: 760px) {
  .page-shell { width: min(100% - 32px, 560px); }
  .hero { min-height: 235px; }
  .hero-stamp { width: 88px; height: 88px; margin-right: 0; }
  .hero-stamp span:first-child { font-size: 25px; }
  .comparison-grid { grid-template-columns: 1fr; }
  .panel-body { min-height: unset; }
  .takeaway { align-items: start; flex-wrap: wrap; }
  .action-status { width: 100%; padding-left: 30px; }
}

@media (max-width: 520px) {
  .page-shell { width: calc(100% - 28px); }
  .site-header { height: 60px; }
  .hero { min-height: 220px; padding: 34px 0; }
  .hero h1 { font-size: 44px; }
  .hero-stamp { display: none; }
  .section-heading { align-items: start; flex-direction: column; }
  .list-actions { width: 100%; }
  .item-count { margin-right: auto; }
  .action-button { padding: 0 8px; }
  .panel-topline { padding: 13px 14px; }
  .panel-body { padding: 14px; }
  .takeaway { gap: 8px; padding: 10px; }
  .page-footer { gap: 10px; font-size: 9px; }
}
</style>
