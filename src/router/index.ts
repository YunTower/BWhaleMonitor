import { createRouter, createWebHistory, useRoute } from 'vue-router'
import { useRouteStore } from '@/stores/route'
import requester from '@/utils/requester'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import type { baseConfigType } from '../../types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('@/views/error.vue'),
      meta: {
        title: '404',
        keepAlive: true,
      },
    },
    {
      path: '/install',
      name: 'install',
      component: () => import('../views/InstallView.vue'),
      meta: {
        title: '安装',
        isMenu: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: '登录',
        isMenu: true,
      },
    },
    {
      path: '/',
      name: 'home',
      alias: ['/', '/home', '/index'],
      component: () => import('../views/IndexView.vue'),
      meta: {
        title: '首页',
        isMenu: true,
      },
    },
    {
      path: '/manager',
      name: 'manager',
      meta: {
        title: '管理',
        isMenu: true,
      },
      children: [
        {
          path: 'server',
          name: 'manager-server',
          alias: ['/manager'],
          component: () => import('../views/manager/ServerView.vue'),
          meta: {
            title: '服务器管理',
          },
        },
        {
          path: 'setting',
          name: 'manager-setting',
          component: () => import('../views/manager/SettingView.vue'),
          meta: {
            title: '系统设置',
          },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const route = useRoute()
  const routeStore = useRouteStore()
  const commonStore = useCommonStore()
  const { isInstall, isUserLogin } = storeToRefs(commonStore)

  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + (commonStore.baseConfig?.title ?? '蓝鲸服务器探针')
  }

  const { code, data } = await requester.get('/setting/get?columns=title,guest')
  if (code !== 0 && to.path !== '/install') {
    return next('/install')
  } else {
    commonStore.setInstall()
    commonStore.setBaseConfig(data as baseConfigType)
  }

  if (code === 0 && to.name === 'install') {
    return next('/')
  }

  if (isInstall.value && (to?.name === 'install' || route?.name === 'install')) {
    if (from.path !== '/') {
      return next('/')
    } else {
      return next()
    }
  }

  if (!isUserLogin.value && to.name !== 'login') {
    return next('/login')
  }

  if (typeof to.name === 'string' && to.name.startsWith('manager-')) {
    routeStore.setMenuClicked('manager')
    routeStore.setSiderClicked(to.name)
  } else if (to.meta?.isMenu) {
    routeStore.setMenuClicked(to.name as string)
  } else {
    routeStore.setSiderClicked(to.name as string)
  }

  return next()
})

export default router
