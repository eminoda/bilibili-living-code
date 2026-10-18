<script setup lang="ts">
import CustomerWorkbench from '../../domains/customers/CustomerWorkbench.vue'
import { moduleDefinition } from './definition'
import { moduleAccess } from './access'
import { rows } from './records'
</script>

<template>
  <CustomerWorkbench :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />
</template>
