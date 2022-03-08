import { useStore } from 'vuex'
export function usePermission(pageName: string, hanldeName: string) {
  const store = useStore()
  const permissions = store.state.login.permission
  const verifyPermission = `system:${pageName}:${hanldeName}`
  return !!permissions.find((item: any) => item === verifyPermission)
}
