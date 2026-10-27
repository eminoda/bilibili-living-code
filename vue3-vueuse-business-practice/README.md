# VueUse 业务能力实验室

用三个可操作的业务场景，对比 VueUse 写法与原始实现：

1. 企业申请表撤销 / 重做：`useRefHistory`、`useDebouncedRefHistory`。
2. 流式长表单：`useIDBKeyval` 跨 Tab 同步，`useDark` 主题同步。
3. 商品批量处理：30 万条本地 mock 数据，`useWebWorkerFn` 在 Worker 中校验，并将结果返回页面。

右上角开关可在 VueUse 与原始实现之间切换。跨 Tab 场景请在同一浏览器中打开两个页面，并保持两边使用同一种实现模式。

开发服务器启动后可直接访问：

- `http://localhost:5173/history`：企业申请表撤销 / 重做。
- `http://localhost:5173/workspace`：流式长表单与主题同步；打开另一个标签页可观察同步。
- `http://localhost:5173/worker`：30 万条商品数据批量校验。

```sh
cd vue3-vueuse-business-practice
pnpm install
pnpm dev
```

300,000 条商品数据保存在 `src/mocks/products.data.json`；加载与校验逻辑位于 `src/mocks/products.ts`。
