import { ILoginState } from './login/types'

export interface IRootState {
  entireDepartmentList: any[]
  entireRoleList: any[]
}
//store模块中的类型
export interface IRootAndModule {
  login: ILoginState
}

export type IStoreState = IRootState & IRootAndModule
