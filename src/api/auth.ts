import requester from '@/utils/requester'
import type { userType } from '@/types/global'

const API = {
  authAdminLogin: '/auth/admin',
  authVisitorLogin: '/auth/visitor',
  authCheck: '/auth/check',
  authLogout: '/auth/logout',
  authCaptcha: '/api/auth/captcha'
}

export const authAdminLogin = (data: { username: string; password: string; captcha: string }) => {
  return requester.post<userType>(API.authAdminLogin, data)
}

export const authVisitorLogin = (data: { password?: string | null; captcha: string }) => {
  return requester.post<userType>(API.authVisitorLogin, data)
}

export const authLogout = () => {
  return requester.post<string>(API.authLogout)
}

export const authCheck = () => {
  return requester.get<userType>(API.authCheck)
}

export const getCaptcha = () => {
  return API.authCaptcha + '?t=' + new Date().getTime()
}
