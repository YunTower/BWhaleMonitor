<template>
  <n-spin :show="loading">
    <div v-if="!isInstall || route.name == 'login'">
      <router-view />
    </div>
    <div v-else>
      <BaseLayout :name="computedLayout">
        <router-view />
      </BaseLayout>
    </div>
  </n-spin>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'
import requester from '@/utils/requester'
import type { baseConfigType } from '../types'

const commonStore = useCommonStore()
const { isInstall } = storeToRefs(commonStore)
const loading = ref(true)
const route = useRoute()
const isManagerPage = computed(
  () => route.name?.toString().startsWith('manager-') || route.name?.toString() == 'manager',
)
const computedLayout = computed(() => (isManagerPage.value ? 'ManagerLayout' : 'DefaultLayout'))

onMounted(async () => {
  loading.value = false

  const { code, data } = await requester.get('/setting/get?columns=title,guest')
  if (code == 0) {
    commonStore.setBaseConfig(data as baseConfigType)
  }
})
</script>
