<script setup lang="ts">
import { onMounted, shallowRef, watch } from 'vue'
import NumberFlow from '@number-flow/vue'

const props = withDefaults(defineProps<{
  value: number
  locale?: string
}>(), {
  locale: 'zh-CN',
})

const displayedValue = shallowRef(0)

watch(() => props.value, value => {
  displayedValue.value = value
})

onMounted(() => {
  window.requestAnimationFrame(() => {
    displayedValue.value = props.value
  })
})
</script>

<template>
  <NumberFlow class="animate-number" :value="displayedValue" :locales="locale" />
</template>

<style scoped>
.animate-number {
  display: inline-block;
  vertical-align: baseline;
  font-variant-numeric: tabular-nums;
}
</style>
