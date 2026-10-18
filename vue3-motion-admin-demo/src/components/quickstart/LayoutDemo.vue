<script setup lang="ts">
import { shallowRef } from 'vue'
import { motion } from 'motion-v'
import ComparisonSection from './ComparisonSection.vue'

const tasks = shallowRef([
  { id: 'design', title: '设计卡片', background: '#3b2115', border: '#b96739', text: '#ffe0cc', accent: '#ff9a63' },
  { id: 'animate', title: '添加动画', background: '#29223e', border: '#7862c3', text: '#e4dcff', accent: '#b4a1ff' },
  { id: 'check', title: '检查效果', background: '#183526', border: '#43885d', text: '#d3f5de', accent: '#66d995' },
  { id: 'share', title: '分享演示', background: '#172c3a', border: '#447c9e', text: '#d0edff', accent: '#6fc4f5' },
])
const activeTab = shallowRef(0)
const tabs = ['预览', '代码', '检查']
const cssCode = `.list-item { transition: transform .3s ease; }
/* CSS transition 不会自动知道列表项重排前后的位置 */

.active-indicator {
  width: calc(100% / 3);
  transition: transform .25s ease;
  /* 根据选中的标签序号移动 */
}`
const motionCode = `<motion.li
  v-for="task in tasks"
  :key="task.id"
  layout
/>

<motion.span v-if="active" layoutId="active-tab" />`

function reverseTasks() {
  tasks.value = [...tasks.value].reverse()
}
</script>

<template>
  <ComparisonSection id="layout" index="07" title="布局与共享布局动画" description="点击“反转顺序”改变列表，再切换标签。Motion 能补间列表重排，也能在不同元素之间共享布局动画。" :css-code="cssCode" :motion-code="motionCode">
    <template #css>
      <div class="layout-demo">
        <ul class="layout-list">
          <li v-for="(task, index) in tasks" :key="task.id" class="layout-item" :style="{ '--item-bg': task.background, '--item-border': task.border, '--item-text': task.text, '--item-accent': task.accent }"><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ task.title }}</li>
        </ul>
        <button class="layout-button" type="button" @click="reverseTasks">反转顺序</button>
        <div class="shared-tabs shared-tabs--css">
          <button v-for="(tab, index) in tabs" :key="tab" class="shared-tab" :class="{ 'shared-tab--active': activeTab === index }" type="button" @click="activeTab = index">{{ tab }}</button>
          <span class="tab-indicator" :style="{ transform: `translateX(${activeTab * 100}%)` }" />
        </div>
        <span class="layout-caption">CSS transition 移动下划线</span>
      </div>
    </template>
    <template #motion>
      <div class="layout-demo">
        <motion.ul class="layout-list" layout>
          <motion.li v-for="(task, index) in tasks" :key="task.id" class="layout-item layout-item--motion" :style="{ '--item-bg': task.background, '--item-border': task.border, '--item-text': task.text, '--item-accent': task.accent }" layout><span>{{ String(index + 1).padStart(2, '0') }}</span>{{ task.title }}</motion.li>
        </motion.ul>
        <button class="layout-button layout-button--motion" type="button" @click="reverseTasks">反转顺序</button>
        <div class="shared-tabs shared-tabs--motion">
          <button v-for="(tab, index) in tabs" :key="tab" class="shared-tab" :class="{ 'shared-tab--active': activeTab === index }" type="button" @click="activeTab = index">{{ tab }}<motion.span v-if="activeTab === index" layoutId="quickstart-active-tab" class="tab-indicator" /></button>
        </div>
        <span class="layout-caption">layoutId 在标签间共享下划线动画</span>
      </div>
    </template>
    <template #note>列表内容和 Vue key 完全一样，变化只有是否声明 layout；标签下划线展示 layoutId 如何在不同元素间共享布局动画。</template>
  </ComparisonSection>
</template>

<style scoped>
.layout-demo { display: grid; width: min(100%, 440px); justify-items: center; gap: 18px; }
.layout-list { display: grid; width: 100%; gap: 10px; margin: 0; padding: 0; list-style: none; }
.layout-item { display: flex; min-height: 54px; align-items: center; gap: 16px; padding: 10px 16px; border: 1px solid var(--item-border); border-radius: 11px; background: var(--item-bg); color: var(--item-text); font-size: 16px; }
.layout-item span { color: var(--item-accent); font: 13px 'DM Mono', monospace; }
.layout-item--motion { box-shadow: 0 4px 14px color-mix(in srgb, var(--item-accent) 14%, transparent); }
.layout-button { margin-top: 32px; padding: 11px 17px; border: 1px solid #d9e1eb; border-radius: 8px; background: #fff; color: #536174; cursor: pointer; font-size: 15px; }
.layout-button:hover { background: #f1f7fa; }
.layout-button--motion { border-color: #9adfe9; background: #effcff; color: #087b91; }
.shared-tabs { position: relative; display: grid; width: min(100%, 400px); grid-template-columns: repeat(3, 1fr); margin-top: 6px; border-bottom: 1px solid #dce3ed; }
.shared-tab { position: relative; display: grid; min-height: 48px; place-items: center; border: 0; background: transparent; color: #778397; cursor: pointer; font: inherit; font-size: 15px; }
.shared-tab--active { color: #26364a; }
.shared-tabs--css .tab-indicator { position: absolute; bottom: -1px; left: 0; width: calc(100% / 3); height: 3px; background: #06b6d4; box-shadow: 0 0 10px rgb(6 182 212 / 40%); transition: transform 250ms ease; }
.shared-tabs--motion .tab-indicator { position: absolute; right: 0; bottom: -1px; left: 0; height: 3px; border-radius: 3px; background: #06b6d4; box-shadow: 0 0 12px rgb(6 182 212 / 55%); }
.layout-caption { color: #778397; font-size: 13px; }
</style>
