<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/stores'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ManagerLayout from '@/layouts/ManagerLayout.vue'

const commonStore = useCommonStore()
const { isInstall } = storeToRefs(commonStore)
const route = useRoute()
const loading = ref(true)
const hideMenu = computed(() => {
  return !isInstall.value || route.name === 'login'
})
const isManagerPage = computed(() => {
  const routeName = route.name?.toString()
  return routeName?.startsWith('manager-') || routeName === 'manager'
})

const layoutComponent = computed(() => {
  if (isManagerPage.value) {
    return ManagerLayout
  }
  return DefaultLayout
})

onMounted(() => {
  loading.value = false
})
</script>
<template>
  <n-config-provider>
    <n-message-provider>
      <n-spin :show="loading">
        <div v-if="hideMenu">
          <router-view />
        </div>
        <div v-else>
          <component :is="layoutComponent">
            <router-view />
          </component>
        </div>
      </n-spin>
    </n-message-provider>
  </n-config-provider>
</template>
