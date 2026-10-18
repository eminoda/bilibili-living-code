import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "cross-warehouse",
  "title": "跨仓调拨",
  "group": "履约物流",
  "domain": "fulfillment",
  "description": "协调异地仓库存与转运任务",
  "owner": "仓配协同组",
  "metricLabel": "待处理事项",
  "metricValue": "30",
  "change": "较上周 +9.8%",
  "columns": [
    "履约单号",
    "当前节点",
    "负责仓库"
  ],
  "category": "物流"
}
