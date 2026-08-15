![Hello DSH — 万物皆可插件](assets/banner.png)

**[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的入门第一课**

从「怎么打开终端」开始，30 分钟做出你的第一个插件

[English](README.md) · **中文** · [**开始学 →**](docs/hello-dsh.md)

DSH 的第一句自我介绍是 *"Everything is a Plugin"*。

这不是修辞。装好之后点 Settings → Plugins → Plugin list，看右上角那个数字：

![插件列表](assets/05-plugin-list-133.png)

**133 个。** 里面有 `llm`（模型适配器）、`session`（会话记录）、`webserver`（你正在看的网页服务器）、`ui-sidebar`（左边那条侧边栏），还有 `agent-loop` —— **agent 的主循环本身也是一个插件**。

这个仓库带你从「打开终端」开始，一步步做出你自己的插件，并亲眼看到它的生命周期。

## 开始

**→ [完整教程：Hello DSH](docs/hello-dsh.md)**

> 🌏 教程目前只有中文版，英文版整理中。
>
> ⚠️ **网页版要带 `--patch` 启动**，否则技能不生效且不报错。教程第 3 步有说明，
> 或直接看下面的[「一个要注意的坑」](#一个要注意的坑)。

假设你什么都没有：没装过 Node，没用过命令行。每一节都有检查点，**看到指定结果才往下走**。

### 步骤 · 内容 · 时间
- **步骤**: 1–2 · **内容**: 打开终端、装 Node.js · **时间**: 7 分钟
- **步骤**: 3–5 · **内容**: 启动 DSH、配置密钥、选工作区 · **时间**: 10 分钟
- **步骤**: 6 · **内容**: **亲眼看到 133 个插件** · **时间**: 3 分钟
- **步骤**: 7–8 · **内容**: **做第一个插件、看它的生命周期** · **时间**: 10 分钟
- **步骤**: 9–10 · **内容**: 接下来做什么、原理（选读） · **时间**: 13 分钟

前 8 步约 30 分钟，跑完就能用。

## 给 DSH 加东西的两条路

### 路线 · 写什么 · 门槛 · 适合
- **路线**: **Markdown**（技能） · **写什么**: 一个文本文件 · **门槛**: 5 分钟 · **适合**: 改变模型的判断标准、输出格式、工作流程
- **路线**: **TypeScript**（代码插件） · **写什么**: 一个代码模块 · **门槛**: 半小时起 · **适合**: 注册新工具、接外部服务、改界面

**判断依据：能用大白话说清楚要它怎么做的，走 Markdown 路线。**

教程两条都会带你走一遍。

## 现成的例子

跑完教程想直接用的话，[`examples/skills/`](examples/skills/) 里有 22 个写好的中文技能。

### 让 AI 帮你装（最省事）

把这个链接丢给 Codex、Claude Code、或 DSH 自己：

```
https://github.com/pingfanfan/hello-dsh/blob/main/INSTALL-FOR-AGENTS.md
照这个装
```

它会先检查 Node、DSH、API 密钥三项前置，再拷文件。

### 或者自己跑一条命令

```sh
git clone https://github.com/pingfanfan/hello-dsh.git
cd hello-dsh && ./install.sh
```

先看会做什么：`./install.sh --dry-run`
移除：`./install.sh --uninstall`

### 技能清单

### 技能 · 什么时候用
- **技能**: `hello-dsh` · **什么时候用**: **第一课**：验证插件系统，按层讲解生命周期与原理
- **技能**: `dsh-onboarding` · **什么时候用**: 第一次跑 DSH，或卡在启动、工作区、权限
- **技能**: `dsh-skill-dev` · **什么时候用**: 写技能（Markdown 路线）的完整规则
- **技能**: `dsh-first-plugin` · **什么时候用**: 从零做出第一个代码插件（实测流程 + 三个报错）
- **技能**: `dsh-plugin-dev` · **什么时候用**: 写插件（TypeScript 路线）的完整规则
- **技能**: `dsh-troubleshoot` · **什么时候用**: 起不来、配置没生效、UNKNOWN_TOOL、技能不见了
- **技能**: `plan-before-code` · **什么时候用**: 任务要改多处、有不确定性、超过半天
- **技能**: `code-review-cn` · **什么时候用**: 审查代码改动、PR、diff
- **技能**: `debug-systematically` · **什么时候用**: 遇到 bug、测试失败、本来是好的现在坏了
- **技能**: `explain-codebase` · **什么时候用**: 快速理解陌生项目
- **技能**: `refactor-safely` · **什么时候用**: 重构、拆函数、消除重复
- **技能**: `test-first` · **什么时候用**: 写测试、实现功能、修缺陷
- **技能**: `api-design` · **什么时候用**: 设计接口、加公开方法、定数据结构
- **技能**: `error-handling` · **什么时候用**: 设计错误处理、决定该抛还是该返回
- **技能**: `perf-optimize` · **什么时候用**: 优化性能、排查慢的原因
- **技能**: `security-review-cn` · **什么时候用**: 安全审查、评估攻击面、检查凭据处理
- **技能**: `commit-message` · **什么时候用**: 写提交信息、拆分改动
- **技能**: `pr-description` · **什么时候用**: 写 PR 描述、准备评审
- **技能**: `write-tech-cn` · **什么时候用**: 写中文文档、README、技术博客
- **技能**: `write-docs-cn` · **什么时候用**: 写或整理项目文档、API 说明、教程
- **技能**: `web-research` · **什么时候用**: 联网查资料、核实事实、技术选型
- **技能**: `ask-good-questions` · **什么时候用**: 提技术问题、报 bug、写 issue

装完之后对 DSH 说 **「hello dsh」**，它会带你走一遍，可以一层层往下问。

## 一个要注意的坑

⚠️ **DSH 的网页版默认关闭了技能功能**（命令行版是开着的）。实测于 `0.1.0-rc.6`。

网页版要用技能的话：

```sh
npx @deepseek-ai/dsh web --patch ./enable-skills-in-web.yml
```

配置文件在本仓库根目录。

## 写这份教程时实测到的行为

为了写这个，我在两台干净的 Mac 上从头跑了 DSH。下面这些行为都写进了教程，因为每一条都会让新手卡住而且不报错：

### 发现 · 为什么重要
- **发现**: 网页版出厂时 `tool-skill` 和 `skill-filesystem` 是**禁用的**，`headless` 是启用的 · **为什么重要**: 同一个技能命令行能用、网页版静默失效，没有任何报错
- **发现**: 网页版**必须先选工作区**，发送按钮才会激活 · **为什么重要**: 命令行版没这个限制，所以用 headless 验证时撞不上
- **发现**: 旧的 DSH 进程占着 3080 时，**页面照样能正常打开** · **为什么重要**: 新实例报 `EADDRINUSE` 退出，浏览器连的是旧进程，改什么配置都不生效
- **发现**: `--patch` 是**插入**而不是覆盖，被 patch 的插件会挂载两份 · **为什么重要**: 无害，但插件列表会显示 7 个 skill 插件而不是 5 个
- **发现**: frontmatter 键名写成驼峰会丢弃**整个技能**，只留一条警告 · **为什么重要**: 官方有意的 fail-closed 设计，但不知道的话很难查

全部实测于 `0.1.0-rc.6`。

## 配套工具

`dsh-doctor` —— DSH 配置体检，一条命令扫出会导致静默失效的问题：

```sh
npx dsh-doctor
```

只读不改。每条检查都对应 DeepSeek 官方文档或事故报告里记录过的真实故障。

## 这些技能是怎么写的

参照 DSH 官方仓库的 [`.agents/skills/`](https://github.com/deepseek-ai/deepseek-harness/tree/master/.agents/skills)，那里有 11 个 DeepSeek 自己在用的技能。共同点：

1. **是判断指引，不是清单**（官方原话：*"This skill is guidance, not a complete checklist"*）
2. **列出事实来源**，并说明「读它，不要复述它」
3. **分层**：阻断项 / 检查项 / 不要做的事
4. **单独写「不要做的事」** —— 挡住的问题往往比「要做什么」更多

详见 [docs/writing-skills.md](docs/writing-skills.md)。

## 欢迎投稿

见 [CONTRIBUTING.md](CONTRIBUTING.md)。要求两条：中文、并且你真的在用它。

## 许可

MIT

非官方社区项目，与 DeepSeek 无隶属关系。