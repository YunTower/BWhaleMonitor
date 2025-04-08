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

export interface CpuDetails {
  id: number
  cores: number
  mhz: number
  name: string
  physicalId: string
  vendorId: string
}

export interface DiskDetails {
  path: string
  free: number
  total: number
  used: number
}

export interface ServerInfoType {
  id: number
  name: string
  os: string
  ip: string
  location: string
  cpu: CpuDetails[]
  memory: number
  disk: DiskDetails[]
  uptime: string
  status: number
}

export interface systemInfo {
  title: string
  php: string
  os: string
  version: string
  http_api: string
  websocket_api: string
  install_time: string
}

export interface AddForm {
  name: string
  ip: string
  os: string
  location: string
  script?: string
}
