<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardAnalytics } from '../useDashboardAnalytics'
import ChannelMixChart from '../charts/ChannelMixChart.vue'

defineProps<{ activeChannel: string }>()
const emit = defineEmits<{ 'select-channel': [channel: string] }>()
const { channelBreakdown } = useDashboardAnalytics()
const totalOrders = computed(() => channelBreakdown.value.reduce((total, channel) => total + channel.count, 0))
</script>

<template>
  <section class="surface-card channel-card">
    <div class="section-title-row"><div><h2>销售渠道分布</h2><p>本地订单样本渠道拆分</p></div><el-tag type="primary" effect="plain">样本</el-tag></div>
    <ChannelMixChart :channels="channelBreakdown" :total="totalOrders" />
    <div class="channel-list"><button v-for="channel in channelBreakdown" :key="channel.channel" type="button" class="channel-item" :class="{ 'is-active': activeChannel === channel.channel }" :aria-pressed="activeChannel === channel.channel" @click="emit('select-channel', activeChannel === channel.channel ? '全部渠道' : channel.channel)"><div><i :style="{ background: channel.color }"></i><span>{{ channel.channel }}</span></div><strong>{{ channel.count.toLocaleString('zh-CN') }}</strong><small>{{ channel.percent }}%</small></button></div>
  </section>
</template>
