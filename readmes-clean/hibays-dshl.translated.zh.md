# DSHL — DeepSeek Harness 启动器

  简体中文 | [English](./README_en.md)

![_](docs/screenshot_1.webp)

DSHL 是一个轻量的原生启动器（Rust），以 [webui.me](https://webui.me) 作为启动 UI 包装，
在浏览器里启动 **DeepSeek Harness WebUI**（`dsh web`）。它会检查运行环境，必要时安装
`@deepseek-ai/dsh`，在临时端口启动它，并把浏览器路由过去。所有行为都通过 **`dshl.toml`**
配置；启动流程运行在 **tokio 多线程运行时**上（`src/runtime.rs` 的薄封装：`block_on` /
`spawn`），真异步处理子进程 I/O、定时器与保活 WebSocket。

## 双轨分发（同一套 Rust 内核）

内核是 workspace 根包 **`dshl-core`**（`src/`），两条分发轨只差入口：

- **Track A 安装器轨** — 平台原生可执行文件 `dshl`（`crates/dshl`，入口
  `main.rs → dshl_cli::run_cli()`）。
- **Track B 插件轨** — 同一内核编译成 napi-rs cdylib（`crates/dshl-native`，
  `#[napi] launch(...) → dshl_cli::run_with_options(...)`），以 `.node` 原生插件随
  [Cordis](https://cordis.js.org) 插件装进 dsh，经 FFI 在 dsh/Node 进程内运行；
  对外发布为 npm 包 `@dshl/native`（聚合六个平台子包）、`@dshl/pipe` 与
  `@dshl/control`（见下文「插件轨」）。

两个轨道共用 **`crates/dshl-cli`** 这个共享入口层（`RunOptions` / `RunOutcome` /
`RunHandle`）：Track A 解析命令行后走同一管线，Track B 跳过 CLI 解析直接以结构体
传入，并在受管后台线程上驱动管线以保证 Node 事件循环存活。

## 亮点

- **Rust 编写 · 单文件便携（Track A）** — 编译为**一个平台可执行文件**：无安装器、
  无捆绑运行时、无 GUI 框架。拷到哪都能跑（U 盘也行），`dshl.toml` 放在可执行文件旁
  （或平台配置目录）即可随身携带配置。
- **仅浏览器模式** — 启动器自己的界面不依赖任何桌面框架：启动页由内嵌的本地
  web 服务器（webui.me）提供，用系统浏览器或内嵌 WebView 作为显示端；机器上唯一的
  硬依赖是 Node.js（而 dsh 本身就需要它）。
- **五个明确的启动流程**（`src/flow/`，与启动页步骤一一对应）：
  1. `system` — 检查系统环境与架构
  2. `runtime_env` — 检查运行时（node/bun，带回退链）
  3. `mirror_check` — 国内镜像决策（`auto-mirror`）
  4. `prepare` — 准备 dsh（global/hybrid/private 模式，构建启动命令）
  5. `launch` — 启动 `dsh web` 并捕获其 URL
- **Node.js 回退链**（node 始终必需，最低 24.15.0，缺失时经 fnm 装 26）：
  `fnm` → `cargo install fnm` → `nvm` → 自动安装 fnm 到 `~/.cache/bin`
  →（全部失败时）在 UI 中给出
  [fnm 安装指南](https://www.fnmnode.com/zh-cn/guide/install)提示。
- **内嵌终端（PTY + WebSocket + xterm.js）** — Rust 侧用 `portable-pty`（Windows 为
  ConPTY，Unix 为 openpty/forkpty）持有 PTY 主从对，注入 PATH/env/cwd 后由一个
  自托管的 WebSocket 服务（绑定 `127.0.0.1:0` 随机端口、64 位 hex 令牌鉴权）把每个
  会话暴露给前端预签名 URL `ws://127.0.0.1:/_pty/?token=...`；xterm.js
  以静态资源形式随 `@dshl/control` 分发（白名单路由，不依赖 CDN）。见
  `src/pty/`（`spawn/list/resize/write/kill/server_endpoint`）。
- **控制面（control plane）** — 启动器开一个回环 TCP 上的 NDJSON JSON-RPC 端点，
  把原生能力（shutdown/restart/switch-profile/open-terminal/ping）暴露给被监督的
  dsh 进程；每次启动生成随机令牌并经 `DSHL_CONTROL_URL` 环境变量下发。见下文
  「控制面」。
- **窗口几何记忆** — 一个 `<cache>/dshl/window-state.json` 记录 `{x,y,width,height}`
  （物理像素），WebView 窗口与外部浏览器窗口**共享同一份**几何；所有值先经过钳制
  再交给 webui（webui 的 C 核心会静默丢弃超限值），浏览器模式按 DPI 缩放换算。
  见 `src/ui/geometry.rs`。
- **系统托盘** — Windows（隐藏消息窗口 + Shell_NotifyIconW，全走 windows-rs）、
  Linux（libayatana-appindicator3 运行时 dlopen）、macOS（tray-icon 的 AppKit 后端）
  三套实现共用同一个 6 函数接口；事件以原子标志暴露，`ui/supervisor.rs` 只轮询。
- **契约校验（插件轨）** — `@dshl/control` 用 `backend-contract.js` 按 tier
  （native 全集 / pipe 子集）校验后端能力面（warn-only 漂移检测），并以
  `resolveLaunchOptions` 白名单过滤 `launch()` 选项；guard 组件做崩溃追踪与
  回滚记账（详见「插件轨」）。
- **平台适配** — Windows（PowerShell）、Linux、macOS（bash）；dsh 以隐藏控制台 +
  新进程组启动（Windows `CREATE_NEW_CONSOLE | CREATE_NEW_PROCESS_GROUP`，Unix
  `setsid`）。Windows **release** 二进制是 GUI 程序（无控制台窗口）；dsh 已安装时
  直接执行 `dsh`（`dsh.exe`/`dsh.cmd`/`dsh.sh`）并以隐藏控制台启动。
- **应用图标** — `assets/` 只保留两份全分辨率矢量源：`dsh-black.svg`（黑色鲸鱼，
  自带深色模式适配——深色主题下自动变白）与 `dsh-white.svg`（强制白色的夜间变体）；
  其余光栅图标全部由 ffmpeg 从这两个源生成后放入 `packing/<平台>/`（见「图标」）。
- **完全可配置**的启动：包管理器、版本、flags、镜像。

## 要求

### 工具 · 版本 · 是否必需
- **工具**: Node · **版本**: `>= 24.15.0` · **是否必需**: **始终**（缺失时按下方装配链安装）
- **工具**: Nub · **版本**: npm latest · **是否必需**: 默认（`pm = "nub"`）；缺失时经 npm 镜像装入缓存
- **工具**: Bun · **版本**: `>= 1.3.14` · **是否必需**: 仅当 `pm = "bun"` 时
- **工具**: fnm · **版本**: 任意 · **是否必需**: 无镜像时的首选 Node 版本管理器
- **工具**: nub · **版本**: npm latest · **是否必需**: 启用镜像时的首选（同时承担 pm 职责）
- **工具**: cargo · **版本**: 任意 · **是否必需**: 用于回退执行 `cargo install fnm`
- **工具**: nvm · **版本**: 任意 · **是否必需**: 最后的受管回退

## 运行时装配链

启动流水线第 2 步先并发探测全部工具并写日志（透明汇报），随后按下图装配。
第一原则：**系统里已有的可用工具原样使用，绝不重装**。

```mermaid
flowchart TD
    P[并发探测 node/bun/pnpm/nub/fnm/cargo/nvm] --> Q{node >= 24.15.0 ?}
    Q -- "是：零安装，直接使用" --> DONE[运行时就绪]
    Q -- "缺失或过旧" --> M{pm = "nub" 且mirrors.npm 已配置 ?}

    M -- "是" --> N1["npm 镜像安装 @nubjs/nub→ <cache>/dshl/nub"]
    N1 --> N2{安装成功?}
    N2 -- "否" --> H
    N2 -- "是" --> N3["nub node install 26（NODEJS_ORG_MIRROR）"]
    N3 --> N4{"nub node which解析到二进制?"}
    N4 -- "是" --> NDONE[node 目录 = nub 提供 ✓]
    N4 -- "否" --> H

    M -- "否（未启用镜像）" --> H["fnm → cargo install fnm → nvm→ 自动装 fnm → 手动指引链接"]
    H --> DONE

    DONE --> PM
    subgraph PM["包管理器（把 @deepseek-ai/dsh 装进缓存）"]
        direction LR
        PN1["pm=nub：nub add（镜像）"] ~~~ PN2["pm=bun：GitHub 镜像下载本体"] ~~~ PN3["pm=pnpm/npm：各自直装"]
    end
```

镜像层横切以上所有网络步骤且**只临时注入环境变量/旗标**，从不写全局配置：
`mirrors.npm` → npm/bun/pnpm/nub 的 registry 与 nub 本体安装；
`mirrors.nodejs_release` → fnm/nvm/nub 的 Node 发行版下载；
`mirrors.bun_download`、`mirrors.github` → 各自的下载源。

**离线与弱网语义**：下载类操作（bun/nub 本体、Node 发行版）全部支持断点续传——
中断后从已下载的字节继续（curl `-C -` + 自动重试），绝不从头重来；因此安装/下
载类调用不设超时。与之相对，探测与校验类调用统一有界（registry 查询 3s、全局
程序校验 15s），保证离线时启动流程快速失败而非挂住。

## 构建

```sh
cargo build --release          # 整个 workspace
cargo build --release -p dshl  # 只构建 Track A 二进制
```

二进制位于 `target/release/dshl`（Windows 为 `.exe`）。首次构建会自动编译对应平台的
WebUI C 库（webui-rs 是 git 源码依赖，无需预编译库）。

### 门禁（fmt / clippy / test / JS 检查）

门禁逻辑只有一份：`scripts/gate.sh`（POSIX）/ `scripts/gate.ps1`（PowerShell）/
`scripts/gate.bat`（cmd 转发）。CI 与本地跑的是同一条命令：

```sh
scripts/gate.sh          # 全部：cargo fmt --check + clippy -D warnings + test --workspace --locked + npm run check + npm pack 干跑
scripts/gate.sh --rust   # 仅 Rust 三项
scripts/gate.sh --js     # 仅 npm run check（node --check 语法检查）+ npm pack --workspaces --dry-run
```

PowerShell 侧等价命令为 `./scripts/gate.ps1 [-Rust|-Js]`。

### 打包（Track A）

打包步骤同样只有一份：`scripts/package.sh`（CI 按步调用，本地可端到端）：

```sh
bash scripts/package.sh all                          # 当前主机：构建 + portable zip + 平台安装器
bash scripts/package.sh stage --bin PATH_TO_BIN      # 组装 stage/（二进制 + 两份 README）
bash scripts/package.sh portable --zip NAME.zip      # stage/* + 默认 dshl.toml -> NAME.zip
bash scripts/package.sh nsis   --version V --artifact NAME   # stage/ -> dshl-<NAME>-setup.exe（需 NSIS）
bash scripts/package.sh deb    --version V --deb-arch amd64  # stage/dshl -> .deb（需 dpkg-deb）
bash scripts/package.sh dmg    --version V --artifact NAME   # stage/dshl -> dshl-<NAME>.dmg（需 macOS）
```

注意：**dshl.toml 只随 portable zip 分发**；各安装器不带配置（首次运行时启动器会
自动生成注释齐全的默认模板）。PowerShell 侧等价物为 `scripts/package.ps1`。

### 发布（npm，Track B）

```sh
node plugins/dshl-native/scripts/build-native.mjs --release  # 或 npm run build:native（本地构建宿主 .node）
scripts/publish.sh --version 0.3.0            # 版本号同步进三包 + check + pack 干跑 + 发布
scripts/publish.sh --version 0.3.0 --dry-run  # 只 bump + 校验，不发布
scripts/publish.sh                            # 按当前 package.json 版本发布
```

发布顺序固定 `@dshl/native → @dshl/pipe → @dshl/control`（control 列前两者为
optionalDependencies，必须最后发）。六个平台子包 `@dshl/native--<arch>`
不在本地发布范围——它们只由 CI 工作流构建发布。`--provenance` 需要 OIDC，仅 CI 使用。

## CI / 发布工作流

### 工作流 · 触发 · 内容
- **工作流**: `ci.yml`（CI） · **触发**: push 到 `main`、所有 PR · **内容**: Rust 门禁跑在 ubuntu-latest 与 windows-11-arm 双腿（gate 脚本）；JS job（Node 22）跑语法检查 + pack 干跑
- **工作流**: `release.yml`（Release · Track A） · **触发**: push tag `v*` · **内容**: 六条矩阵腿（Windows x64 / Windows ARM64 原生 runner / Linux x64 / Linux arm64 交叉 / macOS x64 / macOS arm64）：`cargo build --release --locked -p dshl` → `package.sh` 打出 portable zip + NSIS/deb/dmg，自动生成 changelog 并创建 GitHub Release
- **工作流**: `release-native.yml`（Release · Track B · native .node） · **触发**: push tag `v*` · **内容**: 六条矩阵腿分别构建 cdylib 并发布 `@dshl/native-{win32-x64-msvc, win32-arm64-msvc, darwin-x64, darwin-arm64, linux-x64-gnu, linux-arm64-gnu}` 六个平台子包（`index.node` + 生成的 package.json，`--provenance`）
- **工作流**: `release-plugins.yml`（Release · Track B · npm 聚合包） · **触发**: `workflow_run` 串联在 native 工作流成功完成后（且上游 ref 是 tag） · **内容**: `bump-versions.mjs` 同步三包版本 → `npm pack` 干跑 → 按序发布 `@dshl/native`、`@dshl/pipe`、`@dshl/control`

三个 release 工作流都有并发组保护（同名 tag 重跑会替换在途运行）。**未配置
`NPM_TOKEN` secret 时，所有 npm 发布步骤自动跳过**（输出 notice 后 exit 0，不算失败）——
fork 上跑 tag 也只会得到 Track A 制品，不会报红。

## 使用

```sh
# 使用可执行文件旁或配置目录里的配置文件
./dshl

# 指定配置文件
./dshl --config ./dshl.toml
```

完整 CLI 面：`-c/--config `、`-d/--debug`（`-v/--verbose` 等价）、
`-V/--version`、`-h/--help`。

### 配置文件的搜索与生成

启动器按以下顺序查找 `dshl.toml`，**命中即用、不再继续**
（`src/config.rs::load`）：

1. `--config ` 显式指定（文件不存在时直接报错提示）；
2. 当前工作目录 `./dshl.toml`；
3. 可执行文件所在目录 `<exe>/dshl.toml`;
4. 平台配置目录：
   - Windows：`%APPDATA%\dshl\dshl.toml`
   - macOS：`~/Library/Application Support/dshl/dshl.toml`
   - Linux：`$XDG_CONFIG_HOME/dshl/dshl.toml`（未设置时 `~/.config/dshl/dshl.toml`）；
5. Linux 系统级配置（最低优先级）：`/etc/dshl/dshl.toml`（发行包不携带配置，需手动放置）。

全部未命中时，启动器在**平台配置目录生成默认模板**（`dshl.example.toml` 的编译期
嵌入副本，注释齐全）并使用它——因此始终存在一个真实文件可编辑，启动页的**打开配置**
按钮打开的就是它。解析失败时使用内置默认值并在启动页提示错误。

## 调试日志

`./dshl --debug`（或 `-v`、或设置非空 `DSHL_LOG`）会把完整运行时间线——每个流程
步骤和进程输出行——带单调时间戳镜像到 **stderr**（`src/debug.rs`）。debug 构建保留
控制台，所以 `cargo r -- --debug` 能实时看到；release 构建无控制台。

## 配置（`dshl.toml`）

``