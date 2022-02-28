import { createRouter, createWebHashHistory } from 'vue-router'
// import { RouteRecordRaw } from 'vue-router'
// type指明导入的是一个类型，可以不写
import type { RouteRecordRaw } from 'vue-router'
import local from '@/utils/cache'
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/main' },
  { path: '/login', component: () => import('@/views/login/login.vue') },
  { path: '/main', component: () => import('@/views/main/main.vue') }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})
router.beforeEach((to) => {
  if (to.path !== '/login') {
    const token = local.getCache('token')
    //没有token就是没有登录 那么跳转除了/login这个页面都要到login页面进行登录
    if (!token) {
      return '/login'
    }
  }
})
export default router
