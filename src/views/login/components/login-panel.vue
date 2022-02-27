<template>
  <div class="login-panel">
    <h2 class="title">垃圾分类后台系统</h2>
    <el-tabs type="border-card" class="demo-tabs" stretch>
      <el-tab-pane>
        <template #label>
          <span>
            <el-icon><avatar /></el-icon>
            账号登录
          </span>
        </template>
        <login-avatar ref="avatarRef" />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span>
            <el-icon><iphone /></el-icon>手机登录
          </span>
        </template>
        <login-iphone />
      </el-tab-pane>
    </el-tabs>

    <div class="avatar-control">
      <el-checkbox label="记住密码" v-model="isKeepPwd">记住密码</el-checkbox>
      <el-link type="primary">忘记密码</el-link>
    </div>

    <el-button type="primary" class="avatar-login" @click="handleLoginClick"
      >立即登录</el-button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { Avatar, Iphone } from '@element-plus/icons-vue'
import LoginAvatar from './login-avatar.vue'
import LoginIphone from './login-iphone.vue'

export default defineComponent({
  components: {
    LoginAvatar,
    LoginIphone,
    Avatar,
    Iphone
  },
  setup() {
    const isKeepPwd = ref(true)
    //这里的类型不懂 以后再说
    const avatarRef = ref<InstanceType<typeof LoginAvatar>>()
    const handleLoginClick = () => {
      avatarRef.value?.loginAction()
    }
    return {
      isKeepPwd,
      handleLoginClick,
      avatarRef
    }
  }
})
</script>

<style lang="less" scoped>
.login-panel {
  margin-bottom: 150px;
  width: 360px;
  .title {
    text-align: center;
  }
}
.avatar-control {
  margin-top: 10px;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
}
.avatar-login {
  margin-top: 10px;
  width: 100%;
}
</style>
