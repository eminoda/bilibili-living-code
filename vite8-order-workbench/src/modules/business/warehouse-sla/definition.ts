import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "warehouse-sla",
  "title": "仓配时效",
  "group": "履约物流",
  "domain": "fulfillment",
  "description": "监控订单从付款到出库的时效",
  "owner": "仓配协同组",
  "metricLabel": "本周处理量",
  "metricValue": "394",
  "change": "较上周 -7.6%",
  "columns": [
    "履约单号",
    "当前节点",
    "负责仓库"
  ],
  "category": "物流"
}
