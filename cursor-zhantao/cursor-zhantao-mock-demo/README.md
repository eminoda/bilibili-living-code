# Cursor 禅道 Mock Demo

这是一个用于视频录制的本地演示页面，复刻禅道工作台、待处理列表和 Bug 详情的整体布局。页面只连接同仓库的禅道 Mock Server，不连接公司禅道；任务、Bug、项目等记录均为虚构数据。

## 启动

在仓库根目录运行：

```bash
pnpm dev:zhantao-mock-stack
```

UI 默认地址为 `http://127.0.0.1:5182/`，Mock Server 默认地址为 `http://127.0.0.1:5183/`。Demo 通过 Vite 将 `/api.php/v2/*` 代理到 Mock Server。四个页面可以通过左侧菜单、顶部菜单、仪表盘指标和列表记录互相切换。它也支持与原站相似的演示地址：

```text
/index.php?m=my&f=index
/index.php?m=my&f=work&mode=task&type=assignedTo
/index.php?m=my&f=work&mode=bug&type=assignedTo
/index.php?m=bug&f=view&bugID=11934
```

录制推荐使用 1536 × 816 或相近比例。列表支持搜索；双击 Bug 标题或点击 Bug 编号可进入详情。

## 页面结构

- 工作台：问候与待办指标、流程帮助、动态公告、操作时间线。
- 任务列表：状态、项目、负责人、截止日期、延期提示和分页信息。
- Bug 列表：优先级、状态、所属项目、指派人与更新时间。
- Bug 详情：重现步骤、实际 / 期望结果、历史记录与修复备注、基础字段和操作栏。

## 截图视觉 Design Tokens

以下值根据提供的禅道截图估算，用来维持接近原界面的比例和密度。没有读取到线上实例的计算样式，因此这些值是视觉匹配值，不是从站点 CSS 提取的精确值。

字体和图标参照仓库中的 `vite8-order-workbench`：正文使用系统字体栈，不额外下载字体文件；菜单和操作按钮使用 `@element-plus/icons-vue` 的 SVG 图标组件，不依赖图标字体，因此不会受字符基线和本机字体回退影响。

| Token | 值 | 用途 |
|---|---|---|
| `--zt-blue` | `#347cf6` | 顶部栏、选中项、链接和主操作 |
| `--zt-sidebar` | `#303b4d` | 左侧深色导航 |
| `--zt-canvas` | `#f5f7f9` | 页面背景 |
| `--zt-surface` | `#ffffff` | 卡片、表格与属性面板 |
| `--zt-border` | `#e1e6ec` | 卡片与表格分隔线 |
| `--zt-green` | `#00a870` | 已完成状态 |
| `--zt-orange` | `#ff9948` | 教程等次级强调操作 |
| `--zt-red` | `#f56c6c` | 风险和紧急提示 |
| 主导航宽度 | `120px` | 左侧固定导航 |
| 顶栏高度 | `48px` | 顶部模块导航 |
| 底部状态栏 | `24px` | 版本和搜索区域 |
| 常用字号 | `12–14px` | 表格、表单和卡片标题 |
| 卡片圆角 | `3px` | 保持偏紧凑的企业工具风格 |

## 修改数据

演示数据和 API v2 路由位于 `apps/living-projects/cursor-zhantao/cursor-zhantao-mock-server/src/data.mjs` 与 `src/server.mjs`。UI 的 HTTP 调用和 v2 字段到页面字段的映射位于 `src/api/zentaoClient.ts`。要单独启动 UI 可运行 `pnpm dev:zhantao-mock`，但需要另开终端启动 `pnpm dev:zhantao-mock-server`。

当前只读覆盖登录、项目/产品/执行列表、执行任务列表、产品/项目 Bug 列表和 Bug 详情。Mock Token 与登录凭证只用于本地演示；请勿将真实公司任务或 Bug 信息复制到种子数据。
