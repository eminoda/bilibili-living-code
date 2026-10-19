<script setup lang="ts">
import { ref } from 'vue'
import type { BugDetailViewModel } from '../../types/work'
import BugHistory from './BugHistory.vue'

defineProps<{ onBack: () => void; bug: BugDetailViewModel | null; loading: boolean }>()
const infoTab = ref('基本信息')
const lowerTab = ref('项目/研发需求/任务')
</script>

<template>
  <div v-if="bug" class="detail-page">
    <div class="detail-titlebar">
      <button class="back-button" @click="onBack">‹ 返回</button>
      <span class="bug-number">{{ bug.id }}</span><strong>{{ bug.title }}</strong>
      <button class="create-bug">＋ 提Bug</button>
    </div>
    <div class="detail-layout">
      <main class="detail-main">
        <section class="panel repro-panel">
          <header><strong>重现步骤</strong><button class="ai-button">✦ 禅道智能 ▾</button></header>
          <pre>{{ bug.steps }}</pre>
          <div class="result-block"><b>实际结果</b><p>{{ bug.actual }}</p></div>
          <div class="result-block"><b>期望结果</b><p>{{ bug.expected }}</p></div>
        </section>
        <BugHistory :created-at="bug.createdAt" :opened-by="bug.openedBy" :assigned-to="bug.assignedTo" :history="bug.history" />
        <div class="action-dock"><button @click="onBack">↶ 返回</button><i></i><button>◎ 确认</button><button>⚑ 指派</button><button>✓ 解决</button><button>⇥ 转任务</button><i></i><button>▱</button><button>▣</button></div>
      </main>
      <aside class="detail-aside">
        <section class="panel detail-info">
          <header><div><button :class="{ active: infoTab === '基本信息' }" @click="infoTab = '基本信息'">基本信息</button><button :class="{ active: infoTab === 'Bug的一生' }" @click="infoTab = 'Bug的一生'">Bug的一生</button></div><span>⌄</span></header>
          <template v-if="infoTab === '基本信息'">
            <dl>
              <dt>所属模块</dt><dd>{{ bug.module }}</dd>
              <dt>来源用例</dt><dd>—</dd>
              <dt>Bug类型</dt><dd>界面显示</dd>
              <dt>严重程度</dt><dd><span class="severity">{{ bug.severity }}</span></dd>
              <dt>优先级</dt><dd><span class="priority">{{ bug.priority }}</span></dd>
              <dt>Bug状态</dt><dd :class="{ running: bug.status === '进行中' }">{{ bug.statusText }}</dd>
              <dt>激活次数</dt><dd>{{ bug.activatedCount }}</dd>
              <dt>激活时间</dt><dd>{{ bug.activatedDate }}</dd>
              <dt>是否确认</dt><dd>{{ bug.confirmed }}</dd>
              <dt>指派给</dt><dd>{{ bug.assignedTo }} 于 {{ bug.createdAt }}</dd>
              <template v-if="bug.statusText === '已解决'">
                <dt>解决方案</dt><dd>{{ bug.resolution }}</dd>
                <dt>解决者</dt><dd>{{ bug.resolvedBy }}</dd>
                <dt>解决日期</dt><dd>{{ bug.resolvedDate }}</dd>
                <dt>解决版本</dt><dd>{{ bug.resolvedBuild }}</dd>
              </template>
              <dt>截止日期</dt><dd>{{ bug.dueDate }}</dd>
              <dt>反馈者</dt><dd>{{ bug.openedBy }}</dd>
              <dt>抄送给</dt><dd>—</dd>
            </dl>
          </template>
          <div v-else class="life-line"><span>新建</span><i></i><span>指派</span><i></i><span>{{ bug.statusText }}</span></div>
        </section>
        <section class="panel linked-items"><header><div><button :class="{ active: lowerTab.startsWith('项目') }" @click="lowerTab = '项目/研发需求/任务'">项目/研发需求/任务</button><button :class="{ active: lowerTab === '其他相关' }" @click="lowerTab = '其他相关'">其他相关</button></div><span>⌄</span></header><div class="linked-empty">{{ lowerTab === '其他相关' ? '暂无关联记录' : bug.project }}</div></section>
      </aside>
    </div>
  </div>
  <div v-else class="detail-loading panel">
    {{ loading ? '正在从 Mock Server 加载 Bug 详情…' : '未能从 Mock Server 读取这条 Bug。' }}
  </div>
</template>
