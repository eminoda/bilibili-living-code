<script setup lang="ts">
import { computed } from 'vue'
import { bilibiliIcons, type BilibiliIconName } from './bilibiliIcons'

const props = defineProps<{ name: BilibiliIconName }>()
const icon = computed(() => bilibiliIcons[props.name])
</script>

<template>
  <svg
    class="bili-icon"
    :viewBox="icon.viewBox"
  >
    <path
      v-for="path in icon.paths"
      :key="path"
      :d="path"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
    />
  </svg>
</template>

<style scoped>
.bili-icon {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
