<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useEChart } from './useEChart'

const props = defineProps<{
  channels: Array<{ channel: string; count: number; percent: number; color: string }>
  total: number
}>()

const option = computed<EChartsOption>(() => ({
  aria: { enabled: true, description: '按销售渠道拆分的订单占比环形图' },
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 单（{d}%）' },
  series: [{
    name: '订单渠道',
    type: 'pie',
    radius: ['62%', '84%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    label: { show: false },
    itemStyle: { borderColor: '#fff', borderWidth: 3 },
    data: props.channels.map((channel) => ({
      name: channel.channel,
      value: channel.count,
      itemStyle: { color: channel.color },
    })),
  }],
}))

const element = useEChart(option)
</script>

<template>
  <div class="channel-echart-wrap">
    <div ref="element" class="channel-echart" role="img" aria-label="销售渠道订单占比环形图"></div>
    <div class="channel-echart-center"><strong>{{ total.toLocaleString('zh-CN') }}</strong><span>订单总量</span></div>
  </div>
</template>
