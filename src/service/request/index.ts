import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { XYRequestConfig, XYRequestInterceptors } from './type'
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

const DEFAULT_LOADING = true
class axiosRequest {
  // 如果不同环境下不同配置，比如使用不同的BASE_URL该怎么办
  // 可以使用axios.create来创建实例，并传入不同配置加以区分不同环境
  // 类型都是axios定义好的
  instance: AxiosInstance
  Interceptors?: XYRequestInterceptors
  loading?: LoadingInstance
  showLoading?: boolean
  constructor(config: XYRequestConfig) {
    //创建axios实例
    this.instance = axios.create(config)
    // 保存信息
    this.Interceptors = config.interceptors
    this.showLoading = config.showLoading ?? DEFAULT_LOADING
    // 请求拦截器，执行config.interceptors传递过来的方法
    // 传递过来，最终还是通过axios实例instance来使用
    this.instance.interceptors.request.use(
      this.Interceptors?.requestInterceptor,
      this.Interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.Interceptors?.responseInterceptor,
      this.Interceptors?.requestInterceptorCatch
    )

    //全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // console.log('全局请求成功拦截器')
        // console.log(this.showLoading)
        // 判断是否加载Loading
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            background: 'rgba(0,0,0,.5)',
            text: '加载中...'
          })
        }

        return config
      },
      (err) => {
        console.log('全局请求失败拦截')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        // console.log('全局响应成功拦截器')
        // 移除Loading
        this.loading?.close()
        const data = res.data
        // 伪代码 具体要看实际项目接口
        // if (data.returnCode === '-1001') {
        //   console.log('请求失败')
        // } else {
        return data
        // }
      },
      (err) => {
        // console.log('全局响应失败拦截')
        // 移除Loading
        this.loading?.close()
        if (err.response.status === 404) {
          console.log('请求页面不存在')
        }
        return err
      }
    )
  }
  request<T>(config: XYRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 1.单个请求对数据的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      // 2.判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          // 2.将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEFAULT_LOADING

          // 3.将结果resolve返回出去
          resolve(res)
        })
        .catch((err) => {
          // 2.将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEFAULT_LOADING
          reject(err)
          return err
        })
    })
  }
  get<T>(config: XYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  post<T>(config: XYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T>(config: XYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T>(config: XYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
export { axiosRequest }
