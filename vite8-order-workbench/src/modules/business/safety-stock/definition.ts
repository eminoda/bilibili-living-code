import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "safety-stock",
  "title": "安全库存",
  "group": "库存商品",
  "domain": "inventory",
  "description": "维护仓库与渠道的库存阈值",
  "owner": "商品计划组",
  "metricLabel": "本周处理量",
  "metricValue": "524",
  "change": "较上周 +6.6%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
