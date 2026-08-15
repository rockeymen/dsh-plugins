[![技能.sh](https://skills.sh/b/octoparse/agent-skills)](https://skills.sh/octoparse/agent-skills)

  ![Octoparse](assets/logo.png)

# Octoparse 代理技能

  编码代理的 Octoparse 网络抓取技能

## 概述

代理的有用性取决于其能够访问的数据。这些技能扩展了这一范围：
描述您需要什么，Octoparse 从实时网络收集它并将其作为行返回
您的代理人可以立即与您合作。

- **请求最多的网站** — Google 地图上有 670 多个维护的抓取工具，
  Amazon、LinkedIn、Indeed、Booking、TripAdvisor、Reddit、TikTok 和 YouTube，以及本地
  八种语言的目录：Gelbe Seiten、Pagesjaunes、Naver、Suumo、MercadoLibre。
- **您已经构建的抓取工具** — 在您自己的 Octoparse 帐户中配置的任务
  按名称运行和导出，与维护的并排。
- **从一个站点转移到下一个站点的工作流程** — 收集企业列表，遵循
  他们的网站，在那里收集联系方式。技能人员知道哪些交接是有效的。
- **承载工作的云** — 集合在 Octoparse 的服务器上运行，而不是在您的服务器上
  机器，对话结束后，一项很长的工作继续进行，准备导出时
  你回来了。

当您的代理可以访问所有这些数据源时，它可以建议您不会的工作流程
曾想过打造自己。

## 快速开始

```bash
npx skills add octoparse/agent-skills
```

或者，在 Claude Code 中：

```
/plugin marketplace add octoparse/agent-skills
/plugin install octoparse@octoparse-agent-skills
```

通过 `/mcp` 授权，然后询问您想要什么：

> *查找芝加哥牙医的电话号码和网站，并将其导出为 CSV。*

从那里代理计算出哪个模板适合，它的输入实际上被称为什么，
运行的行成本是多少，以及结果的最终结果。

## 技能

### 技能·它的作用
- **技能**：**[`octoparse-ultimate-scraper`](skills/octoparse-ultimate-scraper/)** · **它的作用**：选择请求调用的模板，在云中运行它，然后导出行。九个工作流程指南包含每种工作的候选名单和陷阱，从潜在客户开发到价格跟踪。
- **技能**：**[`octoparse-mcp-setup`](skills/octoparse-mcp-setup/)** · **作用**：在任何客户端连接并授权Octoparse MCP服务器。捆绑的参考内容涵盖了 Claude Code、Cursor、VS Code、Gemini CLI、Qwen Code、TRAE 和 OpenClaw 的配置路径和怪癖，以及如何处理 401 和 403。

## 示例用例

每一个都是一个完整的工作，而不是一个单一的呼叫——代理选择模板，补充道
当有人真正提供帮助时，第二次传递，并告诉你它返回了什么。

### 用例·提示示例
- **用例**：**潜在客户开发** · **示例提示**：在 Google 地图上查找芝加哥的牙医，然后抓取他们的网站以获取电子邮件和社交链接，并为我的 CRM 导出 CSV。
- **用例**：**竞争对手定价** · **示例提示**：提取这 40 个亚马逊 ASIN 的当前价格、库存和卖家，并将它们放入 spreadsheet 中。
- **使用案例**：**市场研究** · **示例提示**：向我展示亚马逊畅销商品中无线耳机的销售情况，以及前 50 名列表中的价格范围。
- **使用案例**：**声誉分析** · **示例提示**：从 TripAdvisor、Booking 和 Google 地图中提取我们酒店的最新评论，并总结最常见的投诉主题。
- **用例**：**社交聆听** · **示例提示**：收集提及我们品牌的 Reddit 和 X 帖子，以及评论线程，以便我可以分析情绪。
- **使用案例**：**本地市场深度** · **示例提示**：通过电话号码在 Gelbe Seiten 上查找慕尼黑的水管工，或拉出世田谷的 Suumo 公寓列表以及布局和车站距离。
- **用例**：**供应商审查** · **示例提示**：在 Kompass 上列出供应商候选名单，然后在联系他们之前检查每个供应商在 North Data 上的备案。

## 安装

快速入门涵盖两个常见路径 - `npx skills add` 适用于 70 多个代理中的任何一个，或者
Claude Code 中的插件。接下来的就是他们周围的一切。

### 选项和 MCP

`npx skills add`带`--skill octoparse-ultimate-scraper`只安装刮刀，
`-g` 用于在用户范围内安装，而 `--list` 用于预览而无需安装。

它仅安装技能文件。 Claude Code插件声明了MCP服务器本身，所以
`/mcp` 就剩下了；对于任何其他客户，请要求您的代理运行
`octoparse-mcp-setup` 技能一旦到位 - 它会找到正确的配置文件
为您的客户并进行授权。

### 代理插件客户端

该存储库提供了符合以下条件的根 `plugin.json` 和 `mcp.json`
[代理插件 1.0.0](https://agent-plugins.org)，供应商中立的打包标准
其指导委员会包括 Amazon、Cursor、Microsoft、OpenAI 和 Vercel。客户
实施它即可发现技能和 MCP 服务器，而无需进一步配置。

### 任何其他读取 Markdown 的代理

指向`skills/octoparse-ultimate-scraper/SKILL.md`并注册
`https://mcp.octoparse.com` 作为 MCP 服务器。

## 先决条件

1. **Octoparse 帐户** — 在 [octoparse.com](https://www.octoparse.com).
2. **授权** — `/mcp` 打开浏览器 OAuth。对于无头或 CI 使用，创建 API
   在【账户控制台】中输入](https://www.octoparse.com/console/account-center/api-keys)
   并将其作为 `x-api-key` 标头发送。

＃＃ 资源

- **[MCP 文档](https://www.octoparse.com/docs/en/mcp)** — 工具参考和
  授权。
- **[模板库](https://www.octoparse.com/template)** — 每个模板及其
  输入、输出和定价。
- **[帮助中心](https://helpcenter.octoparse.com)** — 帐户和计划问题。
- **[Issues](https://github.com/octoparse/agent-skills/issues)** 或 support@octoparse.com —
  当此处出现错误或缺少您需要的网站时。
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — 存储库布局和运行的检查
  每一次改变。

## 定价

**免费帐户每月包含 2,000 行**，通过 MCP 和 API，并且适用
也包括付费模板，而不仅仅是免费模板 - 足以评估之前的实际工作负载
致力于一项计划。

除了该限额之外，模板按输出行计费，并且许多模板仍然免费。代理
在开始之前按行调整每次运行的大小，以便您知道作业在运行之前会消耗什么
运行而不是之后。

请参阅 [octoparse.com/pricing](https://www.octoparse.com/pricing) 了解计划详细信息。

  <sub>人工智能代理阅读本文：从 [`skills/octoparse-ultimate-scraper/SKILL.md`](skills/octoparse-ultimate-scraper/SKILL.md) 开始进行路由和执行合约。</sub>