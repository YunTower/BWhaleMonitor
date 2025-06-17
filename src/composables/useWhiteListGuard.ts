import { getPermissionStore } from '@/stores'

/**
 * 白名单守卫
 * @returns boolean 是否在白名单
 */
export function useWhiteListGuard(to: any): boolean {
  const permissionStore = getPermissionStore()
  const { whiteListRouters } = permissionStore
  return whiteListRouters.some(route => {
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2)
      return to.path === prefix || to.path.startsWith(prefix + '/')
    }
    return route === to.path
  })
}
