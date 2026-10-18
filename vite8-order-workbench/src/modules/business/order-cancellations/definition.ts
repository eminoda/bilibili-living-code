import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "order-cancellations",
  "title": "订单取消",
  "group": "订单中心",
  "domain": "orders",
  "description": "处理取消申请与库存回退",
  "owner": "订单运营组",
  "metricLabel": "本周处理量",
  "metricValue": "316",
  "change": "较上周 +12.0%",
  "columns": [
    "业务单号",
    "处理节点",
    "负责人"
  ],
  "category": "订单"
}
