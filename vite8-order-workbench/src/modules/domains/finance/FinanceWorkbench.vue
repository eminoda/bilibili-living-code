<script setup lang="ts">
import BusinessModuleView from '../../../components/BusinessModuleView.vue'
import DomainSnapshotPanel from '../DomainSnapshotPanel.vue'
import { financeWorkflow } from './workflow'
import type { DomainWorkbenchProps } from '../types'

defineProps<DomainWorkbenchProps>()
</script>

<template>
  <div class="domain-workbench">
    <DomainSnapshotPanel :workflow="financeWorkflow" />
    <BusinessModuleView :definition="definition" :access="access" :rows="rows" />
  </div>
</template>
