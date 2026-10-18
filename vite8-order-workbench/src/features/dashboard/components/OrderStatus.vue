<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentStatus } from '../orders'

const props = defineProps<{ status: PaymentStatus }>()

const tone = computed(() => props.status === '已支付' ? 'success' : props.status === '已退款' ? 'info' : 'warning')
</script>

<template>
  <el-tag :type="tone" size="small" effect="light" class="payment-status">
    <!-- S06 现场只改这里的可见文案：已支付 → 支付成功。 -->
    <template v-if="status === '已支付'">已支付</template>
    <template v-else>{{ status }}</template>
  </el-tag>
</template>
