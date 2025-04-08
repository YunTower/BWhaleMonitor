export interface baseConfigType {
  title: string
  visitor: boolean | string
  visitor_password: boolean | string
}

export interface systemConfigType extends baseConfigType {
  username: string
  password: string
  interval: number | string
}

export interface InstallData {
  username: string
  password: string
  title: string
}
