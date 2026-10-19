<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WorkItem } from '../../types/work'
import { CircleCheck, EditPen, Filter, Grid, List, MoreFilled, Search, Share, Timer, VideoPlay } from '@element-plus/icons-vue'

const props = defineProps<{
  mode: 'tasks' | 'bugs'
  records: WorkItem[]
  onOpenBug: () => void
}>()

const keyword = ref('')
const selectedTab = ref('指派给我')
const tabs = computed(() => props.mode === 'tasks'
  ? [{ label: '任务', count: props.records.length }, { label: '研发需求', count: 4 }, { label: '用户需求', count: 1 }, { label: 'Bug', count: 6 }, { label: '用例', count: 3 }, { label: '测试单', count: 0 }]
  : [{ label: '指派给我', count: props.records.length }, { label: '由我创建', count: 2 }, { label: '待我确认', count: 1 }])
const label = computed(() => props.mode === 'tasks' ? '任务' : 'Bug')
const records = computed(() => props.records)
const filteredRecords = computed(() => records.value.filter((item) => `${item.id} ${item.title} ${item.project} ${item.status}`.toLowerCase().includes(keyword.value.toLowerCase())))
const tableSummary = computed(() => {
  const rows = filteredRecords.value
  const unstarted = rows.filter((item) => item.status === '未开始').length
  const running = rows.filter((item) => item.status === '进行中').length
  const waiting = rows.filter((item) => item.status === '待确认').length
  if (props.mode === 'bugs') return `本页共 ${rows.length} 个 Bug，未开始 ${unstarted}，进行中 ${running}，待确认 ${waiting}。`
  const estimate = rows.reduce((total, item) => total + (item.estimate ?? 0), 0)
  const consumed = rows.reduce((total, item) => total + (item.consumed ?? 0), 0)
  const left = rows.reduce((total, item) => total + (item.left ?? 0), 0)
  return `本页共 ${rows.length} 个任务，未开始 ${unstarted}，进行中 ${running}，待确认 ${waiting}，总预计 ${estimate} 工时，已消耗 ${consumed} 工时，剩余 ${left} 工时。`
})
function statusClass(status: string) {
  return status === '已完成' ? 'success' : status === '进行中' ? 'running' : status === '待确认' ? 'warning' : 'neutral'
}
</script>

<template>
  <div class="work-page">
    <nav class="module-tabs">
      <button v-for="tab in tabs" :key="tab.label" :class="{ active: selectedTab === tab.label || (mode === 'tasks' && tab.label === (mode === 'tasks' ? '任务' : '')) }" @click="selectedTab = tab.label">
        {{ tab.label }} <small>{{ tab.count }}</small>
      </button>
    </nav>
    <div class="list-page-body">
      <div class="list-toolbar">
        <div class="toolbar-left"><button class="view-filter">{{ selectedTab }} <span>{{ filteredRecords.length }}</span></button><label class="search-field"><Search /><input v-model="keyword" :placeholder="`搜索${label}`"/><kbd>Enter</kbd></label></div>
        <div class="toolbar-right"><button class="filter-button"><Filter /> 筛选</button><button class="view-switch active" aria-label="列表视图"><List /></button><button class="view-switch" aria-label="分组视图"><Grid /></button></div>
      </div>
      <div class="table-wrap">
        <table class="work-table">
          <thead><tr><th class="check-col"><input type="checkbox" aria-label="全选" /></th><th>ID <span class="sort">↕</span></th><th class="title-col">{{ label }}名称 <span class="sort">↕</span></th><th>P <span class="sort">↕</span></th><th>状态 <span class="sort">↕</span></th><th>所属项目</th><th>指派给</th><th>创建者</th><th>截止日期</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in filteredRecords" :key="item.id" @dblclick="mode === 'bugs' && onOpenBug()">
              <td><input type="checkbox" :aria-label="`选择 ${item.id}`" /></td>
              <td><a class="record-id" @click="mode === 'bugs' && onOpenBug()">{{ item.id }}</a></td>
              <td class="title-cell"><a @click="mode === 'bugs' && onOpenBug()">{{ item.title }}</a><span v-if="item.overdue" class="overdue-tag">{{ item.overdue }}</span></td>
              <td><span class="priority">{{ item.priority }}</span></td>
              <td><span class="status-text" :class="statusClass(item.status)">{{ item.status }}</span></td>
              <td><a class="project-link">{{ item.project }}</a></td>
              <td>{{ item.assignee }}</td>
              <td>{{ item.creator }}</td>
              <td class="muted-text">{{ item.due }}</td>
              <td class="row-actions">
                <button title="开始"><VideoPlay /></button><button title="确认"><CircleCheck /></button><button title="延期"><Timer /></button><button title="编辑"><EditPen /></button><button title="分享"><Share /></button><button title="更多"><MoreFilled /></button>
              </td>
            </tr>
            <tr v-if="filteredRecords.length === 0"><td colspan="10" class="no-results">没有找到匹配的{{ label }}</td></tr>
          </tbody>
          <tfoot><tr><td colspan="10">{{ tableSummary }}<span class="pagination">共 {{ records.length }} 项　每页 20 项　‹　1/1　›</span></td></tr></tfoot>
        </table>
      </div>
      <div class="list-hint"><span class="hint-dot">i</span> 双击 Bug 标题可查看详情；列表数据为本地演示内容。</div>
    </div>
  </div>
</template>
