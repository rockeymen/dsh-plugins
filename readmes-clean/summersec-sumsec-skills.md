# SumSec-Skills

SummerSec 个人 **Agent Skills 集合**，按类别分插件管理。

![SumSec-Skills 项目说明](assets/sumsec-skills-illustrations/02-project-introduction.png)

## 仓库布局

```
SumSec-Skills/
├── writing-zh/              # 中文写作插件
│   └── skills/
│       ├── humanizer-zh/       去 AI 味润色
│       └── sumsec-illustrations/  SumSec 博客正文配图
├── dev-tools/               # 开发工具插件
│   └── skills/
│       ├── git-commit-pr/         Git 提交与 PR
│       ├── agent-chat-history/    对话历史检索
│       └── frontend-design/       前端界面实现
├── agents-dev/              # Agent 开发生态插件（聚合）
│   └── skills/
│       ├── skill-creator/         技能创建（claude-plugins-official）
│       ├── writing-rules/         Hook rules 生成（hookify）
│       ├── agent-sdk-dev/         Agent SDK 开发
│       ├── claude-agents-symlink/ CLAUDE.md 指向 AGENTS.md
│       ├── skill-optimizer/       Skill 审计优化
│       ├── multi-platform-plugin-guide/  多平台版本对齐
│       └── workflow-skill-creator/       流程编排 Skill 设计
├── skills/                  # 通用 skill 聚合入口（symlink 到各插件 skills）
├── plugin-dev/              # 镜像：插件开发七件套（agent/command/hook/skill/MCP/structure/settings）
├── claude-md-management/    # 镜像：CLAUDE.md 维护
├── hookify/                 # 原创：Hook 创建工具
├── cloudflare-email/        # Cloudflare 临时邮箱插件
├── taste-skill/             # Taste Skill 跨平台插件封装
├── semantic-linter/         # Semantic-Linter 跨平台插件封装
├── openclaw.plugin.json       # OpenClaw 插件清单
├── openclaw/                  # OpenClaw 插件入口 & skills
├── opencode/                  # OpenCode 插件入口 & rules
├── hermes/                    # Hermes skills & context
├── dsh/                       # DeepSeek Harness bundle patch & 文档
├── .claude-plugin/            # 根 marketplace
├── .cursor-plugin/
├── .codex-plugin/
├── .agents/plugins/
├── .cursor/rules/
├── taste-skill-upstream/      # submodule: Leonxlnx/taste-skill
├── semantic-linter-upstream/  # submodule: SummerSec/semantic-linter
├── AGENTS.md
├── README.md
├── package.json
└── plugin.json
```

## 安装

### Claude Code

```bash
/plugin marketplace add https://github.com/SummerSec/SumSec-Skills.git

/plugin install writing-zh@sumsec-skills
/plugin install dev-tools@sumsec-skills
/plugin install agents-dev@sumsec-skills
/plugin install plugin-dev@sumsec-skills
/plugin install claude-md-management@sumsec-skills
/plugin install hookify@sumsec-skills
/plugin install cloudflare-email@sumsec-skills
/plugin install taste-skill@sumsec-skills
/plugin install semantic-linter@sumsec-skills
```

### OpenAI Codex

```bash
codex plugin marketplace add SummerSec/SumSec-Skills --ref master
```

然后在 Codex 的 `/plugins` 里选择 `SumSec Skills`，按需安装 `writing-zh`、`dev-tools`、`agents-dev`、`plugin-dev`、`claude-md-management`、`hookify`、`cloudflare-email`、`taste-skill`、`semantic-linter` 等插件。仓库内的 `.agents/plugins/marketplace.json` 是 repo-scoped marketplace，每个插件条目使用 `source: "local"` + 对应子目录 `path`（如 `./writing-zh`）指向当前 checkout；Git 获取由 `codex plugin marketplace add` 管理，不在插件条目里写 `url/ref`。

Codex 也会直接扫描仓库级 `.agents/skills/`，适合放仅服务本仓的工具型 skill；需要分发给其他项目或团队时，应打包进 `.codex-plugin/plugin.json` 所描述的插件。

### DeepSeek Harness

临时从当前 checkout 加载全部插件 Skill：

```bash
dsh --profile headless --patch ./dsh/cordis.patch.yml "使用合适的 SumSec Skill 检查当前项目"
```

持久启用时，先把本仓库安装到目标 profile，再将包名 `sumsec-skills` 追加到该 profile 的 `dsh.profile.bundles`。完整步骤、Git 安装方式与 prerelease 注意事项见 [dsh/README.md](dsh/README.md)。

### 手动安装（软链接）

将 `/skills/<skill-name>/` 链接到对应客户端 skill 目录：

```bash
ln -sf "$(pwd)/dev-tools/skills/git-commit-pr" ~/.claude/skills/git-commit-pr
```

### 客户端 · skill 目录/安装方式
- **客户端**: Claude Code · **skill 目录/安装方式**: `/plugin install @sumsec-skills`
- **客户端**: Cursor · **skill 目录/安装方式**: `.cursor-plugin/marketplace.json` 导入
- **客户端**: OpenAI Codex CLI · **skill 目录/安装方式**: `codex plugin marketplace add SummerSec/SumSec-Skills --ref master`
- **客户端**: DeepSeek Harness · **skill 目录/安装方式**: `dsh --profile headless --patch ./dsh/cordis.patch.yml` 或 profile bundle
- **客户端**: OpenClaw · **skill 目录/安装方式**: `openclaw.plugin.json` + `openclaw/` 插件加载
- **客户端**: OpenCode · **skill 目录/安装方式**: `opencode/plugins/sumsec-skills.mjs` 插件注册
- **客户端**: Hermes · **skill 目录/安装方式**: `hermes/skills/sumsec-skills/SKILL.md` 复制加载
- **客户端**: 通用 symlink · **skill 目录/安装方式**: `~/.agents/skills/<name>/ -> /skills/<name>/`

## 技能一览

### writing-zh（中文写作）

### 技能 · 来源 · 说明
- **技能**: [humanizer-zh](writing-zh/skills/humanizer-zh/) · **来源**: 本仓库 · **说明**: 去 AI 味：本地 CLI + 深度指南，反 AI 审查二遍工作流
- **技能**: [sumsec-illustrations](writing-zh/skills/sumsec-illustrations/) · **来源**: 本仓库 · **说明**: 为 sumsec.me 风格文章生成 SumSec Observer 正文配图

### dev-tools（开发工具）

### 技能 · 说明
- **技能**: [git-commit-pr](dev-tools/skills/git-commit-pr/) · **说明**: 安全完成 commit、push、PR/MR
- **技能**: [agent-chat-history](dev-tools/skills/agent-chat-history/) · **说明**: 按日期查本机 Agent 历史对话
- **技能**: [context7-cli](dev-tools/skills/context7-cli/) · **说明**: context7 CLI：查询库文档
- **技能**: [context7-mcp](dev-tools/skills/context7-mcp/) · **说明**: context7 MCP 服务器集成
- **技能**: [find-docs](dev-tools/skills/find-docs/) · **说明**: 查找库文档（context7）
- **技能**: [frontend-design](dev-tools/skills/frontend-design/) · **说明**: 打造高质量前端界面、页面和应用

### agents-dev（Agent 开发生态）

### 技能 · 来源 · 说明
- **技能**: [skill-creator](agents-dev/skills/skill-creator/) · **来源**: claude-plugins-official · **说明**: 技能创建全流程
- **技能**: [writing-rules](agents-dev/skills/writing-rules/) · **来源**: hookify · **说明**: Hook 编写与 rules 生成
- **技能**: [agent-sdk-dev](agents-dev/skills/agent-sdk-dev/) · **来源**: claude-plugins-official · **说明**: Agent SDK 开发
- **技能**: [claude-agents-symlink](agents-dev/skills/claude-agents-symlink/) · **来源**: 本仓库 · **说明**: 统一项目根 `CLAUDE.md`/`claude.md` 软链接到 `AGENTS.md`/`agents.md`，适配 Windows/macOS/Linux
- **技能**: [skill-optimizer](agents-dev/skills/skill-optimizer/) · **来源**: 本仓库 · **说明**: Skill 审计优化（路径 A 改 / 路径 B 只读八维）
- **技能**: [multi-platform-plugin-guide](agents-dev/skills/multi-platform-plugin-guide/) · **来源**: 本仓库 · **说明**: 多平台版本对齐与发布清单
- **技能**: [workflow-skill-creator](agents-dev/skills/workflow-skill-creator/) · **来源**: 本仓库 · **说明**: 复杂流程编排 Skill 设计

> 插件开发七件套（agent/command/hook/skill/MCP/structure/settings）请安装 `plugin-dev`，已不在 `agents-dev` 内重复维护。

### plugin-dev（插件开发七件套）

### 技能 · 说明
- **技能**: [agent-development](plugin-dev/skills/agent-development/) · **说明**: Agent 开发
- **技能**: [command-development](plugin-dev/skills/command-development/) · **说明**: 命令开发
- **技能**: [hook-development](plugin-dev/skills/hook-development/) · **说明**: Hook 开发
- **技能**: [mcp-integration](plugin-dev/skills/mcp-integration/) · **说明**: MCP 集成
- **技能**: [plugin-settings](plugin-dev/skills/plugin-settings/) · **说明**: 插件设置
- **技能**: [plugin-structure](plugin-dev/skills/plugin-structure/) · **说明**: 插件结构
- **技能**: [skill-development](plugin-dev/skills/skill-development/) · **说明**: 技能开发

附带 3 个 agents（agent-creator、plugin-validator、skill-reviewer）和 `/plugin-dev:create-plugin` 引导式工作流。

### 其他镜像插件

### 插件 · 说明
- **插件**: [claude-md-management](claude-md-management/) · **说明**: 维护和改进 CLAUDE.md：质量审计 + 会话学习捕获
- **插件**: [hookify](hookify/) · **说明**: 通过对话模式分析创建 hooks，支持正则匹配与多事件类型
- **插件**: [cloudflare-email](cloudflare-email/) · **说明**: 通过 Address JWT 读取、获取和发送 Cloudflare 临时邮箱邮件
- **插件**: [taste-skill](taste-skill/) · **说明**: 来自 Leonxlnx/taste-skill 的 13 个前端设计、重设计、image-to-code、品牌与视觉方向 Skill
- **插件**: [semantic-linter](semantic-linter/) · **说明**: 检测 Skill/Prompt/Agent 指令中的宽边界用词；含 hooks、CLI 扫描、词典与项目规则安装

### semantic-linter（语义边界检测）

### 技能 · 说明
- **技能**: [semantic-analyzer](semantic-linter/skills/semantic-analyzer/) · **说明**: 词典之外的深度语义审阅
- **技能**: [semantic-linter-shot](semantic-linter/skills/semantic-linter-shot/) · **说明**: 单文件宽边界词速查
- **技能**: [lexicon-manager](semantic-linter/skills/lexicon-manager/) · **说明**: 维护语义陷阱词典
- **技能**: [rules-installer](semantic-linter/skills/rules-installer/) · **说明**: 安装项目级 semantic-rules 与托管指令块

## Git Submodule 与 Skill 同步

本仓库通过 submodule 引用第三方 skill，用同步脚本复制到插件目录（替代 symlink）。

### Submodule · 来源 · 提供的 skill
- **Submodule**: claude-plugins-official · **来源**: anthropics · **提供的 skill**: skill-creator, frontend-design, plugin-dev 系列, hookify, agent-sdk-dev, claude-md-management
- **Submodule**: context7 · **来源**: upstash · **提供的 skill**: context7-cli, context7-mcp, find-docs
- **Submodule**: taste-skill-upstream · **来源**: Leonxlnx · **提供的 skill**: taste-skill 插件的 13 个设计 Skill
- **Submodule**: semantic-linter-upstream · **来源**: SummerSec · **提供的 skill**: semantic-linter 插件（skills/hooks/commands/lib/bin）

```bash
# 新机器安装
git clone --recurse-submodules https://github.com/SummerSec/SumSec-Skills.git
cd SumSec-Skills
python .claude/skills/sync-skills/scripts/sync-skills.py
```

## 许可

Apache-2.0

## Ponytail in dev-tools

The `dev-tools` plugin bundles Ponytail-focused skills:

- `dev-tools/skills/ponytail/`
- `dev-tools/skills/ponytail-review/`
- `dev-tools/skills/ponytail-audit/`
- `dev-tools/skills/ponytail-help/`