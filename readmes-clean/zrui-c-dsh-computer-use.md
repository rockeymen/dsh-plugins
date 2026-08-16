![DSH Computer Use icon](docs/assets/app-icon.png)

# DSH Computer Use

  Text-first browser and background macOS control for DSH.
  Target the right process and window without taking over the user's pointer.

## Install

### Homebrew

```bash
brew tap zrui-c/tap
brew trust zrui-c/tap
brew install --cask dsh-computer-use
open -a "DSH Computer Use"
```

### DMG

1. Download the latest `DSH-Computer-Use-*-universal.dmg` from [Releases](https://github.com/ZRui-C/dsh-computer-use/releases/latest).
2. Drag **DSH Computer Use** into **Applications** and open it.

With either method, authorize **Accessibility** and **Screen Recording**, select **Install** under **DSH Plugin**, then restart the running DSH Host.

The Homebrew Cask and official DMG install the same Universal 2, Developer ID signed, Apple-notarized app. Users do not need Xcode, Swift, or this source checkout. DSH and Google Chrome must already be installed.

  ![DSH Computer Use setup center](docs/assets/setup-center.png)

## What it does

### Surface · Perception · Input
- **Surface**: Chromium · **Perception**: Playwright, CDP accessibility/DOM, frames, tabs, optional OCR · **Input**: Ref-pinned navigation, pointer, keyboard, forms, scroll, drag, upload
- **Surface**: macOS · **Perception**: Accessibility tree first, Vision OCR for semantic gaps, independent window capture · **Input**: AX actions, targeted SkyLight/CoreGraphics, global HID only without a target

Every action returns a fresh bounded text observation. The model works with roles, names, values, state, geometry, and stable snapshot refs instead of assuming it can inspect screenshots. UI and OCR strings are explicitly untrusted data.

### Background macOS control

- Carries PID, WindowServer window ID, AX window frame, and element identity through every action.
- Prefers semantic AX actions before coordinate input.
- Routes supported pointer and keyboard events directly to the target process/window.
- Uses a click-through software cursor; targeted actions do not move the physical pointer.
- Keeps post-action observation pinned to the previous target, even while another app stays active.
- Falls back to public CoreGraphics or fails closed when a private capability is unavailable.

## Platform boundary

ScreenCaptureKit is public API. The optional background input path dynamically loads private SkyLight symbols and is intended for Developer ID distribution, not the Mac App Store. Private APIs are unsupported by Apple and can change between macOS releases.

On macOS 26, Stage Manager may expose a shelved window only as a small WindowServer thumbnail. Constructing a capture filter for that representation can abort inside SkyLight. DSH Computer Use detects the geometry mismatch first, preserves AX observation, returns an explicit warning, and never stretches a thumbnail into a fake full-window screenshot.

## DSH integration

The embedded package declares a DSH bundle in `package.json`. The setup center runs the official equivalent of:

```bash
dsh plugin --profile web add --save-exact file:/path/to/DSH\ Computer\ Use.app/Contents/Resources/Plugin
```

`cordis.patch.yml` installs the Host runtime and registers `computer_observe` / `computer_action` in DSH's global tool layer, inherited by every agent preset. No manual edits to user profile YAML or preset copies are required. The setup center detects an older dependency-only installation and repairs the missing bundle registration. A running DSH Host must be restarted after install, repair, or upgrade.

## Build from source

Requirements: macOS 14+, Xcode/Swift 5.9+, Node.js 22+, pnpm 11+, DSH, and Google Chrome.

```bash
pnpm install
pnpm run typecheck
pnpm run test
pnpm run test:native
pnpm run build
```

`pnpm run build` creates:

```text
native/macos-helper/dist/DSH Computer Use.app
```

The default build is Universal 2. For faster local iteration:

```bash
COMPUTER_USE_ARCHS=arm64 pnpm run build
```

Create a local drag-to-Applications DMG:

```bash
pnpm run package:dmg
```

Public releases require a `Developer ID Application` identity and notarization. See [documentation/distribution.md](documentation/distribution.md) for the exact local and GitHub Actions flows.

## Tool contract

`computer_observe` returns `interactive`, `full`, or `changes` snapshots for `browser` and `desktop`, with optional query filtering and `auto | always | never` OCR.

`computer_action` performs exactly one browser or desktop action and returns the post-action semantic state. Ref and coordinate actions require the latest `snapshot_id`; stale targets fail closed and require another observation. File uploads are fenced to the DSH session workspace.

## Project

- [Architecture](documentation/architecture.md)
- [Distribution and notarization](documentation/distribution.md)
- [Security policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)

## Community

- [GitHub Discussions](https://github.com/ZRui-C/dsh-computer-use/discussions) — ask questions, share usage, report ideas
- [DeepSeek Harness Discord](https://discord.gg/Ycq5dCaS4) — the wider DSH ecosystem
- Star the repo if DSH Computer Use saves your pointer 🖱️

Licensed under [Apache-2.0](LICENSE). This independent project is not endorsed by Apple. “DeepSeek” and related marks belong to their respective owners; the name is used only to describe compatibility with DeepSeek Harness/DSH.