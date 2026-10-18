<script setup lang="ts">
import type { BugHistoryEntry } from '../../types/work'

defineProps<{
  createdAt: string
  openedBy: string
  assignedTo: string
  history: BugHistoryEntry[]
}>()

const actionLabels: Record<BugHistoryEntry['action'], string> = {
  resolve: '解决了 Bug',
  close: '关闭了 Bug',
  activate: '激活了 Bug',
}
</script>

<template>
  <section class="panel history-panel">
    <header><strong>历史记录</strong><button class="inline-link">＋ 添加备注</button></header>
    <div class="history-entry"><span>1</span><p>{{ createdAt }}，由 <b>{{ openedBy }}</b> 创建。</p></div>
    <div class="history-entry"><span>2</span><p>{{ createdAt }}，由 <b>{{ openedBy }}</b> 指派给 <b>{{ assignedTo }}</b>。</p></div>
    <div v-for="(entry, index) in history" :key="entry.id" class="history-entry history-action">
      <span>{{ index + 3 }}</span>
      <div>
        <p>{{ entry.date }}，由 <b>{{ entry.actor }}</b> {{ actionLabels[entry.action] }}。</p>
        <pre v-if="entry.comment" class="history-comment">{{ entry.comment }}</pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.history-action { align-items: flex-start; }
.history-action > div { min-width: 0; }
.history-comment {
  margin: 8px 0 10px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: #46566a;
  font: inherit;
  line-height: 1.7;
}
</style>
