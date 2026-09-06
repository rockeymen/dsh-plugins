#dsh-key-rotation

**针对 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh)] 的每个提供商 API 密钥轮换**。该插件不会因配额/速率限制错误而失败，而是透明地重试每个提供商池中的**下一个健康密钥**的请求。

> Hermes式轮换：每个配置的提供者都有一个密钥池；当某个键的限制用尽时，将在下一个键上重试该请求。耗尽的钥匙会保持冷却状态，并在 `cooldownMs` 后返回循环。

## 它的作用

- **每个提供商的密钥池** — 列出提供商可以轮换的 API 密钥（作为凭证/环境名称）。
- **您选择的提供商仍然是提供商** - 轮换交换密钥，而不是路由，因此多呼叫轮流不会中断。旧版克隆路线仍保持注册状态，但在模型下拉列表中隐藏。
- **透明的故障轮换** — 如果出现可切换错误（`QUOTA`、`RATE_LIMIT`、`AUTH`/`INVALID`…），则会在下一个键上重试请求。
- **冷却** — `cooldownMs` 会跳过用完的键，然后返回。
- **失效/撤销密钥处理** — 身份验证/无效密钥轮换到下一个池密钥，而不是出错。
- **设置 GUI** — **设置→按键轮换**部分，可在不触及配置文件的情况下管理所有内容：
  - **在一个位置添加密钥** — 按*添加密钥*，粘贴值，完成。凭证名称是为您生成的（`_API_KEY`，然后是 `_2`，`_3`，...），并且仅在悬停时显示；该卡将钥匙列为 *钥匙 1*、*钥匙 2*。
  - **实时密钥状态** - 每个密钥：正在使用/准备就绪/倒计时冷却/**没有此类凭据**，这可以捕获输入错误的名称，否则会默默失败。
  - **轮换计数器** — 提供商切换密钥的次数、发生的故障以及多久前的情况。
  - **按键顺序** — ↑/↓ 按钮；键的顺序是尝试它们的顺序。
  - **将代码切换为复选框**而不是逗号分隔的字符串。
  - **指数退避** - 同一键重复失败会使冷却时间加倍（基础 → ×2 → ×4 → 上限 ×8），因此死键不会在每个窗口都重试。
  - **重置冷却时间** — 卡中的*重置冷却时间*按钮可立即清除提供者的冷却时间（也可通过 `POST /dsh-key-rotation/reset`）。
  - **Env bootstrap** — 如果 `process.env` 中已设置池引用（例如 `MYPROVIDER_API_KEY`），则它将被视为临时凭证，而无需先使用 DSH 凭证。
  - **每个提供商的冷却时间** — 覆盖每个提供商的 `cooldownMs`（和 `maxCooldownMs`），回退到全局值。
  - **耗尽警告** - 当每个按键正在冷却时，卡中会出现红色警告，并且 `lastExhaustionAt`/`exhaustionCount` 通过 `GET /dsh-key-rotation/status` 暴露。
  - **故障日志** — 通过 `/status` 和可折叠的*最近故障*列表，每个提供商（`at`、`ref`、`reason`、`cooldownMs`）的最近 20 次故障。
  - **非流安全网** - 当错误可切换时，`agent/request-error` 钩子会使用下一个键重试同步调用（嵌入、批处理）。
  - **搜索/过滤提供商** — 列表上方的搜索框按 ID 过滤提供商。
  - **批量编辑冷却时间** - 每个提供商的复选框+冷却时间输入+ *应用于所选*。
  - **撤消删除** — 删除密钥或提供程序后，*撤消*栏会出现 5 秒。
  - **每键上次使用** — `lastUsedAt`

每个键旁边显示为“前”。
  - **总请求徽章** — 提供商密钥的使用总和，显示在其标头中。
  - **导出单个提供商** — ⬇ 按钮仅导出该提供商的条目。
  - **从 .env 导入** — 选择一个 `.env` 文件； `KEY=val` 名称将添加到第一个池中。
  - **复制按键名称** — 单击 *Key N* 标签以复制其参考名称。
  - **按用途排序** — ⇅ 按用途对提供商的密钥进行排序 (desc)。
  - **探测历史记录** — 运行状况探测事件在“最近失败”中显示为灰色。

## 安装

```bash
# From npm after publishing:
dsh plugin --profile web add @goodandready/dsh-key-rotation

# From GitHub:
dsh plugin --profile web add github:GooDAnDReaDY/dsh-key-rotation

# Locally from a checkout:
dsh plugin --profile web add /path/to/dsh-key-rotation
```

之后重新启动 Web UI。

## 配置

### Web GUI（推荐）

打开 **设置 → 密钥轮换**，并为每个提供程序列出其密钥的凭证名称。该插件将其存储在 `dsh-key-rotation` 设置命名空间中（与 `settings.yaml` 相同的位置）。

### `settings.yaml`

```yaml
dsh-key-rotation:
  switchCodes: [QUOTA, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, EMPTY_RESPONSE, UNKNOWN_MODEL]
  cooldownMs: 60000
  providers:
    # `provider` is the id of a provider registered with dsh, as it appears
    # in Settings -> Models. `keys` are CREDENTIAL NAMES, never key values.
    - provider: my-provider
      keys: [MY_PROVIDER_API_KEY, MY_PROVIDER_API_KEY_2, MY_PROVIDER_API_KEY_3]
    - provider: another-provider
      keys: [ANOTHER_PROVIDER_API_KEY, ANOTHER_PROVIDER_API_KEY_2]
```

### 字段·默认值·描述
- **字段**：`switchCodes` · **默认**：`[QUOTA, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, EMPTY_RESPONSE, UNKNOWN_MODEL]` · **描述**：触发按键开关的错误代码。
- **字段**：`cooldownMs` · **默认**：`60000` · **描述**：耗尽的钥匙保持不旋转的时间。
- **字段**：`providers` · **默认**：— · **描述**：`[{ provider, keys: [envName, ...] }]`。 `keys` 是凭证/环境 **名称**，而不是键值本身。

### 密钥如何存储

插件配置仅通过 **名称** 引用键（例如 `MY_PROVIDER_API_KEY`）。这些值存在于 dsh **Credentials** 服务或 `$DSH_HOME/.credentials.yaml` 中 - 绝不存在于插件配置中。

输入到密钥轮换卡中的密钥将被写入同一凭证存储中：该值会传输到主机一次，并且永远不会发送回浏览器。只有**最后 5 个字符**是，因此可以在 UI 中区分两个键。启动环境提供的密钥显示为只读，因为在这里覆盖它无论如何都会被隐藏。

## 它是如何工作的

```
request ──► {provider: rotation} clone route ──► pick next healthy key in pool
        ┌────────┐   on switchable failure retry with next key, stay in cooldown
        └─────────┘
```

- 插件修补 `ctx.credentials.resolve`，以便池引用解析为当前健康密钥（循环，跳过冷却中的密钥）。
- 它拦截 `llm/stream` 以在可切换失败后重试下一个键的请求，而不是向调用者显示错误。这个钩子故意**不是** `async`：循环直接迭代其结果，并返回一个承诺，每次都会中断。
- 提供者身份永远不会改变——只有解析的密钥会改变——这使得适配器的重放状态在多次调用过程中保持一致。

返回卡的两条仅本地路由：`GET /dsh-key-rotation/status`（密钥状态、轮换计数器、每个密钥的最后 5 个字符）和 `PUT|DELETE /dsh-key-rotation/key`（存储或删除一个密钥值）。两者都拒绝任何来自环回的非同源请求。

## 结构

```
dsh-key-rotation/
├── package.json            # dsh bundle/plugin metadata + peerDependencies
├── cordis.patch.yml        # bundle layer: registers the virtual route "rotation"
├── lib/index.js            # host: pools, credentials.resolve patch, stream retry
├── lib/client.js           # browser: Settings → Key Rotation panel
└── README.md
```

## 安全说明

- 键**值**永远不会离开您的凭证存储；插件配置仅保存 env/credential **names**。
- `switchCodes` 是错误分类字符串，而不是表达式——不涉及任何秘密。