import { useCommonStore } from '@/stores'
import { ref, watch } from 'vue'

/**
 * 配置页面标题
 */
export function useConfigTitle(to: any) {
  const commonStore = useCommonStore()
  const mainTitle = ref('服务器探针')
  if (commonStore.baseConfig?.title) {
    mainTitle.value = commonStore.baseConfig?.title
  }
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + mainTitle.value
  }
  watch(mainTitle, () => {
    document.title = to.meta.title + ' - ' + mainTitle.value
  })
}
