import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "batch-dispatch",
  "title": "批量发货",
  "group": "订单中心",
  "domain": "orders",
  "description": "汇总待发货订单并生成出库批次",
  "owner": "订单运营组",
  "metricLabel": "本周处理量",
  "metricValue": "212",
  "change": "较上周 +4.2%",
  "columns": [
    "业务单号",
    "处理节点",
    "负责人"
  ],
  "category": "订单"
}
