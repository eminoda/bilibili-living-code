import { init, type ECharts } from 'echarts/core'
import type { EChartsOption } from 'echarts'
import type { ComputedRef } from 'vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import './register'

export function useEChart(option: ComputedRef<EChartsOption>) {
  const element = ref<HTMLDivElement | null>(null)
  let chart: ECharts | undefined
  let resizeObserver: ResizeObserver | undefined

  function applyOption() {
    if (chart) chart.setOption(option.value, { notMerge: true })
  }

  onMounted(() => {
    if (!element.value) return
    chart = init(element.value, undefined, { renderer: 'canvas' })
    applyOption()
    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(element.value)
  })

  watch(option, applyOption, { deep: true })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    chart?.dispose()
    chart = undefined
  })

  return element
}
