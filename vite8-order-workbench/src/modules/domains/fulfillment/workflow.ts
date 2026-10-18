import type { DomainWorkflow } from '../types'

const shipments = [
  { id: 'BC202609300112', warehouse: '上海一仓', carrier: '顺丰速运', stage: '待揽收', elapsedHours: 1.2 },
  { id: 'BC202609300128', warehouse: '广州二仓', carrier: '京东物流', stage: '运输中', elapsedHours: 28 },
  { id: 'BC202609300143', warehouse: '北京中心仓', carrier: '中通快递', stage: '运输中', elapsedHours: 53 },
  { id: 'BC202609300159', warehouse: '上海一仓', carrier: '圆通速递', stage: '待出库', elapsedHours: 4 },
  { id: 'BC202609300171', warehouse: '成都三仓', carrier: '顺丰速运', stage: '运输中', elapsedHours: 17 },
]
const delayed = shipments.filter((shipment) => shipment.stage === '运输中' && shipment.elapsedHours > 48)
const waitingPickup = shipments.filter((shipment) => shipment.stage === '待揽收')
const waitingDispatch = shipments.filter((shipment) => shipment.stage === '待出库')

export const fulfillmentWorkflow: DomainWorkflow = {
  title: '仓库出库到承运商签收',
  description: '履约队列把仓库、承运商和物流节点放在一条可追踪的处理链上。',
  metrics: [
    { label: '待出库', value: String(waitingDispatch.length), detail: '需要生成拣货波次', tone: 'blue' },
    { label: '待揽收', value: String(waitingPickup.length), detail: '等待承运商扫描', tone: 'orange' },
    { label: '超时运输', value: String(delayed.length), detail: '运输超过 48 小时', tone: 'red' },
  ],
  steps: [
    { title: '仓库拣货', detail: '按仓库与截单时间分波次', state: 'done' },
    { title: '承运商揽收', detail: `${waitingPickup.length} 件等待首个扫描`, state: 'active' },
    { title: '签收回传', detail: `${delayed.length} 件需跟进时效`, state: 'waiting' },
  ],
  task: { count: String(delayed.length + waitingPickup.length).padStart(2, '0'), title: '履约异常', note: '核对超时包裹与承运商反馈', tone: 'red', path: '/module/delivery-exceptions' },
  activity: { time: '10:04', title: '上海一仓完成上午批次出库', note: `${shipments.length} 个承运节点已更新` },
}
