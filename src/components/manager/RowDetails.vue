<template>
  <n-descriptions label-placement="top" title="基础信息">
    <n-descriptions-item>
      <template #label> 早餐</template>
      苹果
    </n-descriptions-item>
    <n-descriptions-item label="早午餐"> 苹果</n-descriptions-item>
    <n-descriptions-item label="午餐"> 苹果</n-descriptions-item>
    <n-descriptions-item label="晚餐" :span="2">
      两个<br />
      苹果
    </n-descriptions-item>
    <n-descriptions-item label="夜宵"> 苹果</n-descriptions-item>
  </n-descriptions>
  <n-descriptions label-placement="top" title="实时负载"></n-descriptions>
  <n-descriptions label-placement="top" title="实时网络">
    <n-descriptions-item>
      <div ref="networkRef" style="height: 500px;width: 100%"></div>
    </n-descriptions-item>
  </n-descriptions>
</template>
<script setup lang="ts">
import type { ServerItemType } from '../../../types'

const props = defineProps<{
  server: ServerItemType
}>()
const networkRef = ref(null)

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
  console.log(networkRef.value)
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
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
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
