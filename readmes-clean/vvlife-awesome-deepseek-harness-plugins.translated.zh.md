# Awesome DeepSeek Harness Plugins

> **中文导读**：这是 DeepSeek Harness（DSH）生态的插件精选列表，英文为主维护，中文说明见各章节标题下方。想直接上手的高星插件评测请看 [Hands-on Notes](#hands-on-notes)。

A curated list of plugins, tools, skins, bridges, and extensions for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) — the
open-source agent framework from DeepSeek, built on the motto
**"Everything is a Plugin."**

DSH launched its developer preview on **2026-08-13** (MIT license, Cordis-based).
Within a day the community shipped a wave of plugins; this list tracks the
notable ones and points to the rest.

> Star counts are a launch-day snapshot (2026-08-13) and drift fast. For the
> unmoderated, auto-refreshed index of every repo tagged `dsh-plugin`, see
> [PLUGINS.md](PLUGINS.md) (regenerated daily by
> [update.yml](.github/workflows/update.yml)).

> **生态入口 / Ecosystem**：想找插件不想翻列表？去 **[WhaleHub](https://whalehub-dsh.vercel.app)** —— 基于本列表每日同步的可视化插件市场（搜索 / 分类 / 一键复制安装命令，还能装进 DSH Web 里点一下直装）。想零配置上手 DSH？试 **[DeepSeek Harness Desktop](https://dsh-desktop.vercel.app)** —— 自包含 macOS APP（内置 Node + dsh + Paseo），拖进「应用程序」即用。

## How to install a plugin

**中文**：DSH 把插件当作 [Cordis](https://github.com/cordiverse/cordis) bundle 加载，最常用的两条路：npm 包用 `dsh plugin add <npm-package>`，仓库托管（`.dsh-plugin` 形态）用 `github:<owner>/<repo>` 形式。

DSH loads plugins as [Cordis](https://github.com/cordiverse/cordis) bundles.
Two common paths:

```sh
# npm-scoped plugin (recommended)
dsh plugin add <npm-package>

# repo-hosted plugin (the .dsh-plugin format)
# add to your profile's cordis.yml, or via the CLI patch layer:
# github:<owner>/<repo>#<ref>&path:/.dsh-plugin
```

Start the Web UI and manage models/workspaces there:

```sh
dsh web            # http://127.0.0.1:3080
```

## Official built-in plugins

**中文**：框架本体在 `@deepseek-ai/dsh-*` 这个 npm scope 下自带约 50 个内部插件包，是所有社区插件的参考实现与"接缝"底座（llm / shell / fs / web / subagent / plan / sandbox / hooks / skill …）。

The framework itself ships ~50 internal plugin packages under the
`@deepseek-ai/dsh-*` npm scope. They are the reference implementations and the
building blocks every community plugin extends. Highlights:

- **`deepseek-ai/deepseek-harness`** — the framework and all built-in packages.
  See [`packages/README`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/README.md)
  for the full map: `llm` (model adapters), `shell`/`terminal`/`code-runtime`
  (execution), `fs`/`lsp` (files & language servers), `web` (search/fetch),
  `subagent` (delegation), `plan`, `sandbox`, `hooks`, `skill`, `compaction`,
  `extensions` (runtime self-modifying plugins), and the `web`/`cli` apps.

Everything below is community-built and sits on top of these seams.

## Community plugins

### Web UI & Skins

**中文**：给 DSH 网页界面换肤、加任务看板、宠物、移动端远程等"界面增强"类插件。

- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) (★300) — DSH Web UI 的插件和皮肤集合：任务板、git 图表、右侧面板、远程移动 UI、宠物、实时令牌统计、皮肤中心。
- [bpc-oss/dsh-web-billing](https://github.com/bpc-oss/dsh-web-billing) (★9) — DSH Web 的人民币/美元代币计费：官方政策自动定价（包括高峰/非高峰时段）、每条消息的成本分类账、帐户余额、本地模型储蓄跟踪（日元/美元遵循 UI 语言）。
- [小尾qwq/dsh-深鲸](https://github.com/Small-tailqwq/dsh-deep-whale)（★56）——“鲸鱼女孩”皮肤系列（女仆工作室），CC BY-NC-SA 4.0。
- [Tommy00748/dsh-主题-cyberpunk2077](https://github.com/Tommy00748/dsh-theme-cyberpunk2077) (★12) — 赛博朋克2077/夜之城主题：NC黄×霓虹青色、CRT扫描线、Kiroshi悬停锁定、战斗状态HUD、合成打字机和消息SFX、隐藏复活节彩蛋（遗物/约翰尼）。
- [Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads) (★61) — 侧边栏/聊天提要/弹出窗口中的 2005 年风格的半开玩笑的中文网站广告。
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) (★18) — 根据您的喜好自定义“深入研究”思维状态标签。
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) (★9) — GenUI：交互式组件（布局、图表、美人鱼、3D）通过 `dsh-ui` 栅栏内联渲染。
- [vlln/whale-girl](https://github.com/vlln/whale-girl) (★10) — 桌面宠物插件（QQ宠物风格）：可拖拽、可喂食、可累积的伴侣。
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) (★15) — 生成式 UI：模型将交互式 HTML 卡直接绘制到聊天流中。
- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) (★19) — OpenPencil 设计预览和编辑插件。
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) (★9) — 选择文本→注释→作为消息发送；气泡隐藏注释块。
- [Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use) (★6) — DSH 的计算机使用插件。

### 终端和桌面

**中文**：把DSH从网页端前往终端、桌面，或终端独立App /启动器。

- [ccch1mneyyy/dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui) (★96) — Claude Code 风格的全屏 TUI：像素鲸鱼顶部栏、实时状态行、流思想、双 Esc 回滚、上下文栏 + TPS 计。一行 npm 安装。
- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) (★53) — DSH 终端用户界面。
- [chen-001/dsh-grok-tui](https://github.com/chen-001/dsh-grok-tui) (★5) — Grok 风格的 TUI。
- [hust-open-atom-club/oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh-desktop) (★46) — 可扩展的 macOS 工作台：本机 PTY、工作区工具、实时双语插件、独立预览插件市场。
- [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) (★9) — 轻量级 Windows 启动器：静默登录自动启动 + 最小的 WebView2 窗口而不是完整的浏览器。
- [bitterSmilezzz/dsh-mac-desktop](https://github.com/bitterSmilezzz/dsh-mac-desktop) (★1) — macOS 桌面包装器。
- [hanelalo/browser-bridge](https://github.com/hanelalo/browser-bridge) (★17) — 让您的代理像您一样驱动您的真实浏览器窗口。
- [Lum1104/dsh-浏览器](https://github.com/Lum1104/dsh-browser) (★16) — Chrome 侧边栏扩展，因此 DSH 可以直接操作您的浏览器，无需视觉。
- [whiteguo233/dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) (★4) — DSH 的 Bilibili 集成。
- [vvlife/deepseek-harness-desktop](https://github.com/vvlife/deepseek-harness-desktop) — 独立的 macOS 应用程序：将 Node 运行时 + 完整的 dsh + 完整的 Paseo（守护程序 + Web UI + 移动配对）捆绑到一个应用程序中 — 拖动到应用程序即可，零预安装。手机二维码配对、WhaleHub插件市场、内置HTML预览、一键公开部署；与机器上已有的任何 dsh/Paseo 隔离。

- [Zhuchen00123/dsh-wsl-modes](https://github.com/Zhuchen00123/dsh-wsl-modes) (★1) — DSH WSL 预设：minimal-wsl + code-wsl 以及 WSL Linux bash + bwrap 沙箱和锚定引导程序。

### 视觉与多模式

**中文**：让纯文本模型也能“看图”：图像问答、长截图OCR、UI还原、像素比对等。

- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) (★106) — 用于纯文本模型的视觉工具包：意图感知图像问答、长截图 OCR、UI 恢复、接地、像素差异、工件、Web UI。
- [windyslime/DeepSee](https://github.com/windyslime/DeepSee) (★1) — DSH `0.1.0-rc.5` Web 配置文件视觉集成：图像转动通过具有可插入 VLM 后端的本地 DeepSee 网关，而正常文本路由保留在 DSH 中。
- [zhouwumu2-lab/dsh-vision-fix](https://github.com/zhouwumu2-lab/dsh-vision-fix) (★10) — 视力修复/修复助手。
- [sjscy05/deepseek-harness-vision-plugin](https://github.com/sjscy05/deepseek-harness-vision-plugin) — DSH 的视觉插件。
- [good-boy4069/Deepseek-omnimodal](https://github.com/good-boy4069/Deepseek-omnimodal) (★2) — 全模式支持。
- [YYTbit/dsh-plugin-vision-toolkit](https://github.com/YYTbit/dsh-plugin-vision-toolkit) — 视觉工具包桥。

### 工具和编辑器用户体验

- [Zhangbo-cn/dsh-voice-input-plugin](https://github.com/Zhangbo-cn/dsh-voice-input-plugin) (★6) — 用于 Web UI 的 Composer 麦克风：点击监控实时转录和保持通话，主机 Edge TTS 回复朗读在模型生成时进行流式传输，朗读期间回声暂停，以及点击停止。

**中文**：编辑器体验增强、`@file`引用、消息分支编辑、会话回滚等“好不好用全靠它”的小工具。

- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) (★21) — Codex 风格的 `@file` 提到：在编辑器中搜索工作区文件并将其内容附加到提示中。
- [omdsh-dev/dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) (★17) — 使用 Monaco 编辑器和模型驱动工具生命周期创建和管理沙盒 JavaScript 工具。
- [Moeblack/dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) (★9) — 基于分支的消息编辑、重滚、重试、版本时间线。
- [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) (★16) — 通过持久的变更账本倒带对话 + 工作区状态。
- [电力