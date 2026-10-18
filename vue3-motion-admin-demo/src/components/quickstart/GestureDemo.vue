<script setup lang="ts">
import { motion } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const cssCode = `.button { transition: transform .2s ease; }
.button:hover { transform: scale(1.1); }
.button:active { transform: scale(.95); }`
const motionCode = `<motion.button
  :whileHover="{ scale: 1.1 }"
  :whilePress="{ scale: .95 }"
  :transition="{ type: 'spring' }"
/>`
</script>

<template>
  <ComparisonSection id="gestures" index="04" title="响应悬停与按压" description="CSS 伪类适合简单反馈；Motion 会把 hover（悬停）、press（按压）识别为可组合的手势状态。" :css-code="cssCode" :motion-code="motionCode">
    <template #css>
      <div class="gesture-demo"><button class="gesture-button gesture-button--css" type="button">悬停 / 按压</button><span class="gesture-hint">鼠标悬停或按住按钮</span></div>
    </template>
    <template #motion>
      <div class="gesture-demo"><motion.button class="gesture-button gesture-button--motion" type="button" :whileHover="{ scale: 1.1 }" :whilePress="{ scale: 0.95 }" :transition="{ type: 'spring' }">悬停 / 按压</motion.button><span class="gesture-hint">触屏轻触会识别为按压，不会触发 hover</span></div>
    </template>
    <template #note>Motion 的手势识别器会避免触屏轻触触发 hover，也能处理 press、drag 等交互。</template>
  </ComparisonSection>
</template>

<style scoped>
.gesture-demo { display: grid; justify-items: center; gap: 24px; width: 100%; }
.gesture-button { min-width: 220px; height: 76px; padding: 0 24px; border: 0; border-radius: 12px; background: #b7f000; color: #1e2900; box-shadow: 0 0 28px rgb(183 240 0 / 24%); cursor: pointer; font: inherit; font-size: 18px; font-weight: 700; }
.gesture-button--css { transition: transform 200ms ease; }
.gesture-button--css:hover { transform: scale(1.1); }
.gesture-button--css:active { transform: scale(.95); }
.gesture-button--motion { background: #b7f000; }
.gesture-hint { color: #687587; font-size: 14px; }
</style>
