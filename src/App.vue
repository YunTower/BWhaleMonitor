<template>
  <n-spin :show="loading">
    <router-view v-if="isInstall" />
    <BaseLayout v-else :name="computedLayout">
      <router-view />
    </BaseLayout>
  </n-spin>
</template>
<style scoped></style>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'

const isInstall = ref(false)
const loading = ref(true)
const route = useRoute()
const isManagerPage = computed(
  () => route.name?.toString().startsWith('manager-') || route.name?.toString() == 'manager',
)
const computedLayout = computed(() => (isManagerPage.value ? 'ManagerLayout' : 'DefaultLayout'))

onMounted(() => {
  loading.value = false
})
</script>
