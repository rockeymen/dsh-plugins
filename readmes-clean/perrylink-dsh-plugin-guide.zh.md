# 🐳 dsh-plugin-guide

**构建 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件所需的一切。**

*官方文档档案 · Cordis 入门 · 社区深读 · 实战踩坑 · agent 技能 · CLI 工具链*

## Compatibility

### Surface · Status
- **Surface**: Harness · **Status**: DeepSeek Harness `0.1.1-rc.2`
- **Surface**: Node · **Status**: `^22.19.0 ·  · >=24.0.0`（DeepSeek Harness 运行时）
- **Surface**: Platforms · **Status**: 全部（纯 ESM bundle；无原生代码、无网络）
- **Surface**: Model · **Status**: 任意（无模型交互）

## What you get

`dsh-plugin-guide` 是 DSH 插件开发知识库加 CLI 工具链，打包为一个可安装 bundle。知识库注册为 `dsh-plugin-guide` agent 技能（在每个会话目录可见，按需加载工作流步骤、官方文档与社区深读）；`dsh-plugin-dev` CLI 在其之上提供三个机械层。

- **插件契约与红线** —— effect/disposer、waterfall `next()`、模型可见 ⟺ 已记录、Schemastery 配置。
- **官方文档档案** —— 官方仓库文档（英 + 中）逐字副本，在最近核验快照处与上游逐字节一致。
- **Cordis 入门** —— 五个概念与机制时间线（repository-plugin 0809 引入、0811 移除；两条安装通道）。
- **20+ 个实战踩坑** —— 附根因 + 修法（cordis 双副本、tsconfig 三件套、多帧 zstd 会话、Windows junction、过期 npm `latest`…）。
- **社区深读** —— 归档 114 个社区仓库（15 个深读），外加每条事实都链回出处的完整来源索引。
- **CLI 工具链** —— `dsh-plugin-dev new / check / verify`：脚手架、静态检查、打包验证 DSH 插件；每个检查项都链回它强制执行的技能章节。

## Knowledge base

### Path · 是什么
- **Path**: `SKILL.md` · **是什么**: `dsh-plugin-guide` agent 技能：红线 + 按任务类型的开发路径
- **Path**: `package.json` · `cordis.patch.yml` · `index.js` · **是什么**: 可安装 DSH bundle：`dsh.bundle.patch` 清单 + 注册技能的入口
- **Path**: `guide/plugin-dev-guide.md` · **是什么**: 完整开发指南（10 章）
- **Path**: `guide/quick-reference.md` · **是什么**: 一页速查表（5 语言）
- **Path**: `guide/links.md` · **是什么**: 精选 URL 索引：官方开发文档（站点 ↔ 本地副本）+ 社区文档链接
- **Path**: `references/official-docs/` · **是什么**: 官方仓库文档逐字副本（英 + 中）
- **Path**: `references/*.md` · **是什么**: 调研报告：仓库文档、网站、Cordis、论文、社区生态、114 仓库归档（15 个深读）
- **Path**: `scripts/` · **是什么**: 幂等下载脚本 + 完整性检查器 + 话题快照生成器
- **Path**: `bin/` · `src/cli/` · `dist/` · **是什么**: `dsh-plugin-dev` CLI：脚手架、检查器、验证器（TypeScript，tsdown 打包）
- **Path**: `templates/` · **是什么**: TS + JS 脚手架骨架：契约模板、Config、tests、cordis.patch.yml、五语 README
- **Path**: `downloads/` · **是什么**: 原始快照 —— 由 `scripts/` 生成、不入库

## CLI toolchain

bundle 附带零运行时依赖的 `dsh-plugin-dev` CLI（`bin/` → tsdown 打包的 `dist/dsh-plugin-dev.js`）。每个检查项都引用它强制执行的技能章节，agent 可继续人工审计。

```sh
dsh-plugin-dev new <name> [--lang ts|js] [--dir ] [--force] [--git]
dsh-plugin-dev check [--cwd <dir>] [--json] [--strict]
dsh-plugin-dev verify [--cwd <dir>] [--dsh ] [--pnpm ]
```

### 子命令 · 作用
- **子命令**: `new <name>` · **作用**: 脚手架生成 TS 或 JS 插件仓库：`src/index.ts` 契约模板、Schemastery Config、tests、tsdown/vitest、注释齐全的 `cordis.patch.yml`、五语 README。幂等；无 `--force` 时拒绝覆盖非空目录。
- **子命令**: `check` · **作用**: 静态检查：`cordis.patch.yml` 合法性、`package.json` 元数据（`dsh.bundle.patch` 指向、peer 依赖、engines、files 白名单）、五语 README 一致性、工程红线模式。输出 CI 可消费的 JSON。
- **子命令**: `verify` · **作用**: `pnpm pack` 后装入干净 mkdtemp `DSH_HOME` profile 做安装/启动/卸载冒烟（对齐 `verify:self-contained`）。失败给出日志尾部与建议。

### CLI configuration

CLI 无硬编码可调参数——每个都是 flag 或环境变量。

### 可调项 · Flag · 环境变量 · 默认
- **可调项**: 模板目录 · **Flag**: — · **环境变量**: `DSH_PLUGIN_DEV_TEMPLATES` · **默认**: `/templates`
- **可调项**: dsh 二进制 · **Flag**: `--dsh` · **环境变量**: `DSH_PLUGIN_DEV_DSH` · **默认**: `dsh`
- **可调项**: pnpm 二进制 · **Flag**: `--pnpm` · **环境变量**: `DSH_PLUGIN_DEV_PNPM` · **默认**: `pnpm`
- **可调项**: 安装/打包超时 · **Flag**: `--timeout` · **环境变量**: `DSH_PLUGIN_DEV_TIMEOUT` · **默认**: `300000` ms
- **可调项**: headless 冒烟超时 · **Flag**: `--smoke-timeout` · **环境变量**: `DSH_PLUGIN_DEV_SMOKE_TIMEOUT` · **默认**: `120000` ms

### Upstream roadmap

`dsh-plugin-dev` 是官方插件开发 CLI（规划项 C12）的上游候选：脚手架/检查器/验证器是机械层，`SKILL.md` + `guide/` 仍是认知层。

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-plugin-guide#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-plugin-guide

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A3 'id: dsh-plugin-guide'
```

然后直接问你的 agent：*"用 dsh-plugin-guide 技能帮我构建一个 … 插件。"*

或者直接驱动 CLI：

```sh
npx dsh-plugin-guide new hello-plugin            # 脚手架生成 TS 插件仓库
npx dsh-plugin-guide check --json                # 静态检查
npx dsh-plugin-guide verify                      # 打包 + 干净 profile 冒烟
```

## Install & uninstall

- **git channel**（最新 `main`）：`dsh plugin --profile web add github:PerryLink/dsh-plugin-guide#<sha>` —— 固定提交以可复现；入口是纯 ESM JS，无构建步骤。
- **npm channel**（发布版本）：`dsh plugin --profile web add dsh-plugin-guide`。
- **tarball channel**：在本仓库执行 `pnpm pack`，然后 `dsh plugin --profile web add ./dsh-plugin-guide-<version>.tgz`。
- **uninstall**：`dsh plugin --profile web remove dsh-plugin-guide`。

## Copy as a plain agent skill

你也可以把整个文件夹复制到 agent 的技能目录（相对路径保持完好）：

```powershell
# Windows (PowerShell)
pwsh -File scripts/install-skill.ps1 `
  -Target "$env:USERPROFILE\.deepseek\skills\dsh-plugin-guide"   # 或 \.agents\skills\dsh-plugin-guide
```

```bash
# macOS / Linux
pwsh -File scripts/install-skill.ps1 -Target ~/.deepseek/skills/dsh-plugin-guide   # 或 /.agents/skills/dsh-plugin-guide
```

安装器跳过 `downloads/`（生成的）与 `.github/`，然后逐字节校验每个复制的文件。手动 `Copy-Item -Recurse` 整个文件夹也可以。

## Configuration

技能 bundle 不暴露任何 Schemastery `Config` —— 它把知识库注册为 agent 技能，无可调键。`dsh-plugin-dev` CLI 从 flag 与 `DSH_PLUGIN_DEV_*` 环境变量读取可调项（见 [CLI toolchain](#cli-toolchain)）。

## Tools & surfaces

### Surface · Kind · Notes
- **Surface**: `dsh-plugin-guide` · **Kind**: skill · **Notes**: 经 `ctx.skills` 注册；按需加载 `SKILL.md` + `./guide/` + `./references/`
- **Surface**: `dsh-plugin-dev` · **Kind**: bin (CLI) · **Notes**: `new` / `check` / `verify` 子命令；非 DSH 插件行

## Permissions & data

- **Permissions**：workshop 清单声明 `filesystem:read`。
- **Data**：只读 —— 仅读取自身打包的 `guide/` 与 `references/` 文件。无网络请求、无写入、无模型调用。

## Security boundaries

- **只读知识库。** bundle 只读取自身文件；绝不写入、绝不联网、绝不调用模型。
- **官方文档是逐字副本。** `references/official-docs/` 从不在本仓库修改；问题反馈给上游，且只经 `scripts/sync-official-docs.ps1` 重新同步。
- **分发边界。** 打包的第三方内容保留其上游许可；见 [NOTICE.md](NOTICE.md)（如 `downloads/` 仅本地、`awesome-dsh-plugins` 不得再分发）。

## Known limitations

- **官方文档是快照。** 上游变化时用 `scripts/sync-official-docs.ps1` 重新同步；新鲜度戳与提交号引用 `references/official-docs/SNAPSHOT.md`。
- **`downloads/` 由脚本生成、不入库。** 原始快照（社区仓库归档、Discussions、文章）使用前需用脚本生成。
- **`awesome-dsh-plugins` 内容仅本地。** 其上游声明内部使用约束，故不随仓库再分发。

## Keeping it fresh

```sh
pwsh -File scripts/sync-official-docs.ps1                     # 从本地 checkout 取逐字文档副本
pwsh -File scripts/download-sources.ps1                       # 官方站点/文档、Cordis、论文
pwsh -File scripts/download-community-repos.ps1               # 社区仓库（codeload tarballs）
pwsh -File scripts/download-community-articles.ps1            # zh/en/HN 社区文章
pwsh -File scripts/archive-discussions.ps1                    # 官方 Discussions（需 $env:GH_TOKEN）
pwsh -File scripts/gen-topic-snapshot.ps1 -OutDir <dir>       # dsh-plugin 话题普查
pwsh -File scripts/verify-kit.ps1 -Checkout <checkout>        # 关键路径 + 链接扫描 + 文档漂移
```

## Development

技能 bundle（`index.js`）是纯 ESM、无构建步骤；`dsh-plugin-dev` CLI 是 TypeScript，经 tsdown 构建。门禁：

```sh
pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:artifacts        # 自检 + 脚手架冒烟（无网络）
pnpm run verify:self-contained   # 打包 + 干净 profile 安装/启动/卸载冒烟
pnpm pack
pwsh -File scripts/verify-kit.ps1   # 关键路径 + 链接扫描（加 -Checkout <checkout> 做文档漂移）
```

## Topics

`dsh`, `deepseek-harness`, `dsh-plugin`, `cordis`, `agent-skill`, `plugin-development`, `knowledge-base`, `cli`, `scaffold`, `checker`

## PerryLink DSH Plugin Family

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 [15 个 DeepSeek Harness 插件](https://github.com/PerryLink) 之一。如果这个对你有用，其他插件多半也有用：

### Plugin · One-liner
- **Plugin**: [dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel) · **One-liner**: Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors
- **Plugin**: [dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck) · **One-liner**: Engineering-discipline guard: requirements grill, test gates, adversary review
- **Plugin**: [dsh-background-agents](https://github.com/PerryLink/dsh-background-agents) · **One-liner**: Durable background child agents with a Web UI sidebar, messaging and interrupt
- **Plugin**: [dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions) · **One-liner**: LSP diagnostics, formatting, completion, code actions and rename over language servers
- **Plugin**: [dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) · **One-liner**: Claude Code outputStyles-equivalent runtime style switching
- **Plugin**: [dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) · **One-liner**: Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore
- **Plugin**: [dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) · **One-liner**: Claude Code-style declarative allow/deny/ask permission rules with audit
- **Plugin**: [dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) · **One-liner**: Second-model auto-review on the approval chain, fail-closed by default
- **Plugin**: [dsh-memento](https://github.com/PerryLink/dsh-memento) · **One-liner**: Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool
- **Plugin**: [dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) · **One-liner**: Security-audit skill pack: secret scan, dependency and supply-chain review
- **Plugin**: [dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) · **One-liner**: Pin sessions in the Web sidebar with durable ordering
- **Plugin**: [dsh-composer-history](https://github.com/PerryLink/dsh-composer-history) · **One-liner**: Terminal-style input history for the web composer: arrows, Ctrl+R search
- **Plugin**: [dsh-github](https://github.com/PerryLink/dsh-github) · **One-liner**: GitHub PR/issues integration for DSH, every write gated by approval
- **Plugin**: **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** · **One-liner**: Plugin-development knowledge base as an on-demand agent skill
- **Plugin**: [dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) · **One-liner**: Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH

## Disclaimer

社区维护，**非** DeepSeek 官方产品。DeepSeek Harness 处于开发者预览期并发布破坏性变更；有疑问时，以 `references/official-docs/` 中的官方文档为准。