<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { createDiscreteApi } from 'naive-ui'
import { getServerList } from '@/apis/server'
import type { ServerItemType } from '@/types/manager'

const loading = ref(true)
const serverList = ref([] as ServerItemType[])
const { message } = createDiscreteApi(['message'])

onMounted(async () => {
  try {
    serverList.value = await getServerList()
  } catch (err) {
    message.error(`拉取服务器信息失败（${(err as { msg: string })?.msg}）`)
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <n-grid cols="1 400:2 600:3 800:4 1000:5 1500:6 1700:7 1900:8 2100:9" :x-gap="12" :y-gap="8">
    <n-gi v-if="loading">
      <n-card>
        <template #header>
          <n-skeleton text width="60%" />
        </template>
        <n-skeleton text :repeat="10" />
      </n-card>
    </n-gi>
    <n-gi v-else v-for="item in serverList" :key="item.id">
      <n-card justify="start" embedded>
        <template #header>
          <p class="space-x-1.5">
            <n-badge
              :value="item.status == 1 ? '在线' : '离线'"
              :type="item.status == 1 ? 'success' : 'default'"
            />
            <span>{{ item.name }}</span>
          </p>
        </template>
        <div class="space-y-1">
          <n-descriptions label-placement="top" :column="2">
            <n-descriptions-item label="系统"> {{ item.os }}</n-descriptions-item>
            <n-descriptions-item label="位置"> {{ item.location }}</n-descriptions-item>
            <n-descriptions-item label="上传"> {{ item.net_upload }}kb/s</n-descriptions-item>
            <n-descriptions-item label="下载"> {{ item.net_download }}kb/s</n-descriptions-item>
          </n-descriptions>
          <ul>
            <li>
              CPU（{{ item.cpu }}核心）
              <n-progress type="line" :percentage="item.cpu_use" />
            </li>
            <li>
              内存（{{ item.memory }}MB）
              <n-progress type="line" :percentage="item.memory_use" />
            </li>
            <li>
              硬盘（{{ item.disk }}GB）
              <n-progress type="line" :percentage="item.disk_use" />
            </li>
          </ul>
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>
<style scoped>
:deep(.n-card) {
  background-color: #fff;
  margin: 0;
}
</style>
