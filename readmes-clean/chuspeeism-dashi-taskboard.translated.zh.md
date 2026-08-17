# 法典任务板

在浏览器中运行的本地优先发行板，可以通过独立的 CDP 启动器或其注入脚本嵌入到 Codex 中。相同的 HTTP API 为捆绑的 Codex Skill 使用的 React UI 和 `taskctl` CLI 提供支持。

![Codex Taskboard 产品截图](docs/assets/codex-taskboard.png)

## 要求

- Node.js 22.5 或更高版本
- macOS 应用程序和 DMG 构建：Xcode 命令行工具和 Rust 1.88 或更高版本以及 `aarch64-apple-darwin` 和 `x86_64-apple-darwin` 目标。 `npm install` 安装该项目使用的 Tauri CLI。
- Windows NSIS 构建：Microsoft Store Codex 应用程序、Rust 1.88 或更高版本，以及带有 C++ 工作负载和 Windows SDK 的 Visual Studio 构建工具。

## 本地运行

```bash
npm install
npm run build
npm start
```

打开<http://127.0.0.1:47823>. SQLite数据库存储在`.data/taskboard.sqlite`。

对于实时前端重新加载的开发：

```bash
npm run dev
```

Vite UI 在 <http://127.0.0.1:5173> 上运行，并将 API 请求代理到本地服务。

## 使用 CLI

从项目中运行它：

```bash
npm run taskctl -- project create \
  --id my-project \
  --name "My project" \
  --workspace-path /absolute/path/to/repository

npm run taskctl -- issue create \
  --project my-project \
  --title "Implement the next slice" \
  --status todo \
  --priority high \
  --labels product,mvp
```

如果您希望在 shell 路径上使用 `taskctl`，请使用 `npm link`。设置 `CODEX_TASKBOARD_URL` 将 CLI 指向另一个本地或 LAN 服务。云部署通过 **环回伴侣**（用于身份验证和路径映射的设备本地环回服务，而不是聊天角色）与 `taskctl cloud login` 进行配置。

## 安装 Codex 技能

将 `skills/manage-taskboard` 复制或符号链接到 Codex 技能目录中，然后启动新的 Codex 任务：

```bash
ln -s /absolute/path/to/codex-taskboard/skills/manage-taskboard \
  ~/.codex/skills/manage-taskboard
```

该技能教会 Codex 检查问题，将其移至 `in_progress`，使用乐观版本，验证工作，然后将其移至 `in_review`；仅在用户明确确认接受或要求将其标记为完成后，才会将问题转移到 `done`。

## 嵌入 Codex

### 手动：使用专用 CDP 端口

保持现有 Codex 窗口打开。从 Taskboard 存储库中，使用专用 CDP 端口启动第二个 Codex 实例：

```bash
open -n -a /Applications/ChatGPT.app --args \
  --remote-debugging-port=9231 \
  --remote-allow-origins=http://127.0.0.1:9231
```

新的 Codex 窗口出现后，在另一个终端中运行注入器：

```bash
CODEX_TASKBOARD_HOST=127.0.0.1 \
npm run codex:inject -- --port 9231 --open
```

使用嵌入式面板时保持喷油器终端运行。原始 Codex 窗口保持不变，新窗口接收任务板侧边栏条目。如果端口 `9231` 被占用，则在这两个命令中使用另一个端口。

### 推荐：使用一个命令启动一个独立的任务板窗口

保持现有 Codex 窗口打开并运行：

```bash
CODEX_TASKBOARD_HOST=127.0.0.1 npm run codex
```

这会在需要时启动本地任务板服务，启动具有独立配置文件和仅环回端口 `9231` 的官方 macOS Codex 应用程序，等待主渲染器和侧边栏，在插件后注入看起来像本机的任务板条目，并持续监视服务和替换渲染器。现有法典窗口保持不变。使用嵌入式面板时保持此命令运行。启动器不会修改 `ChatGPT.app` 或其 `app.asar`。

源启动器将其经过身份验证的端点写入 `.data/launcher-runtime.json`。随 `npm link` 安装的 `taskctl` 命令默认读取此文件，因此普通 shell 和从面板打开的 Codex 任务使用相同的任务板服务，无需额外的环境变量。

### macOS 应用程序：无需终端即可打开并注入

对于 Tauri 开发，请运行：

```bash
npm run app:dev
```

要构建本地 App 和 DMG，请安装两个 Rust 目标一次，然后运行构建：

```bash
rustup target add aarch64-apple-darwin x86_64-apple-darwin
npm run app:build
```

从 Finder 打开 `src-tauri/target/universal-apple-darwin/release/bundle/macos/Codex Taskboard.app`。 DMG 位于 `src-tauri/target/universal-apple-darwin/release/bundle/dmg/`。如果您只想要稳定的应用程序，请从[GitHub Releases](https://github.com/chuspeeism/dashi-taskboard/releases/latest)]下载当前的DMG。

该应用程序包含自己的 Node 运行时、任务板服务、构建的 Web UI、技能、CLI 包装器和注入脚本。它启动服务，启动官方 Codex 应用程序，等待渲染器，注入侧边栏条目，然后打开面板而不显示终端窗口。该应用程序可以从此结账处复制；目标 Mac 仅需要官方 Codex 应用程序，不需要此存储库、系统 Node 安装或单独的 Codex CLI 安装。任务板数据存储在`~/Library/Application Support/Codex Taskboard`中，启动器输出写入`~/Library/Logs/Codex Taskboard/codex-taskboard-launcher.log`中。

### Windows 代码签名

对于应用程序获得批准后的官方 Windows 版本： **[SignPath.io](https://signpath.io/) 提供的免费代码签名，[SignPath Foundation](https://signpath.org/) 提供的证书]。** 当前的 Windows CI 工件在获得批准之前保持未签名状态。请参阅[代码签名政策](docs/code-signing-policy.md)、[隐私政策](PRIVACY.md)]和[Windows卸载说明](docs/windows-uninstall.md)。

本地构建使用临时代码签名进行直接验证。公共 macOS 下载仍然需要开发者 ID 签名和 Apple 公证。

### Windows 应用程序：托盘启动器和捆绑的任务板

从 Microsoft Store 安装官方 Codex 应用程序。要在 Windows x64 上构建当前用户 NSIS 安装程序，请运行：

```powershell
npm ci
npm run app:build:windows
```

安装程序写入`src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/`。它安装托盘启动器、捆绑的 Node 运行时、本地服务、构建的 Web UI、技能、`taskctl.cmd` 和注入脚本。任务板数据存储在`%APPDATA%\Codex Taskboard`中；日志存储在`%LOCALAPPDATA%\Codex Taskboard\Logs`中；该技能被复制到`%USERPROFILE%\.agents\skills\manage-taskboard`。

Windows CI 工件故意未签名并且不会自动更新。在分发构建之前查看[代码签名策略](docs/code-signing-policy.md)。请参阅 [Windows uninstall](docs/windows-uninstall.md) 了解保留数据行为。

Codex 26.715.52143 附带了一个渲染器 CSP，可以阻止任意 HTTP iframe。因此，启动器启用 CDP CSP 旁路，重新加载该渲染器一次，安装文档启动脚本，然后等待任务板 OOPIF 实际加载。 CDP 未对同一计算机上的其他进程进行身份验证，因此仅在启动器处于活动状态时运行受信任的本地代码。

要通过另一种方法注入已通过 CDP 启动的 Codex 实例，请运行：

```bash
npm run codex:inject -- --port 9229 --open
```

此命令也保持驻留，因此注入的选项卡可以在服务退出后重新启动任务板。用 `Ctrl-C` 阻止它。

该脚本将一个任务板条目添加到 Codex 侧边栏，并在 Codex 的完整主工作区中呈现 iframe，包括上下文标题栏区域，以便任务板自己的标题不会留下空条。该完整的矩形标题放置在 Electron 的可拖动层上方，并标记为 `no-drag`；由于任务板处于活动状态时，本机上下文操作会受到抑制，因此其自身的操作会使用正常的边缘填充，而不会产生人为的右侧间隙。本机侧边栏保持安装状态，而上一页选择和上下文标题暂时被抑制；选择另一个 Codex 页面可以恢复它们。

“在对话中打开”选择相应的本机 Codex 项目（当有可用时），并使用 `e-taskboard` 指令和问题的实际标识符打开未发送的本机 Composer。安装的技能是从该指令中隐式选择的，因此编写者不会添加 `$manage-taskboard` 提及。对话仅在实际处理问题后才进行归因：`taskctl` 读取 Codex 的 `CODEX_THREAD_ID` 并记录问题或评论突变的 ID。记录的 ID 可通过 Codex 的本地路由桥点击。每个问题可以绑定一个 Git 分支或一个工作树；这些选项是从所选 Codex 项目的存储库中扫描的，而不是手动输入的。集成使用 Codex 现有的项目、作曲家和路线标记；它不会修补 React、替换 `fetch`、加载私有块或编辑 Codex 数据文件。

要使用不同的 UI 源，请在用户脚本运行之前设置 `window.__CODEX_TASKBOARD_URL__`。

## 配置

### 变量·默认·目的
- **变量**：`CODEX_TASKBOARD_HOST` · **默认**：`0.0.0.0` · **用途**：HTTP 绑定地址；使用`127.0.0.1`禁用LAN访问
- **变量**：