<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Rows3, Zap } from '@lucide/vue'
import type { CustomerRow, RenderMode } from '../types'

const props = defineProps<{ rows: CustomerRow[]; mode: RenderMode }>()
const emit = defineEmits<{ 'update:mode': [mode: RenderMode] }>()

const search = ref('')
const scrollElement = ref<HTMLElement | null>(null)
const rowHeight = 48
const columns = [
  { key: 'id', label: 'ID', class: 'w-[112px] shrink-0 font-mono text-xs text-muted-foreground' },
  { key: 'name', label: '姓名', class: 'min-w-[120px] flex-1 font-medium text-foreground' },
  {
    key: 'phone',
    label: '手机号',
    class: 'min-w-[150px] flex-1 font-mono text-[13px] text-muted-foreground',
  },
  { key: 'region', label: '地区', class: 'w-[100px] shrink-0 text-muted-foreground' },
  { key: 'source', label: '来源', class: 'w-[120px] shrink-0 text-muted-foreground' },
  { key: 'status', label: '状态', class: 'w-[90px] shrink-0' },
] as const

const filteredRows = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) return props.rows
  return props.rows.filter((row) =>
    `${row.id} ${row.name} ${row.phone} ${row.region} ${row.source}`.toLowerCase().includes(query),
  )
})

const virtualizer = useVirtualizer(
  computed(() => ({
    count: filteredRows.value.length,
    getScrollElement: () => scrollElement.value,
    estimateSize: () => rowHeight,
    overscan: 8,
    getItemKey: (index: number) => filteredRows.value[index]?.id ?? index,
  })),
)

const virtualRows = computed(() => virtualizer.value.getVirtualItems())
const renderedCount = computed(() =>
  props.mode === 'virtual' ? virtualRows.value.length : filteredRows.value.length,
)
const totalSize = computed(() => virtualizer.value.getTotalSize())

watch(() => props.mode, () => {
  if (scrollElement.value) scrollElement.value.scrollTop = 0
})

function rowAt(index: number) {
  return filteredRows.value[index]
}
</script>

<template>
  <section
    aria-labelledby="preview-heading"
    class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
  >
    <div
      class="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <h2
        id="preview-heading"
        class="flex items-center gap-2.5 text-base font-semibold tracking-tight"
      >
        客户数据预览
        <Badge tone="neutral">{{ filteredRows.length.toLocaleString() }} 行</Badge>
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <label class="relative block w-full sm:w-52">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            :size="15"
          />
          <input
            v-model="search"
            type="search"
            aria-label="搜索客户"
            placeholder="搜索客户…"
            class="h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />
        </label>
        <div
          class="flex rounded-xl border border-border bg-muted/70 p-1"
          aria-label="选择列表渲染方式"
        >
          <Button
            size="sm"
            :variant="mode === 'standard' ? 'default' : 'ghost'"
            class="h-8 gap-1.5 px-2.5"
            @click="emit('update:mode', 'standard')"
            ><Rows3 :size="14" />普通渲染</Button
          >
          <Button
            size="sm"
            :variant="mode === 'virtual' ? 'default' : 'ghost'"
            class="h-8 gap-1.5 px-2.5"
            @click="emit('update:mode', 'virtual')"
            ><Zap :size="14" />Virtual</Button
          >
        </div>
      </div>
    </div>

    <div class="flex justify-end border-b border-border bg-muted/30 px-5 py-2.5 text-xs sm:px-6">
      <p class="text-muted-foreground">
        当前实际渲染
        <span class="font-semibold tabular-nums text-foreground">{{
          renderedCount.toLocaleString()
        }}</span>
        行
      </p>
    </div>

    <div
      ref="scrollElement"
      role="table"
      aria-label="客户导入数据预览"
      :aria-rowcount="filteredRows.length + 1"
      class="relative max-h-[520px] min-h-[360px] overflow-auto overscroll-contain"
    >
      <div
        role="row"
        class="sticky top-0 z-20 flex h-11 min-w-[720px] items-center border-b border-border bg-[#f8faf9] px-5 text-[11px] font-semibold tracking-wide text-muted-foreground sm:px-6"
      >
        <div v-for="column in columns" :key="column.key" role="columnheader" :class="column.class">
          {{ column.label }}
        </div>
      </div>

      <template v-if="mode === 'standard'">
        <div class="min-w-[720px] px-5 sm:px-6">
          <div
            v-for="(row, index) in filteredRows"
            :key="row.id"
            role="row"
            :aria-rowindex="index + 2"
            class="flex h-12 items-center border-b border-border/70 text-sm last:border-0 hover:bg-muted/40"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f4f7f5]'"
          >
            <div role="cell" :class="columns[0].class">{{ row.id }}</div>
            <div role="cell" :class="columns[1].class">{{ row.name }}</div>
            <div role="cell" :class="columns[2].class">{{ row.phone }}</div>
            <div role="cell" :class="columns[3].class">{{ row.region }}</div>
            <div role="cell" :class="columns[4].class">{{ row.source }}</div>
            <div role="cell" :class="columns[5].class">
              <Badge :tone="row.status === '正常' ? 'success' : 'warning'">{{ row.status }}</Badge>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="relative min-w-[720px] px-5 sm:px-6" :style="{ height: `${totalSize}px` }">
        <div
          v-for="virtualRow in virtualRows"
          :key="String(virtualRow.key)"
          role="row"
          :aria-rowindex="virtualRow.index + 2"
          class="absolute left-5 right-5 flex h-12 items-center border-b border-border/70 text-sm last:border-0 hover:bg-muted/40 sm:left-6 sm:right-6"
          :class="virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-[#f4f7f5]'"
          :style="{
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }"
        >
          <template v-if="rowAt(virtualRow.index)">
            <div role="cell" :class="columns[0].class">{{ rowAt(virtualRow.index)!.id }}</div>
            <div role="cell" :class="columns[1].class">{{ rowAt(virtualRow.index)!.name }}</div>
            <div role="cell" :class="columns[2].class">{{ rowAt(virtualRow.index)!.phone }}</div>
            <div role="cell" :class="columns[3].class">{{ rowAt(virtualRow.index)!.region }}</div>
            <div role="cell" :class="columns[4].class">{{ rowAt(virtualRow.index)!.source }}</div>
            <div role="cell" :class="columns[5].class">
              <Badge :tone="rowAt(virtualRow.index)!.status === '正常' ? 'success' : 'warning'">{{
                rowAt(virtualRow.index)!.status
              }}</Badge>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div
      class="flex items-center border-t border-border bg-card px-5 py-3.5 text-xs text-muted-foreground sm:px-6"
    >
      <span>共 {{ filteredRows.length.toLocaleString() }} 条记录</span>
    </div>
  </section>
</template>
