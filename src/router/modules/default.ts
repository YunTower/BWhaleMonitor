export default [
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
    component: () => import('@/views/install.vue'),
    meta: {
      title: '安装',
      isMenu: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
      isMenu: true,
    },
  },
  {
    path: '/',
    name: 'home',
    alias: ['/', '/home', '/index'],
    component: () => import('@/views/index.vue'),
    meta: {
      title: '首页',
      isMenu: true,
    },
  }
]
