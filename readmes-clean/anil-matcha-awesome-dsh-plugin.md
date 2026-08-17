# Awesome DSH Plugin [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated guide to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — DeepSeek's open-source, everything-is-a-plugin coding agent — and the best community plugins built on it.

DeepSeek Harness is a runnable coding agent (Web UI + headless) built on [Cordis](https://github.com/cordiverse/cordis), where every part of the system — models, tools, sandboxes, session storage, UI, even the agent loop itself — is a swappable plugin. That architecture has produced a large, fast-moving plugin ecosystem: well over a thousand community plugins at last count. This list exists to make that ecosystem easy to scan: what a plugin does, in one line, sorted into the category you'd actually go looking under.

> [!WARNING]
> Installing any third-party `dsh` plugin runs its code on your machine with your own permissions. Being listed here is not a security review — read the source before installing, especially for plugins that touch credentials, the network, or your filesystem.

## What is DeepSeek Harness?

[`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness) is DeepSeek's open-source agent harness, currently in developer preview. Its defining idea is **everything is a plugin**: the model provider, the sandbox, the tool set, the session store, and the UI are all plugins loaded into a Cordis-based runtime, so you can replace or extend any layer without forking the harness itself. Plugins declare a `dsh.bundle` manifest and install with:

```sh
dsh plugin --profile web add 
```

## Getting Started

```sh
# run the Web UI (served at http://127.0.0.1:3080 by default)
npx @deepseek-ai/dsh web

# or from a source checkout
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness && pnpm install && pnpm run build && pnpm dsh web
```

Tag your own plugin repo with the [`dsh-plugin`](https://github.com/topics/dsh-plugin) GitHub topic so it's discoverable, and consider a plugin browser for one-click install/upgrade from inside the Web UI.

## Plugin Categories

### UI Enhancements

- [0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight) — Keyboard-first command palette for the DSH Web UI.
- [1123762794/dsh-web-restart](https://github.com/1123762794/dsh-web-restart) — Sidebar footer button that restarts the dsh web process and persists across the restart it triggers.
- [13071301808/dsh-composer-expand](https://github.com/13071301808/dsh-composer-expand) — Expand/collapse toggle that grows the composer to a tall 70vh writing view for long drafts.
- [a179-sanae/dsh-auto-collapse](https://github.com/a179-sanae/dsh-auto-collapse) — Codex-style auto-collapse: finished turns fold into a single summary row, fully reversible on uninstall.
- [a735624258/dsh-skill-picker](https://github.com/a735624258/dsh-skill-picker) — Searchable skill picker beside the composer that inserts the official `/skill-name` gesture.
- [a903067276-rgb/dsh-hud](https://github.com/a903067276-rgb/dsh-hud) — HUD panel: Git status, MCP servers, skills, model and token usage, all floating.
- [a903067276-rgb/dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) — Clickable file paths in replies, with reveal-in-file-manager and a mentioned-files chip list.
- [AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access) — Fixes the Web UI so it survives LAN or Tailscale direct-IP access.
- [AKS1st/dsh-mermaid](https://github.com/AKS1st/dsh-mermaid) — Renders Mermaid fences as sanitized, theme-aware SVG diagrams.
- [AKS1st/dsh-sysmon](https://github.com/AKS1st/dsh-sysmon) — Floating CPU/memory/disk widget with threshold color warnings.
- [hanzhangzzz/dsh-diagram](https://github.com/hanzhangzzz/dsh-diagram) — Editable Excalidraw diagrams embedded directly in conversations.
- [giiiiiithub/terminal](https://github.com/giiiiiithub/terminal) — A real PTY terminal panel via node-pty and xterm.js, with multi-tab sessions and a dock/floating window.
- [Ricketts-Guo/dsh-shortcuts](https://github.com/Ricketts-Guo/dsh-shortcuts) — 34 pre-registered keyboard shortcuts (sessions, views, clipboard, models, silent permission cycling), one-click recording to bind your own.
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) — In-conversation generative UI: the model renders interactive HTML cards into the chat stream, with streaming preview and sandboxed rendering.

### Usage & Billing

- [02Muller25/dsh-api-balance](https://github.com/02Muller25/dsh-api-balance) — Real-time DeepSeek API account balance in the composer dock.
- [283Gawin/dsh-heatmap](https://github.com/283Gawin/dsh-heatmap) — GitHub-style activity heatmap of daily commits, token usage, and estimated spend.
- [940842546/dsh-usage-billing](https://github.com/940842546/dsh-usage-billing) — Usage and cost statistics with peak/off-peak pricing and a day/week/month/year/all usage heatmap.
- [bobcat848/dsh-calculator](https://github.com/bobcat848/dsh-calculator) — Session and all-time API spend plus account balance, with official pricing support.
- [CN-Leo/dsh-deepseek-balance](https://github.com/CN-Leo/dsh-deepseek-balance) — Real-time account balance in the composer dock, auto-refreshing every 15 seconds.
- [Ghost011118/dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) — Account balance and session cost in the composer dock with peak/off-peak support.
- [Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) — Per-session and daily cost with a budget bar and one-click official price sync.
- [huanyuLv/dsh-balance-tide](https://github.com/huanyuLv/dsh-balance-tide) — Live peak/off-peak pricing badge with a countdown to the next pricing switch.
- [Jannchie/dsh-bill](https://github.com/Jannchie/dsh-bill) — Cost tracking priced per call from models.dev + OpenRouter (8000+ models): per-turn line attributed to tool output / model output / system prompt / commands, budget, forecast.
- [kirigayakazima/dsh-usage-vendor-stats](https://github.com/kirigayakazima/dsh-usage-vendor-stats) — Per-provider token/cache/output KPI dashboard: 53-week heatmap, hourly trend, model drilldown, CSV export, TTFT/speed/error-rate health cards.

### Themes & Appearance

- [0nt-one/dsh-neo-skin](https://github.com/0nt-one/dsh-neo-skin) — Neo-brutalism skin with hard shadows, sharp corners, and light/dark support.
- [AKS1st/dsh-cyber-particle](https://github.com/AKS1st/dsh-cyber-particle) — Full-screen, click-through particle-network background overlay.
- [BeiZi6/dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) — Theme studio with five presets plus fully customizable palettes, hot-swapped and persisted.
- [caoyiwei850/dsh-client-ui-skins](https://github.com/caoyiwei850/dsh-client-ui-skins) — Custom image skins where the palette follows the photo's dominant hue.
- [chinaRXQ/dsh-wallpaper](https://github.com/chinaRXQ/dsh-wallpaper) — Wallpaper skin with opacity, mask, and blur controls.
- [Isilsolme/dsh-anthropic-fonts](https://github.com/Isilsolme/dsh-anthropic-fonts) — Anthropic Sans/Serif/Mono fonts with CJK fallback.
- [KinGao294/dsh-skin](https://github.com/KinGao294/dsh-skin) — Codex-style skin switcher with a custom wallpaper layer.
- [Lhy723/dsh-neu-theme](https://github.com/Lhy723/dsh-neu-theme) — Neumorphic theme with ambient lighting, material shadows, and frosted-glass surfaces.
- [RevolutionLA/dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin) — 8 original themes, translucent wallpaper with opacity/blur, per-user accent, shareable theme-pack import/export.
- [Tkingxiao/dsh-any-background](https://github.com/Tkingxiao/dsh-any-background) — Full custom theme colors, background wallpapers, and per-section transparency/blur, with import/export.

### Models & Providers

- [BruceLanLan/dsh-tier-router](https://github.com/BruceLanLan/dsh-tier-router) — Two-tier routing: a strong tier plans and reviews, a cheap tier implements, with failure auto-escalation.
- [btspoony/dsh-llm-fallbacks](https://github.com/btspoony/dsh-llm-fallbacks) — Role-based LLM retry and fallback strategies.
- [dylan121322/llm-adaptive](https://github.com/dylan121322/llm-adaptive) — Per-request complexity classification with automatic provider routing.
- [fieldnote-ops/keyringseam](https://github.com/fieldnote-ops/keyringseam) — macOS Keychain credential provider replacing the local-file default.
- [franksong2702/dsh-codex-connect](https://github.com/franksong2702/dsh-codex-connect) — Connects ChatGPT OAuth / OpenAI Codex models to the harness.
- [GodD6366/dsh-sub2api](https://github.com/GodD6366/dsh-sub2api) — OpenAI-compatible multi-provider routes (OpenAI/Claude/Grok/Gemini) behind one base URL.
- [kam74515-boop/dsh-everything-oauth](https://github.com/kam74515-boop/dsh-everything-oauth) — Imports existing Codex, Grok, Claude, and OpenCode logins so you don't re-auth per tool.
- [katsos/dsh-claude-cli](https://github.com/katsos/dsh-claude-cli) — Runs the local Claude Code CLI as a model backend over an existing subscription instead of a metered key.
- [NOirBRight/dsh-llm-ollama](https://github.com/NOirBRight/dsh-llm-ollama) — Ollama Cloud native chat adapter with model discovery and web search/fetch providers.
- [WNJXYK/dsh-codex-oauth](https://github.com/WNJXYK/dsh-codex-oauth) — Use a ChatGPT/Codex subscription in DSH with GPT models, image generation, web search, and browser or device-code OAuth sign-in.
- [r600a-code/dsh-swarm-router](https://github.com/r600a-code/dsh-swarm-router) — Routes heterogeneous tasks to the best-suited model with feedback-driven ranking.

### Sessions & Messages

- [3403473060/dsh-inline-images](https://github.com/3403473060/dsh-inline-images) — Renders local image paths from assistant replies inline with a click-to-zoom lightbox.
- [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) — Rewind conversation and workspace state via a persistent Change Ledger.
- [beijingwahw/dsh-companion](https://github.com/beijingwahw/dsh-companion) — Smart export (Markdown/PDF/JSON/PNG), context-handoff summaries, cost optimization, and global search.
- [Buyi-wsgzg/dsh-sidechain](https://github.com/Buyi-wsgzg/dsh-sidechain) — `/side` persistent side sessions and `/btw` one-shot questions in a temporary fork.
- [chouyong/dsh-fork-graph](https://github.com/chouyong/dsh-fork-graph) — Git-style conversation fork graph with colored lanes and click-to-jump navigation.
- [czm15053/dsh-peer-link](https://github.com/czm15053/dsh-peer-link) — Lets dsh and Claude Code sessions message each other directly.
- [dongsheng123132/task-passport](https://github.com/dongsheng123132/task-passport) — Carries durable task state across DeepSeek Harness, WorkBuddy, Claude Code, and Codex.
- [dream12347/dsh-session-manager](https://github.com/dream12347/dsh-session-manager) — Session trash/restore/purge, recent-activity stats, workspace grouping, and compaction threshold control.
- [fredalxin/dsh-solo-thinking](https://github.com/fredalxin/dsh-solo-thinking) — Visual branch brainstorming: isolated session per direction with automated parent/sibling/checkpoint handoffs and a full tree tab.
- [limbo947/dsh-recall-plugin](https://github.com/limbo947/dsh-recall-plugin) — Rolls conversation and workspace files back to before any user message, via shadow git snapshots with a diff-preview confirmation.

### Memory

- [863683348/dsh-plugin-focus](https://github.com/863683348/dsh-plugin-focus) — Durable focus board pinning objective, constraints, and decisions across compaction and sessions.
- [aerince/dsh-active-context-pruning](https://github.com/aerince/dsh-active-context-pruning) — Model-authored context pruning through the official compaction API.
- [Aik358/dsh-auto-memory](https://github.com/Aik358/dsh-auto-memory) — Cache-friendly three-layer memory with per-turn consolidation and inheritance from other AI tools.
- [akslcw/dsh-negative-ledger](https://github.com/akslcw/dsh-negative-ledger) — Persists disproven paths and blocks repeat attempts until evidence changes.
- [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) — Context-insight panel showing exactly what's filling the model's window and why.
- [flymysql/dsh-memory](https://github.com/flymysql/dsh-memory) — Cross-session memory vault: remember / recall / forget tools with prompt injection.
- [FuRongJun-1999/dsh-memory](https://github.com/FuRongJun-1999/dsh-memory) — Multi-agent spatiotemporal memory graph with a self-evolving knowledge flywheel and auditable trust guardrails.
- [GIT121995/dsh-memory-gate](https://github.com/GIT121995/dsh-memory-gate) — Bounded local memory with explainable use/verify/ignore decisions, a full audit trail, and a tight per-call injection cap.
- [highland0971/dsh-native-memory](https://github.com/highland0971/dsh-native-memory) — Native per-workspace memory with approval-gated writes and deterministic recall — no external server.
- [PerryLink/dsh-memento](https://github.com/PerryLink/dsh-memento) — Bounded, layered, approval-gated cross-session memory with a typed seam, SQLite provider, and frozen-snapshot injection.
- [KLRSL/dsh-biomemory](https://github.com/KLRSL/dsh-biomemory) — Biomimetic memory: plain-Markdown data layer, memory metabolism ("dream"), memory pins, semantic recall, and cross-session retrieval.

### Tools & Capabilities

- [988hj7tczd-oss/dsh-computer-use](https://github.com/988hj7tczd-oss/dsh-computer-use) — Cross-platform Computer Use: virtual-mouse operation, AX-tree zero-vision-cost mode, and safety guards.
- [Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use) — Accessibility-first macOS computer use with fresh observations, stale-state rejection, and scoped permissions.
- [AbnerAI/dsh-monitor](https://github.com/AbnerAI/dsh-monitor) — Persistent background watchers that wake the agent on new events — the harness analog of a Monitor tool.
- [akqwpeter-prog/dsh-agent-conductor](https://github.com/akqwpeter-prog/dsh-agent-conductor) — Dispatches tasks from DSH to 11 external agent CLIs (Codex, Claude Code, Cursor, Gemini, and more).
- [AngelosZou/dsh-multi-folder](https://github.com/AngelosZou/dsh-multi-folder) — Secondary working directories with equal read/write/exec permissions.
- [anweat/dsh-browser](https://github.com/anweat/dsh-browser) — Self-contained Playwright + OpenCLI browser runtime exposing 9 interactive browser tools.
- [anweat/dsh-voice-webspeech](https://github.com/anweat/dsh-voice-webspeech) — Browser Web Speech API voice input: zero server, zero keys.
- [1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge) — HarmonyOS device bridge: screenshot/install/log/crash/UI automation loop.
- [6Mikao9/dsh-wsl-workspace](https://github.com/6Mikao9/dsh-wsl-workspace) — Adds a WSL workspace from the web GUI without reinstalling dsh inside WSL.
- [buhuikongpan/dsh-win-gitbash](https://github.com/buhuikongpan/dsh-win-gitbash) — Git Bash shell tool for Windows with timeout, sandbox, output truncation, and background jobs.

- [maddogfinance/dsh-trading](https://github.com/maddogfinance/dsh-trading) — Research-only trading workbench: typed market-data seam with BYO providers, multi-timeframe indicator snapshots, interactive chart cards with provenance-gated model annotations, and a pre-execute risk-guard that blocks execution-shaped tool calls.

### Vision & Multimodal

- [54xkeee/dsh-vision](https://github.com/54xkeee/dsh-vision) — Zero-cost vision for text-only DeepSeek via a logged-in Chrome CDP bridge, with fallback providers.
- [akqwpeter-prog/dsh-media-skills](https://github.com/akqwpeter-prog/dsh-media-skills) — Free vision bridge and image generation for text-only models with engine failover.
- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) — Intent-aware image Q&A, long-screenshot OCR, UI reproduction, and grounding.
- [ConsoleSun/Gemini-Eyes](https://github.com/ConsoleSun/Gemini-Eyes) — MCP bridge to gemini.google.com for vision analysis plus Imagen/Veo generation, no API key.
- [Einskyle/dsh-llm-vision-bridge](https://github.com/Einskyle/dsh-llm-vision-bridge) — Native vision bridge routing pasted images through a local VLM, then feeding the description to text-only DeepSeek.
- [FuzzySoul/dsh-free-vision](https://github.com/FuzzySoul/dsh-free-vision) — Free-tier vision bridge (Qwen3-VL-Flash, Doubao, DeepSeek-OCR) with a settings GUI.
- [gloryxpnv/dsh-tool-vision](https://github.com/gloryxpnv/dsh-tool-vision) — Local-first structured vision returning JSON evidence — images never leave the machine.
- [good-boy4069/dsh-vision-guard](https://github.com/good-boy4069/dsh-vision-guard) — Transparent image guard avoiding session deadlocks, plus OCR/PDF/docx/pptx/video analysis.
- [haiziyao/dsh-vision-mix](https://github.com/haiziyao/dsh-vision-mix) — Combines text, vision, and image-generation APIs into one auto-routing Mix model.

### Skills

- [AKS1st/dsh-skill-manager](https://github.com/AKS1st/dsh-skill-manager) — Browse and edit system/user/workspace/preset skills, import from zip, export or delete.
- [GanyuanRan/Aegis](https://github.com/GanyuanRan/Aegis) — Software-engineering method pack: baseline-first planning, systematic debugging, and verification before completion.
- [gongyijie85/dsh-ecc](https://github.com/gongyijie85/dsh-ecc) — 273 ECC skills ported from a large operator-system skill catalog.
- [hackerFish/awesome-dsh-skills](https://github.com/hackerFish/awesome-dsh-skills) — 12 tested engineering skills, each passing a format validator and an isolated load smoke test.
- [hatsuyuki0103/oh-my-deepseek-harness](https://github.com/hatsuyuki0103/oh-my-deepseek-harness) — OMX-style workflow skills: deep-interview, ralplan, ralph, autopilot, team, code-review, and more.
- [Ikalus1988/MisakaNet](https://github.com/Ikalus1988/MisakaNet) — Failure-recovery memory with BM25 + semantic RAG retrieval over past engineering sessions.
- [dhicoc/ds