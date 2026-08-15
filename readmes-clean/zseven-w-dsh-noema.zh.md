![DSH Noema](./docs/images/dsh-noema-logo.png)

# DSH Noema

  DeepSeek Harness 的长期记忆 —— 由 Noema 支持的持久、可检查的智能体记忆。
  <sub>工作前召回 &bull; 从 9 种智能体工具导入 &bull; 设置页记忆管理 &bull; 崩溃保活 &bull; 热重载</sub>

  <sub>npm: [`@zseven-w/dsh-noema`](https://www.npmjs.com/package/@zseven-w/dsh-noema) · 当前插件版本：`0.1.0-rc.1` · 已通过 DSH `0.1.0-rc.6` 测试</sub>

## 为什么选择 DSH Noema

DSH Noema 将 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 与 [Noema](https://github.com/ZSeven-W/noema) —— 一个面向编码智能体的本地优先、非向量记忆系统 —— 连接起来，让智能体能够跨会话保留持久知识，而不是每次对话都从零开始。

### 🧠 持久召回

记忆以可检查的 Markdown 文件形式持久化存储在 `NOEMA_ROOT` 下（默认 `~/.agent-memory/`）。`noema_recall` 在会话开始时加载相关上下文；`noema_search`、`noema_browse`、`noema_catalog` 和 `noema_recall_graph` 覆盖查找、探索与审计。

### 📥 从其他工具导入

`noema_import` 读取其他九种 AI 编码工具的记忆文件 —— Codex、Claude Code、opencode、Cursor、Grok、WorkBuddy、Antigravity、Trae、Qoder —— 将其拆分为章节，并把每一节保存为一条持久记忆。以内容为键的账本会在多次运行之间以及共享文件的工具之间进行去重。

### 🛠️ 设置页管理

Noema Memory 设置页可配置服务器命令、记忆根目录、预算、空闲/调用超时以及引导说明区块 —— 而 Manage memories 卡片可直接搜索、浏览、添加、审核和删除已存储的记忆。

### 🩺 保活

记忆服务器保持运行：空闲超时默认为永不超时，保活循环会在 `noema-mcp` 子进程崩溃或退出时于后台重启它，检查间隔和重启退避均可配置。

### 🔍 智能实体抽取

Noema 的抽取引擎将 jieba 分词与高精度信号 —— 英文专有名词、CJK 名称与技术术语、带引号的主题以及重复出现 —— 相结合，并配合停用词与路径过滤，使 PageIndex 主题目录保持干净。

### ⚡ 热重载

首次启动后，插件就再也无需重启：`pnpm run build` 通过 Cordis HMR 热重载宿主插件，`ppnpm run build:client` 则通过 client-hmr 的 SSE 通道热替换浏览器包。

## 安装到 DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

或者，直接从源码树进行本地开发：

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

`link:` 协议会将 profile 的依赖符号链接到此仓库，因此重新构建的结果立即可见，Cordis HMR 也能监听编译后的输出。

该插件通过各平台的可选 npm 包捆绑 `noema-mcp` 二进制文件。若要自行构建，可在捆绑的 `noema` 子模块中运行 `cargo build --release -p noema-mcp`，或将 Server command 设置指向任意 `noema-mcp` 构建产物。

## 记忆工具

面向模型的工具与 Noema MCP 接口一一对应：

### 工具 · 作用
- **工具**: `noema_recall` · **作用**: 针对查询召回相关记忆，可指定 token 预算。
- **工具**: `noema_search` · **作用**: 对已存储的记忆进行全文搜索。
- **工具**: `noema_browse` · **作用**: 按主题或实体浏览 PageIndex 目录。
- **工具**: `noema_catalog` · **作用**: 将完整记忆目录渲染为 markdown。
- **工具**: `noema_recall_graph` · **作用**: 通过链接与共享实体进行多跳召回。
- **工具**: `noema_neighbors` · **作用**: 从某条记忆出发进行一跳图遍历。
- **工具**: `noema_explain` · **作用**: 解释某条记忆为何被召回或未被召回。
- **工具**: `noema_remember` · **作用**: 保存持久的事实、决策、约束或偏好。
- **工具**: `noema_review_list` · **作用**: 列出待审核的候选项。
- **工具**: `noema_review_decide` · **作用**: 接受、拒绝、编辑或合并候选项。
- **工具**: `noema_forget` · **作用**: 将记忆标记删除或硬删除。
- **工具**: `noema_policy_get` / `noema_policy_set` · **作用**: 读取或更新写入策略。
- **工具**: `noema_status` · **作用**: 服务器与租户状态：计数、索引健康度、存储根目录。
- **工具**: `noema_import` · **作用**: 从其他 AI 编码工具导入记忆。

每个工具都会返回统一的结构 `{ ok, tool, text }`，其中 `text` 承载服务器的完整输出。

## 从其他工具导入记忆

### 来源 id · 全局文件 · 工作区文件
- **来源 id**: `codex` · **全局文件**: `~/.codex/AGENTS.md` + Codex 记忆流水线：`~/.codex/memories/MEMORY.md`、`memory_summary.md`、`rollout_summaries/*.md`、`extensions/ad_hoc/notes/*.md`（跳过 `raw_memories.md` —— 它是未经整理的原始流） · **工作区文件**: `AGENTS.md`、`AGENTS.local.md`
- **来源 id**: `claude-code` · **全局文件**: `~/.claude/CLAUDE.md`、`~/.claude/CLAUDE.local.md`、`~/.claude/MEMORY.md` · **工作区文件**: `CLAUDE.md`、`CLAUDE.local.md`、`MEMORY.md`
- **来源 id**: `opencode` · **全局文件**: `~/.config/opencode/AGENTS.md` · **工作区文件**: `AGENTS.md`
- **来源 id**: `cursor` · **全局文件**: `~/.cursor/rules/*.mdc`、`~/.cursorrules` · **工作区文件**: `.cursor/rules/*.mdc`、`.cursorrules`
- **来源 id**: `grok` · **全局文件**: `~/.grok/AGENTS.md` + Grok 跨会话记忆：`~/.grok/memory/MEMORY.md`、每个项目的 `MEMORY.md` 以及 `sessions/*.md` 摘要 · **工作区文件**: `AGENTS.md`
- **来源 id**: `workbuddy` · **全局文件**: `~/.codebuddy/CODEBUDDY.md`（WorkBuddy 记忆文件）、`~/.workbuddy/AGENTS.md`、`~/.workbuddy/memory.md`、`~/.config/workbuddy/AGENTS.md`、`~/Library/Application Support/WorkBuddy/AGENTS.md` · **工作区文件**: `AGENTS.md`、`CODEBUDDY.md`
- **来源 id**: `antigravity` · **全局文件**: `~/.antigravity/AGENTS.md`、`~/.config/antigravity/AGENTS.md`、`~/Library/Application Support/Antigravity/AGENTS.md`（尽力而为；目前尚无文档化的全局记忆存储） · **工作区文件**: `AGENTS.md`、`AGENTS.local.md`
- **来源 id**: `trae` · **全局文件**: `~/.trae/AGENTS.md`、`~/.trae/memory/`、`~/.trae/rules/`（以及 `~/.trae-cn` 变体） · **工作区文件**: `AGENTS.md`、`.trae/rules/`
- **来源 id**: `qoder` · **全局文件**: `~/.qoder-cn/AGENTS.md`、`~/.qoder-cn/rules/`、自动记忆根目录 `~/.qoder-cn/memory/` 和 `~/.qoder-cn/projects/*/memory/`（以及 `~/.qoder` 变体） · **工作区文件**: `AGENTS.md`、`AGENTS.local.md`、`.qoder/rules/`

- `source` 参数用于选择某个工具，省略它则会运行设置中启用的所有来源。
- `path` 参数用于选择项目级文件的工作区根目录（默认使用会话工作区；只有在开启 Import workspace files 设置时，工作区文件才会被加载）。
- 导入通过位于 `$DSH_HOME/storages/dsh-noema-imports.json` 的账本去重，以文件路径 + 章节内容为键 —— 当多个工具共享同一个项目 `AGENTS.md` 时，每个章节只会被导入一次。`force: true` 会重新导入全部内容。
- 设置页提供每个来源的复选框、启动时导入开关、文件大小上限，以及一个带有上次运行摘要的 Import now 按钮。

## 设置

打开 **设置 → Noema Memory**：

### 设置 · 默认值 · 含义
- **设置**: Enable memory · **默认值**: on · **含义**: `noema_*` 工具的总开关。
- **设置**: Memory guidance · **默认值**: on · **含义**: 系统提示词中教授记忆用法的部分。
- **设置**: Start server at boot · **默认值**: on · **含义**: 在 DSH 启动时启动，而非首次使用时才启动。
- **设置**: Auto-accept new memories · **默认值**: on · **含义**: `noema_remember` 立即持久化。
- **设置**: Server command · **默认值**: `bundled` · **含义**: 捆绑的 `noema-mcp` 二进制文件或自定义可执行文件路径/命令。
- **设置**: Working directory · **默认值**: — · **含义**: 服务器的工作目录（运行 `cargo run` 时需要）。
- **设置**: Memory root (NOEMA_ROOT) · **默认值**: — · **含义**: 记忆的存储位置；留空 = `~/.agent-memory`。
- **设置**: Recall token budget · **默认值**: 1200 · **含义**: `noema_recall` 的默认 `budget_tokens`。
- **设置**: Idle timeout (ms) · **默认值**: 0 · **含义**: 空闲后停止服务器；0 = 永不停止。
- **设置**: Keep alive · **默认值**: on · **含义**: 服务器崩溃或退出时在后台重启。
- **设置**: Keep-alive interval (ms) · **默认值**: 5000 · **含义**: 后台健康检查之间的最小间隔。
- **设置**: Call timeout (ms) · **默认值**: 30000 · **含义**: 每次工具调用的超时时间。
- **设置**: Restart delay (ms) · **默认值**: 1000 · **含义**: 停止/崩溃与下次启动之间的退避时间。

状态卡片会显示服务器健康状态，并提供重启/停止操作；导入区块用于管理九个记忆来源。

## 热重载

插件加载过一次之后，DSH 的 HMR 机制即可完全使用：

- **宿主插件** —— 在 profile patch 中启用 Cordis HMR 条目，并将其监听根目录指向本包的 `lib/` 输出目录，同时保留 `link:` 依赖。运行 `pnpm run build` 后，正在运行的 DSH 会自动重载插件入口（重载会重启 Noema 服务器子进程）—— 无需重启服务器。

  ```yaml
  # ~/.dsh/profiles//cordis.patch.yml
  - id: hmr
    disabled: false
    config:
      root:
        - /path/to/dsh-noema/lib
  ```

- **客户端包** —— `ppnpm run build:client` 会重写 `lib/client.js`；client-hmr 的 node 端会轮询每个 graph 包的 stat（默认 500ms），并通过 `/plugins/events` SSE 通道广播 `rebuilt` 帧，浏览器便可在不刷新页面的情况下热替换模块。
- **设置** —— 在 Noema Memory 设置页上所做的每项更改都会通过设置服务实时生效。

热重载唯一做不到的是加载一个从未出现在启动树中的插件：运行中的组合既不监听 profile patch 层（Web 应用未接入 `watchUserPatches`），也不暴露加载器变更 API（插件清单 RPC 是只读的）。因此，一个全新插件恰好需要重启一次服务器，之后上述循环便完全可热重载。

## 开发

```sh
pnpm install
pnpm run build     # host tsc + client tsdown bundle
pnpm test          # build + node --test tests/
```

e2e 测试会在存在 `noema/target/debug/noema-mcp` 时针对它运行（否则会被跳过）。

## 许可证

MIT