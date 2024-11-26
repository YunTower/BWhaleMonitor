import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { createDiscreteApi } from 'naive-ui'
import type { baseConfigType, BaseResponseType, ErrorResponseType } from '@/../types'

const { message } = createDiscreteApi(['message'])

const requester: AxiosInstance = axios.create({
  // 设置基础路径
  baseURL: '/api',
  // 请求超时时间
  timeout: 5000,
})

requester.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

requester.interceptors.response.use(
  async (response: AxiosResponse) => {
    const baseResponse: BaseResponseType<any> = {
      code: response.data.code,
      data: response.data.data,
      msg: response.data.msg,
    }
    return baseResponse
  },
  (error: AxiosError) => {
    if (error.response?.status === 404) {
      message.error('404 页面/接口不存在')
    }
    if (error.response?.status === 500) {
      message.error('服务器错误，请联系管理员修复')
    }
    if (error.response?.status === 429) {
      message.error('请求过于频繁，请稍后再试！')
    }

    if (
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      error.message.includes('timeout')
    ) {
      message.error('网络异常，请求超时！')
    }

    const baseResponse: BaseResponseType<any> = {
      code: (error.response?.data as { code: number })?.code || -1,
      data: (error.response?.data as { data: any })?.data || null,
      msg: (error.response?.data as { msg: string })?.msg || '未知错误',
      error,
    }
    return baseResponse
  },
)

interface ExtendedAxiosInstance extends AxiosInstance {
  get<T>(url: string, config?: any): Promise<BaseResponseType<T>>

  post<T>(url: string, data?: any, config?: any): Promise<BaseResponseType<T>>

  put<T>(url: string, data?: any, config?: any): Promise<BaseResponseType<T>>

  delete<T>(url: string, config?: any): Promise<BaseResponseType<T>>
}

const extendedRequester: ExtendedAxiosInstance = requester as ExtendedAxiosInstance

export default extendedRequester
