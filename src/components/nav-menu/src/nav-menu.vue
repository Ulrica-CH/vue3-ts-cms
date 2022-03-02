<template>
  <div class="nav-menu">
    <div class="logo">
      <img class="img" src="~@/assets/img/logo.svg" alt="logo" />
      <span v-show="!collapse" class="title">Vue3 + TS</span>
    </div>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical"
      :collapse="collapse"
      background-color=""
    >
      <template v-for="item in userMenus" :key="item.id">
        <template v-if="item.type === 1">
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <template v-for="subItem in item.children" :key="subItem.id">
              <el-menu-item
                @click="handleMenuItemClick(subItem)"
                :index="subItem.id + ''"
              >
                <el-icon><setting /></el-icon>
                <span>{{ subItem.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
// import { useStore } from 'vuex'
import { useStore } from '@/store'
import { Location, Document, Setting } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { pathMapMenus } from '@/utils/map-route'
export default defineComponent({
  components: { Setting },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore()
    const userMenus = computed(() => store.state.login.userMenus)
    const router = useRouter()
    const route = useRoute()
    const currentActive = route.path
    //解决刷新 default-active问题
    const menu = pathMapMenus(userMenus.value, currentActive)
    console.log(menu)

    const defaultActive = ref(menu.id + '')
    const handleMenuItemClick = (item: any) => {
      // console.log(item)

      router.push({
        path: item.url ?? '/notfound'
      })
    }
    return { userMenus, defaultActive, handleMenuItemClick }
  }
})
</script>

<style scoped lang="less">
.nav-menu {
  height: 100%;
  .logo {
    display: flex;
    height: 26px;
    // background-color: black;
    border-bottom: 2px solid black;
    padding: 12px 10px 8px 10px;
    //默认按行排列 column是列
    // flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .img {
    height: 100%;
    margin: 0 10px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
  }
  .el-menu {
    border-right: none;
  }

  // 目录
  .el-sub-menu {
    background-color: #fff !important;
    // 二级菜单 ( 默认背景 )
    .el-menu-item {
      padding-left: 40px !important;
      background-color: #fff !important;
    }
  }
  //::v-deep 修改element-plus某个深层元素
  ::v-deep .el-submenu__title {
    background-color: #001529 !important;
  }

  // hover 高亮
  .el-menu-item:hover {
    color: #000 !important;
    background-color: #e6f7ff !important; // 菜单
  }

  .el-menu-item.is-active {
    color: #000 !important;
    background-color: #e6f7ff !important;
    border-right: 3px solid rgb(24 144 255);
  }
}
//:not排除元素
.el-menu-vertical:not(.el-menu--collapse) {
  width: 100%;
  height: calc(100% - 48px);
}
</style>
