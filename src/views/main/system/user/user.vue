<template>
  <div>
    <page-search
      :searchFormConfig="searchFormConfig"
      @resetClick="handleResetClick"
      @queryClick="handleQueryClick"
    />
    <page-content
      :contentTableConfig="contentTableConfig"
      pageName="users"
      ref="pageContentRef"
      @editBtnClick="handleEditData"
      @newBtnClick="handleNewData"
    ></page-content>
    <page-modal
      pageName="users"
      :defaultInfo="defaultInfo"
      ref="pageModalRef"
      :modelDIalogConfig="modelDIalogConfigRef"
    ></page-modal>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import PageSearch from '@/components/page-search'
import PageContent from '@/components/page-content'
import PageModal from '@/components/page-modal'
import { searchFormConfig } from './config/search-config'
import { contentTableConfig } from './config/content-config'

import { usePageSearch } from '@/hooks/usePageSearch'
import { usePageModal } from '@/hooks/usePageModal'
import { modelDIalogConfig } from './config/model-config'
export default defineComponent({
  components: { PageSearch, PageContent, PageModal },
  setup() {
    //重置，查询
    const [pageContentRef, handleQueryClick, handleResetClick] = usePageSearch()
    //控制密码框显示
    //新建用户显示，编辑用户不显示
    const newCallback = () => {
      const passwordItem = modelDIalogConfig.formItems.find(
        (item) => item.field === 'password'
      )
      passwordItem!.isHidden = false
    }
    const editCallback = () => {
      const passwordItem = modelDIalogConfig.formItems.find(
        (item) => item.field === 'password'
      )
      passwordItem!.isHidden = true
    }

    //部门角色下拉框
    //使用computed做到响应式，因为store中请求的是异步，可能没等请求到数据就渲染了
    const modelDIalogConfigRef = computed(() => {
      const store = useStore()
      const departmentItem = modelDIalogConfig.formItems.find(
        (item) => item.field === 'department'
      )
      const roleItem = modelDIalogConfig.formItems.find(
        (item) => item.field === 'role'
      )
      departmentItem!.options = store.state.entireDepartmentList.map(
        (item: any) => {
          return { title: item.name, value: item.id }
        }
      )
      roleItem!.options = store.state.entireRoleList.map((item: any) => {
        return { title: item.name, value: item.id }
      })
      return modelDIalogConfig
    })

    //对话框
    const { handleEditData, handleNewData, pageModalRef, defaultInfo } =
      usePageModal(newCallback, editCallback)
    return {
      searchFormConfig,
      contentTableConfig,
      handleResetClick,
      handleQueryClick,
      pageContentRef,
      modelDIalogConfigRef,
      pageModalRef,
      defaultInfo,
      handleNewData,
      handleEditData
    }
  }
})
</script>

<style scoped></style>
