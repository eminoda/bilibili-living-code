import { computed, shallowRef } from 'vue'
import { orders, type OrderRecord, type OrderStatus } from './orders'

export const dashboardOrders = shallowRef<OrderRecord[]>([...orders])

export function useOrderFilters() {
  const query = shallowRef('')
  const status = shallowRef<OrderStatus | '全部'>('全部')
  const channel = shallowRef('全部渠道')
  const page = shallowRef(1)
  const pageSize = 8

  const filteredOrders = computed(() => dashboardOrders.value.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.product}`
    return (!query.value || text.toLowerCase().includes(query.value.toLowerCase()))
      && (status.value === '全部' || order.status === status.value)
      && (channel.value === '全部渠道' || order.channel === channel.value)
  }))
  const pagedOrders = computed(() => filteredOrders.value.slice((page.value - 1) * pageSize, page.value * pageSize))

  function setQuery(value: string) { query.value = value; page.value = 1 }
  function setStatus(value: OrderStatus | '全部') { status.value = value; page.value = 1 }
  function setChannel(value: string) { channel.value = value; page.value = 1 }
  function reset() { query.value = ''; status.value = '全部'; channel.value = '全部渠道'; page.value = 1 }
  function addOrder(order: OrderRecord) { dashboardOrders.value = [order, ...dashboardOrders.value]; page.value = 1 }

  return { query, status, channel, page, pageSize, filteredOrders, pagedOrders, setQuery, setStatus, setChannel, reset, addOrder }
}

export function orderStatusType(status: OrderRecord['status']) {
  if (status === '已完成') return 'success'
  if (status === '售后中') return 'danger'
  if (status === '运输中') return 'primary'
  if (status === '待发货') return 'warning'
  return 'info'
}
