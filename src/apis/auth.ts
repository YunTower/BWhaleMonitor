import { request } from '@/utils/request'
import type { RouteItem, userType } from '@/types/global'

const API = {
  authAdminLogin: '/auth/admin',
  authVisitorLogin: '/auth/visitor',
  authCheck: '/auth/check',
  authLogout: '/auth/logout',
  authCaptcha: '/auth/captcha',
  menuList: '/auth/menu',
}

export const authAdminLogin = (data: { username: string; password: string; captcha: string }) => {
  return request.post<userType>({ url: API.authAdminLogin, data })
}

export const authVisitorLogin = (data: { password?: string | null; captcha: string }) => {
  return request.post<userType>({ url: API.authVisitorLogin, data })
}

export const authLogout = () => {
  return request.post<string>({ url: API.authLogout })
}

export const authCheck = () => {
  return request.get<userType>({ url: API.authCheck })
}

export const getCaptcha = () => {
  return API.authCaptcha + '?t=' + new Date().getTime()
}

export const getMenuList = () => {
  return request.get<RouteItem[]>({
    url: API.menuList,
  })
}
