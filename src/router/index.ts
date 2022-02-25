import { createRouter, createWebHashHistory } from 'vue-router'
// import { RouteRecordRaw } from 'vue-router'
// type指明导入的是一个类型，可以不写
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/login/login.vue') },
  { path: '/main', component: () => import('@/views/main/main.vue') }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})
export default router
