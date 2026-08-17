![DeepSeek Harness Desktop](public/favicon.svg)

# DeepSeek Harness Desktop

  Run [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) on your desktop, instantly —
  no Node.js, no pnpm, no Docker. Download, install, go.

![Preview](docs/preivew.png)

## Features

- **Zero setup** — First launch bootstraps the bundled Node runtime and Harness core automatically; a compatible local Node / Pnpm setup is reused as-is when present.
- **Self-healing core** — Every launch syncs with the latest upstream Harness release, so upstream fixes reach you without reinstalling.
- **Local & private by default** — Runs on `127.0.0.1:3080`. Profiles, sessions and settings stay on your machine; telemetry is off by default.
- **Native & lightweight** — A Tauri 2 shell (not Electron): smaller installers, lower memory, native windows. Windows / macOS / Linux, bilingual UI.
- **CLI ready** — Registers `dsh` commands (`*/bin`) after install, ready in a new terminal.

## Quick Start

Download the installer for your platform from [Releases](https://github.com/hairyf/deepseek-harness-desktop/releases), install, and launch.

The first run downloads the Node runtime and Harness core (~a few hundred MB) and takes you straight into the harness at `http://127.0.0.1:3080`. Everything after that runs locally — no network required.

**Requirements:** Windows 10+ (64-bit) · macOS 10.15+ · Linux (AppImage) · network on first launch

## Development

```bash
pnpm install      # install dependencies
pnpm tauri dev    # run in dev mode
pnpm tauri build  # build installers
```

Requires Node.js 20+, Rust 1.77+, pnpm 9+, and the platform toolchain (MSVC + WebView2 / Xcode CLT / WebKit2GTK).

## How It Works

```text
┌──────────────────────────────────────────────┐
│ Tauri WebView (React)                        │
│   setup state machine → progress → iframe    │
│   loads the dsh web UI + sidebar controls    │
└──────────────────────┬───────────────────────┘
                       │ invoke commands + events
┌──────────────────────┴───────────────────────┐
│ Tauri Rust backend                           │
│   service/download  installer + extraction   │
│   service/workflow  dsh process lifecycle    │
│   task              dsh health checks        │
└──────┬───────────────────────────┬───────────┘
       │                           │
  runtime/ (Node.js v22.22.0)   dependencies/dsh/ (prebuilt bundle)
       └─────────────┬─────────────┘
                     ▼
   dsh --profile web --host 127.0.0.1 --port 3080
                     │  DSH_HOME=<app-data>/data/dsh
                     ▼
        http://127.0.0.1:3080/  ← embedded UI
```

The prebuilt Harness bundle is published by [deepseek-harness-pkg](https://github.com/hairyf/deepseek-harness-pkg) (release contract: [docs/PKG-CONTRACT.md](docs/PKG-CONTRACT.md)). Every launch diffs the installed bundle against the latest release and re-downloads when outdated — keeping the local install when GitHub is unreachable. Full architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Notes

- **Developer preview** — upstream `dsh` is evolving fast with breaking changes; this project tracks it closely.
- **macOS Gatekeeper** — the app is not notarized; allow it once via System Settings → Privacy & Security → Open Anyway.
- **Security** — `dsh` can execute code locally. For learning / research / testing only; run it in a trusted, isolated environment.

## Related

- [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — the upstream `dsh` agent platform
- [deepseek-harness-pkg](https://github.com/hairyf/deepseek-harness-pkg) — prebuilt Harness bundles consumed by this app
- [dsh-market](https://github.com/dsh-market/dsh-market) — the plugin market offered as a recommended preinstall on first run
- [n8n-desktop](https://github.com/tangtao646/n8n-desktop) — reference implementation