import type { Paginate } from '@/types/global'
import type { AddForm, ServerInfoType } from '@/types/manager'
import requester from '@/utils/requester'

const API = {
  getSeverList: '/server/get',
  addSever: '/server/add',
  deleteSever: '/server/delete',
  updateSever: '/server/update',
}

export const getSeverList = (view: 'list' = 'list', page: number = 1, limit: number = 15) => {
  return requester.get<Paginate<ServerInfoType[]>>(API.getSeverList, {
    params: {
      view,
      page,
      limit,
    },
  })
}

export const addSever = (data: AddForm) => {
  return requester.post<ServerInfoType>(API.addSever, data)
}
