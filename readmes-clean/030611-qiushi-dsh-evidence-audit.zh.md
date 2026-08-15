# Qiushi DSH Evidence Audit

[English](README.md) | 简体中文

![Qiushi DSH Evidence Audit 社交预览图](docs/social-preview.jpg)

**在不明文保存提示词、工具参数、工具结果或会话 ID 的前提下，留下可在本地检查的执行轨迹。**

```sh
dsh plugin --profile web add qiushi-dsh-evidence-audit
```

> 由社区维护，并非 DeepSeek 官方项目。相关 trust-layer 插件：[Telemetry Redactor](https://github.com/030611/dsh-telemetry-redactor)、[Verification Receipt](https://github.com/030611/dsh-verification-receipt) 与 [Context Provenance](https://github.com/030611/dsh-context-provenance)。

Qiushi DSH Evidence Audit 是一个只观察（observe-only）的 DeepSeek Harness Profile Bundle。它监听官方 `tools/result` 与 `session/event` 扩展点，向 JSONL 文件追加确定性的哈希链 evidence receipt。它不会注册模型可见工具，不会修改提示词，不会转换工具结果，也不会向会话追加事件。

![Evidence Audit 数据流：DSH 观察值被规范化并哈希后写入私有 JSONL 链，同时不保存被观察原文](https://raw.githubusercontent.com/030611/qiushi-dsh-evidence-audit/main/docs/evidence-flow.svg)

## 从 npm 安装

前置条件为 Node.js `^22.19.0 || >=24.0.0`，以及从[已测试 commit](#兼容性) 构建的 DSH。

```powershell
dsh plugin --profile  add qiushi-dsh-evidence-audit
dsh --profile  --dump-config
```

配置输出应包含 id 为 `qiushi-evidence-audit`、name 为 `qiushi-dsh-evidence-audit` 的条目。receipt 默认写入 `$DSH_HOME/evidence-audit/evidence-receipts.jsonl`；`DSH_HOME` 未设置时使用 `~/.dsh/evidence-audit/evidence-receipts.jsonl`。若从 DSH 源码目录运行，请按照官方文档把 `dsh` 换成该源码目录的 `pnpm dsh` 启动方式。

移除组合包：

```powershell
dsh plugin --profile  remove qiushi-dsh-evidence-audit
```

## 它能证明什么，不能证明什么

- 验证已有文件时，它能检测保留记录被修改、未改写前缀被删除、链路断裂和尾部半行。
- 它能说明该观察器在某个本地顺序中看到了哪些事件类别和哈希。
- 它**不能**证明命令执行正确、结果真实、文件由谁生成，也不能发现有效后缀被完整删除。
- 其中的哈希**不是**脱敏、加密、数字签名或外部信任锚点。receipt 文件仍是敏感的假名化数据，必须妥善保护。

## 兼容性

本版本只作一项刻意收窄的兼容声明：2026-08-13 基于 `deepseek-ai/deepseek-harness` commit `47f943859bef60e4160492346772ded9b24f765a` 实现并测试。该源码把包版本标为 `0.1.0-rc.5`，但验证时 npm 尚未提供此版本。因此这是固定 commit 的声明，不代表支持 npm `0.0.1-rc.1`、未来 DSH commit 或某个 semver 范围。

官方安装器读取 `package.json#dsh.bundle.patch`。[`dsh.plugin.json`](dsh.plugin.json) 是带本地 schema 的补充项目元数据；固定 DSH commit 不读取该文件，本项目不会虚构这一兼容能力。

## Receipt 数据

默认文件为 `$DSH_HOME/evidence-audit/evidence-receipts.jsonl`；`DSH_HOME` 未设置或为空时使用 `~/.dsh/evidence-audit/evidence-receipts.jsonl`。插件以 owner-only `0700` 模式创建默认目录，以 owner-only `0600` 模式创建文件（操作系统支持 POSIX mode 时生效），且绝不默认写入当前工作目录。

每行都含 `schemaVersion`、`sequence`、`collectedAt`、`previousRecordHash` 与 `recordHash`。`recordHash` 是对除自身以外全部字段的 canonical JSON 计算 SHA-256；下一行通过 `previousRecordHash` 提交该哈希，首行为 `null`。启动时会验证整个已有文件；任何行、序号、记录哈希或前序哈希链路无效时，都拒绝继续追加。

`session-event` receipt 保存会话 ID 哈希、事件类型、事件序号与时间、事件数据哈希，以及可选的 `ignorable` 标记。`tool-result` receipt 保存工具名、调用/根调用/会话 ID 哈希、参数哈希、最终 outcome 哈希、错误标志、父调用存在标志，以及可选错误码。

> [!WARNING]
> **`eventDataHash`、`argumentsHash`、`outcomeHash` 不是脱敏、不是加密、也不是数字签名。** JSONL 不保存被观察值的原文，但攻击者可以对低熵候选值逐一计算哈希并离线确认匹配。receipt 文件仍是敏感的假名化数据，必须按敏感数据保护。

事件类型与工具名保持可读，因为它们是稳定的审计类别。两个 feed 不做去重：DSH 可能先通过 `tools/result` 发布一个逻辑工具结果，随后又把它作为持久化的 `tool/result` `session/event` 发布；此时插件会有意生成两张 receipt，表示两次观察。不得把两张 receipt 相加后解释为两次独立工具执行。

### Canonical JSON 边界

`hashObservedValue` 只接受无损 JSON 值：`null`、布尔值、有限数值、字符串、无空洞数组，以及仅含字符串键的普通对象。对象键递归使用 JavaScript 默认的 UTF-16 code-unit 顺序排序；字符串采用 `JSON.stringify` 转义，SHA-256 对所得 UTF-8 字节计算。插件不做 Unicode normalization，因此规范等价的 NFC 与 NFD 字符串会得到不同哈希。

`undefined`（包括对象属性）、`BigInt`、非有限数值、函数、symbol、稀疏数组空洞、额外数组属性、访问器、不可枚举或 symbol 键、循环引用、Proxy、数组子类，以及 `Date`、`Map`、类实例等非普通对象都会被拒绝；访问器 getter 不会被执行。直接调用者会收到带路径的 `TypeError`；观察器会捕获错误、记录警告、只跳过该张 receipt，并保持 DSH 发布不变。已有文件验证失败仍会让插件启动明确失败。

## 只观察行为

两个监听器都是普通的 contained observer。它们不返回 waterfall decision，也不修改任何回调参数。receipt 序列化或追加失败只会记录警告并被隔离，工具 outcome 与会话发布会继续保持原样。启动错误（包括输出路径无效或已有哈希链损坏）会明确导致插件加载失败，避免静默丢失审计记录。

一个 cleanup effect 会显式先注销两个 listeners，再关闭 writer；Cordis 自动管理的 listener disposers 与该清理操作幂等。追加与关闭均为同步操作（`writeSync`/`closeSync`），不存在卸载时仍未完成的 promise 写队列。真实 Cordis 测试会等待卸载完成，并确认随后再次发射事件不会改变文件。

模型体验：提示文本、工具 schema、token、模型请求、结果和 KV-cache 行为均无变化。运行时成本只有 canonical 序列化、SHA-256、每条记录的同步追加 I/O，以及插件启动时的整链验证。

## 可选输出路径

覆盖值必须是绝对路径。后续 profile patch 会替换整个条目的 config，因此需要保留 name 并提供完整 config：

```yaml
- id: qiushi-evidence-audit
  name: qiushi-dsh-evidence-audit
  config:
    outputPath: 'D:\private-audit\evidence-receipts.jsonl'
```

自定义目标由操作者负责；插件不会修改其父目录权限或链接安全策略。请优先使用其他用户不可写的私有目录。

## 验证与构建

```powershell
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:built
pnpm run publint
pnpm pack --dry-run
pnpm run test:tarball
$env:DSH_UPSTREAM_CHECKOUT='D:\path\to\pinned\deepseek-harness'
pnpm run test:upstream
```

测试覆盖 canonical JSON 接受/拒绝边界与 Unicode 行为、固定 SHA-256 向量、确定性链生成、明确的修改/截断边界、真实双进程追加竞争、原文排除、两个 feed 的重复观察、失败隔离、安全默认路径、真实 Cordis 挂载/事件/卸载、构建产物加载、publint、精确 pack 清单、从 tarball 安装/导入/挂载，以及固定 commit 且与上游逐字节相同的官方 `applyEntryPatches` 组合语义。

## 完整性检测边界

该文件**不具备宽泛意义上的 tamper-evident 保证**。它只是没有密钥、没有外部锚点的自包含哈希链。已测试边界如下：

### 场景 · 能否检测 · 精确边界
- **场景**: 修改保留行或链路 · **能否检测**: 能，在验证/启动时 · **精确边界**: 若攻击者重算该行及其后所有哈希，则可绕过。
- **场景**: 删除未改写的文件前缀 · **能否检测**: 能，在验证/启动时 · **精确边界**: 剩余首行不再以序号 `0`/前序 `null` 开始；若改写并重建链则可绕过。
- **场景**: 尾部留下半行 · **能否检测**: 能，在验证/启动时 · **精确边界**: 非空文件必须以完整 JSON 记录后的换行结尾。
- **场景**: 删除整份文件 · **能否检测**: **不能** · **精确边界**: 没有外部锚点时，重建文件与首次使用无法区分。
- **场景**: 删除完整后缀 · **能否检测**: **不能** · **精确边界**: 保留下来的较短前缀仍是有效链。
- **场景**: 两个进程写同一文件 · **能否检测**: 不会阻止 · **精确边界**: 没有跨进程锁。对抗测试让两个进程从同一链头打开，事后验证会拒绝重复/陈旧序号；每个进程必须使用独立文件。
- **场景**: 攻击者改写并重建整条链 · **能否检测**: **不能** · **精确边界**: SHA-256 无密钥，文件内也没有可信签名或 checkpoint。

## 已知限制与剩余风险

- 哈希不能证明作者身份，既不是数字签名，也没有锚定在主机外部的 checkpoint。
- `writeSync` 成功不等于 `fsync` 持久化保证；断电或内核/存储故障可能丢失最后一条 receipt。
- 多个 DSH 进程不得并发写入同一个文件。检测只发生在后续验证且不等于恢复；请为每个进程/profile 配置独立输出文件。
- 启动验证成本与已有文件大小线性相关，同步追加 I/O 会给事件发布者增加延迟。
- POSIX mode 无法完整表达 Windows ACL 策略；敏感部署需要另行核对 ACL。
- 插件只观察挂载后的实时发布。DSH 按设计不在 `session/event` 发布的构造 seed/replay 事件不会被回填。
- 组合烟测未执行依赖模型的完整 DSH turn：固定浅克隆没有安装/构建工作区依赖，也没有 API 凭据。测试已覆盖真实 Cordis runtime 与官方 bundle patch 解析/应用语义。

## 项目链接

- [GitHub 仓库](https://github.com/030611/qiushi-dsh-evidence-audit)
- [npm 包](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
- [v0.1.0 发布说明](https://github.com/030611/qiushi-dsh-evidence-audit/releases/tag/v0.1.0)

## 许可证

[MIT](LICENSE)