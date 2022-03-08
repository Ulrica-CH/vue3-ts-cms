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

<style scoped>
.el-breadcrumb__inner {
  color: #fff !important;
}
</style>
