import { getPermissionStore } from '@/stores'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 动态路由守卫
 * @returns Promise<boolean> 是否已处理（如动态添加路由、重定向等）
 */
export async function useDynamicRouteGuard(to: any, from: any, next: any): Promise<boolean> {
  const permissionStore = getPermissionStore()
  // 动态路由已全局预加载，无需再注册
  if (to.name) {
    if (router.hasRoute(to.name as string)) {
      next()
    } else {
      next(`/`)
    }
  } else {
    next(`/`)
  }
  return true
}
