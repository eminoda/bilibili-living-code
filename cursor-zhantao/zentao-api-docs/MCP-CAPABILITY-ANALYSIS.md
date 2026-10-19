# 禅道 RESTful API v2.0：面向 MCP 工作流的初步分析

> 依据：本目录下载的禅道官网 RESTful API v2.0 开发手册，共 121 篇页面。官网入口：[APIv2.0使用教程](https://www.zentao.net/book/api/2309.html)。
>
> 这是一份面向后续实现的技术梳理，不代表已经连通或验证公司的禅道实例。

## 先区分文档版本

最初给出的 `setting-369.html` 文档介绍的是禅道 PHP-SDK 的配置和调用，属于较早的 SDK 接入方式；它不是 RESTful API v2.0 的开发手册入口。RESTful API v2.0 在官方目录中单独成章，API 路径使用 `/api.php/v2/...`。RESTful API v1.0 使用 `/api.php/v1/...`，两套认证和接口路径不要混用。

API v2.0 教程说明：先通过登录接口取得认证 Token，之后在每次业务 API 请求的请求头中携带 Token；未正确携带 Token 时会收到 401。手册的 Token 页面给出 `POST /api.php/v2/users/login`，请求体包含 `account` 和 `password`，响应包含 `status` 和 `token`。普通接口文档将请求头写作 `token`。

## 与禅道工作流视频的直接对应

| 观众想做什么 | API v2.0 接口线索 | MCP 工具设计建议 |
| --- | --- | --- |
| 查询指派给自己的任务 | `GET /api.php/v2/executions` 可列出执行；逐个调用 `GET /api.php/v2/executions/{executionID}/tasks`，其中 `status=assignedtome` 支持按当前用户筛选 | `list_my_tasks(status, page)`。服务端可先列出当前用户可见的未关闭执行，再逐执行查询并按任务 ID 去重；也可允许调用方限定执行。 |
| 查询指派给自己的 Bug | `GET /api.php/v2/products` 可列出产品；逐个调用 `GET /api.php/v2/products/{productID}/bugs`，其中 `browseType=assigntome` 支持按当前用户筛选 | `list_my_bugs(status, page)`。服务端可遍历当前用户可见的产品后分页聚合；第一版建议让用户指定产品，控制请求数量和结果范围。 |
| 查看一个 Bug 详情 | `GET /api.php/v2/bugs/{bugID}` | `get_bug(bug_id)`，以结构化字段返回状态、优先级、复现步骤、指派人、截止日期等信息。 |
| 查看任务/截止时间 | 执行任务列表响应已包含 `deadline`、`status`、`assignedTo`、`pri` 等字段；手册也列出 `GET /api.php/v2/tasks/{taskID}` | 第一版从列表结果取字段即可。当前官网“获取任务详情”页的响应说明只列出 `status`，未明确任务对象，先不要依赖详情接口返回完整任务。 |
| 汇报修复说明 | API 返回 Bug 的描述、复现步骤和关联信息；本地代码需由 MCP 服务独立读取 Git diff/测试结果 | 组合只读禅道工具与本地 Git 工具，再生成供开发者确认的测试说明。不要声称禅道 API 本身能推断哪行代码导致问题。 |

接口依据：[`获取执行列表`](docs/restful-api-v2.0/027-获取执行列表.md)、[`获取执行任务列表`](docs/restful-api-v2.0/089-获取执行任务列表.md)、[`获取产品列表`](docs/restful-api-v2.0/043-获取产品列表.md)、[`获取产品Bug列表`](docs/restful-api-v2.0/004-获取产品Bug列表.md)、[`获取Bug详情`](docs/restful-api-v2.0/007-获取Bug详情.md)、[`获取任务详情`](docs/restful-api-v2.0/090-获取任务详情.md)、[`获取Token`](docs/restful-api-v2.0/116-获取Token.md)。

## 实现时要注意的边界

1. **列表不是天然的全局“我的工作台”。** 手册中任务列表按执行 ID 查询；Bug 列表按产品、项目或执行范围查询。MCP 若要做跨项目汇总，需要先明确可见范围、发现执行/产品，再分范围拉取和分页。不要只凭一个 ID 假设覆盖了所有工作。
2. **筛选参数不同。** 任务列表使用 `status=assignedtome`；产品 Bug 列表使用 `browseType=assigntome`。参数值按接口文档逐项映射，不要统一臆造一个 `assignedToMe=true`。
3. **分页要实现完整。** 多个列表接口提供 `recPerPage` 和 `pageID`，每页数量上限为 1000。工具应支持分页或自动拉取下一页，并限制最大数据量与请求耗时。
4. **权限由禅道账号决定。** Token 对应的用户必须拥有相关项目/产品的访问权限。服务端应把 401、无权限、空结果、接口错误区分开，不能把失败误报成“没有任务”。
5. **Token 和密码是秘密。** 登录凭证放在本机环境变量或安全配置里，不写入源码、Skill、聊天提示词、Git 或输出日志。MCP 工具的响应中不回显 Token。
6. **先只读，再审慎开放写入。** v2.0 文档包含创建、修改、关闭、删除等写接口。第一版视频工作流建议只开放任务/Bug查询和详情；任何改变禅道状态的工具都应展示目标记录、操作内容并等待人工确认。
7. **规范化返回给模型。** 保留禅道原始 ID、状态、时间和来源范围；对大字段（例如复现步骤）做长度控制；显示“当前用户筛选 + 项目/产品/执行 + 更新时间”，让模型的总结可追溯。
8. **与 MCP 分层。** MCP 是 IDE 与工具之间的协议层；MCP 服务内部再调用禅道 REST API。可以按用户任务提供少量清晰的工具，而不是把 121 个 REST endpoint 全部暴露成 MCP tools。

## 建议的最小可拍版本

1. 配置 `ZENTAO_BASE_URL` 与账号凭证；首次请求 `POST /api.php/v2/users/login` 取 Token，并只在服务内存或受保护配置中保存。
2. 实现三个只读工具：`list_my_tasks`、`list_my_bugs`、`get_bug`。优先单项目/单产品参数，先跑通端到端，再扩展跨范围聚合。
3. 对照真实实例验证账号权限、分页、状态枚举、日期格式和接口错误；确认之后再录屏。视频中的 Mock 页面只作为脱敏视觉素材，实际 API 调用数据必须来自安全的测试环境或合成数据。
4. 如需“结合本地代码写测试说明”，把 Git diff、测试结果和禅道 Bug 详情分别作为证据输入，生成草稿供用户检查，不自动写回禅道。

## 未在本次资料下载中验证的事项

- 实际公司禅道实例的版本、API v2.0 是否启用，以及账号/API 权限。
- `GET /users` 是否能枚举当前用户可见的完整产品/执行范围；跨项目聚合还需要针对实例做最小权限验证。
- Token 的有效期、刷新/登出机制，以及各版本在字段、分页和错误响应上的差异。
- 任务列表中 `assignedtome` 在当前实例中的精确行为与状态筛选组合。

以上问题应在独立测试账号和脱敏环境里核实后再固化进 MCP 工具描述。
