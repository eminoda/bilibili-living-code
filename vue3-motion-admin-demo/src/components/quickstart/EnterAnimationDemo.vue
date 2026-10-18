<script setup lang="ts">
import { shallowRef } from 'vue'
import { motion } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const isVisible = shallowRef(true)

const cssCode = `<Transition name="scale-in" appear>
  <button v-if="isVisible" class="demo-button">缩放进入</button>
</Transition>

<style>
.scale-in-appear-active { transition: transform 300ms ease; }
.scale-in-appear-from { transform: scale(0); }
</style>`
const motionCode = `<motion.button
  v-if="isVisible"
  :initial="{ scale: 0 }"
  :animate="{ scale: 1 }"
/>`
</script>

<template>
  <ComparisonSection id="enter" index="02" title="进场动画" description="官网用一个按钮演示初始状态：元素进入页面时从 scale: 0 动画到 scale: 1。" :css-code="cssCode" css-language="vue" :motion-code="motionCode">
    <template #css>
      <div class="enter-demo">
        <div class="enter-stage">
          <Transition name="scale-in" appear><button v-if="isVisible" class="demo-button" type="button">缩放进入</button></Transition>
        </div>
        <button class="replay-button" type="button" @click="isVisible = !isVisible">{{ isVisible ? '移除' : '重新挂载' }}</button>
      </div>
    </template>
    <template #motion>
      <div class="enter-demo">
        <div class="enter-stage">
          <motion.button v-if="isVisible" class="demo-button" type="button" :initial="{ scale: 0 }" :animate="{ scale: 1 }" :transition="{ duration: 0.3 }">缩放进入</motion.button>
        </div>
        <button class="replay-button" type="button" @click="isVisible = !isVisible">{{ isVisible ? '移除' : '重新挂载' }}</button>
      </div>
    </template>
    <template #note>CSS Transition 需要提供进场 class；Motion 直接在组件上声明初始值和目标值。</template>
  </ComparisonSection>
</template>

<style scoped>
.enter-demo { display: grid; justify-items: center; gap: 50px; }
.enter-stage { display: grid; min-height: 140px; place-items: center; }
.demo-button { min-width: 170px; height: 68px; padding: 0 22px; border: 0; border-radius: 10px; background: #ff9f1c; color: #2b1700; box-shadow: 0 0 28px rgb(255 159 28 / 22%); cursor: pointer; font: inherit; font-size: 18px; font-weight: 700; }
.replay-button { padding: 12px 18px; border: 1px solid #dce2ea; border-radius: 8px; background: #fff; color: #596779; cursor: pointer; font: inherit; font-size: 15px; }
.scale-in-enter-active, .scale-in-appear-active { transition: transform 300ms ease, opacity 300ms ease; }
.scale-in-enter-from, .scale-in-appear-from { transform: scale(0); opacity: 0; }
</style>
