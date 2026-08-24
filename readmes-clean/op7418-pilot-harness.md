![Pilot Harness icon](apps/desktop/assets/brand-icon.png)

# Pilot Harness

A CodePilot-inspired desktop client and plugin suite for DeepSeek Harness.

Run the DeepSeek Harness plugin runtime as a focused native app, manage providers and multimodal models visually, and keep desktop additions isolated as ordinary Harness plugins.

## Why Pilot Harness

DeepSeek Harness has a powerful “everything is a plugin” architecture, but its default experience is designed around a CLI-launched Web UI. Pilot Harness keeps that runtime model and adds the parts expected from a daily desktop product:

- **A real desktop app** — Electron packages the local Harness runtime for macOS, Windows, and Linux, owns native window behavior, and provides a recovery screen when startup needs attention.
- **A calmer CodePilot-inspired interface** — consistent tokens, radii, menus, hover states, settings cards, Markdown, conversation/trajectory navigation, and platform-aware title bars.
- **Provider and model management** — connect supported providers, declare an OpenAI-compatible endpoint, manage credentials separately from settings, browse the live model catalog, and identify image-capable models.
- **Workspace context without clutter** — project-aware conversation rows show branch, state, reminder summary, mode, and model details, while Files opens as a true right sidebar.
- **Plugin-first extensions** — the theme, Worktree sidebar, Schedule summary, and Session-log export remain Cordis/DeepSeek Harness rows rather than desktop-only business logic.
- **Reversible customization** — disabling the CodePilot theme row removes its product mark and visual overrides so the stock Harness presentation can take over again.

Pilot Harness does not replace the DeepSeek Harness agent loop, Session log, tool pipeline, provider contracts, or RPC implementation. Electron owns packaging and native integration; the composed Harness plugin tree remains the application runtime.

## Quick Start

[Download Pilot Harness](https://github.com/op7418/pilot-harness/releases/latest)

Download the installer for your system from [GitHub Releases](https://github.com/op7418/pilot-harness/releases/latest):

### Platform · Download · Install and handle the security prompt
- **Platform**: **macOS (Apple Silicon)** · **Download**: [DMG installer](https://github.com/op7418/pilot-harness/releases/latest/download/Pilot-Harness-macOS-arm64.dmg)[ZIP app](https://github.com/op7418/pilot-harness/releases/latest/download/Pilot-Harness-macOS-arm64.zip) · **Install and handle the security prompt**: Open the DMG, drag `pilot-harness.app` into **Applications**, and launch it normally. A formal Release is published only after its Developer ID signature has been verified. Because notarization is not enabled yet, Gatekeeper may still block the first launch; in that case open **System Settings → Privacy & Security**, click **Open Anyway**, then confirm **Open**. Do not run `xattr` or disable Gatekeeper for a formal Release. If macOS reports that the signed app is damaged, delete it, verify the Release checksum, and download it again instead of bypassing the warning. [Apple's security instructions](https://support.apple.com/102445).
- **Platform**: **Windows (x64)** · **Download**: [EXE installer](https://github.com/op7418/pilot-harness/releases/latest/download/Pilot-Harness-Windows-x64.exe) · **Install and handle the security prompt**: Run the EXE. If Microsoft Defender SmartScreen says **Windows protected your PC**, first confirm that the file came from this Release, then choose **More info → Run anyway**. Do not disable SmartScreen globally. A managed computer may hide this option; contact its administrator instead. [Microsoft's SmartScreen explanation](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation).
- **Platform**: **Linux (x64)** · **Download**: [AppImage](https://github.com/op7418/pilot-harness/releases/latest/download/Pilot-Harness-Linux-x86_64.AppImage)[DEB](https://github.com/op7418/pilot-harness/releases/latest/download/Pilot-Harness-Linux-amd64.deb)[RPM](https://github.com/op7418/pilot-harness/releases/latest/download/Pilot-Harness-Linux-x86_64.rpm) · **Install and handle the security prompt**: DEB: `sudo apt install ./Pilot-Harness-Linux-amd64.deb`RPM: `sudo dnf install ./Pilot-Harness-Linux-x86_64.rpm`AppImage: `chmod +x Pilot-Harness-Linux-x86_64.AppImage`, then `./Pilot-Harness-Linux-x86_64.AppImage`. If the file manager blocks execution, enable **Allow executing file as program** in file properties. The preview packages are unsigned, so only accept a package-manager warning after confirming the official Release source.

The table links to formal end-user Releases, not the seven-day Actions preview artifacts. Formal macOS files must pass Developer ID verification before publication; while they remain unnotarized, the only expected extra step is **Open Anyway** in System Settings. Preview macOS artifacts are ad-hoc signed for CI verification and are not the normal installation path. Once notarization is enabled, the **Open Anyway** step should normally disappear and this guide must be updated with the release pipeline. Windows and Linux preview installers remain unsigned. Only override an operating-system warning for files downloaded from this repository's [official GitHub Release](https://github.com/op7418/pilot-harness/releases/latest); do not turn off platform security globally.

After installation, open Pilot Harness, select a Workspace, then go to **Settings → Providers** to connect a provider and choose one of its available models. No separate DeepSeek Harness installation is required for the desktop app. Source setup and packaging instructions live in [Development](#development), not in the user installation path.

## What is included

### Area · What Pilot Harness adds · Ownership
- **Area**: Desktop shell · **What Pilot Harness adds**: Native window, local runtime lifecycle, directory dialog, recovery, installers, and platform icons · **Ownership**: Electron app
- **Area**: Visual system · **What Pilot Harness adds**: CodePilot-inspired design tokens and component contracts · **Ownership**: `@deepseek-ai/dsh-client-ui-codepilot-theme`
- **Area**: Workspace Files · **What Pilot Harness adds**: Right sidebar, file count, branch summary, row actions, and `@path` insertion · **Ownership**: `@deepseek-ai/dsh-ui-worktree`
- **Area**: Reminder summary · **What Pilot Harness adds**: Active reminder count and nearest scheduled time in Session hover details · **Ownership**: `@deepseek-ai/dsh-ui-schedule-summary`
- **Area**: Session export · **What Pilot Harness adds**: Per-Session ZIP export from the Trajectory toolbar and `/export` · **Ownership**: `@deepseek-ai/dsh-session-log-export`
- **Area**: Providers and models · **What Pilot Harness adds**: Configurable adapter, credential/settings UI, live catalog, and multimodal labels · **Ownership**: Existing Harness plugins plus the Pilot Harness desktop profile

The provider/model experience is deliberately a **profile composition**, not a new provider implementation. It mounts existing adapter, Settings, and Credentials contracts, then replaces the desktop placeholder only after a real provider advertises a usable model.

## Use the plugins independently

The desktop client already includes every plugin below. If you use a local DeepSeek Harness Web profile instead, install only the feature you want with one command; each release asset is a prebuilt `dsh.bundle`, so no repository clone, YAML patch, or local build is required.

### CodePilot theme

~~~sh
dsh plugin --profile web add https://github.com/op7418/pilot-harness/releases/latest/download/deepseek-ai-dsh-client-ui-codepilot-theme-0.1.0-rc.5.tgz
~~~

Applies the Pilot Harness visual system and product mark. Removing the plugin restores the stock Harness presentation. See [theme details](packages/client/ui-codepilot-theme/README.md).

### Files sidebar

~~~sh
dsh plugin --profile web add https://github.com/op7418/pilot-harness/releases/latest/download/deepseek-ai-dsh-ui-worktree-0.1.0-rc.5.tgz
~~~

Adds the Workspace-confined right file sidebar, file count, branch summary, row actions, and `@path` insertion. See [Files plugin details](packages/workspace/ui-worktree/README.md).

### Reminder summary

~~~sh
dsh plugin --profile web add https://github.com/op7418/pilot-harness/releases/latest/download/deepseek-ai-dsh-ui-schedule-summary-0.1.0-rc.5.tgz
~~~

Adds active-reminder metadata to Session hover details while the upstream Schedule plugin remains the reminder authority. See [reminder plugin details](packages/schedule/ui-schedule-summary/README.md).

### Session-log export

~~~sh
dsh plugin --profile web add https://github.com/op7418/pilot-harness/releases/latest/download/deepseek-ai-dsh-session-log-export-0.1.0-rc.7.tgz
~~~

Adds per-Session ZIP export to the **Trajectory** toolbar and the `/export` command. See [export plugin details](packages/session-query/session-log-export/README.md).

Restart the Web profile after installation and use `dsh --profile web --dump-config` to confirm the added row. Files and Reminder summary require the Pilot Harness UI slot contracts included in Pilot Harness v0.1.0; older upstream Harness builds can install their bundles but cannot render those two UI contributions.

Remove a plugin with the same package name shown in its details page, for example:

~~~sh
dsh plugin --profile web remove @deepseek-ai/dsh-ui-worktree
~~~

## Development

~~~sh
git clone https://github.com/op7418/pilot-harness.git
cd pilot-harness
pnpm install
pnpm run desktop:dev
~~~

Run the desktop checks with:

~~~sh
pnpm run desktop:test
pnpm --filter @deepseek-ai/dsh-desktop run typecheck
pnpm --filter @deepseek-ai/dsh-desktop run test:e2e
~~~

Official installers are never built or uploaded from a developer machine. Every verified push to `main`, and a manual workflow dispatch without a release tag, produces seven-day Actions preview artifacts on native macOS, Windows, and Linux runners. A version-matched `v*` tag starts the formal path, verifies the platform artifacts and macOS Developer ID signature, generates `SHA256SUMS.txt`, and publishes the GitHub Release.

The `Sync DeepSeek Harness upstream` workflow checks the newest non-draft official release every day at 09:00 Asia/Shanghai. A clean update is merged without force-pushing, verified, committed to `main`, and dispatched to the same native release pipeline as `v<upstream-version>-pilot.1`. A merge conflict opens or refreshes a GitHub Issue and stops before changing `main`; missing macOS signing secrets also open an issue and leave the verified source synchronized without publishing an unsigned release. Rerunning the workflow after resolving either condition resumes the pending release.

For the underlying system, read the [DeepSeek Harness architecture](docs/architecture.md), [development guide](docs/development.md), and [desktop architecture](apps/desktop/README.md).

## Upstream, attribution, and trademark notice

Pilot Harness is an independent community project derived from the MIT-licensed [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) and visually inspired by [CodePilot](https://github.com/op7418/CodePilot). It is not an official DeepSeek product and is not endorsed by or affiliated with DeepSeek. “DeepSeek”, “DeepSeek Harness”, and “CodePilot” remain the property of their respective owners.