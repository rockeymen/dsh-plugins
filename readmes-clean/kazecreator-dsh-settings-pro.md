# @kazecreator/dsh-settings-pro

DeepSeek Harness **Settings Pro** plugin — one package, five features: **IM Bridge**, **Usage**, **Memory**, **Pets**, and **Vision**.

## Quick start

1. Install the package into the profile:

```bash
dsh plugin --profile <name> add @kazecreator/dsh-settings-pro
```

`<name>` is the profile name (`web` for the Web GUI profile); the command forwards to pnpm in the profile directory.

2. Mount the plugin in `cordis.patch.yml`:

```yaml
- insert:
    - id: dsh-settings-pro
      name: '@kazecreator/dsh-settings-pro'
      config: {}
```

3. Restart DSH so the new plugin loads.

4. Open the Web GUI → **Settings Pro**, and flip on whatever you want — all together, a few, or one at a time. Everything is off by default, so nothing runs until you opt in, and every toggle is live (no restart).

## Install & enable with one prompt

This replaces the whole [Quick start](#quick-start) above — you do **not** need to do those steps first. DSH's agent has file access, so just paste one prompt and it does both install and enable for you. Replace the `[...]` list with the features you want:

```text
Install the @kazecreator/dsh-settings-pro plugin into this DSH profile and enable these features: [usage, memory, pets, vision, telegram, wechat]. Keep anything I didn't list disabled.

1. Install the package: run `dsh plugin --profile  add @kazecreator/dsh-settings-pro` (or `pnpm add @kazecreator/dsh-settings-pro` in the profile directory).
2. Add an `insert` entry for plugin id `dsh-settings-pro` (name `@kazecreator/dsh-settings-pro`) to the profile's `cordis.patch.yml`, and in its `config` turn on only the features I named:
   - usage    → `usageEnabled: true`
   - memory   → `memoryEnabled: true`
   - pets     → `petsEnabled: true`
   - vision   → `visionEnabled: true` (plus `visionBaseUrl`, `visionModel`, `visionApiKeyEnv` — ask me for these if I didn't give them)
   - telegram → `telegramEnabled: true` (plus `telegramBotToken`, `telegramAllowedUserIds` — ask me for these if I didn't give them)
   - wechat   → `wechatEnabled: true`
3. Restart DSH so the new plugin loads.
```

The agent installs the package, writes the patch, sets exactly the `*Enabled` keys you named, and leaves everything else off. After a restart the features run; from then on you can still flip any toggle live in **Settings Pro**.

## Features

### Feature · What it does · How to enable
- **Feature**: **Usage** · **What it does**: DeepSeek balance + official billed daily cost/tokens (peak/off-peak pricing) · **How to enable**: Settings Pro → **Usage** → toggle
- **Feature**: **Memory** · **What it does**: Cross-restart memory + `read_memory` / `write_memory` tools · **How to enable**: Settings Pro → **Memory** → toggle
- **Feature**: **Pets** · **What it does**: Desktop pet that follows conversations · **How to enable**: Settings Pro → **Pets** → toggle
- **Feature**: **Vision** · **What it does**: Describe images via any OpenAI-compatible VLM before a text-only model sees them · **How to enable**: Settings Pro → **Vision** → enable + pick model
- **Feature**: **IM Bridge** · **What it does**: Telegram & WeChat bridge (built-in) · **How to enable**: Settings Pro → **IM Bridge** → token / QR

The `*Enabled` config keys (`usageEnabled`, `memoryEnabled`, `petsEnabled`, `visionEnabled`, `telegramEnabled`, `wechatEnabled`) also work as install-time defaults if you want to pre-enable something for a profile.

## Notes

- **Updates:** Settings Pro checks the npm registry once a day (at startup and when the settings section opens, reusing a 24h cache). When a newer version exists, a **NEW** chip appears on the **Settings Pro** nav item; the **About** tab (last tab) shows plugin info, the installed/latest versions, a manual **Check for updates** action, and — only when an update exists on a registry install — an **Update & Restart** button (runs `pnpm add @kazecreator/dsh-settings-pro@latest` in the profile and relaunches the dsh process). If the plugin is installed as a `file:` link (local development checkout), the update button is hidden and the About tab explains that updates are manual.
- **Usage auto-sync reads a Chromium browser session** (Chrome / Edge / Brave / Arc / Opera on macOS / Windows / Linux) to backfill official billed usage. Firefox / Safari aren't supported.
- **Pet desktop app is not bundled.** The default "browser" open mode opens `/pet` in a browser tab with no extra install. The "app" mode needs the separate Electron desktop-pet app (the `pet-desktop/` folder in the source repo), which is not part of the npm package.
- **The online pet library fetches from GitHub** — the [Awesome Codex Pet](https://codexpet.top) community gallery by [@legeling](https://github.com/legeling/awesome-codex-pet). Thanks to that project and every pet author for the open submissions. It caches locally and degrades to the cache/offline notice on network failure.