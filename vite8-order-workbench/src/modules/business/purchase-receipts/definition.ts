import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "purchase-receipts",
  "title": "采购到货",
  "group": "库存商品",
  "domain": "inventory",
  "description": "核对采购单和仓库收货记录",
  "owner": "商品计划组",
  "metricLabel": "本周处理量",
  "metricValue": "563",
  "change": "较上周 +9.9%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
