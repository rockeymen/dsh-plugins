# dsh-backup

**Your entire DeepSeek Harness (DSH) workspace lives in one folder: `~/.dsh`. One failed upgrade, one accidental delete, one new laptop — without a backup, sessions, settings and skills are all gone. dsh-backup gives them back with one command.**

```sh
dsh plugin --profile web add @xiaoyuyu6420/dsh-backup   # install
# restart dsh web, then type:
/backup                                                  # → a verified archive lands in ~/Desktop/dsh-backups/
```

Real output from a fresh v0.9.0 install:

```text
备份完成: dsh-20260826-195150036.tar.gz
sha256: 8f9ae6322ef782d21554981cf4547220d5bb3e64d7964a883317415ad54e3cbb
轮换删除 0 份（保留 7 份）
```

Prefer clicking? There's a visual panel in `dsh web` → Settings → Plugins → Backup: list, verify, restore, delete, edit settings — no restart.

![Backup panel](docs/assets/panel-backups.png)

## Why you want this

### Fear · What dsh-backup does about it
- **Fear**: "An upgrade broke my setup" · **What dsh-backup does about it**: Auto-takes a `dsh-pre-upgrade-` snapshot the moment the host version changes — try the new release, roll back if it bites
- **Fear**: "I deleted / broke something" · **What dsh-backup does about it**: `/backup restore latest --dry-run` previews exactly what comes back; a failed restore auto-rolls-back and shows a result receipt
- **Fear**: "DSH won't even boot anymore" · **What dsh-backup does about it**: Every backup drops a zero-dependency **rescue console** (`dsh-rescue` / `rescue.mjs`, or double-click「点我恢复」) next to the archives — a web UI that restores outside of DSH
- **Fear**: "My API keys will end up in a cloud backup" · **What dsh-backup does about it**: Credentials are redacted from archives by default; plaintext only ever lives in a local vault on your machine
- **Fear**: "My session logs got corrupted" · **What dsh-backup does about it**: `/backup doctor` scans and repairs session logs from a known-good backup; corrupt files are quarantined before they rotate away
- **Fear**: "I got a new machine" · **What dsh-backup does about it**: GitHub sync: `/backup github pull` fetches remote archives, `restore --sync-deps` reinstalls plugins
- **Fear**: "Backups rot silently" · **What dsh-backup does about it**: Every archive ships a sha256; `/backup verify all` checks integrity; daily/weekly tiered retention keeps useful history longer
- **Fear**: "I'll forget to back up" · **What dsh-backup does about it**: `/backup auto 12` — every 12 hours, survives restarts, rotates old copies (default keep 7)

![Backup settings](docs/assets/panel-settings.png)

## Install

Requires macOS / Linux / Windows 10+ (ships `tar`) and DSH `0.1.1-rc.2` or compatible.

```sh
dsh plugin --profile web add @xiaoyuyu6420/dsh-backup
# or straight from GitHub:
dsh plugin --profile web add github:xiaoyuyu6420/dsh-backup
```

Restart `dsh web` afterwards.

## Quickstart

1. Install (above) and restart `dsh web`
2. Type `/backup`
3. Done — the archive lands in `~/Desktop/dsh-backups/`, timestamped, with a `.sha256` next to it

Want it on a schedule? `/backup auto 12` (every 12 hours; `off` stops it, `status` checks it).

## Command cheat sheet

### Task · Command
- **Task**: Back up now · **Command**: `/backup`
- **Task**: Schedule (survives restarts) · **Command**: `/backup auto 12` · `off` · `status`
- **Task**: Restore (preview first) · **Command**: `/backup restore latest --dry-run`
- **Task**: Restore for real · **Command**: `/backup restore latest`
- **Task**: List backups · **Command**: `/backup list`
- **Task**: Verify integrity · **Command**: `/backup verify [prefix\ · all]`
- **Task**: Check & repair session logs · **Command**: `/backup doctor` · `--repair [prefix\ · latest]`
- **Task**: **Rescue when DSH won't boot** · **Command**: double-click「点我恢复」in the backup dir, or `dsh-rescue` / `node rescue.mjs`
- **Task**: Delete / retention · **Command**: `/backup delete ` · `/backup --keep N` (default 7)

## New machine

Prerequisite: GitHub sync was configured on the old one ([setup](docs/advanced.zh.md#github-同步可选), Chinese).

1. Install the plugin, set the same `githubRepo`
2. `/backup github pull` — fetch the remote backups
3. `/backup restore latest --sync-deps` — restore and reinstall plugin dependencies
4. Restart `dsh`

## FAQ

**Are my API keys / credentials inside the archive?**
No. Known credential files are redacted before archiving; the plaintext stays in a local vault that never leaves the machine. Restoring puts them back.

**What exactly gets backed up?**
Everything under `~/.dsh` — sessions, settings, skills, plugin config — minus your exclude patterns and `node_modules`.

**I messed up `~/.dsh` and now `dsh` won't start. Am I out of options?**
No — that's exactly what the rescue channel is for. Every backup writes `rescue.mjs` and a double-clickable launcher (`点我恢复.command` / `.bat` / `.sh`) into the backup directory. It runs on plain Node, no DSH required, and serves a local web UI to browse and restore archives.

**Windows support?**
Yes — Windows 10+ with the bundled `tar`. The rescue launcher becomes a `.bat` file.

**Where do backups go by default?**
`~/Desktop/dsh-backups/` — change it any time in the panel (Settings → Plugins → Backup) or via settings; takes effect immediately, no restart.

## Feedback

Tried it? Tell us what broke, what's missing, what you liked — it directly shapes the roadmap:

- 💬 [Share feedback (GitHub Discussions)](https://github.com/xiaoyuyu6420/dsh-backup/discussions)
- 🐛 [Report a bug](https://github.com/xiaoyuyu6420/dsh-backup/issues)

## What's new

Recent releases

- **0.9.0** — `/backup doctor` session-log health check with targeted repair; out-of-process rescue channel (`dsh-rescue` / launcher in the backup dir) that works even when the host won't boot; restore auto-rollback with a result-oriented receipt; smart backup: pre-upgrade snapshots on host train changes, quarantine of corrupt session logs before they rotate away, tiered daily/weekly retention.
- **0.8.0** — edit backup settings right in the panel (destination, retention, exclude patterns), saved instantly to `settings.yaml`, no restart; stale edits get a conflict warning instead of silent overwrite.
- **0.7.x** — credential redaction with a local vault; cross-machine restore.

## More

Retention policy, credential redaction internals, GitHub sync, restore safeguards, config reference, troubleshooting, and development notes — in the [advanced guide](docs/advanced.zh.md) (Chinese). Cross-runtime compatibility notes: [compatibility.md](docs/compatibility.md).