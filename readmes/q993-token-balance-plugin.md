# dsh-token-balance · DeepSeek Token 余额查看器

> 面向 **DeepSeek Harness (DSH)** 的动态 Cordis 插件：在会话输入框下方**常驻显示**你的 DeepSeek 账户 API 余额（总余额 / 赠送余额 / 充值余额 / 可用状态），点击即可刷新。密钥全程只存在于 Host 进程，绝不进入浏览器。

![license](https://img.shields.io/badge/license-MIT-blue)
![platform](https://img.shields.io/badge/platform-DeepSeek%20Harness%20%2F%20Cordis-brightgreen)
![endpoint](https://img.shields.io/badge/endpoint-DeepSeek%20%2Fuser%2Fbalance-orange)

---

## 目录

- [功能特性](#功能特性)
- [效果预览](#效果预览)
- [架构总览](#架构总览)
- [快速开始](#快速开始)
- [凭据配置](#凭据配置)
- [API 响应格式](#api-响应格式)
- [目录结构](#目录结构)
- [常见问题](#常见问题)
- [安全声明](#安全声明)
- [许可证](#许可证)

---

## 功能特性

| 特性 | 说明 |
|---|---|
| 🪙 常驻显示 | 会话输入框下方（`conversation.composer.dock` 插槽）常驻余额读数条，随时可见 |
| 🔄 点击刷新 | 点击读数条即时重新查询，无需重启插件 |
| 💰 余额明细 | 悬停显示总余额、赠送余额、充值余额与可用状态 |
| 🌗 主题适配 | 使用 DSH 主题 CSS 变量（`--dsw-alias-*`），自动适配明暗模式 |
| 🔐 密钥安全 | API Key 只经 Host 环境变量传给本地子进程，不回显、不进浏览器、不落库 |
| 🧩 即插即用 | 读取 DSH 凭据库中已配置的 `DEEPSEEK_API_KEY`，无需额外设置界面 |

## 效果预览

在任意会话的输入框下方会出现类似这样的常驻读数条：

```
┌─────────────────────────────────────────────────────────┐
│  ⌨ 输入框                                                │
└─────────────────────────────────────────────────────────┘
  余额 ¥110.00        ← 点击刷新；悬停显示：余额 ¥110.00 · 可用 · 赠送 ¥10.00 · 充值 ¥100.00
```

- 加载中：`余额查询中…`
- 成功：`余额 ¥110.00`（不可用时追加红色 `不可用` 标记）
- 失败：`余额获取失败，点击重试`（悬停可查看错误原因，如未配置凭据 / 网络错误）

## 架构总览

```
┌─────────────────────────── 浏览器（Client 半区）───────────────────────────┐
│  conversation.composer.dock（输入框下方读数条）                              │
│  └─ host.call('token-balance/query') ──┐                                    │
└────────────────────────────────────────┼───────────────────────────────────┘
                                         ▼
┌─────────────────────────── Host 半区（Node 进程）──────────────────────────┐
│  credentials.resolve('DEEPSEEK_API_KEY')  读取本机凭据库（~/.dsh/.credentials.yaml） │
│  subprocess.spawn(node)                   子进程发起 HTTPS 请求                │
│    └─ env: DSH_BALANCE_KEY（密钥仅此一处，不外泄）                             │
└────────────────────────────────────────┼───────────────────────────────────┘
                                         ▼
                              GET https://api.deepseek.com/user/balance
                                    Authorization: Bearer <key>
```

**传输通道说明**：DSH 的 `web.fetch` 只接受裸 URL（`WebFetchRequest = { url }`），无法携带 `Authorization` 请求头，因此本插件改走 `subprocess` + Node `fetch`：API Key 通过子进程环境变量传入，命令行参数不含任何密钥，输出仅余额数值。

## 快速开始

> 前置：DeepSeek Harness 环境（动态 Cordis 插件机制）。`src/host.js` 与 `src/client.js` 即插件的两个半区源码，将其内容分别作为 `cordis_define` 的 `code.host` / `code.client` 提交。

```text
1. 在会话中向 AI 提出：创建 token 余额查看插件（引用本仓库 src 代码）
2. AI 调用 cordis_define 定义插件 → cordis_run 激活（客户端 UI 需批准）
3. 输入框下方即出现余额读数条，点击可刷新
```

或手动方式：

1. 将 `src/host.js` 内容作为 `cordis_define` 的 `code.host`
2. 将 `src/client.js` 内容作为 `cordis_define` 的 `code.client`
3. 调用 `cordis_run` 激活

## 凭据配置

插件读取 DSH 凭据库中名为 `DEEPSEEK_API_KEY` 的凭据（存放于 `~/.dsh/.credentials.yaml`）：

```yaml
DEEPSEEK_API_KEY: sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

在 DSH 中配置凭据（让 AI 代为配置或手工编辑 `~/.dsh/.credentials.yaml`）：

```text
帮我配置凭据 DEEPSEEK_API_KEY 为 sk-xxxx
```

- 未配置凭据时，读数条显示「余额获取失败」，悬停提示 `no-credential`。
- 配置完成后点击读数条刷新即可。

## API 响应格式

DeepSeek 官方余额接口 `GET https://api.deepseek.com/user/balance`（需要 `Authorization: Bearer <key>`）返回：

```json
{
  "is_available": true,
  "balance_infos": [
    {
      "currency": "CNY",
      "total_balance": "110.00",
      "granted_balance": "10.00",
      "topped_up_balance": "100.00"
    }
  ]
}
```

插件取 `balance_infos[0]` 展示：`currency`、`total_balance`（总余额）、`granted_balance`（赠送余额）、`topped_up_balance`（充值余额），并以 `is_available` 标记账户可用状态。详见 [DeepSeek API 文档](https://api-docs.deepseek.com/)。

## 目录结构

```
token-balance-plugin/
├── README.md                     # 本文件
├── LICENSE                       # MIT
├── package.json                  # 项目元信息
├── .gitignore                    # 排除凭据/依赖等
├── src/
│   ├── host.js                   # Host 半区源码（凭据解析 / subprocess 调用余额 API / RPC）
│   └── client.js                 # Client 半区源码（composer.dock 常驻余额读数条）
└── docs/
```

## 常见问题

| 问题 | 排查 |
|---|---|
| 显示「余额获取失败」且悬停提示 `no-credential` | 未在 DSH 凭据库配置 `DEEPSEEK_API_KEY`，见[凭据配置](#凭据配置) |
| 提示 `no-node` | 当前环境未解析到 node 可执行文件，确认 DSH 宿主具备 Node 运行时 |
| 提示 `api-error` / `bad-response` | 余额 API 返回异常（如 Key 失效、网络受限），悬停提示会给出具体信息 |
| 提示网络类错误 | DSH 宿主进程需可访问 `api.deepseek.com`（模型调用本身就走该域名，通常无碍） |

## 安全声明

- API Key 仅在本机 DSH 宿主进程内使用：经 `subprocess` 环境变量传给本地 Node 子进程，**不进入浏览器、不出现在命令行、不写入日志、不持久化**。
- 插件只向 Client 返回余额数值与可用状态等脱敏数据。
- 余额查询仅用于查看本账户配额，请遵守 DeepSeek 平台服务条款。

## 许可证

[MIT](LICENSE)
