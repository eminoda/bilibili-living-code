<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardAnalytics } from '../useDashboardAnalytics'
import RevenueTrendChart from '../charts/RevenueTrendChart.vue'

const { dailyRevenue, summary } = useDashboardAnalytics()
const paidAmount = computed(() => summary.value.paidAmount)
</script>

<template>
  <section class="surface-card revenue-card">
    <div class="section-title-row"><div><h2>订单与回款趋势</h2><p>按本地订单样本的创建日期汇总</p></div><el-button text aria-label="趋势图说明">样本口径</el-button></div>
    <div class="revenue-summary"><strong>¥ {{ (paidAmount / 10000).toFixed(1) }} <small>万</small></strong><span>{{ dailyRevenue.length }} 个样本日期 · 已支付订单</span></div>
    <RevenueTrendChart :days="dailyRevenue" />
    <div class="chart-legend"><span class="legend-dot"></span> 每日已支付金额 <span class="legend-line-dot"></span>订单数 <small>数据来自当前订单样本</small></div>
  </section>
</template>
