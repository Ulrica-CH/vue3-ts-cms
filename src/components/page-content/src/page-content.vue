<template>
  <div class="page-content">
    <xy-table
      :listDatas="dataList"
      :dataCount="dataCount"
      v-bind="contentTableConfig"
      @selectChange="selectValue"
      v-model:tablePageInfo="tablePageInfo"
    >
      <template #headerHandle
        ><el-button type="primary" @click="handleNewClick" round size="medium"
          >新建用户</el-button
        >
        <el-button round
          ><el-icon><refresh /></el-icon
        ></el-button>
      </template>
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
      <template v-for="item in otherPropSlots" #[item.slotName]="scope">
        <template v-if="item.slotName">
          <slot :name="item.slotName" :row22="scope.row11"></slot>
        </template>
      </template>
      <template #edit="scope">
        <el-button
          v-if="isUpdate"
          size="mini"
          type="text"
          @click="handleEditClick(scope.row11)"
          >编辑</el-button
        >
        <el-button
          v-if="isDelete"
          size="mini"
          type="text"
          @click="handleDeleteClick(scope.row11)"
          >删除</el-button
        >
      </template>
    </xy-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Refresh } from '@element-plus/icons-vue'
import { usePermission } from '@/hooks/usePermission'
import XyTable from '@/base-ui/table'
export default defineComponent({
  components: { XyTable, Refresh },
  props: {
    contentTableConfig: {
      type: Object,
      required: true
    },
    pageName: {
      type: String,
      required: true
    }
  },
  emits: ['newBtnClick', 'editBtnClick'],
  setup(props, { emit }) {
    //获取用户权限
    const isCreate = usePermission(props.pageName, 'create')
    console.log(isCreate)

    const isDelete = usePermission(props.pageName, 'delete')
    const isUpdate = usePermission(props.pageName, 'update')
    const isQuery = usePermission(props.pageName, 'query')
    //这部分动态变化的不应该抽离到配置文件里
    const store = useStore()
    //获取表格数据
    const dataList = computed(() =>
      store.getters['system/pageListData'](props.pageName)
    )
    //排除公共使用的插槽
    const otherPropSlots = props.contentTableConfig?.propLists.filter(
      (item: any) => {
        if (item.slotName === 'status') return false
        if (item.slotName === 'createAt') return false
        if (item.slotName === 'updateAt') return false
        if (item.slotName === 'edit') return false
        return true
      }
    )
    // console.log(dataList.value)
    //获取表格数据总数
    const dataCount = computed(() =>
      store.getters['system/pageListCount'](props.pageName)
    )
    //双向数据绑定表格的分页数据
    const tablePageInfo = ref({ currentPage: 1, pageSize: 10 })
    watch(tablePageInfo, () => {
      getListData()
    })
    const getListData = (clickQueryInfo: any = {}) => {
      //没有权限不能请求
      if (!isQuery) return false
      store.dispatch('system/getPageAction', {
        pageName: props.pageName,
        queryInfo: {
          //偏移量 对应页数的变化 上一页下一页
          offset:
            (tablePageInfo.value.currentPage - 1) *
            tablePageInfo.value.pageSize,
          //请求数据的总数 10条还是二十条
          size: tablePageInfo.value.pageSize,
          ...clickQueryInfo
        }
      })
    }
    getListData()
    //删除编辑操作
    const handleDeleteClick = (item: any) => {
      store.dispatch('system/deleteDataAction', {
        pageName: props.pageName,
        id: item.id
      })
    }
    const handleEditClick = (item: any) => {
      emit('editBtnClick', item)
    }
    const handleNewClick = () => {
      console.log(1)
      emit('newBtnClick')
    }
    return {
      dataList,
      tablePageInfo,
      dataCount,
      getListData,
      otherPropSlots,
      isCreate,
      isUpdate,
      isDelete,
      handleDeleteClick,
      handleEditClick,
      handleNewClick
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 20px 10px;
}
</style>
