import type { BugDetailViewModel, BugHistoryEntry, WorkItem } from '../types/work'

type ApiEnvelope<T extends object> = { status: 'success' } & T
type Project = { id: string; name: string }
type Product = { id: string; name: string }
type Execution = { id: string; project: string; name: string }
type DashboardRecord = { id: string }
type Task = {
  id: string
  project: string
  execution: string
  name: string
  pri: string
  status: string
  assignedTo: string
  assignedToRealName?: string
  openedBy: string
  openedByRealName?: string
  deadline?: string
  lastEditedDate?: string
  delay?: number
  estimate?: string
  consumed?: string
  left?: string
}
type Bug = {
  id: string
  project: string
  product: string
  module?: string
  title: string
  severity: string
  pri: string
  status: string
  openedBy: string
  openedByRealName?: string
  openedDate?: string
  assignedTo: string
  assignedToRealName?: string
  deadline?: string
  steps?: string
  result?: string
  lastEditedDate?: string
  activatedCount?: string
  activatedDate?: string
  confirmed?: string
  resolvedBy?: string
  resolvedDate?: string
  resolvedBuild?: string
  resolution?: string
}

let tokenPromise: Promise<string> | null = null

async function login(): Promise<string> {
  const response = await fetch('/api.php/v2/users/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ account: 'frontend', password: 'demo-only' }),
  })
  const payload = await response.json() as { status: string; token?: string; message?: string }
  if (!response.ok || payload.status !== 'success' || !payload.token) {
    throw new Error(payload.message || 'Mock API 登录失败。')
  }
  return payload.token
}

function getToken() {
  if (!tokenPromise) {
    tokenPromise = login().catch((error: unknown) => {
      tokenPromise = null
      throw error
    })
  }
  return tokenPromise
}

async function getJson<T>(path: string, apiBase = '/api.php/v2'): Promise<T> {
  const token = await getToken()
  const response = await fetch(`${apiBase}${path}`, { headers: { token } })
  const payload = await response.json() as { status?: string; message?: string }
  if (!response.ok || payload.status !== 'success') {
    if (response.status === 401) tokenPromise = null
    throw new Error(payload.message || `Mock API 请求失败：${response.status}`)
  }
  return payload as unknown as T
}

function statusLabel(status: string): WorkItem['status'] {
  if (status === 'done' || status === 'resolved' || status === 'closed') return '已完成'
  if (status === 'active' || status === 'doing') return '进行中'
  if (status === 'pause' || status === 'confirmed') return '待确认'
  return '未开始'
}

function shortDate(value?: string) {
  return value && value.length >= 10 ? value.slice(5, 10) : value
}

function displayDateTime(value?: string) {
  if (!value) return '—'
  return value.slice(0, 16)
}

function displayPerson(account?: string) {
  if (!account) return '—'
  const names: Record<string, string> = { boss: '老板', frontend: '前端雨爸', amino: 'Eminoda' }
  return names[account] || account
}

function toWorkItem(record: Task | Bug, projects: Map<string, string>, isBug: boolean): WorkItem {
  const id = Number(record.id)
  const task = record as Task
  const bug = record as Bug
  return {
    id,
    title: isBug ? bug.title : task.name,
    priority: Math.min(Math.max(Number(record.pri) || 3, 1), 4) as WorkItem['priority'],
    status: statusLabel(record.status),
    project: projects.get(record.project) || `项目 ${record.project}`,
    assignee: displayPerson(record.assignedToRealName || record.assignedTo),
    creator: displayPerson(record.openedByRealName || record.openedBy),
    due: shortDate(record.deadline),
    overdue: 'delay' in record && record.delay && record.delay > 0 ? `延期 ${record.delay} 天` : undefined,
    updated: displayDateTime(record.lastEditedDate),
    estimate: 'estimate' in record && record.estimate ? Number(record.estimate) : undefined,
    consumed: 'consumed' in record && record.consumed ? Number(record.consumed) : undefined,
    left: 'left' in record && record.left ? Number(record.left) : undefined,
  }
}

export type WorkspaceData = {
  tasks: WorkItem[]
  bugs: WorkItem[]
  dashboard: {
    reviewCount: number
    storyCount: number
    caseCount: number
    requirementCount: number
  }
}

export async function fetchWorkspaceData(): Promise<WorkspaceData> {
  const [projectResponse, productResponse, executionResponse] = await Promise.all([
    getJson<ApiEnvelope<{ projects: Project[] }>>('/projects?recPerPage=1000&pageID=1'),
    getJson<ApiEnvelope<{ products: Product[] }>>('/products?recPerPage=1000&pageID=1'),
    getJson<ApiEnvelope<{ executions: Execution[] }>>('/executions?status=all&recPerPage=1000&pageID=1'),
  ])
  const projects = projectResponse.projects
  const products = productResponse.products
  const executions = executionResponse.executions
  const projectNames = new Map(projects.map((project) => [project.id, project.name]))

  const [taskResponses, bugResponses, storyResponses, reviewStoryResponses, requirementResponses, reviewRequirementResponses, testcaseResponses] = await Promise.all([
    Promise.all(executions.map((execution) =>
      getJson<ApiEnvelope<{ tasks: Task[] }>>(`/executions/${encodeURIComponent(execution.id)}/tasks?status=all&recPerPage=1000&pageID=1`),
    )),
    Promise.all(products.map((product) =>
      getJson<ApiEnvelope<{ bugs: Bug[] }>>(`/products/${encodeURIComponent(product.id)}/bugs?browseType=all&recPerPage=1000&pageID=1`),
    )),
    Promise.all(products.map((product) =>
      getJson<ApiEnvelope<{ stories: DashboardRecord[] }>>(`/products/${encodeURIComponent(product.id)}/stories?browseType=allstory&recPerPage=1000&pageID=1`),
    )),
    Promise.all(products.map((product) =>
      getJson<ApiEnvelope<{ stories: DashboardRecord[] }>>(`/products/${encodeURIComponent(product.id)}/stories?browseType=reviewbyme&recPerPage=1000&pageID=1`),
    )),
    Promise.all(products.map((product) =>
      getJson<ApiEnvelope<{ requirements: DashboardRecord[] }>>(`/products/${encodeURIComponent(product.id)}/requirements?browseType=allstory&recPerPage=1000&pageID=1`),
    )),
    Promise.all(products.map((product) =>
      getJson<ApiEnvelope<{ requirements: DashboardRecord[] }>>(`/products/${encodeURIComponent(product.id)}/requirements?browseType=reviewbyme&recPerPage=1000&pageID=1`),
    )),
    Promise.all(products.map((product) =>
      getJson<ApiEnvelope<{ testcases: DashboardRecord[] }>>(`/products/${encodeURIComponent(product.id)}/testcases?browseType=all&recPerPage=1000&pageID=1`),
    )),
  ])

  return {
    tasks: taskResponses.flatMap((response) => response.tasks).map((task) => toWorkItem(task, projectNames, false)),
    bugs: bugResponses.flatMap((response) => response.bugs).map((bug) => toWorkItem(bug, projectNames, true)),
    dashboard: {
      reviewCount: reviewStoryResponses.reduce((total, response) => total + response.stories.length, 0)
        + reviewRequirementResponses.reduce((total, response) => total + response.requirements.length, 0),
      storyCount: storyResponses.reduce((total, response) => total + response.stories.length, 0),
      caseCount: testcaseResponses.reduce((total, response) => total + response.testcases.length, 0),
      requirementCount: requirementResponses.reduce((total, response) => total + response.requirements.length, 0),
    },
  }
}

function labeledSection(steps: string | undefined, label: '步骤' | '结果' | '期望') {
  if (!steps) return ''
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = steps.match(new RegExp(`\\[${escapedLabel}\\]\\s*([\\s\\S]*?)(?=\\n\\s*\\[(?:步骤|结果|期望)\\]|$)`))
  return match?.[1]?.trim() || ''
}

export async function fetchBugDetail(bugId: string): Promise<BugDetailViewModel> {
  const response = await getJson<ApiEnvelope<{ bug: Bug }>>(`/bugs/${encodeURIComponent(bugId)}`)
  const bug = response.bug
  const [projectResponse, historyResponse] = await Promise.all([
    getJson<ApiEnvelope<{ projects: Project[] }>>('/projects?recPerPage=1000&pageID=1'),
    getJson<ApiEnvelope<{ history: BugHistoryEntry[] }>>(`/bugs/${encodeURIComponent(bugId)}/history`, '/api.php/mock'),
  ])
  const project = projectResponse.projects.find((item) => item.id === bug.project)?.name || `项目 ${bug.project}`
  const status = statusLabel(bug.status)
  return {
    id: Number(bug.id),
    title: bug.title,
    module: bug.module === '310' ? '任务列表 / 高级筛选' : `模块 ${bug.module || '—'}`,
    openedBy: displayPerson(bug.openedByRealName || bug.openedBy),
    assignedTo: displayPerson(bug.assignedToRealName || bug.assignedTo),
    project,
    severity: bug.severity || '3',
    priority: Math.min(Math.max(Number(bug.pri) || 3, 1), 4) as WorkItem['priority'],
    status,
    statusText: bug.status === 'resolved' ? '已解决' : bug.status === 'closed' ? '已关闭' : bug.status === 'active' ? '激活' : status,
    createdAt: displayDateTime(bug.openedDate),
    dueDate: bug.deadline || '—',
    activatedCount: bug.activatedCount || '0',
    activatedDate: displayDateTime(bug.activatedDate),
    confirmed: bug.confirmed === '1' ? '已确认' : '未确认',
    resolvedBy: displayPerson(bug.resolvedBy),
    resolvedDate: bug.resolvedDate || '—',
    resolvedBuild: bug.resolvedBuild || '—',
    resolution: bug.resolution || '—',
    steps: labeledSection(bug.steps, '步骤') || bug.steps || '暂无复现步骤',
    actual: labeledSection(bug.steps, '结果') || bug.result || '暂无实际结果',
    expected: labeledSection(bug.steps, '期望') || '暂无期望结果',
    history: historyResponse.history.map((entry) => ({ ...entry, actor: displayPerson(entry.actor) })),
  }
}
