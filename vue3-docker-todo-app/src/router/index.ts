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
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
  },
  {
    path: '/login2',
    name: 'Login2',
    component: () => import('../views/login/Login2.vue'),
  },
  {
    path: '/user-info',
    name: 'UserInfo',
    component: () => import('../views/UserInfo.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
