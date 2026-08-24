#dsh-generative-ui

[![pkg.pr.new](https://pkg.pr.new/badge/CNSeniorious000/dsh-generative-ui)](https://pkg.pr.new/~/CNSeniorious000/dsh-generative-ui)

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的生成 UI：代理使用实时 React 界面而不是散文进行回答。它流式传输——组件在模型仍在输入时进行渲染。

它出现在两个地方：

- **内联** — 围栏 ```` ```ui4a/tsx ```` block renders in place, between the paragraphs of the reply. Right for a chart, a form, a set of options to click, a calculation the reader will want to change a number in.
- **Canvas** — a file at `ui4a/canvases/.ui4a.tsx` opens in a panel beside the conversation and stays there across turns. Right for a tool the user will come back to.

Generated code imports anything on npm (resolved from esm.sh at render time), shares the host's single React instance, and takes its colours from the app's own design tokens, so it follows the light/dark theme.

The `ui4a` in that fence is the harness this implements — **UI for Agent**, from Mind Lab: rather than coaxing an agent into a fixed UI schema, let it write ordinary frontend code and have the runtime enforce the boundaries. The reasoning, and the benchmarks behind it, are in [UI4A: A Component-Native Harness for Generative UI](https://macaron.im/mindlab/research/ui4a-a-component-native-harness-for-generative-ui). This package is that harness wired into dsh's web client.

## Install

```sh
dsh插件--配置文件web添加dsh-generative-ui
```

`dsh plugin` forwards to the profile's package manager, so that installs the package. Mounting it also takes one line in `~/.dsh/profiles/web/package.json` — the profile's bundle list is what dsh actually boots:

```json
{
  “dsh”：{
    “个人资料”：{
      “捆绑”：[
        “@deepseek-ai/dsh-base”，
        “@deepseek-ai/dsh-web-app”，
        “dsh-generative-ui”
      ]
    }
  }
}
脚本中的“`

Then restart `dsh web` — plugins are mounted at boot, and there is no hot-reload for adding one.

## How it works

The package is one plugin with two halves, which is how dsh plugins reach the browser:

###  ·
- `lib/index.js` (node) · injects the system-prompt section, registers the `generative-ui` skill, serves the compiler wasm and canvas file reads over its own `webServer` routes
- `lib/client.js` (web) · claims `ui4a/tsx”代码块，在浏览器中编译 TSX，安装画布面板

该模型分为两层，按每层成本划分：

- **`src/prompt.ts`** 出现在每个请求中，因此它仅携带触发器、栅栏语法、画布路径和颜色标记。
- **`src/skill.ts`** 通过 `ctx.skills.register()` 注册，并且仅在模型到达时加载。它承载着判断：答案是否需要一个界面，内联还是画布，如何构建和布局。

这种划分是经过测量的，而不是假设的 — 请参阅 [CLAUDE.md](./CLAUDE.md) §4.5，了解其背后的 40 条提示评估。

## 发展

```sh
bun install
bun run check     # lint + typecheck + build + smoke
```

`bun run build` 将两半与 `Bun.build` 捆绑在一起。 [CLAUDE.md](./CLAUDE.md) 是设计文档 - 它记录了该插件构建所针对的主机约束，所有这些约束都很难找到。