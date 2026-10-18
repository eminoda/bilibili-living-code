import type { DomainWorkflow } from '../types'

const stockPositions = [
  { sku: 'SP-2048', name: '城市轻跑运动鞋', warehouse: '上海一仓', onHand: 84, reserved: 31, safety: 60 },
  { sku: 'SP-2081', name: '恒温保温杯套装', warehouse: '广州二仓', onHand: 126, reserved: 42, safety: 50 },
  { sku: 'SP-3110', name: '精梳棉四件套', warehouse: '北京中心仓', onHand: 38, reserved: 17, safety: 45 },
  { sku: 'SP-4022', name: '便携咖啡器具', warehouse: '成都三仓', onHand: 57, reserved: 9, safety: 35 },
]
const lowStock = stockPositions.filter((stock) => stock.onHand - stock.reserved < stock.safety)
const reservedUnits = stockPositions.reduce((total, stock) => total + stock.reserved, 0)

export const inventoryWorkflow: DomainWorkflow = {
  title: '可售库存与安全水位',
  description: '按仓库计算可售量，库存预占后低于安全水位的商品进入补货或调拨队列。',
  metrics: [
    { label: '监控 SKU', value: String(stockPositions.length), detail: '按仓库分别核算', tone: 'blue' },
    { label: '低于安全水位', value: String(lowStock.length), detail: lowStock.map((stock) => stock.sku).join('、') || '当前无预警', tone: 'red' },
    { label: '已预占件数', value: String(reservedUnits), detail: '来自待履约订单', tone: 'orange' },
  ],
  steps: [
    { title: '订单预占', detail: `${reservedUnits} 件已锁定`, state: 'done' },
    { title: '安全水位检查', detail: `${lowStock.length} 个 SKU 需复核`, state: 'active' },
    { title: '补货或调拨', detail: '由采购与仓配协同处理', state: 'waiting' },
  ],
  task: { count: String(lowStock.length).padStart(2, '0'), title: '库存预警', note: '检查安全水位与跨仓调拨', tone: 'orange', path: '/module/stock-alerts' },
  activity: { time: '09:56', title: '北京中心仓触发安全库存提醒', note: `${lowStock[0]?.sku ?? '商品'} · 可售量低于阈值` },
}
