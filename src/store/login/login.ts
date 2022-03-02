import { Module } from 'vuex'
import { IRootState } from '../types'
import { ILoginState } from './types'
import {
  avatarLoginRequest,
  requestUserInfoById,
  requestUserMenusByRoleId
} from '@/service/login/login'
import { IAvatar } from '@/service/login/types'
import router from '@/router'
//导入封装的本地存储方法
import local from '../../utils/cache'
//导入菜单映射路由的方法
import { mapMenusToRoutes } from '@/utils/map-route'
//注意模块中写法 Module有两个必传类型参数
const LoginModule: Module<ILoginState, IRootState> = {
  namespaced: true,
  state() {
    return {
      token: '',
      userInfo: {},
      userMenus: []
    }
  },
  mutations: {
    keepToken(state, token: string) {
      state.token = token
    },
    keepUserInfo(state, userInfo: any) {
      state.userInfo = userInfo
    },
    keepUserMenus(state, userMenus: any) {
      state.userMenus = userMenus
      //菜单映射路由
      const routes = mapMenusToRoutes(userMenus)
      //将路由对象添加到main的children中
      routes.forEach((route) => {
        //记得main路由对象里一定有个name不然不会添加到children中
        router.addRoute('main', route)
      })
    }
  },
  actions: {
    async avatarLoginAction({ commit }, payload: IAvatar) {
      const loginResult = await avatarLoginRequest(payload)
      //为什么要传递泛型，不传递loginRes为unknown类型，获取不到data
      const { id, token } = loginResult.data
      commit('keepToken', token)
      local.setCache('token', token)

      //请求用户信息
      const userInfoResult = await requestUserInfoById(id)
      const userInfo = userInfoResult.data
      commit('keepUserInfo', userInfo)
      local.setCache('userInfo', userInfo)

      //获取用户菜单
      //通过用户信息里的role.id来获取用户菜单
      //因为每个用户权限不同，菜单也就不同
      const userMenusResult = await requestUserMenusByRoleId(userInfo.role.id)
      const userMenus = userMenusResult.data
      commit('keepUserMenus', userMenus)
      local.setCache('userMenus', userMenus)

      //跳转到首页
      router.push('/main')
    },
    //获取localStorage数据存到vuex以持久化vuex
    LoadingStore({ commit }) {
      const token = local.getCache('token')
      if (token) {
        commit('keepToken', token)
      }
      const userInfo = local.getCache('userInfo')
      if (token) {
        commit('keepUserInfo', userInfo)
      }
      const userMenus = local.getCache('userMenus')
      if (token) {
        commit('keepUserMenus', userMenus)
      }
    }

    // phoneLoginAction({ commit }, payload: IAvatar) {
    //   console.log('执行avatarLoginAction', payload)
    // },
  }
}
export default LoginModule
