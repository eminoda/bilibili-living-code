<script setup lang="ts">
import FulfillmentWorkbench from '../../domains/fulfillment/FulfillmentWorkbench.vue'
import { moduleDefinition } from './definition'
import { moduleAccess } from './access'
import { rows } from './records'
</script>

<template>
  <FulfillmentWorkbench :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />
</template>
