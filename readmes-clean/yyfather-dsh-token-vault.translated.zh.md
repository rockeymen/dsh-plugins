# @yyfather/dsh-token-vault

**DeepSeek Harness 的安全凭证库** · 凭证库插件

将您的 GitHub / npm / API 令牌存储在 DSH 自己的凭证存储中（`ctx.credentials` → `~/.credentials.yaml`）。 **秘密永远不会离开主机** - 没有纯文本文件，没有模型上下文，没有浏览器往返。代理通过 `vault_run` 使用令牌，仅将它们注入子进程环境中； `vault_show`（单一披露路径）需要显式的 `confirm: true`。

> 设置 → 凭证库录入一次，之后所有 GitHub/npm 操作均由 Host 侧代持。

## 工具（面向代理）

### 工具·目的
- **工具**：`vault_list` · **目的**：仅列出存储的令牌名称（从不值）
- **工具**：`vault_has` · **目的**：检查一个令牌的存在
- **工具**：`vault_set` · **目的**：存储/更新令牌（值从不回显）
- **工具**：`vault_remove` · **用途**：删除令牌
- **工具**：`vault_import` · **目的**：从`gh auth token`（来源：gh）或`~/.npmrc`（来源：npm）导入
- **工具**：`vault_run` · **目的**：使用通过 env 注入的令牌运行 `gh/npm/npx/node/git`（github/gh → `GH_TOKEN`，npm/node → `NPM_TOKEN`，`env_name` 覆盖）；输出不包含秘密
- **工具**：`vault_show` · **目的**：显示一个令牌（**需要 `confirm: true`**，仅在明确的用户请求时）

## 安装

```sh
dsh plugin --profile desktop add @yyfather/dsh-token-vault
```

该包声明了 `dsh.bundle.patch`，因此它会自动安装；重启DSH桌面即可激活。然后从**设置→市场→已安装**（启用/更新/卸载）进行管理，或者将令牌粘贴到**设置→凭证库**中。

## 安全设计

- 存储：DSH 凭证记录空间（`dsh-token-vault/<name>`、原子 `modifyRecord`）— 没有新的明文文件。
- 用法：`vault_run` 仅将令牌放置在子环境中； stdout/stderr/logs 永远不会包含它。
- 披露：`vault_show`是唯一的泄漏路径并要求`confirm: true`；使用规则建议使用后轮换。
- 自动注入的提示部分 `token-vault-usage`：代理绝不能打印或保留令牌。

## 结构

- `lib/index.js` — 主机：`ctx.tools.register`，用于 7 个金库工具； `webServer`航线`/vault/status|set|remove|import`； `systemPrompt.section`使用规则
- `lib/client.js` — 浏览器 `__ModuleLoader__` 捆绑包：设置 → 杠杆库（添加/导入/删除，从不显示值）
- `cordis.patch.yml` — 捆绑安装补丁
- `package.json` — 符合市场格式（严格 `inject`、完整 `exports` 包括 `./client` 和 `./cordis.patch.yml`）