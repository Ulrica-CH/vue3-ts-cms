import { xyRequest } from '../index'
import type { IAvatar, IDataType, ILoginType } from './types'

//枚举类型
enum LoginURL {
  avatarURL = '/login',
  userInfoURL = '/users/',
  userMenuURL = '/role/'
}
export function avatarLoginRequest(avatar: IAvatar) {
  //post方法要传递一个泛型类型
  return xyRequest.post<IDataType<ILoginType>>({
    url: LoginURL.avatarURL,
    data: avatar
  })
}
export function requestUserInfoById(id: number) {
  return xyRequest.get<IDataType>({
    url: LoginURL.userInfoURL + id
  })
}
export function requestUserMenusByRoleId(id: number) {
  return xyRequest.get<IDataType>({
    url: LoginURL.userMenuURL + id + '/menu'
  })
}
