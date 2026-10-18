import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "stock-alerts",
  "title": "库存预警",
  "group": "库存商品",
  "domain": "inventory",
  "description": "查看低于安全水位的商品",
  "owner": "商品计划组",
  "metricLabel": "本周处理量",
  "metricValue": "511",
  "change": "较上周 +5.5%",
  "columns": [
    "商品编码",
    "处理状态",
    "所属仓库"
  ],
  "category": "库存"
}
