import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "damaged-goods",
  "title": "残损处理",
  "group": "库存商品",
  "domain": "inventory",
  "description": "追踪残损商品的核验与处置",
  "owner": "商品计划组",
  "metricLabel": "待处理事项",
  "metricValue": "29",
  "change": "较上周 -5.6%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
