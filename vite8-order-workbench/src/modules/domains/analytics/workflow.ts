import type { DomainWorkflow } from '../types'

export const channelPerformance = [
  { channel: '天猫旗舰店', sessions: 24800, orders: 1284, previousOrders: 1160, color: '#547fe8' },
  { channel: '京东自营', sessions: 15600, orders: 768, previousOrders: 802, color: '#49b8a7' },
  { channel: '抖音小店', sessions: 10900, orders: 512, previousOrders: 468, color: '#f0a35d' },
  { channel: '微信商城', sessions: 6300, orders: 282, previousOrders: 251, color: '#97a3ba' },
]

const totalOrders = channelPerformance.reduce((total, channel) => total + channel.orders, 0)
const totalSessions = channelPerformance.reduce((total, channel) => total + channel.sessions, 0)
const conversion = (totalOrders / totalSessions * 100).toFixed(2)
const previousOrders = channelPerformance.reduce((total, channel) => total + channel.previousOrders, 0)
const change = ((totalOrders - previousOrders) / previousOrders * 100).toFixed(1)

export const analyticsWorkflow: DomainWorkflow = {
  title: '渠道转化与经营日报',
  description: '同一份渠道口径关联访问、下单与支付数据，运营日报据此解释环比变化。',
  metrics: [
    { label: '有效访问', value: totalSessions.toLocaleString('zh-CN'), detail: '四个销售渠道', tone: 'blue' },
    { label: '下单转化', value: `${conversion}%`, detail: '订单数 / 有效访问', tone: 'green' },
    { label: '订单环比', value: `+${change}%`, detail: '较上一经营周期', tone: 'orange' },
  ],
  steps: [
    { title: '渠道数据同步', detail: '按统一时区归集访问与订单', state: 'done' },
    { title: '指标口径校验', detail: '过滤取消与重复订单', state: 'active' },
    { title: '日报复盘', detail: '定位渠道波动并跟进行动', state: 'waiting' },
  ],
  task: { count: String(channelPerformance.length).padStart(2, '0'), title: '渠道日报', note: '检查转化变化与数据口径', tone: 'blue', path: '/module/channel-conversion' },
  activity: { time: '08:55', title: '渠道经营日报已生成', note: `${totalOrders.toLocaleString('zh-CN')} 单 · 环比 +${change}%` },
}
