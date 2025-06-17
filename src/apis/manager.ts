import { request } from '@/utils/request'
import type { Paginate } from '@/types/global'
import type { AddForm, ServerInfoType } from '@/types/manager'

const API = {
  getSeverList: '/server/get',
  addSever: '/server/add',
  deleteSever: '/server/delete',
  updateSever: '/server/update',
}

export const getSeverList = (view: 'list' = 'list', page: number = 1, limit: number = 15) => {
  return request.get<Paginate<ServerInfoType[]>>({
    url: API.getSeverList,
    params: {
      view,
      page,
      limit,
    },
  })
}

export const addSever = (data: AddForm) => {
  return request.post<ServerInfoType>({ url: API.addSever, data })
}
