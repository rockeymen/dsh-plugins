#dsh-tool-failure-circuit-breaker

一个 DeepSeek Harness 防护插件，可阻止代理在调用多次失败后调度具有相同参数的同一工具。当模型重试无法成功的未更改操作时，它可以节省工具延迟、网络请求、命令执行和提供程序成本。

该插件故意比官方 `@deepseek-ai/dsh-repeat-tool-reminder` 更窄：官方插件对每个重复调用提供建议，但从不阻止调用。该插件仅观察权威失败的 `tools/result` 结果，并在配置的阈值后拒绝下一个相同的调度。

该软件包的目标是 DeepSeek Harness `0.1.1-rc.2`。

## 安装

从该签出的父目录：

```sh
dsh plugin --profile web add ./dsh-tool-failure-circuit-breaker
```

要检查 Harness 的源，请将 `dsh` 替换为 `pnpm dsh`。

## 配置

包含的捆绑包插入此行：

```yaml
- id: tool-failure-circuit-breaker
  name: dsh-tool-failure-circuit-breaker
  config:
    maxFailures: 2
    include: []
    exclude: []
    errorPreviewChars: 300
```

- `maxFailures`：在下一次尝试被拒绝之前完成允许的相同失败。默认值：`2`。
- `include`：要保护的 `*` 通配符工具名称模式。空守卫每件工具。
- `exclude`：绕过防护的 `*` 通配符工具名称模式。
- `errorPreviewChars`：拒绝中重复的最近一次失败的最大字符数。默认值：`300`。

对于预期合同要求不变的轮询调用的工具，请使用 `exclude`。

## 行为

每个实时代理都会隔离故障链，并通过工具名称和规范的 JSON 参数进行键入。对象键顺序不会改变身份。成功的工具结果、新的用户消息或使用不同参数的失败调用会打开先前的电路。没有代理的呼叫将被忽略。

守卫在 `tools/pre-execute` 处监听，因此被拒绝的重试永远不会到达工具主体。它观察到不可变的 `tools/result` 事件，并且不会将其自身的拒绝视为另一个操作故障。

打开时，模型会看到其原始工具错误。一旦被阻止，它会收到：

```text
The identical <tool> call already failed <count> consecutive times. Last failure: <message>. Change the arguments or approach, inspect external state, or ask the user instead of retrying unchanged.
```

拒绝被记录为正常工具结果，因此重放和模型历史记录与 Harness 行为保持一致。该插件在阻止调用之前不会添加任何工具架构和令牌。

## 测试

```sh
npm test
```

## 限制

- 状态位于内存中，并在进程或插件重新启动时重置。
- 在阈值阻止后续调用之前，已调度的并行调用可能全部失败。
- 精确的规范参数匹配不会检测到几乎相同的重试。
- 通过安装捆绑包可选择阻止；选择合法重复探测的排除项。