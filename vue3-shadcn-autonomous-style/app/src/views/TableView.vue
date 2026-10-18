<script setup lang="ts">
import {
  FlexRender,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type Column,
  type SortingState,
} from "@tanstack/vue-table";
import { computed, h, ref, watch } from "vue";

type RowStatus = "success" | "processing" | "warning" | "default";

type Row = {
  id: string;
  name: string;
  amount: number;
  status: RowStatus;
  updatedAt: string;
};

const rawData: Row[] = [
  { id: "1", name: "订单结算-华东", amount: 128_600, status: "success", updatedAt: "2026-04-01" },
  { id: "2", name: "库存同步任务", amount: 42_000, status: "processing", updatedAt: "2026-04-02" },
  { id: "3", name: "退款审核队列", amount: 9_800, status: "warning", updatedAt: "2026-04-02" },
  { id: "4", name: "新客引导页 AB", amount: 3_200, status: "default", updatedAt: "2026-04-03" },
  { id: "5", name: "报表导出（日）", amount: 501_000, status: "success", updatedAt: "2026-04-03" },
  { id: "6", name: "权限树缓存", amount: 12_400, status: "processing", updatedAt: "2026-04-04" },
  { id: "7", name: "支付渠道监控", amount: 88_900, status: "success", updatedAt: "2026-04-04" },
  { id: "8", name: "消息推送重试", amount: 6_100, status: "warning", updatedAt: "2026-04-05" },
  { id: "9", name: "数据对账-月", amount: 2_010_000, status: "default", updatedAt: "2026-04-05" },
  { id: "10", name: "运营活动配置", amount: 15_000, status: "processing", updatedAt: "2026-04-06" },
  { id: "11", name: "搜索索引增量", amount: 72_300, status: "success", updatedAt: "2026-04-06" },
  { id: "12", name: "灰度发布批次", amount: 4_500, status: "warning", updatedAt: "2026-04-07" },
];

const search = ref("");
const sorting = ref<SortingState>([]);
const pagination = ref({ pageIndex: 0, pageSize: 5 });

const filteredData = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return rawData;
  return rawData.filter((r) => r.name.toLowerCase().includes(q));
});

watch(search, () => {
  pagination.value = { ...pagination.value, pageIndex: 0 };
});

const money = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

function statusTag(s: RowStatus) {
  const map: Record<
    RowStatus,
    { label: string; cls: string }
  > = {
    success: {
      label: "生效",
      cls:
        "border border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
    },
    processing: {
      label: "处理中",
      cls:
        "border border-primary/40 bg-primary/10 text-primary dark:bg-primary/20",
    },
    warning: {
      label: "待处理",
      cls:
        "border border-amber-400/70 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-100",
    },
    default: {
      label: "草稿",
      cls:
        "border border-border bg-muted text-muted-foreground",
    },
  };
  const m = map[s];
  return h(
    "span",
    {
      class: `inline-flex items-center rounded px-2 py-0.5 text-base font-medium ${m.cls}`,
    },
    m.label,
  );
}

const columnHelper = createColumnHelper<Row>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "序号",
    enableSorting: false,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return String(pageIndex * pageSize + row.index + 1);
    },
  }),
  columnHelper.accessor("name", {
    header: "名称",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "状态",
    cell: (info) => statusTag(info.getValue() as RowStatus),
  }),
  columnHelper.accessor("amount", {
    header: "金额（元）",
    cell: (info) =>
      h(
        "span",
        { class: "tabular-nums text-right block w-full" },
        money.format(Number(info.getValue())),
      ),
    meta: { align: "right" as const },
  }),
  columnHelper.accessor("updatedAt", {
    header: "更新日期",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "操作",
    enableSorting: false,
    cell: () =>
      h("div", { class: "flex items-center justify-end gap-3" }, [
        h(
          "button",
          {
            type: "button",
            class:
              "text-lg text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1",
          },
          "查看",
        ),
        h(
          "button",
          {
            type: "button",
            class:
              "text-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border rounded px-1",
          },
          "编辑",
        ),
      ]),
  }),
];

const table = useVueTable({
  get data() {
    return filteredData.value;
  },
  columns,
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onPaginationChange: (updater) => {
    pagination.value =
      typeof updater === "function" ? updater(pagination.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

function headerThClass(column: Column<Row, unknown>) {
  return column.getCanSort()
    ? "cursor-pointer select-none hover:bg-muted/80"
    : "";
}

function onRefresh() {
  search.value = "";
  sorting.value = [];
  pagination.value = { pageIndex: 0, pageSize: 5 };
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full max-w-5xl mx-auto gap-5 py-2 px-2"
    data-testid="table-stage"
  >
    <div class="text-center space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight text-foreground">
        数据列表
      </h2>
      <p class="text-lg text-muted-foreground">
        TanStack Table + 自研表壳 · 对标中后台数据密度
      </p>
    </div>

    <div
      class="w-full rounded-lg border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,23,42,0.06)] overflow-hidden"
    >
      <div
        class="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-border bg-muted/50 dark:bg-muted/30"
      >
        <label class="sr-only" for="table-search">搜索名称</label>
        <input
          id="table-search"
          v-model="search"
          type="search"
          data-testid="table-search"
          placeholder="搜索名称"
          class="min-w-[200px] flex-1 max-w-sm rounded-md border border-border bg-card px-3 py-2 text-lg shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        />
        <button
          type="button"
          data-testid="table-refresh"
          class="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-lg font-medium text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          @click="onRefresh"
        >
          刷新
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-lg">
          <thead>
            <tr
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
              class="bg-muted/70 dark:bg-muted/40 border-b border-border"
            >
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                :class="[
                  'border-b border-border px-4 py-3 text-left font-medium text-foreground',
                  headerThClass(header.column),
                  (header.column.columnDef.meta as { align?: string } | undefined)?.align === 'right'
                    ? 'text-right'
                    : '',
                ]"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <div
                  class="flex items-center gap-2 w-full min-h-[1.25rem]"
                  :class="
                    (header.column.columnDef.meta as { align?: string } | undefined)?.align ===
                    'right'
                      ? 'justify-end'
                      : 'justify-between'
                  "
                >
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <span
                    v-if="header.column.getCanSort()"
                    class="inline-flex shrink-0 flex-col text-sm leading-none"
                  >
                    <span
                      :class="
                        header.column.getIsSorted() === 'asc'
                          ? 'text-primary'
                          : 'text-muted-foreground/45 dark:text-muted-foreground/50'
                      "
                      >▲</span
                    >
                    <span
                      :class="
                        header.column.getIsSorted() === 'desc'
                          ? 'text-primary'
                          : 'text-muted-foreground/45 dark:text-muted-foreground/50'
                      "
                      >▼</span
                    >
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in table.getRowModel().rows"
              :key="row.id"
              class="border-b border-border transition-colors hover:bg-muted/35 dark:hover:bg-muted/20"
              :class="i % 2 === 1 ? 'bg-muted/25 dark:bg-muted/15' : 'bg-card'"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :class="[
                  'px-4 py-3 align-middle text-card-foreground',
                  (cell.column.columnDef.meta as { align?: string } | undefined)?.align === 'right'
                    ? 'text-right'
                    : '',
                ]"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/30 dark:bg-muted/20 text-lg"
      >
        <span class="text-muted-foreground">
          共 {{ filteredData.length }} 条
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            data-testid="table-prev"
            class="rounded border border-border bg-card px-2.5 py-1.5 text-lg disabled:opacity-40 disabled:pointer-events-none hover:bg-muted/50"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            上一页
          </button>
          <span class="text-muted-foreground tabular-nums">
            {{ table.getState().pagination.pageIndex + 1 }} /
            {{ table.getPageCount() || 1 }}
          </span>
          <button
            type="button"
            data-testid="table-next"
            class="rounded border border-border bg-card px-2.5 py-1.5 text-lg disabled:opacity-40 disabled:pointer-events-none hover:bg-muted/50"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
