# vue3-docker-todo-app

为 Todo 教学应用添加 Docker 多阶段构建与 Nginx 静态托管配置。

来源分支：course008-docker-in-5-minutes。

## 运行

从工作流仓库根目录运行：

~~~sh
pnpm --filter @living/vue3-docker-todo-app dev
~~~

镜像构建：docker build -f dockerfile -t vue3-docker-todo-app .；启动：docker run --rm -p 8080:80 vue3-docker-todo-app。Mock Server 位于 mock-server/。
