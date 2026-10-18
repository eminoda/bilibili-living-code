<script setup lang="ts">
import { motion } from 'motion-v'
import PokeballSymbol from './PokeballSymbol.vue'

defineProps<{
  frameExpanded: boolean
  surfaceExpanded: boolean
}>()
</script>

<template>
  <motion.div
    class="whiteboard-shell"
    :initial="false"
    :animate="{
      width: frameExpanded ? '90%' : '40%',
      height: frameExpanded ? '84%' : '64%',
      borderRadius: frameExpanded ? '18px' : '50%',
      rotate: frameExpanded ? -360 : 0,
    }"
    :transition="{ duration: 0.9, ease: 'easeInOut' }"
  >
    <motion.div
      class="whiteboard-surface"
      :initial="false"
      :animate="{
        width: surfaceExpanded ? '86%' : '0%',
        height: surfaceExpanded ? '86%' : '0%',
        opacity: surfaceExpanded ? 1 : 0,
      }"
      :transition="{ duration: 0.65, delay: surfaceExpanded ? 0.25 : 0, ease: 'easeInOut' }"
    >
      <slot />
    </motion.div>
    <motion.div
      class="whiteboard-ball"
      :initial="false"
      :animate="{
        width: frameExpanded ? '20%' : '56%',
        height: frameExpanded ? 'auto' : '56%',
        scale: surfaceExpanded ? 0.6 : 1,
        opacity: surfaceExpanded ? 0 : 1,
      }"
      :transition="{ duration: 0.55, delay: surfaceExpanded ? 0.25 : 0 }"
    >
      <slot name="ball">
        <PokeballSymbol :expanded="surfaceExpanded" />
      </slot>
    </motion.div>
  </motion.div>
</template>

<style lang="less" scoped>
.whiteboard-shell {
  position: relative;
  display: grid;
  width: 40%;
  height: 64%;
  place-items: center;
  overflow: hidden;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #f31e4b;
  box-shadow: 0 5px 14px rgb(26 9 17 / 24%);
}

.whiteboard-surface {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 9px;
  background: #fff;
  transform: translate(-50%, -50%);
}

.whiteboard-ball {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  flex: 0 0 auto;

  :deep(.ball-symbol) {
    width: 100%;
    height: 100%;
  }
}
</style>
