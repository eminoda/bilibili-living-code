import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/history' },
    { path: '/history', component: () => import('./pages/HistoryPage.vue') },
    { path: '/workspace', component: () => import('./pages/WorkspacePage.vue') },
    { path: '/worker', component: () => import('./pages/WorkerPage.vue') },
  ],
})
