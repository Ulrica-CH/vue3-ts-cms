//service文件出口
import { axiosRequest } from './request'
import { BASE_URL, TIME_OUT } from './request/config'

import local from '../utils/cache'
export const xyRequest = new axiosRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      const token = local.getCache('token')
      if (token) {
        //注意这里 不写会报错说config.headers可能为undefined
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.Authorization = `Bearer ${token}`
      }
      // console.log('自定义拦截器请求成功拦截')
      return config
    },
    requestInterceptorCatch: (err) => {
      // console.log('请求失败拦截成功')
      return err
    },
    responseInterceptor: (res) => {
      // console.log('自定义拦截器响应成功拦截')
      return res
    },
    responseInterceptorCatch: (err) => {
      // console.log('响应失败拦截成功')
      return err
    }
  }
  // showLoading: false
})
// export const xyRequest2 = new axiosRequest({})
