<script setup lang="ts">
import { computed, onMounted, reactive, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import KpiStrip from './components/KpiStrip.vue'
import RevenuePanel from './components/RevenuePanel.vue'
import ChannelPanel from './components/ChannelPanel.vue'
import OrdersSection from './components/OrdersSection.vue'
import OperationsRail from './components/OperationsRail.vue'
import OrderDetailDrawer from './components/OrderDetailDrawer.vue'
import { useOrderFilters } from './useOrderFilters'
import type { OrderRecord } from './orders'

const filters = useOrderFilters()
const selectedOrder = shallowRef<OrderRecord | null>(null)
const activeTab = shallowRef('全部订单')
const createDialogOpen = shallowRef(false)
const draft = reactive({ customer: '', product: '', amount: 299 })
const tabOrders = computed(() => filters.filteredOrders.value.filter((order) => {
  if (activeTab.value === '待处理') return order.status === '待审核' || order.status === '待发货'
  if (activeTab.value === '异常关注') return order.risk || order.status === '售后中'
  return true
}))
const visibleOrders = computed(() => tabOrders.value.slice((filters.page.value - 1) * filters.pageSize, filters.page.value * filters.pageSize))

function selectTab(tab: string) { activeTab.value = tab; filters.page.value = 1 }
function selectChannel(channel: string) { filters.setChannel(channel) }

function exportOrders() {
  const header = '订单编号,客户,商品,渠道,金额,支付状态,订单状态,创建时间'
  const lines = tabOrders.value.map((order) => [order.id, order.customer, order.product, order.channel, order.amount, order.paymentStatus, order.status, order.createdAt].join(','))
  const objectUrl = URL.createObjectURL(new Blob(['\ufeff', header, '\n', ...lines.map((line) => `${line}\n`)], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = '北辰零售-订单列表.csv'
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}

function createOrder() {
  if (!draft.customer.trim() || !draft.product.trim()) {
    ElMessage.warning('请填写客户和商品信息')
    return
  }
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  filters.addOrder({
    id: `BC${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getTime() % 1_000_000).padStart(6, '0')}`,
    customer: draft.customer.trim(), product: draft.product.trim(), amount: draft.amount,
    channel: '微信商城', status: '待审核', paymentStatus: '待支付', warehouse: '上海一仓',
    createdAt: `${date} ${time}`, risk: false,
  })
  activeTab.value = '全部订单'
  createDialogOpen.value = false
  draft.customer = ''; draft.product = ''; draft.amount = 299
  ElMessage.success('订单已添加到当前工作台')
}

function isInViewport(element: Element | null) {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0
}

function markOrdersMainReady(deadline: number) {
  const main = document.querySelector('[data-testid="orders-main"]')
  const statsCard = main?.querySelector('[data-testid="orders-stats"] .kpi-card') ?? null
  const firstRow = main?.querySelector('[data-testid="orders-table"] .el-table__body tbody tr:first-child') ?? null

  if (isInViewport(statsCard) && isInViewport(firstRow)) {
    requestAnimationFrame(() => performance.mark('orders-main-ready'))
  } else if (performance.now() < deadline) {
    requestAnimationFrame(() => markOrdersMainReady(deadline))
  }
}

onMounted(() => requestAnimationFrame(() => markOrdersMainReady(performance.now() + 15_000)))
</script>

<template>
  <div class="page-frame dashboard-page" data-testid="orders-main">
    <div class="breadcrumb">工作空间 <span>/</span> 订单运营工作台</div>
    <div class="page-heading dashboard-heading">
      <div>
        <div class="page-eyebrow">OPERATIONS OVERVIEW</div>
        <h1>订单运营工作台</h1>
        <p>查看订单、履约和售后动态，快速处理今天需要关注的业务。</p>
      </div>
      <div class="heading-actions">
        <el-button @click="exportOrders">导出报表</el-button>
        <el-button type="primary" @click="createDialogOpen = true">创建订单</el-button>
      </div>
    </div>

    <div class="dashboard-toolbar">
      <div class="dashboard-tabs">
        <button v-for="tab in ['全部订单', '待处理', '异常关注']" :key="tab" type="button" :class="{ active: activeTab === tab }" @click="selectTab(tab)">{{ tab }}</button>
      </div>
      <div class="toolbar-right"><span class="updated-marker"></span>数据更新于 10:26 <el-button link>近 7 天⌄</el-button></div>
    </div>

    <KpiStrip />

    <div class="analytics-grid">
      <RevenuePanel />
      <ChannelPanel :active-channel="filters.channel.value" @select-channel="selectChannel" />
    </div>

    <div class="workspace-grid">
      <OrdersSection
        :orders="visibleOrders"
        :total="tabOrders.length"
        :page="filters.page.value"
        :page-size="filters.pageSize"
        :query="filters.query.value"
        :status="filters.status.value"
        :channel="filters.channel.value"
        @update:page="filters.page.value = $event"
        @update:query="filters.setQuery"
        @update:status="filters.setStatus"
        @update:channel="filters.setChannel"
        @reset="filters.reset"
        @select="selectedOrder = $event"
      />
      <OperationsRail />
    </div>

    <OrderDetailDrawer :order="selectedOrder" @close="selectedOrder = null" />
    <el-dialog v-model="createDialogOpen" title="创建订单" width="480px">
      <el-form label-position="top"><el-form-item label="客户名称"><el-input v-model="draft.customer" placeholder="请输入客户名称" /></el-form-item><el-form-item label="商品名称"><el-input v-model="draft.product" placeholder="请输入商品名称" /></el-form-item><el-form-item label="实付金额"><el-input-number v-model="draft.amount" :min="1" :precision="2" style="width: 100%" /></el-form-item></el-form>
      <template #footer><el-button @click="createDialogOpen = false">取消</el-button><el-button type="primary" @click="createOrder">创建订单</el-button></template>
    </el-dialog>
  </div>
</template>
