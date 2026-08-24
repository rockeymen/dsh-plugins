<sup>Special thanks to:</sup>

    ![](https://static-docs.nocobase.com/Logo-Black.png)

### [NocoBase, AI + No-Code Build reliable business systems](https://www.nocobase.com/?utm_source=picgo)

  <sup>Sponsored by:</sup>




      ![](https://neon.com/brand/neon-logo-dark-color.svg)


### [Fast Postgres Databases for Teams and Agents](https://console.neon.tech/app/?promo=PicGo)

[中文](./README_zh-CN.md) | **English**

  ![PicGo Logo](https://raw.githubusercontent.com/Molunerfinn/test/master/picgo/New%20LOGO-150.png)
  # PicGo
  ### The Ultimate Image Uploader for Efficient Creators


      ![](https://atomgit.com/Molunerfinn/PicGo/star/badge.svg)


## 📖 Overview

**PicGo aims to make image uploading a seamless part of your creative workflow.**

Whether you’re writing a blog post, taking notes, or authoring developer docs, PicGo helps you upload images in one step and automatically copies the resulting link—so you can stay focused on creating, not uploading.

### Supported Image hosts

PicGo supports mainstream Image hosts out of the box, and can be extended indefinitely through its plugin system:

- **China cloud vendors**: Qiniu, Tencent Cloud COS, UPYUN, Alibaba Cloud OSS
- **International / open platforms**: GitHub, SM.MS(S.EE), Imgur
- **More options via plugins**: AWS S3, Cloudflare R2, MinIO, and more

> **Note**: PicGo itself will no longer add new third-party Image hosts by default. You can build Image host plugins yourself—see [PicGo-Core](https://docs.picgo.app/core/).

## ✨ Key Features

PicGo is built around a fast, low-friction image upload experience:

### ⚡ Smooth writing flow
- **Auto-copy links**: once an upload finishes, the link is copied to your clipboard automatically.
- **Flexible formats**: Markdown, HTML, URL, custom templates—paste directly into any editor.
- **Zero-Context Switching**: Don't switch windows. Just paste images directly into your favorite editor, and let PicGo handle the upload in the background.
  - _Enable this workflow via native support or community plugins:_ [Obsidian](https://obsidian.md) \ [VS Code](https://code.visualstudio.com/) \ [Typora](https://typora.io/) \ [Neovim](https://neovim.io/) \ [MarkText](https://marktext.me/) \ [SiYuan](https://b3log.org/siyuan/en/) \ And more...

### 🚀 Fast uploads
- **Multiple ways to upload**: drag & drop, paste from clipboard, hotkeys, and even right-click context menu upload on macOS/Windows.
- **Global hotkey**: press `Command+Shift+U` (macOS) / `Ctrl+Shift+U` (Windows/Linux) to open the upload window without leaving your current app. The global key can be customized.

### 🧩 Powerful plugin ecosystem
- **Highly extensible**: plugins already exist for AWS S3, Cloudflare R2, MinIO, and many other Image hosts.
- **Even more possibilities**: image compression, watermarking, renaming, Markdown image migration, and more.
  - Explore plugins: [Awesome-PicGo](https://github.com/PicGo/Awesome-PicGo)

### 🤖 AI-friendly
More and more writing is handed off to AI. But the screenshots and charts it produces sit on your disk as `![](./chart.png)`, and they need to become real links before you publish. PicGo lets AI upload them too:

- **[PicGo Skills](https://github.com/PicGo/skills)**: official Agent Skills that teach AI when and how to upload. Works with any AI tool that supports the skills format.
  ```bash
  npx skills@latest add PicGo/skills
  ```
- **[DeepSeek Harness plugin](https://github.com/PicGo/dsh-plugin)**: install it in [dsh](https://github.com/deepseek-ai/deepseek-harness) and your agent can upload to your image host on its own.
  ```bash
  dsh plugin --profile web add @picgo/dsh-plugin
  ```

Both reuse the image hosts and plugins you already configured in PicGo—nothing to set up twice. Read more in [this post](https://picgo.app/blog/2026/picgo-deepseek-harness-plugin/).

### 🛠 Developer-friendly
- **HTTP API**: upload via HTTP requests (v2.2.0+), making it easy to integrate with other tools.
- **Open source**: fully open-source and transparent.
- **Great documentation**: detailed docs help you get started quickly. For plugin development, see the [PicGo-Core docs](https://docs.picgo.app/core/).

> There’s more to discover—development progress is tracked in [Projects](https://github.com/Molunerfinn/PicGo/projects).

If you’re new to PicGo, start with the [User Guide](https://docs.picgo.app/gui/guide/getting-started). If you run into issues, check the [FAQ](https://github.com/Molunerfinn/PicGo/blob/dev/FAQ.md) and closed [issues](https://github.com/Molunerfinn/PicGo/issues?q=is%3Aissue+is%3Aclosed).

## Download & Install

### Source · Link / Installation · Platform · Notes
- **Source**: GitHub Releases · **Link / Installation**: https://github.com/Molunerfinn/PicGo/releases · **Platform**: All · **Notes**: Downloads may be slow in mainland China
- **Source**: [Shandong University mirror](https://mirrors.sdu.edu.cn/) · **Link / Installation**: https://mirrors.sdu.edu.cn/github-release/Molunerfinn_PicGo · **Platform**: All · **Notes**: Thanks to the mirror for hosting
- **Source**: [Scoop](https://scoop.sh/) · **Link / Installation**: `scoop bucket add extras` & `scoop install picgo` · **Platform**: Windows · **Notes**: Thanks to @huangnauh and @Gladtbam
- **Source**: [Chocolatey](https://chocolatey.org/) · **Link / Installation**: `choco install picgo` · **Platform**: Windows · **Notes**: Thanks to @iYato
- **Source**: [Homebrew](https://brew.sh/) · **Link / Installation**: `brew install picgo --cask` · **Platform**: macOS · **Notes**: Thanks to @womeimingzi11
- **Source**: [AUR](https://aur.archlinux.org/packages/yay) · **Link / Installation**: `yay -S picgo-appimage` · **Platform**: Arch Linux · **Notes**: Thanks to @houbaron
- **Source**: [Nix](https://search.nixos.org/packages?channel=unstable&query=picgo&show=picgo) · **Link / Installation**: `nix-shell -p picgo` · **Platform**: Nix/NixOS · **Notes**: Thanks to @qrzbing

## Screenshots

![](https://raw.githubusercontent.com/Molunerfinn/PicGo/dev/assets/picgo-v3.gif)

![picgo-menubar](https://user-images.githubusercontent.com/12621342/34242310-b5056510-e655-11e7-8568-60ffd4f71910.gif)

## Development

> Currently tested on macOS and Windows only. Linux has not been fully tested.

If you want to learn, contribute, modify, or build PicGo yourself:

> For an Electron-vue learning series, see: [Electron-vue development](https://molunerfinn.com/tags/Electron-vue/)

1. Install Node.js and Git, and make sure you’re familiar with npm basics.
2. Clone the repo: `git clone https://github.com/Molunerfinn/PicGo.git` and enter the directory.
3. Install dependencies with `pnpm`. If you don’t have it yet, install it from the [pnpm website](https://pnpm.io/installation) first.
4. On macOS you’ll need Xcode; on Windows you’ll need Visual Studio.
5. For contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Development mode

Run `pnpm run dev` to start the dev workflow with hot reload. Note: dev mode can be unstable and the process may crash—if that happens:

```bash
ctrl+c # stop dev mode
pnpm run dev # restart
```

> On Windows, after dev mode starts, PicGo’s tray icon will appear in the bottom-right system tray area.

### Production build

To build release artifacts locally, run `pnpm run build`. After a successful build, the installer files will be generated under `dist`.

**Note**: If your network is unstable, `electron-builder` may fail to download Electron binaries. You can set an alternative mirror before building:

```bash
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
# On Windows: set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ (no quotes)
pnpm run build
```

Electron binaries are stored under `~/.electron/`. If you need to refresh them, delete that directory and rebuild.

## Related Projects

- [vs-picgo](https://github.com/PicGo/vs-picgo): PicGo for VS Code.
- [flutter-picgo](https://github.com/PicGo/flutter-picgo): mobile app (Android & iOS).
- [PicHoro](https://github.com/Kuingsmile/PicHoro): another mobile app compatible with PicGo config (Android only for now).
- [skills](https://github.com/PicGo/skills): official Agent Skills that teach AI to upload with PicGo.
- [dsh-plugin](https://github.com/PicGo/dsh-plugin): PicGo plugin for DeepSeek Harness.