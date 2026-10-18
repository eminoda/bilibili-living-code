<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { motion, useScroll } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const motionScroller = useTemplateRef<HTMLDivElement>('motionScroller')
const { scrollYProgress } = useScroll({ container: motionScroller })
const lines = [
  '01  页面滚动到这里',
  '02  进度值从 0 逐渐变化到 1',
  '03  进度条宽度同步增长',
  '04  继续向下滚动，观察数值变化',
  '05  向上滚动，进度也会反向变化',
  '06  不需要定时轮询 scroll 事件',
  '07  useScroll 返回 MotionValue',
  '08  可把进度映射到透明度或位移',
  '09  也可以组合 useTransform',
  '10  用 useSpring 让数值更柔和',
  '11  试试快速滚动和缓慢滚动',
  '12  滚动位置就是动画进度',
]
const cssCode = `.progress {
  animation: grow auto linear both;
  animation-timeline: --pane-progress;
}
.scroll-pane {
  scroll-timeline: --pane-progress block;
}
@keyframes grow {
  to { transform: scaleX(1); }
}`
const motionCode = `<script setup>
const { scrollYProgress } = useScroll({ container })
<\/script>

<template>
  <motion.div :style="{ scaleX: scrollYProgress }" />
</template>`
</script>

<template>
  <ComparisonSection id="scroll" index="06" title="滚动联动动画" description="在左右两个小区域里滚动。进度条直接跟随滚动位置，而不是进入视口时只播放一次。" :css-code="cssCode" :motion-code="motionCode">
    <template #css>
      <div class="scroll-demo">
        <div class="scroll-pane">
          <div class="scroll-progress"><div class="scroll-progress__bar scroll-progress__bar--css" /></div>
          <div class="scroll-content"><span>滚动进度</span><strong>CSS 滚动时间线</strong><ol><li v-for="line in lines" :key="line">{{ line }}</li></ol></div>
        </div>
        <small>CSS animation-timeline 属性</small>
      </div>
    </template>
    <template #motion>
      <div class="scroll-demo">
        <div ref="motionScroller" class="scroll-pane">
          <div class="scroll-progress"><motion.div class="scroll-progress__bar scroll-progress__bar--motion" :style="{ scaleX: scrollYProgress }" /></div>
          <div class="scroll-content"><span>滚动进度</span><strong>useScroll 返回 MotionValue</strong><ol><li v-for="line in lines" :key="line">{{ line }}</li></ol></div>
        </div>
        <small>Vue 模板引用 + useScroll()</small>
      </div>
    </template>
    <template #note>CSS 用浏览器原生的 Scroll-Driven Animations（滚动驱动动画）；Motion 用 useScroll 生成 MotionValue，还可以继续组合 useTransform、useSpring。</template>
  </ComparisonSection>
</template>

<style scoped>
.scroll-demo { display: grid; width: min(100%, 440px); gap: 14px; }
.scroll-pane { position: relative; height: 340px; overflow-y: auto; scroll-timeline: --pane-progress block; border: 1px solid #dce3ed; border-radius: 12px; background: #f4f7fb; scrollbar-color: #aab5c5 transparent; scrollbar-width: thin; }
.scroll-progress { position: sticky; z-index: 1; top: 0; height: 8px; overflow: hidden; background: #e2e8f0; }
.scroll-progress__bar { width: 100%; height: 100%; transform: scaleX(0); transform-origin: left center; }
.scroll-progress__bar--css { background: #8b5cf6; animation: scroll-grow auto linear both; animation-timeline: --pane-progress; }
.scroll-progress__bar--motion { background: #8b5cf6; box-shadow: 0 0 12px rgb(139 92 246 / 48%); }
.scroll-content { display: grid; gap: 14px; padding: 22px; }
.scroll-content > span { color: #78869a; font: 14px 'DM Mono', monospace; letter-spacing: .12em; }
.scroll-content strong { color: #26364a; font-size: 19px; font-weight: 650; }
.scroll-content ol { display: grid; gap: 13px; margin: 0; padding-left: 24px; color: #58687d; font-size: 15px; line-height: 1.6; }
.scroll-demo > small { color: #78869a; font-size: 13px; text-align: center; }
@keyframes scroll-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
</style>
