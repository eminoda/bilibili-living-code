<script setup lang="ts">
defineProps<{ rowCount: number; errorCount: number }>()
</script>

<template>
  <section aria-label="导入文件和数据统计" class="pb-1">
    <!-- <div class="mb-4 flex items-center gap-2.5 text-sm">
      <FileSpreadsheet :size="17" class="text-emerald-700" />
      <span class="font-medium">customers-2026.csv</span>
      <span class="text-border">·</span>
      <Badge tone="success"><Check :size="13" />解析完成</Badge>
    </div> -->

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div class="flex items-baseline gap-2 rounded-lg border border-border bg-white px-4 py-3">
        <span class="text-xs text-muted-foreground">总记录数</span>
        <span class="text-lg font-semibold tabular-nums">{{ rowCount.toLocaleString() }}</span>
      </div>
      <div class="flex items-baseline gap-2 rounded-lg border border-border bg-white px-4 py-3">
        <span class="text-xs text-muted-foreground">校验通过</span>
        <span class="text-lg font-semibold tabular-nums">{{
          (rowCount - errorCount).toLocaleString()
        }}</span>
      </div>
      <div class="flex items-baseline gap-2 rounded-lg border border-border bg-white px-4 py-3">
        <span class="text-xs text-muted-foreground">异常记录</span>
        <span class="text-lg font-semibold tabular-nums text-amber-700">{{
          errorCount.toLocaleString()
        }}</span>
      </div>
    </div>
  </section>
</template>
