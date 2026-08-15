# DeepSeek Harness 的 Nowledge 内存

Nowledge Mem 的社区 DeepSeek Harness (`dsh`) 捆绑包，从独立的 `nowledge-co/nowledge-mem-deepseek-harness` 存储库发布并镜像在 `nowledge-co/community` 中。

## 安装

```sh
dsh plugin --profile web add github:nowledge-co/nowledge-mem-deepseek-harness
dsh web
```

对于 `nowledge-co/community` 的本地签出，请从存储库根目录运行以下命令：

```sh
dsh plugin --profile web add ./nowledge-mem-deepseek-harness-plugin
dsh web
```

确保 `nmem` CLI 位于 `PATH` 上，然后验证：

```sh
nmem status
nmem config mcp show --host deepseek-harness
```

默认情况下，捆绑包连接到本地 Mem MCP 端点：

```text
http://127.0.0.1:14242/mcp/
```

对于 Nowledge Cloud 或其他远程 Mem，设置：

```sh
export NMEM_MCP_URL="https://<workspace>/mcp"
export NMEM_API_KEY="<mem-api-key>"
```

## 它的作用

- 通过 `agent/pre-step` 在每个 DSH 会话中注入一次 Nowledge Mem Context Bundle。
- 运行提示时间记忆回忆以进行延续、释放、回归、连接器、插件和其他回忆形状的提示。
- 通过DSH的`@deepseek-ai/dsh-mcp-client`添加Mem MCP服务器，因此工具显示为`mcp__nowledge_mem__...`。
- 使用 `nmem t import --source deepseek-harness` 完成转弯后导入真实的 DSH 表面记录。
- 使用 `NMEM_IMPORT_ORIGIN=deepseek-harness` 标记 CLI 导入。

## 配置

该捆绑包在稍后的 `cordis.patch.yml` 覆盖中接受这些行配置字段：

```yaml
- id: nowledge-mem
  config:
    cliPath: nmem
    sourceApp: deepseek-harness
    importOrigin: deepseek-harness
    contextOnSessionStart: true
    recallOnPrompt: true
    syncOnTurnEnd: true
    recallLimit: 8
    spaceId: my-space-id
    agentId: deepseek-harness
```

环境变量也起作用：

- `NMEM_SPACE`
- `NMEM_AGENT_ID`
- `NMEM_HOST_AGENT_ID`
- `NMEM_MCP_URL`或`NOWLEDGE_MEM_MCP_URL`
- `NMEM_API_KEY`

## 模特经历

### 启动上下文

该模型看到一条源自插件的用户消息，其中包含当前的 Nowledge Mem Context Bundle。它被标记为 `form: "snapshot"` 并提醒模型它是跨工具上下文，而不是指令覆盖。

### 即时回忆

当用户要求继续、记住、回顾以前的工作、发布版本、调试回归或讨论连接器/插件时，插件会调用：

```sh
nmem --json m search "" -n 8
```

该模型会看到一条有界回忆消息，其中包含记忆标题、来源提示、分数和内容。

### MCP 工具

Mem MCP 工具通过 DSH 的 MCP 桥在 `nowledge_mem` 命名空间下注册。 DSH 目前仅桥接 MCP 工具； Harness 客户端不会显示 MCP 资源和提示。

### 线程捕获

在每次完成 DSH 回合后，插件会序列化用户、助手和工具结果事件，跳过其自己注入的上下文消息，并将脚本作为 `source=deepseek-harness` 导入到 Mem 中。

## 已知限制

- DeepSeek Harness 处于开发者预览阶段，因此公共包 API 可能会发生变化。
- 历史DSH会话尚未被此包回填；它在插件处于活动状态时捕获新会话。
- DSH MCP 桥仅公开工具，因此 Nowledge Mem 资源/提示今天不会通过 MCP 显示。
- 轮次捕获取决于 DSH 进程环境中可用的本地 `nmem` CLI。

## 社区立场

规范的公共存储库是 `nowledge-co/nowledge-mem-deepseek-harness`，标记为 `dsh-plugin`，用于 DeepSeek Harness 生态系统发现。 `community` 存储库保留 Nowledge Mem 表面的注册表/索引镜像。