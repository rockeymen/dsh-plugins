#dsh-pi-tui

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) 的第三方 TUI 模式，构建在 [pi-tui](https://github.com/MoonshotAI/kimi-code/tree/main/packages/pi-tui) 的供应商分支上。

针对终端 UI 而不是浏览器 GUI (`dsh --profile web`) 或一次性模式 (`dsh --profile headless`) 运行 `dsh --profile pi-tui`。

> **状态：工作。** TUI 涵盖主会话循环 — 输入 → 会话事件，
> 批准、命令、会话切换和全文搜索——加上预设、技能、
> 模型/设置菜单和斜线命令。渲染和输入路由经过验证
> 通过无头测试 (`@xterm/headless`)，无需 TTY 或模型连接。

## 截图

![dsh-pi-tui 在终端中运行](https://raw.githubusercontent.com/XMoon/dsh-pi-tui/main/docs/dsh-pi-tui.png)

## 布局

```
packages/pi-tui/    Vendored @moonshot-ai/pi-tui fork (kimi-code commit b6144f9, v0.84.2),
                    rescoped to @xmoon76/pi-tui. The five local fixes from the fork
                    (CJK wrap guard, width clamps, overwide truncation, negative-width
                    guards, per-frame processed-line reuse) are preserved; native/
                    prebuilds are deliberately not vendored (graceful fallback).
packages/dsh-pi-tui/   The dsh bundle: @xmoon76/dsh-pi-tui (the only published
                    package). cordis.patch.yml inserts the startup row
                    (dsh --profile pi-tui flags) and the runner row (TUI glue).
                    tsdown bundles the pi-tui fork into dist/, so the tarball
                    is self-contained.
```

## 先决条件

- 具有配置文件支持的 DeepSeek Harness 安装（`PATH` 上的 `dsh`）。
- 节点 >= 22.19（`^22.19.0 || >=24`，与 dsh 范围相同）。从源代码运行
  需要具有原生 TypeScript 支持 (>= 23.6) 或 tsx ESM 挂钩的 Node
  （`node --import tsx/esm`，dsh自己的源码发布如何工作）。
- [pnpm](https://pnpm.io) 仅当从源安装时。

## 安装

`dsh plugin` 在目标配置文件的目录中运行 pnpm，因此通常
pnpm 动词（`add`、`remove`、`update`、`list`）都有效。

### 选项 A — 来自 npm 注册表（推荐）

发布的软件包是独立的：捆绑了供应商的 pi-tui 分支
进入其构建输出，因此 `@xmoon76/dsh-pi-tui` 是您安装的唯一包
（`@xmoon76/pi-tui` 在这个仓库中保持私有，就像 kimi-code 一样
`@moonshot-ai/pi-tui`私人）：

```sh
# install the bundle into the pi-tui profile (creates the profile if needed)
dsh plugin --profile pi-tui -- add @xmoon76/dsh-pi-tui

# run it
dsh --profile pi-tui
```

清单声明 `dsh.bundle` 的任何依赖项都会加入配置文件的层
自动堆叠 — 无需手动 `cordis.patch.yml` 接线。

### 选项 B — 来自源代码

构建工件未提交（两个包的 `dist/` 都被 gitignored 并且
包 `exports` 指向构建的文件），因此在安装之前构建
来自克隆：

```sh
git clone https://github.com/XMoon/dsh-pi-tui
cd dsh-pi-tui
pnpm install
pnpm build        # pi-tui tsdown (dist/) + dsh-pi-tui tsdown (dist/, bundles pi-tui)
dsh plugin --profile pi-tui -- add @xmoon76/dsh-pi-tui@file:$PWD/packages/dsh-pi-tui
```

### 验证安装

```sh
dsh plugin --profile pi-tui -- list          # @xmoon76/dsh-pi-tui present
dsh --profile pi-tui                         # TUI starts instead of the web GUI
```

### 更新/卸载

```sh
# registry installs:
dsh plugin --profile pi-tui -- update @xmoon76/dsh-pi-tui
# or rebuild + re-add for file: installs:
pnpm build && dsh plugin --profile pi-tui -- add @xmoon76/dsh-pi-tui@file:$PWD/packages/dsh-pi-tui

dsh plugin --profile pi-tui -- remove @xmoon76/dsh-pi-tui
```

## 发展

```sh
pnpm install
pnpm build        # pi-tui tsdown (dist/) + tui-app tsc (lib/)
pnpm test         # pi-tui's own suite (node --test) + tui-app headless tests
pnpm typecheck
```

测试通过 `@xterm/headless` 驱动 UI（参见 `packages/dsh-pi-tui/test/virtual-terminal.ts`），
因此，无需 TTY 或模型连接即可验证渲染和输入路由。

## 斜线命令（选择）

- `/sessions [query]` — 打开会话选择器：输入时搜索
  会话 ID、标题和工作区、按工作区分组的行和实时
  `filtered/total` 计数，标题按原样在后台加载
  阅读。 Enter 切换到选定的会话。
- `/search <query>` — 对持久会话日志进行全文搜索，然后
  切换到热门。
- `/title [title]` — 显示或设置当前会话的标题（标题出现
  在 `/sessions` 选择器中）。
- `/yolo` — 切换到 `danger-full-access`（`/permission danger-full-access` 的别名）。
- `/queue` — 每个项目队列管理：编辑、删除、引导一个或插入一个
  消息发送到代理的收件箱（编辑器上方的队列窗格显示
  待处理的消息； `Ctrl+S` 同时引导它们，`Alt+↑` 拉动它们
  返回编辑器）。
- `/preset`、`/model`、`/settings`、`/export`、`/fork`、`/subagents` — 参见
  `dsh --profile pi-tui` 的命令自动完成（`/` + Tab）。

## 按键绑定（选择）

- `Shift+Tab` — 循环预设权限（只读 → 工作空间写入 →
  危险-完全访问）；页脚的模式槽标记每个预设
  （`[workspace-write]` / `[read-only]` / `[custom]`，带有 `[yolo]` 标记
  不批准模式）。
- `Ctrl+S` — 引导：使用排队消息，发送整个队列（加上
  吃水，如果有的话）立即进入运行转弯；否则发送草稿
  独自一人。闲置的特工开始对一切进行新的转变。
- `Alt+↑` — 出队：将每条排队的消息拉回到编辑器草稿中。
- `Ctrl+T` — 切换完整的待办事项列表；编辑器上方的底座始终显示
  目标、待办事项摘要、后台任务和排队输入。

## 会话生命周期

打开没有 `--session` 的 TUI 会创建**根本没有会话**：第一个
用户消息（文本、斜杠命令、`Ctrl+S` 转向或 `!!` shell）启动它
懒洋洋地。 `--session `仍然立即恢复，并且本地`!`命令
无需会话即可运行。

## 在 P0 峰值中验证

- 供应商的 pi-tui：在 Node 26 (`node --test`) 下通过了 960/960 测试。
- `TuiApp` 在无头 xterm 上渲染、接受编辑器输入并处理 Ctrl+C。
- 整个进口链（pi-tui、tui-app、`@deepseek-ai/dsh-cmdline`、指挥官）
  在 tsx ESM 挂钩下加载 - dsh 源启动合约。
- 本机修饰键插件是可选的：在 Linux 上，加载程序返回 `undefined`
  无需尝试加载，并且非 TTY 标准输入路径受到保护。