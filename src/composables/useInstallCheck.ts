import { getConfig } from '@/apis/config'
import { useCommonStore } from '@/stores'
import type { baseConfigType } from '@/types/config'
import { ref } from 'vue'

// 添加缓存标志，避免重复请求
let configLoaded = false

/**
 * 安装检测与配置获取
 * @returns Promise<boolean> 是否需要中断后续流程（如已重定向）
 */
export async function useInstallCheck(to: any, next: any): Promise<boolean> {
  const commonStore = useCommonStore()
  const mainTitle = ref('服务器探针')

  // 如果配置已加载且store中有配置，直接返回
  if (configLoaded && commonStore.baseConfig?.title) {
    return false
  }

  try {
    const data = await getConfig(['title', 'visitor', 'visitor_password'])
    console.log(data)
    // if (code === 1501) {
    //   if (to.path === '/install') {
    //     next()
    //     return true
    //   }
    //   next('/install')
    //   return true
    // }
    commonStore.setInstall()
    commonStore.setBaseConfig(data as baseConfigType)
    if (commonStore.baseConfig?.title) {
      mainTitle.value = commonStore.baseConfig?.title
    }
    configLoaded = true
  } catch (error) {
    console.error('获取配置失败:', error)
  }

  return false
}
