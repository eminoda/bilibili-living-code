<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  onNavigate: (page: 'tasks' | 'bugs') => void
  taskCount: number
  bugCount: number
  reviewCount: number
  storyCount: number
  caseCount: number
  requirementCount: number
}>()

const activity = [
  { time: '10-02 11:06', name: '老板', action: '指派了 Bug', id: '11934', subject: '筛选条件清空后列表未刷新', tone: 'blue' },
  { time: '10-02 10:48', name: '老板', action: '创建了 Bug', id: '11934', subject: '筛选条件清空后列表未刷新', tone: 'muted' },
  { time: '10-02 10:24', name: 'Eminoda', action: '更新了任务', id: '20416', subject: '优化成员列表加载体验', tone: 'muted' },
  { time: '10-02 09:51', name: '老板', action: '指派了 Bug', id: '11931', subject: '登录超时后返回按钮状态异常', tone: 'muted' },
  { time: '10-02 09:42', name: '前端雨爸', action: '开始了任务', id: '20412', subject: '补充登录超时后的引导提示', tone: 'muted' },
  { time: '10-01 17:36', name: 'Eminoda', action: '更新了任务', id: '20398', subject: '梳理消息通知偏好设置交互', tone: 'muted' },
]

const kpis = computed(() => [
  { label: '待我评审', value: String(props.reviewCount), type: 'quiet' },
  { label: '任务数', value: String(props.taskCount), type: 'blue' },
  { label: 'BUG数', value: String(props.bugCount), type: 'blue' },
  { label: '研发需求数', value: String(props.storyCount), type: 'blue' },
  { label: '用例数', value: String(props.caseCount), type: 'quiet' },
  { label: '用户需求数', value: String(props.requirementCount), type: 'quiet' },
])
</script>

<template>
  <div class="dashboard-grid">
    <section class="dashboard-main">
      <div class="panel welcome-panel">
        <div class="welcome-top">
          <strong>2026年10月02日 星期五</strong>
          <span>禅道已陪伴你 1 年 2 个月：今日还有一些待处理事项，继续保持节奏。</span>
          <button class="more-button" aria-label="更多">⋮</button>
        </div>
        <div class="welcome-content">
          <div class="greeting"><span class="avatar">E</span><b>Eminoda，上午好</b></div>
          <button v-for="item in kpis" :key="item.label" class="kpi" @click="onNavigate(item.label === 'BUG数' ? 'bugs' : 'tasks')">
            <span class="kpi-label">{{ item.label }}</span>
            <strong :class="item.type">{{ item.value }}</strong>
          </button>
        </div>
      </div>

      <div class="panel guide-panel">
        <header class="panel-heading">
          <strong>使用帮助</strong>
          <div><button class="orange-button">进入使用教程</button><button class="more-button">⋮</button></div>
        </header>
        <div class="guide-content">
          <nav class="guide-tabs"><a class="active">流程图</a><a>主题切换</a><a>个性化设置</a></nav>
          <div class="flow-board">
            <div v-for="(row, rowIndex) in [
              ['管理员', '维护部门', '添加用户', '维护权限'],
              ['项目集负责人', '创建项目集', '关联产品', '创建项目', '制定预算和规划', '添加干系人'],
              ['产品经理', '创建产品', '维护模块', '维护计划', '维护需求', '创建发布'],
              ['项目经理', '创建项目、执行', '维护团队', '关联需求', '分解任务', '跟踪进度'],
              ['研发人员', '领取任务和Bug', '设计实现方案', '提交代码', '更新状态', '完成任务和Bug'],
              ['测试人员', '撰写用例', '执行用例', '提交Bug', '验证Bug', '关闭Bug'],
            ]" :key="rowIndex" class="flow-row">
              <b>{{ row[0] }}</b><span v-for="step in row.slice(1)" :key="step">{{ step }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel pending-panel">
        <header class="panel-heading"><strong>我的待处理</strong><div class="tabs"><button class="selected">待办</button><button @click="onNavigate('tasks')">任务</button><button>研发需求</button><button @click="onNavigate('bugs')">Bug</button></div><button class="more-button">⋮</button></header>
        <div class="empty-pending"><span class="check-mark">✓</span>今天安排得不错，暂时没有新的待办</div>
      </div>
    </section>

    <aside class="dashboard-rail">
      <section class="panel announcements">
        <header class="panel-heading"><strong>禅道动态</strong><button class="link-button">更多 ›</button><button class="more-button">⋮</button></header>
        <article><div><span class="pill blue-pill">最新发布</span><b>禅道开源版 22.6 发布</b></div><p>持续优化项目协作体验，带来更顺畅的研发流程。</p></article>
        <article><div><span class="pill blue-pill">产品动态</span><b>工作台体验更新</b></div><p>新增快捷入口，帮助团队更快查看个人待办。</p></article>
      </section>
      <section class="panel activity-panel">
        <header class="panel-heading"><strong>最新动态</strong><button class="link-button">更多 ›</button><button class="more-button">⋮</button></header>
        <div class="activity-list">
          <div v-for="item in activity" :key="`${item.id}-${item.time}`" class="activity-item">
            <time>{{ item.time }}</time><i :class="item.tone"></i><p><b>{{ item.name }}</b> {{ item.action }} <a>#{{ item.id }}</a> <span>{{ item.subject }}</span></p>
          </div>
        </div>
      </section>
    </aside>
  </div>
</template>
