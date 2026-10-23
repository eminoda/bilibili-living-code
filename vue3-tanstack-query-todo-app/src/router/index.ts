import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/todo',
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import('../views/Todo.vue'),
  },
  {
    path: '/todo2',
    name: 'Todo2',
    component: () => import('../views/Todo2.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
