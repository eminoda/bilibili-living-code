import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "refund-approval",
  "title": "退款审批",
  "group": "订单中心",
  "domain": "orders",
  "description": "处理待确认的退款与退货申请",
  "owner": "订单运营组",
  "metricLabel": "待处理事项",
  "metricValue": "15",
  "change": "较上周 +5.3%",
  "columns": [
    "业务单号",
    "处理节点",
    "负责人"
  ],
  "category": "订单"
}
