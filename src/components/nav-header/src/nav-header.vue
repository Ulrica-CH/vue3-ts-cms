<template>
  <div class="nav-header">
    <i @click="handleIconClick">
      <el-icon v-if="!isFold" class="fold"><arrow-left-bold /></el-icon>
      <el-icon v-else class="fold"><arrow-right-bold /></el-icon>
    </i>
    <div class="content">
      <span>
        <bread-crumb :breadCrumb="breadcrumb"></bread-crumb>
      </span>
      <div class="user-info">
        <el-avatar
          size="small"
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        ></el-avatar>
        <el-dropdown>
          <span class="el-dropdown-link">
            XiaoYang
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>退出登录</el-dropdown-item>
              <el-dropdown-item divided>用户信息</el-dropdown-item>
              <el-dropdown-item>系统信息</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import BreadCrumb from '@/base-ui/breadcrumb'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { pathMapBread } from '@/utils/map-route'
export default defineComponent({
  components: {
    ArrowLeftBold,
    ArrowRightBold,
    BreadCrumb
  },
  emits: ['foldChange'],
  setup(props, { emit }) {
    //定义状态
    const name = computed(() => store.state.login.userInfo.name)
    const isFold = ref(false)
    const store = useStore()
    //面包屑导航
    const breadcrumb = computed(() => {
      const store = useStore()
      const userMenus = store.state.login.userMenus
      const route = useRoute()
      const path = route.path
      return pathMapBread(userMenus, path)
    })
    //定义事件
    const handleIconClick = () => {
      isFold.value = !isFold.value
      emit('foldChange', isFold.value)
    }
    return { isFold, name, breadcrumb, handleIconClick }
  }
})
</script>

<style scoped lang="less">
.nav-header {
  display: flex;
  width: 100%;
  color: #fff;
  .fold {
    font-size: 20px;
    cursor: pointer;
  }
  .content {
    display: flex;
    width: 100%;
    padding: 0 15px;
    justify-content: space-between;
    align-items: center;
  }
  .user-info {
    display: flex;
    // align-items: center;
    cursor: pointer;
  }
  .el-dropdown-link {
    color: #fff;
    // margin-top: 25px;
    padding-left: 10px;
    line-height: 25px;
  }
}
</style>
