import { RouteRecordRaw } from 'vue-router'
import { IBreadCrumbs } from '@/base-ui/breadcrumb/types'
let firstPath: any = ''
export function mapMenusToRoutes(userMenus: any): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  //先加载默认全部的routes
  const allRoutes: RouteRecordRaw[] = []
  //require.context webpack中读取文件的方法
  const routerFiles = require.context('../router/main', true, /\.ts/)
  routerFiles.keys().forEach((key) => {
    const route = require('../router/main' + key.split('.')[1])
    allRoutes.push(route.default)
  })

  //根据菜单匹配需要的routes
  function _recurseGetRoutes(menus: any[]) {
    for (const menu of menus) {
      if (menu.type === 2) {
        const route = allRoutes.find((route) => route.path === menu.url)
        if (route) {
          routes.push(route)
        }
        if (!firstPath) {
          firstPath = menu
        }
      } else {
        _recurseGetRoutes(menu.children)
      }
    }
  }
  _recurseGetRoutes(userMenus)
  return routes
}
export function pathMapBread(userMenus: any[], path: string): any {
  const breadCrumb: IBreadCrumbs[] = []
  //相同逻辑代码封装到一个函数里，通过传递参数来进行判断
  pathMapMenus(userMenus, path, breadCrumb)
  return breadCrumb
}
export function pathMapMenus(
  userMenus: any[],
  currentActive: string,
  breadCrumb?: IBreadCrumbs[]
): any {
  // console.log(userMenus)
  // console.log(currentActive)

  for (const menu of userMenus) {
    if (menu.type === 1) {
      const findMenu = pathMapMenus(menu.children ?? [], currentActive)
      if (findMenu) {
        if (breadCrumb) {
          breadCrumb.push({ name: menu.name })
          breadCrumb.push({ name: findMenu.name })
        }
        return findMenu
      }
    } else if (menu.type === 2 && menu.url === currentActive) {
      // console.log(menu)
      return menu
    }
  }
}
export { firstPath }
