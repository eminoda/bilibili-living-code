import { createRouter, createWebHistory } from 'vue-router'

import ExamplesView from '@/views/ExamplesView.vue'
import CasesView from '@/views/CasesView.vue'
import AdminPageView from '@/views/AdminPageView.vue'
import QuickstartView from '@/views/QuickstartView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/quickstart' },
    { path: '/quickstart', component: QuickstartView, meta: { title: '快速开始' } },
    { path: '/cases', component: CasesView, meta: { title: '案例' } },
    { path: '/admin', component: AdminPageView, meta: { title: '后管页面' } },
    { path: '/examples', component: ExamplesView, meta: { title: '示例' } },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
