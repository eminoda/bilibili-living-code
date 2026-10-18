import { orders } from '../../../features/dashboard/orders'
import type { DomainWorkflow } from '../types'

const pendingReview = orders.filter((order) => order.status === '待审核')
const pendingFulfillment = orders.filter((order) => order.status === '待发货')
const afterSales = orders.filter((order) => order.status === '售后中')

export const orderWorkflow: DomainWorkflow = {
  title: '订单从支付到售后的处理链',
  description: '审核、履约和售后使用同一订单状态，运营可以从待办直接回到具体业务单。',
  metrics: [
    { label: '待审核', value: String(pendingReview.length), detail: '需核对地址与风控', tone: 'orange' },
    { label: '待履约', value: String(pendingFulfillment.length), detail: '等待分配仓库', tone: 'blue' },
    { label: '售后处理中', value: String(afterSales.length), detail: '退款与退货申请', tone: 'red' },
  ],
  steps: [
    { title: '支付确认', detail: '支付流水已回写订单', state: 'done' },
    { title: '人工审核', detail: `${pendingReview.length} 单等待复核`, state: 'active' },
    { title: '履约或售后', detail: '按订单状态进入对应队列', state: 'waiting' },
  ],
  task: { count: String(pendingReview.length).padStart(2, '0'), title: '待审核订单', note: '核对地址、支付与风控状态', tone: 'orange', path: '/module/order-review' },
  activity: { time: '10:26', title: '华东区域订单已完成批量出库', note: '上海一仓 · 86 单' },
}
