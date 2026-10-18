<script setup lang="ts">
import FinanceWorkbench from '../../domains/finance/FinanceWorkbench.vue'
import { moduleDefinition } from './definition'
import { moduleAccess } from './access'
import { rows } from './records'
</script>

<template>
  <FinanceWorkbench :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />
</template>
