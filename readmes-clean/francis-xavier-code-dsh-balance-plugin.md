# 💰 DeepSeek Balance Monitor & Usage Stats

**A DeepSeek Harness (DSH) plugin** — balance monitoring · official top-up link · Miyu-style usage statistics · third-party plugin manager

[✨ Features](#-features) · [🖼 Screenshots](#-screenshots) · [📥 Install](#-install) · [⚙️ Configuration](#️-configuration) · [🎮 Usage](#-usage) · [🗑 Uninstall](#-uninstall) · [🏗 Architecture](#-architecture) · [❓ FAQ](#-faq)

## ✨ Features

### Module · Capability
- **Module**: **Balance monitoring** · **Capability**: Monitors DeepSeek API balance (CNY / USD dual balance pool) with parallel multi-account queries; auto-reads the DSH credential `DEEPSEEK_API_KEY` — **no manual entry needed**
- **Module**: **Low-balance alerts** · **Capability**: Independent CNY / USD thresholds (default ¥10 / $2, configurable); the balance bar turns red when below threshold
- **Module**: **One-click top-up** · **Capability**: Jumps straight to the official DeepSeek top-up page `platform.deepseek.com/top_up`, plus a usage-details page link
- **Module**: **Usage statistics** · **Capability**: 1:1 recreation of the [Miyu WebUI usage page](https://github.com/SHORiN-KiWATA/Miyu/tree/main/web): stat tiles / GitHub-contribution-style usage calendar / three-segment stacked trend bar chart / model consumption donut chart with detail table / recent 50 call records
- **Module**: **Performance metrics** · **Capability**: Turns · steps · LLM duration · tool-call duration · avg first-token latency · tok/s · cache hit rate
- **Module**: **Third-party plugin manager** · **Capability**: Lists unofficial (non-`@deepseek-ai`) web plugins: package name / local path / Bundle rev / dependencies, with a one-click "Open Directory" to locate source code
- **Module**: **Model tool** · **Capability**: Registers the `query_api_quota` tool — just ask "How much DeepSeek balance is left?" and get a balance summary

Charts use Miyu's chart / heat palettes (blue / gold / rose / purple + blue-purple heat scale) and auto-adapt to dark / light themes.

## 🖼 Screenshots

### Screenshot · Description
- **Screenshot**: ![Input preview](assess/输入框预览.png) · **Description**: Three icon entries on the right of the input toolbar (💰 Wallet / 📊 Usage / 🧩 Plugins) plus a persistent balance bar below
- **Screenshot**: ![Wallet settings](assess/钱包设置页面.png) · **Description**: Balance monitoring panel: balance table, low-balance alerts, account config, thresholds & refresh interval, top-up entry
- **Screenshot**: ![Usage stats top](assess/用量统计界面-顶部.png) · **Description**: Usage page top: range switcher, stat tiles, live performance metric bar, GitHub-style usage calendar
- **Screenshot**: ![Usage stats bottom](assess/用量统计界面底部.png) · **Description**: Usage page bottom: trend bar chart, model consumption details, call record details
- **Screenshot**: ![Plugin manager](assess/三方插件管理界面.png) · **Description**: Third-party plugin manager: stat badges, plugin list, "Open Directory" action

## 📥 Install

### Prerequisites

- **DeepSeek Harness** installed and running
- (Optional) DeepSeek API Key — get one at [platform.deepseek.com](https://platform.deepseek.com); if `DEEPSEEK_API_KEY` is already configured on this machine, the plugin **auto-reads it at startup — no manual input required**

### One-click install (recommended)

```bash
# Installs automatically (install deps → write compose patch → prompt restart)
curl -fsSL https://raw.githubusercontent.com/Francis-Xavier-code/dsh-balance-plugin/main/install.sh | bash
```

**Restart DeepSeek Harness** after installation — three icon buttons appear on the right of the input box. Use `DSH_PROFILE=<name>` to target another profile.

### Manual install (equivalent)

```bash
# 1. Install the dependency (use the github: source, not the bare package name — a third party owns a same-named package on npm)
dsh plugin --profile web add github:Francis-Xavier-code/dsh-balance-plugin

# 2. Append the plugin line to ~/.dsh/cordis.patch.yml (skip if already present)
- insert:
    - id: dsh-balance-plugin
      name: 'dsh-balance-plugin'

# 3. Restart DeepSeek Harness
```

## ⚙️ Configuration

Click the **wallet icon (💰)** on the right of the input toolbar to open the "Balance Monitor" panel:

### Setting · Description
- **Setting**: **Account list** · **Description**: Click "+ Add Account" to add; each account can have a name and API Key
- **Setting**: **API Key input** · **Description**: Enter the plaintext Key, or reference an environment variable like `$env:DEEPSEEK_API_KEY`; leaving an existing Key empty keeps it unchanged
- **Setting**: **Auto-read account** · **Description**: At startup, if the DSH credential `DEEPSEEK_API_KEY` is detected, an "Auto-read · DSH credential" account is created automatically
- **Setting**: **CNY / USD alert thresholds** · **Description**: Triggers a low-balance alert when the balance of the corresponding currency drops below the threshold (default ¥10 / $2)
- **Setting**: **Refresh interval** · **Description**: 30 seconds ~ 30 minutes (default 5 minutes); "Save Config" triggers an immediate refresh

> 🔒 Key security: API Keys are kept only in the plugin process memory on your machine and are never uploaded to any third party; the UI only shows masked values.

## 🎮 Usage

### Entry · Location · Description
- **Entry**: 💰 Wallet icon · **Location**: Right of the input toolbar · **Description**: Opens the balance monitor panel (config / balance / top-up)
- **Entry**: 📊 Bar-chart icon · **Location**: Right of the input toolbar · **Description**: Opens the usage statistics panel
- **Entry**: 🧩 Four-grid icon · **Location**: Right of the input toolbar · **Description**: Opens the third-party plugin manager panel
- **Entry**: Persistent balance bar · **Location**: Below the input box · **Description**: Real-time balance summary, ↻ refresh, top-up link; turns fully red on low balance
- **Entry**: `query_api_quota` tool · **Location**: Model calls · **Description**: Just ask "How much DeepSeek balance is left?"

All panels are centered overlays: click the backdrop or "✕ Close" to exit.

## 🗑 Uninstall

```bash
# One-click uninstall (removes dependency + cleans the compose patch)
curl -fsSL https://raw.githubusercontent.com/Francis-Xavier-code/dsh-balance-plugin/main/uninstall.sh | bash
```

Manual equivalent:

```bash
dsh plugin --profile web rm dsh-balance-plugin
# and remove the corresponding two lines from ~/.dsh/cordis.patch.yml
```

Restart DeepSeek Harness after uninstalling.

## 🏗 Architecture

```
Host (Node.js process)
├─ Balance query: shell runs curl → api.deepseek.com/user/balance (Bearer auth)
├─ Usage aggregation: real-time session/event listening + 90-day history scan (deduped by seq)
├─ Third-party plugins: clientModules.graph() + clientPath() + open -R to locate
├─ RPC routes: /bmon/api/get-state · refresh · recharge · set-config ·
│              get-usage · list-plugins · open-plugin-dir
└─ Model tool: query_api_quota

Client (browser)
├─ Entry: 3 SVG icon buttons on the right of the input toolbar
├─ Overlays: self-rendered fixed panels inside the component (no overlay slot dependency)
└─ Charts: Miyu chart/heat palettes, dark/light adaptive
```

## ❓ FAQ

**Q: Will the plugin still be there after a restart?**
A: Yes — static plugins are installed persistently and survive restarts. Manually configured account keys reset (the auto-read `DEEPSEEK_API_KEY` account needs no reconfiguration and restores automatically after restart).

**Q: I can't see the entry button at the bottom of the sidebar?**
A: The DSH sidebar bottom slot is exclusively occupied by the official Cordis panel plugin. This plugin's entry is fixed on the **right of the input toolbar** and does not depend on that slot.

**Q: Will my Key leak?**
A: No. Keys are kept only in the plugin process memory on your machine and the UI only shows masked values; neither the source code nor the README contains any secrets.

**Q: Balance query fails?**
A: Check the error hint in the panel: no Key configured (`API Key not configured`), missing environment variable (`Environment variable xxx not set`), invalid Key (401 error message), and handle accordingly.

**Q: No historical usage data?**
A: The plugin scans session events from the last 90 days at startup; "avg first token" only counts streaming data captured in real time after the plugin is running.

**Q: Why not use `dsh plugin add dsh-balance-plugin`?**
A: A third party owns a same-named package on npm (`dsh-balance-plugin@0.1.0`), so the bare name would install the wrong one. Use the one-click script or the `github:` source (see [Install](#-install)).

## 💬 QQ Community

  ![QQ Community](assess/qq-qun.png)

## 📄 License

[MIT](LICENSE) © 2026 [Black Cat (Francis-Xavier-code)](https://github.com/Francis-Xavier-code)