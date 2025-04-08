import requester from '@/utils/requester'
import type { InstallData, systemConfigType } from '@/types/config'
import type { missingExtension } from '@/types/global'

const API = {
  getConfig: '/config/get',
  updateConfig: '/config/update',
  checkSysEnv: '/install/env/check',
  getSysInfo: '/index/info',
  install: 'install',
}

export const getConfig = (columns: string[]) => {
  return requester.get<systemConfigType>(API.getConfig, {
    params: { columns: columns.join(',') },
  })
}

export const updateConfig = (data: systemConfigType) => {
  return requester.post<systemConfigType>(API.updateConfig, data)
}

export const checkEnv = () => {
  return requester.get<missingExtension[]>(API.checkSysEnv)
}

export const getSysInfo = () => {
  return requester.get<systemInfo>(API.getSysInfo)
}

export const installPanel = (data: InstallData) => {
  return requester.post<string>(API.install, data)
}
