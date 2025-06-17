import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
// import type { Recordable } from '@/types/global'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function joinTimestamp<T extends boolean>(
  join: boolean,
  restful: T,
): T extends true ? string : object

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {}
  }
  const now = new Date().getTime()
  if (restful) {
    return `?_t=${now}`
  }
  return { _t: now }
}

// 格式化提交参数时间
export function formatRequestDate(params: Record<string, unknown>) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    const value = params[key] as unknown
    if (
      value &&
      typeof value === 'object' &&
      '_isAMomentObject' in value &&
      (value as { _isAMomentObject?: unknown })._isAMomentObject &&
      typeof (value as unknown as { format?: unknown }).format === 'function'
    ) {
      params[key] = (value as unknown as { format: (fmt: string) => string }).format(
        DATE_TIME_FORMAT,
      )
    }
    if (isString(key)) {
      if (value) {
        try {
          params[key] = isString(value) ? (value as string).trim() : value
        } catch (error: unknown) {
          throw new Error(error as string)
        }
      }
    }
    if (isObject(value)) {
      formatRequestDate(value as Record<string, unknown>)
    }
  }
}

// 将对象转为Url参数
export function setObjToUrlParams(baseUrl: string, obj: { [index: string]: never }): string {
  let parameters = ''
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}
