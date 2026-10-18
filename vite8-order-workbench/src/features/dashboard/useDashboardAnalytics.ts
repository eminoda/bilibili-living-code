import { computed } from 'vue'
import { dashboardOrders } from './useOrderFilters'

const channelColors: Record<string, string> = {
  '天猫旗舰店': '#547fe8',
  '京东自营': '#49b8a7',
  '抖音小店': '#f0a35d',
  '微信商城': '#97a3ba',
}

const summary = computed(() => {
    const orders = dashboardOrders.value
    const pendingReview = orders.filter((order) => order.status === '待审核').length
    const pendingFulfillment = orders.filter((order) => order.status === '待发货').length
    const afterSales = orders.filter((order) => order.status === '售后中').length
    const riskOrders = orders.filter((order) => order.risk).length
    const exceptionOrders = orders.filter((order) => order.risk || order.status === '售后中').length
    const paidAmount = orders
      .filter((order) => order.paymentStatus === '已支付')
      .reduce((total, order) => total + order.amount, 0)

    return { orderCount: orders.length, pendingReview, pendingFulfillment, afterSales, riskOrders, exceptionOrders, paidAmount }
})

const dailyRevenue = computed(() => {
    const orders = dashboardOrders.value
    const byDate = new Map<string, { amount: number; orders: number }>()
    for (const order of orders) {
      const date = order.createdAt.slice(5, 10)
      const current = byDate.get(date) ?? { amount: 0, orders: 0 }
      current.amount += order.paymentStatus === '已支付' ? order.amount : 0
      current.orders += 1
      byDate.set(date, current)
    }
    return [...byDate.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, metrics]) => ({ date, ...metrics }))
})

const channelBreakdown = computed(() => {
    const orders = dashboardOrders.value
    const totals = new Map<string, number>()
    for (const order of orders) totals.set(order.channel, (totals.get(order.channel) ?? 0) + 1)
    const total = orders.length || 1
    return [...totals.entries()]
      .sort(([, left], [, right]) => right - left)
      .map(([channel, count]) => ({
        channel,
        count,
        percent: Math.round(count / total * 100),
        color: channelColors[channel] ?? '#97a3ba',
      }))
})

export function useDashboardAnalytics() {
  return { summary, dailyRevenue, channelBreakdown }
}
