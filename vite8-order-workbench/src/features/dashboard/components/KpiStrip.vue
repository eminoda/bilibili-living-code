<script setup lang="ts">
import { computed } from 'vue'
import KpiCard from './KpiCard.vue'
import { useDashboardAnalytics } from '../useDashboardAnalytics'

const { summary, dailyRevenue } = useDashboardAnalytics()
const trend = computed(() => dailyRevenue.value.map((day) => day.orders))
const cards = computed(() => [
  { label: '演示订单样本', value: summary.value.orderCount.toLocaleString('zh-CN'), suffix: '单', note: '当前本地数据集', mark: '单', tone: 'blue', points: trend.value },
  { label: '待处理订单', value: (summary.value.pendingReview + summary.value.pendingFulfillment).toLocaleString('zh-CN'), suffix: '单', note: `${summary.value.pendingReview} 待审核 · ${summary.value.pendingFulfillment} 待发货`, mark: '待', tone: 'orange', points: trend.value },
  { label: '样本已收金额', value: (summary.value.paidAmount / 10000).toFixed(1), suffix: '万', note: '仅统计已支付订单', mark: '¥', tone: 'green', points: dailyRevenue.value.map((day) => day.amount) },
  { label: '风险与售后', value: summary.value.exceptionOrders.toLocaleString('zh-CN'), suffix: '单', note: `${summary.value.riskOrders} 单风控 · ${summary.value.afterSales} 单售后`, mark: '!', tone: 'red', points: trend.value },
])
</script>

<template>
  <div class="kpi-grid" data-testid="orders-stats">
    <KpiCard v-for="card in cards" :key="card.label" v-bind="card" />
  </div>
</template>
