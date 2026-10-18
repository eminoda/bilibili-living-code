<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { ArrowLeft, Download, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import type { BusinessModuleAccess, BusinessModuleDefinition } from '../modules/types'
import type { BusinessRow } from '../modules/createBusinessRows'

const props = defineProps<{
  definition: BusinessModuleDefinition
  access: BusinessModuleAccess
  rows: BusinessRow[]
}>()

const router = useRouter()
const query = shallowRef('')
const status = shallowRef('全部')
const page = shallowRef(1)
const pageSize = 8
const visibleRows = computed(() => props.rows.filter((row) => {
  const matchesQuery = !query.value || `${row.id} ${row.subject} ${row.owner}`.includes(query.value)
  return matchesQuery && (status.value === '全部' || row.status === status.value)
}))
const pagedRows = computed(() => visibleRows.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const statusType = (value: BusinessRow['status']) => value === '已完成' ? 'success' : value === '需复核' ? 'danger' : value === '处理中' ? 'warning' : 'info'

function resetFilters() {
  query.value = ''
  status.value = '全部'
  page.value = 1
}
</script>

<template>
  <div class="page-frame">
    <div class="breadcrumb">业务管理 <span>/</span> {{ definition.group }} <span>/</span> {{ definition.title }}</div>
    <div class="page-heading">
      <div>
        <el-button class="back-link" text :icon="ArrowLeft" @click="router.push('/orders')">返回工作台</el-button>
        <h1>{{ definition.title }}</h1>
        <p>{{ definition.description }}</p>
      </div>
      <el-button :icon="Download">导出列表</el-button>
    </div>
    <div class="module-overview">
      <div class="overview-emphasis"><span>{{ definition.metricLabel }}</span><strong>{{ definition.metricValue }}</strong><small>{{ definition.change }} · 近 7 天</small></div>
      <div><span>负责团队</span><strong>{{ definition.owner }}</strong><small>{{ access.role }}</small></div>
      <div><span>数据范围</span><strong>{{ access.scope }}</strong><small>{{ access.reviewCycle }}</small></div>
      <div><span>所属业务域</span><strong>{{ definition.group }}</strong><small>日常运营模块</small></div>
    </div>
    <div class="surface-card module-list">
      <div class="section-title-row"><div><h2>{{ definition.title }}列表</h2><p>共 {{ visibleRows.length }} 条记录 · 最近更新于今日</p></div></div>
      <div class="filter-row">
        <el-input v-model="query" placeholder="搜索单号、主题或负责人" clearable class="filter-search" @input="page = 1" />
        <el-select v-model="status" class="filter-select" @change="page = 1">
          <el-option v-for="option in ['全部', '待处理', '处理中', '已完成', '需复核']" :key="option" :label="option" :value="option" />
        </el-select>
        <el-button :icon="Refresh" @click="resetFilters">重置</el-button>
      </div>
      <el-table :data="pagedRows" stripe class="business-table">
        <el-table-column prop="id" :label="definition.columns[0]" min-width="148" />
        <el-table-column prop="subject" label="业务主题" min-width="270" />
        <el-table-column :label="definition.columns[1]" min-width="120"><template #default="scope"><el-tag :type="statusType(scope.row.status)" size="small" effect="light">{{ scope.row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" :label="definition.columns[2]" min-width="120" />
        <el-table-column prop="amount" label="关联金额" min-width="120" />
        <el-table-column prop="updatedAt" label="更新时间" min-width="160" />
      </el-table>
      <div class="table-footer"><span>显示 {{ pagedRows.length }} / {{ visibleRows.length }} 条</span><el-pagination v-model:current-page="page" size="small" background layout="prev, pager, next" :page-size="pageSize" :total="visibleRows.length" /></div>
    </div>
  </div>
</template>
