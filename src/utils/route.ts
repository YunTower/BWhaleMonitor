import { shallowRef, type ShallowRef } from 'vue'
import type { RouteItem } from '@/types/global'
import type { RouteMeta } from 'vue-router'

const iconsPath = import.meta.glob('../../node_modules/@vicons/ionicons5/es/*.js')

// 动态从包内引入单个Icon
export async function getMenuIcon(iconName: string): Promise<ShallowRef<unknown>> {
  const RenderIcon =
    iconsPath[`../../node_modules/@vicons/ionicons5/es/${iconName}.js`]
  const icon = await RenderIcon()
  return shallowRef((icon as { default: unknown }).default)
}

// 动态引入路由组件
function asyncImportRoute(routes: RouteItem[] | undefined) {
  const modules = import.meta.glob('../views/**/**/*.vue')
  if (!routes) return

  routes.forEach(async (item) => {
    // 处理字符串形式的组件路径
    if (typeof item.component === 'string') {
      const componentPath = `../views${item.component}.vue`
      if (modules[componentPath]) {
        item.component = modules[componentPath]
      } else {
        console.warn(`找不到组件: ${componentPath}`)
      }
    }
    // 递归处理 children
    if (item.children && item.children.length > 0) {
      asyncImportRoute(item.children)
    }
    // 图标处理保持不变
    if (item.meta.icon) item.meta.icon = await getMenuIcon(item.meta.icon)
  })
}

// 将背景对象变成路由对象
export function transformObjectToRoute<T = RouteItem>(routeList: RouteItem[]): T[] {
  routeList.forEach(async (route) => {
    // 如果有children，则处理children
    if (route.children && route.children.length > 0) {
      asyncImportRoute(route.children)
    }

    route.meta = (route.meta || {}) as RouteMeta
    if (route.meta.icon) route.meta.icon = await getMenuIcon(route.meta.icon)
  })

  return [...routeList] as unknown as T[]
}
