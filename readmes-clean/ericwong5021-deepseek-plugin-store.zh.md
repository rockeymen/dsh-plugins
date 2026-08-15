[![DeepSeek Plugin Store](docs/banner.png)](https://deepseekplugin.store)

# DeepSeek Plugin Store

**发现、安装 DeepSeek Harness 生态中的社区插件、工具与扩展。**

[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)

[**浏览插件商店 →**](https://deepseekplugin.store) · [申请精选](https://github.com/Ericwong5021/deepseek-plugin-store/issues/new?template=plugin-submission.yml) · [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

> **1493 个插件仓库** · 每小时更新 · 上次同步：2026-08-14 08:51 UTC

## 按分类浏览

###  · 分类 · 插件数
- 🎨 · **分类**: [UI 增强](#ui-enhancements) · **插件数**: 401
- 🔁 · **分类**: [工作流与自动化](#workflow-automation) · **插件数**: 158
- 🛠️ · **分类**: [工具集](#tools) · **插件数**: 243
- 🔔 · **分类**: [通知与监控](#notifications) · **插件数**: 29
- 🧑‍💻 · **分类**: [开发辅助](#dev-helpers) · **插件数**: 65
- 🎓 · **分类**: [学习与教育](#learning) · **插件数**: 8
- 🧩 · **分类**: [其他](#misc) · **插件数**: 589

## 热门插件

### # · 插件 · 分类 · Stars
- **#**: 1 · **插件**: [nexu-io/open-design](https://github.com/nexu-io/open-design) · **分类**: UI 增强 · **Stars**: ★85838
- **#**: 2 · **插件**: [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) · **分类**: 其他 · **Stars**: ★80776
- **#**: 3 · **插件**: [titanwings/colleague-skill](https://github.com/titanwings/colleague-skill) · **分类**: 其他 · **Stars**: ★21724
- **#**: 4 · **插件**: [Devin-AXIS/iPolloWork](https://github.com/Devin-AXIS/iPolloWork) · **分类**: 工作流与自动化 · **Stars**: ★3820
- **#**: 5 · **插件**: [imsai-sh/zhuzhiliao](https://github.com/imsai-sh/zhuzhiliao) · **分类**: 工具集 · **Stars**: ★2719

<sub>按当前 GitHub Stars 排序，热度不代表本项目背书。</sub>

## 安装插件

### 将插件商店安装到 DSH Web UI

从 GitHub 安装最新版本：

```sh
npx @deepseek-ai/dsh plugin --profile web add github:Ericwong5021/deepseek-plugin-store
npx @deepseek-ai/dsh web
```

启动 Web UI 后，侧边栏会出现“插件商店”。在商店购物车中点击“直接安装到 DSH”，即可把选中的插件写入 `web` profile；安装新的 DSH 插件后请重启 Web UI 使其加载。

本地开发或验收时：

```sh
cd /path/to/deepseek-plugin-store
npx @deepseek-ai/dsh plugin --profile web add .
```

```sh
# npm 包，预构建，推荐使用
dsh plugin --profile <name> add <npm-package>

# GitHub 源码，首次安装时按提示允许构建，然后重试
dsh plugin --profile <name> add github:<owner>/<repo>
```

> ⚠️ 从 GitHub 源码安装的插件会在你的设备上执行构建脚本。请只安装你信任的来源，并尽可能固定到具体提交： `github:owner/repo#<sha>`.

## 全部插件仓库

🎨 UI 增强 <sup>401 个插件</sup>

### UI 增强

- [nexu-io/open-design](https://github.com/nexu-io/open-design) ★85838 · `open-design` — 🎨 The open-source Claude Design alternative. 🖥️ Local-first desktop app. 🖼️ Your coding agent becomes the design engine: prototypes, landing pages, dashboards, slides, images & video — real files, HTML/PDF/PPTX/MP4 export. 🤖 Claude Code / Codex / Cursor / Gemini / OpenCode / Qwen & 20+ CLIs via BYOK.
- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) ★1355 · `dsh-web-ui` — Plugin and skin collection for DeepSeek Harness (DSH) Web UI - task board, git graph, right-side panel, remote mobile UI, pet, live token stats, and skin center.
- [Anionex/agent-vision-toolkit](https://github.com/Anionex/agent-vision-toolkit) ★756 — 为纯文本模型"看图“设计更好的视觉工具箱和技能，支持多图理解，图片问答，前端UI还原、GUI 自动化等，并可选无缝接入多个主流agent，直接识别粘贴图片｜ A vision toolkit and skill designed for text-only llms — image Q&A, long-screenshot OCR, frontend UI restoration, and GUI automation, with optional seamless integration for Codex, Claude Code, Pi, Oh My Pi, and OpenCode
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) ★555 · `dsh-better-sidebar` — 一个侧边栏的完整工作台，支持三方拓展注册新Tab页面，内置文件渲染编辑/终端/Git/子代理
- [alaliqing/claude-paper](https://github.com/alaliqing/claude-paper) ★290 — 📚 Claude Code plugin that automates research papers study with automatic material generation, code demonstrations, and interactive web viewer.
- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) ★270 · `@dsh-external/dsh-vision-toolkit` — 让纯文本模型更好地做视觉任务的DeepSeek Harness插件：带意图的图片问答、长截图 OCR、UI 还原等｜DeepSeek Harness-native integration for agent-vision-toolkit: image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, Artifacts, and Web UI.
- [Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads) ★265 · `@dsh-external/dsh-ads` — 是兄弟就来蹬我！DSH Web UI 广告：2005 年中文站点风格的侧栏广告 / 对话内信息流 / 角落弹窗 + 一个真实热区比视觉小得多的关闭叉。素材全虚构，域名打码。
- [hust-open-atom-club/oh-dsh](https://github.com/hust-open-atom-club/oh-dsh) ★140 · `@oh-dsh/desktop` — 一站式 DeepSeek Harness 社区发行版：TUI、桌面端与 Web UI 三种形态统一体验，支持分层安装、一步到位，免去手工整合打包。
- [humblebanana/open-record-replay](https://github.com/humblebanana/open-record-replay) ★135 · `open-record-replay` — Open-source macOS record-and-replay workflow recorder for computer use agents. Captures mouse, keyboard, and UI events as structured traces so agents can learn, replay, and automate real desktop tasks.
- [drewnekota/cetus](https://github.com/drewnekota/cetus) ★114 · `cetus` — One macOS app for Claude Code, Codex, and every agent runtime you use — scheduled runs, global hotkey launcher, per-run git worktrees, one review board.
- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) ★108 · `@huiliyi37/dsh-tianshu-tui` — dsh-tianshu-tui — DeepSeek Harness terminal UI +harness workflow。是官方 DeepSeek Harness 上的交互式终端 UI 插件。渲染核心从本仓库自研的harness agent  Tianshu-Tui 演进而来，在官方的基础上增加了TDD、证据门、视觉图像模块等工作流。
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) ★64 · `@dsh-external/dsh-visualize` — DSH 对话内生成式 UI 插件：模型把交互式 HTML 卡片直接画进会话流——visualize 工具 + 配套 skill + 沙箱渲染卡，带流式预览、组件浮入动画与鲸鱼蓝主题跟随
- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) ★58 · `@zseven-w/dsh-openpencil` — OpenPencil design preview and editing plugin for DSH
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) ★56 · `@omdsh-dev/dsh-genui` — GenUI for DeepSeek Harness: interactive UI components rendered inline in assistant replies via the dsh-ui fence — layout, charts, plots, forms, quizzes, mermaid, 3D scenes, and an action event loop back to the model. Ships the fence-teaching host plugin, the browser renderer (client half), and the genui skill.
- [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) ★50 — Lightweight Windows launcher for DeepSeek Harness: silent autostart at logon + a minimal WebView2 window instead of a full browser
- [Lyn-77/ProMentor](https://github.com/Lyn-77/ProMentor) ★48 — ProMentor 是一个 AI Coding Agent Skill。装上它，你的 AI 编程助手立刻化身为导师——扫描项目架构、生成阶梯式 Chapter、带你手写核心逻辑、自动判题、AI Code Review。
- [ChisaAlter/Deepseek-Harness-Desktop](https://github.com/ChisaAlter/Deepseek-Harness-Desktop) ★31 · `deepseek-harness-desktop` — DSH桌面端，支持主题和背景图等多种个性化配置。Electron desktop shell for DeepSeek Harness web UI
- [csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) ★30 · `dsh-memory-evolve` — 为 DeepSeek Harness 带来「跨会话长期记忆 + 后台自我进化」能力的纯插件实现：五轨记忆 · git 分支感知 · 回合内自我审查 · 技能自我进化与技能管理器 · 四轨待办 · COI 调度 · 会话广播 · 会话搜索 · 提示词管理器 · 临时信息便签——零核心修改、零运行时依赖，随装随用、卸载即净。
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) ★26 · `dsh-ui-status-label` — 把你鲸鱼娘思考时的 deep diving 自定义成任意你想要的样子
- [lhh010/dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) ★23 · `@dsh-external/dsh-ui-whale` — 【求⭐】🐋DSH Web UI 全手绘像素鲸鱼伙伴插件：会话标题栏常驻，平时眨眼/偶尔摆尾/动胸鳍，思考运行时持续动起来，回合完成头顶喷水，点击还会冒爱心，不工作时还会偷懒睡觉，零核心改动。 【喜欢的话就点点star⭐吧~】
- [ali-meoo/meoo-cli](https://github.com/ali-meoo/meoo-cli) ★21 — meoo cli 是秒悟（Meoo）官方推出的命令行工具，让 Claude Code、Codex、Cursor、Qoder等本地 agent 在帮你写完前端代码后，能直接接管「数据库、用户登录、文件存储、部署上线」的所有云端工作——你只需要在终端跑一条命令，剩下的交给 AI。
- [omdsh-dev/dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) ★20 · `dsh-custom-tool` — Create and manage sandboxed JavaScript tools for DeepSeek Harness with a Monaco editor and model-driven tool lifecycle.
- [whiteguo233/dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) ★19 · `@openbiliclaw/dsh-plugin` — OpenBiliClaw 是本地运行的跨平台个性化内容推荐 Agent，持续理解你的兴趣并主动找内容。本仓库是它的 DeepSeek Harness 插件：DSH 界面常驻第四栏（推荐/内容库/对话/画像/设置），注册 22 个 Agent Bridge 工具，让 Agent 也能读推荐、答探测、闭环学习。
- [huiliyi37/dsh-tianshu-build](https://github.com/huiliyi37/dsh-tianshu-build) ★19 · `@huiliyi37/dsh-tianshu-root` — dsh-tianshu-tui — DeepSeek Harness terminal UI
- [william-jin-cmu/dsh-vision](https://github.com/william-jin-cmu/dsh-vision) ★15 · `@dsh-external/dsh-vision` — dsh 插件：给纯文本 DeepSeek 加视觉——view\_image 工具桥接任意 OpenAI 兼容 VLM（默认智谱免费档，实测 4 厂商 10 模型）
- [Nwflower/dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) ★15 · `dsh-chat-import` — 从Claude Code、Codex、Reasonix等Agent工具导入历史消息，并在DSH中继续对话
- [bruc3van/dsh-desktop](https://github.com/bruc3van/dsh-desktop) ★15 · `dsh-desktop` — DeepSeek Harness Desktop 是一款第三方桌面客户端，通过直接加载官方 Web UI，为普通用户提供开箱即用的独立桌面体验：它可以自动复用本机已运行的官方实例，也可以使用安装包内置的 dsh 运行时启动服务，无需用户额外安装 Node.js 或 CLI，并提供智能连接、远程实例连接、托盘常驻、运行时监护和异常恢复等桌面增强。
- [ccq1/dsh-side-panel](https://github.com/ccq1/dsh-side-panel) ★15 · `@dsh-external/dsh-side-panel` — DSH 侧边栏，集成文件浏览器、终端和 Git 审查，方便预览文件。
- [JustGenius-s/DSH-Desktop](https://github.com/JustGenius-s/DSH-Desktop) ★14 · `dsh-desktop` — DSH-Desktop
- [dancingmemory/dskin](https://github.com/dancingmemory/dskin) ★12 · `dskin` — DSKIN · DeepSeek Harness（DSH）卡通像素皮肤插件 / Cartoon pixel skin plugin for DSH Web GUI — 原始界面不动，像素宠物会散步、眨眼、跳跃 / living pixel pets that stroll, blink and hop
- [omdsh-dev/dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) ★11 · `@yejiming/dsh-data-agent` — Data Agent for DeepSeek Harness: session-scoped database connections with a dedicated agent preset that lets AI write SQL and iterate against live execution feedback.
- [dingyi222666/dsh-focus-chat](https://github.com/dingyi222666/dsh-focus-chat) ★11 · `@dingyi222666/dsh-focus-chat` — 为 dsh 提供新的「聚焦会话」精简会话视图，更轻松易于阅读，只关注最终产出结果。
- [CanglongCl/dsh-web-review](https://github.com/CanglongCl/dsh-web-review) ★11 · `dsh-web-review` — DeepSeek Harness Web GUI 的网页预览与元素批注插件，让 AI 根据可视化反馈直接修改前端源码。
- [lhh010/dsh-minigames](https://github.com/lhh010/dsh-minigames) ★11 · `@dsh-external/dsh-minigames` — DSH Web UI 右侧小游戏面板：18 款离线小游戏（恐龙跳一跳 / 俄罗斯方块 / 坦克大战 / 扫雷 / 2048 / 数独 / 吃豆人 / 跟枪练习等），可扩展游戏注册表，等待模型回复或修 bug 时的摸鱼神器
- [dsh-tui/dsh-tui](https://github.com/dsh-tui/dsh-tui) ★10 · `@dsh-tui/dsh-tui` — Claude Code-style terminal UI for DeepSeek Harness agents, as an out-of-tree dsh plugin bundle
- [N0zoM1z0/vocaloid-mcp](https://github.com/N0zoM1z0/vocaloid-mcp) ★9 · `vocaloid-mcp-server` — An agent-native MCP for composing, tuning, rendering, mixing, and auditing native VOCALOID3/4 projects — built just for fun.
- [omdsh-dev/dsh-gomoku](https://github.com/omdsh-dev/dsh-gomoku) ★9 · `@deepseek-ai/dsh-gomoku` — 在DSH中与AI下五子棋，也可以让AI对局，看哪个AI棋力更强
- [omdsh-dev/dsh-lark](https://github.com/omdsh-dev/dsh-lark) ★9 · `dsh-lark-channel` — Lark/Feishu IM bot channel for DeepSeek Harness: chats drive agents, replies and approvals return as messages and cards | 飞书 DeepSeek Harness 插件
- [yjh051108/dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) ★8 · `@dsh-external/dsh-super-injector` — 超级模组注入器：运行时注入任意本地 DSH 插件包（junction 链接 + loader.create，不碰 patch/package.json/不重启），热重载全家桶 + 开发侧挂区一键转正 + 一键卸载 + 路由自愈 + 插件管理 UI（设置页：列表/卸载/拖入内化），清单持久化重启自动恢复——DSH 生态的 BepInEx 式模组注入入口
- [chyra-moon/deepseek-harness-desktop](https://github.com/chyra-moon/deepseek-harness-desktop) ★8 · `deepseek-harness-desktop` — DeepSeek Harness desktop shell: 1:1 replica of the official web UI as a Windows desktop app (community project)
- [HsiangNianian/dsh-auto-continue](https://github.com/HsiangNianian/dsh-auto-continue) ★8 · `dsh-client-auto-continue` — DSH Web UI plugin: automatically sends "继续" (continue) when a request is interrupted by network errors or other non-human causes
- [HuanLinOTO/dsh-plugin-mineru](https://github.com/HuanLinOTO/dsh-plugin-mineru) ★7 · `@huanlin/dsh-plugin-mineru` — 向模型暴露 MinerU 文档解析工具，将 PDF/图片/DOCX/PPTX/XLSX 转为结构化 Markdown/JSON | Exposes MinerU document-parsing tools to the model, converting PDF/images/DOCX/PPTX/XLSX into structured Markdown/JSON
- [vlln/dsh-task-status](https://github.com/vlln/dsh-task-status) ★7 · `@dsh-external/dsh-task-status` — DSH 插件：后台任务状态条（对话页任务进度 + 实时输出 tail）。官方 bundle 插件，dsh plugin --profile web add 安装
- [lhh010/dsh-ui-progress](https://github.com/lhh010/dsh-ui-progress) ★7 · `@dsh-external/dsh-ui-progress` — DSH Web UI 会话进度插件：输入框停靠区常驻会话进度条（todos 真实进度 / 实时 token 生成速率 / 中断橘红态 / 待办提醒），零核心改动
- [Fishquito7/dsh-skill-viewer](https://github.com/Fishquito7/dsh-skill-viewer) ★7 · `dsh-skill-viewer` — DSH Web UI plugin: Skills settings section with hot enable/disable, delete and add
- [bill9109/dsh-web-ui-notify](https://github.com/bill9109/dsh-web-ui-notify) ★6 · `@bill9109/dsh-web-ui-notify` — 为 DSH 增加桌面通知提醒
- [LoserFox/telegram](https://github.com/LoserFox/telegram) ★6 · `@loserfox/telegram` — Telegram Bot API 桥接插件：长轮询、per-chat 会话、HTML 格式化
- [gameswu/dsh-plugin-background](https://github.com/gameswu/dsh-plugin-background) ★6 · `dsh-plugin-background` — dsh壁纸插件
- [ayuanwong/deepseek-harness-ux](https://github.com/ayuanwong/deepseek-harness-ux) ★6 · `@deepseek-ai/dsh-root` — 长任务，不刷屏：关键进度清晰可见，完成后自动折叠，详情随时展开。 Long agent tasks, without transcript clutter: focused progress, auto-folded history, details on demand.
- [Zhenyu98/dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) ★6 · `dsh-context-doctor` — DSH 上下文注入审计插件：统计 AGENTS.md 指令链/技能目录/工具 schema 的 token 成本，检测重复与冲突；Web UI 圆环面板 + context\_audit 工具。Context Doctor for DeepSeek Harness: audit instruction-chain / skill catalog / tool schemas token cost.
- [Sev7een/ds-api-usage](https://github.com/Sev7een/ds-api-usage) ★6 · `dsh-plugin-ds-api-usage` — DeepSeek Harness plugin: real-time DeepSeek API balance and usage timeline (cost / tokens / request count), rendered in a settings page.
- [LaplaceYoung/dsh-qq2006](https://github.com/LaplaceYoung/dsh-qq2006) ★6 · `@dsh-external/dsh-qq2006` — DSH (DeepSeek Harness) 的 QQ2006 皮肤插件：注册 qq2006 主题、镜像 body\[data-ds-skin\]、全局皮肤表与完整素材
- [suzike/freestyle-dsh-theme](https://github.com/suzike/freestyle-dsh-theme) ★6 · `@linxin666/freestyle-dsh-theme` — DeepSeek Harness 主题体验插件：OKLCH 主题提案 + 主题设计器（跨重启持久化）
- [runzhliu/deepseek-harness-docker](https://github.com/runzhliu/deepseek-harness-docker) ★5 — Community Docker and Kubernetes packaging for DeepSeek Harness (@deepseek-ai/dsh), with a hardened image, Compose stack, Helm chart, Web UI, and headless CLI.
- [Toukaiteio/dsh-plugin-installer](https://github.com/Toukaiteio/dsh-plugin-installer) ★5 · `dsh-plugin-installer` — A marketplace plugin to quickly integrate your DeepSeek Harness into the GitHub plugin ecosystem.
- [wssfk12138/dsh-wechat-notify](https://github.com/wssfk12138/dsh-wechat-notify) ★5 · `dsh-wechat-notify` — DeepSeek Harness 插件：为 agent 新增 wechat\_notify 工具，让 AI 通过本机 ClawBot 微信通道主动给你发通知（任务完成 / 需决策时），中文可靠、掉线自提示。
- [gxinxing/deepseek-harness-tui](https://github.com/gxinxing/deepseek-harness-tui) ★5 · `deepseek-harness-tui` — Terminal-native interactive TUI for DeepSeek Harness (dsh) — built with Ink, React for terminals
- [opensetk/dsh-xiaohei](https://github.com/opensetk/dsh-xiaohei) ★5 · `dsh-pet` — dsh的罗小黑插件
- [moxisuki/dsh-lan](https://github.com/moxisuki/dsh-lan) ★5 · `dsh-lan` — DeepSeek Harness（dsh）的局域网插件：一条 overlay 把 dsh web 绑定到局域网，并通过 index tap 注入 crypto.randomUUID    │ polyfill 修复非安全上下文启动崩溃。
- [THU-MAIC/dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic) ★5 · `@openmaic/dsh-openmaic` — OpenMAIC for DeepSeek Harness: classrooms, slides, interactive widgets, and Socratic teaching
- [turtle1999/turtle-ui](https://github.com/turtle1999/turtle-ui) ★5 · `@deepseek-ai/dsh-tui` — as is, no warranty
- [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) ★5 · `@your-scope/dsh-plugin-template` — 基于原turtle ui官方仓库创建的plugin模板仓库
- [DietCokewithSugar/dsh-user-experience](https://github.com/DietCokewithSugar/dsh-user-experience) ★5 · `dsh-user-experience` — Persona-driven UX walkthrough plugin for DeepSeek Harness (DSH) - scans React + TypeScript source code for UX issues, pinpoints them, and suggests fixes.
- [liyupi/dsh-kun-like-pet](https://github.com/liyupi/dsh-kun-like-pet) ★5 · `dsh-kun-like-pet` — Kun Like 桌宠 —— DeepSeek Harness 桌面宠物插件：右下角小坤宠随 Agent 工作状态切换 9 种动作，任务完成播放「你干嘛~哎哟」
- [cpj-dev/dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) ★5 · `dsh-plugin-cc` — Bridge Deepseek-harness into Claude Code for review, critique, delegation, and session import.
- [HuanLinOTO/dsh-plugin-yet-another-subagent](https://github.com/HuanLinOTO/dsh-plugin-yet-another-subagent) ★4 · `@huanlin/dsh-plugin-yet-another-subagent` — 可配置子代理 profile 系统，单一 subagent 工具 + profile 参数，含 Web UI 设置/实时进度/子代理树 | Configurable subagent profile system: single subagent tool + profile param, with Web UI settings/real-time progress/subagent tree
- [Favio8/dsh-plugin-deepeye](https://github.com/Favio8/dsh-plugin-deepeye) ★4 · `dsh-plugin-deepeye` — DeepEye vision plugin for DeepSeek Harness (DSH): image description, OCR, VQA, UI layout, and clipboard analysis.
- [omdsh-dev/dsh-advisor](https://github.com/omdsh-dev/dsh-advisor) ★4 · `dsh-advisor` — Advisor - Pair a second model that passively reviews each turn and injects notes.  搭配一个会在每轮对话被动注入见解和审查的副模型。
- [lehhair/dsh-diff-viewer](https://github.com/lehhair/dsh-diff-viewer) ★4 · `@dsh-external/dsh-diff-viewer` — DSH Web GUI PiUI-style diff viewer plugin: replaces the stock DiffBlock for write/edit tool calls via ui-tool diff-card chain slots (host patch included). Private.
- [01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator) ★4 · `dsh-status-rotator` — A DeepSeek Harness (dsh) web plugin that replaces the "Deep diving…" turn-status label with phase-aware, typewriter-animated, rainbow-gradient phrases — all configurable from a JSON file.
- [Yan-Zero/dsh-codex](https://github.com/Yan-Zero/dsh-codex) ★4 · `dsh-codex` — Use your ChatGPT subscription in DeepSeek Harness through OpenAI's Codex sign-in flow
- [yuezengwu/dsh-explain](https://github.com/yuezengwu/dsh-explain) ★4 · `dsh-explain` — DSH 本地优先学习模式插件：跨会话全局学习线程、按来源讲解、ExplainContext、压缩与可诊断设置界面
- [FlashingChen/dsh-worktree](https://github.com/FlashingChen/dsh-worktree) ★4 · `dsh-worktree` — Codex-style permanent git wor