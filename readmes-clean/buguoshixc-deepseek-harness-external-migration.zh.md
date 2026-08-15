# DeepSeek Harness 外部会话迁移插件

把 Codex、Claude Code、Qoder（也接受 `qcoder` 这个别名）和 OpenCode 的配置线索与历史会话迁移到 DeepSeek Harness。

插件采用“扫描 → 预览 → 明确确认导入”的流程：源目录始终只读；会话写入 Harness 当前启用的原生持久化后端；配置先导出成可审阅的迁移包，不会直接覆盖现有配置。

## 能迁移什么

| 来源 | 历史会话 | 配置与扩展 |
|---|---|---|
| Codex | `sessions/**/*.jsonl`，可选 `archived_sessions/**/*.jsonl` | `config.toml` 中的 MCP、模型/权限摘要，`AGENTS.md`、prompts、skills |
| Claude Code | `~/.claude/projects/*/*.jsonl` | 用户/项目 settings、`.mcp.json`、`CLAUDE.md`、commands、agents、skills |
| Qoder | `~/.qoder/projects/*/transcript/*.jsonl` | 用户/项目 settings、`.mcp.json`、commands、agents、skills |
| OpenCode | 当前 `opencode.db` 的 session/message/part 表，也兼容旧 `storage/` JSON 树 | `opencode.json` / `opencode.jsonc`、AGENTS、commands、agents、skills |

迁移后的会话使用 Harness 的 `turn/start`、`user/message`、`assistant/message`、`session/title` 等原生事件，可被 JSONL 或 SQLite 持久化实现读取。每个会话还带一个可忽略的来源事件，记录来源、源会话 ID 和内容指纹，用来避免重复导入。

## 安装

需要 DeepSeek Harness `0.1.0-rc.5` 或更高兼容版本，以及 Node.js `22.19+` 或 `24+`。

安装已打包文件（把路径替换成实际绝对路径）：

```powershell
dsh plugin --profile web add "C:\absolute\path\deepseek-harness-external-migration-0.1.0.tgz"
```

本包声明了 `dsh.bundle.patch`，因此 `dsh plugin` 会自动把它加入所选 profile 的配置层。安装完成后重启该 profile。

也可以从源码目录安装：

```powershell
dsh plugin --profile web add "C:\absolute\path\deepseek-harness-external-migration"
```

## 使用

在 Harness 对话中直接说：

1. `扫描 Codex、Claude Code、Qoder 和 OpenCode 的可迁移内容，不要导入。`
2. `只预览 Codex 和 Claude 最近 10 个会话。`
3. 检查结果后：`确认导入刚才预览的来源，并导出配置迁移包。`

插件暴露三个工具：

- `external_migration_scan`：只读取目录、文件元数据和用于摘要的配置，不读取会话正文，不返回认证值，也不写任何内容。
- `external_migration_preview`：解析会话，返回标题和少量正文预览，不写任何内容。
- `external_migration_import`：必须传入 `confirm=true`；写入 Harness 会话，并生成配置迁移包。

默认每种来源最多处理最近 200 个会话，单个会话文件上限 25 MiB。完全相同的会话再次导入会被跳过；源文件内容变化后会产生一个新的导入版本，旧版本不会被删除。

## 配置迁移包

默认输出到：

```text
$DSH_HOME/migrations/external-agents/
```

其中包含：

- `migration-report.json`：来源、映射结果、未支持项、需要设置的环境变量。
- `cordis.mcp.patch.yml`：可审阅的 MCP 插件配置层。
- `artifacts/`：可审阅的指令、commands、agents 和 skills 文本副本。
- `README.txt`：应用检查清单。

插件不会自动应用 `cordis.mcp.patch.yml`。检查报告并设置所列环境变量后，可在启动时试用：

```powershell
dsh --profile web --patch "C:\absolute\path\cordis.mcp.patch.yml"
```

确认无误后，再把该配置层合并到自己的 profile 流程中。

### 密钥处理

认证信息绝不写入迁移包。下列内容会被替换为 `process.env[...]` 引用：

- 名称包含 token、secret、password、api key、auth、credential 的环境变量或请求头；
- 看起来像 API token 的参数值；
- `${ENV_NAME}` 形式的原有环境变量引用；
- URL 中的用户名、密码或疑似密钥查询参数。

需要设置的变量名会列在 `migration-report.json`。OpenCode/Claude/Qoder 的 WebSocket MCP 配置只会报告为不支持，不会错误转换。

## 自定义目录与限制

默认根目录：

```text
Codex:    $CODEX_HOME 或 ~/.codex
Claude:   $CLAUDE_CONFIG_DIR 或 ~/.claude
Qoder:    $QODER_HOME 或 ~/.qoder
OpenCode: $XDG_DATA_HOME/opencode 或 ~/.local/share/opencode
配置:     $XDG_CONFIG_HOME/opencode 或 ~/.config/opencode
```

要覆盖目录，给 `external-migration` 这一行提供完整配置。注意 Harness 的后续 patch 会整体替换该行的 `config`，因此要重述所有希望保留的字段：

```yaml
- id: external-migration
  config:
    roots:
      codex: "D:\\agent-data\\codex"
      claude: "D:\\agent-data\\claude"
      qoder: "D:\\agent-data\\qoder"
      opencode: "D:\\agent-data\\opencode"
      opencodeConfig: "D:\\agent-config\\opencode"
    outputDir: "D:\\migration-review"
    maxSessions: 100
    maxSessionBytes: 26214400
    previewMessages: 6
    includeArchived: false
    includeSubagents: false
    copyConfigArtifacts: true
```

已知的有意限制：

- 原客户端的工具调用和工具结果会转成可阅读文本，不会伪装成可重新执行的 Harness 工具事件。
- 图片和文件附件只保留占位说明，不复制二进制内容。
- 模型和权限设置只写入摘要，因为不同客户端与 Harness 的语义并不一一对应；不会擅自降低 Harness 的安全策略。
- 指令、commands、agents、skills 只复制到审阅目录，需人工检查后再合并。
- 检测到常见私钥或 token 形态的文本扩展文件会标记为 `possible-secret` 并跳过，不写入审阅目录。
- OpenCode 支持当前 message/part SQLite 结构和旧 JSON 结构；未来若完全切换到不同的 V2-only 表结构，需要新增适配器。

## 开发与验证

```powershell
npm install
npm test
npm pack --dry-run
```

测试使用合成数据，覆盖四种来源解析、OpenCode SQLite、事件日志生成、MCP 脱敏、配置导出和重复导入。插件还用 DeepSeek Harness `0.1.0-rc.6` 的实际 `SessionStore` 与 JSONL 持久化后端完成了烟雾测试。

相关格式参考：[DeepSeek Harness 插件开发](https://deepseek-harness.github.io/deepseek-harness/develop/basic/)、[Codex 配置](https://learn.chatgpt.com/docs/config-file/config-reference)、[Qoder 会话与 Hook transcript](https://docs.qoder.com/extensions/hooks)、[Qoder MCP](https://docs.qoder.com/en/cli/mcp-servers)、[OpenCode 配置](https://opencode.ai/docs/config)、[OpenCode 存储位置](https://opencode.ai/docs/troubleshooting/)、[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code/cli-usage)。