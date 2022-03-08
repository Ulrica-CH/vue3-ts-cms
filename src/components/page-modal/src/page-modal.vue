<template>
  <div class="page-model">
    <el-dialog
      v-model="dialogVisible"
      title="新建用户"
      width="30%"
      center
      destroy-on-close
    >
      <xy-form :="modelDIalogConfig" v-model="formData"></xy-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreateClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import XyForm from '@/base-ui/form'
import store from '@/store'
export default defineComponent({
  components: { XyForm },
  props: {
    modelDIalogConfig: {
      type: Object,
      required: true
    },
    defaultInfo: {
      type: Object,
      default: () => ({})
    },
    pageName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    let dialogVisible = ref(false)
    const formData = ref<any>({})
    watch(
      () => props.defaultInfo,
      (newValue) => {
        for (const item of props.modelDIalogConfig.formItems) {
          formData.value[`${item.field}`] = newValue[`${item.field}`]
          // console.log(1)
          //   console.log(formData.value)
        }
      }
    )
    //
    const handleCreateClick = () => {
      dialogVisible.value = false
      //编辑defaultInfo 新建 defaultInfo为空对象
      if (Object.keys(props.defaultInfo).length) {
        //编辑
        store.dispatch('system/editDataAction', {
          pageName: props.pageName,
          newData: { ...formData.value },
          id: props.defaultInfo.id
        })
      } else {
        //新建
        // console.log(1)
        store.dispatch('system/createDataAction', {
          pageName: props.pageName,
          newData: { ...formData.value }
        })
      }
    }
    return {
      dialogVisible,
      formData,
      handleCreateClick
    }
  }
})
</script>

<style scoped></style>
