import { createStore, useStore as useVuexStore, Store } from 'vuex'
import type { IRootState, IStoreState } from './types'
import login from './login/login'
import system from './system/system'
import { getPageListdata } from '@/service/main/system/system'
const store = createStore<IRootState>({
  state() {
    return {
      entireDepartmentList: [],
      entireRoleList: []
    }
  },
  mutations: {
    keepDepartmentList(state, departmentList) {
      state.entireDepartmentList = departmentList
    },
    keepRoleList(state, roleList) {
      state.entireRoleList = roleList
    }
  },
  actions: {
    async getInitialDataAction({ commit }) {
      const departmentResult = await getPageListdata('/department/list', {
        offset: 0,
        size: 500
      })
      const { list: departmentList } = departmentResult.data

      const roleResult = await getPageListdata('/role/list', {
        offset: 0,
        size: 500
      })
      const { list: roleList } = roleResult.data
      commit('keepDepartmentList', departmentList)
      commit('keepRoleList', roleList)
    }
  },
  modules: {
    login,
    system
  }
})
//在login中进行vuex持久化
export function setupStore() {
  store.dispatch('login/LoadingStore')
  store.dispatch('getInitialDataAction')
}
//自己创建函数返回Store类型 Store为定义好的交叉类型
export function useStore(): Store<IStoreState> {
  return useVuexStore()
}
export default store
