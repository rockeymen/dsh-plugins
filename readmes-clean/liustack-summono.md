![Summono](https://raw.githubusercontent.com/liustack/summono/main/assets/banner.jpg)

# Summono

Install and launch DeepSeek Harness in one click.

🥇 The most foolproof DeepSeek Harness launcher 🥇

DeepSeek Harness (dsh) has no desktop app of its own and installs through a terminal. Summono gives it one. **Click the whale, and dsh is installed, running, and ready to chat** — no terminal, no commands, no setup. Claude Desktop and the Codex (ChatGPT) app launch from the same screen.

## Screenshots

The launchpad — one click on any icon:

![Summono launchpad](assets/screenshot-launchpad.png)

DeepSeek Harness running inside Summono:

![DeepSeek Harness running inside Summono](assets/screenshot-dsh.png)

## Talk to us

Issues are welcome any time: [open one](https://github.com/liustack/summono/issues/new), in English or Chinese. And come find me on X: **[@liustack](https://x.com/liustack)** — which harness should get one-click support next, what broke, what should come next. New releases land there first.

## Highlights

- **Installed and chatting in one click.** The whale icon covers everything: a private Node.js runtime, dsh itself, startup, and the chat UI opening right inside the app. Zero terminal, zero commands.
- **Official apps, direct.** Claude Desktop and the Codex (ChatGPT) app launch if installed, and install in one click if not — App Store-style progress ring included.
- **Fully compatible with a hand install.** The hosted dsh reuses the official state directory, so every tutorial on the internet still applies, and a copy you installed yourself keeps working untouched.
- **Free forever.** MIT. No paid tier, no "pro" features, no ads.

## Install

Download from [Releases](https://github.com/liustack/summono/releases): `.dmg` for Mac, `.exe` for Windows.

Mac builds are Developer ID signed and notarized by Apple — download, drag to Applications, double-click, done.

On Windows, if a blue SmartScreen prompt appears, click "More info" → "Run anyway".

v0.1 is verified end to end on macOS; Windows real-machine verification is next in line.

Developers can run from source:

```bash
pnpm install
pnpm dev
```

## Shameless plug

This project runs on LIUSTACK Skills: `shaping` before you build, `coding` while you build, `dig` when it breaks, `snapshot` when you hand off. Lighter than Superpowers, and stronger.

```bash
npx -y skills add liustack/vibemaster -g
```

⭐ If it helps, star [Summono](https://github.com/liustack/summono) and [VibeMaster](https://github.com/liustack/vibemaster). Stars are how the next developer finds them.

## Key ecosystem partners

The projects worth recommending in the DeepSeek Harness ecosystem.

- 👁️ **[ModLens](https://github.com/liustack/modlens)** — Plug-in vision for the text-only DeepSeek and GLM models: paste an image straight into the chat and it reads it.
  为纯文本 DeepSeek / GLM 模型补上视觉能力的外挂插件,图片直接粘贴进对话就能读。
- 🔎 **[ModSearch](https://github.com/liustack/modsearch)** — Plug-in web search, X search, and page fetch for models without native web access.
  为没有联网能力的模型补上网页搜索、X 搜索和页面抓取。

## Disclaimer

Provided as-is under the MIT License below. The author makes no warranty and gives no endorsement for any particular use. The AI apps and runtimes that Summono installs (DeepSeek Harness, Node.js, Claude Desktop, the Codex app, and others) belong to their vendors and are governed by their own terms, which you are responsible for.