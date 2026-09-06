![](https://github.com/user-attachments/assets/4c7c78a9-e5d8-45ce-9372-d5bffe8f61c5)

  One command. Full internet access for your AI agent.
  
  Browse Twitter, search LinkedIn, scrape social media, read any webpage. Zero config. Just install and go.

**Install AgentKey. Give your AI superpowers.**

AgentKey is the master key for the agent ecosystem. When using Claude, Manus, or other agents, you often need external data: social media, e-commerce, on-chain data, various APIs. That means hunting down API keys, managing subscriptions, or hitting dead ends.

With AgentKey installed, your agent gains all these data capabilities automatically. No per-provider registrations, no juggling separate API bills. One subscription and go.

> ⭐ Star this repo to get notified whenever we add new platform support or release updates.

## Use Cases

### You ask your agent to... · Without AgentKey · With AgentKey
- **You ask your agent to...**: 🐦 What has Musk been saying on Twitter lately? · **Without AgentKey**: Can't access, tweets blocked · **With AgentKey**: Pulls all relevant tweets and summarizes them
- **You ask your agent to...**: 📕 What do people think of this product on Instagram? · **Without AgentKey**: Blocked, login required · **With AgentKey**: Scrapes real posts, organizes by sentiment
- **You ask your agent to...**: 📺 What does this YouTube / Bilibili video cover? · **Without AgentKey**: Can't read, no subtitles · **With AgentKey**: Reads the video/transcript, extracts key points
- **You ask your agent to...**: 📖 Find Reddit threads about this pain point · **Without AgentKey**: 403 blocked · **With AgentKey**: Finds relevant threads and extracts solutions
- **You ask your agent to...**: 👔 Check this competitor / candidate's LinkedIn · **Without AgentKey**: 403, access issues · **With AgentKey**: Opens the page, summarizes key info
- **You ask your agent to...**: 🎵 What's trending on Douyin / TikTok right now? · **Without AgentKey**: Can't scrape the hot list · **With AgentKey**: Pulls trending topics and tags
- **You ask your agent to...**: 🌐 What does this webpage say? · **Without AgentKey**: Returns a wall of raw HTML · **With AgentKey**: Extracts the content, explains it clearly
- **You ask your agent to...**: 📦 What does this GitHub repo do? · **Without AgentKey**: Have to click through yourself · **With AgentKey**: Reads README & Issues, one-line summary
- **You ask your agent to...**: 🧾 What has this wallet / fund been buying lately? · **Without AgentKey**: Click through a block explorer · **With AgentKey**: Summarizes recent transactions and positions

Before AgentKey: 10 tasks → 10 API keys → 10 separate bills.

Your agent is half-capable at best, constantly needing human help to find data, juggling credentials, drowning in complexity.

Now: one AgentKey handles everything. **AgentKey unifies all the external access your AI needs to do real work.**

## New here? Start on the web

Before touching the terminal, you can get a feel for AgentKey directly in your browser — the website and console explain things more visually than this README can.

- 🌐 **[agentkey.app](https://agentkey.app)** — Product overview, supported platforms, live demos, pricing details
- 🎛️ **[console.agentkey.app](https://console.agentkey.app)** — Sign up, manage your subscription, manage your API key, track usage

The one-line install below is what plugs AgentKey into your AI agent. If you only want to look around first, the two links above are the friendlier starting point.

## Install

One command. A browser tab opens for login, then you're done. The installer auto-detects every agent on your machine ([40+ supported](https://github.com/vercel-labs/skills#available-agents). Common examples include Claude Code, Codex, Gemini CLI, and Cursor CLI, etc.) and configures each one.

**macOS / Linux**
```bash
curl -fsSL https://agentkey.app/install.sh | bash
```

**Windows** (PowerShell)
```powershell
irm https://agentkey.app/install.ps1 | iex
```

Restart your agent, then ask it something that needs the internet. A running DeepSeek Harness profile watches the home patch through HMR; stopped profiles load it on their next start.

> *"What has Musk been tweeting about lately?"*

That's it. No API key to copy, no JSON to edit. 

<sub>Need to target specific agents or run in CI? → See the "Advanced install options" item in the [FAQ](#faq).</sub>

### DeepSeek Harness (DSH)

The one-line installers above detect `${DSH_HOME:-~/.dsh}` or the `dsh` command automatically. They install the AgentKey skill globally at `~/.agents/skills/agentkey`, authenticate with AgentKey, and add one managed Loader block to DSH's home-level patch:

```text
${DSH_HOME:-~/.dsh}/cordis.patch.yml
```

This is a **CLI-managed DSH MCP integration**, not a native installable DSH plugin. The home layer uses Loader id `agentkey`, module `@deepseek-ai/dsh-mcp-client`, and MCP `serverName: agentkey`; it is composed over current and future profiles. Tool allow/deny policy still controls whether a preset, session, or subagent can see the tools.

DSH 0.1.0-rc.7 does not provide an OAuth `authProvider` to its MCP SDK client. A header-free server entry cannot complete 401/RFC 9728 discovery or open a browser. DSH must use the device-code command below so the CLI writes a local Bearer key.

For a DSH-only manual install, run exactly these two steps:

```bash
npx -y skills add chainbase-labs/agentkey -g -a universal -s agentkey -y
npx -y @agentkey/cli --auth-login --only dsh
```

The CLI stores the real API key only in the single local home patch; no key belongs in Git. Re-running the command rotates the key and replaces the managed block. No existing profile is required. During migration it removes only top-level, column-1 AgentKey managed blocks from per-profile patches and renames a legacy `.agent-presets/agentkey` directory to a timestamped backup; the CLI prints that backup path. If it structurally detects an older unmarked AgentKey Loader row, it stops without changing any patch and asks you to remove that top-level `insert` child manually. Symlinked profile patches are inspected read-only: a clean symlink profile is allowed, while either legacy AgentKey form stops installation and reports the path for manual removal.

Only currently running profile processes observe the home-file change immediately through HMR. Stopped and future profiles load it when they start. If an old preset was already active in a session, close that session or restart DSH once after migration.

#### How to confirm DSH installation

1. Open **DSH → Settings → Plugins → Plugin list**, search for configured id `agentkey`, and expand the `mcp-client` row. DSH 0.1 currently renders:
   - Loader path: `include:agentkey` (the stable configured entry id is `agentkey`)
   - module title: `@deepseek-ai/dsh-mcp-client` (the card shortens it to `mcp-client`)
   - Cordis status: `Mounted` (the underlying fiber phase is `active`)

   `Mounted`/`active` proves only that Cordis loaded the row. Because `failOnStartupError: false`, it does **not** prove that MCP authenticated or connected.

2. In the intended preset/session, confirm the three core tools are visible:
   - `mcp__agentkey__find_tools`
   - `mcp__agentkey__describe_tool`
   - `mcp__agentkey__execute_tool`

   `list_tools` is deprecated and is not a readiness requirement. If a core tool is hidden only in one context, inspect that preset/session/subagent's tool policy.

3. Ask: **“Please use AgentKey to search for today's latest AI news.”** Success requires an actual `find_tools` → `describe_tool` → `execute_tool` call, not merely a Mounted card.

Troubleshooting:

- **No `agentkey` row:** the home patch was not written or `DSH_HOME` points elsewhere. Re-run the DSH-only CLI command and inspect its reported path.
- **Row exists but is not Mounted/active:** inspect the Loader error and verify `@deepseek-ai/dsh-mcp-client` exists in the DSH installation.
- **Mounted but tools are missing:** inspect MCP connection logs, the local Authorization key, and the active tool policy. In `tools/list`, each tool's root `inputSchema.additionalProperties` must be absent or `true`, never `false`.
- **401:** the local key is missing or invalid; rerun auth-login to rotate it.
- **`serverName already in use`:** rerun the current CLI so it archives the legacy preset, then close sessions that still hold the old preset or restart DSH once.

## What your agent can now do

AgentKey maintains cloud-side integrations across the open web — no extra accounts, no extra keys.

### Capability · What it covers
- **Capability**: **Web search** · **What it covers**: Search engines, news, and real-time discovery across the open web
- **Capability**: **Web scraping** · **What it covers**: Clean article extraction, structured data, and metadata from any URL
- **Capability**: **On-chain / Crypto** · **What it covers**: Token prices, market data, on-chain activity, and project metadata
- **Capability**: **Social & content** · **What it covers**: Public posts, videos, and discussions across major social and content platforms
- **Capability**: **Finance** · **What it covers**: Stock & FX quotes, technical indicators, company financials, and earnings
- **Capability**: **E-commerce** · **What it covers**: Product listings, prices, reviews, and best-sellers across major marketplaces
- **Capability**: **Business** · **What it covers**: Company, funding, investor, and people data for market and competitive research

Underlying providers are routed automatically and grow over time — your agent can call `find_tools` to see what's currently available.

**Planned:** Maps & Weather

## FAQ

Is it safe?

Yes. AgentKey is a master key — one platform that unlocks external capabilities for your agent. By design, we have no access to your local files, your credentials, or your agent's conversations. The only data AgentKey collects is anonymous usage telemetry — which agent you installed into, your skill version, and upgrade outcomes — never your queries or responses. See "How do I opt out of telemetry?" below.

How is this different from Claude / ChatGPT's built-in web access?

Native web access in Claude and ChatGPT has limited platform coverage. It often can't reach Twitter, on-chain data, etc. AgentKey fills those gaps.

How does pricing work? What if I use up my plan's credits?

AgentKey is subscription-based. Each plan includes a monthly credit allowance; usage beyond that is billed pay-as-you-go as overage. You can upgrade your plan or manage billing anytime at [console.agentkey.app](https://console.agentkey.app). See [agentkey.app](https://agentkey.app) for current plans and pricing.

How do I update?

There are two pieces and they update differently:

- **MCP server**: the real server is hosted at `https://api.agentkey.app/v1/mcp`, so it's always up to date — no local upgrade step. The `@agentkey/cli` package (run as `npx -y @agentkey/cli --auth-login`) only writes the remote-HTTP MCP config into each AI client and never has to be re-run unless you want to rotate your key.

- **Skill files** (`SKILL.md` + helpers): how this updates depends on your client.

### Claude Code

Updates are automatic. On the first call of a session the skill runs a silent version check; if a new release is available it prompts you to upgrade and (with your consent) runs `npx skills update -g agentkey`.

### Claude Desktop, Cursor, and other clients without an inline Bash tool

The skill cannot run the inline check itself, but starting in v1.4.0 the **MCP server publishes the latest skill version via a dedicated metadata tool (`agentkey_skill_meta`)**. Your agent calls it once per session, compares against this skill's own version, and prompts you to upgrade with the exact command for your client. See [protocol/skill-meta-v1.md](./protocol/skill-meta-v1.md) for the protocol details.

**One-time bootstrap on Desktop:** if you're stuck on a pre-1.4.0 skill in Claude Desktop, the metadata tool exists but your skill rule doesn't know how to read it. Bring yourself current once with:

```bash
# Replace <UUID1>/<UUID2> with the actual session folder under skills-plugin
# (usually there's just one; pick the one that contains skills/agentkey/SKILL.md)
DESKTOP_BASE="$HOME/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin"
LATEST_REPO_ZIP=$(mktemp -d)/agentkey.tar.gz
curl -fsSL https://github.com/chainbase-labs/agentkey/archive/refs/heads/main.tar.gz -o "$LATEST_REPO_ZIP"
tar -xzf "$LATEST_REPO_ZIP" -C "$(dirname "$LATEST_REPO_ZIP")"
find "$DESKTOP_BASE" -type d -path "*/skills/agentkey" 2>/dev/null | while read -r dst; do
  cp -R "$(dirname "$LATEST_REPO_ZIP")"/agentkey-main/skills/agentkey/. "$dst/"
done
# Then fully quit and restart Claude Desktop.
```

After this one bootstrap, future versions will be discovered automatically via the metadata tool.

### Force manual update (any client)

```bash
# Refresh the skill content
npx skills update agentkey

# Pin a specific version
npx skills add chainbase-labs/agentkey@v1.0.0
```

Note: `npx skills update` writes to `~/.agents/skills/agentkey` and `~/.claude/skills/agentkey`, which is where Claude Code reads from. **Claude Desktop reads from its own sandbox path** and is not touched by `npx skills update` — use the Desktop bootstrap command above for Desktop.

Re-run `npx -y @agentkey/cli --auth-login` only when you want to rotate your API key.

How do I uninstall?

One command, cleans every agent and config file.

**macOS / Linux**
```bash
curl -fsSL https://agentkey.app/uninstall.sh | bash
```

**Windows** (PowerShell)
```powershell
irm https://agentkey.app/uninstall.ps1 | iex
```

Removes the skill from every agent, strips the `agentkey` MCP entry + API key from all MCP client configs, and clears caches/logs. Pass `--keep-marketplace` (bash) / `-KeepMarketplace` (PowerShell) to retain the Claude Code plugin marketplace entry.

**Prefer manual two-step?**

```bash
# 1. Remove the skill from every agent
npx skills remove chainbase-labs/agentkey

# 2. Delete the "agentkey" entry under mcpServers in each MCP client config:
#    - Claude Code:     ~/.claude.json
#    - Claude Desktop:  ~/Library/Application Support/Claude/claude_desktop_config.json  (macOS)
#                       %APPDATA%\Claude\claude_desktop_config.json                      (Windows)
#    - Cursor:          ~/.cursor/mcp.json
```

The one-command uninstaller additionally cleans npm/npx caches, legacy shell rc entries, CLAUDE.md sections, and MCP stdio logs — use that if you want a fully clean slate.

How do I opt out of telemetry?

AgentKey sends anonymous usage telemetry (which agent you use, skill version, upgrade outcomes — never queries or responses). Three ways to opt out, any of them works:

```bash
# Persistent opt-out (recommended)
touch ~/.config/agentkey/telemetry-disabled

# One-shot env override (CI / single session)
AGENTKEY_TELEMETRY=0 <your command>

# At install time
curl -fsSL https://agentkey.app/install.sh | bash -s -- --no-telemetry
```

To re-enable, delete `~/.config/agentkey/telemetry-disabled`.

Something's not working — how do I check?

Inside your agent, try `/agentkey status` — it diagnoses your MCP config, version, and connectivity.

Available slash commands:

### Command · What it does
- **Command**: `/agentkey` · **What it does**: Auto-triggered during data queries — you usually don't call it manually
- **Command**: `/agentkey setup` · **What it does**: First-time setup: configure API key + verify MCP connectivity
- **Command**: `/agentkey status` · **What it does**: Diagnose current config (MCP, version, connectivity test)

Still stuck? See the "Where do I get help" item below.

Advanced install options (CI / specific agents / manual two-step)

The installer auto-detects which AI agents you have on this machine (by probing well-known config dirs and binaries from the [vercel-labs/skills supported-agents list](https://github.com/vercel-labs/skills)) and pre-selects them — no multi-select prompt. Override with the flags below.

**Installer flags:**

```bash
# Non-interactive (CI / unattended): install to every detected agent, no prompts
curl -fsSL https://agentkey.app/install.sh | bash -s -- --yes

# See which agents the installer would auto-select on this host (and exit)
curl -fsSL https://agentkey.app/install.sh | bash -s -- --list-agents

# Only install the skill for specific agents (overrides auto-detection)
curl -fsSL https://agentkey.app/install.sh | bash -s -- --only claude-code,cursor

# Skip our agent detection; let `skills` CLI install for every agent it finds
curl -fsSL https://agentkey.app/install.sh | bash -s -- --all-agents

# Only the skill, or only the MCP auth
curl -fsSL https://agentkey.app/install.sh | bash -s -- --skip-mcp
curl -fsSL https://agentkey.app/install.sh | bash -s -- --skip-skill
```

PowerShell equivalents: `-Yes`, `-ListAgents`, `-Only`, `-AllAgents`, `-SkipMcp`, `-SkipSkill`.

**Manual two-step install** (if you'd rather run the two underlying commands yourself, or the one-line installer can't reach your machine):

```bash
# 1. Install the skill into every detected agent
npx skills add chainbase-labs/agentkey

# 2. Authenticate and register the MCP server
npx -y @agentkey/cli --auth-login
```

**Headless / SSH / Docker?** The auth step always tries to open a browser **and** prints the URL — so on a machine without a usable display, just copy the printed URL to any device with a browser to finish auth. Prefer typing the key manually? `npx -y @agentkey/cli --setup` opens an interactive wizard instead.

My agent isn't on the auto-configured list — how do I set it up manually?

The CLI supports the clients shown in its current **Supported agents** list, and the one-line installer targets the supported clients it detects — including **DeepSeek Harness**. If your client is not detected or supported for automatic configuration, the skill can still be installed globally, but you