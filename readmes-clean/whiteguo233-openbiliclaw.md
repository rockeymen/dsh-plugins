# 🦀 OpenBiliClaw

**通用个性化内容推荐 Agent——本地运行、跨平台理解你、只为你一个人构建**

*A general-purpose personalized content discovery Agent — runs on your machine, understands only you*

[项目主页](https://whiteguo233.github.io/OpenBiliClaw/) | [English](README_EN.md) | 中文

> ### 🆕 重要更新：OpenBiliClaw 现在可以装进 DeepSeek Harness
>
> 新增 **DSH 客户端插件** —— 把 OpenBiliClaw 装进 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)：DSH 界面常驻第四栏（推荐 / 内容库 / 对话 / 画像 / 设置），并注册 22 个 Agent Bridge 工具，让 DSH 里的 Agent 也能读推荐、答探测、闭环学习——边用 DSH 干活，边刷跨平台个性化内容。→ [`github.com/whiteguo233/dsh-openbiliclaw`](https://github.com/whiteguo233/dsh-openbiliclaw)
>
> 📱 想要原生 App？Flutter 移动端客户端（Android / iOS / Web / 桌面）在独立仓库 [`OpenBiliClaw-mobile`](https://github.com/whiteguo233/OpenBiliClaw-mobile)：推荐、对话、画像、收藏 / 稍后再看 / 30 天历史一应俱全，连接同一本地后端。

## 10 秒看懂 OpenBiliClaw

一个纯本地、私有、开源的自进化跨平台内容发现 Agent：从你的跨平台使用、反馈和对话中持续深化心理画像，带着对你的理解主动去 B 站、小红书、抖音、YouTube、X、知乎、Reddit、Linux.do、Bangumi、V2EX、微博与开放 Web 找内容。

### 跨平台 · 本地优先 · 可调教
- **跨平台**: B 站 / 小红书 / 抖音 / YouTube / X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博 / Web · **本地优先**: 数据默认留在本机 SQLite · **可调教**: 喜欢、不感兴趣、聊天反馈都会改变后续推荐

  ·

  <sub>喜欢这个方向？[欢迎 Star 支持项目继续适配更多平台](https://github.com/whiteguo233/OpenBiliClaw)。</sub>

  ![OpenBiliClaw 跨平台本地推荐 Agent 演示：信号进入本地后端、生成画像、解释推荐理由、根据反馈继续学习](docs/images/hero-demo-zh.gif)

## 快速开始

普通用户只需四步；Firefox、Docker、脚本和手动部署等备用路径都在 [安装与部署详情](#安装与部署详情)。

1. **装插件** —— [Chrome 应用商店一键安装](https://chromewebstore.google.com/detail/cdfjfkdjjhdaccbldipkjhpibnfbiamg)（自动更新），或从 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载 zip 手动安装（最新功能先到，商店版可能滞后几天）。
2. **装后端** —— 从同一个 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载桌面安装包（macOS `.dmg` / Windows `.exe`，开箱即用、常驻菜单栏/托盘）。每个平台有两种安装包:**精简版**(默认,首启自动下载向量模型 bge-m3)与 **`-with-embedding` 完整版**(已内置 bge-m3 ~1.1GB,离线开箱即用)——网络差 / 想离线的选完整版,其余选精简版。想改源码或深度定制,就把下面这句话粘给 Claude Code / Codex CLI / Cursor 等 AI 编程助手：

   ```text
   请按照 https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/docs/agent-install.md 的说明帮我部署 OpenBiliClaw 后端(务必用 Bash 的 curl 下载这个文档,不要用 WebFetch — 会丢关键指令)
   ```

3. **连接来源** —— 在装了插件的浏览器登录 [B 站](https://www.bilibili.com)（默认初始化来源），或改选小红书 / 抖音 / YouTube / X / 知乎 / Reddit / Linux.do / V2EX / 微博；Linux.do、Bangumi、V2EX 与微博均可做公开发现，登录 Linux.do、V2EX 或微博后还能在初始化时只读导入个人信号，Bangumi 可用公开用户名初始化画像。微博公开发现无需登录，个人收藏 / 关注 / 互动初始化需要已登录微博浏览器态。
4. **打开界面** —— 浏览器访问 `http://127.0.0.1:8420/web`；手机扫插件二维码打开 `http://<电脑局域网 IP>:8420/m/`，保存到主屏幕即可当 App 用；想要原生 App 体验，可安装独立仓库的 [Flutter 客户端](https://github.com/whiteguo233/OpenBiliClaw-mobile)（Android / iOS / Web / 桌面，安装包见 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw-mobile/releases/latest)），在设置里填后端地址即可连接同一后端。

## 用户交流群

  
    
      ![QQ 用户交流群二维码](docs/images/user-community-qrcode.png)
      QQ 用户群
    
    
      Discord 社区
      <sub>扫码或[点击加入](https://discord.gg/PU6Xgch8yg)，链接长期有效</sub>
    
  

## 为什么需要 OpenBiliClaw？

> 名字起源于 B 站（`Bili` = Bilibili，`Claw` = 爪子），项目最早只支持 B 站。从 v0.3.0 起已扩展为通用跨平台 Agent，覆盖 B 站 / 小红书 / 抖音 / YouTube / X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博与通用 Web，持续接入更多内容平台。

推荐系统本质上是一个**中间商**——平台站在海量内容和海量用户之间做匹配分发。现代推荐系统远比「优化点击率」复杂：它同时权衡点击率、完播率、点赞/投币概率、停留时长、用户留存、创作者生态健康、广告收入等十几个目标，把它们加权压成一个分数来排序。听起来很科学，但问题在于：**这些权重是平台定的，优化目标归根结底是平台的**——用户满意度只是被当作留存和变现的手段，而非目的本身。你以为你在挑内容，其实是中间商在替你决定你能看到什么。结果就是：推荐越来越像你已经看过的东西，偶尔的惊喜全靠运气。

而且每个平台都是一座孤岛。你在 B 站看了三年机械键盘，小红书完全不知道；你在小红书种草的咖啡器具，B 站从来不会推给你。你的兴趣被割裂在不同平台的数据库里，没有人帮你把它们连起来。

**OpenBiliClaw 反过来。** 它是一个本地运行的 AI Agent——先深度理解你，再根据对你的理解**跨平台**主动搜寻你会喜欢的内容。项目从 B 站起步，现已覆盖小红书、抖音、YouTube、X（Twitter）、知乎、Reddit、Linux.do、Bangumi、V2EX、微博和开放 Web：

### 🧠 先懂你，再找内容

不是从视频出发匹配标签，而是从你出发。通过行为分析推断 MBTI、认知风格、深层心理需求，构建五层灵魂画像（事件→偏好→觉察→洞察→灵魂）。它理解的是你这个人，不是你的点击记录。

### 🔮 根据理解主动探索，而非被动匹配

这是和传统推荐最核心的差异：系统会基于对你的理解，**主动猜测你可能感兴趣但从未接触过的领域**。一个关注机械表的人可能会喜欢建筑美学，一个看量子物理科普的人可能对哲学感兴趣——它用心理学桥接逻辑主动出击，猜对了升级为正式兴趣，猜错了安静退出。协同过滤永远不会推给你「没人从这条路径走过」的内容，但 OpenBiliClaw 会。

### 🔒 100% 本地，100% 你的

核心行为、推荐和对话数据留在你硬盘上的 SQLite，配置、画像、凭据与缓存也只保存在本机文件中。LLM 默认用你自己的 API Key，也可实验性复用本机 Codex CLI 的 ChatGPT OAuth 凭据。没有 OpenBiliClaw 运营的云端账号，没有任何人能看到你的画像。这个 Agent 怎么长，完全你说了算——反馈推荐、对话调教、换 LLM、迁移或改数据库，随你。

> 💡 **和其他推荐工具的对比**
>
> | | 各平台官方推荐 | 关键词过滤插件 | OpenBiliClaw |
> |---|---|---|---|
> | 推荐逻辑 | 协同过滤 | 标签匹配 | 心理画像 + 五层记忆 |
> | 内容来源 | 单一平台 | 单一平台 | 跨平台（B 站 · 小红书 · 抖音 · YouTube · X · 知乎 · Reddit · Linux.do · Bangumi · V2EX · 微博 · Web） |
> | 信息茧房 | 越推越窄 | 不解决 | 猜测兴趣主动破茧 |
> | 数据归属 | 平台所有 | 通常云端 | 100% 本地 |
> | 推荐解释 | "猜你喜欢" | 无 | 像朋友一样告诉你为什么 |
> | 可定制 | 不可以 | 低 | 换 LLM / 改画像 / 写 Skill |

## 📸 功能预览

核心入口现在有五个：浏览器插件负责平台内交互和登录会话，桌面端 Web（`/web`）提供大屏推荐首页，移动端 Web（`/m`）适合手机使用，另有独立仓库的原生 Flutter 客户端（[OpenBiliClaw-mobile](https://github.com/whiteguo233/OpenBiliClaw-mobile)）覆盖 Android / iOS / Web / 桌面，以及把同一套面板搬进 DSH Web 界面的 [DSH 客户端插件](https://github.com/whiteguo233/dsh-openbiliclaw)（第四栏 + 22 个 Agent Bridge 工具）。桌面端、移动端 Web、原生客户端和 DSH 插件都只调用本地 API，Cookie 同步和平台任务仍由插件承担。

  
    
      ![](docs/images/screenshot-recommend.png)
      智能推荐
      <sub>像朋友一样解释为什么你会喜欢</sub>
    
    
      ![](docs/images/screenshot-profile-portrait.png)
      灵魂画像
      <sub>自然语言描述的深度人格分析</sub>
    
    
      ![](docs/images/screenshot-profile-traits.png)
      结构化特质
      <sub>MBTI · 核心特质 · 深层需求</sub>
    
    
      ![](docs/images/screenshot-chat.png)
      对话调教
      <sub>聊天告诉它你想看什么</sub>
    
  

### 🖥️ 桌面端 Web 预览

启动后端后访问 `http://127.0.0.1:8420/web`（或直接 `http://127.0.0.1:8420/`，会自动跳转），即可在浏览器大屏上使用推荐首页。

  
    
      ![](docs/images/desktop-home.png)
      桌面推荐首页
      <sub>惊喜推荐 Hero · 为你推荐网格 · 朋友式推荐理由</sub>
    
    
      ![](docs/images/desktop-cards.png)
      推荐卡片网格
      <sub>封面 + 推荐理由 · 喜欢 / 不感兴趣 / 稍后 / 收藏 / 聊一聊</sub>
    
  
  
    
      ![](docs/images/desktop-profile.png)
      画像 + 实时看板
      <sub>侧栏 Runtime 看板 + 后台动态 · 人格素描 · 核心特质 · MBTI 推断</sub>
    
  

### 📱 移动端 Web 预览

  
    
      ![](docs/images/mobile-recommend.png)
      手机推荐页
      <sub>惊喜推荐 + 池子状态 · 朋友式推荐原因</sub>
      <sub>看看 / 喜欢 / 稍后 / 收藏 / 不感兴趣 / 聊一聊</sub>
    
    
      ![](docs/images/mobile-profile.png)
      手机画像页
      <sub>人格素描 · 核心特质 · 深层需求 · MBTI</sub>
    
    
      ![](docs/images/mobile-chat.png)
      手机对话页
      <sub>与插件共享主聊天历史</sub>
    
  

> 📱 想要原生 App？独立仓库 [OpenBiliClaw-mobile](https://github.com/whiteguo233/OpenBiliClaw-mobile)（Flutter）提供 Android / iOS / Web / Linux / macOS / Windows 客户端：推荐、对话、画像、收藏 / 稍后再看 / 30 天历史、消息收件箱一应俱全，B 站封面走 CDN 直连省两跳。Android 签名 APK 与 iOS 自签名 IPA 从 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw-mobile/releases/latest) 下载（iOS 需用个人 Apple 账号重签）。当前为新特性预览版，尚未经过长期实测。

更多截图

  
    
      ![](docs/images/screenshot-recommend-feedback.png)
      推荐反馈
      <sub>点赞 / 多来点 / 少来点 / 没兴趣</sub>
    
    
      ![](docs/images/screenshot-profile-values.png)
      价值偏好与兴趣
      <sub>内在驱动力 · 猜测兴趣方向</sub>
    
    
      ![](docs/images/screenshot-profile-style.png)
      认知风格
      <sub>信息处理偏好 · 内容口味</sub>
    
  

## 最近更新

📌 最新版本：**v0.3.206（2026-08-15）**

- **with-embedding 安装包更稳了** —— 修复 bge-m3 调用 500 / llama-server `0xc0000005` 崩溃的误诊与随包版本，Windows 随包 Ollama 升级到 0.32.13，崩溃时给出按序排查清单并保留托管 Ollama 日志。
- **Windows 一键安装修复** —— 修复原生 PowerShell 5.1 下一键安装脚本的解析失败与中文注释 / here-string 编码问题，`$args` 遮蔽自动变量也一并修正。

完整变更详见 [docs/changelog.md](docs/changelog.md)。

## 安装与部署详情

普通用户的正常流程是：先安装浏览器插件，再把一句话发给 AI 助手安装后端，在同一个浏览器登录内容平台；如果要在手机上使用，再打开移动端 Web。脚本、Docker 和手动部署只作为备用路径，放在下面折叠区。

### 1. 安装浏览器插件

插件是主要入口：它会在受支持站点显示侧边栏、采集你的反馈，并承接知乎、Reddit、Linux.do、V2EX、微博等登录态只读任务。Linux.do、V2EX 与微博的任务 tab 和普通行为采集隔离；微博公开 discovery 由后端独立完成，个人初始化才使用微博 host permission 和同源任务桥。

插件基于 Manifest V3，支持所有兼容 Chrome 插件的浏览器，包括 **Chrome、Edge、Brave、Arc、Vivaldi、Opera** 等。

**推荐方式 · 从 Latest Release 聚合页下载最新版手动安装**（拿到最新功能与修复 —— Chrome 应用商店受审核排期影响，版本通常会滞后几天到一两周）：

1. 打开 [OpenBiliClaw Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest)，也就是最新 `openbiliclaw-v*` 用户下载聚合页
2. Chrome / Edge / Brave 下载 `openbiliclaw-extension-v*.zip`；Firefox 若 release 提供 `openbiliclaw-extension-v*-firefox.xpi` 就直接安装，否则下载 `openbiliclaw-extension-v*-firefox.zip` 并按下方 `about:debugging` 临时加载
3. 打开扩展管理页面（Chrome：`chrome://extensions/` · Edge：`edge://extensions/` · Brave：`brave://extensions/`），开启右上角「开发者模式」
4. Chrome / Edge / Brave 将下载的 `.zip` 文件拖入页面安装；Firefox 的 `.xpi` 可直接打开确认安装，临时 zip 需要先解压再加载 `manifest.json`

**省事方式 · Chrome 应用商店一键安装**（安装后由浏览器自动更新，适合不想手动升级的人；缺点是版本可能滞后于 Releases）：

> 👉 **[在 Chrome 应用商店安装 OpenBiliClaw](https://chromewebstore.google.com/detail/cdfjfkdjjhdaccbldipkjhpibnfbiamg)** —— 打开后点「添加至 Chrome」即可。

插件更新取决于安装渠道：Chrome Web Store / Edge Add-ons，以及审核通过后的 Firefox AMO 上架版由浏览器自动更新；从 GitHub Release 下载的 Chrome zip / Firefox signed XPI / Firefox 临时 zip、开发者模式加载或 Firefox 临时加载的用户，需要下载新版安装包并按同样方式重新加载。Firefox AMO 上架审核是异步的，listed 版本公开前请从 Release 使用 `*-firefox.zip` 临时加载；审核通过后由 Firefox 自动更新。后端设置里的“自动更新”开关只更新本地后端源码，不会更新浏览器插件。

Firefox 用户：正式安装与临时调试（Firefox 140+）

Firefox 用 `sidebar_action` 而不是 Chrome 的 `sidePanel`，所以 release 会提供独立产物：

- `openbiliclaw-extension-v*-firefox.xpi`：Mozilla AMO unlisted 签名后的正式安装包；仅在发布环境启用 AMO signing 且凭据可用时生成，普通 Firefox Release / Beta 可以直接安装。
- `openbiliclaw-extension-v*-firefox.zip`：未签名开发包，只用于 `about:debugging` 临时加载或 AMO 签名输入。普通 Firefox 直接安装它会提示“未通过验证 / could not be verified”。

临时调试或源码构建时使用：

```bash
unzip openbiliclaw-extension-v*-firefox.zip -d openbiliclaw-firefox

# 或从源码构建
git clone https://github.com/whiteguo233/OpenBiliClaw.git
cd OpenBiliClaw/extension
npm install
npm run build:firefox          # 产出 dist-firefox/
npm run package:firefox        # 额外打成未签名 openbiliclaw-extension-v*-firefox.zip
# AMO 凭据配置后可签名成正式安装包：
# AMO_JWT_ISSUER=... AMO_JWT_SECRET=... npm run sign:firefox:only
```

加载方式：

1. 打开 `about:debugging#/runtime/this-firefox`
2. 点「Load Temporary Add-on…」
3. 选解压目录里的 `manifest.json`（或源码构建后的 `extension/dist-firefox/manifest.json`）

注意：Firefox 临时加载在浏览器重启后会失效；如果 release 提供已签名 `.xpi`，普通用户应优先使用 `.xpi`。

### 2. 部署后端（二选一）

普通用户直接用**桌面安装包**最省事；想改源码、换 LLM、深度定制就用 **AI 一句话部署**。

#### 方式 A：下载桌面安装包（实验性，最省事）

到 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 的 `openbiliclaw-v*` 聚合发布页下载对应系统的安装包。这个聚合页会同步展示：

- 当前后端源码 tag：`backend-v*`
- 当前插件 release：`extension-v*`，并附 `openbiliclaw-extension-v*.zip` / `openbiliclaw-extension-v*-firefox.zip`（Firefox 临时调试）；启用 AMO signing 时还会附 `openbiliclaw-extension-v*-firefox.xpi`（Firefox 正式安装）
- 当前桌面安装包 release：`desktop-v*`，同版本桌面 channel 完成后会附可用的 `.dmg` / `.exe`；缺失 channel 显示未发布，不回填上一版资产

- **macOS**：从发布页下载与你的 Mac 匹配的 DMG：Apple 芯片用 `OpenBiliClaw-macos-v*-arm64.dmg`；Intel 用 `OpenBiliClaw-macos-v*-x64.dmg`（如发布页提供）。打开后推荐双击 `安装并启动 Install OpenBiliClaw.command`：它会校验新包、退出旧实例、原子替换「应用程序」中的 app，再启动刚安装的版本；传统拖拽仍可用，但升级时需先退出旧版并在替换后手动重开。
- **Windows**：下载 `OpenBiliClaw-windows-*-Setup.exe`，双击安装。安装或升级成功后，安装器会结束旧实例并从安装目录自动启动刚安装的新版本（静默安装也一样）。

安装包自带本地 Ollama + `bge-m3` embedding，开箱即用；也内置默认内容源依赖，包括 X 的 `twitter-cli` 和 Reddit 的 `rdt-cli`（Reddit rdt 命令后端会优先使用已连接插件同步的 `reddit_session`，插件不可用时可手动运行 `rdt login`，未登录会 fallback 插件）。启动后常驻 **macOS 菜单栏 / Windows 系统托盘**，右键可「打开 Web 界面 / 查看运行日志 / 退出」。数据与 AI / 脚本安装复用同一个目录：`~/OpenBiliClaw`（macOS / Linux）/ `%USERPROFILE%\OpenBiliClaw`（Windows），升级或卸载不会动它；旧安装包曾写入的 `~/Library/Application Support/OpenBiliClaw` / `%LOCALAPPDATA%\OpenBiliClaw` 会在新版本首次启动时非覆盖拷贝回来。若 `config.toml` / `config.local.toml` 损坏导致启动失败，桌面包会把坏文件备份为 `*.invalid` 并重新生成默认配置，随后打开 `/setup/` 重新初始化；`data/` 不会被删除。

> ⚠️ **macOS 安全阻挡（应用尚未签名 / 公证）**：
> - 当前 Release 是 ad-hoc signed、未 notarized。首次打开安装助手或应用时如果提示“无法验证开发者”或“未经安全验证”，请右键 / Control-click 对应项目 →「打开」→ 在弹窗里再点「打开」；也可以到「系统设置 → 隐私与安全性」点击「仍要打开」。
> - 如果提示“`OpenBiliClaw.app` 已损坏，无法打开。您应该将它移到废纸篓”，通常是下载隔离属性导致。确认包来自本项目 Releases 后运行：
>
>   ```bash
>   APP="/Applications/OpenBiliClaw.app"
>   xattr -dr com.apple.quarantine "$APP"
>   ```
>
>   然后再次打开应用。
> - **Windows**：SmartScreen 弹窗点「更多信息 → 仍要运行」。
>
> 这是**实验性预发布**：未签名、随后端版本滚动更新，适合只想最快试用、不碰命令行的人。要二次开发 / 改源码请用下面的方式 B。

#### 方式 B：AI 一句话部署（可定制 / 可改源码）

把下面整句粘给 Claude Code、Codex CLI、Cursor、Windsurf 或其他 AI 编程助手即可。括号里的限制是给 AI 助手看的，你不用理解。

```text
请按照 https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/docs/agent-install.md 的说明帮我部署 OpenBiliClaw 后端(务必用 Bash 的 curl 下载这个文档,不要用 WebFetch — 会丢关键指令)
```

AI 助手会克隆仓库、安装依赖、用局域网可访问的默认绑定启动后端（`0.0.0.0:8420`）、做健康检查，并问几个有默认值的问题。自动初始化前会真实验证全局 LLM 实例链和独立 embedding 服务；有一个不通就先停下让你修配置。小红书、抖音、YouTube、X、知乎、Reddit、Linux.do、V2EX 与微博数据只有你明确同意才会进入初始画像；微博个人事件需要已登录微博浏览器和扩展，公开发现仍可匿名进行。

Chrome Web Store / AMO 发布包默认只声明本机后端权限。让插件连接局域网另一台机器或远程域名时，在设置里选择协议并填写地址，浏览器会请求该 `scheme://host/*` 的可选权限；WebExtension host permission 无法跨浏览器限定端口，但实际请求仍固定到配置端口。公网地址强制 HTTPS。后端需先用 `ext-key generate` 和 `ext-key enable` 开启默认关闭的设备认证。

有公网域名时，最短路径是叠加 [`docker-compose.https.yml`](docker-compose.https.yml)，由 Caddy 自动申请和续期证书；PC、手机和插件共用 `https://<域名>`。命令与安全门禁见 [HTTPS 部署指南](docs/https-deployment.md)。

### 3. 在同一个浏览器登录内容平台

默认登录 [B 站](https://www.bilibili.com) 并勾选 B 站来源即可生成第一版画像和推荐；如果不想接 B 站，也可以改勾已登录的小红书 / 抖音 / YouTube / X / 知乎 / Reddit / [Linux.do](https://linux.do) / [V2EX](https://www.v2ex.com)，或选择 Bangumi 并填写公开用户名。至少保留一个能拉到画像信号的来源；未登录 Linux.do / V2EX 和未填身份的 Bangumi 仍可公开 discovery，但不能单独完成画像初始化。

### 4. 打开桌面端或移动端 Web

后端启动后会同时托管桌面端和移动端 Web，都只调用本地 API，不做 Cookie 同步或平台登录。

```bash
openbiliclaw start
```

- **桌面端**：浏览器直接访问 `http://127.0.0.1:8420/web`（或 `http://127.0.0.1:8420/`，自动跳转）。大屏两栏布局，推荐流、30 天历史、画像、聊天、消息和设置全在一页。
- **移动端**：点击插件顶部的手机图标扫二维码，或手动输入 `http://<电脑局域网 IP>:8420/m/`。适合手机上刷推荐、回看 30 天历史、看画像和与阿B聊天。
- **Flutter 原生客户端**：从 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw-mobile/releases/latest) 下载 Android APK（新机型选 `arm64-v8a`，老设备选 `armeabi-v7a`）直接安装，或下载 iOS 未签名 IPA 用个人 Apple 账号重签；装好后右上角设置里填后端 IP / 端口即可连接同一后端（Web / iOS / macOS 默认 `127.0.0.1:8420`，Android 模拟器默认 `10.0.2.2:8420`，真机填电脑局域网 IP，远程部署填服务器 IP 并建议开启密码门禁）。

> 首次运行 `openbiliclaw init` 时会询问是否允许局域网访问（默认 Y）。如果选了 N 或想改回来，编辑 `config.toml` 的 `[api].host`（`0.0.0.0` = 通过可用的 IPv4 / IPv6 局域网访问，`127.0.0.1` = 仅本机）。二维码优先使用 IPv4；仅有 IPv6 时会自动生成带方括号的 IPv6 地址。

打开 `/m/` 后可以把手机页面保存成桌面快捷入口：iPhone / iPad 用 Safari 的「分享 → 添加到主屏幕」；Android Chrome / Chromium 浏览器用菜单里的「安装应用」或「添加到主屏幕」。局域网 HTTP 在部分 Android 浏览器上可能只生成快捷方式；如果想要更稳定的完整 PWA 安装提示，建议在可信环境里用 HTTPS 反代访问本机后端。

页面底部收敛为「推荐 / 内容库 / 画像 / 对话」四个一级 Tab。内容库内再按「稍后再看 / 收藏 / 历史记录」切换：前两项管理保存列表；历史记录按「主动点开过 / 出现过但没点开 / 最近移除」分页展示近 30 天内容，同一内容的多个移除原因会一起显示，收藏和稍后再看可以分别恢复。旧的稍后、收藏和历史直达链接会自动迁移到对应内容库子项。

不用 AI 助手：直接跑一句话安装脚本

macOS / Linux / WSL2（Bash）：

```bash
curl -fsSL https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/scripts/install.sh | bash
```

Windows 原生（PowerShell，不需要 Docker / WSL2）：

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; iwr https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/scripts/install.ps1 -UseBasicParsing | iex
```

脚本依赖 `git` 和 Python 3.11+。它会自动克隆仓库，然后先在终端向导里收集首选 LLM 实例、embedding、B 站 Cookie，以及小红书 / 抖音 / YouTube 的 opt-in 决策，再安装依赖、启动后端和健康检查；确认齐全后会先验证全局 LLM 实例链和 embedding 服务都能真实响应，再自动运行 init，完成画像生成和首轮发现。X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博可在启动后的 `/setup/` 或设置页显式开启；Linux.do、Bangumi、V2EX 与微博的公开 discovery 无需登录，微博个人初始化需要已登录微博浏览器和扩展，Bangumi 个人初始化需要公开用户名。不确定的选项直接回车或选默认。

高级：Docker 部署

适合已经安装 Docker 的用户，自带 Ollama embedding sidecar。预构建镜像无需克隆源码：

```bash
mkdir -p ~/openbiliclaw && cd ~/openbiliclaw
curl -fsSLO https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/docker-compose.prebuilt.yml
docker compose -f docker-compose.prebuilt.yml up -d
# 然后打开 http://127.0.0.1:8420/setup/ 完成初始化
```

也可以把下面这句粘给 AI 编程助手，走终端向导 + 自动 init：

```text
请按照 https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/docs/docker-deployment.md 的说明帮我用 Docker Compose 部署 OpenBiliClaw 后端(务必用 Bash 的 curl 下载这个文档,不要用 WebFetch)
```

源码构建、升级与排查详见 [Docker 部署指南](docs/docker-deployment.md)。

高级：多源登录与插件链路

OpenBiliClaw 不保存你的平台密码，也不替你绕过登录。需登录的来源复用当前浏览器里的会话，匿名来源只读公开内容；两者都不会越过你能访问的边界。

### 源 · 登录方式 · 不登录的影响
- **源**: **B 站** · **登录方式**: 在装了插件的浏览器打开 https://www.bilibili.com 正常登录 · **不登录的影响**: 拉不到观看历史 / 收藏 / 关注，画像会明显变弱
- **源**: **小红书** · **登录方式**: 在同一浏览器打开 https://www.xiaohongshu.com 正常登录 · **不登录的影响**: 小红书 discovery 和详情抓取不可用
- **源**: **抖音** · **登录方式**: 在同一浏览器打开 https://www.douyin.com 正常登录 · **不登录的影响**: `init --yes-douyin`、`fetch-douyin` 和 `discover --source douyin` 的 search / hot / feed 可能返回 0 条
- **源**: **YouTube** · **登录方式**: 在同一浏览器打开 https://www.youtube.com 正常登录 · **不登录的影响**: `init --yes-youtube` 和 `fetch-youtube` 可能返回 0 条；仍可用 `import-youtube` 从 Takeout 导入
- **源**: **X（Twitter）** · **登录方式**: 在同一浏览器打开 https://x.com 正常登录 · **不登录的影响**: `init --yes-x`、`fetch-x` 和 X discovery 拉不到数据（服务端重放需要 `auth_token`+`ct0`，登录后扩展自动同步）
- **源**: **知乎** · **登录方式**: 在同一浏览器打开 https://www.zhihu.com 正常登录 · **不登录的影响**: `init --yes-zhihu`、`fetch-zhihu`、`discover --source zhihu` 和 `discover-zhihu*` 拉不到数据
- **源**: **Reddit** · **登录方式**: 在同一浏览器打开 https://www.reddit.com 正常登录；插件会同步 `reddit_session` 给日常 discovery 的 rdt-cli，`rdt login` 仅作为插件不可用时的 fallback · **不登录的影响**: `fetch-reddit --mode bootstrap` 拉不到初始化信号；rdt credential 未同步时 rdt 路径会 fallback 到插件任务
- **源**: **Linux.do** · **登录方式**: 在同一浏览器打开 https://linux.do 正常登录；公开 discovery 无需登录 · **不登录的影响**: 未登录时 `fetch-linuxdo` 和 `init --yes-linuxdo` 拉不到书签 / 点赞 / 阅读记录，但 search / hot / feed / creator / related discovery 仍可用
- **源**: **Bangumi** · **登录方式**: 无需登录；可选填公开用户名读取公开收藏，或填个人令牌读取私密收藏；插件在 bgm.tv / bangumi.tv 仅做账号身份自动识别（不读 Cookie、不采集浏览行为） · **不登录的影响**: 未填用户名时不能把 Bangumi 作为唯一画像初始化来源，但匿名 search / ranked / 按日期 discovery 仍可用
- **源**: **V2EX** · **登录方式**: 无需登录；可选填 PAT；guided init / 增量任务在扩展中读取本人主题、本人回复、收藏主题和收藏 Node 的公开渲染字段 · **不登录的影响**: 未连接扩展时仍可匿名 search / node / tab / hot / latest discovery；收藏 scope 需要实际登录态

小红书、抖音、YouTube、知乎和 Linux.do 走 Chrome 插件任务链路，Reddit 日常 discovery 默认走随后端安装的 rdt-cli、初始化信号仍走插件，X 的 discovery 走服务端 cookie 重放；这些读取链路都不需要你额外启动 CDP 调试 Chrome。Linux.do 上游请求全部在真实站点 tab 内以同源 GET 执行，`_t` 只作登录布尔，Cookie 值和原始响应不会上传。Reddit/X、YouTube、小红书、抖音与知乎原生保存 executor 已 6/6 接入并通过 fixture 测试；2026-07-14 的真实账号回归中，六平台 favorite 与 watch-later/fallback 均得到 `synced/already_synced`。Linux.do 不提供任何站内写回。`[sources.browser].cdp_url` 只保留给通用 Web / 自定义网页源的浏览器抓取场景。

高级：本地 embedding / Ollama

如果你不想给 embedding 单独配置 API Key，或担心远程 embedding 配额，可以装一次 Ollama 后使