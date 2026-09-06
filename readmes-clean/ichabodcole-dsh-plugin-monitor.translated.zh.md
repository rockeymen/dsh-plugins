#dsh-plugin-monitor

[DeepSeek Harness](https://deepseek.com/harness/en/)：设置背景的事件监视器
watch — shell 命令或 WebSocket — 每个 stdout 行（或文本框架）都被传递到
拥有代理会话作为异步事件。代理人继续工作或闲置；
只有当某物实际到达时，推理才会发生。

以 Claude Code 的 `Monitor` 工具为模型。它涵盖了代理需要做出反应的情况
事情发生时而不是最后：开发服务器或测试观察者报告它
重新编译，代理应响应中期任务的日志或队列，这是一个失败的长构建
应该中断而不是等待，套接字向其提供消息。如果没有它，选项是
阻止一个命令直到它退出，或者轮询一个计时器——这会花费一个模型打开每个
空检查并将每个事件延迟最多一个完整的时间间隔。

## 状态

工作正常，并根据真实的 dsh 配置文件进行端到端验证。两家生产商均涵盖：

- **命令** — 每行交付、批处理、标签、速率限制和自动终止、`job_kill`、
  并通过 `job_output` 恢复限幅输出
- **websocket** — 每个文本框架一个事件，多行框架保持完整，二进制框架
  报告其大小、紧密代码和超时作为工作结果

74 个单元测试，在 Linux 上的 CI 中进行门控，在 macOS 上进行本地测试。验收运行记录在
[`docs/design.md`](./docs/design.md)。

## dsh 已有的功能以及新增的功能

dsh 后台作业运行时 (`ctx.jobs`) 已拥有作业 ID、取消、增量
读取（`readOutput()` / `job_output`），以及空闲所有者的**完成唤醒**。分别地，
`agent.inject()` 将上下文附加到下一个模型请求 - 明确_不是_唤醒。

该插件将其从仅完成扩展到**每个输出事件**。交货是
`agent.send(event, 'next-step', true)` — 运行时的唤醒发送，将事件折叠到
正在进行的工作并在所有者空闲时打开轮流。注册表没有每个输出
通知并且不需要任何通知：生产者拥有进程中的流。周围坐着
使其能够生存的操作细节：

- 行/帧粒度 - 每条输出行都是一个事件
- 短窗口批处理（~200ms），因此多行突发作为一个通知到达
- 消防水带自动杀死的速率限制
- 每个通知中都带有每个监视器的标签
- 默认超时，选择会话长度持久性，可通过 `job_kill` 停止

## 发展

Bun + Biome用于本地开发（发布的包是`dist/`中的纯JS，所以这是
消费者看不见）：

```sh
bun install
bun run build     # tsc → dist/
bun run check     # biome
```

从本地结帐安装到 dsh 配置文件中 - 注意 `dsh plugin add` 转发到 **pnpm**
在消费者端，git 安装需要消费者的允许列表中的 `prepare` 脚本
`pnpm-workspace.yaml`;两者都不限制此存储库自己的工具：

```sh
dsh plugin --profile dev add /path/to/dsh-plugin-monitor
```

将其添加到您实际**启动**的配置文件中 - Web UI 运行 `web` 配置文件，因此安装
进入 `dev` 然后启动 Web UI 是针对错误目标的正确命令。验证
启动前：

```sh
dsh --dump-config | grep monitor
```

### 调整交付预算

可选。默认设置是几乎每个人的政策；仅当以下情况时才覆盖
源合法地需要更多空间，作为配置文件条目上的 `config:` 块：

```yaml
- id: monitor
  name: dsh-plugin-monitor
  config:
    maxEventBytes: 32768 # bytes in one delivered event (default 16 KiB)
    throttleBytes: 262144 # bytes per 10s before throttling (default 128 KiB)
    killBytes: 1048576 # bytes per 10s before the monitor is stopped (default 512 KiB)
    spillBytes: 524288 # capacity for event-clipped output (default 256 KiB)
```

配置在加载时进行验证，因此错误输入的预算会导致启动失败，而不是启动失败
第一个溢出事件。从事件中剪辑的输出可以通过以下方式恢复
`job_output `；该事件说明已传送了多少字节以及发生了哪些溢出
块容纳其余部分。

## 如果安装插件后工具调用开始失败

```
Cannot read properties of undefined (reading 'prepare')
```

配置文件中的每个工具调用都会失败，包括与您刚刚添加的插件无关的工具调用。它
意味着加载了 `@deepseek-ai/dsh-tools` 的两个副本：其调度程序由模块本地键控
`Symbol()`，因此副本无法看到彼此的调度程序。这是dsh的包装问题
比插件错误 — 请参阅 deepseek-harness 讨论
[#1849](https://github.com/deepseek-ai/deepseek-harness/discussions/1849)。这个包声明了
线束包作为对等体并且不提供运行时依赖项，因此它不应该引入
第二份；找到一个这样做的人：

```sh
ls $DSH_HOME/profiles/<name>/node_modules/@deepseek-ai
```

## 布局

- `src/index.ts` — 插件条目（`name`、`inject`、`apply`）；注册 `monitor` 工具并
  系统提示部分告诉模型事件在无提示的情况下到达
- `src/events.ts` — 批处理、速率限制和唤醒交付给拥有代理
- `src/command.ts` — shell 命令生产者（自己的进程组，因此取消会杀死管道）
- `src/websocket.ts` — WebSocket 生产者（每个文本帧一个事件）
- `src/lines.ts` — 跨块边界的线分割
- `cordis.patch.yml` — 将捆绑包添加到配置文件时应用的配置层
- `docs/design.md` — 设计说明和开放问题

## 参考文献

- 【插件开发指南](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)
- [工具创作](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/tool)
- [工具创作食谱（后台工作）](https://deepseek-harness.github.io/deepseek-harness/en/reference/cookbook/adding-a-tool)
- 【后台作业运行时设计说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/architecture/2026-06-20-generic-long-running-tool-runtime.md)