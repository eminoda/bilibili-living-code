<script setup lang="ts">
import type { DemoItem } from '@/types'

defineProps<{
  items: DemoItem[]
}>()
</script>

<template>
  <ul class="task-list css-list" aria-label="CSS 列表">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      class="task-card"
      :class="`task-card--${item.color}`"
    >
      <span class="task-order">{{ String(index + 1).padStart(2, '0') }}</span>
      <span class="task-copy">
        <strong>{{ item.title }}</strong>
        <small>{{ item.description }}</small>
      </span>
      <span class="task-dots" aria-hidden="true">⠿</span>
    </li>
  </ul>
</template>

<style scoped>
.css-list { list-style: none; margin: 0; padding: 0; }

.task-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 68px;
  margin-bottom: 10px;
  padding: 12px 14px;
  border: 1px solid rgb(29 39 35 / 7%);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgb(37 42 35 / 3%);
}

.task-card:last-child { margin-bottom: 0; }
.task-card--lilac { background: #f1edff; }
.task-card--blue { background: #eaf2ff; }
.task-card--peach { background: #fff0e8; }
.task-card--mint { background: #e8f5ee; }
.task-card--yellow { background: #fff6dc; }
.task-order { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 9px; background: rgb(255 255 255 / 70%); color: #70766f; font-size: 10px; font-weight: 750; font-variant-numeric: tabular-nums; }
.task-copy { display: grid; gap: 4px; flex: 1; min-width: 0; }
.task-copy strong { color: #242b27; font-size: 13px; font-weight: 680; }
.task-copy small { overflow: hidden; color: #747b75; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.task-dots { color: #899089; font-size: 20px; }
</style>
