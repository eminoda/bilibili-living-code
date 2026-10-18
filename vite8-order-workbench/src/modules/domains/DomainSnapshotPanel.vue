<script setup lang="ts">
import type { DomainWorkflow } from './types'

defineProps<{ workflow: DomainWorkflow }>()
</script>

<template>
  <section class="surface-card domain-snapshot">
    <div class="domain-snapshot-heading">
      <div>
        <span class="domain-kicker">业务流程快照</span>
        <h2>{{ workflow.title }}</h2>
        <p>{{ workflow.description }}</p>
      </div>
      <span class="snapshot-period">今日工作台</span>
    </div>
    <div class="domain-metrics">
      <article v-for="metric in workflow.metrics" :key="metric.label" class="domain-metric" :class="`metric-${metric.tone}`">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small>{{ metric.detail }}</small>
      </article>
    </div>
    <ol class="workflow-steps">
      <li v-for="step in workflow.steps" :key="step.title" :class="`step-${step.state}`">
        <span class="step-marker"></span>
        <div><strong>{{ step.title }}</strong><small>{{ step.detail }}</small></div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.domain-snapshot { margin-bottom: 18px; padding: 20px 22px; }
.domain-snapshot-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.domain-kicker { color: #6680a2; font-size: 10px; font-weight: 700; letter-spacing: .12em; }
.domain-snapshot h2 { margin: 6px 0 4px; color: #243b59; font-size: 17px; }
.domain-snapshot p { margin: 0; color: #8795a9; font-size: 12px; }
.snapshot-period { flex: none; border: 1px solid #e5ebf2; border-radius: 14px; padding: 5px 10px; color: #77869a; font-size: 11px; }
.domain-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 18px; }
.domain-metric { display: grid; grid-template-columns: 1fr auto; gap: 3px 10px; border-left: 3px solid #6c92e8; border-radius: 4px; background: #f7f9fc; padding: 10px 12px; }
.domain-metric > span { color: #718198; font-size: 11px; }
.domain-metric strong { grid-row: span 2; align-self: center; color: #2a405f; font-size: 19px; }
.domain-metric small { color: #98a4b4; font-size: 10px; }
.metric-orange { border-color: #e3a251; }.metric-green { border-color: #4bb59d; }.metric-red { border-color: #db7272; }
.workflow-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 15px 0 0; padding: 13px 0 0; border-top: 1px solid #edf0f4; list-style: none; }
.workflow-steps li { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
.step-marker { flex: none; width: 7px; height: 7px; margin-top: 4px; border-radius: 50%; background: #9aa8b9; }
.step-done .step-marker { background: #48ad91; }.step-active .step-marker { background: #e3a251; box-shadow: 0 0 0 3px #fff0db; }
.workflow-steps strong,.workflow-steps small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.workflow-steps strong { color: #536680; font-size: 11px; font-weight: 600; }.workflow-steps small { margin-top: 3px; color: #98a4b4; font-size: 10px; }
@media (max-width: 900px) { .workflow-steps { grid-template-columns: 1fr; }.domain-metrics { grid-template-columns: 1fr; } }
</style>
