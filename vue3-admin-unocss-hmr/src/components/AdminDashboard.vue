<script setup lang="ts">
import { computed, ref } from 'vue'

const tab = ref<'overview' | 'orders' | 'risk'>('overview')
const query = ref('')
const density = ref<'comfortable' | 'compact'>('comfortable')

const kpis = [
  { label: 'GMV（7d）', value: '¥ 2.84M', delta: '+12.4%', tone: 'up' as const },
  { label: '转化率', value: '3.92%', delta: '-0.6%', tone: 'down' as const },
  { label: '履约 SLA', value: '98.1%', delta: '+0.2%', tone: 'up' as const },
  { label: '退款率', value: '0.74%', delta: '+0.1%', tone: 'warn' as const },
]

const segments = ['全部渠道', '自营', 'POP', '跨境', 'O2O']

const rows = [
  { id: 'SO-92811', sku: 'SKU-电陶炉-A12', region: '华东', amt: '¥ 1,280', st: 'paid', risk: 'low' },
  { id: 'SO-92812', sku: 'SKU-破壁机-Q9', region: '华南', amt: '¥ 2,099', st: 'fulfill', risk: 'low' },
  { id: 'SO-92813', sku: 'SKU-空净-Pro', region: '华北', amt: '¥ 3,450', st: 'refund', risk: 'high' },
  { id: 'SO-92814', sku: 'SKU-扫地-X2', region: '西南', amt: '¥ 4,120', st: 'paid', risk: 'mid' },
  { id: 'SO-92815', sku: 'SKU-显示器-UW', region: '华东', amt: '¥ 5,680', st: 'fulfill', risk: 'low' },
  { id: 'SO-92816', sku: 'SKU-工学椅-E1', region: '华南', amt: '¥ 1,999', st: 'paid', risk: 'low' },
  { id: 'SO-92817', sku: 'SKU-路由-WiFi7', region: '华北', amt: '¥ 899', st: 'fulfill', risk: 'mid' },
  { id: 'SO-92818', sku: 'SKU-NAS-4Bay', region: '跨境', amt: '¥ 6,200', st: 'paid', risk: 'low' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return rows
  return rows.filter(
    (r) =>
      r.id.toLowerCase().includes(q) ||
      r.sku.toLowerCase().includes(q) ||
      r.region.toLowerCase().includes(q),
  )
})

const statusCls: Record<string, string> = {
  paid: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  fulfill: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  refund: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
}

const riskCls: Record<string, string> = {
  low: 'text-emerald-400',
  mid: 'text-amber-400',
  high: 'text-rose-400',
}

const padCls = computed(() =>
  density.value === 'compact' ? 'px-3 py-2' : 'px-4 py-3',
)
</script>

<template>
  <div
    class="min-h-full bg-green-750 text-green-100 flex items-stretch justify-center p-4 md:p-6"
  >
    <div
      class="w-full max-w-[1600px] flex flex-col gap-4 rounded-2xl border border-green-800/80 bg-green-900/40 shadow-2xl shadow-black/40 ring-1 ring-white/5 overflow-hidden"
    >
      <!-- 顶栏 -->
      <header
        class="flex flex-wrap items-center gap-3 border-b border-green-800/80 bg-green-900/80 px-4 py-3 md:px-6"
      >
        <div class="flex items-center gap-2 min-w-[200px]">
          <span
            class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm ring-1 ring-emerald-500/30"
            >A</span
          >
          <div>
            <div class="text-sm font-semibold tracking-tight">UnoCSS Admin</div>
          </div>
        </div>

        <nav class="flex flex-wrap gap-1 rounded-lg bg-green-950/60 p-1 ring-1 ring-green-800">
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition"
            :class="
              tab === 'overview'
                ? 'bg-green-800 text-white shadow-sm'
                : 'text-green-400 hover:text-green-200'
            "
            @click="tab = 'overview'"
          >
            总览
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition"
            :class="
              tab === 'orders'
                ? 'bg-green-800 text-white shadow-sm'
                : 'text-green-400 hover:text-green-200'
            "
            @click="tab = 'orders'"
          >
            订单
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition"
            :class="
              tab === 'risk' ? 'bg-green-800 text-white shadow-sm' : 'text-green-400 hover:text-green-200'
            "
            @click="tab = 'risk'"
          >
            风控
          </button>
        </nav>

        <div class="flex flex-1 flex-wrap items-center justify-end gap-2">
          <label
            class="relative flex min-w-[200px] max-w-md flex-1 items-center rounded-lg bg-green-950/80 ring-1 ring-green-800 focus-within:ring-emerald-500/40"
          >
            <span class="pl-3 text-green-500 text-xs">搜索</span>
            <input
              v-model="query"
              type="search"
              placeholder="订单号 / SKU / 区域…"
              class="w-full bg-transparent py-2 pr-3 pl-2 text-sm text-green-100 placeholder:text-green-600 outline-none"
            />
          </label>
          <button
            type="button"
            class="rounded-lg bg-green-800 px-3 py-2 text-xs font-medium text-green-200 ring-1 ring-green-700 hover:bg-green-800"
            @click="density = density === 'compact' ? 'comfortable' : 'compact'"
          >
            密度：{{ density === 'compact' ? '紧凑' : '舒适' }}
          </button>
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
          >
            新建工单
          </button>
        </div>
      </header>

      <div class="flex flex-1 min-h-0 flex-col lg:flex-row">
        <!-- 侧栏 -->
        <aside
          class="hidden w-56 shrink-0 border-b border-green-800/80 bg-green-950/30 lg:block lg:border-b-0 lg:border-r"
        >
          <div class="p-4 space-y-6">
            <div>
              <div class="text-[10px] font-semibold uppercase tracking-wider text-green-500">
                工作台
              </div>
              <ul class="mt-2 space-y-1 text-sm">
                <li class="rounded-lg bg-green-800/80 px-3 py-2 text-white ring-1 ring-green-700">
                  仪表盘
                </li>
                <li
                  class="rounded-lg px-3 py-2 text-green-400 hover:bg-green-800/40 hover:text-green-200"
                >
                  商品与库存
                </li>
                <li
                  class="rounded-lg px-3 py-2 text-green-400 hover:bg-green-800/40 hover:text-green-200"
                >
                  营销投放
                </li>
                <li
                  class="rounded-lg px-3 py-2 text-green-400 hover:bg-green-800/40 hover:text-green-200"
                >
                  客服与售后
                </li>
              </ul>
            </div>
            <div>
              <div class="text-[10px] font-semibold uppercase tracking-wider text-green-500">
                快捷筛选
              </div>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="s in segments"
                  :key="s"
                  class="inline-flex cursor-pointer items-center rounded-full bg-green-800/60 px-2.5 py-1 text-[11px] text-green-300 ring-1 ring-green-700 hover:bg-green-800"
                  >{{ s }}</span
                >
              </div>
            </div>
          </div>
        </aside>

        <!-- 主区 -->
        <main class="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-6">
          <div class="flex flex-wrap items-center gap-2 text-xs text-green-500">
            <span>运营</span>
            <span class="text-green-600">/</span>
            <span class="text-green-300">仪表盘</span>
            <span class="text-green-600">/</span>
            <span>{{ tab === 'overview' ? '总览' : tab === 'orders' ? '订单' : '风控' }}</span>
          </div>

          <!-- KPI -->
          <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="k in kpis"
              :key="k.label"
              class="rounded-xl border border-green-800/80 bg-gradient-to-br from-green-900/90 to-green-950/90 p-4 shadow-inner shadow-black/20"
            >
              <div class="text-xs text-green-500">{{ k.label }}</div>
              <div class="mt-2 flex items-end justify-between gap-2">
                <div class="text-2xl font-semibold tracking-tight text-white">{{ k.value }}</div>
                <span
                  class="rounded-md px-2 py-0.5 text-[11px] font-medium"
                  :class="
                    k.tone === 'up'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : k.tone === 'down'
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-amber-500/15 text-amber-200'
                  "
                  >{{ k.delta }}</span
                >
              </div>
              <div class="mt-3 h-10 rounded-lg bg-green-800/40 ring-1 ring-green-800/80 relative overflow-hidden">
                <div
                  class="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-emerald-500/25 to-sky-500/10"
                />
              </div>
            </article>
          </section>

          <!-- 中部：图表占位 + 侧卡 -->
          <section class="grid gap-4 xl:grid-cols-12">
            <div
              class="xl:col-span-8 rounded-xl border border-green-800/80 bg-green-950/40 p-4 ring-1 ring-white/5"
            >
              <div class="flex items-center justify-between gap-2">
                <h2 class="text-sm font-semibold text-green-200">交易趋势（示意）</h2>
                <div class="flex gap-1">
                  <span
                    class="rounded-md bg-green-800 px-2 py-1 text-[10px] font-medium text-green-300 ring-1 ring-green-700"
                    >7D</span
                  >
                  <span
                    class="rounded-md px-2 py-1 text-[10px] font-medium text-green-500 hover:bg-green-800/60"
                    >30D</span
                  >
                  <span
                    class="rounded-md px-2 py-1 text-[10px] font-medium text-green-500 hover:bg-green-800/60"
                    >90D</span
                  >
                </div>
              </div>
              <div
                class="mt-4 grid h-56 grid-cols-12 items-end gap-1.5 rounded-lg bg-green-900/50 p-3 ring-1 ring-green-800/80"
              >
                <div
                  v-for="n in 12"
                  :key="n"
                  class="rounded-t-sm bg-gradient-to-t from-emerald-600/40 to-emerald-400/20"
                  :style="{ height: `${20 + ((n * 17) % 80)}%` }"
                />
              </div>
              <div class="mt-3 grid gap-2 sm:grid-cols-3">
                <div
                  class="rounded-lg border border-dashed border-green-700/80 bg-green-900/40 p-3 text-xs text-green-500"
                >
                  漏斗：访问 → 加购 → 支付
                </div>
                <div
                  class="rounded-lg border border-dashed border-green-700/80 bg-green-900/40 p-3 text-xs text-green-500"
                >
                  分仓：华东 / 华南 / 华北负载
                </div>
                <div
                  class="rounded-lg border border-dashed border-green-700/80 bg-green-900/40 p-3 text-xs text-green-500"
                >
                  品类：数码 / 家电 / 家居贡献
                </div>
              </div>
            </div>

            <div class="xl:col-span-4 flex flex-col gap-3">
              <div
                class="rounded-xl border border-green-800/80 bg-green-950/40 p-4 ring-1 ring-white/5"
              >
                <h3 class="text-sm font-semibold text-green-200">实时告警</h3>
                <ul class="mt-3 space-y-2 text-xs">
                  <li
                    class="flex gap-2 rounded-lg bg-amber-500/10 px-2 py-2 ring-1 ring-amber-500/20"
                  >
                    <span class="text-amber-300">!</span>
                    <span class="text-amber-100/90">华东仓拣货队列 &gt; 阈值 12%</span>
                  </li>
                  <li class="flex gap-2 rounded-lg bg-green-800/50 px-2 py-2 ring-1 ring-green-700/80">
                    <span class="text-sky-300">i</span>
                    <span class="text-green-300">跨境线路清关延迟波动（可观察）</span>
                  </li>
                  <li class="flex gap-2 rounded-lg bg-green-800/50 px-2 py-2 ring-1 ring-green-700/80">
                    <span class="text-emerald-300">✓</span>
                    <span class="text-green-300">支付渠道成功率恢复至基线</span>
                  </li>
                </ul>
              </div>
              <div
                class="flex flex-1 flex-col rounded-xl border border-green-800/80 bg-green-950/40 p-4 ring-1 ring-white/5"
              >
                <h3 class="text-sm font-semibold text-green-200">待办</h3>
                <div class="mt-3 flex flex-1 flex-col gap-2 text-xs">
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded-lg bg-green-900/60 px-2 py-2 ring-1 ring-green-800"
                  >
                    <input type="checkbox" class="accent-emerald-500" checked />
                    <span>复核高风险退款（3）</span>
                  </label>
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded-lg bg-green-900/60 px-2 py-2 ring-1 ring-green-800"
                  >
                    <input type="checkbox" class="accent-emerald-500" />
                    <span>同步大促价盘到渠道侧</span>
                  </label>
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded-lg bg-green-900/60 px-2 py-2 ring-1 ring-green-800"
                  >
                    <input type="checkbox" class="accent-emerald-500" />
                    <span>导出审计抽样包</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- 表格 -->
          <section
            class="overflow-hidden rounded-xl border border-green-800/80 bg-green-950/30 ring-1 ring-white/5"
          >
            <div
              class="flex flex-wrap items-center justify-between gap-2 border-b border-green-800/80 bg-green-900/50 px-4 py-3"
            >
              <h2 class="text-sm font-semibold text-green-200">订单明细（高密度 class 用于扫描）</h2>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-lg bg-green-800 px-2.5 py-1.5 text-[11px] font-medium text-green-200 ring-1 ring-green-700 hover:bg-green-800"
                >
                  导出 CSV
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-green-800 px-2.5 py-1.5 text-[11px] font-medium text-green-200 ring-1 ring-green-700 hover:bg-green-800"
                >
                  批量备注
                </button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse text-left text-xs">
                <thead class="bg-green-900/80 text-green-400">
                  <tr>
                    <th class="font-medium" :class="padCls">订单</th>
                    <th class="font-medium" :class="padCls">SKU</th>
                    <th class="font-medium" :class="padCls">区域</th>
                    <th class="font-medium" :class="padCls">金额</th>
                    <th class="font-medium" :class="padCls">状态</th>
                    <th class="font-medium" :class="padCls">风险</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-green-800/80 text-green-200">
                  <tr
                    v-for="r in filtered"
                    :key="r.id"
                    class="hover:bg-green-800/30 transition-colors"
                  >
                    <td class="whitespace-nowrap font-mono text-[11px] text-green-300" :class="padCls">
                      {{ r.id }}
                    </td>
                    <td class="max-w-[220px] truncate text-green-300" :class="padCls">{{ r.sku }}</td>
                    <td class="whitespace-nowrap text-green-400" :class="padCls">{{ r.region }}</td>
                    <td class="whitespace-nowrap font-medium text-white" :class="padCls">{{ r.amt }}</td>
                    <td :class="padCls">
                      <span
                        class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                        :class="statusCls[r.st]"
                        >{{ r.st }}</span
                      >
                    </td>
                    <td :class="padCls">
                      <span class="font-semibold uppercase text-[10px]" :class="riskCls[r.risk]">{{
                        r.risk
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <footer
              class="flex flex-wrap items-center justify-between gap-2 border-t border-green-800/80 bg-green-900/40 px-4 py-2 text-[11px] text-green-500"
            >
              <span>共 {{ filtered.length }} 条（筛选后）</span>
              <div class="flex gap-1">
                <button
                  type="button"
                  class="rounded-md px-2 py-1 ring-1 ring-green-800 hover:bg-green-800/60"
                >
                  上一页
                </button>
                <button
                  type="button"
                  class="rounded-md bg-green-800 px-2 py-1 ring-1 ring-green-700"
                >
                  1
                </button>
                <button type="button" class="rounded-md px-2 py-1 ring-1 ring-green-800 hover:bg-green-800/60">
                  2
                </button>
                <button type="button" class="rounded-md px-2 py-1 ring-1 ring-green-800 hover:bg-green-800/60">
                  下一页
                </button>
              </div>
            </footer>
          </section>

          <!-- HMR 提示条：改这里一堆 utility 最能拉开扫描差异 -->
          <p
            class="rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2 text-center text-[11px] text-emerald-200/90"
          >
            样式 HMR 试跑：编辑本文件 class（例如把
            <code class="rounded bg-green-900 px-1 py-0.5 text-emerald-300">p-4</code>
            改成
            <code class="rounded bg-green-900 px-1 py-0.5 text-emerald-300">p-5</code>
            ）或改
            <code class="rounded bg-green-900 px-1 py-0.5 text-emerald-300">src/styles/tokens.css</code>
            主题变量；终端看
            <code class="rounded bg-green-900 px-1 py-0.5 text-emerald-300">[hmr-latency]</code> 与
            <code class="rounded bg-green-900 px-1 py-0.5 text-emerald-300">pnpm dev:hmr</code>。
          </p>
        </main>
      </div>
    </div>
  </div>
</template>
