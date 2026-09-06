# xiaotaozi-dsh

Xiaotaozi DSH: Desktop + xtz CLI as two products over one shared DeepSeek Harness plugin layer.

  dsh-providers · dsh-memory · dsh-im · dsh-hello · dsh-sidebar · dsh-market · dsh-agent-teams · dsh-context

  Settings → Models · Xiaotaozi · Memory · Sidebar → IM bots

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) loads plugins from Git or npm. This repo is **xiaotaozi-dsh**: its two main products are the Mac-only client in [`apps/desktop/`](apps/desktop/) and the `xtz` command in [`apps/cli/`](apps/cli/); `plugins/` is their shared capability layer. The workspace root is not a plugin — do not `dsh plugin add` it.

Something broken, or a plugin missing? [Open an issue](https://github.com/kedoupi/xiaotaozi-dsh/issues).

## Features

- **Two entry points, one official environment.** Users use Desktop; people comfortable with terminals and configuration also use `xtz`. The CLI currently inspects the Desktop-owned `~/.dsh` / 3080 environment read-only; lifecycle and task commands wait for shared safety primitives. Dual install does not change plugin ownership.
- **One installable package per job.** Models, memory, IM bots, and the Xiaotaozi workbench ship separately. Git install is always `github:kedoupi/xiaotaozi-dsh#path:plugins/<slug>`.
- **Two homes.** Test stays on test; official stays on official. Plugin debug and `pnpm tauri dev` use `.dsh-home` (`pnpm dev`, 3081). The installed 小桃子DSH.app uses `~/.dsh` (3080). Do not mix them.
- **Host-first layout.** Default `pnpm new` is host-only. Mixed plugins add `src/client` only when there is a settings page, slot, or theme.
- **Git path install builds on the user's machine.** Each plugin keeps `prepare` / `tsdown.config.ts` inside the package so `github:…#path:plugins/<slug>` can compile without the rest of the workspace.

## `xtz` CLI

The first `xtz` release is a read-only safety foundation. Its runtime is pinned to exactly Node.js `22.19.0` and DSH `0.1.1-rc.2`. Install with npm, bun, or the script (installers only; `xtz` still runs on Node):

```bash
curl -fsSL https://raw.githubusercontent.com/kedoupi/xiaotaozi-dsh/main/apps/cli/scripts/install.sh | sh
npm install -g xiaotaozi-dsh-cli
bun add -g xiaotaozi-dsh-cli
xtz --help
xtz version
xtz status
xtz config path
xtz plugin list
xtz doctor
```

`start`/`web`, `open`, `run`/`ask`, `config dump`/`defaults`, `stop`, and `update` are disabled until Desktop and CLI share a trusted cross-process supervisor, authenticated instance ownership, and a locked profile transaction boundary. The existing v1 endpoint proves product-compatible health only; it is not authority for a CLI mutation. The CLI therefore does not yet promise Desktop/Web headless capability parity. See [`apps/cli/README.md`](apps/cli/README.md) for the full command and safety contract.

## Plugins

###  · Package · Occupies · What it does

## Related (git submodules)

Read-only upstream pins. We fork into `plugins/` and install **only** the fork. Do not add a submodule for a project we will not fork and install. Do not `link-plugin` or `dsh plugin add` anything under `externals/`. Clone with `--recurse-submodules`, or run `git submodule update --init`. Spec: [docs/conventions.md](docs/conventions.md) § Externals.

When the author updates: `git submodule update --remote externals/<name>`, diff against `plugins/<slug>/src`, port into the fork. Never `#path:externals/…`.

### Checkout · Upstream · Our fork (the thing to install)
- **Checkout**: [`externals/dsh-agent-teams`](externals/dsh-agent-teams) · **Upstream**: [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) · **Our fork (the thing to install)**: [`plugins/agent-teams`](plugins/agent-teams) (`dsh-agent-teams`)
- **Checkout**: [`externals/dsh-context`](externals/dsh-context) · **Upstream**: [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) · **Our fork (the thing to install)**: [`plugins/context`](plugins/context) (`dsh-context`)

## Install

Pick a package. Do not add the repository root.

**Choose an install mode first.** The Git path commands below are for a Node/developer sandbox (`.dsh-home`, port 3081). Do not use GitHub, npm, or `link:` installs in the official `~/.dsh` / 3080 desktop line; the desktop app uses bundled plugins and verified signed packs.

**Step 1 — add one plugin to the sandbox `web` profile.**

```bash
dsh plugin --profile web add github:kedoupi/xiaotaozi-dsh#path:plugins/providers
dsh web
```

**Step 2 — open the page or entry that plugin occupies.** Providers: **Settings → Models**. Memory: **Settings → Memory**. Hello: **Settings → Xiaotaozi**. IM: sidebar, below **New Session** → **IM bots**. Market: sidebar, below **New Session** → **Market**. Agent teams: conversation + activity panel. Context: session **Context** tab or `/context`.

Every plugin uses the same Git path shape:

```text
github:kedoupi/xiaotaozi-dsh#path:plugins/<slug>
```

### Slug · Install path
- **Slug**: `providers` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/providers`
- **Slug**: `memory` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/memory`
- **Slug**: `im` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/im`
- **Slug**: `hello` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/hello`
- **Slug**: `market` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/market`
- **Slug**: `agent-teams` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/agent-teams`
- **Slug**: `context` · **Install path**: `github:kedoupi/xiaotaozi-dsh#path:plugins/context`

Public discovery uses the GitHub topic [`dsh-plugin`](https://github.com/topics/dsh-plugin). After source changes: rebuild that package and restart a running `dsh`.

## Usage

Once a plugin is installed, use it from the corresponding page (Settings for models / memory / Xiaotaozi, the sidebar below New Session for IM, or chat for memory tools). There is no extra CLI after `dsh plugin add`.

### You want to… · Install · Then
- **You want to…**: Sign in to Codex / Claude / Grok / Qwen / Kimi, or store API keys · **Install**: `dsh-providers` · **Then**: Settings → **Models**
- **You want to…**: Keep notes the model can recall next session · **Install**: `dsh-memory` · **Then**: Chat (“remember that…”) or Settings → **Memory**
- **You want to…**: Talk to the local Harness from Feishu, WeChat, Slack, … · **Install**: `dsh-im` · **Then**: Sidebar below **New Session** → **IM bots**
- **You want to…**: Browse plugins and workflow packs · **Install**: `dsh-market` · **Then**: Sidebar below **New Session** → **Market**; browse/search/filter, then queue install or remove
- **You want to…**: Turn Xiaotaozi chrome features on or off · **Install**: `dsh-hello` · **Then**: Settings → **Xiaotaozi**
- **You want to…**: Use the right-hand files / Git / terminal panel · **Install**: `dsh-sidebar` · **Then**: Settings → **Side card**
- **You want to…**: Run a multi-agent team as 张老板 · **Install**: `dsh-agent-teams` · **Then**: Chat, or `/agent-teams <goal>`
- **You want to…**: Inspect what is in the model window · **Install**: `dsh-context` · **Then**: Session **Context** tab, or `/context`

## Screenshots

Welcome overlay when the Web app opens. OK dismisses it.

![Xiaotaozi DSH welcome dialog](plugins/hello/docs/welcome.png)

Settings → Models: connected vendors on the left, sign-in or API key on the right.

![Settings → Models](plugins/providers/docs/models.jpg)

Vendors that are not connected yet live behind **Add provider**.

![Add provider](plugins/providers/docs/add-provider.jpg)

Sidebar below New Session → IM bots: scan a QR, paste an App Manifest, or enter bot credentials.

![Sidebar → IM bots](plugins/im/docs/imbot.png)

## Layout

```text
plugins/<slug>/     installable plugin, package name dsh-<slug>
apps/desktop/       小桃子DSH Tauri client (not a pnpm workspace member)
apps/cli/           xtz CLI (standalone publishable pnpm workspace)
externals/          git submodules of upstream plugins (not in the pnpm workspace)
templates/          host / mixed skeletons for `pnpm new`
scripts/            new / link-plugin / sandbox / manifest / path-install / doctor
docs/               conventions + workflow
apps/website/       standalone VitePress official site workspace
.dsh-home/          gitignored sandbox Harness home (port 3081)
```

The workspace root must not declare `dsh.bundle` or `dsh.profile`.
Pinned dsh RC, Node, Python, pnpm, desktop app, and CLI versions have one machine-readable source: [`versions.json`](versions.json). Keep normal package metadata literal; `pnpm check` rejects drift instead of trying to make `package.json` evaluate JSON.

###  · Official / Desktop user · Sandbox
- Home · **Official / Desktop user**: `~/.dsh` · **Sandbox**: `<repo>/.dsh-home` (gitignored)
- Command · **Official / Desktop user**: 小桃子DSH.app or official `dsh web`; `xtz` is read-only in the first release · **Sandbox**: `pnpm dev`
- Port · **Official / Desktop user**: **3080** · **Sandbox**: **3081**
- Plugins · **Official / Desktop user**: packed tarballs on first launch · **Sandbox**: `link:` into this workspace

### Job · Home
- **Job**: Change plugin source, settings UI, `link-plugin`, debug `pnpm tauri dev` · **Home**: Sandbox **3081**
- **Job**: Pack apply, notarization, installed 小桃子DSH.app · **Home**: Official `~/.dsh` **3080**
- **Job**: Shipped `.dmg` · **Home**: Official `~/.dsh` **3080**

`pnpm tauri dev` is debug-only (sandbox **3081**). Release never probes 3081. Do not verify `link:` checkouts inside the installed 小桃子DSH.app. `link-plugin` and `pnpm dev` set `DSH_HOME` to `.dsh-home`. Never link workspace plugins into `~/.dsh`. `pnpm check-home` (`node scripts/doctor.mjs`) only diagnoses and lists unsafe links; it never edits a profile or fixes anything automatically.

## Develop

Conventions: [docs/conventions.md](docs/conventions.md). Steps: [docs/workflow.md](docs/workflow.md). Hard rules: [AGENTS.md](AGENTS.md). With an agent, use `/dsh-plugin`.

Requires Node.js `>= 22.19` and the global CLI `@deepseek-ai/dsh@0.1.1-rc.2` (`@next`). First clone:

```bash
git clone --recurse-submodules https://github.com/kedoupi/xiaotaozi-dsh.git
cd xiaotaozi-dsh
pnpm install
```

Install dependencies before any build or check after cloning.

### Gate · What it guarantees
- **Gate**: `pnpm check` · **What it guarantees**: Version/docs/manifest policy, type checks, plugin tests, and script tests; it does not prove generated `lib/` exists
- **Gate**: `pnpm check:build` · **What it guarantees**: Builds every plugin, then requires and inspects generated `lib/` for Git path-install safety
- **Gate**: `pnpm check:path` · **What it guarantees**: Installs each plugin from its isolated Git `#path:` shape and verifies its self-contained build
- **Gate**: `pnpm check:desktop` · **What it guarantees**: Desktop script tests, frontend build, Rust format/lint/tests/check; it does not publish or create a release installer
- **Gate**: `pnpm check:cli` · **What it guarantees**: Independently installs, typechecks, builds, and tests `apps/cli`; it does not start the official service

```bash
pnpm new greet                 # or: pnpm new sidebar --kind mixed
# replace the greet sample, then:
pnpm --filter dsh-greet test
pnpm --filter dsh-greet build
node scripts/link-plugin.mjs --profile dsh-dev greet
pnpm check-home   # daily ~/.dsh must stay unlinked
```

For Web UI, link into the sandbox `web` profile and run `pnpm dev` (port 3081). Do not `dsh web` against `~/.dsh` while iterating a plugin. `pnpm tauri dev` uses the same sandbox :3081.

```bash
node scripts/link-plugin.mjs --profile web <slug>
pnpm dev   # stop only a verified repo-owned :3081, then watch plugins (use -- --once to build once)
```

## Documentation

### Doc · Read it when
- **Doc**: [Conventions](docs/conventions.md) · **Read it when**: Package identity, two homes, what each check enforces
- **Doc**: [Workflow](docs/workflow.md) · **Read it when**: Create, install, simplify, commit
- **Doc**: [AGENTS.md](AGENTS.md) · **Read it when**: Hard rules for agents in this repo
- **Doc**: [dsh-providers](plugins/providers/README.md) · **Read it when**: Models settings page
- **Doc**: [dsh-memory](plugins/memory/README.md) · **Read it when**: Memory tools and settings
- **Doc**: [dsh-im](plugins/im/README.md) · **Read it when**: IM bots
- **Doc**: [dsh-market](plugins/market/README.md) · **Read it when**: Market catalog and queued install intents
- **Doc**: [dsh-hello](plugins/hello/README.md) · **Read it when**: Xiaotaozi chrome
- **Doc**: [dsh-sidebar](plugins/sidebar/README.md) · **Read it when**: Right-hand files / Git / terminal
- **Doc**: [dsh-agent-teams](plugins/agent-teams/README.md) · **Read it when**: Named captain and members
- **Doc**: [dsh-context](plugins/context/README.md) · **Read it when**: Context tab and `/context`
- **Doc**: [externals/dsh-agent-teams](externals/dsh-agent-teams) · **Read it when**: Upstream pin (do not install)
- **Doc**: [externals/dsh-context](externals/dsh-context) · **Read it when**: Upstream pin (do not install)