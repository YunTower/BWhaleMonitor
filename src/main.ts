import './assets/main.css'
import { createApp, watch } from 'vue'
import { createPinia, storeToRefs } from 'pinia'

import App from './App.vue'
import router from './router'
import naive from 'naive-ui'
import './permission'
import { getPermissionStore } from '@/stores'

const app = createApp(App)

app.use(createPinia())
app.use(naive)

// 全局预加载动态路由
await (async () => {
    const permissionStore = getPermissionStore()
    const asyncRoutes = await permissionStore.buildAsyncRoutes()
    asyncRoutes.forEach(route => {
        router.addRoute(route)
    })
})()

app.use(router)

app.mount('#app')

console.log("%c BWhaleMonitor 蓝鲸服务器监控探针 by YunTower", "font-size:18px;color:#fff;background-image: linear-gradient(252deg, #63e2b7 0%, rgb(42, 148, 125) 100%);")
