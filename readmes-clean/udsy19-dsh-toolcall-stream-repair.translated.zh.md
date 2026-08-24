#dsh-toolcall-stream-repair

一个[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 修复畸形的插件
**从 OpenAI 兼容网关流式传输工具调用增量** — 在它们组装成调用之前
线束无法发送。

如果您看到 `unknown tool ""`，会话在一次工具调用或两次工具调用后拒绝恢复
它的参数被连接成一个不可解析的 blob，这个插件的目标是在它的失败处
来源。

## 到底出了什么问题

该线束使用 `BlockAssembler` 组装流式助理消息
（`packages/llm/llm/src/assembler.ts`）。两行代码会导致格式错误的网关响应永久损坏：

```ts
// assembler.ts:71 — unconditional: a later empty id overwrites a good one
partial.toolCallId = chunk.id

// assembler.ts:112-117 — the intended fallback cannot fire for the EMPTY STRING
case 'tool-call': return {
  type: 'tool-call',
  id: partial.toolCallId ?? CallId(`call-${index}`),
  name: partial.toolCallName ?? '',
  arguments: partial.toolCallArguments,
}
```

`??` 捕获 `null` 和 `undefined`，而不是 `''`。发货的 pi-ai 适配器在
网关省略 ID 或名称（`packages/llm/llm-pi-ai/src/stream.ts:160-161`，
`partial?.type === 'toolCall' ? partial.id : ''`）。所以缺席的身份就变成了空的身份，
在每个守卫中幸存下来，并作为 `name: ""` 的工具调用到达会话日志。

该插件位于 `llm/stream` 瀑布上，它在适配器和汇编器之间运行**
（`packages/core/agent-loop/src/agent.ts:346-352`）。这个位置很重要：代理循环附加每个
瀑布后块作为 `assistant/chunk` *在*组装之前添加到会话日志中，因此在此处修复即可修复
持久重播记录也是如此——不仅仅是内存中的消息。

```
adapter → [ llm/stream: this plugin ] → agent loop → assistant/chunk log → BlockAssembler → assistant/message
```

## 安装

```sh
dsh plugin --profile <name> add dsh-toolcall-stream-repair
```

然后重新启动配置文件 - 捆绑成员身份在配置文件启动时固定
（`apps/cli/reference/README.md:55`）。

> **固定您的线束包。** 多个 `@deepseek-ai/dsh-*` 包上的 `latest` 分布标签指向
> 过时的 `0.0.1-rc.1` 占位符，而真正的版本位于 `next`（已于 2026 年 8 月 23 日验证：
> `@deepseek-ai/dsh-llm`、`latest → 0.0.1-rc.1`、`next → 0.1.1-rc.2`）。因此这个包声明
> 将包作为具有显式 `||` 范围的 **对等** 依赖项，而不是作为 `dependencies` —
> 重复的 Cordis 会给插件一个不同的、空的服务注册表。

## 配置

默认为`cordis.patch.yml`；在您的个人资料的 `cordis.patch.yml` 中覆盖它们。

### 键·默认·含义
- **键**：`onUnrecoverableToolCall` · **默认**：`fail-request` · **含义**：无法调度从未收到名称的工具调用。 `fail-request` 将响应替换为终端 `error` 完成，循环通过 `agent/request-error` 报告该响应 - 因此 `dsh-llm-retry` 可以重试 - 而不是记录不可分派的调用。 `passthrough` 恢复库存行为。
- **关键**：`splitOnIdCollision` · **默认**：`true` · **含义**：将在已占用的块索引处宣布的第二个调用提供给它自己的块，而不是让其参数渗透到第一个块中。
- **键**：`closeTruncatedStream` · **默认**：`true` · **含义**：当上游流结束时根本没有终端块时，发出终端 `error` 完成。
- **密钥**：`logRepairs` · **默认**：`true` · **含义**：使用其稳定代码在调试级别记录每个应用的修复。

## 它处理什么

每行在 `tests/fixtures/` 中都有一个固定装置和一个 **阴性对照** - 一个断言的测试
如果没有修复，腐败就会存在。删除修复及其配对的断言翻转。

### 代码 · 形状错误 · 没有这个插件 · 有它
- **代码**：`unrecoverable-name` · **形状错误**：网关在任何帧上都不会发送 `function.name` · **没有此插件**：组装 `name: ""` → `unknown tool ""`，记录且不可恢复 · **使用它**：终端 `error` 完成；没有记录任何损坏的内容；可重试
- **代码**：`synthesized-id` · **形状错误**：网关在任何帧上都不会发送 `id` · **没有此插件**：组装 `id: ""`；结果无法与其调用配对 · **与它**：铸币 `call-`，值 `assembler.ts:114` 已预期
- **代码**：`empty-id-clobber` · **畸形形状**：连续增量在良好的增量之后带有 `id: ""` · **没有此插件**：`assembler.ts:71` 用 `""` 覆盖良好的 id · **使用它**：保留已建立的 id
- **代码**：`id-collision-split` · **畸形形状**：两个不同的调用共享一个 `tool_calls[].index` · **没有此插件**：一个块；参数连接成无效的 JSON；一次呼叫丢失 · **有了它**：两个块，正确的 ID/名称，每个 `arguments` 可单独解析
- **代码**：`corrected-block-end` · **畸形形状**：终端框架的 ID/名称比 Delta 更弱 · **没有此插件**：权威的 `block-end` 用 `""` 覆盖良好的身份 · **使用它**：从 Delta 恢复身份
- **代码**：`synthesized-block-start` · **畸形形状**：Delta 到达时没有打开块 · **没有此插件**：线束自己的流语法失败 · **使用它**：合成打开块
- **代码**：`duplicate-block-start` · **格式错误**：索引被打开两次 · **没有此插件**：线束自己的流语法失败 · **使用它**：重复被抑制
- **代码**：`straggler-dropped` · **畸形形状**：在其块关闭后到达增量 · **没有此插件**：使线束自己的流语法失败 · **使用它**：已删除，与汇编器已经执行的操作相匹配
- **代码**：`synthesized-block-end` · **形状错误**：终端完成到达时工具调用块仍处于打开状态 · **没有此插件**：线束自己的流语法失败 · **使用它**：首先更正了 `block-end` 合成
- **代码**：`truncated-stream` · **畸形形状**：上游迭代器以没有终端块结束 · **没有此插件**：`LlmRuntime.adapterStream` 返回没有一个（`index.ts:958-961`）；对于半写调用，汇编器报告干净的 `stop` · **有了它**：终端 `error` 完成
- **代码**：`recovered-name` · **畸形形状**：延续增量省略了 `name` · **没有这个插件**：（无害 - 汇编器已经在 `:72` 处保护了它） · **有了它**：重用已建立的名称

“线束自身的流语法失败”意味着 `validateStream`
(`packages/llm/llm/src/invariant.ts:36-84`) 举报违规行为。该验证器安装在
`llm/stream` 和 `{ global: true, prepend: true }`，即作为**最外面**瀑布监听器 - 所以它
验证此插件发出的内容。测试套件断言每个修复的固定装置产生**零**
违反了该精确语法的转录。

两个控制装置断言**格式良好**流以零字节相同的方式传递
已报告维修情况。

## 它**不**处理什么

简单地说，因为夸大其范围的修复工具比没有更糟糕。

- **它无法发明工具名称。** 如果整个响应中没有框架命名该工具，则调用是
  无法恢复的。该插件将无声的损坏转换为响亮的、可重试的错误 - 它不会
  重建呼叫。什么都不能。
- **一个索引处的两个无名、无 ID 的调用是无法区分的。** 拆分依赖于 *非空*
  id改变。根本没有 id，就没有第二次调用开始的信号，并且参数仍然存在
  连接。
- **`max-tokens` 截断是故意保留的。** `BlockAssembler` 已经在下面删除了工具调用
  `max-tokens` (`assembler.ts:136-138`);该插件仅关闭块，因此流保持不变
  结构良好。
- **中流适配器*故障*已处理。** `LlmRuntime.adapterStream` 转换适配器
  抛出终端错误完成（`packages/llm/llm/src/index.ts:940, 955`）。的
  `truncated-stream` 修复涵盖了迭代器的较窄情况，该迭代器以**静默方式**结束，这
  代码路径从不合成结束返回。对于附带的 pi-ai 适配器 — 会抛出
  相反，`STREAM_CLOSED` - 此修复不会触发。
- **忽略 `error` 饰面的消费者仍然会看到部分。** 在 `fail-request` 上，增量已经
  转发保留在流中。错误完成后，代理循环永远不会读取 `blocks()`
  (`agent.ts:372-390`) 和支持的部分读取 `interruptedBlocks()` 省略了工具调用
  合同（`assembler.ts:161-178`）。无论如何，在错误流上调用 `blocks()` 的自定义消费者
  仍然会看到格式错误的块。
- **它不会修复已经损坏的会话。** 这只是预防措施。用于修复
  现有日志，请参阅下面的项目。
- **它不涉及文本或推理内容**、工具*结果*或`session/*`事件词汇。
- **没有网络用户界面。**