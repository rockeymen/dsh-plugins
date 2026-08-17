# ⏪ dsh-checkpoint-rewind

**Unified DeepSeek Harness checkpoints — session + workspace + config three-state snapshots with one-shot rollback.**

*The Claude Code Checkpoints equivalent, built as a capability-seam plugin: capture before every mutation, restore any of the three states with one approved command.*

## Compatibility

### Surface · Status
- **Surface**: Harness · **Status**: DeepSeek Harness `0.1.0-rc.6` (peers pinned to `0.1.0-rc.6`)
- **Surface**: Node · **Status**: `^22.19.0 \ · \ · >=24.0.0`
- **Surface**: Platforms · **Status**: All (host commands + listeners; optional Settings page timeline via the settings capability)
- **Surface**: Model · **Status**: Any (no model calls — snapshots and restores are deterministic)

## What you get

`dsh-checkpoint-rewind` captures a **three-state unified checkpoint** — workspace, session cursor, and plugin config — and restores one or all three with a single approved command:

1. **Three-state record** — every checkpoint stores the workspace state (git tree SHA, or a copy manifest), the session event cursor (`seq` + turn boundary), and a config snapshot, tagged by source (`manual` / `auto` / `guard` / `mutation`).
2. **Four capture triggers** — before every mutating tool (`fs/write-intent`, `fs/edit-intent`, `tools/pre-execute`), on automatic interval (`autoCheckpoint`, default every step), manually (`/checkpoint` and the `checkpoint` tool), and as a guard before every rewind.
3. **git-first provider** — `git stash create` / `commit-tree` produce unreferenced snapshot objects that never touch your worktree, index, or history; restore is worktree-only and path-explicit. Non-git directories (and unborn-HEAD repos) degrade to an incremental `copy` provider with hardlink reuse.
4. **One-shot rollback** — `/rewind workspace|session|config|all <target>` restores the selected states; `preview` is a read-only impact report, `diff <a> ` compares two checkpoints, `clear` deletes them.
5. **Seed-replay session rollback** — session rollback replays events up to the checkpoint boundary through the official `sessions.create` seed API into a new child session; the original session keeps its full history.
6. **Settings page timeline** — the `Plugins → Checkpoints` tab renders the session's checkpoints with pairwise line-level diffs.

## Why another rewind plugin?

### Plugin · What it sells · Restores files? · Rewinds the session?
- **Plugin**: **dsh-checkpoint-rewind** (this) · **What it sells**: git-object snapshots + three-state rollback + one-shot restore · **Restores files?**: ✅ full workspace state · **Rewinds the session?**: ✅ seed-replay child session
- **Plugin**: [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) · **What it sells**: persistent Change Ledger of per-mutation deltas · **Restores files?**: ✅ by replaying inverse deltas · **Rewinds the session?**: ✅ its own ledger model
- **Plugin**: [LingLambda/dsh-undo](https://github.com/LingLambda/dsh-undo) · **What it sells**: pure context rollback to the last completed step · **Restores files?**: ❌ · **Rewinds the session?**: ✅ context only
- **Plugin**: [Mongfayi/dsh-recall](https://github.com/Mongfayi/dsh-recall) · **What it sells**: message recall (remove a turn and everything after) · **Restores files?**: ❌ (explicitly) · **Rewinds the session?**: ✅ turn removal

The difference in one sentence: **dsh-checkpoint-rewind captures the *workspace state* with side-effect-free git primitives before each mutation, and makes "back to step N" one approved command — guard checkpoint first, files restored second, config restored third, session replayed fourth, each phase logged.** No delta bookkeeping to drift, no message-level editing (that belongs to a different plugin), no cross-device sync.

## Quick start

```sh
# 1. install the bundle into your profile
dsh plugin --profile web add "github:PerryLink/dsh-checkpoint-rewind#main"

# or from npm (published releases)
dsh plugin --profile web add dsh-checkpoint-rewind

# 2. restart and verify the row
dsh --profile web --dump-config | grep -A4 'id: checkpoint-rewind'
```

Checkpoints persist through the `storageDomain` service. The plugin mounts without it and never blocks profile startup — checkpoint/rewind commands then return a structured error naming the exact rows to add. Compose the storage stack once to enable checkpoints:

```yaml
- insert:
    - id: checkpoint-rewind-storage
      name: '@deepseek-ai/dsh-storage'
    - id: checkpoint-rewind-storage-json
      name: '@deepseek-ai/dsh-storage-json'
      config:
        root: !!js dshHomePath('checkpoint-rewind/storage')
    - id: checkpoint-rewind-storage-domain
      name: '@deepseek-ai/dsh-storage-domain'
      config:
        backend: json
```

The package is pure ESM with no build step — `index.mjs` and `lib/` are the shipped artifacts. Workspace mutations now create checkpoints automatically; run `/rewind` to list them:

```text
rewind: 3 checkpoints (newest last):
#a1b2c3d4 · (git) · turn 2 step 1 · 2026-08-14 12:00:01 (3 min ago) · trigger: bash · 4 files · 1.2 MiB
#b2c3d4e5 · (git) · turn 2 step 3 · 2026-08-14 12:00:41 · trigger: str_replace_editor · 2 files · 310 KiB
#c3d4e5f6 · (copy) · turn 3 step 1 · 2026-08-14 12:01:10 · trigger: write · 1 file · 90 KiB
run "/rewind " to restore files and fork the session from that checkpoint
```

Address a checkpoint by its unique id prefix, by step number, or by `latest`:

```text
/rewind b2c3d4e5
/rewind step 2
/rewind latest
/rewind preview b2c3d4e5   # read-only: show which files would change, touch nothing
/rewind clear              # confirmed deletion of this session's checkpoints (files untouched)
```

`preview` resolves through the same addressing and prints the impact without asking for confirmation or writing anything.

## Install & uninstall

- **git channel** (latest `main`): `dsh plugin --profile web add "github:PerryLink/dsh-checkpoint-rewind#main"` — pure ESM, no `prepare` or `allowBuilds` step.
- **npm channel** (published releases): `dsh plugin --profile web add dsh-checkpoint-rewind`.
- **tarball channel**: `npm pack` in this repo, then `dsh plugin --profile web add ./dsh-checkpoint-rewind-<version>.tgz`.
- **storage stack** (required for checkpoints, optional for mounting): `@deepseek-ai/dsh-storage` + `@deepseek-ai/dsh-storage-json` (config `root`) + `@deepseek-ai/dsh-storage-domain` (config `backend: json`) — see Quick start; the plugin still mounts without them and every command explains the fix.
- **uninstall**: `dsh plugin --profile web remove dsh-checkpoint-rewind` — snapshot files stay until you delete `$DSH_HOME/dsh-checkpoint-rewind`; git objects are garbage-collected.

## Configuration

All tunables are Schemastery `Config` fields (changeable from cordis.yml). Nothing is hardcoded.

### Key · Default · Meaning
- **Key**: `enabled` · **Default**: `true` · **Meaning**: Master switch; `false` removes the commands, listeners, and providers entirely
- **Key**: `provider` · **Default**: `auto` · **Meaning**: Snapshot provider: `auto` (git if available, else copy) · `git` · `copy`
- **Key**: `gitBin` · **Default**: `git` · **Meaning**: Git executable path
- **Key**: `snapshotDir` · **Default**: `$DSH_HOME/dsh-checkpoint-rewind` (fallback `~/.dsh/dsh-checkpoint-rewind` when `$DSH_HOME` is unset) · **Meaning**: Root for copy-provider snapshots
- **Key**: `maxSnapshots` · **Default**: `50` · **Meaning**: Checkpoints kept per session (oldest pruned first)
- **Key**: `maxSnapshotBytes` · **Default**: `536870912` (512 MiB) · **Meaning**: Global incremental-byte soft quota (newest per session always retained)
- **Key**: `pruneOnTurnEnd` · **Default**: `true` · **Meaning**: Run quota pruning when a turn ends
- **Key**: `mutationTools` · **Default**: `['bash','write','edit','str_replace_editor','pwsh','terminal_send']` · **Meaning**: Tools treated as mutating at `tools/pre-execute`
- **Key**: `excludeGlobs` · **Default**: `['node_modules','.git','.dsh','dist','build']` · **Meaning**: Glob patterns skipped by the copy provider
- **Key**: `confirmVia` · **Default**: `auto` · **Meaning**: Confirmation channel: `auto` (userQuestions first) · `userQuestions` · `approval`
- **Key**: `listLimit` · **Default**: `10` · **Meaning**: Checkpoints shown by bare `/rewind`
- **Key**: `preRewindCheckpoint` · **Default**: `warn` · **Meaning**: Guard checkpoint before restore: `warn` · `require` · `off`
- **Key**: `verifyByHash` · **Default**: `false` · **Meaning**: Copy-provider content-hash comparison and restore verification
- **Key**: `autoCheckpoint.enabled` · **Default**: `true` · **Meaning**: Automatic interval snapshots on `step/start`
- **Key**: `autoCheckpoint.intervalMinutes` · **Default**: `0` · **Meaning**: Interval; `0` = every step
- **Key**: `workspaceRestore` · **Default**: `restore` · **Meaning**: Workspace rollback: `restore` (safe overwrite) · `reset-hard` (CC-style, opt-in)
- **Key**: `promptSection` · **Default**: `true` · **Meaning**: Inject a short role-statement prompt section
- **Key**: `checkpointTool` · **Default**: `true` · **Meaning**: Register the `checkpoint` model tool

```yaml
- insert:
    - id: checkpoint-rewind
      name: dsh-checkpoint-rewind
      config:
        provider: auto
        maxSnapshots: 50
        maxSnapshotBytes: 536870912
        pruneOnTurnEnd: true
        confirmVia: auto
        preRewindCheckpoint: warn
```

## Tools & surfaces

### Surface · Kind · Notes
- **Surface**: `/rewind` · **Kind**: command · **Notes**: `[workspace\ · session\ · config\ · all] \ · latest>` · `diff <a> ` · `preview <target>` · `clear`
- **Surface**: `/checkpoint` · **Kind**: command · **Notes**: `[note <text>\ · list\ · diff <a> ]` — capture a manual checkpoint
- **Surface**: `checkpoint` · **Kind**: tool · **Notes**: Capture a manual checkpoint with an optional note
- **Surface**: `fs/write-intent` · `fs/edit-intent` · `tools/pre-execute` · **Kind**: listeners · **Notes**: Pre-mutation capture (prepend pass-through; never steals the policy slot)
- **Surface**: `session/event` · **Kind**: listener · **Notes**: Turn/step tracking, auto interval, boundary backfill, turn-end pruning
- **Surface**: `checkpoints` projection · **Kind**: session projection · **Notes**: Timeline strip folded from the session log
- **Surface**: Settings page timeline · **Kind**: client · **Notes**: `Plugins → Checkpoints` tab with pairwise diffs

## Safety model

- **Git history is untouchable.** The git provider runs only whitelisted side-effect-free primitives — `stash create`, `commit-tree`, `restore --worktree`, `ls-tree`, `diff-tree`, `ls-files`, `status`, `rev-parse` — enforced by a runtime assertion, and object refs are validated as hex ids before being passed to git (a tampered record cannot inject git options). **No `reset --hard` by default, no `clean`, no index/history mutation, ever** (see `workspaceRestore` below).
- **Overwrite rollback, never deletion.** Restore only overwrites captured files, and the git provider restores **explicit paths** (`git restore … -- .` would delete files `git add`-ed after the checkpoint). Files created after the checkpoint (untracked **or** staged) are *reported* and left in place.
- **No writes through links, no path traversal.** The copy provider validates checkpoint refs before joining them into snapshot-directory paths, and refuses to restore through a destination (or ancestor) that has become a symbolic link — so a restore can never follow a link out of the workspace.
- **Restore requires approval.** Overwriting user files always goes through the confirmation seam with `ask` semantics; a missing, throwing, or answering-no answerer **fails closed**. `/rewind preview` is the read-only way to inspect the impact first.
- **Rewind is reversible.** Before restoring, a guard checkpoint captures the current state; restoring the guard undoes the rewind. `preRewindCheckpoint: require` aborts the rewind when the guard cannot be captured.
- **Fixed-order transaction.** Guard first, workspace second, config third, session replay fourth; every phase is logged; a failed restore leaves files, checkpoints, and session untouched.
- **`workspaceRestore: 'reset-hard'` is CC-equivalent and opt-in.** It runs `git reset --hard <snapshot commit>` (branch head moves to the snapshot commit; pre-snapshot history stays recoverable via reflog; untracked files untouched). It is off by default.
- **Model-visible ⟺ logged.** Everything a user or model sees reconstructs from `command/run` + `command/done` (and, once the host knows them, `checkpoint/*` events) plus the durable `checkpoints` domain.

## How it works

```text
capture ── fs/write-intent · fs/edit-intent · tools/pre-execute (prepend, pass-through)
        ── step/start auto interval ── /checkpoint · checkpoint tool ── pre-rewind guard
             │
             ▼  ProviderRegistry.resolve(auto)  →  git: stash create / commit-tree
             │                                     copy: incremental dir + hardlinks
             ▼
        checkpoints storage domain (SQLite rows / JSON file)  +  checkpoint/* event (adaptive gate)

/rewind <target> ── confirm (userQuestions / approval, fail-closed) ──▶ guard checkpoint
             ├─ workspace: provider.restore(ref)  (restore | reset-hard)
             ├─ config:   settings namespace write-back (persisted)
             └─ session:  sessions.create(seed replay) → new child session (original untouched)
```

Full decision record, event vocabulary, and the provider seam contract: [ARCHITECTURE.md](ARCHITECTURE.md).

## Session events (rc.6 note)

The plugin declares `checkpoint/snapshot`, `checkpoint/bound`, `checkpoint/prune`, and `checkpoint/rewind` as log-only `SessionEventMap` members. Harness rc.6 has **no plugin event-registration surface** and `Session.append` silently drops unknown option keys, so appending unknown types would make the session unreadable on reload. The plugin therefore appends through an **adaptive gate**: a runtime probe (on a detached, never-persisted session store) detects whether the host's `append` stamps the `ignorable` envelope — on rc.6 the gate stays closed; on hosts that support it, `checkpoint/*` events are appended with `ignorable: true` automatically. Until then the authoritative audit chain is `command/run` + `command/done` (harness-known) plus the durable `checkpoints` storage domain.

## Web UI anchor

The plugin returns the new session id in the command result (`session: `) and the Web shell can navigate there. The **session-projection unit `checkpoints` is shipped**: whenever `ctx.sessionProjections` exists, the plugin registers the unit via `ctx.inject` (folds `checkpoint/snapshot|bound|prune|rewind` into a whole-value list) — it stays an empty list on rc.6 hosts until a harness build ships the `checkpoint/*` vocabulary or the `ignorable` envelope, then fills in with zero plugin changes.

## FAQ

**Does this replace git?** No — it *uses* git where available. In a git repo you get byte-perfect, deduplicated snapshot objects without touching history; in any other directory the copy provider does the same with plain files. Regular commits remain your long-term history.

**Why not `git reset --hard` by default?** Because destroying state is not the job of a safety net. The plugin only creates unreferenced objects and performs worktree-only, path-explicit restores by default, so a bad rewind can never lose history, the index, or files created after the checkpoint. `reset-hard` is available behind `workspaceRestore: 'reset-hard'` for users who explicitly want CC parity.

**Can I rewind to a step in the middle of a turn?** File restoration is step-precise (`/rewind step <N>` = nearest snapshot ≤ N). The session replay, however, respects the harness's replay granularity: the child session is seeded up to the checkpoint's turn boundary.

**What happens if nobody can answer the confirmation?** Nothing is touched — the plugin fails closed (`unavailable`/`rejected`), keeps the checkpoint, and returns an explanatory error. With `confirmVia: approval` on rc.6 the message says to mount userQuestions, because approval requires an open turn and commands run between turns.

**Can I undo a rewind?** Yes — every approved rewind captures a guard checkpoint of the pre-rewind state first; the result prints `rewind guard: `, and `/rewind <guard-id>` restores that state.

**How do I address checkpoints?** Unique id prefix (the 8-char short id in the list works), `/rewind step <N>`, `/rewind latest`, or `/rewind clear` to delete this session's checkpoints (files untouched). `/rewind preview <target>` uses the same addressing to show the impact without changing anything.

**What does `preview` do — and not do?** It resolves the checkpoint, then runs a read-only comparison: which files would be overwritten (or recreated), which already match, and which files created after the checkpoint would be left in place. It never prompts, never writes, never forks, and records no `checkpoint/rewind` event — the approval gate only runs on a real `/rewind `.

## Demo

A real assembled-headless integration run (`npm run test:integration`) drives the full flow: the agent modifies files across two turns, then `/rewind preview` inspects the impact read-only (no confirmation gate, no writes) and `/rewind ` restores the files and replays the session into a new child session. The run asserts the file contents, the replayed child context, the guard checkpoint, and that files created after the checkpoint survive — for both the copy and git provider flows (the git flow also asserts `HEAD` and the reflog are untouched). The driver lives in `test/integration/rewind-headless.mjs`.

## Permissions & data

- **Permissions**: the workshop manifest declares `workspace:read`, `workspace:write`, `git:read`, `git:write`, `snapshot-storage:write`, `session-log:read`, `settings:write`, and `network:none`.
- **Data**: checkpoint records live in the `checkpoints` storage domain (SQLit