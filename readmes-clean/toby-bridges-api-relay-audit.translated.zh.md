![](./assets/readme-banner.png)

# API 中继审核

  AI API 中继和 LLM 代理的本地安全审核。

## 什么是 API 中继审核？

API Relay Audit 是一款针对 AI API 中继和 LLM 代理的本地安全审核工具。它将 API 中继审核、提示注入审核、模型替换信号和 Web3 中继审核保留为单独的查询系列，因此每个结果都保持干净的证据边界。您的 API 密钥仅发送到您选择的中继 URL。

当您依赖第三方 AI API 中继、OpenAI 兼容代理、Claude 兼容代理或 Web3 代理工作流程，并希望在信任该中继提供生产或钱包相关流量之前获得可重复的 Markdown 报告时，请使用它。

## AI API中继安全审计

- **检测中继篡改：**提示注入、提示提取、身份一致性信号、上下文截断、工具调用重写、错误响应泄漏和 SSE 流异常。
- **本地运行：**独立的 `audit.py` 仅使用 Python stdlib 和 `curl`；您的 API 密钥仅发送到您选择的中继 URL。
- **产生可审查的证据：** 每次运行都会生成一份结构化 Markdown 报告，其中包含每个步骤的结果和最终的 `LOW / MEDIUM / HIGH` 判决。

## 快速入门

```bash
AUDIT_SCRIPT_REF=v2.4.0
curl -fsSL "https://raw.githubusercontent.com/toby-bridges/api-relay-audit/${AUDIT_SCRIPT_REF}/audit.py" -o audit.py

python audit.py --key <YOUR_KEY> --url  --output report.md

# Web3 / wallet users
python audit.py --key <YOUR_KEY> --url  --profile web3 --output report.md
```

请参阅公共安全装置报告：[经过净化的审计报告](./docs/examples/sanitized-audit-report.md)。
仅当有意测试未发布的更改时才将 `master` 用作 `AUDIT_SCRIPT_REF`。

> 如果 API 中继审核可以帮助您在发送实际流量之前评估中继，请[为存储库加注星标 ](https://github.com/toby-bridges/api-relay-audit) 以跟踪新的检测器覆盖范围和经过发布测试的更新。

## 何时使用它

- 您使用第三方 AI API 中继、镜像、网关或 LLM 代理。
- 您想要检查 Claude 兼容或 OpenAI 兼容代理是否注入提示、交换模型、截断上下文或重写工具输出。
- 您正在生产流量、编码代理自动化、包安装建议或钱包相关操作之前测试中继行为。
- 您需要本地、可重复的审核报告，而不是要求您提供 API 密钥的 Web 工具。

## 它没有声明什么

- 它并不证明继电器是安全的。
- 它不能取代手动安全审查或操作监控。
- 不将 `inconclusive` 视为 `clean`；被阻止的探测和模棱两可的响应在报告中仍然可见。

## 查询家族边界

### 查询族·用户意图·配置文件/步骤·证据边界
- **查询系列**：API 中继审核 · **用户意图**：在信任流量之前审核第三方中继、镜像、网关、LLM 代理或转售 API。 · **配置文件/步骤**：默认为`general`；每个探头为 `full` · **证据边界**：生成本地报告，而不是安全证书。
- **查询族**：提示注入审计 · **用户意图**：检测隐藏的提示注入、提示泄漏、指令覆盖和提取行为。 · **简介/步骤**：`general`；步骤3-6 · **证据边界**：记录即时证据，不公开私人提示或秘密。
- **查询族**：模型替换信号 · **用户意图**：收集模型身份、流、延迟和上行通道信号。 · **简介/步骤**：`general`；步骤 5、10、13、14 · **证据边界**：自 ID、延迟和通道指纹是信号，而不是提供商替代的独立证明。
- **查询系列**：Web3 中继审核 · **用户意图**：在代理工作流程接触签名或交易之前检查钱包敏感的中继行为。 · **简介/步骤**：`web3` 或 `full`；步骤 11 · **证据边界**：配置文件门控；一般中继审核并不意味着钱包安全。

规范合约位于 [docs/query-families.md](./docs/query-families.md)。自述文件标题、页面卡、问题模板和技能描述应该保留这些界限，而不是将它们扁平化为一个口号。

## 覆盖范围

API 中继审核检查中继是否修改了您与模型之间的请求或响应路径：

- 提示安全：令牌注入、提示提取、指令覆盖、防越狱
- 中继完整性：上下文截断、工具调用替换、错误泄漏、流完整性
- 模型身份：非 Claude 身份泄露、模型替换信号、Claude/OpenAI 兼容中继行为
- Web3钱包安全：转账引导、签名交易拒绝、私钥拒绝

## 本地审核 LLM 代理

该项目有两种分配模式：

- `audit.py`：用于快速本地审核的零依赖独立脚本
- `api_relay_audit/` + `scripts/`：带测试的模块化开发版本

运行时配置文件：

- `general`：默认AI API中继和LLM代理检查
- `web3`：Web3 代理流程的钱包安全探针
- `full`：常规加Web3检查

## DeepSeek Harness DSH 插件

该存储库也是一个可安装的 `dsh-api-relay-audit` 捆绑包
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 网页和
使用官方 `@deepseek-ai/dsh-commands` 的社区 TUI 界面
注册表。固定不可变的提交或发布标签：

```bash
DSH_PLUGIN_REF=v2.4.0
dsh plugin --profile web add "github:toby-bridges/api-relay-audit#${DSH_PLUGIN_REF}"

# dsh-cc-tui and other compatible profile-based clients
dsh plugin --profile cc-tui add "github:toby-bridges/api-relay-audit#${DSH_PLUGIN_REF}"
```

该命令重用当前 DSH 提供商的 `baseURL`、模型和凭证
参考。凭证保存在DSH Credentials中，并传送至
通过环境变量进行本地审计过程，而不是通过命令
参数或会话日志：

```text
/relay-audit
/relay-audit --connectivity
/relay-audit --profile web3 --fast-context
/relay-audit --url <URL> --model <claude-model> --credential-ref <DSH_CREDENTIAL_REF>
```

没有参数会保留现有的完整审核默认值并可能会消耗
计量令牌。使用 `--connectivity` 进行成本较低的检查。这个分布
不添加新的模型基线：所选路线必须标识为 Claude，
尽管中继 API 本身可能与 Anthropic 兼容或与 OpenAI 兼容。
没有 DSH 配置文件和 DSH 命令注册表的独立包装器不是
与此捆绑包兼容。参见【代理分发说明](./docs/skill-distribution.md)。
确切的 v2.4.0 安装、运行时和秘密扫描结果记录在
【DSH分布验证](./docs/distribution-verification-v2.4.0.md)。

## 保留特工技能文件

该存储库保留了现有的 OpenClaw 和 Hermes 技能文件，以便直接使用
用户和下游兼容性。它们不是当前的注册表发行版
目标；主动分发和发布验证重点关注DeepSeek
线束插件。

- **OpenClaw 技能：** 在 OpenClaw 代理之前运行本地 AI API 中继审核
  取决于第三方中继、代理 API 或转售密钥。
- **Hermes 技能：** 安装 API Relay Audit 作为 Hermes 代理技能并运行
  来自代理工作流程的相同本地 14 步 LLM 代理安全审核。

这些文件并不证明中继是安全的。他们帮助代理商产生
在信任中继路径之前本地的、可审查的 Markdown 报告。

## 证据边界

自然语言自我识别被视为一致性信号，而不是上游证明。如果响应说是 Qwen、DeepSeek、GPT 或 Claude，则可能表示不匹配，但它本身并不能证明提供商替换了上游模型。

更强有力的声明需要确凿的证据，例如原始响应 JSON、请求 ID、提供者/模型元数据、流签名、透明日志哈希和可重现的运行。公开提交内容应使用经过编辑的报告工件，并且绝不包含 API 密钥、原始标头、完整响应正文、钱包材料、私有中继流量或用户数据。

## Web3 钱包安全检查

通过 `--profile web3` 或 `--profile full`，API Relay Audit 添加了受签名隔离风险启发的面向钱包的提示注入探针：

- ETH 转账指导检查
- 签名交易拒绝检查
- 私钥泄漏拒绝检查

这些探测器与模型无关，但它们是有意进行配置文件门控的，因此一般中继审计可以保持重点。

## 工作模型

```text
your machine
  -> audit.py / scripts/audit.py
  -> chosen relay endpoint
  -> Markdown report + optional hash-only transparent log
  -> optional: redacted evidence issue for maintainer review
```

社区证据由 GitHub Actions 进行形状检查，但发布仍需要维护者审查。运营商保留单独的响应路径，敏感漏洞属于[SECURITY.md](./SECURITY.md)中描述的披露路径。

## 项目状态

### 指标 · 当前值
- **公制**：版本·**