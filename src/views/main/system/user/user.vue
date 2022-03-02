<template>
  <div>
    <xy-form v-bind="searchFormConfig"></xy-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import XyForm from '@/base-ui/form'
import { searchFormConfig } from './config/search-config'
export default defineComponent({
  components: { XyForm },
  setup() {
    return { searchFormConfig }
  }
})
</script>

<style scoped></style>
