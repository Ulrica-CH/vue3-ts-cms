<template>
  <div class="role">
    <page-search :searchFormConfig="searchFormConfig"></page-search>
    <page-content
      :contentTableConfig="contentTableConfig"
      :pageName="'role'"
    ></page-content>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageSearch from '@/components/page-search'
import PageContent from '@/components/page-content'
import { contentTableConfig } from './content-config'
import { searchFormConfig } from './search-config'
export default defineComponent({
  name: 'role',
  components: { PageContent, PageSearch },
  setup() {
    return { contentTableConfig, searchFormConfig }
  }
})
</script>

<style scoped></style>
