# dsh-llm-kiro

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) LLM 接缝的 Kiro 提供商。

该包是一个独立的 Cordis 插件：它通过以下方式安装在任何线束组合中：
`cordis.yml`，在`ctx.llm`上注册`kiro`提供者路由，无需更改
驾驭自己。

## 它处理什么

### 关注·实施
- **关注**：**现有凭据** · **实现**：获取现有的 kiro-cli 登录名（kiro-cli 的 SQLite 存储的 `auth_kv` 表、IDC 和社交令牌）和 Kiro IDE 令牌（`~/.aws/sso/cache/kiro-auth-token.json` 及其 OIDC 客户端注册）——无需第二次登录。可选的 `bearerTokenEnv` 参考绕过 CI/机器人的环境发现。
- **关注**：**令牌刷新** · **实施**：通过 AWS SSO OIDC `/token` 端点（Builder ID / IAM Identity Center）或 Kiro 桌面身份验证服务（Google/GitHub 社交）静默刷新过期令牌，写回到 kiro-cli 存储中，以便两个消费者保持同步； 403中流重新读取共享存储并回退到`kiro-cli debug refresh-auth-token`；最后手段失败表面为 `MISSING_CREDENTIAL`/AUTH 并提供指导。
- **关注**：**后端** · **实现**：区域/端点解析（SSO 区域 → Kiro API 区域）、管理控制平面（`List-Available-Profiles`、`List-Available-Models`、共享 `~/.kiro-management-models-cache.json` 目录缓存）以及通过 AWS 事件流协议进行的运行时 `generateAssistantResponse` 调用（通过 `@smithy/core` 进行 Smithy 成帧），具有容量回退功能，第一个令牌超时，以及线束空闲看门狗。
- **关注**：**模型** · **实现**：镜像 kiro-cli 验证菜单的引导目录（15 个具有上下文窗口、输出上限、推理能力、图像模态的模型）、精确的线 ID 分辨率（虚线束 ID ⇄ 点线 ID）以及模型页面的管理发现。推理工作将工具 `off`/`low`/`high`/`max` 词汇映射到每个模型的经过验证的工作模式，并在系统提示上使用 Kiro 思维标记。

每个运行时请求都携带线束属性 `User-Agent`（来自 `@deepseek-ai/dsh-llm`）
`attributionHeaders()`）加上后端期望的 AWS SDK 形状的 `x-amz-user-agent` 遥测标头。

## 安装

该包是 ESM，并将其所交互的线束包声明为对等依赖项 — 主机
DSH安装提供了它们。它还声明了 `dsh` 捆绑清单
（`cordis.patch.yml` 随包装一起提供），因此它作为配置文件包以及
简单的插件依赖。

```bash
npx -y @deepseek-ai/dsh plugin --profile web install @joshryandavis/dsh-llm-kiro
```

将其安装在`cordis.yml`中：

```yaml
- id: llm-kiro
  name: '@joshryandavis/dsh-llm-kiro'
  config:
    region: us-east-1        # optional; the credential's region wins when omitted
    reasoningEffort: high    # optional; off | low | high | max (default high)
```

这是现有 kiro-cli 或 Kiro IDE 登录的完整配置：选择凭据
环境中起来，默默刷新，然后写回来。静态不记名令牌也可以工作：

```yaml
- id: llm-kiro
  name: '@joshryandavis/dsh-llm-kiro'
  config:
    bearerTokenEnv: KIRO_BEARER_TOKEN   # stored via the harness credentials service
```

## 配置参考

所有字段都是可选的； `llm-kiro` 用户设置部分使用相同的架构，并且可以
在运行时编辑 - 更改到达下一个请求而无需重新启动。

### 字段·默认值·含义
- **字段**：`region` · **默认**：凭证的区域，否则为 `us-east-1` · **含义**：Kiro API 区域覆盖。
- **字段**：`runtimeURL` · **默认**：`https://runtime.<region>.kiro.dev` · **含义**：网关/代理部署的运行时端点覆盖。
- **字段**：`profileArn` · **默认**：管理发现 · **含义**：配置文件 ARN 覆盖。
- **字段**：`bearerTokenEnv` · **默认**： — · **含义**：静态不记名令牌的凭证引用；绕过环境发现。
- **字段**：`thinking` · **默认**：`enabled` · **含义**：部署锁定； `disabled` 限制对 `off` 的每个请求。
- **字段**：`reasoningEffort` · **默认**：`high` · **含义**：默认工作量； `off` 禁用思考。
- **字段**：`maxTokens` · **默认**：`8192` · **含义**：默认每个请求的输出上限；每个模型的上限和明确的值获胜。
- **字段**：`defaultContextWindow` · **默认**：`200000` · **含义**：没有确切值的模型的上下文容量。
- **字段**：`models` · **默认**：引导目录 · **含义**：向发现消费者显示的咨询模型列表。
- **字段**：`streamIdleTimeoutMs` · **默认**：`300000` · **含义**：每次读取的空闲预算。
- **字段**：`firstTokenTimeoutMs` · **默认**：`90000` · **含义**：首次活动预算；对于慢速模型，存在每个模型的覆盖。
- **字段**：`retryPolicy` · **默认**：正常，五次重试 · **含义**：`dsh-llm-retry` 的提供商拥有的重试策略。
- **字段**：`kiroCliDbPath` · **默认**：平台应用程序支持 · **含义**：kiro-cli SQLite 存储覆盖。
- **字段**：`ssoCacheDir` · **默认**：`~/.aws/sso/cache` · **含义**：Kiro IDE 令牌目录覆盖。
- **字段**：`allowKiroCliRefresh` · **默认**：`true` · **含义**：403恢复是否可以支付给`kiro-cli`。

## 型号

Bootstrap 目录（线束 ID → 线 ID）：

### Harness id · Wire id · Context · 推理 · 图像
- **线束 ID**：`claude-opus-4-8` / `claude-opus-4-7` · **电线 ID**：`claude-opus-4.8` / `claude-opus-4.7` · **上下文**：1M · **推理**：✓ · **图像**：✓
- **线束 ID**：`claude-opus-4-6` · **电线 ID**：`claude-opus-4.6` · **上下文**：1M · **推理**：✓ · **图像**：✓
- **线束 ID**：`claude-sonnet-5` / `claude-sonnet-4-6` · **电线 ID**：`claude-sonnet-5` / `claude-sonnet-4.6` · **上下文**：1M · **推理**：✓ · **图像**：✓
- **线束 ID**：`claude-sonnet-4-5` / `claude-sonnet-4` · **电线 ID**：`claude-sonnet-4.5` / `claude-sonnet-4` · **上下文**：200K · **推理**：✓ · **图像**：✓
- **线束 ID**：`claude-haiku-4-5` · **电线 ID**：`claude-haiku-4.5` · **上下文**：200K · **推理**：✗ · **图像**：✓
- **线束 ID**：`claude-fable-5` · **电线 ID**：`claude-fable-5` · **上下文**：1M · **推理**：✓ · **图像**：✓
- **线束 ID**：`deepseek-3-2` · **电线 ID**：`deepseek-3.2` · **上下文**：164K · **推理**：✓ · **图像**：✗
- **线束 ID**：`minimax-m2-5` / `minimax-m2-1` · **电线 ID**：`minimax-m2.5` / `minimax-m2.1` · **上下文**：196K · **推理**：✗ · **图像**：✗
- **线束 ID**：`glm-5` · **电线 ID**：`glm-5` · **上下文**：200K · **推理**：✓ · **图像**：✗
- **线束 ID**：`qwen3-coder-next` · **电线 ID**：`qwen3-coder-next` · **上下文**：256K · **推理**：✓ · **图像**：✗
- **线束 ID**：`auto` · **电线 ID**：`auto` · **上下文**：1M · **推理**：✓ · **图像**：✓

虚线和点线拼写都解析为线 ID。经过认证的管理目录
（每个凭证、每个区域）在发现运行时覆盖容量和工作量阶梯；的
`~/.kiro-management-models-cache.json` 的目录缓存与 pi-provider-kiro 共享。

## 发展

```bash
pnpm install
pnpm run build       # tsc -b: compiles this package; deps resolve from the published @deepseek-ai packages
pnpm test            # vitest suite (95 tests): endpoints, store, refresh, models, serialize,
                     # translate, adapter transport, real Loader composition
```

测试从 `node_modules` 中发布的 `@deepseek-ai/*` 包解析线束包
（对等依赖加上在代码开发所针对的版本中设置的开发依赖），所以
他们使用确切已发布的 API。凭证测试与主机完全隔离
机器的真实 kiro-cli / Kiro IDE 商店。

## 已知的限制和推迟的工作

- **交互式登录**未捆绑：没有环境凭据，提供程序失败
  `MISSING_CREDENTIAL` 并指向 `kiro-cli login` 或 Kiro IDE。设备代码流可以是
  后来添加到管理缝上。
- **传统的内联思维方言**：推理通过本机 `thinkingText` 事件到达；
  在内容中发出 `` 标签的模型将它们保留在可见文本块中。
- **重播状态**不被发出；历史记录将作为后续内容中提供者中立的内容重新发送。
- 管理目录刷新是基于拉取的（发现或缓存期限），而不是后台预热。