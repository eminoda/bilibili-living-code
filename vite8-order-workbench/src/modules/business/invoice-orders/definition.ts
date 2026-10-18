import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "invoice-orders",
  "title": "订单开票",
  "group": "订单中心",
  "domain": "orders",
  "description": "关联订单与企业开票需求",
  "owner": "订单运营组",
  "metricLabel": "待处理事项",
  "metricValue": "21",
  "change": "较上周 +11.9%",
  "columns": [
    "业务单号",
    "处理节点",
    "负责人"
  ],
  "category": "订单"
}
