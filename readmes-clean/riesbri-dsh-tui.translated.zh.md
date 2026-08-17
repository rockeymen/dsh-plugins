#dsh-tui

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的终端接口，作为进程内插件而不是客户端构建。

```
╭──────────────────────────────────────────────────────────────────╮
│ dsh-tui 0.1.0                                                    │
│ ~/code/my-project                                                │
│ deepseek-official / deepseek-v4-flash                            │
╰──────────────────────────────────────────────────────────────────╯

───────────────────────────────────────────────────────────────────
› Read the LICENSE file and name the license. Use the read tool.

⏺ read file_path=~/code/my-project/LICENSE
  ⎿ ~/code/my-project/LICENSE
    <type>file</type>
    1: MIT License
    … 21 more lines

● The LICENSE file is the MIT License.

╭─ my-project ─────────────────────────────────────────────────────╮
│ › ask anything                                                   │
╰──────────────────────────────────────────────────────────────────╯
  ● ready · deepseek-v4-flash · 14k/1.0M · /model · ctrl-d quit
```

提示、问题和模型选择器共享一个框架叠加层：

```
╭─ Indentation: Do you prefer tabs or spaces? ─────────────────────╮
│ ❯ Tabs                                                           │
│   Indent with tab characters.                                    │
│   Spaces                                                         │
╰──────────────────────────────────────────────────────────────────╯
  ↑↓ move · enter confirm · esc cancel
```

当回合运行时，状态行带有一个旋转器、经过的时间和从 `ctx.tokenMeter` 读取的上下文压力 — 变暗直到窗口的 70%，然后是黄色，然后是红色：

```
  ⠙ working 4s · deepseek-v4-flash · 13k/1.0M · ctrl-c interrupt
```

## 要求

- 节点`^22.19 || >=24`
- 已配置型号的工作 DeepSeek Harness 安装。如果 `dsh web` 启动并回答提示，则表示您已准备就绪。

## 安装

### 1.获取`dsh`命令

该插件由harness自己的CLI启动，因此您需要一种方法来运行它。要么有效：

```sh
npm install -g @deepseek-ai/dsh     # a global `dsh`
```

或者，从线束源签出中，使用其工作区脚本 - `pnpm dsh` 的行为与 `dsh` 的行为相同：

```sh
cd ~/path/to/deepseek-harness
pnpm dsh --version
```

下面的所有内容都写为`dsh`。如果这是您的设置，请替换 `pnpm dsh`（从安全带检查内部运行）。

### 2. 将捆绑包安装到配置文件中并启动

```sh
dsh plugin --profile tui add @riesbri/dsh-tui
dsh --profile tui
```

或者从结账中运行未发布的更改：

```sh
git clone https://github.com/riesbri/dsh-tui && cd dsh-tui
pnpm install && pnpm build
dsh plugin --profile tui add ./packages/tui
```

DSH **配置文件**是 `$DSH_HOME/profiles/<name>`（默认 `~/.dsh`）下的命名插件包堆栈。 `dsh plugin add` 在第一次使用时创建 `tui` 配置文件，将此捆绑包安装到其中，并将其附加到配置文件的捆绑包列表中 - 因此配置文件变为 `@deepseek-ai/dsh-base` 加上此前端。

相对包路径根据命令运行的目录进行解析。对于 `pnpm dsh`，该目录是线束签出目录，而不是这个目录，因此请传递一个绝对路径：

```sh
pnpm dsh plugin --profile tui add ~/path/to/dsh-tui/packages/tui
pnpm dsh --profile tui
```

无需启动即可确认所组成的内容：

```sh
dsh --profile tui --dump-config      # this bundle appears as a "# == @riesbri/dsh-tui" layer
```

要删除它，这会删除依赖项和层：

```sh
dsh plugin --profile tui remove @riesbri/dsh-tui
```

不支持直接从 git URL 安装：`dsh plugin add github:riesbri/dsh-tui` 将安装存储库根目录，这是一个工作区而不是捆绑包。使用 npm 名称或 `packages/tui` 的路径。

## 用法

### ·
- `dsh --profile tui` · 在当前目录中启动会话
- `dsh --profile tui -C ~/code/api` · 在不同的工作空间中开始
- `dsh --profile tui "run the tests"` · 提交第一个开放任务
- `dsh --profile tui --help` · 此前端的标志

在会话中：

### ·
- `enter` · 发送
- `alt-enter` · 换行不发送
- `/model` · 交换机型号 — 选择器列出已安装适配器通告的每条路由
- `/compact`、`/plan`、`/goal`、`/permission`、`/feedback` · 线束命令，通过 `ctx.commands` 发送
- `ctrl-c` · 中断运行转弯；没有任何运行，退出
- `ctrl-d` · 退出
- `ctrl-l` · 清除显示
- `↑` `↓` `enter` `esc` · 在叠加层内移动、确认和消除

编辑：`←` `→`、`home`/`end`、`ctrl-a`/`ctrl-e`、`backspace`/`delete`、`ctrl-u`/`ctrl-k`/`ctrl-w`。

粘贴多行块会将其整个插入并作为一条消息发送。带括号的粘贴使这种粘贴变得可靠——没有它，粘贴的换行符与按下的换行符无法区分。 `shift-enter` 未绑定，因为终端为其发送一个裸回车符，与 `enter` 相同； `alt-enter` 是可检测的手势。

会话被写入线束自己的会话存储中，因此记录在退出后仍然存在，并且可由线束的会话工具读取 - 但该前端尚无法重新打开记录。请参阅路线图。

前端需要标准输入和标准输出上的真实终端。通过管道或重定向，它以非零值退出并带有消息，而不是在没有接口的情况下闲置；使用 `--profile headless` 进行脚本运行。

## 为什么是这个

线束有四个终端前端。其中三个作为 Cordis 捆绑包在代理进程内运行，一个附加到正在运行的服务器，这决定了每个代理可以访问的内容。

### · 作为 · 渲染器 · 安装
- `@dsh-tui/dsh-tui` · **运行方式**：进程内捆绑包 · **渲染器**：`@earendil-works/pi-tui` · **安装**：来自 npm 的一个命令
- `@xmoon76/dsh-pi-tui` · **运行方式**：进程内捆绑包 · **渲染器**：供应商的 `pi-tui` 分支 · **安装**：来自 npm 的一个命令
- `dsh-tui`（无范围） · **运行方式**：通过 `ctx.remote` 的客户端 · **渲染器**：Ink + React · **安装**：一个命令，需要 `dsh web` 运行
- **`@riesbri/dsh-tui`**（此）· **运行方式**：进程内捆绑包· **渲染器**：自己的，无依赖项· **安装**：一个命令，来自 npm

每个描述都是该项目自己的。清楚地了解这个的立场：**`@dsh-tui/dsh-tui` 是四个中最具特色的** — 流式降价、具有三向折叠切换的跨所有三种渲染意图的工具卡、`@file` 和 `@session` 完成、`/resume`、待办事项面板以及具有真彩色检测的可配置主题。为了获得今天最完整的终端体验，请安装该终端。

选择这个存储库是因为两个结构属性而不是功能计数。

**它不添加第三方包。** 渲染器声明没有依赖项，也没有对等项。该捆绑包取决于渲染器，而对等依赖于线束包以及线束已附带的 `commander`，因此将其安装到配置文件中并没有什么新内容。其他三个带有渲染器的依赖树。在预发布的工具中，三分之一的已发布插件被报告不兼容，并且通过 SSH，这是值得的。

**它永远不会占用备用屏幕。** 完成的输出将进入终端自己的滚动缓冲区，并且仅重绘底部的一小部分区域，因此回滚、鼠标选择和复制的行为与任何其他命令完全相同，而不是在界面内重新实现。

**它也可以回答 `ask_user_question`** - 该接缝只接受每个上下文一个提供者，并且 Web 主机的 API 代理声明它，因此只有进程内的前端可以注册它。这与其他两个进程内捆绑包共享；相反，`ctx.remote` 上的客户端通过线路传送问题，而线束自己的 ACP 服务器故意不传送任何问题、工具或计划。

诚实的缺点：这是四个中最新的，并且功能最少。选择之前请阅读路线图和限制。

## 架构

两个包，分开，所以绘图的一半永远不会了解代理：

### 套装·拥有
- **包**：[`@riesbri/dsh-tui-renderer`](packages/renderer) · **拥有**：显示宽度、按键解码、输入缓冲区、方框图和屏幕。不从线束中导入任何内容，因此无需终端和模型即可进行测试。
- **包**：[`@riesbri/dsh-tui`](packages/tui) · **拥有**：捆绑包：会话循环、转录投影、交互接缝和插槽注册表。

**屏幕追加并重绘一个区域。** 聊天记录只会增长，因此渲染器不拥有全屏缓冲区。完成的输出被写入终端的滚动缓冲区并且不再被触及；只有底部的实时区域——流式回复、提示、作曲家——被重新绘制到位。因此，滚动位置永远不会被建模，也不会在调整大小时回流。使其正确的不变量是：活动区域是屏幕上的最后一个区域，因此每次写入都会经过 `Screen`。

**宽度遵循 Unicode East