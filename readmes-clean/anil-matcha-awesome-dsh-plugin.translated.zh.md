# 很棒的 DSH 插件 [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) - DeepSeek 的开源、一切都是插件编码代理 - 以及基于其构建的最佳社区插件的精选指南。

DeepSeek Harness 是一个基于 [Cordis](https://github.com/cordiverse/cordis)] 构建的可运行编码代理（Web UI + 无头），其中系统的每个部分 - 模型、工具、沙箱、会话存储、UI，甚至代理循环本身 - 都是一个可交换的插件。该架构产生了一个庞大、快速发展的插件生态系统：根据最新统计，有超过一千个社区插件。此列表的存在是为了使该生态系统易于扫描：插件的功能在一行中分类到您实际要查看的类别中。

> [!警告]
> 安装任何第三方 `dsh` 插件都会以您自己的权限在您的计算机上运行其代码。此处列出并不是安全审查 - 在安装之前请阅读源代码，尤其是对于涉及凭据、网络或文件系统的插件。

## DeepSeek Harness是什么？

[`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness) 是 DeepSeek 的开源代理工具，目前处于开发者预览版。它的定义思想是**一切都是插件**：模型提供程序、沙箱、工具集、会话存储和 UI 都是加载到基于 Cordis 的运行时中的插件，因此您可以替换或扩展任何层，而无需分叉线束本身。插件声明 `dsh.bundle` 清单并安装：

```sh
dsh plugin --profile web add
```

## 开始使用

```sh
# run the Web UI (served at http://127.0.0.1:3080 by default)
npx @deepseek-ai/dsh web

# or from a source checkout
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness && pnpm install && pnpm run build && pnpm dsh web
```

使用 [`dsh-plugin`](https://github.com/topics/dsh-plugin) GitHub 主题标记您自己的插件存储库，以便可以发现它，并考虑使用插件浏览器从 Web UI 内部进行一键安装/升级。

## 插件类别

### 用户界面增强

- [0xsline/dsh-spotlight](https://github.com/0xsline/dsh-spotlight) — DSH Web UI 的键盘优先命令调色板。
- [1123762794/dsh-web-restart](https://github.com/1123762794/dsh-web-restart) - 侧边栏页脚按钮，用于重新启动 dsh Web 进程，并在其触发的重新启动过程中持续存在。
- [13071301808/dsh-composer-expand](https://github.com/13071301808/dsh-composer-expand) - 展开/折叠切换，可将作曲家扩展到长草稿的高 70vh 写作视图。
- [a179-sanae/dsh-auto-collapse](https://github.com/a179-sanae/dsh-auto-collapse) - Codex 风格的自动折叠：完成后折叠成单个摘要行，卸载时完全可逆。
- [a735624258/dsh-skill-picker](https://github.com/a735624258/dsh-skill-picker) - 插入官方 `/skill-name` 手势的作曲家旁边的可搜索技能选择器。
- [a903067276-rgb/dsh-hud](https://github.com/a903067276-rgb/dsh-hud) — HUD 面板：Git 状态、MCP 服务器、技能、模型和令牌使用情况，全部浮动。
- [a903067276-rgb/dsh-file-mentions](https://github.com/a903067276-rgb/dsh-file-mentions) - 回复中的可点击文件路径，带有文件管理器中的显示和提及的文件芯片列表。
- [AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access) - 修复了 Web UI，使其能够承受 LAN 或 Tailscale 直接 IP 访问。
- [AKS1st/dsh-mermaid](https://github.com/AKS1st/dsh-mermaid) — 将美人鱼栅栏渲染为经过净化的、主题感知的 SVG 图表。
- [AKS1st/dsh-sysmon](https://github.com/AKS1st/dsh-sysmon) - 具有阈值颜色警告的浮动 CPU/内存/磁盘小部件。
- [hanzhangzzz/dsh-diagram](https://github.com/hanzhangzzz/dsh-diagram) - 直接嵌入对话中的可编辑 Excalidraw 图表。
- [giiiiiithub/terminal](https://github.com/giiiiiithub/terminal) — 通过 node-pty 和 xterm.js 实现的真实 PTY 终端面板，具有多选项卡会话和停靠/浮动窗口。
- [Ricketts-Guo/dsh-shortcuts](https://github.com/Ricketts-Guo/dsh-shortcuts) — 34个预注册键盘快捷键（会话、视图、剪贴板、模型、静默权限循环），一键录制绑定自己的快捷键。
- [Nagi-ovo/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize) - 对话中生成 UI：模型将交互式 HTML 卡渲染到聊天流中，并具有流预览和沙盒渲染功能。

### 使用和计费

- [02Muller25/dsh-api-balance](https://github.com/02Muller25/dsh-api-balance) — Composer Dock 中的实时 DeepSeek API 帐户余额。
- [283Gawin/dsh-heatmap](https://github.com/283Gawin/dsh-heatmap) - GitHub 风格的每日提交、代币使用和估计支出的活动热图。
- [940842546/dsh-usage-billing](https://github.com/940842546/dsh-usage-billing) — 使用情况和成本统计，包括高峰/非高峰定价以及日/周/月/年/所有使用热图。
- [bobcat848/dsh-calculator](https://github.com/bobcat848/dsh-calculator) — 会话和所有时间 API 支出加上帐户余额，并提供官方定价支持。
- [CN-Leo/dsh-deepseek-balance](https://github.com/CN-Leo/dsh-deepseek-balance) — Composer Dock 中的实时帐户余额，每 15 秒自动刷新一次。
- [Ghost011118/dsh-balance-meter](https://github.com/Ghost011118/dsh-balance-meter) — 具有高峰/非高峰支持的 Composer 坞站中的帐户余额和会话成本。
- [Han-1413141/dsh-cost-meter](https://github.com/Han-1413141/dsh-cost-meter) — 每个会话和每日成本，带有预算栏和一键官方价格同步。
- [huanyuLv/dsh-balance-tide](https://github.com/huanyuLv/dsh-balance-tide) — 实时高峰/非高峰定价徽章，并带有下一次定价切换倒计时。
- [Jannchie/dsh-bill](https://github.com/Jannchie/dsh-bill) — 来自 models.dev + OpenRouter（8000+ 模型）的每次调用的成本跟踪定价：每轮线路归因于工具输出/模型输出/系统提示/命令、预算、预测。
- [kirigayakazima/dsh-usage-vendor-stats](https://github.com/kirigayakazima/dsh-usage-vendor-stats) — 每个提供商令牌/缓存/输出 KPI 仪表板：53 周热图、每小时趋势、模型深入分析、CSV 导出、TTFT/速度/错误率健康卡。

### 主题和外观

- [0nt-one/dsh-neo-skin](https://github.com/0nt-one/dsh-neo-skin) - 新野蛮主义皮肤，具有硬阴影、尖角和明/暗支持。
- [AKS1st/dsh-cyber-article](https://github.com/AKS1st/dsh-cyber-particle) — 全屏、点击式粒子网络背景叠加。
- [BeiZi6/dsh-theme-plugin](https://github.com/BeiZi6/dsh-theme-plugin) - 主题工作室，具有五个预设以及完全可定制的调色板，热插拔和持久。
- [caoyiwei850/dsh-client-ui-skins](https://github.com/caoyiwei850/dsh-client-ui-skins) — 自定义图像皮肤，其中调色板遵循照片的主色调。
- [chinaRXQ/dsh-wallpaper](https://github.com/chinaRXQ/dsh-wallpaper) — 具有不透明度、蒙版和模糊控件的壁纸皮肤。
- [Isilsolme/dsh-anthropic-fonts](https://github.com/Isilsolme/dsh-anthropic-fonts) — Anthropic Sans/Serif/Mono 字体，具有 CJK 后备功能。
- [KinGao294/dsh-skin](https://github.com/KinGao294/dsh-skin) — Codex 风格的皮肤切换器，带有自定义壁纸层。
- [Lhy723/dsh-neu-theme](https://github.com/Lhy723/dsh-neu-theme) — 具有环境照明、材质阴影和磨砂玻璃表面的同态主题。
- [RevolutionLA/dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin) — 8 个原创主题、带有不透明度/模糊的半透明壁纸、每个用户的口音、可共享主题包导入/导出。
- [Tkingxiao/dsh-any-background](https://github.com/Tkingxiao/dsh-any-background) — 完全自定义主题颜色、背景壁纸和每个部分的透明度/模糊，具有导入/导出功能。

### 模型和提供商

- [BruceLanLan/dsh-tier-router](https://github.com/BruceLanLan/dsh-tier-router) - 两层路由：强大的层计划和审查，廉价的层实施，故障自动升级。
- [btspoony/dsh-llm-fallbacks](https://github.com/btspoony/dsh-llm-fallbacks) — 基于角色的 LLM 重试和后备策略。
- [dylan121322/llm-adaptive](https://github.com/dylan121322/llm-adaptive) - 通过自动提供商路由对每个请求进行复杂性分类。
- [fieldnote-ops/keyringseam](https://github.com/fieldnote-ops/keyringseam) - macOS 钥匙串凭据提供程序替换本地文件默认值。
- [franksong2702/dsh-codex-connect](https://github.com/franksong2702/dsh-codex-connect) — 将 ChatGPT OAuth / OpenAI Codex 模型连接到线束。
- [GodD6366/dsh-sub2api](https://github.com/GodD6366/dsh-sub2api) — OpenAI 兼容的多提供商路由 (OpenAI/Claude/Grok/Gemini) 位于一个基本 URL 后面。
- [kam74515-boop/dsh-everything-oauth](https://github.com/kam74515-boop/dsh-everything-oauth) — 导入现有的 Codex、Grok、Claude 和 OpenCode 登录信息，这样您就不必对每个工具重新进行身份验证。
- [katsos/dsh-克劳德-cli](https://github.com/