# Lite 启动技巧

> 适用于 LiteStartup 的模块化 AI 技能包。安装全部或选择您需要的。

## 它解决了什么问题？

您的 AI 编辑器可以编写出色的代码，但发布内容仍然需要仪表板、CLI 或手动部署。 **LiteStartup Skills 弥补了这一差距：**

- **一个发布提示** — 在编辑器中编写内容，说“同步”，然后它就会上线
- **无上下文切换** - 博客、文档、网站、变更日志、电子邮件均来自同一工作区
- **规范驱动的质量** — AI 遵循精确的格式规则，没有破损的页面或不良的 frontmatter
- **Git-native** — 您的内容存储库是唯一的事实来源

## 可用技能

### 技能·描述·目录
- **技能**：**发布** · **描述**：发布博客、文档、网站、变更日志，并从 AI 编辑器发送活动电子邮件 · **目录**：`skills/litestartup-publish/`
- **技能**：**管理** · **描述**：使用 litesaas-admin 样板初始化、配置和部署 SaaS 应用程序 · **目录**：`skills/litestartup-admin/`

更多技能即将推出：视频生成器、部署。

## 快速入门

### 选项 A：npx（推荐）

```bash
# Install a specific skill
npx skills add litestartup-com/litestartup-skills --skill litestartup-publish
npx skills add litestartup-com/litestartup-skills --skill litestartup-admin
```

### 选项 B：手动

```bash
# 1. Clone
git clone https://github.com/litestartup-com/litestartup-skills.git

# 2. Copy adapter to your content repo
cp litestartup-skills/adapters/codex/AGENTS.md  my-content/AGENTS.md

# 3. Open your content repo in AI editor, then say:
#    "Bind this repo to my LiteStartup account"
#    "Write a blog post about our launch"
#    "Sync all content to production"
```

## 您的内容存储库结构

绑定并写入内容后，您的存储库将如下所示：

```
my-content/
├── litestartup.yaml          ← Auto-generated config (binding, domain, sync rules)
├── blog/
│   └── announcing-myapp-launch.md
├── campaign/
│   └── june-product-launch.md
├── website/
│   ├── index.html
│   └── about.html
├── docs/
│   ├── config.json
│   └── en/
│       ├── _nav.md
│       ├── _sidebar.md
│       └── index.md
└── changelog/
    └── v1.0.0.md
```

## 编辑器支持

### 编辑器·适配器文件·复制到
- **编辑器**：Codex · **适配器文件**：`adapters/codex/AGENTS.md` · **复制到**：`AGENTS.md`
- **编辑器**：Claude Code · **适配器文件**：`adapters/claude/CLAUDE.md` · **复制到**：`CLAUDE.md`
- **编辑器**：光标 · **适配器文件**：`adapters/cursor/litestartup.mdc` · **复制到**：`.cursor/rules/litestartup.mdc`

## 回购结构

```
litestartup-skills/
├── skills/                       ← npx skills add scans this directory
│   ├── litestartup-publish/      ← Publish Skill
│   │   ├── SKILL.md             ← AI entry point (router)
│   │   ├── references/          ← Capabilities + content specs
│   │   ├── assets/              ← Starter templates
│   │   └── scripts/             ← Linux/macOS fallback scripts
│   └── litestartup-admin/        ← Admin Skill (agent-native, no scripts)
│       ├── SKILL.md             ← AI entry point (router)
│       ├── references/          ← Init, configure, status, feature specs
│       └── assets/              ← .env template
└── adapters/                     ← Per-editor integration files
```

## 安全

- API 密钥永远不会出现在 AI 对话或日志中
- 密钥存储在 `~/.litestartup/credentials` 中，只能由脚本读取
- 范围有限：`system.publish`（发布）、`auth`（管理）

## 链接

- **产品页面**：https://www.litestartup.com/products/litestartup-skills
- **文档**：https://www.litestartup.com/docs/en/features/litestartup-skills
- **演示内容仓库**：https://github.com/litestartup-com/litestartup-workspace