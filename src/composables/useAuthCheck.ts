import { authCheck } from '@/apis/auth'
import { useCommonStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

/**
 * 鉴权检查
 * @returns Promise<boolean> 是否需要中断后续流程（如已重定向）
 */
export async function useAuthCheck(to: any, next: any): Promise<boolean> {
  const commonStore = useCommonStore()
  const { isUserLogin } = storeToRefs(commonStore)
  if (!isUserLogin.value && to.name !== 'login') {
    try {
      const data = await authCheck()
      commonStore.setUserLogin(data)
      return false
    } catch (err) {
      message.error((err as { msg: string })?.msg ?? '获取登录状态失败')
      return next('/login')
    }
  }
  return false
}
