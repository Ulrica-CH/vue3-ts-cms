import { createApp } from 'vue'
import App from './App.vue'
// 全局引入样式
import 'element-plus/dist/index.css'
import { registerApp } from './global'
import { xyRequest } from './service'
import router from './router'
import store from './store'
const app = createApp(App)
registerApp(app)
app.use(router).use(store).mount('#app')
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
interface DataType {
  data: any
  returnCode: string
  success: number
}
xyRequest
  .request<DataType>({
    url: 'home/multidata',
    method: 'GET'
    //   showLoading: false
  })
  .then((res) => {
    console.log(res.data)
    console.log(res.returnCode)
    console.log(res.success)
  })
