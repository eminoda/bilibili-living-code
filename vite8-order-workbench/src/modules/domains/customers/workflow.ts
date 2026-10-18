import type { DomainWorkflow } from '../types'

const serviceCases = [
  { id: 'CS-9012', customer: '澜沧商贸', topic: '配送延误', state: '待回访', dueHours: 1 },
  { id: 'CS-9018', customer: '佳禾生活', topic: '退款进度', state: '处理中', dueHours: 5 },
  { id: 'CS-9021', customer: '晨帆家居', topic: '商品差异', state: '升级复核', dueHours: 0.5 },
  { id: 'CS-9030', customer: '知味生活', topic: '发票咨询', state: '待分派', dueHours: 7 },
]
const urgentCases = serviceCases.filter((serviceCase) => serviceCase.dueHours <= 1)
const waitingFollowup = serviceCases.filter((serviceCase) => serviceCase.state === '待回访' || serviceCase.state === '升级复核')

export const customerWorkflow: DomainWorkflow = {
  title: '客户工单与服务时限',
  description: '投诉、退款咨询和回访任务共用客户档案，升级记录保留处理人和承诺时限。',
  metrics: [
    { label: '服务工单', value: String(serviceCases.length), detail: '跨订单与售后场景', tone: 'blue' },
    { label: '临近 SLA', value: String(urgentCases.length), detail: '剩余处理时间小于 1 小时', tone: 'red' },
    { label: '待回访 / 升级', value: String(waitingFollowup.length), detail: '需要运营跟进', tone: 'orange' },
  ],
  steps: [
    { title: '客户问题登记', detail: '绑定客户与关联订单', state: 'done' },
    { title: '跨部门处理', detail: '售后、仓配同步进度', state: 'active' },
    { title: '回访闭环', detail: '确认客户接受处理结果', state: 'waiting' },
  ],
  task: { count: String(waitingFollowup.length).padStart(2, '0'), title: '售后升级', note: '回访客户并复核处理承诺', tone: 'blue', path: '/module/complaint-followup' },
  activity: { time: '09:48', title: '新的退款审批申请', note: '售后工单 · 3 项待确认' },
}
