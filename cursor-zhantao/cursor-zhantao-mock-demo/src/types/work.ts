export type WorkItem = {
  id: number
  title: string
  priority: 1 | 2 | 3 | 4
  status: '进行中' | '未开始' | '已完成' | '待确认'
  project: string
  assignee: string
  creator: string
  due?: string
  overdue?: string
  updated: string
  estimate?: number
  consumed?: number
  left?: number
}

export type BugDetailViewModel = {
  id: number
  title: string
  module: string
  openedBy: string
  assignedTo: string
  project: string
  severity: string
  priority: 1 | 2 | 3 | 4
  status: '进行中' | '未开始' | '已完成' | '待确认'
  statusText: string
  createdAt: string
  dueDate: string
  activatedCount: string
  activatedDate: string
  confirmed: string
  resolvedBy: string
  resolvedDate: string
  resolvedBuild: string
  resolution: string
  steps: string
  actual: string
  expected: string
  history: BugHistoryEntry[]
}

export type BugHistoryEntry = {
  id: string
  action: 'resolve' | 'close' | 'activate'
  actor: string
  date: string
  comment: string
}
