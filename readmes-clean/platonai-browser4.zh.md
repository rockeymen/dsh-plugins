# 🤖 Browser4

[English](README.md) | 简体中文 | [中国镜像](https://gitee.com/platonai_galaxyeye/Browser4)

**目录**
- [🤖 Browser4](#-browser4)
  - [🌟 项目简介](#-项目简介)
    - [✨ 核心能力](#-核心能力)
  - [快速开始](#快速开始)
  - [🧭 工具选择指南](#-工具选择指南)
    - [如何与页面交互](#如何与页面交互)
    - [如何提取数据](#如何提取数据)
    - [如何批量处理页面](#如何批量处理页面)
    - [如何把 HTML 转成电子表格——零 Token](#如何把-html-转成电子表格零-token)
  - [📦 安装](#-安装)
  - [💡 面向人的 CLI 指南](#-面向人的-cli-指南)
    - [快速上手](#快速上手)
    - [心智模型](#心智模型)
    - [全局选项](#全局选项)
    - [命令列表前需要理解的概念](#命令列表前需要理解的概念)
    - [完整命令参考](#完整命令参考)
    - [超时环境变量](#超时环境变量)
    - [状态持久化](#状态持久化)
  - [🚀 从源码构建](#-从源码构建)
  - [架构](#架构)
  - [📦 模块概览](#-模块概览)
  - [🧪 测试夹具服务器（MockSite）](#-测试夹具服务器mocksite)
  - [🤝 支持与社区](#-支持与社区)
  - [📜 文档](#-文档)
  - [🔧 代理配置](#-代理配置---解锁网站访问)
  - [许可证](#许可证)

## 🌟 项目简介

💖 **Browser4：一个快速、智能、可扩展、适用于多种场景的智能体浏览器** 💖

## 🌟 简介

💖 **Browser4 — 面向 AI Agent 的新一代智能浏览器引擎，连接网页、数据与自动化任务。** 💖

### ✨ 核心能力

* 🤖 **Agent Browser** — 为 AI Agent 提供自主浏览、网页操作和自动化执行能力。
* 🧠 **ML 智能提取** — 通过机器学习理解网页结构，无需消耗 LLM Token，即可从复杂页面提取结构化数据。
* ⚡ **高性能架构** — 协程安全设计，支持单机每天 10 万～20 万复杂网页访问。
* 🧬 **智能数据管线** — 融合 LLM、ML、X-SQL 与选择器，实现复杂网页的数据提取、清洗与经验复用。
* 📦 **企业级自动化平台** — 支持大规模爬取、CDP 原生控制、批处理、有状态浏览、插件扩展等能力。

## 快速开始

把下面这段说明粘贴给你喜欢的 AI 智能体（如 claude、codex、workbuddy 或 openclaw）并执行：

```
Read https://browser4.io/SKILL.md and install browser4-cli (if not installed) for browser automation to perform the following task:

1. Open the browser in headed mode (`open --headed`) so the window is visible — this is a human-facing demo
2. go to amazon.com
3. search for pens to draw on whiteboards
4. compare the first 4 ones
5. write the result to a markdown file
```

## DeepSeek Harness 集成

https://github.com/platonai/dsh-browser4

```
dsh plugin --profile web add dsh-browser4                  # npm registry
dsh plugin --profile web add github:platonai/dsh-browser4  # GitHub
```

## 🧭 工具选择指南

根据任务类型选择最合适的工具：

### 如何与页面交互

```
需要与页面交互？
├─ 需要打开或恢复浏览器会话？→ open [url] 或 goto <url>
├─ 想先看当前哪些元素可点击 / 可输入？→ snapshot -i --boxes
├─ 需要点击按钮、链接、复选框或菜单项？→ click <ref>
├─ 需要填写表单并替换已有文本？→ fill <ref> "<text>"
├─ 需要像真人一样继续输入，或者发送 Enter / Tab？→ type / press
├─ 需要从下拉框中选择值？→ select <ref> <value>
├─ 需要悬停、拖拽、滚动，或直接使用鼠标？→ hover / drag / scroll / mouse*
├─ 需要在下一步前等待页面稳定？
│  ├─ 等元素出现？→ wait <ref|selector>
│  ├─ 等文本出现？→ wait --text "..."
│  ├─ 等 URL 变化？→ wait --url "**/target"
│  └─ 等加载 / 网络请求完成？→ wait --load networkidle
├─ 需要确认动作之后页面发生了什么变化？→ snapshot、get 或 eval
└─ 需要高效重复很多 UI 步骤？→ batch "goto ..." "click ..." "fill ..."
```

典型交互流程：

```bash
browser4-cli goto https://example.com/login
browser4-cli snapshot -i --boxes
browser4-cli fill e3 "user@example.com"
browser4-cli fill e4 "secret" --submit
browser4-cli wait --load networkidle
browser4-cli snapshot -i
```

### 如何提取数据

```
需要从页面提取数据？
├─ 页面需要先点击、填写、滚动？→ snapshot + refs，再提取
├─ 静态页面，只取一个字段？→ htmlsnapshot get text "<selector>"
├─ 静态页面，获取某字段所有匹配项？→ htmlsnapshot get all text "<selector>"
├─ 静态页面，需要相关联的多字段（每个条目的标题+价格+链接）？
│  → htmlsnapshot query --sql @query.sql
├─ 需要处理实时 JS / 复杂 DOM 逻辑？→ eval --json
├─ 自然语言需求（“找到商品价格”）？→ extract（需要 LLM key）
└─ 大规模、多页面处理？→ crawl 或 swarm 搭配 --sql
```

### 如何批量处理页面

```
需要处理多页面？
├─ 单个列表页（搜索结果页）？→ htmlsnapshot query + DOM_LOAD_AND_SELECT
├─ 已知 URL 列表（在文件中）？→ crawl --seed-file urls.txt --depth 0 --sql @query.sql
├─ 从起始 URL 开始递归抓取？→ crawl <url> --out-link-selector "..." --depth N
├─ 需要并行执行（高吞吐）？→ swarm create → swarm query --seed-file ...
├─ 需要周期性监控（如每小时检查一次）？→ loop -- eval "..." -i 3600
└─ 只是脚本里处理少量 URL？
   → for url in ...; do browser4-cli goto "$url"; ... done
```

### 如何把 HTML 转成电子表格——零 Token

[WebMiner](https://github.com/platonai/web-miner) 会对下载下来的 HTML 文件做机器学习聚类，生成结构化电子表格和交互式报告——**不消耗 LLM token，全部本地运行。** webminer 是 Browser4 CLI 的一等公民：`browser4-cli webminer install` + `browser4-cli webminer all <html-dir>` 即可跑完整流程，无需 PowerShell。

```
已经有 HTML 文件，想要结构化数据，而且不想花 token？
├─ < 1,000 页（小中规模）？→ WebMiner Free（SMILE ML 引擎）
│  browser4-cli webminer install
│  browser4-cli webminer all ./pages/
│  → 交互式 HTML 报告 + Excel 电子表格，本地运行，零成本
├─ > 1,000 页（生产规模）？→ WebMiner Commercial（Apache Spark ML）
│  同样是 encode → cluster → views 流程，但可分布式扩展到多台机器
└─ 还需要先获取页面？
   ├─ 单页下载：browser4-cli htmlsnapshot export
   ├─ 批量下载：browser4-cli crawl --seed-file urls.txt --depth 0
   └─ 高吞吐：browser4-cli swarm create → swarm query --seed-file ...
       然后把 HTML 目录交给 WebMiner
```

> **Pipeline：** `encode`（HTML → 特征向量 → CSV）→ `cluster`（KMeans，自动检测 K）→ `views`（HTML 报告 + Excel）。免费版使用 [SMILE](https://haifengl.github.io/) ML 库进行单机聚类（< 1,000 页）。需要 JDK 17+（自动检测）。用法见 [web-miner](https://github.com/platonai/web-miner) 与 `browser4-cli help webminer`。

## 📦 安装

手动安装是可选的，因为 AI 智能体在阅读 SKILL 后通常可以自行完成安装。

通过 npm 全局安装 browser4-cli（需要 Node.js）：

```shell
npm install -g browser4-cli
browser4-cli install
```

或者用单条命令直接引导安装原生二进制。脚本随后会自动安装 Browser4 后端（运行时包）——全新机器执行 `browser4-cli install`，已安装后端则执行 `browser4-cli upgrade` 升级到最新版（可用 `--skip-backend` 跳过此步骤）：

**Windows（PowerShell）：**
```powershell
irm https://browser4.oss-cn-beijing.aliyuncs.com/scripts/install-browser4-cli.ps1 | iex
```

**Linux / macOS（bash）：**
```bash
curl -fsSL https://browser4.oss-cn-beijing.aliyuncs.com/scripts/install-browser4-cli.sh | bash
```

## 💡 面向人的 CLI 指南

`browser4-cli` 不只是智能体后端，它本身也是一个适合人类直接使用的浏览器自动化命令行工具。你可以用它驱动真实浏览器、检查页面状态、提取结构化数据、运行 X-SQL、编排 crawl / swarm 任务、管理服务端插件与 skills，也可以把长任务交给内建的 AI 能力处理。

如果你想看嵌入给智能体使用的说明，请查看 [skills/browser4-cli/SKILL.md](skills/browser4-cli/SKILL.md)。这一节是面向人的参考手册。

### 快速上手

```bash
# 打开浏览器会话（默认无头模式，添加 --headed 可显示窗口）
browser4-cli open https://browser4.io

# 或者显式打开可视浏览器：
browser4-cli open --headed https://browser4.io

# 检查页面并获取元素 ref
browser4-cli snapshot --boxes

# 使用 snapshot 输出中的 ref 进行交互
browser4-cli click e15
browser4-cli fill e16 "Browser4" --submit

# 从当前页面实时提取数据
browser4-cli get text "h1"

# 捕获静态 DOM 快照，用于重复提取
browser4-cli htmlsnapshot
browser4-cli htmlsnapshot get text "#main-content"
browser4-cli htmlsnapshot query --sql @query.sql

# 保存输出
browser4-cli screenshot --full-page --filename page.jpg
browser4-cli pdf --filename page.pdf
```

### 心智模型

1. **以会话为中心**：命令默认作用于当前浏览器会话；需要隔离状态时使用 `-s <name>`。
2. **两种页面视图**：`snapshot` 用于交互式工作，提供 `e15` 这样的元素 ref；`htmlsnapshot` 用于 DOM / X-SQL 提取，基于 CSS 选择器。
3. **交互式提取 vs 静态提取**：页面需要先操作时用 `click`、`fill`、`type`、`press`、`wait`；需要结构化提取时优先用 `htmlsnapshot query`。
4. **同步命令 vs 异步任务**：`agent`、`swarm`、`crawl`、异步 chat 一类命令会返回任务 ID，后续再查询状态和结果。

### 全局选项

这些标志可以放在任何命令之前。

### 标志 · 说明
- **标志**: `-h`, `--help [command\ · **说明**: category]` · 显示顶层帮助、分类帮助或某个命令的详细帮助
- **标志**: `--help-json` · **说明**: 输出机器可读的命令参考 JSON
- **标志**: `-v`, `--version` · **说明**: 打印 CLI 版本
- **标志**: `-s`, `--session <name>` · **说明**: 使用命名会话，而不是默认会话
- **标志**: `--server <url>` · **说明**: 覆盖 Browser4 服务端 URL
- **标志**: `--timeout <seconds>` · **说明**: 覆盖当前命令的 HTTP 超时时间
- **标志**: `--proxy <url>` · **说明**: 安装 / 下载运行时使用的代理
- **标志**: `--json` · **说明**: 只输出机器可读 JSON
- **标志**: `--pretty` · **说明**: 美化 JSON 输出
- **标志**: `-q`, `--quiet` · **说明**: 隐藏正常的人类可读输出
- **标志**: `-tip`, `--show-tip` · **说明**: 每条命令后在 stderr 输出相关提示

### 命令列表前需要理解的概念

#### 元素 ref 与 CSS 选择器

- `snapshot` 会返回可访问性树中的 ref，例如 `e5`、`e12`、`e42`
- 大多数交互命令同时接受 snapshot ref 和 CSS 选择器
- `htmlsnapshot` 系列命令使用 CSS 选择器，不使用可访问性 ref

#### `snapshot` 与 `htmlsnapshot`

### 工具 · 适用场景 · 输入模型 · 输出模型
- **工具**: `snapshot` · **适用场景**: 点击、输入、查找可交互元素 · **输入模型**: 实时可访问性树 · **输出模型**: `e15` 这类 ref
- **工具**: `htmlsnapshot` · **适用场景**: DOM 检查、CSS 提取、X-SQL · **输入模型**: 已存储的 HTML 快照 · **输出模型**: CSS 选择器和查询结果

#### LLM 配置

`extract`、`summarize`、`chat`、`agent run` 以及 X-SQL 的 `llm_*` 函数都需要 LLM 提供商的 API key。

### 提供商 · 环境变量
- **提供商**: DeepSeek · **环境变量**: `DEEPSEEK_API_KEY`
- **提供商**: OpenRouter · **环境变量**: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL_NAME`, `OPENROUTER_BASE_URL`
- **提供商**: Volcengine · **环境变量**: `VOLCENGINE_API_KEY`, `VOLCENGINE_MODEL_NAME`, `VOLCENGINE_BASE_URL`
- **提供商**: OpenAI-compatible · **环境变量**: `OPENAI_API_KEY`, `OPENAI_MODEL_NAME`, `OPENAI_BASE_URL`
- **提供商**: Aliyun Qwen · **环境变量**: `OPENAI_API_KEY`, `OPENAI_MODEL_NAME`, `OPENAI_BASE_URL`

```bash
export DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 完整命令参考

#### 会话生命周期与服务端管理

### 命令 · 说明
- **命令**: `open [url]` · **说明**: 打开浏览器会话，或重新连接已有会话。**默认为无头模式。** 支持 `--headed`（可视窗口）、`--headless`、`--profile `、`--profile-mode <DEFAULT\ · SYSTEM_DEFAULT\ · SEQUENTIAL\ · TEMPORARY>`、`--interact-level <FASTEST\ · FAST\ · DEFAULT>`。
- **命令**: `attach` · **说明**: 通过 CDP 或 Browser4 扩展附加到现有浏览器。支持 `--cdp <url\ · port\ · channel>` 与远程 endpoint 选项。
- **命令**: `close` · **说明**: 关闭当前活动浏览器会话。
- **命令**: `list` · **说明**: 列出浏览器会话及其状态和下次打开行为。支持 `--all`。
- **命令**: `session-default <name>` · **说明**: 把一个命名会话设为默认未命名会话。
- **命令**: `close-all` · **说明**: 关闭所有会话，但不停止后端。
- **命令**: `kill-all` · **说明**: 强制停止后端以及 Browser4 管理的浏览器进程。
- **命令**: `stop` · **说明**: 优雅停止 Browser4 服务。
- **命令**: `status` · **说明**: 显示服务版本、端口和健康状态。
- **命令**: `doctor` · **说明**: 运行诊断：构建信息、LLM 状态、陈旧 daemon 清理、可选修复。支持 `--verbose` 与 `--fix`。
- **命令**: `doctor log [name]` · **说明**: 列出、查看、tail 或 grep 后端日志文件。支持 `--tail`、grep 风格参数，以及 `doctor log <name> grep `。
- **命令**: `doctor metrics [filter]` · **说明**: 列出、过滤或 grep 后端指标。支持 `doctor metrics grep `。
- **命令**: `delete-data` · **说明**: 删除会话数据。
- **命令**: `install` · **说明**: 安装 Browser4 运行时 bundle。支持 `--tag <version>` 与 `--force`。
- **命令**: `upgrade` · **说明**: 升级 CLI / 运行时 bundle。支持 `--tag <version>` 与 `--force`。
- **命令**: `uninstall` · **说明**: 删除全局安装和运行时数据。支持 `-y`、`--yes`、`--dry-run`。

```bash
browser4-cli open --headed https://example.com
browser4-cli attach --cdp chrome
browser4-cli doctor --verbose
browser4-cli doctor log server.log --tail
browser4-cli doctor metrics grep request
```

#### 导航

### 命令 · 说明
- **命令**: `goto <url>` · **说明**: 导航到 URL；如果需要会自动打开 / 重连会话。
- **命令**: `go-back` · **说明**: 在浏览器历史中后退。
- **命令**: `go-forward` · **说明**: 在浏览器历史中前进。
- **命令**: `reload` · **说明**: 刷新当前页面。

#### 核心交互

除非另有说明，所有交互命令都接受 snapshot ref（如 `e15`）或 CSS 选择器。多数命令还支持 `--no-snapshot`，用于跳过动作执行后的自动可访问性快照。

### 命令 · 说明
- **命令**: `click <ref> [button]` · **说明**: 点击元素。支持 `--modifiers`、`--follow`、`--auto-dismiss-dialogs`。
- **命令**: `dblclick <ref> [button]` · **说明**: 双击元素。支持 `--modifiers`、`--follow`、`--auto-dismiss-dialogs`。
- **命令**: `hover <ref>` · **说明**: 悬停到元素上。
- **命令**: `fill <ref> <text>` · **说明**: 清空并填写可编辑字段。支持 `--submit`、`--verify`。
- **命令**: `type <text> [ref]` · **说明**: 向当前焦点元素或指定目标元素输入文本。支持 `--submit`、`--verify`、`--focus`、`--interactable-timeout`。
- **命令**: `press <key> [ref]` · **说明**: 向当前焦点元素或指定目标元素发送按键。支持 `--verify`、`--follow`。
- **命令**: `select <ref> <value>` · **说明**: 选择下拉框值。支持 `--verify`。
- **命令**: `check <ref>` · **说明**: 勾选复选框或单选框。
- **命令**: `uncheck <ref>` · **说明**: 取消勾选复选框或单选框。
- **命令**: `drag <startRef> <endRef>` · **说明**: 从一个元素拖放到另一个元素。
- **命令**: `wait [target]` · **说明**: 等待 selector/ref、时长、文本、URL 模式、页面加载状态或 JavaScript 表达式。支持 `--timeout`、`--text`、`--url`、`--load`、`--fn`。

`wait --load` 接受 `domcontentloaded`、`load` 和 `networkidle`。

```bash
browser4-cli click e8 --follow
browser4-cli fill e4 "john@example.com" --submit
browser4-cli type "Browser4" e7 --verify
browser4-cli wait --text "Success"
browser4-cli wait --load networkidle
```

#### 键盘与鼠标

### 命令 · 说明
- **命令**: `keydown <key>` · **说明**: 按下并保持某个键。
- **命令**: `keyup <key>` · **说明**: 释放某个已按住的键。
- **命令**: `mousemove <x> <y>` · **说明**: 把鼠标移动到页面 / 屏幕坐标。
- **命令**: `mousedown [button]` · **说明**: 按下鼠标按键。
- **命令**: `mouseup [button]` · **说明**: 释放鼠标按键。
- **命令**: `mousewheel <dx> <dy>` · **说明**: 用滚轮 delta 进行滚动。
- **命令**: `scroll <direction> ` · **说明**: 按 `up`、`down`、`left` 或 `right` 滚动页面。

#### 页面检查与实时提取

### 命令 · 说明
- **命令**: `snapshot` · **说明**: 捕获可访问性树快照。支持 `--boxes`、`-i/--interactive`、`-u/--urls`、`-c/--compact`、`--no-compact`、`-d/--depth`、`-l/--limit`、`-s/--selector`、`--raw`、`--stdout`、`-vp/--viewport`、`--filename`。
- **命令**: `snapshot grep ` · **说明**: 用 grep 风格参数搜索保存的 / 当前 snapshot YAML，例如 `-i`、`-v`、`-c`、`-l`、`-F`、`-w`、`-A`、`-B`、`-C`、`--selector`、`--page`、`--page-size`、`--all`。
- **命令**: `snapshot list` · **说明**: 列出保存的快照文件及其时间戳、大小。
- **命令**: `snapshot clean` · **说明**: 删除旧快照文件。支持 `--dry-run`。
- **命令**: `get <mode> <selector> [name]` · **说明**: 从实时页面元素中提取 `text`、`html`、`box`、`styles`、`property` 或 `attr`。
- **命令**: `eval [expression] [ref]` · **说明**: 在页面或某元素上执行 JavaScript。支持 `--file`、`--stdin`、`--base64`、`--await`、`--wait-selector`、`--json`。
- **命令**: `console [min-level]` · **说明**: 列出浏览器控制台消息。支持 `--clear`。
- **命令**: `cdp <method>` · **说明**: 发送任意 Chrome DevTools Protocol 命令。支持 `--json `。
- **命令**: `generate-locator <ref>` · **说明**: 为 snapshot ref 或已有选择器生成最佳 CSS selector。
- **命令**: `resize <width> <height>` · **说明**: 调整浏览器窗口尺寸。
- **命令**: `dialog-accept [prompt]` · **说明**: 接受 alert / confirm / prompt 对话框，并可填写 prompt 内容。
- **命令**: `dialog-dismiss` · **说明**: 关闭 alert / confirm / prompt 对话框。

`get` 支持的 mode：

### 模式 · 含义 · 示例
- **模式**: `text` · **含义**: 可见文本 · **示例**: `browser4-cli get text ".price"`
- **模式**: `html` · **含义**: inner HTML · **示例**: `browser4-cli get html "#main"`
- **模式**: `box` · **含义**: 边界框 · **示例**: `browser4-cli get box "#hero"`
- **模式**: `styles` · **含义**: 计算后的样式 · **示例**: `browser4-cli get styles e9`
- **模式**: `property` · **含义**: DOM 属性值 · **示例**: `browser4-cli get property "input" value`
- **模式**: `attr` · **含义**: HTML attribute 值 · **示例**: `browser4-cli get attr "a" href`

```bash
browser4-cli snapshot -i --boxes
browser4-cli snapshot grep -C 2 "button"
browser4-cli eval "document.title"
browser4-cli eval --file script.js --await
browser4-cli console warn
browser4-cli cdp Runtime.evaluate --json '{"expression":"document.title"}'
```

#### HTML 快照与 X-SQL 提取

`htmlsnapshot` 会捕获并存储原始 DOM 快照，是 Browser4 结构化提取工作流的核心。

### 命令 · 说明
- **命令**: `htmlsnapshot` · **说明**: `htmlsnapshot capture` 的简写。
- **命令**: `htmlsnapshot capture` · **说明**: 捕获并存储静态 HTML 快照，同时返回页面和交互元素的元数据。
- **命令**: `htmlsnapshot get <field> [selector] [name]` · **说明**: 从已存储快照中提取第一个匹配项的 `text`、`html` 或 `attr`。
- **命令**: `htmlsnapshot get all <field> [selector] [name]` · **说明**: 从已存储快照中提取全部匹配值。支持 `--offset` 和 `--limit`。
- **命令**: `htmlsnapshot query [url]` · **说明**: 运行 X-SQL。支持 `--sql <query\ · @file>`、`--sql-stdin`、`--sql-base64`、结果分页和提取导向输出选项。
- **命令**: `htmlsnapshot export` · **说明**: 把已存储 HTML 导出到文件。支持位置参数文件路径或 `--file `，以及 `--clean`。
- **命令**: `htmlsnapshot summary` · **说明**: 生成压缩版 Web Page Summary Index（WPSI）。
- **命令**: `htmlsnapshot grep ` · **说明**: 用 grep 风格参数搜索已存储 HTML。
- **命令**: `htmlsnapshot inspect [selector]` · **说明**: 发现重复 DOM 模式和候选选择器。支持 `--max`、`--depth`、`--stdin`、`--selector-base64`。

重要规则：

- 需要 ref 和交互时用 `snapshot`
- 需要重复 DOM 提取时用 `htmlsnapshot`
- 推荐使用 `htmlsnapshot query --sql @query.sql`，避免 shell 转义问题
- 需要关联型列表提取时，优先使用 `htmlsnapshot query`，而不是多次 `get all`

```bash
browser4-cli htmlsnapshot
browser4-cli htmlsnapshot get text "#productTitle"
browser4-cli htmlsnapshot get all text ".result-title" --offset 10 --limit 5
browser4-cli htmlsnapshot inspect ".s-result-item" --depth 6 --max 20
browser4-cli htmlsnapshot export --file page.html --clean
browser4-cli htmlsnapshot query --sql @query.sql
```

深入了解 X-SQL 可参见 [skills/browser4-cli/references/htmlsnapshot.md](skills/browser4-cli/references/htmlsnapshot.md) 与 [skills/browser4-cli/references/x-sql-dom-load-select.md](skills/browser4-cli/references/x-sql-dom-load-select.md)。

#### 截图与 PDF

### 命令 · 说明
- **命令**: `screenshot [ref]` · **说明**: 对页面或元素截图。支持 `--filename`、`--full-page`、`--viewport`。
- **命令**: `pdf` · **说明**: 将当前页面保存为 PDF。支持 `--filename`。

#### 标签页

### 命令 · 说明
- **命令**: `tab-list` · **说明**: 列出打开的标签页及其索引、标题、URL；配合 `--json` 可获得完整 GUID。
- **命令**: `tab-new [url]` · **说明**: 打开新标签页，可选同时导航到 URL。
- **命令**: `tab-close [index]` · **说明**: 按索引关闭标签页；支持 `--guid <guid>`。
- **命令**: `tab-select ` · **说明**: 按索引切换标签页；支持 `--guid <guid>`。

#### 浏览器存储与本地页面数据

### 命令 · 说明
- **命令**: `state-save [filename]` · **说明**: 把 cookies 和 localStorage 保存为 JSON 文件。
- **命令**: `state-load <filename>` · **说明**: 从 JSON 文件恢复 cookies 和 localStorage。
- **命令**: `cookie-list` · **说明**: 列出 cookies。支持 `--domain`、`--path`。
- **命令**: `cookie-get <name>` · **说明**: 按名称获取 cookie。
- **命令**: `cookie-set <name> <value>` · **说明**: 设置 cookie。支持 `--domain`、`--path`、`--expires`、`--httpOnly`、`--secure`、`--sameSite`。
- **命令**: `cookie-delete <name>` · **说明**: 按名称删除 cookie。支持 `--domain`、`--path`。
- **命令**: `cookie-clear` · **说明**: 清空所有 cookies。
- **命令**: `localstorage-list` · **说明**: 列出 localStorage 项。
- **命令**: `localstorage-get <key>` · **说明**: 读取 localStorage 键。
- **命令**: `localstorage-set <key> <value>` · **说明**: 设置 localStorage 键。
- **命令**: `localstorage-delete <key>` · **说明**: 删除 localStorage 键。
- **命令**: `localstorage-clear` · **说明**: 清空 localStorage。
- **命令**: `sessionstorage-list` · **说明**: 列出 sessionStorage 项。
- **命令**: `sessionstorage-get <key>` · **说明**: 读取 sessionStorage 键。
- **命令**: `sessionstorage-set <key> <value>` · **说明**: 设置 sessionStorage 键。
- **命令**: `sessionstorage-delete <key>` · **说明**: 删除 sessionStorage 键。
- **命令**: `sessionstorage-clear` · **说明**: 清空 sessionStorage。
- **命令**: `webdb export <dir>` · **说明**: 把 Browser4 web database 中的页面导出到本地目录。
- **命令**: `webdb normalize <url>` · **说明**: 把 URL 规范化为 web database key 格式。

#### AI 提取、chat 与自主 agent 任务

这些命令需要 LLM key。

### 命令 · 说明
- **命令**: `extract ` · **说明**: 从当前页面提取结构化数据。支持 `--schema <json\ · @file>`、`--filename`、`--raw`、`--stdout`。
- **命令**: `summarize [instruction]` · **说明**: 总结当前页面内容。支持 `--selector`、`--filename`、`--raw`、`--stdout`。
- **命令**: `chat <message>` · **说明**: 发送纯 AI chat 请求，不自动追加浏览器上下文。
- **命令**: `chat-result ` · **说明**: 获取异步 chat 任务结果。
- **命令**: `agent run <task>` · **说明**: 提交一个自主浏览器任务，并立即获得任务 ID。
- **命令**: `agent status ` · **说明**: 查询运行中的任务状态。
- **命令**: `agent result ` · **说明**: 获取已完成任务的结果。
- **命令**: `agent list` · **说明**: 列出已跟踪的 agent 任务及其状态。

```bash
browser4-cli extract "product name, price, rating"
browser4-cli extract "contacts" --schema @schema.json
browser4-cli summarize --selector "#reviews"
browser4-cli agent run "Go to amazon.com, compare the first 3 keyboards, write a summary"
browser4-cli agent status agent-task-1
```

#### Batch 与 loop 自动化

### 命令 · 说明
- **命令**: `batch [command...]` · **说明**: 在一次调用中执