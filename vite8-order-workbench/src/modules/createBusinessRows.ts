export interface BusinessRow {
  id: string
  subject: string
  status: '待处理' | '处理中' | '已完成' | '需复核'
  owner: string
  updatedAt: string
  amount: string
}

const people = ['陈妍', '林哲', '刘歆', '张维', '周宁', '杨一诺', '李晓', '何悦']
const statuses: BusinessRow['status'][] = ['待处理', '处理中', '已完成', '需复核']

export function createBusinessRows(category: string, title: string, seed: number): BusinessRow[] {
  return Array.from({ length: 18 }, (_, index) => ({
    id: `${category.slice(0, 1)}${String(seed * 100 + index).padStart(6, '0')}`,
    subject: `${title} · ${['华东区', '华南区', '华北区', '西南区'][index % 4]} ${String(index + 1).padStart(2, '0')}`,
    status: statuses[(seed + index) % statuses.length] ?? '待处理',
    owner: people[(seed + index * 3) % people.length] ?? '陈妍',
    updatedAt: `2026-09-${String(25 + index % 5).padStart(2, '0')} ${String(9 + index % 9).padStart(2, '0')}:${String(index * 7 % 60).padStart(2, '0')}`,
    amount: `¥${(860 + seed * 3 + index * 157).toLocaleString('zh-CN')}`,
  }))
}
