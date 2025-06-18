import { request } from '@/utils/request'

const API = {
  ServerList: '/data/list.json',
}

export const getServerList = (view: 'list' = 'list', page: number = 1, limit: number = 15) => {
  return request.get({
    url: API.ServerList,
  })
}
