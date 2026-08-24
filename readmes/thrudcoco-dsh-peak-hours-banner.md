<div align="center">

# dsh-peak-hours-banner

<p align="center">
  <img src="docs/preview_en.png" alt="Preview: red peak banner and green off-peak banner" width="720">
</p>


**Period-status banner plugin for the DeepSeek Harness (DSH) Web GUI**

Watch your balance during peak hours — take a break when it's quiet.

[![Stars](https://img.shields.io/github/stars/thrudcoco/dsh-peak-hours-banner?style=for-the-badge&logo=github&label=Stars)](https://github.com/thrudcoco/dsh-peak-hours-banner/stargazers)
[![Downloads](https://img.shields.io/github/downloads/thrudcoco/dsh-peak-hours-banner/total?style=for-the-badge&logo=github&label=Downloads)](https://github.com/thrudcoco/dsh-peak-hours-banner/releases)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
![dsh-plugin](https://img.shields.io/badge/tag-%23dsh--plugin-8b5cf6)
![platform](https://img.shields.io/badge/platform-DSH%20Web%20GUI-3964fe)
![version](https://img.shields.io/badge/version-v1.2.2)

English | [简体中文](README.zh-CN.md)

[About](#-about) · [Display rules](#%EF%B8%8F-display-rules) · [Install](#-install) · [Feedback](https://github.com/thrudcoco/dsh-peak-hours-banner/issues)

</div>

---

## 📖 About

**dsh-peak-hours-banner** keeps a permanent status banner at the top of the
chat area in the DSH Web GUI. Based on your computer's clock it splits the
day into "peak" and "off-peak" windows anchored on UTC+8, reminding
you to watch your API balance — or to take a break.

- 💰 **Cost awareness** — weekday peak windows explicitly remind you to watch your balance;
- 🍵 **Health reminder** — off-peak windows tell you to rest and keep a good balance;
- 🌏 **Timezone friendly** — judgement and the displayed range are both converted to your local timezone;
- 🔒 **Zero intrusion** — pure front-end: it never reads or uploads any conversation content;
- 🔁 **Persistent** — installed with the web profile, it survives harness restarts.

## 🖥️ Display rules

| Scenario | Banner shows |
|---|---|
| Weekdays · 09:00–12:00 (UTC+8) | 🔴 Peak hours now (09:00-12:00). Watch your balance usage. |
| Weekdays · 14:00–18:00 (UTC+8) | 🔴 Peak hours now (14:00–18:00). Watch your balance usage. |
| Weekdays · other times | 🟢 Off-peak hours now. Please rest and keep a good balance. |
| Weekends (UTC+8) | 🟢 Off-peak hours now. Please rest and keep a good balance. |

Details:

- Boundaries are **left-closed, right-open**: 9:00 and 14:00 sharp start a
  peak window; 12:00 and 18:00 sharp start an off-peak period.
- "Weekend" means the **UTC+8 day of week**; holidays are currently
  judged by the weekday they fall on.
- The time range in the text is rendered in **your local timezone** (e.g. a
  UTC-5 user sees 20:00–23:00).
- Bilingual zh/en text follows the DSH language setting and switches live.
- After crossing a boundary the banner switches within **≤15 seconds** — no
  page reload needed.

## 📦 Install

**Prerequisite**: [DeepSeek Harness](https://github.com/deepseek-harness/deepseek-harness)
installed, with the Web GUI started at least once (so the web profile exists).

### Option 1: one-line dsh install from npm (recommended)

```bash
dsh plugin --profile web add @thrudcoco/dsh-peak-hours-banner
```

One command: pulls the published bundle from the npm registry and registers
it with the web profile. Prebuilt artifacts ship in the package, so no local
build and no build-script authorization is needed.

> Installing straight from GitHub (`dsh plugin --profile web add
> github:thrudcoco/dsh-peak-hours-banner`) also works in principle, but some
> pnpm versions key git dependencies by repo name, which breaks plugin-row
> resolution — prefer npm or `link:`.

Developers can also install from a local checkout (rebuild `lib/` and it
takes effect on the next restart):

```bash
git clone https://github.com/thrudcoco/dsh-peak-hours-banner.git
dsh plugin --profile web add link:dsh-peak-hours-banner/packages/dsh-peak-hours-banner
```

### Option 2: PowerShell one-click script

Requires [Node.js](https://nodejs.org) ≥ 18.

```powershell
irm https://raw.githubusercontent.com/thrudcoco/dsh-peak-hours-banner/main/install.ps1 | iex
```

The script downloads the sources, builds `lib/`, and installs the bundle
through the official `dsh plugin --profile web add link:…` flow.

### Option 3: manual (from source)

```bash
git clone https://github.com/thrudcoco/dsh-peak-hours-banner.git
cd dsh-peak-hours-banner
node packages/dsh-peak-hours-banner/scripts/build-client.js          # build lib/
dsh plugin --profile web add link:"$PWD/packages/dsh-peak-hours-banner"
```

### Activate

**Restart the DSH process** after installing, open any session, and the
banner appears at the top center of the chat area.

### Uninstall

```bash
dsh plugin --profile web remove @thrudcoco/dsh-peak-hours-banner
```

Then restart the DSH process.

## ❓ FAQ

<details>
<summary><b>Why is my banner a different color than someone else's?</b></summary>

The banner converts your computer's clock into the UTC+8 windows. In
different timezones the same instant maps to a different UTC+8 wall time —
that is expected.
</details>

<details>
<summary><b>Do weekends ever show the peak warning?</b></summary>

No. UTC+8 Saturdays and Sundays are all-day off-peak (green);
holidays are currently judged by the weekday they fall on.
</details>

<details>
<summary><b>How long after a boundary does it switch?</b></summary>

≤15 seconds. A 15-second heartbeat watches for minute-boundary changes; even
if the tab is throttled or the machine sleeps, the correct state is picked up
as soon as it returns.
</details>

<details>
<summary><b>Does it collect any data?</b></summary>

No. The plugin only reads your local clock and renders text in your browser —
it performs no network requests at all.
</details>

## 🧱 Repository layout

```
dsh-peak-hours-banner/
├── install.ps1                     # PowerShell one-click installer
├── packages/dsh-peak-hours-banner/ # the installable bundle (plugin proper)
│   ├── cordis.patch.yml            #   composition patch: inserts the plugin row
│   ├── package.json                #   dsh.client declaration (platform: web)
│   ├── scripts/build-client.js     #   build: inline core logic → module-loader wrap
│   ├── src/index.js                #   host half (no-op stub)
│   ├── src/client/index.js         #   readable browser-half source
│   ├── lib/                        #   prebuilt artifacts (why github installs need no build)
│   └── README.md / README.zh.md    #   package-level English / Chinese notes
├── src/core.js                     # period logic as pure functions (Node-testable)
├── src/client.template.js          # client template for dynamic debugging
├── scripts/build-client.js         # build script for the dynamic-debug variant
└── test/                           # node:test suite (72 cases)
```

Build & test commands: see
[`packages/dsh-peak-hours-banner/README.md`](packages/dsh-peak-hours-banner/README.md#build--test).

## 📄 License

Released under the [Apache License 2.0](LICENSE).

## 👤 Creator

- Author: **[@thrudcoco](https://github.com/thrudcoco)**
- Licensed under **Apache License 2.0**: free to use, modify and distribute —
  please keep the license and attribution.
- Community project, not affiliated with DeepSeek. DeepSeek Harness and
  related names belong to their respective owners.

---

#dsh-plugin
