<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { motion, useScroll } from 'motion-v'

const motionScroller = useTemplateRef<HTMLDivElement>('motionScroller')
const { scrollYProgress } = useScroll({ container: motionScroller })

const sampleLines = [
  '01  页面滚动到这里',
  '02  进度值从 0 逐渐变化到 1',
  '03  进度条宽度同步增长',
  '04  再往下滚动，进度继续增加',
  '05  滚到底部时，进度到达 1',
  '06  向上滚动，进度也会反向变化',
  '07  不需要定时轮询 scroll 事件',
  '08  useScroll 返回 MotionValue',
  '09  可将进度映射到透明度或位移',
  '10  也可以组合 useTransform',
  '11  用 useSpring 平滑数值变化',
  '12  快速滚动也会保持同步',
]
</script>

<template>
  <section class="lesson" aria-labelledby="scroll-title">
    <div class="lesson-heading">
      <span class="lesson-number">06</span>
      <div>
        <span class="eyebrow">滚动 · 联动数值</span>
        <h2 id="scroll-title">让动画跟着滚动走</h2>
        <p>在左右两个小区域里滚动。进度条跟随滚动位置，不是“滚到某处再播放一次”。</p>
      </div>
    </div>

    <div class="comparison-grid">
      <article class="example-panel">
        <div class="panel-label"><span class="method-dot method-dot--css" />CSS Scroll-Driven Animations</div>
        <div class="scroll-pane">
          <div class="progress-track"><div class="progress-fill progress-fill--css" /></div>
          <div class="scroll-content">
            <span class="scroll-overline">滚动进度</span>
            <strong>CSS 时间线直接跟随滚动</strong>
            <p>浏览器把滚动位置映射为动画进度，不用写 scroll 事件处理器。</p>
            <ol><li v-for="line in sampleLines" :key="line">{{ line }}</li></ol>
          </div>
        </div>
        <pre><code>.progress-fill {
  animation: grow linear both;
  animation-timeline: scroll();
}</code></pre>
      </article>

      <article class="example-panel example-panel--motion">
        <div class="panel-label"><span class="method-dot method-dot--motion" />Motion for Vue</div>
        <div ref="motionScroller" class="scroll-pane">
          <div class="progress-track"><motion.div class="progress-fill progress-fill--motion" :style="{ scaleX: scrollYProgress }" /></div>
          <div class="scroll-content">
            <span class="scroll-overline">滚动进度</span>
            <strong>`useScroll` 直接给出进度值</strong>
            <p>scrollYProgress 是 MotionValue，可直接绑定到 scaleX，不用把每帧变化塞进 Vue 状态。</p>
            <ol><li v-for="line in sampleLines" :key="line">{{ line }}</li></ol>
          </div>
        </div>
        <pre><code>const { scrollYProgress } = useScroll({ container })
&lt;motion.div :style="{ scaleX: scrollYProgress }" /&gt;</code></pre>
      </article>
    </div>
    <p class="lesson-note"><strong>感受：</strong>“滚动触发”是进入视口时播放一次；这个例子是“滚动联动”，你来回滚，进度条也跟着来回走。</p>
  </section>
</template>

<style scoped>
.lesson { margin: 0 0 46px; }
.lesson-heading { display: flex; align-items: start; gap: 14px; margin-bottom: 16px; }
.lesson-number { display: grid; width: 32px; height: 32px; flex: 0 0 auto; place-items: center; border: 1px solid #dbe3d4; border-radius: 10px; color: #688660; font-size: 11px; font-weight: 740; }
.eyebrow { color: #858b82; font-size: 9px; font-weight: 760; letter-spacing: 0.13em; }
.lesson-heading h2 { margin: 6px 0 4px; color: #202722; font-size: clamp(19px, 2.5vw, 25px); letter-spacing: -0.045em; }
.lesson-heading p { margin: 0; color: #747b72; font-size: 12px; }
.comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.example-panel { overflow: hidden; border: 1px solid #e7e5dc; border-radius: 16px; background: #fffefa; }
.example-panel--motion { border-color: #cfded0; box-shadow: 0 8px 24px rgb(71 111 76 / 6%); }
.panel-label { display: flex; align-items: center; gap: 8px; padding: 13px 16px; border-bottom: 1px solid #f0eee7; color: #343b35; font-size: 11px; font-weight: 680; }
.method-dot { width: 8px; height: 8px; border-radius: 50%; }
.method-dot--css { background: #bc9a71; }
.method-dot--motion { background: #5c9e67; }
.scroll-pane { height: 196px; overflow-y: auto; overscroll-behavior: contain; scrollbar-color: #d9ddd3 transparent; scrollbar-width: thin; }
.progress-track { position: sticky; z-index: 1; top: 0; height: 5px; overflow: hidden; background: #eeefe8; }
.progress-fill { width: 100%; height: 100%; transform: scaleX(0); transform-origin: left center; }
.progress-fill--css { background: #a78bfa; animation: progress-grow linear both; animation-timeline: scroll(); }
.progress-fill--motion { background: #a78bfa; box-shadow: 0 0 12px rgb(167 139 250 / 65%); }
.scroll-content { padding: 17px 18px 22px; }
.scroll-overline { display: block; margin-bottom: 8px; color: #969b91; font-size: 8px; font-weight: 750; letter-spacing: 0.14em; }
.scroll-content strong { color: #384238; font-size: 11px; }
.scroll-content p { margin: 6px 0 11px; color: #788076; font-size: 9px; line-height: 1.6; }
.scroll-content ol { display: grid; gap: 9px; margin: 0; padding-left: 20px; color: #606a5f; font-size: 10px; }
@keyframes progress-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.example-panel pre { overflow-x: auto; margin: 0; padding: 12px 16px 14px; border-top: 1px solid #f0eee7; background: #faf9f5; color: #485048; font-family: 'DM Mono', Consolas, monospace; font-size: 9px; line-height: 1.7; }
.lesson-note { margin: 11px 0 0 46px; color: #687164; font-size: 10px; line-height: 1.6; }
.lesson-note strong { color: #456a48; }

@media (max-width: 650px) {
  .comparison-grid { grid-template-columns: 1fr; }
  .lesson-note { margin-left: 0; }
}
</style>
