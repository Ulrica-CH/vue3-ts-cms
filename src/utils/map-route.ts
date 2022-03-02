import { RouteRecordRaw } from 'vue-router'
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
    // console.log(routes)
  }
  _recurseGetRoutes(userMenus)
  //   console.log(allRoutes)

  return routes
}
export function pathMapMenus(userMenus: any[], currentActive: string): any {
  // console.log(userMenus)
  // console.log(currentActive)

  for (const menu of userMenus) {
    if (menu.type === 1) {
      const findMenu = pathMapMenus(menu.children ?? [], currentActive)
      if (findMenu) {
        // console.log(findMenu)
        return findMenu
      }
    } else if (menu.type === 2 && menu.url === currentActive) {
      // console.log(menu)
      return menu
    }
  }
}
console.log(firstPath)

export { firstPath }
