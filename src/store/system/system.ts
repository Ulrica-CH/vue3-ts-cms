import {
  deleteData,
  getPageListdata,
  createData,
  editData
} from '@/service/main/system/system'
import { Module } from 'vuex'
import { IRootState } from '../types'
import { ISystemState } from './types'

const system: Module<ISystemState, IRootState> = {
  namespaced: true,
  state() {
    return {
      usersList: [],
      usersCount: 0,
      roleList: [],
      roleCount: 0,
      goodsList: [],
      goodsCount: 0,
      menuList: [],
      menuCount: 0
    }
  },
  getters: {
    pageListData(state) {
      return (pageName: string) => {
        // switch (pageName) {
        //   case 'user':
        //     return state.userList
        //   case 'role':
        //     return state.roleList
        // }
        return (state as any)[`${pageName}List`]
      }
    },
    pageListCount(state) {
      return (pageName: string) => {
        return (state as any)[`${pageName}Count`]
      }
    }
  },
  mutations: {
    keepUsersList(state, list) {
      state.usersList = list
    },
    keepUsersCount(state, totalCount) {
      state.usersCount = totalCount
    },
    keepRoleList(state, list) {
      state.roleList = list
    },
    keepRoleCount(state, totalCount) {
      state.roleCount = totalCount
    },
    keepGoodsList(state, list) {
      state.goodsList = list
    },
    keepGoodsCount(state, totalCount) {
      state.goodsCount = totalCount
    },
    keepMenuList(state, list) {
      state.menuList = list
    },
    keepMenuCount(state, totalCount) {
      state.menuCount = totalCount
    }
  },
  actions: {
    //通用函数 根据传递的参数来发送不同请求
    async getPageAction({ commit }, payload: any) {
      // console.log(payload)
      const { pageName } = payload
      let pathUrl = ''
      switch (pageName) {
        case 'users':
          pathUrl = '/users/list'
          break
        case 'role':
          pathUrl = '/role/list'
          break
        case 'goods':
          pathUrl = '/goods/list'
          break
        case 'menu':
          pathUrl = '/menu/list'
          break
      }
      const queryInfo = payload.queryInfo
      const pageResult = await getPageListdata(pathUrl, queryInfo)
      const { list, totalCount } = pageResult.data
      commit(
        `keep${pageName.charAt(0).toUpperCase() + pageName.slice(1)}List`,
        list
      )
      commit(
        `keep${pageName.charAt(0).toUpperCase() + pageName.slice(1)}Count`,
        totalCount
      )
    },
    async deleteDataAction({ dispatch }, payload) {
      const { id, pageName } = payload
      const pathUrl = `/${pageName}/${id}`
      await deleteData(pathUrl)
      dispatch('getPageAction', {
        pageName,
        queryInfo: {
          offset: 0,
          size: 10
        }
      })
    },
    async createDataAction({ dispatch }, payload) {
      const { pageName, newData } = payload
      // console.log(pageName, newData)
      const pathUrl = `/${pageName}`
      await createData(pathUrl, newData)
      dispatch('getPageAction', {
        pageName,
        queryInfo: {
          offset: 0,
          size: 10
        }
      })
    },
    async editDataAction({ dispatch }, payload) {
      const { pageName, newData, id } = payload
      const pathUrl = `/${pageName}/${id}`
      await editData(pathUrl, newData)
      dispatch('getPageAction', {
        pageName,
        queryInfo: {
          offset: 0,
          size: 10
        }
      })
    }
  }
}
export default system
