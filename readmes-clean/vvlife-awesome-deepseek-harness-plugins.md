# Awesome DeepSeek Harness Plugins

> **中文导读**：这是 DeepSeek Harness（DSH）生态的插件精选列表，英文为主维护，中文说明见各章节标题下方。想直接上手的高星插件评测请看 [Hands-on Notes](#hands-on-notes)。

A curated list of plugins, tools, skins, bridges, and extensions for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) — the
open-source agent framework from DeepSeek, built on the motto
**"Everything is a Plugin."**

DSH launched its developer preview on **2026-08-13** (MIT license, Cordis-based).
Within a day the community shipped a wave of plugins; this list tracks the
notable ones and points to the rest.

> Star counts are a launch-day snapshot (2026-08-13) and drift fast. For the
> unmoderated, auto-refreshed index of every repo tagged `dsh-plugin`, see
> [PLUGINS.md](PLUGINS.md) (regenerated daily by
> [update.yml](.github/workflows/update.yml)).

> **生态入口 / Ecosystem**：想找插件不想翻列表？去 **[WhaleHub](https://whalehub-dsh.vercel.app)** —— 基于本列表每日同步的可视化插件市场（搜索 / 分类 / 一键复制安装命令，还能装进 DSH Web 里点一下直装）。想零配置上手 DSH？试 **[DeepSeek Harness Desktop](https://dsh-desktop.vercel.app)** —— 自包含 macOS APP（内置 Node + dsh + Paseo），拖进「应用程序」即用。

## How to install a plugin

**中文**：DSH 把插件当作 [Cordis](https://github.com/cordiverse/cordis) bundle 加载，最常用的两条路：npm 包用 `dsh plugin add <npm-package>`，仓库托管（`.dsh-plugin` 形态）用 `github:<owner>/<repo>` 形式。

DSH loads plugins as [Cordis](https://github.com/cordiverse/cordis) bundles.
Two common paths:

```sh
# npm-scoped plugin (recommended)
dsh plugin add <npm-package>

# repo-hosted plugin (the .dsh-plugin format)
# add to your profile's cordis.yml, or via the CLI patch layer:
# github:<owner>/<repo>#<ref>&path:/.dsh-plugin
```

Start the Web UI and manage models/workspaces there:

```sh
dsh web            # http://127.0.0.1:3080
```

## Official built-in plugins

**中文**：框架本体在 `@deepseek-ai/dsh-*` 这个 npm scope 下自带约 50 个内部插件包，是所有社区插件的参考实现与"接缝"底座（llm / shell / fs / web / subagent / plan / sandbox / hooks / skill …）。

The framework itself ships ~50 internal plugin packages under the
`@deepseek-ai/dsh-*` npm scope. They are the reference implementations and the
building blocks every community plugin extends. Highlights:

- **`deepseek-ai/deepseek-harness`** — the framework and all built-in packages.
  See [`packages/README`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/README.md)
  for the full map: `llm` (model adapters), `shell`/`terminal`/`code-runtime`
  (execution), `fs`/`lsp` (files & language servers), `web` (search/fetch),
  `subagent` (delegation), `plan`, `sandbox`, `hooks`, `skill`, `compaction`,
  `extensions` (runtime self-modifying plugins), and the `web`/`cli` apps.

Everything below is community-built and sits on top of these seams.

## Community plugins

### Web UI & Skins

**中文**：给 DSH 网页界面换肤、加任务看板、宠物、移动端远程等"界面增强"类插件。

- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) (★300) — Plugin & skin collection for the DSH Web UI: task board, git graph, right-side panel, remote mobile UI, pet, live token stats, skin center.
- [bpc-oss/dsh-web-billing](https://github.com/bpc-oss/dsh-web-billing) (★9) — RMB/USD token billing for the DSH web: official-policy auto pricing (incl. peak/off-peak hours), per-message cost ledger, account balance, local-model savings tracking (¥/$ follows the UI language).
- [Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) (★56) — "Whale-girl" skin series (maid-atelier), CC BY-NC-SA 4.0.
- [Tommy00748/dsh-theme-cyberpunk2077](https://github.com/Tommy00748/dsh-theme-cyberpunk2077) (★12) — Cyberpunk 2077 / Night City theme: NC yellow × neon cyan, CRT scanlines, Kiroshi hover lock-on, combat-state HUD, synthesized typewriter & message SFX, hidden easter eggs (relic / johnny).
- [Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads) (★61) — Tongue-in-cheek 2005-style Chinese-site ads in the sidebar / chat feed / popups.
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) (★18) — Customize the "deep diving" thinking-status label however you like.
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) (★9) — GenUI: interactive components (layout, charts, mermaid, 3D) rendered inline via the `dsh-ui` fence.
- [vlln/whale-girl](https://github.com/vlln/whale-girl) (★10) — Desktop-pet plugin (QQ-pet style): draggable, feedable, accumulative companion.
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) (★15) — Generative UI: the model draws interactive HTML cards straight into the chat stream.
- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) (★19) — OpenPencil design preview & editing plugin.
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) (★9) — Select text → annotate → send as a message; bubble-hidden annotation blocks.
- [Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use) (★6) — Computer-use plugin for DSH.

### Terminal & Desktop

**中文**：把 DSH 从网页端带到终端、桌面，或做成独立 App / 启动器。

- [ccch1mneyyy/dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui) (★96) — Claude Code-style full-screen TUI: pixel-whale top bar, live status row, streaming thoughts, double-Esc rollback, context bar + TPS meter. One-line npm install.
- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) (★53) — DSH terminal UI.
- [chen-001/dsh-grok-tui](https://github.com/chen-001/dsh-grok-tui) (★5) — Grok-style TUI.
- [hust-open-atom-club/oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh-desktop) (★46) — Extensible macOS workbench: native PTY, workspace tools, live bilingual plugins, isolated-preview plugin marketplace.
- [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) (★9) — Lightweight Windows launcher: silent logon autostart + a minimal WebView2 window instead of a full browser.
- [bitterSmilezzz/dsh-mac-desktop](https://github.com/bitterSmilezzz/dsh-mac-desktop) (★1) — macOS desktop wrapper.
- [hanelalo/browser-bridge](https://github.com/hanelalo/browser-bridge) (★17) — Let your agent drive your real browser window like you would.
- [Lum1104/dsh-browser](https://github.com/Lum1104/dsh-browser) (★16) — Chrome sidebar extension so DSH operates your browser directly, no vision needed.
- [whiteguo233/dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) (★4) — Bilibili integration for DSH.
- [vvlife/deepseek-harness-desktop](https://github.com/vvlife/deepseek-harness-desktop) — Self-contained macOS app: bundles the Node runtime + full dsh + full Paseo (daemon + Web UI + mobile pairing) into one APP — drag to Applications and go, zero pre-install. Mobile QR pairing, WhaleHub plugin marketplace, built-in HTML preview, one-click public deploy; isolated from any dsh/Paseo already on your machine.

- [Zhuchen00123/dsh-wsl-modes](https://github.com/Zhuchen00123/dsh-wsl-modes) (★1) — DSH WSL presets: minimal-wsl + code-wsl with WSL Linux bash + bwrap sandbox and anchored bootstrap.

### Vision & Multimodal

**中文**：让纯文本模型也能"看图"：图像问答、长截图 OCR、UI 还原、像素比对等。

- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) (★106) — Vision toolkit for text-only models: intent-aware image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, Artifacts, Web UI.
- [windyslime/DeepSee](https://github.com/windyslime/DeepSee) (★1) — DSH `0.1.0-rc.5` Web-profile vision integration: image turns go through a local DeepSee gateway with pluggable VLM backends while normal text routing stays in DSH.
- [zhouwumu2-lab/dsh-vision-fix](https://github.com/zhouwumu2-lab/dsh-vision-fix) (★10) — Vision fix / repair helper.
- [sjscy05/deepseek-harness-vision-plugin](https://github.com/sjscy05/deepseek-harness-vision-plugin) — Vision plugin for DSH.
- [good-boy4069/Deepseek-omnimodal](https://github.com/good-boy4069/Deepseek-omnimodal) (★2) — Omnimodal support.
- [YYTbit/dsh-plugin-vision-toolkit](https://github.com/YYTbit/dsh-plugin-vision-toolkit) — Vision-toolkit bridge.

### Tools & Editor UX

- [Zhangbo-cn/dsh-voice-input-plugin](https://github.com/Zhangbo-cn/dsh-voice-input-plugin) (★6) — Composer mic for the Web UI: tap-to-monitor live transcription and hold-to-talk, with host Edge TTS reply reading that streams while the model generates, echo-pause during reading, and tap-to-stop.

**中文**：编辑器体验增强、`@file` 引用、消息分支编辑、会话回滚等"好不好用全靠它"的小工具。

- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) (★21) — Codex-style `@file` mentions: search workspace files in the composer and attach their contents to prompts.
- [omdsh-dev/dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) (★17) — Create & manage sandboxed JavaScript tools with a Monaco editor and model-driven tool lifecycle.
- [Moeblack/dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) (★9) — Branch-based message editing, reroll, retry, version timeline.
- [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) (★16) — Rewind conversation + workspace state via a persistent Change Ledger.
- [Electricitysheep/dsh-tool-turbo](https://github.com/Electricitysheep/dsh-tool-turbo) (★1) — Tool turbo.
- [LingLambda/dsh-undo](https://github.com/LingLambda/dsh-undo) (★1) — Undo support.
- [fakechris/dsh-track](https://github.com/fakechris/dsh-track) (★1) — Tracking helper.
- [omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) (★1) — Skills plugin.
- [leechen298/Code2Skill](https://github.com/leechen298/Code2Skill) (★4) — Generates Function, MCP, Agent Skill, and offline test packages from existing code as an installable DSH bundle.
- [omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) (★1) — Mnemonics plugin.
- [ArtificialNotImbecile/dsh-context-taxonomy](https://github.com/ArtificialNotImbecile/dsh-context-taxonomy) — Context taxonomy.

### Agent orchestration & Workflow

**中文**：多 Agent 团队、可治理的工作流、会话蒸馏等"把一次性调度变成工程资产"的编排类插件。

- [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) (★30) — AgentTeams plugin for DSH.
- [icetomoyo/dsh_workflow](https://github.com/icetomoyo/dsh_workflow) (★29) — Brings Claude Code's UltraCode to DSH; turns one-shot multi-agent dispatch into a generatable / savable / governable / observable / recoverable Workflow layer.
- [btspoony/mstar-harness](https://github.com/btspoony/mstar-harness) (★38) — Skill-driven Harness / Loop Engineering Workflow Agent Plugin.
- [LoserFox/distill](https://github.com/LoserFox/distill) (★11) — Automatic conversation distillation: background subagent reflection + skill create/update.
- [titanwings/dsh-plannotator](https://github.com/titanwings/dsh-plannotator) (★1) — Plan annotator.
- [yyh-001/dsh-companion](https://github.com/yyh-001/dsh-companion) (★2) — Companion plugin.
- [vibeinging/dsh-work](https://github.com/vibeinging/dsh-work) (★2) — Work plugin.
- [omdsh-dev/dsh-gomoku](https://github.com/omdsh-dev/dsh-gomoku) (★5) — Gomoku game plugin.
- [ZK-Andy/dsh-continual-evolve](https://github.com/ZK-Andy/dsh-continual-evolve) (★11) — Continual self-evolution: versioned, auditable, rollback-safe harness state (prompt notes, memories, skills, subagent specs) refined from session trajectories.

- [nortejiang-tech/dsh-req-miner](https://github.com/nortejiang-tech/dsh-req-miner) (★0) — Requirements-mining sidebar plugin: per-session floating interview window driven by a continuable subagent (decision tree + frontier questions), reads the bound session's workspace and recent context, one-click return of the summarized requirement prompt to the composer.

### Integrations & Bridges

**中文**：把 DSH 接到 VS Code、桌面通知、或其它 Agent（Claude / Codex / Pi / OpenCode）的桥接类插件。

- [PandaPolo/dsh-voice-call](https://github.com/PandaPolo/dsh-voice-call) (★1) — Agent-initiated voice calls: `offer_call` rings the human (接听/拒接/稍后再说), accepted calls synthesize and play locally via CrispASR + Qwen3-TTS (9 speakers, 2 Chinese dialects), rejected calls return the decision to the agent.
- [omdsh-dev/dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) (★28) — Open workspace directories in VS Code directly from the web GUI.
- [omdsh-dev/dsh-notification](https://github.com/omdsh-dev/dsh-notification) (★19) — Desktop notifications for turn completions, with per-outcome controls and include/exclude keyword rules.
- [Nagi-ovo/dsh-find-plugins](https://github.com/Nagi-ovo/dsh-find-plugins) (★12) — In-app plugin finder.
- [YYTbit/dsh-plugin-claude-bridge](https://github.com/YYTbit/dsh-plugin-claude-bridge) — Bridge to Claude.
- [YYTbit/dsh-plugin-codex-bridge](https://github.com/YYTbit/dsh-plugin-codex-bridge) — Bridge to Codex.
- [YYTbit/dsh-plugin-pi-bridge](https://github.com/YYTbit/dsh-plugin-pi-bridge) — Bridge to Pi.
- [YYTbit/dsh-plugin-opencode-bridge](https://github.com/YYTbit/dsh-plugin-opencode-bridge) — Bridge to OpenCode.
- [bobleer/deepseek-harness-plugin-mcp](https://github.com/bobleer/deepseek-harness-plugin-mcp) — MCP plugin.
- [labmimors/dsh-mcp-lens](https://github.com/labmimors/dsh-mcp-lens) (★5) — Progressive-disclosure MCP gateway for DSH: search remote tools, inspect exact input schemas on demand, then call an explicit server/tool pair.
- [yoke233/dsh-openai-codex-auth](https://github.com/yoke233/dsh-openai-codex-auth) (★1) — OpenAI Codex auth.
- [vvlife/dsh-agnes-paseo](https://github.com/vvlife/dsh-agnes-paseo) — Agnes AI model gateway (OpenAI-compatible) for dsh, plus a zero-dependency ACP bridge that registers DeepSeek Harness as a Paseo provider.
- [vvlife/dsh-paseo-mobile](https://github.com/vvlife/dsh-paseo-mobile) — Connect your phone to dsh via Paseo: one-command setup registers dsh as a Paseo provider (zero-dependency ACP bridge), then scan the pairing QR in the Paseo mobile app. Model-agnostic: follows your existing dsh model config; mirrors dsh web sessions to the phone with context-aware follow-ups.

- [SwainGao/dsh-plugin-ai-bridge](https://github.com/SwainGao/dsh-plugin-ai-bridge) (★1) — Bridge to external AI models (Codex / Claude / GPT / OpenAI-compatible relays) for read-only second-opinion code review, adversarial review, task delegation with resume threads, and non-blocking background jobs. `dsh plugin add dsh-plugin-ai-bridge@0.1.1`.

- [Nwflower/dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) (★54) — Import Claude Code / Codex / ChatGPT / Cursor chat histories as resumable DeepSeek Harness sessions.

### Sidebar, Workspace & Ecosystem

**中文**：侧边栏工作台、`oh-my-dsh` 这类"插件库"、插件脚手架与注册表等生态基础设施。

- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) (★66) — Full workbench sidebar with third-party tab registration: file render/edit, terminal, Git, subagent.
- [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) (★12) — Plugin ecosystem: 700+ plugins wired only through extension seams, no agent-loop changes.
- [kingjly/dsh-plugin-builder](https://github.com/kingjly/dsh-plugin-builder) (★1) — Plugin builder scaffolding.
- [vlln/plugin-registry](https://github.com/vlln/plugin-registry) (★6) — Plugin registry.
- [DeKrych/Dshell-plugins](https://github.com/DeKrych/Dshell-plugins) (★27) — Dshell plugin collection.
- [HackSing/dsh-plugins](https://github.com/HackSing/dsh-plugins) / [Yihong89/dsh-plugins](https://github.com/Yihong89/dsh-plugins) — Plugin collections.
- [coppynight/dsh-doctor](https://github.com/coppynight/dsh-doctor) (★2) — Diagnostics / doctor.
- [yyh-001/dsh-expression](https://github.com/yyh-001/dsh-expression) (★1) — Expression plugin.
- [Chinesezjc/dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) (★8) — Cross-instance message/event handoff.

### Fun & Misc

**中文**：合影墙、音乐、框架类实验等"好玩 / 杂项"插件。

- [SenmuuuuW/dsh-group-photo](https://github.com/SenmuuuuW/dsh-group-photo) (★11) — Internal-test group-photo wall (GitHub OAuth, frozen allowlist).
- [syy-shark/dsh-music-plugin](https://github.com/syy-shark/dsh-music-plugin) — Music plugin.
- [unknowbug/RE-Framework](https://github.com/unknowbug/RE-Framework) (★5) / [unknowbug/anchorlaw](https://github.com/unknowbug/anchorlaw) (★4) — Frameworks.
- [hxs996-beep/deepAct](https://github.com/hxs996-beep/deepAct) (★7) — deepAct.

## Hands-on Notes

**中文 · 实战评测**：下面挑了 6 个有代表性的高星插件，按"怎么装 / 怎么用 / 坑点"写成可直接照着做的短评测（star 数为 2026-08-13 当晚撰写时数据）。涉及 `dsh-external/*` 私有仓库的，已标注需要读取权限。

**English · hands-on notes**: short, copy-pasteable reviews of six representative
high-star plugins — install / use / gotchas. Star counts are from the night of
2026-08-13. Entries under `dsh-external/*` are private repos and need read
access.

### dsh-web-ui — Web UI 全家桶（★311）

**装**：npm 已发布到 `@linxin666` scope，推荐直接装聚合包：
`dsh plugin --profile web add @linxin666/dsh-web-ui-all`；只要皮肤就装
`@linxin666/dsh-skins`。装完重启 `dsh web`，侧边栏即出现全部入口。

**用**：任务看板（支持 cron 定时让 DSH 会话自动执行，如每天升级 DSH / 周一生成周报）、
Git 图谱、右侧预览面板（Markdown/HTML/代码/diff/CSV/PDF/Office/图片）、鲸鱼娘宠物、
实时 TPS 与令牌统计、移动端远程控制、以及 SSH 远程运维（xterm 终端 / SFTP / 端口转发 /
集群并发执行）。

**坑**：首次安装若报 `ERR_PNPM_IGNORED_BUILDS`，按提示把 `cloudflared` / `ssh2` 等加入
profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 再重跑。验证是否挂上可用
`dsh --profile web --dump-config`。

*Install `@linxin666/dsh-web-ui-all` to get the whole bundle (task board, git
graph, right panel, pet, live token stats, mobile remote, SSH ops). Add
`@linxin666/dsh-skins` for skins only. Restart `dsh web` after install. If you
hit `ERR_PNPM_IGNORED_BUILDS`, allowlist `cloudflared`/`ssh2` in the profile's
`allowBuilds`.*

### dsh-cc-tui — Claude Code 风格全屏终端（★103）

**装**：`dsh plugin --profile cc-tui add dsh-cc-tui`（会自动初始化 `cc-tui`
profile），然后 `dsh --profile cc-tui` 启动；或仓库根目录 `sh install.sh`
（Windows 用 `dsh-cc.cmd`，支持 `--resume` 恢复上次会话）。

**用**：像素鲸鱼顶栏 + 启动手绘动画、实时工作状态行（在跑哪个工具 / 思考文案）、
思考过程流式展开、双击 Esc 时间回溯（fork 重放历史消息）、底部蓝白上下文进度条 +
TPS 仪表、复刻 CC 的 `/` 命令菜单（`/plan` `/goal` `/compact` `/review` 等全部走官方链路）。

**坑**：需要官方 `dsh` CLI 与 `pnpm`；纯插件挂载，卸载即完全还原。它**不消费审批流**
（`/permissions` 仅说明现状）；`/model` 实时切换走"会话 fork 续聊"而非原位换模型。

*A Claude-Code-style full-screen TUI: pixel-whale banner, live status row,
streaming thinking, double-Esc rewind (fork + replay), cont