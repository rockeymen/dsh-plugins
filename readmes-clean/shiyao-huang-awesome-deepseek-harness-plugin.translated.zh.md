# awesome-deepseek-harness-plugin

DeepSeek Harness / DSH 插件生态的公开资料聚合 repo：把 GitHub 仓库、Hacker News、X、小红书、YouTube、哔哩哔哩、Reddit、知乎、微信公众号、LINUX DO、V2EX、微博和开放网页统一到一个可回溯索引。

从 [dsh store](docs/index.html) 开始浏览；它提供类似 skills.sh 的目录、搜索和分类页面，每条记录都有独立详情页。原始 Markdown 视图仍在 [docs/index.md](docs/index.md)、[docs/timeline.md](docs/timeline.md) 和 [docs/categories.md](docs/categories.md)，富媒体报告在 [docs/report.html](docs/report.html)。发布和 SEO 约定见 [docs/seo.md](docs/seo.md)。

## Start here — the DSH signal desk

> 这里不是又一份静态 Awesome List，而是一张持续更新的 DeepSeek Harness 生态地图：先看最值得点开的仓库、帖子和视频，再沿着 raw、SQLite、时间轴回到证据。当前批次 **v20260817T150416Z**（2026-08-17）：**14,658** 条去重记录、**14** 个平台、**1,270** 个媒体引用。

[打开 dsh store](docs/index.html) · [看价值矩阵](docs/value-matrix.md) · [看趋势](docs/trends.md) · [下载查询 SQLite](https://github.com/Shiyao-Huang/awesome-deepseek-harness-plugin/releases/download/dataset-latest/aggregator.sqlite3)

![DeepSeek Harness official preview](media/screenshots/official.png)

### 先看这三个入口

### 入口 · 为什么值得看 · 当前信号
- **入口**: [官方核心 · deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) · **为什么值得看**: DSH 的源头仓库；所有插件和能力最终回到这里核验。 · **当前信号**: ★ stars 146,100
- **入口**: [高关注插件 · zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) · **为什么值得看**: 真实可见的 UI / 桌面扩展，适合从“能不能直接用”开始。 · **当前信号**: ★ stars 4,003
- **入口**: [新文章 · 如何用 GLM 5.3，开发 DeepSeek Harness 插件](https://mp.weixin.qq.com/s/HrOgdg7ZBKQlvGM-xPeKtw) · **为什么值得看**: 一篇文章串起模型接入、插件契约、skill、附件和 inspector；8 image · 1 video。 · **当前信号**: counters NULL

### 新：一篇文章与一项社区补充

> [如何用 GLM 5.3，开发 DeepSeek Harness 插件](https://mp.weixin.qq.com/s/HrOgdg7ZBKQlvGM-xPeKtw) · 金色传说大聪明 · 2026年8月15日 16:35 北京。文章报告作者用 GLM 5.3 为 DSH 补上 skill 索引、文件附件和约束/skill 检查能力；互动计数未公开，保持 `NULL`。相关历史报道：[DeepSeek Harness插件一夜燃爆GitHub：长期记忆、电子宠物、4399小游戏全来了](https://mp.weixin.qq.com/s/O6u4JsV-cFl9mKF9t5SJqw)。
> 另从 GitHub 的公开贡献记录补入 [CocoSgt/dsh-nsfw](https://github.com/CocoSgt/dsh-nsfw)：一个由仓库驱动的 DeepSeek 鲸鱼娘全年龄漫画收藏与分享站；当前 GitHub 快照为 10 stars、3 forks，详情以仓库 README 和 raw 记录为准。

### 插件 · 用途
- **插件**: [CocoSgt/dsh-nsfw](https://github.com/CocoSgt/dsh-nsfw) · **用途**: 由仓库驱动的 DeepSeek 鲸鱼娘全年龄漫画收藏与分享站。 · ★ stars 12
- **插件**: [CocoSgt/dsh-skills](https://github.com/CocoSgt/dsh-skills) · **用途**: 索引和加载项目里的 skill，支持完整 `.skill` 文件。 · ★ stars 10
- **插件**: [CocoSgt/dsh-attachments](https://github.com/CocoSgt/dsh-attachments) · **用途**: 为 DSH 增加文件/图片附件与继续引用能力。 · ★ stars 8
- **插件**: [CocoSgt/dsh-inspector](https://github.com/CocoSgt/dsh-inspector) · **用途**: 查看生效的约束文件和当前被索引的 skill。 · ★ stars 6

安装提示（文章原文，三个插件）：

```sh
dsh plugin --profile web add dsh-skills dsh-attachments dsh-inspector
```

### 大家正在关注什么

### 平台 · 记录 · 平台原生信号 · 为什么在首页
- **平台**: X · **记录**: [DeepSeek Harness v0.1 is now available in Developer Preview!](https://x.com/deepseek_ai/status/2087887408440164663) · **平台原生信号**: ♥ likes 19,518 · replies 740 · **为什么在首页**: 官方发布与开发者传播
- **平台**: YouTube · **记录**: [DeepSeek Harness: The End of Claude Code?](https://www.youtube.com/watch?v=qg9EyGOZd9U) · **平台原生信号**: views 42,000 · **为什么在首页**: 长视频实测/解读
- **平台**: 哔哩哔哩 · **记录**: [【热门AI鉴定】DeepSeek Harness是什么？强在哪里？Harness实测效果如何？一口气搞懂！](https://www.bilibili.com/video/BV11CgF6uE4k) · **平台原生信号**: views 446,982 · replies 656 · **为什么在首页**: 中文教程与体验
- **平台**: Hacker News · **记录**: [DeepSeek Harness developer preview](https://news.ycombinator.com/item?id=49285244) · **平台原生信号**: points 735 · comments 309 · **为什么在首页**: 开发者讨论
- **平台**: 小红书 · **记录**: [DeepSeek Harness 保姆级安装教程](https://www.xiaohongshu.com/explore/6a7e2d740000000025017880) · **平台原生信号**: ♥ likes 3,769 · **为什么在首页**: 中文入门与教程

### 官方 Fork network：把分叉当作生态信号

沿 `deepseek-ai/deepseek-harness` 的公开分页，本批次登记 **12,302** 个 Fork（v20260816T110748Z）；按 **0+ stars** 进入排序的 **12,302** 个，深度盘点成功 **691** 个。它是公开信号和变体线索，不是质量、安全或诚信背书。

[打开 Fork 检索页](docs/forks.html) · [看 Fork 数据报告](docs/forks.md) · [下载完整压缩 SQLite 快照](https://github.com/Shiyao-Huang/awesome-deepseek-harness-plugin/releases/download/dataset-latest/aggregator-full.sqlite3.zst) · [看完整 JSONL 索引](index/forks.jsonl)

### Rank · Fork · stars · owner reputation · repo influence · overall · deep status · one-sentence evidence
- **Rank**: 1 · **Fork**: [salathleizhang/deepseek-harness-desktop](https://github.com/salathleizhang/deepseek-harness-desktop) · **stars**: 103 · **owner reputation**: 36.0 (observed) · **repo influence**: 74.958 · **overall**: 59.375 · **deep status**: ok · **one-sentence evidence**: 新增约 42 个提交并修改 300 个文件，主要涉及 配置、文档、CI/构建、依赖；目标线索是“Native desktop app for DeepSeek Harness — an Electron shell that runs the harness locally and hosts the official Web GUI unchanged”。
- **Rank**: 2 · **Fork**: [jasonkneen/deepseek-harness-plus](https://github.com/jasonkneen/deepseek-harness-plus) · **stars**: 3 · **owner reputation**: 77.0 (observed) · **repo influence**: 31.906 · **overall**: 49.961 · **deep status**: ok · **one-sentence evidence**: 新增约 2 个提交并修改 103 个文件，主要涉及 配置、文档、依赖、其他文件；目标线索是“DeepSeek Harness: Everything is a Plugin”。
- **Rank**: 3 · **Fork**: [bojieli/deepseek-harness](https://github.com/bojieli/deepseek-harness) · **stars**: 1 · **owner reputation**: 81.4 (observed) · **repo influence**: 25.810 · **overall**: 48.045 · **deep status**: ok · **one-sentence evidence**: 未观察到相对 upstream 的文件修改；目标线索是“DeepSeek Harness: Everything is a Plugin”。
- **Rank**: 4 · **Fork**: [alexdolbun/deepseek-harness](https://github.com/alexdolbun/deepseek-harness) · **stars**: 1 · **owner reputation**: 80.0 (observed) · **repo influence**: 25.810 · **overall**: 47.502 · **deep status**: ok · **one-sentence evidence**: 未观察到相对 upstream 的文件修改；目标线索是“DeepSeek Harness”。
- **Rank**: 5 · **Fork**: [zchuhui/deepseek-harness](https://github.com/zchuhui/deepseek-harness) · **stars**: 1 · **owner reputation**: 48.7 (observed) · **repo influence**: 46.345 · **overall**: 47.302 · **deep status**: ok · **one-sentence evidence**: 新增约 10 个提交并修改 300 个文件，主要涉及 配置、文档、CI/构建、其他文件；目标线索是“DeepSeek Harness: Everything is a Plugin”。

> 价值档当前分布：**A 1 · B 227 · C 1,785 · D 12,645**。分数只用于安排复核优先级；不同平台的 stars、likes、views、points 不相加，缺失互动数不补零。

## 当前快照

公开查询 SQLite 当前包含 **14,658 条去重记录**、**14 个来源平台**、**124,190 条指标历史**、**1,270 个媒体资产引用**、**306 条详情记录**和 **1,124 个去重 raw provenance**。当前批次 **v20260817T150416Z** 于 **2026-08-17T15:05:01Z** 完成；价值矩阵为当前批次的 14,658 条记录提供六维评分。完整原始 JSON 位于压缩权威 SQLite；公开查询库保留 raw SHA-256、路径、字节数、采集时间和批次，并去除可由 `data/raw/` 或完整库恢复的重复 JSON blob。

### 来源 · 去重记录 · 采集内容
- **来源**: GitHub · **去重记录**: 14,173 · **采集内容**: 官方仓库、topic、社区索引候选和 stars/forks/issues
- **来源**: 小红书 · **去重记录**: 157 · **采集内容**: 搜索卡片、作者、点赞、缩略图和详情文本
- **来源**: Hacker News · **去重记录**: 106 · **采集内容**: 精确短语搜索、points/comments 和讨论链接
- **来源**: X · **去重记录**: 90 · **采集内容**: 公开帖子、图片/视频链接和 replies/reposts/likes/views
- **来源**: Reddit · **去重记录**: 51 · **采集内容**: 公开讨论、分数、评论和正文证据
- **来源**: YouTube · **去重记录**: 29 · **采集内容**: 视频标题、频道、观看数和缩略图
- **来源**: 开放网页 · **去重记录**: 21 · **采集内容**: 文章、教程和报道的公开元数据与摘要
- **来源**: 哔哩哔哩 · **去重记录**: 18 · **采集内容**: 视频元数据、播放/点赞/投币/收藏/转发/弹幕/评论
- **来源**: 微信公众号 · **去重记录**: 7 · **采集内容**: 公开文章、图像/视频外链和正文证据
- **来源**: LINUX DO · **去重记录**: 2 · **采集内容**: 公开讨论页面和互动信息
- **来源**: 官方站 · **去重记录**: 1 · **采集内容**: 官方页面和补充证据
- **来源**: V2EX · **去重记录**: 1 · **采集内容**: 公开讨论页面和互动信息
- **来源**: 微博 · **去重记录**: 1 · **采集内容**: 公开页面和互动信息
- **来源**: 知乎 · **去重记录**: 1 · **采集内容**: 公开问题、回答和页面互动信息

## 数据模型

```text
collection_runs ──< raw_snapshots
       ├──────< observations ──< item_observations >── items ──< metrics
       └───────────────────────────────────────────────────────├──< media_assets
       └──< item_tags >── tags
```

- `items`：以 canonical URL 去重的公开对象。
- `collection_runs`：每一批采集的 `dataset_version`、开始/结束时间、计划时间、触发方式、状态和统计结果。
- `raw_snapshots`：完整压缩库保存每个不同 SHA-256 的原始 JSON 文本；公开查询库保留同一组 SHA、路径、字节数、日期和批次 provenance，并把重复 JSON blob 置为 `{}`。
- `observations`：平台、查询、来源 URL、采集时间、方法、状态、raw 文件、SHA-256 和 collection run。
- `metrics`：按 `item_id + observed_at + metric_source` 去重的指标历史，不把不同平台计数相加。
- `media_assets`：外部图片、视频、缩略图和文档 URL；默认只保存链接，不镜像受版权保护的媒体。
- `item_details`：按 item 幂等保存的详情文本和 blocked/thin/failed provenance。
- `value_assessments`：按 collection run 和 scoring version 保存的六维价值矩阵；`v_current_value_matrix` 是当前批次视图。
- `fork_networks` / `fork_repositories` / `fork_snapshots`：官方仓库的公开 Fork 网络、日期指标、分页 raw、深度盘点和“一句话修改/目标线索”；完整 Fork-inclusive SQLite 由 [稳定 Release 资产](https://github.com/Shiyao-Huang/awesome-deepseek-harness-plugin/releases/download/dataset-latest/aggregator-full.sqlite3.zst) 提供。
- `github_user_profiles`：按 owner 去重的 GitHub 公开账号信号（followers、public repos、account age、gists、following），不保存 email 等隐私字段；profile 原始 API 响应进入 raw manifest 和 `raw_json`。
- `fork_commits` / `fork_file_changes` / `fork_rankings`：已观察提交、文件变更分类，以及“仓库影响力 + 用户公开信号 reputation”的版本化排序；轻量清单见 [index/forks.jsonl](index/forks.jsonl)，报告见 [docs/forks.md](docs/forks.md)。
- `index_records`：与 `index/records.jsonl` 同构的登记层，保存 `id/url/repo/context/picture/comment/favor/views/refs/rank/stars` 以及版本和日期字段。

权威数据库是 [最新完整压缩 SQLite](https://github.com/Shiyao-Huang/awesome-deepseek-harness-plugin/releases/download/dataset-latest/aggregator-full.sqlite