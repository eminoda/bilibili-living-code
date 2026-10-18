<script setup lang="ts">
import { useCustomerData } from '../composables/useCustomerData'
import CustomerPreviewTable from '../components/CustomerPreviewTable.vue'
import ImportSummary from '../components/ImportSummary.vue'
import type { RenderMode } from '../types'

defineProps<{ mode: RenderMode }>()
const emit = defineEmits<{ 'update:mode': [mode: RenderMode] }>()
const { rows, errorCount } = useCustomerData()
</script>

<template>
  <div class="space-y-5">
    <ImportSummary :row-count="rows.length" :error-count="errorCount" />
    <CustomerPreviewTable :rows="rows" :mode="mode" @update:mode="emit('update:mode', $event)" />
  </div>
</template>
