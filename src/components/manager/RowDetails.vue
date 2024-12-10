<template>
  <n-spin :show="true" description="正在获取数据" class="space-y-6">
    <n-descriptions label-placement="left" title="基础信息" :column="1">
      <n-descriptions-item label="名称"> {{ server.name }}</n-descriptions-item>
      <n-descriptions-item label="IP"> {{ server.ip }}</n-descriptions-item>
      <n-descriptions-item label="系统"> {{ server.os }}</n-descriptions-item>
      <n-descriptions-item label="状态"> {{ server.status }}</n-descriptions-item>
      <n-descriptions-item label="位置"> {{ server.location }}</n-descriptions-item>
      <n-descriptions-item label="CPU"> {{ server.cpu }}</n-descriptions-item>
      <n-descriptions-item label="内存"> {{ server.memory }}</n-descriptions-item>
      <n-descriptions-item label="SWAP"></n-descriptions-item>
      <n-descriptions-item label="磁盘1"> {{ server.disk }}</n-descriptions-item>
      <n-descriptions-item label="磁盘2"> 苹果</n-descriptions-item>
      <n-descriptions-item label="磁盘3"> 苹果</n-descriptions-item>
    </n-descriptions>
    <n-descriptions title="负载状态">
      <n-descriptions-item>
        <div ref="networkRef" style="height: 300px; width: 100%"></div>
      </n-descriptions-item>
    </n-descriptions>
  </n-spin>
</template>
<style>
.n-descriptions-header {
  margin-bottom: 0 !important;
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
  let option: EChartsOption

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
