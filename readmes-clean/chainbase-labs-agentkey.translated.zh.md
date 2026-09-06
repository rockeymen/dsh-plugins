![](https://github.com/user-attachments/assets/4c7c78a9-e5d8-45ce-9372-d5bffe8f61c5)

  一声令下。您的 AI 代理可以完全访问互联网。

  浏览 Twitter、搜索 LinkedIn、抓取社交媒体、阅读任何网页。零配置。只需安装即可使用。

**安装AgentKey。赋予您的人工智能超能力。**

AgentKey是代理生态系统的主密钥。使用Claude、Manus或其他代理时，经常需要外部数据：社交媒体、电子商务、链上数据、各种API。这意味着寻找 API 密钥、管理订阅或陷入死胡同。

安装 AgentKey 后，您的代理将自动获得所有这些数据功能。无需针对每个提供商进行注册，无需处理单独的 API 账单。订阅一次即可使用。

> ⭐ 为该存储库加注星标，以便在我们添加新平台支持或发布更新时收到通知。

## 用例

### 您要求您的代理人... · 不使用 AgentKey · 使用 AgentKey
- **你要求你的经纪人...**： 🐦 马斯克最近在 Twitter 上说了些什么？ · **没有 AgentKey**：无法访问，推文被屏蔽 · **使用 AgentKey**：拉取所有相关推文并进行总结
- **您要求您的代理人...**： 📕 人们在 Instagram 上对这款产品有何看法？ · **没有 AgentKey**：被阻止，需要登录 · **使用 AgentKey**：抓取真实帖子，按情绪组织
- **你要求你的经纪人...**： 📺 这个 YouTube / Bilibili 视频涵盖什么内容？ · **不带 AgentKey**：无法阅读，无字幕 · **使用 AgentKey**：阅读视频/文字记录，提取关键点
- **您要求您的代理...**：📖 查找有关此痛点的 Reddit 主题 · **没有 AgentKey**：403 被阻止 · **使用 AgentKey**：查找相关主题并提取解决方案
- **您要求您的代理人...**：👔 检查该竞争对手/候选人的 LinkedIn · **没有 AgentKey**：403，访问问题 · **使用 AgentKey**：打开页面，总结关键信息
- **你要求你的经纪人...**： 🎵 现在抖音/TikTok 上的趋势是什么？ · **不带 AgentKey**：无法抓取热门榜 · **带 AgentKey**：拉取热门话题和标签
- **您要求您的代理人...**： 🌐 此网页说什么？ · **不带 AgentKey**：返回原始 HTML 墙 · **使用 AgentKey**：提取内容，解释清楚
- **您要求您的代理...**： 📦 这个 GitHub 存储库有什么作用？ · **没有 AgentKey**：必须自己点击 · **使用 AgentKey**：阅读 README 和问题，一行摘要
- **你要求你的代理人...**： 🧾 这个钱包/基金最近买了什么？ · **不使用 AgentKey**：点击区块浏览器 · **使用 AgentKey**：汇总最近的交易和头寸

在AgentKey之前：10个任务→10个API密钥→10个单独的账单。

您的代理最多只能发挥一半的能力，不断需要人工帮助来查找数据、处理凭证、淹没在复杂性中。

现在：一台 AgentKey 搞定一切。 **AgentKey 统一了人工智能执行实际工作所需的所有外部访问。**

## 新来的？从网络开始

在触摸终端之前，您可以直接在浏览器中感受一下 AgentKey - 网站和控制台比本自述文件更直观地解释了事情。

- 🌐 **[agentkey.app](https://agentkey.app)** — 产品概述、支持的平台、现场演示、定价详细信息
- 🎛️ **[console.agentkey.app](https://console.agentkey.app)** — 注册、管理您的订阅、管理您的 API 密钥、跟踪使用情况

下面的一行安装是将 AgentKey 插入您的 AI 代理。如果您只想先环顾四周，上面的两个链接是更友好的起点。

## 安装

一声令下。将打开一个浏览器选项卡以供登录，然后就完成了。安装程序会自动检测计算机上的每个代理（[支持 40+ ](https://github.com/vercel-labs/skills#available-agents)。常见示例包括 Claude Code、Codex、Gemini CLI 和 Cursor CLI 等）并配置每个代理。

**macOS / Linux**
```bash
curl -fsSL https://agentkey.app/install.sh | bash
```

**Windows**（PowerShell）
```powershell
irm https://agentkey.app/install.ps1 | iex
```

重新启动您的代理，然后向其询问需要互联网的内容。正在运行的 DeepSeek Harness 配置文件通过 HMR 监视主补丁；停止的配置文件会在下次启动时加载它。

> *“马斯克最近在推特上发布了什么？”*

就是这样。无需复制 API 密钥，无需编辑 JSON。

<sub>需要针对特定​​代理或在 CI 中运行？ → 请参阅 [FAQ](#faq)] 中的“高级安装选项”项。</sub>

### DeepSeek Harness (DSH)

上述单行安装程序会自动检测 `${DSH_HOME:-~/.dsh}` 或 `dsh` 命令。他们在 `~/.agents/skills/agentkey` 全局安装 AgentKey 技能，通过 AgentKey 进行身份验证，并向 DSH 的家庭级补丁添加一个托管 Loader 块：

```text
${DSH_HOME:-~/.dsh}/cordis.patch.yml
```

这是 **CLI 管理的 DSH MCP 集成**，而不是本机可安装的 DSH 插件。 home层使用Loader id `agentkey`，模块`@deepseek-ai/dsh-mcp-client`，MCP `serverName: agentkey`；它由当前和未来的配置文件组成。工具允许/拒绝策略仍然控制预设、会话或子代理是否可以查看工具。

DSH 0.1.0-rc.7 不向其 MCP SDK 客户端提供 OAuth `authProvider`。无标头服务器条目无法完成 401/RFC 9728 发现或打开浏览器。 DSH 必须使用下面的 device-code 命令，以便 CLI 写入本地承载密钥。

对于仅 DSH 的手动安装，只需运行以下两个步骤：

```bash
npx -y skills add chainbase-labs/agentkey -g -a universal -s agentkey -y
npx -y @agentkey/cli --auth-login --only dsh
```

CLI仅将真实的API密钥存储在单个本地主补丁中；没有密钥属于 Git。重新运行该命令会轮换密钥并替换托管块。不需要现有的配置文件。在迁移过程中，它仅从每个配置文件补丁中删除顶级、第 1 列 AgentKey 托管块，并将旧版 `.agent-presets/agentkey` 目录重命名为带时间戳的备份； CLI 打印该备份路径。如果它在结构上检测到较旧的未标记的 AgentKey 加载程序行，它将停止而不更改任何补丁，并要求您手动删除该顶级 `insert` 子项。符号链接配置文件补丁以只读方式进行检查：允许使用干净的符号链接配置文件，而旧版 AgentKey 形式会停止安装并报告手动删除的路径。

只有当前正在运行的配置文件进程才能通过 HMR 立即观察主文件更改。已停止，未来的配置文件启动时会加载它。如果旧预设已在会话中处于活动状态，请关闭该会话或在迁移后重新启动 DSH。

####如何确认DSH安装

1. 打开 **DSH → 设置 → 插件 → 插件列表**，搜索配置的 id `agentkey`，展开 `mcp-client` 行。 DSH 0.1 当前渲染：
   - 加载器路径：`include:agentkey`（稳定配置的条目id为`agentkey`）
   - 模块标题：`@deepseek-ai/dsh-mcp-client`（卡将其缩短为`mcp-client`）
   - Cordis状态：`Mounted`（底层光纤相位为`active`）

   `Mounted`/`active` 仅证明 Cordis 加载了该行。因为 `failOnStartupError: false`，它**不**证明 MCP 已通过身份验证或连接。

2. 在预期预设/会话中，确认三个核心工具可见：
   - `mcp__agentkey__find_tools`
   - `mcp__agentkey__describe_tool`
   - `mcp__agentkey__execute_tool`

   `list_tools` 已弃用，并且不是就绪要求。如果核心工具仅隐藏在一个上下文中，请检查该预设/会话/子代理的工具策略。

3. 询问：**“请使用AgentKey搜索今天最新的AI新闻。”** 成功需要实际的`find_tools` → `describe_tool` → `execute_tool` 调用，而不仅仅是挂载卡。

故障排除：

- **没有 `agentkey` 行：** 未编写主补丁或 `DSH_HOME` 指向其他地方。重新运行仅 DSH CLI 命令并检查其报告的路径。
- **行存在，但未安装/活动：** 检查加载程序错误并验证 `@deepseek-ai/dsh-mcp-client` 是否存在于 DSH 安装中。
- **已安装，但缺少工具：** 检查 MCP 连接日志、本地授权密钥和活动工具策略。在 `tools/list` 中，每个工具的根 `inputSchema.additionalProperties` 必须不存在或 `true`，而不能是 `false`。
- **401:**本地密钥丢失或无效；重新运行 auth-login 以轮换它。
- **`serverName already in use`：** 重新运行当前 CLI，以便存档旧预设，然后关闭仍保留旧预设的会话或重新启动 DSH 一次。

## 您的代理现在可以做什么

AgentKey 在开放网络上维护云端集成 - 没有额外的帐户，没有额外的密钥。

### 能力 · 涵盖什么
- **功能**：**网络搜索** · **涵盖内容**：开放网络上的搜索引擎、新闻和实时发现
- **功能**：**网络抓取** · **涵盖内容**：从任何 URL 中清晰地提取文章、结构化数据和元数据
- **功能**：**链上/加密货币** · **涵盖内容**：代币价格、市场数据、链上活动和项目元数据
- **能力**：**S