export type OrderStatus = '待审核' | '待发货' | '运输中' | '已完成' | '售后中'
export type PaymentStatus = '已支付' | '待支付' | '已退款'

export interface OrderRecord {
  id: string
  customer: string
  product: string
  channel: string
  amount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  warehouse: string
  createdAt: string
  risk: boolean
}

const customers = ['澜沧商贸', '佳禾生活', '华启数码', '晨帆家居', '亦谷食品', '森宁运动', '禾嘉百货', '知味生活']
const products = ['城市轻跑运动鞋', '恒温保温杯套装', '精梳棉四件套', '便携咖啡器具', '家庭收纳组合', '健康零食礼盒']
const channels = ['天猫旗舰店', '京东自营', '抖音小店', '微信商城']
const warehouses = ['上海一仓', '广州二仓', '北京中心仓', '成都三仓']
const statuses: OrderStatus[] = ['待审核', '待发货', '运输中', '已完成', '售后中']

export const orders: OrderRecord[] = Array.from({ length: 236 }, (_, index) => ({
  id: `BC202609${String(3000 + index).padStart(6, '0')}`,
  customer: customers[(index * 5) % customers.length] ?? '澜沧商贸',
  product: products[(index * 7) % products.length] ?? '城市轻跑运动鞋',
  channel: channels[(index * 3) % channels.length] ?? '天猫旗舰店',
  amount: 129 + (index * 173) % 3680,
  status: statuses[(index * 11 + Math.floor(index / 5)) % statuses.length] ?? '待审核',
  paymentStatus: index % 11 === 4 ? '待支付' : index % 17 === 8 ? '已退款' : '已支付',
  warehouse: warehouses[(index * 3) % warehouses.length] ?? '上海一仓',
  createdAt: `2026-09-${String(30 - (index % 5)).padStart(2, '0')} ${String(9 + (index % 9)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
  risk: index % 11 === 0 || index % 17 === 0,
}))
