# dsh-plugin-manager

A standalone DeepSeek Harness plugin that adds **Settings → Plugins → Manage plugins**.

It can:

- enable or disable mutable entries from the active Web profile, including shipped entries;
- remove its own explicit override to return an entry to the composed profile default;
- install and hot-mount safe single-entry DSH bundles without restarting the DSH Web process;
- preserve the rest of `$DSH_HOME/profiles/web/cordis.patch.yml` byte-for-byte outside one clearly marked managed block.

## Security model

All state and mutations use a plugin-owned Connection RPC channel registered with `authority: loopback`. The server enforces this boundary; opening the Web UI through a LAN or Tailscale hostname shows a read-only access message instead of exposing lifecycle or package operations.

The manager refuses to disable itself or the Web transport/UI/live-profile-reload spine. It also refuses ambiguous duplicate patch IDs and entries outside the active Web profile tree.

The hot installer accepts only npm registry package names with an optional version or dist-tag. It resolves a concrete pnpm executable (including common direct-executable and Node-entrypoint Windows shims), spawns it without a shell through DSH's public subprocess service, relies on that service's credential-scrubbed child environment, disables package lifecycle scripts, bounds captured output, and performs bounded process-tree termination and verification on cancellation or timeout.

> **Runtime trust boundary:** disabling lifecycle scripts does not sandbox the installed plugin. A successful install immediately loads that package into the DSH host with the same user privileges as DSH. Install only exact versions from reviewed, trusted publishers. Loopback authority limits network reachability but is not caller authentication; local same-user processes, mutable package-manager executables, SSRF-capable browser content, and profile writers that ignore the shared DSH lock remain inside the local trust boundary.

## Hot reload behavior

Existing entry toggles are persisted to the Web profile patch and then applied immediately through the public Loader `Entry.update()` API, so they do not depend on filesystem-watcher behavior. The UI verifies the effective Loader state before reporting success. Removing a manager override is reported as a persistence operation only because the resulting composed default cannot be inferred safely from the managed layer alone; set the desired live state first when removing an override in the same session.

The install path intentionally differs from `dsh plugin add`, whose bundle list is read only at process startup:

1. acquire a manager transaction lock and persist a non-link write-ahead journal before pnpm starts;
2. reject packages already present in the profile—hot version updates require the official CLI and a restart because an unchanged Loader row cannot prove module re-import;
3. install the fresh registry package as an **optional dependency** with lifecycle scripts disabled and record pnpm's exact saved spec in the journal;
4. validate that its `dsh.bundle.patch` is exactly one standalone direct insert with no protected or colliding ID, reserved manager marker, or linked patch file;
5. persist the validated insert in the manager-owned profile patch before executing package code, so every started or pending entry has a restart-persistent safety record;
6. create it through the public in-memory Loader group API and wait for lifecycle settlement only up to a fixed bound. Active entries report immediate success; a non-settling entry remains visibly managed and pending instead of blocking manager HMR teardown indefinitely.

Public Loader lifecycle waits are bounded to 15 seconds (and a bounded cleanup attempt on failure); timed-out toggles retain their requested persisted override, while timed-out installs retain their managed patch so no executing entry becomes untracked. The manager never runs a destructive automatic rollback against profile package files that another CLI may be editing. If pnpm changes the profile and then fails, cancellation arrives, validation fails, or patch commit cannot proceed, the journal remains visible in the UI. Retrying the identical spec rolls forward only when the saved dependency spec still matches the recorded post-pnpm state; any ambiguous or externally changed state is refused and must be resolved with the official CLI. HMR disposal aborts and drains in-flight package work before the old plugin generation exits.

A newly mounted package's browser bundle enters the Host graph live, but an already-open page cannot enroll a new graph row through DSH's current public APIs. Refresh the page once to load the new browser extension—no DSH process restart is needed.

Complex or multi-row bundles are rejected instead of being partially mounted. Install those through the official CLI and restart DSH Web when convenient.

## Install

Install the prebuilt GitHub release tarball into the Web profile:

```powershell
dsh plugin --profile web add https://github.com/leonardoxr/dsh-plugin-manager/releases/download/v0.2.0/leonardoxr-dsh-plugin-manager-0.2.0.tgz
```

To build the same package from source:

```powershell
pnpm install
pnpm run check
pnpm pack
```

The package follows the official [DeepSeek Harness plugin and bundle guide](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/): it declares a function-form plugin, its public service dependencies, a `dsh.bundle` patch, a self-contained `prepare` build for Git installs, and explicit lifecycle cleanup.

A source install is also supported, but pnpm 10 requires explicit permission to run the package's `prepare` build. Pin the reviewed tag and follow the exact `allowBuilds` remediation printed by DSH/pnpm before retrying:

```powershell
dsh plugin --profile web add github:leonardoxr/dsh-plugin-manager#v0.2.0
```

```yaml
# $DSH_HOME/profiles/web/pnpm-workspace.yaml
allowBuilds:
  '@leonardoxr/dsh-plugin-manager': true
```

The prebuilt release tarball is preferred because it needs no install-time build permission.

The manager itself needs one initial DSH Web restart because profile bundle additions are startup-scoped. After that, ordinary toggles and supported fresh direct installs use public in-memory Loader lifecycle APIs plus the persisted profile patch; they do not require another process restart.

## Managed file

Lifecycle overrides and validated direct-mount patches are written to `$DSH_HOME/profiles/web/cordis.patch.yml`. Successful package installs also update the Web profile's `package.json`, `pnpm-lock.yaml`, and `node_modules` through pnpm.

Patch changes use optimistic SHA-256 revisions, `withFileLock`, `writeFileAtomic`, and cancellation checks after lock acquisition and before commit. Existing comments and user-authored rows outside the manager marker block are preserved. Package transactions hold a manager-generation lock across pnpm and patch commit and use a durable roll-forward journal rather than whole-file snapshots or an unsafe remove-after-compare rollback.

## Development

```powershell
pnpm run typecheck
pnpm run build
pnpm run test
pnpm run pack:check
```