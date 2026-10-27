<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ApplicationForm, Implementation } from '@/types'
import { useApplicationHistory } from '@/composables/useApplicationHistory'

const props = defineProps<{ implementation: Implementation }>()
const form = ref<ApplicationForm>({
  company: '',
  contact: '',
  category: '',
  amount: null,
  note: '',
  province: '上海市',
  city: '',
  district: '',
  serviceOffice: '',
})
const { history, canUndo, canRedo, recordMode, undo, redo, restore, commitPendingChanges } = useApplicationHistory(form, computed(() => props.implementation))
const recentHistory = computed(() => history.value.slice(0, 6))
const submitted = ref(false)
const historyVisible = ref(false)
const expandedHistoryIndex = ref<number | null>(null)
const historyFields: { key: keyof ApplicationForm; label: string }[] = [
  { key: 'company', label: '企业名称' },
  { key: 'contact', label: '联系人' },
  { key: 'category', label: '申请类型' },
  { key: 'amount', label: '申请金额' },
  { key: 'province', label: '办理省份' },
  { key: 'city', label: '办理城市' },
  { key: 'district', label: '办理区县' },
  { key: 'serviceOffice', label: '办理网点' },
  { key: 'note', label: '申请说明' },
]
const regionOptions: Record<string, Record<string, Record<string, string[]>>> = {
  上海市: { 上海市: { 浦东新区: ['张江办理网点', '陆家嘴办理网点'], 黄浦区: ['人民广场办理网点'] } },
  浙江省: { 杭州市: { 西湖区: ['文三路办理网点'], 滨江区: ['滨江办理网点'] }, 宁波市: { 鄞州区: ['鄞州办理网点'] } },
  广东省: { 深圳市: { 南山区: ['科技园办理网点'], 福田区: ['福田办理网点'] }, 广州市: { 天河区: ['天河办理网点'] } },
}
const availableCities = computed(() => Object.keys(regionOptions[form.value.province ?? ''] ?? {}))
const availableDistricts = computed(() => Object.keys(regionOptions[form.value.province ?? '']?.[form.value.city ?? ''] ?? {}))
const availableOffices = computed(() => regionOptions[form.value.province ?? '']?.[form.value.city ?? '']?.[form.value.district ?? ''] ?? [])

function updateAmount(event: Event) {
  const value = (event.target as HTMLInputElement).value
  form.value.amount = value === '' ? null : Number(value)
}

function commitHistoryIfChanged() {
  if (props.implementation !== 'vueuse') return
  const latestSnapshot = history.value[0]
  if (JSON.stringify(latestSnapshot) !== JSON.stringify(form.value)) {
    // A cascade change is a deliberate boundary in the editing session.
    // Commit pending form edits before and after that action as separate states.
    commitPendingChanges()
  }
}

function updateProvince(event: Event) {
  commitHistoryIfChanged()
  form.value.province = (event.target as HTMLSelectElement).value
  form.value.city = ''
  form.value.district = ''
  form.value.serviceOffice = ''
  clearApplicationFields()
  commitHistoryIfChanged()
}

function updateCity(event: Event) {
  commitHistoryIfChanged()
  form.value.city = (event.target as HTMLSelectElement).value
  form.value.district = ''
  form.value.serviceOffice = ''
  clearApplicationFields()
  commitHistoryIfChanged()
}

function updateDistrict(event: Event) {
  commitHistoryIfChanged()
  form.value.district = (event.target as HTMLSelectElement).value
  form.value.serviceOffice = ''
  clearApplicationFields()
  commitHistoryIfChanged()
}

function updateServiceOffice(event: Event) {
  commitHistoryIfChanged()
  form.value.serviceOffice = (event.target as HTMLSelectElement).value
  clearApplicationFields()
  commitHistoryIfChanged()
}

function clearApplicationFields() {
  form.value.company = ''
  form.value.contact = ''
  form.value.category = ''
  form.value.amount = null
  form.value.note = ''
}

function clearForm() {
  Object.assign(form.value, {
    company: '',
    contact: '',
    category: '',
    amount: null,
    note: '',
    province: '',
    city: '',
    district: '',
    serviceOffice: '',
  })
}

function submitApplication() {
  submitted.value = true
}

function toggleHistoryDetails(index: number) {
  expandedHistoryIndex.value = expandedHistoryIndex.value === index ? null : index
}

function formatHistoryValue(snapshot: ApplicationForm, key: keyof ApplicationForm) {
  const value = snapshot[key]
  if (key === 'amount') return value == null ? '未填写' : `¥${Number(value).toLocaleString('zh-CN')}`
  return value || '未填写'
}

watch(form, () => {
  submitted.value = false
}, { deep: true })
</script>

<template>
  <div class="content-grid history-layout" :class="{ 'history-native': implementation === 'native', 'history-open': historyVisible }">
    <section class="panel form-panel">
      <div class="panel-heading">
        <div><h2>表单填写</h2><span class="form-heading-subtitle">企业业务申请</span></div>
        <div class="form-heading-actions"><button class="button-text" type="button" @click="clearForm">清空表单</button><span class="draft-pill"><i></i> 本地草稿</span></div>
      </div>
      <div class="form-grid">
        <label class="field"><span>办理省份</span><select :value="form.province" @change="updateProvince"><option value="" disabled>请选择省份</option><option v-for="province in Object.keys(regionOptions)" :key="province" :value="province">{{ province }}</option></select></label>
        <label class="field"><span>办理城市</span><select :value="form.city" :disabled="!form.province" @change="updateCity"><option value="" disabled>请选择城市</option><option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option></select></label>
        <label class="field"><span>办理区县</span><select :value="form.district" :disabled="!form.city" @change="updateDistrict"><option value="" disabled>请选择区县</option><option v-for="district in availableDistricts" :key="district" :value="district">{{ district }}</option></select></label>
        <label class="field"><span>办理网点</span><select :value="form.serviceOffice" :disabled="!form.district" @change="updateServiceOffice"><option value="" disabled>请选择办理网点</option><option v-for="office in availableOffices" :key="office" :value="office">{{ office }}</option></select></label>
        <label class="field"><span>企业名称</span><input v-model="form.company" placeholder="请输入企业名称" /></label>
        <label class="field"><span>联系人</span><input v-model="form.contact" placeholder="请输入联系人" /></label>
        <label class="field"><span>申请类型</span><select v-model="form.category"><option value="" disabled>请选择申请类型</option><option>数字化服务</option><option>企业采购</option><option>渠道合作</option><option>技术支持</option></select></label>
        <label class="field"><span>申请金额</span><div class="input-prefix"><b>¥</b><input :value="form.amount ?? ''" type="number" min="0" @input="updateAmount" /></div></label>
        <label class="field full"><span>申请说明</span><textarea v-model="form.note" rows="4" placeholder="补充业务背景和需求…"></textarea></label>
      </div>
      <div class="form-footer"><span><span class="saved-check">✓</span>{{ submitted ? '申请已提交' : implementation === 'vueuse' ? '修改自动进入历史记录' : '表单内容可直接编辑' }}</span><button class="button-primary" @click="submitApplication">提交</button></div>
      <button
        v-if="implementation === 'vueuse'"
        class="history-toggle"
        type="button"
        :aria-expanded="historyVisible"
        :aria-label="historyVisible ? '收起编辑历史' : '展开编辑历史'"
        @click="historyVisible = !historyVisible"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path :d="historyVisible ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'" />
        </svg>
      </button>
    </section>

    <aside v-if="implementation === 'vueuse' && historyVisible" class="panel history-panel">
      <div class="panel-heading">
        <div><h2>编辑历史</h2></div>
        <div class="history-head-tools">
          <div v-if="implementation === 'vueuse'" class="record-switch" role="group" aria-label="历史记录粒度">
            <button :class="{ selected: recordMode === 'immediate' }" @click="recordMode = 'immediate'">即时</button>
            <button :class="{ selected: recordMode === 'debounced' }" @click="recordMode = 'debounced'">防抖</button>
          </div>
          <span class="history-count">{{ history.length }} 条</span>
        </div>
      </div>
      <p class="panel-caption">选择任意一条记录，快速回到那个版本。</p>
      <div class="history-actions">
        <button class="button-quiet" :disabled="!canUndo" @click="undo"><span>↶</span> 撤销</button>
        <button class="button-quiet" :disabled="!canRedo" @click="redo"><span>↷</span> 重做</button>
      </div>
      <div class="timeline">
        <article
          v-for="(snapshot, index) in recentHistory"
          :key="`${index}-${snapshot.company}-${snapshot.note}`"
          class="timeline-item"
          :class="{ current: index === 0 }"
        >
          <button class="timeline-record" :aria-expanded="expandedHistoryIndex === index" @click="toggleHistoryDetails(index)">
            <span class="timeline-dot"></span>
            <span class="timeline-copy"><strong>#{{ index + 1 }}</strong><small>{{ snapshot.company || '未填写企业名称' }} · {{ snapshot.category || '未选类型' }}</small></span>
            <span class="timeline-time">{{ index === 0 ? '当前' : `${index * 2} 分钟前` }}</span>
            <span class="timeline-chevron" :class="{ expanded: expandedHistoryIndex === index }">⌄</span>
          </button>
          <div v-if="expandedHistoryIndex === index" class="timeline-details">
            <dl>
              <div v-for="field in historyFields" :key="field.key" class="timeline-detail-row">
                <dt>{{ field.label }}</dt>
                <dd>{{ formatHistoryValue(snapshot, field.key) }}</dd>
              </div>
            </dl>
            <button v-if="index !== 0" class="button-outline timeline-restore" @click="restore(snapshot)">恢复此版本</button>
          </div>
        </article>
        <div v-if="recentHistory.length === 0" class="empty-state">开始编辑，历史版本会显示在这里。</div>
      </div>
    </aside>
  </div>
</template>
