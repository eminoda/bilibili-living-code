# Vue3+UnoCSS：前端界的速溶咖啡！比 Tailwind 更快的 CSS 引擎

**副标题**：用「同页双实现」把开发期的 CSS 体积与 HMR 体感说清楚——再决定要不要迁。

---

## 开篇：数字先说话（ColdOpen + Intro）

你是不是也遇到过：原子化 class 写得越来越顺，协作也越来越像「拼乐高」，但项目一大，**首屏样式**和 **改一行 class 的热更新**却偶尔让人心里一紧——到底慢在业务，还是慢在样式管线？

这一期先给你三组**同一套后台 Dashboard、同一口径**下跑出来的数（画面并排时：**左 UnoCSS、右 Tailwind**；从左到右念就是 **22→48、24→56、9→28**）：

（此处 **VideoMedia**：请将已录制的对比实验成片放入 **`apps/living-projects/vue3-unocss-instant-atomic-css-engine/videos/compare-dashboard-hmr.webm`**（或见同目录 `README.md` 约定）；画面为终端 / Network / Vite 日志或 HUD 数字特写；**无需新录屏**。）

看完这期视频，你能带走三件事：搞懂 **UnoCSS「Instant On-demand Atomic」在工程里指什么**；能复述 **这组数据各自在比什么**；最后知道 **哪些团队不该硬迁**。

---

<!-- 对应 scriptoutline Chapter 1 -->

## 开发期的「跟手」变差，别只怪业务代码

**路标（Signpost，Remotion 上屏）**：拼 class 很爽 / 热更变慢 / 谁背锅（`line1` + `highlight` + `line2` 空）

原子化 CSS 把「写样式」变成了可预测、可评审的拼块，团队沟通成本往往更低。但当路由变多、页面变厚，**开发期**里和「样式扫描 / 生成 / 注入」相关的成本会浮上来——它不一定抢过巨型依赖图的风头，却足够让「改个 padding 都要等一拍」这种**微观挫败**反复出现。

这一期后面会用**同页双实现**把体感对齐到数字上；若需要隐喻画面，可用 **PictureMedia**（高质量乐高/拼图类静帧）或直接从 **VideoMedia** 实验画面里切一张复杂 Dashboard 静帧 1～2 秒，**不要**用糊截图顶替主轴。

（此处 **Signpost** 模板序列。）

---

<!-- 对应 scriptoutline Chapter 2 -->

## UnoCSS 不是「又一个 Tailwind」这句口号，到底指什么

**路标（Signpost）**：UnoCSS 不是 / 又一个 Tailwind / （空）

官网 slogan 是 **Instant On-demand Atomic CSS Engine**。翻译成工程语言就三句话：**源码里出现过的 class 才生成 CSS**；生成链路尽量短；规则可组合。和「内置一整套固定 utilities 的框架」相比，Uno 更偏 **规则引擎 + presets 拼装**：`preset-uno`、`preset-icons`、`preset-attributify` 等按需接入，团队能裁剪能力边界。

Tailwind 的生态成熟度是硬实力；这一期比较的是**工程路径与维护成本**，不是站队骂人。本章**不新增操作录屏**（与 `scriptoutline` 例外一致），以 **CodeExample** typewriter 为主；可选 **Feature** 三词：按需 / 即时 / 可插拔。

（此处 **CodeExample**：slogan + 配置骨架，上屏看 `presets` 一行。）

```txt
Instant On-demand Atomic CSS Engine
```

```ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true }),
  ],
  transformers: [transformerVariantGroup()],
})
```

---

<!-- 对应 scriptoutline Chapter 3 -->

## 同页双实现：让数据替你说话

**路标（Signpost）**：同页双实现 / 数据不骗人 / （空）

公平对比的底线就几句话：同一台机器、同一 Node / Vite、同路由同组件树、除样式栈外依赖尽量对齐；HMR 动作固定（例如 `p-4 → p-5`、同一文件内批量改一组布局 class）。否则「快」只是叙事，不是结论。

（此处 **VideoMedia（主）**：**整段使用已录制的对比实验成片**，成片路径同上：**`apps/living-projects/vue3-unocss-instant-atomic-css-engine/videos/compare-dashboard-hmr.webm`**；双工程并排：**左 UnoCSS、右 Tailwind**；口播指屏用「左边这组 / 右边这组」，与下表一一对应。）

（此处 **CodeExample（辅）**：上屏数据表，便于 Summary / 片尾资料卡同源。）

```markdown
| 指标 | 左 UnoCSS | 右 Tailwind |
|------|-----------|-------------|
| 首次加载 CSS | 22 KB | 48 KB |
| HMR CSS | 24 KB | 56 KB |
| HMR 耗时 | 9 ms | 28 ms |
```

把前提说死：扫描 glob、插件数量、自定义规则过重时，瓶颈会转移。建议你把自己的 **CPU / 内存、Node、Vite、Tailwind、UnoCSS 版本、commit** 写进仓库 README——比一句「快五倍」更能帮团队做决策。

---

<!-- 对应 scriptoutline Chapter 4 -->

## 两条集成链：为什么「右边」往往更重

**路标（Signpost）**：Tailwind 走 / PostCSS 长链 / Uno 更短

Tailwind 常见形态里，`@tailwind`、内容扫描、utilities 生成、PostCSS 插件链……每一步都成熟，也**每一步都有成本**。UnoCSS 在 Vite 里更常见的叙事是：**提取 class 候选 → 命中 presets / 自定义规则 → 输出 CSS**，路径更短——用来**解释**你在上一章看到的「左小右大」，而不是宣布「任何项目恒成立」。

（此处 **ExcalidrawChart**：叙事型双栏对照；**已生成** **`apps/living-projects/vue3-unocss-instant-atomic-css-engine/excalidraw-dev-chain-compare.excalidraw`**（可用 `scripts/gen_excalidraw_dev_chain.py` 再生成）。**左栏**：Uno 短链（Vite 提取 → preset → 输出 CSS）；**右栏**：Tailwind 长链（PostCSS / @tailwind → 扫描 utilities → 插件链）；底部框汇总 **HMR 与首包** 数字，读数 **左小右大**。带看顺序与 `scriptoutline` 第四章一致。）

（可选 **VideoMedia** 短切：若白板已讲透，可不再叠放整段实验。）

---

<!-- 对应 scriptoutline Chapter 5 -->

## Vue3 最小接入：从 `virtual:uno.css` 开始

**路标（Signpost）**：三行接入 / virtual:uno.css / 就能写

安装按团队习惯即可；图标示例会用到 Iconify 本地数据集，可与 `unocss` 一起装开发依赖。

（此处 **CodeExample** 分镜 1：`vite.config.ts`。本章**不强制新录屏**；若有旧素材可剪 **VideoMedia**，非必须。）

```bash
pnpm add -D unocss @iconify-json/carbon
```

```ts
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
})
```

（此处 **CodeExample** 分镜 2：`uno.config.ts` 核心 presets；`shortcuts` 见下一章。）

```ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true }),
  ],
  transformers: [transformerVariantGroup()],
})
```

入口一行挂上虚拟模块：

```ts
import 'virtual:uno.css'
```

接入前若开 `preset-attributify`，请对照 [UnoCSS Vite 集成说明](https://unocss.dev/integrations/vite) 核对与 Vue/JSX 解析相关的约束。

---

<!-- 对应 scriptoutline Chapter 6 -->

## 语法糖五连：少写重复、好查规则

**路标（Signpost）**：语法糖五连 / 少写重复 / 好查规则

下面五段都是「复制就能用」级别；口播密、上屏代码短。本章**不规划新 LivingCode 录屏**；可接 **Feature** 收束五个关键词：icons / shortcuts / attributify / variant groups / inspector。

**1）Pure CSS Icons（VideoMedia 无则仅 CodeExample）**

```vue
<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
  >
    <span class="i-carbon-add text-base" />
    新建
  </button>
</template>
```

**2）Shortcuts：把设计系统讲成团队单词**

```ts
shortcuts: {
  'btn-base': 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  'btn-primary': 'btn-base bg-indigo-600 text-white hover:bg-indigo-700',
  'btn-ghost': 'btn-base bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-900',
}
```

```vue
<button class="btn-primary">保存</button>
<button class="btn-ghost">取消</button>
```

**3）Attributify：密度挪到属性上（团队要统一规范）**

```vue
<template>
  <section
    class="ui-card flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    p="4"
    md:p="6"
  >
    <h2 class="text-base font-semibold text-gray-900 dark:text-white">今日概览</h2>
    <p class="ui-muted">同比、环比与告警摘要</p>
  </section>
</template>
```

**4）Variant Groups：前缀成组，减少漏改**

```vue
<template>
  <div class="rounded-lg border p-4 hover:(border-indigo-300 shadow-md) dark:(border-gray-800 bg-gray-950)">
    悬停与暗色模式样式成组，更不容易漏改。
  </div>
</template>
```

**5）Inspector**

（此处 **PictureMedia**：请将 UnoCSS Inspector 官方文档或本机界面 **高清截图** 存为 **`apps/living-projects/vue3-unocss-instant-atomic-css-engine/images/unocss-inspector.png`**；联网 `image_search` 本轮无可用结果，需人工落盘。若更省事可改 **CodeExample** 一行「如何打开 Inspector」的配置说明——择清晰者。）

---

## 总结（Summary，≤4 条，对齐 Remotion `items`）

- ⚡ **短反馈链**：同页实验（**左 Uno / 右 Tailwind**）首包 **22KB vs 48KB**、HMR **24KB vs 56KB**、**9ms vs 28ms**。
- 🧩 **按需拼装**：presets 裁剪能力边界，升级更可控。
- 🛠️ **写得少、查得快**：shortcuts / variant groups / inspector 降低重复与排障成本。
- ⚖️ **迁移算总账**：深度绑定 Tailwind 插件与 token 时别硬迁，新模块 PoC 更稳。

---

## Outro

UnoCSS「速溶」的是 **开发反馈回路**：改 class → 更快看见结果 → 规则来源更可追踪 → 团队能把重复沉淀成约定。但它**不**替你承担设计系统与生态迁移的全部责任。

我是**前端雨爸**（可按实际频道名替换）。如果你喜欢这种「把话说满前提、把数据摆上桌」的风格，欢迎三连与关注；评论区可以贴你们仓库的 **commit + 版本表**——我们下一期可以继续聊 **preset 选型** 或 **与组件库混用**。

（此处 **Outro** 模板。）

---

## 素材清单（remotion-prepare 本节交付）

| 类型 | 路径 | 状态 |
|------|------|------|
| **VideoMedia** | `apps/living-projects/.../videos/compare-dashboard-hmr.webm`（素材仓） / Remotion 使用 **`ai-remotion/public/topic/vue3-unocss-instant-atomic-css-engine/clips/compare-dashboard-hmr.webm`** | 成片请覆盖 **public** 路径（`segmentFrames.ch3Video` 与 `videoDurationInSeconds` 需与真实时长一致） |
| **ExcalidrawChart** | `apps/living-projects/.../excalidraw-dev-chain-compare.excalidraw`；Remotion 同步 **`ai-remotion/public/topic/vue3-unocss-instant-atomic-css-engine/excalidraw-dev-chain-compare.excalidraw`** | **已生成**（两处分源一致即可） |
| **PictureMedia** | `apps/living-projects/.../images/unocss-inspector.png`；Remotion 使用 **`ai-remotion/public/topic/vue3-unocss-instant-atomic-css-engine/images/unocss-inspector.png`** | 当前为 **占位图**，请替换为 Inspector 高清截图 |
| **LivingCode / 新录屏** | — | **本期跳过**（与 `scriptoutline` 例外一致） |

---

## 文稿自检（对照 blog-skill）

1. 以「看完这期视频」为主口径。  
2. 章节序号用 HTML 注释对齐 `scriptoutline`，可见标题未使用「第一章：」。  
3. 各 **CodeExample** 代码块均 ≤20 行；对比主轴为 **已有 VideoMedia**，非 PictureMedia 顶替。  
4. Chapter 3 为 **VideoMedia + CodeExample**；Chapter 4 为 **ExcalidrawChart** 占位；Ch2 / Ch5 / Ch6 与大纲一致为 **CodeExample** 为主、**不新增**对比实验录屏。  
5. Summary 恰好 4 条，便于 Remotion **Summary** 映射。
