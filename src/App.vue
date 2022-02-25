<template>
  <div class="app">
    <h2>{{ $store.state.name }}</h2>
    <router-link to="/login">login</router-link>

    <router-link to="/main">main</router-link>
    <router-view />
    <el-button type="">哈哈哈</el-button>
    <el-button type="danger">哈哈哈</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {}
})
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
