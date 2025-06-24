import router from '@/router'
import { getPermissionStore } from '@/stores'
import { useCommonStore } from '@/stores'
import { createDiscreteApi } from 'naive-ui'

const PAGE_NOT_FOUND_NAME = '404'
const mainTitle = '蓝鲸服务器监控探针'
const { message } = createDiscreteApi(['message'])

import { useInstallCheck } from '@/composables/useInstallCheck'
import { useAuthCheck } from '@/composables/useAuthCheck'
import { useConfigTitle } from '@/composables/useConfigTitle'
import { useDynamicRouteGuard } from '@/composables/useDynamicRouteGuard'
import { useWhiteListGuard } from '@/composables/useWhiteListGuard'

router.beforeEach(async (to, from, next) => {
  // 安装检测与配置获取
  const installRedirected = await useInstallCheck(to, next)
  if (installRedirected) return
  // 配置页面标题
  useConfigTitle(to)

  // 鉴权检查
  const authRedirected = await useAuthCheck(to, next)
  if (authRedirected) return

  try {
    const permissionStore = getPermissionStore()
    const asyncRoutes = await permissionStore.buildAsyncRoutes()
    asyncRoutes.forEach((route) => {
      router.addRoute(route)
    })
  } catch (e) {
    message.error((e as { message: string })?.message)
  }

  const commonStore = useCommonStore()
  const isUserLogin = commonStore.isUserLogin
  if (isUserLogin) {
    if (to.name === 'auth-login') {
      return next('/')
    }
    try {
      next()
    } catch (error) {
      message.error((error as { msg: string }).msg)
      return next({
        path: '/login',
        query: { redirect_url: encodeURIComponent(to.fullPath) },
      })
    }
  } else {
    // 白名单守卫
    const isInWhiteList = useWhiteListGuard(to)
    if (isInWhiteList) {
      return next()
    } else {
      return next({
        path: '/login',
        query: { redirect_url: encodeURIComponent(to.fullPath) },
      })
    }
  }
})

router.afterEach(async (to) => {
  const commonStore = useCommonStore()
  const permissionStore = getPermissionStore()

  if (to.path === '/login') {
    if (!commonStore.isUserLogin) {
      await permissionStore.restoreRoutes()
    }
  }
})
