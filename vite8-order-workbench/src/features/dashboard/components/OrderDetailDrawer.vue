<script setup lang="ts">
import type { OrderRecord } from '../orders'
import { orderStatusType } from '../useOrderFilters'
import OrderStatus from './OrderStatus.vue'

const props = defineProps<{ order: OrderRecord | null }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <el-drawer :model-value="Boolean(props.order)" title="订单详情" size="420px" @close="emit('close')">
    <template v-if="props.order"><div class="drawer-order"><span>订单编号</span><strong>{{ props.order.id }}</strong></div><el-descriptions :column="1" border><el-descriptions-item label="客户">{{ props.order.customer }}</el-descriptions-item><el-descriptions-item label="商品">{{ props.order.product }}</el-descriptions-item><el-descriptions-item label="销售渠道">{{ props.order.channel }}</el-descriptions-item><el-descriptions-item label="履约仓库">{{ props.order.warehouse }}</el-descriptions-item><el-descriptions-item label="支付状态"><OrderStatus :status="props.order.paymentStatus" /></el-descriptions-item><el-descriptions-item label="订单状态"><el-tag :type="orderStatusType(props.order.status)">{{ props.order.status }}</el-tag></el-descriptions-item><el-descriptions-item label="实付金额">¥ {{ props.order.amount.toLocaleString('zh-CN') }}</el-descriptions-item><el-descriptions-item label="创建时间">{{ props.order.createdAt }}</el-descriptions-item></el-descriptions></template>
  </el-drawer>
</template>
