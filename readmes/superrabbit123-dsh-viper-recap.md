# dsh-viper-recap 🐍

毒蛇复盘 — roast (or toast) your DeepSeek Harness session from its real event log.

`viper_recap` is a model-facing tool that folds the current session's log into turns, steps, tool calls, failures, and output tokens, then renders a deterministic Chinese recap. A host projection (`viperRecap`) publishes the same figures to the client, where a 🐍 composer button opens a floating recap card. No extra model call, no API key.

`viper_recap` 是一个面向模型的工具：把当前会话日志折叠成轮数、步数、工具调用、失败次数与输出 token，再渲染成确定性的中文复盘。同时注册一个 `viperRecap` 投影把同样数字推给客户端，composer 里的 🐍 按钮会弹出浮动复盘卡。不额外调用模型、无需 API key。

<img src='./demo.png'>

## Install · 安装

From GitHub · 从 GitHub 安装（git 安装会运行 `prepare` 构建，需按提示在 profile 的 `pnpm-workspace.yaml` 里 allowBuild）：

```sh
dsh plugin --profile demo add github:superrabbit123/dsh-viper-recap
```

From a local checkout · 从本地检出安装：

```sh
dsh plugin --profile demo add ./dsh-viper-recap
```

From npm or a tarball · 从 npm 或 tarball 安装：

```sh
dsh plugin --profile demo add dsh-viper-recap                # npm
dsh plugin --profile demo add ./dsh-viper-recap-0.1.0.tgz    # tarball
```

Verify the layer, then boot · 先验证层，再启动：

```sh
dsh --profile demo --dump-config
dsh --profile demo web
```

## Usage · 使用

The tool is model-visible, so you can just ask · 工具对模型可见，直接说即可：

- `用 viper_recap 毒舌复盘一下这一局。` — roast this session
- `用 viper_recap 夸夸我这一局。` — toast this session

Or pass the `tone` argument explicitly · 或显式传 `tone` 参数：

| `tone` | Effect · 效果 |
|---|---|
| `roast` | 毒舌吐槽（默认）/ savage recap (default) |
| `toast` | 夸夸鼓励 / kind recap |

The recap text is computed locally from numbers already in the session; nothing you write leaves the machine. · 复盘文案由会话里已有的数字本地计算得出，不会外发任何内容。

### The 🐍 button · 🐍 按钮

A 🐍 button sits in the composer's right action group. Clicking it opens a floating card that reads the host-computed `viperRecap` projection and lets you toggle roast/toast, copy the text, and close. · composer 右侧操作区有一个 🐍 按钮；点击弹出浮动卡片，读取主机计算的 `viperRecap` 投影，可切换毒舌/夸夸、复制文案、关闭。

## What it reads · 它读什么

Folded from the session event log, all derived locally · 全部从会话事件日志折叠、本地计算：

- `turns` 轮数 — `turn/end` events
- `steps` 步数 — `step/end` events
- `toolCalls` 工具调用 — `tool/call` events
- `toolFailures` 失败 — `tool/result` events carrying `error`
- `outputTokens` 输出 token — `assistant/message.usage.outputTokens`
- `topTools` 最爱工具 — the most-called tool names

## Project structure · 结构

```
src/
├── index.ts       # host plugin: viper_recap tool + viperRecap projection
├── types.ts       # RecapStats / RecapState + the viperRecap projection key
├── stats.ts       # pure immutable fold (shared by tool and projection)
├── recap.ts       # pure render (roast/toast text)
├── projection.ts  # the viperRecap projection unit
└── client/        # browser half: 🐍 button + floating card
```

## Build · 构建

`pnpm run build` (and the `prepare` script run on git install) builds both halves with tsdown:

- host `lib/index.mjs` (+ `lib/index.d.mts`) — the tool and projection
- client `lib/client.js` — the `window.__ModuleLoader__.load` closure (built by `tsdown.client.ts`, a self-contained reproduction of the harness's client bundle)

No harness checkout is required: the build only needs `tsdown` + `lightningcss`, both ordinary npm dependencies. · `pnpm run build`（以及 git 安装时运行的 `prepare`）用 tsdown 同时构建两半：主机 `lib/index.mjs`、客户端 `lib/client.js`。构建是自包含的（`tsdown.client.ts` 复刻了 harness 的客户端打包），只需 `tsdown` + `lightningcss` 两个普通 npm 依赖，无需 harness 检出。

## Known limitations · 已知限制

- Recap prose is Chinese-only. · 复盘文案仅中文。
- Output is deterministic from the session figures; it does not call a model to write a fresher jab. · 输出由会话数字确定生成，不会调用模型写出更"新鲜"的吐槽。
- Save-as-image is not implemented yet; the card offers toggle, copy, and close. · 暂未实现"存图"；卡片当前提供切换、复制、关闭。

## License · 许可证

MIT
