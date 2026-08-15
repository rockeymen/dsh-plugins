![GoalfyData 标志](./assets/Goalfydata.svg)

  人工智能代理构建、更新、分析和重用业务数据的共享场所。

  将 spreadsheets、API、数据库和代理输出转变为可重用的数据集和数据应用程序
  保留业务环境并保持最新状态。

  ·
  ·

## 30秒了解GoalfyData

Codex、Claude Code、Manus 和其他连接的代理可以创建数据集、编写更新脚本、分析结果和构建数据应用程序。 GoalfyData 将结果数据及其字段定义、指标定义、表关系、权限和治理规则保存在一起。

其结果是一个持久的数据资产，可以在对话、代理、设备和团队之间重复使用。导入数据、运行 SQL 分析、计划更新、通过受控访问进行共享以及从同一数据集部署数据应用程序。当数据集更新时，连接的应用程序会继续读取最新数据。

## 快速入门

最快的方法是打开您平台的集成页面，复制其设置说明，然后将其提供给您的代理。在[GoalfyData设置](https://goalfydata.ai/settings);中创建您的API密钥；键使用 `gfk_` 前缀并且仅显示一次。

### 平台 · 最快设置 · 详细指南 · 状态
- **平台**：**Codex** · **最快设置**：[打开Codex集成](https://goalfydata.ai/integrations/codex)并将设置文本发送到Codex · **详细指南**：[Codex快速入门](./docs/codex-quickstart.md) · **状态**：可用
- **平台**：**Claude Code** · **最快设置**：[打开Claude Code集成](https://goalfydata.ai/integrations/claude-code)并将设置文本发送到Claude Code · **详细指南**：[Claude Code快速入门](./docs/claude-code-quickstart.md) · **状态**：可用
- **平台**：**Manus** · **最快设置**：[打开Manus集成](https://goalfydata.ai/integrations/manus)，然后添加MCP连接器并上传Manus中的技能 · **详细指南**：[Manus快速入门](./docs/manus-quickstart.md) · **状态**：可用
- **平台**：**其他代理/通用 MCP** · **最快设置**：连接远程 MCP 并加载通用技能 · **详细指南**：[通用集成指南](./generic/README.md) · **状态**：适用于兼容的 MCP/CLI 代理

> Manus 设置目前需要在其 Web 界面中执行手动步骤；无法通过将安装 Runbook 粘贴到 Manus 对话中来完成此操作。

### 最少的手动 CLI 设置

对于喜欢手动设置的 macOS 或 Linux 开发人员：

```bash
curl -fsSL https://cdn.goalfydata.ai/dataset-uds/install.sh | sh
uds-cli login --api-key gfk_your_api_key --api-url https://api.goalfydata.ai
```

然后按照上面的平台指南安装技能/插件并连接MCP。详细指南涵盖 Windows、更新、密钥轮换和故障排除。成功连接会公开 20 个 GoalfyData MCP 工具，包括 `uds_query` 和 `uds_dataset_manage`。

## AI 代理如何使用 GoalfyData 创建和重用数据资产

CSV 文件为代理提供行和列。提示为一次对话提供指示。两者都无法保留其他代理稍后继续工作所需的结构、定义、关系和业务规则。 GoalfyData 将缺失的上下文转变为可重用的数据资产。

### 1. 将 GoalfyData 与您的 AI 代理连接

在【快速入门](#quick-start)】中选择您的平台，复制MCP和技能设置说明，并将其提供给Codex、Claude Code、Manus或其他兼容代理。

这种连接使您的代理能够创建、理解、更新、管理和重用受治理的数据资产，而不仅仅是将数据发送到另一个工具。

### 2. 告诉您的代理您想要构建什么

从您需要的业务成果和数据开始。例如：

> 帮我抓取今天GitHub上推荐的AI工具和类别。

您的代理可以计算出所需的源、表、字段关系和指标，然后收集或准备数据。您还可以提供 Excel 或 CSV 文件，或连接 Google Analytics 4 (GA4) 和 Google Search Console (GSC) 等来源。

![要求代理收集业务目标所需的数据](./assets/how-to-use/step2-get-data.png)

想亲自尝试一下工作流程吗？单击下面的文件标题下载示例文件，然后将它们提供给您的代理并描述您要构建的数据资产。

- [示例电子商务数据](https://github.com/GoalfyAI/goalfydata/raw/refs/heads/main/examples/sample-data/example-ecommerce-data.zip) - 两周报告期的模拟 Amazon、Shopify、元广告、退货和 SKU 成本数据

对于其他即用型数据集，请发送电子邮件至 [goalfydata@goalfyai.com](mailto:goalfydata@goalfyai.com)。

### 3. 创建可重用的数据资产

请您的代理人在 GoalfyData 中整理结果。它保存的不仅仅是行数据：它保留了其他代理正确使用资产所需的上下文。

### 保留的上下文 · 它提供什么
- **保留的上下文**：**表** · **它提供什么**：原始数据结构
- **保留的上下文**：**关系** · **它提供什么**：表和记录如何连接
- **保留上下文**：**字段含义** · **它提供什么**：每个字段代表什么
- **保留的上下文**：**规则** · **它提供什么**：业务逻辑、指标和处理要求
- **保留上下文**：**使用指南/技能** · **它提供什么**：代理应如何查询、更新和应用资产

**您的人工智能代理不仅仅访问数据。它了解如何使用它。**

![要求代理创建可重复使用的 GoalfyData 资产](./assets/how-to-use/step3-create-dataset.png)

### 4. 创建由您的数据资产支持的应用程序

数据资产存在后，请您的代理创建专门构建的应用程序，例如分析报告、业务仪表板或自动分析工具。

例如：

> 从 GitHub AI Tools Intelligence 数据集创建仪表板。

代理使用资产的结构、字段定义、关系和分析规则来构建应用程序。应用程序保持与其数据集的连接，因此当数据更新时，指标会重新计算，报告或仪表板会继续反映最新信息，而无需重建应用程序或手动更改其配置。

![要求代理从数据资产创建应用程序](./assets/how-to-use/step4-create-dashboard.png)

![由可重用数据资产支持的应用程序示例](./assets/how-to-use/dashboard-examples.png)

您可以[在此演练中查看仪表板](https://app-08a1b21d0a98-github-ai-tools-dashboar-5f51cc722fed.goalfydata.app/)。

为了保持数据最新，请用自然语言告诉您的代理更新时间表。代理将解释托管刷新的用法，并在启用之前要求确认。

![请代理安排自动数据更新](./assets/how-to-use/step5-set-autorefresh.png)

### 5. 分析、管理并与任何代理共享

GoalfyData 资产不与创建它的代理或对话绑定。一个代理可以构建资产，任何其他连接的授权代理可以稍后继续工作。

例如，Codex 现在可以创建 GitHub AI Tools Intelligence 数据集。稍后，您可以要求另一个代理到 `Analyze this dataset from GoalfyData`，然后使用 Claude 到 `Generate market insights based on this dataset`。

无需再次上传 CSV、再次解释每个字段或重述业务规则。每个授权代理都可以从相同的保留数据上下文继续。

![与另一个AI代理使用相同的可重用数据资产](./assets/how-to-use/cross-agent-ability.png)

您还可以通过自然语言请求来管理和共享相同的数据资产，例如：

> 显示 GitHub AI Tools Intelligence 数据集的最新状态。

> 与我的团队共享此数据集并授予他们只读访问权限。

> 更新此数据集的访问权限。

您的代理可以检查资产状态、更新数据集配置、管理权限以及与团队成员共享数据资产。在整个过程中，GoalfyData 保留数据结构、字段定义、关系、规则和访问控制，以便未来的代理可以从相同的上下文安全地继续。

您还可以使用GoalfyData控制台通过可视化界面查看和管理数据集和应用程序。

![查看数据结构并共享数据集、仪表板或应用程序](./assets/how-to-use/share.png)

## AI 代理的可重用数据层

**GoalfyData 不是代理向其发送数据的仪表板。它是可重用的数据层，让代理可以继续工作。**

[探索 GoalfyData 示例 ](https://goalfydata.ai/examples) 以查看实际用例和可重用数据资产。要请求示例数据集或您自己的用例的演练，请发送电子邮件至 [goalfydata@goalfyai.com](mailto:goalfydata@goalfyai.com)。

## 核心能力

### 能力 · 它能实现什么
- **功能**：**数据导入和托管** · **什么