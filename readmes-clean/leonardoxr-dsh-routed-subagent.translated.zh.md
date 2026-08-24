#dsh-routed-subagent

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的允许列表模型和推理路由。
每次代表团通话必须选择以下两项：

- 通过`model`配置的模型策略；和
- 通过 `reasoning_effort` 进行的一项精确适配器拥有的工作。

该插件在创建子项之前根据本地策略和 `ctx.llm.resolveCallConfig()` 验证该对。绝不接受任意提供者/模型传递。

## 安装

```sh
dsh plugin --profile <your-profile> add github:leonardoxr/dsh-routed-subagent#v0.3.0
# or use the packed asset from the GitHub release / a local checkout:
dsh plugin --profile <your-profile> add C:/path/to/dsh-routed-subagent-0.3.0.tgz
```

## 配置

定位您的配置文件补丁中的 `routed-subagent` 行。需要 `models` 和 `rootModels`。

```yaml
- id: routed-subagent
  config:
    toolName: routed_subagent
    maxDepth: 2
    rootModels: [codex-mini, codex-sol]
    models:
      codex-mini:
        provider: openai-codex
        model: gpt-5.4-mini
        reasoningEfforts: [low, medium]
        maxTokens: 16384
        description: 'Mechanical edits, lookups, and summarization.'

      codex-sol:
        provider: openai-codex
        model: gpt-5.6-sol
        reasoningEfforts: [medium, high, xhigh]
        maxTokens: 65536
        description: 'Architecture, multi-step reasoning, and hard debugging.'
        spawnableModels: [codex-mini]
```

映射键 (`codex-sol`) 是呼叫代理作为 `model` 传递的短策略 ID；它不会发送给提供商。 `provider`和内部`model`选择实际的适配器路由。

## 在应用程序中配置

**设置→插件→路由子代理**编辑完整的路由器配置：工具名称、后台作业支持、最大深度、根可用性、模型策略、提供者/模型路由、令牌上限、推理工作白名单、路由指导和递归子权限。提供商/模型建议和工作 ID 来自与 Chat 相同的实时主机目录；当目录不可用或故意不完整时，确切的自定义 ID 仍可编辑。

更改将暂存，直到**保存更改**。成功的保存会热重新安装该工具以进行新的调用，并使上一代设置的子级所拥有的递归权限无效。 **重置为组合**清除每个路由器覆盖。

## 工具合约

注册工具接受：

### 字段 · 必填 · 含义
- **字段**：`description` · **必填**：是 · **含义**：短显示标签
- **字段**：`prompt` · **必填**：是 · **含义**：完成独立子任务
- **字段**：`model` · **必填**：是 · **含义**：此调用者上下文中允许配置的模型策略 ID
- **字段**：`reasoning_effort` · **必填**：是 · **含义**：该政策允许的确切工作量
- **字段**：`run_in_background` · **必填**：否 · **含义**：运行 Harness 作业服务

前景和背景结果呼应了有效的 `{ id, provider, model, reasoningEffort }` 审计选择。

## 配置参考

### 键·默认·含义
- **按键**：`toolName` · **默认**：`routed_subagent` · **含义**：注册的工具名称
- **密钥**：`enableRunInBackground` · **默认**：`true` · **含义**：暴露 `run_in_background`
- **密钥**：`maxDepth` · **默认**：`1` · **含义**：正有限绝对授权深度上限
- **密钥**：`rootModels` · **默认**：必填 · **含义**：顶级代理可用的非空策略 ID
- **密钥**：`models` · **默认**：必填 · **含义**：非空配置的型号白名单
- **密钥**：`models.*.provider` · **默认**：必需 · **含义**：注册LLM提供者路线
- **密钥**：`models.*.model` · **默认**：必需 · **含义**：确切的提供商拥有的模型 ID
- **密钥**：`models.*.reasoningEfforts` · **默认**：必填 · **含义**：非空精确工作 ID 许可列表
- **密钥**：`models.*.maxTokens` · **默认**：— · **含义**：正输出代币上限
- **密钥**：`models.*.description` · **默认**： — · **含义**：向调用者显示的短路由权衡
- **密钥**：`models.*.spawnableModels` · **默认**：`[]` · **含义**：此模型上的策略 ID 子级可以调用

配置很严格：未知字段、重复 ID、空白名单、不安全数值和未知引用加载或保存失败。

## 递归和验证

- 仅使用本地 `spawn` 子代理提供程序，因为请求级推理执行和递归权限需要活动子 `Agent`。
- 委托深度大于零的未跟踪代理不会收到模型权限。
- 儿童仅收到其选择的保单的 `spawnableModels` 列表。
- 设置生成更改撤销了已运行子项的更深层次的委派。
- 配置的工作量是针对每个子项捕获的，并固定在每个 LLM 请求上，因此并发子项可以安全地使用不同的工作量。
- `ctx.llm.resolveCallConfig()` 在创建子项之前验证确切的提供者/模型/工作组合。缺少适配器、过时的模型 ID 和不受支持的工作 ID 将失败而不会生成。

## 从 0.2 迁移

版本 0.3 是故意破坏的，并且没有层兼容层：

- `tiers` → `models`
- `rootTiers` → 需要 `rootModels`
- 等级密钥 `guidance` → 模型策略 `description`
- 等级钥匙 `spawnable` → `spawnableModels`
- 删除 `providerName`、`persona` 和静态 `reasoningEffort`
- 将工具参数 `tier` 替换为所需的 `model` 和 `reasoning_effort`
- 将 `maxDepth: provider-managed` 替换为正整数

## 安全说明

Harness 的 `/api` 信任栅栏是 DNS 重新绑定防御，而不是身份验证。任何可以访问服务器的人都可以启动其代理可用的工作。除非您接受该支出，否则请保留 `models` 之外的昂贵路线。