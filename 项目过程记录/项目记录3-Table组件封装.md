## 面包屑导航

还是采取封装组件的方式

思路：

- 封装breadcrumb组件
- 外界传递配置来进行组件显示
- navheader组件获取url路径通过调用函数，拿到路径对应的一级menu对象和二级menu对象传递给breadcrumb组件遍历进行展示

Base-ui -> breadcrumb -> src -> breadcrumb.vue

```ts
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadCrumb" :key="item.name">{{
        item.name
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IBreadCrumbs } from '../types'

export default defineComponent({
  props: {
    breadCrumb: {
      type: Array as PropType<IBreadCrumbs[]>,
      default: () => []
    }
  },
  setup() {
    return {}
  }
})
</script>
```

Nav-header.vue

```js
<span>
  <bread-crumb :breadCrumb="breadcrumb"></bread-crumb>
</span>
      
//面包屑导航
    const breadcrumb = computed(() => {
      const store = useStore()
      const userMenus = store.state.login.userMenus
      const route = useRoute()
      const path = route.path
     //utils -> map-route.ts
      return pathMapBread(userMenus, path)
    })
```

```ts
map-route.ts
export function pathMapBread(userMenus: any[], path: string): any {
  const breadCrumb: IBreadCrumbs[] = []
  //相同逻辑代码封装到一个函数里，通过传递参数来进行判断
  pathMapMenus(userMenus, path, breadCrumb)
  return breadCrumb
}
export function pathMapMenus(
  userMenus: any[],
  currentActive: string,
  breadCrumb?: IBreadCrumbs[]
): any {
  // console.log(userMenus)
  // console.log(currentActive)

  for (const menu of userMenus) {
    if (menu.type === 1) {
      const findMenu = pathMapMenus(menu.children ?? [], currentActive)
      if (findMenu) {
        if (breadCrumb) {
          breadCrumb.push({ name: menu.name })
          breadCrumb.push({ name: findMenu.name })
        }
        return findMenu
      }
    } else if (menu.type === 2 && menu.url === currentActive) {
      // console.log(menu)
      return menu
    }
  }
}
```

## 封装的表单组件的双向绑定

目前在表单中输入书获取不到只值，那么也就无法根据输入内容进行查询用户

所以要在输入后拿到输入的值并请求借口返回查询到的数据

表单组件式封装好的独立组件，是在user.vue中进行逻辑交互的，所以就涉及到了组件传值问题

可以使用reactive及props进行响应式传递并进行绑定

user.vue

```vue
<xy-form v-bind="searchFormConfig" :formData="formData"></xy-form>
const formData = reactive({
      id: '',
      name: '',
      password: '',
      sport: '',
      time: ''
    })
```

form.vue

```vue
<el-input
                  :placeholder="item.placeholder"
                  :show-password="item.type === 'password'"
                  v-model="formData[`${item.field}`]"
                ></el-input> 

props: {
    formData: {
      type: Object,
      required: true
    },
    }
```

但是formItem没有定义field，要重新更改下

```ts
export interface IFormItem {
  //加个field
  field: any
  type: any
  label: string
  placeholder?: any
  options?: any
  otherOptions?: any
}

export interface IForm {
  formItem: IFormItem[]
  labelWidth?: string
  itemStyle?: any
  colLayout?: any
}
```

```ts
export const searchFormConfig: IForm = {
  formItem: [
    { field: 'id', type: 'input', label: 'id', placeholder: '请输入id' },
    {
      field: 'name',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名'
    },
    {
      field: 'password',
      type: 'password',
      label: '密码',
      placeholder: '请输入密码'
    },
    {
      field: 'sport',
      type: 'select',
      label: '喜欢的运动',
      placeholder: '请输入密码',
      options: [
        { option: '篮球', value: 'basketball' },
        { option: '足球', value: 'football' }
      ]
    },
    {
      field: 'time',
      type: 'data',
      label: '时间',
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange'
      }
    }
  ],
  labelWidth: '110px',
  itemStyle: { padding: '20px 40px' },
  colLayout: {
    xl: 8,
    lg: 8,
    md: 12,
    sm: 24,
    xs: 24
  }
}

```

这样就可以通过v-model="formData[`${item.field}`]"拿到值了，并且由于是reactive，可以实时修改，在vuex中可以看到变化

但是有一个缺点

子组件修改了父组件的值，违反了双向数据绑定的原则

**可以通过组件的v-model和computed的get set来实现，但实际上这跟上面的props传递是一样的**

另外一种做法：也是使用组件的v-model

user.vue

```vue
<xy-form v-bind="searchFormConfig" v-model="formData"></xy-form>
setup() {
    //表单组件的输入内容
    const formData = ref({
      id: '',
      name: '',
      password: '',
      sport: '',
      time: ''
    })
    return { searchFormConfig, formData }
  }
```

Form.vue

```vue
<el-input
                  :placeholder="item.placeholder"
                  :show-password="item.type === 'password'"
                  v-model="formData[`${item.field}`]"
                ></el-input>
setup(props, { emit }) {
    //这就相当两个对象 不影响user里的
    const formData = ref({ ...props.formdata })
    watch(
      formData,
      (newValue) => {
        console.log(newValue)

        emit('update:modelValue', newValue)
      },
      { deep: true }
    )

    return { formData }
  }
```

通过监听form.vue中的数据变化在发射事件到user.vue

## 按钮等操作可以使用插槽

form.vue

```vue
<div class="header">
      <slot name="header"></slot>
    </div>
```

User.vue

```vue
<template #header>
        <h2 class="header">高级检索</h2>
      </template>
```

## 抽离组件

但是对于不同页面可能也需要这么一个完善的组件，包括表单插槽等等

现在是写在user.vue中，应该抽离出来，不同页面在使用时只需引入组件就可以

Base-ui -> page-search ->pae-search.vue

```vue
<template>
  <div>
    <xy-form v-bind="searchFormConfig" v-model="formData">
      <template #header>
        <h2 class="header">高级检索</h2>
      </template>
      <template #footer>
        <div class="footer">
          <el-button>重置</el-button>
          <el-button type="primary">搜索</el-button>
        </div>
      </template>
    </xy-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import XyForm from '../../form'
export default defineComponent({
  components: { XyForm },
  props: {
    searchFormConfig: {
      type: Object,
      required: true
    }
  },
  setup() {
    //表单组件的输入内容
    const formData = ref({
      id: '',
      name: '',
      password: '',
      sport: '',
      time: ''
    })
    return { formData }
  }
})
</script>

<style scoped>
.header {
  padding-top: 20px;
}
.footer {
  text-align: right;
  padding: 0 80px 20px 0;
}
</style>

```

讲user.vue的逻辑抽到page-search.vue

user.vue只需导入组件就可以

user.vue

```vue
<template>
  <div>
    <page-search :searchFormConfig="searchFormConfig" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { searchFormConfig } from './config/search-config'
import PageSearch from '@/base-ui/page-search'
export default defineComponent({
  components: { PageSearch },
  setup() {
    return { searchFormConfig }
  }
})
</script>
```

## 用户信息、列表组件

用户管理页还需要具体的用户信息的表格，那么就到请求数据渲染

但是这个数据应该放在哪？

- 1、可以放在对应的组件里比如user.vue role.vue但是共享麻烦
- 2、放在store的模块里，但是有很多模块
- 3、**以一级菜单为一个模块存放，比如系统管理，系统总览等这样只有四个模块，而用户管理、部门管理这样的因为都属于系统管理，所以都放在系统管理即可**

store -> main -> system -> system.ts

```ts
import { getPageListdata } from '@/service/main/system/system'
import { Module } from 'vuex'
import { IRootState } from '../types'
import { ISystemState } from './types'

const system: Module<ISystemState, IRootState> = {
  namespaced: true,
  state() {
    return {
      userList: [],
      userCount: 0
    }
  },
  mutations: {
    keepUserList(state, list) {
      state.userList = list
    },
    keepUserCount(state, totalCount) {
      state.userCount = totalCount
    }
  },
  actions: {
    //通用函数 根据传递的参数来发送不同请求
    async getPageAction({ commit }, payload: any) {
      const url = payload.path
      const queryInfo = payload.queryInfo
      const pageResult = await getPageListdata(url, queryInfo)
      //   console.log(pageResult)
      const { list, totalCount } = pageResult.data
      commit('keepUserList', list)
      commit('keepUserCount', totalCount)
    }
  }
}
export default system

```

user.vue

```ts
setup() {
    const store = useStore()
    //分发action 传递不同参数
    store.dispatch('system/getPageAction', {
      path: '/users/list',
      queryInfo: {
        offset: '0',
        size: '10'
      }
    })
    return { searchFormConfig }
  }
```

service -> system -> system.ts

```ts
import { xyRequest } from '@/service'
import { IDataType } from '../types'

export function getPageListdata(url: string, queryInfo: any) {
  return xyRequest.post<IDataType>({
    url,
    data: queryInfo
  })
}
```

## 使用table组件进行数据展示

```vue
<div class="content">
      <el-table :data="userList" style="width: 100%" border>
        <template v-for="propItem in propItems" :key="propItem.prop">
          <el-table-column v-bind="propItem" align="center"></el-table-column>
        </template>
      </el-table>
    </div>

const userList = computed(() => store.state.system.userList)
    const userCount = computed(() => store.state.system.userCount)

    const propItems = [
      {
        prop: 'name',
        label: '用户名',
        minWidth: '100'
      },
      {
        prop: 'realname',
        label: '真实姓名',
        minWidth: '100'
      },
      {
        prop: 'cellphone',
        label: '手机号',
        minWidth: '100'
      },
      {
        prop: 'enable',
        label: '状态',
        minWidth: '100'
      },
      {
        prop: 'createAt',
        label: '创建时间',
        minWidth: '250'
      },
      {
        prop: 'updateAt',
        label: '更新时间',
        minWidth: '250'
      }
    ]
```

但是不通用，应该进行封装

- base-ui下新建table.vue
- 把表格 数据等在这个组件中进行展示
- user.vue引入组件并传递数据

table.vue

- 如果想要更改表格里的某一项呢？
- 应该使用插槽
- 插槽里的内容都不能写死
- 使用table组件定义好的插槽来进行数据展示
- 再次定义插槽来进行数据的更改

```ts
<template>
  <div class="xy-table">
    <div class="content">
      <el-table :data="listDatas" style="width: 100%" border>
        <template v-for="propList in propLists" :key="propList.prop">
          <el-table-column v-bind="propList" align="center">
            <!-- #default="scope123" 这里的scope123是自定义的一般写成scope-->
            <!-- :row11="scope123.row" row11是传递给父组件的数据的属性名要通过scope（可自定义）.row来调用 -->
            <template #default="scope123">
              <slot :name="propList.slotName" :row11="scope123.row">{{
                scope123.row[propList.prop]
              }}</slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    listDatas: {
      type: Array,
      required: true
    },
    propLists: {
      type: Array,
      required: true
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped>
.content {
  border-top: 20px solid #f5f5f5;
  padding: 20px;
}
</style>

```

User.vue

```vue
<template>
  <div>
    <page-search :searchFormConfig="searchFormConfig" />
    <xy-table :listDatas="userList" :propLists="propLists">
      <template #status="scope">
        <el-button type="primary">{{
          scope.row11 ? '启用' : '禁用'
        }}</el-button>
      </template>
      <template #createAt="scope">
        {{ scope.row11.createAt }}
      </template>
      <template #updateAt="scope">
        {{ scope.row11.updateAt }}
      </template>
    </xy-table>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { searchFormConfig } from './config/search-config'
import PageSearch from '@/base-ui/page-search'
import { useStore } from 'vuex'
import XyTable from '@/base-ui/table'
export default defineComponent({
  components: { PageSearch, XyTable },
  setup() {
    const store = useStore()
    store.dispatch('system/getPageAction', {
      path: '/users/list',
      queryInfo: {
        offset: '0',
        size: '10'
      }
    })
    const userList = computed(() => store.state.system.userList)
    const userCount = computed(() => store.state.system.userCount)

    const propLists = [
      {
        prop: 'name',
        label: '用户名',
        minWidth: '100'
      },
      {
        prop: 'realname',
        label: '真实姓名',
        minWidth: '100'
      },
      {
        prop: 'cellphone',
        label: '手机号',
        minWidth: '100'
      },
      {
        prop: 'enable',
        label: '状态',
        minWidth: '100',
        slotName: 'status'
      },
      {
        prop: 'createAt',
        label: '创建时间',
        minWidth: '250',
        slotName: 'createAt'
      },
      {
        prop: 'updateAt',
        label: '更新时间',
        minWidth: '250',
        slotName: 'updateAt'
      }
    ]
    return { searchFormConfig, userList, userCount, propLists }
  }
})
</script>

<style scoped></style>

```

总结：

- 要适当的利用具名插槽和作用于插槽
- 通用的组件要进行封装抽离，根据不同配置信息来显示不同的数据内容
- 表单组建的数据绑定应遵守单向数据流，可以复制另一个对象进行修改并监听修改发射事件到父组件
- 对于网络请求回来的数据应该按模块存放到vuex中，模块应该按一个大类进行划分，太细致文件过多不利于为维护修改

## 时间格式化

目前后台返回的时间是utc格式的，要进行格式化处理。

1、在app.config.globalPropserties上添加全局对象，对象里添加一个格式化方法，返回格式化后的时间

```ts
import formatUtctime from '@/utils/format-time'
import type { App } from 'vue'
export default function registerProperties(app: App) {
  app.config.globalProperties.$filters = {
    formatTime(value: string) {
      return formatUtctime(value)
    }
  }
}

```

2、utils工具里添加一个格式化时间的工具函数

```ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
dayjs.extend(utc)
export default function formatUtctime(
  utcTime: string,
  formatTime: string = DATE_TIME_FORMAT
) {
  return dayjs.utc(utcTime).format(formatTime)
}

```

3、全局使用

```vue
<template #createAt="scope">
        <!-- $filters为全局注册的对象 app.config.globalProperties -->
        {{ $filters.formatTime(scope.row11.createAt) }}
</template>
```

思路：

- 使用定义好的全局对象$filters里的方法formatTime讲服务器返回的时间传递过去
- formatTime调用工具函数formatUtctime将格式化后的时间返回

## 细节补充

### 选择框，序号显示

通过user.vue传递值来控制

```ts
//控制序号显示
const showIndex = true
//控制是否有选择按钮
const showSelect = true
```

table.vue接收判断：

```vue
 <el-table-column
          v-if="showSelect"
          type="selection"
          width="50px"
          align="center"
          label=""
        ></el-table-column>
        <el-table-column
          v-if="showIndex"
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>

props: {
    showIndex: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
```

选中哪项可通过内置事件@selection-change获取emit到user.vue

```vue
<el-table
        :data="listDatas"
        style="width: 100%"
        border
        @selection-change="handleSelectChange"
      >

emits: ['selectChange'],
const handleSelectChange = (value: any) => {
      emit('selectChange', value)
    }
```

### 表格上面信息、底部分页

使用插槽，设置默认值

```vue
title的值由uesr.vue来传递 peops接收
<div class="header">
        <slot name="header">{{ title }}</slot>
        <div class="headerHandle">
          <slot name="headerHandle">
            <el-button type="primary" round size="medium">新建用户</el-button>
            <el-button round
              ><el-icon><refresh /></el-icon
            ></el-button>
          </slot>
        </div>
      </div>
<!-- 底部分页 -->
<div class="footer">
        <slot name="footer">
          <el-pagination
            v-model:currentPage="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </slot>
      </div>
```

### 国际化配置

直接全局配置了

```ts
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

app.use(ElementPlus, {
  locale: zhCn,
})
```

## Table组件抽离

之前的表单搜索组件也是进行了再一次抽离，最开始封装了XyForm表单组价，然后user.vue导入使用，使XyForm表单组件更丰富，为了更通用，再次抽离为page-search组件

Table组件也应该如此，进行通用抽离

user下content-config.ts配置文件

```ts
export const contentTableConfig = {
  title: '用户列表',
  //控制序号显示
  showIndex: true,
  //控制是否有选择按钮
  showSelect: true,
  propLists: [
    {
      prop: 'name',
      label: '用户名',
      minWidth: '100'
    },
    {
      prop: 'realname',
      label: '真实姓名',
      minWidth: '100'
    },
    {
      prop: 'cellphone',
      label: '手机号',
      minWidth: '100'
    },
    {
      prop: 'enable',
      label: '状态',
      minWidth: '100',
      slotName: 'status'
    },
    {
      prop: 'createAt',
      label: '创建时间',
      minWidth: '250',
      slotName: 'createAt'
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      minWidth: '250',
      slotName: 'updateAt'
    },
    { label: '操作', minWidth: '100px', slotName: 'edit' }
  ]
}

```

base-ui下page-content组件

```vue
<template>
  <div class="page-content">
    <xy-table
      :listDatas="userList"
      v-bind="contentTableConfig"
      @selectChange="selectValue"
    >
      <template #header> </template>
      <template #status="scope">
        <el-button
          size="mini"
          :type="scope.row11.enable ? 'primary' : 'danger'"
          >{{ scope.row11.enable ? '启用' : '禁用' }}</el-button
        >
      </template>
      <template #createAt="scope">
        <!-- $filters为全局注册的对象 app.config.globalProperties -->
        {{ $filters.formatTime(scope.row11.createAt) }}
      </template>
      <template #updateAt="scope">
        {{ $filters.formatTime(scope.row11.updateAt) }}
      </template>
      <template #edit>
        <el-button size="mini" type="text">编辑</el-button>
        <el-button size="mini" type="text">删除</el-button>
      </template>
    </xy-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import XyTable from '@/base-ui/table'
export default defineComponent({
  components: { XyTable },
  props: {
    contentTableConfig: {
      type: Object,
      required: true
    }
  },
  setup() {
    //这部分动态变化的不应该抽离到配置文件里
    const store = useStore()
    store.dispatch('system/getPageAction', {
      path: '/users/list',
      queryInfo: {
        offset: '0',
        size: '10'
      }
    })
    const userList = computed(() => store.state.system.userList)
    const userCount = computed(() => store.state.system.userCount)
    return { userList, userCount }
  }
})
</script>
```

uesr.vue

```vue
<template>
  <div>
    <page-search :searchFormConfig="searchFormConfig" />
    <page-content :contentTableConfig="contentTableConfig"></page-content>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import PageSearch from '@/base-ui/page-search'
import PageContent from '@/base-ui/page-content'

import { searchFormConfig } from './config/search-config'
import { contentTableConfig } from './config/content-config'
export default defineComponent({
  components: { PageSearch, PageContent },
  setup() {
    return {
      searchFormConfig,
      contentTableConfig
    }
  }
})
</script>
```

可以看到，目前user.vue是很整洁的，只导入两个组件，引入两个配置文件并传递出去就可以了

但是有个问题：网络请求这种动态数据应该放到哪个组件？uesr.vue?page-content.vue?

其实也应该抽离出来

- 在user.vue只需传递一个值，比如requestName = 'user'，传递到page-content
- page-content组件进行判断
- 发现是ueer，就调用user相关的配置请发网络请求
- 如果是role就调用role相关配置去发网络请求，等等

user.vue

```vue
<page-content :contentTableConfig="contentTableConfig" :pageName="'user'"></page-content>
```

Page-content.vue

```ts
store.dispatch('system/getPageAction', {
      pageName: props.pageName,
      queryInfo: {
        offset: '0',
        size: '10'
      }
    })
```

Store -> system ->system.ts

```ts
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
      //根据pageName进行提交不同的mutations
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
```

### 获取数据可以使用getters

```ts
const dataList = computed(() =>
      store.getters['system/pageListData'](props.pageName)
    )
```

```ts
getters: {
    pageListData(state) {
      return (pageName: string) => {
        switch (pageName) {
          case 'user':
            return state.userList
          case 'role':
            return state.roleList
        }
      }
    }
  },
```

现在page-content组件就很通用了，只需传入不同配置就可以，比如权限管理页面

```ts
export const contentTableConfig = {
  title: '权限列表',
  //控制序号显示
  showIndex: true,
  //控制是否有选择按钮
  showSelect: true,
  propLists: [
    {
      prop: 'name',
      label: '角色名',
      minWidth: '100'
    },
    {
      prop: 'intro',
      label: '权限介绍',
      minWidth: '100'
    },
    {
      prop: 'createAt',
      label: '创建时间',
      minWidth: '250',
      slotName: 'createAt'
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      minWidth: '250',
      slotName: 'updateAt'
    },
    { label: '操作', minWidth: '100px', slotName: 'edit' }
  ]
}

```

role.vue

```vue
<template>
  <div class="role">
    <page-content
      :contentTableConfig="contentTableConfig"
      :pageName="'role'"
    ></page-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageContent from '@/base-ui/page-content'
import { contentTableConfig } from './content-config'
export default defineComponent({
  name: 'role',
  components: { PageContent },
  setup() {
    return { contentTableConfig }
  }
})
</script>

<style scoped></style>

```

就很容易渲染出来了

更正：page-content page-search组件应放到components中

