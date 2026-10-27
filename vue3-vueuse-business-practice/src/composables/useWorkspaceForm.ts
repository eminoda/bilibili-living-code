import { computed, ref, watch } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import type { ApplicationForm, Implementation } from '@/types'

const idbKey = 'vue3-vueuse-business-practice-application'

export function createApplicationForm(): ApplicationForm {
  return {
    company: 'XXX有限公司',
    contact: '前端雨爸',
    category: '数字化服务',
    amount: 280000,
    note: '计划升级企业数据平台，支持多部门协同与经营分析。',
    unifiedCode: '91310000MA1K4L2X8P',
    registeredAddress: '上海市浦东新区张江高科技园区科苑路 88 号',
    businessScope: '企业数据平台建设、软件开发与技术服务',
    contactPhone: '138 0000 2026',
    legalRepresentative: '陈明远',
    companySize: '500-999 人',
    contactEmail: 'eminoda@example.com',
    projectName: '企业经营数据平台升级项目',
    budgetSource: '年度数字化专项预算',
    expectedDate: '2026-12-15',
    projectLocation: '上海市浦东新区',
    expectedUsers: 320,
    implementationCycle: '3-6 个月',
    cooperationMode: '项目制交付',
    preparedMaterials: ['营业执照'],
  }
}

export function useWorkspaceForm(implementation: Readonly<{ value: Implementation }>) {
  const initial = createApplicationForm()
  const stored = useIDBKeyval<ApplicationForm>(idbKey, initial, { deep: true })
  const nativeForm = ref<ApplicationForm>(initial)

  watch(stored.data, (value) => {
    if (!value) return
    const merged = migrateForm(value, initial)
    if (JSON.stringify(merged) !== JSON.stringify(value)) stored.data.value = merged
  }, { immediate: true })

  const form = computed(() => implementation.value === 'vueuse' ? stored.data.value : nativeForm.value)
  const isReady = computed(() => implementation.value === 'vueuse' ? stored.isFinished.value : true)

  return { form, isReady }
}

function migrateForm(value: Partial<ApplicationForm>, defaults: ApplicationForm): ApplicationForm {
  const merged = { ...defaults, ...value }
  if (merged.company === '北辰智能科技有限公司') merged.company = defaults.company
  if (merged.contact === '林晓雨') merged.contact = defaults.contact
  return merged
}
