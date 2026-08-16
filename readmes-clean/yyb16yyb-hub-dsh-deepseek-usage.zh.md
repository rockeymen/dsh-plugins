# dsh-deepseek-usage

[English](README.md) | 中文

DeepSeek Harness 插件：**实时显示 DeepSeek API 用量信息**。

- 💰 **账户余额**：轮询 DeepSeek `/user/balance`（默认每 30s），显示总额/赠送/充值余额与可用状态
- 📊 **用量统计**：通过 `llm/stream` waterfall 实时统计请求次数与 token（输入/输出/缓存读/缓存写/思考），支持「全部 / 今日 / 近 60s」三个窗口
- 💸 **花费估算**：按模型单价（内置 deepseek-chat / deepseek-reasoner 默认价目表，可配置覆盖）估算花费
- 🖥️ **Web UI dock**：输入框下方的实时统计条（`conversation.composer.dock` 槽位），自动刷新 + 手动刷新
- ⚠️ **余额低告警**：余额低于阈值（默认 20）dock 变琥珀色、低于阈值 1/5 变红色，并在跨过阈值时发送一次浏览器通知（需已授予通知权限）
- 📋 **设置页用量面板**（`settings.section` 槽位）：余额卡片、三窗口用量、按模型单价表、**按会话用量明细表**（含会话标题）
- 🛠️ **模型工具**：`deepseek_usage`，agent 可直接查询余额与用量

## 安装

### 从 GitHub（推荐）

```sh
dsh plugin --profile web add github:yyb16yyb-hub/dsh-deepseek-usage
```

⚠️ **首次安装需授权构建**：pnpm ≥ 10 默认拒绝运行 git 依赖的 `prepare` 脚本（安装时从源码构建出 `lib/`）。第一次 `add` 会失败并提示，把 pnpm 打印的包键加入该 profile 的 `pnpm-workspace.yaml` 后重新执行：

```yaml
allowBuilds:
  dsh-deepseek-usage: true
```

建议锁定 commit 以获得可复现的安装：`dsh plugin --profile web add github:yyb16yyb-hub/dsh-deepseek-usage#<sha>`。

### 本地目录 / tarball

```sh
dsh plugin --profile web add /path/to/dsh-deepseek-usage   # 本地目录（预构建好 lib/）
dsh plugin --profile web add ./dsh-deepseek-usage-0.1.0.tgz # pnpm pack 产物
```

安装后**重启 `dsh web`** 生效（client 模块表在启动时扫描）。

卸载：

```sh
dsh plugin --profile web remove dsh-deepseek-usage
```

## 配置

API Key 按以下优先级解析（每次轮询重新解析，改动即时生效）：

1. 插件配置 `apiKey`
2. **dsh 凭据系统**（`ctx.credentials`）：进程环境变量 → `~/.dsh/.credentials.yaml` → 项目 `.env` → 用户 `.env`。在 Web 设置页「模型」里填的 DeepSeek Key 就存在 `~/.dsh/.credentials.yaml`，插件会自动找到，**无需额外配置**
3. 已注册的 `llm-deepseek` 设置节中存储的 `apiKey`（若有）

在 profile 的 `cordis.patch.yml` 中覆盖插件的行即可配置：

```yaml
- id: deepseek-usage
  config:
    apiKeyEnv: DEEPSEEK_API_KEY
    pollIntervalMs: 60000      # 余额轮询间隔（ms，最小 5000）
    showBalance: true
    showTokens: true
    showCost: true
    alertThreshold: 20         # 余额低告警阈值（账户货币单位；0 = 关闭）
    maxSessions: 200           # 会话明细保留上限（超出按最近活跃裁剪）
    pricing:
      deepseek-chat:
        input: 2               # ¥ / 1M tokens
        output: 3
        cacheRead: 0.5
      deepseek-reasoner:
        input: 4
        output: 16
        cacheRead: 1
```

> 花费为**估算值**：默认价目表为常见公开定价，请以 DeepSeek 官方最新价格为准，可通过 `pricing` 覆盖。

## Web UI

- **输入框下方统计条**：余额 · 今日请求 · token · 估算花费 · 更新时间，每 30s 自动刷新（跟随宿主 `pollIntervalMs`），点击「刷新」立即拉取。
- **余额告警**：余额低于 `alertThreshold` 时统计条变琥珀色并显示 ⚠，低于阈值 1/5 变红色；跨过阈值时若浏览器已授权通知权限，会发送一次系统通知（`Notification.permission === 'granted'` 才发送，不主动弹授权）。
- **设置页「DeepSeek 用量」面板**（设置 → 侧边栏底部按钮打开后可见）：余额卡片（总额/赠送/充值/状态）、全部/今日/近 60s 三窗口用量、按模型单价与用量表、以及**按会话的用量明细表**（会话标题、请求数、输入/输出/缓存 token、最近使用时间）。

数据来自同源端点 `GET /dsh-deepseek-usage`（`?refresh=1` 强制刷新），API Key 只存在宿主机侧，不会进入浏览器。

## 工具调用

agent 可调用 `deepseek_usage`：

- 无参数：返回全部窗口的余额 + 用量摘要
- `scope`：`total` / `today` / `rolling` 选择窗口

## 开发

```sh
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # esbuild → lib/index.js（宿主半）+ lib/client.js（浏览器半）
```

### 结构

```
src/
├── index.ts        # 宿主半：apply()、llm/stream 钩子、deepseek_usage 工具、HTTP 路由
├── balance.ts      # DeepSeek /user/balance 客户端与轮询器
├── stats.ts        # 用量统计（total/today/rolling 三窗口、按模型、按会话）
├── config.ts       # schemastery 配置 schema
└── client/
    ├── index.ts    # 浏览器半：注册 locale + composer.dock / settings.section 槽位
    ├── api.ts      # 共享：端点类型、fetch、格式化、告警级别
    ├── UsageDock.tsx        # 输入框下用量统计条（含余额告警）
    ├── UsageSettingsSection.tsx  # 设置页用量面板（余额/用量/价目/会话明细）
    └── locales.ts  # 中英文案
```

### 构建要点

- 宿主半保持 `@deepseek-ai/*` external，从 profile 的 node_modules 解析（cordis 运行时单例）
- 浏览器半按 `packages/client/web/src/platform.ts` 的平台模块表 external（react、cordis、slots 等），其余全部内联；产物以 `window.__ModuleLoader__.load({ id, factory })` 包装，由 Web 壳的模块加载器装载

## 安全提示

余额轮询使用与 LLM 请求相同的 API Key；插件不会把 Key 发送到浏览器端。安装第三方插件前请自行审阅源码。