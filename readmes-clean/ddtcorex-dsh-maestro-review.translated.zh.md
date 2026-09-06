# @ddtcorex/dsh-maestro-review

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的自动合并请求审查：
可插入 **ReviewProvider** （首先是 GitLab），一个启动审阅者/审计员的编排器
新工作树上的子代理、GitLab 事件的 Webhook 接收以及设置/隧道
客户端 UI 注入到 DSH Web 插槽中。

Maestro Harness 套件 (`dsh-maestro-*`) 的一部分。 Cordis 补丁行：
`maestro-review-webhook`（进气）、`maestro-review-orchestrator`（管道）、
`maestro-review-settings-rpc`（设置 UI）——全部由这个 npm 包提供。

## 它提供什么

- **ReviewProvider 抽象** - 今天的 GitLab 客户端；其他熔炉插入同一熔炉后面
  界面。
- **协调员** — 审阅者 + 审计代理针对 MR 的一次性工作树运行，
  模型选择可全局覆盖 (`reviewModel`) 和每个项目映射。
- **Webhook 接收** — 接收 GitLab MR 事件，将评论排入队列（重复数据删除 + 保留）。
- **审查调查结果/历史/信号** — 通过 `review-findings` 撰写的调查结果
  工具按仅工具审查子代理（绝不是自由文本）；每个 MR 跟踪的历史记录 + 信号。
- **Govard/工作区工具** 在审核运行中可用。
- **客户端一半** — 设置部分呈现到 DSH Web 插槽中；通知副本保留
  在这里，通过可选的 `maestroNotifier` 服务进行交付。

## 设置

通过**共享命名空间设置存储**读取其配置
（`~/.dsh/maestro/settings.json`，`@ddtcorex/dsh-maestro-config-lib` 所有）通过公寓
`src/config-store.ts` 适配器；机器运行时状态保留在包本地 sidecar 中。

## 安装

```sh
dsh plugin --profile web add @ddtcorex/dsh-maestro-review
# or everything at once:
dsh plugin --profile web add @ddtcorex/dsh-maestro-meta
```

## 发展

```sh
pnpm install
pnpm verify        # tsc --noEmit
pnpm test          # vitest run
pnpm build         # tsc -> lib/
pnpm run build:client   # browser bundle -> lib/client.js (required after client changes)
```

请参阅 AGENTS.md 了解约定（主机/客户端拆分、机密处理、实时验证规则）。