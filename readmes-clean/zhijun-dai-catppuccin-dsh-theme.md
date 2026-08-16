<h3 align="center">
	![Logo](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png)
	![](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png)
	Catppuccin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
	![](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png)
</h3>

	![](assets/preview.webp)

## Previews

🌻 Latte
![](assets/latte.webp)

🪴 Frappé
![](assets/frappe.webp)

🌺 Macchiato
![](assets/macchiato.webp)

🌿 Mocha
![](assets/mocha.webp)

## Features

- **Full token coverage** — 181 tokens with zero duplicates: the static
  color ladders, every alias, the specific tokens and the shiki syntax
  colors are all themed, so no default DeepSeek blue-gray leaks through.
- **Classic mauve brand** — the brand color follows the Catppuccin way:
  mauve, not the built-in blue.
- **Your choice is remembered** — the selected flavor persists per browser
  in `localStorage` and is re-applied at startup, even when the host
  re-asserts its own preference.
- **Component-level accents** — beyond tokens, message bubbles, tool-call
  rows, code block tags, timestamps, the homepage headline and hover states
  are tinted from the palette, with a gradient headline on the empty
  workspace.
- **Zero intrusion on Default** — switching back to the built-in appearance
  restores it pixel-identical; no injected styles remain.
- **Four flavors, dark and light** — Latte is tuned separately from the
  dark flavors, so each flavor looks balanced on its own surface.
- **Palette-pure** — every value is a Catppuccin palette color or a mix of
  palette colors; nothing from outside the family.

## Usage

This is a dual-face theme plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
(dsh). It registers the four Catppuccin flavors into the built-in theme
runtime, so they appear as selectable skins in **Settings → General →
Catppuccin theme**.

### Install

From a GitHub repository:

```sh
dsh plugin --profile web add github:zhijun-dai/Catppuccin-dsh-theme
```

From a local checkout (the `-w` flag is required — the profile directory is a
pnpm workspace root):

```sh
dsh plugin --profile web add -w /path/to/Catppuccin-dsh-theme
```

From npm:

```sh
dsh plugin --profile web add dsh-catppuccin
```

> The npm release may lag behind. For the latest version, use the GitHub
> install method above (a branch can be pinned with `#branch-name`).

Restart the web server afterwards:

```sh
dsh web
```

### Switch themes

Open the web UI, go to **Settings → General**, and pick one of the four
Catppuccin flavors (or **Default** to follow the built-in appearance). The
choice is stored per-browser in `localStorage`.

## How it works

The theme definitions are generated from the official
[catppuccin/palette](https://github.com/catppuccin/palette) `palette.json`
(never hand-edited). `scripts/gen-themes.mjs` maps the 26 Catppuccin colors per
flavor onto the `--dsw-alias-*` token directory from dsh's
`@deepseek-ai/dsh-client-ui-theme` stylesheets (including the `--shiki-*`
syntax palette and the leaked `--dsw-static-deepseek-*` static colors), writes
the per-flavor token tables to `themes/`, and embeds them into the browser
bundle `lib/client.js`.

```sh
node scripts/gen-themes.mjs
```

## 💝 Thanks to

- [zhijun-dai](https://github.com/zhijun-dai)
- [Catppuccin](https://github.com/catppuccin)
- [KinGao294/dsh-skin](https://github.com/KinGao294/dsh-skin) — the reference theme plugin this port is modeled on
- [DeepSeek](https://github.com/deepseek-ai)

 

	![](https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/footers/gray0_ctp_on_line.svg?sanitize=true)

	Copyright &copy; 2026-present [zhijun-dai](https://github.com/zhijun-dai)