# Cursor 禅道 Mock Server

本项目提供本地 HTTP Mock 接口，面向后续 MCP 封装。`/api.php/v2` 路径上的方法、参数、筛选枚举、资源名和成功响应遵循 `apps/living-projects/cursor-zhantao/zentao-api-docs` 中下载的禅道 RESTful API v2.0 手册。数据均为虚构，不连接公司禅道，也不包含真实账号。

## 启动

在仓库根目录运行：

```bash
pnpm dev:zhantao-mock-server
```

服务默认监听 `http://127.0.0.1:5183`。和 UI 一起启动：

```bash
pnpm dev:zhantao-mock-stack
```

Cursor 禅道 Mock Demo 运行于 `http://127.0.0.1:5182`，通过 Vite 代理把 `/api.php` 转发到 Mock Server。

## 已覆盖的 v2 接口

| 方法 | 路由 | 用途 |
| --- | --- | --- |
| `POST` | `/api.php/v2/users/login` | 获取本地 Mock Token |
| `GET` | `/api.php/v2/projects` | 项目列表，供工作台和 Dashboard 组合查询 |
| `GET` | `/api.php/v2/products` | 产品列表 |
| `GET` | `/api.php/v2/executions` | 执行列表 |
| `GET` | `/api.php/v2/executions/{executionID}/tasks` | 执行任务列表；支持文档筛选、排序、分页 |
| `GET` | `/api.php/v2/tasks/{taskID}` | 任务详情路径 |
| `GET` | `/api.php/v2/products/{productID}/stories` | 产品研发需求列表，可筛选待我评审并用于 Dashboard 计数 |
| `GET` | `/api.php/v2/products/{productID}/requirements` | 产品用户需求列表，可筛选待我评审并用于 Dashboard 计数 |
| `GET` | `/api.php/v2/products/{productID}/testcases` | 产品用例列表，用于 Dashboard 计数 |
| `GET` | `/api.php/v2/products/{productID}/bugs` | 产品 Bug 列表；支持文档筛选、排序、分页 |
| `GET` | `/api.php/v2/projects/{projectID}/bugs` | 项目 Bug 列表；支持文档筛选、排序、分页 |
| `POST` | `/api.php/v2/bugs` | 创建 Bug；必填 `productID`、`title`、`openedBuild`，成功返回新 ID |
| `GET` | `/api.php/v2/bugs/{bugID}` | Bug 详情 |
| `PUT` | `/api.php/v2/bugs/{bugID}` | 修改文档允许的 Bug 字段 |
| `PUT` | `/api.php/v2/bugs/{bugID}/resolve` | 解决 Bug |
| `PUT` | `/api.php/v2/bugs/{bugID}/close` | 关闭 Bug |
| `PUT` | `/api.php/v2/bugs/{bugID}/activate` | 激活 Bug |

除登录外，请求头必须带 `token`。示例：

```http
POST /api.php/v2/users/login
Content-Type: application/json

{"account":"frontend","password":"demo-only"}
```

登录返回 `{"status":"success","token":"mock-..."}`；后续请求带 `token: mock-...`。Mock 服务仅验证本进程签发的 Token，密码不校验真伪。

## MCP 与 Demo 的边界

- MCP 应调用上表中的 v2 路由，不依赖 Demo 的私有接口。
- 官方手册没有单独的个人 Dashboard 汇总接口。Demo 通过项目、产品、执行、任务、Bug、需求和用例等标准列表接口组合计算 Dashboard 面板；MCP 也可按需组合调用。这属于调用方视图，不是禅道 API 响应。
- 官方“获取任务详情”页面（090）当前只列出 `status` 响应，没有定义 `task` 对象。该路径按当前文档返回 `{"status":"success"}`。若 MCP 需要任务字段，现阶段从执行任务列表中按 ID 查找；要让该路径返回任务对象，需先有禅道官方更新文档或权威响应样例，不能自行扩充官方契约。
- Bug 写接口的成功响应只返回文档规定的 `{"status":"success"}`。操作会更新进程内合成数据，使后续 Bug 列表和详情读取到新状态；重启后恢复初始数据。
- 创建 Bug 遵循官方 `POST /bugs` 的请求与 `{status,id}` 响应。Mock 为新 Bug 默认指派 `frontend`，并把新增记录保存在本地 `.created-bugs.json` 中，以便开发服务重启后继续用于录制；该指派规则与保存方式仅属于 Mock。现有 Bug 的修改、解决、关闭、激活仍只保存在进程内。
- 解决、关闭和激活时提交的 `comment` 会保存在进程内操作历史中。Demo 页面通过私有只读接口 `GET /api.php/mock/bugs/{bugID}/history` 展示历史记录；此接口不属于禅道 v2 契约，MCP 不应调用。种子数据中 Bug 11911 已按录制示例标记为已解决，并保留用户提供的修复备注。
- 列表记录只投影到该 API 文档声明的字段，避免把 Demo 的显示辅助字段带入 API。页面需要友好名称时，在前端映射。
- 当前 Token、创建数据保存、权限和错误语义为本地模拟，不可用于真实环境。

## 对应规范与差异记录

- [RESTful API v2.0 文档目录](../zentao-api-docs/docs/restful-api-v2.0/README.md)
- [MCP 能力分析](../zentao-api-docs/MCP-CAPABILITY-ANALYSIS.md)
- [接口差异与实现计划](./msw-plan.md)
