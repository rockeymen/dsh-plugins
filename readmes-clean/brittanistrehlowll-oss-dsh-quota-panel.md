# dsh-quota-panel

Provider quota / balance status widget for the **dsh web surface** (DeepSeek
Harness).

A zero-dependency host plugin: for every configured provider it registers one
server-side proxy route `/api/quota/` — the API key is resolved through the
credentials seam and **never reaches the browser** — then injects a small
Harness-native status widget (bottom-right) with two sizes:

- **Collapsed (default)** — a minimal glanceable capsule: one independent
  "status dot + value" pair per account (e.g. `● ¥58.36 · ● 45%`), no text
  labels — only the affected account's dot changes color. Click to expand.
- **Expanded** — the full card: "模型额度" header with refresh/collapse
  buttons, then one structured row per provider (status dot, name, primary
  value, secondary line, progress bar for usage-style providers). The collapse
  button shrinks it back.

Both sizes auto-refresh (paused while the page is hidden; the refresh button
spins while a manual refresh runs and re-entrant clicks are ignored).

In the capsule, usage percentages are battery-colored (green when healthy,
amber when tight, red when critical), matching their independent dot; balance
values are tinted only when their own state warns or errors.

The widget is styled with the Harness design tokens (`--dsw-alias-*`,
`--dsw-static-*`, `--dsw-shadow-*`, `--dsw-font-*`) and falls back to sensible
values when tokens are absent, so it follows the product theme (light/dark)
instead of carrying its own palette.

## Screenshots

Collapsed capsule (light / dark):

![Capsule (light)](docs/capsule-light.png)
![Capsule (dark)](docs/capsule-dark.png)

Expanded card (light / dark):

![Panel (light)](docs/panel-light.png)
![Panel (dark)](docs/panel-dark.png)

Full page, collapsed capsule (light / dark):

![Full page, capsule (light)](docs/screenshot-light.png)
![Full page, capsule (dark)](docs/screenshot-dark.png)

## Install

```sh
dsh plugin --profile web add "github:brittanistrehlowll-oss/dsh-quota-panel"
# restart `dsh web` (bundle layers apply at boot)
```

The package declares `dsh.bundle.patch`, so `dsh plugin add` activates it as a
profile layer automatically.

## Configuration

Each provider is one entry under `providers`. Two renderers ship:

### format · endpoint shape · row
- **format**: `deepseek-balance` · **endpoint shape**: `{ "balance_infos": [{ "currency", "total_balance", "granted_balance", "topped_up_balance" }] }` · **row**: `¥58.36` + 余额充足/正常/紧张/建议充值
- **format**: `opencode-usage` · **endpoint shape**: `{ "usage": { "rolling"\ · **row**: "weekly"\ · "monthly": { "percent", "resetsAt" } } }` · `五 10% · 周 45% · 月 22%` + progress bar + 当前最高占用

Override the shipped defaults in your profile's `cordis.patch.yml`:

```yaml
- id: quota-panel
  config:
    refreshMs: 30000
    providers:
      - id: deepseek
        label: DeepSeek
        credential: DEEPSEEK_API_KEY
        endpoint: https://api.deepseek.com/user/balance
        format: deepseek-balance
        balanceTiers: { critical: 10, warn: 20, healthy: 50 }
      - id: opencode-go
        label: OpenCode Go
        credential: OPENCODE_GO_API_KEY
        endpoint: https://opencode.ai/zen/go/v1/usage
        format: opencode-usage
        windowLabels: { rolling: 五, weekly: 周, monthly: 月 }
        warnPercent: 70
        errorPercent: 90
```

Fields:

### field · meaning · default
- **field**: `id` · **meaning**: route id (`/api/quota/`), `^[a-z0-9-]+$` · **default**: required
- **field**: `label` · **meaning**: provider name on the card · **default**: required
- **field**: `credential` · **meaning**: credential reference (`$DSH_HOME/.credentials.yaml` or env) · **default**: required
- **field**: `endpoint` · **meaning**: quota JSON endpoint, GET with `Authorization: Bearer <key>` · **default**: required
- **field**: `format` · **meaning**: row renderer · **default**: `deepseek-balance`
- **field**: `balanceTiers` · **meaning**: (deepseek-balance) `{critical, warn, healthy}` levels · **default**: `{10, 20, 50}`
- **field**: `lowBalance` · **meaning**: legacy alias for `balanceTiers.warn` · **default**: —
- **field**: `windowLabels` · **meaning**: (opencode-usage) `{rolling, weekly, monthly}` · **default**: `{滚, 周, 月}`
- **field**: `warnPercent` / `errorPercent` · **meaning**: (opencode-usage) thresholds · **default**: 70 / 90
- **field**: `refreshMs` · **meaning**: auto-refresh interval · **default**: 60000

### DeepSeek balance levels

With the default `balanceTiers {critical: 10, warn: 20, healthy: 50}`:

### balance · state · secondary line
- **balance**: `<= 10` · **state**: error (red dot + value) · **secondary line**: 建议充值
- **balance**: `10 < x <= 20` · **state**: warn (amber) · **secondary line**: 余额紧张
- **balance**: `20 < x <= 50` · **state**: ok · **secondary line**: 余额正常
- **balance**: `> 50` · **state**: ok · **secondary line**: 余额充足

### OpenCode usage states

`high = max(rolling, weekly, monthly)`:

### usage · state
- **usage**: `< warnPercent` · **state**: ok (green dot, DeepSeek-blue progress)
- **usage**: `>= warnPercent` · **state**: warn (amber dot + progress)
- **usage**: `>= errorPercent` · **state**: error (red dot + progress)

## Security

- API keys are resolved server-side via `ctx.credentials` and only used in the
  server-to-provider request; the browser only talks to `/api/quota/`.
- The injected card builds DOM with `createElement`/`textContent` only; API
  response values never pass through `innerHTML`. Technical errors (401,
  timeout, credential missing) go into `title` hover text, not the card body.

## Local development

```sh
# Regenerate demo pages docs/demo.html + docs/demo-dark.html
node scripts/gen-demo.mjs
# Headless screenshots via Chrome DevTools Protocol
node scripts/shoot.mjs both
# Verify the rendered DOM of a demo page
node scripts/verify.mjs [dark]
# Syntax + content checks for the injected page script
node scripts/test-page-script.mjs
```