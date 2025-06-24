import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteItem } from '@/types/global'
import router, { defaultRouterList } from '@/router'
import { store } from '@/stores'
import { transformObjectToRoute } from '@/utils/route'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login', '/install', '/404'],
    routers: [] as RouteRecordRaw[],
    removeRoutes: [] as RouteRecordRaw[],
    asyncRoutes: [] as RouteRecordRaw[],
    isRoutesBuilt: false,
  }),
  actions: {
    async initRoutes() {
      const accessedRouters = this.asyncRoutes
      this.routers = [...defaultRouterList, ...accessedRouters]
      console.log(this.routers)
    },
    async buildAsyncRoutes(routes: RouteItem[]) {
      if (this.isRoutesBuilt && this.asyncRoutes.length > 0) {
        return this.asyncRoutes
      }

      this.asyncRoutes = transformObjectToRoute(routes)
      this.isRoutesBuilt = true
      await this.initRoutes()
      return this.asyncRoutes
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
