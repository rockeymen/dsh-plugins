# dsh-plug-manager

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件管理器：
发现社区在 [`dsh-plugin`](https://github.com/topics/dsh-plugin) GitHub topic 下
发布的插件，检查其内容，并通过规范的 `dsh plugin` 包管理路径完成安装 / 移除 /
更新——可以在 Web UI 的「插件市场」标签页中操作，也可以通过 agent 工具完成。

## 功能

- **设置 → 插件 → 插件市场**（Web UI）
  - **发现**：搜索带 `dsh-plugin` 标签的 GitHub 仓库（最佳匹配 / 最多 Star /
    最近更新），打开仓库查看 Star、topics、许可证、README（内置安全的
    Markdown 渲染：标题 / 代码块 / 表格 / 列表 / 链接 / 图片，相对图片
    自动改写为 raw.githubusercontent.com 地址），以及关键信息——
    其 `package.json` 是否声明了 `dsh.bundle`（可激活的 bundle 层）、是否含
    `prepare` 脚本（git 安装会从源码构建）。
  - **一键安装**：点击「申请安装」后由插件管理器**直接执行**
    `dsh plugin add`（宿主进程发起，不经 agent、无需审批——这是你本人在
    本地界面发起的操作），页面实时滚动显示命令输出，成功 / 失败即时反馈，
    可随时取消。「已安装」页的更新 / 移除同样直接执行。
  - **详情弹窗**：仓库详情以**模态弹窗**展示（点击卡片立即弹出，带入场
    动效；Esc / 点击遮罩 / 关闭按钮均可关闭），无需滚动到页面顶部；
    README 在弹窗内直接滚动阅读。
  - **一键重启**：安装 / 更新 / 移除成功后，任务面板提供「重启 DSH 并刷新
    页面」按钮——宿主按当前启动方式拉起替代进程后退出，页面轮询等待服务
    恢复并自动刷新（含确认对话框与超时兜底提示）。
  - **安装源智能解析**：`github:owner/repo` 源会先查证该仓库同名包是否已
    发布到 npm 注册表——若已发布则自动改用 npm 包安装（npm 包自带预构建
    产物）；未发布则**经 HTTPS 从 codeload.github.com 下载源码 tarball**
    （自动走代理配置），解压到 `$DSH_HOME/.plug-manager-src/` 后按本地路径
    安装。全程不使用 git，彻底避开 pnpm 把 `github:` 转成 git+ssh 导致无
    SSH key 机器安装失败的问题。
  - **pnpm 兼容兜底**：pnpm 7 在较新 Node 上抓取注册表会报
    `ERR_INVALID_THIS`；检测到此错误时自动改用 npm 完成安装，并手动登记
    bundle 层（复刻 dsh CLI 的 reconcile 逻辑）。
  - **GitHub 代理**：直连 GitHub 受限时，可在页面上直接配置代理并测试连通性
    （见下文「代理配置」）。
  - **已安装**：列出 `$DSH_HOME/profiles` 下每个 profile 的 bundle 栈与已安装
    依赖，以与「发现」一致的卡片样式展示（版本 / 许可证 / 安装源 / bundle 层
    徽章）。点卡片打开详情弹窗：除本地信息外，若插件关联 GitHub 仓库，还会
    展示仓库星标 / topics / README；卡片与弹窗均可一键「GitHub ↗」直达仓库，
    并提供「更新 / 移除」操作。
- **Agent 工具**（模型侧入口，执行前按沙箱策略征询审批）
  - `plug_install` — `dsh plugin --profile <name> add <spec>`
    （npm 包名、`github:owner/repo[#ref]`、`git+<url>`、`.tgz` URL 或路径）
  - `plug_remove` — `dsh plugin --profile <name> remove `
  - `plug_update` — `dsh plugin --profile <name> update [package]`
- **本地 JSON API**（仅回环地址，由运行中的 web 服务器提供）：
  `/plug-mgr/search`、`/plug-mgr/repo`、`/plug-mgr/profiles`、
  `/plug-mgr/request`（启动安装 / 更新 / 移除任务）、
  `/plug-mgr/job`（查询 / 取消任务）、`/plug-mgr/proxy`、
  `/plug-mgr/proxy-test`。

## 代理配置

GitHub 发现功能访问 `api.github.com` 与 `raw.githubusercontent.com`。出厂部署
不挂载平台级 fetch provider，本插件自行发起请求：默认直连（Node fetch）；
**配置代理后经系统 `curl` 发出**，因此支持 `http` / `https` / `socks5` /
`socks5h` / `socks4`（Clash 的混合端口与 SOCKS 端口都可用）。

代理来源按优先级生效：

1. **持久设置**（UI「GitHub 代理」栏输入后点「应用」）——写入
   `DSH 主目录/plug-manager.json`，立即生效且重启后保留；点「清除」移除；
2. **插件配置**——在 profile 的 `cordis.patch.yml` 中为本插件加
   `config.proxy`（持久生效）：
   ```yaml
   - id: plug-manager
     name: dsh-plug-manager
     config:
       proxy: http://127.0.0.1:7890
   ```
3. **环境变量**——`DSH_PLUG_MANAGER_PROXY`，或标准的 `HTTPS_PROXY` /
   `HTTP_PROXY` / `ALL_PROXY`（大小写均可），在启动 DSH 的 shell 中设置：
   ```sh
   export HTTPS_PROXY=http://127.0.0.1:7890
   dsh web
   ```

UI 的「测试连接」会请求 `api.github.com/zen` 验证当前生效通道并报告延迟。
特殊值 `direct` 可强制直连（同样会被持久保存）。

注意：代理只影响本插件的 GitHub 发现请求；`dsh plugin` 安装操作走 pnpm，
其代理由 pnpm/npm 自己的配置管理。

安装兜底：当 pnpm 与当前 Node 不兼容（如 pnpm 7 在新版 Node 上的
`ERR_INVALID_THIS` 注册表抓取错误）时，插件会自动改用 `npm` 完成安装并
手动登记 bundle 层。profile 里 pnpm 专有的 `link:` 依赖会临时改写为语义
等价的 `file:`，安装完成后还原，不影响原有符号链接。

## 安全模型

两条执行路径，两种信任模型：

- **UI 直接执行**：Marketplace 页面里的安装 / 更新 / 移除由你在本地界面
  亲手点击触发，宿主进程直接执行 `dsh plugin`（等同于你自己敲命令），不经过
  agent，也不额外审批。操作输出实时回显，可随时取消。
- **Agent 工具**：`plug_*` 工具由模型调用。profile 目录位于
  `$DSH_HOME/profiles`、所有会话工作区之外，因此工具会先解析会话的常驻沙箱
  策略；当它窄于 `danger-full-access` 时，会在执行任何命令**之前**通过 harness
  审批服务征询用户；拒绝或无人应答都会失败关闭，不会执行任何操作。

无论哪条路径，请把安装当作它本来的含义：允许该包的代码在你的机器上执行
（git 类型的安装源在安装时可能执行包的 `prepare` 脚本）。只安装你信任源码的
插件；git 安装源建议锁定到具体 commit。

## 安装

要求 PATH 中有 `pnpm`（`dsh plugin` 命令会转发给它）；使用代理功能还要求
宿主有 `curl`（macOS / 主流 Linux 自带）。

```sh
# 在本目录的父目录下执行（profile 本身是 pnpm workspace 根目录，
# pnpm 7 拒绝不带 -w 的根目录 add，所以必须带 -w）
dsh plugin --profile web add -w ./dsh-plug-manager

# 发布 / 推送并打上 dsh-plugin topic 之后：
dsh plugin --profile web add -w github:OWNER/dsh-plug-manager

# 发布到 npm 之后：
dsh plugin --profile web add -w dsh-plug-manager
```

然后**重启 DSH**（`dsh web`）以组合新 bundle。「插件市场」标签页会出现在
设置 → 插件 下；`plug_*` 工具对该 profile 的所有 agent 可用。

## 卸载

```sh
dsh plugin --profile web remove dsh-plug-manager
```

重启 DSH 以移除该层。

## 开发说明

- 零运行时依赖：宿主插件是纯 ESM，通过 `ctx.get` 读取 Cordis 服务，
  服务缺失时优雅降级；代理请求经由系统 curl，无需额外 npm 依赖。
- 浏览器端以预构建形式交付（`client.js`，`window.__ModuleLoader__` 格式），
  仅依赖平台的 `react` wire 模块。
- GitHub 抓取在本地强制限制：30 秒超时、5 MB 响应上限、10 万字符文本上限。
- 给你自己的插件仓库打上 `dsh-plugin` topic 标签，即可出现在「发现」中。

## 许可证

MIT