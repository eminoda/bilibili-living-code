<script setup lang="ts">
defineProps<{
  label: string
  value: string
  suffix: string
  note: string
  tone: string
  mark: string
  points: number[]
}>()

function sparkline(points: number[]) {
  const max = Math.max(...points, 1)
  const step = points.length > 1 ? 90 / (points.length - 1) : 0
  return points.map((point, index) => `${index * step},${36 - point / max * 28}`).join(' ')
}
</script>

<template>
  <article class="kpi-card">
    <div class="kpi-top"><span>{{ label }}</span><div class="kpi-icon" :class="`tone-${tone}`">{{ mark }}</div></div>
    <div class="kpi-value">{{ value }}<small>{{ suffix }}</small></div>
    <div class="kpi-foot"><span>{{ note }}</span><svg width="92" height="40" viewBox="0 0 92 40" aria-hidden="true"><polyline :points="sparkline(points)" fill="none" stroke="#5385db" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg></div>
  </article>
</template>
