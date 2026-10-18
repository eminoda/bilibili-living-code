import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "warehouse-capacity",
  "title": "仓库产能",
  "group": "履约物流",
  "domain": "fulfillment",
  "description": "观察仓库日处理量与积压情况",
  "owner": "仓配协同组",
  "metricLabel": "本周处理量",
  "metricValue": "485",
  "change": "较上周 +3.3%",
  "columns": [
    "履约单号",
    "当前节点",
    "负责仓库"
  ],
  "category": "物流"
}
