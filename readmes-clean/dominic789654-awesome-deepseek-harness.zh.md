![DeepSeek](./assets/deepseek-logo.svg)

# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> 面向 **DeepSeek Harness（DSH）** 的 **插件 / Skill / MCP / Patch（Profile）层 / 编排器 / 聚合器 / UI** 精选清单 —— DeepSeek 官方 agent 运行框架，核心理念 **`Model + Harness = Agent`**。

[English](./README.md) | **简体中文**

DeepSeek Harness（简称 "DSH"）是 DeepSeek 的 agent 运行框架 / harness 层 —— 把模型的推理变成真实行动的那双"手"（上下文管理、工具调用编排、执行沙箱、反馈循环、会话持久化）。它最大的特点是**开放的插件生态**：由社区贡献 plugin、Skill、MCP server、orchestrator、aggregator 和 UI。

本清单收录这个生态里最好的项目。欢迎贡献 —— 见 [贡献指南](#贡献指南)。

> **给作者的提示：** DeepSeek 要求插件仓库带上 **`#dsh`** GitHub topic 以便被发现。给你的仓库加上它，然后来这里提 PR。

![DeepSeek Harness 生态地图](./assets/dsh-ecosystem.svg)

## 快速开始

```bash
# 启动 DSH Web UI
npx @deepseek-ai/dsh web

# 把清单中的社区插件安装到指定 profile
dsh plugin --profile web add "github:owner/repo#main"
```

安装前请确认目标仓库带有 **`#dsh`** GitHub topic，便于社区 hub 收录。

## 官方

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) —— DeepSeek 官方 agent 运行框架（`Model + Harness = Agent`），基于 Cordis 的"一切皆插件"架构（TypeScript，MIT）。  `⭐38238`
- [deepseek-ai/awesome-deepseek-integration](https://github.com/deepseek-ai/awesome-deepseek-integration) —— 官方 DeepSeek API 集成清单。  `⭐38654`
- [deepseek-ai/awesome-deepseek-agent](https://github.com/deepseek-ai/awesome-deepseek-agent) —— 官方支持 DeepSeek 的 agent / harness 清单。  `⭐5426`

## Profile 与 Patch 层

_DSH 的核心组合机制：一个 **profile** 叠加各 bundle 的 patch 层，再叠加你自己的 `cordis.patch.yml`（profile 级 → `$DSH_HOME` 级 → `--patch` overlay），无需 fork 就能重新编排整棵插件树。**任务专精的运行时配方**就活在这一层：长程任务 profile、数学推理 profile、幻灯片编辑 profile，本质都只是不同的 bundle 组合 + patch，不是不同的代码库。凡是在这一层操作的工具/harness（分享或导出整套 profile，或用任务专属 patch 把 DSH 跑成专用后端）都归在这里，而不是塞进通用插件堆里。_

- [asdf17128/dshp](https://github.com/asdf17128/dshp) —— 管理 DeepSeek Harness profile：列出、创建、克隆、diff，并把整套 `dsh` 配置（插件版本 + bundle 顺序 + patch）打包成一个可移植文件分享。
- [AMAP-ML/LongHorizon-Harness](https://github.com/AMAP-ML/LongHorizon-Harness) —— 长程 computer-use harness，带 DSH 适配层：在独立 `DSH_HOME` 下运行 `dsh --profile headless`，按角色差异化 patch 权限（执行者 `workspace-write`，Manager/审计者 `read-only`）——一个任务专精 DSH profile 的具体示范。

## Harness 与运行时

_DeepSeek 原生 / DeepSeek 优先的 agent harness、coding agent，以及运行时级基建（诊断、运维、会话管理、审批策略）。_

- [hxs996-beep/deepAct](https://github.com/hxs996-beep/deepAct) —— 为 DeepSeek 打造的终端 AI 编码代理，为每步行动设守卫：歧义检查、设计评审、范围控制，支持团队协作、子代理并行与 MCP 扩展。
- [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) —— 面向 DSH 的大型插件合集（700+），只通过扩展接缝注册，不修改 agent-loop 骨架。  `⭐24`
- [omdsh-dev/fabric](https://github.com/omdsh-dev/fabric) —— 类似 MC Fabric 的 hook 处理器。
- [omdsh-dev/dsh-session-health](https://github.com/omdsh-dev/dsh-session-health) —— 会话健康检查：对多帧 zstd 会话文件做帧级扫描诊断（torn / 损坏 / 空会话检测），零依赖只读，注册 `session_health` 工具。
- [omdsh-dev/dsh-security-audit](https://github.com/omdsh-dev/dsh-security-audit) —— 本机安全审计插件：覆盖配置、插件来源、会话与网络暴露面，输出只读脱敏风险报告。
- [Zhenyu98/dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) —— 上下文注入审计：统计 AGENTS.md 指令链 / 技能目录 / 工具 schema 的 token 成本，检测重复与冲突；Web UI 圆环面板 + `context_audit` 工具。
- [coppynight/dsh-doctor](https://github.com/coppynight/dsh-doctor) —— flutter-doctor 风格的诊断与修复：覆盖安装级与 harness 内检查，支持安全的自动修复；repository-plugin 格式。
- [lhh010/dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) —— 自动识别 bash 输出编码（UTF-16LE / UTF-8 / GBK 等）并正确解码，修复 WSL / Windows 下 bash 工具的中文乱码。
- [vlln/plugin-registry](https://github.com/vlln/plugin-registry) —— 插件生态基建：管理 repository 插件的浏览器薄控制台（0 patch）+ 引导插件开发的 `make-dsh-plugin` skill。  `⭐13`
- [Andy8647/dsh-auto-approval](https://github.com/Andy8647/dsh-auto-approval) —— 工具调用自动审批：新增 `auto` 审批档位，用规则 + LLM 分类器对每次工具调用判定放行 / 拒绝，输入框旁带状态芯片。
- [zzh-newlearner/dsh-postmortem](https://github.com/zzh-newlearner/dsh-postmortem) —— 面向 DSH 会话的本地优先故障复盘（postmortem）工具。
- [vibeinging/dsh-trace](https://github.com/vibeinging/dsh-trace) —— 遥测后端：把回合、模型步骤和工具调用通过 HTTP 导出到 yiTrace。
- [omdsh-dev/dsh-hub](https://github.com/omdsh-dev/dsh-hub) —— 社区扩展目录与 Profile 生成管理器：在官方契约之上增加事务式安装、恢复、目录浏览和设置 UI。
- [fakechris/dsh-harness-ops](https://github.com/fakechris/dsh-harness-ops) —— 运维工具箱：快照 A/B 双槽升级（原子切换、一键回滚）、守护进程自动拉起 web / agent、web 全挂时一条命令自救诊断。
- [omdsh-dev/session-teleport](https://github.com/omdsh-dev/session-teleport) —— 多设备 Session 接力：以 PostgreSQL 为唯一在线权威，同一时间只有一台设备持有写入凭据。
- [Tieboyh/dsh-session-search](https://github.com/Tieboyh/dsh-session-search) —— 免索引的跨 agent 会话搜索。
- [ilharp/dsh-tool-approval](https://github.com/ilharp/dsh-tool-approval) —— 工具调用手动审批（DSH 的"手动模式 / Ask 模式"）。
- [blissito/ghostycode](https://github.com/blissito/ghostycode) —— DeepSeek V4 终端编程 agent 与“宪法式”harness（Rust TUI，支持 MCP 与子 agent）。
- [didclawapp-ai/zagens](https://github.com/didclawapp-ai/zagens) —— 面向 DeepSeek V4 的开源 agent harness。  `⭐13`
- [liubf21/ds-forge](https://github.com/liubf21/ds-forge) —— 面向 DeepSeek V4 的轻量 agent harness。
- [Owen718/FlashCoder](https://github.com/Owen718/FlashCoder) —— 面向 DeepSeek 模型的简易 harness。
- [ArtificialNotImbecile/dsh-context-taxonomy](https://github.com/ArtificialNotImbecile/dsh-context-taxonomy) —— DeepSeek Harness 的逻辑调用上下文分类（taxonomy）插件。
- [btspoony/dsh-llm-fallbacks](https://github.com/btspoony/dsh-llm-fallbacks) —— 基于角色的模型重试与备用（fallback）策略插件。
- [Drifter-yh/dsh-tool-policy](https://github.com/Drifter-yh/dsh-tool-policy) —— 声明式默认拒绝（deny-by-default）工具策略插件。
- [LingLambda/dsh-undo](https://github.com/LingLambda/dsh-undo) —— 上下文撤销/重做：把模型上下文回滚到上一个完成步骤，并可再恢复。
- [omdsh-dev/omdsh](https://github.com/omdsh-dev/omdsh) —— 社区实验项目：以可审阅、可复现的形式组织版本化的 DSH 组件集与默认配置。
- [omdsh-dev/omdsh-runtime](https://github.com/omdsh-dev/omdsh-runtime) —— 无头执行层：复用官方 Profile/Bundle/Cordis 操作，增加确定性 plan/apply、候选代次与上一代恢复。
- [wangshunnn/oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh) —— DeepSeek Harness 插件合集。
- [yjh051108/dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) —— BepInEx 式模组注入器：运行时把本地插件包热注入运行中的 DSH web，不改 patch、不重启。
- [yoke233/dsh-openai-codex-auth](https://github.com/yoke233/dsh-openai-codex-auth) —— OpenAI Codex OAuth 登录与用量卡片插件。
- [YYTbit/dsh-plugin-claude-bridge](https://github.com/YYTbit/dsh-plugin-claude-bridge) —— 把 Claude Code 的记忆、技能与配置桥接进 DeepSeek Harness。
- [Gordonynh/dsh-plugin-codex-import](https://github.com/Gordonynh/dsh-plugin-codex-import) —— 导入 Codex 历史对话记录到 DSH。
- [Hu9956/dsh-codex-provider](https://github.com/Hu9956/dsh-codex-provider) —— Codex 供应商接入插件（支持 OAuth 登录）。
- [WSL043/dsh-codex-subscription](https://github.com/WSL043/dsh-codex-subscription) —— 缓存 Codex 订阅/用量状态。
- [PerryLink/dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) —— 切换不同的输出风格。
- [Toukaiteio/dsh-effort-tweak](https://github.com/Toukaiteio/dsh-effort-tweak) —— 实时调整 reasoning effort。
- [csiroqa/dsh-backup-sync](https://github.com/csiroqa/dsh-backup-sync) —— 工作区快照备份与 WebDAV 同步。
- [csiroqa/dsh-schedule](https://github.com/csiroqa/dsh-schedule) —— cron 定时任务 + 状态监控。
- [Karuisawa-Mrs/dsh-plugins](https://github.com/Karuisawa-Mrs/dsh-plugins) —— 社区插件合集。
- [BlockRunAI/dsh-clawrouter](https://github.com/BlockRunAI/dsh-clawrouter) —— 为你的 DeepSeek Harness agent 提供“第二大脑”：危险工具调用前的强模型复审，以及一个钱包接入 70+ 模型。
- [gordonlu/dsh-context-lens](https://github.com/gordonlu/dsh-context-lens) —— DeepSeek Harness 的请求上下文分析器：查看每次模型请求间到底变了什么、缓存命中如何变化。
- [green-dalii/dsh-shift-router](https://github.com/green-dalii/dsh-shift-router) —— DeepSeek Harness 的两层模型路由：LLM-Judge 路由、多模型降级链、指数退避失败重试、任务级编排。
- [KitDoesIt/dsh-compaction-instant](https://github.com/KitDoesIt/dsh-compaction-instant) —— 不依赖 LLM 的无损压缩引擎。
- [morlay/session-persistence-rdb](https://github.com/morlay/session-persistence-rdb) —— session 关系型数据库持久化。
- [rainforest888/dsh-plugins-raincode](https://github.com/rainforest888/dsh-plugins-raincode) —— DeepSeek Harness 的模型层：模型池/缓存/重试 + `/skills` 浏览。
- [weijiafu14/dsh-remote-sandbox](https://github.com/weijiafu14/dsh-remote-sandbox) —— 基于 E2B 沙盒的抗崩溃远程执行编星：`ctx.fs`/`ctx.subprocess`，带心跳保活、透明恢复与工作区同步。
- [030611/dsh-telemetry-redactor](https://github.com/030611/dsh-telemetry-redactor) —— 为 DeepSeek Harness 会话遥测数据提供失败即拦截（fail-closed）的导出脱敏。
- [cnyac/dsh-polling](https://github.com/cnyac/dsh-polling) —— 轮询任务/定时任务插件：把 cron 定时任务变成真实会话，支持自然语言创建、模型工具（`polling_*`）与 Web UI。
- [cpj-dev/dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) —— 把 DeepSeek Harness 桥接进 Claude Code，用于评审、批判、委派与会话导入。
- [khiqwq/dsh-system-proxy](https://github.com/khiqwq/dsh-system-proxy) —— 智能出站 HTTP(S) 路由 host 插件：命名代理（http/https/socks4/4a/5/5h）、按主机/供应商/插件规则、直连优先 + 健康记忆回退。
- [lire1131/dsh-undo](https://github.com/lire1131/dsh-undo) —— 插件/皮肤/设置配置的快照与回滚：变更自动保存、撤销/重做栈、快照管理面板、快捷键，另附离线 PowerShell CLI 与 GUI，DSH 启动失败时也能用。
- [omdsh-dev/dsh-scout](https://github.com/omdsh-dev/dsh-scout) —— 面向 DeepSeek Harness 的只读环境探测插件，为智能体提供运行环境、软件版本、系统资源、端口、服务、硬件及工作区信息。
- [sleepinginsummer/dsh-rtk-optimizer](https://github.com/sleepinginsummer/dsh-rtk-optimizer) —— DeepSeek Harness 的 RTK 优化插件。
- [weijiafu14/pi2dsh](https://github.com/weijiafu14/pi2dsh) —— 打通 Pi 与 DSH 生态：一个 Pi Host ABI 让未修改的 Pi 扩展作为原生 DSH 插件运行。
- [wenliang9527/dsh-workspace](https://github.com/wenliang9527/dsh-workspace) —— DeepSeek Harness 的工作区插件。
- [biedongbin/dsh-claude-compat](https://github.com/biedongbin/dsh-claude-compat) —— DSH 插件：将 Claude Code 的 `.claude/` 目录（skills、commands、rules）原生桥接进 DeepSeek Harness。
- [revive/dsh-git-credentials](https://github.com/revive/dsh-git-credentials) —— 让 GitLab/GitHub API token 不进入模型上下文——AES-256-GCM 静态加密，按需暴露工具，带 Web 设置面板。
- [SnowAmberX/dsh-role-router](https://github.com/SnowAmberX/dsh-role-router) —— 基于角色的模型路由插件：planner/subagent 角色路由，附设置卡片与输入框摘要。
- [omdsh-dev/dsh-coding](https://github.com/omdsh-dev/dsh-coding) —— DeepSeek Harness 编码相关插件（上游未提供描述）。
- [byhongyu/oh-my-dsh](https://github.com/byhongyu/oh-my-dsh) — 面向 DeepSeek Harness 的精选编程、科研与投资 Agent 配置集合。
- [Bernardxu123/dsh-plugins](https://github.com/Bernardxu123/dsh-plugins) — DeepSeek Harness (dsh) 插件集合：dsh-sensenova-image 生图 + dsh-vision 看图，克隆即装。
- [boxiaolanya2008/dsh-plugin](https://github.com/boxiaolanya2008/dsh-plugin) — deepseek harness 插件工具。
- [cnzgray/dsh-plugins](https://github.com/cnzgray/dsh-plugins) — DeepSeek Harness 插件集合。
- [linqunxun/dsh-plugins](https://github.com/linqunxun/dsh-plugins) — DeepSeek Harness (DSH) 客户端 UI 插件集合。
- [MaimoryLab/dib](https://github.com/MaimoryLab/dib) — DSH-in-Box：DSH 运行时与插件打包工具。
- [NIyueeE/dsh-container](https://github.com/NIyueeE/dsh-container) — DeepSeek Harness (dsh) 容器镜像：通用开发容器基础镜像，启动时自动更新 dsh，含 compose + Quadlet 示例。
- [Saktawdi/ha-orchestrator](https://github.com/Saktawdi/ha-orchestrator) — DSH 动态 Cordis 插件：为 DeepSeek Harness 提供模型高可用容灾切换与子代理编排。
- [wefio/dsh-plugin-audit](https://github.com/wefio/dsh-plugin-audit) — DSH 插件审计工具。
- [Whning0513/deepseek-protocol-doctor](https://github.com/Whning0513/deepseek-protocol-doctor) — 离线 DeepSeek 协议诊断工具，同时是可安装的 DSH 插件，覆盖工具循环、reasoning_content、严格 schema 与 SSE。
- [woshi-Tom/dsh-status-plugin](https://github.com/woshi-Tom/dsh-status-plugin) — dsh status plugin；可以方便地查看宿主机的运行状态，故障时方便排查。
- [wxxb789/dsh-legion](https://github.com/wxxb789/dsh-legion) — 为 DeepSeek Harness 提供可配置的多模型子代理 Profile。
- [ZhengQingJing/dsh-session-tree](https://github.com/ZhengQingJing/dsh-session-tree) — 为 DeepSeek Harness 提供类 Git 的不可变会话分支功能。
- [devmom/dsh-trajectory-debug](https://github.com/devmom/dsh-trajectory-debug) — DeepSeek Harness 轨迹调试插件。
- [mafeis/dsh-net-proxy](https://github.com/mafeis/dsh-net-proxy) — DeepSeek Harness 网络代理插件。
- [PandaColour/dsh-cmd-starter](https://github.com/PandaColour/dsh-cmd-starter) — 为 deepseek-harness 提供一个命令行启动工具，支持 `--append-prompt`、`--resume` 等类 Claude 命令。
- [jiangrz77/DSHLauncher](https://github.com/jiangrz77/DSHLauncher) — DeepSeek Harness 启动器。
- [AndPuQing/dsh-pi](https://github.com/AndPuQing/dsh-pi) — DeepSeek Harness 插件（dsh-pi）。
- [gyyxs88/dsh-subagent-codex](https://github.com/gyyxs88/dsh-subagent-codex) — DeepSeek Harness 插件，将 Codex 作为子代理接入。
- [bujue600-arch/dsh-testgen](https://github.com/bujue600-arch/dsh-testgen) — 为 DeepSeek Harness 提供自动化单元测试生成：`/testgen` 命令 + `generate_tools` 工具，自动搭建、运行并修复单元测试直至通过。
- [yoke233/dsh-prime-agent](https://github.com/yoke233/dsh-prime-agent) — 受 Prime Agent 启发，为 DeepSeek Harness Code Mode 提供持久化 RLM 控制平面。
- [4060415/Deepseek-harness-routing-layer-](https://github.com/4060415/Deepseek-harness-routing-layer-) — DeepSeek Harness 智能模型自动路由插件，根据任务需求自动选择最合适的模型。
- [1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge) — DSH 原生鸿蒙开发助手：hdc 设备闭环调试 + 离线官方知识层（Tier-1 随包）+ DevEco CLI 构建通道。
- [StyxNether/dsh-auto-approval](https://github.com/StyxNether/dsh-auto-approval) — Trusted Auto：DeepSeek Harness 中介于 workspace-write 与 danger-full-access 之间的中间权限档，自动批准无害命令与可信区域目标。
- [phelpsyacht/dshmath-manim](https://github.com/phelpsyacht/dshmath-manim) — DeepSeek Harness manim 数学动画插件。
- [saurtone/dsh-tool-somark](https://github.com/saurtone/dsh-tool-somark) — SoMark 文档解析工具（`somark_parse`）插件，用于 DeepSeek Harness。
- [niuniu-869/dsh-plugin-cas-kb](https://github.com/niuniu-869/dsh-plugin-cas-kb) — DeepSeek Harness 插件包：条文级中国会计准则（CAS/ASSE）与税法检索，附带保持引用锚定原文条款的技能。
- [LeslieWylie/dsh-ops-kit](https://github.com/LeslieWylie/dsh-ops-kit) — 可复用的 DeepSeek Harness 插件包：证据驱动的记忆、编排、基准测试运维与插件发布工作流。
- [Mars-Sea/dsh-commandcode-provider](https://github.com/Mars-Sea/dsh-commandcode-provider) — 非官方的 DeepSeek Harness LLM provider 插件，适配 Command Code：实时模型目录、推理强度支持、Models 页面卡片。从 pi-commandcode-provider 移植（MIT）。
- [040822/dsh-gzip](https://github.com/040822/dsh-gzip) — dsh-gzip 插件：为 /api 响应启用 gzip，解决低带宽访问下的历史加载失败（30s 超时）。
- [LyleMi/dsh-codex-app-server](https://github.com/LyleMi/dsh-codex-app-server) — DeepSeek Harness 的 OpenAI Codex App Server agent provider 插件。
- [SeverusZh/dsh-plugin-subagent-director](https://github.com/SeverusZh/dsh-plugin-subagent-director) — Subagent Director：为每个子代理单独选择 LLM 提供商/模型，支持角色模板，DeepSeek Harness 插件。
- [TGYD-helige/dsh-pi](https://github.com/TGYD-helige/dsh-pi) — 通过兼容层在 DeepSeek Harness 内运行受信任的 Pi 扩展。
- [FengHuoLinShan/dsh-plugin-llm-balance](https://github.com/FengHuoLinShan/dsh-plugin-llm-balance) — DSH(DeepSeek Harness) 通用插件：API 余额悬浮球。
- [Niuniu-Sir/dsh-data-ledger](https://github.com/Niuniu-Sir/dsh-data-ledger) — 数据台账：DeepSeek Harness 本地数据统一看板——对话/账本/技能/记忆/日志的来源、位置与内容摘要，支持回收站删除、浏览器存储清理。
- [omdsh-dev/dsh-llm-fallbacks](https://github.com/omdsh-dev/dsh-llm-fallbacks) — 基于角色的模型重试备用策略插件。

## 安全与权限

_权限规则、审批复核、安全审计与调用前 policy-check 插件。_

- [PerryLink/dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules) —— Claude Code 式声明权限规则（allow/deny/ask）。
- [PerryLink/dsh-auto-review](https://github.com/PerryLink/dsh-auto-review) —— 二次模型自动审核 approval 请求。
- [PerryLink/dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security) —— 安全审计 skill 包（密钥扫描/依赖审计）。
- [agentic-control-plane/dsh-acp-plugin](https://github.com/agentic-control-plane/dsh-acp-plugin) —— 工具调用前的 policy-check。
- [securstack/securstack-dsh-plugin](https://github.com/securstack/securstack-dsh-plugin) —— 仓库安全扫描适配器。
- [Areium/dsh-fail-logger](https://github.com/Areium/dsh-fail-logger) —— 自动记录工具调用失败原因并沉淀改进建议。
- [lonelymoon87/dsh-guardian](https://github.com/lonelymoon87/dsh-guardian) —— DeepSeek Harness 的运行时工具策略、危险命令拦截与输出脱敏。
- [cyzlmh/dsh-cyber-sec](https://github.com/cyzlmh/dsh-cyber-sec) —— 面向 DeepSeek Harness 的授权安全评估 profile：限范围网络工具、容器化 shell、授权护栏、持久证据、21 个安全 skill 与 7 个专家子 agent。
- [Elaina-real/dsh-tiered-approval](https://github.com/Elaina-real/dsh-tiered-approval) —— DeepSeek Harness 的分档自动复审：静态规则安全网 + LLM 审核员 + 人工兼底 —— 自动放行安全动作、拒绝不可逆动作、其余交给人工。
- [Ox0400/dsh-vault](https://github.com/Ox0400/dsh-vault) —— DeepSeek Harness 的加密凭据金庫 —— AES-256-GCM + TOTP，附模型工具与设置 UI。
- [dingge001/dsh-redact](https://github.com/dingge001/dsh-redact) —— DSH 运行时密钥与 PII 脱敏插件：掩码处理、可逆保险库、执行期替换。
- [lukethecat/dsh-plugin-warroom-garak](https://github.com/lukethecat/dsh-plugin-warroom-garak) —— 面向 Garak 风格安全红队测试流程的 DeepSeek Harness 插件包（上游未提供描述）。
- [slywalker2006/dsh-passwords](https://github.com/slywalker2006/dsh-passwords) —— DSH 登录门户：首次运行配置、静态加密、防暴力破解锁定、审计日志、HTTPS。

## 会话与记忆管理

_跨会话记忆、checkpoint、会话置顶与导航插件。_

- [PerryLink/dsh-memento](https://github.com/PerryLink/dsh-memento) —— 基于 SQLite 的有界跨会话记忆。
- [Spirtxiaoqi7/mindspace-dsh-session-memory](https://github.com/Spirtxiaoqi7/mindspace-dsh-session-memory) —— 会话隔离的个性化记忆。
- [PerryLink/dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind) —— git 快照 checkpoint + `/rewind` 命令回滚。
- [alooshxl/dsh-session-pins](https://github.com/alooshxl/dsh-session-pins) —— 会话置顶菜单。
- [PerryLink/dsh-session-pin](https://github.com/PerryLink/dsh-session-pin) —— 会话置顶。
- [malevrigns/dsh-session-stars](https://github.com/malevrigns/dsh-session-stars) —— 收藏会话。
- [XiLuovo/dsh-session-timeline](https://github.com/XiLuovo/dsh-session-timeline) —— 会话时间轴 UI。
- [unnnnoooo/dsh-cue-plugin](https://github.com/unnnnoooo/dsh-cue-plugin) —— 跨会话引用/cue。
- [Amengclass/dsh-memory](https://github.com/Amengclass/dsh-memory) —— 持久化、可被模型编辑的记忆/笔记存储：新增 `memory_set`/`get`/`delete`/`search` 工具，基于 `ctx.storageDomain` 跨会话保存事实。
- [Bleed00/dsh-claude-mem](https://github.com/Bleed00/dsh-claude-mem) —— 集成 claude-mem 的 DeepSeek Harness 记忆插件。
- [PerryLink/dsh-claude-move](https://github.com/PerryLink/dsh-claude-move) —— 将 Claude Code 会话、记忆、skills 与 CLAUDE.md 迁移进 DSH，无缝恢复。
- [elementor-i/dsh-agentmemory](https://github.com/elementor-i/dsh-agentmemory) —— 为 DeepSeek Harness 提供 agentmemory 能力：完整 `memory_*` 工具、捕获钩子、基于本地 REST 服务的上下文注入。
- [IAMLieutenant/dsh-tool-user-memory](https://github.com/IAMLieutenant/dsh-tool-user-memory) —— DeepSeek Harness 用户记忆插件。
- [Aloneswork/deepseek-harness-evolving-memory](https://github.com/Aloneswork/deepseek-harness-evolving-memory) — DeepSeek Harness 本地语义演化式长期记忆插件。
- [fengshenx/dsh-recall](https://github.com/fengshenx/dsh-recall) — DSH 插件：recall 工具——模型可搜索并读取自己会话的完整事件日志，包括被压缩（compaction）遮蔽的内容；`dsh plugin add` 一条命令安装。
- [GIT121995/dsh-memory-cbdc-plugin](https://github.com/GIT121995/dsh-memory-cbdc-plugin) — DeepSeek Harness 轻量本地长期记忆插件——基于 SQLite，有界召回，无需额外模型调用。
- [cwbcheng/dsh-knowledge-graph](https://github.com/cwbcheng/dsh-knowledge-graph) — DSH Cordis 插件：将任意源文本转化为 AI 知识图谱（事实/推论/概念/定义/示例/反例/规则），并与原文双向链接。
- [LeslieWylie/dsh-session-search-pro](https://githu