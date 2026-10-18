import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "outbound-waves",
  "title": "出库波次",
  "group": "履约物流",
  "domain": "fulfillment",
  "description": "按仓库与截单时间安排拣货波次",
  "owner": "仓配协同组",
  "metricLabel": "本周处理量",
  "metricValue": "355",
  "change": "较上周 +4.3%",
  "columns": [
    "履约单号",
    "当前节点",
    "负责仓库"
  ],
  "category": "物流"
}
