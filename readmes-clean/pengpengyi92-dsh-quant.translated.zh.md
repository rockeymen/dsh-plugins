# 🐳 dsh-quant — 一切插件 Quant 操作系统

🌐 **站点**：https://dsh-quant-site.pages.dev · ✅ 列于[awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)（通过dsh-market一键安装）

> **适用于各个量化方面的 AI 原生和 DSH 原生量化工具包** — 59 个工具 · 6 个领域
>（数据/阿尔法/机器学习/风险/执行/生态系统）·一个端到端的PDAT→PET
> 研究管道。 **方法公开，秘密内部。**

## 🧩 核心理念：一切皆插件（量化版）

dsh的理念是**一切都是插件**； dsh-quant 将其带入量化 —
开源内部五团队范例（**PDAT → PAAT → PCPT → PRT → PET**）
作为**五个可插拔模块**：

```
data plugin   dsh-data      market data / sources / quality  ← plug in Binance or your own data
alpha plugin  dsh-alpha     indicators / factors / eval      ← write your own alpha (internal alpha stays private)
model plugin  dsh-ml        backtests / ML/DL/RL framework   ← train your own models (internal research stays private)
risk plugin   dsh-risk      VaR / drawdown / options / bonds ← set your own risk limits
exec plugin   dsh-execution sim execution / fund / report    ← build your own trading system (paper or live)
```

- **开放的是范式**：模块如何组成，合约如何定义
  （空对齐/无前瞻/手工计算测试），如何验证结果 -
  不是内部秘密
- **你填写**：产品力=UI+策略+数据接口+DL/RL
  模型+交易系统构建，全部自组装，全部插件化
- **无限自我进化**：用你的模块填充框架→运行论文/实时
  → 反馈生态系统 — 这就是 dsh-quant

插件征集提案：[问题＃27（五个模块×许多插件）](https://github.com/pengpengyi92/dsh-quant/issues/27) - PDAT插件，PET插件，任何你能想象到的东西🐋

## 🤖 AI-Native 是经过深思熟虑的（设计声明）

dsh-quant 的主要消费者是**代理（模型），而不是人类** —
从第一天起就经过深思熟虑的选择：

- **工具模式被注入到系统提示符中** - 每个合约（args /
  输出/对齐规则）是从模型的角度编写的
- **等长空对齐** — 输出匹配输入长度；引导窗口
  位置是 `null`，因此模型按索引对齐并且从不填充
- **规范 JSON + 渲染分离** — 机器读取结构，人类读取散文
- **All isConcurrencySafe** — 纯函数，无共享状态；代理商可以致电所有
  59把刀具并联互不干扰
- **技能层** — `skill/quant-research` 让模型自行加载工作流程

完整声明：[问题#14](https://github.com/pengpengyi92/dsh-quant/issues/14)“AI 原生是故意的”。

## 🐍 为什么几乎没有Python？

一个常见问题：没有 `.py` 文件的量化项目？ **答案：0 个 Python 文件，
21 个 TypeScript 源文件，零运行时依赖 — 故意的：**

- dsh-quant 是一个 **dsh 插件**，在线束的 Node 运行时内运行：相同
  进程作为代理，可由 Loader 组合，可逆注册（HMR 安全）
  — TypeScript 是唯一自然的选择
- 需要Python的地方（akshare / tushare / baostock），使用**频道知识
  基础**（`quant_data_guide`，15 个通道）：dsh 提供 shell/子进程功能，
  因此代理决定是否生成 Python - dsh-quant 不携带运行时
- 所有数值方法（指标/回测/期权/债券）都是**纯的
  具有手动计算基线的函数**：零依赖，可离线验证，
  `npm test` 绿色任何地方

目标之一：**构建最有用的人工智能原生量化存储库** 🐋

**59 个 `quant_*` 工具·6 个域·215 个单元测试·零运行时依赖**。完全定位：固定[问题#9](https://github.com/pengpengyi92/dsh-quant/issues/9)。

## 🤖 对于来访的代理商

代理登陆此存储库：从 [AGENTS.md](AGENTS.md)（根级别，自动读取
by Copilot / Claude Code / dsh），然后是闭环示例
[插件/CASE_STUDY.md](plugin/CASE_STUDY.md) 或 [讨论#38](https://github.com/pengpengyi92/dsh-quant/discussions/38)，
以及一目了然的合同 [mcp/AGENT_GUIDE.md](mcp/AGENT_GUIDE.md)。

## 快速安装（dsh 用户）

```sh
npm i dsh-quant
```

在 cordis.yml 中添加一行：

```yaml
- name: 'dsh-quant'
```

59种工具自动注册 — 指标/回测/因子/风险/基金模拟/
开箱即用的生态系统指标。一台`quant_research_pipeline`跑全程
PDAT→PET链。 ML/DL知识：[docs/ML_GUIDE.md](docs/ML_GUIDE.md);
可执行演示：`npx tsx demos/ml-workflow.ts`。

## 🚀 产品体验：三分钟完成完整的定量管道

安装后即可体验完整的PDAT→PET流程（BTC公开数据+
简单策略+回测+模拟交易）：

```
data(quant_market_fetch) → quality(quant_data_quality) → factors(quant_factor_evaluate)
→ backtest(quant_backtest) → metrics(quant_metrics) → risk(quant_risk)
→ drawdown(quant_drawdown) → paper sim(quant_execute_sim) → fund sim(quant_fund)
→ report(quant_report)
```

一行：`quant_research_pipeline(symbol=BTCUSDT, limit=120)` 返回所有内容
一通电话。

然后将**您自己的插件**插入每个模块（数据源/alpha/模型/
风险/执行——一切都是插件，建议参见问题＃27）。

带评论的五步演练：[docs/ONBOARDING.md](docs/ONBOARDING.md)·
代理一览指南：[mcp/AGENT_GUIDE.md](mcp/AGENT_GUIDE.md)

## 🖥️ UI 工作台 (dsh-quant-ui)

![dsh-quant UI](demos/ui-demo-preview.png)

[dsh-quant-ui](https://github.com/pengpengyi92/dsh-quant-ui)：烛台 + MA
叠加+交易标记、股票曲线、基金资产净值/管理费/绩效费
卡片、公制选择器 — 加上一只正在游泳的赤壁鲸鱼🐋（点击标题 3 次）。

现场演示：https://dsh-quant-ui.pages.dev

## ⌨️ CLI（dsh-quant 终端）

零依赖可读终端（纯Node + ANSI，与
P-研究 CLI)。无需任何操作即可浏览研究专栏和实时市场数据
浏览器：

```bash
node cli/main.mjs repo                      # 59 tools · 6 domains
node cli/main.mjs history                   # 53 firm archives index
node cli/main.mjs history citadel           # one firm's archive (rendered)
node cli/main.mjs history --reports         # ANALYSIS / TIMELINE / LINEAGE / BANK_LINEAGE
node cli/main.mjs history --search 高频      # cross-archive search
node cli/main.mjs kline BTCUSDT --limit 20  # colored OHLC table + stats
node cli/main.mjs browse                   # interactive TUI: arrow-key firm browser
```

`npm install -g .` 之后，命令缩短为 `dsh-quant repo`，
`dsh-quant history citadel`等

## 工具

### 工具·参数·规范输出·第一个有效索引
- **工具**：`quant_data_compare` · **参数**：`dataType`（例如“财务”/“每日柱线”） · **规范输出**：`{ dataType, channels: [{ name, cost, covers, bestFor }] }`（覆盖第一个） · **第一个有效索引**：—
- **工具**：`quant_data_advice` · **参数**：`dataType` + `budget`（免费/低/机构）+ `purpose`（研究/回测/官方） · **规范输出**：`{ recommendations: [{ rank, name, reason }] }`（决策树排名） · **第一个有效索引**：—
- **工具**：`quant_series_stats` · **参数**：`values: number[]` · **规范输出**：`{ count, mean, std, min, max, median, skew, kurtosis, autocorr1, annualizedVol, totalReturnPct }` · **第一个有效索引**：—（获取后的第一步）
- **工具**：`quant_var_backtest` · **参数**：`returns` + `varSeries` + `confidence=0.95` · **规范输出**：`{ failures, expected, lrStat, pValue, passed, periods }`（Kupiec POF 测试） · **第一个有效索引**： — （VaR 模型的基本事实）
- **工具**：`quant_option` · **参数**：`spot` + `strike` + `timeToMaturity` + `riskFreeRate` + `type` + `volatility`/`price` 中的一个 · **规范输出**：`{ price, impliedVolatility, delta, gamma, vega, theta, rho, … }` · **第一个有效索引**： — （受 Optiver 启发： BS定价+五个希腊语+IV解决）
- **工具**：`quant_volatility` · **参数**：`close: number[]` + `annualization=252` · **规范输出**：`{ annualized, perPeriod, n, logReturns(aligned) }` · **第一个有效索引**：—（已实现的卷；RV-vs-IV 研究条目）
- **工具**：`quant_bond` · **参数**：`couponRate` + `periodsToMaturity` + `paymentsPerYear?` + `ytm`/`price` 中的一个 · **规范输出**：`{ price, yieldToMaturity, macaulayDuration, modifiedDuration, convexity, dv01, … }` · **第一个有效索引**： — （FICC 链接：定价/持续时间/凸度/DV01，教科书折扣）
- **工具**：`quant_drawdown` · **参数**：`equity: number[]` · **规范输出**：`{ underwater(aligned), maxDrawdownPct, currentDrawdownPct, periods(peak/trough/recovery/depth/duration), ongoing }` · **第一个有效索引**：—（回撤事件分析）
- **工具**：`quant_resample` · **参数**：`candles` + `period`（周=7 条/月=30 条） · **规范输出**：`{ candles }` (OHLCV