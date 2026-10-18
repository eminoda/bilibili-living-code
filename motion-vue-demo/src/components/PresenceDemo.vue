<script setup lang="ts">
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const isVisible = ref(true)
</script>

<template>
  <section class="lesson" aria-labelledby="presence-title">
    <div class="lesson-heading">
      <span class="lesson-number">02</span>
      <div>
        <span class="eyebrow">组件生命周期 · 进场 / 离场</span>
        <h2 id="presence-title">组件要消失时，先让它演完</h2>
        <p>点“收起提示”。Vue 的 `v-if` 会立刻卸载元素；退出动画需要暂时把它留在 DOM 里。</p>
      </div>
      <button class="lesson-button" type="button" @click="isVisible = !isVisible">
        {{ isVisible ? '收起提示' : '重新显示' }}
      </button>
    </div>

    <div class="comparison-grid">
      <article class="example-panel">
        <div class="panel-label"><span class="method-dot method-dot--css" />CSS</div>
        <div class="notice-stage">
          <Transition name="notice-css">
            <div v-if="isVisible" class="notice-card notice-card--css">
              <span class="notice-icon">✓</span>
              <span><strong>保存成功</strong><small>你的改动已同步</small></span>
              <span class="notice-sparkle">✳</span>
            </div>
          </Transition>
          <div v-if="!isVisible" class="empty-state">提示已移除</div>
        </div>
        <pre><code>&lt;Transition name="notice"&gt;
  &lt;div v-if="isVisible" /&gt;
&lt;/Transition&gt;
.notice-leave-active { transition: opacity .3s; }</code></pre>
      </article>

      <article class="example-panel example-panel--motion">
        <div class="panel-label"><span class="method-dot method-dot--motion" />Motion for Vue</div>
        <div class="notice-stage">
          <AnimatePresence>
            <motion.div
              v-if="isVisible"
              key="saved-notice"
              :initial="{ opacity: 0, y: 12, scale: 0.97 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :exit="{ opacity: 0, y: -10, scale: 0.97 }"
              :transition="{ duration: 0.28, ease: 'easeInOut' }"
              class="notice-card notice-card--motion"
            >
              <span class="notice-icon">✓</span>
              <span><strong>保存成功</strong><small>你的改动已同步</small></span>
              <span class="notice-sparkle">✳</span>
            </motion.div>
          </AnimatePresence>
          <div v-if="!isVisible" class="empty-state">提示已移除</div>
        </div>
        <pre><code>&lt;AnimatePresence&gt;
  &lt;motion.div v-if="isVisible" :exit="{ opacity: 0, y: -10 }" /&gt;
&lt;/AnimatePresence&gt;</code></pre>
      </article>
    </div>
    <p class="lesson-note"><strong>感受：</strong>CSS 动画负责进出场，Vue `Transition` 负责等离场结束再卸载；Motion 把进场、离场目标统一写在 `initial`、`animate`、`exit` 上。</p>
  </section>
</template>

<style scoped>
.lesson { margin: 0 0 46px; }
.lesson-heading { display: flex; align-items: start; gap: 14px; margin-bottom: 16px; }
.lesson-heading > div { flex: 1; }
.lesson-number { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; border: 1px solid #dbe3d4; border-radius: 10px; color: #688660; font-size: 11px; font-weight: 740; }
.eyebrow { color: #858b82; font-size: 9px; font-weight: 760; letter-spacing: 0.13em; }
.lesson-heading h2 { margin: 6px 0 4px; color: #202722; font-size: clamp(19px, 2.5vw, 25px); letter-spacing: -0.045em; }
.lesson-heading p { margin: 0; color: #747b72; font-size: 12px; }
.lesson-button { flex: 0 0 auto; margin-top: 15px; padding: 8px 12px; border: 1px solid #d9e3d4; border-radius: 9px; background: #edf4e9; color: #48684a; cursor: pointer; font: inherit; font-size: 10px; font-weight: 650; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.example-panel { overflow: hidden; border: 1px solid #e7e5dc; border-radius: 16px; background: #fffefa; }
.example-panel--motion { border-color: #cfded0; box-shadow: 0 8px 24px rgb(71 111 76 / 6%); }
.panel-label { display: flex; align-items: center; gap: 8px; padding: 13px 16px; border-bottom: 1px solid #f0eee7; color: #343b35; font-size: 11px; font-weight: 680; }
.method-dot { width: 8px; height: 8px; border-radius: 50%; }
.method-dot--css { background: #bc9a71; }
.method-dot--motion { background: #5c9e67; }
.notice-stage { display: grid; min-height: 128px; place-items: center; padding: 18px; }
.notice-card { display: flex; width: min(300px, 100%); align-items: center; gap: 11px; padding: 13px; border: 1px solid #e1e8dc; border-radius: 13px; background: #f8fbf5; box-shadow: 0 7px 18px rgb(47 65 43 / 7%); }
.notice-css-enter-active, .notice-css-leave-active { transition: transform 300ms ease, opacity 300ms ease; }
.notice-css-enter-from, .notice-css-leave-to { opacity: 0; transform: translateY(10px) scale(0.98); }
.notice-card--motion { border-color: #cfe0cc; }
.notice-icon { display: grid; width: 28px; height: 28px; flex: 0 0 auto; place-items: center; border-radius: 9px; background: #e3f0df; color: #558257; font-size: 14px; font-weight: 750; }
.notice-card > span:nth-child(2) { display: grid; gap: 4px; flex: 1; }
.notice-card strong { color: #354536; font-size: 11px; }
.notice-card small { color: #788377; font-size: 9px; }
.notice-sparkle { color: #95aa86; font-size: 16px; }
.empty-state { color: #a0a49b; font-size: 10px; }
.example-panel pre { overflow-x: auto; margin: 0; padding: 12px 16px 14px; border-top: 1px solid #f0eee7; background: #faf9f5; color: #485048; font-family: 'DM Mono', Consolas, monospace; font-size: 9px; line-height: 1.7; }
.lesson-note { margin: 11px 0 0 46px; color: #687164; font-size: 10px; line-height: 1.6; }
.lesson-note strong { color: #456a48; }

@media (max-width: 650px) {
  .comparison-grid { grid-template-columns: 1fr; }
  .lesson-heading { flex-wrap: wrap; }
  .lesson-heading > div { min-width: calc(100% - 46px); }
  .lesson-button { margin: 0 0 0 46px; }
  .lesson-note { margin-left: 0; }
}
</style>
