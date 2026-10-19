import { computed, shallowRef } from 'vue'
import { fetchBugDetail, fetchWorkspaceData } from '../api/zentaoClient'
import type { BugDetailViewModel, WorkItem } from '../types/work'

export type ApiConnectionState = 'connecting' | 'connected' | 'error'

const tasks = shallowRef<WorkItem[]>([])
const bugs = shallowRef<WorkItem[]>([])
const dashboard = shallowRef({ reviewCount: 0, storyCount: 0, caseCount: 0, requirementCount: 0 })
const bugDetail = shallowRef<BugDetailViewModel | null>(null)
const connectionState = shallowRef<ApiConnectionState>('connecting')
const errorMessage = shallowRef('')
const loading = shallowRef(false)
const detailLoading = shallowRef(false)

export function useZentaoWorkspace() {
  async function reload() {
    loading.value = true
    errorMessage.value = ''
    connectionState.value = 'connecting'
    try {
      const workspace = await fetchWorkspaceData()
      tasks.value = workspace.tasks
      bugs.value = workspace.bugs
      dashboard.value = workspace.dashboard
      connectionState.value = 'connected'
    } catch (error) {
      connectionState.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : '无法连接禅道 Mock Server。'
    } finally {
      loading.value = false
    }
  }

  async function loadBugDetail(bugId: string) {
    detailLoading.value = true
    errorMessage.value = ''
    try {
      bugDetail.value = await fetchBugDetail(bugId)
      connectionState.value = 'connected'
    } catch (error) {
      bugDetail.value = null
      connectionState.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : '无法读取 Bug 详情。'
    } finally {
      detailLoading.value = false
    }
  }

  return {
    tasks,
    bugs,
    dashboard: computed(() => dashboard.value),
    bugDetail,
    connectionState: computed(() => connectionState.value),
    errorMessage: computed(() => errorMessage.value),
    loading: computed(() => loading.value),
    detailLoading: computed(() => detailLoading.value),
    reload,
    loadBugDetail,
  }
}
