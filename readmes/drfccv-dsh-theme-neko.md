<div align="center">

# 🐱 neko-theme

A **Nachoneko (甘城猫猫)** themed skin for the DeepSeek Harness web GUI.

[English](README.md) · [简体中文](README.zh.md)

</div>

The interface uses the Nachoneko artwork by Amashiro Natsuki as the wallpaper
background and applies a matching blue-and-white color palette.

## Screenshot

![Screenshot of neko-theme](sample/screenshot.png)

## Features

- Nachoneko wallpaper background, with light and dark variants
- Interface surfaces styled to match the artwork's palette, including the
  composer, popup menus, and the settings dialog
- Readability adjustments for tooltips, focus indicators, and buttons

## Requirements

- DeepSeek Harness with a `web` profile

## Installation

Install the plugin into your profile:

```sh
dsh plugin --profile web add dsh-theme-neko
```

Restart the web GUI so the plugin is loaded:

```sh
dsh web
```

The theme is applied automatically after the restart.

## Usage

- The plugin appears under Settings > Plugins as `dsh-theme-neko`.
- To replace the wallpaper, overwrite `assets/wallpaper.png`, then rebuild and
  reinstall the package.
- To uninstall:

```sh
dsh plugin --profile web remove dsh-theme-neko
```

## Development

```sh
pnpm install
pnpm build
npm publish
```

## License

The software is licensed under the MIT License. See [LICENSE](LICENSE).

The bundled wallpaper is not part of the software license. See
[THIRD-PARTY-NOTICE.md](THIRD-PARTY-NOTICE.md) for the artwork attribution.

### Background Artwork

- **Artist:** Amashiro Natsuki (Nachoneko)
- **Source:** <https://amashiro.com/wp-content/uploads/2021/12/10.png>
- **Official Gallery:** <https://amashiro.com/gallery/>
- **Copyright:** © Amashiro Natsuki

This artwork is not part of the project's software license.
All rights remain with the original copyright holder.
