import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteItem } from '@/types/global'
import { getMenuList } from '@/apis/auth'
import router, { defaultRouterList } from '@/router'
import { store } from '@/stores'
import { transformObjectToRoute } from '@/utils/route'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: [
      '/login',
      '/install',
      '/404'
    ],
    routers: [] as RouteRecordRaw[],
    removeRoutes: [] as RouteRecordRaw[],
    asyncRoutes: [] as RouteRecordRaw[],
    isRoutesBuilt: false,
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes
      this.routers = [...defaultRouterList, ...accessedRouters]
    },
    async buildAsyncRoutes() {
      if (this.isRoutesBuilt && this.asyncRoutes.length > 0) {
        return this.asyncRoutes
      }

      try {
        const asyncRoutes= await getMenuList()
        this.asyncRoutes = transformObjectToRoute(asyncRoutes)
        this.isRoutesBuilt = true
        await this.initRoutes()
        return this.asyncRoutes
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new Error("Can't build routes")
      }
    },
    async restoreRoutes() {
      this.asyncRoutes.forEach((item: RouteRecordRaw) => {
        if (item.name) {
          router.removeRoute(item.name)
        }
      })
      this.asyncRoutes = []
      this.isRoutesBuilt = false
    },
  },
})

export function getPermissionStore() {
  return usePermissionStore(store)
}
