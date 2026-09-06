#dsh-gentle-engram

用 TypeScript 编写的主机 Cordis 插件为 DeepSeek Harness 添加了可靠的 [Engram](https://github.com/Gentleman-Programming/engram) 生命周期行为。

此集成需要在您的系统上安装并可用 [Engram](https://github.com/Gentleman-Programming/engram)；没有它，桥梁就无法工作。

## 设计

- 将现有的 `@deepseek-ai/dsh-mcp-client` 行用于官方 [Engram](https://github.com/Gentleman-Programming/engram) MCP stdio 工具。
- 挂钩 DSH 会话启动、入站提示、工具结果、轮流停止和代理处置。
- 将相关的 [Engram](https://github.com/Gentleman-Programming/engram) 上下文播种到下一个模型步骤中。
- 异步保存提示并过滤被动工具学习。
- 序列化每个会话的写入并在轮次边界等待挂起的写入。
- 当代理被处置时，关闭 [Engram](https://github.com/Gentleman-Programming/engram) 会话并记录结构化摘要。
- 从不直接访问 [Engram](https://github.com/Gentleman-Programming/engram) SQLite，并避免转发可能的秘密。

## 从 npm 安装

要求：

- DeepSeek Harness 与 `dsh plugin` 命令。
- [Engram](https://github.com/Gentleman-Programming/engram) 在 `PATH` 中安装并可用作 `engram`。
- 配置的 DSH 配置文件，例如 `web`。

安装 Alpha 通道：

```bash
npx @deepseek-ai/dsh plugin --profile web add dsh-gentle-engram@alpha
```

对于稳定通道：

```bash
npx @deepseek-ai/dsh plugin --profile web add dsh-gentle-engram
```

安装完成后重启DSH。该包是一个主机包：它的 `cordis.patch.yml` 拥有 MCP 桥接器和生命周期插件。请勿编辑附带的预设或添加第二个手册 [Engram](https://github.com/Gentleman-Programming/engram) MCP 行。

在启动 DSH 之前检查 [Engram](https://github.com/Gentleman-Programming/engram) 是否可用：

```bash
engram --version
```

## 本地开发

```bash
pnpm install
pnpm run typecheck
pnpm run build
```