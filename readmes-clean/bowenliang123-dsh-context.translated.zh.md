![社交预览](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/social-preview.png)

#dsh-context

**查看 DeepSeek Harness 代理的上下文窗口实际上由什么组成以及它如何演变。**

`dsh-context` 是一个 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 插件，它在 Web UI 中添加了 **Context Insight** 面板：对 *“模型现在携带什么，以及它是如何到达那里的？”* 提供实时、直观的答案 - 上下文组合、每个请求历史记录、压缩和注入，全部集中在一个地方。

![上下文面板概述](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-overview.png)

## 安装

来自任何 DeepSeek Harness 安装的一个命令：

```sh
dsh plugin --profile web add dsh-context
```

然后使用 `dsh web` 启动 Web UI，打开任何会话，然后单击 **上下文 / Context** 选项卡。无需构建步骤，无需重新启动。

## 你会看到什么

### 📊 上下文统计 — 会话一目了然

轮数、步数、通过压缩和剪枝回收了多少上下文、发生了多少次注入、模型切换以及发送的估计总代币 — 位于提供商报告的实际值旁边，以便您可以看到估计值如何成立。

### 🧱 当前构图 — 现在窗口中的内容

六色堆叠条根据模型的完整上下文窗口进行缩放（灰色轨道是您剩余的空间）：系统提示、工具模式、您的消息、注入的上下文、助理回复和工具结果 - 加上前 5 个最昂贵的工具模式。当对话开始恶化时，您可以在此处找到*哪个部分消耗了预算*。

### 📈 历史 — 观察窗口的增长（并被压缩）

每个模型请求一个堆叠条，比每个消息更精细。在 **Turn** 和 **Step** 粒度之间切换，在会话中横向滚动，将鼠标悬停在任何栏上以获取快速工具提示，然后单击以固定完整细分 - 包括提供者报告的实际提示/输出标记旁边的估计。 **✂ 标记发生压实或修剪的地方** — 观察条形下降：

![带有固定请求的历史图表](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/history-detail.png)

上图：一个真实的会话，在 48 个回合中增长到约 563k 代币，然后压缩 (✂) 一步回收了 -535.5k，对话从一个新的小窗口继续。

在**步骤**粒度中，将鼠标悬停在任何栏上都会立即显示单个步骤的上下文信息 - 它的回合/步骤、时间戳以及估计与提供商报告的令牌计数：

![带有步骤悬停工具提示的历史图表](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/history-step-hover.png)

### ⚡ 上下文事件 — 窗口更改的时间和原因

每个压缩、工具输出修剪、技能或插件上下文注入以及模型切换 - 每个都有其令牌增量、回合/步骤属性和时间戳：

![上下文事件和消息](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-events.png)

### 💬 消息 — 当前模型可见的表面

模型现在看到的确切消息列表，最新的在前，以及每条消息的令牌成本。

## 释放

通过标记 `git tag vX.Y.Z && gh release create vX.Y.Z` 来削减版本。 [GitHub Actions 工作流程](.github/workflows/release.yml)] 然后通过 [npm Trusted Publishing (OIDC)](https://docs.npmjs.com/trusted-publishers) 自动构建、测试并发布包到 npm — 不需要长期令牌，包括出处。

## 喜欢吗？

如果 `dsh-context` 帮助您了解您的代理随身携带的物品，非常感谢 [GitHub](https://github.com/bowenliang123/dsh-context) - 并欢迎提出问题/PR！