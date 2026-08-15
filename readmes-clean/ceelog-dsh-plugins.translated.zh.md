#dsh-plugins

树外 DeepSeek Harness 插件工作区。

## 插件

### 插件 · 描述 · 演示
- **插件**：[`@opendsh/dsh-plugin-scheduled-tasks`](src/plugins/dsh-plugin-scheduled-tasks/README.md) · **描述**：带有提示的每个项目计划任务，在项目目录中作为无头代理会话执行，具有持久的运行历史记录。 · **演示**：![](./src/plugins/dsh-plugin-scheduled-tasks/docs/demo.png)
- **插件**：[`@opendsh/dsh-plugin-setting-mcp`](src/plugins/dsh-plugin-setting-mcp/README.md) · **描述**：从设置面板管理 MCP 服务器 - 查看、编辑、删除、启用/禁用 - 保存时热重载。 · **演示**：![](./src/plugins/dsh-plugin-setting-mcp/docs/demo.png)

## 工作区布局

```
src/plugins/
├── dsh-plugin-scheduled-tasks   (@opendsh/dsh-plugin-scheduled-tasks)
└── dsh-plugin-setting-mcp       (@opendsh/dsh-plugin-setting-mcp)
```

### 命令·含义
- **命令**：`pnpm install` · **含义**：安装工作区工具（TypeScript 7、Biome，...）。
- **命令**：`pnpm build` · **含义**：构建每个插件包。
- **命令**：`pnpm test` · **含义**：运行每个插件的 vitest 套件。
- **命令**：`pnpm lint` · **含义**：跨工作区检查生物群落。

## 工具链

- **TypeScript 7**（本机编译器）用于类型检查和服务器发出。
- **tsdown** 用于浏览器客户端捆绑包，包装在 DSH 中
  `window.__ModuleLoader__.load` 切换（参见每个插件的
  `scripts/wrap-client.mjs`）。
- **vitest** 用于单元测试，**Biome** 用于 lint/format。