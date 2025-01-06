<template>
  <n-spin :show="false" description="正在获取数据">
    <n-card class="space-y-1">
      <n-descriptions
        label-placement="top"
        :column="5"
        class="w-3/4 lg:w-2/4"
        label-class="text-gray-500"
      >
        <n-descriptions-item label="名称"> {{ server.name }}</n-descriptions-item>
        <n-descriptions-item label="IP"> {{ server.ip }}</n-descriptions-item>
        <n-descriptions-item label="系统"> {{ server.os }}</n-descriptions-item>
        <n-descriptions-item label="状态"> {{ server.status }}</n-descriptions-item>
        <n-descriptions-item label="位置"> {{ server.location }}</n-descriptions-item>
      </n-descriptions>
      <n-descriptions label-placement="top">
        <n-descriptions-item label="CPU" v-if="server.cpu.length === 1">
          {{ server.cpu[0].cores }} 核心 {{ server.cpu[0].mhz }} mhz （{{ server.cpu[0].name }}）
        </n-descriptions-item>
        <n-descriptions-item v-else :label="'CPU ' + index" v-for="(item, index) in server.cpu">
          {{ item.cores }} 核心 {{ item.mhz }} mhz （{{ item.name }}）
        </n-descriptions-item>
        <n-descriptions-item label="内存">
          {{ 1024 }} / {{ parseInt(server.memory / (1024 * 1024)) }} MB
        </n-descriptions-item>
        <n-descriptions-item v-if="server.disk.length === 1" n-descriptions-item label="磁盘">
          共计 {{ parseInt(server.disk[0].total / (1024 * 1024 * 1024)) }}GB 已用
          {{ parseInt(server.disk[0].used / (1024 * 1024 * 1024)) }}GB 可用
          {{ parseInt(server.disk[0].free / (1024 * 1024 * 1024)) }}GB
        </n-descriptions-item>
        <n-descriptions-item
          v-else
          :label="'磁盘（' + item.path + '）'"
          v-for="item in server.disk"
        >
          共计 {{ parseInt(item.total / (1024 * 1024 * 1024)) }}GB 已用
          {{ parseInt(item.used / (1024 * 1024 * 1024)) }}GB 可用
          {{ parseInt(item.free / (1024 * 1024 * 1024)) }}GB
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-grid :x-gap="12" :y-gap="8" cols="2 s:1 m:2 l:2 xl:4 2xl:6" responsive="screen">
      <n-grid-item>
        <n-card title="CPU">
          <div ref="networkRef" style="height: 300px; width: 100%"></div>
        </n-card>
        <n-card title="内存">
          <!--          <div ref="networkRef" style="height: 300px; width: 100%"></div>-->
        </n-card>
        <n-card title="磁盘">
          <!--          <div ref="networkRef" style="height: 300px; width: 100%"></div>-->
        </n-card>
        <n-card title="网络">
          <!--          <div ref="networkRef" style="height: 300px; width: 100%"></div>-->
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-spin>
</template>
<style scoped>
.n-descriptions-header {
  margin-bottom: 0 !important;
}

:deep(.n-descriptions-table-header) {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1)) !important;
}

:deep(.n-card, .n-modal) {
  margin-bottom: 10px;
}
</style>
<script setup lang="ts">
import type { ServerItemType } from '../../../types'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  DataZoomComponent,
  DataZoomComponentOption,
} from 'echarts/components'
import { LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  server: ServerItemType
}>()
const networkRef = ref(null)

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | LineSeriesOption
>

onMounted(() => {
  const myChart = echarts.init(networkRef.value)!
  let option: EChartsOptionl

  let base = +new Date(1988, 9, 3)
  let oneDay = 24 * 3600 * 1000

  let data = [[base, Math.random() * 300]]

  for (let i = 1; i < 20000; i++) {
    let now = new Date((base += oneDay))
    data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])])
  }

  option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%']
      },
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 20,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: 'Fake Data',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: data,
      },
    ],
  }

  option && myChart.setOption(option)
})
</script>
