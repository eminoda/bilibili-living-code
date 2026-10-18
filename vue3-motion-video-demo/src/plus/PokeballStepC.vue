<script setup lang="ts">
import { shallowRef } from 'vue'
import PokeballBackdrop from './PokeballBackdrop.vue'
import PokeballWhiteboard from './PokeballWhiteboard.vue'

const frameExpanded = shallowRef(false)
</script>

<template>
  <div class="step-demo">
    <div class="step-stage">
      <PokeballBackdrop />
      <PokeballWhiteboard
        :frame-expanded="frameExpanded"
        :surface-expanded="false"
      />
    </div>
    <button
      class="step-control"
      type="button"
      @click="frameExpanded = !frameExpanded"
    >
      {{ frameExpanded ? '收起外框' : '展开外框' }}
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
  display: grid;
  width: 100%;
  aspect-ratio: 8 / 5;
  place-items: center;
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
