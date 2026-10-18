import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "stock-counts",
  "title": "盘点任务",
  "group": "库存商品",
  "domain": "inventory",
  "description": "管理仓库周期盘点与差异复核",
  "owner": "商品计划组",
  "metricLabel": "本周处理量",
  "metricValue": "602",
  "change": "较上周 -12.2%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
