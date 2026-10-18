# 禅道 API Docs

禅道官方 RESTful API v2.0 开发手册的本地资料库，供后续设计 Cursor + MCP 的禅道工作流时查阅。

## 目录

- [RESTful API v2.0 文档索引](docs/restful-api-v2.0/README.md)：官网当前目录中的 121 篇页面，含认证教程和业务接口。
- `docs/restful-api-v2.0/`：按官网目录顺序整理的 Markdown 文本，便于全文检索和交给 AI 阅读。
- `source-html/restful-api-v2.0/`：对应页面的 HTML 原文存档。
- [接口清单 manifest.csv](manifest.csv)：序号、标题、原始网址、下载状态和本地文件名。
- [MCP 能力分析](MCP-CAPABILITY-ANALYSIS.md)：API v2.0 的认证方式、工作流接口映射和 MCP 落地建议。
- [Cursor 禅道 Mock Server](../cursor-zhantao-mock-server/)：已按部分官方只读接口搭建本地模拟服务，数据供 Mock Demo 和后续 MCP 联调使用。
- [下载脚本](download-v2-manual.ps1)：从禅道官方手册目录重新抓取当前 v2 页面并更新清单。

## 来源和范围

文档来源为[禅道二次开发手册](https://www.zentao.net/book/api/225.mhtml)中“禅道 RESTful API v2.0 开发手册”一节，下载时间记录在各 Markdown 页头。下载范围是该节目录下所有 121 个页面；不包括同一本手册中的 PHP-SDK、RESTful API v1.0 和定制开发章节。

最初提供的 [`setting-369.html`](https://www.zentao.net/book/api/setting-369.html) 是 PHP-SDK 的配置使用说明，并非 API v2.0 文档入口。v2.0 的入口教程是[APIv2.0使用教程](https://www.zentao.net/book/api/2309.html)。

本资料库是官网文档的离线副本。禅道可能更新接口参数或行为；接入实际实例前应再次核对官方页面、实例版本、权限和返回值。HTML 文件保留原页面存档，Markdown 文件由页面正文转换而来，遇到格式差异时以官网原文为准。

## 重新下载

在仓库根目录执行：

```powershell
& '.\apps\living-projects\zentao-api-docs\download-v2-manual.ps1'
```

脚本从官方目录重新发现 v2.0 条目，会覆盖同名本地副本并更新 manifest。联网运行。
