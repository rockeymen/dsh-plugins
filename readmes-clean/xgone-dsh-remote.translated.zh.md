# dsh-remote

**让 DeepSeek Harness 可以被安全地远程访问**：在 `dsh web` 前增加完整的账号密码认证 + MFA
（两步验证）门禁，并打通外网部署所需的全部环节——外部浏览器登录后即可使用完整功能（含工作区
选择、添加工作区等），全程不会在宿主机上弹出任何原生窗口。

### 界面预览

### 登录门禁（未登录访问任何路径） · 设置 → 登录与账号
- **登录门禁（未登录访问任何路径）**: ![登录页](docs/login-zh.png) · **设置 → 登录与账号**: ![账号管理设置页](docs/settings-zh.png)

## 一、已实现的功能（用户视角）

### 1. 远程访问 dsh

- **外网/局域网可用**：经反向代理（nginx / ssh 隧道 / Tailscale / Frp 等）暴露后，外部浏览器
  登录即可使用全部功能。DSH 自带的 `/api` 信任围栏把 `host.pickDirectory`、`settings.*`、
  `credentials.*` 等特权方法硬编码钉死在 loopback（官方注明"直到真正的认证层出现"）——本插件
  就是那个认证层，认证通过后自动放行。
- **工作区/添加工作区不弹宿主窗口**：DSH 默认的目录选择器在 loopback 部署下会调用宿主机原生
  OS 选择框（远程用户看不到）。本插件把选择器替换为 **browse 后端**——选择/新建工作区变成
  **浏览器内的目录对话框**（双栏目录视图 + 面包屑 + 新建文件夹）。
- **WebSocket 全通**：事件下行流（`events.mux` / `events.host`）经认证后正常建立。

### 2. 账号密码验证

- **完整登录门禁**：未登录访问任何路径都得到自包含的登录页；`/api` 与 WebSocket 全部要求有效
  会话 Cookie。
- **安全的会话**：HMAC-SHA256 签名的 HttpOnly Cookie（可配过期时间、Secure、SameSite）；
  签名密钥随机生成并持久化（重启后会话仍有效）。
- **密码安全存储**：scrypt 哈希（`N=16384,r=8,p=1`）+ 常量时间比较，绝不落盘明文。
- **防暴力破解**：登录失败按「IP + 用户名」限速（默认 15 分钟窗口内 5 次）。
- **首次引导**：无账号时登录页提供"创建首个管理员"，仅本机（loopback）可提交，防止远程抢先注册。
- **首个账号受保护**：根账号不可删除、不可改角色，只能重置密码（防止误删唯一管理员锁死）。
- **仅管理员模式（默认）**：运行时禁止新建账号、所有账号强制 admin 角色、设置页隐藏"添加账号"。
- **多角色可选**：关闭 `adminOnly` 后可启用 `admin` / `user` / `guest` 三层方法级权限。

### 3. MFA 两步验证（TOTP）

- **兼容标准认证器**：Google Authenticator、1Password、Authy 等（RFC 6238，6 位 / 30 秒）。
- **扫码绑定**：开启时展示二维码（SVG，实测可扫）+ 手动密钥 + otpauth 链接 + 10 个一次性备用码
  （备用码仅存 SHA-256 哈希）。
- **登录实时验证**：登录页与重登浮层显示"有效剩余 N 秒"倒计时，输入满 6 位数字**自动验证**
  （备用码含字母，仍手动确认）。
- **管理员恢复**：管理员可用自己的密码为任意账号禁用 MFA（找回路径）。

### 4. 体验细节

- 登录页即完整认证面：密码 → 动态码 / 就地绑定引导（含二维码）；
- 会话过期时 SPA 内出现全屏重登浮层，输入自动验证；
- 设置 → 登录与账号：MFA 自服务（开启/关闭）、账号列表（卡片式）、重置密码、退出登录按钮。

### 5. 多语言支持（`zh` / `en`）

插件的全部界面——登录页、MFA 绑定引导、重登浮层、设置页（登录与账号）——均提供中英双语，跟随 **DSH 应用语言设置**（Settings → General → Language）：

- **登录页**：服务端渲染，优先读 `$DSH_HOME/settings.yaml` 的 `locale.preference`（即 DSH 应用语言），未设置时回落浏览器 `Accept-Language`；
- **应用内界面**：接入官方 `@deepseek-ai/dsh-client-locale` 服务（`ctx.locale`），注册插件的 zh/en 字典并实时跟随语言切换——切换语言时设置页与浮层即时更新，无需刷新。

**远程浏览器语言持久化**：DSH 出于安全设计把整个设置面钉死在 loopback（本机）——远程浏览器的设置读写只进内存，语言偏好在 DSH 原生机制下刷新即丢。本插件作为远程部署的认证层，为非 loopback 浏览器接管了语言配置的双向通道：

- **读**：启动时经标准 `settings.describe` RPC 取回持久化偏好并应用到界面（登录页也在服务端读同一份偏好）；
- **写**：语言切换经标准 `settings.mutate` RPC 落盘 `settings.yaml`，跨浏览器、跨设备一致。

本机（`127.0.0.1` / `localhost`）访问完全走 DSH 原生 host-backed 路径，插件不做任何介入。两条通道都基于 DSH UI 自身使用的标准 RPC 信封，不魔改任何宿主内部状态。

## 二、安装引导（Installation）

### 0. 前置条件

- 已安装 DeepSeek Harness 并可运行 `dsh web`（默认端口 3080）；
- 已初始化 `web` profile（首次运行 `dsh web` 会自动初始化）；
- 系统 PATH 中有 `pnpm`（`dsh plugin` 命令需要它来管理 profile 的插件）。

### 1. 安装插件包

**NPM 安装（推荐）**——插件已发布到 npm registry，一行命令即可：

```sh
dsh plugin --profile web add @xgone/dsh-remote
```

> - 包主页：https://www.npmjs.com/package/@xgone/dsh-remote
> - 固定版本：`dsh plugin --profile web add @xgone/dsh-remote@0.1.0`

其他安装方式：

```sh
# 从公开 Git 仓库安装
dsh plugin --profile web add git@github.com:xgone/dsh-remote.git

# 本地源码目录（开发/自用，路径替换为你实际的源码位置）
dsh plugin --profile web add ~/path/to/dsh-remote
```

`dsh plugin` 会做三件事：

1. 在 `~/.dsh/profiles/web/` 下用 pnpm 安装该包（输出 `+ @xgone/dsh-remote` 即成功）；
2. 自动把 `@xgone/dsh-remote` 追加到 profile 的 `dsh.profile.bundles`（因为包声明了
   `dsh.bundle.patch`）——无需手动改配置；
3. 插件随下次启动的 composition 生效。

### 2. 确认安装结果

```sh
# bundles 列表中应出现 @xgone/dsh-remote
python3 -c "import json; print(json.load(open('$HOME/.dsh/profiles/web/package.json'))['dsh']['profile']['bundles'])"
# 期望输出类似：['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', '@xgone/dsh-remote']
```

### 3. 重启 `dsh web`

Web 表面目前禁用 HMR，补丁热重载不可用，**必须重启**才生效：

```sh
# 结束当前 dsh web 进程后重新启动（或直接重启你的启动方式）
dsh web
```

### 4. 首次启动：创建管理员

重启后，浏览器打开 `http://127.0.0.1:3080`：

1. 未登录访问会看到**登录页**（自包含页面，非 SPA）；
2. 由于还没有任何账号，登录页处于**引导模式**：标题为"创建首个管理员账号"；
3. 输入用户名和密码（至少 6 位），点击创建——**仅限本机（loopback）提交**，防止远程抢先注册；
4. 创建成功即登录（签发会话 Cookie），随后可正常使用。

> 验证：`curl http://127.0.0.1:3080/auth/me` 应返回
> `{"authEnabled":true,"bootstrap":false,"authenticated":true,...}`。

### 5. 绑定 MFA（推荐）

登录后进入 **设置 → 登录与账号 → 双重验证 (MFA) → 启用双重验证**：

1. 页面展示**二维码**（Google Authenticator / 1Password / Authy 扫码即可添加）；
2. 同时展示手动密钥、otpauth 链接与 **10 个一次性备用码**——请先保存备用码；
3. 在认证器中输入当前 6 位动态码 → 自动验证并启用；
4. 之后每次登录都需 密码 + 动态码（或备用码）。

> 也可以不进入设置页：登录页在密码验证通过后（未开启 MFA 时）会直接给出"绑定双重验证"引导。

### 6. 验证安装

- 未登录时访问任意路径 → 登录页；直接调用 `/api` → 403；
- 登录后 `/api`、WebSocket 事件流、工作区选择（浏览器内目录对话框）均正常；
- 会话过期（或退出登录）后回到登录页。

### 7. 卸载

```sh
dsh plugin --profile web remove @xgone/dsh-remote
```

`dsh plugin` 会执行 pnpm remove，并自动把该包从 `dsh.profile.bundles` 移除；
重启 `dsh web` 后门禁即消失。已创建的 `$DSH_HOME/auth/store.json` 与账号数据会保留
（如需彻底清除可手动删除该文件）。

### 8. 常见问题

### 现象 · 处理
- **现象**: 安装后无登录页 · **处理**: 未重启：执行 `dsh web` 重启；或 bundles 列表里没有 `@xgone/dsh-remote`（重跑 `dsh plugin --profile web add ...`）
- **现象**: 登录页提交无反应 · **处理**: 确认表单已填用户名/密码；浏览器控制台的 `content-script.js` 报错是扩展噪音，可忽略
- **现象**: 创建管理员时报 403 · **处理**: bootstrap 仅限 loopback：请在本机浏览器操作，或经 `ssh -L` 后访问 `127.0.0.1`；无本地浏览器的服务器请用下方 `bootstrap` 配置预置管理员
- **现象**: 被锁在门外（配置出错） · **处理**: 编辑 `cordis.patch.yml` 设 `enabled: false` 重启；或删除 `$DSH_HOME/auth/store.json` 重新引导
- **现象**: 忘记 MFA / 丢手机 · **处理**: 管理员登录后在 设置 → 登录与账号 → 该账号行 → 禁用 MFA（需管理员密码）
- **现象**: 远程访问时「设置 → 插件」配置页空白 · **处理**: v0.1.5+ 已内置修复：DSH 对远程浏览器把所有设置 scope 切成 memory 模式（读写在客户端被丢弃），插件启动时自动解除该限制并触发一次全量刷新，配置卡片远程可读可写；原始 settings.yaml 文档编辑器仍保持仅限本机（设计如此）
- **现象**: 远程刷新后反复弹出「内测声明」 · **处理**: v0.1.6+ 已内置修复（已确认用户）：DSH 的欢迎弹窗确认态 `WelcomeNoticeStore` 对远程走 memory 模式，不读已持久化的确认；插件用官方 `settings.describe` RPC 读 `ui-onboarding.welcomeNoticeVersion`，有值时经官方 `store.update` 置 `acknowledged=true`，`WelcomeNotice` 即自动收场不再弹。全程只用官方 slots/store/RPC，不重写 DSH 内部方法、不改 persistence。纯远程首次用户（从无确认）维持原行为
- **现象**: 远程打开「设置 → 模型」提示"加载提供方目录失败: settings are unavailable in this browser" · **处理**: v0.2.6+ 已内置修复：DSH 升级后所有设置读取改经共享的 `SettingsDescribeMirror`（远程构造为 memory 模式，`view` 恒为 undefined），Models 页因此抛错；插件用官方 `settings.describe` RPC 读取设置文档，经官方 `ctx.settingsScope.describe()` 拿到 mirror，再用官方 `store.set` 注入 `view`，Models 目录远程正常加载。全程只用官方 RPC/服务/store API，不重写 DSH 方法、不改 persistence

### 9. 无浏览器服务器（headless / Linux）安装

服务器没有本地浏览器时，UI 的「创建管理员」引导（仅限 loopback）无法使用。用 `bootstrap`
配置节在启动时直接预置首个管理员（等价于 loopback 引导：同样受保护、管理员角色、scrypt 哈希）：

```sh
dsh plugin --profile web add @xgone/dsh-remote
# 编辑 ~/.dsh/profiles/web/cordis.patch.yml，给 remote 行加 config:
```

```yaml
- id: remote
  config:
    enabled: true
    bootstrap:
      username: admin          # 首次启动时创建（仅当账号库为空）
      password: '换成一个强密码'
```

要点：

- **幂等**：账号库非空后该配置被忽略（日志提示移除凭据），不会重复创建、不会覆盖已有密码；
- 密码至少 6 位（与 UI 引导一致），违规会在启动时报错并中止；
- 首账号与 UI 引导一致：`protected: true`（不可删除/降级，仅可重置密码）；
- 建议首次登录后从 `cordis.patch.yml` 移除该配置节（保留也无风险——账号存在后即失效），
  之后可在 设置 → 登录与账号 绑定 MFA；
- 反向代理部署只需再加 `trustProxy: true`（默认已开启）。

## 三、配置（`cordis.patch.yml`）

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml（覆盖 remote 行的整份 config，缺省键回落到默认值）
- id: remote
  config:
    enabled: true
    accounts: []            # 种子账号（明文密码启动时转 scrypt 哈希；或直接给 scrypt$<salt>$<hash>）
    secret: ''              # 空 = 自动生成并持久化
    session:
      cookieName: dsh_session
      ttlSeconds: 604800    # 7 天
      secure: false         # HTTPS 部署建议 true
      sameSite: lax
    enforceRoles: true      # admin/user/guest 方法级权限
    adminOnly: true         # 仅管理员账号（默认）
    trustProxy: true        # 已认证请求归一化 Host/Origin，放行外部访问（默认）
    bootstrap:
      username: admin       # 可选：无浏览器服务器预置首个管理员（账号库为空时生效）
      password: '...'
    mfa:
      enabled: true
      issuer: DeepSeek Harness
      window: 1             # ±1 个 30 秒步长
      backupCodes: 10
    rateLimit:
      maxAttempts: 5
      windowMs: 900000
    gzip:
      enabled: true          # 响应 gzip 压缩总开关（默认开）
      remoteOnly: true       # 仅对远程（非 loopback Host）请求压缩；false 则本地也压
      minBytes: 1024         # 已知 Content-Length 小于此字节数的响应不压缩
    files:
      enabled: true          # 远程文件显示（/auth/file）总开关（默认开）
      roots: []              # 额外允许读取的根目录（绝对路径）
      maxListing: 500        # 目录索引每页最多渲染的条目数
```

> **角色门禁只作用于 client-request**：`/api/respond`（浏览器应答宿主的 server-request：审批、提问、
> 工具结果等）的封包没有 `method` 字段，早期实现会把它们误判为未知方法而拒绝，导致宿主挂起的流式
> 请求失败、WebSocket 重连、工作区/会话基线被重置。现在仅对 `type: "client-request"` 封包按方法做
> 角色判定，其余 wire 协议消息一律放行。被拒绝的 client-request 返回符合 RPC 契约的
> `server-response` 错误封包（回显 rpcId），浏览器按业务错误处理而不是传输故障。

> **Windows 提示**：默认根目录是 DSH 主目录与 dsh 进程工作目录（通常是 profile 目录），工作区文件常在
> 其他盘符路径下。被拒绝时面板会直接显示当前允许的根目录列表；把工作区所在目录加入 `files.roots`
> 即可，YAML 中路径写双反斜杠或正斜杠：
>
> ```yaml
> remote:
>   files:
>     roots:
>       - "E:\\CODE"
>       - "D:/projects"
> ```

关闭认证：`enabled: false`。

**远程文件显示**：DSH 的 Web UI 点击文件路径时走 `host.openPath` RPC，把路径交给**宿主机**桌面
的默认应用打开——远程浏览器用户完全看不到。本插件在远程（非 loopback）浏览器上拦截该 RPC，改为在
**右侧边栏面板**中显示（`/auth/file` 由宿主机流式返回，参考 Claude Desktop 的交互）：
- Markdown 使用界面同款渲染器排版，图片 / PDF / 视频内联显示，文本与代码等宽预览，目录可逐级点击浏览
- 支持同时打开**多个面板**，自动上下等分分割；每个面板右上角有独立的「放大」（占满整个侧栏，可还原）
  与「关闭」按钮
- 面板头部显示文件名与完整路径；侧栏左缘可拖拽调整宽度；Esc 关闭最上方 / 放大的面板
- 不可预览的二进制提供下载与新标签页兜底

DSH 原生的右侧 details 列（会话详情，单槽位）不受影响，本侧栏以覆盖层形式与其并存。读取范围被限制在
DSH 主目录、进程工作目录与 `files.roots` 列出的额外根目录内（realpath 校验，符号链接逃