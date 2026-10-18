import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "order-review",
  "title": "订单审核",
  "group": "订单中心",
  "domain": "orders",
  "description": "核对新订单的支付、地址与风控状态",
  "owner": "订单运营组",
  "metricLabel": "本周处理量",
  "metricValue": "199",
  "change": "较上周 +3.1%",
  "columns": [
    "业务单号",
    "处理节点",
    "负责人"
  ],
  "category": "订单"
}
