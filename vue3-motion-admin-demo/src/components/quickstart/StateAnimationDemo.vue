<script setup lang="ts">
import { shallowRef } from 'vue'
import { motion } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const replayKey = shallowRef(0)

const cssCode = `@keyframes spin { to { transform: rotate(360deg); } }
.square { animation: spin 2s ease both; }`
const motionCode = `<motion.div
  :initial="{ rotate: 0 }"
  :animate="{ rotate: 360 }"
  :transition="{ duration: 2 }"
/>`

function replay() {
  replayKey.value += 1
}
</script>

<template>
  <ComparisonSection id="animate" index="01" title="动画属性值" description="官网的 rotate 示例让方块旋转一周。Motion 的 animate 属性接收目标值；目标值变化时，动画会自动开始。" :css-code="cssCode" :motion-code="motionCode">
    <template #css>
      <div class="rotate-demo">
        <div :key="`css-${replayKey}`" class="rotate-square rotate-square--css" />
        <button class="rotate-button" type="button" @click="replay">重播 360°</button>
      </div>
    </template>
    <template #motion>
      <div class="rotate-demo">
        <motion.div :key="`motion-${replayKey}`" class="rotate-square" :initial="{ rotate: 0 }" :animate="{ rotate: 360 }" :transition="{ duration: 2 }" />
        <button class="rotate-button rotate-button--motion" type="button" @click="replay">重播 360°</button>
      </div>
    </template>
    <template #note>两边都能播放这个旋转。Motion 的 initial、animate 和 transition 把起点、目标与时长放在组件上；点击“重播”重新创建组件，即可再次播放。</template>
  </ComparisonSection>
</template>

<style scoped>
.rotate-demo { display: grid; justify-items: center; gap: 50px; }
.rotate-square { width: 140px; height: 140px; background: #00c8f0; }
.rotate-square--css { animation: spin 2s ease both; }
.rotate-button { padding: 12px 18px; border: 1px solid #d9e1eb; border-radius: 9px; background: #fff; color: #4c5b6e; cursor: pointer; font-size: 15px; }
.rotate-button:hover { background: #f0f8fb; }
.rotate-button--motion { border-color: #87dff0; background: #effcff; color: #087b91; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
