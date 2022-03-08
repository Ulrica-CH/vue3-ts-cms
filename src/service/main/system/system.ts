import { xyRequest } from '@/service'
import { IDataType } from '../types'

export function getPageListdata(url: string, queryInfo: any) {
  return xyRequest.post<IDataType>({
    url,
    data: queryInfo
  })
}
export function deleteData(url: string) {
  xyRequest.delete<IDataType>({
    url
  })
}
export function createData(url: string, newData: any) {
  // console.log(url)
  xyRequest.post<IDataType>({
    url,
    data: newData
  })
}
export function editData(url: string, newData: any) {
  xyRequest.patch<IDataType>({
    url,
    data: newData
  })
}
