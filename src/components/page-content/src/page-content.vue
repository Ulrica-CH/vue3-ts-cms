<template>
  <div class="page-content">
    <xy-table
      :listDatas="dataList"
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
    },
    pageName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    //这部分动态变化的不应该抽离到配置文件里
    const store = useStore()
    store.dispatch('system/getPageAction', {
      pageName: props.pageName,
      queryInfo: {
        offset: '0',
        size: '10'
      }
    })
    const dataList = computed(() =>
      store.getters['system/pageListData'](props.pageName)
    )
    // console.log(dataList.value)
    const userCount = computed(() => store.state.system.userCount)
    return { dataList, userCount }
  }
})
</script>

<style scoped></style>
