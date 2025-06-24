import type { DefineComponent, defineComponent } from 'vue'

export interface UserInfo {
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

export type Component<T = never> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<DefineComponent>)
  | (() => Promise<T>)

export interface RouteItem {
  path: string
  name: string
  component?: Component | string
  components?: Component
  redirect?: string
  meta: RouteMeta
  children?: Array<RouteItem>
}

export enum ContentTypeEnum {
  Json = 'application/json;charset=UTF-8',
  FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data;charset=UTF-8',
}

export interface RouteMeta {
  title?: string | Record<string, string>
  icon?: string | any // Allow any type to accommodate dynamic icon components
  expanded?: boolean
  orderNo?: number
  hidden?: boolean
  hiddenBreadcrumb?: boolean
  single?: boolean
  keepAlive?: boolean
  frameSrc?: string
  frameBlank?: boolean
}

export declare type Recordable<T = never> = Record<string, T>
