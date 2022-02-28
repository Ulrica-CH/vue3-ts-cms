<template>
  <div class="login-avatar">
    <el-form label-width="60px">
      <el-form-item label="手机号" prop="num">
        <el-input v-model="phone.name"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="phone-code">
          <el-input v-model="phone.password"></el-input>
          <el-button type="primary" class="phone-button">获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  setup() {
    const store = useStore()
    //定义属性
    const phone = reactive({
      num: '',
      code: ''
    })
    //定义方法
    const phoneLogin = () => {
      console.log(2)
      store.dispatch('login/phoneLoginAction', { phone: 123455 })
    }
    return {
      phone,
      phoneLogin
    }
  }
})
</script>
<style lang="less" scoped>
.phone-code {
  width: 100%;
  display: flex;
  .phone-button {
    margin-left: 5px;
  }
}
</style>
