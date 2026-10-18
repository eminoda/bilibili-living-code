<script setup lang="ts">
import { shallowRef } from 'vue'
import { motion } from 'motion-v'
import PokeballBackdrop from './PokeballBackdrop.vue'
import PokeballSymbol from './PokeballSymbol.vue'

const rotation = shallowRef(0)
const isLarge = shallowRef(false)

function spin() {
  rotation.value += 360
  isLarge.value = !isLarge.value
}
</script>

<template>
  <div class="step-demo">
    <div class="step-stage">
      <PokeballBackdrop />
      <motion.button
        class="ball-control"
        type="button"
        :animate="{ rotate: rotation, scale: isLarge ? 1 : 0.55 }"
        :while-hover="{ y: -4 }"
        :while-press="{ y: 0 }"
        :transition="{
          scale: { type: 'spring', stiffness: 220, damping: 18 },
          rotate: { duration: 0.8, ease: 'easeInOut' },
        }"
        @click="spin"
      >
        <PokeballSymbol :expanded="false" />
      </motion.button>
    </div>
    <p class="step-hint">点击精灵球旋转并切换大小</p>
  </div>
</template>

<style lang="less" scoped>
.step-demo {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.step-stage {
  position: relative;
  isolation: isolate;
  display: grid;
  width: 100%;
  aspect-ratio: 8 / 5;
  place-items: center;
  overflow: hidden;
  background: #3f8957;
}

.ball-control {
  display: grid;
  width: 40%;
  aspect-ratio: 1;
  place-items: center;
  padding: 0;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #f31e4b;
  box-shadow: 0 5px 14px rgb(26 9 17 / 24%);
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid #ffdb73;
    outline-offset: 4px;
  }

  :deep(.ball-symbol) {
    width: 56%;
    height: 56%;
  }
}

.step-hint {
  margin: 0;
  color: #a5a5ad;
  font-size: 11px;
}
</style>
