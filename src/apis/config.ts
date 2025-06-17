import { request } from '@/utils/request'
import type { InstallData, systemConfigType } from '@/types/config'
import type { missingExtension } from '@/types/global'
import type { systemInfo } from '@/types/manager'

const API = {
  getConfig: '/config/get',
  updateConfig: '/config/update',
  checkSysEnv: '/install/env/check',
  getSysInfo: '/index/info',
  install: 'install',
}

export const getConfig = (columns: string[]) => {
  return request.get<systemConfigType>({
    url: API.getConfig,
    params: {
      columns: columns.join(','),
    },
  })
}

export const updateConfig = (data: systemConfigType) => {
  return request.post<systemConfigType>({ url: API.updateConfig, data })
}

export const checkEnv = () => {
  return request.get<missingExtension[]>({ url: API.checkSysEnv })
}

export const getSysInfo = () => {
  return request.get<systemInfo>({ url: API.getSysInfo })
}

export const installPanel = (data: InstallData) => {
  return request.post<string>({ url: API.install, data })
}
