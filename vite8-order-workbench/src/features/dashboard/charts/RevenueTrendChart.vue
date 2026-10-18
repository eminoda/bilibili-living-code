<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEChart } from './useEChart'

const props = defineProps<{
  days: Array<{ date: string; amount: number; orders: number }>
}>()

const option = computed<EChartsOption>(() => ({
  aria: { enabled: true, description: '按创建日期统计的订单实收趋势柱状图' },
  grid: { top: 12, right: 16, bottom: 22, left: 34 },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: props.days.map((day) => day.date.slice(-2)),
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#e4e9ef' } },
    axisLabel: { color: '#8c99aa', fontSize: 10 },
  },
  yAxis: [
    {
      type: 'value',
      splitNumber: 3,
      axisLabel: { color: '#a3adba', fontSize: 9, formatter: (value: number) => `${(value / 10000).toFixed(0)}万` },
      splitLine: { lineStyle: { color: '#edf0f5' } },
    },
    { type: 'value', show: false },
  ],
  series: [{
    name: '实收金额（元）',
    type: 'bar',
    data: props.days.map((day) => day.amount),
    yAxisIndex: 0,
    barMaxWidth: 24,
    itemStyle: { color: '#5d8be6', borderRadius: [3, 3, 0, 0] },
  }, {
    name: '订单数（单）',
    type: 'line',
    data: props.days.map((day) => day.orders),
    yAxisIndex: 1,
    smooth: true,
    symbolSize: 5,
    lineStyle: { color: '#42ad93', width: 2 },
    itemStyle: { color: '#42ad93' },
  }],
}))

const element = useEChart(option)
</script>

<template>
  <div ref="element" class="revenue-echart" role="img" aria-label="按日期统计的订单实收趋势图"></div>
</template>
