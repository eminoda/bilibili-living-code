import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "platform-statements",
  "title": "平台账单",
  "group": "财务结算",
  "domain": "finance",
  "description": "汇总各平台日结账单",
  "owner": "财务共享组",
  "metricLabel": "待处理事项",
  "metricValue": "25",
  "change": "较上周 +9.1%",
  "columns": [
    "结算编号",
    "核对环节",
    "经办人员"
  ],
  "category": "财务"
}
