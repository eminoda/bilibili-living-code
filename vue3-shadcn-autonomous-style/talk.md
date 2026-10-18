# 口播稿 · Vue3+Shadcn：自主掌控！样式「说变就变」

- **topic**：`vue3-shadcn-autonomous-style`
- **成片**：`ai-remotion` Composition `Vue3ShadcnAutonomousStyles`（`Series` 见 `sequenceData.ts`；表格为 `tableVideo` → `pictureTanstackTable` → `codeTableViewImports` → `codeTableViewUseVueTable`）

<!-- 正文供 TTS 时请先剥离 HTML 注释与本元信息区。 -->

<!-- talk-block: coldOpenVideo -->

在 Ant Design 里，按钮组件大家都不陌生，而要实现一个圆角的绿色按钮你会怎么做？

<!-- talk-block: coldOpenCode -->

Ant Design 开箱即用，但要对样式做个性化修改，往往就是「deep 穿透」，要么就是「important 提权」。

<!-- talk-block: coldOpenVideo -->

“便宜的永远是最贵的”，因为如果项目遍地这样改样式，几乎不可能沉淀一套可复用的主题设计，把你牢牢困在 node modules 里，屎山越堆越大。

---
---

<!-- talk-block: intro -->

这期我们结合 Vue3 和 Shadcn，沿着“掌控源码 + headless无头设计 + 令牌化主题”这条路线，让样式真的说变就变。看完这个视频，让你从新高度出发，除了 Ant Design 外，还有另一种选择。

---
---

<!-- talk-block: sign1 -->

什么是 shadcn？一套可自定义、扩展和构建的无头设计体系。那怎么用呢？

<!-- talk-block: pictureMedia -->

不用担心，在 Vue 社区移植了一个 shadcn vue 库，可以帮你快速集成 shadcn 组件库。

<!-- talk-block: codeShadcnInstall -->

就两条命令：先 `init` 安装 shadcn vue 命令，再 `add` 你需要的组件，比如 button 和 card 组件。

<!-- talk-block: ownershipVideo -->

组件下载后，便能在代码组件目录 ui 里看到 `button`、`card` 组件，他们不是 node modules 里的黑盒，而是你自己的源码。我们可以将他们改成任何我们想要的样子。

<!-- talk-block: codeOwnershipButtonVariants -->

先看 **button variants**，通过 `CVA` 一种样式合并工具，将按钮的基础样式和 `variant`、`size` 变量组装成一个对象。

<!-- talk-block: codeOwnershipButtonVue -->

先看 **`button` 组件**，导出 **button Variants** 变量，通过 `cn` 函数将 **button Variants** 和外部 `class` 拼在一起。只要通过 `props` 传入 `variant`、`size`，就能控制按钮的样式。

<!-- talk-block: codeOwnershipViewImports -->

最后，在需要使用按钮的地方，直接 `import` 组件，并传入 `variant`、`size` 即可。就这样，你拥有了一个可以自由定制的按钮组件。

---
---

<!-- talk-block: sign2 -->

在 Ant Design 里，你会怎么实现“暗黑主题”？在 Shadcn 里，你可以用 theme 变量，搭配 Tailwind 的 `dark` 类，来实现一键切换。

<!-- talk-block: codeCva -->

还记得在前面设计的 **button Variants** 吗？他其实是一堆 Tailwind 类的集合，通过 `cva` 函数将他们组装成一个对象。

<!-- talk-block: codeThemeView -->

使用瑞士军刀 VueUse，**用 Color Mode 这个组合式函数**，点击按钮，往 html 上挂载 `dark` 类，从而触发样式切换。

<!-- talk-block: codeStyleHtmlDark -->

在全局样式里，比如 `style css` 中，把 shadcn 的 **同一批变量名**换成暗色 **欧 K L C H 色彩**。

---
---

<!-- talk-block: themeVideo -->

组件变量不变，换的只是设计语言 **token**，不是每个组件都手改 class。这不是魔法，而是可以沉淀的令牌体系。

<!-- talk-block: sign3 -->

看了 Shadcn 组件，素的不行，他难道只提供 UI 情绪价值？

<!-- talk-block: tableVideo -->

你先看下这个 Table 组件，是不是一点也不逊色？

<!-- talk-block: pictureTanstackTable -->

这离不开 **headless** 设计思想，我们之前讲过 TanStack Query，整个 TanStack 生态还有 Table，Form，花点时间研究他们可比 Ant Design 功能丰富。

<!-- talk-block: codeTableViewImports -->

我们可以从 **tanstack vue table** 挑选任何有关的表格 API。

<!-- talk-block: codeTableViewUseVueTable -->

比如**用 Vue Table 这个组合式函数**，我们可以配置数据源，列定义，状态管理，排序，分页，行模型等。打磨一套你自己的组件库，不再担心 Ant Design 不更新，而是自己说了算。

---
---

<!-- talk-block: summary -->

总结：第一，**本地源码**——告别 node modules 黑盒，直接对接源码。第二，**变体 + 主题**——`cva` + `variant` 把样式对象化，有迹可循。第三，**生态拼接**——只要是 **headless** 设计，就能和 Shadcn 丝滑结合。

---
---

<!-- talk-block: outro -->

是继续 Ant Design 搬砖，还是用 Shadcn 做个创造者？如果这期对你有启发，欢迎在评论区聊聊。关注前端雨爸，我们下期见。
