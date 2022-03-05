import { xyRequest } from '@/service'
import { IDataType } from '../types'

export function getPageListdata(url: string, queryInfo: any) {
  return xyRequest.post<IDataType>({
    url,
    data: queryInfo
  })
}
