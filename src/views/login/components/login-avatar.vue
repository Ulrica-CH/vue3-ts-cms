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
import { useStore } from 'vuex'
import { rules } from '../config/avatar-config'
import local from '../../../utils/cache'
export default defineComponent({
  setup() {
    const store = useStore()
    //定义属性
    const avatar = reactive({
      name: local.getCache('name') ?? '',
      password: local.getCache('password') ?? ''
    })
    const formRef = ref<InstanceType<typeof ElForm>>()
    //定义方法
    const avatarLogin = (isKeepPassword: boolean) => {
      formRef.value?.validate((valid) => {
        //校验没问题 valid为true
        if (valid) {
          console.log('登录逻辑开始')
          //记住密码逻辑
          if (isKeepPassword) {
            local.setCache('name', avatar.name)
            local.setCache('password', avatar.password)
          } else {
            local.removeCache('name')
            local.removeCache('password')
          }
          //登录逻辑
          store.dispatch('login/avatarLoginAction', { ...avatar })
        }
      })
    }

    return {
      avatar,
      rules,
      avatarLogin,
      formRef
    }
  }
})
</script>

<style lang="less" scoped></style>
