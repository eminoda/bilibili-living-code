import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "listing-control",
  "title": "上下架管理",
  "group": "库存商品",
  "domain": "inventory",
  "description": "审核渠道商品的上架计划",
  "owner": "商品计划组",
  "metricLabel": "本周处理量",
  "metricValue": "550",
  "change": "较上周 -8.8%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
