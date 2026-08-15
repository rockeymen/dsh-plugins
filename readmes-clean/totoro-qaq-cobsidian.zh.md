# Cobsidian

[English](../README.md) · 简体中文

  ![Cobsidian——让编程 Agent 先规划、再审阅、安全写入相互连接的知识](assets/cobsidian-banner.svg)

> 安全地把 AI 对话整理成带双链的 Obsidian 知识库。

Cobsidian 是一个不绑定 Agent 的 Obsidian / Markdown 知识库维护工作流 Skill。它先搜索再新建，预览准备执行的改动，只让你做一次自然语言确认，然后原子写入并校验结果。完整性哈希留在执行层，用户不需要复制确认码。

它不是托管服务，也不是 Obsidian 插件。你的编程 Agent 会在本机的 Markdown 文件夹上执行这套工作流。

[快速开始](#快速开始) · [工作原理](#工作原理) · [安装](#安装) · [DeepSeek Harness](#deepseek-harness-cordis-bundle) · [MCP Server](mcp-server.zh-CN.md) · [兼容性](agent-compatibility.zh-CN.md) · [最新版本](https://github.com/Totoro-qaq/Cobsidian/releases/latest)

用你熟悉的 Agent 就行：[Claude Code](../skills/cobsidian/references/hosts/claude-code.md) · [Codex CLI](../skills/cobsidian/references/hosts/codex.md) · [GitHub Copilot CLI](../skills/cobsidian/references/hosts/github-copilot-cli.md) · [Kimi Code](../skills/cobsidian/references/hosts/kimi-code.md) · [OpenCode](../skills/cobsidian/references/hosts/opencode.md) · [Pi](../skills/cobsidian/references/hosts/pi.md) · [Antigravity](../skills/cobsidian/references/hosts/antigravity.md)

  ![Cobsidian 匹配已有笔记、预览补丁、确认计划、原子写入并校验知识库](assets/cobsidian-demo.gif)

<sub>演示使用合成知识库，不包含私人笔记、路径或凭据。</sub>

## 快速开始

先在自带的演示知识库上执行一次只读 dry run：

```bash
git clone https://github.com/Totoro-qaq/Cobsidian.git
cd Cobsidian
python skills/cobsidian/scripts/dry_run.py examples/demo-vault --topic "AI Conversations" --mode learning --text "agent workflow notes" --json
```

然后让 Agent 读取 `skills/cobsidian/SKILL.md`：

```text
Use Cobsidian to organize this material into my Obsidian vault.
Vault: /absolute/path/to/obsidian-vault
Run a dry run first, check duplicates, suggest backlinks, and wait for confirmation before writing.
```

## Cobsidian 做什么

### 阶段 · Cobsidian 会明确展示什么
- **阶段**: 读取 · **Cobsidian 会明确展示什么**: 解析知识库，并从文件名、H1、title 与 aliases 建立笔记身份。
- **阶段**: 决策 · **Cobsidian 会明确展示什么**: 把 `create · append · blocked` 与笔记形态分开报告。
- **阶段**: 审阅 · **Cobsidian 会明确展示什么**: 返回重复风险、反链建议和精确的补丁计划。
- **阶段**: 确认 · **Cobsidian 会明确展示什么**: 只询问“应用这项已审阅的变更吗？”，对应的 plan ID 留在后台。
- **阶段**: 写入 · **Cobsidian 会明确展示什么**: 后台核验计划与文件哈希，原子写入、校验，并保留回滚能力。

最终产物是带有实用 `[[双链]]` 的长期 Markdown，而不是已有笔记的第二份副本。

## 前后对比

```mermaid
flowchart LR
    A["AI 对话、日志、项目材料"] --> B["Cobsidian dry run"]
    B --> C["搜索知识库中的已有笔记"]
    C --> D{"Machine actioncreate | append | blocked"}
    D --> E["Note plansingle-note | multi-note | report-onlysplit = multi-note"]
    E --> F["补丁预览 + 自然确认"]
    F --> G["原子写入 + 校验"]
    G --> H["可回滚事务"]
```

### 整理前 · 整理后
- **整理前**: 有价值的回答沉在聊天记录里 · **整理后**: 可复用笔记留在知识库中
- **整理前**: 重复提问不断生成相似笔记 · **整理后**: 写入前先匹配已有身份
- **整理前**: 边写边猜应该加什么链接 · **整理后**: 从真实知识库笔记中建议反链
- **整理前**: Agent 改动难以审计 · **整理后**: 每次写入前都有已审阅且完整性绑定的计划

## 工作原理

```text
搜索 → dry run → 审阅差异 → 确认写入 → 原子应用 → 校验
```

确认过程刻意保持自然：**应用这项已审阅的变更吗？** 你确认后，Host 会把该预览对应的精确 plan ID 在后台传给确定性写入器。ID、目标指纹和写入前后的 SHA-256 只作为完整性检查。

- 你不需要阅读、复制或输入任何哈希。
- 一次确认只对应刚刚展示的那一项变更。
- 如果目标笔记或拟写内容发生变化，旧确认立即失效，Cobsidian 会重新预览并再次询问。
- 如果同时存在多个待审计划，Cobsidian 会用目标与摘要让你选择，不会猜测你指的是哪串哈希。

## Dry-run 预览

Dry run 是默认的安全路径：报告决策，同时保持 `writes` 为空。

```json
{
  "dry_run": true,
  "mode": "learning",
  "decision": {
    "action": "append",
    "target_note": "AI Conversations.md"
  },
  "suggested_backlinks": [
    {
      "title": "Agent Workflows",
      "path": "Agent Workflows.md"
    }
  ],
  "writes": []
}
```

## 不是普通 Markdown 生成器

### 普通 Markdown 生成 · Cobsidian
- **普通 Markdown 生成**: 产出一个孤立文件 · **Cobsidian**: 维护相互连接的知识系统
- **普通 Markdown 生成**: 忽略已有笔记 · **Cobsidian**: 写入前扫描知识库
- **普通 Markdown 生成**: 混在一起判断动作和文档形态 · **Cobsidian**: 分开报告 machine action 与 note plan
- **普通 Markdown 生成**: 立即写入 · **Cobsidian**: 规划、确认、写入、校验，并可回滚

## Knowledge Read / 整理判读

写入前，Cobsidian 会计算 Knowledge Read：模式、深度、笔记粒度、证据与展示方式。`auto | always | off` 只控制对话中的展示；设为 `off` 时 `display_style` 会隐藏，但 dry-run 仍保留完整 JSON。

Capability-based degradation 会让结果忠实于真实能力：本地主机通过检查后可以进入 ready，MCP 保持只读，chat-only 主机只能返回草稿或请求可用路径，不会声称已经完成无法执行的工作。详细规则见 [mode 和 host references](../skills/cobsidian/references/)与共享的 [preflight contract](../skills/cobsidian/references/preflight.md)。

### Compact Knowledge Read

```json
{
  "mode": "learning",
  "mode_explicit": true,
  "recommended_modes": [],
  "depth": "standard",
  "granularity": "single-note",
  "evidence": "conversation",
  "display_policy": "auto",
  "display_style": "compact"
}
```

### Expanded Knowledge Read

```json
{
  "mode": "dissection",
  "mode_explicit": false,
  "recommended_modes": [],
  "depth": "deep",
  "granularity": "multi-note",
  "evidence": "source-grounded",
  "display_policy": "auto",
  "display_style": "expanded"
}
```

## Obsidian Vault 工作流

```mermaid
flowchart TD
    U["用户材料"] --> R["解析知识库路径或配置"]
    R --> S["建立身份并扫描知识库"]
    S --> A{"Machine actioncreate | append | blocked"}
    A --> P["Note plansingle-note | multi-note | report-onlysplit = multi-note"]
    P --> L["建议反链"]
    L --> X["预览补丁 + 确认已审阅变更"]
    X --> V["原子写入、校验、出现新告警时回滚"]
    V --> O["报告事务、链接与校验结果"]
```

## 安装

需要 Git、Python 3.10+、一个 Markdown 知识库，以及能够读取本地说明和运行命令的编程 Agent。

先预览安装位置，再为支持的 CLI 安装 Skill：

```bash
python install_cobsidian.py --host all --scope user --dry-run --json
python install_cobsidian.py --host all --scope user
```

也可以手动复制到共享 Skill 目录：

```bash
mkdir -p ~/.agents/skills
cp -r skills/cobsidian ~/.agents/skills/cobsidian
```

Windows、项目级安装、软链接、更新与卸载见 [INSTALL.md](../INSTALL.md)；不同主机的发现路径见 [Integrations](integrations.zh-CN.md)。

### DeepSeek Harness Cordis Bundle

Cobsidian 仍然是 Agent Skill。可选的 [DSH Cordis Bundle](../integrations/dsh/README.md) 把同一份 canonical Skill 与 Python backend 封装成 DeepSeek Harness 原生扩展，增加 typed tools 和一次性批准，不改变现有 Skill、CLI 或 MCP 路径。

```bash
cd integrations/dsh
npm install
npm run build
dsh plugin --profile web add .

export COBSIDIAN_VAULT="/absolute/path/to/obsidian-vault"
dsh web
```

原生工作流把 scan、dry-run、prepare、apply 和 rollback 分成独立工具。DSH 展示一次性批准界面，并在后台携带精确的 plan / transaction ID；用户不需要粘贴哈希。私人笔记内容通过权限受限的临时文件传给 Python，不进入命令行参数；plan 默认保存在 `~/.dsh/cobsidian`，不保存 API key 或 token。

Bundle 当前针对 DSH `0.1.0-rc.6` API 系列，因为 DeepSeek Harness 仍处于 developer preview。配置、使用与验证步骤见 [Bundle 指南](../integrations/dsh/README.md)。

### MCP Server

支持 Model Context Protocol 的主机可以把 Cobsidian 作为本地只读 `stdio` server 运行：

```bash
python -m pip install -r requirements-mcp.txt
python skills/cobsidian/mcp_server.py
```

配置 `COBSIDIAN_CONFIG` 或 `COBSIDIAN_VAULT`；详见 [MCP Server](mcp-server.zh-CN.md)。

## Agent 用法

告诉 Agent 使用什么工作流、操作哪个知识库，以及安全边界：

```text
Use Cobsidian to turn this conversation into an Obsidian learning note.
Check whether it should create a new note or append to an existing one.
Add useful wiki links, report possible duplicates, and wait before writing.
```

更多可直接复制的写法见 [Prompt Examples](../examples/prompts.md)。

## 模式

Cobsidian 接受显式模式，也能按自然语言路由。意图清晰时只推断一个模式；有歧义时最多推荐两个相关模式。参见[模式说明](modes.zh-CN.md)和详细的 [mode references](../skills/cobsidian/references/modes/)。

## CLI 工具

确定性工具覆盖知识库扫描、重复检测、反链建议、校验、dry run、事务准备、精确计划应用与质量评估：

```bash
python skills/cobsidian/scripts/scan_vault.py /path/to/vault --json
python skills/cobsidian/scripts/find_duplicates.py /path/to/vault
python skills/cobsidian/scripts/suggest_backlinks.py /path/to/vault --file draft.md
python skills/cobsidian/scripts/validate_notes.py /path/to/vault
python skills/cobsidian/scripts/write_executor.py prepare /path/to/vault --action append --target-note "RAG.md" --content-file draft.md --plan-out /tmp/cobsidian-plan.json
python skills/cobsidian/scripts/write_executor.py apply /path/to/vault --plan /tmp/cobsidian-plan.json --confirm PLAN_ID --json
```

## 可选配置

`cobsidian.config.example.yml` 是当前支持的配置面，包含知识库路径、模式目录、Knowledge Read 展示、反链数量、重复阈值、追加偏好与校验行为。

```yaml
interaction:
  knowledge_read: auto
```

复制为 `cobsidian.config.yml` 后，辅助脚本可以通过 `--config cobsidian.config.yml` 读取。

## 功能

- 基于文件名、H1、title 与 aliases 的确定性身份匹配，支持去前缀核心标题。
- 用 CJK bigram / trigram 匹配中文相关短语。
- 校验缺失双链目标和相似标题。
- 通过分页的本地 MCP 工具执行检查与 dry-run 规划。
- 完整性哈希补丁、自然确认、后台精确计划绑定、原子写入与回滚。
- 公开评估重复检测、反链、追加目标与模式准确率。

## 路线图

- 超越标题身份的语义重复检测。
- 用更大的标注知识库基准调优反链排序。
- 可选笔记模板与可配置命名规则。
- 工作流稳定后再考虑 Obsidian 插件集成。

## 贡献

欢迎贡献。请先阅读 [CONTRIBUTING.md](../CONTRIBUTING.md)，并且不要提交私人知识库内容、本机用户路径、API key、未公开笔记或个人截图。

## 商标和独立性声明

Cobsidian 是独立开源项目。OpenAI、Codex、Obsidian、Claude、Cursor、Hermes 以及其他名称均属于各自权利人。本项目不隶属于这些权利人，也未获得其背书或赞助。