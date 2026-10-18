<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'

const motionKey = ref(0)

function replay() {
  motionKey.value += 1
}
</script>

<template>
  <section class="gesture-section" aria-labelledby="gesture-title">
    <div class="section-heading">
      <div>
        <span class="eyebrow">05 · 手势交互</span>
        <h2 id="gesture-title">指针悬停和按压时给出反馈</h2>
        <p>左边用 CSS 的 `:hover` / `:active`；右边由 Motion 识别 hover / press 手势。</p>
      </div>
      <button class="reset-button" type="button" @click="replay">
        <span aria-hidden="true">↺</span> 重播
      </button>
    </div>

    <div class="gesture-grid">
      <article class="gesture-card">
        <div class="panel-topline">
          <div class="method-label"><span class="method-dot method-dot--css" />CSS</div>
          <span class="method-note">:hover / :active</span>
        </div>
        <div class="drag-stage">
          <button class="interaction-card interaction-card--css" type="button">
            <span class="drag-grip" aria-hidden="true">✳</span>
            <span><strong>指向或按住</strong><small>CSS 伪类响应鼠标状态</small></span>
            <span class="drag-arrow" aria-hidden="true">↗</span>
          </button>
          <span class="stage-hint">鼠标悬停，再按下试试</span>
        </div>
        <div class="code-caption"><span>CSS</span><code>:hover</code> 和 <code>:active</code> 分别描述两种状态</div>
      </article>

      <article class="gesture-card gesture-card--motion">
        <div class="panel-topline">
          <div class="method-label"><span class="method-dot method-dot--motion" />Motion for Vue</div>
          <span class="method-note">whileHover / whilePress</span>
        </div>
        <div class="drag-stage">
          <motion.button
            :key="motionKey"
            type="button"
            :while-hover="{ y: -5, scale: 1.035, rotate: -1 }"
            :while-press="{ scale: 0.97, rotate: 0 }"
            :transition="{ type: 'spring', stiffness: 420, damping: 24 }"
            class="interaction-card interaction-card--motion"
          >
            <span class="drag-grip" aria-hidden="true">✳</span>
            <span><strong>指向或按住</strong><small>手势状态交给 Motion 识别</small></span>
            <span class="drag-arrow" aria-hidden="true">↗</span>
          </motion.button>
          <span class="stage-hint">触屏轻点也不会误触发 hover 状态</span>
        </div>
        <div class="code-caption"><span>Vue</span><code>whileHover</code> / <code>whilePress</code> 声明反馈目标</div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.gesture-section { margin-top: 52px; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 18px; }
.eyebrow { color: #858b82; font-size: 10px; font-weight: 760; letter-spacing: 0.13em; }
.section-heading h2 { margin: 8px 0 6px; color: #202722; font-size: clamp(21px, 3vw, 28px); letter-spacing: -0.045em; }
.section-heading p { margin: 0; color: #737a72; font-size: 13px; }
.reset-button { display: inline-flex; align-items: center; gap: 7px; padding: 9px 12px; border: 1px solid #e3e4dc; border-radius: 10px; background: #fffefa; color: #515951; cursor: pointer; font: inherit; font-size: 12px; }
.reset-button span { font-size: 16px; }
.gesture-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.gesture-card { overflow: hidden; border: 1px solid #e7e5dc; border-radius: 19px; background: #fffefa; }
.gesture-card--motion { border-color: #cfded0; box-shadow: 0 10px 30px rgb(71 111 76 / 7%); }
.panel-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px; border-bottom: 1px solid #f0eee7; }
.method-label { display: inline-flex; align-items: center; gap: 8px; color: #343b35; font-size: 12px; font-weight: 690; }
.method-dot { width: 8px; height: 8px; border-radius: 50%; }
.method-dot--css { background: #bc9a71; }
.method-dot--motion { background: #5c9e67; }
.method-note { color: #90958d; font-size: 10px; }
.drag-stage { display: grid; min-height: 154px; place-items: center; padding: 18px; background-image: radial-gradient(#e6e4da 0.8px, transparent 0.8px); background-position: center; background-size: 16px 16px; }
.interaction-card { display: flex; align-items: center; gap: 12px; width: min(280px, 100%); min-height: 66px; padding: 12px 14px; border: 1px solid #e3e8db; border-radius: 14px; background: #fffefa; box-shadow: 0 8px 18px rgb(42 55 39 / 8%); color: inherit; cursor: pointer; font: inherit; text-align: left; }
.interaction-card--css { transition: transform 180ms ease, box-shadow 180ms ease; }
.interaction-card--css:hover { transform: translateY(-5px) scale(1.035) rotate(-1deg); box-shadow: 0 13px 22px rgb(42 55 39 / 12%); }
.interaction-card--css:active { transform: scale(0.97); }
.interaction-card--motion { border-color: #bcd5bc; background: #f6fbf4; }
.drag-grip { color: #829080; font-size: 20px; }
.interaction-card > span:nth-child(2) { display: grid; gap: 4px; flex: 1; }
.interaction-card strong { color: #29332b; font-size: 12px; }
.interaction-card small { color: #747d73; font-size: 10px; }
.drag-arrow { color: #869284; font-size: 17px; }
.stage-hint { margin-top: 10px; color: #878d85; font-size: 10px; }
.code-caption { display: flex; align-items: center; gap: 8px; min-height: 45px; padding: 11px 18px; border-top: 1px solid #f0eee7; color: #727971; font-size: 10px; }
.code-caption > span { padding: 3px 5px; border-radius: 5px; background: #efeee8; color: #777c72; font-size: 9px; font-weight: 740; }
.gesture-card--motion .code-caption > span { background: #e8f2e6; color: #4b8052; }
.code-caption code { padding: 2px 5px; border-radius: 4px; background: #f0f4ed; color: #4f7852; font-size: 10px; }

@media (max-width: 680px) {
  .section-heading { align-items: start; }
  .gesture-grid { grid-template-columns: 1fr; }
}
</style>
