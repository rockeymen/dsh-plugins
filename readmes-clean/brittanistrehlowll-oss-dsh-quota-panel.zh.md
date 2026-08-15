# dsh-quota-panel

[English](README.md) | 中文

**dsh-quota-panel** 是 DeepSeek Harness（DSH）网页端的**提供方额度/余额状态组件**插件。

零依赖宿主端插件：为每个配置的提供方注册一条服务端代理路由
`/api/quota/` —— API Key 通过凭据系统在服务端解析，**绝不进入浏览器** ——
然后在页面注入右下角的 Harness 原生风格状态组件，支持两种尺寸：

- **收起（默认）** —— 极简胶囊：每个账户一个「独立状态点 + 数值」对
  （如 `● ¥58.36 · ● 45%`），互不干扰——哪个账户紧张只有它的点变色，
  不用文字标签，一眼扫过即可；点击展开。
- **展开** —— 完整卡片：「模型额度」标题栏（刷新/收起按钮）+ 每个提供方一行
  结构化信息（状态点、名称、主数值、次级信息，用量型提供方还有进度条），
  点收起按钮缩回胶囊。

两种尺寸都自动刷新（页面隐藏时暂停）；刷新按钮旋转反馈，重复点击不会并发请求。

胶囊里的用量百分比按**手机电量式三色**着色：健康绿、紧张琥珀、告急红，
与状态点独立对应；余额数值仅在其状态告警时着色。

组件完全使用 Harness 设计 Token（`--dsw-alias-*`、`--dsw-static-*`、
`--dsw-shadow-*`、`--dsw-font-*`）驱动，token 缺失时有合理的 fallback，
因此自动跟随产品主题（浅色/深色），不携带自己的配色。

## 效果图

收起胶囊（浅色 / 深色）：

![胶囊（浅色）](docs/capsule-light.png)
![胶囊（深色）](docs/capsule-dark.png)

展开卡片（浅色 / 深色）：

![面板（浅色）](docs/panel-light.png)
![面板（深色）](docs/panel-dark.png)

完整页面（小胶囊状态，浅色 / 深色）：

![完整页面（浅色）](docs/screenshot-light.png)
![完整页面（深色）](docs/screenshot-dark.png)

## 安装

```sh
dsh plugin --profile web add "github:brittanistrehlowll-oss/dsh-quota-panel"
# 重启 `dsh web`（bundle 层在启动时生效）
```

包声明了 `dsh.bundle.patch`，因此 `dsh plugin add` 会把它自动激活为 profile 层。

## 配置

每个提供方是 `providers` 下的一项，内置两种渲染器：

### format · 接口返回形态 · 行显示
- **format**: `deepseek-balance` · **接口返回形态**: `{ "balance_infos": [{ "currency", "total_balance", "granted_balance", "topped_up_balance" }] }` · **行显示**: `¥58.36` + 余额充足/正常/紧张/建议充值
- **format**: `opencode-usage` · **接口返回形态**: `{ "usage": { "rolling"\ · **行显示**: "weekly"\ · "monthly": { "percent", "resetsAt" } } }` · `五 10% · 周 45% · 月 22%` + 进度条 + 当前最高占用

在 profile 的 `cordis.patch.yml` 中覆盖默认配置：

```yaml
- id: quota-panel
  config:
    refreshMs: 30000
    providers:
      - id: deepseek
        label: DeepSeek
        credential: DEEPSEEK_API_KEY
        endpoint: https://api.deepseek.com/user/balance
        format: deepseek-balance
        balanceTiers: { critical: 10, warn: 20, healthy: 50 }
      - id: opencode-go
        label: OpenCode Go
        credential: OPENCODE_GO_API_KEY
        endpoint: https://opencode.ai/zen/go/v1/usage
        format: opencode-usage
        windowLabels: { rolling: 五, weekly: 周, monthly: 月 }
        warnPercent: 70
        errorPercent: 90
```

字段说明：

### 字段 · 含义 · 默认值
- **字段**: `id` · **含义**: 路由 id（`/api/quota/`），`^[a-z0-9-]+$` · **默认值**: 必填
- **字段**: `label` · **含义**: 卡片上的提供方名称 · **默认值**: 必填
- **字段**: `credential` · **含义**: 凭据引用（`$DSH_HOME/.credentials.yaml` 或环境变量） · **默认值**: 必填
- **字段**: `endpoint` · **含义**: 额度 JSON 接口，GET + `Authorization: Bearer <key>` · **默认值**: 必填
- **字段**: `format` · **含义**: 行渲染器 · **默认值**: `deepseek-balance`
- **字段**: `balanceTiers` · **含义**: （deepseek-balance）`{critical, warn, healthy}` 分级阈值 · **默认值**: `{10, 20, 50}`
- **字段**: `lowBalance` · **含义**: 旧版别名，等价于 `balanceTiers.warn` · **默认值**: —
- **字段**: `windowLabels` · **含义**: （opencode-usage）三个窗口的标签 · **默认值**: `{滚, 周, 月}`
- **字段**: `warnPercent` / `errorPercent` · **含义**: （opencode-usage）阈值 · **默认值**: 70 / 90
- **字段**: `refreshMs` · **含义**: 自动刷新间隔 · **默认值**: 60000

### DeepSeek 余额分级

默认 `balanceTiers {critical: 10, warn: 20, healthy: 50}`：

### 余额 · 状态 · 次级信息
- **余额**: `<= 10` · **状态**: error（红点 + 红数值） · **次级信息**: 建议充值
- **余额**: `10 < x <= 20` · **状态**: warn（琥珀色） · **次级信息**: 余额紧张
- **余额**: `20 < x <= 50` · **状态**: ok · **次级信息**: 余额正常
- **余额**: `> 50` · **状态**: ok · **次级信息**: 余额充足

### OpenCode 用量状态

`high = max(滚动, 每周, 每月)`：

### 用量 · 状态
- **用量**: `< warnPercent` · **状态**: ok（绿点，DeepSeek 蓝进度条）
- **用量**: `>= warnPercent` · **状态**: warn（琥珀点 + 进度条）
- **用量**: `>= errorPercent` · **状态**: error（红点 + 进度条）

## 更新日志

- **v0.3.0** — 双尺寸：收起为极简胶囊（每账户独立状态点 + 电量式三色数值），点击展开完整卡片。
- **v0.2.0** — Harness 原生卡片：设计 Token 驱动、余额分级阈值、用量进度条。
- **v0.1.0** — 初版悬浮面板：服务端额度代理 + 页面角标。

## 安全

- API Key 仅由服务端通过 `ctx.credentials` 解析，只用于服务端到提供方的请求；
  浏览器只访问 `/api/quota/`。
- 注入的卡片只使用 `createElement`/`textContent` 构建 DOM，API 返回值绝不经过
  `innerHTML`；技术错误（401、超时、凭据缺失）只写入 `title` 悬停提示，不进卡片
  正文。

## 本地开发

```sh
# 重新生成演示页 docs/demo.html + docs/demo-dark.html
node scripts/gen-demo.mjs
# 通过 Chrome DevTools Protocol 无头截图
node scripts/shoot.mjs both
# 验证演示页渲染出的 DOM
node scripts/verify.mjs [dark]
# 注入脚本的语法与内容检查
node scripts/test-page-script.mjs
```