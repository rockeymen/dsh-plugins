# 📖 DeepRead — AI 代理的证据优先阅读

> 将长篇文章、书籍、PDF 和文档集转变为可追踪的主张、证据、置信度、知识图和复习问题。

[！[很棒的DSH插件](https://beancookie.github.io/awesome-dsh-plugin/badge.svg)](https://beancookie.github.io/awesome-dsh-plugin)

![DeepRead 证据优先的阅读工作流程](assets/deepread-demo.svg)

DeepRead 有两种兼容的形式：

- **便携式代理技能**适用于 Codex、Claude Code 和其他代理技能兼容工具。零运行时依赖；该代理使用自己的文件和网络工具遵循证据优先的阅读工作流程。
- **完整的 DeepSeek Harness 插件**，带有 `deepread` 工具、浏览器 UI、PDF 提取、后台作业、进度更新、批量比较、成本预览和 HTML/XMind 兼容导出。

## 快速开始

### 便携式代理技能

```sh
npx skills@latest add xiehuan123/dsh-deepread
```

然后询问您的代理人：

```text
Deep-read docs/architecture.pdf in knowledge-map mode.
For every important claim, show the supporting evidence and source location.
```

### 完整的 DeepSeek Harness 插件

```sh
dsh plugin --profile web add dsh-deepread
```

重启`dsh web`，然后使用📖阅读面板或在聊天中调用`deepread`工具。

## 查看实际效果

该存储库包含真实的、可重现的输出，而不是占位符屏幕截图：

- [`deep` 模式：Claude Code 代币优化](examples/claude-code-token-optimization.md) — 主张、证据、论证流程、概念和关键问题。
- [`map`模式：事实检查知识图](examples/ad-fact-check-knowledge-map.md)——置信度、证据配对、数据表、关系标签、美人鱼图和回忆问题。
- [`deep` 模式：vivo Tauri 架构](examples/vivo-tauri-architecture.md) — 架构决策、支持数据和限制。

DeepRead 绝不会默默地将主题升级为主张，也不会用发明的证据来填补缺失的支持。如果消息来源不支持某个说法，报告就会这么说。

＃＃ 特征

### 能力·细节
- **能力**：🎛️五种模式·**细节**：`quick`重点要点·`deep`深度阅读·`map`知识图谱·`feynman`费曼技巧（11步循环+间隔重复）·`book`全书阅读（见下面的比较）
- **能力**：🗺️知识图谱模式 · **细节**：核心问题/核心结论/十个内容类别（结论、子主张、机制、事实、数据、案例、隐藏前提、反对、限制、可操作建议）/每个主张搭配证据（无法验证的主张标记为“原文中未提供证据”）/关键数据表（值和单位、时间范围、样本、基线、来源、位置）/八个关系标签（支持、反驳、原因、解释、依赖、举例、对比、限制）/ **四个置信度**（作者意图、原始事实和数据、合理推论、无法验证）/ 美人鱼思维导图 / XMind 大纲 / 5 个主动回忆问题
- **功能**：📥 三个输入· **详细信息**：微信文章 URL（`mp.weixin.qq.com` 稳定链接）· 文件（`.txt/.md/.html/.pdf`，通过内置纯 JS 提取器生成的 PDF，具有中文 ToUnicode 映射、页面标记和对象流/外部引用流支持）· 粘贴文本
- **功能**：📤可选导出· **详细信息**：默认在会话中显示； `export` 接受 `md` / `mm`（FreeMind，可通过 XMind 导入）/ `html`（带有浅色/深色主题的编辑器式 Web 报告）/`all`，在工作区中写入 `deepread-output/`
- **功能**：🎨浏览器UI · **细节**：`deepread`工具结果卡（四色置信图例、可折叠部分）+输入区域旁边的📖快捷按钮，可打开卡片式阅读面板（链接/路径/文本+模式/导出选择+阅读焦点+一键启动）
- **功能**：🔀 批量比较 · **详细信息**：通过 `batch`（每个 URL/路径/文本）传递 2-10 个文档，以获得每个文档的摘要以及跨文档报告：比较矩阵、冲突、互补性和综合
- **功能**：📍引文 · **详细信息**：报告携带页面/段落出处：参数、引用和专用引文表将声明定位回源中的 `【第N页】` 标记
- **功能**：🧮成本预览·**详细信息**：`estimate: true` 预览令牌支出、模型调用计数和每个模式的预期时间，而无需调用模型（CJK ≈0.6 tok/char 启发式；速率/延迟默认值是根据模型系列选择的，并且可以显式覆盖）
- **功能**：📚最近阅读 · **详细信息**：Web面板保留最近阅读的本地历史记录，一键重读（本地存储，无服务器往返）
- **功能**：⏳进度透明度·**细节**：长读/大PDF/批次成为官方后台作业：标签说明段数和预算；进度流推送

es 「精读第 3/20 段…」 line by line; job_output polls progress and the final report, job_kill cancels
- **Capability**: 🔍 Parse progress · **Details**: Full PDF extraction moves inside the background job and streams **per page** — 「解析 PDF 中… 42%（10/24 页）」 — after a fast sampling preflight decides length (no more silent wait before the background job appears); batches stream per document — 「解析第 2/5 篇… / 精读第 2/5 篇… / 完成第 2/5 篇」 plus 「跨篇对比汇总中…」
- **Capability**: 🧮 Panel budget · **Details**: The Web panel shows per-mode token + time hints above the mode chips (e.g. 深度精读 (≈38k token · ≈8分钟)), instantly for pasted text; calibrated by real model speed; links/file paths are fetched and estimated by the Host through a same-origin API (`POST /api/deepread/budget`) and the panel's 🔍 budget-preflight button shows a one-line result (≈N chars · ≈X token · ≈Y min) right inside the panel — no chat round-trip, no table
- **Capability**: ⚡ Fast preflight · **Details**: estimate mode samples the first 2 PDF pages and extrapolates by page count, so big PDF budgets come back in milliseconds
- **Capability**: 🎯 Self-calibration · **Details**: Real token/s measured from every model call feeds a rolling average persisted in storage — estimates converge to your actual provider speed; cold-start defaults are per model family (DeepSeek/Kimi/Qwen ≈100-110 tok/s, Claude ≈70, GPT ≈90)

## 五种模式比较

### 模式 · 最适合 · 主要输出 · 成本
- **模式**：`quick` · **最适合**：“这篇文章是关于什么的？”一目了然 · **关键输出**：一行摘要、核心主张、论证结构、引用、关键概念、关键问题 · **成本**：单次调用、最快
- **模式**：`deep`（默认）·**最适合**：仔细阅读一篇文章·**关键输出**：概述、核心主张、论证结构（主张+证据+逐字引用）、论证流程、章节亮点、引用、关键概念、批判性思维·**成本**：长文章自动拆分，逐节+摘要
- **模式**：`map` · **最适合**：研究、引用前的事实核查 · **关键输出**：核心问题和结论、十个内容类别、主张证据配对、关键数据表（五个元素）、八个关系、四个置信度、美人鱼思维图、XMind 大纲、主动回忆问题 · **成本**：结构化管道、多次调用
- **模式**：`feynman` · **最适合**：真正学习并教给他人 · **关键输出**：11步循环：目录 → 问题 → 每章 → 主张/数据/证据 → 章节思维导图 → 合上书本进行解释 → 自检差距 → 根据来源纠正 → 合并思维导图 → 再次解释 → 在第 1/3/7/14/30 天进行间隔复习 · **成本**：最长输出，最多来电
- **模式**：`book` · **最适合**：整本书/很长的文本 · **关键输出**：目录、章节流程、由各部分深度阅读组成的全书摘要 · **成本**：逐部分处理

一线拣选机：赶时间，`quick`；彻底读完一篇文章，`deep`；引用和事实核查，`map`；学习并记住，`feynman`；整本书，`book`。

## 安装

### DeepSeek Harness（工具+Web UI，完整功能）

需要机器上有**pnpm**（`dsh plugin`在下面运行pnpm来安装插件）并且Node.js ≥ 22。

```sh
# From npm (prebuilt, no build authorization needed)
dsh plugin --profile web add dsh-deepread

# Pin a version
dsh plugin --profile web add dsh-deepread@^0.5.4

# From GitHub (source; build artifacts are committed)
dsh plugin --profile web add "github:xiehuan123/dsh-deepread#v0.5.4"
```

重启`dsh web`即可生效。输入区域旁边会出现一个📖快捷按钮；单击它可以打开卡片式阅读面板。您也可以直接说：“以知识图谱模式阅读这篇文章：<内容>”。

> 提示：获取微信文章URL需要HTTP提供者。如果安装后看到“web fetch service unavailable”，请将`@deepseek-ai/dsh-web-fetch-http`挂载到配置文件的`cordis.patch.yml`中，并为其提供浏览器User-Agent（微信提供反机器人验证页面）。

### Codex / Claude Code（技能形式，零依赖）

安装（选择一个）：

````bash
claude插件安装xiehua