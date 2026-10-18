import { z } from 'zod'
import { getBugCommitContext } from '../getBugCommitContext.mjs'
import { getBugDetail } from '../getBugDetail.mjs'
import { getMyBugs } from '../getMyBugs.mjs'
import { getMyTasks } from '../getMyTasks.mjs'
import { getTaskDetail } from '../getTaskDetail.mjs'
import { fixBug } from '../fixBug.mjs'
import { runTool } from './result.mjs'

const resolutionSchema = z.enum([
  'fixed',
  'notrepro',
  'bydesign',
  'duplicate',
  'external',
  'postponed',
  'willnotfix',
  'tostory',
])

export const zentaoTools = [
  {
    name: 'get_my_bugs',
    title: '查询我的 Bug 列表',
    description: [
      '在用户询问「我的 Bug」「指派给我的缺陷」「当前账号待处理 Bug」时使用。',
      '返回当前登录 token 对应用户、在未关闭产品中、browseType=assigntome 的 Bug 列表（含 id、title、status、assignedTo、product、pri、severity、deadline、steps 等禅道字段），以及扫描到的 productCount。',
      '不能推断：其他人的 Bug、已关闭产品上的 Bug、代码根因、是否已在仓库里修好、空列表是否表示全局没有缺陷（也可能是权限不足或 token 不是预期账号）。不要根据标题编造复现步骤或严重程度。',
    ].join('\n'),
    inputSchema: z.object({}),
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async () => runTool(() => getMyBugs()),
  },
  {
    name: 'get_my_tasks',
    title: '查询我的任务列表',
    description: [
      '在用户询问「我的任务」「指派给我的任务」「当前要做的开发任务」时使用。',
      '返回当前登录 token 对应用户、在未完成执行中、status=assignedtome 的任务列表（含 id、name、status、assignedTo、execution、project、pri、deadline、estimate/consumed/left 等字段），以及扫描到的 executionCount。',
      '不能推断：其他人的任务、已关闭执行里的任务、剩余工时是否准确、任务是否真的做完。空列表不能当成「没有工作」，也可能是 token、权限或执行范围问题。不要把任务描述理解成已实现的代码。',
    ].join('\n'),
    inputSchema: z.object({}),
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async () => runTool(() => getMyTasks()),
  },
  {
    name: 'get_bug_detail',
    title: '查询 Bug 详情',
    description: [
      '在已经知道 Bug ID，需要复现步骤、当前状态、指派人、影响版本等完整字段时使用。先有 ID 再调本工具；不要用它替代 get_my_bugs。',
      '返回禅道 GET /bugs/:bugID 的 bug 对象，包括 title、steps、status、assignedTo、severity、pri、openedBuild、resolution 以及项目/执行名称、附件 files 等详情字段。',
      '不能推断：代码中哪一行导致问题、该如何修复、测试是否通过、该指派给谁（除非响应里已有 assignedTo）。steps 缺失时不要编造复现路径。本工具不会修改 Bug。',
    ].join('\n'),
    inputSchema: z.object({
      bug_id: z.string().min(1).describe('禅道 Bug 编号，例如 "11931"'),
    }),
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async ({ bug_id }) => runTool(() => getBugDetail({ bugId: bug_id })),
  },
  {
    name: 'get_task_detail',
    title: '查询任务详情',
    description: [
      '在已经知道任务 ID，需要名称、状态、截止日期、消耗工时等字段时使用。先有 ID 再调本工具；不要用它替代 get_my_tasks。',
      '返回 task 对象，以及 source：detail 表示来自 GET /tasks/:taskID；execution-list 表示官方详情接口只有 status、已从执行任务列表按 ID 补全。',
      '不能推断：官方详情页未提供的字段、任务是否真正完成、剩余工时是否可信、关联代码改动。找不到任务时不要编造任务内容。本工具不会修改任务状态。',
    ].join('\n'),
    inputSchema: z.object({
      task_id: z.string().min(1).describe('禅道任务编号，例如 "20416"'),
    }),
    annotations: { readOnlyHint: true, openWorldHint: true },
    handler: async ({ task_id }) => runTool(() => getTaskDetail({ taskId: task_id })),
  },
  {
    name: 'get_bug_commit_context',
    title: '从本地 git 解析本次修改说明',
    description: [
      '在准备调用 fix_bug、但还没有可用的 comment 时使用。读取本地 git 的近期提交、工作区/暂存区 diff，整理成可直接作为 fix_bug.comment 的修改说明。',
      '返回 gitRoot、branch、commits、files、changePoints、diff、comment。comment 只来自 git 输出（提交说明、变更文件、hunk 上下文），不要再加工成未出现在 git 里的业务结论。',
      '不能推断：代码是否已修好、测试是否通过、该不该解决 Bug。找不到仓库、没有提交或没有 diff 时，不要编造修改说明。本工具不会修改 git 或禅道状态。',
    ].join('\n'),
    inputSchema: z.object({
      bug_id: z.string().min(1).optional().describe('禅道 Bug 编号。若提交信息里包含该编号，会优先选用对应提交'),
      cwd: z.string().min(1).optional().describe('从该目录向上查找 git 仓库，默认当前工作目录或 ZENTAO_GIT_ROOT'),
    }),
    annotations: { readOnlyHint: true, openWorldHint: false },
    handler: async ({ bug_id, cwd }) => runTool(() => getBugCommitContext({ bugId: bug_id, cwd })),
  },
  {
    name: 'fix_bug',
    title: '解决 Bug',
    description: [
      '仅在用户明确要求把某个 Bug 标记为已解决/修复，并已给出 Bug ID 时使用。这是写操作，会改变禅道状态。不要在只是查看列表或讨论修复方案时调用。',
      '调用 PUT /bugs/:bugID/resolve。默认 resolution=fixed。comment 必填。若当前没有用户给出的备注，先调用 get_bug_commit_context，用其返回的 comment 作为本次修改说明后再调用本工具。成功只返回 status、bugId、resolution；禅道该接口本身不返回更新后的完整 Bug。需要最新状态请再调 get_bug_detail。',
      '不能推断：代码是否真的修好、测试是否通过、该用哪种 resolution、该指派给谁。用户已给出备注时优先用用户原文；否则只用 get_bug_commit_context 的 comment，不要自行编造。未提供的可选字段不要编造。本工具不会关闭 Bug（关闭是另一接口），也不会提交 Git 或改代码。',
    ].join('\n'),
    inputSchema: z.object({
      bug_id: z.string().min(1).describe('要解决的 Bug 编号'),
      resolution: resolutionSchema.optional().describe('解决方案，默认 fixed'),
      resolved_build: z.string().optional().describe('解决版本，主干可用 trunk'),
      assigned_to: z.string().optional().describe('解决后指派给的账号'),
      comment: z.string().min(1).describe('备注，必填。若当前没有值，先调用 get_bug_commit_context，用返回的 comment 作为本次修改说明；用户已明确给出备注时优先用用户原文，不要自行编造'),
      resolved_date: z.string().optional().describe('解决日期，格式 YYYY-MM-DD'),
    }),
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true,
    },
    handler: async ({ bug_id, resolution, resolved_build, assigned_to, comment, resolved_date }) => runTool(() => fixBug({
      bugId: bug_id,
      resolution,
      resolvedBuild: resolved_build,
      assignedTo: assigned_to,
      comment,
      resolvedDate: resolved_date,
    })),
  },
]
