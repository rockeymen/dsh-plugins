# dsh-plugin-memory

[English](README.md) | 中文

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的会话蒸馏记忆插件(`dsh-plugin` bundle):把已完成的轮次蒸馏为持久知识条目,并以 `memory-<slug>` skill 的形式暴露给模型。机制移植自一个先前的任务蒸馏设计(完成即蒸馏、`merge_with` 驱动的融合、每条记忆一个 Markdown 文件加索引)。

## 工作机制

- 每个 reason 为 `completed` 的 `turn/end` 触发一次采集:该轮直接的人类问题、最后的助手回答与工具调用。回答结尾向用户索取更多信息的轮次会被跳过。
- 一次辅助模型调用把问答对蒸馏为严格 JSON —— `title`、`answer`、`sources`,以及可选的 `merge_with`(模型判定为同主题的已有条目 slug)。报告了 `merge_with` 时再发起第二次融合调用;融合失败保留新蒸馏结果,但仍替换旧条目。
- 条目写入记忆目录(默认 `<DSH_HOME>/memory`):每条记忆一个 `<slug>.md`,外加映射 slug 到记录的 `_index.json`。索引写入是原子的(临时文件 + rename);条目写入通过一条 promise 链串行化。slug 为小写 ASCII `[a-z0-9-]`(中文标题回退到 12 位十六进制 SHA-1),模型报告的 slug 在拼接路径前会被校验。
- 每次完成的辅助调用追加一条仅日志的 `memory/distill-call` 会话事件(用途、路由、输出上限、完整输出块、可选用量),每次写入提交后追加一条仅日志的 `memory/distilled` 事件。
- 挂载了 `ctx.skills` 服务时,插件注册 `memory` skill provider:每条记忆对应一个 `memory-<slug>` 候选,rank 550,低于所有人工撰写的 skill 根目录。加载候选时返回条目 Markdown 正文作为 skill 内容。

## 版本要求

插件使用 DeepSeek Harness memory 变更引入的词汇(`dsh-llm` 的 `purpose: 'memory'` 与 `memory/*` 会话事件),需要包含该变更的 Harness 构建。旧构建仍能加载插件并正常蒸馏,只是失去 DeepSeek 关闭思考映射与 `memory/distill-call` 重放词汇。

## 安装

来自 npm(预构建,无需构建授权):

```sh
dsh plugin --profile <name> add dsh-plugin-memory
```

来自 GitHub(源码;pnpm 安装后运行包的 `prepare` 构建):

```sh
dsh plugin --profile <name> add github:<owner>/dsh-plugin-memory
```

pnpm ≥10 需要显式允许 git 依赖的构建脚本;把 `dsh` 提示的确切键写进 profile 的 `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  dsh-plugin-memory: true
```

来自本地 tarball:

```sh
pnpm pack
dsh plugin --profile <name> add ./dsh-plugin-memory-0.1.0.tgz
```

然后启动:`dsh --profile <name>`。

## 配置

### 键 · 类型 · 默认值 · 含义
- **键**: `autoDistill` · **类型**: boolean · **默认值**: `true` · **含义**: 自动蒸馏已完成的轮次。
- **键**: `memoryDir` · **类型**: string · **默认值**: `<DSH_HOME>/memory` · **含义**: 记忆目录。
- **键**: `distillProvider` · **类型**: string · **默认值**: 会话路由 · **含义**: 显式蒸馏 provider;必须与 `distillModel` 成对。
- **键**: `distillModel` · **类型**: string · **默认值**: 会话路由 · **含义**: 显式蒸馏模型;必须与 `distillProvider` 成对。
- **键**: `maxTokens` · **类型**: number · **默认值**: `3000` · **含义**: 每次蒸馏/融合调用的输出 token 上限。

在 profile 的 `cordis.patch.yml` 里按 `id: memory` 覆盖该行,例如:

```yaml
- id: memory
  name: dsh-plugin-memory
  config:
    autoDistill: false
```

## 服务 API

服务注册为 `ctx.memory`:

- `list(): Promise<MemoryIndex>` — 当前索引;目录缺失或损坏时返回空索引。
- `readEntry(slug: string): Promise<string | undefined>` — 单条记忆的 Markdown 正文。
- `settled(session: Session): Promise<void>` — 在会话所有待处理蒸馏结算后 resolve。

可选的 invariant 伴生插件(`dsh-plugin-memory/invariant`)通过 `ctx.invariants` 校验 `memory/*` 事件载荷;认识该插件的 Harness 构建可把它作为单独一行挂载。

## Known Limitations and Deferred Work

- 没有与参考实现写入前过滤等价的内容安全策略;蒸馏结果按模型输出原样存储。
- 不完整回答过滤器基于标记词,可能漏判或误判。
- 一个记忆目录服务所有会话;按工作区或按 agent 的作用域隔离待做。
- 目录列出所有条目;没有单会话上限或基于大小的条目淘汰。

## 发布

GitHub 仓库应打上 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic,以便市场与聚合器发现。