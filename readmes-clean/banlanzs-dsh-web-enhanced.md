# dsh-web-enhanced

> A Web-enhanced plugin for DeepSeek Harness: task board with cron scheduling, git graph, preview/files/SCM right panel, DeepSeek API balance line, and image understanding for text-only models.
>
> 🔌 Ecosystem: the repo carries the `#dsh` · `#dsh-plugin` topics — welcome to be listed by @dsh-plugin.

Developed and built independently of the deepseek-harness repo — the plugin only consumes the officially published `@deepseek-ai/*` packages and the existing Web client slots. No harness source is modified.

## Features

### Feature · Description
- **Feature**: **Task board** · **Description**: A **Task Board** tab inside the **Workspace** view with five columns (Planned / To do / Running / Done / Failed). 「Run」opens a real DSH agent session that executes the task prompt — composed from the deployment's agent preset (so it has bash / read_file / write_file) and attached to the task's project — and the status and result write back automatically when it finishes. 「View session」jumps to the execution session. **Each card has an inline edit form** (title / prompt / cron / column — done or failed tasks reopen via planned/todo). **A card in the Done column starts collapsed to a single title line** (click to expand); Failed does not collapse, because that column's message is the thing you came to read. Supports 5-field cron scheduling (e.g. `0 23 * * *`): runs automatically at the due time, catches up after a host restart, and recovers interrupted runs.
- **Feature**: **Git graph** · **Description**: A **Git Graph** tab inside the **Workspace** view; branch lanes + commit history rendered as SVG (first-parent continuous lanes + horizontal merge links). The branch dropdown filters which commits the graph DRAWS (all branches, or one) and changes nothing in the repository; clicking a commit expands its full hash, parents, author and email, date, message body, and per-file added/removed line counts. **An「Uncommitted changes」row sits on HEAD**: a hollow dashed dot on HEAD's own lane, joined to it by a dashed stub, expanding to the staged / unstaged / untracked files with their added and removed line counts (an untracked file's count comes from reading it on the host; binary or over-cap files report `—`). The branch switcher beside the session title (header `titleCluster`) is the other operation — it checks a branch out, and asks first when the work tree is dirty, counting tracked and untracked entries apart.
- **Feature**: **Workspace view** · **Description**: A **Workspace** tab in the conversation's view ring, beside Chat and Trajectory, with four panes (**Explorer** / Changes / **Task Board** / **Git Graph**). The Explorer is VSCode-style: a file-tree sidebar on the left and the open file's preview on the right; the tree expands, searches by name, and opens files into that preview side; preview supports markdown (GFM tables, HTML tables, and inline HTML) / HTML (sandboxed iframe) / code / **diff** (line-highlighted unified diff) / CSV / images / PDF / text / **Office docx & xlsx** (host-side structural conversion) with source / **split** (editor + preview side by side) / view modes and save. The Changes pane is backed by real `git status` with stage / unstage / discard and per-file diffs. The active pane and the open directories persist per workspace.
- **Feature**: **File mentions** · **Description**: 「Mention file」and「Mention folder」in the composer's `+` menu: an indented project directory view (folders and files, locally filterable) whose folder rows **enter that folder** — they open the plugin's own file browser at it, which works like a file manager (breadcrumbs / parent / home / per-level listing / filter by name; a file click picks, a folder click enters). The first row opens the same browser at the project root, and it can also walk **outside the project**. Picking a file inserts its `@path` into the draft (paths with spaces are quoted).
- **Feature**: **Balance line** · **Description**: Shows the DeepSeek API balance (`GET /user/balance`) below the composer, with a refresh button, a muted error state, and **an estimated cost of the current session's billed tokens** (prices fetched from models.dev, USD per million tokens). **Only while the session's model route actually bills that account** — switching to another channel (or repointing `deepseek-official` at a private gateway) hides the balance part, because the number would then be about somebody else's account; the cost part appears only when models.dev has a price for the exact provider/model selection.
- **Feature**: **Image understanding** · **Description**: Transparent image support for text-only models, built in (supersedes `DSH-vision`). Sending an image to a text-only model passes the「model does not support images」gate and the `read_image` tool gate; the transcript keeps the image (the UI shows it exactly like on a multimodal route) while the model sees a `[图片内容描述]` text transcription; multimodal models are detected through the REAL pre-patch resolver and pass through untouched, so no token is spent describing images they can see. **Two user-selected model pools, in fallback order**: the DSH pool (multi-select the DSH models that declare image input; empty = auto-detect) → local Ollama (auto-detected) → the dedicated API pool (fetched from the endpoint's `/models`, multi-selected and saved; an optional preferred model goes first, otherwise pool order) → the static `visionFallbackModels` chain. Content-hash cache, classified errors, anonymous-endpoint timeout caps, and cooldowns apply to the endpoint path; only after every source fails does the model get the failure placeholder, and **each failed attempt is kept in memory and listed in the Vision tab's status card** (source, model, error, time). **The Vision tab in Settings → Web Enhanced is a full configuration form** whose saves apply immediately through a settings namespace — the static `vision*` keys in `cordis.patch.yml` remain as the base layer.
- **Feature**: **Settings page + plugin management** · **Description**: One more row in the Settings nav, "Web Enhanced" (registered into `settings.section`). Its **Plugins** tab lists what the current profile has installed — name, version, dependency spec, whether it is an active layer — and offers **Update** and **Remove**. What it lists is the profile `package.json`'s `dependencies`, because that is the set pnpm can act on; template layers (`@deepseek-ai/dsh-base` and friends) are shown apart with no buttons, since no dependency provides them. **Only the profile this host started with is visible** (`dsh --profile web` lists web's dependencies and nothing else); the profile name and path are printed under the title. **Every operation takes effect on the next start** (the layer stack is composed at boot) and the UI says so. Removing this plugin itself is not blocked — the confirmation just spells out what it costs.

## Screenshots

Captured from the real UI by `scripts/e2e.mjs --capture` (no model key needed):

### Task board · Git graph
- **Task board**: ![Task board](./assets/board.png) · **Git graph**: ![Git graph](./assets/graph.png)

### Floating panel · Balance line
- **Floating panel**: ![Floating panel](./assets/panel.png) · **Balance line**: ![Balance line](./assets/balance.png)

## Installation

The plugin is a bundle combo package (`dsh.bundle`) installed into a Web profile:

```sh
dsh plugin --profile web add git+https://github.com/banlanzs/dsh-web-enhanced.git   # recommended
# or:
# dsh plugin --profile web add ./dsh-web-enhanced-0.12.1.tgz
# dsh plugin --profile web add dsh-web-enhanced
```

`lib/` is committed, so there is no `prepare` step and installing from git needs no toolchain and no `allowBuilds` prompt.

> **Install it, do not `link:` it.** Every `@deepseek-ai/*` package is a **peer** dependency and must resolve to the single copy the profile provides. Node resolves a symlinked package from its REAL path, so a `link:`-installed plugin resolves those specifiers inside its own `node_modules` instead — a second `@deepseek-ai/dsh-typert-protocol` instance. The `@Remote` decorator records its markers in that module's private state, so the host gateway (holding the other instance) then sees no descriptors at all and every `/api/webEnhanced/*` answers **404** while the client half still loads and renders. Verify a suspicious install with:
>
> ```sh
> node -e "console.log(require.resolve('@deepseek-ai/dsh-typert-protocol',{paths:['']}))"
> node -e "console.log(require.resolve('@deepseek-ai/dsh-typert-protocol',{paths:['/lib']}))"
> ```
>
> The two paths must be identical.

Then start:

```sh
dsh --profile web
```

### One-click script

After cloning, just run it — it checks the prerequisites (dsh / pnpm / repo reachability), installs via the public git URL, and prompts you to restart:

```sh
git clone https://github.com/banlanzs/dsh-web-enhanced.git
cd dsh-web-enhanced
./scripts/install.sh
```

### Updating

**No uninstall-then-reinstall needed.** `dsh plugin` is a pnpm forwarder: it hands your arguments verbatim to `pnpm` in the profile directory, then reconciles the bundle layer list against the **installed state**. So an update is one command, then a restart:

```sh
dsh plugin --profile web update dsh-web-enhanced
dsh --profile web
```

The thing to know: **`install` will not pick up new commits, `update` will.** A ref-less spec like `github:banlanzs/dsh-web-enhanced` tracks the default branch, but pnpm pins whichever commit it resolved into the profile's lockfile:

```
dsh-web-enhanced: github:banlanzs/dsh-web-enhanced
  → codeload.github.com/banlanzs/dsh-web-enhanced/tar.gz/<commit>
```

`pnpm install` honours that lock and reinstalls the same commit; `update` re-resolves the branch head and rewrites it.

Reconciling by installed state rather than by dependency diff is deliberate: it is what lets `update` activate a package that only started declaring `dsh.bundle` in a newer version.

If an update ever fails to move (pnpm can hold on to a cached git resolution), the fallbacks in order are `--force`, and only then remove + add:

```sh
dsh plugin --profile web update --force dsh-web-enhanced
# last resort
dsh plugin --profile web remove dsh-web-enhanced
dsh plugin --profile web add git+https://github.com/banlanzs/dsh-web-enhanced.git
```

### Developer iteration

`link:` is NOT usable for this plugin (see the note above — it duplicates the
harness packages and silently disables every host capability). Iterate by
reinstalling from a packed tarball instead:

```sh
cd dsh-web-enhanced
pnpm install && pnpm run check && npm pack
dsh plugin --profile web remove dsh-web-enhanced
dsh plugin --profile web add ./dsh-web-enhanced-0.12.1.tgz
```

On Windows, tarball installs need real symlink permission (pnpm's
`importPackage` step). If it fails with `EPERM ... symlink`, either enable
Developer Mode or install from the git URL, which does not take that path.

## Configuration

Plugin-row `config` fields (all have defaults; the `vision*` ones can also be edited live in Settings → Web Enhanced → Vision, whose saves override these base values):

### key · default · meaning
- **key**: `cronIntervalMs` · **default**: 30000 · **meaning**: Scheduler tick interval
- **key**: `balanceApiKeyEnv` · **default**: `DEEPSEEK_API_KEY` · **meaning**: Env var for the balance query API key
- **key**: `balanceCacheTtlMs` · **default**: 60000 · **meaning**: Balance view cache duration
- **key**: `balanceBaseUrl` · **default**: `https://api.deepseek.com` · **meaning**: Balance endpoint base URL
- **key**: `balanceProviders` · **default**: `[deepseek-official]` · **meaning**: Model routes the balance line is shown for; a route with its own configured `baseURL` must also share the endpoint's host
- **key**: `modelsDevUrl` · **default**: `https://models.dev/api.json` · **meaning**: Pricing blob fetched for the session-cost readout
- **key**: `modelsDevCacheTtlMs` · **default**: 21600000 · **meaning**: How long one fetched pricing index stays fresh (6 h)
- **key**: `modelsDevTimeoutMs` · **default**: 10000 · **meaning**: Pricing fetch timeout
- **key**: `pricingProviderMap` · **default**: `{deepseek-official: deepseek}` · **meaning**: Model-route provider id → models.dev provider id
- **key**: `skipDirs` · **default**: `[node_modules]` · **meaning**: Directories skipped by the file tree/search and by the mention pickers (`.git` is always skipped; the browse overlay does not apply the filter)
- **key**: `readMaxBytes` · **default**: 1 MiB · **meaning**: Text read cap (truncated with a marker beyond it)
- **key**: `writeMaxBytes` · **default**: 2 MiB · **meaning**: File write cap
- **key**: `binaryMaxBytes` · **default**: 5 MiB · **meaning**: Binary preview (base64) cap
- **key**: `gitOutputMaxBytes` · **default**: 256 KiB · **meaning**: Single git stream output cap
- **key**: `gitMaxCount` · **default**: 100 · **meaning**: `git log` row cap
- **key**: `gitWorkingMaxFiles` · **default**: 300 · **meaning**: Cap on the uncommitted file list, and with it how many untracked files are read to count their lines
- **key**: `searchMaxDepth` / `searchMaxEntries` · **default**: 8 / 200 · **meaning**: File search depth and entry caps
- **key**: `officeMaxBytes` · **default**: 5 MiB · **meaning**: Office preview (docx/xlsx) file size cap
- **key**: `browseMaxEntries` · **default**: 500 · **meaning**: Entry cap of one directory level in the mention browser
- **key**: `pluginOpTimeoutMs` · **default**: 300000 · **meaning**: Deadline for one pnpm operation (update/remove)
- **key**: `profileDir` · **default**: empty · **meaning**: Profile directory; empty walks up from this module. Only for a deployment whose profile is not an ancestor of the loaded plugin
- **key**: `visionEnabled` · **default**: true · **meaning**: Master switch of the image-understanding integration
- **key**: `visionPatchAdmission` · **default**: true · **meaning**: Wrap `llm.resolveModelInfo` so text-only models admit images past the send preflight and the `read_image` gate (reversible, unload-order safe)
- **key**: `visionProvider` / `visionModel` · **default**: empty · **meaning**: Pin the DSH-configured provider/model used for transcription; empty = auto-detect the first image-capable models from all configured providers
- **key**: `visionHarnessModels` · **default**: `[]` · **meaning**: User-selected DSH model pool `[{provider, model}, …]`, tried in order before the dedicated API; non-empty replaces auto-detection (the pinned pair still goes first)
- **key**: `visionPrompt` / `visionMarker` · **default**: Chinese thorough-description prompt / `[图片内容描述]` · **meaning**: Transcription prompt and the marker the model sees instead of the image block
- **key**: `visionBaseUrl` / `visionApiKey` / `visionEndpointModel` · **default**: empty · **meaning**: OpenAI-compatible VLM endpoint (e.g. DashScope compatible mode); key falls back to `visionApiKeyEnv` → `VISION_API_KEY` → `DASHSCOPE_API_KEY`. Empty base URL or model disables this source
- **key**: `visionEndpointModels` · **default**: `[]` · **meaning**: Dedicated-endpoint model pool; the Settings tab fills it by fetching `/models` and multi-selecting. Transcription tries `visionEndpointModel` first (when set), then every pool model in order
- **key**: `visionApiKeyEnv` / `visionAnonymous` · **default**: `VISION_API_KEY` / false · **meaning**: Env var for the endpoint key; `true` skips the Authorization header (free/local endpoints get a hard 20 s timeout cap)
- **key**: `visionTimeoutMs` / `visionMaxTokens` · **default**: 120000 / 4096 · **meaning**: VLM request timeout and output cap
- **key**: `visionAutoLocalOllama` · **default**: true · **meaning**: Probe `visionLocalOllamaUrl` at startup; when an Ollama is running, its first vision-capable model is prepended to the transcription chain (images stay on this machine)
- **key**: `visionLocalOllamaModel` / `visionLocalOllamaUrl` · **default**: empty / `http://localhost:11434/v1` · **meaning**: Preferred Ollama model (empty picks the first `*vl*`/`*vision*` model) and its OpenAI-compatible base URL
- **key**: `visionFallbackModels` · **default**: `[]` · **meaning**: Ordered fallback chain `{model, baseURL?, apiKey?, anonymous?, timeoutMs?}`; each entry may point at a different provider, keyless non-anonymous entries are skipped
- **key**: `visionCacheLimit` / `visionCooldownMs` · **default**: 200 / 60000 · **meaning**: In-process transcription cache entries (SHA-256 of image bytes) and how long an endpoint that just failed (429/timeout) is skipped

## Architecture

- **Zero harness changes**: the client UI only registers into existing slots.
  - `conversation.view` — the Workspace tab, one entry in the view ring beside Chat and Trajectory. The ring renders one view at a time at full column width, so this surface owns no geometry: no docking, no drag-to-resize, no collapse. Those belong to the frame. Its internal tablist carries Explorer / Changes / **Task Board** / **Git Graph**.
  - `shell.overlay` — the mention file browser (the frame-wide floating layer).
  - `conversation.session.header.actions` — the branch switcher beside the session title (`titleCluster`).
  - `conversation.composer.dock` — the balance + session-cost line (below the composer).

  Nothing registers into the layout's `details` slot: that is a `single` slot already occupied by ui-conversation's `DetailsPanel`, so registering there would replace the tool-details column and remove the `conversation.details.tool` seat it declares. Beside the slots, two client commands are registered through `ctx.commandUi.register` — the file and folder mention pickers in the composer's `+` menu.
- **Optional services are read uninjected**: `agentPresets`, `llm`, `settings`, `credentials`, `modelDirectories`, `commandUi`, and `conversation` all come from `ctx.get()`. A deployment composed without one degrades exactly that surface instead of leaving this plugin's entry waiting on a service it may