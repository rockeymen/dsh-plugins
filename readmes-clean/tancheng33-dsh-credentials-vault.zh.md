# dsh-credentials-vault

[English](README.md) | 中文

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 凭证 seam（`ctx.credentials`）的 **HashiCorp Vault** 后端。厂商密钥存在 Vault 里，agent 主机上最多只有一个短期的 AppRole 令牌。

## 为什么

官方 provider `@deepseek-ai/dsh-credentials-local` 把密钥存在 harness home 下一个 `0600` 的 YAML 文档里。它自己的 README 写明了边界在哪：

> 文档是 `0700` 目录下的 `0600` 文件，这挡得住其他操作系统用户——**挡不住模型**。……这是审慎，不是边界。一个必须让厂商密钥远离自身 agent 的部署，靠文件权限是到不了的……它应该作为一个兄弟包存在于这个 provider 旁边。

本插件就是那个答案的**中心化**版本（区别于每台机器一份的系统钥匙串）：

###  · `credentials-local` · 系统钥匙串 · `dsh-credentials-vault`
- 密钥在哪 · **`credentials-local`**: agent 主机上的文件 · **系统钥匙串**: 那台机器的钥匙串 · **`dsh-credentials-vault`**: Vault
- headless / 容器 / CI agent · **`credentials-local`**: 得把文件塞进去 · **系统钥匙串**: 根本没有钥匙串 · **`dsh-credentials-vault`**: 可用——AppRole 登录
- 给 20 个 agent 轮换密钥 · **`credentials-local`**: 改 20 个文件 · **系统钥匙串**: 20 台机器 · **`dsh-credentials-vault`**: Vault 写一次
- 谁在什么时候读了密钥 · **`credentials-local`**: 无记录 · **系统钥匙串**: 无记录 · **`dsh-credentials-vault`**: Vault 审计设备
- 主机上的引导凭证 · **`credentials-local`**: 密钥本身 · **系统钥匙串**: 无 · **`dsh-credentials-vault`**: role id + secret id，不是密钥

## 安装

```sh
dsh plugin --profile <name> add dsh-credentials-vault
```

bundle patch 在插入本行时会**禁用 `credentials-local`**：`ctx.credentials` 每个 context 只接受一个实现。

然后在你自己 profile 的 `cordis.patch.yml` 里指向你的 Vault：

```yaml
- id: credentials-vault
  config:
    address: https://vault.internal:8200
    namespace: ''            # Vault Enterprise namespace
    mount: secret
    path: dsh
    kvVersion: 2
    tokenRef: VAULT_TOKEN
    approleMount: approle
    roleIdRef: VAULT_ROLE_ID
    secretIdRef: VAULT_SECRET_ID
    readOnly: false
    environmentWins: true
    cacheTtlMs: 0
    timeoutMs: 10000
```

patch 会替换一行的**整个** `config`，覆盖时请把想保留的键全部重写。

密钥是 `<mount>/` 下的一张扁平映射，键就是凭证引用名——和 `credentials-local` 的 YAML 形状一致：

```sh
vault kv put secret/dsh DEEPSEEK_API_KEY=sk-… OPENAI_API_KEY=sk-…
```

## 配置

### 键 · 默认值 · 含义
- **键**: `address` · **默认值**: `http://127.0.0.1:8200` · **含义**: Vault 基地址。
- **键**: `namespace` · **默认值**: `''` · **含义**: Vault Enterprise namespace。留空则不发该头。
- **键**: `mount` · **默认值**: `secret` · **含义**: KV 引擎挂载点。
- **键**: `path` · **默认值**: `dsh` · **含义**: 挂载点下存放凭证映射的路径。
- **键**: `kvVersion` · **默认值**: `2` · **含义**: KV 引擎版本。v2 提供 CAS 与版本。
- **键**: `tokenRef` · **默认值**: `VAULT_TOKEN` · **含义**: 存放 Vault 令牌的环境变量名。未配置 AppRole 时使用。
- **键**: `approleMount` · **默认值**: `approle` · **含义**: AppRole 认证挂载路径。
- **键**: `roleIdRef` · **默认值**: `VAULT_ROLE_ID` · **含义**: 存放 AppRole role id 的环境变量名。
- **键**: `secretIdRef` · **默认值**: `VAULT_SECRET_ID` · **含义**: 存放 AppRole secret id 的环境变量名。
- **键**: `readOnly` · **默认值**: `false` · **含义**: 完全拒绝 `set`/`unset`。
- **键**: `environmentWins` · **默认值**: `true` · **含义**: 允许继承的环境变量遮蔽 Vault，与本地 provider 一致。
- **键**: `cacheTtlMs` · **默认值**: `0` · **含义**: 缓存密钥映射的毫秒数。`0` 表示每次操作都读。
- **键**: `timeoutMs` · **默认值**: `10000` · **含义**: Vault 请求超时。

**这个文件里不放任何密钥。** `tokenRef`、`roleIdRef`、`secretIdRef` 给的都是承载引导凭证的*环境变量名*。这个插件的意义就是长期厂商密钥不进配置文件，那对它自己的引导凭证也必须成立。

## 认证

**同时**设置 `VAULT_ROLE_ID` 和 `VAULT_SECRET_ID` 即选择 AppRole；否则使用静态 `VAULT_TOKEN`。

AppRole 是面向机器的路径，也是真正值得用的那条：agent 主机上从不持有厂商密钥，只有一对能换取租约令牌的 role id / secret id。租约会一直复用到过期前一分钟——一个在请求中途过期的令牌，会以"某个无关调用突然认证失败"的形式暴露出来。

## 优先级

### 层 · source id · 可写 · 胜出
- **层**: 继承的进程环境 · **source id**: `env` · **可写**: **否** · **胜出**: 默认胜出
- **层**: Vault KV 映射 · **source id**: `vault` · **可写**: 是 · **胜出**: 其余情况

这照搬了 `credentials-local` 的诚实规则。一次性覆盖——`DEEPSEEK_API_KEY=… dsh`、CI secret、容器 `-e`——是操作者对*这一次运行*的意图，而且它无法从 harness 内部编辑。所以它既胜出，又**可见地只读**：`describe()` 报 `writable: false`，`set`/`unset` 直接拒绝，而不是提交一个读取方永远观察不到的变更。

设 `environmentWins: false` 可让 Vault 权威化；此时环境只作为 Vault 没有的引用的兜底。

## 轮换无需重启

seam 的契约是逐次操作解析，本 provider 默认也是：`cacheTtlMs: 0` 意味着每次 LLM 请求都读当前值。在 Vault 里轮换密钥，下一次请求就用新的——不重启、不重载、没有缓存要失效。

`cacheTtlMs` 大于零是用即时性换往返次数：轮换会在 TTL 内到达 agent，而不是立刻。它是给 Vault 距离很远的部署准备的；没有实测理由就保持 `0`。

## 并发

写是在一张共享映射上做读-改-写，走 KV v2 的**compare-and-swap**。否则两个 agent 在同一路径上存不同引用时，后写的会把先写的抹掉。CAS 冲突时 provider 重读并重试一次；第二次仍冲突就如实抛出，而不是无限重试。

## 测试

56 个测试，其中 8 个跑在**真实 Vault** 上。单元测试跑在一个"按本插件的理解"实现 Vault 契约的假服务上——而那份理解恰恰是最可能错的东西，所以实盘用例来校验它：KV v2 的双层嵌套、真实的 CAS 拒绝、真实的 403 文本、真实的 AppRole 登录。

```sh
npm test          # 仅单元测试

docker run -d --name vault -p 18200:8200 \
  -e VAULT_DEV_ROOT_TOKEN_ID=dsh-test-root --cap-add=IPC_LOCK hashicorp/vault:latest
DSH_VAULT_TEST_ADDR=http://127.0.0.1:18200 npm test
```

## 它防住了什么，没防住什么

**防住了：**把长期厂商密钥从 agent 主机上拿掉；集中化轮换；每次凭证读取都进 Vault 审计设备；主机磁盘被拿走时，拿到的是一个有有效期的租约令牌，而不是永久 API key。

**没防住：**运行中的 agent 进程使用它本来就被授权使用的凭证。只要进程活着，一个能发网络请求的工具就能花掉解析出来的密钥所授权的额度——密钥本来就是干这个的。约束一个活着的 agent 能够到哪里，是另一个 seam 的事；网络方向见 [`dsh-egress-guard`](https://github.com/tancheng33/dsh-egress-guard)。

也不能在 `environmentWins` 从环境供值时，把值对读取进程环境的 `bash` 调用藏起来。但来自 Vault 的值，本插件从不写进环境变量。

## 限制

- **只支持 KV 引擎。** 不支持 database / PKI / transit / 动态密钥引擎；seam 的四个操作对应的是静态键值存储。
- **一个路径、一张扁平映射。** 凭证引用是 POSIX 标识符，这里就把它们作为单一路径下的键存放——和本地 provider 同一形状。
- **AppRole 令牌不做续租，只重新登录。** Vault 的 `auth/token/renew-self` 可以原地延长租约；对一个每几秒就用一次的令牌来说，重新登录更简单且没有区别。
- **Vault 外部编辑不会触发 `credentials/updated`。** 本地 provider 会 watch 文件，本 provider 对 Vault 没有订阅。在 `cacheTtlMs: 0` 下外部轮换依然会在下一次操作生效，只是不会主动广播。

## 许可证

MIT