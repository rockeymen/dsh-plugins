# dsh-web-remote

让手机/平板在任意网络下，经 [Tailscale](https://tailscale.com) 加密内网远程访问并操控本机
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）Web UI，Agent 仍在本机执行。

- 不改 dsh 源码；只用官方 launcher flag + 官方用户 patch 层（`--patch` 叠加层）+ 社区插件
  [henlii/dsh-plugins](https://github.com/henlii/dsh-plugins) 的 `dsh-web-auth` 密码认证；
- 不 "绑 0.0.0.0 + 无密码"：非回环 `/api` 与 WebSocket 全部在密码墙之后；
- 桌面版 / 普通 `dsh web` 实例完全不受影响（叠加层只被远程实例加载）。

## 重要结论（已实测核对，dsh 0.1.0-rc.6）

1. 该版本 `dsh web --host` 只接受 `127.0.0.1` / `0.0.0.0`（webserver schema 校验，传其他地址直接
   启动失败），且 CLI 明确拒绝 `--host 0.0.0.0`（官方安全设计）。因此"直接绑 Tailscale 网卡 IP"
   在 0.1.0-rc.6 不可行，请勿按旧教程传 `--host 100.x`。
2. 正确路线：用 launcher 的 `--patch` 叠加层把 `webserver` 行整体替换为 `0.0.0.0`（schema 合法的
   配置值），同一叠加层挂载 `dsh-web-auth` 密码墙；再配合防火墙只放行 Tailscale 网段
   （`100.64.0.0/10`），局域网设备不可达。
3. npm 上的 `dsh-web-auth` 是同名**异包**（webserver fork 架构），不是 henlii 的插件。
   必须按 henlii 文档用**本地路径 / git 源**安装。
4. `--patch` 是 `dsh web` 子命令自带的 launcher 选项，位置在 `web` 之后、应用 flag
   （`--port` / `--trusted-host`）之前；放错位置会报
   `web takes none of parent --profile, --patch, ...`。

## 快速开始

### 1. 前置

```powershell
node --version            # >= 20.19，推荐 22+
pnpm --version            # dsh plugin 需要 pnpm
npx --yes @deepseek-ai/dsh --version
tailscale status          # 本机已登录并在线；手机加入同一 tailnet（同一账号）
tailscale ip -4           # 记下本机 100.x 地址
# MagicDNS 域名：tailscale status --json 的 Self.DNSName（注意去掉结尾的点）
```

### 2. 安装 dsh-web-auth（henlii 文档的本地路径方式）

```powershell
git clone --depth 1 https://github.com/henlii/dsh-plugins <本地路径>\dsh-plugins
dsh plugin --profile web add "<本地路径>\dsh-plugins\plugins\dsh-web-auth"
```

- 预期出现 `declares no dsh.bundle — installed as a plain dependency` 警告：正常，该插件靠
  insert 行挂载，不走 bundle 层。
- 若 profile 的 pnpm 状态由其他插件市场管理（package.json 依赖为空但 node_modules 里有插件），
  跑 `pnpm add` 可能剪枝——此时可把插件目录直接复制到
  `$DSH_HOME\profiles\web\node_modules\dsh-web-auth`（该插件零依赖，效果等价）。

### 3. 生成远程叠加层

把本仓库的 [web-remote.patch.example.yml](web-remote.patch.example.yml) 复制为
`$DSH_HOME\web-remote.patch.yml`（或直接运行本仓库脚本的 `-InstallAuth` 自动生成）。

### 4. 设置访问密码并启动

```powershell
# 一键脚本（推荐）：-NewPassword 生成 24 位随机密码并写入用户环境变量
pwsh -File .\start-dsh-web.ps1 -NewPassword

# 或手动（npx 形态）
$env:DSH_WEB_AUTH_PASSWORD = '你的密码'
$env:DSH_WEB_AUTH_TOKEN_FILE = "$env:DSH_HOME\web-auth-tokens.json"
npx --yes @deepseek-ai/dsh web --patch "$env:DSH_HOME\web-remote.patch.yml" --port 3080 `
    --trusted-host <本机TailscaleIP> --trusted-host <本机MagicDNS域名>
```

`--trusted-host` 填的是**手机地址栏里敲的地址**（本机 Tailscale IP / 本机 MagicDNS 域名），
不是手机的 IP；精确匹配、无通配符、域名不带结尾点。

### 5. 手机访问

1. 手机安装 Tailscale，登录与 PC **相同的账号**；
2. 浏览器打开 `http://<本机MagicDNS域名>:3080` 或 `http://<本机TailscaleIP>:3080`；
3. 首次出现全屏 "访问需要密码" 登录卡片，输入密码后进入 UI（cookie 默认 12 小时，
   服务重启不失效）；本机日常用 `http://127.0.0.1:3080` 免密。

## 脚本说明（start-dsh-web.ps1，需 pwsh 7+）

- 端口检查（识别"已在运行"或占用者 PID）→ Tailscale 探测（未登录直接提示 `tailscale up`）→
  启动器自动选择（默认桌面版自带 node，`-Launcher npx|dsh|pnpm` 可切换）→
  启动 + 日志重定向（`$DSH_HOME\logs\dsh-web.{out,err}.log`）→
  健康检查（回环 `/`→200；Tailscale 地址 `/api/auth/status`→401=密码墙生效，
  503=没配密码、404=插件没挂载）→ 汇总输出。
- 子命令：`-InstallAuth`（生成叠加层并校验插件已装）、`-NewPassword`（生成并持久化密码）、
  `-Status`、`-Stop`（含 cmd/npx 包装下孤儿进程兜底）、`-Password '<pw>'`、
  `-ExtraTrustedHosts <a>`、`-Port <n>`、`-SkipHealthCheck`。
- 可选防火墙收口（管理员 PowerShell，仅 Tailscale 网段可达）：

```powershell
New-NetFirewallRule -DisplayName 'dsh web (Tailscale)' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3080 -RemoteAddress 100.64.0.0/10
```

## 为什么这么做

| 决策 | 理由 |
|------|------|
| 不传 `--host 100.x` | rc.6 webserver schema 只接受 127.0.0.1/0.0.0.0（实测启动报错） |
| `--patch` 叠加层注入 `host: '0.0.0.0'` | schema 合法；patch 语义是"整体替换目标行 config"，因此连同 `port` 一起重写 |
| 必须叠加 dsh-web-auth | 0.0.0.0 绑定下非回环 `/api` 可达（实测），官方信任围栏明确"不是认证层"，密码墙才是访问控制 |
| `--trusted-host` 填本机 TS 地址 | 官方围栏校验请求 `Host` 头 = 地址栏里的地址；带端口只匹配该端口，不带匹配任意端口 |
| 不改 profiles/web/cordis.patch.yml | `--patch` 层只被远程实例加载，桌面版实例行为不变 |
| `tokenFile` 显式指定 | 插件默认是 Linux 路径，Windows 上必须重定向，登录才能跨重启保持 |
| 防火墙 RemoteAddress 100.64.0.0/10 | 0.0.0.0 监听下把可达面收窄到 Tailscale 网段 |

## 故障排查

| 现象 | 原因 | 修复 |
|------|------|------|
| 手机超时 | Tailscale 未登录/手机未连 | `tailscale status` 两节点在线；`tailscale ip -4` 非空，否则 `tailscale up` |
| 手机拒连 | Windows 防火墙 | 管理员执行上文 `New-NetFirewallRule`（100.64.0.0/10） |
| `/api` 403 | Host 不在 `--trusted-host` | 地址栏地址必须精确列入；域名不带结尾点；不能用通配符 |
| 无登录卡片，`/api/auth/status`→404 | 插件没挂载 | 确认本地路径安装、启动带 `--patch` 叠加层 |
| 登录报 503 未配置密码 | 子进程没拿到环境变量 | 用脚本启动，或先 `$env:DSH_WEB_AUTH_PASSWORD='...'` |
| 设置页空白 | 官方非回环 settings 走 memory 作用域 | 插件已内置客户端补丁（lanHosts 自动从 trustedHosts 派生）；失效时在叠加层补 `lanHosts` |
| `$.host expected "127.0.0.1" \| "0.0.0.0"` | 传了 `--host 100.x` | 去掉 `--host`，交给叠加层注入 |
| `web takes none of parent --patch...` | `--patch` 放错位置 | 顺序：`dsh web --patch <f> <应用 flag>` |
| `dsh plugin add` 报 pnpm 找不到 | pnpm 不在 PATH | `npm i -g pnpm` |
| 手机报 `Failed to load plugins … slot "conversation.composer.dock" is not declared` | 某些桌面配套插件（如 dsh-balance）用一次性 effect 直接注册槽位，慢设备上先于 conversation 模块声明执行（时序竞态） | 在叠加层对该插件行加 `disabled: true`（见 example 文件注释）；桌面端若复现同样处理 |
| 两个实例同时跑 | 共享同一 $DSH_HOME 会话存储 | 可共存（原子写入），建议不要同时重度使用 |

## 升级注意事项

- dsh 升级后先 `dsh web --help` 并试传 `--host <TS IP>`：若未来版本放开 schema，把叠加层
  `host: '0.0.0.0'` 改为 Tailscale IP 即可回到更窄绑定；
- dsh-web-auth 会 patch `@deepseek-ai/dsh-client-connection` 客户端 bundle 里的特定代码串，
  升级 dsh 后若认证/设置页异常，检查插件新版。

## 参考

- [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（CLI/profile/patch 语义、
  `--host/--port/--trusted-host`、信任围栏）
- [henlii/dsh-plugins](https://github.com/henlii/dsh-plugins)（dsh-web-auth 安装与配置）
- 官方 Discussion #900（Windows 上 127.0.0.1 vs localhost 的 403 现象）
