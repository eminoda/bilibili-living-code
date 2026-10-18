<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft, CircleCheck, Clock, DataLine, Delete, Lock, Search, UserFilled, View } from '@element-plus/icons-vue'
import { AnimatePresence, motion, useAnimate } from 'motion-v'
import AnimateNumber from '@/components/admin/AnimateNumber.vue'
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: '正常' | '待审核' | '停用'
  initials: string
  color: string
  lastActive: string
}

const seedUsers: User[] = [
  { id: 1, name: '林晓', email: 'lin.xiao@studio.cn', role: '管理员', department: '产品设计部', status: '正常', initials: '林', color: '#e97961', lastActive: '刚刚' },
  { id: 2, name: '陈默', email: 'chen.mo@studio.cn', role: '编辑', department: '研发中心', status: '正常', initials: '陈', color: '#5b82df', lastActive: '5 分钟前' },
  { id: 3, name: '周宁', email: 'zhou.ning@studio.cn', role: '管理员', department: '项目管理部', status: '待审核', initials: '周', color: '#35a884', lastActive: '今天 10:24' },
  { id: 4, name: '许安', email: 'xu.an@studio.cn', role: '访客', department: '市场部', status: '正常', initials: '许', color: '#d39a3f', lastActive: '今天 09:18' },
  { id: 5, name: '唐可', email: 'tang.ke@studio.cn', role: '编辑', department: '内容运营部', status: '停用', initials: '唐', color: '#a36bd0', lastActive: '昨天 18:42' },
  { id: 6, name: '顾言', email: 'gu.yan@studio.cn', role: '编辑', department: '研发中心', status: '正常', initials: '顾', color: '#4899a9', lastActive: '昨天 16:03' },
]

const motionEnabled = ref(false)
const loggedIn = ref(false)
const [tableMotionScope, animateTable] = useAnimate<HTMLElement>()
const tableShellComponent = computed(() => motionEnabled.value ? motion.div : 'div')
const tableShellProps = computed(() => motionEnabled.value
  ? {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { type: 'spring', stiffness: 300, damping: 28 },
    }
  : {})
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({ account: 'admin@motion.dev', password: 'motion123' })
const loginRules: FormRules = {
  account: [{ required: true, message: '请输入邮箱或账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}
const loginLoading = ref(false)
let loginTimer: ReturnType<typeof setTimeout> | undefined
const users = ref<User[]>(seedUsers.map(user => ({ ...user })))
const searchText = ref('')
const page = ref(1)
const selectedUser = ref<User | null>(null)
const pendingDeleteUser = ref<User | null>(null)
const confirmedDeleteId = ref<number | null>(null)
const pageSize = 5
const filteredUsers = computed(() => {
  const query = searchText.value.trim().toLowerCase()
  if (!query) return users.value
  return users.value.filter(user => `${user.name} ${user.email} ${user.role} ${user.department}`.toLowerCase().includes(query))
})
const pagedUsers = computed(() => filteredUsers.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const motionUsers = computed(() => pagedUsers.value.filter(user => selectedUser.value?.id !== user.id))
const tableUsers = computed(() => motionEnabled.value ? motionUsers.value : pagedUsers.value)
const visibleTableUserIds = computed(() => tableUsers.value.map(user => user.id))
const dashboardMetrics = computed(() => [
  { label: '团队成员', value: users.value.length, unit: '位', icon: UserFilled, tone: 'purple' },
  { label: '正常账号', value: users.value.filter(user => user.status === '正常').length, unit: '个', icon: CircleCheck, tone: 'green' },
  { label: '待审核', value: users.value.filter(user => user.status === '待审核').length, unit: '个', icon: Clock, tone: 'orange' },
  { label: '本周活跃', value: 5, unit: '位', icon: DataLine, tone: 'blue' },
])

const activeMenu = ref('用户管理')
const plainDetailOpen = ref(false)

function tableRowClassName({ row }: { row: User }) {
  return `member-row-${row.id}`
}

function getTableRows() {
  return Array.from(tableMotionScope.value?.querySelectorAll<HTMLElement>('.el-table__body-wrapper tbody tr') ?? [])
}

function getTableRowId(element: HTMLElement) {
  for (const className of element.classList) {
    const match = /^member-row-(\d+)$/.exec(className)
    if (match) return Number(match[1])
  }
  return undefined
}

watch([motionEnabled, loggedIn, visibleTableUserIds], async ([enabled, isLoggedIn], [previousEnabled, previousLoggedIn, previousIds]) => {
  if (!enabled || !isLoggedIn) return
  await nextTick()
  const previous = new Set(previousEnabled && previousLoggedIn ? previousIds : [])
  getTableRows().forEach((row, index) => {
    const id = getTableRowId(row)
    if (id === undefined || previous.has(id)) return
    animateTable(row, { opacity: [0, 1], y: [12, 0] }, { duration: 0.24, delay: index * 0.045 })
  })
}, { flush: 'post' })

watch(motionEnabled, () => {
  plainDetailOpen.value = false
  selectedUser.value = null
})

async function submitLogin() {
  if (loginLoading.value) return
  try {
    await loginFormRef.value?.validate()
  } catch {
    return
  }
  loginLoading.value = true
  clearTimeout(loginTimer)
  loginTimer = setTimeout(() => {
    loginLoading.value = false
    if (loginForm.account.trim() !== 'admin@motion.dev' || loginForm.password !== 'motion123') {
      ElMessage.error('账号或密码不正确，请使用页面上的演示账号')
      return
    }
    loggedIn.value = true
    ElMessage.success('登录成功，欢迎进入工作台')
  }, 750)
}

async function removeUser(id: number) {
  const rows = motionEnabled.value ? getTableRows() : []
  const rowPositions = new Map<number, number>()
  const exitingRow = rows.find(row => getTableRowId(row) === id)

  if (exitingRow) {
    for (const row of rows) {
      const rowId = getTableRowId(row)
      if (rowId !== undefined && row !== exitingRow) rowPositions.set(rowId, row.getBoundingClientRect().top)
    }
    await animateTable(exitingRow, { opacity: [1, 0], x: [0, 30], scale: [1, 0.98] }, { duration: 0.22, ease: 'easeIn' }).finished.catch(() => {})
  }

  users.value = users.value.filter(user => user.id !== id)
  if (page.value > Math.max(1, Math.ceil(filteredUsers.value.length / pageSize))) {
    page.value = Math.max(1, Math.ceil(filteredUsers.value.length / pageSize))
  }
  if (rowPositions.size) {
    await nextTick()
    for (const row of getTableRows()) {
      const rowId = getTableRowId(row)
      const previousTop = rowId === undefined ? undefined : rowPositions.get(rowId)
      if (previousTop === undefined) continue
      const offset = previousTop - row.getBoundingClientRect().top
      if (Math.abs(offset) > 1) animateTable(row, { y: [offset, 0] }, { type: 'spring', stiffness: 430, damping: 35 })
    }
  }
  ElMessage.success('用户已从当前演示列表移除')
}

function requestDelete(user: User) {
  confirmedDeleteId.value = null
  pendingDeleteUser.value = user
}

function confirmDelete() {
  if (!pendingDeleteUser.value) return
  confirmedDeleteId.value = pendingDeleteUser.value.id
  pendingDeleteUser.value = null
}

function finishDeleteDialog() {
  if (confirmedDeleteId.value !== null) void removeUser(confirmedDeleteId.value)
  confirmedDeleteId.value = null
}

function resetUsers() {
  users.value = seedUsers.map(user => ({ ...user }))
  searchText.value = ''
  page.value = 1
}

function openDetails(user: User) {
  selectedUser.value = user
  if (!motionEnabled.value) plainDetailOpen.value = true
}

function closeDetails() {
  plainDetailOpen.value = false
  selectedUser.value = null
}

function returnToLogin() {
  loggedIn.value = false
  plainDetailOpen.value = false
  selectedUser.value = null
  pendingDeleteUser.value = null
  confirmedDeleteId.value = null
  loginLoading.value = false
  clearTimeout(loginTimer)
}

onBeforeUnmount(() => clearTimeout(loginTimer))
</script>

<template>
  <main class="admin-page" :class="{ 'admin-page--motion': motionEnabled }">
    <div class="admin-shell">
      <header class="admin-topbar">
        <div class="mode-control" aria-label="动画实现方式">
          <span :class="{ 'mode-label--active': !motionEnabled }">普通 Element Plus</span>
          <el-switch v-model="motionEnabled" aria-label="切换 Motion 动效" />
          <span :class="{ 'mode-label--active': motionEnabled }">Motion 增强</span>
        </div>
      </header>

      <section v-if="!loggedIn" class="login-stage">
        <div class="login-context">
          <span class="context-kicker">SECURE WORKSPACE</span>
          <h1>欢迎来体验<br><em>Motion-v</em></h1>
        </div>
        <el-card class="login-card" shadow="never">
          <div class="login-card-heading"><span class="login-icon"><el-icon><Lock /></el-icon></span><div><h2>登录账号</h2></div></div>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top" @submit.prevent="submitLogin">
            <el-form-item label="邮箱或账号" prop="account">
              <el-input v-model="loginForm.account" size="large" autocomplete="username" placeholder="name@company.com" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" size="large" type="password" show-password autocomplete="current-password" placeholder="请输入密码" @keyup.enter="submitLogin" />
            </el-form-item>
            <div class="login-options"><el-checkbox>记住我</el-checkbox><a href="#help" @click.prevent="ElMessage('这是一个本地交互演示')">忘记密码？</a></div>
            <motion.div
              v-if="motionEnabled"
              class="login-motion-button"
              :while-hover="{ y: -2, scale: 1.005, boxShadow: '0 4px 12px rgba(64, 158, 255, 0.18)' }"
              :while-press="{ y: 0, scale: 0.985, boxShadow: '0 1px 4px rgba(64, 158, 255, 0.12)' }"
              :transition="{ type: 'spring', stiffness: 400, damping: 30, mass: 0.7 }"
            >
              <el-button class="login-submit" type="primary" native-type="submit" :loading="loginLoading">{{ loginLoading ? '正在验证' : '登录工作台' }}</el-button>
            </motion.div>
            <el-button v-else class="login-submit" type="primary" native-type="submit" :loading="loginLoading">{{ loginLoading ? '正在验证' : '登录工作台' }}</el-button>
          </el-form>
        </el-card>
      </section>

      <section v-else class="workspace">
        <div class="workspace-heading">
          <div class="heading-main"><div><div class="breadcrumb">工作台 <span>/</span> {{ activeMenu }}</div><h1>{{ activeMenu }}</h1></div></div>
          <el-button class="back-login-button" plain @click="returnToLogin"><el-icon><ArrowLeft /></el-icon>返回登录页</el-button>
        </div>

        <div class="metric-grid">
          <template v-if="motionEnabled">
            <motion.div v-for="(metric, index) in dashboardMetrics" :key="metric.label" class="metric-motion-item" :initial="{ opacity: 0, y: 18, scale: 0.96 }" :animate="{ opacity: 1, y: 0, scale: 1 }" :transition="{ type: 'spring', stiffness: 280, damping: 23, delay: index * 0.09 }" :while-hover="{ y: -5, scale: 1.018 }">
              <el-card class="metric-card" shadow="never"><div class="metric-top"><div class="metric-label">{{ metric.label }}</div><span class="metric-icon" :class="`metric-icon--${metric.tone}`"><el-icon><component :is="metric.icon" /></el-icon></span></div><div class="metric-value"><AnimateNumber :value="metric.value" /><small>{{ metric.unit }}</small></div></el-card>
            </motion.div>
          </template>
          <div v-else v-for="metric in dashboardMetrics" :key="metric.label" class="metric-motion-item">
            <el-card class="metric-card" shadow="never"><div class="metric-top"><div class="metric-label">{{ metric.label }}</div><span class="metric-icon" :class="`metric-icon--${metric.tone}`"><el-icon><component :is="metric.icon" /></el-icon></span></div><div class="metric-value"><span>{{ metric.value }}</span><small>{{ metric.unit }}</small></div></el-card>
          </div>
        </div>

        <component :is="tableShellComponent" ref="tableMotionScope" class="table-motion-shell" v-bind="tableShellProps">
          <el-card class="table-card" shadow="never">
            <div class="table-heading">
              <div><h2>成员列表</h2></div>
              <div class="table-actions"><el-input v-model="searchText" class="search-input" clearable placeholder="搜索姓名、邮箱或部门"><template #prefix><el-icon><Search /></el-icon></template></el-input><el-button plain @click="resetUsers">重置列表</el-button></div>
            </div>
            <div class="table-scroll">
              <el-table :data="tableUsers" row-key="id" class="user-table" :row-class-name="tableRowClassName">
                <el-table-column label="成员" min-width="210">
                  <template #default="{ row }">
                    <div class="member-cell">
                      <motion.span v-if="motionEnabled" class="member-avatar" :layout-id="`member-avatar-${row.id}`" :style="{ background: row.color }">{{ row.initials }}</motion.span>
                      <span v-else class="member-avatar" :style="{ background: row.color }">{{ row.initials }}</span>
                      <span><b>{{ row.name }}</b><small>{{ row.email }}</small></span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="role" label="角色" width="100"><template #default="{ row }"><span class="role-pill">{{ row.role }}</span></template></el-table-column>
                <el-table-column prop="department" label="部门" min-width="130" />
                <el-table-column label="状态" width="100">
                  <template #default="{ row }"><el-tag size="small" effect="light" :type="row.status === '正常' ? 'success' : row.status === '待审核' ? 'warning' : 'info'"><i class="status-dot" />{{ row.status }}</el-tag></template>
                </el-table-column>
                <el-table-column prop="lastActive" label="最近活跃" min-width="110" />
                <el-table-column label="操作" width="150" align="right">
                  <template #default="{ row }">
                    <div class="row-actions">
                      <el-button link type="primary" @click="openDetails(row)"><el-icon><View /></el-icon>详情</el-button>
                      <motion.div v-if="motionEnabled" class="delete-motion-action" :while-hover="{ scale: 1.08 }" :while-press="{ scale: 0.9 }" :transition="{ type: 'spring', stiffness: 520, damping: 25 }"><el-button link type="danger" @click="requestDelete(row)"><el-icon><Delete /></el-icon>删除</el-button></motion.div>
                      <el-button v-else link type="danger" @click="requestDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
                    </div>
                  </template>
                </el-table-column>
                <template #empty><div class="empty-cell">没有找到匹配的成员</div></template>
              </el-table>
            </div>
            <div class="table-footer"><span>共 {{ filteredUsers.length }} 位成员</span><el-pagination v-model:current-page="page" :page-size="pageSize" :total="filteredUsers.length" layout="prev, pager, next" small /></div>
          </el-card>
        </component>
      </section>
    </div>

    <DeleteConfirmDialog
      :open="pendingDeleteUser !== null"
      :member-name="pendingDeleteUser?.name ?? ''"
      :animated="motionEnabled"
      @cancel="pendingDeleteUser = null"
      @confirm="confirmDelete"
      @closed="finishDeleteDialog"
    />

    <el-dialog v-if="!motionEnabled" v-model="plainDetailOpen" title="成员详情" width="430px" @closed="selectedUser = null">
      <div v-if="selectedUser" class="plain-detail-body">
        <el-avatar :size="58" :style="{ background: selectedUser.color }">{{ selectedUser.initials }}</el-avatar><h3>{{ selectedUser.name }}</h3><p>{{ selectedUser.role }} · {{ selectedUser.department }}</p>
        <el-descriptions :column="1" border><el-descriptions-item label="邮箱">{{ selectedUser.email }}</el-descriptions-item><el-descriptions-item label="账号状态">{{ selectedUser.status }}</el-descriptions-item><el-descriptions-item label="最近活跃">{{ selectedUser.lastActive }}</el-descriptions-item></el-descriptions>
      </div>
      <template #footer><el-button @click="closeDetails">关闭</el-button></template>
    </el-dialog>

    <AnimatePresence v-if="motionEnabled">
      <motion.div v-if="motionEnabled && selectedUser" class="detail-backdrop" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" @click.self="closeDetails">
        <motion.article class="motion-detail-card" :initial="{ opacity: 0, y: 16, scale: 0.97 }" :animate="{ opacity: 1, y: 0, scale: 1 }" :exit="{ opacity: 0, y: 10, scale: 0.98 }" :layout-id="`member-detail-${selectedUser.id}`" :transition="{ type: 'spring', stiffness: 360, damping: 32 }">
          <div class="detail-card-top"><span>成员档案</span><el-button text circle aria-label="关闭详情" @click="closeDetails"><el-icon><Close /></el-icon></el-button></div>
          <motion.div class="motion-detail-profile" :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :transition="{ type: 'spring', stiffness: 380, damping: 28, delay: 0.08 }"><motion.span class="member-avatar member-avatar--large" :layout-id="`member-avatar-${selectedUser.id}`" :style="{ background: selectedUser.color }">{{ selectedUser.initials }}</motion.span><h2>{{ selectedUser.name }}</h2><p>{{ selectedUser.role }} · {{ selectedUser.department }}</p></motion.div>
          <motion.div class="detail-info-list" :initial="{ opacity: 0, y: 8 }" :animate="{ opacity: 1, y: 0 }" :transition="{ type: 'spring', stiffness: 360, damping: 28, delay: 0.15 }"><div><span>邮箱</span><b>{{ selectedUser.email }}</b></div><div><span>账号状态</span><el-tag size="small" :type="selectedUser.status === '正常' ? 'success' : selectedUser.status === '待审核' ? 'warning' : 'info'">{{ selectedUser.status }}</el-tag></div><div><span>最近活跃</span><b>{{ selectedUser.lastActive }}</b></div></motion.div>
          <el-button class="detail-done" type="primary" @click="closeDetails">完成</el-button>
        </motion.article>
      </motion.div>
    </AnimatePresence>
  </main>
</template>

<style>
.admin-page { min-height: calc(100vh - 62px); padding: 0 32px 50px; background: #f5f6fa; color: #273244; --accent: #409eff; --el-color-primary: #409eff; --el-color-primary-light-3: #79bbff; --el-color-primary-light-5: #a0cfff; --el-color-primary-light-7: #c6e2ff; --el-color-primary-light-8: #d9ecff; --el-color-primary-light-9: #ecf5ff; --el-color-primary-dark-2: #337ecc; }
.admin-shell { width: min(100%, 1280px); margin: 0 auto; }
.admin-topbar { display: flex; height: 76px; align-items: center; justify-content: space-between; border-bottom: 1px solid #e3e7ef; }
.topbar-title,.mode-control { display: flex; align-items: center; }
.mode-control { gap: 11px; margin-left: auto; padding: 8px 12px; border: 1px solid #e0e4eb; border-radius: 9px; background: #fff; color: #8993a2; font-size: 11px; }
.mode-control .mode-label--active { color: #409eff; font-weight: 650; }
.mode-control .el-switch.is-checked .el-switch__core { border-color: #409eff; background: #409eff; }
.login-stage { display: grid; min-height: min(700px, calc(100vh - 140px)); grid-template-columns: minmax(0, 1.05fr) minmax(350px, .8fr); align-items: center; gap: 8vw; padding: 45px 8%; }
.login-context { max-width: 510px; }.context-kicker { color: #409eff; font: 10px 'DM Mono', monospace; letter-spacing: .13em; }
.login-context h1 { margin: 18px 0 14px; color: #222b3a; font-size: clamp(38px, 5vw, 60px); letter-spacing: -.06em; line-height: 1.14; }.login-context h1 em { color: #409eff; font-style: normal; }
.login-context > p { max-width: 420px; color: #778294; font-size: 14px; line-height: 1.85; }.context-points { display: grid; gap: 12px; margin-top: 28px; color: #697587; font-size: 12px; }.context-points i { display: inline-grid; width: 18px; height: 18px; place-items: center; margin-right: 7px; border-radius: 50%; background: #ecf5ff; color: #409eff; font-size: 11px; font-style: normal; }
.login-card { width: min(100%, 420px); justify-self: end; border-color: #e5e8ef; border-radius: 16px; box-shadow: 0 20px 60px rgb(40 50 71 / 7%); }.login-card .el-card__body { padding: 30px; }.login-card-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }.login-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 12px; background: #ecf5ff; color: #409eff; font-size: 22px; }.login-card-heading h2 { margin: 0; color: #293244; font-size: 19px; }.login-card-heading p { margin: 5px 0 0; color: #8a94a3; font-size: 11px; }
.login-card .el-form-item { margin-bottom: 17px; }.login-card .el-form-item__label { height: auto; padding-bottom: 6px; color: #576375; font-size: 11px; }.login-card .el-input__wrapper { box-shadow: 0 0 0 1px #e1e5ed inset; }.login-card .el-input__wrapper.is-focus { box-shadow: 0 0 0 1px #79bbff inset; }.login-options { display: flex; justify-content: space-between; margin: 0 0 18px; color: #758093; font-size: 11px; }.login-options a { color: #409eff; text-decoration: none; }.login-motion-button,.login-submit { width: 100%; }.login-motion-button { border-radius: 8px; transform-origin: center; }.login-submit { height: 42px; border-color: #409eff; background: #409eff; font-size: 12px; }.login-submit:hover { border-color: #337ecc; background: #337ecc; }.admin-page--motion .login-submit { border-color: #409eff; background: #409eff; }
.demo-account { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #edf0f4; color: #929bab; font-size: 10px; }.demo-account code { padding: 4px 6px; border-radius: 5px; background: #f4f5f8; color: #667286; font: 10px 'DM Mono', monospace; }
.workspace { padding-top: 33px; }.workspace-heading { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 22px; }.heading-main { display: flex; align-items: flex-start; gap: 18px; }.back-login-button { flex: 0 0 auto; border-color: #d6e7f8; color: #337ecc; }.back-login-button:hover { border-color: #a0cfff; background: #ecf5ff; color: #337ecc; }.breadcrumb { margin: 2px 0 8px; color: #9099a8; font-size: 10px; }.breadcrumb span { margin: 0 5px; color: #c1c7d0; }.workspace-heading h1 { margin: 0; color: #252e3d; font-size: 25px; letter-spacing: -.04em; }.workspace-heading p { margin: 6px 0 0; color: #838d9d; font-size: 11px; }
.metric-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin-bottom: 18px; }.metric-motion-item { min-width: 0; transform-origin: center; }.metric-card { min-width: 0; min-height: 160px; box-sizing: border-box; overflow: hidden; border-color: #e5e8ef; border-radius: 11px; transition: border-color .2s, box-shadow .2s; }.metric-card .el-card__body { display: flex; min-height: 160px; box-sizing: border-box; flex-direction: column; overflow: hidden; padding: 18px 20px; }.admin-page--motion .metric-motion-item:hover .metric-card { border-color: #c6e2ff; box-shadow: 0 12px 26px rgb(64 158 255 / 11%); }.metric-top { display: flex; min-height: 54px; align-items: flex-start; justify-content: space-between; gap: 12px; }.metric-label { padding-top: 7px; color: #657184; font-size: 16px; font-weight: 650; }.metric-value { display: flex; min-height: 72px; flex: 1; align-items: center; justify-content: center; overflow: hidden; color: #252f3f; font-size: 44px; font-weight: 750; letter-spacing: -.05em; line-height: 1; font-variant-numeric: tabular-nums; }.metric-value small { align-self: center; margin: 8px 0 0 7px; color: #818b9a; font-size: 15px; font-weight: 450; letter-spacing: 0; }.metric-icon { display: grid; width: 52px; height: 52px; flex: 0 0 auto; place-items: center; border-radius: 14px; font-size: 25px; }.metric-icon--purple { background: #ecf5ff; color: #409eff; }.metric-icon--green { background: #e6f6ef; color: #3b9e79; }.metric-icon--orange { background: #fff4e5; color: #cf913a; }.metric-icon--blue { background: #e8f3fc; color: #4b89b7; }
.table-card { overflow: hidden; border-color: #e3e7ee; border-radius: 12px; }.table-card .el-card__body { overflow: hidden; padding: 0; }.table-heading { display: flex; min-height: 76px; align-items: center; justify-content: space-between; gap: 16px; padding: 15px 20px; border-bottom: 1px solid #edf0f4; }.table-heading h2 { margin: 0; color: #2d3748; font-size: 14px; }.table-heading p { margin: 5px 0 0; color: #9099a8; font-size: 10px; }.table-actions { display: flex; align-items: center; gap: 9px; }.search-input { width: 235px; }.search-input .el-input__wrapper { box-shadow: 0 0 0 1px #e4e8ef inset; }.search-input .el-input__prefix .el-icon { color: #8993a3; font-size: 15px; }.table-scroll { position: relative; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; }.table-scroll::-webkit-scrollbar { display: none; }.user-table { width: 100%; border-collapse: collapse; color: #677386; font-size: 11px; text-align: left; }.user-table th { height: 41px; padding: 0 17px; background: #fafbfc; color: #8b95a3; font-size: 10px; font-weight: 550; white-space: nowrap; }.user-table td { height: 64px; padding: 7px 17px; border-top: 1px solid #eff1f5; white-space: nowrap; }.user-table tbody tr { background: #fff; }.user-table tbody tr:hover { background: #fbfbff; }.user-table .action-column { text-align: right; padding-right: 24px; }.member-cell { display: flex; min-width: 160px; align-items: center; gap: 10px; }.member-cell > span:last-child b,.member-cell small { display: block; }.member-cell b { color: #354052; font-size: 11px; font-weight: 600; }.member-cell small { margin-top: 4px; color: #929baa; font-size: 9px; }.member-avatar { display: inline-grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; border-radius: 10px; color: #fff; font-size: 12px; font-weight: 700; }.member-avatar--large { width: 58px; height: 58px; border-radius: 17px; font-size: 19px; }.role-pill { display: inline-flex; padding: 4px 8px; border: 1px solid #e8eaf0; border-radius: 20px; background: #fafbfc; color: #697587; font-size: 9px; }.user-table .el-tag { border: 0; border-radius: 20px; }.user-table .el-tag--success { background: #eaf7f0; color: #378866; }.user-table .el-tag--warning { background: #fff4e3; color: #b77c27; }.user-table .el-tag--info { background: #f0f1f4; color: #7d8796; }.status-dot { display: inline-block; width: 5px; height: 5px; margin-right: 5px; border-radius: 50%; background: currentColor; vertical-align: 1px; }.last-active { color: #8b95a4; font-size: 10px; }.row-actions { display: flex; align-items: center; justify-content: flex-end; gap: 5px; white-space: nowrap; }.row-actions .el-button { padding: 5px 6px; font-size: 11px; }.row-actions .el-button .el-icon { margin-right: 3px; font-size: 13px; }.empty-cell { height: 110px !important; color: #9aa3b0; text-align: center; }.table-footer { display: flex; min-height: 54px; align-items: center; justify-content: space-between; padding: 0 20px; border-top: 1px solid #edf0f4; color: #929baa; font-size: 10px; }.table-footer .el-pagination { --el-pagination-button-bg-color: #fff; --el-pagination-hover-color: #409eff; }.workspace-hint { display: flex; align-items: center; gap: 7px; margin: 14px 0 0; color: #919aaa; font-size: 10px; }.hint-dot { width: 6px; height: 6px; border-radius: 50%; background: #57a485; }
.table-motion-shell { min-width: 0; }.user-table { --el-table-border-color: #eff1f5; --el-table-header-bg-color: #fafbfc; --el-table-row-hover-bg-color: #fbfbff; --el-table-text-color: #677386; --el-table-header-text-color: #8b95a3; font-size: 11px; }.user-table::before,.user-table .el-table__inner-wrapper::before { display: none; }.user-table th.el-table__cell { height: 41px; padding: 0; background: #fafbfc; font-size: 10px; font-weight: 550; white-space: nowrap; }.user-table td.el-table__cell { height: 78px; padding: 0; border-bottom-color: #eff1f5; white-space: nowrap; }.user-table .cell { padding: 0 17px; line-height: normal; }.user-table .el-table__header-wrapper .cell { color: #8b95a3; }.user-table .el-scrollbar__bar { display: none !important; }.user-table .el-table__body tr { background: #fff; }
.plain-nav-drawer .el-menu { border: 0; }.plain-nav-drawer .el-menu-item { height: 44px; border-radius: 8px; color: #626e80; font-size: 12px; }.plain-nav-drawer .el-menu-item.is-active { background: #ecf5ff; color: #409eff; }.nav-icon { display: inline-grid; width: 22px; margin-right: 9px; place-items: center; color: #409eff; font-size: 15px; }.drawer-account { position: absolute; right: 20px; bottom: 22px; left: 20px; display: flex; align-items: center; gap: 9px; padding-top: 14px; border-top: 1px solid #eceef3; }.drawer-account b,.drawer-account small { display: block; }.drawer-account b { color: #3c4656; font-size: 11px; }.drawer-account small { margin-top: 4px; color: #929baa; font-size: 9px; }
.drawer-backdrop,.detail-backdrop { position: fixed; z-index: 100; inset: 0; display: flex; background: rgb(30 38 53 / 28%); backdrop-filter: blur(2px); }.motion-nav-drawer { position: relative; width: 270px; height: 100%; padding: 18px 16px; background: #fff; box-shadow: 16px 0 42px rgb(23 30 46 / 15%); }.drawer-heading { display: flex; align-items: center; justify-content: space-between; padding-bottom: 19px; border-bottom: 1px solid #edf0f4; }.drawer-brand { color: #30394a; font-size: 13px; font-weight: 700; }.drawer-section-label { margin: 20px 8px 9px; color: #9aa3b0; font: 9px 'DM Mono', monospace; letter-spacing: .06em; text-transform: uppercase; }.motion-nav-items { display: grid; gap: 5px; }.motion-nav-item { display: flex; width: 100%; height: 41px; justify-content: flex-start; border-color: transparent; color: #697587; font-size: 11px; }.motion-nav-item:hover,.motion-nav-item--active { border-color: #d9ecff; background: #ecf5ff; color: #409eff; }.motion-nav-item .nav-chevron { margin-left: auto; color: #a5adba; font-size: 17px; }.motion-nav-drawer .drawer-account { right: 16px; left: 16px; }
.detail-backdrop { z-index: 110; align-items: center; justify-content: center; padding: 20px; background: rgb(31 39 55 / 32%); }.motion-detail-card { width: min(100%, 430px); padding: 18px 22px 22px; border: 1px solid #c6e2ff; border-radius: 16px; background: #fff; box-shadow: 0 24px 70px rgb(26 34 50 / 21%); }.detail-card-top { display: flex; align-items: center; justify-content: space-between; color: #8993a2; font: 10px 'DM Mono', monospace; }.motion-detail-profile { display: grid; justify-items: center; padding: 8px 0 22px; }.motion-detail-profile h2 { margin: 11px 0 4px; color: #2c3545; font-size: 19px; }.motion-detail-profile p { margin: 0; color: #8590a0; font-size: 11px; }.detail-info-list { border: 1px solid #edf0f4; border-radius: 10px; }.detail-info-list > div { display: flex; min-height: 43px; align-items: center; justify-content: space-between; gap: 12px; padding: 0 12px; border-bottom: 1px solid #edf0f4; font-size: 10px; }.detail-info-list > div:last-child { border-bottom: 0; }.detail-info-list span { color: #929baa; }.detail-info-list b { color: #4b5668; font-weight: 550; }.detail-done { width: 100%; margin-top: 18px; border-color: #409eff; background: #409eff; }
.admin-page--motion .table-card { border-color: #c6e2ff; box-shadow: 0 10px 30px rgb(64 158 255 / 5%); }.admin-page--motion .user-table tbody tr { transform-origin: center; }
@media (max-width: 900px) { .admin-page { padding-right: 20px; padding-left: 20px; }.login-stage { gap: 5vw; padding-right: 2%; padding-left: 2%; }.metric-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }.table-heading { align-items: flex-start; flex-direction: column; }.table-actions { width: 100%; }.search-input { flex: 1; } }
@media (max-width: 620px) { .admin-page { padding: 0 13px 35px; }.admin-topbar { height: auto; min-height: 70px; flex-wrap: wrap; gap: 10px; padding: 12px 0; }.mode-control { order: 1; width: fit-content; justify-content: center; padding: 7px; font-size: 10px; }.login-stage { min-height: 0; grid-template-columns: 1fr; gap: 28px; padding: 45px 2% 20px; }.login-context h1 { font-size: 39px; }.login-context > p { font-size: 12px; }.login-card { justify-self: center; }.workspace { padding-top: 23px; }.workspace-heading { align-items: flex-start; gap: 10px; }.heading-main { gap: 9px; }.workspace-heading h1 { font-size: 21px; }.workspace-heading p { max-width: 235px; line-height: 1.6; }.metric-grid { gap: 8px; }.metric-card { min-height: 150px; }.metric-card .el-card__body { min-height: 150px; padding: 12px; }.metric-top { min-height: 44px; }.metric-label { padding-top: 5px; font-size: 13px; }.metric-icon { width: 42px; height: 42px; border-radius: 12px; font-size: 21px; }.metric-value { min-height: 62px; font-size: 34px; }.metric-value small { font-size: 12px; }.table-heading { padding: 14px; }.table-actions { align-items: stretch; }.search-input { min-width: 0; }.table-actions > .el-button { padding: 8px; }.user-table { min-width: 760px; }.table-footer { padding: 0 13px; }.table-footer .el-pagination button,.table-footer .el-pager li { min-width: 23px; }.mode-control .el-switch { --el-switch-on-color: #409eff; } }
</style>
