![Awesome DeepSeek Harness](assets/banner.jpg)

# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

	Curated DeepSeek Harness (DSH) ecosystem: plugins, tools &amp; infrastructure. Sources: dsh-external/hub catalog and the public GitHub dsh-plugin topic.

> Note: the GitHub [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) is public; some `dsh-external` repository links may still require org access.

## Install

Install the official runtime with Node.js:

```sh
npx @deepseek-ai/dsh web
```

Install an external profile bundle with pnpm on your `PATH`:

```sh
dsh plugin --profile web add "github:owner/repo#ref"
```

`dsh plugin` forwards package operations to pnpm, so npm, Git/GitHub, local path, `file:` and `link:` package specs are supported. Only packages declaring `dsh.bundle.patch` become active profile layers; plain dependencies remain installed but inactive. Restart `dsh --profile web` after installing or updating a bundle.

The former `&path:` sub-path and Repository Plugin installation forms are not part of the current official bundle flow; use an installable package that declares `dsh.bundle.patch`.

Management panel: Settings → Plugins.

## Core

- [dsh-deepresearch](https://github.com/dsh-external/dsh-deepresearch) - DeepResearch plugin (cordis).
- [dsh-plan-execute](https://github.com/dsh-external/dsh-plan-execute) - Dual-model plan/execute routing: planner model thinks, executor model acts.
- [dsh-toolkit](https://github.com/dsh-external/dsh-toolkit) - Zero-dependency tool suite (calculator/csv/diff/encoding/json/markdown/regex/time).
- [dsh-deep-research](https://github.com/dsh-external/dsh-deep-research) - Adaptive deep-research orchestrator (workflow engine).
- [dsh-101](https://github.com/dsh-external/dsh-101) - DSH documentation reading mode.
- [dsh-client-ui-plan-execute](https://github.com/dsh-external/dsh-client-ui-plan-execute) - Web Settings row for plan/execute model routing.

- [dsh_workflow](https://github.com/dsh-external/dsh_workflow) - Dynamic workflow for DSH (placeholder).
- [dsh-equip-engine](https://github.com/wuykjl/dsh-equip-engine) - Task-driven plugin equip engine: dual retrieval (curated rules + LLM semantic), combo scoring (synergy/conflict/cost/trust), conflict detection and install-command export.

## Agents & Orchestration

- [dsh-collaboration](https://github.com/Socialist-Sister/dsh-collaboration) - Multi-agent collaboration suite: user-configured specialist roster, persistent on-demand dispatch (team_call/team_message/team_status/team_close), clone instances, star-topology relay, model comparison and a multimodal vision bridge.

## Context & Search

- [dsh-context](https://github.com/bowenliang123/dsh-context) - Context insight panel: see what the model's context window is made of and how it evolves — composition vs. window size, per-request history, compression/injection events, and per-message token stats.
- [dsh-bookmarks](https://github.com/penguin-oo/dsh-bookmarks) - Bookmark finalized assistant replies with notes and tags; a cross-session center with search, tag filter, session jump and one-click Markdown export (Alt+B toggles the panel).
- [billion-context-dsh](https://github.com/Tyan66666/billion-context-dsh) - Model-driven context compression (ACP) for DeepSeek Harness, ported from billion-context-pi; the model decides when and what to compress.
- [context-vista](https://github.com/GooodWei/context-vista) - A right-side floating panel and /context command for DeepSeek Harness — a live donut chart of context token usage, allocation, and estimated cost.
- [dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) - See exactly what every request carries: token cost of the AGENTS.md chain, skill catalog and tool schemas, with duplicate/conflict detection and actionable pruning tips (Web UI gauge + context_audit tool).
- [dsh-mcp-lens](https://github.com/labmimors/dsh-mcp-lens) - Progressive-disclosure MCP gateway that searches large remote tool catalogs through two stable interfaces, then calls selected tools with exact schemas, lazy connections and bounded caches.
- [dsh-cot-summary](https://github.com/dsh-external/dsh-cot-summary) - External Summary-CoT plugin workspace.
- [dsh-explain](https://github.com/dsh-external/dsh-explain) - Learning mode that explains each agent step (WIP).
- [dsh-file-mount](https://github.com/acefun29/dsh-file-mount) - Incremental file mounting with read dedupe: mounted line ranges are never re-sent to the model, on-disk changes invalidate and remount, with a Mounted Files tab and token-savings accounting.
- [dsh-learn-everything](https://github.com/cendaifeng/dsh-learn-everything) - Feynman learning-mode plugin: teach → teach-back → judge → re-explain loop rendered as rich HTML lesson cards (mermaid diagrams + shiki code highlighting).
- [dsh-memory-vault](https://github.com/flymysql/dsh-memory) - Cross-session memory vault: memory_remember / memory_recall / memory_forget tools, latest entries injected into system-prompt assembly, Settings page (记忆库 / Memory).
- [dsh-session-search](https://github.com/dsh-external/dsh-session-search) - Index-free read-only search across dsh/Codex/Claude Code/pi/OpenCode sessions.
- [cross-harness-cite](https://github.com/dsh-external/cross-harness-cite) - Cite past conversations across harnesses.
- [task-passport](https://github.com/dongsheng123132/task-passport) - Carry durable task state across DeepSeek Harness, WorkBuddy, Claude Code and Codex with machine-readable checkpoints and optimistic locking.
- [dsh-session-cluster](https://github.com/dsh-external/dsh-session-cluster) - Session clustering.
- [session-chatlog](https://github.com/dsh-external/session-chatlog) - Session chat logs.
- [dsh-memoria](https://github.com/jiayan-xu/dsh-memoria) - Memoria memory backend for dsh: 4 tools (observe/remember/search/recall) into a vector+graph memory layer (memoria) with namespace isolation, auto-write (turn-end observe + positive-feedback -> importance-5 remember) and hot-reload settings.
- [dsh-memory-evolve](https://github.com/dsh-external/dsh-memory-evolve) - Cross-session long-term memory + background self-evolution (5-track memory/git-branch awareness/skill evolution).
- [dsh-memory-gate](https://github.com/GIT121995/dsh-memory-gate) - Bounded local long-term memory with CBDC (Claim→Belief→Decision→Consumption) authority gating: SQLite + FTS5 claims, scoped dual-channel recall, /memory management commands, ≤3-claim/1200-char injection per call, no extra model call.
- [dsh-engram-relay](https://github.com/dsh-external/dsh-engram-relay) - Built-in <1B model for 100k-equivalent long memory with causal-graph wake-up.
- [dsh-mneme](https://github.com/modusensus/dsh-mneme) - Cross-session memory with memory sovereignty: SQLite + human-editable Markdown mirror, autoDream background consolidation, and fully-offline semantic search (local embedding / rerank / clustering), 198 tests.
- [dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) - Mnemon-powered local memory system: three-tier memory (runtime hot memory / project Documents / long-term Memory Spaces) with supervised writeback, retrieval tools, and Web UI.
- [zotero-harvest](https://github.com/dsh-external/zotero-harvest) - Zotero library integration.
- [url-manager](https://github.com/Piccolo123/url-manager) - Agent-first URL collection & knowledge management: save links from any platform, auto-categorize/tag, full-text search, shared categories, and deliver results as magic-link cards. Zero setup — agents auto-register on first use.
- [url-manager-mcp](https://github.com/Piccolo123/url-manager-mcp) - MCP server companion for url-manager: 21 tools (mcp__url_manager__*) for save/search/categorize/share and magic-link delivery. Stdio or streamable-http.
- [zotero-wave-rag](https://github.com/dsh-external/zotero-wave-rag) - Zotero RAG retrieval.
- [dsh-data-agent](https://github.com/dsh-external/dsh-data-agent) - Let the model connect to databases and write SQL.
- [dsh-easy-ctx-manager](https://github.com/dsh-external/dsh-easy-ctx-manager) - Context management: context saving and more (cordis).
- [dsh-kb-sieve](https://github.com/dsh-external/dsh-kb-sieve) - Knowledge-base plugin: build auditable KB packages (references + SQL).
- [dsh-payload-capture](https://github.com/moeblack/dsh-payload-capture) - Capture every upstream model API payload to JSON (debug & observability).
- [dsh-memento](https://github.com/PerryLink/dsh-memento) - Bounded, layered, approval-gated, auditable cross-session memory: typed ctx.memory seam, zero-dependency SQLite provider, memory tool and frozen snapshot injection.
- [dsh-news-plugin](https://github.com/canghai666x/dsh-news-plugin) - RSS news fetch tool: grabs 10+ CN/EN feeds into structured items (title/link/source/date/summary) with per-source timeout, ready for model-side scoring and briefing (cordis).
- [dsh-news-briefing](https://github.com/canghai666x/dsh-news-briefing) - News briefing skill: 5-dimension scoring (story/timeliness/depth/fun/uniqueness), anti-clickbait writing rules, Tier-based content preference, de-AI-style Chinese writing guide.
- [dsh-web-novel-research](https://github.com/canghai666x/dsh-web-novel-research) - Chinese web-novel plot lookup skill: free mirror-site workflow (GBK decoding, cross-volume duplicate chapter disambiguation, multi-source completion check) without paid sources.
- [dsh-web-search-exa](https://github.com/TonyDua/dsh-web-search-exa) - Zero-config Exa web search provider: keyless anonymous MCP fallback (mcp.exa.ai/mcp) plus keyed REST search, for the ctx.web seam.
- [dsh-web-search-pro](https://github.com/anweat/dsh-web-search-pro) - Persistent enhanced web search for DSH: multi-engine routing (DeepSeek/Exa/DDG/Bing/Jina + GitHub/Bilibili/YouTube/V2EX/Xiaohongshu/Twitter/Reddit/RSS), SQLite+LRU cache, userscript-style extraction, Playwright rendering.

## Input & Editing

- [dsh-better-sidebar-plugin-office](https://github.com/dsh-external/dsh-better-sidebar-plugin-office) - Office integration for DSH-better-sidebar.
- [dsh-message-edit](https://github.com/dsh-external/dsh-message-edit) - Branch-based message editing / reroll / retry / version timeline.
- [dsh-prompt-studio](https://github.com/dsh-external/dsh-prompt-studio) - Edit system-prompt sections with live preview.
- [dsh-paste-input](https://github.com/dsh-external/dsh-paste-input) - Ctrl+V paste files / drag & drop / picker.
- [dsh-drag-and-drop](https://github.com/dsh-external/dsh-drag-and-drop) - Cross-platform drag & drop with original path insertion.
- [dsh-file-uploads](https://github.com/l541402398/dsh-file-uploads) - Upload arbitrary local files from the Web composer, show pending cards, and manage stored files in Settings.
- [dsh-input-history](https://github.com/dsh-external/dsh-input-history) - Input history.
- [dsh-multimedia-webui-input](https://github.com/dsh-external/dsh-multimedia-webui-input) - Multimedia file/folder input.
- [dsh-office](https://github.com/dsh-external/dsh-office) - Office file read/write bundle: model edits Office files, docx/pdf preview in web client.
- [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import) - Import full-fidelity conversation histories from 13 coding agents (Claude Code / Codex / ChatGPT / Cursor / Gemini / Reasonix / opencode / ZCode / Grok Build / OpenClaw / Pi / Hermes / Kimi) as resumable DeepSeek Harness sessions, with reverse export/sync back to Claude Code.
- [dsh-file-claim](https://github.com/Nwflower/dsh-file-claim) - File claim/release protection for parallel DSH sessions on the same workspace (heartbeat stale takeover, pending 3-way merge area).
- [dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note) - Quick sticky notes in the composer: ideas/feelings/TODO with Markdown preview, auto-save, one-click send to chat.
- [dsh-plugin-quote-reply](https://github.com/yangYzc/dsh-plugin-quote-reply) - Select text in a conversation, then quote it into the composer or reply in a new window.
- [@picgo/dsh-plugin](https://github.com/PicGo/dsh-plugin) - Official PicGo plugin: upload local files to your image host and get public URLs, reusing the hosts and uploader plugins already configured in PicGo.

- [dsh-suggested-replies](https://github.com/dsh-external/dsh-suggested-replies) - Suggested replies above the DSH Web composer.
- [dsh-wordbox](https://github.com/arcmosin/dsh-wordbox) - Persistent common-word/phrase panel beside the composer input with global/current-project buckets and one-click insert.
- [dsh-voice-webspeech](https://github.com/anweat/dsh-voice-webspeech) - Browser Web Speech API voice input for DSH: zero server, zero keys, zero model downloads (Edge=Azure, Chrome=Google speech).
- [dsh-plugin-anydoc](https://github.com/beancookie/dsh-plugin-anydoc) - This plugin exports a reusable function that takes a file path or a Buffer, extracts the content via @firecrawl/anydoc, and returns GitHub‑Flavored Markdown (GFM). It also includes configuration options and an example usage.

## UI & Experience

- [dsh-spotlight](https://github.com/0xsline/dsh-spotlight) - Keyboard-first command palette for DeepSeek Harness Web.
- [dsh-catppuccin](https://github.com/zhijun-dai/Catppuccin-dsh-theme) - Catppuccin theme plugin: Latte / Frappé / Macchiato / Mocha skins for the DSH Web theme runtime.
- [solarized-dsh-theme](https://github.com/zhijun-dai/Solarized-dsh-theme) - Solarized + Selenized theme plugin: four faithful palettes registered into the DSH Web theme runtime.
- [arcana](https://github.com/GooodWei/arcana) - A floating command deck that lists every slash command in DeepSeek Harness as runnable buttons, sorted by usage.
- [dsh-aigc-canvas](https://github.com/dsh-external/dsh-aigc-canvas) - AIGC canvas plugin (cordis).
- [dsh-deepcel](https://github.com/dsh-external/dsh-deepcel) - Deepcel spreadsheet skin and standalone distribution.
- [dsh-deepseek-quota](https://github.com/yingjunnan/dsh-deepseek-quota) - DeepSeek API balance in a bottom-right floating card on the DSH Web page (auto-refresh + manual refresh).
- [dsh-diff-viewer](https://github.com/dsh-external/dsh-diff-viewer) - PiUI-style Web diff viewer replacing the default diff view.
- [dsh-mobile](https://github.com/dsh-external/dsh-mobile) - Mobile client plugin (cordis + dsh.plugin.json).
- [dsh-openpencil](https://github.com/dsh-external/dsh-openpencil) - OpenPencil design preview and editing plugin.
- [dsh-design-studio](https://github.com/Sal7one/DSH-Design-Studio) - Design Studio tab: design briefs become html/css/js mockups with live preview, element picker, design-agent chat with vision review, identity presets and zip export.
- [dsh-pin-recall](https://github.com/kerwin2046/dsh-pin-recall) - Pin assistant replies from the Web action strip and recall them into the next model turn (`/pin` `/recall`, with optional wake).
- [dsh-turn-navigator](https://github.com/dsh-external/dsh-turn-navigator) - DSH Web turn navigation plugin.
- [dsh-ultra-ui](https://github.com/dsh-external/dsh-ultra-ui) - Ultra UI plugin (cordis).
- [dsh-web-billing](https://github.com/bpc-oss/dsh-web-billing) - RMB/USD token billing for the DSH web: official-policy auto pricing (incl. peak/off-peak hours), per-message cost ledger, account balance, locale-driven currency display.
- [dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) - DeepSeek account balance and session cost in the DSH Web composer dock (auto-fetched official pricing, peak/off-peak support).
- [dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) - Per-session and daily API cost, budget with usage %, official balance, history dashboard, and one-click official price sync with peak/off-peak pricing.
- [dsh-cost-meter](https://github.com/Sttrevens/dsh-cost-meter) - Per-turn USD cost in the Web UI: session total in the header and per-turn cost in each message footer, with a hover breakdown (token usage × configurable pricing table).
- [dsh-plugin-cost](https://github.com/yweilai77-dev/dsh-plugin-cost) - Session cost estimate in the DSH Web composer dock (tokenUsage × configurable price table, one-click official-price refresh).
- [dsh-balance-tide](https://github.com/huanyuLv/dsh-balance-tide) - DeepSeek account balance and session cost under the composer, with a live peak/off-peak pricing badge (Beijing time), a countdown to the next pricing switch, and hover price tables with usage advice.
- [dsh-spend](https://github.com/nonewind/dsh-spend) - Token usage and estimated spend for the DSH web UI: floating panel with per-model / per-day / per-session stats and auto-detected billing plans.
- [dsh-live-stats](https://github.com/dsh-external/dsh-live-stats) - Live token estimates and generation TPS.
- [dsh-view-modes](https://github.com/NigelYao/dsh-view-modes) - DSH Web output modes with Verbose, Normal, and Summary views, semantic grouping for tool calls and thinking, and live execution status.
- [dsh-tps](https://github.com/dsh-external/dsh-tps) - TPS meter.
- [dsh-plugin-workshop](https://github.com/yyyyukari/dsh-plugin-workshop) - Steam Workshop-style in-app plugin browser: search, hot/newest/trending windows, Chinese keyword mapping, bilingual translation, plugin-signature filtering, and smart one-click install/update/uninstall with an installed-plugins manager.
- [dsh-cc-tui](https://github.com/dsh-external/dsh-cc-tui) - Claude Code-style fullscreen TUI (streaming expand / double-Esc rollback).
- [dsh-grok-tui](https://github.com/chen-001/dsh-grok-tui) - TUI built with grok-build.
- [dsh-pi-tui](https://github.com/lqhl/dsh-pi-tui) - Pi TUI (differential-rendering terminal framework) front end: streaming markdown, thinking collapse, tool cards, slash commands, approval/question overlays, shared dsh session store.
- [deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) - Rust/ratatui terminal client that speaks the DSH SDK JSON-RPC protocol directly and runs standalone or as a profi