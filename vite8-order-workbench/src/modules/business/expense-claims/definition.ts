import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "expense-claims",
  "title": "费用报销",
  "group": "财务结算",
  "domain": "finance",
  "description": "审核运营活动与仓配费用",
  "owner": "财务共享组",
  "metricLabel": "待处理事项",
  "metricValue": "15",
  "change": "较上周 -7.0%",
  "columns": [
    "结算编号",
    "核对环节",
    "经办人员"
  ],
  "category": "财务"
}
