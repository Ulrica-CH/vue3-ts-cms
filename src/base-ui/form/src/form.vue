<template>
  <div>
    <el-form>
      <el-row>
        <template v-for="item in formItem" :key="item.label">
          <el-col v-bind="colLayout"
            ><el-form-item
              :label="item.label"
              :label-width="labelWidth"
              :style="itemStyle"
            >
              <template
                v-if="item.type === 'input' || item.type === 'password'"
              >
                <el-input
                  :placeholder="item.placeholder"
                  show-password="item.type === 'password'"
                ></el-input> </template
              ><template v-else-if="item.type === 'select'">
                <el-select style="width: 100%">
                  <el-option v-for="opt in item.options" :key="opt.value">{{
                    opt.option
                  }}</el-option>
                </el-select>
              </template>
              <template v-else>
                <!-- v-bind=""会自动解构  -->
                <el-date-picker
                  v-bind="item.otherOptions"
                  style="width: 100%"
                ></el-date-picker>
              </template> </el-form-item
          ></el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IFormItem } from '../types'
export default defineComponent({
  props: {
    //传递的配置类型
    formItem: {
      type: Array as PropType<IFormItem[]>,
      default: () => []
    },
    //觉得label宽度
    labelWidth: {
      type: String,
      default: '100px'
    },
    //组件样式
    itemStyle: {
      type: Object,
      default: () => ({
        padding: '20px 40px'
      })
    },
    //响应式
    colLayout: {
      type: Object,
      default: () => ({
        xl: 6,
        lg: 8,
        md: 12,
        sm: 24,
        xs: 24
      })
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
