<template>
  <div>
    <div class="header">
      <slot name="header"></slot>
    </div>
    <el-form>
      <el-row>
        <template v-for="item in formItems" :key="item.label">
          <el-col v-bind="colLayout"
            ><el-form-item
              v-if="!item.isHidden"
              :label="item.label"
              :label-width="labelWidth"
              :style="itemStyle"
            >
              <template
                v-if="item.type === 'input' || item.type === 'password'"
              >
                <el-input
                  :placeholder="item.placeholder"
                  :show-password="item.type === 'password'"
                  v-model="formData[`${item.field}`]"
                ></el-input>
                <!-- <el-input
                  :placeholder="item.placeholder"
                  :show-password="item.type === 'password'"
                  :model-value="modelValue[`${item.field}`]"
                  @update:modelValue="handleValueChange($event, item.field)"
                ></el-input>--> </template
              ><template v-else-if="item.type === 'select'">
                <el-select
                  style="width: 100%"
                  v-model="formData[`${item.field}`]"
                >
                  <el-option
                    v-for="option in item.options"
                    :key="option.value"
                    :value="option.value"
                    >{{ option.title }}</el-option
                  >
                </el-select>
              </template>
              <template v-else>
                <!-- v-bind=""会自动解构  -->
                <el-date-picker
                  v-model="formData[`${item.field}`]"
                  v-bind="item.otherOptions"
                  style="width: 100%"
                ></el-date-picker>
              </template> </el-form-item
          ></el-col>
        </template>
      </el-row>
    </el-form>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { IFormItem } from '../types'
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    formdata: {
      type: Object,
      required: true
    },
    //传递的配置类型
    formItems: {
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    //这就相当两个对象 不影响user里的
    const formData = ref({ ...props.modelValue })
    // const handleValueChange = (value: string, field: string) => {
    //   emit('update:modelValue', { ...props.formdata, [field]: value })
    // }
    watch(
      formData,
      (newValue) => {
        // console.log(newValue)
        emit('update:modelValue', newValue)
      },
      { deep: true }
    )

    return { formData }
    // return { handleValueChange }
  }
})
</script>

<style scoped></style>
