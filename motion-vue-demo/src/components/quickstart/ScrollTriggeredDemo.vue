<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { motion } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const motionScroller = useTemplateRef<HTMLDivElement>('motionScroller')
const cssScroller = useTemplateRef<HTMLDivElement>('cssScroller')
const cssSquare = useTemplateRef<HTMLDivElement>('cssSquare')
const cssIsVisible = shallowRef(false)
const motionRoot = computed(() => motionScroller.value ?? undefined)
let cssObserver: IntersectionObserver | undefined

onMounted(() => {
  if (CSS.supports('animation-timeline: view()')) return

  const root = cssScroller.value
  const target = cssSquare.value
  if (!root || !target) return

  cssObserver = new IntersectionObserver(([entry]) => {
    cssIsVisible.value = entry.isIntersecting
  }, { root, threshold: 0.25 })
  cssObserver.observe(target)
})

onBeforeUnmount(() => cssObserver?.disconnect())
const scrollSteps = [
  '滚动发生在这个小面板内',
  '目标方块在更下方，初始时不可见',
  '继续滚动，让方块逐渐进入面板',
  '进入视口时，方块弹出放大并变色',
  '滚动距离控制动画播放进度',
  'CSS 使用浏览器的 view() timeline',
  'Motion 使用 whileInView 监听进入',
  '滚回顶部，方块恢复初始状态',
  '再向下滚动一次，观察动画重播',
]

const cssCode = `.scroll-container { height: 340px; overflow-y: auto; }
.box {
  background: rgb(34 197 94);
  opacity: 0;
  transform: scale(.45) rotate(-14deg);
  animation: enter-view auto linear both;
  animation-timeline: view(block);
  animation-range: entry 0% entry 80%;
}
@keyframes enter-view {
  to { background: rgb(244 63 94); opacity: 1; transform: scale(1) rotate(0); }
}`
const motionCode = `<script setup>
const scrollContainer = useTemplateRef('scrollContainer')
<\/script>

<motion.div
  :inViewOptions="{ root: scrollContainer }"
  :initial="{ backgroundColor: 'rgb(34, 197, 94)', opacity: 0, scale: 0.45, rotate: -14 }"
  :whileInView="{ backgroundColor: 'rgb(244, 63, 94)', opacity: 1, scale: 1, rotate: 0 }"
  :transition="{ type: 'spring', stiffness: 180, damping: 18 }"
/>

<style>
.scroll-container { height: 340px; overflow-y: auto; }
</style>`
</script>

<template>
  <ComparisonSection id="while-in-view" index="05" title="滚动触发动画" description="在左右两侧各自滚动面板。小型倾斜绿方块进入视口后，会弹出放大、回正并变成玫红色。" :css-code="cssCode" :motion-code="motionCode">
    <template #css>
      <div class="reveal-demo">
        <div ref="cssScroller" class="reveal-scroll reveal-scroll--css">
          <div class="reveal-content">
            <strong>向下滚动，让小方块进入面板</strong>
            <ol><li v-for="step in scrollSteps" :key="step">{{ step }}</li></ol>
            <div ref="cssSquare" class="color-square color-square--css" :class="{ 'is-visible': cssIsVisible }" />
            <p>方块进入视口后会变色</p>
          </div>
        </div>
        <small>CSS view() timeline</small>
      </div>
    </template>
    <template #motion>
      <div class="reveal-demo">
        <div ref="motionScroller" class="reveal-scroll">
          <div class="reveal-content">
            <strong>向下滚动，让小方块进入面板</strong>
            <ol><li v-for="step in scrollSteps" :key="step">{{ step }}</li></ol>
            <motion.div class="color-square" :initial="{ backgroundColor: 'rgb(34, 197, 94)', opacity: 0, scale: 0.45, rotate: -14 }" :whileInView="{ backgroundColor: 'rgb(244, 63, 94)', opacity: 1, scale: 1, rotate: 0 }" :transition="{ type: 'spring', stiffness: 180, damping: 18 }" :inViewOptions="{ root: motionRoot }" />
            <p>方块进入视口后会变色</p>
          </div>
        </div>
        <small>Motion whileInView + root</small>
      </div>
    </template>
    <template #note>左侧 CSS 用 view() 时间线驱动进入过程（浏览器不支持时用 IntersectionObserver 降级）；右侧 Motion 用 whileInView 配合 spring，在进入视口时触发。</template>
  </ComparisonSection>
</template>

<style scoped>
.reveal-demo { display: grid; justify-items: center; gap: 15px; width: min(100%, 440px); }
.reveal-scroll { width: 100%; height: 340px; overflow-y: auto; border: 1px solid #dce3ed; border-radius: 12px; background: #f4f7fb; scrollbar-color: #aab5c5 transparent; scrollbar-width: thin; }
.reveal-content { display: grid; justify-items: center; padding: 20px 24px 26px; }
.reveal-content > strong { color: #344256; font-size: 17px; font-weight: 650; }
.reveal-content ol { display: grid; align-self: stretch; gap: 12px; margin: 16px 0 0; padding-left: 24px; color: #667589; font-size: 15px; line-height: 1.65; }
.color-square { width: 132px; height: 132px; margin: 58px auto 18px; border-radius: 14px; background: rgb(34 197 94); box-shadow: 0 0 30px rgb(34 197 94 / 24%); opacity: 0; transform: scale(.45) rotate(-14deg); }
.color-square--css { animation: enter-view auto linear both; animation-timeline: view(block); animation-range: entry 0% entry 80%; }
.reveal-content > p { margin: 0; color: #68778b; font-size: 14px; }
.reveal-demo > small { color: #78869a; font-size: 13px; }
@keyframes enter-view { to { background: rgb(244 63 94); box-shadow: 0 0 34px rgb(244 63 94 / 36%); opacity: 1; transform: scale(1) rotate(0); } }
@supports not (animation-timeline: view()) {
  .color-square--css { animation: none; transition: background-color 450ms ease, box-shadow 450ms ease, opacity 450ms ease, transform 650ms cubic-bezier(.2, .8, .2, 1); }
  .color-square--css.is-visible { background: rgb(244 63 94); box-shadow: 0 0 34px rgb(244 63 94 / 36%); opacity: 1; transform: scale(1) rotate(0); }
}
</style>
