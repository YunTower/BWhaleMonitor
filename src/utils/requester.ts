import axios, { type AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { createDiscreteApi } from 'naive-ui'
const { message} = createDiscreteApi(
  ['message'],
)

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
  async (response: any) => {
    // 判断请求是否正常
    if (response.status !== 200) {
      if (response.data.code === 429) {
        message.error(response.data?.msg ?? '请求过于频繁，请稍后再试！')
      }
      if (response.status !== 404) {
        return Promise.reject(response)
      }
    } else {
      return response.data
    }
  },
  (error: AxiosError) => {
    if (error.status === 404) {
      message.error('404 页面/接口不存在')
    }
    if (error.status === 500) {
      message.error('服务器错误，请联系管理员修复')
    }
    if (
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      error.message.includes('timeout')
    ) {
      message.error('网络异常，请求超时！')
    }
    return Promise.reject(error.response)
  },
)

export default requester
