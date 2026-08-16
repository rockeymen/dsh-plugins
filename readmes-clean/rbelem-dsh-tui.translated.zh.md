#dsh-tui

[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 Rust 终端客户端
网关 (`dsh`) — 与其 Web UI 同等的终端表面。它附有
通过 `DSH_PORT` 到 **正在运行的** 网关，并通过有线协议驱动它
（RPC + 主机框架）：浏览工作区和会话，与代理聊天，
取消或重试回合、重命名/分叉/存档会话、创建会话以及
切换主题或 UI 区域设置。它是一个纯粹的客户端——它从不启动任何东西。

版本0.1.0。 ~36 次提交，293 次测试。

## 安装

### npm（入门包 + 平台预构建）

已发布的包：

### 包装·内容
- **包**：`@rbelem/dsh-tui` · **内容**：入门包：cordis 补丁层 + 运行时粘合插件，可使用 `DSH_PORT` 生成 TUI
- **软件包**：`@rbelem/dsh-tui-linux-x64` / `-linux-arm64` · **内容**：针对 linux x64 / arm64 的预构建二进制文件
- **软件包**：`@rbelem/dsh-tui-darwin-x64` / `-darwin-arm64` · **内容**：适用于 macOS x64 / arm64 的预构建二进制文件

该捆绑包将四个平台包固定为精确版本
`optionalDependencies`； npm 通过 `os`/`cpu` 字段选择匹配的。
通过harness插件机制安装：

```sh
dsh plugin --profile tui add @rbelem/dsh-tui
```

引导（网关 + TUI）或仅附加：

```sh
dsh --profile tui              # boots the gateway (OS-assigned port) and spawns the TUI
dsh --profile tui --port 8080  # fixed port
dsh --profile tui --no-spawn   # gateway only; attach later with the binary + DSH_PORT
dsh-tui --port           # attach to any running gateway
```

有关完整捆绑合同，请参阅 `bundle/README.md`。

### 来自来源

先决条件：Rust 工具链 (`rustup`) 和 [devbox](https://www.jetify.com/devbox)
（`devbox.json` 引脚 `rustup@latest`）。

```sh
git clone <repo> dsh-tui
cd dsh-tui
devbox run -- cargo build --release
# binary at target/release/dsh-tui
```

### 先决条件：正在运行的网关

`dsh-tui` 连接到来自 deepseek-harness 存储库的 `dsh web` 网关。
网关启动**无需提供程序密钥**（浏览/附加/列出所有工作）；
提交提示需要在环境中配置提供程序 -
如果没有，运行就会失败，用户界面中会出现转向错误（不会崩溃）。

```sh
# terminal 1: the gateway
dsh web --port 8765

# terminal 2: the TUI
DSH_PORT=8765 ./target/release/dsh-tui
```

## 用法

如果没有会话，英雄屏幕会邀请新会话。一旦连接后，
布局是：

- **侧边栏** — 工作区组，未分组的会话组
  工作区声明，以及底部折叠的 `archived (N)` 标头
  （在 v1 中，存档会话被排除在导航之外）。
- **聊天面板** — 活动会话的历史记录：用户消息、助手
  响应（Markdown、推理、终端支持的图像），
  工具活动、批准和队列项目。
- **Composer** — 底部提示输入； `Enter` 提交，`Shift+Enter`
  插入换行符，`/` 和 `@` 打开命令/技能完成弹出窗口。

TUI 附加到最近更新的非空白会话和流
多路复用器下行链路上的新事件。

## 键盘映射

### 键·动作
- **按键**：`j`/`k`、`↑`/`↓` · **操作**：滚动聊天/移动侧边栏选择/移动选择器选择
- **按键**：`g`/`Home`、`G`/`End` · **操作**：跳转到聊天顶部/底部
- **按键**：`Ctrl+d` / `Ctrl+u` · **操作**：滚动半页（聊天）
- **按键**：`Ctrl+d` · **操作**：退出作曲家（EOF）
- **按键**：`Enter` · **操作**：提交作曲家；切换到选定的侧边栏会话；应用选择器选择
- **按键**：`Tab` · **操作**：循环焦点：聊天→作曲家→侧边栏
- **按键**：`Ctrl+w`，然后 `h`/`j`/`k`/`l` · **操作**：在窗格之间移动焦点（侧边栏/聊天/编辑器）
- **按键**：`Esc` · **操作**：返回聊天（关闭弹出窗口、选择器、编辑器）
- **按键**：`n` · **操作**：新会话选择器（聊天或侧边栏焦点；`j`/`k` 移动，`Enter` 创建）
- **按键**：`r` · **操作**：重命名选定的侧边栏会话（内联编辑器：类型、`Enter` 提交、`Esc` 取消）
- **按键**：`f` · **操作**：分叉选定的侧边栏会话
- **按键**：`a` · **操作**：存档选定的侧边栏会话
- **按键**：`v` · **操作**：聊天中手臂鼠标选择模式（`v select · esc cancel`；拖动选择，松开复制）
- **按键**：`i` · **操作**：在会话图像上打开图像查看器（聊天焦点）
- **按键**：`s` · **操作**：切换窄终端会话抽屉（80 列以下）
- **按键**：`q` · **操作**：退出（聊天或侧边栏焦点）
- **按键**：`Ctrl+p` · **操作**：启动器：对命令、缓存技能和设置操作进行模糊搜索
- **按键**：`Ctrl+t` · **操作**：主题选择器（`j`/`k` 移动，`Enter` 应用，`Esc` 关闭）
- **按键**：`Ctrl+,` · **操作**：设置视图（注意：无法从原始终端字节流访问 - crossterm 将 `0x0c` 映射到 `Ctrl+l`；使用启动器的“打开设置”操作）
- **按键**：`Ctrl+l` · **操作**：循环 UI 语言环境 (en ↔ zh)，保留
- **按键**：`Ctrl+c` · **操作**：取消正在运行的转弯；空闲时退出
- **按键**：`Ctrl+q` · **操作**：退出
- **按键**：`Alt+q` · **操作**：队列弹出：`j`/`k` 滚动、`x` 删除、`s` 转向、`e` 编辑、`Esc` 关闭
- **按键**：`Shift+Enter` · **操作**：在作曲家中插入换行符（请参阅下面的作曲家注释）

作曲家编辑：箭头 / `Home` / `End` 移动插入符号，`Backspace` /
`Delete` 编辑，`Esc` 返回聊天。 `Shift+Enter` 插入换行符
（网络奇偶校验；需要 CSI-u / kitty-keyboard-protocol 终端 —
kitty、WezTerm、Alacritty ≥0.13、foot、Ghostty、Windows Terminal ≥1.19。
在传统终端上，Shift+Enter 以普通 `Enter` 形式到达并提交
相反 - 优雅降级，没有任何破坏）。

## 鼠标

鼠标捕获已打开（单击以选择会话，滚轮每滚动 3 行
勾选，状态指示器）。聊天中，`v`兵种选择方式：

- `v`，然后拖动：选择文本；发布将其复制到剪贴板
  (OSC 52)并退出该模式； `Esc` 取消。状态行显示
  `copied · N chars` 闪烁成功。
- 双击一个单词：选择该单词（CJK 保持完整）；拖拽
  after 扩展了单词的选择。
- 选择时滚轮滚动视口 — 选择保持不变
  锚定到下面的文本。
- 单击 `▸ N skills` 标题行可展开或折叠折叠的内容
  该消息中的技能列表（单击标题永远不会开始选择）。

聊天的边距（2/2 填充）锚定在夹紧边缘，因此
拖动总是有一个起点。低于80列，`s`开启会话
抽屉（完整标题；`Esc`/点击外部关闭）； `≡` 的可供性
聊天的左上角可以切换它。

**终端逃生舱口**：当鼠标捕获处于活动状态时，按住 `Shift`
拖动或转动绕过应用程序的捕获 - 终端的
自己的选择和滚动接管（标准 `xterm`/kitty 行为；
该应用程序永远不会看到这些事件）。当你想要终端的时候使用它
本机副本而不是 dsh-tui 的。

## 配置

- **设置视图** — 从启动器打开（Ctrl+P →“打开设置”）。
  由网关的`settings.describe`/`settings.update`驱动；现场
  网关公开命名空间，包括 `ui-theme`、`locale`、
  `ui-conversation` 和 `ui-onboarding`，呈现为架构驱动的表单。
- **主题** — 15 个捆绑主题（catppuccin ×4、神奈川、tokyonight ×3、
  gruvbox、dracula、solarized、nord、rose-pine、everforest、one-dark）；
  Ctrl+T 打开选取器，`Enter` 应用并保留。用户主题加载
  来自`~/.config/dsh-tui/themes/*.toml`。由于没有明确的主题，
  默认遵循检测到的终端/系统方案 - catppuccin frappe
  （深色）/catppuccin latte（浅色）在真彩色终端上，回退
  终端跟随中性外观（当 `COLORTERM` 为真彩色）
  设置，否则 256 色）当检测失败时。
- **区域设置** — zh/en，键控字符串表； Ctrl+L 循环并持续；
  处理 CJK 宽度。
- **配置文件** — `~/.config/dsh-tui/`（与主机配置隔离）
  通过 `XDG_CONFIG_HOME` 进行测试）。 `[keymap]` 部分通过以下方式重新绑定快捷方式
  操作名称（请参阅上表了解默认值）；关键规格如下
  `"ctrl+q"`、`"shift+enter"`、`"alt+q"`、`"g"`。不存在或无法解析
  规范回退到内置默认值；该配置在启动时应用。

## 发展

工具链：devbox（`devbox.json` — `rustup@latest`）。

```sh
devbox run -- cargo test        # 293 tests
devbox run -- cargo check --all-targets
devbox run -- cargo clippy --all-targets -- -D warnings
devbox run -- cargo fmt --check
```

### 实时网关冒烟测试

`tests/live_smoke.rs` 在 PTY 中针对 REAL `dsh web` 运行真实的二进制文件
测试自行启动的网关（隔离 `DSH_HOME`、端口 18765 或
自由端口）并在拆卸时杀死。由环境变量控制，因此默认套件
无需外部基础设施即可保持绿色：

```sh
DSH_LIVE_SMOKE=1 devbox run -- cargo test --test live_smoke -- --nocapture --test-threads=1
```

烟雾是提供者自适应的：它探测 `session.models.routa