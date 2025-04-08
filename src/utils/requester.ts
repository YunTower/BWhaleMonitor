import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { createDiscreteApi } from 'naive-ui'
import type { BaseResponseType } from '@/types/global'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

const { notification } = createDiscreteApi(['notification'])
const requester: AxiosInstance = axios.create({
  baseURL: '/api',
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
  // @ts-ignore
  async (response: AxiosResponse) => {
    const baseResponse: BaseResponseType<object> = {
      code: response.data.code,
      data: response.data.data,
      msg: response.data.msg,
    }
    return baseResponse
  },
  (error: AxiosError) => {
    if (error.response) {
      // if (error.response.status === 500) {
      //   notification?.error?.({ content: error.response?.data?.msg ?? '服务器错误，请稍后重试' })
      // }

      // if (error.response.status === 404) {
      //   notification?.error?.({ content: error.response?.data?.msg ?? '404 页面/接口不存在' })
      // }

      if (error.response.status === 429) {
        notification?.error?.({
          content: (error.response?.data as { msg: string })?.msg ?? '请求过于频繁，请稍后再试！',
        })
      }
    } else {
      if (
        error.code === 'ECONNABORTED' ||
        error.message === 'Network Error' ||
        error.message.includes('timeout')
      ) {
        notification?.error?.({ content: '网络异常，请求超时！' })
      }
    }

    // 构建基础响应对象
    const baseResponse: BaseResponseType<object> = {
      code: (error.response?.data as { code: number })?.code || -1,
      data: (error.response?.data as { data: object })?.data || null,
      msg: (error.response?.data as { msg: string })?.msg || '未知错误',
      error,
    }

    return baseResponse
  },
)

// @ts-ignore
interface ExtendedAxiosInstance extends AxiosInstance {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponseType<T>>

  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<BaseResponseType<T>>

  put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<BaseResponseType<T>>

  delete<T>(url: string, config?: object): Promise<BaseResponseType<T>>
}

const extendedRequester: ExtendedAxiosInstance = requester as ExtendedAxiosInstance

export default extendedRequester
