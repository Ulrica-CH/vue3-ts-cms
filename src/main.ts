import { createApp } from 'vue'
import App from './App.vue'
// 全局引入样式
import 'element-plus/dist/index.css'
import { registerApp } from './global'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import 'normalize.css'
import './assets/css/index.css'

import { setupStore } from './store'
const app = createApp(App)
registerApp(app)
app.use(store)
//设置vuex值
setupStore()
//页面刷新问题
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})
app.mount('#app')

// xyRequest.request({
//   url: 'home/multidata',
//   method: 'GET',
//   interceptors: {
//     requestIntercetpor: (config) => {
//       console.log('单例请求成功拦截')
//       return config
//     },
//     responseIntercetpor: (res) => {
//       console.log('单例响应成功拦截')
//       return res
//     }
//   }
// })
// interface DataType {
//   data: any
//   returnCode: string
//   success: number
// }
// xyRequest
//   .request<DataType>({
//     url: 'home/multidata',
//     method: 'GET'
//     //   showLoading: false
//   })
//   .then((res) => {
//     console.log(res.data)
//     console.log(res.returnCode)
//     console.log(res.success)
//   })
// xyRequest
//   .post({
//     url: '/login',
//     data: { name: 'coderwhy', password: '123456' }
//   })
//   .then((res) => console.log(res))
