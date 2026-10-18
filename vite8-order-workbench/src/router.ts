import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DashboardView from './features/dashboard/DashboardView.vue'
import type { BusinessModuleDefinition } from './modules/types'

// 这类同步注册在历史较长的后台项目中很常见：首访会加载整份路由模块图。
// 它也是本期要在 Chrome Network 中真实观察的模块请求来源。
const moduleViews = import.meta.glob<{ default: RouteRecordRaw['component'] }>(
  './modules/business/*/View.vue',
  { eager: true },
)
const moduleDefinitions = import.meta.glob<{ moduleDefinition: BusinessModuleDefinition }>(
  './modules/business/*/definition.ts',
  { eager: true },
)

export const businessModules = Object.values(moduleDefinitions)
  .map((entry) => entry.moduleDefinition)
  .sort((a, b) => a.group.localeCompare(b.group, 'zh-CN') || a.title.localeCompare(b.title, 'zh-CN'))

const businessRoutes: RouteRecordRaw[] = businessModules.map((item) => {
  const viewPath = `./modules/business/${item.slug}/View.vue`
  const view = moduleViews[viewPath]
  if (!view?.default) {
    throw new Error(`业务模块缺少页面：${viewPath}`)
  }
  return {
    path: `/module/${item.slug}`,
    name: item.slug,
    component: view.default,
    meta: { title: item.title, group: item.group },
  }
})

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/orders' },
    { path: '/orders', component: DashboardView, meta: { title: '订单运营工作台' } },
    ...businessRoutes,
  ],
})
