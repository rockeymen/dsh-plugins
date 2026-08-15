# DeepSeek Harness 白皮书 · dsh-handbook

**📖 [在线阅读](https://electricitysheep.github.io/dsh-handbook/) · 📄 [下载 PDF](./DeepSeek-Harness-白皮书.pdf) · ⭐ [点 Star 支持](https://github.com/Electricitysheep/dsh-handbook/stargazers)**

  ![dsh-handbook banner](./docs/assets/banner.svg)

> [!WARNING]

> dsh 当前为 `0.1.0-rc.6`（预发布阶段），生产环境请谨慎评估，详见 [ℹ️ 版本说明](#ℹ️-版本说明)。

## 🚀 快速体验（30 秒）

```bash
# 1. 安装（需要 Node.js ≥ 22）
npx -y @deepseek-ai/dsh web

# 2. 浏览器打开 http://127.0.0.1:3080，开始对话
# 3. 或跑一次性任务（适合脚本/CI）
dsh --profile headless "你好，请用一句话介绍自己"
```

> 想系统学？看 [🗺 学习路径（3 天计划）](./docs/roadmap.md)；想先跑？[第 2 章：五分钟快速上手](./docs/02-quickstart.md)；想速查？[📇 一页速查卡](./docs/cheatsheet.md)

  ![dsh Web UI 实测演示](./docs/assets/demo-webui.gif)

  <sub>30 秒看懂 dsh Web UI：新建会话 → 输入任务 → 模型选择 → 发送 → AI 回复</sub>

## 🎯 这是什么

**DeepSeek Harness（`dsh`）**是 DeepSeek 官方 2026-08-13 开源的 Agent 运行时——一个"一切皆插件"（everything is a plugin）的框架。

![](https://github.com/user-attachments/assets/19482c24-2208-468e-ad38-9096d9270f8d)

但官方文档以架构说明为主，**缺少一条从零上手的路径**。

**这本白皮书补上这条路**：从"什么是 Agent 运行时"讲起，到安装、使用、开发插件、性能调优——每一章都有可复制、可运行的命令，全部在本机实测验证。**目标是：任何一个开发者，跟着这本书都能从 0 到 1 用起来、写起来。**

### 为什么值得读（而不是只看官方文档）

### 官方文档 · 本白皮书
- **官方文档**: 架构视角（AGENTS.md / architecture.md） · **本白皮书**: **新手视角**：一条从 0 到 1 的路径
- **官方文档**: 零散示例 · **本白皮书**: **每章可运行**，命令全部实测
- **官方文档**: 无中文教程 · **本白皮书**: **中文优先**，英文同步
- **官方文档**: 无生态实操 · **本白皮书**: **真实插件/PR 拆解**（含踩坑与安全约束）

## 🎁 这本能给你什么

### 如果你是… · 你会得到
- **如果你是…**: 🆕 **第一次接触 dsh** · **你会得到**: 3 天从 0 到 1 学习路径（每天有目标+验收）
- **如果你是…**: 🛠 **开发者** · **你会得到**: 可克隆的插件模板 + 配置参考大全（照抄能跑）
- **如果你是…**: ⚖️ **正在选型** · **你会得到**: 6 个主流 Agent 对比（表格+文字）+ 同模型实测 benchmark
- **如果你是…**: ⚡ **要调优** · **你会得到**: 推理档位策略 + 缓存命中率专题（实测 97%）
- **如果你是…**: 📚 **要案例** · **你会得到**: 5 个真实复杂案例（含耗时/产物/验证）

## 🌟 感谢与社区

首先要感谢每一位 Star、回复和投稿——这本手册不是一个人的作品，是 dsh 社区一起"长"出来的。

发布两天，很幸运得到了这些反馈：

- ⭐ **170+ Stars**——对一份刚发布的教程来说远超预期，感谢大家认可
- 💬 **官方库 138 帖回应**——我们持续在[讨论区](https://github.com/deepseek-ai/deepseek-harness/discussions)和大家一起踩坑、排障、交流
- 🧠 **FAQ 里的 39 条问题大多来自真实提问**——社区问什么，我们沉淀什么（#380/#817/#1052…）
- 📦 收录于 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，阮一峰周刊自荐也已提交
- 🤝 与 20+ 社区项目互链（dsh-usage / dsh-sgme / AgentSoul / dsh-vault 等）

> 内容随讨论区持续更新（[沉淀流水线](./docs/research/feedback-pipeline.md)，19 项可追踪）。如果你觉得有用，Star 是对我们最大的支持。

## 📚 目录（从 0 到 1）

### 🗺️ **[学习路径（3 天计划）](./docs/roadmap.md)** · 从 0 到 1：每天目标 + 验收标准 + 学习原则

### 🟢 阶段 1 · 入门：认知与上手

### 📖 **[第 1 章 · 认识 Harness](./docs/01-intro.md)** · ⚡ **[第 2 章 · 五分钟上手](./docs/02-quickstart.md)**
- **📖 **[第 1 章 · 认识 Harness](./docs/01-intro.md)****: 与主流 Agent 全面对比 · FAQ · [EN](./docs/01-intro.en.md) · **⚡ **[第 2 章 · 五分钟上手](./docs/02-quickstart.md)****: 安装 · web/headless 双模式 · 推理档位 · [EN](./docs/02-quickstart.en.md)

### 🔵 阶段 2 · 开发：骨架与插件

### 🧩 **[第 3 章 · profile 与插件系统](./docs/03-profiles.md)** · 🛠️ **[第 4 章 · 插件开发实战](./docs/04-plugin-dev.md)**
- **🧩 **[第 3 章 · profile 与插件系统](./docs/03-profiles.md)****: 可定制骨架 · 插件挂载 · 扩展点 · 真实坑 · **🛠️ **[第 4 章 · 插件开发实战](./docs/04-plugin-dev.md)****: 从零写第一个插件（完整代码 + 测试 + 实机验证）

### 🟠 阶段 3 · 实战：场景与调优

### 📦 **[第 5 章 · dsh 应用场景](./docs/05-cases.md)** · 🚀 **[第 6 章 · 进阶与性能调优](./docs/06-advanced.md)**
- **📦 **[第 5 章 · dsh 应用场景](./docs/05-cases.md)****: 5 大场景 · 高缓存命中率专题 · 5 行业视角 · **🚀 **[第 6 章 · 进阶与性能调优](./docs/06-advanced.md)****: 推理档位策略 · 耗时分析 · 踩坑清单

### 🟣 阶段 4 · 生态：能力与编排

### 🌐 **[第 7 章 · 生态与资源](./docs/07-ecosystem.md)** · 🧰 **[第 8 章 · 工具与上下文系统](./docs/08-tools-context.md)** · 🔗 **[第 9 章 · MCP 子代理与工作流](./docs/09-mcp-subagent-workflow.md)**
- **🌐 **[第 7 章 · 生态与资源](./docs/07-ecosystem.md)****: 官方入口 · 参与路径 · 阅读建议 · **🧰 **[第 8 章 · 工具与上下文系统](./docs/08-tools-context.md)****: 60+ 能力包地图 · 内置工具 · compaction · **🔗 **[第 9 章 · MCP 子代理与工作流](./docs/09-mcp-subagent-workflow.md)****: 外部工具接入 · 并行子代理 · 多步编排

### 🔴 阶段 5 · 进阶：复杂案例与展望

### 🧪 **[第 10 章 · 复杂实战案例](./docs/10-complex-cases.md)** · 🔮 **[第 11 章 · 未来展望](./docs/11-future.md)** · ⚠️ **[第 12 章 · 已知不足与边界](./docs/12-limitations.md)**
- **🧪 **[第 10 章 · 复杂实战案例](./docs/10-complex-cases.md)****: dsh 真实跑出：数据清洗管线 186s · 5-bug 修复 94s · **🔮 **[第 11 章 · 未来展望](./docs/11-future.md)****: 技术/生态/竞争/机会/风险 预测 + 时间线 · **⚠️ **[第 12 章 · 已知不足与边界](./docs/12-limitations.md)****: rc 版诚实版：不稳定性 · 生态早期 · 跨平台短板

### 🛡️ **[第 13 章 · 安全与沙箱](./docs/13-security.md)** · 💰 **[第 14 章 · 缓存与成本](./docs/14-cost.md)**
- **🛡️ **[第 13 章 · 安全与沙箱](./docs/13-security.md)****: 沙箱机制 · 权限模型 · 审批流 · 插件安全审计清单 · **💰 **[第 14 章 · 缓存与成本](./docs/14-cost.md)****: 缓存命中率实测 97% · 成本模型 · 推理档位联动 · 预算实战

### 📎 附录

### 📚 **[附录 A·术语表](./docs/appendix-glossary.md)** · 📦 **[附录 B·官方包速查](./docs/appendix-packages.md)** · 📊 **[附录 C·Benchmark](./docs/benchmark.md)**
- **📚 **[附录 A·术语表](./docs/appendix-glossary.md)** · 📦 **[附录 B·官方包速查](./docs/appendix-packages.md)** · 📊 **[附录 C·Benchmark](./docs/benchmark.md)****: 30+ 术语 · 命令速查 · 官方 @deepseek-ai/* 包清单 · 同模型 3 Agent 实测

## 💎 内容精华速览（点开即看，不止链接）

📖 第 1 章：认识 DeepSeek Harness —— 三个直觉 + 能力矩阵

- **三个直觉**：dsh = Agent 的乐高底座；harness = 套在模型外的工程层；2026 = Agent 可编程时代
- **核心事实**：MIT 开源 · TypeScript · "一切皆插件" · 2026-08-13 发布
- **dsh vs 5 个主流 Agent 能力矩阵**（Claude Code / Codex / OpenCode / Gemini / Kimi）：开源✅、模型无关✅、**官方级插件体系**（独有）、自定义界面✅、headless CI✅
- **选型决策**：深度定制+生态 → dsh；开箱即用 → Claude Code

⚡ 第 2 章：五分钟快速上手 —— 30 秒跑起来

- **一条命令启动**：`npx -y @deepseek-ai/dsh web` → http://127.0.0.1:3080
- **双模式**：web（对话 UI）/ headless（`dsh --profile headless "任务"`，CI 友好）

- **推理档位三档**：`low`（最快/简单任务）· `high`（默认）· `max`（最强/复杂推理）——**性能关键：思考占工具链 90% 时间**。>注：`low` 为本白皮书实测网关（pi-ai/opencode-go）档位；**DeepSeek 官方适配器为 `off`（关闭思考/最快）/ `high` / `max`**（见 02-quickstart 2.3 注）
- **第一个插件**：Git 面板 4 步挂载

🧩 第 3 章：profile 与插件系统 —— 可定制骨架

- **profile** = bundle 栈 + 你的 patch 层（`package.json` + `cordis.patch.yml`）
- **挂载插件只需 2 处改动**（加依赖 + 加 insert 行）
- **host/client 双半**：一个 npm 包 = Node 侧工具/服务 + 浏览器侧 UI
- **5 大扩展点**：`agent/request` waterfall、`conversationEvents`、`ctx.slots`、`settings`、`ctx.provide`
- **6 个真实踩坑**：rc.1 依赖断裂、插件缺 main、`next()` 忘 await、类型不识别、ModuleLoader、端口占用

🛠 第 4 章：插件开发实战 —— 完整可运行代码

- **从零写提速插件**（完整拆解）：纯函数决策 + `agent/request` waterfall 注入
- **核心技巧**：决策逻辑抽纯函数（单测毫秒级）→ 实机只验证"注入是否发生"
- **3 条开发纪律**：先找扩展点 / 逻辑抽纯函数 / 实机验证不能省
- **实机日志证据**：`calls=[{name:"write"}] => reasoningEffort=low`

📦 第 5 章：实战案例 —— 三个真实开源 PR 的完整闭环

- **Git 面板 push/pull/fetch**（PR #10）：`--force-with-lease` 安全红线 + 本地 bare-repo 集成测试 + Playwright 实机验证
- **HTML 草稿预览**（PR #11）：沙箱安全约束下的 srcdoc 决策纯函数
- **提速插件示例**：长工具链每步思考降档

🚀 第 6 章：进阶与性能调优 —— 时间花在哪

- **性能模型**：工具链任务 90% 时间在模型思考（每次工具调用前）
- **档位策略**：简单轮次 low / 日常 high / 复杂 max——降档是最高杠杆提速
- **7 个真实坑**：含"简单任务突然变快 = 缓存命中"的评测陷阱
- **看成绩单三问**：谁测的 / 什么 harness / 验证器多严

🌐 第 7 章：生态与资源 —— 加入 dsh 生态的地图

- **官方入口**：仓库 / API 文档 / Discord / Discussions
- **当前状态**：官方暂不收外部 PR → **做 dsh-plugin 生态项目是官方点名的贡献方式**
- **新手路径**：用起来 → 小 PR → 发插件 → 写内容

🧰 第 8 章：工具与上下文系统 —— 能力引擎

- **60+ 官方能力包地图**：工具/上下文/会话/子代理/MCP/工作流/安全
- **内置工具（实测）**：read/write/grep/glob/edit/bash/todo/skill
- **产物追踪**：工具返回 locations → 对话末尾可打开产物
- **上下文注入**：系统提示分层 + 技能目录
- **长对话自动压缩**（compaction）+ 沙箱/权限/审批安全层

🔗 第 9 章：MCP、子代理与工作流 —— Agent 系统化

- **MCP**：接入外部工具服务器（社区已有 token 追踪插件）
- **子代理**：并行委派任务（大仓库调研/长任务分解）
- **工作流**：确定性多步编排（拉取→清洗→报表→校验）
- **四阶段新手路径**：单 Agent → +MCP → +子代理 → +工作流

🧪 第 10 章：复杂实战案例 —— dsh 真实跑出来的

- **案例 A**：数据质量分析→清洗→可视化（186s，52→35 行归零，chart.png，含权衡说明）
- **案例 B**：5-bug 修复 + 49 测试（94s，pytest 49 passed，覆盖除零/负数/精度边界）
- **画像**：多步工具链自动编排 + 有判断力 + 产物可追踪
- 隐私声明：全部合成数据/自造代码

📚 附录：术语表 + 命令速查

- **30+ 术语**：harness/profile/bundle/cordis/扩展点/waterfall/compaction…
- **命令速查**：dsh 核心 / 环境 / 排障 / 插件开发
- **Benchmark**：同模型 3 Agent 实测（3 轮中位数）

🔮 第 11 章：未来展望 —— 五个维度的预测

- **技术/生态/竞争/机会/风险** 五维度预测 + 时间线
- **机会点**：官方生态早期，做 dsh-plugin 项目是入场红利

⚠️ 第 12 章：已知不足与边界 —— rc 版诚实说

- **不稳定性**：rc 迭代快、破坏性变更频繁
- **生态早期**：官方包 60+ 但插件生态刚起步
- **跨平台短板**：Windows 家族踩坑记录（含 Node 版本红线）

🛡️ 第 13 章：安全与沙箱模型 —— 敢上生产的关键

- **沙箱机制**：进程隔离（bwrap/Landlock/Seatbelt）+ 权限分级 + 审批流
- **社区审计边界**：node:vm 非安全边界、approval 回环、workspace-write 递归删除等真实逃逸面
- **插件安全审计清单**：第三方审计方法论（[#454](https://github.com/deepseek-ai/deepseek-harness/discussions/454)）

💰 第 14 章：缓存与成本工程 —— 把"便宜"变工程

- **缓存机制**：上下文缓存 + 命中率实测 97%（Flash 折扣 98% / Pro 99%+）
- **成本模型**：token 花在哪 + 推理档位联动 + 真实任务预算
- **可视化**：session log / 余额插件看每笔成本

## 🖥 演示（Demo）—— 直接看效果

### ① Web UI 对话（`dsh web`）

```bash
dsh web    # → http://127.0.0.1:3080
```

![dsh Web UI 对话](./docs/assets/demo-web-chat.png)

### ② Headless CLI（一次性任务，适合脚本/CI）

运行 `dsh --profile headless "你好，请用一句话介绍你自己"`（命令见 [🚀 快速体验](#-快速体验30-秒)）：

```bash
# → 你好！我是 DeepSeek 驱动的 AI 编程助手，可以帮你写代码、调试问题、
#    处理文件、搜索资料，以及完成各种开发和办公任务。
```

### ③ 插件生态（Git 面板，`dsh-better-sidebar`）

![dsh Git 面板（better-sidebar 插件）](./docs/assets/demo-git-panel.png)

> 完整图文演示见 [📺 30 秒看懂 dsh](./docs/demo.md)。

## 🧰 快速上手资产（精华直接看）

📇 一页速查卡 —— 安装 · 命令 · 推理档位 · 排障

```bash
npx -y @deepseek-ai/dsh web          # 安装即启动 Web UI
dsh --profile headless "任务"        # 一次性任务（脚本/CI）
```

推理档位：`low`（最快/简单轮次）· `high`（默认）· `max`（最强/复杂推理）——`low` 为实测网关（pi-ai）档位，**官方适配器用 `off`/`high`/`max`**
> 工具链任务 90% 时间在思考——降档是最高杠杆提速
>