import type { BusinessModuleDefinition } from '../../types'

export const moduleDefinition: BusinessModuleDefinition = {
  "slug": "payment-reconcile",
  "title": "回款核对",
  "group": "财务结算",
  "domain": "finance",
  "description": "匹配订单支付流水与银行回款",
  "owner": "财务共享组",
  "metricLabel": "本周处理量",
  "metricValue": "823",
  "change": "较上周 +7.9%",
  "columns": [
    "结算编号",
    "核对环节",
    "经办人员"
  ],
  "category": "财务"
}
