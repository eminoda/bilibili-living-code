import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "product-catalog",
  "title": "商品档案",
  "group": "库存商品",
  "domain": "inventory",
  "description": "维护在售商品的基础信息",
  "owner": "商品计划组",
  "metricLabel": "待处理事项",
  "metricValue": "20",
  "change": "较上周 +7.7%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
