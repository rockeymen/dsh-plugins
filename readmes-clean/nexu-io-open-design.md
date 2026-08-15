# Open Design: The open-source Claude Design alternative

> ⚡ **Open Design Cloud — the official model service.** One recharge to use GPT, Claude, Gemini, and DeepSeek inside Open Design: 20+ flagship models, zero config, billed by real token usage. [Try Open Design Cloud](https://open-design.ai/cloud/?utm_source=github&utm_medium=referral&utm_content=readme_try_cloud)
>
> 🏅 **The Open Design Fellow program is now open.** If you also believe design should be open — become an Open Design Fellow, shape the product alongside the core team, and help more people take part in defining the future of design. Details → [`MAINTAINERS.md`](MAINTAINERS.md) and [Discord](https://discord.gg/mHAjSMV6gz).

  ![Open Design hero banner — the headline &quot;The open-source Claude Design alternative&quot; over a classical scene of columns and robed figures on a digital-code backdrop, with stat cards for design systems, plugins, coding agents, and media providers](https://repo-assets.open-design.ai/resources/images/hero.png)

## What is Open Design

🎨 **The open-source Claude Design alternative.** &nbsp;🖥️ **Local-first native desktop app for macOS and Windows.** &nbsp;⚡ **Composable skills, brand-grade `DESIGN.md` design systems, and ready-to-use plugins.** &nbsp;🖼️ Generates **web · desktop · mobile prototypes**, **live dashboards / artifacts**, **decks**, **images**, **video**, plus **HyperFrames** motion graphics. 🔒 Sandboxed iframe preview · HTML / PDF / PPTX / MP4 export. &nbsp;🤖 **Runs on DeepSeek Harness (`dsh`) · Claude Code · OpenClaw · Codex · Cursor · OpenCode · Qwen · Copilot · Amp · Hermes · Kimi · Antigravity and 26 distinct local CLI executables**, or any OpenAI-compatible endpoint via BYOK.

Open Design is what you get when the **agent-native** loop Anthropic shipped with Claude Design — discover the brief, lock the direction, stream the artifact, critique, deliver — stops being closed and becomes a **filesystem of functional skills, rendering design templates, design systems, and plugins** that the coding agents already on your laptop can read, write, and remix. Your CLI becomes the design engine, your laptop becomes the studio, and your team's `DESIGN.md` becomes the brand contract.

It's also the **Figma alternative for the agent era** — instead of pushing pixels on a canvas, it delivers single-page artifacts in real CSS, real fonts, real components, exported straight to HTML / PDF / PPTX / MP4 — already shaped by your design system, already runnable inside the agent you use every day.

## Product tour

A quick look at what Open Design is and what it does. Start from **Home**, orchestrate repeat workflows with **Automation**, distill a brand contract in **Design System**, and extend with **Plugins** and **integrations**; inside any project's **Studio**, the same design system streams out prototypes, live artifacts, HyperFrames, decks, and images.

### Core pages

<table>
<tr>
<td valign="top">
![Home page](https://repo-assets.open-design.ai/resources/images/product/home.png)
<sub>Home — the overview entry point. Pick a skill and a design system, type the brief, and kick off everything from one place.</sub>
</td>
</tr>
</table>

<table>
<tr>
<td width="50%" valign="top">
![Automation page](https://repo-assets.open-design.ai/resources/images/product/automation.png)
<sub>Automation — orchestrate repetitive design workflows into reusable, schedulable automations.</sub>
</td>
<td width="50%" valign="top">
![Design System page](https://repo-assets.open-design.ai/resources/images/product/design-system.png)
<sub>Design System — distill your team's <code>DESIGN.md</code> into a brand contract that shapes every output.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
![Plugin page](https://repo-assets.open-design.ai/resources/images/product/plugin.png)
<sub>Plugin — browse, install, and distribute workflow plugins to extend generation on demand.</sub>
</td>
<td width="50%" valign="top">
![Integrations page](https://repo-assets.open-design.ai/resources/images/product/integrations.png)
<sub>Integrations — connect external systems and MCP tools, and use Open Design from any IDE, script, or automation.</sub>
</td>
</tr>
</table>

### Studio — many artifact types in one project

Inside a project's Studio, the same design system streams out multiple artifact types:

<table>
<tr>
<td width="50%" valign="top">
![Prototype](https://repo-assets.open-design.ai/resources/images/product/studio-prototype.png)
<sub>Prototype — single-page HTML artifacts that read your design system and render in a sandboxed iframe, previewable instantly and downloadable as source.</sub>
</td>
<td width="50%" valign="top">
![HyperFrame](https://repo-assets.open-design.ai/resources/images/product/studio-hyperframe.png)
<sub>HyperFrame — programmatic motion and animated graphics, rendered to a real MP4 (e.g. 1920×1080 · 30fps).</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
![Deck](https://repo-assets.open-design.ai/resources/images/product/studio-ppt.png)
<sub>Deck — pitch decks you can page through, navigate by keyboard, and export to PPTX / PDF.</sub>
</td>
<td width="50%" valign="top">
![Image](https://repo-assets.open-design.ai/resources/images/product/studio-image.png)
<sub>Image — brand-grade images and visual assets, with high-resolution generation and download.</sub>
</td>
</tr>
</table>

## Platform Compatibility

> Open Design connects to mainstream coding agents in two ways: **skills, CLI, and MCP** for agents that consume OD, plus **native runtime adapters** for agents that OD launches directly. DeepSeek Harness is a first-class native runtime through the official `dsh` CLI, with structured streaming, model discovery, cancellation, and session resume.

| Coding agent / platform &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Status &nbsp;&nbsp; | Quick setup &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
|---|:---:|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | ✅ Supported | `od mcp install claude` |
| [Claude Desktop](https://claude.ai/download) | ✅ Supported¹ | `od mcp install claude-desktop` |
| [Codex CLI](https://github.com/openai/codex) | ✅ Supported | `od mcp install codex` |
| [DeepSeek Reasonix](https://github.com/esengine/DeepSeek-Reasonix) | ✅ Supported | `od mcp install reasonix` |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | ✅ Native runtime | `od agent setup deepseek-harness` |
| [Raven](https://github.com/EverMind-AI/Raven) | ✅ Supported | `od mcp install raven` |
| [Cursor](https://www.cursor.com/cli) | ✅ Supported | `od mcp install cursor` |
| [VS Code + GitHub Copilot](https://github.com/features/copilot) | ✅ Supported | `od mcp install copilot` |
| [GitHub Copilot CLI](https://github.com/features/copilot/cli) | ✅ Supported | `od mcp install copilot` |
| [OpenCode](https://opencode.ai/) | ✅ Supported | `od mcp install opencode` |
| [OpenClaw](https://github.com/openclaw/openclaw) | ✅ Supported | `od mcp install openclaw` |
| [Antigravity](https://antigravity.google) | ✅ Supported | `od mcp install antigravity` |
| [Cline](https://github.com/cline/cline) | ✅ Supported | `od mcp install cline` |
| [Trae](https://www.trae.ai/) | ✅ Supported | `od mcp install trae` |
| [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) | ✅ Supported | `od mcp install kimi` |
| [Kiro](https://kiro.dev) | ✅ Supported | `od mcp install kiro` |
| [Pi Agent](https://github.com/badlogic/pi-mono) | ✅ Supported | `od mcp install pi` |
| [Mistral Vibe CLI](https://github.com/mistralai/mistral-vibe) | ✅ Supported | `od mcp install vibe` |
| [Hermes Agent](https://github.com/nousresearch/hermes-agent) | ✅ Supported | `od mcp install hermes` |

For DeepSeek Harness, install the official `dsh` CLI first, then select it in Open Design or run `od agent setup deepseek-harness` to install/repair OD's connection component. For MCP integrations: `od mcp install <agent> --print` for a dry-run preview · `--uninstall` to remove · full list with `od mcp install --help`.

¹ Automatic MCP configuration for Claude Desktop is currently supported on macOS and Windows only.

  ![The 26 coding-agent CLIs Open Design supports — DeepSeek Harness · Claude Code · Codex · OpenCode · Hermes · Antigravity · Vela · Grok Build · Kimi · Cursor Agent · Qwen · Qoder · GitHub Copilot · Pi · Kiro · Kilo · Mistral Vibe · DeepSeek · Reasonix · Aider · Amp · CodeBuddy · Mimo · AtomCode · Devin · Trae](https://repo-assets.open-design.ai/resources/images/coding-agents.png)

**No CLI installed?** The BYOK proxy at `POST /api/proxy/{anthropic,openai,azure,google,ollama,senseaudio}/stream` gives you the same loop (no process spawn) — paste `baseUrl` + `apiKey` + `model`, with presets for OpenAI, Atlas Cloud, Anthropic, Azure OpenAI, Google Gemini, Ollama, LM Studio, vLLM, or any OpenAI-compatible endpoint. Atlas Cloud uses `https://api.atlascloud.ai/v1` with your own key and OpenAI-compatible model ids such as `qwen/qwen3.5-flash`. Per-target SSRF protection blocks internal IPs / link-local / CGNAT at the daemon edge.

Runtime definitions live in [`apps/daemon/src/runtimes/defs/`](apps/daemon/src/runtimes/defs/), with registration and shared stream handling under [`apps/daemon/src/runtimes/`](apps/daemon/src/runtimes/). See [`docs/agent-adapters.md`](docs/agent-adapters.md) for the adapter contract.

## Demo

Four core product categories, all rendered by a coding agent running on your laptop. Click a thumbnail to see the real example.

### 1 · Prototypes — web · desktop · mobile

The default output surface. Single-page HTML artifacts that read your `DESIGN.md` and render in a sandboxed iframe.

<table>
<tr>
<td width="50%" valign="top">
![Entry view](docs/screenshots/01-entry-view.png)
<sub>Entry view — pick a skill, pick a design system, type the brief. One surface for prototypes, dashboards, decks, mobile apps, magazine pages.</sub>
</td>
<td width="50%" valign="top">
![Mobile onboarding](docs/screenshots/skills/mobile-onboarding.png)
<sub>Mobile prototype — pixel-accurate iPhone 15 Pro chrome, multi-screen flows. The agent never redraws the phone frame; shared device frames live in <code>assets/frames/</code>.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
![Web prototype dating-web](docs/screenshots/skills/dating-web.png)
<sub>Web prototype — an editorial dashboard with scrollbars, KPIs, and charts. Rendered straight from <code>design-templates/dating-web/</code>.</sub>
</td>
<td width="50%" valign="top">
![Gamified app](docs/screenshots/skills/gamified-app.png)
<sub>Mobile app prototype — a three-screen gamified flow with XP ribbons and quest detail. Hand off straight to Cursor / Codex / Claude Code to turn into React/Next/Vue.</sub>
</td>
</tr>
</table>

### 2 · Live artifacts & dashboards

Live dashboards, decision rooms, KPI walls — single-page artifacts that pull data through a tweaks panel and stay editable in place.

<table>
<tr>
<td width="50%" valign="top">
![Live dashboard](docs/screenshots/skills/live-dashboard.png)
<sub>Live dashboard — an editable KPI wall whose tweaks panel surfaces the parameters worth nudging. The agent emits a manifest, and the iframe re-renders without a reload.</sub>
</td>
<td width="50%" valign="top">
![Decision room](docs/screenshots/skills/research-decision-room.png)
<sub>Decision room — a multi-source briefing artifact for product / research / ops meetings.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
![GitHub dashboard](docs/screenshots/skills/github-dashboard.png)
<sub>GitHub-style dashboard — repo metrics presented as a live artifact.</sub>
</td>
<td width="50%" valign="top">
![Flow live dashboard](docs/screenshots/skills/flowai-live-dashboard-template.png)
<sub>Flow live-dashboard template — a domain-specific KPI template, branded through the active <code>DESIGN.md</code>.</sub>
</td>
</tr>
</table>

### 3 · Decks — magazine decks, weekly updates, pitches

<table>
<tr>
<td width="50%" valign="top">
![Magazine deck (guizang-ppt)](docs/screenshots/07-magazine-deck.png)
<sub>Deck mode (guizang-ppt) — magazine layouts, WebGL hero, P0/P1/P2 checklists. Bundled verbatim from <a href="https://github.com/op7418/guizang-ppt-skill"><code>op7418/guizang-ppt-skill</code></a> with its original license preserved.</sub>
</td>
<td width="50%" valign="top">
![Swiss deck](docs/screenshots/skills/deck-swiss-international.png)
<sub>Swiss International-style deck — grid-anchored, monochrome accents. One of 15 deck templates and 36 themes under <code>design-templates/html-ppt-*/</code>.</sub>
</td>
</tr>
</table>

Every deck exports to **HTML** (single file, inlined assets), **PDF** (browser print, deck-aware), **PPTX** (agent-driven skill), **ZIP** (archive), or **Markdown**.

### 4 · Images — `gpt-image-2`, ImageRouter, custom API

<table>
<tr>
<td width="20%" valign="top">![Illustrated city food map](https://cms-assets.youmind.com/media/1776662673014_nf0taw_HGRMNDybsAAGG88.jpg)<sub>Illustrated city food mapHand-drawn editorial travel poster</sub></td>
<td width="20%" valign="top">![Cinematic elevator scene](https://cms-assets.youmind.com/media/1777453149026_gd2k50_HHCSvymboAAVscc.jpg)<sub>Cinematic elevator sceneSingle-frame editorial still</sub></td>
<td width="20%" valign="top">![Cyberpunk anime portrait](https://cms-assets.youmind.com/media/1777453164993_mt5b69_HHDoWfeaUAEA6Vt.jpg)<sub>Cyberpunk portraitProfile avatar — neon face text</sub></td>
<td width="20%" valign="top">![3D stone staircase evolution](https://cms-assets.youmind.com/media/1776661968404_8a5flm_HGQc_KOaMAA2vt0.jpg)<sub>3D stone staircaseHewn-stone infographic</sub></td>
<td width="20%" valign="top">![Glamorous portrait](https://cms-assets.youmind.com/media/1777453184257_vb9hvl_HG9tAkOa4AAuRrn.jpg)<sub>Glamorous portraitEditorial studio shot</sub></td>
</tr>
</table>

**93 ready-to-replicate prompts** live in [`prompt-templates/`](prompt-templates/) — preview thumbnails, full prompt body, target model, aspect ratio, and source attribution. One click drops a brief into the composer.

### 5 · Video & HyperFrames — agent-native motion graphics

**[HyperFrames][hyperframes]** is HeyGen's open-source, agent-native video framework, integrated as a first-class citizen in Open Design. The agent writes HTML + CSS + GSAP, and HyperFrames renders it to a deterministic MP4 via headless Chrome + FFmpeg. Pair it with **Seedance 2.0** for cinematic t2v / i2v, **Veo 3 / Sora 2 / Kling 2** for routed model variants, and **Suno v5 / Lyria 2** for the audio layer.

<table>
<tr>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-saas-product-promo-30s.json">![SaaS promo](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/app-showcase.png)</a><sub>30s SaaS product promo · 16:9 · UI 3D reveals</sub></td>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-tiktok-karaoke-talking-head.json">![TikTok karaoke](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/tiktok-follow.png)</a><sub>TikTok karaoke talking-head · 9:16 · TTS + word-synced captions</sub></td>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-brand-sizzle-reel.json">![Brand sizzle reel](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png)</a><sub>30s brand sizzle reel · 16:9 · audio-reactive kinetic type</sub></td>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-data-bar-chart-race.json">![Bar chart race](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/data-chart.png)</a><sub>Bar chart race · 16:9 · NYT-style data infographic</sub></td>
</tr>
<tr>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-flight-map-route.json">![Flight map](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/nyc-paris-flight.png)</a><sub>Flight map · 16:9 · Apple-style route reveal</sub></td>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-logo-outro-cinematic.json">![Logo outro](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png)</a><sub>4s cinematic logo outro · 16:9 · piece-by-piece assembly + bloom</sub></td>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-money-counter-hype.json">![Money counter](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/apple-money-count.png)</a><sub>$0 → $10K money counter · 9:16 · Apple-style hype</sub></td>
<td width="25%" valign="top"><a href="prompt-templates/video/hyperframes-website-to-video-promo.json">![Website to video](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/instagram-follow.png)</a><sub>Website-to-video · 16:9 · captures the site at 3 viewports</sub></td>
</tr>
</table>

11 HyperFrames templates + 39 Seedance prompts ship with the repo. Catalog thumbnails © HeyGen; the framework is Apache-2.0. The OD-specific render workflow (composition cache, sandbox-exec workaround, MP4-as-chip) is detailed in [`design-templates/hyperframes/`](design-templates/hyperframes/).

[hyperframes]: https://github.com/heygen-com/hyperframes

## Why Open Design

> **In April 2026, Anthropic released Claude Design — the first time an LLM stopped writing prose and started delivering design artifacts directly.** It went viral. But it stayed closed-source, paid-only, cloud-only, locked to Anthropic's model, Anthropic's skills, Anthropic's surface. No checkout, no self-host, no Vercel deploy, no swap-in-your-own-agent.

Open Design (OD) is the open-source alternative. Same loop, same artifact-first mental model, none of the lock-in:

- 🤖 **Agent-native, model-agnostic.** We don't ship an agent. The `claude` / `codex` / `cursor-agent` / `copilot` / `hermes` / `kimi` already on your `PATH` are the design engine. Swap with one click.
- 🧠 **Brand-grade by default.** Every render reads the active package's `DESIGN.md` as the core b