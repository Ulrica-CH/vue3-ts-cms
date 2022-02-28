# 一、封装

## 为什么进行封装

- 1、如果后续依赖度第三方库要更改，那么不封装的话，项目的很多地方需要一次进行修改，如果封装，只需改下封装文件里的相关库依赖，比如以前依赖aaaa库，以后依赖bbbb库，那么只需在封装文件里进行更改就可以。
- 2、在网络请求中，需要进行操作，比如加上token，请求中加上动画显示等等，统一在封装文件里配置省时省力
- 3、利于后期维护

## 封装思想

- 1、各个文件目录清晰，每个文件夹都应该有个统一出口文件index.ts
- 2、对不同功能模块进行单独抽离，在引入到统一出口文件进行导出使用，如下方截图：

![](http://cdn.michstabe.cn/blog/20220225093603.png)

- service文件夹负责网络、服务相关模块
- service -> index.ts就是统一接口文件
- service -> request文件夹就是负责网络请求模块
- service -> request -> index.ts负责网络请求的具体逻辑导出在service -> index.ts中导入并导出，最终在各个组件中使用来进行网络请求
- **代码都差不多，主要就是封装思想**

## 封装问题一：不同环境不同变量

```js
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
class axiosRequest {
  // 如果不同环境下不同配置，比如使用不同的BASE_URL该怎么办
  // 可以使用axios.create来创建实例，并传入不同配置加以区分不同环境
  // 类型都是axios定义好的
  instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
  }
}
export { axiosRequest }
```

## 封装问题二：变量不要写死，在文件中定义并引入

```js
//service文件出口
import { axiosRequest } from './request'
import { BASE_URL, TIME_OUT } from './request/config'
export const xyRequest = new axiosRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})
export const xyRequest2 = new axiosRequest({})
```

```ts
// service -> request -> config.ts
let BASE_URL = ''
const TIME_OUT = 10000

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://123.207.32.32:8000/'
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'http://coderwhy.org/prod'
} else {
  BASE_URL = 'http://coderwhy.org/test'
}

export { BASE_URL, TIME_OUT }

```

## 测试使用

```ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
class axiosRequest {
  instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
  }
  request(config: AxiosRequestConfig): void {
    this.instance.request(config).then((res) => console.log(res))
  }
}
export { axiosRequest }
```

```ts
import { xyRequest } from './service'
xyRequest.request({
  url: 'home/multidata',
  method: 'GET'
})
```

打印台可以获取到结果。

## 究极封装 - 拦截器

不同的对象或者方法，对于拦截器的配置可能是不一样的，有的需要token+loading，有的需要loading等等

为了更好地拓展，我们在传入配置时，应该传入我们需要的拦截器配置，而不是写死的。

```js
export const xyRequest = new axiosRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})
```

比如在这里，我们可以传递一个interCeptor属性来配置这个实例对象中的的拦截器

但是直接传递会报错，因为config属于axiosRequestConfig这个类型，而这个类型中没有对应的属性

![](http://cdn.michstabe.cn/blog/20220225111111.png)

所以我们需要自己去定义一个类型来继承axiosRequestConfig类型

```ts
// 定义接口继承AxiosRequestConfig,拓展方法
interface XYRequestConfig extends AxiosRequestConfig {
  interceptors?: XYRequestInterceptors
}
```

定义一个XYRequestInterceptors类型

```ts
//定义接口为拦截器intercetpors做准备
interface XYRequestInterceptors {
  requestIntercetpor?: (config: AxiosRequestConfig) => any
  requestIntercetporCatch?: (err: any) => any
  responseIntercetpor?: (res: AxiosResponse) => any
  responseIntercetporCatch?: (err: any) => any
}
```

修改config的类型

```js
constructor(config: XYRequestConfig) {
    this.instance = axios.create(config)
    }
```

这样就可以传递一个interceptors属性了

```ts
//service文件出口
import { axiosRequest } from './request'
import { BASE_URL, TIME_OUT } from './request/config'
export const xyRequest = new axiosRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestIntercetpor: (config) => {
      console.log('请求拦截成功')
      return config
    },
    requestIntercetporCatch: (err) => {
      console.log('请求失败拦截成功')
      return err
    },
    responseIntercetpor: (res) => {
      console.log('响应拦截成功')
      return res
    },
    responseIntercetporCatch: (err) => {
      console.log('响应失败拦截成功')
      return err
    }
  }
})

```

在类中进行实现：

```ts
class axiosRequest {
  instance: AxiosInstance
  // 可选的
  intercetpors?: XYRequestInterceptors
  constructor(config: XYRequestConfig) {
    this.instance = axios.create(config)
    // 拿到配置里的intercetpors属性并赋值
    this.intercetpors = config.interceptors
    // 请求拦截器，执行config.interceptors传递过来的方法
    // 传递过来，最终还是通过axios示例来使用
    this.instance.interceptors.request.use(
      this.intercetpors?.requestIntercetpor,
      this.intercetpors?.requestIntercetporCatch
    )
    this.instance.interceptors.response.use(
      this.intercetpors?.responseIntercetpor,
      this.intercetpors?.requestIntercetporCatch
    )
  }
  request(config: XYRequestConfig): void {
    this.instance.request(config).then((res) => console.log(res))
  }
}
```

这样整个逻辑就打通了

- 1、自己扩展一个类型来实现自定义拦截器的配置
- 2、实现一个接口来进行拦截器的具体操作
- 3、axios实例调用传递过来的方法进行拦截操作

抽离：

```ts
request -> type.ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
//定义接口为拦截器intercetpors做准备
export interface XYRequestInterceptors {
  requestIntercetpor?: (config: AxiosRequestConfig) => any
  requestIntercetporCatch?: (err: any) => any
  responseIntercetpor?: (res: AxiosResponse) => any
  responseIntercetporCatch?: (err: any) => any
}
// 定义接口继承AxiosRequestConfig
export interface XYRequestConfig extends AxiosRequestConfig {
  interceptors?: XYRequestInterceptors
}
```

现在对于不同环境创建不同的实例对象new axiosRequest()就可以传递不同的拦截器了

但是如果每个实例都需要一样的拦截器就需要全局的拦截器

```ts
class axiosRequest {
  // 如果不同环境下不同配置，比如使用不同的BASE_URL该怎么办
  // 可以使用axios.create来创建实例，并传入不同配置加以区分不同环境
  // 类型都是axios定义好的
  instance: AxiosInstance
  intercetpors?: XYRequestInterceptors
  constructor(config: XYRequestConfig) {
    this.instance = axios.create(config)
    // 拿到配置里的intercetpors属性并赋值
    this.intercetpors = config.interceptors
    // 请求拦截器，执行config.interceptors传递过来的方法
    // 传递过来，最终还是通过axios实例instance来使用
    this.instance.interceptors.request.use(
      this.intercetpors?.requestIntercetpor,
      this.intercetpors?.requestIntercetporCatch
    )
    this.instance.interceptors.response.use(
      this.intercetpors?.responseIntercetpor,
      this.intercetpors?.requestIntercetporCatch
    )

    //全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('全局请求成功拦截器')
        return config
      },
      (err) => {
        console.log('全局请求失败拦截')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        console.log('全局响应成功拦截器')
        return res
      },
      (err) => {
        console.log('全局响应失败拦截')
        return err
      }
    )
  }
  request(config: XYRequestConfig): void {
    this.instance.request(config).then((res) => console.log(res))
  }
}
```

每个实例的方法也可以有自己的拦截器

```ts
xyRequest.request({
  url: 'home/multidata',
  method: 'GET',
  interceptors: {
    requestIntercetpor: (config) => {
      console.log('单例请求成功拦截')
      return config
    },
    responseIntercetpor: (res) => {
      console.log('单例响应成功拦截')
      return res
    }
  }
})
```

那么在方法中就要进行判断

```ts
request(config: XYRequestConfig): void {
    if (config.interceptors?.requestIntercetpor) {
      config = config.interceptors.requestIntercetpor(config)
    }
    this.instance.request(config).then((res) => {
      if (config.interceptors?.responseIntercetpor) {
        res = config.interceptors.responseIntercetpor(res)
        console.log(res)
      }
    })
  }
```

![](http://cdn.michstabe.cn/blog/20220225144016.png)

### 错误判断/处理

对网络请求失败的情况有两种判断方式

1、HTTP状态码

2、类似返回data里的returnCode

```ts
this.instance.interceptors.response.use(
      (res) => {
        console.log('全局响应成功拦截器')
        // 伪代码 具体要看实际项目接口
        if (res.data.data.returnCode === '-1001') {
          console.log('请求失败')
        } else {
          return res.data.data
        }
      },
      (err) => {
        console.log('全局响应失败拦截')
        if (err.response.status === 404) {
          console.log('请求页面不存在')
        }
        return err
      }
    )
```

### 添加一个请求中Loading动画

```ts
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

// 省略了不相关的代码
class axiosRequest {
  loading?: LoadingInstance
    //全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('全局请求成功拦截器')
        this.loading = ElLoading.service({
          lock: true,
          background: 'rgba(0,0,0,.5)',
          text: '加载中...'
        })
        return config
      },
      (err) => {
        console.log('全局请求失败拦截')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        console.log('全局响应成功拦截器')
        this.loading?.close()
        // 伪代码 具体要看实际项目接口
        if (res.data.data.returnCode === '-1001') {
          console.log('请求失败')
        } else {
          return res.data.data
        }
      },
      (err) => {
        console.log('全局响应失败拦截')
        if (err.response.status === 404) {
          console.log('请求页面不存在')
        }
        return err
      }
    )
  }

```

这样在请求时就会加载动画，成功时去除动画

但是这是全局的，每次请求都会加载，如果想自己控制呢？

拓展一个可选showLoading属性

```ts
export interface XYRequestConfig extends AxiosRequestConfig {
  interceptors?: XYRequestInterceptors
  showLoading?: boolean
}
```

```ts
// 省略不必要代码
instance: AxiosInstance
intercetpors?: XYRequestInterceptors
loading?: LoadingInstance
showLoading?: boolean

this.showLoading = config.showLoading ?? DEFAULT_LOADING

this.instance.interceptors.request.use(
      (config) => {
        console.log('全局请求成功拦截器')
        console.log(this.showLoading)
        // 判断是否显示Loading
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
        console.log('全局响应成功拦截器')
        // 移除Loading
        this.loading?.close()
        // 伪代码 具体要看实际项目接口
        if (res.data.data.returnCode === '-1001') {
          console.log('请求失败')
        } else {
          return res.data.data
        }
      },
      (err) => {
        console.log('全局响应失败拦截')
        // 移除Loading
        this.loading?.close()
        if (err.response.status === 404) {
          console.log('请求页面不存在')
        }
        return err
      }
    )
```

这样可以通过全局配置showLoading来控制是否显示

但是如果想通过实例的方法来控制呢？

```ts
xyRequest.request({
  url: 'home/multidata',
  method: 'GET',
  showLoading: false
})
```

```ts
request(config: XYRequestConfig): void {
    if (config.interceptors?.requestIntercetpor) {
      config = config.interceptors.requestIntercetpor(config)
    }
    // 判断是否需要显示loading
    if (config.showLoading === false) {
      this.showLoading = config.showLoading
    }
    this.instance
      .request(config)
      .then((res) => {
        if (config.interceptors?.responseIntercetpor) {
          res = config.interceptors.responseIntercetpor(res)
          // 将showLoading设置true, 这样不会影响下一个请求
          this.showLoading = DEFAULT_LOADING
          console.log(res)
        }
      })
      .catch((err) => {
        // 2.将showLoading设置true, 这样不会影响下一个请求
        this.showLoading = DEFAULT_LOADING
        return err
      })
  }
```

这样就可以通过实例方法来控制是否显示

**注意：这种的要把showLoading设置回true，不设置一直未false会影响下一个方法**

### 返回数据

现在数据是在request方法里打印的，实际中应该进行返回，在调用的组件里拿到数据

那么应该返回Promise

```ts
request<T>(config: XYRequestConfig): Promise<T> {
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
        //这里不规定泛型，下方的resolve(res)类型推导会出现错误
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
```

Promise是个泛型类型需要传递一个泛型<T>

```ts
interface DataType {
  //这里的数据根据接口返回的属性来定义
  data: any
  returnCode: string
  success: number
}
//这里进行泛型传递
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
```

定义其他方法：

```ts
get<T>(config: XYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
post<T>(config: XYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

delete<T>(config: XYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

patch<T>(config: XYRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
```

### 一个小问题

request方法返回的数据res默认是AxiosResponse类型

但是在拦截器中我们对res`return res.data`进行了修改返回，那么就不再是AxiosResponse类型了

所以this.inseance.request我们就要用泛型，这样res才能返回需要的类型

```ts
this.instance
        .request<any, T>(config)
```

但是这样修改后，res问题解决了

```ts
// 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
```

这里的responseInterceptor(res)出现了问题，因为现在的res是我们修改的T类型，而默认我们定义的是AxiosResponse类型，可以定义为any来解决

```ts
export interface XYRequestInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => any
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: (res: any) => any
  responseInterceptorCatch?: (err: any) => any
}
```

但是为了追求高逼格，尽量少使用any

那我们不使用any，就应该由外部来决定这个类型，怎么做？**可以使用接口的泛型**

```ts
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
//定义接口为拦截器intercetpors做准备

// 接口泛型 默认为<T = AxiosResponse>
export interface XYRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => any
  requestInterceptorCatch?: (err: any) => any
  
  //这里默认为AxiosResponse，如果外界传递了就是传递的类型
  responseInterceptor?: (res: T) => T
  
  responseInterceptorCatch?: (err: any) => any
}
// 定义接口继承AxiosRequestConfig
export interface XYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  
  //这里默认为AxiosResponse，如果外界传递了就是传递的类型
  interceptors?: XYRequestInterceptors<T>
  showLoading?: boolean
}
```

外部进行修改

```ts
request<T>(config: XYRequestConfig<T>): Promise<T> {}
```

给XYRequestConfig<T>传递泛型，那么就会通过XYRequestConfig传递到XYRequestInterceptors进而修改responseInterceptor?: (res: T) => T，这样就完美解决了。

# 二、其它补充

## tsconfig.json



```ts
{
  "compilerOptions": {
    // 目标代码(ts -> js(es5/6/7))
    "target": "esnext",
    // 目标代码需要使用的模块化方案(commonjs require/module.exports/es module import/export)
    "module": "esnext",
    // 严格一些严格的检查(any)
    "strict": true,
    // 对jsx进行怎么样的处理
    "jsx": "preserve",
    // 辅助的导入功能
    "importHelpers": true,
    // 按照node的方式去解析模块 import "/index.node"
    "moduleResolution": "node",
    // 跳过一些库的类型检测 (axios -> 类型/ lodash -> @types/lodash / 其他的第三方)
    // import { Person } from 'axios'
    "skipLibCheck": true,
    // export default/module.exports = {}
    // es module 和 commonjs
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    // 要不要生成映射文件(ts -> js)
    "sourceMap": true,
    // 文件路径在解析时, 基本url
    "baseUrl": ".",
    // 指定具体要解析使用的类型
    "types": ["webpack-env"],
    // 路径解析(类似于webpack alias)
    "paths": {
      "@/*": ["src/*"],
      "components/*": ["src/components/*"]
    },
    // 可以指定在项目中可以使用哪里库的类型(Proxy/Window/Document)
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
    // import axios 那么axios里的node_modules会被忽略
  "exclude": ["node_modules"]
}

```

## shims-vue.d.ts

对vue文件的编译做了支持

## defineComponent

就是对我们写的对象作了规范，那些可以写哪些不能，做了相关配置和类型推导

```ts
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {}
})
</script>
```

