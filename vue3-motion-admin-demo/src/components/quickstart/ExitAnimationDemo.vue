<script setup lang="ts">
import { shallowRef } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const isVisible = shallowRef(true)

const cssCode = `<Transition name="fade">
  <div v-if="isVisible" class="pink-square" />
</Transition>

<style>
.fade-leave-active { transition: opacity 300ms ease; }
.fade-leave-to { opacity: 0; }
</style>`
const motionCode = `<AnimatePresence>
  <motion.div
    v-if="isVisible"
    key="exit-pink-square"
    :exit="{ opacity: 0 }"
  />
</AnimatePresence>`
</script>

<template>
  <ComparisonSection id="exit" index="03" title="离场动画" description="离场时 Vue 即将卸载元素；AnimatePresence 会先保留它，让 exit 动画有时间完成。" :css-code="cssCode" css-language="vue" :motion-code="motionCode">
    <template #css>
      <div class="exit-demo">
        <div class="exit-stage"><Transition name="fade"><div v-if="isVisible" class="pink-square" /></Transition></div>
        <button class="toggle-button" type="button" @click="isVisible = !isVisible">{{ isVisible ? '移除' : '重新挂载' }}</button>
      </div>
    </template>
    <template #motion>
      <div class="exit-demo">
        <div class="exit-stage"><AnimatePresence><motion.div v-if="isVisible" key="exit-pink-square" class="pink-square" :exit="{ opacity: 0 }" :transition="{ duration: 0.3 }" /></AnimatePresence></div>
        <button class="toggle-button" type="button" @click="isVisible = !isVisible">{{ isVisible ? '移除' : '重新挂载' }}</button>
      </div>
    </template>
    <template #note>Vue Transition 和 Motion 都能实现离场效果；AnimatePresence 的作用是让正在卸载的 motion 元素继续留在 DOM，直到 exit 动画完成。</template>
  </ComparisonSection>
</template>

<style scoped>
.exit-demo { display: grid; justify-items: center; gap: 50px; }
.exit-stage { display: grid; width: 170px; height: 150px; place-items: center; }
.pink-square { width: 112px; height: 112px; border-radius: 14px; background: #ff3d8d; box-shadow: 0 0 32px rgb(255 61 141 / 28%); }
.toggle-button { padding: 12px 18px; border: 1px solid #ead7e1; border-radius: 8px; background: #fff8fb; color: #a32b60; cursor: pointer; font: inherit; font-size: 15px; }
.fade-leave-active { transition: opacity 300ms ease; }
.fade-leave-to { opacity: 0; }
</style>
