<script setup lang="ts">
import AnalyticsWorkbench from '../../domains/analytics/AnalyticsWorkbench.vue'
import { moduleDefinition } from './definition'
import { moduleAccess } from './access'
import { rows } from './records'
</script>

<template>
  <AnalyticsWorkbench :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />
</template>
