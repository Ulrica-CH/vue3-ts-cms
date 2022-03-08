import { ref } from 'vue'
import PageModal from '@/components/page-modal'
type callFn = () => void
export function usePageModal(newFn?: callFn, editFn?: callFn) {
  const pageModalRef = ref<InstanceType<typeof PageModal>>()
  const defaultInfo = ref({})
  const handleNewData = () => {
    defaultInfo.value = {}
    if (pageModalRef.value) {
      pageModalRef.value.dialogVisible = true
    }
    //有些有值执行函数
    newFn && newFn()
  }
  const handleEditData = (item: any) => {
    defaultInfo.value = { ...item }
    console.log(item)

    if (pageModalRef.value) {
      pageModalRef.value.dialogVisible = true
    }
    editFn && editFn()
  }
  return { handleEditData, handleNewData, defaultInfo, pageModalRef }
}
