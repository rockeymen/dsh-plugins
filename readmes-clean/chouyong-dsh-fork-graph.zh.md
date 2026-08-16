# dsh-fork-graph

[English](README.md) | 简体中文

**在会话标题栏里，用 Git 图看清这场对话的 fork 历史。**

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）Web 插件。在 DSH 里 fork 一个会话，你会得到一个继承父会话历史的子会话 —— 但侧边栏只用缩进给你一个扁平列表。本插件画出真正的分支拓扑：彩色轨道、分叉曲线、每个会话一行，点一下就跳过去。

  
  ![](assets/preview-light.svg)

  ![](assets/screenshot-trigger.png)
  ![](assets/screenshot-panel.png)

*上面的 SVG 由插件自己的布局代码生成（`scripts/render-preview.ts`）；两张 PNG 是真实运行中的 DSH Web 截图。*

## 为什么需要它

Agent 的工作不会保持线性。你在一个不错的检查点 fork 出去试一个有风险的思路，一个 subagent 跑去审一个文件，昨天的死路成了今天的起点。这么折腾一天，你手上有八个会话，却已经分不清谁是谁的孩子。

扁平列表告诉你**存在哪些会话**。图告诉你**谁从谁来的** —— 而当你在找"那个当时还能跑通的会话"时，你要的正是后者。

## 它做什么

- **画分支拓扑，不是缩进。** 每条分支独占一条彩色轨道，分叉用从父节点圆点引出的曲线表示。
- **每个会话一行**：标题，加上会改变你判断的那几个事实 —— `当前`、`运行中`、`子代理`、`分出 N 条`。
- **点击即跳转。** 点任意节点直接进入那个会话。
- **默认聚焦。** 只显示你当前所在会话的血缘家族，不是你历史上所有会话。
- **只在有用时出现。** 当前血缘没有 fork，这个控件根本不渲染。
- **中英双语**，跟随页面语言。

## 它刻意不做什么

- **不写任何东西。** 不写 session 事件、不发 RPC、不落盘、不注入 prompt 内容。它读宿主已经维护的会话列表然后画出来。把插件移除只会少一个按钮，别无影响。
- **不做第二个事实源。** 它直接渲染宿主自己的列表 store，绝不留一份可能和侧边栏漂移的副本。
- **不做 fork 操作入口。** DSH 的聊天视图本来就有 fork 动作，本插件只可视化结果，不重复造这个动词。

## 安装

需要 DSH、Node.js `^22.19.0 || >=24.0.0`、pnpm。

```sh
dsh plugin --profile web add github:chouyong/dsh-fork-graph
dsh web
```

从 git 安装会走源码构建，所以 pnpm ≥10 在你显式授权前会拒绝执行本包的 `prepare` 脚本。第一次 `add` 会打印确切的键名，把它写进该 profile 的 `pnpm-workspace.yaml`：

```yaml
allowBuilds:
  dsh-fork-graph: true
```

然后重新执行 `add`。如果你希望后续推送不影响本机实际运行的代码，就锁定 commit：`github:chouyong/dsh-fork-graph#<sha>`。

如果 git 安装已经进入 `prepare`，但因为 DSH 已发布包请求未发布的 `@deepseek-ai/dsh-compact` 而失败，请改用预构建 tarball：

```sh
cd path/to/dsh-fork-graph
npm install --ignore-scripts --legacy-peer-deps
npm run build
npm pack
dsh plugin --profile web add ./dsh-fork-graph-0.1.0.tgz
```

卸载：

```sh
dsh plugin --profile web remove dsh-fork-graph
```

## 工作原理

DSH 的 `SessionStore.fork(source, boundary)` 会用父会话事件日志的一段前缀给子会话做种，并把 `parentSession` 写进子会话的持久化 header。浏览器侧看到的就是会话列表里的 `SessionSummary.parentId`。也就是说 **fork 树本来就在数据里** —— 本插件是它的纯投影，自己不存任何东西。

布局遵循 Git 图惯例，有一处刻意的偏离：

- 一个节点是其父的**第一个**子时，继承父的轨道（主干延续）；其余每个子都**新开**一条轨道。
- **轨道永不复用。** 这换来一个比"图更窄"更值钱的保证：一条轨道只承载一条分支链，所以同一轨道上相邻的两个节点必定是父子，竖直段可以放心画成连续线条，绝不会暗示一段并不存在的关系。（复用是最先实现的版本。因为前序遍历让子树连续，被释放的轨道**总是**正好可供下一条分支使用 —— 结果每张图都被压成两条轨道，分支平行的视觉被完全抹掉。）
- 跨轨道的边先进入**子节点的**轨道，再下降。先在父轨道下降会让线条直接穿过父节点前面那些子节点 —— 它们正占着该轨道中间那些行。

插件向 `conversation.session.header.actions` 槽位贡献一个条目，且渲染所需的每个值都来自它自己的 inject 通道，因此除那一个槽位键之外，它不向 DSH 的全局类型面合并任何东西。

## 已知限制

直说，因为其中几条你大概率会在意：

- **已在真实运行的 DSH Web 中完成端到端验证。** 2026-08-16 使用 DSH `0.1.0-rc.5`、Web profile 中安装的本地构建 tarball、真实 Edge 浏览器、一个完成的父会话和两个完成的兄弟 fork 验证通过。插件响应 HTTP 200，console error、page error、失败请求均为 0；真实面板显示两条轨道、分叉曲线、三个节点和当前会话高亮。验证环境先按 README 要求构建了 DSH 源码；插件 git `prepare` 触达未发布的 `@deepseek-ai/dsh-compact` 依赖后改用预构建 tarball fallback，插件源码本身无需改动。
- **不显示 fork 发生在第几轮。** DSH 在持久化 header 里记了子会话继承了**多少个**事件（`seedLength`），但没有把它送到浏览器。所以图能告诉你 B 从 A fork 出来，还不能告诉你那是在 A 的第 7 轮。
- **语言跟随文档，而非 DSH 的 locale 服务。** `@deepseek-ai/dsh-client-locale` 目前无法从 npm 安装（见下），所以文案是自包含的，读 `<html lang>` / `navigator.language`。切换语言会在下一次渲染生效。
- **空白叶子会话被隐藏**（侧边栏也隐藏它们），但你当前所在的那个例外。有子节点的空白会话会保留 —— 丢掉它会让真实分支变成孤儿。被隐藏的数量会在面板里显示出来，而不是静默丢弃。
- **三个 DSH 包无法从 npm 安装。** `dsh-client-runtime`、`dsh-client-locale`、`dsh-client-ui-conversation` 都直接或间接依赖 `@deepseek-ai/dsh-compact`，而该包未发布（registry 404）。因此本插件在 [`src/client/contract.ts`](src/client/contract.ts) 里声明了它所读取的那一小片类型面，逐个文件对照已发布的 `0.0.1-rc.1` 声明。等那些包可安装了，这个文件应该收缩成几行 import。
- **血缘很宽时需要滚动。** 轨道不复用，所以一个 fork 了二十次的会话就是二十条轨道宽。面板可滚动，但不做压缩。

## 相关项目

另有两个插件也做会话血缘可视化。它们都渲染缩进树、都占用 `conversation.view`（一整个标签页），所以是用另一种形态解决重叠的问题 —— 而本插件住在标题栏动作槽位，因此**可以和它们任意一个同时安装**：

- [`Nirvana-Jie/dsh-session-tree`](https://github.com/Nirvana-Jie/dsh-session-tree) —— ARIA 树视图，带键盘导航、fork 动作和详情面板。如果你想要一个专门的标签页，它功能更全。
- [`ZhengQingJing/dsh-session-tree`](https://github.com/ZhengQingJing/dsh-session-tree) —— 缩进列表 + ASCII 分支标记。

本项目的不同之处：Git 图轨道本身（轨道、曲线、提交圆点），以及内联在会话标题栏而不占用标签页。

## 开发

```sh
npm install --ignore-scripts --legacy-peer-deps   # 两个 flag 都是必需的，原因见下
npm run build        # tsc 出 d.ts + tsdown 出两个 bundle
npm test             # 64 个测试
npm run typecheck
node scripts/render-preview.ts   # 重新生成 README 预览图
```

`--legacy-peer-deps` 是必需的，因为若干 DSH 包声明了未发布的 peer 依赖；`--ignore-scripts` 用于跳过开发安装时的 `prepare` 构建。

工程笔记（尤其是那些**不会主动报错**的失败模式）见 [AGENTS.md](AGENTS.md)。

## 许可

[MIT](LICENSE)