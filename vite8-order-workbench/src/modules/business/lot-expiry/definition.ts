import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "lot-expiry",
  "title": "批次效期",
  "group": "库存商品",
  "domain": "inventory",
  "description": "追踪批次商品的到期风险",
  "owner": "商品计划组",
  "metricLabel": "待处理事项",
  "metricValue": "23",
  "change": "较上周 +10.0%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
