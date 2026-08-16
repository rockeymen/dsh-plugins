# dsh-encrypt

> **DSH 凭证加密插件**（bundle 形态）：一个文件（`$DSH_HOME/.credentials.yaml`）双形态存储——未设密码时是与官方 `dsh-credentials-local` 完全一致的明文 YAML；在「设置 → 加密安全」设置密码后，同一文件原地替换为 AES-256-GCM 密文文档（**Argon2id 派生密钥** + SHA3-256 完整性指纹）。浏览器只提交密码的 SHA3-256 摘要（前后端分离校验），模型请求按需临时解密，明文从不缓存；另提供「N 天免密登录」滑块（仅 localhost 生效），并内置**解锁爆破锁定、凭证泄露检测与输出脱敏、发行代码完整性自校验**。

### 项目 · 值
- **项目**: 形态 · **值**: **bundle**（`dsh.bundle.patch` → `cordis.patch.yml`，随 profile 启动，`dsh plugin add` 原生安装）
- **项目**: 版本 · **值**: `0.1.0-rc.9`
- **项目**: 依赖线 · **值**: npm rc.1（`@deepseek-ai/cordis@^4.0.1` 等 scoped 包 + `@node-rs/argon2` 原生绑定）
- **项目**: 环境 · **值**: Node.js ≥ 18（官方教程建议 22+）；DSH `@deepseek-ai/dsh@0.0.1-rc.1`+
- **项目**: License · **值**: [MIT](./LICENSE)

## 解决的问题

DSH 默认的凭证存储把密钥以**明文 YAML** 写在 `$DSH_HOME/.credentials.yaml`。dsh-encrypt 用**同一个文件**提供可选的加密形态：设置密码前零改动、完全兼容；设置密码后文件内容被替换为密文文档，凭证只在模型调用发生时临时解密。

## 特性

- **单文件双形态**：明文 YAML ↔ `dsh-encrypt-credentials` 密文 JSON 原地互转，不产生第二个文件、不迁移路径
- **WebUI 全生命周期**：设置密码 / 解锁 / 修改密码，全部在「设置 → 加密安全」完成（永远密文策略下没有「移除密码」）
- **AES-256-GCM**：每条凭证独立随机 nonce，凭证引用名绑定为 GCM AAD（换位即认证失败）
- **SHA3-256 双重完整性**：条目级指纹 + 覆盖文档头部的文档级指纹，损坏文件在启动时即被拒绝（绝不当作“空库”）
- **Argon2id 密码派生**（`@node-rs/argon2`，m=64 MiB, t=3, p=1，OWASP 对齐）：密码不落盘，仅存盐与 AEAD 验证器；旧版 scrypt（v2）密文仍可解锁并在解锁时自动升级到 Argon2id
- **摘要校验（前后端分离）**：WebUI 用纯 JS Keccak-f[1600] 计算密码的 SHA3-256，只 POST `{ digest }` 到后端；后端用 Argon2id 拉伸摘要并与 AEAD 验证器匹配，原始密码不离开浏览器
- **解锁爆破锁定**：连续密码解锁失败计数持久化到状态文件（重启不清零），达到阈值（默认 5 次）后指数退避锁定（30 s 起，2 倍递增，上限 15 min），WebUI 显示剩余锁定时间，HTTP 返回 429 + `Retry-After`
- **凭证泄露检测与输出脱敏（Leak Guard）**：模型实际解析过的凭证值会被登记为掩码模式——WebUI 的 HTTP 响应体与 WebSocket 事件帧在离开主机前扫描并替换为 `[REDACTED:dsh-encrypt]`，提示词注入诱导模型回显密钥时也会被脱敏
- **发行代码完整性自校验**：打包时生成 `lib/integrity-manifest.json`（所有发行文件的 SHA3-256），启动时逐文件校验、不一致即拒绝加载（fail-closed），覆盖 provider 行与浏览器面板包
- **免密登录滑块**：设置「多少天免密」（0 = 每次都输密码 / 1–30 天 / 永远，刻度仅保留头尾），解锁成功后签发 256 位票据（HttpOnly Cookie + 响应体回传，浏览器同时存 localStorage 并随 `x-dsh-encrypt-remember` 请求头回传，不再依赖 Cookie 存取可靠性）；**打开 WebUI 即自动尝试免密解锁**（localhost 专属），磁盘只存被 AEAD 包裹的密钥副本；到期或票据不匹配即失效
- **仅 localhost 免密与改密**：非本机访问强制每次都输密码，且不能设置/修改密码（后端强制，返回 `LOCAL_ONLY`）
- **永远密文（ciphertext-only）**：一旦设置密码，文件永不回退明文——「移除密码」功能已移除；外部把文件改回明文时，解锁态下自动重新加密写回，锁定态下拒绝采用并保留最后密文快照；重启后若文件被替换成明文，凭证解析被拒绝（`plaintextForbidden`）直到重新设置密码
- **阅后即焚**：密文只在被使用的那一刻解密；解密中间 Buffer 立即清零，新增 `withUnlockedBuffer` 擦除式接口（回调结束后在 finally 中焚毁明文副本），改密时的明文集合用后即清空，密钥在锁定/卸载时清零
- **按请求解密**：明文只存活于单次操作，不缓存、不进日志；密钥在锁定/卸载时清零
- **热重载**：外部编辑明文即时生效；外部加密即时转锁定；损坏的中间状态保留最后一个好快照
- **原子写 + 文件锁**：写入经 `dsh-atomic-write`，POSIX 上强制 `0600` 权限（启动即校验）
- **自动化解锁**：`DSH_CREDENTIAL_PASSWORD` 环境变量在启动时解锁（适合 headless）

## 形态与架构

本插件是 **bundle** 形态（`package.json` + `dsh.bundle.patch` → `cordis.patch.yml`），由三个组合行构成：

### 组合行 · 入口 · 注入 · 职责
- **组合行**: `dsh-encrypt` · **入口**: `dsh-encrypt`（`lib/index.js`） · **注入**: —（`CredentialProvider` 服务） · **职责**: `EncryptedCredentialProvider`：替换被禁用的基础 `credentials` 行，在同一 `ctx.credentials` 接缝上提供双形态存储
- **组合行**: `dsh-encrypt-web` · **入口**: `dsh-encrypt/web`（`lib/web.js`） · **注入**: `webServer`、`credentials` · **职责**: 浏览器密码路由（5 条 `/api/credentials.*`），headless 组合不需要
- **组合行**: `dsh-encrypt/client` · **入口**: `package.json` 的 `dsh.client` 声明 · **注入**: `slots` · **职责**: 「设置 → 加密安全」面板（web 组合自动挂载）

替换方式遵循 bundle 生态边界：**不修改任何核心 row**（`tools`/`session`/`llm`/`web`/`permission` 均不动）。bundle patch 只做两件事——禁用基础 bundle 插入的明文 `credentials` 行，插入 `dsh-encrypt` 行。它提供同一个 `ctx.credentials` 接缝，因此 LLM 适配器、Models 页、web-search 等所有既有消费者**无需任何改动**。

## 安装

### 1. Profile Bundle（推荐）

先打包，再装进 profile（`dsh plugin add` 会把声明了 `dsh.bundle.patch` 的依赖自动 reconcile 进 bundles 列表）：

```sh
# 打包（files 字段仅含 lib 与 cordis.patch.yml，test/ 不入包；
# prepack 会自动重新生成 lib/integrity-manifest.json）
npm pack
# → dsh-encrypt-0.1.0-rc.9.tgz

# web profile（设置页「加密安全」）
dsh plugin --profile web add ./dsh-encrypt-0.1.0-rc.9.tgz

# headless profile（一次性任务 / 自动化解锁；web 与 headless 是不同 profile，需分别安装）
dsh plugin --profile headless add ./dsh-encrypt-0.1.0-rc.9.tgz
```

`@node-rs/argon2` 是带预编译二进制（napi-rs）的原生依赖，`dsh plugin add` 安装依赖时会拉取对应平台的 optionalDependencies；Node.js ≥ 18（建议 22+）。若安装后出现原生模块缺失（极少数平台组合），重新执行一次 `npm rebuild @node-rs/argon2` 即可。

本地源码目录同样可以直接安装（路径用 Windows 正斜杠形式）：

```sh
dsh plugin --profile web add "D:/path/to/DSH-Encrypt"
```

### 2. 挂载 Web 密码路由（设置面板需要，仅 web profile）

bundle patch 只插入 provider 行；浏览器密码路由是独立组合行，需在 profile 用户层挂载。编辑 `$DSH_HOME/profiles/web/cordis.patch.yml`，追加：

```yaml
- insert:
    - id: dsh-encrypt-web
      name: 'dsh-encrypt/web'
```

### 3. 验证安装

```sh
dsh --profile web --dump-config | grep dsh-encrypt
# 期望：出现 dsh-encrypt 与 dsh-encrypt-web 两个行，且基础 credentials 行被禁用
```

### 4. 运行验证

```sh
# web：启动后打开「设置 → 加密安全」，应能看到加密面板
dsh web
```

```sh
# headless：环境变量自动解锁后，任何任务都应正常启动、凭证解析无 VAULT_LOCKED
DSH_CREDENTIAL_PASSWORD='<密码>' dsh run "运行一次最小任务验证凭证可用"
```

仓库另附两阶段真实重启 e2e（见[开发与测试](#开发与测试)），覆盖 明文→设密→损坏/恢复→重启锁定→解锁→改密→移除密码 全生命周期。

### 5. 手动安装与旧版本兼容（仅调试场景）

手动 patch 只作为旧快照兼容或调试方案，不是默认安装流程。完整手动层：

```yaml
# $DSH_HOME/profiles/web/cordis.patch.yml
- id: credentials
  disabled: true

- insert:
    - id: dsh-encrypt
      name: 'dsh-encrypt'
      config:
        allowEnvFallback: true

    - id: dsh-encrypt-web
      name: 'dsh-encrypt/web'
```

## 使用

全部操作在「设置 → 加密安全」完成（面板 id `encryption`）：

### 操作 · 前置状态 · 效果
- **操作**: 设置加密密码（输入两次，至少 8 个字符） · **前置状态**: 明文 · **效果**: 同一文件原地替换为密文文档，进程保持解锁
- **操作**: 解锁 · **前置状态**: 加密+锁定（重启后） · **效果**: 校验密码摘要并派生密钥，立即恢复模型调用
- **操作**: 修改密码 · **前置状态**: 加密+解锁 · **效果**: 全部条目在新密钥下重加密
- **操作**: 免密登录时长（滑块） · **前置状态**: 任意 · **效果**: 0 = 每次都输密码；1–30 = N 天内免密；31 = 永远免密（均仅本机）

滑块即改即存（松开即提交到 `/api/credentials.config`，只接受 localhost；刻度只显示「每次」与「永远」两头）。解锁成功后按当前滑块时长签发免密票据；改动滑块会作废旧票据，若当前已解锁则立即按新时长重新签发。**打开 WebUI 时自动尝试免密解锁**（localhost 专属），免密期间无需输密码；到期后回到密码解锁。**非 localhost 访问始终需要输入密码，且不显示改密入口**（后端同样强制）。

**永远密文**：设置密码后没有「移除密码」路径——文件永为密文。若凭证文件被人替换成明文，解锁状态下会被立即重新加密写回；若发生在锁定/重启期间，凭证解析暂停（面板显示警告），重新设置密码即恢复（原有凭证内容保留）。

**解锁锁定**：连续输错密码达到阈值（默认 5 次）后，解锁接口进入指数退避锁定——第 1 次锁定 30 秒，之后每次失败翻倍，上限 15 分钟；计数与截止时间持久化在状态文件里，重启进程不能清零。锁定期间面板显示剩余秒数并禁用解锁按钮，接口返回 429 + `Retry-After`；成功解锁即清零。

状态机：

```text
             set-password                    (restart)            unlock
  plain ──────────────────► encrypted+unlocked ──────► encrypted+locked ──► unlocked
    ▲                            │  ▲                                        │
    └────── clear-password ──────┘  └──────────── change-password ───────────┘
```

- **锁定期间**：web 服务照常运行；继承环境中的凭证仍可解析，文件内凭证解析抛 `VAULT_LOCKED`，`describe` 报告 `source: "locked"`——设置页即是解锁入口
- **免密窗口**：票据在签发时写入 `issuedAt` 与 `days`；`days: -1` 永不失效。滑块改动会立即作废旧票据
- **忘记密码**：设计上不可恢复（密码不落盘）；恢复手段 = 删除 `.credentials.yaml` 重新配置

## 凭证解析顺序

### 优先级 · 来源 · 说明
- **优先级**: 1 · **来源**: 继承环境（launching environment） · **说明**: 只读、高于受管文件；对被其遮蔽的引用写入会被拒绝
- **优先级**: 2 · **来源**: 受管文件 `.credentials.yaml` · **说明**: 明文或密文形态，可写
- **优先级**: 3 · **来源**: `.env` 回退（project-env / user-env） · **说明**: 低于受管文件，仅在文件无此引用时兜底

`allowEnvFallback: false` 可关闭第 1、3 层（严格仅文件策略）。

## 磁盘格式

**明文形态**（未设密码，与 `dsh-credentials-local` 完全一致）：

```yaml
OPENCODE_GO_API_KEY: sk-…
```

**密文形态**（设密码后，同一文件的内容被替换）：

```json
{
  "format": "dsh-encrypt-credentials",
  "version": 3,
  "algorithm": "aes-256-gcm+sha3-256",
  "kdf": "argon2id",
  "kdfInput": "sha3-256-password",
  "m": 65536, "t": 3, "p": 1,
  "salt": "",
  "verifier": { "data": "", "sha3": "<hex>" },
  "remember": {
    "salt": "", "issuedAt": 1755000000000, "days": 7,
    "cipher": { "data": "", "sha3": "<hex>" }
  },
  "entries": {
    "OPENCODE_GO_API_KEY": { "data": "", "sha3": "<hex>" }
  },
  "sha3": "<document fingerprint>"
}
```

- `kdf: "argon2id"`：主密钥 = Argon2id(密码的 SHA3-256 摘要, salt, m/t/p)，`m` 单位 KiB；原始密码不进后端
- **旧版兼容**：v2 文档（`kdf: "scrypt"`，字段 `n/r/p`）仍可解析与解锁，用自身存储的 scrypt 参数派生；下一次密码解锁成功时自动原地升级为 v3 Argon2id 格式（免密票据随旧密钥一起作废）
- `verifier` 是固定明文的 AEAD 密文，用于在不接触任何真实凭证的前提下校验摘要
- `remember` 仅在签发过免密票据时存在：`cipher` 是在票据密钥（SHA3-256(域名‖salt‖票据)）下 AEAD 包裹的主密钥；票据本身只存在于浏览器 HttpOnly Cookie，永不落盘；`days: -1` 表示永远
- 文档级指纹覆盖 `sha3` 以外的全部字段（含 salt、成本参数与 remember 块）；条目级指纹覆盖各自的密文 blob
- 密码与票据从不落盘

## HTTP 路由（web 行）

仅 `POST application/json`（与官方 /api 相同的跨站写护栏）；响应 `{ ok: true, value }` 或 `{ ok: false, code, message }`，错误消息不含密码或任何密钥材料：

### 路径 · 请求体 · 作用
- **路径**: `/api/credentials.status` · **请求体**: `{}` · **作用**: 返回 `{ format, unlocked, plaintextForbidden, local, remember, ticketRejected, lockout, leakGuard }`；localhost 且携带免密票据（`x-dsh-encrypt-remember` 请求头或 Cookie）时先尝试票据解锁
- **路径**: `/api/credentials.unlock` · **请求体**: `{ digest }` · **作用**: 密码摘要解锁（64 位小写 hex SHA3-256）；localhost 成功后再按滑块签发免密票据（票据随响应体 `ticket` 字段回传）；失败次数过多时返回 **429** + `Retry-After`（`TOO_MANY_ATTEMPTS`）
- **路径**: `/api/credentials.set-password` · **请求体**: `{ digest }` · **作用**: 明文 → 密文（**仅 localhost**），并写入密文策略标记
- **路径**: `/api/credentials.change-password` · **请求体**: `{ digest }` · **作用**: 重加密（需已解锁，**仅 localhost**，作废旧票据并签发新票据）
- **路径**: `/api/credentials.config` · **请求体**: `{ action: "get" }` / `{ action: "set", rememberDays }` · **作用**: 读取状态或设置免密天数（-1 = 永远，0 = 每次，1–30；**set 仅 localhost**，签发新票据时随响应回传）

所有路由只接受 `POST application/json`。密码本身永不出现在任何请求体里——浏览器只提交 `d