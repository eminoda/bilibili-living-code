<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, DataAnalysis, Grid, Search, Setting } from '@element-plus/icons-vue'
import { businessModules } from '../router'

const route = useRoute()
const router = useRouter()
const groups = computed(() => {
  const grouped = new Map<string, typeof businessModules>()
  for (const item of businessModules) {
    grouped.set(item.group, [...(grouped.get(item.group) ?? []), item])
  }
  return [...grouped.entries()]
})

function navigate(path: string) {
  void router.push(path)
}

function onMenuClick(index: string) {
  if (index.startsWith('/')) navigate(index)
}
</script>

<template>
  <div class="app-layout">
    <aside class="app-sidebar">
      <div class="brand">
        <div class="brand-mark">北</div>
        <div class="brand-copy"><strong>北辰零售</strong><span>运营管理平台</span></div>
      </div>
      <div class="sidebar-label">工作空间</div>
      <el-menu class="side-menu" :default-active="route.path" @select="onMenuClick">
        <el-menu-item index="/orders"><el-icon><Grid /></el-icon><span>订单运营工作台</span></el-menu-item>
        <el-sub-menu v-for="[group, items] in groups" :key="group" :index="group">
          <template #title><el-icon><DataAnalysis /></el-icon><span>{{ group }}</span></template>
          <el-menu-item v-for="item in items" :key="item.slug" :index="`/module/${item.slug}`">
            {{ item.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      <div class="sidebar-bottom">
        <span class="system-dot"></span><span>业务服务正常运行</span>
        <el-icon class="settings-glyph"><Setting /></el-icon>
      </div>
    </aside>

    <div class="app-content">
      <header class="topbar">
        <div class="topbar-search"><el-icon aria-hidden="true"><Search /></el-icon><span>搜索订单、客户或功能</span><kbd>⌘ K</kbd></div>
        <div class="topbar-actions">
          <el-tag type="success" effect="plain">开发环境</el-tag>
          <span class="topbar-date">2026 年 9 月 30 日</span>
          <el-button class="icon-action" circle :icon="DataAnalysis" aria-label="数据分析" />
          <el-button class="icon-action" circle :icon="Bell" aria-label="通知" />
          <div class="user-avatar">陈</div>
          <div class="user-name">陈妍 <small>运营主管</small></div>
        </div>
      </header>
      <main class="main-content"><router-view /></main>
    </div>
  </div>
</template>
