[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/banner-en.png)](https://awesome-dsh-plugin.com)

> A curated list of plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

DeepSeek Harness is DeepSeek's open-source agent harness — a runnable coding agent (Web and headless), built on a framework where everything is a plugin: models, tools, sandboxes, session storage, UI, even the agent loop itself. Plugins can extend the official coding agent, swap out its core parts, or assemble something entirely different.

This list collects community plugins that are installable via `dsh plugin add` (each declares a `dsh.bundle` manifest). [PRs welcome](#contributing).

> 🛒 **Recommended: [dsh-market](https://github.com/dsh-market/dsh-market#readme)** (optional) — the plugin market inside DeepSeek Harness, with every plugin on this list. Simple, friendly UI: one-click plugin install and upgrade, one-click theme switching:

```sh
dsh plugin --profile web add dshmarket
```

> 💡 Prefer chat? [dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin#readme) lets your agent find plugins for you (`dsh plugin --profile web add dsh-find-plugin`).

> [!WARNING]
> Installing a plugin runs third-party code on your machine with your own permissions — it can read your files, use your credentials, and reach the network. Tool approvals don't sandbox plugin code. Being on this list is not a security review: check the source before you install, and try unfamiliar plugins somewhere that doesn't hold your keys. See the full disclaimer at the bottom of this page.

## Plugins

### UI Enhancements
- [littleboylittlegirl/dsh-community-hot](https://github.com/littleboylittlegirl/dsh-community-hot) - Floating community panel for the Web UI: 24h hot topics and hot plugins TOP10 with a draggable, always-on-top button.
- [1624318455/dsh-plugin-tts](https://github.com/1624318455/dsh-plugin-tts) - Reads assistant replies aloud via free Edge TTS: per-message read-aloud buttons, an auto-read toggle, and a voice settings panel.
- [x2802490130-prog/dsh-client-ui-writing](https://github.com/x2802490130-prog/dsh-client-ui-writing) - Client-side writing panel for the Web UI: project volumes and stats, corpus library, full-text search, evolution version-chain diffs, and an SVG thread graph, shown only in writing-preset sessions.
- [badai147/dsh-global-rules](https://github.com/badai147/dsh-global-rules) - Edit the global ~/.dsh/AGENTS.md rules from the web settings panel, live on save.
- [AcidGr/dsh-web-mobile-fix](https://github.com/AcidGr/dsh-web-mobile-fix) - Mobile layout fixes for the Web UI on narrow screens: full-screen settings panel, one-row plugin nav, full-screen sidebar, centered popups, icon-only session-log button.
- [mexiaosqwq/dsh-web-mobile](https://github.com/mexiaosqwq/dsh-web-mobile) - Mobile-adaptive layout for the DSH Web UI: the sidebar becomes a content-hugging overlay drawer, the conversation gets the full width, and the settings panel becomes a near-full-width sheet.

- [AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access) - LAN/remote access for the Web UI: injects a crypto.randomUUID polyfill on plain-HTTP origins so the frontend survives LAN or Tailscale IP direct links.

- [Bernardxu123/dsh-mobile-gate](https://github.com/Bernardxu123/dsh-mobile-gate) - LAN mobile gateway: isolated child-process reverse proxy with first-visit approval, per-device token binding, rate limiting, and mobile layout injection (compact composer pills, randomUUID polyfill).

- [Make0209/dsh-usage-stats](https://github.com/Make0209/dsh-usage-stats) - GitHub-style usage heatmap dashboard: per-workspace turn counts and token spend (with cache-hit rate), DeepSeek account balance, and workspace aliases.
- [Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats) - Multi-provider usage dashboard with provider/model token breakdowns, calendar drill-downs, account balances, and OpenCode Go / Z.ai subscription quota tracking.
- [V-dev-388/dsh-usage-meter](https://github.com/V-dev-388/dsh-usage-meter) - Settings-page usage dashboard: per-provider/model token summary across all sessions, with today/7-day/30-day CSS-bar trends and a cache-hit rate.
- [zoumutou/dsh-cost-balance](https://github.com/zoumutou/dsh-cost-balance) - Collapsible iOS-style stats pill under the composer: session cost, DeepSeek account balance, cache-hit rate, and token usage in a frosted panel.
- [ibka512/dsh-ibka-balance](https://github.com/ibka512/dsh-ibka-balance) - Permanent composer-dock balance card: real-time DeepSeek API account balance with 5-minute auto-refresh, a manual refresh button, and low-balance color warnings.

- [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) - Context insight panel: see what the model's context window is made of and how it evolves — composition vs. window size, per-request history, compression/injection events, and per-message token stats.

- [wjy9902/dsh-web-default-session](https://github.com/wjy9902/dsh-web-default-session) - The generic New Session action opens a default-directory workspace instead of requiring a folder pick, and the workspace picker lists that workspace as a no-folder choice.

- [Fishsb/dsh-prompt-enhancer](https://github.com/Fishsb/dsh-prompt-enhancer) - One-click prompt enhancement: an independent LLM call rewrites your rough draft in the composer, fully undoable.

- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) - A terminal UI (TUI) for DeepSeek Harness.
- [openma-ai/deepseek-harness-tui](https://github.com/openma-ai/deepseek-harness-tui) - A Rust/ratatui terminal client that speaks the DSH SDK JSON-RPC protocol directly and runs standalone or as a profile bundle.
- [WhitePlusMS/dsh-input-plus](https://github.com/WhitePlusMS/dsh-input-plus) - Search and insert workspace file and directory paths with `@`, plus a `/h` menu for reusing prompts from the current session.
- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) - Codex-style `@file` mentions: search workspace files in the composer and attach their contents to prompts.
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) - Customize the "deep diving" thinking status label to anything you like.
- [LeemanCheung/dsh-whale-animation](https://github.com/LeemanCheung/dsh-whale-animation) - Persistent black whale-dive animation beside the DSH Web turn status, with a reduced-motion fallback and a seamless closed loop.
- [01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator) - Replaces the "Deep diving..." turn-status label with rotating meme-worthy phrases, with typewriter and gradient effects.
- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) - OpenPencil design preview and editing plugin.
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) - In-conversation generative UI: the model renders interactive HTML cards into the chat stream, with streaming preview and sandboxed rendering.
- [hanzhangzzz/dsh-diagram](https://github.com/hanzhangzzz/dsh-diagram) - Editable Excalidraw diagrams for DeepSeek Harness conversations.
- [ccq1/dsh-side-panel](https://github.com/ccq1/dsh-side-panel) - Side panel with file browser, terminal, and Git review for quick file previews.
- [openAGFS/dsh-agfs](https://github.com/openAGFS/dsh-agfs) - File-browser web app for DSH: React frontend and REST API served by the host webserver, a /dsh-agfs command that opens at the current session workspace, and a browse_files model tool.
- [dingyi222666/dsh-focus-chat](https://github.com/dingyi222666/dsh-focus-chat) - A "focus chat" minimal view that shows only final outputs.
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) - Interactive UI components rendered inline in replies: layout, charts, forms, quizzes, mermaid, 3D scenes, and an action event loop back to the model.
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) - Select text → annotate → send with your message; replies map back to each annotation.
- [vlln/dsh-navbar](https://github.com/vlln/dsh-navbar) - Conversation node navigation bar for quick jumps between user messages.
- [asukasec/dsh-message-preview](https://github.com/asukasec/dsh-message-preview) - Right-edge user-message navigator with an adaptive block layout that fits the available height, plus hover previews, keyboard controls, and click-to-jump navigation.
- [jjxjjjjiik-bot/dsh-chat-timeline](https://github.com/jjxjjjjiik-bot/dsh-chat-timeline) - 1:1 port of DeepSeek's official web right-side chat navigation rail (ScrollNav): hover-expandable rail, reading-position highlight, click-to-jump.
- [vlln/dsh-task-status](https://github.com/vlln/dsh-task-status) - Background task status bar: progress plus live output tail on the chat page.
- [Nanki-nn/dsh-answer-pet](https://github.com/Nanki-nn/dsh-answer-pet) - Animated blue-whale desktop pet with per-session response progress, model activity and tool-call traces, token counts, output speed, elapsed time, and collapsible multi-session status cards.
- [mengyun233/dsh-codex-pet](https://github.com/mengyun233/dsh-codex-pet) - Auto-migrate Codex desktop-pet skins into DSH: an animated corner pet that mirrors agent state (thinking, tool use, awaiting approval, failed, done), with per-session frosted-glass dialogs and a full settings panel.
- [renat3u/dsh-web-archive](https://github.com/renat3u/dsh-web-archive) - Collapse noisy messages (Think, Bash, etc.) in conversations.
- [0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight) - Keyboard-first command palette for the DSH Web UI.
- [GooodWei/arcana](https://github.com/GooodWei/arcana) - A floating command deck that lists every slash command in DeepSeek Harness as runnable buttons, sorted by usage.
- [GooodWei/context-vista](https://github.com/GooodWei/context-vista) - A right-side floating panel and /context command for DeepSeek Harness — a live donut chart of context token usage, allocation, and estimated cost.
- [bill9109/dsh-101](https://github.com/bill9109/dsh-101) - Document reading mode for DSH.
- [bill9109/dsh-drag-and-drop](https://github.com/bill9109/dsh-drag-and-drop) - Cross-platform file drag-and-drop with raw path insertion, no file copying.
- [GLFzr/dsh-drop-file-to-path](https://github.com/GLFzr/dsh-drop-file-to-path) - Codex-style drag-drop: drag any file into the DSH web GUI, it lands in ~/.dsh-dropbox, and the path is inserted into the composer as a whole blue chip.
- [taxueseek/dsh-files](https://github.com/taxueseek/dsh-files) - File upload with color-coded attachment cards (session-isolated storage, sha256 dedup, TTL sweep) plus a content-sniffing read_document tool for PDF/DOCX/XLSX/TXT.
- [l541402398/dsh-file-uploads](https://github.com/l541402398/dsh-file-uploads) - Upload arbitrary local files from the Web composer, show pending cards, and manage stored files in Settings.
- [qyw233/dsh-deeplink](https://github.com/qyw233/dsh-deeplink) - Deep links: open a specific session or workspace via `?session=` / `?workspace=`.
- [lehhair/dsh-diff-viewer](https://github.com/lehhair/dsh-diff-viewer) - PiUI-style diff viewer replacing the stock DiffBlock for write/edit tool calls.
- [omdsh-dev/ex-setting](https://github.com/omdsh-dev/ex-setting) - Settings extensions for DSH.
- [omdsh-dev/web-components](https://github.com/omdsh-dev/web-components) - Web Components support.
- [vibeinging/dsh-turn-navigator](https://github.com/vibeinging/dsh-turn-navigator) - Turn navigation for the DSH Web UI.
- [SnowCrescenter-tech/dsh-milestone](https://github.com/SnowCrescenter-tech/dsh-milestone) - Right-side dot-timeline rail: jump between user messages.
- [Ghost011118/dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) - DeepSeek account balance and session cost in the composer dock, with auto-fetched official pricing and peak/off-peak support.
- [v587d/dsh-opencode-go-usage](https://github.com/v587d/dsh-opencode-go-usage) - OpenCode Go subscription usage (rolling/weekly/monthly windows with reset countdowns) in the composer dock, with a built-in credential editor.
- [GLFzr/dsh-opencode-go-quota](https://github.com/GLFzr/dsh-opencode-go-quota) - OpenCode Go quota ring: click-to-cycle progress ring (5h/weekly/monthly) left of the model selector, colored by urgency, with reset countdowns on hover.
- [Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) - Per-session and daily API cost, budget with usage %, official balance, history dashboard, and one-click official price sync with peak/off-peak pricing.
- [fishxcode/dsh-plugin-deepseek-balance](https://github.com/fishxcode/dsh-plugin-deepseek-balance) - DeepSeek API balance, balance trend, and daily usage charts in DSH Web settings.
- [Sev7een/ds-api-usage](https://github.com/Sev7een/ds-api-usage) - DeepSeek API balance and 24-hour usage dashboard in Settings, with estimated spend, token counts, request counts, and an hourly timeline.
- [nonewind/dsh-spend](https://github.com/nonewind/dsh-spend) - Token usage and estimated spend for the dsh web UI: floating panel with per-model, per-day, and per-session stats.
- [stevenx65/dsh-balance-plugin](https://github.com/stevenx65/dsh-balance-plugin) - DeepSeek balance and token usage in the web sidebar, with a today/all-time toggle and provider filtering.
- [LemCAE/dsh-balance](https://github.com/LemCAE/dsh-balance) - DeepSeek account balance and current-session spend estimate in a top-bar chip and settings card, with pause-aware auto-refresh, an editable official price table, a `deepseek_balance` model tool, and a bilingual UI.
- [huanyuLv/dsh-balance-tide](https://github.com/huanyuLv/dsh-balance-tide) - DeepSeek account balance and session cost under the composer, with a live peak/off-peak pricing badge (Beijing time), a countdown to the next pricing switch, hover price tables, and usage advice.
- [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) - Claude Code-style full-screen terminal UI: pixel-whale header, live status line, and streaming thought expansion.
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) - Full sidebar workbench with file rendering and editing, terminal, Git, and subagents; third-party plugins can register new tabs.
- [tsonglew/dsh-workspace-search](https://github.com/tsonglew/dsh-workspace-search) - VS Code-style workspace keyword search tab for dsh-better-sidebar: matches file names and content, grouped by file with line numbers, opens in the sidebar editor.
- [tsonglew/dsh-media-preview](https://github.com/tsonglew/dsh-media-preview) - Audio/video FileViewer for dsh-better-sidebar: native inline playback for mp4/webm/mkv/mov and mp3/flac/wav, served by a Range-capable streaming media route.
- [Han-1413141/dsh-sticky-disclosure](https://github.com/Han-1413141/dsh-sticky-disclosure) - One-click collapse of every expanded section (Think rows, tool cards) with a live-count pill and a customizable hotkey.
- [Meredith2328/dsh-sticky-note](https://github.com/Meredith2328/dsh-sticky-note) - Quick sticky notes on the composer toolbar: jot ideas or TODOs, auto-saved as Markdown, one click to send into the chat.
- [Luaphes/dsh-web-attention-badge](https://github.com/Luaphes/dsh-web-attention-badge) - Attention reminders: frame badge, tab-title count, and a status-colored whale favicon for sessions waiting for input or finished unopened.
- [zhu1090093659/dsh-web-ui#packages/dsh-web-ui-all](https://github.com/zhu1090093659/dsh-web-ui/tree/main/packages/dsh-web-ui-all) - Plugin and skin collection for the DSH Web UI: task board, Git graph, right-side panel, remote mobile UI, pet, live token stats, and a skin center.
- [zealot00/dsh-pet](https://github.com/zealot00/dsh-pet) - Desktop pet for the DSH Web UI: sprite-sheet animation, agent state linkage, drag, alarm (daily/one-shot) and pomodoro widgets, skin picker with preview.
- [sereinmono/dsh-desktop-pet](https://github.com/sereinmono/dsh-desktop-pet) - A plugin that adds a desktop pet to your DeepSeek Harness, supporting the Codex pet format, you can use hatch-pet or Petdex to add your pets.
- [ysyyhhh/dsh-pet](https://github.com/ysyyhhh/dsh-pet) - Native desktop pet for DSH that follows agent activity, supports Codex pet packages, and imports approved pets directly from Petdex without its CLI.
- [Starfie1d1272/dsh-builtin-toggles](https://github.com/Starfie1d1272/dsh-builtin-toggles) - Adds a built-in plugin catalog to DSH Web with search, status explanations, and safe toggles for audited UI plugins.
- [jiangnanquan/dsh-ux](https://github.com/jiangnanquan/dsh-ux) - Solarized light theme, compact layout, think/tool-chain collapse capsules, and balance, session cost, and usage dashboards for the DSH web UI.
- [a903067276-rgb/dsh-hud](https://github.com/a903067276-rgb/dsh-hud) - HUD status panel: Git status, MCP servers, skills, model and token usage in a floating side panel.
- [wsxwj123/dsh-plugins#turn-scrubber](https://github.com/wsxwj123/dsh-plugins/tree/main/packages/turn-scrubber) - Compact right-edge turn rail with hover summaries and click-to-jump navigation.
- [Sttrevens/dsh-cost-meter](https://github.com/Sttrevens/dsh-cost-meter) - Per-turn USD cost badge in the Web UI: session total in the header and per-turn cost in each message footer, with a hover breakdown.
- [a903067276-rgb/dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) - Clickable file paths in DSH replies: Codex-style inline open, reveal in file manager, and a mentioned-files chip list at the turn tail.
- [GitHubJiKe/dsh-markdown-preview](https://github.com/GitHubJiKe/dsh-markdown-preview) - In-chat preview for produced files: click a produced-file chip to render Markdown (server-side markdown-it + highlight.js), images, or plain text right in the conversation; system-app open and reveal-in-folder stay one click away