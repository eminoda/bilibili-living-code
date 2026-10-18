<script setup lang="ts">
import { motion, useDomRef } from 'motion-v'

const constraintsRef = useDomRef()
</script>

<template>
  <section
    class="gesture-demo"
    aria-label="手势动画示例"
  >
    <div
      ref="constraintsRef"
      class="gesture-stage"
    >
      <motion.button
        class="gesture-block"
        type="button"
        aria-label="可拖动的橙色方块"
        drag
        :drag-constraints="constraintsRef"
        :drag-momentum="false"
        :while-hover="{ y: -5, scale: 1.06, rotate: 2 }"
        :while-press="{ scale: 0.94 }"
        :while-drag="{ scale: 1.08, rotate: -3 }"
        :transition="{ type: 'spring', stiffness: 400, damping: 24 }"
      >
        手势操作
      </motion.button>
    </div>

    <p class="gesture-hint">悬停、按压或拖动方块</p>
  </section>
</template>

<style lang="less" scoped>
.gesture-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.gesture-stage {
  display: grid;
  width: 340px;
  height: 200px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 16px;
  background-color: rgb(255 255 255 / 4%);
  background-image: radial-gradient(rgb(255 255 255 / 12%) 1px, transparent 1px);
  background-position: center;
  background-size: 18px 18px;
}

.gesture-block {
  display: grid;
  width: 100px;
  height: 100px;
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 16px;
  background-color: #42b883;
  box-shadow: 0 12px 30px rgb(66 184 131 / 24%);
  color: #fff;
  cursor: grab;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 4px;
  }
}

.gesture-hint {
  margin: 0;
  color: #f4f7f8;
  font-size: 14px;
}
</style>
