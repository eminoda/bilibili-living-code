<script setup lang="ts">
import { shallowRef } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const isVisible = shallowRef(false)

function enterBlock() {
  isVisible.value = true
}

function exitBlock() {
  isVisible.value = false
}
</script>

<template>
  <section
    class="enter-out-demo"
    aria-label="进场与离场动画示例"
  >
    <div class="block-stage">
      <AnimatePresence>
        <motion.div
          v-if="isVisible"
          key="enter-out-block"
          class="animated-block"
          :initial="{ opacity: 0, scale: 0.7, y: 24 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.7, y: -10 }"
          :transition="{ type: 'spring' }"
        />
      </AnimatePresence>
    </div>

    <div class="block-controls">
      <button
        class="action-button"
        type="button"
        :disabled="isVisible"
        aria-label="进场"
        title="进场"
        @click="enterBlock"
      >
        进场
      </button>
      <button
        class="action-button"
        type="button"
        :disabled="!isVisible"
        aria-label="离场"
        title="离场"
        @click="exitBlock"
      >
        离场
      </button>
    </div>
  </section>
</template>

<style lang="less" scoped>
.enter-out-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.block-stage {
  display: grid;
  width: 120px;
  height: 120px;
  place-items: center;
}

.animated-block {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background-color: #ff3d8d;
  box-shadow: 0 12px 36px rgb(255 61 141 / 24%);
}

.block-controls {
  display: flex;
  gap: 10px;
}

.action-button {
  display: inline-flex;
  min-width: 64px;
  height: 44px;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #f4f7f8;
  cursor: pointer;
  font: inherit;
  transition:
    transform 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: scale(1.15);
  }

  &:focus-visible {
    outline: 2px solid #f4f7f8;
    outline-offset: 3px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }
}
</style>
