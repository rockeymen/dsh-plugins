![](./assets/readme-banner.png)

# API Relay Audit

  Local security audit for AI API relays and LLM proxies.

## What Is API Relay Audit?

API Relay Audit is a local security audit tool for AI API relays and LLM proxies. It keeps API relay audit, prompt injection audit, model substitution signals, and Web3 relay audit as separate query families so each result keeps a clean evidence boundary. Your API key is sent only to the relay URL you choose.

Use it when you rely on a third-party AI API relay, OpenAI-compatible proxy, Claude-compatible proxy, or Web3 agent workflow and want a repeatable Markdown report before trusting that relay with production or wallet-related traffic.

## AI API Relay Security Audit

- **Detect relay tampering:** prompt injection, prompt extraction, identity consistency signals, context truncation, tool-call rewriting, error-response leakage, and SSE stream anomalies.
- **Run locally:** the standalone `audit.py` uses only Python stdlib plus `curl`; your API key is sent only to the relay URL you choose.
- **Produce reviewable evidence:** each run generates a structured Markdown report with per-step findings and a final `LOW / MEDIUM / HIGH` verdict.

## Quick Start

```bash
AUDIT_SCRIPT_REF=v2.4.0
curl -fsSL "https://raw.githubusercontent.com/toby-bridges/api-relay-audit/${AUDIT_SCRIPT_REF}/audit.py" -o audit.py

python audit.py --key <YOUR_KEY> --url  --output report.md

# Web3 / wallet users
python audit.py --key <YOUR_KEY> --url  --profile web3 --output report.md
```

See a public-safe fixture report: [sanitized audit report](./docs/examples/sanitized-audit-report.md).
Use `master` as `AUDIT_SCRIPT_REF` only when intentionally testing unreleased changes.

> If API Relay Audit helps you evaluate a relay before sending real traffic, [star the repository](https://github.com/toby-bridges/api-relay-audit) to follow new detector coverage and release-tested updates.

## When to Use It

- You use a third-party AI API relay, mirror, gateway, or LLM proxy.
- You want to check whether a Claude-compatible or OpenAI-compatible proxy injects prompts, swaps models, truncates context, or rewrites tool output.
- You are testing relay behavior before production traffic, coding-agent automation, package-install suggestions, or wallet-related actions.
- You need a local, repeatable audit report instead of a web tool that asks for your API key.

## What It Does Not Claim

- It does not certify that a relay is safe.
- It does not replace manual security review or operational monitoring.
- It does not treat `inconclusive` as `clean`; blocked probes and ambiguous responses stay visible in the report.

## Query Family Boundaries

### Query family · User intent · Profile / steps · Evidence boundary
- **Query family**: API relay audit · **User intent**: Audit a third-party relay, mirror, gateway, LLM proxy, or resale API before trusting traffic. · **Profile / steps**: `general` by default; `full` for every probe · **Evidence boundary**: Produces a local report, not a safety certificate.
- **Query family**: Prompt injection audit · **User intent**: Detect hidden prompt injection, prompt leakage, instruction override, and extraction behavior. · **Profile / steps**: `general`; Steps 3-6 · **Evidence boundary**: Records prompt evidence without publishing private prompts or secrets.
- **Query family**: Model substitution signals · **User intent**: Collect model identity, stream, latency, and upstream channel signals. · **Profile / steps**: `general`; Steps 5, 10, 13, 14 · **Evidence boundary**: Self-ID, latency, and channel fingerprints are signals, not standalone proof of provider substitution.
- **Query family**: Web3 relay audit · **User intent**: Check wallet-sensitive relay behavior before agent workflows touch signing or transactions. · **Profile / steps**: `web3` or `full`; Step 11 · **Evidence boundary**: Profile-gated; general relay audits do not imply wallet safety.

The canonical contract lives in [docs/query-families.md](./docs/query-families.md). README headings, Pages cards, issue templates, and skill descriptions should preserve these boundaries instead of flattening them into one slogan.

## Coverage

API Relay Audit checks whether a relay modifies the request or response path between you and the model:

- Prompt safety: token injection, prompt extraction, instruction override, jailbreak resistance
- Relay integrity: context truncation, tool-call substitution, error leakage, stream integrity
- Model identity: non-Claude identity leaks, model substitution signals, Claude/OpenAI-compatible relay behavior
- Web3 wallet safety: transfer guidance, signed-transaction refusal, private-key refusal

## Audit LLM Proxies Locally

The project has two distribution modes:

- `audit.py`: zero-dependency standalone script for quick local audits
- `api_relay_audit/` plus `scripts/`: modular development version with tests

Runtime profiles:

- `general`: default AI API relay and LLM proxy checks
- `web3`: wallet-safety probes for Web3 agent flows
- `full`: general plus Web3 checks

## DeepSeek Harness DSH Plugin

The repository is also an installable `dsh-api-relay-audit` bundle for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web and
community TUI surfaces that use the official `@deepseek-ai/dsh-commands`
registry. Pin an immutable commit or release tag:

```bash
DSH_PLUGIN_REF=v2.4.0
dsh plugin --profile web add "github:toby-bridges/api-relay-audit#${DSH_PLUGIN_REF}"

# dsh-cc-tui and other compatible profile-based clients
dsh plugin --profile cc-tui add "github:toby-bridges/api-relay-audit#${DSH_PLUGIN_REF}"
```

The command reuses the current DSH provider's `baseURL`, model, and credential
reference. The credential stays in DSH Credentials and is delivered to the
local audit process through an environment variable, never through command
arguments or the session log:

```text
/relay-audit
/relay-audit --connectivity
/relay-audit --profile web3 --fast-context
/relay-audit --url <URL> --model <claude-model> --credential-ref <DSH_CREDENTIAL_REF>
```

No arguments preserves the existing full-audit default and may consume
metered tokens. Use `--connectivity` for a lower-cost check. This distribution
does not add a new model baseline: the selected route must identify as Claude,
although the relay API itself may be Anthropic-compatible or OpenAI-compatible.
Independent wrappers without DSH profiles and the DSH command registry are not
compatible with this bundle. See [agent distribution notes](./docs/skill-distribution.md).
The exact v2.4.0 installation, runtime, and secret-scan results are recorded in
[the DSH distribution verification](./docs/distribution-verification-v2.4.0.md).

## Retained Agent Skill Files

The repository retains its existing OpenClaw and Hermes skill files for direct
users and downstream compatibility. They are not current registry distribution
targets; active distribution and release verification focus on the DeepSeek
Harness plugin.

- **OpenClaw Skill:** run a local AI API relay audit before an OpenClaw agent
  depends on a third-party relay, proxy API, or resale key.
- **Hermes Skill:** install API Relay Audit as a Hermes Agent skill and run the
  same local 14-step LLM proxy security audit from an agent workflow.

These files do not certify that a relay is safe. They help agents generate a
local, reviewable Markdown report before trusting a relay path.

## Evidence Boundaries

Natural-language self-identification is treated as a consistency signal, not upstream proof. A response saying it is Qwen, DeepSeek, GPT, or Claude can indicate a mismatch, but it does not by itself prove that a provider substituted the upstream model.

Stronger claims require corroborating evidence such as raw response JSON, request IDs, provider/model metadata, stream signatures, transparent-log hashes, and reproducible runs. Public submissions should use redacted report artifacts and never include API keys, raw headers, full response bodies, wallet material, private relay traffic, or user data.

## Web3 Wallet Safety Checks

With `--profile web3` or `--profile full`, API Relay Audit adds wallet-oriented prompt injection probes inspired by signature-isolation risks:

- ETH transfer guidance checks
- Signed-transaction refusal checks
- Private-key leak refusal checks

These probes are model-agnostic, but they are intentionally profile-gated so general relay audits stay focused.

## Working Model

```text
your machine
  -> audit.py / scripts/audit.py
  -> chosen relay endpoint
  -> Markdown report + optional hash-only transparent log
  -> optional: redacted evidence issue for maintainer review
```

Community evidence is shape-checked by GitHub Actions, but publication still requires maintainer review. Operators keep a separate response path, and sensitive vulnerabilities belong in the disclosure path described in [SECURITY.md](./SECURITY.md).

## Project Status

### Metric · Current value
- **Metric**: Version · **Current value**: `v2.4`
- **Metric**: Audit steps · **Current value**: 14
- **Metric**: Risk matrix · **Current value**: 6D
- **Metric**: pytest collected tests · **Current value**: 808
- **Metric**: CLI flags · **Current value**: 22
- **Metric**: Runtime profiles · **Current value**: `general`, `web3`, `full`

## Example Report And Live Page

- GitHub Pages: [toby-bridges.github.io/api-relay-audit](https://toby-bridges.github.io/api-relay-audit/)
- Chinese landing page: [toby-bridges.github.io/api-relay-audit/zh/](https://toby-bridges.github.io/api-relay-audit/zh/)
- Example report: [sanitized fixture report](./docs/examples/sanitized-audit-report.md)
- Guides:
  [AI API relay / LLM proxy](https://toby-bridges.github.io/api-relay-audit/guides/what-is-ai-api-relay-proxy.html),
  [Claude relay audit](https://toby-bridges.github.io/api-relay-audit/guides/audit-claude-api-relay-safely.html),
  [tool comparison](https://toby-bridges.github.io/api-relay-audit/guides/compare-api-relay-audit-hvoy-cctest.html),
  [prompt injection in proxies](https://toby-bridges.github.io/api-relay-audit/guides/detect-prompt-injection-llm-api-proxies.html),
  [Web3 wallet prompt injection](https://toby-bridges.github.io/api-relay-audit/guides/web3-wallet-prompt-injection-ai-agents.html),
  [DeepSeek Harness plugin](https://toby-bridges.github.io/api-relay-audit/guides/deepseek-harness-plugin-api-relay-audit.html)
- Contributors / Credits: [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Security policy: [SECURITY.md](./SECURITY.md)
- Contributing guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Social: [X @li9292](https://x.com/li9292)

## FAQ

### What is an API relay or LLM proxy?

An API relay or LLM proxy is a third-party service between you and an AI provider such as Anthropic or OpenAI. It forwards your requests upstream, but it can also inject hidden instructions, swap models, truncate context, rewrite tool output, or leak credentials in error responses.

### Is it safe to enter my API key?

API Relay Audit runs locally, so your API key is sent only to the relay URL you specify. The standalone version is a single Python file with zero Python package dependencies, which makes it easier to inspect before running.

### What does prompt injection mean here?

Prompt injection means the relay may prepend or insert hidden instructions into your request. API Relay Audit compares expected and actual token usage, tries prompt-extraction probes, and records evidence when the relay appears to add or reveal hidden prompt content.

### What is model substitution?

Model substitution means the relay claims to provide one model but may expose evidence signals for another model identity, route, or upstream channel. API Relay Audit checks non-Claude identity patterns, anchor phrases, stream model identity, latency variance, and channel evidence where available; those signals require corroboration before making provider-level claims.

### What is tool-call rewriting?

Tool-call rewriting means the relay modifies package-install commands or tool-like output in the model response. API Relay Audit sends pinned package commands and compares the returned text to detect proxy-layer supply-chain tampering.

### What are SSE anomalies?

SSE anomalies are stream-level integrity issues in Anthropic-style streaming responses. API Relay Audit checks event types, usage monotonicity, thinking signatures, and stream model identity when the relay supports that format.

### What Web3 wallet risks does it check?

With the `web3` or `full` profile, API Relay Audit checks transfer guidance, signed-transaction refusal, and private-key refusal behavior before wallet-related traffic is trusted.

### What does `inconclusive` mean?

`Inconclusive` means the tool could not determine a clean or anomalous result for that step. A blocked probe, unsupported format, or ambiguous response is not treated as safe; it remains visible in the final report.

### How does this compare with hvoy.ai or cctest.ai?

They serve different needs. hvoy.ai is useful for relay reputation lookup, cctest.ai focuses on one-click testing and channel fingerprinting, and API Relay Audit focuses on local, open-source, repeatable security auditing with structured Markdown reports.

## Citation

If you use API Relay Audit in research, security reports, or public relay evaluations, please cite the software with [CITATION.cff](./CITATION.cff). The citation file also records the two academic papers that inform the audit model: Liu et al., *Your Agent Is Mine* (arXiv:2604.08407) and Zhang et al., *Real Money, Fake Models* (arXiv:2603.01919).

## How to Contribute

You do not need to write code to help. Good first contributions are small,
reproducible, and evidence-focused:

- Report a detector gap with a sanitized reproduction.
- Share local run feedback for install, runtime, platform, or report-UX issues.
- Add documentation examples for profiles, flags, or relay behavior.
- Improve DSH, OpenClaw, or Hermes install notes from a real local setup.
- Translate Quick Start or clarify `clean`, `anomaly`, and `inconclusive`.

Start with:

- [Local Run Feedback](https://github.com/toby-bridges/api-relay-audit/issues/new?template=local-run-feedback.yml)
- [Detector Gap](https://github.com/toby-bridges/api-relay-audit/issues/new?template=detector-gap.yml)
- [Documentation Example](https://github.com/toby-bridges/api-relay-audit/issues/new?template=documentation-example.yml)
- [Agent Skill Feedback](https://github.com/toby-bridges/api-relay-audit/issues/new?template=agent-skill-feedback.yml)
- [Community Evidence Guide](./docs/community-evidence.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

Avoid publishing real API keys or private relay traffic, and keep changes scoped
to one behavior or document.

## API Relay Audit 是什么？

`api-relay-audit` 是一个本地运行的 AI API 中转站 / LLM proxy 安全审计工具。它把 API relay audit、prompt injection audit、model substitution signals、Web3 relay audit 拆成独立查询意图，避免把不同风险压成一个口号；你的 API Key 只会发送到你指定的中转站 URL。

当你使用第三方 AI API 中转站、OpenAI-compatible proxy、Claude-compatible proxy，或者 Web3 agent 工作流时，可以用它在信任该中转站之前生成一份可复查的 Markdown 审计报告。

## 你会得到什么

- 一个本地运行的 14 步审计工具，输出结构化 Markdown 报告
- 双分发形态: `audit.py` 单文件零依赖版 + `api_relay_audit/` 模块化开发版
- `--profile general|web3|full` 三种运行模式
- `LOW / MEDIUM / HIGH` 总结论，加每一步的细项结果

## 查询意图边界

### Query family · 用户意图 · Profile / Steps · 证据边界
- **Query family**: API relay audit · **用户意图**: 审计第三方中转站、镜像、网关、LLM proxy 或 resale API。 · **Profile / Steps**: 默认 `general`；完整覆盖用 `full` · **证据边界**: 输出本地报告，不是安全认证。
- **Query family**: Prompt injection audit · **用户意图**: 检测隐藏 prompt 注入、prompt 泄漏、指令覆盖和提取行为。 · **Profile / Steps**: `general`；Step 3-6 · **证据边界**: 记录 prompt 证据，但不公开私有 prompt 或 secret。
- **Query family**: Model substitution signals · **用户意图**: 收集模型身份、stream、延迟和上游 channel 信号。 · **Profile / Steps**: `general`；Step 5、10、13、14 · **证据边界**: self-ID、延迟和 channel fingerprint 是信号，不能单独证明 provider 替换。
- **Query family**: Web3 relay audit · **用户意图**: 在 agent 接触签名、交易或钱包相关内容前检查中转行为。 · **Profile / Steps**: `web3` 或 `full`；Step 11 · **证据边界**: profile-gated；普通 relay audit 不等于钱包安全。

正式契约在 [docs/query-families.md](./docs/query-families.md)。README、Pages、issue template 和 skill description 都应该保留这些边界。

## 30 秒快速开始

```bash
AUDIT_SCRIPT_REF=v2.4.0
curl -fsSL "https://raw.githubusercontent.com/toby-bridges/api-relay-audit/${AUDIT_SCRIPT_REF}/audit.py" -o audit.py

python audit.py --key <YOUR_KEY> --url  --output report.md

# Web3 / 钱包用户
python audit.py --key <YOUR_KEY> --url  --profile web3 --output report.md
```

## 核心覆盖

- Prompt 安全: token injection、prompt extraction、instruction override、jailbreak
- Relay 完整性: context truncation、tool-call substitution、error leakage、stream integrity
- 模型身份: 非 Claude 身份泄漏、模型替换信号、Claude / OpenAI 兼容中转行为
- Web3 风险: 转账指引、签名拒绝、私钥泄漏拒绝

## DeepSeek Harness DSH Plugin

本仓库同时提供 GitHub 可直装的 `dsh-api-relay-audit` bundle，支持官方 DSH
Web，以及使用 `@deepseek-ai/dsh-commands` registry 的社区 TUI。安装时必须固定
commit 或 release tag：

```bash
DSH_PLUGIN_REF=v2.4.0
dsh plugin --profile web add "github:toby-bridges/api-relay-audit#${DSH_PLUGIN_REF}"
dsh plugin --profile cc-tui add "github:toby-bridges/api-relay-audit#${DSH_PLUGIN_REF}"
```

插件默认复用当前 DSH provider 的 `baseURL`、model 和 credential reference；
真实 API Key 只从 DSH Credentials 解析，并通过子进程环境变量传递，不进入命令
参数或会话日志。

```text
/relay-audit
/relay-audit --connectivity
/relay-audit --profile web3 --fast-context
/relay-audit --url <URL> --model <claude-model> --credential-ref <DSH_CREDENTIAL_REF>
```

无参数运行现有完整审计，可能产生较高 token 消耗；低成本检查使用
`--connectivity`。插件不增加新的模型基线：中转接口可以兼容 Anthropic 或
OpenAI，但被审计线路必须明确为 Claude。没有 DSH profile/plugin 机制的独立
wrapper 不在兼容范围内。

## 保留的 Agent Skill 文件

仓库保留 OpenClaw 和 Hermes skill 文件，供已有直接用户和下游兼容使用；当前
registry 分发与 release 验证以 DeepSeek Harness plugin 为主。

- **OpenClaw Skill:** 在 OpenClaw agent 把 coding、tool 或钱包相关流量交给第三方 relay 前，先运行本地审计。
- **Hermes Skill:** 作为 Hermes Agent skill 安装，在 agent workflow 中运行同一套本地 14 步审计。

这些文件不代表 registry 已发布，也不给中转站颁发安全认证；它们只帮助 agent 在信任 relay 前生成本地、可复查的