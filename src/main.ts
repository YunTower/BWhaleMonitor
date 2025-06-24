import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './permission'
import App from './App.vue'
import router from './router'
import naive from 'naive-ui'

const app = createApp(App)

app.use(createPinia())
app.use(naive)
app.use(router)

app.mount('#app')

console.log(
  '%c BWhaleMonitor 蓝鲸服务器监控探针 by YunTower',
  'font-size:18px;color:#fff;background-image: linear-gradient(252deg, #63e2b7 0%, rgb(42, 148, 125) 100%);',
)
