![DeepSeek](./assets/deepseek-logo.svg)

# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of **plugins, skills, MCP servers, patch/profile layers, orchestrators, aggregators & UIs** for **DeepSeek Harness (DSH)** — DeepSeek's official agent runtime built around the idea **`Model + Harness = Agent`**.

DeepSeek Harness ("DSH") is DeepSeek's agent runtime / harness layer — the "hands" that turn the model's reasoning into real actions (context management, tool-call orchestration, execution sandbox, feedback loop, session persistence). Its defining feature is an **open plugin ecosystem**: the community contributes plugins, skills, MCP servers, orchestrators, aggregators, and UIs.

This list collects the best of that ecosystem. Contributions welcome — see [Contributing](#contributing).

> **Tip for authors:** DeepSeek asks plugin repositories to carry the **`#dsh`** GitHub topic so they can be discovered. Add it to your repo, then open a PR here.

![DeepSeek Harness ecosystem map](./assets/dsh-ecosystem.svg)

## Quick Start

```bash
# Launch the DSH Web UI
npx @deepseek-ai/dsh web

# Install a community plugin (from this list) into your profile
dsh plugin --profile web add "github:owner/repo#main"
```

Before installing, confirm the target repo carries the **`#dsh`** GitHub topic so the community hub can index it.

## Official

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek's official agent runtime framework (`Model + Harness = Agent`); an "everything is a plugin" architecture built on Cordis (TypeScript, MIT).  `⭐38238`
- [deepseek-ai/awesome-deepseek-integration](https://github.com/deepseek-ai/awesome-deepseek-integration) — Official curated list of DeepSeek API integrations.  `⭐38654`
- [deepseek-ai/awesome-deepseek-agent](https://github.com/deepseek-ai/awesome-deepseek-agent) — Official list of agents/harnesses with DeepSeek support.  `⭐5426`

## Profiles & Patch Layers

_DSH's core composition mechanism: a **profile** stacks bundle patch layers, then your own `cordis.patch.yml` (profile-level, then `$DSH_HOME`-level, then `--patch` overlays) — letting you reshape the whole plugin tree without forking. This is the layer where **task-specialized runtime configurations** live: a long-horizon profile, a math-reasoning profile, a slides-editing profile are all just a different bundle stack + patch, not a different codebase. Tools and harnesses that operate at this layer (share/export a profile, or run DSH as a specialized backend under a task-specific patch) belong here rather than under generic plugins._

- [asdf17128/dshp](https://github.com/asdf17128/dshp) — Manage DeepSeek Harness profiles: list, create, clone, diff, and share a whole `dsh` setup (plugin versions + bundle order + patch) as one portable file.
- [AMAP-ML/LongHorizon-Harness](https://github.com/AMAP-ML/LongHorizon-Harness) — Long-horizon computer-use harness with a DSH adapter: runs `dsh --profile headless` under an isolated `DSH_HOME` with role-scoped patches (`workspace-write` for executors, `read-only` for Manager/auditors) — a concrete example of a task-specialized DSH profile.

## Harnesses & Runtimes

_DeepSeek-native or DeepSeek-first agent harnesses / coding agents, plus runtime-level infrastructure (diagnostics, ops, session management, approval policies)._

- [hxs996-beep/deepAct](https://github.com/hxs996-beep/deepAct) — Terminal AI coding agent built for DeepSeek that guards every action: ambiguity check, design review, scope control, team mode, parallel sub-agents, and MCP support.
- [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) — Large plugin collection (700+) for DSH that registers only through extension seams, without modifying the agent-loop core.  `⭐24`
- [omdsh-dev/fabric](https://github.com/omdsh-dev/fabric) — Minecraft-Fabric-style hook processor for DSH.
- [omdsh-dev/dsh-session-health](https://github.com/omdsh-dev/dsh-session-health) — Read-only, zero-dependency session health check: frame-level scanning of multi-frame zstd session files to detect torn/corrupted/empty sessions; registers a `session_health` tool.
- [omdsh-dev/dsh-security-audit](https://github.com/omdsh-dev/dsh-security-audit) — Local security audit plugin: read-only, redacted risk report covering config, plugin sources, sessions, and network exposure.
- [Zhenyu98/dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) — Context-injection audit: measures the token cost of the AGENTS.md instruction chain, skill catalog, and tool schemas, and detects duplication and conflicts; Web UI ring panel plus a `context_audit` tool.
- [coppynight/dsh-doctor](https://github.com/coppynight/dsh-doctor) — flutter-doctor-style diagnostics and repair covering install-level and in-harness checks, with safe auto-fixes; repository-plugin format.
- [lhh010/dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) — Auto-detects bash output encoding (UTF-16LE/UTF-8/GBK, etc.) and decodes it correctly, fixing garbled non-ASCII output on WSL/Windows.
- [vlln/plugin-registry](https://github.com/vlln/plugin-registry) — Ecosystem infrastructure: a thin browser console for managing repository plugins (zero patches) plus a `make-dsh-plugin` skill guiding plugin development.  `⭐13`
- [Andy8647/dsh-auto-approval](https://github.com/Andy8647/dsh-auto-approval) — Automated tool-call approval: an `auto` tier that classifies every tool call as allow/deny via rules plus an LLM classifier, with a status chip beside the composer.
- [zzh-newlearner/dsh-postmortem](https://github.com/zzh-newlearner/dsh-postmortem) — Local-first failure postmortems for DeepSeek Harness sessions.
- [vibeinging/dsh-trace](https://github.com/vibeinging/dsh-trace) — Telemetry backend that exports turns, model steps, and tool calls to yiTrace over HTTP.
- [omdsh-dev/dsh-hub](https://github.com/omdsh-dev/dsh-hub) — Community extension catalog and profile-generation manager, adding transactional installation, recovery, catalog browsing, and a settings UI on top of official contracts.
- [fakechris/dsh-harness-ops](https://github.com/fakechris/dsh-harness-ops) — Ops toolbox: A/B dual-slot snapshot upgrades with atomic switch and one-click rollback, a watchdog that auto-restarts web/agent, and a self-rescue doctor command.
- [omdsh-dev/session-teleport](https://github.com/omdsh-dev/session-teleport) — Multi-device session handoff with PostgreSQL as the single online authority; only one device holds write credentials at a time.
- [Tieboyh/dsh-session-search](https://github.com/Tieboyh/dsh-session-search) — Index-free cross-agent session search for DeepSeek Harness.
- [ilharp/dsh-tool-approval](https://github.com/ilharp/dsh-tool-approval) — Manual approval for tool calls (a "manual mode" / "ask mode" for DSH).
- [blissito/ghostycode](https://github.com/blissito/ghostycode) — DeepSeek V4 terminal coding agent and constitutional harness (Rust TUI with MCP and sub-agents).
- [bobleer/deepseek-harness-rust](https://github.com/bobleer/deepseek-harness-rust) — Rust implementation of DeepSeek Harness: layered crates for session log, turn/step loop, and DeepSeek SSE adapter.
- [didclawapp-ai/zagens](https://github.com/didclawapp-ai/zagens) — Open-source agent harness for DeepSeek V4.  `⭐13`
- [liubf21/ds-forge](https://github.com/liubf21/ds-forge) — Lightweight agent harness for DeepSeek V4.
- [Owen718/FlashCoder](https://github.com/Owen718/FlashCoder) — Simple harness for DeepSeek models.
- [ArtificialNotImbecile/dsh-context-taxonomy](https://github.com/ArtificialNotImbecile/dsh-context-taxonomy) — Logical-call context taxonomy plugin for DeepSeek Harness.
- [btspoony/dsh-llm-fallbacks](https://github.com/btspoony/dsh-llm-fallbacks) — Role-based LLM retry and fallback strategy plugin.
- [Drifter-yh/dsh-tool-policy](https://github.com/Drifter-yh/dsh-tool-policy) — Declarative deny-by-default tool policy plugin.
- [LingLambda/dsh-undo](https://github.com/LingLambda/dsh-undo) — Context undo/redo: roll the model context back to the last completed step and restore it again.
- [omdsh-dev/omdsh](https://github.com/omdsh-dev/omdsh) — Community experiment for organizing versioned DSH component sets and defaults in a reviewable, reproducible form.
- [omdsh-dev/omdsh-runtime](https://github.com/omdsh-dev/omdsh-runtime) — Headless execution layer reusing official Profile/Bundle/Cordis operations, adding deterministic plan/apply, candidate generations, and previous-generation recovery.
- [wangshunnn/oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh) — A collection of DeepSeek Harness plugins.
- [yjh051108/dsh-super-injector](https://github.com/yjh051108/dsh-super-injector) — BepInEx-style mod injector: hot-injects local plugin packages into a running DSH web instance without patches or restarts.
- [yoke233/dsh-openai-codex-auth](https://github.com/yoke233/dsh-openai-codex-auth) — OpenAI Codex OAuth login and usage card plugin.
- [YYTbit/dsh-plugin-claude-bridge](https://github.com/YYTbit/dsh-plugin-claude-bridge) — Bridges Claude Code memory, skills, and config into DeepSeek Harness.
- [Gordonynh/dsh-plugin-codex-import](https://github.com/Gordonynh/dsh-plugin-codex-import) — Imports Codex conversation history into DSH.
- [Hu9956/dsh-codex-provider](https://github.com/Hu9956/dsh-codex-provider) — Codex provider plugin with OAuth login support.
- [WSL043/dsh-codex-subscription](https://github.com/WSL043/dsh-codex-subscription) — Caches Codex subscription/usage state for DSH.
- [PerryLink/dsh-output-styles](https://github.com/PerryLink/dsh-output-styles) — Switch between different assistant output styles.
- [Toukaiteio/dsh-effort-tweak](https://github.com/Toukaiteio/dsh-effort-tweak) — Adjusts model reasoning effort on the fly.
- [csiroqa/dsh-backup-sync](https://github.com/csiroqa/dsh-backup-sync) — Snapshot backup and WebDAV sync for DSH workspaces.
- [csiroqa/dsh-schedule](https://github.com/csiroqa/dsh-schedule) — Cron-style scheduled tasks with status monitoring.
- [Karuisawa-Mrs/dsh-plugins](https://github.com/Karuisawa-Mrs/dsh-plugins) — Community plugin collection for DSH.
- [BlockRunAI/dsh-clawrouter](https://github.com/BlockRunAI/dsh-clawrouter) — A second brain for your DeepSeek Harness agent — strong-model review before risky tool calls, plus 70 models from one wallet.
- [gordonlu/dsh-context-lens](https://github.com/gordonlu/dsh-context-lens) — Request Context Profiler for DeepSeek Harness — see what changed between model requests, and how cache reuse changed with it.
- [green-dalii/dsh-shift-router](https://github.com/green-dalii/dsh-shift-router) — Two-tier model router for DeepSeek Harness — LLM-Judge routing, multi-model fallback chains, exponential-backoff failover, and task-level orchestration.
- [KitDoesIt/dsh-compaction-instant](https://github.com/KitDoesIt/dsh-compaction-instant) — LLM-free lossless compaction engine for DeepSeek Harness.
- [morlay/session-persistence-rdb](https://github.com/morlay/session-persistence-rdb) — Relational-database persistence layer for DSH sessions.
- [rainforest888/dsh-plugins-raincode](https://github.com/rainforest888/dsh-plugins-raincode) — Model layer for DeepSeek Harness: model pool/cache/retry plus a `/skills` browser.
- [weijiafu14/dsh-remote-sandbox](https://github.com/weijiafu14/dsh-remote-sandbox) — Crash-resilient remote execution world for DeepSeek Harness: `ctx.fs`/`ctx.subprocess` over an E2B sandbox with heartbeat keep-alive, transparent recovery, and workspace sync.
- [030611/dsh-telemetry-redactor](https://github.com/030611/dsh-telemetry-redactor) — Fail-closed export-copy redaction for DeepSeek Harness session telemetry.
- [cnyac/dsh-polling](https://github.com/cnyac/dsh-polling) — Polling/scheduled-task plugin: cron scheduled tasks as real sessions, natural-language creation, model tools (`polling_*`), and a Web UI.
- [cpj-dev/dsh-plugin-cc](https://github.com/cpj-dev/dsh-plugin-cc) — Bridges DeepSeek Harness into Claude Code for review, critique, delegation, and session import.
- [khiqwq/dsh-system-proxy](https://github.com/khiqwq/dsh-system-proxy) — Host plugin for smart outbound HTTP(S) routing: named proxies (http/https/socks4/4a/5/5h), per-host/provider/plugin rules, direct-first fallback with health memory.
- [lire1131/dsh-undo](https://github.com/lire1131/dsh-undo) — Snapshot & rollback for plugin/skin/settings configs: auto-save on change, undo/redo stack, snapshot manager panel, keyboard shortcuts, plus an offline PowerShell CLI & GUI that work even when DSH won't boot.
- [omdsh-dev/dsh-scout](https://github.com/omdsh-dev/dsh-scout) — Read-only environment-probe plugin for DeepSeek Harness: reports runtime environment, software versions, system resources, ports, services, hardware, and workspace info.
- [sleepinginsummer/dsh-rtk-optimizer](https://github.com/sleepinginsummer/dsh-rtk-optimizer) — RTK optimizer plugin for DeepSeek Harness.
- [weijiafu14/pi2dsh](https://github.com/weijiafu14/pi2dsh) — Bridges the Pi and DeepSeek Harness ecosystems: one Pi Host ABI runs unmodified Pi extensions as native DSH plugins.
- [wenliang9527/dsh-workspace](https://github.com/wenliang9527/dsh-workspace) — Workspace plugin for DeepSeek Harness.
- [biedongbin/dsh-claude-compat](https://github.com/biedongbin/dsh-claude-compat) — DSH plugin that bridges Claude Code's `.claude/` directory (skills, commands, rules) into DeepSeek Harness natively.
- [revive/dsh-git-credentials](https://github.com/revive/dsh-git-credentials) — Keeps GitLab and GitHub API tokens out of the model context — encrypted at rest (AES-256-GCM), tools on demand, web settings panel.
- [SnowAmberX/dsh-role-router](https://github.com/SnowAmberX/dsh-role-router) — Role-based model routing plugin for DeepSeek Harness: planner/subagent roles plus a settings card and composer summary.
- [omdsh-dev/dsh-coding](https://github.com/omdsh-dev/dsh-coding) — DeepSeek Harness coding plugin (no description provided upstream).
- [byhongyu/oh-my-dsh](https://github.com/byhongyu/oh-my-dsh) — Curated Coding, Research, and Investing agent setups for DeepSeek Harness.
- [Bernardxu123/dsh-plugins](https://github.com/Bernardxu123/dsh-plugins) — DeepSeek Harness (dsh) plugin bundle: dsh-sensenova-image for image generation plus dsh-vision for image understanding, install by cloning.
- [boxiaolanya2008/dsh-plugin](https://github.com/boxiaolanya2008/dsh-plugin) — A DeepSeek Harness plugin tool.
- [cnzgray/dsh-plugins](https://github.com/cnzgray/dsh-plugins) — A DeepSeek Harness plugin collection.
- [linqunxun/dsh-plugins](https://github.com/linqunxun/dsh-plugins) — DeepSeek Harness (DSH) client UI plugins collection.
- [MaimoryLab/dib](https://github.com/MaimoryLab/dib) — DSH-in-Box: a DSH runtime and plugin packager.
- [NIyueeE/dsh-container](https://github.com/NIyueeE/dsh-container) — DeepSeek Harness (dsh) container image: universal dev-container base, dsh auto-update on boot, compose + Quadlet examples.
- [Saktawdi/ha-orchestrator](https://github.com/Saktawdi/ha-orchestrator) — DSH dynamic Cordis plugin: model high-availability failover plus subagent orchestration for DeepSeek Harness.
- [wefio/dsh-plugin-audit](https://github.com/wefio/dsh-plugin-audit) — A DSH plugin audit tool.
- [Whning0513/deepseek-protocol-doctor](https://github.com/Whning0513/deepseek-protocol-doctor) — Offline DeepSeek protocol diagnostics and an installable DSH plugin for tool loops, reasoning_content, strict schemas, and SSE.
- [woshi-Tom/dsh-status-plugin](https://github.com/woshi-Tom/dsh-status-plugin) — DSH status plugin for conveniently checking host machine runtime status, easing troubleshooting during failures.
- [wxxb789/dsh-legion](https://github.com/wxxb789/dsh-legion) — Configurable multi-model subagent profiles for DeepSeek Harness.
- [ZhengQingJing/dsh-session-tree](https://github.com/ZhengQingJing/dsh-session-tree) — Git-like immutable session branching for DeepSeek Harness.
- [devmom/dsh-trajectory-debug](https://github.com/devmom/dsh-trajectory-debug) — A DeepSeek Harness trajectory-debugging plugin.
- [mafeis/dsh-net-proxy](https://github.com/mafeis/dsh-net-proxy) — A network proxy plugin for DeepSeek Harness.
- [PandaColour/dsh-cmd-starter](https://github.com/PandaColour/dsh-cmd-starter) — Provides a command-line launcher for deepseek-harness, adding Claude-style flags like `--append-prompt` and `--resume`.
- [jiangrz77/DSHLauncher](https://github.com/jiangrz77/DSHLauncher) — A launcher for DeepSeek Harness.
- [AndPuQing/dsh-pi](https://github.com/AndPuQing/dsh-pi) — A DeepSeek Harness plugin (dsh-pi).
- [gyyxs88/dsh-subagent-codex](https://github.com/gyyxs88/dsh-subagent-codex) — A DeepSeek Harness plugin bridging Codex as a subagent.
- [bujue600-arch/dsh-testgen](https://github.com/bujue600-arch/dsh-testgen) — Automated unit-test generation for DeepSeek Harness: a `/testgen` command plus a `generate_tools` tool that scaffold, run, and fix unit tests until they pass.
- [yoke233/dsh-prime-agent](https://github.com/yoke233/dsh-prime-agent) — Prime Agent-inspired persistent RLM control plane for DeepSeek Harness Code Mode.
- [4060415/Deepseek-harness-routing-layer-](https://github.com/4060415/Deepseek-harness-routing-layer-) — Smart model auto-routing plugin for DeepSeek Harness: automatically selects the best-fit model for each task.
- [1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge) — DSH-native HarmonyOS dev assistant: hdc device debug loop, bundled offline official knowledge (Tier-1), and a DevEco CLI build channel.
- [StyxNether/dsh-auto-approval](https://github.com/StyxNether/dsh-auto-approval) — Trusted Auto: a middle permission tier between workspace-write and danger-full-access, auto-approving harmless commands and trusted-area targets.
- [phelpsyacht/dshmath-manim](https://github.com/phelpsyacht/dshmath-manim) — Manim math-animation plugin for DeepSeek Harness.
- [saurtone/dsh-tool-somark](https://github.com/saurtone/dsh-