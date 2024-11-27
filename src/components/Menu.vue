<template>
  <div class="menu">
    <n-space class="center">
      <div class="refresh-time" v-show="name ? name == 'home' : activeKey == 'home'">
        <n-popover trigger="hover">
          <template #trigger>
            <n-progress type="circle" :percentage="80" :color="themeVars.successColor">
              4s
            </n-progress>
          </template>
          <span>刷新间隔，点击立即刷新</span>
        </n-popover>
      </div>
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" responsive />
      <div class="username">
        <n-dropdown :options="dropdownOptions" @select="handleSelect">
          <n-gradient-text type="success" size="15"
            >{{ isUserLogin ? userInfo?.username : '未登录' }}
          </n-gradient-text>
        </n-dropdown>
      </div>
    </n-space>
  </div>
</template>
<style scoped>
.menu {
  border: 1px solid rgb(239, 239, 245);
}

.username {
  position: absolute;
  top: 10px;
  right: 30px;
  font-weight: 550;
}

.center {
  justify-content: center !important;
}

.refresh-time {
  position: absolute;
  top: 10px;
  left: 20px;
  width: 10px;
}

:deep(.n-progress) {
  width: 30px !important;
}

:deep(.n-progress-text) {
  font-size: 13px !important;
}

:deep(.v-overflow) {
  justify-content: center;
}

:deep(.n-menu-item-content--selected) {
  color: #18a058;
  font-weight: 400;
  border-bottom: 2px solid #18a058 !important;
}
</style>
<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { type MenuOption, useThemeVars, createDiscreteApi } from 'naive-ui'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRouteStore } from '@/stores/route'
import { useCommonStore } from '@/stores/common'
import requester from '@/utils/requester'

const routeStore = useRouteStore()
const commonStore = useCommonStore()
const { menuClicked } = storeToRefs(routeStore)
const { isUserLogin, userInfo } = storeToRefs(commonStore)
const activeKey = ref<string | null>(menuClicked)
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const name = route.name
const { message } = createDiscreteApi(['message'])
const isAdminRole = ref(false)

const dropdownOptions = [
  {
    label: '退出登录',
    key: 'logout',
  },
]

const handleSelect = async (key: string | number) => {
  if (key == 'logout') {
    const { code, msg } = await requester.post('/auth/logout')
    if (code == 0) {
      message.success('退出成功')
      commonStore.setUserLogout()
      await router.push('/login')
    } else {
      message.error(`退出失败，${msg}`)
    }
  }
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/',
        },
        { default: () => '首页' },
      ),
    key: 'home',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/manager',
        },
        { default: () => '管理' },
      ),
    key: 'manager',
    show: isAdminRole,
  },
]

onMounted(() => {
  if (commonStore.userInfo?.role == 'admin') {
    isAdminRole.value = true
  }
})
</script>
