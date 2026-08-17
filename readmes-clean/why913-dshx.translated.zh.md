#dshx

**缺少 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) 的配套 CLI。**

使用一个命令管理 MCP 服务器、技能和代理内存 — 在写入任何内容之前进行空运行连接检查、秘密安全的配置输出以及现有 Claude Code / Codex 设置（MCP 服务器、技能和全局内存）的一次性迁移。附带 `SKILL.md`，以便 dsh 代理本身知道如何使用它，还附带 `/mcp` 命令以及 dsh Web 中的交互式卡。

![dshx 如何在将 MCP 服务器写入 dsh 之前对其进行验证：stdio 命令或 HTTP URL 通过 dshx，执行 MCP handshake 和工具/列表；只有应答的服务器才会写入 dsh，而 403 或崩溃的服务器会被拒绝。](assets/dshx-mcp-flow.webp)

```sh
npm install -g @why913/dshx

dshx mcp add everything -- npx -y @modelcontextprotocol/server-everything
# 连接测试 everything … 通过（2133ms，发现 13 个工具: echo, get-env, …）
# 已写入 ~/.dsh/profiles/web/cordis.patch.yml（id: mcp-everything）

dshx mcp import --yes
# discovers every MCP server in ~/.claude.json, ./.mcp.json and
# ~/.codex/config.toml, connection-tests each one, writes the ones that work
```

## 为什么

dsh 的 MCP 客户端非常可靠（stdio + Streamable-http、自动重新连接、热重载），但配置它的唯一方法是手动编辑 `cordis.patch.yml`。在我们的定时测试中，经验丰富的代理需要 **6 分 24 秒** 来手动添加一台服务器（查找文件、学习补丁层语义、躲避 `[]` 占位符 YAML 陷阱）。 Claude Code 通过一个命令完成相同的工作。 dshx 缩小了这一差距：

###·手工编辑·dshx
- 添加一台服务器 · **手动编辑**：约 6 分钟，YAML 陷阱 · **dshx**：一条命令
- 损坏的服务器· **手工编辑**：启动时发现，默默安装零工具· **dshx **：**写入前拒绝**（空运行handshake + `tools/list`）
- 秘密 · **手工编辑**：粘贴到 YAML · **dshx**：`$VAR` → `!!js process.env.VAR` 参考文献
- 从 Claude Code / Codex 迁移 · **手动编辑**：重新输入所有内容 · **dshx**：`dshx mcp import --yes`，或一键单击

一次真正的导入在一台具有 12 台服务器（跨 Claude Code 和 Codex 配置）的机器上运行：**10 台已迁移，2 台被正确拒绝**（一个端点返回 403，一台服务器在启动时崩溃）——在任何一个都可能污染配置之前。请注意，`npx` 是下载并运行该包的内容； dshx 检查结果是否与 MCP 一致，只有当结果一致时才写入。

## 安装

```sh
npm install -g @why913/dshx        # CLI
```

可选 - 将其也安装为 dsh 插件，因此代理将 `mcp_add` / `mcp_list` / `mcp_remove` / `mcp_test` / `mcp_import` 作为本机工具，加上 `/mcp` 命令及其卡：

```sh
dsh plugin --profile web add @why913/dshx
```

推荐 - 安装该技能，以便代理自行到达 dshx：

```sh
dshx skill add ./skills/dshx       # records the source, so `skill update` works later
```

dsh热门看技能目录；无需重新启动。在我们的测试中，代理现场拾取了该技能，称为 `mcp_list` / `mcp_test` / `mcp_import` 本身，并在 16 秒内完成了整个任务。

## 命令

```text
dshx mcp add <name> -- <command> [args...]     add a local stdio server
dshx mcp add --transport http <name> <url>     add a remote streamable-http server
dshx mcp list                                  list managed servers
dshx mcp rm <name>                             remove a server
dshx mcp test <name>                           dry-run handshake + tool listing
dshx mcp import [--yes]                        migrate servers from Claude Code / Codex

dshx skill list                                list skills with validity checks
dshx skill add <owner/repo[/subdir] | path>    install a SKILL.md package (source + commit recorded)
dshx skill rm <name>                           remove a dshx-installed skill
dshx skill update <name>                       re-fetch from the recorded source
dshx skill import [--yes]                      migrate skills from ~/.claude/skills

dshx memory import [--yes]                     migrate ~/.claude/CLAUDE.md + ~/.codex/AGENTS.md
                                               into $DSH_HOME/AGENTS.md (idempotent marker blocks)
```

注：技能目录为dsh热门，所以`skill add`/`import`立即生效。项目级 CLAUDE.md 无需迁移 - dsh 可以原生读取它。默认导入预览，需要`--yes`写入； `$VAR` 值成为引用，但持有文字标记的源配置会迁移该文字。

共享标志：

### 标志·含义
- **标志**：`--profile <name>` · **含义**：目标配置文件（默认 `web`）
- **标志**：`--global` · **含义**：写入 `$DSH_HOME/cordis.patch.yml`（所有配置文件）
- **标志**：`--env KEY=$VAR` · **含义**：stdio 服务器的环境变量； `$VAR` 表格存储为 `!!js process.env.VAR` 参考 — 文件中没有秘密内容
- **标志**：`--header 'K: V'` · **含义**：http 服务器的标头（值也支持 `$VAR`）
- **标志**：`--timeout <ms>` · **含义**：连接测试超时（默认 30000）
- **标志**：`--no-test` · **含义**：跳过空运行连接测试
- **标志**：`--force` · **含义**：覆盖同名的现有服务器
- **标志**：`--agents` · **含义**：将技能安装到 `~/.agents/skills` 中

## 设计保证

- **写入前试运行。** `add` 和 `import` 执行真正的 MCP handshake 加上 `tools/list`；无法访问的服务器被拒绝，而不是写入。每条路径都相同——CLI、代理工具、卡片按钮。
- **幂等。** 重新添加现有的 `serverName` 会失败（要替换 `--force`）。 `rm` 只接触 dshx 管理的行。
- **保留评论的 YAML 编辑。** 您的 `cordis.patch.yml` 评论在每次编辑中都有效；删除最后一个服务器将恢复原始的 `[]` 占位符。
- **文件中没有秘密。** `$VAR` 形式的 env/header 值被编写为 `!!js process.env.VAR` 引用，dsh 自己的习惯用法。
- **永远不会重新启动任何东西。** 更改适用于下一次 dsh 重新加载； dshx 告诉您而不是终止您的会话。
- **安装前检查技能。** 丢失的 `name`/`description`、非短横线大小写名称或旧的 `disableModelInvocation` 驼峰式密钥将被拒绝 — 比在 dsh 内默默失败要好。

## 作为 dsh 插件

通过 `dsh plugin --profile web add @why913/dshx` 安装，代理获得五个具有相同保证的本机工具（`mcp_list`、`mcp_add`、`mcp_remove`、`mcp_test`、`mcp_import`） - 因此“将我连接到 GitHub MCP 服务器”是代理可以执行的操作，包括测试。在插件行配置目标配置文件：

```yaml
- id: dshx
  name: '@why913/dshx'
  config:
    profile: web
```

## 在 dsh 网页中

同一个插件添加了 `/mcp`，其结果呈现为交互式卡片：

```text
/mcp

  MCP 服务器 · 9/10 连通                                    [全部重测]
   ✓ codex           2 tools · 322ms                           [重测]
   ✓ playwright     24 tools · 7942ms                           [重测]
   ✗ node_repl      连接失败 · 60ms                             [重测]
       MCP error -32000: Connection closed

/mcp import

  可迁移 2 个 · 已管理 10 个                                [全部迁移]
   + openai-docs   claude-user · streamable-http · https://…     [迁移]
   + obsidian      claude-user · stdio · node …\main.js          [迁移]
   = codex         已管理
```

### 表格·它的作用
- **表单**：`/mcp` · **它的作用**：检查每个配置的服务器，每行一行
- **表格**：`/mcp <server>` · **它的作用**：重新检查一台服务器并列出其工具名称
- **表格**：`/mcp import` · **它的作用**：列出可导入的内容，已根据 dshx 管理的内容进行过滤
- **形式**：`/mcp import <server>` / `/mcp import all` · **它的作用**：迁移，首先进行连接测试
- **表格**：`/mcp help` · **它的作用**：上面的表格

按钮重播命令，因此重新检查或导入会作为新卡出现 - 命令日志仅可追加。如果没有安装一半的客户端，相同的命令仍然呈现为纯文本。

## 限制

- **斜线命令仅限 Web。** 附带的 `headless` CLI 将其整个位置输入转发到模型，因此 `dsh --profile headless "/mcp"` 到达模型，而不是命令注册表。在终端中，使用 `dshx mcp …`。
- **dsh 的实时连接状态不会暴露给第三方插件**，因此 `/mcp` 打开自己的诊断连接并报告 — 它无法显示 dsh 的运行时连接或重新连接状态。
- **没有经过 OAuth 验证的 MCP 服务器**，直到 dsh 为其公开 API。
- **配置编辑需要重新加载 dsh**； dshx永远不会为您重新启动任何东西。
- **编辑现有服务器的一个字段**意味着使用 `--force` 重新添加它。

## 路线图

- `/dshx migrate`：技能和全局内存与 MCP 服务器一起集成在一张卡中
- 技能/内存管理作为面向模型的插件工具（`skill_add`、`memory_import`，...）
- 经过 OAuth 验证的 MCP 服务器（有关 Web-UI 方法，请参阅 [dsh-mcp-manager](https://github.com/hyqhyq3/dsh-mcp-manager)）

## 兼容性