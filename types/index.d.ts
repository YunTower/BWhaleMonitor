export interface BaseResponseType<T> {
  code: number
  data: T
  msg: string
  error?: any
}

export interface userType {
  username: string
  role: 'admin' | 'visitor'
}

export interface ServerItemType {
  id: number
  name: string
  cpu: number
  memory: number
  disk: number
  cpu_use: number
  memory_use: number
  disk_use: number
  os: string
  ip: string
  location: string
  net_download: number
  net_upload: number
  status: 1 | 0
}

export interface ServerInfoType {
  id: number
  name: string
  os: string
  ip: string
  location: string
  cpu: number
  memory: number
  disk: number
  network: string
  status: number
}

export interface baseConfigType {
  title: string
  visitor: boolean | string
  visitor_password: boolean | string
}

export interface systemConfigType extends baseConfigType {
  username: string
  password: string
  interval: number
}

export interface missingExtension {
  name: string
  status: boolean
  type: string
}
