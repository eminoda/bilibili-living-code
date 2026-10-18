# Vue3+Shadcn：自主掌控！样式「说变就变」

**副标题**：从「样式战争」到源码在仓、headless 组合与主题一键切换——用 Vue 3 把 UI 掌控权拿回来。

---

## 开篇：钩子与本期收获

<!-- ColdOpen + Intro -->

**Ant Design** 项目里，每次改个按钮颜色就要加一堆 `!important` 和 `:deep(.ant-btn)`，项目越大样式文件越乱，升级 Ant Design 版本还得重新覆盖……更别提想沉淀一套可复用的主题系统了，几乎不可能。

传统组件库把你「绑架」在 `node_modules` 里，而 Shadcn 彻底把控制权还给你——**样式说变就变，主题一键切换**。自然引出标题核心：**「自主掌控，才是现代前端的爽点。」**

看完这个视频，让你抛弃 Ant Design，从新高度出发。

下面接一段「代码锚点」：口播里提到的符号，画面里也要能对上。**LivingCode** 见 `apps/living-projects/vue3-shadcn-autonomous-style/app/`（路由 `/pain`；**两档**：Ant **primary** 与 **绿色 + pill 圆角**，第二档通过 **`pain-btn--green`** class 激活，在 scoped 里 **`:deep(.pain-btn--green.ant-btn)`** 写样式，**圆角与背景用 `!important`**）。录屏成片：`apps/living-projects/vue3-shadcn-autonomous-style/videos/clips/clip-coldopen.webm`。

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Button } from "ant-design-vue"
type PainMode = "default" | "green"
const mode = ref<PainMode>("default")
</script>
<template>
  <select v-model="mode" data-testid="pain-bg-select" class="rounded-md border border-border bg-card px-3 py-2 text-sm min-w-[240px]">
    <option value="default">Ant Primary（组件库默认）</option>
    <option value="green">绿色 + 圆角（改 class 激活）</option>
  </select>
  <Button
    type="primary"
    class="ant-btn ant-btn-primary"
    :class="{ 'pain-btn--green': mode === 'green' }"
  />
</template>
<style scoped>
:deep(.pain-btn--green.ant-btn) {
  background-color: #22c55e !important;
  border-color: #16a34a !important;
  border-radius: 9999px !important;
}
</style>
```

---

## 五分钟让你拥有代码所有权

<!-- Chapter 1（原 Chapter 2）· Signpost：集成 shadcn-vue / 组件进仓库 -->

**路标**：这一节做一件事——**让组件文件出现在你的 `src` 里。**

Shadcn 路线在 Vue 侧通常通过 **shadcn-vue CLI** 落地：它不是「装一个大包」，而是把**可编辑的组件模板**生成到你的工程里。初始化与添加常用块可以按官方文档执行（仓库内需已配置好 Vite + Vue 3 + Tailwind 等前置；具体以你项目为准）：

```bash
npx shadcn-vue@latest init
npx shadcn-vue@latest add button card
```

生成后，你的目录会接近下面这样（不同版本可能略有差异，以实际 CLI 为准）：

```
src/
├── components/
│   └── ui/
│       ├── button/
│       └── card/
```

**为什么这样写**：把组件当「项目源码」而不是「依赖黑盒」，后续改圆角、改 focus 环、改 `aria`，都走正常 PR 与 Code Review。

最小用法上，你在页面里直接引用生成好的组件即可（路径以 CLI 生成为准）：

```vue
<template>
  <Button>默认按钮</Button>
  <Card>我是卡片</Card>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
</script>
```

**Remotion 串联（Chapter 1 与成片对齐）**：**Signpost**「集成 shadcn-vue / 组件进仓库」→ **CodeExample**（bash：`init` / `add button card`）→ **CodeExample**（`Button.vue` 的 **`<script setup>`**，每块 ≤20 行）→ **CodeExample**（同文件的 **`<template>`**）→ **VideoMedia** 录屏 `clip-ownership.webm`（`/ownership` 目录树 + 预览台）。

**VideoMedia** 成片素材：`apps/living-projects/vue3-shadcn-autonomous-style/videos/clips/clip-ownership.webm`（本地演示：`app` 内 `/ownership`，对应「源码在仓」一屏）。

一开始你会不习惯，因为只有 `variant` 之类的 props。别担心，看完后面的 Shadcn 核心哲学后，这一切不会成为问题，因为你现在拥有了组件的所有代码。

**小结**：到这里，你已经用文件树证明了一件事——**代码所有权**不是口号，是看得见的路径。

---

## Headless哲学到暗黑主题一键切换

<!-- Chapter 2（原 Chapter 3）· Signpost：cva 管变体 / 变量管主题 -->

**路标**：这一节把「解耦」讲透——**交互归 headless，样式归你。**

Shadcn 类方案的核心组合通常是：**Radix Vue（无头，管可访问性与交互状态）** + **Tailwind（工具类）** + **cva（class-variance-authority，管变体）**。你可以把它理解成：组件内部不替你「拍板审美」，而是给你**稳定的语义钩子**；外观由你在本地组件里用 Tailwind 拼出来。

Button 上常见的 `buttonVariants` 就是用 cva 声明「基础 class + variant + size」：

```ts
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)
```

**为什么这样写**：变体是**数据**，不是一堆 if-else 字符串拼接；改主题时你只要让 `bg-primary` 背后的颜色**指向语义 token**，而不是到处替换 class。

暗黑模式上，常见做法是在根节点挂 `class="dark"`，用 CSS 变量切换语义色（片段仅示意，项目以 tailwind 配置为准）：

```css
:root {
  --background: 0 0% 100%;
  --primary: 222.2 47.4% 11.2%;
}
.dark {
  --background: 222.2 84% 4.9%;
  --primary: 210 40% 98%;
}
```

切换逻辑可以用 VueUse 的 `useColorMode`（或项目已有方案），核心是**改 class / 存偏好**，而不是全局 `!important`：

```vue
<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const mode = useColorMode()
function toggleTheme() {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>
<template>
  <Button type="button" @click="toggleTheme">切换明暗</Button>
</template>
```

**ExcalidrawChart** 文件：`apps/living-projects/vue3-shadcn-autonomous-style/excalidraw-antd-vs-shadcn.excalidraw`（`public/topic/vue3-shadcn-autonomous-style/` 同路径供 Remotion 引用）。左「黑盒依赖」vs 右「源码在仓 / token」；中间 **Headless + cva + 变量**；带看顺序先左后中再右。

**VideoMedia**：`apps/living-projects/vue3-shadcn-autonomous-style/videos/clips/clip-theme.webm`（演示路由 `/theme`）。

**小结**：到这一步，你应该能自信地说一句——**我不是在「用皮肤」，而是在搭自己的设计系统。**

---

## Ant Design 有的，Shadcn 有更好的

<!-- Chapter 3（原 Chapter 4）· Signpost：Table 壳 / TanStack 管数据 -->

**路标**：这一节回答——**复杂表格谁来算，谁来画？**

Ant Design 的 `Table` 往往「一把梭」：数据、分页、排序都绑在一起。Shadcn 更偏**组合**：UI 壳（`Table`、`TableHeader`…）负责**结构与样式**；**列定义、排序、分页状态**交给 **TanStack Table**——在 Vue 3 里请使用 **`@tanstack/vue-table`**，入口是 **`useVueTable`**（不要照搬 React 示例里的 `useReactTable`）。

**`createColumnHelper`** 与 **`useVueTable`**（行数据、排序、分页）逻辑在同一 `<script setup>` 里；**Remotion** 拆成 **`codeTableSetup`** → **`codeTableUseVueTableState`** → **`codeTableUseVueTableHandlers`**（每段 **≤20 行**）。成片去掉前端过滤，仅保留 `rawData`（`TableView.vue` 里仍可加 `computed` 做搜索）。模板里用 `FlexRender` 渲染单元格，录屏见 **VideoMedia**。

**1）依赖 + 列 + 状态 ref（`codeTableSetup`）**

```ts
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from "@tanstack/vue-table"
import { ref } from "vue"

const columnHelper = createColumnHelper<Row>()
const columns = [columnHelper.accessor("name", { header: "名称" })]
const sorting = ref<SortingState>([])
const pagination = ref({ pageIndex: 0, pageSize: 5 })
```

**2）`useVueTable` 前半：data / columns / state（`codeTableUseVueTableState`）**

```ts
const table = useVueTable({
  get data() {
    return rawData
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    },
  },
```

**3）`onChange` + row models（`codeTableUseVueTableHandlers`）**

```ts
  onSortingChange: (u) => {
    sorting.value = typeof u === "function" ? u(sorting.value) : u
  },
  onPaginationChange: (u) => {
    pagination.value = typeof u === "function" ? u(pagination.value) : u
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

模板侧用 Shadcn 式 `table` + `FlexRender` 渲染 `getHeaderGroups()` / `getRowModel().rows`（完整见项目录屏与 `TableView.vue`）。

**VideoMedia**：`apps/living-projects/vue3-shadcn-autonomous-style/videos/clips/clip-table.webm`（演示路由 `/table`；表页 UI 见 `app/DESIGN.md`）。

**小结**：Shadcn 不是限制你，而是把**界面与数据逻辑**拆成两块，让你按需换引擎——**组合优于单体**。

---

## 实践建议与踩坑提醒

- **CLI 与版本**：`shadcn-vue` 生成物会随版本迭代，团队里固定 CLI 版本或锁定生成规则，能减少「同事拉下来结构不一致」。
- **设计 token**：优先改语义变量（如 `primary`）而不是散点改 class，暗色模式更不容易翻车。
- **TanStack 学习曲线**：先跑通 `getCoreRowModel`，再逐步加排序/分页；别一上来把表格全家桶都搬进页面。
- **可访问性**：无头组件给了键盘与 ARIA 基础，但仍要按业务场景补齐文案与焦点顺序——别只换皮。

---

## 总结

<!-- Summary · 最多 4 条 -->

- **源码在仓**：组件随项目迭代，diff 可见，告别「只在墙外覆盖」。
- **变体 + 主题**：cva 管变体，CSS 变量 + `.dark` 管明暗，减少 `!important`。
- **生态拼接**：`@tanstack/vue-table` 与 Shadcn Table 壳组合，复杂表也能控复杂度。
- **下一步**：在你负责的一个小页面里试一次 `add button`，改一处 token，看全局跟走。

---

## 结尾

<!-- Outro -->

从「被组件库绑架」到「自主掌控设计系统」，中间差的往往不是学习能力，而是**边界是否在你手里**。如果这期对你有启发，欢迎你在评论区聊聊：**你现在主用哪套 UI？最想用 Shadcn 改造哪一页？** 我是《前端雨爸》，我们下期见。

**CTA**：点个订阅关注，方便收到下一期 Vue 实战向更新。
