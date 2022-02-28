export interface IAvatar {
  name: string
  password: string
}

export interface ILoginType {
  id: number
  name: string
  token: string
}
//T来决定里面的datat类型而不是写死
export interface IDataType<T = any> {
  code: number
  data: T
}
