# 

### AI argues. Code settles. The losses stay on the page.

Install the decision intelligence behind this live Hong Kong + US desk into any agent, in any harness — OpenClaw, Claude Code, Codex, DeepSeek Harness, or your own runner. Evidence, opposition, deterministic reconciliation, and outcome-linked improvement; the harness around the model is yours to pick and yours to change.

  ![clawock — portable investment decision workflows for any external AI agent, proven on a live HK and US desk](https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/social-card.png)

<sub>“The market doesn't care how confident the model was.”</sub>

<sub>Real positions, real P&L, graded in the open. Previews refresh weekly; the live dashboard updates through the trading day.</sub>

## What this is

clawock is an **agent-native, harness-agnostic investment decision-workflow
plugin kit with a verifiable harness**. OpenClaw, Hermes, Claude Code, Codex,
DeepSeek Harness, or another external runtime owns the model call,
conversation, memory, planning, tools, permissions, and credentials. clawock
installs the reusable workflow that certifies evidence, forces an opposing
case, validates money and FX, links outcomes, and keeps every improvement
proposal reviewable and reversible. Swap harnesses and the decision contract
does not move: the loop is files and a CLI — see
[`examples/harness-agnostic/`](https://github.com/KCNyu/clawock/blob/master/examples/harness-agnostic/README.md) for the
same run driven from a pure CLI, an OpenClaw skill, a Claude Code instruction, a Codex AGENTS.md,
and a DeepSeek Harness agent.

It installs from PyPI — `pip install clawock` — and
[runs on your own book](#run-it-on-your-own-book) without this repository.

This repository is also the first continuously running proof: a disciplined,
self-grading AI investing experiment on a real Hong Kong + US portfolio — not a
get-rich bot, and not a copy-trading service.

A multi-agent desk monitors a real brokerage account with separate Hong Kong and US books, debates the evidence, and proposes trades; execution stays with the account owner. The product is the live record: real positions, an accumulating decision history, and a public scorecard. The model proposes; Python owns the prices, the risk limits, the ledger, the settlement, and the grading.

### What makes it different

- **A workflow plugin, not another agent — and not another harness.** The external runtime keeps its model, chat, memory, skills engine, tool loop, and permissions; clawock makes the investment-decision contract portable across runtimes and across harnesses. The harness debate (OpenClaw vs Codex vs DeepSeek Harness) is a debate clawock does not participate in.
- **The loop continues after the answer.** Evidence, the opposing case, thesis,
  decision, execution, and observed outcome share one lineage. Measured results
  can propose bounded parameter changes, but never silently rewrite strategy.
- **Real money, graded in public.** One live Hong Kong + US brokerage account, with a public scorecard that keeps every eligible result — the losses included, and the fact that the active calls haven't beaten buy-and-hold.
- **The model can't grade itself.** LLMs propose trades; Python settles them and computes the scorecard.
- **One thesis, one episode.** Repeated opinions on the same thesis count once. Each episode is settled from canonical vendor bars, with declared gap-fill rules when a session is missing.
- **The ledger has to reconcile.** A money-conservation check runs before every push; if cash, positions, and P&L don't balance, nothing is published.
- **Built to keep running.** Scheduled Hong Kong and US sessions produce bilingual briefs and refresh the live dashboard through the trading day.

## How it works

The product boundary is simple: the external agent reads and reasons; clawock
owns the portable decision workflow and the deterministic truth around it.

![clawock product architecture — external runtimes own models, conversation, memory and tools while the package supplies portable workflows, certified context, deterministic reconciliation, evaluation and bounded improvement](https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/product-architecture.svg)

The KCNyu deployment then applies that product boundary to one live portfolio.
This second diagram is the deployed KCNyu desk, not the reusable package boundary.

![KCNyu live-desk architecture — Python builds reconciled market context, OpenClaw agents debate the trade, clawock contracts gate the decision, and a public scorecard closes the loop](https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/architecture.svg)

Every trading day the system pulls fresh prices, FX, volatility, earnings and macro context plus news and social sentiment; hands that normalized context to a multi-agent debate; applies deterministic risk, schema, and ledger gates in Python; delivers a brief to WeChat; and updates the public dashboard.

## The information layer

Reading the market is most of what the LLM does, so the widest part of the system is data collection. The repository catalogs **41 fetch and compute modules across 8 layers**, with **bilingual Hong Kong + US coverage** — live quotes, SEC + Eastmoney filings, capital flow, earnings calendars, macro (VIX / DXY / 10Y), Reddit and news sentiment, and market-moving social feeds. Each brief consumes the subset relevant to that market and session. Collection stays broad; the decision layer stays constrained.

![clawock information flow — eight layers of fetch and compute modules are assembled by a deterministic Python preflight into a fingerprinted context.json; the LLM reads the file and writes its analysis; Python postflight validates and settles before publish](https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/information-flow.svg)

### Layer · Modules · Primary sources
- **Layer**: 1 · Market · **Modules**: 7 · **Primary sources**: Tencent · Yahoo · Eastmoney · Polygon
- **Layer**: 2 · Fundamentals & filings · **Modules**: 3 · **Primary sources**: SEC EDGAR · Eastmoney datacenter · HKEX
- **Layer**: 3 · Capital flow · **Modules**: 1 · **Primary sources**: Eastmoney push2his
- **Layer**: 4 · News & catalysts (bilingual) · **Modules**: 5 · **Primary sources**: Eastmoney · Finnhub · Google News · exchange filings
- **Layer**: 5 · Macro & sentiment · **Modules**: 3 · **Primary sources**: Yahoo · Reddit · CNN · social feeds
- **Layer**: 6 · Quant & risk · **Modules**: 9 · **Primary sources**: deterministic math over price history
- **Layer**: 7 · Book & FX integrity · **Modules**: 6 · **Primary sources**: Frankfurter · the reconciliation ledger · local invariants
- **Layer**: 8 · Backtest & calibration · **Modules**: 7 · **Primary sources**: local snapshots + canonical bars

The fetch layer degrades gracefully: every live Eastmoney call routes through **one throttled gateway**, critical paths (quotes, FX) use **multi-source fallback**, and an empty fetch **keeps the prior value** instead of overwriting a good series with a blank. Public sources include Tencent, stooq, yfinance, Frankfurter, SEC EDGAR, Finnhub, Nasdaq, Eastmoney, Polygon, Alpha Vantage, Reddit, and Google News — full command and provider catalog in [the command reference](https://github.com/KCNyu/clawock/blob/master/docs/reference/commands.md), whose inventory is generated from the same registries this table is checked against. Which module sits in which layer is itself an artifact — [`config/information-layers.json`](https://github.com/KCNyu/clawock/blob/master/config/information-layers.json), where every packaged command is either in a layer or listed with the reason it is not collection — and CI checks the table above against it, so a module that moves cannot leave its count standing.

### What each run actually receives

Collection is broad, but no run gets everything. Each scheduled job's preflight assembles only the blocks that job can act on, writes them to a context file, and the model reads that file rather than fetching for itself.

```
sources ──► preflight (Python, deterministic) ──► context.json ──► LLM prose ──► postflight (Python) ──► publish
```

###  · Pre-open brief · Open / midday / afternoon / close · Intraday check-in
- **When** · **Pre-open brief**: 08:00 HKT, weekdays · **Open / midday / afternoon / close**: HK 09:30 · 12:00 · 13:30 · 16:00 · US open and close · **Intraday check-in**: every 30 min while a market is open
- **Blocks** · **Pre-open brief**: 39 · **Open / midday / afternoon / close**: 16 · **Intraday check-in**: 28
- **Position truth** · **Pre-open brief**: holdings, book totals, concentration, leverage look-through · **Open / midday / afternoon / close**: fresh quote block · **Intraday check-in**: fresh quote block
- **Risk** · **Pre-open brief**: guardrail, discipline ledger, β/vol/drawdown, breakeven math · **Open / midday / afternoon / close**: risk section only when signals demand it · **Intraday check-in**: signal counts and detail
- **Signals** · **Pre-open brief**: quant factors and their hit-rate review, cross-sectional factor, peer residual, T+0 setups · **Open / midday / afternoon / close**: peer/sector scan · **Intraday check-in**: peer/sector scan, T+0 setups, anomaly flags, entry setups and early-trend candidates re-run on the open bar, price-surface opportunity radar
- **News and events** · **Pre-open brief**: evidence graph, Chinese-language company news, catalyst calendar, macro, Reddit and social feeds · **Open / midday / afternoon / close**: catalyst probe on flagged names · **Intraday check-in**: catalyst probe on flagged names
- **Research state** · **Pre-open brief**: thesis registry, research work queue (reviews due, overdue promises, ungated positions) · **Open / midday / afternoon / close**: thesis and red lines for flagged names · **Intraday check-in**: thesis and red lines for flagged names
- **History** · **Pre-open brief**: retrospective, decision metrics, reflections, data-integrity report · **Open / midday / afternoon / close**: — · **Intraday check-in**: heartbeat slot state
- **Today's plan** · **Pre-open brief**: writes it · **Open / midday / afternoon / close**: the morning's still-open decisions for this leg · **Intraday check-in**: the morning's still-open decisions for this leg

The catalyst probe is the narrow, time-sensitive one: it fires **only for names that already moved**, reads exchange and regulator filings first (SEC acceptance timestamps, HKEX announcements), classifies each item as interrupt, context or noise, and states `no_recent_filing` explicitly rather than letting an empty block read as "nothing happened".

What is deliberately absent matters as much: no research production inside an intraday loop, no paid search on a 30-minute cadence, and no evidence graph rebuild intraday — it is a daily artifact and would be stale by construction.

## How it decides

Analysis resolves into explicit, gated strategy decisions — and one stock can carry several at once.

- **Several strategies, graded separately.** `core_position`, `risk_rebalance`, `intraday_t`, `event_trade`, and `tactical_entry` can coexist on the same name, because a long-term thesis and an intraday trade can legitimately disagree. Each is graded in its own episode.
- **Attribution-first.** Every decision is tagged by its dominant driver, and that driver's edge is measured *dynamically* from the record — no hit rate is hard-coded into the logic.

### Low-frequency add campaigns

Adds use a stateful interaction rather than treating a moving average as alpha. Within each market, the factor rank and curated-peer residual form one `price_relative` evidence family. Point-in-time news contributes a separate family through reliable positive surprise or source-weighted attention that has accelerated against the same name's own earlier snapshots. An add needs both families; negative information or peer-laggard evidence blocks it. Separate enter/exit ranks give an open campaign hysteresis, so a small rank wobble cannot churn permission off and on.

Authority, sizing and execution stay separate. A warming policy may collect one 2.5% exploration tranche per ticker and policy version; that is not validated authority and cannot be used on daily-reset leveraged products. One indivisible broker unit is allowed only while it remains inside the 3% market-book exploration cap, so an expensive board lot cannot masquerade as a small sample. Validated campaigns may approach their target in several tranches. The price setup only schedules an authorized tranche for the next five local sessions: next-session execution, invalidation first, gap-aware fills, separate HK/US ranks, calendars and lot rules.

Every held name remains visible as `eligible`, `waiting_timing`, `risk_blocked`, `already_at_target`, `constraint_blocked`, or `insufficient_evidence`. Thus zero orders can be a legitimate result, but a bare `add=0` is not. `clawock evaluate-add-alpha` compares setup-only, price-relative, information and interaction variants at T+1/T+5/T+20; current-universe and legacy-news replay is labeled diagnostic and survivorship-limited, never promoted into validated alpha.
- **Falsify, don't confirm.** In a risk-on tape the default is HOLD. A bullish story doesn't trigger a buy until it clears a disconfirming check and an "is this already priced in?" test on the last few days' move.
- **Regime over timing.** Leverage isn't timed; a 200-day-trend × volatility dial sets the cap. The backtested lesson: the edge was in *de-leveraging in the wrong regime*, not in calling tops.

## The debate

The daily deep brief runs a structured **multi-agent debate**, adapted from [TradingAgents](https://github.com/TauricResearch/TradingAgents) for separate Hong Kong and US books. More agents isn't the point: the protocol **demands an opposing case**, and the Judge **attributes each resolution** to a named strategy frame.

![clawock's multi-agent debate — one evidence pack feeds four analyst lenses; two researchers argue opposing bull and bear cases and record where they disagree; three risk voices and a judge name the strategy frame and resolve it into plan.json, which enters the next session's grading loop](https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/debate-flow.svg)

- **Analyst lenses.** Fundamental, technical, sentiment, and sector-rotation agents read the *same* context and merge into one table. Every claim must cite numeric context.
- **Bull vs Bear.** Two researchers build opposing cases, each citing concrete analyst data points. The protocol asks them to **genuinely disagree on at least one position** and to record it, so unanimous agreement reads as a flag rather than evidence.
- **Risk voices + a Judge.** Aggressive, Conservative, and Neutral each argue their corner. A Judge weighs them, **names the strategy frame driving each decision**, and resolves the argument into `plan.json` — which enters the next session's grading pipeline.

## The public scorecard

Every call is settled mechanically and published — wins, losses, and the cases that can't be graded. Nothing is hand-tuned after the fact.

1. **Record** — the model submits a versioned decision with its strategy, condition, regime, size, and confidence. The authoritative ledger is `memory/decisions.jsonl`.
2. **Trigger** — Python evaluates it against canonical unadjusted daily bars, counted on each market's own calendar. An unfinished session grades nothing, and a gap straight through a trigger fills at the open — never at a price that was never available.
3. **Group** — repeated calls of the same strategy collapse into one *episode*, so holding a position for five mornings does not manufacture five samples.
4. **Grade & publish** — code settles the outcome, scores it against a plain directional baseline, and renders it. Shut sessions, calls that need human evidence, and instruments that didn't trade are published as ungradeable — out of the win-rate denominator, but kept visible in the coverage count instead of silently dropped.

The model submits decisions; it can never write or amend its own evaluation. That isolation stops the desk from grading itself — it does **not** make the market data or the metric definitions correct. **Treat the record as a diagnostic, not as proof of return.**

![cumulative episode win rate against a 50% directional-hit line](https://raw.githubusercontent.com/KCNyu/clawock/refs/heads/master/site/assets/shadow-backtest.png)

<sub>Cumulative episode win rate against a 50% directional-hit line — how often the direction was right, not what it earned. The buy-and-hold comparison is the Shadow Portfolio under Holdings; this is a different question. Refreshed weekly by GitHub Actions; live figures are on the [Holdings tab](https://kcnyu.github.io/clawock/#drill).</sub>

How the grading handles the hard cases

- **Incomplete sessions & missing bars.** Triggers and marks come from `memory/bars/` — unadjusted daily bars from a single canonical vendor feed, not an exchange feed. An unfinished session never grades anything.
- **Reaffirmations.** Consecutive restatements of the same strategy/action are one episode. Re-anchoring a trigger to where the stock has since moved is still a reaffirmation, not a new call.
- **Episode aggregation.** An episode scores as the *mean* of its own settled calls, not an elected member — letting the first or last call speak for the group can swing the active win rate across the 50% line on nothing but that choice.
- **Confidence calibration.** Stated confidence remains an audit field. A strictly prequential beta-binomial hierarchy estimates action × driver × condition × regime probabilities from earlier dates only, shrinks sparse groups toward broader priors, and abstains from signal sizing when evidence or the posterior lower bound is insufficient.
-