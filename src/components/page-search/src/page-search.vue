<template>
  <div>
    <xy-form v-bind="searchFormConfig" v-model="formData">
      <template #header>
        <div class="header">高级检索</div>
      </template>
      <template #footer>
        <div class="footer">
          <el-button @click="handleResetClcik">重置</el-button>
          <el-button type="primary" @click="handleQueryClick">搜索</el-button>
        </div>
      </template>
    </xy-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import XyForm from '@/base-ui/form'
export default defineComponent({
  components: { XyForm },
  props: {
    searchFormConfig: {
      type: Object,
      required: true
    }
  },
  emits: ['resetClick', 'queryClick'],
  setup(props, { emit }) {
    //表单组件的输入内容
    //每个页面根据不同配置信息要展示的输入框也就不一样
    //那么formData也要根据配置里的field来进行决定，不应该写死
    const formItems = props.searchFormConfig?.formItems ?? []
    const formOriginData: any = {}
    for (const item of formItems) {
      formOriginData[item.field] = ''
    }
    // console.log(formOriginData)

    const formData = ref(formOriginData)
    //重置
    const handleResetClcik = () => {
      for (const key in formOriginData) {
        formData.value[`${key}`] = formOriginData[key]
      }
      emit('resetClick')
    }
    //提交按钮并搜索
    const handleQueryClick = () => {
      // console.log(formData.value)
      emit('queryClick', formData.value)
    }
    // const handleResetClcik = () => {
    //   formData.value = formOriginData
    // }
    // const formData = ref({
    //   id: '',
    //   name: '',
    //   password: '',
    //   sport: '',
    //   time: ''
    // })
    return { formData, handleResetClcik, handleQueryClick }
  }
})
</script>

<style scoped>
.header {
  padding: 20px 0 10px 0;
  font-size: 28px;
}
.footer {
  text-align: right;
  padding: 0 80px 20px 0;
}
</style>
