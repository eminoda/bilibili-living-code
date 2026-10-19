# 禅道 API v2 Mock 契约实现计划

## 实施进度（2026-10-03）

- 已补齐任务详情路径、Bug 修改/解决/关闭/激活接口；Bug 写操作会更新进程内合成数据。
- 已对任务与 Bug 列表按文档字段投影，补上筛选、排序、分页参数及校验，并校正项目 Bug 的 `unresolved` 枚举。
- 已增加产品研发需求、用户需求、用例列表接口。Demo Dashboard 通过这些标准资源列表和任务/Bug 列表统计面板，不新增非官方汇总路由；待评审数使用需求列表的 `reviewbyme` 筛选。
- 任务详情仍是文档本身的限制：090 页面只写了 `status` 响应。Mock 按该页面返回，不会返回未定义的 `task` 对象；MCP 需要字段时从任务列表组合查找。
- 产品列表页面列明 `browseType` 的可选值，但未写明默认值；当前 Mock 在参数省略时不过滤，并将此视为本地 Mock 的明确行为。

## 增补：创建 Bug（2026-10-04）

| 场景 | 官方 v2 契约 | 实现方式 |
| --- | --- | --- |
| 创建 Bug | `POST /bugs`；必填 `productID`、`title`、`openedBuild`；可选 `project`、`execution`、`severity`、`pri`、`type`、`steps`、`story`；成功仅 `{status:"success",id:<整数>}` | 严格校验请求字段与类型，生成新 ID 并加入现有 Bug 列表/详情；新增记录写入本地忽略文件，使开发服务重启后仍可用于录制。Mock 中新 Bug 默认指派给 `frontend`，这是本地演示数据规则，不是官方请求字段。 |

依据：[创建 Bug](../zentao-api-docs/docs/restful-api-v2.0/002-创建Bug.md)。

当前实现位置：[`src/server.mjs`](src/server.mjs)，演示姓名映射位置：`../cursor-zhantao-mock-demo/src/api/zentaoClient.ts`。

## 目标与边界

- Mock Server 面向后续 MCP 封装，接口路径、HTTP 方法、请求头、参数名、字段名、数据类型和成功响应形状以 `zentao-api-docs/docs/restful-api-v2.0` 已下载的禅道官方 v2 文档为准。
- 演示页面只需稳定呈现录制所需数据。页面可以组合多个标准 API 并在前端计算展示字段；不为页面便利在 `/api.php/v2` 下添加官方文档没有的 endpoint 或字段。
- 所有数据为合成数据。创建 Bug 会将新增记录写入本地忽略文件；对已有 Bug 的修改、解决、关闭和激活只改变当前 Mock Server 进程内的数据，重启后恢复这些记录的种子状态。

## 接口差异与处理方案

| 场景 | 官方 v2 契约 | 实现前状态 | 完成方式 |
| --- | --- | --- | --- |
| 登录取 Token | `POST /users/login`，请求 `account`、`password`；成功 `{status, token}` | 已有 | 保留路径和成功结构；认证错误按文档教程中的 401 语义核对，不将 mock 错误说明混入成功响应 |
| 执行任务列表 | `GET /executions/:executionID/tasks`；`status`、`orderBy`、`recPerPage`、`pageID`；成功 `{status, tasks}` | 已有基础筛选分页；默认值与排序需对齐 | 默认 `status=unclosed`；实现文档列出的 `orderBy`；仅接受规定枚举/分页范围；列表对象字段与文档类型逐项对齐 |
| 产品 Bug 列表 | `GET /products/:productID/bugs`；`browseType`、`orderBy`、分页；成功 `{status, bugs}` | 已有基础筛选分页 | 默认 `browseType=unclosed`；实现文档枚举及排序。字段/类型按产品 Bug 列表 schema |
| 项目 Bug 列表 | `GET /projects/:projectID/bugs`；文档默认 `browseType=all`，未关闭筛选值写作 `unresolved`；成功 `{status, bugs}` | 已有，但把 `unclosed` 当作筛选值 | 改为该页面记载的 `all` / `unresolved`，避免与产品 Bug 列表参数混用；实现文档排序 |
| Bug 详情 | `GET /bugs/:bugID`；成功 `{status, bug}`，Bug 字段见 007 文档 | 已有 | 对详情字段和字符串/数组类型按 007 文档校准；不存在的 ID 返回失败语义，不回成功空对象 |
| Bug 修改字段 | `PUT /bugs/:bugID`；文档规定标题、严重度、优先级、类型、影响版本、步骤、项目/执行/需求等字段；成功仅 `{status}` | 未实现 | 严格白名单请求字段与类型；更新种子 Bug；成功只返回文档规定的 `{status:"success"}` |
| Bug 解决 | `PUT /bugs/:bugID/resolve`；必填 `resolution`，可选解决日期/版本/指派人/备注；成功仅 `{status}` | 未实现 | 按 008 文档枚举和字段实现；更新 Bug 的状态及解决字段，成功响应不额外附带 Bug 对象 |
| Bug 关闭 | `PUT /bugs/:bugID/close`；可选 `comment`；成功仅 `{status}` | 未实现 | 按 009 文档实现，并更新关闭状态字段；成功只返回 `{status}` |
| Bug 激活 | `PUT /bugs/:bugID/activate`；可选 `openedBuild` 数组、`assignedTo`、`comment`；成功仅 `{status}` | 未实现 | 按 010 文档实现，并更新激活状态字段；成功只返回 `{status}` |
| 任务详情 | `GET /tasks/:taskID`；当前下载的 090 文档只规定成功响应 `{status:"success"}`，没有 `task` 字段或任务对象 schema | 未实现 | 严格兼容文档时只能返回文档写明的 status。不得自行加 `task` 字段冒充官方契约。若 MCP 确实需要详情，可用已定义的执行任务列表查找并组合，或先取得禅道官方有效响应/更新后的文档，再补充契约；在此之前标记为文档缺项 |
| 个人 Dashboard | v2 文档未定义个人 Dashboard 汇总 endpoint | Demo 页面现有数据展示与列表 API 分离 | 不新增 `/dashboard` 一类伪官方路由。页面/调用方通过项目、产品、执行、任务、Bug 的文档接口组合查询并聚合 KPI；聚合结果属于调用方视图，不宣称是禅道 v2 响应 |

Dashboard 通过 `GET /products/:productID/stories`、`GET /products/:productID/requirements`、`GET /products/:productID/testcases` 等文档化列表接口统计研发需求、用户需求、用例及待评审数量。

## 严格契约规则

1. API 前缀、HTTP 动词及路径按对应文档原样实现；MCP 不调用 Demo 私有接口。
2. 查询参数名称和枚举按各 endpoint 文档分别处理。例如任务用 `status=assignedtome`，产品 Bug 用 `browseType=assigntome`；项目 Bug 的文档枚举独立使用 `unresolved`。
3. 列表响应外层只含文档规定的 `status` 与资源集合；详情响应只含文档定义的 `status` 和资源对象。写操作成功响应遵循相应文档，不附加便利字段。
4. 响应字段的大小写、空值、数组、布尔值与标量类型对照文档示例和字段表。MCP 展示层可以转换成更易读的文字，但原始契约层保留 API 字段。
5. 有文档歧义时不猜测并固化为“官方标准”。记录原文、标记阻塞点，并以禅道官方更新文档或真实 v2 响应样例作为依据。
6. 对非法参数、缺失资源、未授权请求的 HTTP 状态码和错误 JSON，应优先照 API v2 使用教程与官方错误响应规则；若手册没有规定某一细节，则在 Mock 实现说明里明确这是模拟错误行为，不扩大为成功 schema。

## 实施顺序

1. 先修正已有列表接口与文档的差异：默认筛选、项目 Bug 的 `unresolved` 枚举、排序参数、列表字段类型。
2. 补充 Bug 修改、解决、关闭、激活四个文档化写接口，并保证后续列表/详情反映修改结果。
3. 增加文档化的任务详情路径，但按 090 当前文字只返回 `{status}`；同时将“缺少 task 对象定义”保留为明确的契约缺口，不擅自扩展。
4. 页面所需 Dashboard 数据由 Demo 聚合标准项目、产品、执行、任务、Bug、需求和测试用例接口；不增加 Mock API v2 私有路由。
5. 每一条接口实现后，按对应文档对照 method/path、headers、参数、成功 JSON、资源字段类型和状态变更副作用；验收结果另行记录。

## 对应文档

- [获取执行任务列表](../zentao-api-docs/docs/restful-api-v2.0/089-获取执行任务列表.md)
- [获取任务详情](../zentao-api-docs/docs/restful-api-v2.0/090-获取任务详情.md)
- [获取产品需求列表](../zentao-api-docs/docs/restful-api-v2.0/077-获取产品需求列表.md)
- [获取产品用户需求列表](../zentao-api-docs/docs/restful-api-v2.0/069-获取产品用户需求列表.md)
- [获取产品测试用例列表](../zentao-api-docs/docs/restful-api-v2.0/098-获取产品测试用例列表.md)
- [产品 Bug 列表](../zentao-api-docs/docs/restful-api-v2.0/004-获取产品Bug列表.md)
- [项目 Bug 列表](../zentao-api-docs/docs/restful-api-v2.0/005-获取项目Bug列表.md)
- [Bug 详情](../zentao-api-docs/docs/restful-api-v2.0/007-获取Bug详情.md)
- [修改 Bug](../zentao-api-docs/docs/restful-api-v2.0/003-修改Bug.md)
- [解决 Bug](../zentao-api-docs/docs/restful-api-v2.0/008-解决Bug.md)
- [关闭 Bug](../zentao-api-docs/docs/restful-api-v2.0/009-关闭Bug.md)
- [激活 Bug](../zentao-api-docs/docs/restful-api-v2.0/010-激活Bug.md)
