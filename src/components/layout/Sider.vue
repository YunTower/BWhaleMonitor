<script setup lang="ts">
import { h, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { MenuOption } from 'naive-ui'
import { ServerOutline, SettingsOutline } from '@vicons/ionicons5'
import { useRouteStore } from '@/stores'
import { renderIcon } from '@/utils/common'

const routeStore = useRouteStore()
const { siderClicked } = storeToRefs(routeStore)
const activeKey = ref(siderClicked)

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/manager/server',
        },
        { default: () => '服务器管理' },
      ),
    key: 'manager-server',
    icon: renderIcon(ServerOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/manager/setting',
        },
        { default: () => '系统设置' },
      ),
    key: 'manager-setting',
    icon: renderIcon(SettingsOutline),
  },
]
</script>
<template>
  <n-menu
    :collapsed-width="64"
    :collapsed-icon-size="22"
    v-model:value="activeKey"
    :options="menuOptions"
  />
</template>
