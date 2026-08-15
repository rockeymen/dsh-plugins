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

- `openbiliclaw-extension-v*-firefox.xpi`：Mozilla AMO unlisted 签名后的正式安装包；仅在发布环境启用 AMO signing 且凭据可用时生成，普通 Firefo