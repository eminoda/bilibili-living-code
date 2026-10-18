<script setup lang="ts">
import PokeballTransitionCase from '@/components/pokeball-transition/PokeballTransitionCase.vue'
</script>

<template>
  <main class="cases-page">
    <div class="cases-shell">
      <header class="cases-heading">
        <span class="case-index">案例 / 01</span>
        <h1>精灵球转场</h1>
        <p>旋转、放大，从一颗红球展开成一张面板。</p>
      </header>
      <PokeballTransitionCase />
    </div>
  </main>
</template>

<style scoped>
.cases-page { min-height: calc(100vh - 62px); padding: 45px 28px 60px; background: #09090b; }
.cases-shell { width: min(760px, 100%); margin: 0 auto; }
.cases-heading { margin-bottom: 25px; }
.case-index { color: #f47290; font-size: 10px; letter-spacing: .1em; }
.cases-heading h1 { margin: 11px 0 9px; color: #f2f2f4; font-size: 28px; font-weight: 600; letter-spacing: -.035em; }
.cases-heading p { margin: 0; color: #82828c; font-size: 12px; line-height: 1.7; }
@media (max-width: 640px) { .cases-page { padding: 32px 16px 40px; }.cases-heading h1 { font-size: 24px; }.cases-heading { margin-bottom: 22px; } }
</style>
