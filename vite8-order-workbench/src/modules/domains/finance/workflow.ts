import type { DomainWorkflow } from '../types'

const reconciliationLines = [
  { channel: '天猫旗舰店', orderAmount: 128600, statementAmount: 128600, state: '已核对' },
  { channel: '京东自营', orderAmount: 76420, statementAmount: 76120, state: '差异待查' },
  { channel: '抖音小店', orderAmount: 51980, statementAmount: 51980, state: '已核对' },
  { channel: '微信商城', orderAmount: 28100, statementAmount: 27900, state: '差异待查' },
]
const mismatches = reconciliationLines.filter((line) => line.orderAmount !== line.statementAmount)
const totalDifference = mismatches.reduce((total, line) => total + Math.abs(line.orderAmount - line.statementAmount), 0)

export const financeWorkflow: DomainWorkflow = {
  title: '渠道订单与平台回款对账',
  description: '按渠道匹配订单实收与平台账单，差异单进入复核队列后再进入月度结算。',
  metrics: [
    { label: '对账渠道', value: String(reconciliationLines.length), detail: '同一结算周期', tone: 'blue' },
    { label: '待复核差异', value: String(mismatches.length), detail: '订单金额与账单不一致', tone: 'orange' },
    { label: '差异金额', value: `¥${totalDifference.toLocaleString('zh-CN')}`, detail: '需匹配退款与手续费', tone: 'red' },
  ],
  steps: [
    { title: '订单流水归集', detail: '按渠道与结算周期汇总', state: 'done' },
    { title: '账单差异复核', detail: `${mismatches.length} 个渠道需要核对`, state: 'active' },
    { title: '月结与打款', detail: '差异确认后生成结算批次', state: 'waiting' },
  ],
  task: { count: String(mismatches.length).padStart(2, '0'), title: '平台账单差异', note: '复核退款、手续费与结算周期', tone: 'red', path: '/module/payment-reconcile' },
  activity: { time: '09:12', title: '京东渠道对账单已更新', note: '财务结算 · 9 月 30 日' },
}
