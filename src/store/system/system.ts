import { getPageListdata } from '@/service/main/system/system'
import { Module } from 'vuex'
import { IRootState } from '../types'
import { ISystemState } from './types'

const system: Module<ISystemState, IRootState> = {
  namespaced: true,
  state() {
    return {
      userList: [],
      userCount: 0,
      roleList: [],
      roleCount: 0
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
    }
  },
  mutations: {
    keepUserList(state, list) {
      state.userList = list
    },
    keepRoleList(state, list) {
      state.roleList = list
    },
    keepUserCount(state, totalCount) {
      state.userCount = totalCount
    },
    keepRoleCount(state, totalCount) {
      state.roleCount = totalCount
    }
  },
  actions: {
    //通用函数 根据传递的参数来发送不同请求
    async getPageAction({ commit }, payload: any) {
      const { pageName } = payload
      let pathUrl = ''
      switch (pageName) {
        case 'user':
          pathUrl = '/users/list'
          break
        case 'role':
          pathUrl = '/role/list'
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
    }
  }
}
export default system
