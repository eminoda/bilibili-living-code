import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "stock-reservation",
  "title": "库存预占",
  "group": "库存商品",
  "domain": "inventory",
  "description": "核对促销订单的库存锁定情况",
  "owner": "商品计划组",
  "metricLabel": "本周处理量",
  "metricValue": "589",
  "change": "较上周 +11.1%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
