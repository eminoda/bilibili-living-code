<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Briefcase, ChatDotRound, Document, Goods, Grid, House, MagicStick, Menu, Operation, Plus, Search } from '@element-plus/icons-vue'
import DashboardView from './features/dashboard/DashboardView.vue'
import WorkListView from './features/work/WorkListView.vue'
import BugDetailView from './features/bugs/BugDetailView.vue'
import { router } from './router'
import { useZentaoWorkspace } from './composables/useZentaoWorkspace'

const route = useRoute()
const { tasks, bugs, dashboard, bugDetail, connectionState, errorMessage, detailLoading, reload, loadBugDetail } = useZentaoWorkspace()
const page = computed(() => {
  if (route.query.m === 'bug' && route.query.f === 'view') return 'detail'
  if (route.query.m === 'my' && route.query.f === 'work' && route.query.mode === 'bug') return 'bugs'
  if (route.query.m === 'my' && route.query.f === 'work') return 'tasks'
  return 'dashboard'
})
const selectedBugId = computed(() => typeof route.query.bugID === 'string' ? route.query.bugID : '11934')
const apiStatusLabel = computed(() => connectionState.value === 'connected'
  ? 'Mock API 已连接'
  : connectionState.value === 'connecting' ? 'Mock API 连接中' : 'Mock API 未连接 · 点击重试')
const headerTitle = computed(() => page.value === 'bugs' || page.value === 'detail' ? '测试' : '地盘')
const headerSubTitle = computed(() => page.value === 'detail' ? '测试001' : '')
const activeSide = computed(() => page.value === 'bugs' || page.value === 'detail' ? '测试' : page.value === 'tasks' ? '执行' : '地盘')
const activeTop = computed(() => page.value === 'dashboard' ? '仪表盘' : page.value === 'tasks' || page.value === 'bugs' ? '待处理' : 'Bug')

async function retryMockApi() {
  await reload()
  if (page.value === 'detail') await loadBugDetail(selectedBugId.value)
}

onMounted(async () => {
  await reload()
  if (page.value === 'detail') await loadBugDetail(selectedBugId.value)
})

watch([page, selectedBugId], async ([nextPage, nextBugId], [previousPage, previousBugId]) => {
  if (nextPage === 'detail' && (nextPage !== previousPage || nextBugId !== previousBugId)) {
    await loadBugDetail(nextBugId)
  }
})

function navigate(next: 'dashboard' | 'tasks' | 'bugs' | 'detail') {
  if (next === 'dashboard') return router.push({ path: '/index.php', query: { m: 'my', f: 'index' } })
  if (next === 'tasks') return router.push({ path: '/index.php', query: { m: 'my', f: 'work', mode: 'task', type: 'assignedTo' } })
  if (next === 'bugs') return router.push({ path: '/index.php', query: { m: 'my', f: 'work', mode: 'bug', type: 'assignedTo' } })
  return router.push({ path: '/index.php', query: { m: 'bug', f: 'view', bugID: '11934' } })
}

const topLinks = computed(() => page.value === 'detail'
  ? ['仪表盘', 'Bug', '用例', '套件', '测试单', '测试报告', '用例库']
  : ['仪表盘', '日程', '我的数据看板', '待处理', '项目', '执行', '贡献', '联系人'])
const sideGroups = [
  [
    { label: '地盘', icon: House }, { label: '项目集', icon: Grid }, { label: '产品', icon: Goods },
    { label: '项目', icon: Briefcase }, { label: '执行', icon: Operation }, { label: '测试', icon: Search },
  ],
  [{ label: 'AI', icon: MagicStick }],
  [{ label: '文档', icon: Document }],
]
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <nav class="side-nav">
        <div v-for="(group, groupIndex) in sideGroups" :key="groupIndex" class="side-group">
          <button v-for="item in group" :key="item.label" :class="{ active: item.label === activeSide }" @click="item.label === '地盘' ? navigate('dashboard') : item.label === '执行' ? navigate('tasks') : item.label === '测试' ? navigate('bugs') : undefined">
            <span class="side-icon-slot"><component :is="item.icon" /></span><span>{{ item.label }}</span>
          </button>
        </div>
      </nav>
      <button class="collapse-nav" aria-label="收起菜单"><Menu /></button>
    </aside>

    <header class="topbar">
      <div class="crumb-home"><House class="header-icon" /><strong>{{ headerTitle }}</strong><template v-if="headerSubTitle"><span class="crumb-sep">›</span><span>{{ headerSubTitle }}⌄</span></template></div>
      <nav class="top-nav"><button v-for="link in topLinks" :key="link" :class="{ active: link === activeTop }" @click="link === '仪表盘' ? navigate('dashboard') : link === '待处理' ? navigate('tasks') : link === 'Bug' ? navigate(page === 'detail' ? 'detail' : 'bugs') : undefined">{{ link }}</button></nav>
      <div class="top-actions"><button class="add-button" aria-label="新建"><Plus /></button><button class="bell-button" aria-label="通知"><Bell /><i>8</i></button><span class="user-avatar" title="Eminoda" aria-label="Eminoda">E</span></div>
    </header>

    <main class="main-area">
      <div v-if="errorMessage" class="mock-api-alert" role="status">
        <span>{{ errorMessage }}</span><button @click="retryMockApi">重试</button>
      </div>
      <DashboardView v-if="page === 'dashboard'" :on-navigate="(next) => navigate(next)" :task-count="tasks.length" :bug-count="bugs.length" :review-count="dashboard.reviewCount" :story-count="dashboard.storyCount" :case-count="dashboard.caseCount" :requirement-count="dashboard.requirementCount" />
      <WorkListView v-else-if="page === 'tasks' || page === 'bugs'" :mode="page" :records="page === 'tasks' ? tasks : bugs" :on-open-bug="() => navigate('detail')" />
      <BugDetailView v-else :on-back="() => navigate('bugs')" :bug="bugDetail" :loading="detailLoading" />
    </main>

    <footer class="statusbar">
      <div class="status-left"><span class="tiny-mark"><Grid /></span><span>研发综合界面</span><span class="status-caret">⌃</span><i></i><b>{{ page === 'dashboard' ? '地盘' : page === 'tasks' ? '待处理 / 任务' : page === 'bugs' ? '待处理 / Bug' : '测试 / Bug' }}</b></div>
      <div class="status-right"><button class="api-status" :class="connectionState" :title="errorMessage || '本页面数据来自禅道 RESTful API v2 Mock Server'" @click="connectionState !== 'connected' && retryMockApi()">{{ apiStatusLabel }}</button><label><Search /><span>搜索</span></label><button aria-label="消息"><ChatDotRound /></button><span class="zen-logo">◉</span><span>开源版 22.1</span><button class="upgrade">升级 <b>↑</b></button></div>
    </footer>
    <button class="floating-ai" title="AI 助手">AI</button>
  </div>
</template>
