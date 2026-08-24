# @raullenchai/dsh-provider

原生 [Rapid-MLX](https://github.com/raullenchai/Rapid-MLX) 提供程序
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — 所以 `dsh`
从服务器获取其模型事实，而不是从您输入的内容中获取
`settings.yaml`。

> **状态：发布到 npm** 作为
> [`@raullenchai/dsh-provider`](https://www.npmjs.com/package/@raullenchai/dsh-provider)。
> 在 [Verified](#verified) 上运行的端到端 `dsh` 在 M3 Ultra 上运行
> `dsh 0.1.0-rc.7`； `dsh 0.1.0-rc.8` 与 API 兼容 — `LlmAdapter`
> 合约是字节相同的，唯一的变化是附加的——并且
> 在协议和单元测试级别根据 rc.8 重新验证适配器。
> DSH 仍然是快速发展的开发者预览版，因此请将此视为跟踪
> 一个移动的目标，而不是一个冻结的兼容性承诺。

## 它对你有什么作用

DSH 已经可以通过其通用的方式与本地 Rapid-MLX 服务器通信
`openai-completions` 提供商。这条路线可行——但它一无所知
您的模型超出了您手写的范围：

```yaml
# what the generic route makes you maintain, by hand, per model
llm-pi-ai:
  providers:
    rapid-mlx:
      baseURL: http://localhost:8000/v1
      defaultContextWindow: 262144      # you looked this up. is it still right?
      models:
        - id: qwen3.6-35b-8bit
          contextWindow: 262144
          reasoningEfforts: {off: none, low: low, medium: medium, high: high}
```

Rapid-MLX 的 `/v1/models` 已经发布了所有这些内容以及更多内容。这个适配器
读它，所以：

**1.无需手写，切换模型时无需重写。**
交换 `rapid-mlx serve` 正在运行的内容和 `dsh` 跟随的内容。无需重新运行设置，
没有过时的号码。

**2.推理控制说出了真相。** Rapid-MLX 报告模型是否
实际上有一个推理解析器。无法推理的模型不再显示
关闭/低/中/高选择器不执行任何操作。

**3.压缩是根据实际适合这台 Mac 的容量来计时的，而不是根据
** 这是一个让你悄然付出代价的数字。
`dsh-compaction-basic` 向提供商询问路线的容量和紧凑程度
在 `thresholdRatio × capacity`（默认为 0.8）。提供商更喜欢
服务器的 **`max_model_len`** — Rapid-MLX 的内存安装上限（适合的内容）
统一内存：权重 + KV 缓存），在 vLLM/SGLang 标准领域 — 结束
原生 `context_window`，并在较旧的版本上回退到 `context_window`
不报告它的服务器。因此，压实时间要根据机器的能力而定
实际上持有，而不是模型广告的窗口（它可能没有空间
for) 而不是从其他型号复制的手写数字。

## 安装

需要Node ≥ 22.15（dsh导入Node的Zstd流API而不声明它）
以及正在运行的 Rapid-MLX 服务器。

```sh
# From npm:
dsh plugin --profile web add @raullenchai/dsh-provider

# …or straight from source — the package ships plain JS with no build step:
dsh plugin --profile web add github:raullenchai/rapid-mlx-dsh-provider

export RAPID_MLX_BASE_URL=http://localhost:8000/v1     # optional; this is the default
dsh web
```

然后将代理指向路线：

```yaml
# $DSH_HOME/settings.yaml
agent-default-model:
  provider: rapid-mlx
  model: qwen3.6-35b-8bit
```

已验证：该命令作为配置文件层安装并激活
`dsh 0.1.0-rc.7`。要在本地破解它，请参阅
[本地开发](#local-development)。

## 模型管理 (v0.2.0)

除了提供者路线之外，该插件还注册了五个工具和一个 `/rapid-mlx`
命令，以便代理可以在不离开会话的情况下查看和管理模型。
分割遵循哪个表面实际拥有每个事实：服务模型事实
来自结构化HTTP `/v1/models`；下载缓存和拉取/删除
仅支持 CLI，因此那些（也只有那些）通过以下方式购买 `rapid-mlx`：
线束子流程接缝。

### 工具 · 来源 · 它的作用
- **工具**：`rapid_mlx_serving` · **来源**：HTTP `/v1/models` · **它的作用**：现在提供的模型，已删除重复数据，具有上下文窗口、推理/工具解析器、MoE/混合和模式。
- **工具**：`rapid_mlx_cached` · **来源**：`rapid-mlx models --cached` · **它的作用**：下载的模型及其磁盘大小。
- **工具**：`rapid_mlx_pull` · **来源**：`rapid-mlx pull <name>` · **它的作用**：下载模型（别名或 HF 存储库 ID）。可取消；没有固定的期限。
- **工具**：`rapid_mlx_remove` · **来源**：`rapid-mlx rm -y <name>` · **它的作用**：删除缓存模型以释放磁盘。
- **工具**：`rapid_mlx_health` · **来源**：HTTP + `rapid-mlx --version` · **它的作用**：API 启动吗？ CLI 可以访问吗？作为两个独立的事实进行报告。

`/rapid-mlx` 打印一次性概述：健康状况、服务模型及其事实，
以及缓存磁盘的总使用量。

CLI 是从 `cliCommand` 配置解析的（默认 `rapid-mlx`
`PATH`或`$RAPID_MLX_CLI`）；如果二进制文件未打开，请将其设置为绝对路径
安全带的`PATH`。 `rapid_mlx_pull`/`rapid_mlx_remove` 是唯一的工具
改变磁盘上的任何内容，并且它们以非交互方式运行（`rm` 被强制
与 `-y` 因为子进程接缝忽略标准输入）。

## 已验证

在 M3 Ultra 上对抗 `dsh 0.1.0-rc.7`：

- 安装并**作为配置文件层激活**（无“声明无 `dsh.bundle`”
  警告；该条目显示在 `dsh --profile headless --dump-config` 中）。
- 向 `ctx.llm` 注册 `rapid-mlx` 路由并提供真实查询。
- 简单的聊天、单个工具调用以及门控的多步骤错误修复任务
  Rapid-MLX 版本 — 最后一个版本修复了错误并使目标仓库成为自己的仓库
  在 `qwen3.6-35b-8bit` 上 36 秒内通过独立验证的测试。

## 还没完成

明确地说，因为适配器的目的是“使用”服务器的内容
说，其中一些仍然只读：

- `recommended_sampling` — 应根据模型自动应用。
- `tool_call_parser` — 应该让 `dsh` 在无法发射的模型上快速失败
  `tool_calls`，而不是循环。
- `is_hybrid` / `is_moe` / `capabilities` — 已阅读，尚未采取行动。
- **内存感知能力。** 今天 `resolveModel()` 报告了该模型的
  *广告*上下文窗口。在 Mac 上，真正的上限是统一内存，并且
  报道称，这才是剩下的最大胜利——它需要 Rapid-MLX
  首先公开可用容量数据。
- 图像不通过 `stream()` 进行 — 但它们现在 **拒绝**
  根据食谱，`LlmError(..., 'UNSUPPORTED')` 而不是被丢弃。
  承载文字、推理、工具调用。
- 该路线注册为 `rapid-mlx`。如果您的`settings.yaml`也声明
  `llm-pi-ai`旗下的`rapid-mlx`提供商，两者争夺一个航线名称
  （`registerAdapter` 拥有提供商独家经营权）。使用一个或重命名我们的。

## 符合官方适配器合同

构建针对
[`docs/cookbook/adding-an-llm-adapter.md`](https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/cookbook/adding-an-llm-adapter.md)
及其“协议义务”部分。每个项目都有一个测试：

### 义务·如何履行
- **义务**：`usage` 在 `finish` 之前，`finish` 之后没有任何内容 · **如何满足**：使用量在流末尾缓冲和刷新，因此尾随仅使用的块无法重新排序
- **义务**：工具调用 `arguments` 是端到端的原始 JSON 字符串 · **如何满足**：片段流为 `argumentsDelta` 并重新组装未解析的
- **义务**：按首次看到的顺序块索引，每个块重复使用· **如何满足**：通过推理然后文本响应进行验证
- **义务**：错误恰好采用两条受认可的路径 · **如何满足**：传输/协议失败 **抛出** `LlmError` 并提供稳定的代码；没有什么能安静地结束溪流
- **义务**：兑现`options.signal` · **如何满足**：传递给`fetch`和SSE读者； `AbortError` 未改变地重新抛出，未重新分类
- **义务**：提供者无法履行的字段抛出 `UNSUPPORTED` · **如何满足**：图像内容拒绝而不是缩小范围
- **义务**：配置是一个具有 env 回退功能的架构模式 · **如何满足**：`export const Config`，通过 `!!js process.env.RAPID_MLX_BASE_URL` 从 `cordis.patch.yml` 提供

`finish.replayState` 未发出：Rapid-MLX 不需要本机响应 ID
或后续通话中的签名，因此不会有任何损失。

## 编辑此内容之前需要了解的三件事

其中每一个都会花费真正的调试时间：

1. **`package.json` 中的 `dsh.bundle` 使其成为插件。** 没有它
   该软件包作为惰性依赖项安装，`dsh` 仅*警告*。它是
   还有什么让它附加到配置文件的 `dsh.profile.bundles` 中。 CI 失败
   如果它丢失了。
2. **需要`LlmReasoningEffortInfo.name`。** 单独返回`{id}`失败
   整个模型与 `INVALID_MODEL_REASONING` — 命名的错误
   模型，而不是缺失的字段。
3. **DSH没有`tool`角色。** `Message.role`只是系统|用户|助理；一个
   工具*结果*是一条**用户**角色消息