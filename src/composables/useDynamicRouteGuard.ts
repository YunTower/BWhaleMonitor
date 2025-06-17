import { getPermissionStore } from '@/stores'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 动态路由守卫
 * @returns Promise<boolean> 是否已处理（如动态添加路由、重定向等）
 */
export async function useDynamicRouteGuard(to: any, from: any, next: any): Promise<boolean> {
  const permissionStore = getPermissionStore()
  const { asyncRoutes } = permissionStore

  if (asyncRoutes && asyncRoutes.length === 0) {
    const routeList = await permissionStore.buildAsyncRoutes()
    routeList.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })

    if (to.name === '404') {
      next({ path: to.fullPath, replace: true, query: to.query })
      return true
    } else {
      // 处理多层编码的redirect_url
      let redirect_url = (from.query.redirect_url || to.path) as string
      let prevUrl = ''
      while (prevUrl !== redirect_url) {
        prevUrl = redirect_url
        redirect_url = decodeURIComponent(redirect_url)
      }
      const urlObj = new URL(redirect_url, window.location.origin)
      const path = urlObj.pathname
      const searchParams = Object.fromEntries(urlObj.searchParams)
      next(
        to.path === path
          ? { ...to, replace: true }
          : {
            path: path,
            query: { ...searchParams, ...to.query },
          },
      )
      return true
    }
  }
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
