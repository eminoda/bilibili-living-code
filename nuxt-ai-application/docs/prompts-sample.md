## Prompt 1：聊天界面

```text
你现在是一名 Nuxt 工程师。

请先检查当前项目状态、package.json、Nuxt 版本和现有文件，先列出计划修改的文件，再开始修改。当前项目从空目录通过 Nuxt 官方 CLI 初始化完成，请不要重新初始化项目，也不要修改 package.json、nuxt.config.ts 或无关目录。

目标：在当前 Nuxt 项目中建立一个清晰、可运行、模拟 ChatGPT 网页体验的 Chat 页面基础结构。

视觉要求：

- 页面占满视口，整体保持简洁、克制、留白充足。
- 左侧使用窄侧边栏，包含应用名称、新建对话按钮和历史对话占位区域。
- 主聊天区域居中，并限制内容最大宽度，适合连续阅读。
- Assistant 消息采用正文式排版，不使用夸张的传统聊天气泡。
- User Message 使用轻量气泡或低对比度背景区分。
- 底部输入区域固定或 sticky 在主内容底部。
- 空状态显示欢迎语和 2–3 个简洁的示例问题。
- 不要做成后台管理系统风格，不使用大量卡片、渐变、装饰性插画或复杂边框。
- 只模拟常见 ChatGPT 类网页的布局和使用体验，不复制具体品牌 Logo、商标或产品资产。

请创建或补充以下文件：

- app/pages/index.vue
- app/components/chat/ChatShell.vue
- app/components/chat/MessageList.vue
- app/components/chat/ChatComposer.vue
- app/types/chat.ts

实现要求：

1. 使用 Vue 3、Nuxt、Composition API 和 <script setup lang="ts">。
2. 页面只负责组合 ChatShell，不要把完整聊天实现全部堆在 index.vue。
3. ChatShell 负责页面布局；MessageList 负责消息展示；ChatComposer 负责输入框和发送事件。
4. 页面包含窄侧边栏、顶部区域、空状态、2–3 个示例问题、消息列表、多行 textarea 和 Send 按钮。
5. 定义基础 ChatMessage 类型：

   {
     id: string,
     role: "user" | "assistant",
     content: string
   }

6. 本阶段只使用本地静态消息或空数组展示 UI，不创建 useChat，不调用 /api/chat。
7. 不实现真实发送、Loading、Streaming、SSE、Stop、Retry、Regenerate、Markdown Parser、AI SDK 或真实 LLM。
8. 不引入 UI 框架、Pinia 或外部网络请求。
9. 为关键元素添加稳定选择器：chat-shell、message-list、chat-input、send-button、empty-state。
10. 保持 1280×720 桌面布局稳定，并支持基本响应式。
11. 使用安全文本渲染，不使用不安全的 v-html。
12. 使用 scoped CSS；Props 和 Emits 使用类型声明；列表使用稳定 key；不要把多个独立 UI 区域和状态逻辑堆在单个页面文件中。

完成后：

- 执行 pnpm typecheck；如果该命令不可用，执行 pnpm exec nuxt typecheck 或 pnpm exec vue-tsc --noEmit。
- 报告实际修改的文件、每个文件的职责和真实检查结果。
- 明确列出当前尚未实现的能力。
```

## Prompt 2：聊天状态管理
```text
请先检查当前项目状态和已有聊天文件，列出准备修改的文件。只修改实现本阶段目标所需的文件，不要修改 package.json、nuxt.config.ts 或无关目录。

目标：让当前 Chat 页面拥有最小、可预测的本地聊天交互状态，但暂时不要连接 Server API。

请创建或补充：

- app/composables/useChat.ts
- app/types/chat.ts
- app/pages/index.vue
- 必要时修改 app/components/chat/ChatShell.vue、app/components/chat/MessageList.vue、app/components/chat/ChatComposer.vue

实现要求：

1. 使用 useChat 管理 messages、input、status 和 errorMessage。
2. 本阶段 status 至少支持："idle"、"complete"、"error"；真正的 loading 状态在连接 Server API 后再加入。
3. 点击 Send 时：
   - 空输入不发送；
   - 添加一条 user message；
   - 清空 input；
   - 将本地消息状态更新为 complete。
4. 因为本阶段没有 Server API，发送后只显示“等待服务端连接”或类似的明确占位状态；不要生成假的 assistant 答案，也不要让真实业务状态停留在无法结束的 loading。
5. 支持 Enter 发送、Shift+Enter 换行、发送期间禁止重复提交和自动滚动到底部。
6. 遵循 Props Down / Events Up，保持 ChatShell、MessageList、ChatComposer 的职责边界。
7. 不调用 /api/chat，不创建 server 目录文件。
8. 不实现 Streaming、SSE、ReadableStream、setInterval 打字动画、AbortController、Stop、Retry、Markdown、AI SDK 或真实 LLM。
9. 保留 data-testid：chat-shell、message-list、chat-input、send-button、assistant-message、empty-state。
10. MessageList 支持长内容滚动；ChatComposer 的 textarea 根据内容增长但保持合理最大高度；User Message 和 Assistant Message 有清晰但克制的视觉区分。
11. Empty State 只在没有消息时显示；发送后自然切换到消息列表；状态变化不通过修改 DOM 的方式绕过 Vue 响应式。
12. 让 composable 对外暴露只读状态和明确的发送 action，避免组件直接修改内部消息数组。
13. 滚动属于副作用，使用明确的 template ref 与 watcher / nextTick 处理，不在 computed 中执行 DOM 操作。

完成后：

- 执行 pnpm typecheck；如果该命令不可用，执行 pnpm exec nuxt typecheck 或 pnpm exec vue-tsc --noEmit。
- 报告修改文件、状态数据流和真实检查结果。
- 不要伪造 API 返回，也不要把 Loading 写成逐字动画。
```

## Prompt 3：Mock 聊天 API
```text
请先检查当前项目状态、app/composables/useChat.ts、app/types/chat.ts 和现有聊天组件，列出计划修改的文件，再开始修改。

目标：在当前 Nuxt 项目中增加第一个普通 HTTP Chat API，并把聊天状态连接到它。

请创建或补充：

- server/api/chat.post.ts
- app/composables/useChat.ts
- app/types/chat.ts
- 必要时只修改 app/pages/index.vue 或 app/components/chat/*

Server API 要求：

1. 创建 POST /api/chat。
2. 请求 JSON 使用：

   { "prompt": "用户输入内容" }

3. 对缺失、空白或非法 prompt 返回 400。
4. 暂时不调用真实 LLM、Provider、外部网络、API Key、AI SDK 或任何模型服务。
5. 服务端等待约 800ms，然后返回普通 JSON，例如：

   {
     "message": "因为 Nuxt 保留了 Vue 的开发体验，同时提供 server/api 这样的服务端能力。我们可以从熟悉的页面出发，逐步走进 AI Application。"
   }

6. 不设置 text/event-stream，不使用 ReadableStream、EventSource、SSE、setInterval 或 AbortController。

前端要求：

1. send 使用 $fetch 或 fetch 调用 /api/chat，并发送 { prompt: text }。
2. 请求期间显示普通 Loading，禁止重复发送。
3. 只有完整 JSON 返回后，才添加 assistant message；必须读取接口返回的 response.message 并将该字段作为 assistant message 渲染，不得在前端预先写死回答；不要逐字追加内容。
4. 请求失败时显示 errorMessage，并提供基础的重新发送入口或清晰错误提示。
5. 保持已有 ChatShell、MessageList、ChatComposer、useChat 的职责边界。
6. 不使用前端硬编码答案绕过接口请求。
7. Server Route 使用 defineEventHandler，只依赖服务端代码；不要从 app/ 导入组件或 composable。
8. 客户端交互请求优先使用 Nuxt $fetch，请求与响应类型保持明确。

完成后必须执行并报告真实结果：

- pnpm typecheck
- pnpm build
- 启动开发服务器后，用真实 POST 请求验证 /api/chat 的状态码、请求字段和 JSON 响应
- 浏览器验证发送、Loading、完整 Assistant 响应和错误状态

最后明确列出当前仍未实现的能力：Streaming、SSE、真实 LLM、AI SDK、Stop、Retry 和 Markdown。
```

## Prompt 4：迁移旧接口

```text
请检查当前 Nuxt Chat Application，重点查看：

- app/components/chat/ChatComposer.vue
- app/components/chat/ChatShell.vue
- app/pages/index.vue
- app/composables/useChat.ts
- app/types/chat.ts
- server/api/chat.post.ts

当前项目已经有一个可以调用普通 JSON Chat API 的发送按钮。现在只准备本章后续的对比录制，不要实现 Streaming。

目标：将当前普通 JSON Chat 接口调整为旧版本接口，并将当前发送按钮保留为“发送”，只调整为灰色样式。

要求：

1. 先检查当前项目结构，再列出准备修改的文件。
2. 将当前普通 JSON 接口从 server/api/chat.post.ts 调整为旧版本接口 server/api/legacy-chat.post.ts，对应 /api/legacy-chat。
3. 更新 app/composables/useChat.ts，让现有发送逻辑调用 /api/legacy-chat。
4. 保留当前发送按钮文案“发送”，只使用灰色或低对比度样式，但保持可点击和可用。
5. 保留现有输入框、Enter 发送和 Shift+Enter 换行体验。
6. 不实现 Streaming，不新增 Streaming 按钮，不添加假数据、打字动画或前端延迟。
7. 不修改无关文件，不安装依赖，不接入真实 LLM 或 AI SDK。

完成后执行 pnpm typecheck，并报告实际修改文件和接口调整结果。
```

## Prompt 5：让 Server 流起来

```text
请检查当前 Nuxt Chat Application，先列出计划修改的文件。重点查看：

- server/api/chat.post.ts
- app/composables/useChat.ts
- app/types/chat.ts
- app/pages/index.vue
- app/components/chat/ChatShell.vue
- app/components/chat/MessageList.vue
- app/components/chat/ChatComposer.vue

当前项目已经由 Nuxt 官方 CLI 初始化完成，已有 ChatGPT 风格 UI 和普通 HTTP Chat。不要重新初始化项目，不要修改 package.json、nuxt.config.ts 或无关文件。

目标：在旧版本接口 /api/legacy-chat 之外，新增 POST /api/chat 作为确定性的 Mock Streaming Response。本阶段把“流式发送”按钮接到这个接口，但不实现 Browser 的流式读取。

要求：

1. 保留 POST /api/legacy-chat 的现有普通 JSON 行为，不要破坏“发送”按钮。
2. 新增 POST /api/chat，并继续使用请求字段 { "prompt": "用户输入" }。
3. 对缺失、空白或非法 prompt 返回 400。
4. /api/chat 使用 Content-Type: text/event-stream; charset=utf-8。
5. 按顺序发送这些 SSE 事件，每条事件使用 data: <JSON>\n\n：
   - { "type": "start" }
   - 多个 { "type": "delta", "content": "..." }
   - { "type": "done" }
6. delta 内容组成一段贴近 Nuxt / AI Application 主题的完整回答，例如：
   “Nuxt 是 Vue 的全栈框架，可以让我们从熟悉的页面开发逐步走进 AI Application。”
7. 每个 delta 之间等待约 300–500ms，确保可以真实观察到多次数据到达。
8. 不调用真实 LLM、Provider、API Key 或外部网络。
9. 可以在 app/ 中新增“流式发送”按钮并连接到 /api/chat，但不实现 response.body.getReader()、逐段解析或消息追加。
10. 不使用 setInterval、CSS animation 模拟前端打字效果，也不引入 AI SDK。
11. 服务端只使用 Nuxt / Nitro Server 能力，不从 server/ 导入 Vue 组件或 composable。
12. 不需要扩展 Stop、Retry、Markdown 或复杂状态机。
```

## Prompt 6：让 Browser 读懂流

```text
请继续基于当前已经可以返回 Mock Streaming 的 POST /api/chat，不要重新设计 Server 协议。POST /api/legacy-chat 仍然是“发送”使用的普通 JSON 接口。

先检查并列出计划修改的文件，重点查看：

- app/composables/useChat.ts
- app/types/chat.ts
- app/pages/index.vue
- app/components/chat/ChatShell.vue
- app/components/chat/MessageList.vue
- app/components/chat/ChatComposer.vue
- server/api/chat.post.ts
- server/api/chat.post.ts

目标：让 Browser 真正消费 /api/chat 返回的 Mock SSE，并把每个 delta 追加到同一条 assistant message 中。

要求：

1. 在 app/composables/useChat.ts 中使用 fetch 请求 /api/chat，并从 response.body 获取 ReadableStream。
2. 使用 response.body.getReader() 持续读取数据，使用 TextDecoder 解码字节。
3. 维护字符串 buffer。不能假设一次 reader.read() 就是一条完整 SSE 事件；要正确保留和拼接不完整内容。
4. 按空行边界解析 data: JSON\n\n 事件，并处理 start、delta、done、error。
5. start 创建当前 assistant message，并进入 streaming 状态。
6. delta 只更新同一条 assistant message 的 content，不能每个 chunk 创建一条新消息。
7. done 将消息状态改为 complete，连接结束后清理读取状态。
8. error 显示清晰错误并结束本次请求。
9. User Message 发送后立即出现，Assistant 内容随着真实网络数据到达逐步增长。
10. 新内容到达后自动滚动到底部。
11. 保留现有 ChatGPT 风格 UI 和组件职责：页面负责组合，composable 负责状态与副作用，组件负责展示和事件。
12. 不使用 setInterval、CSS animation 或预先写好的完整答案模拟打字效果。
13. 不接真实 LLM，不安装 AI SDK，不实现 Stop、Retry、Regenerate 或复杂历史记录。
```

## Prompt 7：扩展基本交互

```text
当前 Mock Streaming 已经可以正常工作。现在请补齐 Streaming Chat 的基本可操作能力，不要重构现有 Streaming 协议，也不要扩展到复杂产品功能。

先列出计划修改的文件。优先检查：

- app/composables/useChat.ts
- app/types/chat.ts
- app/components/chat/ChatShell.vue
- app/components/chat/ChatComposer.vue
- server/api/chat.post.ts

要求：

1. 在 useChat 中使用 AbortController 管理当前 Streaming fetch。
2. Streaming 状态时显示 Stop 按钮。
3. 点击 Stop 时真正 abort 当前请求，保留已经收到的 assistant 内容，并将当前消息状态设为 stopped。
4. 正常收到 done 时将状态设为 complete。
5. 记录最近一次发送的问题，提供 Retry 操作。
6. 点击 Retry 时重新请求该问题，并创建新的 assistant message，不能污染旧消息。
7. 处理 HTTP 非 2xx、SSE error 事件和读取异常，显示清晰错误状态，并允许 Retry。
8. Stop、complete 或 error 后允许发送新消息，不能把下一次请求追加到上一条 assistant message。
9. 按照主流 ChatGPT 类聊天应用的交互习惯放置状态操作：
   - streaming：在底部输入区的发送按钮位置切换为 Stop，不额外增加一个突兀的全局按钮；
   - complete：输入区恢复为 Send，不显示干扰阅读的状态标签；
   - error：在对应的 Assistant 消息附近显示错误提示和 Retry 操作，不只在页面顶部显示全局错误；
   - stopped：保留已经收到的内容，并在对应消息附近给出轻量的已停止反馈。
10. Retry 应该重新发送对应的用户问题，并创建新的 assistant message；不能把新回答追加到旧消息中。
11. Streaming 时禁止重复发送；Stop、Retry、Complete 和 Error 后都要正确恢复输入区按钮状态。
12. 保持现有 ChatGPT 风格 UI、组件边界、类型约束和安全文本渲染。
13. 不实现 Regenerate、复杂历史记录、Markdown Parser、真实 LLM 或 AI SDK。
14. 不使用 setInterval 或 CSS animation 模拟 Streaming。
```

## Prompt 8：准备 DeepSeek Provider

```text
请基于当前 Nuxt Chat Application 准备真实 DeepSeek 调用。先检查并列出计划修改的文件，重点查看：

- nuxt.config.ts
- .gitignore
- package.json
- server/api/chat.post.ts
- server/api/legacy-chat.post.ts

当前项目已经有 ChatGPT 风格 UI、普通 JSON 接口和 Mock SSE 接口。浏览器已经可以消费 /api/chat 的 start、delta、done、error 事件。本次只准备真实 Provider，不要修改 /api/chat 的 Mock 行为，也不要修改 app/ 下的浏览器流式读取逻辑。

目标：按照 DeepSeek 官方文档的 OpenAI-compatible Node.js 方式，创建安全的配置和服务端 Provider 封装。

要求：

1. 在当前 Nuxt 项目目录执行 `pnpm add openai`，安装官方 OpenAI Node.js SDK。不要在 monorepo 根目录误装，不要安装 AI SDK，不要自行寻找其他 DeepSeek SDK。
2. 创建或更新 .env.example，内容至少为：
   - NUXT_DEEPSEEK_API_KEY=replace-with-your-key
   - NUXT_DEEPSEEK_BASE_URL=https://api.deepseek.com
   - NUXT_DEEPSEEK_MODEL=deepseek-v4-flash
3. 确认 .gitignore 忽略真实的 .env 和本地环境文件；不能把真实 API Key 写入代码、示例文件、日志或提交内容。
4. 在 nuxt.config.ts 中配置私有 runtimeConfig：deepseekApiKey、deepseekBaseUrl、deepseekModel。不要放进 runtimeConfig.public。
5. 在 `server/utils/deepseek.ts` 或 `server/lib/deepseek.ts` 创建 DeepSeek Provider 文件，使用 OpenAI SDK 初始化：apiKey 来自私有 runtimeConfig，baseURL 来自 deepseekBaseUrl。
6. 导出一个明确的 `createDeepSeekStream(messages)` 方法，输入为 OpenAI Chat Completions 兼容的 messages，返回 `AsyncIterable<ChatCompletionChunk>`；方法内部调用 `openai.chat.completions.create({ model, messages, stream: true })`，model 必须来自 runtimeConfig。
7. Provider 只能在 server/ 使用，app/ 不能导入 OpenAI SDK，也不能读取 API Key。
8. 对配置缺失提供清晰但安全的错误，不要输出 API Key 或完整请求配置。
9. 保留 /api/legacy-chat 和 /api/chat 的现有行为；暂时不接入 Provider，不修改 UI。
10. 完成后报告实际修改文件、安装的依赖、`createDeepSeekStream` 的输入输出，以及下一步如何由 /api/chat 调用它。
```

## Prompt 9：让 Chat 接上真实模型

```text
请继续基于当前 Nuxt Chat Application 实现真实 DeepSeek Streaming Chat。现在已经有服务端 DeepSeek Provider 封装，但 /api/chat 仍然返回 Mock SSE。不要重新设计 UI，不要引入 AI SDK，也不要修改浏览器端已经验证过的 SSE Reader。

先检查并列出计划修改的文件，重点查看：

- server/api/chat.post.ts
- server/utils/ 或 server/lib/ 下的 DeepSeek Provider
- app/composables/useChat.ts
- app/types/chat.ts
- app/components/chat/ChatComposer.vue
- app/components/chat/MessageList.vue

目标：让 /api/chat 调用服务端 Provider，将 DeepSeek 的真实增量结果转换成现有 start、delta、done、error SSE 事件；浏览器直接展示真实模型回答。

要求：

1. 让 server/api/chat.post.ts 调用已经封装好的 Provider，不要在路由中重复初始化 OpenAI Client。
2. 保持当前客户端的 `{ "prompt": "用户输入" }` 请求格式；服务端将 prompt 转换为最小的 user message。如果当前客户端已经传入 messages，可以兼容它，但不要强制重写浏览器请求结构。服务端必须重新校验 role 和 content，不能盲目信任客户端。
3. 调用 Prompt 1 导出的 `createDeepSeekStream(messages)`，不要在路由中再次调用 OpenAI SDK；Provider 内部使用 runtimeConfig 中的 model 和 `stream: true`，路由只负责将 Provider chunk 转换为应用内部的 `delta.content`。
4. 保持 SSE 事件顺序：开始发送 start，有文本时发送多个 delta，正常结束只发送一次 done，异常只发送一次 error。
5. 正确设置 text/event-stream、no-cache 和连接保持所需的响应头；不要用 setInterval、CSS animation 或预先写好的答案模拟输出。
6. 处理 API Key 缺失、请求参数非法、Provider 非 2xx、上游超时、空 chunk、解析异常和读取异常；返回安全、简洁的 error 事件，不泄露 API Key、请求头、完整上游响应或内部堆栈。
7. 保持 app/composables/useChat.ts 的 getReader、TextDecoder、buffer 和同一条 assistant message 追加逻辑；只有发现明确兼容问题时才修改。
8. 保持已有的 Stop、Retry、Complete、Error 状态可用；只修复真实 Provider 接入后暴露的状态映射问题，不重新设计这些交互。
9. 如果当前应用已有消息历史，保留必要的 user、assistant、system messages；服务端只允许明确支持的角色，不把服务端配置作为消息发送给模型。不要为了增加多轮对话而重写已有消息状态。
10. 不再在界面展示 /api/legacy-chat 对应的灰色按钮；可以保留 legacy-chat 接口文件作为旧实现，但页面只保留真实 Streaming Chat 的发送入口。
11. 不新增数据库、登录、Markdown Parser、Tool Calling、RAG 或 AI SDK；保持页面和组件职责不变。
12. 完成后执行项目已有的类型检查和构建检查，并报告实际修改文件、真实请求路径、SSE 适配过程和异常处理结果。
```

## Prompt 10：按官方文档安装 AI SDK

```text
请先阅读当前版本的 Vercel AI SDK 官方文档，重点查看：

- Nuxt / Vue Getting Started 或 Quickstart
- AI SDK Core 的 streamText
- DeepSeek Provider
- AI SDK Vue 的 Chat / transport

然后检查当前 Nuxt Chat Application，重点查看：

- package.json
- nuxt.config.ts
- .env.example
- server/api/chat.post.ts
- app/composables/useChat.ts

目标：把“查看 Quickstart、安装依赖、确认版本和检查现有项目”作为一个连续 Prompt 完成，不要在本 Prompt 迁移现有聊天业务。

要求：

1. 以当前官方文档和当前项目 Node / Nuxt 版本为准，不要照搬旧版 API。
2. 在 Nuxt 应用根目录使用 pnpm 安装本章实际需要的最小依赖：`ai`、`@ai-sdk/deepseek`、`@ai-sdk/vue`；不要在 monorepo 根目录误装，也不要安装工具调用、MCP、RAG 或其他 Provider 包。
3. 安装前先说明每个依赖的职责；安装后报告实际版本，并确认三个包的主版本彼此兼容。
4. 不要修改 /api/legacy-chat、/api/chat、app/ 组件、useChat 业务逻辑或页面视觉。
5. 不要把 API Key 写入 package.json、代码、终端输出或任何提交文件。
6. 保留现有 .env.example 和 Nuxt 私有 runtimeConfig；如果官方 Provider 默认环境变量与当前命名不同，只说明差异，不要破坏现有安全配置。
7. 完成后执行项目已有的类型检查或构建检查，确认仅安装依赖不会破坏项目；不要为了通过检查修改业务代码。

```

## Prompt 11：完成 AI SDK Chat 迁移

```text
请基于当前 Nuxt Chat Application，按照当前版本 Vercel AI SDK 官方 Nuxt / Vue Quickstart 完成一次完整迁移。先检查现有代码并列出计划修改的文件，再开始修改。

重点查看：

- server/api/chat.post.ts
- server/api/legacy-chat.post.ts
- server/utils/ 或 server/lib/ 下的 Provider 适配代码
- app/composables/useChat.ts
- app/types/chat.ts
- app/pages/index.vue
- app/components/chat/ChatShell.vue
- app/components/chat/MessageList.vue
- app/components/chat/ChatComposer.vue
- nuxt.config.ts
- .env.example
- package.json

当前状态：

- Chapter 06 已经可以调用真实 DeepSeek 并通过手写 SSE 流式显示回答。
- 浏览器端目前使用自定义 Reader、TextDecoder、buffer 和消息状态管理。
- /api/legacy-chat 保留普通 JSON 行为，作为旧版对照。
- DeepSeek API Key 已通过 Nuxt 私有 runtimeConfig 管理。

目标：让 AI SDK 直接替代 Chapter 06 的手写 Provider、流式协议和客户端 Chat 状态，实现一个可以真实对话的 ChatGPT 风格页面。`/api/legacy-chat` 只作为旧版对照，不参与 AI SDK Chat 状态。

要求：

1. 严格依据当前已安装版本的官方文档实现。当前版本如果使用 `@ai-sdk/vue` 的 Chat class、`DefaultChatTransport` 和 message parts，就使用这些 API；不要使用已经过时的 `useChat` 示例。
2. 服务端使用 `@ai-sdk/deepseek` 创建 DeepSeek 模型，使用 `ai` 的 `streamText` 执行流式生成。根据当前项目的 Nuxt 私有 runtimeConfig 显式传入 API Key、Base URL 和 Model，不把配置交给客户端。
3. 先改 `server/api/chat.post.ts`：让它接收 AI SDK UI Chat 发送的 `messages`，按当前官方文档将 UI messages 转换为 model messages；不再要求 AI SDK Chat 发送旧的 `{ prompt }` 结构。
4. 服务端使用 AI SDK 官方 UI stream response 方法返回客户端需要的协议；不要继续手写 `start`、`delta`、`done`、`error` SSE 协议，也不要把 DeepSeek 原始 chunk 发送给浏览器。
5. 再改客户端：使用 `@ai-sdk/vue` Chat 和官方 transport 连接 `/api/chat`，让 SDK 管理 messages、sendMessage、status、error、stop 以及当前版本支持的 retry / regenerate 能力。
6. 将现有消息展示适配 AI SDK UI message 的 `parts` 结构，至少正确渲染 text part；保留现有消息气泡、空状态、自动滚动和页面布局。
7. 保留现有输入体验：发送、Enter 发送、Shift+Enter 换行；Streaming 时显示 Stop，完成后恢复发送，失败时在对应消息附近提供 Retry 或当前版本对应的重新生成操作。
8. 最后清理迁移遗留：删除或停止使用已经被 AI SDK 替代的手写 Reader、TextDecoder、SSE buffer、自定义 Provider chunk 类型和重复状态机，避免两套逻辑同时更新消息。
9. 保留 `/api/legacy-chat` 和灰色“发送”按钮作为普通 HTTP 对照；它不接入 AI SDK Chat 状态。流式“发送”使用 AI SDK 迁移后的 `/api/chat`。
10. API Key 只能在 `server/` 和 Nuxt 私有 runtimeConfig 中使用，不能进入 `app/`、`runtimeConfig.public`、HTML、响应体或日志。
11. 对空输入、配置缺失、上游错误、网络断开和用户 Stop 做安全处理；错误信息不能暴露 API Key、请求头或上游堆栈。
12. 不增加 Tool Calling、MCP、RAG、数据库、登录、复杂持久化或 Markdown Parser；本 Prompt 只完成 AI SDK Chat Application。
13. 完成后执行项目已有的类型检查和构建检查，并报告实际新增、删除和保留的文件。

最后请用简短说明回答：迁移后，哪些职责由 AI SDK 统一承担？如果将 DeepSeek 换成另一个 AI SDK Provider，页面是否需要修改？
```