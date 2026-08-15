![HelloAGENTS](./readme_images/01-hero-banner.svg)

# HelloAGENTS

**A workflow layer for AI coding CLIs: skills, project knowledge, delivery checks, safer config writes, and resumable execution.**

> [!IMPORTANT]
> Looking for `v2.x`? The old Python line now lives in [helloagents-archive](https://github.com/hellowind777/helloagents-archive). The `v3` line is a full rewrite based on Node.js, Markdown rules, skills, and small runtime scripts.

> 🏅 This project is linked & recognized by the [LINUX DO](https://linux.do) community.

## What HelloAGENTS Does

AI coding CLIs can move fast, but they can also stop at advice, skip checks, lose project context, shift responsibility when tasks get hard, or report completion before the work is really done.

HelloAGENTS adds a workflow layer on top of Claude Code, Gemini CLI, Grok Build, Cursor, and Codex CLI. It anchors the agent as a capable executor, blocks responsibility-shifting patterns, helps the agent choose the right path, use task-specific quality skills, keep a project knowledge base, and verify work before delivery.

<table>
<tr>
<td width="50%" valign="top" align="center">

**Without HelloAGENTS**

![Without HelloAGENTS](./readme_images/08-demo-snake-without-helloagents.png)

</td>
<td width="50%" valign="top" align="center">

**With HelloAGENTS**

![With HelloAGENTS](./readme_images/07-demo-snake-with-helloagents.png)

</td>
</tr>
</table>

| Problem | Without HelloAGENTS | With HelloAGENTS |
|---------|---------------------|------------------|
| Stops too early | Ends with suggestions | Continues into build, verify, and closeout |
| Shifts responsibility | Refuses hard tasks, suggests other tools | Exhausts alternative paths, stays on task |
| Quality is inconsistent | Depends on each prompt | 14 quality skills activate by task type |
| Context is scattered | Plans live in chat history | Project knowledge and plan files stay on disk |
| Completion is vague | Natural language says “done” | Delivery checks use state, evidence, and verification |
| Config writes are risky | CLI files can drift | Install, update, cleanup, and doctor flows check managed files |

## Core Features

### 1) 14 built-in workflow skills

HelloAGENTS ships 14 built-in skills. They are loaded only when the current stage needs them, so simple tasks stay light while complex work gets stricter checks.

| Skill | Focus |
|-------|-------|
| `hello-ui` | UI planning, design contracts, implementation mapping, visual validation |
| `hello-api` | API design, validation, error format, compatibility |
| `hello-security` | auth, secrets, permissions, injection risks |
| `hello-test` | TDD, coverage, edge cases, test structure |
| `qa-review` | unified quality review, verification commands, blocking fixes, delivery evidence, closeout |
| `helloagents` | command routing, workflow stage rules, project knowledge, and state coordination |
| `hello-errors` | error handling, logs, retry and recovery behavior |
| `hello-perf` | performance, caching, query and rendering risks |
| `hello-data` | database, migrations, transactions, indexes |
| `hello-arch` | architecture, boundaries, code size, maintainability |
| `hello-debug` | bug diagnosis and escalation when stuck |
| `hello-subagent` | subagent delegation and result integration |
| `hello-write` | documentation, reports, and written deliverables |
| `hello-reflect` | reusable lessons and knowledge updates |

All UI work first follows the shared UI quality baseline.
In host global mode, in initialized projects, or in explicit UI workflows, `hello-ui` adds deeper design-contract execution, design-system mapping, and visual validation on top of that baseline.
When visual evidence is required, HelloAGENTS records it in the current session `artifacts/visual.json`.

### 2) Commands for different work styles

Commands run inside the AI CLI chat with a `~` prefix. The command skill is read directly; unrelated skills are not loaded unless the workflow needs them.

| Command | Purpose |
|---------|---------|
| `~ask` | Interactive clarification: Q&A to pin down goals, direction, scope, and constraints; does not write files |
| `~auto` | Chooses the main path and keeps going until delivery or a real blocker |
| `~plan` | Requirements, solution design, task breakdown, and plan package |
| `~build` | Implementation from the current request or an existing plan |
| `~prd` | Modern product requirements document through guided dimension-by-dimension exploration |
| `~loop` | Long-running entry; in Codex it prefers `/goal -> ~auto -> ~qa` |
| `~init` | Initialize the project workflow and sync project knowledge |
| `~test` | Write tests for a target module or recent change |
| `~qa` | Run the unified quality loop: review, verification commands, fixes, and closeout |
| `~commit` | Generate a conventional commit message and sync knowledge |
| `~clean` | Archive finished plans and clean temporary runtime files |
| `~help` | Show commands and current settings |

Compatibility aliases:

- `~do` → `~build`
- `~design` → `~plan`
- `~review` → `~qa`
- `~idea` → `~ask` (deprecated)

Use `~ask` for clarifying requirements, comparing approaches, weighing value, and scoping — pure conversation, no files created.

### 3) Project knowledge base

HelloAGENTS can create and maintain a project knowledge base under `.helloagents/`.

The knowledge base helps future turns understand the repo without re-discovering the same facts. It can store:

| File or directory | Purpose |
|-------------------|---------|
| `context.md` | project overview, stack, architecture, module index |
| `guidelines.md` | non-obvious coding conventions inferred from the repo |
| `verify.yaml` | verification commands such as lint, test, build |
| `CHANGELOG.md` | project-level change history |
| `DESIGN.md` | stable UI design contract when the project has UI work |
| `modules/*.md` | module-specific notes and lessons |
| `plans/<feature>/` | active plan packages |
| `archive/` | archived plan packages |

`~init` initializes the project workflow: it writes the project-level full carrier marker, prepares project state, and creates or updates the knowledge base.

### 4) Structured plan packages

Complex work can be stored as plan packages instead of a single paragraph in chat.

For `~plan`, HelloAGENTS uses:

- `requirements.md`
- `plan.md`
- `tasks.md`
- `contract.json`

For `~prd`, HelloAGENTS also creates PRD files such as:

- `prd/00-overview.md`
- `prd/01-user-stories.md`
- `prd/02-functional.md`
- `prd/03-ui-design.md`
- `prd/04-technical.md`
- `prd/05-nonfunctional.md`
- `prd/06-i18n-l10n.md`
- `prd/07-accessibility.md`
- `prd/08-content.md`
- `prd/09-testing.md`
- `prd/10-deployment.md`
- `prd/11-legal-privacy.md`
- `prd/12-timeline.md`

`contract.json` is used by the workflow to decide `qaMode`, `qaFocus`, optional advisor checks, and optional visual validation.

`tasks.md` also includes a Codex `/goal` entry. For long-running Codex work, use that prepared entry instead of giving `/goal` a raw product document. The default chain is `/goal -> ~auto -> ~qa`: Codex keeps the long-running continuation, `~auto` executes the AFK work, and `~qa` remains the final quality gate before closeout.

### 5) State and recovery

Long tasks need a small recovery snapshot, but one shared state file is not safe enough for concurrent work.

HelloAGENTS now resolves the current state file from `state_path`:

- with a stable or reusable session id: `.helloagents/sessions/<workspace>/<session>/STATE.md`
- before a reusable session id is available: `.helloagents/sessions/<workspace>/default/STATE.md`

`<workspace>` is the current Git branch, `detached-<sha>` for a detached HEAD, or `workspace` for non-Git projects. `<session>` is the current project-local session token. `.helloagents/sessions/active.json` only keeps the latest active workspace/session mapping plus alias bridges, so the same CLI session stays in one directory and `/resume` can reuse it.

For project-local sessions, HelloAGENTS first uses stable host identifiers such as `sessionId`, `conversationId`, `threadId`, or `HELLOAGENTS_NOTIFY_SESSION_ID`. If the host only exposes a window or terminal id such as `WT_SESSION`, `TERM_SESSION_ID`, or `WINDOWID`, HelloAGENTS uses it only as a lightweight alias bridge and reuses the mapped session first instead of fanning out duplicate directories. If a session starts before a stable host identifier is available, HelloAGENTS can begin in `default` and keep reusing that same active directory after the same CLI session later exposes a stable identifier, instead of splitting into a second session directory.

`STATE.md` records where the current workflow stopped. It is not a universal memory file for every conversation. Codex `/goal` does not replace `state_path`, `turn-state`, or local evidence files; it only handles long-running continuation on the Codex side.

### 6) Verification and delivery evidence

HelloAGENTS does not treat “tests passed” and “task complete” as the same thing. Delivery can also require plan coverage, task checklist status, review evidence, advisor evidence, and visual evidence.

Runtime state now stays intentionally small:

- `.helloagents/sessions/<workspace>/<session>/STATE.md`
- `.helloagents/sessions/<workspace>/<session>/runtime.json`
- `.helloagents/sessions/active.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/qa-review.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/advisor.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/visual.json`
- `.helloagents/sessions/<workspace>/<session>/artifacts/closeout.json`
- optional `.helloagents/sessions/<workspace>/<session>/events.jsonl`
- `~/.codex/.helloagents/notify-state.json` for Codex-native closeout de-duplication only

`STATE.md` only keeps the human-readable recovery snapshot. `runtime.json` is machine-only and keeps the minimal runtime state. `artifacts/*.json` stays limited to structured receipts. `events.jsonl` remains opt-in trace output and stays off by default.
Project-local `STATE.md` is now materialized more lazily.

Standard runtime evidence and transient runtime state now expire after 72 hours. Long-running Codex goal flows still keep their 720-hour upper bound where the workflow explicitly needs it.

Delivery gate, guard, and QA gate messages use action-oriented wording such as processing path, closeout action, and visual validation action, so blocked flows show what to do next without turning executable steps into optional suggestions. Final closeout also enforces a single HelloAGENTS wrapper, so one reply does not emit duplicate closeout headers.
That wrapper is now reserved for direct final-user delivery only. Intermediate reports, delegated task results, and sub-agent replies stay natural, and sub-agent stop hooks reject wrapped closeout replies.

### 7) Safer install, update, cleanup, and diagnostics

The CLI manages host files explicitly:

- `install` writes only the selected target unless `--all` is used
- `update` refreshes the selected target or all targets
- `cleanup` removes managed injections and links
- `uninstall` performs scoped cleanup before package removal
- `doctor` reports drift in carriers, links, hooks, config entries, plugin roots, cache copies, versions, and real Claude/Gemini global install artifacts; for Codex, it also surfaces native `codex doctor` output when available
- Codex managed `notify = ["helloagents-js", "codex-notify"]` stays portable, and `doctor`, `cleanup`, and `uninstall` also recognize wrapped `--previous-notify` chains used by Codex App / Computer Use
- per-host mode tracking is written only after host setup succeeds, and failed native global cleanup keeps the host tracked as `global` instead of silently layering standby on top
- direct `switch-branch` clears stale `HELLOAGENTS*` lifecycle env before its internal npm install/sync steps, and package `preuninstall` falls back to `--all` when no explicit host args are provided, so stale shell env does not shrink branch-switch or uninstall cleanup scope
- Windows `.cmd` / `.bat` lifecycle calls now run through an explicit command wrapper, so host installs, branch switching, and doctor flows do not emit Node `DEP0190` shell deprecation warnings
- Claude Code, Gemini CLI, Grok Build, Cursor, and Codex CLI config writes, updates, cleanup, uninstall, mode switching, and branch switching are covered as one tested lifecycle chain instead of separate best-effort paths

## Quick Start

### 1) Install the package

```bash
npm install -g --allow-scripts=helloagents helloagents
```

If another executable named `helloagents` already exists in your `PATH`, use the stable managed-entry alias:

```bash
helloagents-js
```

By default, `postinstall` installs the package command, initializes `~/.helloagents/helloagents.json`, and syncs runtime files to `~/.helloagents/helloagents`. No host CLI is deployed unless you set `HELLOAGENTS=target[:mode]`, such as `HELLOAGENTS=codex:global`.

For npm 11 and later, keep `--allow-scripts=helloagents` on direct package install or upgrade commands so npm can run the managed `postinstall` without approval warnings. If you are still on npm 10 or earlier, you can omit that flag.

### 2) Deploy to a CLI

Use standby mode for selected projects and explicit activation:

```bash
helloagents install codex --standby
helloagents install --all --standby
```

Use global mode when you want full rules everywhere:

```bash
helloagents --global
helloagents install --all --global
```

After reinstalling, refreshing, or switching modes, restart the target AI CLI or open a new session; already running sessions do not reload injected rules automatically.

### 3) Verify inside your AI CLI

Type:

```text
~help
```

You should see the available chat commands and the current settings.

### 4) Create project knowledge

Initialize the project workflow:

```text
~init
```

## CLI Management

### Shell commands

```bash
helloagents --standby
helloagents --global
helloagents install codex --standby
helloagents install --all --global
helloagents update codex
helloagents cleanup claude --global
helloagents uninstall gemini
helloagents switch-branch beta
helloagents switch-branch beta claude --global
helloagents doctor
helloagents doctor codex --json
helloagents codex goals status
helloagents codex goals enable
```

Supported targets:

- `claude`
- `gemini`
- `grok`
- `cursor`
- `codex`
- `--all`

If you omit `--standby` or `--global`, HelloAGENTS first reuses the tracked/detected mode for that CLI, then falls back to `standby`.

### npm and one-shot script entries

Use these when you do not want to depend on the `helloagents` binary being available during package updates. In `HELLOAGENTS=target[:mode]`, target can be `all`, `claude`, `gemini`, `grok`, `cursor`, or `codex`; mode can be `standby` or `global`. For install, an omitted mode is treated as `standby`. For update, cleanup, uninstall, and branch switching, an omitted mode is forwarded unchanged so HelloAGENTS can reuse the tracked or detected mode for that CLI first. If you do not provide `HELLOAGENTS`, the one-shot install scripts now behave like plain package install: they install or update the package only and do not auto-deploy any host CLI. For a custom tarball or package spec, set `HELLOAGENTS_PACKAGE` instead of `HELLOAGENTS_BRANCH`. For a guaranteed refresh of an already installed package, prefer `npm explore -g helloagents -- npm run sync-hosts -- ...` after the package command. The one-shot shell and PowerShell wrappers auto-detect npm 11+ and append `--allow-scripts=helloagents` only where that flag is supported.

Host configs use the stable `helloagents-js` entrypoint and runtime root `~/.helloagents/helloagents`, so Node global package paths can change without breaking managed hooks or Codex `notify`. Codex hooks use standalone `~/.codex/hooks.json` instead of adding large hook blocks to `config.toml`, and Codex global plugin roots plus plugin cache now link back to that same stable runtime root. Claude Code global installs use a dedicated local marketplace projection under `~/.helloagents/host-projections/claude-marketplace`, Gemini global extension packaging uses `~/.helloagents/host-projections/gemini`, Grok Build global installs use the materialized marketplace projection `~/.helloagents/host-projections/helloagents-grok-marketplace`, and Cursor global installs use the curated local-plugin projection `~/.helloagents/host-projections/cursor-local-plugin/helloagents` plus a real copied install directory at `~/.cursor/plugins/local/helloagents`, so host-specific packaging stays isolated from the shared runtime root without relying on symlink-only plugin loading.

#### npm commands

macOS / Linux:

```bash
# Install to Codex in standby mode
HELLOAGENTS=codex npm install -g --allow-scripts=helloagents helloagents

# Install to Codex in global mode
HELLOAGENTS=codex:global npm install -g --allow-scripts=helloagents helloagents

# Update the package, then refresh Claude in standby mode
npm install -g --allow-scripts=helloagents helloagents@latest
npm explore -g helloagents -- npm run sync-hosts -- claude --standby

# Switch to the beta branch, then refresh all CLIs in standby mode
npm install -g --allow-scripts=helloagents https://github.com/hellowind777/helloagents/archive/refs/heads/beta.tar.gz
npm explore -g helloagents -- npm run sync-hosts -- --all --standby

# Clean Gemini integration before package uninstall
npm explore -g helloagents -- npm run uninstall -- gemini --standby
npm uninstall -g helloagents
```

Windows PowerShell:

```powershell
# Install to Codex in standby mode
$env:HELLOAGENTS="codex"; npm install -g --allow-scripts=helloagents helloagents

# Install to Codex in global mode
$env:HELLOAGENTS="codex:global"; npm install -g --allow-scripts=helloagents helloagents

# Update the package, then refresh Claude in standby mode
npm install -g --allow-scripts=helloagents helloagents@late