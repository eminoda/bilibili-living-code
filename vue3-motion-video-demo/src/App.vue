<script setup>
import DemoLayout from './layout/DemoLayout.vue'
import RotateBlock from './animate/RotateBlock.vue'
import EnterLeave from './animate/EnterLeave.vue'
import LayoutFlex from './animate/LayoutFlex.vue'
import GestureBlock from './animate/GestureBlock.vue'
import PokeballWalkthrough from './plus/PokeballWalkthrough.vue'
</script>

<template>
  <main class="app">
    <DemoLayout>
      <div class="demo-list">
        <!-- <RotateBlock /> -->
        <!-- <EnterLeave /> -->
        <!-- <LayoutFlex /> -->
        <!-- <GestureBlock /> -->
        <PokeballWalkthrough />
      </div>
    </DemoLayout>
  </main>
</template>

<style lang="less" scoped>
.app {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.demo-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}
</style>
