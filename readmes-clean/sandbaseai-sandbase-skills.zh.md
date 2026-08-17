# SandBase Skills

**88 个可安装 Agent Skill** — 覆盖调研、社交媒体情报、营销和商业工作流。旗舰调研 Skill 可直接使用 Agent 自带的搜索工具，无需 SandBase 账号；需要更多专业数据源时再连接 SandBase。

## 什么是 Skill？

Skill 是一个指令文件，教会 AI Agent 如何完成特定工作。每个 Skill 定义可复用的工作流、证据规则和输出格式。通用 Skill 可使用 Agent 已有能力，专业社交、市场和数据工作流则可按需接入 SandBase。

## 快速开始

```bash
# 无需安装，先生成完整 Skill 提示词
npx skills use sandbaseai/sandbase-skills@multi-source-search

# 或安装到 Codex
npx skills add sandbaseai/sandbase-skills --skill multi-source-search --agent codex

# 使用 Agent 已有的网页搜索和页面读取工具
# "用多个独立来源核实这个说法，并验证证据账本"
```

### DeepSeek Harness

在 DeepSeek Harness 项目根目录运行：

```bash
npx --yes github:sandbaseai/sandbase-skills add multi-source-search
dsh web
```

安装器会把完整 Skill 复制到 DeepSeek Harness 的项目级发现目录
`.dsh/skills/multi-source-search`。命令直接使用 GitHub 源码，无需发布到 npm，
也无需 SandBase 账号。

## Skill 分类 (88 个)

### 分类 · 数量 · 场景
- **分类**: **社交媒体情报** · **数量**: 14 · **场景**: Twitter、YouTube、Instagram、TikTok、小红书、微博、B站、抖音等
- **分类**: **搜索与调研** · **数量**: 17 · **场景**: 多源搜索、学术论文、趋势发现、新闻聚合
- **分类**: **商业情报** · **数量**: 20 · **场景**: 公司调研、竞品分析、人才情报、销售线索
- **分类**: **营销与内容** · **数量**: 15 · **场景**: 品牌监控、KOL 发现、社交聆听、危机监控
- **分类**: **SEO** · **数量**: 5 · **场景**: 关键词策略、反链分析、SERP 分析、站点审计
- **分类**: **工具** · **数量**: 17 · **场景**: 邮箱验证、域名分析、截图、YouTube 转写、天气

完整 Skill 列表请查看 [英文 README](./README.md#skill-catalog-88-skills)。

## 支持的 Agent

- **Claude Code** — `~/.claude/skills/`
- **OpenAI Codex** — `~/.codex/skills/`
- **Cursor** — `~/.cursor/skills/`
- **Gemini CLI** — `~/.gemini/skills/`
- **OpenClaw, Hermes, Amp, Devin** — 通过 `npx skills add`

## 工作原理

```
用户提问 → Agent 读取 SKILL.md → 使用已有工具（可选 SandBase）→ 综合分析并输出结果
```

## 定价

Skill 本身免费开源 (Apache-2.0)。`multi-source-search` 使用 Agent 自带工具时无需 SandBase 账号或 SandBase API 费用；需要专业数据源的 Skill 可按用量调用 SandBase。

**[SandBase Skills](https://github.com/sandbaseai/sandbase-skills)** — 88 个开源 Agent Skill，按需连接更多数据源。