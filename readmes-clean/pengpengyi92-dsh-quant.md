# 🐳 dsh-quant — The Everything-Plugin Quant OS

🌐 **Site**: https://dsh-quant-site.pages.dev · ✅ Listed in [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) (one-click install via dsh-market)

> **AI-native & DSH-native quant toolkit for every quant aspect** — 59 tools · 6 domains
> (data / alpha / ML / risk / execution / ecosystem) · one end-to-end PDAT→PET
> research pipeline. **Methods open, secrets internal.**

## 🧩 Core Philosophy: Everything is a Plugin (quant edition)

dsh's philosophy is **everything is a plugin**; dsh-quant brings it to quant —
open-sourcing the internal five-team paradigm (**PDAT → PAAT → PCPT → PRT → PET**)
as **five pluggable modules**:

```
data plugin   dsh-data      market data / sources / quality  ← plug in Binance or your own data
alpha plugin  dsh-alpha     indicators / factors / eval      ← write your own alpha (internal alpha stays private)
model plugin  dsh-ml        backtests / ML/DL/RL framework   ← train your own models (internal research stays private)
risk plugin   dsh-risk      VaR / drawdown / options / bonds ← set your own risk limits
exec plugin   dsh-execution sim execution / fund / report    ← build your own trading system (paper or live)
```

- **What's open is the paradigm**: how modules compose, how contracts are defined
  (null alignment / no look-ahead / hand-computed tests), how results are validated —
  not the internal secrets
- **You fill it in**: product power = UI + strategies + data interfaces + DL/RL
  models + trading-system building, all self-assembled, all pluginized
- **Infinite self-evolution**: fill the framework with your modules → run paper/live
  → feed the ecosystem back — that's dsh-quant

Plugin call for proposals: [Issue #27 (five modules × many plugins)](https://github.com/pengpengyi92/dsh-quant/issues/27) — PDAT plugins, PET plugins, anything you can imagine 🐋

## 🤖 AI-Native Is Deliberate (design statement)

dsh-quant's primary consumer is the **agent (the model), not the human** — a
deliberate choice from day one:

- **Tool schemas are injected into the system prompt** — every contract (args /
  outputs / alignment rules) is written from the model's perspective
- **Equal-length null alignment** — outputs match input length; leading window
  positions are `null`, so the model aligns by index and never pads
- **Canonical JSON + render separation** — machines read structure, humans read prose
- **All isConcurrencySafe** — pure functions, no shared state; agents can call all
  59 tools in parallel without interference
- **Skill layer** — `skill/quant-research` lets the model load the workflow itself

Full statement: [Issue #14](https://github.com/pengpengyi92/dsh-quant/issues/14) "AI-native is deliberate".

## 🐍 Why Almost No Python?

A common question: a quant project without `.py` files? **Answer: 0 Python files,
21 TypeScript source files, zero runtime dependencies — deliberate:**

- dsh-quant is a **dsh plugin** running inside the harness's Node runtime: same
  process as the agent, composable by the Loader, reversible registration (HMR-safe)
  — TypeScript is the only natural choice
- Where Python is needed (akshare / tushare / baostock), use the **channel knowledge
  base** (`quant_data_guide`, 15 channels): dsh ships shell / subprocess capabilities,
  so the agent decides whether to spawn Python — dsh-quant carries no runtime
- All numerical methods (indicators / backtests / options / bonds) are **pure
  functions with hand-computed baselines**: zero deps, offline-verifiable,
  `npm test` green anywhere

One goal: **build the most usable AI-native quant repo** 🐋

**59 `quant_*` tools · 6 domains · 215 unit tests · zero runtime deps**. Full positioning: pinned [Issue #9](https://github.com/pengpengyi92/dsh-quant/issues/9).

## 🤖 For visiting agents

Agents landing on this repo: start at [AGENTS.md](AGENTS.md) (root-level, auto-read
by Copilot / Claude Code / dsh), then the closed-loop example
[plugin/CASE_STUDY.md](plugin/CASE_STUDY.md) or [Discussion #38](https://github.com/pengpengyi92/dsh-quant/discussions/38),
and the one-glance contract [mcp/AGENT_GUIDE.md](mcp/AGENT_GUIDE.md).

## Quick Install (dsh users)

```sh
npm i dsh-quant
```

Add one line to your cordis.yml:

```yaml
- name: 'dsh-quant'
```

59 tools auto-register — indicators / backtests / factors / risk / fund simulation /
ecosystem metrics out of the box. One `quant_research_pipeline` runs the whole
PDAT→PET chain. ML/DL knowledge: [docs/ML_GUIDE.md](docs/ML_GUIDE.md);
executable demo: `npx tsx demos/ml-workflow.ts`.

## 🚀 Product Experience: Three Minutes to a Full Quant Pipeline

Right after install, experience the complete PDAT→PET flow (BTC public data +
simple strategy + backtest + paper trading):

```
data(quant_market_fetch) → quality(quant_data_quality) → factors(quant_factor_evaluate)
→ backtest(quant_backtest) → metrics(quant_metrics) → risk(quant_risk)
→ drawdown(quant_drawdown) → paper sim(quant_execute_sim) → fund sim(quant_fund)
→ report(quant_report)
```

One-liner: `quant_research_pipeline(symbol=BTCUSDT, limit=120)` returns everything
in one call.

Then plug **your own plugins** into each module (data sources / alpha / models /
risk / execution — everything is a plugin, proposals at Issue #27).

Five-step walkthrough with commentary: [docs/ONBOARDING.md](docs/ONBOARDING.md) ·
Agent one-glance guide: [mcp/AGENT_GUIDE.md](mcp/AGENT_GUIDE.md)

## 🖥️ UI Workbench (dsh-quant-ui)

![dsh-quant UI](demos/ui-demo-preview.png)

[dsh-quant-ui](https://github.com/pengpengyi92/dsh-quant-ui): candlesticks + MA
overlays + trade markers, equity curves, fund NAV / management-fee / performance-fee
cards, metric selector — plus a swimming chibi whale 🐋 (click the title 3 times).

Live demo: https://dsh-quant-ui.pages.dev

## ⌨️ CLI (dsh-quant terminal)

Zero-dependency readable terminal (pure Node + ANSI, same philosophy as the
P-Research CLI). Browse the research columns and live market data without a
browser:

```bash
node cli/main.mjs repo                      # 59 tools · 6 domains
node cli/main.mjs history                   # 53 firm archives index
node cli/main.mjs history citadel           # one firm's archive (rendered)
node cli/main.mjs history --reports         # ANALYSIS / TIMELINE / LINEAGE / BANK_LINEAGE
node cli/main.mjs history --search 高频      # cross-archive search
node cli/main.mjs kline BTCUSDT --limit 20  # colored OHLC table + stats
node cli/main.mjs browse                   # interactive TUI: arrow-key firm browser
```

After `npm install -g .`, the commands shorten to `dsh-quant repo`,
`dsh-quant history citadel`, etc.

## Tools

### Tool · Parameters · Canonical output · First valid index
- **Tool**: `quant_data_compare` · **Parameters**: `dataType` (e.g. "financials"/"daily bars") · **Canonical output**: `{ dataType, channels: [{ name, cost, covers, bestFor }] }` (covering first) · **First valid index**: —
- **Tool**: `quant_data_advice` · **Parameters**: `dataType` + `budget` (free/low/institutional) + `purpose` (research/backtest/official) · **Canonical output**: `{ recommendations: [{ rank, name, reason }] }` (decision-tree ranked) · **First valid index**: —
- **Tool**: `quant_series_stats` · **Parameters**: `values: number[]` · **Canonical output**: `{ count, mean, std, min, max, median, skew, kurtosis, autocorr1, annualizedVol, totalReturnPct }` · **First valid index**: — (first step after fetching)
- **Tool**: `quant_var_backtest` · **Parameters**: `returns` + `varSeries` + `confidence=0.95` · **Canonical output**: `{ failures, expected, lrStat, pValue, passed, periods }` (Kupiec POF test) · **First valid index**: — (the ground truth for VaR models)
- **Tool**: `quant_option` · **Parameters**: `spot` + `strike` + `timeToMaturity` + `riskFreeRate` + `type` + exactly one of `volatility`/`price` · **Canonical output**: `{ price, impliedVolatility, delta, gamma, vega, theta, rho, … }` · **First valid index**: — (Optiver-inspired: BS pricing + five greeks + IV solve)
- **Tool**: `quant_volatility` · **Parameters**: `close: number[]` + `annualization=252` · **Canonical output**: `{ annualized, perPeriod, n, logReturns(aligned) }` · **First valid index**: — (realized vol; the RV-vs-IV research entry)
- **Tool**: `quant_bond` · **Parameters**: `couponRate` + `periodsToMaturity` + `paymentsPerYear?` + exactly one of `ytm`/`price` · **Canonical output**: `{ price, yieldToMaturity, macaulayDuration, modifiedDuration, convexity, dv01, … }` · **First valid index**: — (FICC link: pricing/duration/convexity/DV01, textbook discounting)
- **Tool**: `quant_drawdown` · **Parameters**: `equity: number[]` · **Canonical output**: `{ underwater(aligned), maxDrawdownPct, currentDrawdownPct, periods(peak/trough/recovery/depth/duration), ongoing }` · **First valid index**: — (drawdown episode analysis)
- **Tool**: `quant_resample` · **Parameters**: `candles` + `period` (week=7 bars/month=30 bars) · **Canonical output**: `{ candles }` (OHLCV aggregation, 24/7 markets) · **First valid index**: —
- **Tool**: `quant_report` · **Parameters**: strategy/metrics/risk/factor/fund (module outputs) · **Canonical output**: `{ report }` (Markdown research report) · **First valid index**: — (R&D conclusion assembly)
- **Tool**: `quant_repo_stats` · **Parameters**: `owner` + `repo` · **Canonical output**: `{ stars, forks, watchers, openIssues, openPullRequests, topics, latestRelease, … }` (public GitHub API, no credentials) · **First valid index**: — (ecosystem data)
- **Tool**: `quant_npm_stats` · **Parameters**: `pkg` · **Canonical output**: `{ latest, weeklyDownloads, monthlyDownloads, description, … }` (npm registry + downloads API) · **First valid index**: — (ecosystem data)
- **Tool**: `quant_oss_pulse` · **Parameters**: `stars` + `downloadsWeekly?` + `starsPrevious?` + `openIssues?` + `openPullRequests?` + `daysSinceRelease?` · **Canonical output**: `{ score(0-100), grade(A-D), components, suggestions, summary }` · **First valid index**: — (open-source influence score; missing inputs score neutral 50)
- **Tool**: `quant_stress_test` · **Parameters**: `weights` + `betas` + `assetVolsPct` + `correlation=0.6` · **Canonical output**: `{ weights, scenarioLossesPct, worstScenario, maxLossPct, portfolioVolPct, notes }` · **First valid index**: — (portfolio loss under crash/liquidity/vol scenarios)
- **Tool**: `quant_risk` · **Parameters**: `returns` (decimal series) + `benchmarkReturns?` + `confidence=0.95` · **Canonical output**: `{ var95, cvar95, downsideDeviation, maxDrawdownPct, beta, alpha, informationRatio, trackingError, periods }` · **First valid index**: — (core risk module)
- **Tool**: `quant_fund` · **Parameters**: `equityCurve` + `initialCapital=1e8` + `managementFeeRate=0.02` + `performanceFeeRate=0.2` · **Canonical output**: `{ initialCapital, finalNavNet, finalAum, peakNav, peakAum, gross/netReturnPct, fees, navNet }` · **First valid index**: — (quant hedge-fund sim: NAV 1.00 start, daily mgmt fee, 20% high-water-mark performance fee)
- **Tool**: `quant_metrics` · **Parameters**: `equityCurve` + `trades?` · **Canonical output**: `{ totalReturnPct, maxDrawdownPct, sharpe, annualizedVol, calmar, sortino, winRate, profitFactor, avgPeriodReturnPct, tradeMetrics }` (required trio: return/drawdown/sharpe) · **First valid index**: — (METRIC_CATALOG for UI pickers)
- **Tool**: `quant_chart` · **Parameters**: `kind` (candles/series/annotations) + matching data · **Canonical output**: structured chart data (dsh-chart protocol: candles+overlays+markers / multi-series / annotation views) · **First valid index**: — (UI-route data plane)
- **Tool**: `quant_execute_sim` · **Parameters**: `close` + `orders[{index, side, quantity?/valueFraction?}]` + `initialCash?` + `feeRate?` + `slippageBps?` + `latencyBars?` · **Canonical output**: `{ fills, equityCurve, finalEquity, totalReturnPct, totalFee, totalSlippageCost, tradeCount, unfilledCount, cash, position }` · **First valid index**: — (execution framework, no live trading)
- **Tool**: `quant_trading_cost` · **Parameters**: `quantity` + `price` + `commissionRate=0.001` + `spreadBps=5` + `annualVolPct=30` + `dailyAdv?` + `participationRate=0.01` · **Canonical output**: `{ totalCostBps, commissionBps, slippageBps, impactBps, notional, notes }` · **First valid index**: — (commission + slippage + market impact)
- **Tool**: `quant_trade_quality` · **Parameters**: `fills` (from quant_execute_sim) + `unfilledOrders?` + `holdingPeriodBars?` · **Canonical output**: `{ orders, fills, fillRate, totalSlippageCost, avgSlippageBps, avgHoldingBars, buys, sells, avgFillValue, notes }` · **First valid index**: — (execution quality: sim → live expectations)
- **Tool**: `quant_research_pipeline` · **Parameters**: `symbol?` + `interval?` + `limit?` + `provider?` + `candles?` + strategy/fund params · **Canonical output**: `{ candles, quality, stats, metrics, risk, drawdown, fund, factor, report, charts }` · **First valid index**: — (one-call PDAT→PET research)
- **Tool**: `quant_factor_evaluate` · **Parameters**: `factorValues` + `forwardReturns` (factor[i] predicts ret[i+1]) + `quantiles=5` + `window=20` + `decayHorizons=5` · **Canonical output**: `{ ic, rankIc, icDecay, icir, icSeries, quantileReturns, longShort, turnover, autocorr1, n }` (alphalens set + RankIC/IC decay) · **First valid index**: —
- **Tool**: `quant_factor_neutralize` · **Parameters**: `factorValues` + `groups?` + `styleFactors?` + `method?` · **Canonical output**: `{ values(standardized), method, groupCount, styleCount, rSquared }` · **First valid index**: — (group z-score / OLS residual neutralization)
- **Tool**: `quant_walk_forward` · **Parameters**: `returns` + `features[][]` + `trainWindow` + `testWindow` + `step?` · **Canonical output**: `{ predictions(null-aligned), oosIc, oosRankIc, oosCount, windows, trainR2Mean }` · **First valid index**: — (rolling train / out-of-sample, no look-ahead)
- **Tool**: `quant_rebalance_schedule` · **Parameters**: `driftPerPeriod` + `costPerRebalance` + `maxFrequency=60` · **Canonical output**: `{ frequencies, totalCosts, bestFrequency, bestCost, costBreakdown, notes }` · **First valid index**: — (drift vs cost: optimal rebalance frequency)
- **Tool**: `quant_parameter_sensitivity` · **Parameters**: `baseValue` + `range=0.2` + `steps=9` + `metricValues?` · **Canonical output**: `{ paramName, values, metricValues, baseValue, robustness, bestValue, bestMetric, worstMetric, notes }` · **First valid index**: — (grid robustness: plateau vs needle-sharp)
- **Tool**: `quant_linear_model` · **Parameters**: `X(samples×features)` + `y` + `lambda?` + `predictX?` + `yTest?` · **Canonical output**: `{ intercept, weights, lambda, trainR2, n, predictions?, testR2?, testIc? }` · **First valid index**: — (standalone OLS/Ridge fit & predict)
- **Tool**: `quant_factor_correlation` · **Parameters**: `factors` (equal length) + `factorNames?` + `threshold=0.7` · **Canonical output**: `{ factorNames, correlationMatrix, highCorrelationPairs, meanAbsCorrelation, effectiveFactorCount, notes }` · **First valid index**: — (factor redundancy: dedupe before combine)
- **Tool**: `quant_factor_combine` · **Parameters**: `factors: number[][]` (equal length) + `weights?` · **Canonical output**: `{ signal(rank 0..1), effectiveWeights, factorCount }` · **First valid index**: — (z-score weighting + cross-sectional ranking)
- **Tool**: `quant_ic_decay` · **Parameters**: `factor` + `returns` (same length) + `maxHorizon=10` · **Canonical output**: `{ horizons, icByHorizon, halfLife, bestHorizon, peakIc, peakHorizon, signalType, notes }` · **First valid index**: — (IC decay: signal shelf-life → rebalance frequency)
- **Tool**: `quant_layered_backtest` · **Parameters**: `factor` + `returns` (time×asset matrices) + `layers=5` + `horizon=5` + `feeRate=0.001` · **Canonical output**: `{ layers, topEquity, bottomEquity, longShortEquity, topReturnPct, bottomReturnPct, longShortReturnPct, rebalances, layerMeanReturnPct, notes }` · **First valid index**: — (quantile-layer backtest: factor → strategy sketch)
- **Tool**: `quant_series_quality` · **Parameters**: `values: number[]`, `jumpThreshold=0.2` · **Canonical output**: `{ count, missingCount, zOutliers, jumps, longestConstantRun, healthy }` · **First valid index**: — (series-level quality)
- **Tool**: `quant_data_annotate` · **Parameters**: `values: number[]`, `jumpThreshold=0.2` · **Canonical output**: `{ count, annotations: [{index, label, severity, detail}], summary }` · **First valid index**: — (point-level labeling, a tribute to Scale AI)
- **Tool**: `quant_data_quality` · **Parameters**: `candles` (quant_market_fetch output) · **Canonical output**: `{ count, highBelowLow, nonPositive, timeNotIncreasing, timeGaps, extremeMoves, healthy }` · **First valid index**: — (pre-analysis health check)
- **Tool**: `quant_deflated_sharpe` · **Parameters**: `observedSharpe` + `numPeriods` + `numTrials=1` + `skewness?` + `kurtosis?` · **Canonical output**: `{ observedSharpe, minSignificantSharpe, deflatedSharpe, significant, pValue, notes }` · **First valid index**: — (Bailey & López de Prado overfitting-adjusted Sharpe)
- **Tool**: `quant_data_pit` · **Parameters**: `values: (number\ · **Canonical output**: null)[]` + `channels?` · **First valid index**: `{ healthScore, pit{pass, lookAheadIndices, notes}, survivorship{continuous, gaps, tailTruncated}, channels[] }` · — (AI-infra quality: point-in-time / survivorship / channel reliability)
- **Tool**: `quant_channel_guide` · **Parameters**: `channel` (e.g. "akshare") + `check?` + `hasCredentials?` · **Canonical output**: `{ channel, displayName, steps[], prerequisites[], example, fallback, readiness? }` · **First valid index**: — (agent-ready channel access guide + readiness check)
- **Tool**: `quant_data_guide` · **Parameters**: `query` (channel name/data type, e.g. "tushare"/"financials") or `channel` (exact name) · **Canonical output**: `{ query, results: [{ name, url, cost, dataTypes, setup, t