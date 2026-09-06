# dsh-peak-pricing

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web plugin
that puts one line under the composer: which DeepSeek pricing period is in
force right now, how long it lasts, and what this session has cost so far.

```
4 轮 · 195 步 │ LLM 17m13s │ 首 token 平均 1.3s │ 缓存命中 100%  ·  TPS 117 tok/s
              ● 空闲时段 · 1:35:06 后进入高峰 · 本会话 ¥1.69
```

- **Green dot — off-peak.** A cheap moment to start a long run.
- **Orange dot — peak.** Everything costs exactly twice as much.
- **The countdown** is how long the current rate lasts, to the second.
- **The amount** is what this session has spent, each increment priced at the
  rate in force when it arrived.

Hover the row (or focus it with the keyboard) for the full breakdown: model,
current rates, the session's four token buckets, and the peak windows — plus a
sparkline of the cache-hit rate, one point per input-bearing increment on a
fixed 0–100% scale, capped at the most recent 120 points so long sessions keep
their shape. The trend lives in `localStorage` beside the running total and
survives a reload; as with the cost, a session's first reading after opening
is sampled whole rather than as a delta.

## Install

```bash
dsh plugin --profile web add dsh-peak-pricing
```

Restart `dsh web`, and the row is there. To confirm the plugin layer mounted:

```bash
dsh --profile web --dump-config | grep peak-pricing
```

Removal is the mirror image:

```bash
dsh plugin --profile web remove dsh-peak-pricing
```

## The price table

Per the official [price page](https://api-docs.deepseek.com/quick_start/pricing/),
DeepSeek prices by time of day: peak is 09:00–12:00 and 14:00–18:00 Beijing
time, **Monday through Friday**, and off-peak — everything else, including all
day Saturday and Sunday — is exactly half.

### Model · Period · Input (cache hit) · Input (cache miss) · Output
- **Model**: deepseek-v4-flash · **Period**: off-peak · **Input (cache hit)**: ¥0.05 · **Input (cache miss)**: ¥1.50 · **Output**: ¥4.50
- **Model**:  · **Period**: peak · **Input (cache hit)**: ¥0.10 · **Input (cache miss)**: ¥3.00 · **Output**: ¥9.00
- **Model**: deepseek-v4-pro · **Period**: off-peak · **Input (cache hit)**: ¥0.15 · **Input (cache miss)**: ¥4.50 · **Output**: ¥13.50
- **Model**:  · **Period**: peak · **Input (cache hit)**: ¥0.30 · **Input (cache miss)**: ¥9.00 · **Output**: ¥27.00
- **Model**: deepseek-v4-flash-vision-exp · **Period**: off-peak · **Input (cache hit)**: ¥0.05 · **Input (cache miss)**: ¥1.50 · **Output**: ¥4.50
- **Model**:  · **Period**: peak · **Input (cache hit)**: ¥0.10 · **Input (cache miss)**: ¥3.00 · **Output**: ¥9.00

Prices are CNY per million tokens. The table lives in
[`src/pricing.ts`](src/pricing.ts) as a plain constant — when DeepSeek
announces new numbers, that is the only thing to edit.

Images sent to `deepseek-v4-flash-vision-exp` are converted to tokens by size
and billed together with text input, so they flow through the same usage
buckets and need no special handling here.

The announcement scopes peak to weekdays and names no holiday exception, so no
holiday calendar is built in — the same weekday windows apply every week.
Times are computed from UTC with a fixed +8 offset (the PRC observes no
daylight saving), so the row is correct in any browser timezone.

### Other providers

Models billed outside DeepSeek's scheme live in a second table
(`FLAT_PRICE_TABLE` in [`src/pricing.ts`](src/pricing.ts)): one rate trio
around the clock, in the provider's own currency, optionally stepped in time.

### Model · Currency · Input (hit & miss) · Output · In force
- **Model**: z-ai/glm-5.3-flash · **Currency**: USD · **Input (hit & miss)**: $0.075 · **Output**: $0.25 · **In force**: now → 2026-09-09 16:00 UTC
- **Model**: z-ai/glm-5.3-flash · **Currency**: USD · **Input (hit & miss)**: $0.15 · **Output**: $0.50 · **In force**: after 2026-09-09 16:00 UTC

The first row is Z.AI's limited-time 50% discount (through September 9, 2026,
16:00 UTC); afterwards the model reverts to its list price — the resolver just
picks whichever time step is in force, so no migration is needed when the promo
ends. No cache split is published for this model, so both input buckets bill at
the single input price.

Because currencies differ, the accumulator keeps **one subtotal per currency**
and never sums across them: a session that used both reads `¥1.69 + $0.02`,
in the row itself and in the hover breakdown.

## How the cost is computed

The harness publishes one `tokenUsage` projection per session: four cumulative
buckets (`cacheReadTokens`, `uncachedInputTokens`, `cacheWriteTokens`,
`outputTokens`) with no timestamps. A cumulative total alone cannot say which
tokens were billed at which rate, so this plugin prices **increments**:

1. Each new reading is diffed against the previous one.
2. The difference is priced at the rate in force at that moment — which is when
   those tokens were actually billed.
3. The running total is kept in `localStorage`, keyed by session id, so a page
   reload continues the accounting instead of repricing the whole session at
   whatever rate happens to be current.

A session that runs across 17:55 → 18:05 is therefore billed as ten minutes of
peak plus five of off-peak, not fifteen minutes of either.

Two mappings worth stating explicitly:

- **`cacheReadTokens` bills as cache-hit input; `uncachedInputTokens +
  cacheWriteTokens` bills as cache-miss input.** The announcement prices input
  as hit-or-miss only, and a cache write *is* the miss that populated the cache.
- **The first reading of a session has no arrival times to price by**, so it is
  priced whole at the current rate. Everything after it is exact. Opening an
  old session mid-peak therefore over-estimates its history; the figure
  converges as the session continues.

If the active model is not in the table (another provider, or a DeepSeek model
the announcement does not price), the period and countdown keep working and the
amount is suppressed rather than guessed.

**This is an estimate for pacing your own work — your DeepSeek invoice is
authoritative.**

## How it is built

One package, both halves, the official plugin shape:

- `src/pricing.ts` — the pure core: table, window rule, bucket pricing.
  No React, no DOM. The host entry re-exports it, so a host-side consumer can
  price usage from the same table the row shows.
- `src/client/` — the browser half, mounted on the `conversation.composer.dock`
  slot (the seat the shipped stats line uses) at `order: 120`. It reads the
  active model through `ctx.modelDirectories` softly: no hard dependency, and
  the row degrades to period-only if that service is absent.
- `cordis.patch.yml` — the one row that inserts the plugin into a profile.

The browser bundle is built by `tsdown` into the client module loader's
factory form (`window.__ModuleLoader__.load({id, factory})`), with `react`,
`react/jsx-runtime` and every `@deepseek-ai/*` package left external — the
runtime serves those, and a second React copy would break hooks.

```bash
npm install
npm test        # vitest: window boundaries, bucket pricing, accumulation
npm run build   # tsc -b (declarations) + tsdown (host ESM + client bundle)
```

Local install from a tarball, the way this plugin was verified:

```bash
npm pack
dsh plugin --profile web add "file:$PWD/dsh-peak-pricing-<version>.tgz"
```

### UI language

The row's copy ships in `zh` (Simplified Chinese, matching DSH's own UI and
DeepSeek's announcement wording) and `en`, selected by the harness's language
setting. Both dictionaries are in
[`src/client/locales.ts`](src/client/locales.ts) — edit and rebuild to change
the wording (e.g. to 尖峰/離峰 in Traditional Chinese).

### Plays well with dsh-live-stats

`@linxin666/dsh-live-stats` flattens the composer dock into one non-wrapping
flex line to merge its TPS readout onto the official stats line. This plugin
injects a small stylesheet that lets that wrapper wrap and claims a full-width
basis for its own row, so the price lands on its own line underneath instead
of squeezing the stats. Without that plugin, the rule is inert.