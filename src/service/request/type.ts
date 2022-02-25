import type { AxiosRequestConfig, AxiosResponse } from 'axios'
//定义接口为拦截器intercetpors做准备
export interface XYRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => any
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (err: any) => any
}
// 定义接口继承AxiosRequestConfig
export interface XYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: XYRequestInterceptors<T>
  showLoading?: boolean
}
