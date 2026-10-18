import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "credit-notes",
  "title": "红字发票",
  "group": "财务结算",
  "domain": "finance",
  "description": "处理发票冲红与重新开具",
  "owner": "财务共享组",
  "metricLabel": "本周处理量",
  "metricValue": "953",
  "change": "较上周 +6.9%",
  "columns": [
    "结算编号",
    "核对环节",
    "经办人员"
  ],
  "category": "财务"
}
