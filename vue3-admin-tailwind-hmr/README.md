# Admin Dashboard（Tailwind CSS 组）

与 `apps/living-projects/vue3-admin-unocss-hmr` 成对：**同一套 Vue 界面**，仅样式栈为 **Vite + Vue3 + TS + Tailwind CSS v4（`@tailwindcss/vite`）**，用于对照 HMR / 冷启动。

## 命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 普通开发服务器 |
| `pnpm dev:hmr` | **Vite 内置 HMR 调试日志**（`vite --debug hmr`）+ 本仓库 `hmrLatencyPlugin` 在终端打印 `[hmr-latency] ws … Δ=…ms` |

## 怎么读数

1. 终端执行 `pnpm dev:hmr`，浏览器打开本地地址。
2. 保存一次 `src/components/AdminDashboard.vue`（例如改一处 `p-4` → `p-5`）或 `src/styles/tokens.css`。
3. 看终端：先有 `fs change`，再有 `ws update Δ=…ms`（从文件落盘到服务端推送 HMR 消息的大致耗时）。
4. 与 UnoCSS 组在**同一台机器、同一 Node、先分别 `pnpm install` 锁版本**下各测 20 次取均值 / P95（口径见 `apps/living-projects/vue3-unocss-instant-atomic-css-engine/index.md`）。

## 版本记录（请实测时自行填写）

在对比文章里写明：`node -v`、`pnpm -v`、以及本目录 `package.json` 中 `vite` / `tailwindcss` / `@tailwindcss/vite` 版本。
