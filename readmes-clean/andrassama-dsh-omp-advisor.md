![Ward Council — A DeepSeek Harness Plugin](./assets/banner.png)

# Ward Council

> **Advisors guide. The ward protects. The model executes.**
>
> *Package name: `dsh-omp-advisor` — the name under which it installs and stores settings.*

## What is this?

Your coding agent is good, but on a long session it can tunnel-vision: miss a security hole, claim *"done"* before the tests actually pass, or plow ahead after a wrong turn. **Ward Council** gives it a second set of eyes — one or more independent *advisor* models that watch the session in real time and speak up when something matters.

Each advisor reads the transcript as it grows, may investigate your workspace with read-only tools (`read` / `grep` / `glob`), and hands over concrete advice through a dedicated `advise` tool. Advice arrives as a clearly-labeled note the primary agent *weighs* — never a command it must obey:

```
<advisory advisor="The Red Teamer" severity="concern" guidance="weigh, don't blindly obey">
  The SQL in search.py interpolates the user query directly — parameterize it before this ships.
</advisory>
```

You pick each advisor's model from DSH's model list, scope it to specific workspaces, and give it a persona (25 presets included) plus curated domain skills (250 packaged). It is the advisor-watchdog design from [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi), rebuilt natively on [DeepSeek Harness](https://github.com/deepseek-ai/dsh) (DSH) plugin seams.

```
primary agent ──► session log ──► delta renderer ──► advisor model (your pick from the DSH model list)
      ▲                                                     │ read/grep/glob (read-only)
      │                                                     ▼
      └──── agent.inject / agent.steer ◄── advise tool ── dedupe + quarantine
```

## At a glance

- **Real-time review** — advisors review each new slice of the transcript (per turn, or per step) and never re-read history twice.
- **Advice, not orders** — notes carry a severity (`nit` / `concern` / `blocker`) and the guidance *"weigh, don't blindly obey"*; the primary agent decides what to do.
- **Persistent memory** — advisors recall relevant lessons into each review and write durable lessons back, through pluggable engines (plaintext MD, OpenViking, Hindsight, MisakaNet, mem0, or any MCP server).
- **Git restore points** — side-effect-free workspace snapshots at turn boundaries let an advisor recommend a precise, worktree-only rewind.
- **Completion gate** — before the agent claims *"done"*, an advisor verifies the original ask is actually implemented and demands an honest report otherwise.
- **Resilience** — auto-retry for failed reviews and turns, quota cooldowns, output quarantine; an advisor never blocks your agent.
- **25 personas, 250 skills** — one-click presets from security auditor to web-novel architect, each with curated domain skills.
- **Multi-tab settings + live monitor** — General / Advisors / Workspaces / Memory / Monitor, plus an optional workspace-scoped sidebar tab.

## How it works

### The review loop

- **Incremental reviews.** Advisors never see the whole history twice: a cursor over the durable session log renders each new slice (`user/message`, `assistant/message`, `tool/call`, `tool/result`) into a compact markdown *update* the advisor model reviews.
- **Tiny-delta skip (optional).** With **Skip tiny deltas** set, transcript updates smaller than the threshold are skipped without calling the advisor model — a cheap way to cut advisor traffic on chatty sessions (skipped deltas are not replayed later).

### Advice & delivery

- **Advice, not orders.** Notes arrive as
  `<advisory advisor="…" severity="…" guidance="weigh, don't blindly obey">…</advisory>`
  messages. The primary agent decides what to do with them.
- **Severities.** `nit` (default) · `concern` · `blocker`. Escalation-rank dedupe: the same note only re-delivers at a strictly higher severity.
- **Delivery channels (DSH-native).**

### Severity · Primary running · Primary idle
- **Severity**: non-interrupting (default: `nit`) · **Primary running**: `agent.inject` — rides the next step boundary, never wakes · **Primary idle**: `agent.inject`
- **Severity**: interrupting (default: `concern`, `blocker`) · **Primary running**: `agent.steer` — nearest step boundary · **Primary idle**: `concern` downgrades to `inject`; `blocker` still steers (may wake a turn)

- **Mid-turn deferral.** With `reviewTrigger: step`, non-blocker notes raised while the turn is still running are withheld and flushed deterministically when the turn completes, so partial work is not interrupted and no advice is lost.
- **Coalescing (optional).** With several advisors attached, notes can land in rapid succession. Set **Coalesce advice** to a window in ms (e.g. `1500`) and the runtime buffers notes from *all* advisors for that window, then emits them as **one multi-`<advisory>` message per delivery channel** instead of one message per note. Semantics:
  - `0` (default) — every note is delivered individually, exactly as above.
  - Window active — the timer starts on the first buffered note; when it fires, the batch is grouped by channel at emit time (steer vs inject is re-resolved against the primary's *current* state) and sent as one message per non-empty channel.
  - Interrupting severity — a `concern`/`blocker` (per your interrupting set) **flushes the whole batch immediately**, so urgent advice never waits out the window.
  - Session dispose cancels the timer and drops buffered notes: a disposed session never receives advice.

### Resilience

- **Auto-retry (optional, on by default).** Failures recover automatically instead of dying silently:
  - A failed advisor review (rate limit, transient provider error) re-runs the *same* delta after the configured delay, up to the configured attempt cap.
  - A failed **primary-model turn** (`turn/end` with `reason.kind: "error"`) receives an automatic *"continue from where you left off"* followup message after the same delay, bounded per failure episode and reset by any completed turn.
  - Attempt cap: `1–999`, or **`0` = unlimited** (the message labels the cap `∞`). User aborts and permanent errors (unknown model/provider) never retry — even with an unlimited cap. Toggle the whole feature off with **Auto-retry failures**.
- **Containment (ported).** Output quarantine (unavailable-tool requests, output-only destructive directives), 3-consecutive-failure backlog drop, permanent-error halt until settings change, quota/rate-limit cooldown pause. The advisor **never blocks the primary agent** — a deliberate, safer deviation from oh-my-pi's catch-up wait.
- **Context-overflow recovery (v0.7.3).** If an advisor's accumulated history outgrows the model's context window, the runtime resets that advisor's conversation (shrinking it back to system prompt + current delta) and retries once — instead of re-sending the same bloated context on an unlimited retry loop. A second overflow (a single delta too big on its own) halts the advisor rather than spinning forever. The Monitor then shows the halt reason plus a **Resume** button (v0.7.4): swap the advisor to a larger-context model in the Advisors tab and click Resume to bring it straight back — no restart needed.

### Intervention

- **Blocker intervention (optional, off by default).** DSH exposes no synchronous pre-tool-call veto to plugins, so this is the strongest interruption the platform allows: when an advisor raises a `blocker` while the primary agent is **running**, the plugin calls `agent.cancel` on the running step — tool calls not yet dispatched abort, already-running calls commit — then wakes the agent with the advisory as a followup so it sees the reason and can react. With review trigger `step`, this lands between steps, i.e. before the model can issue the *next* destructive call; a fast tool inside the current step may finish first. Opt in with **Blocker intervention**; without it, advice stays advice.

### Git restore points

- **Git restore points (optional, off by default).** The plugin snapshots the workspace into **side-effect-free git objects** — a throwaway index captures tracked changes *and* untracked files (honoring `.gitignore`), stored as commit objects under the hidden namespace `refs/dsh-omp-advisor/**`. Your index, HEAD, branch, and worktree are never touched, and no reset/clean/stash command is ever run. Snapshots happen at turn boundaries and (optionally) **before mutating tools** via pass-through `fs/write-intent` / `fs/edit-intent` / `tools/pre-execute` listeners with a bounded wait that never blocks your tools. Advisors gain read-only `list_restore_points` / `diff_restore_points` tools; after a destructive or wrong step an advisor can call `advise` with `rewindTo` — the advisory then carries the exact worktree-only restore recipe (`git restore --source=<sha> --worktree --staged .`) plus the advisor's classification of **which steps must not happen again and which were progress**. The primary model executes the restore itself; the plugin never rewinds anything. Files created after a point are kept, never deleted. Non-git workspaces are skipped.

### Completion gate

- **Completion gate (on by default, prompt-only).** When the watched agent moves to finish ("done", "all tests pass", goal completion), the advisor verifies the original ask is actually implemented — against the workspace and, when restore points exist, the session's baseline→now diff. If not, it instructs the agent to **report honestly what was done and what wasn't, and ask you whether the partial state is acceptable**. Once the work is verified complete — or you explicitly accept the compromise — the advisor's `acceptance` advisory reminds the agent to **commit the accepted state to the branch it is working on** (the plugin marks the latest restore point accepted; the agent runs the commit).

### Advisor memory

- **Advisor memory (v0.7.0).** Advisors recall relevant long-term lessons into each review and write durable lessons back, through a pluggable engine roster: a built-in per-workspace plaintext store (default), OpenViking, Hindsight, MisakaNet, mem0, and any custom MCP memory server. Multiple engines run at once, each advisor picks its own, unavailable engines are grayed out and never block a review, and a write gate (approval / auto / read-only) controls what gets stored. Full controls live in the [Memory tab](#configure).

### Settings UI & monitoring

- **Multi-tab settings UI.** The settings section is organized like the Plugin Market's inner tab bar: **General** (policy switches), **Advisors** (the roster — cards collapsed by default, click a header to expand), **Workspaces** (a workspace × advisor activation matrix over the same `workspaces` field), **Memory** (persistent advisor memory — pluggable engines, write gate, per-advisor engine toggles), and **Monitor** (live status + activity feed).
- **Optional sidebar monitor + workspace manager tab.** When [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) is installed, the plugin registers an **Advisors** tab in the sidebar workbench. The tab follows the sidebar's session scope, so it shows this session's name and workspace, its attached advisors (status dot, review/advice counters, last error) and its activity feed — other sessions stay collapsed under "Other sessions", and the tab-strip badge counts only this session's advisors (`!` when one is halted/errored, hidden when none are attached here). Since v0.7.5 it is also a **workspace advisor manager**: it lists every configured advisor split into *Active in this workspace* and *Not active here* (reason: `off`, `disabled here`, or `not in this workspace`), with inline **Enable here / Disable here** buttons and a single theme-aware **Add advisor ▾** dropdown that lists the built-in presets (a self-rendered menu, not a native `<select>`, so it follows the light/dark scheme; new advisors are scoped to this workspace and use the first available model). Since v0.7.6 the toggle is **truly workspace-scoped**: "Disable here" appends an exact `=<workspace>` entry to a new orthogonal `disabledWorkspaces` exclusion list — it never flips the advisor's global `enabled` switch and never deletes authored `workspaces` inclusion patterns, so an always-on advisor can be switched off in just this workspace and keeps running everywhere else; "Enable here" clears the exclusion (and turns the advisor on / adds an inclusion pattern if needed). Writes go through narrow host-side RPCs (`setAdvisorWorkspace`, `addWorkspaceAdvisor`) that load-modify-save the current settings atomically — the sidebar never read-modify-writes its (up-to-2s-stale) cache, so a concurrent edit in the settings dialog is not clobbered. The host's workspace matcher honors `disabledWorkspaces`, so a disabled-here advisor actually stops attaching/reviewing in that workspace (not just in the tab's rendering). Detection is a bounded runtime probe — **never a hard dependency**: without the sidebar the plugin loads and behaves exactly as before.

## Install

**Prerequisites**

- DeepSeek Harness `0.1.0-rc.8` or newer with the **web profile** (`dsh web`).
- At least one model configured in DSH's model list — each advisor needs a provider route + model picked from that list.
- The plugin is inert until enabled: the master switch (**Attach advisors to sessions**) is **off by default**.

**Install**

```bash
# from GitHub
dsh plugin --profile web add github:AndrasSama/dsh-omp-advisor
# or from a local checkout
dsh plugin --profile web add "file:/path/to/dsh-omp-advisor"
```

Then **restart DSH Web** and **hard-refresh the browser** (Ctrl+Shift+R). The restart is mandatory: a running server computes plugin bundle revisions at startup, so a freshly installed or updated plugin never appears until the server process restarts.

**Verify**

1. Open **Settings** in the DSH Web GUI — a **Ward Council** section must be present.
2. Its **Live status** panel lists sessions with attached advisors once the master switch is on.
3. First run: enable the master switch, click **Add from preset** (or **+ Add advisor**), pick a model from the dropdown, and start any session — the advisor chip appears in Live status within one turn.

**Upgrade / uninstall**

```bash
# upgrade: re-run add with the same spec, then restart DSH Web
dsh plugin --profile web add github:AndrasSama/dsh-omp-advisor
# uninstall (settings in the dsh-omp-advisor namespace stay on disk)
dsh plugin --profile web remove dsh-omp-advisor
```

**Rate-limit guidance.** Each advisor makes one model call per reviewed transcript update. On tight free tiers (e.g. 5 req/min), keep **Review trigger** on `turn`, keep the roster small, and leave **Auto-retry** on with a delay at least as long as the provider's rate window.

### Agent install prompt

Hand this to an AI agent with shell access to the DSH host — it is self-contained:

```text
Install the dsh-omp-advisor plugin into the DSH web profile.

Context:
- DSH CLI: `dsh` (must be on PATH; often ~/.npm-global/bin/dsh). Version must be
  0.1.0-rc.8+. The web profile directory is ~/.dsh/profiles/web (pnpm-managed).
- `dsh plugin --profile web <cmd>` delegates to pnpm inside that profile dir.
- A `dsh web` server may currently be RUNNING and hosting live user sessions.
  NEVER kill it yourself unless the user explicitly says they will restart it;
  the plugin only activates after a server restart, so finish the install and
  then ask the user to restart `dsh web` and hard-refresh the browser.

Steps:
1. Install from GitHub:
     dsh plugin --profile web add github:AndrasSama/dsh-omp-advisor
   (or from a local checkout: dsh plugin --profile web add "file:/abs/path/to/dsh-omp-advisor")
2. Verify it registered:
     dsh plugin --profile web list | grep dsh-omp-advisor
   Expect one line showing dsh-omp-advisor.
3. Sanity-check the installed copy at ~/.dsh/profiles/web/node_modules/dsh-omp-advisor:
   package.json version matches the release, and lib/index.js + lib/client.js +
   skills/ exist. KNOWN PITFALL with `file:` installs: pnpm hardlinks files at
   first install, so later edits to the source checkout can leave the installed
   copy partially stale. If anything looks stale, mirror the checkout over it:
     rsync -a --delete --exclude node_modules --exclude .git \
       /abs/path/to/dsh-omp-advisor/ ~/.dsh/profiles/web/node_modules/dsh-omp-advisor/
4. Ask the user to restart `dsh web` and hard-refresh the browser (Ctrl+Shift+R).
5. Post-restart verification in the GUI: Settings shows a "Ward Council"
   section. The plugin is INERT until the user enables "Attach advisors to
   sessions" (off by default) and adds at least one advisor with a model picked
   from the DSH model list — tell them this.
6. If the section is missing after restart: check the server log for plugin
   load errors, confirm step 2/3, and confirm the browser was hard-refreshed.

Do not edit ~/.dsh/settings.yaml by hand for this plugin; configuration lives
in the dsh-omp-advisor settings namespace and is edited through the GUI section.
```

## Configure

Open **Settings → Ward Council**. The section has five inner tabs — **General**, **Advisors**, **Workspaces**, **Memory**, **Monitor** — patterned after the Plugin Market's sub-tab bar. Settings live in the `dsh-omp-advisor` namespace and apply **live** — no restart needed when you edit the roster. Advisor model calls go through `ctx.llm.stream` with the provider route + model id you picked, so billing, routing, and failover behave exactly like your other DSH model traffic.

### General tab

- **Attach advisors to sessions** — master switch (off by default).
- **Review trigger** — `turn` (review completed turns) or `step` (review while the turn runs). Step mode fires on every tool step — the UI warns it is heavy on rate-limited or metered providers.
- **Interrupting severities** — which severities steer; the rest ride as non-interrupting context.
- **C