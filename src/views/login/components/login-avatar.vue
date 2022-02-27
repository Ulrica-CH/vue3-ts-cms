<template>
  <div class="login-avatar">
    <!-- rules绑定规则 | prop指定规则名字 | model进行数据刷新 -->
    <el-form label-width="60px" :rules="rules" :model="avatar" ref="formRef">
      <el-form-item label="账号" prop="name">
        <el-input v-model="avatar.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="avatar.password"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import type { ElForm } from 'element-plus/lib/components'
import { defineComponent, reactive, ref } from 'vue'
import { rules } from '../config/avatar-config'
export default defineComponent({
  setup() {
    const avatar = reactive({
      name: '',
      password: ''
    })
    const formRef = ref<InstanceType<typeof ElForm>>()
    const loginAction = () => {
      formRef.value?.validate((valid) => {
        //校验没问题 valid为true
        if (valid) {
          console.log('登录逻辑开始')
        }
      })
    }

    return {
      avatar,
      rules,
      loginAction,
      formRef
    }
  }
})
</script>

<style lang="less" scoped></style>
