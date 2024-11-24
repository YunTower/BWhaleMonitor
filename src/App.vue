<template>
  <n-spin :show="loading">
    <div v-if="!isInstall">
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
import requester from '@/utils/requester'
import { useCommonStore } from '@/stores/common'
import { storeToRefs } from 'pinia'

const commonStore = useCommonStore()
const { isInstall } = storeToRefs(commonStore)
const loading = ref(true)
const route = useRoute()
const router = useRouter()
const isManagerPage = computed(
  () => route.name?.toString().startsWith('manager-') || route.name?.toString() == 'manager',
)
const computedLayout = computed(() => (isManagerPage.value ? 'ManagerLayout' : 'DefaultLayout'))

onMounted(async () => {
  loading.value = false
})
</script>
