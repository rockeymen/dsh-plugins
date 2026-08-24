# DeepSeek Harness 的万花球

DeepSeek Harness 内部的本机数据库分析 — 安装一个插件，无需单独的 KaleidoSphere 结账、服务、端点或启动步骤。

> 预览兼容性：DeepSeek Harness `dsh-v0.1.0-rc.8` / `@deepseek-ai/dsh@0.1.0-rc.8` 和 `141eb6fef83422698aef7a981029e843e8161534`。 DSH 是开发者预览版，重大更新可能需要插件版本。

请参阅[有证据支持的兼容性矩阵](COMPATIBILITY.md)，了解确切的信息
主机、Node.js、操作系统和数据库支持边界。

## 安装并尝试夹具

安装 DSH 和 pnpm，然后将不可变插件版本添加到 DSH 的附带版本中
一次性代理简介：

```sh
npm install --global @deepseek-ai/dsh@0.1.0-rc.8 pnpm@11.7.0
dsh plugin --profile headless add github:JoFe2/kaleidosphere-dsh-plugin#v0.1.0-preview.4
dsh --profile headless --dump-config
dsh --profile headless "Analyze the configured KaleidoSphere database and report its engine and snapshot digest."
```

该插件默认使用捆绑的精确 MSSQL 合成装置，因此这六个本机工具可以立即使用，无需单独安装 KaleidoSphere：

- `kaleidosphere_status`
- `kaleidosphere_discovery`
- `kaleidosphere_analyze`
- `kaleidosphere_plan`
- `kaleidosphere_preview`
- `kaleidosphere_readback`

典型的代理流程为`status` → `analyze` → `discovery`/`plan`/`preview` → `readback`。每个结果都包含在已发布的 KaleidoSphere 外部 API v2 完整性信封和 K1 证据收据中。意图集来自已发布的 K2 封闭意图合约。当使用另一个 DSH 表面时，将相同的束安装到活动的 DSH 型材中；配置文件必须包含代理运行程序，例如附带的 `headless` 或 Web 应用程序。

简短演示：

```text
User: Analyze the configured database, propose a weekly order-value view, and show the readback.
Agent: kaleidosphere_status → kaleidosphere_analyze → kaleidosphere_plan
       → kaleidosphere_preview → kaleidosphere_readback
Result: deterministic fixture snapshot 293a896156d8f6269c4ad33e8d632da653ea180d35a4ea5f390b0be52ce3e44a
```

## 配置真实源

KaleidoSphere v0.16.0 支持的主要运行时路径是 Microsoft SQL Server 和 Oracle。该插件包含两个必需的客户端路径（包括确切的 Oracle Thin 驱动程序），因此不需要单独的驱动程序批准或 KS 安装。它直接接受现有的封闭的`chimpmaera.db/analyze-profile/v1`对象；它没有发明通用的连接模式。将相关示例复制到`$DSH_HOME/profiles/headless/cordis.patch.yml`中并进行调整：

- [`examples/live-mssql.patch.yml`](examples/live-mssql.patch.yml)
- [`examples/live-oracle.patch.yml`](examples/live-oracle.patch.yml)

将数据库密码放入`adapter.passwordEnv`命名的环境变量中，然后启动DSH。密码值既不被插件配置接受，也不被工具返回。

```sh
export KS_MSSQL_PASSWORD='...'
dsh --profile headless "Analyze the configured KaleidoSphere database."
```

配置的主体必须是只读的。捆绑的 KS 查询包包含列入白名单的元数据 `SELECT` 语句；原始行、免费 SQL、凭据、源写入和持久超集突变均超出此插件的工具范围。 PostgreSQL 仍然是有限制的 v0.16.0 试点，并且不会在这里作为主要的实时插件路径进行宣传。

## 高级工具曝光

默认情况下，所有六个工具都会公开。高级配置文件可以设置任何个人
根据 `expose` 至 `false` 条目；省略的条目保持启用状态。值必须是
布尔值、未知名称在加载时失败，并且禁用所有六个失败，因为
没有工具表面的捆绑包应被禁用或删除。参见
[`examples/intent-exposure.patch.yml`](examples/intent-exposure.patch.yml)。

## 高级外部运行时

默认的 `embedded` 模式拥有捆绑的运行时并保持一键式
路径。高级配置文件可能会绑定已经运行的 KaleidoSphere
v0.16.0 使用 `runtimeMode: external` 的外部 API v2 服务；看到
[`examples/external-runtime.patch.yml`](examples/external-runtime.patch.yml)。
该插件验证 `GET /v2/capabilities` 及其确切的产品、合同、
能力，并在加载时进行证明摘要，然后仅将关闭的请求发送到
`POST /v2/intents`。外部模式不启动 KaleidoSphere 进程，也不创建
嵌入式运行时目录，并拒绝 `source` 因为源配置
仍然属于外部安装。

外部 API v2 在 v0.16.0 中没有传输身份验证，因此此预览版
仅接受带有端口且不带路径、凭据的显式环回 HTTP URL，
查询或片段。缺失、不兼容、过大、非 JSON 或非 2xx
运行时失败关闭。远程绑定需要单独审核
经过验证的运输合同。

## 更新、卸载和删除

DSH拥有捆绑组合和HMR。禁用或重新配置 `kaleidosphere-dsh-plugin` 行会卸载其注册并删除其私有嵌入式临时配置文件目录。正常关机也是如此。外部模式永远不会拥有或停止现有的 KaleidoSphere 服务。

```sh
dsh plugin --profile headless update kaleidosphere-dsh-plugin
dsh plugin --profile headless remove kaleidosphere-dsh-plugin
```

删除操作会同时删除配置文件依赖项和捆绑包层。该插件将固定/读回/发现状态保留在内存中，并且不会留下任何服务、端口、后台进程、数据库文件或插件拥有的状态目录。

## 范围和出处

该存储库附带预构建的 ESM； GitHub 安装不需要 `prepare` 脚本或构建权限。它以精确提交 `5a73ff8146afa0067d226cffa639efde959e8fde` 的方式提供 KaleidoSphere v0.16.0 的最小分析/API/K1/K2 运行时子集。请参阅 [`NOTICE`](NOTICE) 和供应的 Apache-2.0 许可证。

此预览证明了确定性固定装置和精确的 rc.8 加载/工具/卸载/删除/重新安装生命周期。它没有声称 DSH 稳定的 ABI、主机范围的 DSH 安全性、恶意第三方插件遏制、生产准备、实时客户数据库证据、通用数据库支持、Superset 突变或上游 DeepSeek 背书。

通过中描述的私有路径报告可疑漏洞
[安全政策](SECURITY.md)；切勿在中发布凭据或利用详细信息
公共问题。

## 发展

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解 DCO、protected-PR、兼容性、
出处和证据要求。

```sh
npm test
npm run verify:package
npm run test:dsh
npm run test:dsh-agent
```

确切的 DSH 烟雾将打包的 tarball 安装到新的配置文件中，检查捆绑包层和 ACTIVE 工具行，通过 `ctx.tools.execute` 执行所有六个工具，执行 HMR 卸载/重新加载，删除/重新安装包，并证明范围内的临时清理。

默认情况下，代理烟雾会打包当前候选，或者接受显式的不可变版本 TGZ，将其安装到新的 rc.8 `headless` 配置文件中，并通过真正的无头运行器、代理循环、面向模型的工具架构、工具执行器和 KS 夹具发送自然语言任务。其局部确定性模型存根故意强制 `kaleidosphere_analyze`；该测试证明了组装的代理管道，而不是真正的法学硕士在语义上选择了该工具。

另外`npm run verify:release -- <release.tgz> <release.tgz.sha256>`
之前检查不可变的本地或 GitHub 托管的发布资产及其 sidecar
针对下载的字节运行相同的主机生命周期。