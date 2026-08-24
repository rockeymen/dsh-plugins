![mem9](site/public/mem9-wordmark-square.svg)

  AI 代理的持久内存。
  您的代理会忘记会话之间的所有内容。 mem9 通过跨会话和机器的持久内存、多代理工作流程的共享内存以及与可视化仪表板的混合调用来解决这个问题。

  对于 OpenClaw 和 ClawHub 安装，请从此处开始：[mem9.ai/openclaw-memory](https://mem9.ai/openclaw-memory)

  Hermes Agent、Claude Code、OpenCode、Codex、DeepSeek Harness 和 Dify 指南如下。

## 快速入门

1. 选择您的 mem9 终端节点。

   - 托管API：`https://api.mem9.ai`
   - 自托管：应用匹配的控制平面架构，然后启动 `mnemo-server`：

     ```bash
     cd server
     MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" go run ./cmd/mnemo-server
     ```

     请参阅 [Self-Hosting](#self-hosting) 了解特定于后端的设置详细信息，并参阅 [API Reference](#api-reference) 了解配置。

2. 选择您的集成指南。

   - [OpenClaw / ClawHub](https://mem9.ai/openclaw-memory)
   - [爱马仕特工](https://github.com/mem9-ai/mem9-hermes-plugin#readme)
   - [Claude Code](claude-plugin/README.md)
   - [OpenCode](opencode-plugin/README.md)
   - [Codex](codex-plugin/README.md)
   - [DeepSeek Harness](dsh-plugin/README.md)
   - [Dify](https://github.com/mem9-ai/mem9-dify-plugin#readme)
   - [任何 HTTP 客户端/自定义运行时](#api-reference)

3. 设置您的凭据。

   ```bash
   # Hosted API
   export MEM9_API_URL="https://api.mem9.ai"
   export MEM9_API_KEY="<mem9-api-key>"

   # Self-hosted
   export MEM9_API_URL="http://localhost:8080"
   export MEM9_API_KEY="<mem9-api-key>"
   ```

   对于自托管部署，请使用您的服务器 URL 和配置流程返回或配置的 mem9 API 密钥。

## 为什么是mem9

mem9 为编码代理提供一层共享内存层，而不是单独的本地笔记本和一次性提示文件。

### mem9 为您提供什么 · 为什么它很重要
- **mem9 为您提供了什么**：跨会话和机器的持久内存 · **为什么重要**：您的上下文在重新启动、笔记本电脑切换和长时间运行的项目中仍然存在
- **mem9 为您提供什么**：跨代理和工作流程平台共享内存 · **为什么重要**：OpenClaw、Hermes Agent、Claude Code、OpenCode、Codex、DeepSeek Harness、Dify 应用程序和自定义客户端可以回忆起相同的事实
- **mem9 为您提供了什么**：无状态集成 · **为什么重要**：运行时插件保持精简，因为存储、搜索、摄取和策略都位于服务器中
- **mem9 为您提供了什么**：混合召回和可视化仪表板 · **为什么重要**：语义搜索、关键字搜索和检查工作流程保留在一个系统中

## 支持的平台和代理运行时

### 平台·集成形态·安装/文档
- **平台**：OpenClaw · **集成形状**：用于服务器支持的共享内存的 `kind: "memory"` 插件 · **安装/文档**：[OpenClaw / ClawHub 安装指南](https://mem9.ai/openclaw-memory)
- **平台**：Hermes Agent · **集成形状**：具有设置和激活流程的内存提供程序插件 · **安装/文档**：[mem9-hermes-plugin README](https://github.com/mem9-ai/mem9-hermes-plugin#readme)
- **平台**：Claude Code · **集成形状**：带有钩子和技能的市场插件 · **安装/文档**：[`claude-plugin/README.md`](claude-plugin/README.md)
- **平台**：OpenCode · **集成形状**：从 `opencode.json` 加载的插件 SDK 集成 · **安装/文档**：[`opencode-plugin/README.md`](opencode-plugin/README.md)
- **平台**：Codex · **集成形状**：具有托管挂钩和项目覆盖的市场插件 · **安装/文档**：[`codex-plugin/README.md`](codex-plugin/README.md)
- **平台**：DeepSeek Harness · **集成形状**：原生 DSH/Cordis 捆绑包，带有召回、智能摄取和内存工具 · **安装/文档**：[`dsh-plugin/README.md`](dsh-plugin/README.md)
- **平台**：Dify · **集成形态**：Dify Agent 应用程序和 Workflow 应用程序的工具插件，具有单空间和多空间授权 · **安装/文档**：[mem9-dify-plugin README](https://github.com/mem9-ai/mem9-dify-plugin#readme)
- **平台**：任何 HTTP 客户端/自定义运行时 · **集成形式**：直接 REST API 集成 · **安装/文档**：[API 参考](#api-reference)

所有受支持的运行时和平台集成都公开相同的核心内存流：针对 mem9 服务器 API 进行存储、搜索、获取、更新和删除。

## 为什么使用托管 API

托管的 mem9 API 是将持久内存置于代理队列后面的最快方法，同时保留稍后自托管的选项。

### 托管 API 功能 · 为什么团队从这里开始
- **托管 API 功能**：具有即时空间配置的托管 mem9 API · **为什么团队从这里开始**：您可以首先安装代理集成，并在第一天跳过站立基础设施
- **托管 API 功能**：跨运行时和平台共享内存 · **为什么团队从这里开始**：一个空间可以一起为 OpenClaw、Hermes Agent、Claude Code、OpenCode、Codex、DeepSeek Harness、Dify 应用程序和自定义客户端提供服务
- **托管 API 功能**：托管搜索和存储 · **为什么团队从这里开始**：混合召回开箱即用，无需单独的向量堆栈或同步层
- **托管 API 功能**：TiDB Cloud Starter 基础 · **为什么团队从这里开始**：托管路径受益于即时配置、原生向量搜索、全文搜索、服务器端自动嵌入、混合搜索和与 MySQL 兼容的操作语义
- **托管 API 功能**：与自托管 mem9 相同的 API 合约 · **为什么团队从这里开始**：迁移到您自己的部署是基本 URL 和凭据更改，而不是插件重写
- **托管 API 功能**：可视化仪表板和产品入门 · **为什么团队从这里开始**：团队无需先构建内部工具即可检查和管理内存

在底层，托管的 mem9 API 运行与此存储库中相同的 mem9 服务器模型，TiDB Cloud Starter 提供托管配置、本机向量搜索、全文搜索、服务器端自动嵌入、混合搜索和 MySQL 兼容的存储语义。

## API 参考

当您希望服务器区分哪个运行时或代理实例正在同一 mem9 空间内写入和调用内存时，请在经过身份验证的内存、导入和会话消息请求上设置 `X-Mnemo-Agent-Id`。这适用于租户路径 `v1alpha1` 路由和 `v1alpha2` API 密钥路由。

### 配置

当您希望 mem9 自动配置新的 TiDB 支持的空间时，请使用此端点。

### 方法·路径·描述
- **方法**：`POST` · **路径**：`/v1alpha1/mem9s` · **描述**：配置配置器时 TiDB 自动配置端点。 TiDB Zero 在 `tidb` 上默认启用该路径； TiDB Cloud Pool 使用 `MNEMO_TIDB_ZERO_ENABLED=false` 与 `MNEMO_TIDBCLOUD_API_KEY` 和 `MNEMO_TIDBCLOUD_API_SECRET`。手动引导部署使用预先存在的租户而不是此路径。返回 `{ "id" }`。接受用于归因日志记录的可选 `utm_*` 查询参数

对于所有新集成，首选 `v1alpha2`。它使用 `X-API-Key`，是当前运行时的主要 API 接口。

### 首选 API (`v1alpha2`)

### 方法·路径·描述
- **方法**：`POST` · **路径**：`/v1alpha2/mem9s/memories` · **描述**：首选统一写入端点。需要 `X-API-Key` 标头
- **方法**：`GET` · **路径**：`/v1alpha2/mem9s/memories` · **描述**：首选搜索端点。需要 `X-API-Key` 标头
- **方法**：`GET` · **路径**：`/v1alpha2/mem9s/memories/{id}` · **描述**：首选按ID获取端点。需要 `X-API-Key` 标头
- **方法**：`PUT` · **路径**：`/v1alpha2/mem9s/memories/{id}` · **描述**：首选更新端点。需要 `X-API-Key` 接头
- **方法**：`DELETE` · **路径**：`/v1alpha2/mem9s/memories/{id}` · **描述**：首选删除端点。需要 `X-API-Key` 接头
- **方法**：`GET/POST` · **路径**：`/v1alpha2/mem9s/webhooks` · **描述**：空间webhook管理。需要空间 `X-API-Key`
- **方法**：`GET/PATCH/DELETE` · **路径**：`/v1alpha2/mem9s/webhooks/{webhookID}` · **描述**：获取、更新或删除 Space webhook
- **方法**：`POST` · **路径**：`/v1alpha2/mem9s/webhooks/{webhookID}/test` · **描述**：将签名的测试交付排队
- **方法**：`POST` · **路径**：`/v1alpha2/mem9s/webhooks/{webhookID}/rotate-secret` · **描述**：轮换 Webhook 签名密钥。新的秘密返回一次
- **方法**：`GET` · **路径**：`/v1alpha2/mem9s/webhook-deliveries` · **描述**：列出最近的 Space webhook 交付
- **方法**：`GET/POST` · **路径**：`/v1alpha2/space-chains/{chainID}/webhooks` · **描述**：空间链webhook管理。需要 `X-API-Key` 中的 `chain_` 管理密钥
- **方法**：`GET` · **路径**：`/v1alpha2/space-chains/{chainID}/webhook-deliveries` · **描述**：列出最近的Space Chain webhook交付

Webhook 事件和传递行为记录在