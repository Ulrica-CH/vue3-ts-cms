import { createRouter, createWebHashHistory } from 'vue-router'
// import { RouteRecordRaw } from 'vue-router'
// type指明导入的是一个类型，可以不写
import type { RouteRecordRaw } from 'vue-router'
import local from '@/utils/cache'
import { firstPath } from '@/utils/map-route'
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/main' },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue')
    // children: [
    //   { path: 'ususu', component: () => import('../views/login/ususu.vue') }
    // ]
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/main.vue')
  }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})
const ususu = {
  path: '/ususu',
  component: () => import('../views/login/ususu.vue')
}
router.addRoute('login', ususu)
router.beforeEach((to) => {
  if (to.path !== '/login') {
    const token = local.getCache('token')
    //没有token就是没有登录 那么跳转除了/login这个页面都要到login页面进行登录
    if (!token) {
      return '/login'
    }
  }
  if (to.path === '/main') {
    return firstPath.url
  }
})
export default router
