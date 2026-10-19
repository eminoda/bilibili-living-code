const projects = [
  { id: '1001', name: '协作平台体验升级', code: 'collab-upgrade', status: 'doing', type: 'sprint' },
  { id: '1002', name: '账号中心改版', code: 'account-center', status: 'doing', type: 'sprint' },
  { id: '1003', name: '工作台改版', code: 'workbench-revamp', status: 'doing', type: 'sprint' },
  { id: '1004', name: '移动端体验优化', code: 'mobile-experience', status: 'doing', type: 'sprint' },
]

const products = [
  { id: '1', program: '1000', name: '协作平台体验升级', code: 'collab', type: 'normal', status: 'normal', PO: 'boss' },
  { id: '2', program: '1000', name: '账号中心改版', code: 'account', type: 'normal', status: 'normal', PO: 'boss' },
  { id: '3', program: '1000', name: '工作台改版', code: 'workbench', type: 'normal', status: 'normal', PO: 'boss' },
  { id: '4', program: '1000', name: '移动端体验优化', code: 'mobile', type: 'normal', status: 'normal', PO: 'boss' },
]

const executions = [
  { id: '201', project: '1001', name: '协作平台体验升级 / 迭代一', code: 'collab-1', type: 'sprint', begin: '2026-10-01', end: '2026-10-15', status: 'doing', pri: '2' },
  { id: '202', project: '1002', name: '账号中心改版 / 迭代一', code: 'account-1', type: 'sprint', begin: '2026-10-01', end: '2026-10-15', status: 'doing', pri: '2' },
  { id: '203', project: '1003', name: '工作台改版 / 迭代一', code: 'workbench-1', type: 'sprint', begin: '2026-10-01', end: '2026-10-15', status: 'doing', pri: '2' },
  { id: '204', project: '1004', name: '移动端体验优化 / 迭代一', code: 'mobile-1', type: 'sprint', begin: '2026-10-01', end: '2026-10-15', status: 'doing', pri: '2' },
]

const tasks = [
  { id: '20416', project: '1001', execution: '201', name: '【协作平台】优化成员列表加载体验', type: 'devel', pri: '2', status: 'doing', assignedTo: 'frontend', assignedToRealName: '前端雨爸', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-08', estimate: '8', consumed: '3', left: '5', openedDate: '2026-09-29 09:20:00', assignedDate: '2026-09-29 09:20:00', lastEditedDate: '2026-10-02 10:24:00', delay: 0 },
  { id: '20412', project: '1002', execution: '202', name: '补充登录超时后的引导提示', type: 'devel', pri: '3', status: 'wait', assignedTo: 'amino', assignedToRealName: 'Eminoda', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-10', estimate: '5', consumed: '0', left: '5', openedDate: '2026-09-28 16:00:00', assignedDate: '2026-09-28 16:00:00', lastEditedDate: '2026-10-02 09:42:00', delay: 0 },
  { id: '20398', project: '1001', execution: '201', name: '梳理消息通知偏好设置交互', type: 'devel', pri: '2', status: 'doing', assignedTo: 'frontend', assignedToRealName: '前端雨爸', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-09-30', estimate: '6', consumed: '5', left: '1', openedDate: '2026-09-24 11:30:00', assignedDate: '2026-09-24 11:30:00', lastEditedDate: '2026-10-01 17:36:00', delay: 2 },
  { id: '20387', project: '1003', execution: '203', name: '整理新版导航栏验收清单', type: 'devel', pri: '3', status: 'done', assignedTo: 'amino', assignedToRealName: 'Eminoda', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-03', estimate: '3', consumed: '3', left: '0', openedDate: '2026-09-22 09:00:00', assignedDate: '2026-09-22 09:00:00', lastEditedDate: '2026-10-01 15:08:00', delay: 0 },
  { id: '20371', project: '1001', execution: '201', name: '增加搜索结果空状态说明', type: 'devel', pri: '4', status: 'wait', assignedTo: 'frontend', assignedToRealName: '前端雨爸', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-12', estimate: '4', consumed: '0', left: '4', openedDate: '2026-09-20 13:10:00', assignedDate: '2026-09-20 13:10:00', lastEditedDate: '2026-10-01 11:21:00', delay: 0 },
  { id: '20358', project: '1004', execution: '204', name: '处理移动端筛选区适配问题', type: 'devel', pri: '2', status: 'pause', assignedTo: 'amino', assignedToRealName: 'Eminoda', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-07', estimate: '5', consumed: '2', left: '3', openedDate: '2026-09-18 11:00:00', assignedDate: '2026-09-18 11:00:00', lastEditedDate: '2026-09-30 16:48:00', delay: 0 },
  { id: '20341', project: '1002', execution: '202', name: '更新项目成员权限说明', type: 'devel', pri: '3', status: 'doing', assignedTo: 'frontend', assignedToRealName: '前端雨爸', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-14', estimate: '4', consumed: '1', left: '3', openedDate: '2026-09-17 10:30:00', assignedDate: '2026-09-17 10:30:00', lastEditedDate: '2026-09-30 14:16:00', delay: 0 },
  { id: '20319', project: '1003', execution: '203', name: '补齐消息列表加载状态', type: 'devel', pri: '3', status: 'wait', assignedTo: 'amino', assignedToRealName: 'Eminoda', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-15', estimate: '4', consumed: '0', left: '4', openedDate: '2026-09-15 09:00:00', assignedDate: '2026-09-15 09:00:00', lastEditedDate: '2026-09-29 18:02:00', delay: 0 },
  { id: '20296', project: '1002', execution: '202', name: '验证新版登录流程兼容性', type: 'devel', pri: '2', status: 'doing', assignedTo: 'frontend', assignedToRealName: '前端雨爸', openedBy: 'boss', openedByRealName: '老板', deadline: '2026-10-09', estimate: '6', consumed: '3', left: '3', openedDate: '2026-09-12 15:20:00', assignedDate: '2026-09-12 15:20:00', lastEditedDate: '2026-09-29 11:37:00', delay: 0 },
]

const bugs = [
  { id: '11936', project: '1002', product: '2', execution: '202', module: '320', title: '项目切换下拉框缺少可访问名称', severity: '3', pri: '3', type: 'codeerror', status: 'active', confirmed: '0', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-04 00:38:00', openedBuild: 'trunk', assignedTo: 'frontend', assignedToRealName: '前端雨爸', assignedDate: '2026-10-04 00:38:00', deadline: '2026-10-08', steps: '[步骤]\n1. 打开登录页，使用键盘聚焦项目切换下拉框。\n2. 使用读屏器读取该控件的名称。\n\n[结果]\n下拉框没有说明其用途的可访问名称。\n\n[期望]\n读屏器能够识别该控件为“切换项目”。', result: '下拉框没有说明其用途的可访问名称。', lastEditedDate: '2026-10-04 00:38:00', activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '' },
  { id: '11935', project: '1002', product: '2', execution: '202', module: '320', title: '登录页点击返回按钮无响应', severity: '3', pri: '2', type: 'codeerror', status: 'active', confirmed: '0', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-04 00:35:00', openedBuild: 'trunk', assignedTo: 'frontend', assignedToRealName: '前端雨爸', assignedDate: '2026-10-04 00:35:00', deadline: '2026-10-07', steps: '[步骤]\n1. 打开登录页。\n2. 点击“返回”按钮。\n\n[结果]\n页面没有响应，仍停留在当前登录页。\n\n[期望]\n点击后返回上一页；没有可返回页面时给出明确反馈。', result: '页面没有响应，仍停留在当前登录页。', lastEditedDate: '2026-10-04 00:35:00', activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '' },
  { id: '11934', project: '1001', product: '1', execution: '201', module: '310', title: '筛选条件清空后列表未刷新', severity: '3', pri: '2', type: 'codeerror', status: 'active', confirmed: '0', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-02 10:48:00', openedBuild: '主干', assignedTo: 'amino', assignedToRealName: 'Eminoda', assignedDate: '2026-10-02 11:06:00', deadline: '2026-10-06', steps: '[步骤]\n1. 打开任务列表并设置一个状态筛选\n2. 点击“清空条件”\n3. 观察列表内容与筛选栏\n\n[结果]\n筛选栏已清空，但列表仍显示上一次筛选的结果。\n\n[期望]\n清空筛选条件后，列表应恢复显示当前项目下的全部任务。', result: '筛选栏已清空，但列表仍显示上一次筛选的结果。', lastEditedDate: '2026-10-02 11:06:00', activatedCount: '1', activatedDate: '2026-10-02 11:06:00', repo: '', mr: '', entry: '', lines: '' },
  { id: '11931', project: '1002', product: '2', execution: '202', module: '320', title: '登录超时后返回按钮状态异常', severity: '2', pri: '1', type: 'codeerror', status: 'active', confirmed: '0', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-02 09:51:00', openedBuild: '主干', assignedTo: 'frontend', assignedToRealName: '前端雨爸', assignedDate: '2026-10-02 09:51:00', deadline: '2026-10-05', steps: '[步骤]\n登录超时后点击返回按钮。\n\n[结果]\n按钮状态没有恢复。\n\n[期望]\n返回后按钮应恢复可用状态。', result: '按钮状态没有恢复。', lastEditedDate: '2026-10-02 09:51:00', activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '' },
  { id: '11928', project: '1001', product: '1', execution: '201', module: '311', title: '成员搜索输入较快时结果闪动', severity: '3', pri: '3', type: 'codeerror', status: 'active', confirmed: '1', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-01 18:20:00', openedBuild: '主干', assignedTo: 'amino', assignedToRealName: 'Eminoda', assignedDate: '2026-10-01 18:20:00', deadline: '2026-10-07', steps: '[步骤]\n在成员页面快速输入搜索词。\n\n[结果]\n搜索结果短暂闪动。\n\n[期望]\n搜索结果应平稳更新。', result: '搜索结果短暂闪动。', lastEditedDate: '2026-10-01 18:20:00', activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '' },
  { id: '11924', project: '1004', product: '4', execution: '204', module: '330', title: '窄屏下弹窗底部按钮被遮挡', severity: '2', pri: '2', type: 'codeerror', status: 'resolved', confirmed: '1', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-01 16:43:00', openedBuild: '主干', assignedTo: 'frontend', assignedToRealName: '前端雨爸', assignedDate: '2026-10-01 16:43:00', deadline: '2026-10-06', steps: '[步骤]\n在窄屏设备打开编辑弹窗。\n\n[结果]\n弹窗底部按钮被遮挡。\n\n[期望]\n底部按钮始终可见。', result: '弹窗底部按钮被遮挡。', lastEditedDate: '2026-10-01 16:43:00', activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '' },
  { id: '11917', project: '1001', product: '1', execution: '201', module: '312', title: '通知偏好设置保存后提示不明显', severity: '3', pri: '3', type: 'codeerror', status: 'active', confirmed: '1', openedBy: 'boss', openedByRealName: '老板', openedDate: '2026-10-01 15:22:00', openedBuild: '主干', assignedTo: 'amino', assignedToRealName: 'Eminoda', assignedDate: '2026-10-01 15:22:00', deadline: '2026-10-08', steps: '[步骤]\n修改通知偏好并保存。\n\n[结果]\n成功提示不明显。\n\n[期望]\n保存完成后应显示明确提示。', result: '成功提示不明显。', lastEditedDate: '2026-10-01 15:22:00', activatedCount: '0', activatedDate: '', repo: '', mr: '', entry: '', lines: '' },
  {
    id: '11911', project: '1003', product: '3', execution: '203', module: '340',
    title: '切换项目后面包屑显示旧名称', severity: '2', pri: '2', type: 'codeerror',
    status: 'resolved', resolution: 'fixed', resolvedBuild: 'trunk', resolvedBy: 'frontend',
    resolvedDate: '2026-10-03', confirmed: '0', openedBy: 'boss', openedByRealName: '老板',
    openedDate: '2026-10-01 13:12:00', openedBuild: '主干', assignedTo: 'frontend',
    assignedToRealName: '前端雨爸', assignedDate: '2026-10-01 13:12:00', deadline: '2026-10-09',
    steps: '[步骤]\n切换到另一个项目。\n\n[结果]\n面包屑仍显示之前的项目名称。\n\n[期望]\n面包屑应显示当前项目名称。',
    result: '面包屑仍显示之前的项目名称。', lastEditedBy: 'frontend',
    lastEditedDate: '2026-10-03 23:30:23', activatedCount: '0', activatedDate: '',
    repo: '', mr: '', entry: '', lines: '',
  },
]

const bugHistory = {
  '11911': [{
    id: '11911-resolved-20261003',
    action: 'resolve',
    actor: 'frontend',
    date: '2026-10-03 23:30:23',
    comment: `修复 Bug 11911
分支：master

相关提交：
- 8398915 fix: 项目名称未显示（eminoda，2026-10-03 23:23:55 +0800）
- ec65ead fix: 返回功能（eminoda，2026-10-03 23:20:41 +0800）

包含尚未提交的工作区或暂存区改动。

修改文件：
- Login.vue (+52/-23)

修改点：
- Login.vue`,
  }],
}

const stories = [
  { id: '30101', product: '1', title: '协作平台支持按成员筛选', status: 'active', pri: '2', assignedTo: 'frontend', openedBy: 'boss', reviewer: ['frontend'], notReview: [], openedDate: '2026-09-20 10:00:00' },
  { id: '30102', product: '1', title: '任务列表增加批量操作', status: 'active', pri: '3', assignedTo: 'amino', openedBy: 'boss', reviewer: ['frontend'], notReview: [], openedDate: '2026-09-21 10:00:00' },
  { id: '30103', product: '2', title: '登录超时增加续期提示', status: 'active', pri: '2', assignedTo: 'frontend', openedBy: 'boss', reviewer: [], notReview: [], openedDate: '2026-09-22 10:00:00' },
  { id: '30104', product: '3', title: '工作台支持自定义卡片', status: 'draft', pri: '3', assignedTo: 'amino', openedBy: 'boss', reviewer: [], notReview: [], openedDate: '2026-09-23 10:00:00' },
]

const requirements = [
  { id: '40101', product: '1', title: '移动端协作消息提醒', status: 'reviewing', pri: '2', assignedTo: 'frontend', openedBy: 'boss', reviewer: ['frontend'], notReview: [], openedDate: '2026-09-25 10:00:00' },
]

const testcases = [
  { id: 'case_101', product: '1', project: '1001', execution: '201', title: '验证成员筛选结果正确', status: 'normal', pri: '2', openedBy: 'boss', openedDate: '2026-09-26 10:00:00' },
  { id: 'case_102', product: '1', project: '1001', execution: '201', title: '验证清空筛选后列表恢复', status: 'normal', pri: '2', openedBy: 'boss', openedDate: '2026-09-26 11:00:00' },
  { id: 'case_103', product: '2', project: '1002', execution: '202', title: '验证登录超时返回交互', status: 'normal', pri: '3', openedBy: 'boss', openedDate: '2026-09-27 11:00:00' },
]

export const mockData = { projects, products, executions, tasks, bugs, bugHistory, stories, requirements, testcases }
