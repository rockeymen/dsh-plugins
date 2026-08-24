# dsh-daily-pulse

> **Built for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)** — *"Everything is a Plugin."* · npm: [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh) · 官方 151K★

> 版本与迭代记录见 [CHANGELOG.md](CHANGELOG.md)（[中文](CHANGELOG.zh.md)）与
> [GitHub Releases](https://github.com/dsh-pulse/dsh-daily-pulse/releases)。

DSH 插件生态日报 — 每天 06:00 / 14:00 / 22:00（北京时间）三次，1 分钟读懂 DSH 生态的脉搏。
定位：DSH 生态的「财经早报」，质量信号层 + 中文社区层卡位；历史快照数据集是核心护城河。

## 现状（2026-08-18）

- **M0 ✅**：增量采集 + 单期日报渲染全链路跑通（真实 GitHub / npm 数据）
- **M1 ✅**：差分增速榜（star-index 基线）、档案馆首页（历史曲线）、三时点 CI 自动化
- **M2 ✅**：DeepSeek 中文摘要、健康分全量计分制、自动 commit 公开仓库
- **M3 ✅**：GitHub Pages「生态档案馆」正式站点（18+ 期、双轴主图 + 4 指标矩阵、中英双语、npm 自然日口径）
- **M4 🔄（进行中）**：①开放数据接口 ✅ ②细分榜单 ✅（Top 10 × 4 维度）③数据地图 ⏳（最后）；**插件行情页 ✅**（趋势浏览器，star 轨迹）

## 本地运行

```bash
# 0) 首次建库（只跑一次，抓 topic:dsh-plugin 前 1000 个仓库）
node bootstrap.mjs
# 1) GitHub 认证（Search API 配额：认证 30 次/分钟，足够本脚本 ~15 次调用）
gh auth login
# 2) 采集 → 渲染（中英双档）→ 档案馆 → 结构化 → 开放数据
node collect.mjs
node render.mjs --lang zh
node render.mjs --lang en
node render-index.mjs --lang zh
node render-index.mjs --lang en
node render-plugins.mjs --lang zh
node render-plugins.mjs --lang en
node render-structured.mjs
node export.mjs
# 3) 打开 reports/latest.html（中文默认）/ latest 的 EN 切换 / reports/index_en.html
#    M2b：每天 3 采集时点 × 中英双档 = 6 期（Q6 拍板）
```

> 也可用 `GITHUB_TOKEN` 环境变量替代 `gh` 认证（CI 里即走此路）。

## 部署到 GitHub Pages（三步）

1. **建仓库并推送**：把本目录推到任意 GitHub 仓库（建议名 `dsh-daily-pulse`）。
2. **开 Pages**：仓库 Settings → Pages → Source 选 **GitHub Actions**（不用手动选分支）。
3. **等首轮跑完**：推送后手动 Run workflow 一次（Actions → dsh-daily-pulse → Run workflow），
   之后每天 6/14/22 点（北京）自动采集并部署。

站点根即 `reports/`：`index.html` = 档案馆首页，`latest.html` = 最新一期日报。

## 数据源与限制

### 数据 · 来源 · 说明
- **数据**: 插件总数（生态口径） · **来源**: GitHub `/topics/dsh-plugin` 页面 HTML 计数 · **说明**: 官方 topic 计数（含 fork）；解析失败自动降级 Search 并告警
- **数据**: 追踪口径 / 8h 新增 / 弃养 · **来源**: GitHub Search API `topic:dsh-plugin fork:false` · **说明**: 用 `total_count` 绕开 1000 条结果硬上限
- **数据**: 官方仓库 · **来源**: `deepseek-ai/deepseek-harness` REST · **说明**: stars / forks / commits
- **数据**: npm 周下载 · **来源**: npm registry API · **说明**: `@deepseek-ai/dsh`
- **数据**: 差分增速榜 · **来源**: 本仓库 `star-index.json` 基线 · **说明**: 首期无基线，次期起生效
- **数据**: 蹭标签过滤 · **来源**: 计分制：manifest +2 / 依赖 `@deepseek-ai/dsh` +2 / topic +1，≥3 计入 · **说明**: 爆发榜只收录达标仓库，标注可信分 /5

- Search API 未认证 10 次/分钟、认证 30 次/分钟；脚本约 15 次调用，CI 用 `GITHUB_TOKEN` 无压力。
- 8h 窗口留 5 分钟重叠防漏；增速榜按窗口内 star 增量排序，非绝对星标。
- `bootstrap.mjs` 一次性建库约 30–40s（10 页 × 100，页间 2.5s 软限速）。

## 设计系统

对齐《dsh-design-system.md v0.2》：三层令牌（常量 / 主题 / 配色）、明暗主题、`data-accent` 换肤钩子、
i18n 接口（zh / en / bi）、`data-mode="structured"` 结构化输出。`tokens.mjs` 为单文件可交付模块，
供 GitHub Pages 直接引用。

- **结构化输出（GEO 资产）**：每次渲染额外产出 `reports/structured/` —— 每期 `NNNN.json`（JSON-LD
  `Dataset` schema，机器可读快照）+ `latest.json` / `latest.md`（干净英文正文，data-led，供
  ChatGPT / Gemini 等 AI 引擎直接引用）；单期日报 HTML 的 `<head>` 亦内嵌 JSON-LD。站点 URL 可用
  `DSH_SITE_URL` 环境变量覆盖（默认 `https://dsh-pulse.github.io/dsh-daily-pulse/`）。

## 开放数据（M4）

随每期 CI 自动生成并随 Pages 部署，所有数据可爬、可引用：

### 文件 · 内容
- **文件**: [`data/snapshots.csv`](data/snapshots.csv) · **内容**: 全历史时间序列（每期一行，行序 = 期号）
- **文件**: [`data/latest.csv`](data/latest.csv) · **内容**: 当期 KPI 宽表（一行 25 列，含健康分四因子）
- **文件**: [`data/leaderboard.csv`](data/leaderboard.csv) · **内容**: 当期榜单（`list` 列区分 `leaderboard` 爆发榜 / `growth` 增速榜）
- **文件**: [`data/category-boards.csv`](data/category-boards.csv) · **内容**: 细分榜单（每类每维度 top10，`list=category:<类别>:<维度>`，维度 `stars`/`delta`/`active`/`newest`）
- **文件**: [`data/active-board.csv`](data/active-board.csv) · **内容**: 活跃榜（最近 push top5，`list=active`）
- **文件**: [`data/latest.json`](data/latest.json) · **内容**: 当期完整快照（与 `store/latest.json` 同构，程序直接消费）

字段字典（`snapshots.csv` / `latest.csv` 共用的核心列）：

### 字段 · 含义 · 口径
- **字段**: `generated_at` / `window_start` / `window_end` · **含义**: 快照生成时间 / 采集窗口 · **口径**: UTC ISO8601；窗口 8h + 5 分钟重叠防漏
- **字段**: `total_plugins` · **含义**: 插件总数（生态口径，含 fork） · **口径**: GitHub `/topics/dsh-plugin` 页官方计数；解析失败降级 Search 并置 `count_source=search-fallback`
- **字段**: `non_fork_plugins` · **含义**: 追踪口径（排除 fork） · **口径**: Search `topic:dsh-plugin fork:false` `total_count`
- **字段**: `count_source` · **含义**: 总数来源 · **口径**: `topics-page` \ · `search-fallback`
- **字段**: `new_8h_repos` · **含义**: 8h 新增仓库数 · **口径**: `created:>=window_start`（窗口留 5 分钟重叠）
- **字段**: `official_stars` / `official_forks` · **含义**: 官方仓库 stars / forks · **口径**: `deepseek-ai/deepseek-harness` REST
- **字段**: `npm_weekly_downloads` · **含义**: npm 周下载 · **口径**: `@deepseek-ai/dsh`，滚动 7 天
- **字段**: `npm_daily` / `npm_daily_date` · **含义**: npm 日下载（自然日） · **口径**: range API 最近完整非 0 自然日；`npm_daily_date` 标注实际日期
- **字段**: `delta_8h_stars` · **含义**: 官方 star 8h 增量 · **口径**: 与上期快照对比；首期（无基线）为空
- **字段**: `health_score` · **含义**: 生态健康分（0–100） · **口径**: 四因子：活跃度 40 + 新鲜度 20 + 采用度 20 + 多样性 20（因子分见 `latest.csv` 末 4 列）
- **字段**: `stale_7d` / `stale_1d` · **含义**: 沉寂仓库数（7 天 / 24h 无 push） · **口径**: Search `pushed:<阈值`（追踪口径内）
- **字段**: `total_tracked` · **含义**: 健康分分母（= `non_fork_plugins`） · **口径**: —

`leaderboard.csv` 列：`list`（`leaderboard`=爆发榜，按 stars；`growth`=增速榜，按窗口 star 增量）、
`rank`、`name`（full_name）、`desc`、`stars`、`delta`（窗口增量，首见为空）、`is_new`（1/0，
DSH 发布日 2026-08-13 后首见）、`score`（蹭标签计分 ≥3 才上榜）、`category`（视觉/工作流/终端/其他）、
`created`、`pushed`、`url`。增速榜 `created`/`pushed` 为空（由爆发榜行提供）。

`category-boards.csv` / `active-board.csv` 列（M4 细分榜单）：`list`（`category:<类别>:<维度>` /
`active`）、`rank`（榜内名次）、`name`、`stars`、`delta`、`is_new`、`score`、`verified`（1/0，
是否通过 manifest/依赖计分门槛）、`category`、`created`、`pushed`、`url`。细分榜来自按 stars 取
的前 100 候选（每类每维度 top10；维度 `stars` 累计星标 / `delta` 窗口增速（需基线）/
`active` 最近 push / `newest` 最新创建），未过计分门槛的仓库保留并标注 `verified=0`，避免口径盲区。

## 相关文档（vault）

- 设计规范：`dsh-daily-pulse-design/dsh-design-system.md`
- 生态战略：`DSH生态讨论笔记.md`（§一 指标 / §里程碑）
- 微信指挥 dsh-v4flash 开发：`WorkBuddy/2026-08-17-微信指挥DSH-v4flash-桥梁.md`