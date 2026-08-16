# dsh-spill-s3

[English](README.md) | 中文

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) spill 存储 seam（`ctx.spillStore`）的 **S3 兼容后端**。超长工具输出写进对象存储——AWS S3、MinIO、Cloudflare R2 或任意 S3 兼容服务——而不是碰巧跑了这个 agent 的那台机器的本地磁盘。

## 为什么

当一次工具结果大到放不进模型上下文时，harness 会把它 *spill* 掉：全文落盘，模型拿到一个 locator 和取回指引。官方后端 `@deepseek-ai/dsh-spill-local` 把这段文本写进本机的一个私有目录。这个默认值是对的，但对团队部署是错的：

###  · `dsh-spill-local` · `dsh-spill-s3`
- 产物在哪 · **`dsh-spill-local`**: agent 所在主机的私有目录 · **`dsh-spill-s3`**: 你的 bucket
- headless / 容器化运行 · **`dsh-spill-local`**: 产物随容器一起消失 · **`dsh-spill-s3`**: 产物比容器活得久
- 同事想看一眼 · **`dsh-spill-local`**: 得 ssh 到那台机器 · **`dsh-spill-s3`**: 他本来就有 bucket 权限
- 静态加密 / 生命周期 / 保留策略 · **`dsh-spill-local`**: 取决于那台主机 · **`dsh-spill-s3`**: 取决于你的 bucket policy

这个插件换的是**存储介质**，不是策略。它只实现 seam 声明的那一个方法 `saveText`，保留策略（`@deepseek-ai/dsh-output-retention`）和工具结果替换（`@deepseek-ai/dsh-spill-policy`）依然留在原处。

## 安装

```sh
dsh plugin --profile <name> add dsh-spill-s3
```

bundle patch 在插入本行时会**禁用 `spill-local`**：`ctx.spillStore` 每个 context 只接受一个实现，加载第二个会抛 cordis 的重复服务错误。

`bucket` 故意留空——不填这一行就通不过校验。默认一个 bucket 名字，正是 spill 产物流到没人预期的地方的典型原因。在你自己 profile 的 `cordis.patch.yml` 里设置：

```yaml
- id: spill-s3
  config:
    endpoint: https://s3.us-east-1.amazonaws.com
    region: us-east-1
    bucket: my-agent-spill
    prefix: dsh-spill
    forcePathStyle: false      # AWS 虚拟主机寻址
    accessKeyIdRef: AWS_ACCESS_KEY_ID
    secretAccessKeyRef: AWS_SECRET_ACCESS_KEY
    sessionTokenRef: AWS_SESSION_TOKEN
    serverSideEncryption: AES256
    retrieval: cli
    presignExpiresSeconds: 3600
    timeoutMs: 30000
```

patch 会替换一行的**整个** `config`，所以覆盖这一行时要把想保留的键全部重写一遍。

### MinIO / R2 / 自建

```yaml
- id: spill-s3
  config:
    endpoint: http://127.0.0.1:9000
    region: us-east-1          # 任意值，只要一致；它只参与签名 scope
    bucket: agent-spill
    forcePathStyle: true       # 裸 IP 必须开——没有泛域名解析
    serverSideEncryption: ''   # 有些服务会拒绝这个头
    # …其余键照样重写
```

## 配置

### 键 · 默认值 · 含义
- **键**: `endpoint` · **默认值**: `https://s3.us-east-1.amazonaws.com` · **含义**: 服务端点 origin。
- **键**: `region` · **默认值**: `us-east-1` · **含义**: SigV4 凭证 scope 里的 region。S3 兼容服务接受任意一致的值。
- **键**: `bucket` · **默认值**: *（必填）* · **含义**: 目标 bucket，必须已存在——本插件从不创建 bucket。
- **键**: `prefix` · **默认值**: `dsh-spill` · **含义**: 键前缀。产物落在 `/session-<hash>/` 下。
- **键**: `forcePathStyle` · **默认值**: `true` · **含义**: `host/bucket/key` 寻址。MinIO 和裸 IP 端点必须开；AWS 虚拟主机风格设 `false`。
- **键**: `accessKeyIdRef` · **默认值**: `AWS_ACCESS_KEY_ID` · **含义**: 凭证**引用**——是名字，不是值。
- **键**: `secretAccessKeyRef` · **默认值**: `AWS_SECRET_ACCESS_KEY` · **含义**: secret key 的引用。
- **键**: `sessionTokenRef` · **默认值**: `AWS_SESSION_TOKEN` · **含义**: STS 会话令牌的引用。未配置时忽略。
- **键**: `serverSideEncryption` · **默认值**: `AES256` · **含义**: `x-amz-server-side-encryption` 的值。留空则不发这个头。
- **键**: `retrieval` · **默认值**: `cli` · **含义**: 告诉模型怎么读取产物：`cli`、`presigned`、`locator-only`。
- **键**: `presignExpiresSeconds` · **默认值**: `3600` · **含义**: 预签名 URL 有效期（1..604800）。
- **键**: `timeoutMs` · **默认值**: `30000` · **含义**: 上传超时。

### 凭证是引用，不是值

`accessKeyIdRef` 给的是一个凭证**名字**；值在**每次上传时**通过 `ctx.credentials` 解析，没挂凭证 provider 时回落到进程环境变量。任何密钥都不该出现在 `cordis.patch.yml` 里。

因为解析是逐次操作进行的（这是 seam 自己的契约），轮换后的密钥**不需要重启**就能用在下一次上传上。配合中心化密钥存储——例如 [`dsh-credentials-vault`](https://github.com/tancheng33/dsh-credentials-vault)——agent 主机上根本不需要放长期 AWS 密钥。

### 怎么选 `retrieval`

### 模式 · 告诉模型 · 代价
- **模式**: `cli`（默认） · **告诉模型**: 执行 `aws s3 cp s3://…` · **代价**: 需要执行命令的机器上有 AWS CLI 和凭证
- **模式**: `presigned` · **告诉模型**: 去 fetch 这个 URL · **代价**: **会把一个 bearer URL 写进模型上下文和持久会话日志**
- **模式**: `locator-only` · **告诉模型**: 去问用户 · **代价**: 最安全；模型无法自助取回

`presigned` 确实好用——一个普通的 `web_fetch` 就能读回产物——但预签名 URL 本质上是一张有有效期的通行凭证。正因如此它是显式开启的。

## 键的结构

```
/session-<sha256(sessionId)[0:16]>/<18 位随机 hex>-<安全名>
```

- **session id 被哈希。** bucket 的键对任何有 `s3:ListBucket` 的主体都可见，还会被复制进 inventory、访问日志和分析管道。按会话分组的能力保留了，id 不外泄。
- **随机段放在名字前面。** 它满足 seam 对"不碰撞"的要求，也让只有前缀级读权限的人猜不到键。放在前面还能避免前缀列表按工具名聚簇。
- **suggestedName 只做净化，从不信任。** 保留 `[A-Za-z0-9._-]`，其余折叠成 `-`，两个及以上连续的点变成 `-`（所以派生键里永远不会出现 `..`），开头的点和横线被剥掉。seam 明确说 `suggestedName` 是"提示，绝不是路径"，这里就按提示处理。

## 设计说明

**不引入 AWS SDK。** 签名是约 150 行基于 `node:crypto` 的实现，对照公开的 SigV4 契约写的。`@aws-sdk/client-s3` 为了一个 `PUT` 要带进来几十兆的传递依赖，而一个会让每次安装都变胖的 spill 后端，没人会挂。代价——自己维护一个签名器——是有界的，因为 SigV4 是稳定的线格式；而且它是**对着真实服务器**验证的（见下），不是只跟自己自洽。

**签名覆盖真实的载荷摘要**，不是 `UNSIGNED-PAYLOAD`。反正 body 已经在内存里了，签过的摘要能让存储产物在传输中可验篡改。

**`saveText` 在存储失败时 reject**，符合 seam 契约——它绝不会为一个没写成功的对象返回 locator。spill policy 把 reject 当作尽力而为、保留内联结果，所以 bucket 故障会退化成今天的行为，而不是丢输出。失败带机器可读的 `kind`：`network`（没到服务器）、`http`（服务器拒绝，含状态码）、`config`。

**取消是链式的。** 调用方的 `AbortSignal` 和配置的超时都会中止在途请求，所以一次 spill 不会把已取消的工具结果拖住。

## 测试

50 个测试，其中 4 个跑在**真实的 S3 兼容服务器**上。单元测试只能钉住签名的*形状*；只有实盘服务器能证明它是*对的*——一个自洽但错误的签名器能通过所有单元测试，然后每次上传都失败。

```sh
npm test          # 仅单元测试

# 带实盘服务器（验证签名、预签名 GET、需转义的键）
docker run -d --name minio -p 19000:9000 \
  -e MINIO_ROOT_USER=dshtest -e MINIO_ROOT_PASSWORD=dshtest12345 \
  cgr.dev/chainguard/minio:latest server /data
DSH_SPILL_S3_TEST_ENDPOINT=http://127.0.0.1:19000 npm test
```

## 限制

- **只有 `saveText`。** seam 只声明了一个方法，这里就只实现这一个。没有取回、搜索、删除 API——取回是 `retrievalHint` 描述的事，删除属于你 bucket 的生命周期策略。
- **bucket 必须已存在。** 创建 bucket 需要的权限不该由一个 spill 后端持有。
- **不做分片上传。** spill 的工具输出是单次 `PUT`。超过单次 `PUT` 5 GiB 上限的对象不支持；harness 自身的输出上限让这在实践中不可达。
- **不做客户端加密。** 服务端加密取决于你的 bucket 和 `serverSideEncryption` 头协商的结果。本插件不做客户端加密，也不声称做。

## 许可证

MIT