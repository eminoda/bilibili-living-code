<script setup lang="ts">
defineProps<{ expanded: boolean }>()
</script>

<template>
  <svg
    class="ball-symbol"
    :class="{ 'ball-symbol--expanded': expanded }"
    viewBox="0 0 100 100"
  >
    <circle
      class="symbol-base"
      cx="50"
      cy="50"
      r="44"
    />
    <path
      class="symbol-top"
      d="M6 50a44 44 0 0 1 88 0Z"
    />
    <circle
      class="symbol-outline"
      cx="50"
      cy="50"
      r="44"
    />
    <path
      class="symbol-line"
      d="M7 50H93"
    />
    <circle
      class="symbol-center"
      cx="50"
      cy="50"
      r="15"
    />
    <circle
      class="symbol-inner"
      cx="50"
      cy="50"
      r="9"
    />
    <ellipse
      class="symbol-glint"
      cx="30"
      cy="26"
      rx="7"
      ry="5"
      transform="rotate(-35 30 26)"
    />
  </svg>
</template>

<style scoped>
.ball-symbol {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.symbol-base {
  fill: #fff7f0;
}
.symbol-top {
  fill: #f4999d;
}
.symbol-outline,
.symbol-line,
.symbol-center {
  fill: none;
  stroke: #d5a6a6;
  stroke-width: 5;
}
.symbol-center,
.symbol-inner {
  fill: #fff7f0;
}
.symbol-glint {
  fill: #fff;
  opacity: 0.9;
}
.ball-symbol--expanded .symbol-top {
  fill: #f1264f;
}
.ball-symbol--expanded .symbol-outline,
.ball-symbol--expanded .symbol-line,
.ball-symbol--expanded .symbol-center {
  stroke: #422a34;
}
</style>
