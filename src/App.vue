<template>
  <n-spin :show="loading">
    <div v-if="isInstall">
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
import { useRoute, useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'

const isInstall = ref(true)
const loading = ref(true)
const route = useRoute()
const router = useRouter()
const isManagerPage = computed(
  () => route.name?.toString().startsWith('manager-') || route.name?.toString() == 'manager',
)
const computedLayout = computed(() => (isManagerPage.value ? 'ManagerLayout' : 'DefaultLayout'))

onMounted(() => {
  if (isInstall.value && route.name != 'install') {
    router.push({ name: 'install' })
  }
  loading.value = false
})
</script>
