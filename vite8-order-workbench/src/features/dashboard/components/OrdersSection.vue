<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import type { OrderRecord, OrderStatus as FulfillmentStatus } from '../orders'
import { orderStatusType } from '../useOrderFilters'
import OrderStatus from './OrderStatus.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps<{
  orders: OrderRecord[]
  total: number
  page: number
  pageSize: number
  query: string
  status: FulfillmentStatus | '全部'
  channel: string
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:query': [value: string]
  'update:status': [value: FulfillmentStatus | '全部']
  'update:channel': [value: string]
  reset: []
  select: [order: OrderRecord]
}>()

const statuses: Array<FulfillmentStatus | '全部'> = ['全部', '待审核', '待发货', '运输中', '已完成', '售后中']
const channels = ['全部渠道', '天猫旗舰店', '京东自营', '抖音小店', '微信商城']
</script>

<template>
  <section class="surface-card orders-card" data-testid="orders-table">
    <div class="section-title-row"><div><h2>最近订单</h2><p>集中处理订单与履约进度</p></div><el-button link type="primary" @click="router.push('/module/channel-orders')">查看全部 →</el-button></div>
    <div class="filter-row">
      <el-input :model-value="query" placeholder="搜索订单号、客户或商品" clearable class="filter-search" :prefix-icon="Search" @update:model-value="emit('update:query', $event)" />
      <el-select :model-value="status" class="filter-select" @change="emit('update:status', $event as FulfillmentStatus | '全部')"><el-option v-for="option in statuses" :key="option" :label="option === '全部' ? '全部状态' : option" :value="option" /></el-select>
      <el-select :model-value="channel" class="filter-select" @change="emit('update:channel', $event)"><el-option v-for="option in channels" :key="option" :label="option" :value="option" /></el-select>
      <el-button :icon="Refresh" @click="emit('reset')">重置</el-button>
    </div>
    <el-table :data="orders" stripe class="business-table" @row-click="emit('select', $event)">
      <el-table-column label="订单编号" prop="id" min-width="170"><template #default="scope"><span class="order-id">{{ scope.row.id }}</span></template></el-table-column>
      <el-table-column label="客户" prop="customer" min-width="115" />
      <el-table-column label="商品信息" prop="product" min-width="150" />
      <el-table-column label="销售渠道" prop="channel" min-width="110" />
      <el-table-column label="实付金额" min-width="110"><template #default="scope">¥ {{ scope.row.amount.toLocaleString('zh-CN') }}</template></el-table-column>
      <el-table-column label="支付状态" min-width="100"><template #default="scope"><OrderStatus :status="scope.row.paymentStatus" /></template></el-table-column>
      <el-table-column label="订单状态" min-width="105"><template #default="scope"><el-tag :type="orderStatusType(scope.row.status)" size="small" effect="light">{{ scope.row.status }}</el-tag></template></el-table-column>
      <el-table-column label="创建时间" prop="createdAt" min-width="145" />
    </el-table>
    <div class="table-footer"><span>共 {{ total }} 条订单</span><el-pagination size="small" background layout="prev, pager, next" :current-page="page" :page-size="pageSize" :total="total" @current-change="emit('update:page', $event)" /></div>
  </section>
</template>
