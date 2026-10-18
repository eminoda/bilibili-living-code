<script setup lang="ts">
import InventoryWorkbench from '../../domains/inventory/InventoryWorkbench.vue'
import { moduleDefinition } from './definition'
import { moduleAccess } from './access'
import { rows } from './records'
</script>

<template>
  <InventoryWorkbench :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />
</template>
