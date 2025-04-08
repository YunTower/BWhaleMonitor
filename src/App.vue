<template>
  <n-config-provider>
    <n-message-provider>
      <n-spin :show="loading">
        <div v-if="noNeedMenu">
          <router-view />
        </div>
        <div v-else>
          <BaseLayout :name="computedLayout">
            <router-view />
          </BaseLayout>
        </div>
      </n-spin>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'

const commonStore = useCommonStore()
const { isInstall } = storeToRefs(commonStore)
const route = useRoute()

const loading = ref(true)
const noNeedMenu = ref(false)

const isManagerPage = computed(() => {
  const routeName = route.name?.toString()
  return routeName?.startsWith('manager-') || routeName === 'manager'
})

const computedLayout = computed(() => (isManagerPage.value ? 'ManagerLayout' : 'DefaultLayout'))

const updateNoNeedMenu = () => {
  noNeedMenu.value = !isInstall.value || route.name === 'login'
}

onMounted(async () => {
  loading.value = false
  updateNoNeedMenu()
})

watch(
  () => route.name,
  () => {
    updateNoNeedMenu()
  },
)
</script>
