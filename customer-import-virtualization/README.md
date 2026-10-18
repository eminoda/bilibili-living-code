# 客户导入预览：TanStack Virtual

基于 Vue 3 官方脚手架的教学项目，用「导入历史客户 CSV 后预览 10 万条数据」演示列表虚拟化。

## 运行

从仓库根目录执行：

```sh
pnpm --filter @living/customer-import-virtualization dev
```

## URL 场景

| `?mode=` | 场景 |
| --- | --- |
| `1` | 普通渲染（一次挂载全部行） |
| `2` | Virtual 虚拟渲染 |
| `3` | 评论区无限加载（触底追加 + 虚拟化） |

## 教学路径

1. 打开入口页选择场景，或直接访问 `?mode=1` / `?mode=2` / `?mode=3`。
2. 在客户导入场景中切换「普通渲染」与 Virtual，对照同一批数据；查看 `CustomerPreviewTable.vue`：`count` 对应完整数据条数，`getVirtualItems()` 返回当前需要挂载的行，`getTotalSize()` 保留完整滚动区域。
3. 页面上「当前实际渲染行数」随滚动变化，可直观看到数据仍有 100,000 条，而 DOM 行数只覆盖视口和 overscan。
4. 打开 `?mode=3` 评论区场景：列表触底后每次追加 20 条评论，同时对已加载评论做虚拟化；观察已加载数量持续增加，而当前渲染行数维持在视口附近。

## 代码结构

- `src/features/customer-import/composables/useCustomerData.ts`：生成稳定的 100,000 条虚构客户记录，使用 `shallowRef` 保存大数组。
- `src/features/customer-import/components/CustomerPreviewTable.vue`：自行编写列表与切换逻辑；只有 Virtual 模式会创建 TanStack Virtualizer。
- `src/features/comments/CommentsFeedView.vue`：评论列表滚动接近底部时分批追加 20 条，并继续虚拟化已加载评论。
- `src/components/ui/`：由 shadcn-vue 初始化的 Tailwind 基础组件，承载页面外壳。

这份教材只模拟已经解析完成的数据。虚拟化控制列表 DOM 数量，不负责 CSV 解析、数据下载、筛选服务端数据或缩减 JavaScript 中的完整数据集。
