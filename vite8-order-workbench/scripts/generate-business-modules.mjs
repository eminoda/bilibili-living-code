import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const modulesRoot = path.join(projectRoot, 'src', 'modules', 'business')

// 真实后台常见的业务域和页面。每个页面都有可访问的路由、权限说明与表格数据。
const groups = [
  {
    group: '订单中心', domain: 'orders', category: '订单', owner: '订单运营组', role: '订单专员',
    columns: ['业务单号', '处理节点', '负责人'],
    pages: [
      ['order-review', '订单审核', '核对新订单的支付、地址与风控状态'],
      ['batch-dispatch', '批量发货', '汇总待发货订单并生成出库批次'],
      ['refund-approval', '退款审批', '处理待确认的退款与退货申请'],
      ['exception-orders', '异常订单', '跟进超时、缺货及地址异常订单'],
      ['presale-orders', '预售订单', '查看预售尾款与履约进度'],
      ['channel-orders', '渠道订单', '统一查看各平台的订单流转'],
      ['order-adjustments', '订单改价', '复核优惠调整与人工改价记录'],
      ['address-corrections', '地址修正', '处理收货地址变更与拦截申请'],
      ['invoice-orders', '订单开票', '关联订单与企业开票需求'],
      ['order-cancellations', '订单取消', '处理取消申请与库存回退'],
      ['group-purchase', '团购订单', '查看团购订单的成团与履约状态'],
      ['subscription-orders', '订阅订单', '管理周期配送订单与扣款计划'],
    ],
  },
  {
    group: '履约物流', domain: 'fulfillment', category: '物流', owner: '仓配协同组', role: '仓配专员',
    columns: ['履约单号', '当前节点', '负责仓库'],
    pages: [
      ['outbound-waves', '出库波次', '按仓库与截单时间安排拣货波次'],
      ['delivery-signoff', '物流签收', '追踪派送与客户签收状态'],
      ['delivery-exceptions', '配送异常', '处理揽收延迟与运输异常'],
      ['warehouse-sla', '仓配时效', '监控订单从付款到出库的时效'],
      ['shipping-labels', '面单管理', '核对电子面单与承运商信息'],
      ['cross-warehouse', '跨仓调拨', '协调异地仓库存与转运任务'],
      ['carrier-settlement', '承运结算', '核对承运商运费与附加费用'],
      ['delivery-routing', '配送路由', '维护区域配送线路与覆盖范围'],
      ['pickup-schedule', '揽收排班', '安排承运商上门揽收时间'],
      ['return-logistics', '逆向物流', '追踪退货取件与返仓节点'],
      ['warehouse-capacity', '仓库产能', '观察仓库日处理量与积压情况'],
      ['package-tracking', '包裹追踪', '汇总包裹轨迹与客户签收反馈'],
    ],
  },
  {
    group: '库存商品', domain: 'inventory', category: '库存', owner: '商品计划组', role: '库存专员',
    columns: ['商品编码', '处理状态', '所属仓库'],
    pages: [
      ['stock-alerts', '库存预警', '查看低于安全水位的商品'],
      ['safety-stock', '安全库存', '维护仓库与渠道的库存阈值'],
      ['product-catalog', '商品档案', '维护在售商品的基础信息'],
      ['listing-control', '上下架管理', '审核渠道商品的上架计划'],
      ['purchase-receipts', '采购到货', '核对采购单和仓库收货记录'],
      ['lot-expiry', '批次效期', '追踪批次商品的到期风险'],
      ['stock-reservation', '库存预占', '核对促销订单的库存锁定情况'],
      ['stock-counts', '盘点任务', '管理仓库周期盘点与差异复核'],
      ['supplier-catalog', '供应商档案', '维护供应商资质和供货范围'],
      ['product-pricing', '商品定价', '审核渠道价格与促销底价'],
      ['bundle-products', '组合商品', '维护商品组合与拆单规则'],
      ['damaged-goods', '残损处理', '追踪残损商品的核验与处置'],
    ],
  },
  {
    group: '客户经营', domain: 'customers', category: '客户', owner: '客户经营组', role: '客户运营',
    columns: ['客户编号', '经营动作', '所属顾问'],
    pages: [
      ['customer-segments', '客户分层', '按消费频次与最近购买划分客群'],
      ['loyalty-points', '会员积分', '核对积分入账与过期提醒'],
      ['campaign-offers', '活动优惠', '查看优惠券投放与核销进度'],
      ['repeat-purchase', '复购分析', '跟踪重点客群的复购表现'],
      ['complaint-followup', '客诉跟进', '汇总投诉处理与回访进度'],
      ['customer-tags', '客户标签', '维护客户标签与使用范围'],
      ['member-levels', '会员等级', '查看会员成长值与等级变更'],
      ['customer-coupons', '优惠券账户', '处理优惠券发放和核销异常'],
      ['service-tickets', '客户工单', '分派客户咨询与服务请求'],
      ['message-campaigns', '消息触达', '查看短信和站内信的触达结果'],
      ['customer-lifecycle', '客户生命周期', '跟踪新客、活跃与流失状态'],
      ['visit-reports', '回访记录', '登记重点客户的回访任务'],
    ],
  },
  {
    group: '财务结算', domain: 'finance', category: '财务', owner: '财务共享组', role: '财务专员',
    columns: ['结算编号', '核对环节', '经办人员'],
    pages: [
      ['payment-reconcile', '回款核对', '匹配订单支付流水与银行回款'],
      ['refund-reconcile', '退款对账', '核验退款记录与渠道账单'],
      ['platform-statements', '平台账单', '汇总各平台日结账单'],
      ['invoice-requests', '开票申请', '审核企业客户的发票资料'],
      ['cost-allocation', '费用分摊', '分摊渠道与仓配履约成本'],
      ['monthly-close', '月度结算', '查看月结任务与未完成事项'],
      ['merchant-payouts', '商家打款', '审核合作商家的结算付款'],
      ['cashflow-monitor', '现金流监控', '查看日度收支与风险提醒'],
      ['tax-documents', '税务资料', '整理税务申报与凭证信息'],
      ['commission-rules', '佣金规则', '维护渠道服务费和佣金计算'],
      ['credit-notes', '红字发票', '处理发票冲红与重新开具'],
      ['expense-claims', '费用报销', '审核运营活动与仓配费用'],
    ],
  },
  {
    group: '运营分析', domain: 'analytics', category: '分析', owner: '经营分析组', role: '分析师',
    columns: ['分析任务', '观察指标', '负责人'],
    pages: [
      ['channel-conversion', '渠道转化', '比较渠道访问、下单和支付转化'],
      ['store-performance', '门店业绩', '对比各门店的销售与履约表现'],
      ['regional-targets', '区域目标', '跟踪区域销售目标完成情况'],
      ['category-performance', '品类表现', '查看重点品类的营收与毛利'],
      ['service-quality', '服务质量', '监控响应时长与客诉闭环'],
      ['daily-operations', '经营日报', '生成跨部门的经营日报'],
      ['sales-forecast', '销售预测', '评估未来周期的销售目标'],
      ['cohort-analysis', '客群分析', '观察不同客群的购买变化'],
      ['fulfillment-score', '履约评分', '按区域和仓库统计履约质量'],
      ['promotion-results', '促销复盘', '比较活动期间订单和利润变化'],
      ['category-margin', '品类毛利', '查看品类成本与毛利趋势'],
      ['operations-calendar', '运营日历', '对齐活动、库存与结算节点'],
    ],
  },
]

let index = 0
for (const group of groups) {
  for (const [slug, title, description] of group.pages) {
    index += 1
    const folder = path.join(modulesRoot, slug)
    await mkdir(folder, { recursive: true })
    const seed = 100 + index * 17
    const definition = `import type { BusinessModuleDefinition } from '../../types'\n\nexport const moduleDefinition: BusinessModuleDefinition = ${JSON.stringify({
      slug, title, group: group.group, domain: group.domain, description, owner: group.owner,
      metricLabel: index % 3 === 0 ? '待处理事项' : '本周处理量',
      metricValue: index % 3 === 0 ? String(12 + index % 19) : String(186 + index * 13),
      change: `较上周 ${index % 4 === 0 ? '-' : '+'}${2 + index % 11}.${index % 10}%`,
      columns: group.columns, category: group.category,
    }, null, 2)}\n`
    const access = `import type { BusinessModuleAccess } from '../../types'\n\nexport const moduleAccess: BusinessModuleAccess = ${JSON.stringify({
      role: group.role,
      scope: index % 2 === 0 ? '全部直营网点' : '区域与授权门店',
      reviewCycle: index % 3 === 0 ? '每周复核' : '每日复核',
    }, null, 2)}\n`
    const records = `import { createBusinessRows } from '../../createBusinessRows'\n\nexport const rows = createBusinessRows(${JSON.stringify(group.category)}, ${JSON.stringify(title)}, ${seed})\n`
    const workbench = {
      orders: 'OrdersWorkbench',
      fulfillment: 'FulfillmentWorkbench',
      inventory: 'InventoryWorkbench',
      customers: 'CustomerWorkbench',
      finance: 'FinanceWorkbench',
      analytics: 'AnalyticsWorkbench',
    }[group.domain]
    const view = `<script setup lang="ts">\nimport ${workbench} from '../../domains/${group.domain}/${workbench}.vue'\nimport { moduleDefinition } from './definition'\nimport { moduleAccess } from './access'\nimport { rows } from './records'\n</script>\n\n<template>\n  <${workbench} :definition="moduleDefinition" :access="moduleAccess" :rows="rows" />\n</template>\n`
    await Promise.all([
      writeFile(path.join(folder, 'definition.ts'), definition),
      writeFile(path.join(folder, 'access.ts'), access),
      writeFile(path.join(folder, 'records.ts'), records),
      writeFile(path.join(folder, 'View.vue'), view),
    ])
  }
}

process.stdout.write(`Generated ${index} functional business modules in ${modulesRoot}\n`)
