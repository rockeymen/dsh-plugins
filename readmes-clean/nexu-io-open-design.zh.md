# Open Design：The open-source Claude Design alternative

> ⚡ **Open Design Cloud——官方模型服务。** 一次充值，即可在 Open Design 里直接使用 GPT、Claude、Gemini 与 DeepSeek：20+ 旗舰模型、零配置、按真实 token 用量计费。[立即体验](https://open-design.ai/cloud/)
>
> 🏅 **Open Design Fellow 计划正式开放。** 如果你也相信设计应该是开放的，欢迎成为 Open Design Fellow，和核心团队一起打磨产品，让更多人参与并定义设计的未来。详情 → [`MAINTAINERS.md`](../../MAINTAINERS.md) 与 [Discord](https://discord.gg/mHAjSMV6gz)。

  ![Open Design hero banner](https://repo-assets.open-design.ai/resources/images/hero.png)

## 什么是 Open Design

🎨 **本地优先、开源的 Claude Design 替代品。**  🖥️ **macOS 与 Windows 原生桌面应用。**  ⚡ **100+ 功能技能 + 独立渲染模板目录** · ✨ **151 个品牌级设计系统包** · 📦 **277 个开箱即用的插件。**  🖼️ 可生成 **Web · 桌面 · 移动端原型**、**实时仪表盘 / 工件**、**演示文稿**、**图片**、**视频**，以及 **HyperFrames** 动态图形。🔒 沙箱 iframe 预览 · HTML / PDF / PPTX / MP4 导出。 🤖 **运行于 DeepSeek Harness (`dsh`) · Claude Code · OpenClaw · Codex · Cursor · OpenCode · Qwen · Copilot · Hermes · Kimi · Antigravity 等 26 个不同的本地 CLI 可执行程序**，或通过 BYOK 接入任何 OpenAI 兼容端点。

Open Design 是这样一种产物：Anthropic 随 Claude Design 推出的 **Agent 原生**循环——发现需求、锁定方向、流式输出工件、评审、交付——不再封闭，而是变成了一个由**功能技能、渲染设计模板、设计系统和插件组成的文件系统**，你笔记本电脑上已有的编码 Agent 就能读取、编写和混搭。你的 CLI 变成设计引擎，你的笔记本变成工作坊，团队的 `DESIGN.md` 变成品牌契约。

它也是 **Agent 时代的 Figma 替代品**——不再在画布上推像素，而是用真实 CSS、真实字体、真实组件交付单页工件，直接导出 HTML / PDF / PPTX / MP4——已经由你的设计系统塑形，已经可以在你日常使用的 Agent 中运行。

## 产品速览

快速看懂 Open Design 长什么样、能做什么。从 **Home** 发起创作，用 **Automation** 编排重复流程，在 **Design System** 沉淀品牌契约，靠 **Plugin** 与 **集成** 扩展能力；进入任一项目的 **Studio**，同一套设计系统即可流式产出原型、实时工件、HyperFrame、演示文稿与图片。

### 核心页面

![Home 页](https://repo-assets.open-design.ai/resources/images/product/home.png)
<sub>Home——总览入口。选择技能与设计系统，输入需求，一处发起所有创作。</sub>

![Automation 页](https://repo-assets.open-design.ai/resources/images/product/automation.png)
<sub>Automation——把重复的设计流程编排成可复用、可定时的自动化任务。</sub>

![Design System 页](https://repo-assets.open-design.ai/resources/images/product/design-system.png)
<sub>Design System——把团队的 `DESIGN.md` 沉淀为品牌契约，所有产物据此塑形。</sub>

![Plugin 页](https://repo-assets.open-design.ai/resources/images/product/plugin.png)
<sub>Plugin——浏览、安装并分发工作流插件，按需扩展生成能力。</sub>

![Integrations 页](https://repo-assets.open-design.ai/resources/images/product/integrations.png)
<sub>集成——接入外部系统与 MCP 工具，把 Open Design 用到任意 IDE、脚本与自动化中。</sub>

### Studio——一个项目里的多种产物

进入某个项目的 Studio，同一套设计系统可流式产出多种类型的工件：

![原型](https://repo-assets.open-design.ai/resources/images/product/studio-prototype.png)
<sub>原型——读取你的设计系统、在沙箱 iframe 中渲染的单页 HTML 工件，可即时预览、下载源码。</sub>

![HyperFrame](https://repo-assets.open-design.ai/resources/images/product/studio-hyperframe.png)
<sub>HyperFrame——程序化动效与动态图形，渲染为真实 MP4（如 1920×1080 · 30fps）。</sub>

![演示文稿](https://repo-assets.open-design.ai/resources/images/product/studio-ppt.png)
<sub>演示文稿——可逐页预览、键盘翻页、导出 PPTX / PDF 的 pitch deck。</sub>

![图片](https://repo-assets.open-design.ai/resources/images/product/studio-image.png)
<sub>图片——品牌级图片与视觉素材，支持高分辨率生成与下载。</sub>

## 平台兼容性

> Open Design 通过两种方式连接主流编码 Agent：可由 Agent 调用的**技能、CLI 和 MCP**，以及由 OD 直接启动 Agent 的**原生运行时适配器**。DeepSeek Harness 通过官方 `dsh` CLI 作为一等原生运行时，支持结构化流式输出、模型发现、取消与会话恢复。

### 编码 Agent / 平台 · 状态 · 快速接入
- **编码 Agent / 平台**: [Claude Code](https://docs.anthropic.com/en/docs/claude-code) · **状态**: ✅ 支持 · **快速接入**: `od mcp install claude`
- **编码 Agent / 平台**: [Codex CLI](https://github.com/openai/codex) · **状态**: ✅ 支持 · **快速接入**: `od mcp install codex`
- **编码 Agent / 平台**: [DeepSeek Reasonix](https://github.com/esengine/DeepSeek-Reasonix) · **状态**: ✅ 支持 · **快速接入**: `od mcp install reasonix`
- **编码 Agent / 平台**: [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · **状态**: ✅ 原生运行时 · **快速接入**: `od agent setup deepseek-harness`
- **编码 Agent / 平台**: [Raven](https://github.com/EverMind-AI/Raven) · **状态**: ✅ 支持 · **快速接入**: `od mcp install raven`
- **编码 Agent / 平台**: [Cursor](https://www.cursor.com/cli) · **状态**: ✅ 支持 · **快速接入**: `od mcp install cursor`
- **编码 Agent / 平台**: [VS Code + GitHub Copilot](https://github.com/features/copilot) · **状态**: ✅ 支持 · **快速接入**: `od mcp install copilot`
- **编码 Agent / 平台**: [GitHub Copilot CLI](https://github.com/features/copilot/cli) · **状态**: ✅ 支持 · **快速接入**: `od mcp install copilot`
- **编码 Agent / 平台**: [OpenCode](https://opencode.ai/) · **状态**: ✅ 支持 · **快速接入**: `od mcp install opencode`
- **编码 Agent / 平台**: [OpenClaw](https://github.com/openclaw/openclaw) · **状态**: ✅ 支持 · **快速接入**: `od mcp install openclaw`
- **编码 Agent / 平台**: [Antigravity](https://antigravity.google) · **状态**: ✅ 支持 · **快速接入**: `od mcp install antigravity`
- **编码 Agent / 平台**: [Cline](https://github.com/cline/cline) · **状态**: ✅ 支持 · **快速接入**: `od mcp install cline`
- **编码 Agent / 平台**: [Trae](https://www.trae.ai/) · **状态**: ✅ 支持 · **快速接入**: `od mcp install trae`
- **编码 Agent / 平台**: [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) · **状态**: ✅ 支持 · **快速接入**: `od mcp install kimi`
- **编码 Agent / 平台**: [Kiro](https://kiro.dev) · **状态**: ✅ 支持 · **快速接入**: `od mcp install kiro`
- **编码 Agent / 平台**: [Pi Agent](https://github.com/badlogic/pi-mono) · **状态**: ✅ 支持 · **快速接入**: `od mcp install pi`
- **编码 Agent / 平台**: [Mistral Vibe CLI](https://github.com/mistralai/mistral-vibe) · **状态**: ✅ 支持 · **快速接入**: `od mcp install vibe`
- **编码 Agent / 平台**: [Hermes Agent](https://github.com/nousresearch/hermes-agent) · **状态**: ✅ 支持 · **快速接入**: `od mcp install hermes`

使用 DeepSeek Harness 时，请先安装官方 `dsh` CLI，再在 Open Design 中选择它，或运行 `od agent setup deepseek-harness` 安装/修复 OD 连接组件。MCP 集成可用 `od mcp install <agent> --print` 干跑预览 · `--uninstall` 卸载 · 完整清单 `od mcp install --help`。

  ![Open Design 支持的 26 个编码 Agent CLI — DeepSeek Harness · Claude Code · Codex · OpenCode · Hermes · Antigravity · Vela · Grok Build · Kimi · Cursor Agent · Qwen · Qoder · GitHub Copilot · Pi · Kiro · Kilo · Mistral Vibe · DeepSeek · Reasonix · Aider · Amp · CodeBuddy · Mimo · AtomCode · Devin · Trae](https://repo-assets.open-design.ai/resources/images/coding-agents.png)

**未安装任何 CLI？** `POST /api/proxy/{anthropic,openai,azure,google,ollama,senseaudio}/stream` 的 BYOK 代理提供同样的循环（无需 spawn 进程）——粘贴 `baseUrl` + `apiKey` + `model`，支持 OpenAI、Anthropic、Azure OpenAI、Google Gemini、Ollama、LM Studio、vLLM 或任何 OpenAI 兼容端点。每个目标的 SSRF 防护在守护进程边缘拦截内网 IP / link-local / CGNAT。

运行时定义位于 [`apps/daemon/src/runtimes/defs/`](../../apps/daemon/src/runtimes/defs/)，并在 `runtimes/registry.ts` 注册；只有新的 wire format 才需要增加 parser——参见 [`docs/agent-adapters.md`](../../docs/agent-adapters.md)。

## 演示

四大核心产品类别，全部由笔记本电脑上运行的编码 Agent 渲染。点击缩略图查看实际示例。

### 1 · 原型——Web · 桌面 · 移动端

默认输出面。读取你的 `DESIGN.md` 并在沙箱 iframe 中渲染的单页 HTML 工件。

![入口视图](../../docs/screenshots/01-entry-view.png)
<sub>入口视图——选择技能、选择设计系统、输入需求。一个界面承载原型、仪表盘、演示文稿、移动应用、杂志页面。</sub>

![移动端 Onboarding](../../docs/screenshots/skills/mobile-onboarding.png)
<sub>移动端原型——像素级精确的 iPhone 15 Pro 外框、多屏流程。Agent 不会重绘手机外框；共享设备边框位于 `assets/frames/`。</sub>

![Web 原型 dating-web](../../docs/screenshots/skills/dating-web.png)
<sub>Web 原型——带滚动条、KPI、图表的编辑类仪表盘。直接从 `design-templates/dating-web/` 渲染。</sub>

![游戏化应用](../../docs/screenshots/skills/gamified-app.png)
<sub>移动端应用原型——三屏游戏化流程，含 XP 绶带和任务详情。可直接交付给 Cursor / Codex / Claude Code 转为 React/Next/Vue。</sub>

### 2 · 实时工件与仪表盘

实时仪表盘、决策室、KPI 大屏——单页工件通过调参面板拉取数据，原地可编辑。

![实时仪表盘](../../docs/screenshots/skills/live-dashboard.png)
<sub>实时仪表盘——可编辑的 KPI 大屏，调参面板暴露值得调整的参数。Agent 输出一份 manifest，iframe 无需刷新即可重新渲染。</sub>

![决策室](../../docs/screenshots/skills/research-decision-room.png)
<sub>决策室——面向产品 / 研究 / 运营会议的多源简报工件。</sub>

![GitHub 仪表盘](../../docs/screenshots/skills/github-dashboard.png)
<sub>GitHub 风格仪表盘——以实时工件形式展示仓库指标。</sub>

![Flow 实时仪表盘](../../docs/screenshots/skills/flowai-live-dashboard-template.png)
<sub>Flow 实时仪表盘模板——领域专属 KPI 模板，通过当前激活的 `DESIGN.md` 品牌化。</sub>

### 3 · 演示文稿——杂志 Deck、周报、路演

![杂志 Deck (guizang-ppt)](../../docs/screenshots/07-magazine-deck.png)
<sub>Deck 模式 (guizang-ppt)——杂志版式、WebGL 主视觉、P0/P1/P2 清单。从 [`op7418/guizang-ppt-skill`](https://github.com/op7418/guizang-ppt-skill) 完整打包，保留原始许可证。</sub>

![瑞士 Deck](../../docs/screenshots/skills/deck-swiss-international.png)
<sub>瑞士国际风格 Deck——网格锚定、单色强调。15 套 Deck 模板和 36 个主题之一，位于 `design-templates/html-ppt-*/`。</sub>

每套 Deck 均可导出为 **HTML**（单文件，内联资源）、**PDF**（浏览器打印，Deck 感知）、**PPTX**（Agent 驱动的技能）、**ZIP**（归档）或 **Markdown**。

### 4 · 图片——`gpt-image-2`、ImageRouter、自定义 API

![城市美食地图插画](https://cms-assets.youmind.com/media/1776662673014_nf0taw_HGRMNDybsAAGG88.jpg)<sub>城市美食地图插画手绘编辑风格旅行海报</sub>
![电影级电梯场景](https://cms-assets.youmind.com/media/1777453149026_gd2k50_HHCSvymboAAVscc.jpg)<sub>电影级电梯场景单帧编辑级静态画面</sub>
![赛博朋克动漫肖像](https://cms-assets.youmind.com/media/1777453164993_mt5b69_HHDoWfeaUAEA6Vt.jpg)<sub>赛博朋克肖像个人头像——霓虹面部文字</sub>
![3D 石质阶梯演变](https://cms-assets.youmind.com/media/1776661968404_8a5flm_HGQc_KOaMAA2vt0.jpg)<sub>3D 石质阶梯石刻信息图</sub>
![魅力人像](https://cms-assets.youmind.com/media/1777453184257_vb9hvl_HG9tAkOa4AAuRrn.jpg)<sub>魅力人像编辑级棚拍</sub>

**93 个可复刻提示词**位于 [`prompt-templates/`](../../prompt-templates/)——预览缩略图、完整提示词、目标模型、宽高比和来源归属。一键将需求放入编辑器。

### 5 · 视频与 HyperFrames——Agent 原生动态图形

**[HyperFrames][hyperframes]** 是 HeyGen 的开源 Agent 原生视频框架，在 Open Design 中作为一等公民集成。Agent 编写 HTML + CSS + GSAP，HyperFrames 通过 headless Chrome + FFmpeg 渲染为确定性 MP4。搭配 **Seedance 2.0** 实现影视级 t2v / i2v，**Veo 3 / Sora 2 / Kling 2** 提供路由模型变体，**Suno v5 / Lyria 2** 提供音频底座。

[![SaaS 宣传片](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/app-showcase.png)](../../prompt-templates/video/hyperframes-saas-product-promo-30s.json)<sub>30 秒 SaaS 产品宣传片 · 16:9 · UI 3D 展示</sub>
[![TikTok 卡拉OK](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/tiktok-follow.png)](../../prompt-templates/video/hyperframes-tiktok-karaoke-talking-head.json)<sub>TikTok 卡拉OK 真人出镜 · 9:16 · TTS + 逐字字幕</sub>
[![品牌精彩集锦](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png)](../../prompt-templates/video/hyperframes-brand-sizzle-reel.json)<sub>30 秒品牌精彩集锦 · 16:9 · 音频驱动动态字体</sub>
[![柱状图竞赛](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/data-chart.png)](../../prompt-templates/video/hyperframes-data-bar-chart-race.json)<sub>柱状图竞赛 · 16:9 · NYT 风格数据信息图</sub>

[![航线图](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/nyc-paris-flight.png)](../../prompt-templates/video/hyperframes-flight-map-route.json)<sub>航线图 · 16:9 · Apple 风格路线展示</sub>
[![Logo 片尾](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/logo-outro.png)](../../prompt-templates/video/hyperframes-logo-outro-cinematic.json)<sub>4 秒电影级 Logo 片尾 · 16:9 · 逐块拼合 + 光晕</sub>
[![金额计数器](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/apple-money-count.png)](../../prompt-templates/video/hyperframes-money-counter-hype.json)<sub>$0 → $10K 金额计数器 · 9:16 · Apple 风格高燃</sub>
[![网站转视频](https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/instagram-follow.png)](../../prompt-templates/video/hyperframes-website-to-video-promo.json)<sub>网站转视频 · 16:9 · 三视口截取网站</sub>

11 个 HyperFrames 模板 + 39 个 Seedance 提示词随仓库一起发布。目录缩略图 © HeyGen，框架 Apache-2.0。OD 专属渲染流程（合成缓存、sandbox-exec 变通方案、MP4-as-chip）详见 [`design-templates/hyperframes/`](../../design-templates/hyperframes/)。

[hyperframes]: https://github.com/heygen-com/hyperframes

## 为什么选择 Open Design

> **2026 年 4 月，Anthropic 发布了 Claude Design——LLM 第一次不再写文章，而是直接交付设计工件。** 它迅速传播。然而它始终闭源、仅付费、仅云端，锁定 Anthropic 的模型、Anthropic 的技能、Anthropic 的表面。没有 Checkout，没有自托管，没有 Vercel 部署，不能换成你自己的 Agent。

Open Design (OD) 是开源替代品。同样的循环，同样的工件优先心智模型，没有任何锁定：

- 🤖 **Agent 原生，不绑定模型。** 我们不发布 Agent。你 `PATH` 上已有的 `claude` / `codex` / `cursor-agent` / `copilot` / `hermes` / `kimi` 就是设计引擎。一键切换。
- 🧠 **默认品牌级。** 每次渲染都把当前包的 `DESIGN.md` 作为核心品牌契约读取。仓库随附 151 个设计系统包；旧包可以仅含 `DESIGN.md`，新包还可加入 `manifest.json`、`tokens.css`、组件、资产和来源信息。放入文件夹，选择器自动识别。
- 🖥️ **本地优先，每一层都可 BYOK。** 原生桌面应用保持本地优先，不发生云端往返。在描述 daemon 数据路径之前，必须阅读仓库根目录 `AGENTS.md` 中的 **Daemon data directory contract**。
- 🌍 **四个平面上可组合。** **插件**承载可运行的工作流 · 功能**技能**承载 Agent 行为 · **设计模板**承载渲染蓝图 · **设计系统**承载品牌。四者都采用可移植、可版本控制的目录，任何人都可以编写和发布。
- 🔁 **刷新现有代码库。** 将 `git` 仓库 + `DESIGN.md` 交给 Agent，它就能将你的真实组件重构到品牌规范。专门的插件用于将 Figma / Pencil 工作流迁移到 React / Next.js / Vue 代码。
- 🔒 **隐私信条。** 一切都运行在持有你数据的环境中——你的笔记本、你团队的服务器、你的 Vercel 项目。需要网络时有 SSRF 防护的 BYOK 代理。

### 对比

###  · Claude Design · Figma · Lovable / v0 / Bolt · **Open Design**
- 开源 · **Claude Design**: ❌ · **Figma**: ❌ · **Lovable / v0 / Bolt**: ❌ · ****Open Design****: **✅ Apache-2.0**
- 自托管 / 桌面 · **Claude Design**: ❌ · **Figma**: ❌ · **Lovable / v0 / Bolt**: ❌ · ****Open Design****: **✅ macOS + Windows + Docker**
- Agent 原生（在 CLI 中运行） · **Claude Design**: 仅 Anthropic · **Figma**: ❌ · **Lovable / v0 / Bolt**: 仅云端 Agent · ****Open Design****: **✅ 25 CLI + BYOK**
- 品牌级 `DESIGN.md` · **Claude Design**: 私有 · **Figma**: Theme JSON · **Lovable / v0 / Bolt**: 有限 token · ****Open Design****: **✅ 151 系统随附**
- 技能 / 插件 / 模板 · **Claude Design**: 封闭 · **Figma**: 插件商店 · **Lovable / v0 / Bolt**: 封闭 · ****Open Design****: **✅ 100+ 功能技能 · 独立渲染模板目录 · 277 插件**
- HyperFrames (HTML→MP4) · **Claude Design**: ❌ · **Figma**: ❌ · **Lovable / v0 / Bolt**: ❌ · ****Open Design****: **✅ 一等公民**
- 将现有仓库刷新到品牌 · **Claude Design**: ❌ · **Figma**: ❌ · **Lovable / v0 / Bolt**: ❌ · ****Open Design****: **✅ 通过 Agent + `DESIGN.md`**
- 最低费用 · **Claude Design**: Pro / Max / Team · **Figma**: Pro / Org · **Lovable / v0 / Bolt**: Pro / Team · ****Open Design****: **BYOK · 任意兼容端点**

## 快速开始

### 🖥️ 下载桌面应用（推荐——零配置）

使用 Open Design 最快的方式。无需 Node、pnpm 或克隆仓库。

- **macOS**（Apple Silicon · Intel x64）→ [**open-design.ai**](https://open-design.ai/) 或 [GitHub Releases](https://github.com/nexu-io/open-design/releases)
- **Windows**（x64）→ [**open-design.ai**](https://open-design.ai/) 或 [GitHub Releases](https://github.com/nexu-io/open-design/releases)
- **Linux**（AppImage，可选通道）→ [GitHub Releases](https://github.com/nexu-io/open-design/releases)

安装后：应用自动检测 `PATH` 上的所有编码 Agent CLI，加载 100+ 功能技能、独立渲染模板目录和 151 个设计系统包，打开后即可在入口视图中输入需求。

### 🤖 安装到你的编码 Agent（无 UI）

你可以在完全不打开 GUI 的情况下使用 Open Design——在 Claude Code、Codex、Cursor、Copilot、OpenClaw、Antigravity、Hermes、Kimi 等中作为技能、插件或 MCP 服务器调用。

```bash
# 一行命令安装到你正在使用的 Agent：
od mcp install <agent>
# <agent> = claude | codex | reasonix | raven | cursor | copilot | openclaw | antigravity
#         | pi | vibe | hermes | cline | kimi | kiro | trae | opencode
```

然后在 Agent 内：

```
> Use open-design to generate a landing page with the Linear design system
```

在有文件系统的本地 CLI 运行中，Agent 会将选中的功能技能或设计模板与 `DESIGN.md` 组合，写入规范项目文件，Open Design 直接预览这些文件。没有文件系统工具的 BYOK/纯 API 运行则返回一个完整的 `<artifact>` 块。

### 🐳 使用 Docker 运行

```bash
git clone https://github.com/nexu-io/open-design.git
cd open-design/deploy
cp .env.example .env
echo "OD_API_TOKEN=$(openssl rand -hex 32)" >> .env
docker compose up -d
# 打开 http://localhost:7456
```

### 🚀 部署到 Sealos

[![Deploy on Sealos](https://sealos.io/Deploy-on-Sealos.svg)](https://sealos.io/products/app-store/open-design/)

Sealos App Store 模板会运行已发布的 Open Design Docker 镜像，提供持久化工作区存储，并在公网代理层启用 Basic Auth。自定义公开或共享 Docker 部署请遵循 [`deploy/README.md`](../../deploy/README.md#local-compose) 中的反向代理和 `OPEN_DESIGN_ALLOWED_ORIGINS` 指引。

### 🧑‍💻 从源码运行

```bash
git clone https://github.com/nexu-io/open-design.git
cd open-design
corepack enable && pnpm install
pnpm tools-dev run web
```

打开 `tools-dev` 打印的 URL；除非显式传入端口参数，开发端口会动态分配。

Node `~24`，pnpm `10.33.x`。Windows 用户请参见 [`docs/windows-troubleshooting.md`](../../docs/windows-troubleshooting.md)。完整的快速开始指南、环境变量、Nix flake 和打包构建流程 → [`QUICKSTART.zh-CN.md`](QUICKSTART.zh-CN.md)。

### 一个完整的工作流——从需求到工件

`需求 → 插件 → 方向 → 设计系统 → 工件 → 交付 → 记忆`

1. **PM 提交需求。** 插件选择器提供落地页 · 路演 Deck · 仪表盘 · 社交媒体帖 · PM 规范 · OKR 记分卡……
2. **设计师（或 Agent）锁定方向。** 没有品牌？从 5 个精选方向中选择。有品牌？放入截图 / URL → Agent 连接 GitHub、导入 Figma、编纂可复用的 `DESIGN.md`。
3. **Agent 创建首个交付物。** 插件 + 功能技能或设计模板 + `DESIGN.md` 已绑定。有文件系统的 CLI 运行写入规范项目文件，预览随文件更新；没有文件工具的 BYOK/纯 API 运行返回一个完整的 `<artifact>` 块。
4. **交付给工程团队。** 工件是真实的 HTML/CSS——放入 Cursor、Codex 或 Claude Code 中继续作为代码开发。或直接导出 PPTX / PDF / MP4 交给营销团队。
5. **Open Design 越用越聪明。** 你的截图、字体、色板和已确认的工件会累积为下次会话的默认值。更少的重复劳动，更少的偏差。

## 从你的编码 Agent 使用 Open Design

Open Design 提供 **stdio MCP 服务器**和逐 Agent 的**安装脚本**。任何位于其他仓库的 MCP 兼容 Agent 都可以直接读取你本地 Open Design 项目的文件——token CSS、JSX 组件、入口 HTML——作为按名称查询的结构化 API。Agent 始终看到实时文件，而非过期的导出。

```bash
# 一行命令安装（支持 16+ CLI）：
od mcp install <agent>

# 然后，Agent 可以：
od project list --json
od files list  --json
od files read  <relative-path>
od plugin list --json
od skills list --json
```

**为什么选择 MCP？** 每次迭代都导出并重新附加 zip 会打断流程。MCP 直接暴露设计源文件——Agent 始终看到实时文件。

**对于从零开始的 Agent**，安装器会放置 `~/.config/<agent>/open-design.json`（或平台等效路径）以及可复制粘贴的 MCP 代码片段。Cursor 获得一键深层链接；Claude Code 获得 `claude mcp add-json` 一行命令；其他所有 Agent 获得其配置所需 schema 格式的 JSON。完整的逐 Agent 流程 → 桌面应用中的**设置 → MCP 服务器**，或 [`docs/agent-adapters.md`](../../docs/agent-adapters.md)。

**安全模型。** 默认只读，守护进程绑定到 `127.0.0.1`，SSRF 在代理边缘拦截。局域网暴露需要 `OD_BIND_HOST` 显式启用加 `OD_ALLOWED_ORIGINS`。连接器凭证和实时工件预览路由无论如何都保持仅本地回环。

## 技能与设计模板

**100+ 个功能技能位于 [`skills/`](../../skills/)**。它们遵循 Agent Skills [`SKILL.md`][skill] 约定，提供可复用的 Agent 行为、参考资料或工具。可渲染的启动模板单独位于 [`design-templates/`](../../design-templates/)；它们也可以使用 `SKILL.md`，但进入设计模板目录，而不是功能技能注册中心。

两种**模式**构成设计模板目录主线：`prototype`（Web/移动端/桌面单页工件）和 `deck`（横向滑动演示文稿）。其他模板覆盖 `image`、`video`、`audio` 与 utility 表面。**`scenario`** 字段按受众分组：`design` · `marketing` · `operation` · `engineering` · `product` · `finance` · `hr` · `sale` · `personal`。

### 设计模板 · 模式 · 场景 · 产出物
- **设计模板**: [`web-prototype`](../../design-templates/web-prototype/) · **模式**: prototype · **场景**: design · **产出物**: 默认落地页 / 主视觉
- **设计模板**: [`saas-landing`](../../design-templates/saas-landing/) · **模式**: prototype · **场景**: marketing · **产出物**: 主视觉 / 功能 / 定价 / CTA
- **设计模板**: [`dashboard`](../../design-templates/dashboard/) · **模式**: prototype · **场景**: operation · **产出物**: 管理后台 / 数据分析（带侧边栏）
- **设计模板**: [`mobile-app`](../../design-templates/mobile-app/) · **模式**: prototype · **场景**: design · **产出物**: iPhone 15 Pro / Pixel 外框应用
- **设计模板**: [`mobile-onboarding`](../../design-templates/mobile-onboarding/) · **模式**: prototype · **场景**: design · **产出物**: 启动页 · 价值主张 · 登录流程
- **设计模板**: [`social-carous