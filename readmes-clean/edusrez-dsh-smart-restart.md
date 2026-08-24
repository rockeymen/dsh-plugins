# dsh-smart-restart

![dsh-smart-restart demo — real-time restart](assets/demo.gif)

*A real-time restart: the agent restarts the service (canary pre-flight passing, `Canary: passed — restarting…`), and the plugin's boot notification brings the very same session right back — the conversation continues automatically, no user prompt needed.*

A **DeepSeek Harness (DSH) host plugin** that keeps the main agent aware of service restarts — **without the user having to prompt it**. On every boot it detects that a new process has taken over, wakes the target agent with a short "Smart-restart" notice (boot time, previous boot, downtime). New in **v0.2.0** it added the `smart_restart` tool to **restart DSH itself** and return the notice to the exact session that asked; new in **v0.3.0** it **auto-detects** when the service was stopped while an agent session was active, so even a *plain* `systemctl restart` the agent ran notifies that session at boot; new in **v0.4.0** it can **validate the launch first** with an optional canary pre-restart gate that aborts the restart when an ephemeral boot fails. New in **v0.5.0** it **auto-detects the systemd unit** from `/proc/self/cgroup`, so the tool and the canary work with zero config on systemd-managed installs.

## Overview

A long-lived DSH instance restarts for many reasons: the agent installs or reconfigures a plugin and triggers a reboot, the host machine reboots, or the service is restarted under **systemd**. After any such restart the agent is up and running again, but it has **no idea that anything happened** — the previous session is gone. Today, the only way to get the agent to pick back up is for the user to tell it, usually with something like *"you restarted"*.

`dsh-smart-restart` closes that gap. It detects the restart itself and wakes the main agent at boot with a short, self-contained notice describing what happened, so the agent decides whether to resume interrupted work, note the downtime, or simply acknowledge — no user prompt needed.

**New in v0.3.0**, the plugin also covers the *unplanned* restart of an **active agent**. It tracks the last active session and, on shutdown (`SIGTERM`/`SIGINT`), persists a `shutdown-notice.json`; on boot it pins the notice back to that session (when it was active within `shutdownGraceMs`). So a plain `systemctl restart` the agent ran — or a restart that happened while an agent was mid-task — is auto-notified without the user prompting. v0.2.0 let the main agent *cause* restarts: the `smart_restart` tool records the calling session and restarts DSH through systemd, returning the notice to that exact session.

- **Zero prompting** — the user never has to tell the agent "you restarted".
- **Self-restart** — the main agent can restart DSH itself and resume its task automatically afterwards.
- **Automatic wake** — an idle main agent is woken and handed the notice on its own.
- **Targeted delivery** — the post-restart notice returns to the session that requested it; otherwise the `target` config decides where it lands.
- **Precise context** — the notice carries the boot time, the previous boot time, the downtime, and an optional reason.
- **Canary safety** — an optional pre-restart gate boots an ephemeral DSH instance and aborts the restart when it fails (see below).
- **Self-contained** — a single host bundle; nothing to run, no external service.

## How it works

On every boot the plugin:

1. **Reads the previous marker** — a durable `marker.json` (`{lastBootAt, pid, dshVersion?}`) stored under `<DSH_HOME>/<stateDir>/`.
2. **Detects a restart** — a previous marker with a **different `pid`** than the current `process.pid` means a *new process* has started, i.e. the service restarted; downtime is `now − previous lastBootAt`, clamped to `≥ 0`.
3. **Writes a new marker** immediately, so the next boot can be compared against this one.
4. **Checks for a pending notice** — if the `smart_restart` tool left a `pending-notice.json` before the previous restart, this boot **pins** delivery to that exact session (**highest priority**; the file is consumed once read).
5. **Checks for a shutdown notice** — if there was **no** pending notice, the plugin reads `shutdown-notice.json` (written by the previous process on `SIGTERM`/`SIGINT`, recording the last active session). If that session was active within `shutdownGraceMs`, this boot **pins** delivery to it (**second priority**); otherwise the pin is skipped and delivery falls back to `target`. The file is consumed once read.
6. **Delivers the notice** — once per boot via the source-agnostic `agent/session-start` hook (a pinned session is matched regardless of publication source, so a session that **resumes** with `source: 'resume'` is caught too), backed by a **bounded poll** (750ms tick, ~15s cap) that picks up a pinned session which resumes lazily late.

There are **three delivery paths**, depending on how the restart happened:

### (a) Agent-initiated restart (`smart_restart` tool)

The main agent calls `smart_restart(reason?)`. The tool:

- validates the configured `restartUnit` token,
- **persists the pending notice synchronously** (calling session + optional reason) to `pending-notice.json` under the state dir, *before* any spawn so it survives the imminent service kill,
- spawns a **detached** `setsid bash` process (a ~1s delay lets the tool's response be written) that runs `systemctl restart <unit>` and survives this process being killed by systemd,
- returns `{ok: true, restarting: true, ...}`.

On the next boot, step 4 above reads the pending notice, **pins** it to the calling session (**highest priority**), and the notice returns there — **regardless of source** — so the agent that asked resumes its interrupted task.

### (b) Smart shutdown auto-detection (plain restart while an agent was active)

If there is **no** pending notice, the plugin looks for a `shutdown-notice.json`. This file is written synchronously by the previous process on `SIGTERM`/`SIGINT`, recording the **last active session** (tracked on `agent/session-start` and `agent/pre-step`) and its timestamp. On boot the plugin **pins** the notice to that session *only if* it was active within `shutdownGraceMs` of shutdown (recent activity ⇒ the user restarted while the agent was mid-task, so auto-notify). If the session was idle well before shutdown (the user probably restarted while idle), the pin is skipped and delivery falls back to `target`.

This is what makes a **plain `systemctl restart`** that the agent ran — or a restart that happened while an agent was active — auto-notify that session at boot, with no user prompt and no need to have called `smart_restart`.

### (c) External restart (systemd, host reboot, dev tools) — no active session

There is **no pending notice** and **no usable shutdown notice** (either none was written, or the last activity predates `shutdownGraceMs`). The boot falls back to the `target` config (`primary` | `all` | `<session-id>`) to decide which agent(s) get the notice. The `source === 'startup'` gate applies only to this non-pinned path.

### Restart vs. HMR semantics

The detection is intentionally precise:

### Situation · Detected as a restart?
- **Situation**: New OS process, previous marker exists · **Detected as a restart?**: **Yes** — service (re)started.
- **Situation**: Same OS process (in-process HMR / hot-reload) · **Detected as a restart?**: **No** — ignored.
- **Situation**: First-ever boot (no marker) · **Detected as a restart?**: **No** — nothing to compare against.
- **Situation**: Marker present but stale/corrupt `lastBootAt` · **Detected as a restart?**: **Yes** — downtime reported as 0.

Only a genuinely **new process** counts as a restart. An in-process hot-reload keeps the same `pid`, so it is not treated as a service restart. Delivery happens **once per boot**: a `deliveredIds` set plus a `primary` guard (for the `primary` target) prevent the startup event and the fallback poll from double-sending.

### Notice

The default notice (English) reads:

> Smart-restart: the DSH service restarted at ``. Previous boot: `` (downtime ~2m 9s). If a task was in progress, resume it; otherwise reply with a one-line acknowledgment.

When a `reason` was recorded by `smart_restart`, it is appended (`… reason: <reason>.`) before the resume instruction. The previous-boot/downtime segment is omitted when no previous boot time is known, and the whole text is fully customizable via the `notice` config (see below).

## The `smart_restart` tool

Registered via `ctx.tools.register` in `apply` (so it is available to agent sessions) when `toolEnabled` is true (the default). It lets the main agent restart DSH itself through systemd.

**Parameters**

### Param · Type · Required · Description
- **Param**: `reason` · **Type**: string · **Required**: no · **Description**: Optional human-readable note, e.g. `"installed dshmarket in stable+dev"`. Included in the post-restart notice.
- **Param**: `canary` · **Type**: boolean · **Required**: no · **Description**: Optional canary pre-restart validation for THIS call: boots an ephemeral DSH instance and aborts the restart on failure (see [Canary pre-restart validation](#canary-pre-restart-validation)). Overrides the configured `canary` for this call.

**Behavior**

- Validates the configured `restartUnit` — a single systemd unit token (`/^[A-Za-z0-9_.@-]+$/`, no spaces/slashes) to prevent shell injection into the detached command.
- **Fails fast** when `restartUnit` is not configured **and** auto-detection from `/proc/self/cgroup` finds no unit either (`ok: false`, error `restartUnit not configured`) rather than guessing a unit — an empty `restartUnit` is auto-detected first, and only a failed detection produces that error.
- Persists `pending-notice.json` **synchronously** (before any spawn) so it survives the service kill and targets the restarting session.
- Restarts via a **detached** `setsid bash` process (`sleep 1 && systemctl restart <unit>`) that outlives this process, then unrefs it.
- Returns `{ok: true, restarting: true, sessionId, reason}` on success, or `{ok: false, restarting: false, error}` when it fails.

**Intended agent flow**

```
install/change a plugin
  → call smart_restart(reason)   # e.g. "installed dshmarket in stable+dev"
  → DSH restarts (detached, ~1s)
  → after boot, the notice returns to THIS session (pinned)
  → the task continues automatically — no user prompt needed
```

**Safety notes**

- The unit token is validated against a strict regex to block shell injection through `restartUnit` into the detached shell command.
- The tool targets a **systemd-managed** DSH install (`setsid` / `systemctl`); it does not apply to a bare process without a systemd unit.

## Canary pre-restart validation

> **New in v0.4.0.** Optional, opt-in, and fully generic — it works on any DSH
> install: `restartUnit` is the only tool config you may need to set (auto-detected since **v0.5.0** when empty on systemd installs).

When enabled, the `smart_restart` tool can validate the launch **before** anything is persisted or restarted: it boots an **ephemeral DSH instance** from the same binary and profile as the systemd unit, verifies it starts, and only then proceeds with the real `systemctl restart`. A failed canary **aborts the restart** — no pending notice is written, nothing is spawned, and the calling session is alerted live (same plugin-source notice channel).

**What it does, step by step**

1. **Resolves the dsh binary/profile** — an explicit `canaryBinary` / `canaryProfile` wins; otherwise both are derived from `systemctl show -p ExecStart <restartUnit>` (binary falls back to `dsh` on PATH). The `--profile` flag is omitted when no profile resolves.
2. **Creates a temp state dir and a temp patch overlay** (`dsh --patch <tmp>/canary.patch.yml`, applied after the profile layer): the `smart-restart` row itself is disabled in the canary (`enabled: false`) and every `canaryStateDirOverrides` entry gets its `stateDir` redirected into the temp dir — so the canary never writes a marker, notice, or live board state.
3. **Pre-flights the launch** with `--dump-config` (20s timeout; a compose failure aborts the restart).
4. **Boots the ephemeral instance** detached with the same overlay on an auto-picked free port (`canaryPort` when set) and **polls** `http://127.0.0.1:/` until HTTP 200 or `canaryTimeoutMs` elapses (per-attempt 800ms; a refused connection or non-200 is "not yet").
5. **Stops the ephemeral** (process-group kill) and returns: `passed` → the restart proceeds; `failed` → abort + alert the caller; `skipped` → the restart proceeds (a skip is not a failure).

**When it skips (never blocks)** — if the dsh binary/profile cannot be derived (no `systemctl` lookup result AND no explicit `canaryBinary`/`canaryProfile`), the canary reports `skipped` and the restart proceeds unchanged. Generic installs are therefore always safe: a canary failure only ever aborts a restart when *you* opted in with an actual, resolvable launch target.

**How to enable**

- **Per profile**: add `canary: true` (plus any overrides) to the `smart-restart` row. The per-profile patch row REPLACES the row's whole config, so restate your existing fields (see the example in [Configuration](#configuration)).
- **Per call** (agent-facing): call `smart_restart(canary: true, reason)`, which overrides the configured default for that single call.

**Config fields**

### Key · Type · Default · Description
- **Key**: `canary` · **Type**: boolean · **Default**: `false` · **Description**: Master opt-in for the canary gate.
- **Key**: `canaryTimeoutMs` · **Type**: number · **Default**: `45000` · **Description**: Hard window (ms) for the canary boot liveness probe; a timeout is a canary failure and aborts the restart.
- **Key**: `canaryPort` · **Type**: number · **Default**: `0` · **Description**: HTTP port for the ephemeral canary instance; `0` auto-picks a free port.
- **Key**: `canaryProfile` · **Type**: string · **Default**: `''` · **Description**: Explicit dsh profile for the canary launch; empty derives from the unit's `ExecStart` (`--profile`).
- **Key**: `canaryBinary` · **Type**: string · **Default**: `''` · **Description**: Explicit dsh binary for the canary launch; empty derives from the unit's `ExecStart`, else `dsh` on PATH.
- **Key**: `canaryStateDirOverrides` · **Type**: object · **Default**: `{}` · **Description**: Plugin-row id → temp dir: those rows get their `stateDir` redirected in the canary patch (e.g. `deepartments: ''` keeps the canary off live board state). Relative or empty values resolve under the canary temp dir; absolute values are used verbatim.

> **Note on overrides and row replacement.** Patch rows replace their row's
> WHOLE config (no merge) — and the canary is a throwaway instance, so a
> listed row gets only its `stateDir` overridden and its remaining config
> reverts to that plugin's own defaults. Use `canaryStateDirOverrides` only
> for rows that boot fine with defaulted config (the live profile's row is
> untouched). Rows that don't exist in the canary's composed tree are skipped
> with a loader warning.

**Output** — when a canary ran, the tool result carries `canary` (`passed` /
`skipped` / `failed`) plus `canaryDetail`, and the rendered response gains a
`Canary: …` line (`Canary: passed — restarting…`, `Canary: failed — restart
ABORTED: <detail>`, or `Canary: skipped — <detail>`).

## Requirements

- **DSH `0.1.0-rc.7+` / `0.1.1-rc.x`** — a **long-lived instance with a live main-agent session** (the web / GUI profile). This plugin is designed for a continuously-running service whose main agent stays resident; it is **not** aimed at the one-shot headless CLI.
- **systemd-managed DSH install** for the `smart_restart` tool — v0.5.0 auto-detects the service unit from `/proc/self/cgroup`; set `restartUnit` explicitly when the unit differs or on non-systemd (where the tool fails safe).
- **Node.js / pnpm** — the usual DSH toolchain for building and installing host bundles.

## Install

`dsh-smart-restart` is a **DSH host bundle**: `package.json` carries `dsh.bundle.patch = ./cordis.patch.yml`, so installing the package lets the plugin layer auto-join the profile's `dsh.profile.bundles`.

```bash
# From a registry (npm)
dsh plugin --profile <name> add dsh-smart-restart

# Or link a local checkout while developing
dsh plugin --profile <name> add /path/to/dsh-smart-restart
```

**A restart is required after `add`** — which is exactly the scenario this plugin exists to surface. The bundled patch inserts the layer into the profile's layer stack:

```yaml
# cordis.patch.yml (bundled with this package)
- insert:
    - id: smart-restart
      name: dsh-smart-restart
      config:
        enabled: true
        stateDir: .smart-restart
        target: primary
        wakeup: true
        notice: ''
        restartUnit: ''   # OPTIONAL since v0.5.0 — auto-detected on systemd installs; set explicitly when the unit differs
        toolEnabled: true
```

> **`restartUnit` is OPTIONAL since v0.5.0 on systemd installs.** The plugin
> auto-detects its **own systemd unit** from `/proc/self/cgroup`, so the
> `smart_restart` tool (and the canary's `ExecStart` derivation) work with
> **zero config** on a systemd-managed DSH install. Set `restartUnit`
> explicitly when the unit name differs from the auto-detected one or when
> detection is unavailable (e.g. a bare non-systemd process). If you DO set
> it, add a `cordis.patch.yml` override on the `smart-restart` row —
> **restating the full config** (a partial override would drop the other keys)
> — with the unit for that profile. For example, for the stable instance and
> the dev instance respectively:

```yaml
# Override on the smart-restart row — profile "stable" (dsh.service)
- insert:
    - id: smart-restart
      name: dsh-smart-restart
      config:
        enabled: true
        stateDir: .smart-restart
        target: primary
        wakeup: true
        notic