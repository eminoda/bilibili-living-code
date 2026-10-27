<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDark } from '@vueuse/core'
import type { Implementation } from '@/types'
import { createApplicationForm, useWorkspaceForm } from '@/composables/useWorkspaceForm'

const props = defineProps<{ implementation: Implementation }>()
const route = useRoute()
const activeSection = computed(() => route.query.section === 'basic' ? 'basic' : 'details')
const { form, isReady } = useWorkspaceForm(toRef(props, 'implementation'))
const vueDark = useDark({ storageKey: 'vue3-vueuse-business-practice-theme' })
const nativeDark = ref(localStorage.getItem('vue3-vueuse-business-practice-theme-native') === 'dark')
const activeDark = computed(() => props.implementation === 'vueuse' ? vueDark.value : nativeDark.value)
const workspaceClass = computed(() => ({ 'dark-theme': activeDark.value }))
const updatedAt = ref(new Date())
const savedMessage = ref(props.implementation === 'vueuse' ? '所有修改已自动同步' : '修改已保存')
const materials = ref(['营业执照', '项目方案', '预算明细'])
const selectedMaterials = computed({
  get: () => form.value.preparedMaterials ?? [],
  set: (value: string[]) => { form.value.preparedMaterials = value },
})

function setDark(value: boolean) {
  if (props.implementation === 'vueuse') vueDark.value = value
  else {
    nativeDark.value = value
    localStorage.setItem('vue3-vueuse-business-practice-theme-native', value ? 'dark' : 'light')
  }
}

function onStorage(event: StorageEvent) {
  if (event.key === 'vue3-vueuse-business-practice-theme-native') nativeDark.value = event.newValue === 'dark'
}

function openOtherTab() {
  window.open(`${window.location.origin}/workspace`, '_blank', 'noopener,noreferrer')
}

function resetForm() {
  Object.assign(form.value, createApplicationForm())
  savedMessage.value = '已恢复初始信息'
}

function saveDraft() {
  updatedAt.value = new Date()
  savedMessage.value = '草稿已保存'
}

function submitApplication() {
  updatedAt.value = new Date()
  savedMessage.value = '申请信息已提交'
}

watch(form, () => {
  updatedAt.value = new Date()
  savedMessage.value = props.implementation === 'vueuse' ? '所有修改已自动同步' : '修改已保存'
}, { deep: true })
watch(activeDark, (value) => {
  document.documentElement.classList.toggle('dark', value)
}, { immediate: true })
onMounted(() => {
  window.addEventListener('storage', onStorage)
})
onUnmounted(() => {
  window.removeEventListener('storage', onStorage)
})
</script>

<template>
  <div class="workspace-page">
    <div class="workspace-page-actions">
      <button class="theme-switch page-theme-switch" :aria-pressed="activeDark" @click="setDark(!activeDark)"><span>{{ activeDark ? '☾' : '☼' }}</span>{{ activeDark ? '深色主题' : '浅色主题' }}</button>
      <button class="button-outline" @click="openOtherTab"><span>▣</span> 打开标签页 <span class="external-icon">↗</span></button>
    </div>

    <section class="workspace-shell application-document" :class="workspaceClass">
      <div class="workspace-toolbar">
        <div class="workspace-title"><span class="workspace-logo">N</span><span><strong>{{ form.company }} · 企业业务申请</strong><small>{{ isReady ? '草稿已载入' : '正在载入草稿' }}</small></span></div>
        <div class="workspace-tools"><span v-if="implementation === 'vueuse'" class="sync-indicator"><i></i> 已开启多标签同步</span><span class="avatar">E</span></div>
      </div>

      <div class="workspace-meta">
        <div><span class="meta-label">申请编号</span><strong>AP-2026-10384</strong><span class="review-pill">草稿</span></div>
        <div class="sync-meta">最近保存 {{ updatedAt.toLocaleTimeString('zh-CN') }}</div>
      </div>

      <form class="long-application-form" @submit.prevent="submitApplication">
        <section v-if="activeSection === 'basic'" class="long-form-section">
          <div class="long-section-heading"><span>01</span><div><h2>企业基本信息</h2><p>请填写申请企业的主体信息与联系人</p></div></div>
          <div class="workspace-form-grid">
            <label class="field"><span>企业名称 <b>*</b></span><input v-model="form.company" /></label>
            <label class="field"><span>统一社会信用代码 <b>*</b></span><input v-model="form.unifiedCode" /></label>
            <label class="field"><span>法定代表人</span><input v-model="form.legalRepresentative" /></label>
            <label class="field"><span>企业规模</span><select v-model="form.companySize"><option>50 人以下</option><option>50-199 人</option><option>200-499 人</option><option>500-999 人</option><option>1000 人以上</option></select></label>
            <label class="field"><span>企业联系人 <b>*</b></span><input v-model="form.contact" /></label>
            <label class="field"><span>联系电话 <b>*</b></span><input v-model="form.contactPhone" /></label>
            <label class="field"><span>联系邮箱</span><input v-model="form.contactEmail" type="email" /></label>
            <label class="field full"><span>注册地址</span><input v-model="form.registeredAddress" /></label>
            <label class="field full"><span>经营范围</span><textarea v-model="form.businessScope" rows="2"></textarea></label>
          </div>
        </section>

        <section v-if="activeSection === 'details'" class="long-form-section">
          <div class="long-section-heading"><span>02</span><div><h2>项目申请内容</h2><p>说明本次业务申请的具体事项</p></div></div>
          <div class="workspace-form-grid">
            <label class="field"><span>申请类别 <b>*</b></span><select v-model="form.category"><option>数字化服务</option><option>企业采购</option><option>渠道合作</option><option>技术支持</option></select></label>
            <label class="field"><span>项目名称 <b>*</b></span><input v-model="form.projectName" /></label>
            <label class="field"><span>申请金额 <b>*</b></span><div class="input-prefix"><b>¥</b><input v-model.number="form.amount" type="number" min="0" /></div></label>
            <label class="field"><span>预算来源</span><input v-model="form.budgetSource" /></label>
            <label class="field"><span>期望完成日期</span><input v-model="form.expectedDate" type="date" /></label>
            <label class="field"><span>项目实施地点</span><input v-model="form.projectLocation" /></label>
            <label class="field"><span>预计服务人数</span><div class="input-suffix"><input v-model.number="form.expectedUsers" type="number" min="0" /><b>人</b></div></label>
            <label class="field"><span>实施周期</span><select v-model="form.implementationCycle"><option>1-3 个月</option><option>3-6 个月</option><option>6-12 个月</option><option>12 个月以上</option></select></label>
            <label class="field"><span>合作方式</span><select v-model="form.cooperationMode"><option>项目制交付</option><option>年度服务</option><option>联合建设</option></select></label>
            <label class="field full"><span>申请说明 <b>*</b></span><textarea v-model="form.note" rows="4"></textarea></label>
          </div>
        </section>
        <section v-if="activeSection === 'details'" class="long-form-section">
          <div class="long-section-heading"><span>03</span><div><h2>申请材料</h2><p>勾选本次申请已准备好的文件</p></div></div>
          <div class="material-list">
            <label v-for="material in materials" :key="material" class="material-item">
              <input v-model="selectedMaterials" type="checkbox" :value="material" />
              <span class="material-file">▧</span><span class="material-copy"><strong>{{ material }}</strong><small>{{ selectedMaterials.includes(material) ? '已准备' : '待补充' }}</small></span>
              <span class="material-action">{{ selectedMaterials.includes(material) ? '已添加' : '选择文件' }}</span>
            </label>
          </div>
        </section>

        <section v-if="activeSection === 'details'" class="long-form-section confirmation-section">
          <div class="long-section-heading"><span>04</span><div><h2>提交前确认</h2><p>请核对申请信息，确认后提交审核</p></div></div>
          <div class="confirmation-card"><span class="confirm-check">✓</span><div><strong>{{ form.company || '企业名称待填写' }}</strong><p>{{ form.projectName || '项目名称待填写' }} · {{ form.category }} · ¥{{ Number(form.amount || 0).toLocaleString('zh-CN') }}</p></div><span class="review-pill">待提交</span></div>
        </section>
        <div class="long-form-footer"><div><span class="saved-check">✓</span>{{ savedMessage }} <small>· {{ updatedAt.toLocaleTimeString('zh-CN') }}</small></div><div class="footer-actions"><button class="button-outline" type="button" @click="resetForm">恢复初始信息</button><button class="button-outline" type="button" @click="saveDraft">保存草稿</button><button class="button-primary" type="submit">提交</button></div></div>
      </form>
    </section>
  </div>
</template>
