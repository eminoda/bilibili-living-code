<script setup lang="ts">
import { shallowRef } from 'vue'
import PokeballBackdrop from './PokeballBackdrop.vue'

const blurred = shallowRef(false)
</script>

<template>
  <div class="step-demo">
    <div class="step-stage">
      <PokeballBackdrop :blurred="blurred" />
    </div>
    <button
      class="step-control"
      type="button"
      @click="blurred = !blurred"
    >
      {{ blurred ? '恢复清晰' : '背景虚化' }}
    </button>
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
  width: 100%;
  aspect-ratio: 8 / 5;
  overflow: hidden;
  background: #3f8957;
}

.step-control {
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 6px;
  background: rgb(255 255 255 / 6%);
  color: #e6e6eb;
  cursor: pointer;
  font: inherit;
  font-size: 11px;

  &:hover {
    background: rgb(255 255 255 / 12%);
  }
}
</style>
