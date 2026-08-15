# deepseek-harness-themes

A collection of UI themes for [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness).

> One harness. Multiple styles.

Community-maintained theme collection built on the official theme extension point (`ctx.theme` from `@deepseek-ai/dsh-client-ui-theme`). It focuses only on the visual experience — colors, surfaces, states, code blocks, tool calls, terminal UI. No model changes, no agent changes, no prompt changes, no protocol changes.

## Packages

| Package                                      | Role                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`@dshthemes/core`](packages/core/README.md) | Six `ThemeDefinition`s, the `REQUIRED_TOKENS` contract, and `registerThemes(registry)`; zero UI                    |
| [`@dshthemes/ui`](packages/ui/README.md)     | Client plugin: registers all themes, adds a Theme picker row to Settings → General, persists third-party selection |

## Themes

Every preview is generated from that theme's own tokens; the full gallery is [docs/previews.md](docs/previews.md).

| Theme       | Base                                   | Preview                                                                          |
| ----------- | -------------------------------------- | -------------------------------------------------------------------------------- |
| DeepSeek    | light — clean DeepSeek-inspired blue   | ![DeepSeek theme preview](previews/deepseek.svg)       |
| OLED        | dark — true black for emissive panels  | ![OLED theme preview](previews/oled.svg)               |
| Dracula     | dark — high-contrast purple/indigo     | ![Dracula theme preview](previews/dracula.svg)         |
| Catppuccin  | dark — soft pastel (Mocha)             | ![Catppuccin theme preview](previews/catppuccin.svg)   |
| Tokyo Night | dark — midnight blue with neon accents | ![Tokyo Night theme preview](previews/tokyo-night.svg) |
| GitHub Dark | dark — familiar GitHub interface       | ![GitHub Dark theme preview](previews/github-dark.svg) |

## Install

Two commands: one installs the dependency, adds the layer to the profile, and mounts the feature; the other starts the Web surface.

```sh
dsh plugin --profile web add @dshthemes/ui
dsh web
```

`web` is the shipped Web profile and initializes on first use. Pick a theme under Settings → General; the selection persists, so nothing else runs from a terminal.

![The Theme picker row under Settings → General](screenshots/settings.png)

Remove it just as easily:

```sh
dsh plugin --profile web remove @dshthemes/ui
```

See [docs/installation.md](docs/installation.md) for the core-only shape, installing from a source checkout, the hand-written patch alternative, local development, and troubleshooting.

## Theme philosophy

Themes change how deepseek-harness looks, not how it behaves. A theme is easy to install, easy to switch, easy to customize, consistent across UI states, comfortable during long coding sessions, and independent from agent logic. The token contract is [docs/theme-spec.md](docs/theme-spec.md).