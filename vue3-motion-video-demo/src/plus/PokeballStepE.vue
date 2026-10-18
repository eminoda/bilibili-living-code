<script setup lang="ts">
import PokeballBackdrop from './PokeballBackdrop.vue'
import BilibiliSupportActions from './BilibiliSupportActions.vue'
import PokeballWhiteboard from './PokeballWhiteboard.vue'
</script>

<template>
  <div class="step-demo">
    <div class="step-stage">
      <PokeballBackdrop />
      <PokeballWhiteboard
        :frame-expanded="true"
        :surface-expanded="true"
      >
        <BilibiliSupportActions
          :disabled="false"
          compact
        />
      </PokeballWhiteboard>
    </div>
    <p class="step-hint">在白板上操作三连和关注</p>
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

.step-hint {
  margin: 0;
  color: #a5a5ad;
  font-size: 11px;
}
</style>
