# awesome-dsh-plugins

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> 一个面向 [DeepSeek Harness（DSH）][1] 的精选插件目录。项目优先收录**可由 DSH Profile 装载**、具备可复现安装说明且源码公开的社区扩展；技能、预设与相关应用会明确区分，不把“使用 DeepSeek API”或仅贴有 `dsh-plugin` 标签的项目误当作原生插件。

DeepSeek Harness 目前处于 **Developer Preview**。官方采用 Cordis 的“Everything is a plugin”架构：Profile 组合 Bundle，外部插件通常以 `package.json` 的 `dsh` 字段及 patch 文件声明挂载方式。[1] [2] 因此，本目录中的安装方法和兼容性应在你自己的 DSH 版本上先行验证。

**快照日期：2026-08-17。** 本版收录 **1164 个经源码或安装清单核验的插件与 Skill**（2026-08-13 首版 54 个；**2026-08-14 两轮全量审计**共核验 1363 个候选仓库，新增 686 个核验条目；**2026-08-17 第三轮主题页审计**核验 154 个新增高星候选，新增 104 个核验条目，审计日志见 [data/audit-results.csv](data/audit-results.csv)）；同时提供 **全量聚合目录 [`CATALOG.md`](CATALOG.md)（2296 个仓库）**，合并了 GitHub 搜索（`topic:dsh-plugin`、`topic:deepseek-harness`、名称搜索）与多个社区目录，去重后得到。**聚合 ≠ 可装载、可兼容、可安全运行**，标签本身并不代表可安装、可维护或安全；只有 `✅` 标记的核验子集才进入本页主目录。[3]

### 导航 · 内容
- **导航**: [全量聚合目录](#全量聚合目录) · **内容**: **2296 个** DSH 相关仓库的完整聚合（含未审核候选）；[审计日志](data/audit-results.csv)
- **导航**: [原生插件目录](#原生-dsh-插件) · **内容**: 已核验、按能力分类的可装载 Bundle、Cordis 插件与 Web Client 扩展
- **导航**: [技能与预设](#dsh-技能与预设) · **内容**: 由 DSH Skill 目录发现的可复用能力
- **导航**: [官方内置能力](#官方内置能力不是社区插件) · **内容**: 随 DSH 源码发行的官方运行时构件
- **导航**: [相关项目与观察名单](#相关项目与观察名单不计入主目录) · **内容**: 相关但并非已核验原生插件的项目
- **导航**: [安装与安全](#安装与安全) · **内容**: 安装惯例、权限提示与审计建议
- **导航**: [贡献规则](#贡献与维护) · **内容**: 新项目的提交格式与审核门槛

## 全量聚合目录

[`CATALOG.md`](CATALOG.md) 是自动生成的**全量聚合目录**：它把 GitHub `dsh-plugin` / `deepseek-harness` 话题、名称搜索、[`dsh-plugin` 主题页候选快照](data/dsh-plugin-topic-candidates.csv)以及多个社区目录（[bruc3van/awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin)、[Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin)、[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)、[AdamPlatin123/awesome-dsh-plugins](https://github.com/AdamPlatin123/awesome-dsh-plugins)）中发现的**全部**仓库合并去重。机器可读版本是 [`data/repositories.csv`](data/repositories.csv)。

- 聚合池是**发现清单**，不是推荐或兼容性列表；只有 `✅` 已核验子集进入下方主目录。
- 用 [scripts/aggregate.py](scripts/aggregate.py) 重新拉取并重建 `CATALOG.md` 与 `data/repositories.csv`（需要 `gh` 登录）。

## 原生 DSH 插件

下列条目已核验至少一个原生特征：可复现的 `dsh plugin` 安装命令、`dsh.bundle` / `cordis.patch.yml` 声明，或 DSH/Cordis 可挂载的 `apply` 入口。**“已核验”不代表作者、代码质量或安全性背书。**

### 视觉与多模态

### 插件 · 能力 · 安装或挂载方式 · 许可 / 风险
- **插件**: [liustack/modlens](https://github.com/liustack/modlens) · **能力**: OCR、版面与语义结构化视觉证据 · **安装或挂载方式**: `npx -y @deepseek-ai/dsh plugin --profile web add @liustack/modlens` · **许可 / 风险**: MIT；依赖外部视觉引擎
- **插件**: [Scorp1o117/dsh-tool-vision](https://github.com/Scorp1o117/dsh-tool-vision) · **能力**: 为 Agent 注册 `inspect_image`，调用兼容 OpenAI 的视觉模型 · **安装或挂载方式**: 将 `dsh-tool-vision` 写入 Profile 的 `cordis.patch.yml`；见 [README](https://github.com/Scorp1o117/dsh-tool-vision/blob/main/README.md) · **许可 / 风险**: MIT；图像会发送至配置的视觉 API
- **插件**: [TiankunDai/dsh-vision-LMstudio](https://github.com/TiankunDai/dsh-vision-LMstudio) · **能力**: 使用本地 LM Studio 视觉模型 · **安装或挂载方式**: `dsh plugin --profile web add link:<repo>/packages/dsh-lmstudio-vision` · **许可 / 风险**: BSD-3-Clause；读取本地图片或剪贴板
- **插件**: [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) · **能力**: 为纯文本 DSH Agent 提供 10 个结构化视觉工具：意图感知图片问答、长截图 OCR、原始像素 grounding、UI 还原、像素 diff 等 · **安装或挂载方式**: `dsh plugin --profile web add /path/to/dsh-vision-toolkit` · **许可 / 风险**: MIT；读取本地图片文件并运行托管 Python 运行时；远程视觉工具需 OpenAI 兼容视觉 endpoint + DSH Credential（API Key）
- **插件**: [DDDFXYqiming/Agent_Extensions](https://github.com/DDDFXYqiming/Agent_Extensions) · **能力**: Collection of DSH plugins: image vision analysis (7 tools) and cross-session long-term memory, plus general skills. · **安装或挂载方式**: `dsh plugin --profile web add <绝对路径>\dsh-plugins\dsh-vision-skill` · **许可 / 风险**: MIT；Vision plugin sends local image paths/content to an external multimodal API (MiniMax default) via VISION_API_KEY credential; memory plugin reads/writes local ~/.dsh/memory files.
- **插件**: [Favio8/dsh-plugin-deepeye](https://github.com/Favio8/dsh-plugin-deepeye) · **能力**: Vision for text-only models: image description, OCR, VQA, UI layout analysis and clipboard screenshot analysis via OpenAI/Gemini/custom backends. · **安装或挂载方式**: `dsh plugin --profile web add dsh-plugin-deepeye` · **许可 / 风险**: MIT；Sends images (local paths, HTTP URLs, clipboard screenshots) to external vision APIs (OpenAI/Gemini/custom); requires API key; LRU caching and image preprocessing.
- **插件**: [Flyvhidbwo/dsh-vision-proxy](https://github.com/Flyvhidbwo/dsh-vision-proxy) · **能力**: DeepSeek brain + automatic image transcription — proxies attached images to a VLM (DashScope qwen by default) and feeds the transcribed text back to DeepSeek. · **安装或挂载方式**: `dsh plugin --profile web add github:Flyvhidbwo/dsh-vision-proxy` · **许可 / 风险**: MIT；Attached images are transcribed via an external OpenAI-compatible VLM endpoint; needs VLM API key; images leave the machine; text-only conversations bypass it.
- **插件**: [HuanLinOTO/dsh-plugin-aigc-canvas](https://github.com/HuanLinOTO/dsh-plugin-aigc-canvas) · **能力**: Provider-agnostic AIGC HTTP brid

ge + infinite canvas + ffmpeg post-processing (aigc_http_request, aigc_canvas_place, aigc_media_edit). · **安装或挂载方式**: `dsh plugin --profile  add github:huanlinoto/dsh-plugin-aigc-canvas` · **许可 / 风险**: AGPL-3.0；Sends HTTP requests to configured AIGC endpoints with in-memory API keys; writes media files locally; runs ffmpeg media processing.
- **插件**: [libinyam/dsh-vision-provider](https://github.com/libinyam/dsh-vision-provider) · **能力**: Config-only bundle：为 DSH 增加 OpenAI 兼容多模态视觉模型路由（复用内置图像管线，text+image 输入）。 · **安装或挂载方式**: `dsh plugin --profile web add github:libinyam/dsh-vision-provider` · **许可 / 风险**: MIT；Sends images/prompts/context to the configured OpenAI-compatible endpoint using an API key stored via DSH credential service; network + API key.
- **插件**: [omdsh-dev/dsh-ernie-image](https://github.com/omdsh-dev/dsh-ernie-image) · **能力**: 百度 ERNIE-Image-Turbo 文生图：宿主工具生成图片落盘并注册为会话附件，浏览器配置卡与生成画廊面板 · **安装或挂载方式**: Mount in cordis.patch.yml via bundle insert (id: ernie-image); see README · **许可 / 风险**: BSD-3-Clause；需用户自填百度 AI Studio 访问令牌（走 DSH 凭据保险箱，环境变量 ERNIE_IMAGE_API_KEY 优先）；图片经网络请求百度 API 并落盘 $DSH_HOME/ernie-image/
- **插件**: [omdsh-dev/Qwen-MM-Plugins](https://github.com/omdsh-dev/Qwen-MM-Plugins) · **能力**: Qwen-MM 能力作为运行时拉取的 Agent Skills 与严格 MCP 工具服务器（core/video-memory/video-edit/blender/freecad/edu-agent）。 · **安装或挂载方式**: Mount cordis.patch.yml / dsh.bundle.patch; see README · **许可 / 风险**: BSD-3-Clause；启用后远程 Git 拉取外部能力并启动 MCP 子进程（uvx），含 blender/freecad 自动化；默认 disabled，需显式配置 source/ref/capabilities，不静默转发凭据环境变量。
- **插件**: [PangYiMing/dsh-screenshot-diff](https://github.com/PangYiMing/dsh-screenshot-diff) · **能力**: Pixel-diff two screenshots into diff.png plus a labeled triptych using pixelmatch (像素对比工具). · **安装或挂载方式**: `dsh plugin --profile demo add github:PangYiMing/dsh-screenshot-diff` · **许可 / 风险**: MIT；Local-only image processing (sharp/pngjs/pixelmatch); no network, API keys, or credentials.
- **插件**: [PixLunaLab/dsh-plugin-pixluna](https://github.com/PixLunaLab/dsh-plugin-pixluna) · **能力**: Registers PixLuna image-source tools (pixluna_get / pixluna_get_pixiv / pixluna_sources) so the model can fetch images from lolicon/pixiv/booru. · **安装或挂载方式**: `dsh plugin --profile web add dsh-plugin-pixluna` · **许可 / 风险**: MPL-2.0；Network requests to remote image sources; optional Pixiv credentials (phpSESSID) and booru keyPairs in config; R18 content and proxy support.
- **插件**: [sjscy05/deepseek-harness-vision-plugin](https://github.com/sjscy05/deepseek-harness-vision-plugin) · **能力**: vision_read tool that forwards images/questions to a configurable vision API (OpenAI/Anthropic/Gemini/Zhipu/Qwen/Doubao) and returns text. · **安装或挂载方式**: `pnpm dsh --profile web --patch ./vision-plugin/cordis.yml` · **许可 / 风险**: MIT；Sends images (local paths/URLs/data URI

s) to external vision providers using API keys; keys read from .env.
- **插件**: [wangyang10/image-vision](https://github.com/wangyang10/image-vision) · **能力**: 视觉插件/技能：让纯文本模型调 OpenAI 兼容识图 API 看图（描述/问答/OCR/多图对比），DSH 提供 vision_query 工具 + /image-vision 斜杠命令 · **安装或挂载方式**: `dsh plugin --profile web add dsh-image-vision` · **许可 / 风险**: MIT；调第三方识图 API（OpenRouter/SiliconFlow/智谱/Kimi/通义/Ollama），需 VISION_API_KEY/OPENAI_API_KEY；读取本地图片
- **插件**: [william-jin-cmu/dsh-vision](https://github.com/william-jin-cmu/dsh-vision) · **能力**: Registers a view_image tool that bridges text-only DeepSeek to any OpenAI-compatible VLM endpoint for OCR, counting, chart reading and UI-layout questions. · **安装或挂载方式**: `- insert: - id: dsh-vision  name: '$HOME/dsh-plugins/dsh-vision/lib/index.js'  (in ~/.dsh/config.yaml)` · **许可 / 风险**: BSD-3-Clause；Sends local images (base64-inlined) over the network to a configured OpenAI-compatible VLM endpoint; reads API keys from config/env (default Zhipu GLM free tier).
- **插件**: [yumimanji/dsh-ui-spec](https://github.com/yumimanji/dsh-ui-spec) · **能力**: 将 UI 截图/线框图/参考图转为结构化前端规格：sharp 确定性几何（