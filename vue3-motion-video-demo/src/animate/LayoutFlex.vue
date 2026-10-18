<script setup lang="ts">
import { shallowRef } from 'vue'
import { motion } from 'motion-v'

const isColumn = shallowRef(false)
const blocks = ['A', 'B', 'C']

function toggleDirection() {
  isColumn.value = !isColumn.value
}
</script>

<template>
  <section
    class="layout-flex-demo"
    aria-label="Flex 布局动画示例"
  >
    <motion.div
      class="flex-stage"
      :class="{ 'flex-stage--column': isColumn }"
      layout
      :transition="{ type: 'spring', stiffness: 260, damping: 26 }"
    >
      <motion.div
        v-for="block in blocks"
        :key="block"
        class="flex-block"
        layout
        :transition="{ type: 'spring', stiffness: 260, damping: 26 }"
      >
        {{ block }}
      </motion.div>
    </motion.div>

    <button
      class="direction-button"
      type="button"
      :aria-pressed="isColumn"
      @click="toggleDirection"
    >
      切换为{{ isColumn ? '横向' : '纵向' }}排列
    </button>
  </section>
</template>

<style lang="less" scoped>
.layout-flex-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.flex-stage {
  display: flex;
  width: 240px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 16px;
  background-color: rgb(255 255 255 / 4%);

  &--column {
    flex-direction: column;
    align-items: flex-start;
  }
}

.flex-block {
  display: grid;
  width: 60px;
  height: 60px;
  flex: 0 0 60px;
  place-items: center;
  border-radius: 16px;
  background-color: #12b9d6;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  box-shadow: 0 10px 28px rgb(18 185 214 / 20%);

  &:nth-child(2) {
    background-color: #e94f7a;
    box-shadow: 0 10px 28px rgb(233 79 122 / 20%);
  }

  &:nth-child(3) {
    background-color: #e9a82f;
    box-shadow: 0 10px 28px rgb(233 168 47 / 20%);
  }
}

.direction-button {
  padding: 8px 14px;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 8px;
  background: rgb(255 255 255 / 8%);
  color: #f4f7f8;
  font: inherit;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease;

  &:hover {
    border-color: rgb(255 255 255 / 36%);
    background: rgb(255 255 255 / 14%);
  }
}
</style>
