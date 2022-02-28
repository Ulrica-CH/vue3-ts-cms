import { createStore } from 'vuex'
import { IRootState } from './types'
import login from './login/login'
const store = createStore<IRootState>({
  state() {
    return {}
  },
  modules: {
    login
  }
})
//在login中进行vuex持久化
export function setupStore() {
  store.dispatch('login/LoadingStore')
}
export default store
