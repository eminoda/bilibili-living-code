<script setup lang="ts">
import OrdersWorkbench from '../../domains/orders/OrdersWorkbench.vue'
import { moduleDefinition } from './definition'
import { moduleAccess } from './access'
import { rows } from './records'
</script>

<template>
  <OrdersWorkbench :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />
</template>
