import { createStore, useStore as useVuexStore, Store } from 'vuex'
import type { IRootState, IStoreState } from './types'
import login from './login/login'
import system from './system/system'
const store = createStore<IRootState>({
  state() {
    return {}
  },
  modules: {
    login,
    system
  }
})
//在login中进行vuex持久化
export function setupStore() {
  store.dispatch('login/LoadingStore')
}
//自己创建函数返回Store类型 Store为定义好的交叉类型
export function useStore(): Store<IStoreState> {
  return useVuexStore()
}
export default store
