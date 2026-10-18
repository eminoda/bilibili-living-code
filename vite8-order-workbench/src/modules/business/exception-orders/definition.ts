import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "exception-orders",
  "title": "异常订单",
  "group": "订单中心",
  "domain": "orders",
  "description": "跟进超时、缺货及地址异常订单",
  "owner": "订单运营组",
  "metricLabel": "本周处理量",
  "metricValue": "238",
  "change": "较上周 -6.4%",
  "columns": [
    "业务单号",
    "处理节点",
    "负责人"
  ],
  "category": "订单"
}
