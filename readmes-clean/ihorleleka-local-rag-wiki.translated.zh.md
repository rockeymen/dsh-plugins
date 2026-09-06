#local-rag-wiki

用于 AI 代理的存储库本地 RAG wiki：每个存储库的 MCP 知识服务
（受控搜索/读取/写入 Markdown wiki 笔记）加上一个安装程序
将其连接到您的代理工具中。运行该服务需要 Docker。

## 快速入门（推荐）

在第一次代理会话之前预拉取服务映像以避免冷启动
延误：

```bash
docker pull ihorleleka/project-rag-wiki:latest
```

## 安装

在您的存储库根目录中运行：

```bash
npx github:ihorleleka/Local-Rag-Wiki install .
```

这构建了托管 `.agents/` 运行器、`AGENTS.md` 策略部分、
MCP 配置适用于 DeepSeek Harness (`.dsh/mcp.servers.yml`)、Claude Code、Codex、
VS Code 和 OpenCode，以及 `wiki/` 文件夹。这些集成是附加的：
安装 DSH 支架不会删除或替换其他线束配置。
当您的代理客户端时，MCP 服务会自动启动每个存储库
连接。建议在运行代理之前预先拉取镜像（上图）
在一个清新的环境中。

## DeepSeek Harness

将本机 DSH 捆绑包安装到您使用的配置文件中（通常是 `web`）：

```bash
dsh plugin --profile web add github:ihorleleka/Local-Rag-Wiki
```

重新启动 DSH 配置文件，打开已安装的存储库作为其工作区，然后
开始一个会话。捆绑包使用DSH的官方`@deepseek-ai/dsh-mcp-client`
找到 wiki-kit 安装标记（包括自定义 `--agents-dir`），
启动托管的 MCP 运行程序，重新连接它，发现它的工具，然后注册
它们作为本机 `mcp__wiki-manager__*` 工具。跑步者开始或附加到
存储库的 Docker 服务与其他工具的完全相同。

它还为该工作空间安装了一个标记门控 Cordis 召回协调器：
`agent/session-start` 种子重复主题提示； `agent/pre-step`使用本地
状态，然后仅针对材料提示执行有界 wiki 检索——首先
`wiki_search depth="abstract"` (L0)，然后匹配 `depth="packet"` 上下文
（L1）。它标记证据并将完整的 L2 `wiki_read` 决策留给
模型。 `session/event` 记录助理摘要，而 `agent/turn-stopping`
和 `session/flush` 修剪并保持状态。召回是按工作空间缓存的
飞行中重复数据删除； L1 数据包有速率限制，冷启动有限制
允许 90 秒，并且状态更新通过原子替换进行排队。否
状态或 wiki 进程在带有 wiki-kit 安装标记的存储库外部使用。

生成的 `.dsh/mcp.servers.yml` 仍然是工作空间配置的替代方案；
不要激活具有相同 `wiki-manager` 命名空间的两个桥，否则 DSH 将
正确拒绝重复工具注册。 `AGENTS.md` 仍然是
可移植的策略层。

`.agents/hooks/` 和 `.claude/settings.local.json` 挂钩是 Claude
特定于代码。 DSH生命周期拦截属于受信任的Host/Profile
Cordis 插件，而不是项目本地挂钩清单。参见
[`.dsh/README.md`](./templates/root/.dsh/README.md) 为工作区配置
边界。

## 更新

安装后，从存储库内刷新托管文件 - 不需要 npx：

```bash
.agents\update-wiki-kit.cmd --force
```

```bash
sh .agents/update-wiki-kit.sh --force
```

## 生命周期

```bash
npx github:ihorleleka/Local-Rag-Wiki status .
npx github:ihorleleka/Local-Rag-Wiki restart .
npx github:ihorleleka/Local-Rag-Wiki doctor . --live
```

`start .`、`stop .` 和 `pull .` 的可用方式相同。存储库
容器独立于各个代理客户端而持续存在。

## 它是如何工作的

- 该软件包是安装程序：它搭建并维护 `.agents/`
  消费者存储库中的运行器和 MCP 配置。
- [kb-service/](./kb-service) 是 Dockerized MCP 知识服务的运行者
  每个存储库启动。服务于`wiki_search`、`wiki_read`、`wiki_list`、
  `wiki_tree`、`wiki_schema_report`、`wiki_write`、`wiki_capture`、`wiki_delete`、
  和 `wiki_rename` over `POST /mcp/`（默认环回），具有哈希保护
  写道。 `wiki_search`支持分层检索（`depth=abstract|packet`）加
  `path_prefix` 目录范围。

## 版本控制

安装程序和 kb-service 使用相同的 Git 标签（`X.Y.Z` 或 `vX.Y.Z`）。
发布自动化：

- [标签版本验证.yml](./.github/workflows/tag-version-verify.yml)
- [docker-release.yml](./.github/workflows/docker-release.yml)