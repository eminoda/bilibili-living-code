<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, shallowRef, ref } from 'vue'
import { useWebWorkerFn } from '@vueuse/core'
import type { Implementation, ProductValidationSummary } from '@/types'
import { loadAndValidateProducts, mockProductCount, productDataUrl, validateProducts } from '@/mocks/products'

const props = defineProps<{ implementation: Implementation }>()
const results = shallowRef<ProductValidationSummary | null>(null)
const running = ref(false)
const errorMessage = ref('')
const maxFrameGap = ref<number | null>(null)
let lastFrameTimestamp = 0
let frameRequest = 0
const { workerFn } = useWebWorkerFn(loadAndValidateProducts, {
  localDependencies: [validateProducts],
  timeout: 120_000,
})
const invalidCount = computed(() => results.value?.invalidCount ?? 0)
const validCount = computed(() => results.value?.validCount ?? 0)
const preview = computed(() => results.value?.preview ?? [])
const pauseLevel = computed(() => {
  if (maxFrameGap.value === null) return 'idle'
  if (maxFrameGap.value < 50) return 'smooth'
  if (maxFrameGap.value < 150) return 'slowed'
  return 'stalled'
})
const pauseLabel = computed(() => ({ idle: '待运行', smooth: '流畅', slowed: '轻微停顿', stalled: '明显停顿' })[pauseLevel.value])

function measureFrameRate(timestamp: number) {
  if (lastFrameTimestamp && maxFrameGap.value !== null) {
    maxFrameGap.value = Math.max(maxFrameGap.value, Math.round(timestamp - lastFrameTimestamp))
  }
  lastFrameTimestamp = timestamp
  frameRequest = requestAnimationFrame(measureFrameRate)
}

onMounted(() => {
  frameRequest = requestAnimationFrame(measureFrameRate)
})

onUnmounted(() => {
  cancelAnimationFrame(frameRequest)
})

async function runImport() {
  if (running.value) return
  running.value = true
  maxFrameGap.value = 0
  results.value = null
  errorMessage.value = ''

  try {
    await nextTick()
    const dataUrl = new URL(productDataUrl, window.location.href).href
    results.value = props.implementation === 'vueuse'
      ? await workerFn(dataUrl)
      : await loadAndValidateProducts(dataUrl)
  } catch (error) {
    console.error('商品校验失败', error)
    errorMessage.value = error instanceof Error ? error.message : '商品校验失败，请查看控制台。'
  } finally {
    running.value = false
  }
}

function clearResults() {
  results.value = null
}
</script>

<template>
  <div class="worker-page">
    <div class="worker-grid">
      <section class="panel import-panel">
      <div class="panel-heading">
        <div><h2>商品批量导入</h2></div>
      </div>

      <div class="upload-zone" :class="{ active: running, complete: results }">
        <div class="upload-icon">{{ running ? 'ϟ' : results ? '✓' : '⇧' }}</div>
        <strong>{{ running ? (implementation === 'vueuse' ? 'Worker 正在读取并校验商品…' : '主线程正在读取并校验商品…') : results ? '商品数据已完成校验' : '商品数据已就绪，等待校验' }}</strong>
        <span>{{ mockProductCount.toLocaleString() }} 条商品记录</span>
      </div>

      <div class="validation-list">
        <div class="validation-title">本次校验规则 <span>5 项</span></div>
        <div><span class="rule-check">✓</span> 商品编号格式与重复检查</div>
        <div><span class="rule-check">✓</span> 商品价格有效性</div>
        <div><span class="rule-check">✓</span> 库存不能为负数</div>
        <div><span class="rule-check">✓</span> 折扣范围检查</div>
      </div>

      <div class="import-actions">
        <div class="import-action-buttons">
          <button class="button-primary large" :disabled="running" @click="runImport">{{ running ? '正在处理…' : results ? '重新运行校验' : '开始批量校验' }}</button>
          <button class="button-text" :disabled="running || !results" @click="clearResults">清空结果</button>
        </div>
        <div class="activity-monitor" :aria-label="`本次最长画面停顿：${maxFrameGap === null ? '待运行' : `${maxFrameGap} 毫秒，${pauseLabel}`}`" aria-live="polite">
          <span class="pause-indicator" :class="pauseLevel"></span>
          <span class="activity-label">最长停顿</span>
          <strong>{{ maxFrameGap === null ? '—' : `${maxFrameGap} ms` }}</strong>
          <span class="pause-status" :class="pauseLevel">{{ pauseLabel }}</span>
        </div>
        <p v-if="errorMessage" class="worker-error" role="alert">{{ errorMessage }}</p>
      </div>
      </section>
    </div>

    <section v-if="results" class="panel result-panel">
      <div class="panel-heading result-heading">
        <div><h2>校验结果</h2></div>
        <div class="result-stats"><span class="success-text">✓ {{ validCount.toLocaleString() }} 条通过</span><span class="error-text">! {{ invalidCount.toLocaleString() }} 条需处理</span></div>
      </div>
      <div class="table-scroll"><table class="product-table"><thead><tr><th>商品编号</th><th>商品名称</th><th>分类</th><th>价格</th><th>库存</th><th>校验状态</th></tr></thead>
        <tbody><tr v-for="item in preview" :key="item.id"><td class="sku-cell">{{ item.sku }}</td><td>{{ item.name }}</td><td>{{ item.category }}</td><td>¥ {{ item.price.toFixed(2) }}</td><td>{{ item.stock }}</td><td><span class="table-status" :class="{ invalid: !item.valid }">{{ item.valid ? '通过' : item.issue }}</span></td></tr></tbody>
      </table></div>
      <div class="table-caption">展示前 8 条结果 · 所有 {{ results.total.toLocaleString() }} 条记录已完成处理</div>
    </section>
  </div>

</template>
