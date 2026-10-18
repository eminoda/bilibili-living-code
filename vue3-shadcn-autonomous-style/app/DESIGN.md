# Design System: vue3-shadcn-autonomous-style · 教学 Demo

**Project ID:** N/A（本地 Vite 路由演示，非 Stitch；本文件按 `.cursor/skills/design-md/SKILL.md` 的固定章节撰写，作为录屏与 Stitch 类提示词的语义化单一事实来源。）

## 1. Visual Theme & Atmosphere

整体是 **清爽、偏中台向** 的浅色界面：**大面积浅底（Background）** 托起 **限宽容器**，避免录屏时视线散落在边角。三个演示路由分工明确：**PainView** 用「约束感」讲 **Ant primary 与「class + :deep + !important」** 两档对比；**OwnershipView** 用 **「预览台」与「目录树」的强分层** 讲源码在仓；**TableView** 用中高密度数据页讲表壳与 TanStack。Ownership 一页刻意做成 **上：等宽代码树（轻） / 下：渐变底 + 粗边框预览区（重）**，让 **Button 与 Card 在画面中「跳」出来**。

## 2. Color Palette & Roles

| 描述名 | Hex / Token | 功能角色 |
|--------|-------------|----------|
| **Snow White Canvas（页面底）** | `background`（约 **#fcfcfc** 气质） | 全页浅底，承托导航与主舞台。 |
| **Ink Soft（主正文）** | `foreground`（深灰近黑） | 标题与说明文字。 |
| **Indigo Action（主品牌 / 主按钮）** | `primary`（OKLCH 紫蓝调，约 **#5b4dc9～#6366f1** 观感） | 主按钮填充、预览区虚线/实线边框强调、环（ring）与投影 tint。 |
| **Primary on Action** | `primary-foreground` | 主按钮上的文字。 |
| **Mist Panel（次级底）** | `muted` | 预览区渐变中的浅紫灰过渡，与 `card` 形成层次。 |
| **Muted Ink** | `muted-foreground` | 辅助说明、预览区副标题。 |
| **Card Frost** | `card` | 卡片白底、目录树代码块底。 |
| **Hairline Edge** | `border` | 细分割线、默认卡片边框。 |
| **Ant Primary（Pain 默认档）** | **约 #1677ff**（Ant Design Vue primary 气质） | 不挂自定义 class 时主按钮保持组件库 token。 |
| **Pain 覆盖档 · 翠绿按钮** | **#22c55e** 底 + **#16a34a** 边（Tailwind green-500 / green-600 气质） | 由 **`pain-btn--green`** 激活，在 scoped 中 **`:deep(.pain-btn--green.ant-btn)`** 覆盖，与 Ant primary 形成录屏对比。 |
| **Table 状态色** | 翠绿 / 蓝紫 / 琥珀 / 中性灰（见 Table 章节惯例） | 行状态标签，与数据语义绑定。 |

深色模式（`html.dark`）下保持 **主色与预览区环、投影可辨**，`muted` 与 `card` 对比略加强。

## 3. Typography Rules

- **路由页标题**：`text-lg font-semibold tracking-tight`，单行点题。
- **预览区副标题**：`text-sm font-medium text-muted-foreground` + **略宽字距**，与主标题区分层级。
- **Card 内标题**：`text-base font-bold text-primary tracking-tight`，强调「文件名级」信息。
- **Card 正文**：`text-sm leading-relaxed text-muted-foreground`，保证录屏缩略图仍可读。
- **目录树 `pre`**：`text-xs`，等宽字体呈现路径；外框 `shadow-sm` 轻微离地。

## 4. Component Stylings

* **Buttons（`Button.vue` / `button-variants.ts`）**：默认 **圆角适中（rounded-md 气质）**、**主色实底**、**hover 略压暗**；在 **Ownership 预览台** 上额外叠 **大号 `size="lg"`**、**shadow-lg + 主色 tint**、**ring-2 ring-primary/25**，并带 **hover 略放大与 ring 加深**，让「这是可点的本地组件」在画面中一眼可读。

* **Cards/Containers（`Card.vue`）**：默认 **rounded-xl、细边框、浅阴影**；在 **Ownership 预览台** 上加强为 **border-2 border-primary/25**、**shadow-2xl + 主色 tint**、**ring-4 ring-primary/10**，可选 **backdrop-blur-sm** 与 **hover 轻微上浮**，与左侧主按钮 **体量对位**，避免像「灰条文案框」。

* **Inputs/Forms**：**PainView** 使用原生 `<select>`（`rounded-md`、`border-border`、`min-w-[240px]`、焦点 `ring-primary/30`）；**TableView** 使用搜索框 + 分页，遵循中后台密度（见路由 `/table`）。

* **PainView 专用（Ant Design `Button`）**：**仅两档**——**默认**为 **Ant primary**（不挂业务 class）；**第二档**在按钮上增加 **`pain-btn--green`**，在 **`<style scoped>`** 中用 **`:deep(.pain-btn--green.ant-btn)`** 同时写 **翠绿背景、描边与 pill 圆角**，并用 **`!important`** 与组件库样式争优先级；**不**再用 Tailwind 的 `!bg-*` 堆在模板里，突出「改 class 名 + 深度选择器」的路径。

* **TableView**：工具栏 + 全表边框/斑马纹 + 状态 Tag — 贴近 Ant Design Pro 信息密度，与 TanStack 数据层拆分叙事一致。

## 5. Layout Principles

- **OwnershipView**：**垂直三段节奏** — ① 标题 + 目录树（居中、限宽）；② **大块预览容器**（`rounded-2xl`、`p-8`～`p-10`、`border-dashed` + **渐变底** + `shadow-inner` 形成「展台」）；③ 内部 **主按钮与 Card 并排**（`flex` + `gap-10`），窄屏改为纵排仍保持间距。**预览区与树状目录的对比**是本章录屏可读性的核心。
- **PainView**：竖直栈、控件少、主操作居中。
- **TableView**：卡片 `max-w-5xl` 级居中，工具栏 / 表体 / 分页纵向分区。
- **全站**：`App.vue` 外层 `p-8` 与导航区分；区块间 **`gap-8`～`gap-10`** 在 Ownership 中略放大，服务录屏构图。
