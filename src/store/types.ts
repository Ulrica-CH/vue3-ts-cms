import { ILoginState } from './login/types'

export interface IRootState {
  name: string
}
//store模块中的类型
export interface IRootAndModule {
  login: ILoginState
}

export type IStoreState = IRootState & IRootAndModule
