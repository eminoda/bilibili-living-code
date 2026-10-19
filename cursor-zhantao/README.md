# Cursor 禅道工作流

本目录集中保存视频「Cursor：我用 MCP 打造了一个禅道工作流」用到的项目和资料。各子目录仍是独立项目：

- [cursor-zhantao-login](./cursor-zhantao-login)：登录界面示例。
- [cursor-zhantao-mcp](./cursor-zhantao-mcp)：Cursor MCP 工具。
- [cursor-zhantao-mock-demo](./cursor-zhantao-mock-demo)：禅道页面演示项目。
- [cursor-zhantao-mock-server](./cursor-zhantao-mock-server)：为页面和 MCP 提供虚构数据的本地服务。
- [zentao-api-docs](./zentao-api-docs)：禅道 RESTful API v2.0 离线资料。

在仓库根目录运行 `pnpm dev:zhantao-mock-stack`，可同时启动 Mock 页面与服务。单独启动命令和使用说明见各项目的 README。
