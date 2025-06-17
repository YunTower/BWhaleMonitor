import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const defaultModules = import.meta.glob('./modules/**/default.ts', { eager: true })

export const defaultRouterList: Array<RouteRecordRaw> = mapModuleRouterList(defaultModules)
export const allRoutes = [...defaultRouterList]

// 固定路由模块转换为路由
export function mapModuleRouterList(modules: Record<string, unknown>): Array<RouteRecordRaw> {
  const routerList: Array<RouteRecordRaw> = []
  Object.keys(modules).forEach((key) => {
    // @ts-expect-error: ignore
    const mod = modules[key].default || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    routerList.push(...modList)
  })
  return routerList
}

export const getActive = (maxLevel = 3): string => {
  const route = router.currentRoute.value

  if (!route.path) {
    return ''
  }

  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('')
}

const router = createRouter({
  history: createWebHistory('/'),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})
export default router
