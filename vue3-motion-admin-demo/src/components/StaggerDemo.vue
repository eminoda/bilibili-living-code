<script setup lang="ts">
import { ref } from 'vue'
import { motion, stagger } from 'motion-v'

const replayId = ref(0)
const tasks = ['建立页面骨架', '接入交互状态', '检查移动端布局', '整理组件边界']
const containerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { delayChildren: stagger(0.1) } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 28 } },
}

function replay() {
  replayId.value += 1
}
</script>

<template>
  <section class="lesson" aria-labelledby="stagger-title">
    <div class="lesson-heading">
      <span class="lesson-number">03</span>
      <div>
        <span class="eyebrow">动画编排 · 交错播放</span>
        <h2 id="stagger-title">让一组元素依次登场</h2>
        <p>点击重播。不是一起出现，而是像多米诺一样，一个接一个。</p>
      </div>
      <button class="replay-button" type="button" @click="replay"><span aria-hidden="true">↻</span> 重播动画</button>
    </div>

    <div class="comparison-grid">
      <article class="example-panel">
        <div class="panel-label"><span class="method-dot method-dot--css" />CSS</div>
        <ul :key="`css-${replayId}`" class="stagger-list">
          <li v-for="(task, index) in tasks" :key="task" class="stagger-item stagger-item--css">
            <span class="task-check">{{ String(index + 1).padStart(2, '0') }}</span><span>{{ task }}</span><span class="task-arrow">↗</span>
          </li>
        </ul>
        <pre><code>/* 按 DOM 顺序逐项设置延迟 */
.item:nth-child(2) { animation-delay: 100ms; }
.item:nth-child(3) { animation-delay: 200ms; }</code></pre>
      </article>

      <article class="example-panel example-panel--motion">
        <div class="panel-label"><span class="method-dot method-dot--motion" />Motion for Vue</div>
        <motion.ul
          :key="`motion-${replayId}`"
          class="stagger-list"
          :variants="containerVariants"
          initial="hidden"
          animate="visible"
        >
          <motion.li v-for="(task, index) in tasks" :key="task" class="stagger-item" :custom="index" :variants="itemVariants">
            <span class="task-check">{{ String(index + 1).padStart(2, '0') }}</span><span>{{ task }}</span><span class="task-arrow">↗</span>
          </motion.li>
        </motion.ul>
        <pre><code>// 父级统一错开子项
transition: { delayChildren: stagger(0.1) }</code></pre>
      </article>
    </div>
    <p class="lesson-note"><strong>感受：</strong>CSS 也能错开播放，但要按 DOM 顺序维护多条延迟规则；Motion 可由父级通过 `stagger()` 统一安排节奏。</p>
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
.replay-button { display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; padding: 8px 11px; border: 1px solid #e4e3dc; border-radius: 9px; background: #fffefa; color: #596158; cursor: pointer; font: inherit; font-size: 10px; }
.replay-button span { color: #638761; font-size: 15px; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.example-panel { overflow: hidden; border: 1px solid #e7e5dc; border-radius: 16px; background: #fffefa; }
.example-panel--motion { border-color: #cfded0; box-shadow: 0 8px 24px rgb(71 111 76 / 6%); }
.panel-label { display: flex; align-items: center; gap: 8px; padding: 13px 16px; border-bottom: 1px solid #f0eee7; color: #343b35; font-size: 11px; font-weight: 680; }
.method-dot { width: 8px; height: 8px; border-radius: 50%; }
.method-dot--css { background: #bc9a71; }
.method-dot--motion { background: #5c9e67; }
.stagger-list { display: grid; gap: 7px; min-height: 200px; margin: 0; padding: 16px; list-style: none; }
.stagger-item { display: flex; align-items: center; gap: 10px; min-height: 35px; padding: 7px 9px; border: 1px solid #eeece5; border-radius: 9px; background: #fbfaf6; color: #454e46; font-size: 10px; }
.stagger-item--css { animation: item-enter 400ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.stagger-item--css:nth-child(2) { animation-delay: 100ms; }
.stagger-item--css:nth-child(3) { animation-delay: 200ms; }
.stagger-item--css:nth-child(4) { animation-delay: 300ms; }
.task-check { display: grid; width: 22px; height: 22px; place-items: center; border-radius: 7px; background: #edf2e8; color: #698164; font-size: 8px; font-weight: 750; }
.stagger-item > span:nth-child(2) { flex: 1; }
.task-arrow { color: #92988f; font-size: 12px; }
.example-panel pre { overflow-x: auto; margin: 0; padding: 12px 16px 14px; border-top: 1px solid #f0eee7; background: #faf9f5; color: #485048; font-family: 'DM Mono', Consolas, monospace; font-size: 9px; line-height: 1.7; }
.lesson-note { margin: 11px 0 0 46px; color: #687164; font-size: 10px; line-height: 1.6; }
.lesson-note strong { color: #456a48; }
@keyframes item-enter { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 650px) {
  .comparison-grid { grid-template-columns: 1fr; }
  .lesson-heading { flex-wrap: wrap; }
  .lesson-heading > div { min-width: calc(100% - 46px); }
  .lesson-note { margin-left: 0; }
}
</style>
