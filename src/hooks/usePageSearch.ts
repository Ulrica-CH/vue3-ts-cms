import { ref } from 'vue'
import PageContent from '@/components/page-content'
export function usePageSearch() {
  const pageContentRef = ref<InstanceType<typeof PageContent>>()
  const handleResetClick = () => {
    pageContentRef.value?.getListData()
  }
  const handleQueryClick = (queryInfo: any) => {
    pageContentRef.value?.getListData(queryInfo)
  }
  return [pageContentRef, handleQueryClick, handleResetClick]
}
