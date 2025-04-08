export interface userType {
  username: string
  role: 'admin' | 'visitor'
}

export interface missingExtension {
  name: string
  status: boolean
  type: string
}

export interface BaseResponseType<T> {
  code: number
  data: T
  msg: string
  error?: any
}

export interface Paginate<T> {
  current_page: number
  limit: number
  total: number
  total_page: number
  data: T
}

export interface SocketMessage {
  type: string
  status?: string
  message?: string
  data: any
}
