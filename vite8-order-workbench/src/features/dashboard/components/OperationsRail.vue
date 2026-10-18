<script setup lang="ts">
import { useRouter } from 'vue-router'
import { latestActivities, todayTasks } from '../../../modules/domains/operationsSnapshot'

const router = useRouter()
const tasks = todayTasks.slice(0, 3)
const activities = latestActivities.slice(0, 3)
</script>

<template>
  <aside class="operations-rail">
    <section class="surface-card rail-card"><div class="section-title-row"><div><h2>今日待办</h2><p>优先处理的业务事项</p></div><span class="rail-more">•••</span></div><div class="task-list"><div v-for="task in tasks" :key="task.title" class="task-item" role="button" tabindex="0" @click="router.push(task.path)" @keydown.enter="router.push(task.path)"><span class="task-count" :class="`task-${task.tone}`">{{ task.count }}</span><div><strong>{{ task.title }}</strong><small>{{ task.note }}</small></div><b>›</b></div></div><button class="rail-link" type="button" @click="router.push('/module/order-review')">查看所有待办 →</button></section>
    <section class="surface-card rail-card activity-card"><div class="section-title-row"><div><h2>最新动态</h2><p>跨部门业务进度</p></div></div><div class="activity-list"><div v-for="activity in activities" :key="activity.time" class="activity-item"><span class="activity-dot"></span><div><strong>{{ activity.title }}</strong><small>{{ activity.note }}</small><time>{{ activity.time }}</time></div></div></div></section>
  </aside>
</template>
