# dsh-client-pricing

**DeepSeek Harness 客户端插件，以免你在高峰时刻不小心享受到梁子的两倍价格**：在会话顶栏顶部显示 **DeepSeek API 当前生效价格**，随当前模型（flash/pro）与峰谷时段自动切换。

## 功能

- **顶栏内联显示**（整行水平居中，单行不换行）：
  - 三态徽标：峰谷定价生效前显示 `现行一口价`（中性灰）；生效后显示 `高峰`（橙）/ `空闲`（绿）
  - 当前生效三价：输入（缓存未命中）/ 输出 / 缓存命中，单位 元/1M tokens
- **hover 浮层**：当前模型完整价目表（高峰/空闲两档 × 缓存命中/未命中/输出）+ 时段规则说明；峰谷生效前额外预告两档价格并注明生效时间
- **自动跟随模型**：订阅 `modelDirectories`，flash ↔ pro 切换即时换价；非 flash/pro 模型自动隐藏
- **自动切换峰谷**：每 30s 重算档位，跨时段边界自动更新
- **双价目表**：官方 2026-08-17 00:00（北京时间）峰谷新价生效前显示现行一口价，生效后自动切换峰谷价

## 官方价目表

来源：[DeepSeek API Docs · 模型 & 价格](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)，单位 元/1M tokens。原始抓取存档见 [`docs/sources/`](docs/sources/)。

| 生效区间 | 模型 | 缓存命中 | 缓存未命中 | 输出 |
|---|---|---|---|---|
| 现在 → 2026-08-17 00:00 北京 | flash | 0.02 | 1 | 2 |
| 同上 | pro | 0.025 | 3 | 6 |
| 2026-08-17 起 · 空闲 | flash | 0.05 | 1.5 | 4.5 |
| 2026-08-17 起 · 高峰 | flash | 0.10 | 3.0 | 9.0 |
| 2026-08-17 起 · 空闲 | pro | 0.15 | 4.5 | 13.5 |
| 2026-08-17 起 · 高峰 | pro | 0.30 | 9.0 | 27.0 |

- **高峰时段**（北京时间）：9:00–12:00、14:00–18:00（左闭右开），其余为**空闲**时段
- **空闲价 = 高峰价 × 0.5**
- 时段按 Asia/Shanghai（UTC+8，无夏令时）计算

## 安装

### 方式一：npm 包（推荐）

```powershell
# 1. 安装到 dsh web profile（自动追加 loader 行）
./install.ps1

# 或用 dsh 自带命令（等价于 pnpm add，但不会自动加 loader 行）
dsh plugin --profile web add dsh-client-pricing
```

### 方式二：GitHub Release tarball

```powershell
./install.ps1 -Package "https://github.com/Miyazawai/dsh-client-pricing/releases/download/v0.1.0/dsh-client-pricing-0.1.0.tgz"
```

### 方式三：手动安装

```powershell
# 1. 进入 profile 目录安装包
cd ~\.dsh\profiles\web
corepack pnpm add dsh-client-pricing

# 2. 在 cordis.patch.yml 追加 loader 行（幂等，已存在则跳过）
- insert:
    - id: dsh-client-pricing
      name: 'dsh-client-pricing'
```

### 重启

> ⚠️ **新增 loader 行后必须重启 `dsh web`**（`ClientModuleRegistry` 对包元数据永久缓存）：
> 停止当前 dsh web（Ctrl+C 或杀掉 3080 端口进程），再运行 `dsh web`，刷新 http://127.0.0.1:3080。
>
> 之后**改代码只需 `npm run build`**，HMR 500ms 内自动热更，无需重启。

## 卸载

```powershell
cd ~\.dsh\profiles\web
corepack pnpm remove dsh-client-pricing
# 并从 cordis.patch.yml 删除 dsh-client-pricing 行，重启 dsh web
```

## 开发

```bash
npm install        # 首次
npm run typecheck  # tsc --noEmit
npm test           # node --test src/*.test.ts
npm run build      # esbuild → lib/client.js（DSH 加载器格式）
```

### 结构

```
├── package.json          # DSH client 插件 manifest（dsh.client.platform: "web"）
├── install.ps1           # 一键安装脚本
├── scripts/build.mjs     # esbuild 打包 → lib/client.js
├── src/
│   ├── pricing.ts        # 纯逻辑：getTier / getPrices / formatPrice（可测 seam）
│   ├── pricing.test.ts   # node:test 单测
│   └── client.tsx        # React 组件 + 插件入口
├── lib/
│   ├── client.js         # 构建产物（DSH 浏览器加载器消费）
│   └── index.js          # node 侧占位
└── docs/sources/         # 官方定价页抓取存档（防官网改版）
```

## 更新价格（当官方调价时）

价格**硬编码**在 [`src/pricing.ts`](src/pricing.ts)（官方页面是静态文档，无价格 API）。官方调价后按下面任一方式更新：

### 人工改

改 `src/pricing.ts` 中的四处，改完 `npm run build`（HMR 自动热更）：

| 要改什么 | 常量/函数 |
|---|---|
| 现行一口价（峰谷生效前） | `LEGACY_PRICES`（flash/pro 的 hit/miss/output） |
| 峰谷高峰价（生效后） | `PEAK_PRICES`（空闲价 = 高峰 × 0.5，自动派生） |
| 峰谷生效时刻 | `NEW_PRICING_UTC_MS`（UTC 毫秒时间戳） |
| 高峰时段窗口 | `PEAK_WINDOWS`（北京时间小时，左闭右开） |

> 改生效时刻的换算：北京 2026-08-17 00:00 = UTC 2026-08-16 16:00 = `Date.UTC(2026, 7, 16, 16, 0, 0)`（月份从 0 计）。

改了**价目数字**或**高峰窗口**后，记得同步更新 [`README.md`](README.md) 的价目表和 [`src/pricing.test.ts`](src/pricing.test.ts) 的期望值，然后 `npm test` 确认。

### 让 AI agent 改（封装提示词）

把下面整段复制给任何 AI 编程 agent（Claude Code / Cursor 等）：

> 你是 dsh-client-pricing 仓库的维护者。请更新 DeepSeek API 定价数据，遵循仓库既有约定（TDD、纯逻辑与框架解耦）。
>
> 官方最新价目表与峰谷规则见：https://api-docs.deepseek.com/zh-cn/quick_start/pricing
>
> 任务：
> 1. 读取 `src/pricing.ts`，定位四处定价定义：`LEGACY_PRICES`（现行一口价）、`PEAK_PRICES`（峰谷高峰价）、`NEW_PRICING_UTC_MS`（峰谷生效时刻，UTC 毫秒）、`PEAK_WINDOWS`（高峰时段，北京小时左闭右开）。
> 2. 对照官方页面，更新这四处为最新值。官方规则要点：空闲价 = 高峰价 × 0.5；时段按北京时间计算；若有新的生效日期，换算为 UTC 毫秒时间戳（注意 JS 月份从 0 计）。
> 3. 同步更新 `src/pricing.test.ts` 中的期望值（含生效边界、高峰窗口边界、未知模型返回 null 等用例），保持「红→绿」：先跑测试看到失败，再实现/修正让测试通过。
> 4. 若官方模型名有变（当前映射 deepseek-v4-flash → flash、deepseek-v4-pro → pro），同步检查 `src/client.tsx` 的 `modelIdOf`。
> 5. 更新 `README.md` 的价目表与规则说明。
> 6. 验证：`npm run typecheck` 0 错误、`npm test` 全绿、`npm run build` 成功。
>
> 不要改动：插件的 slot 注册机制、CSS、构建脚本、DSH 集成层。

## 注意

- 浮层 `position:absolute` 相对 header 居中；极窄窗口下可能与两侧元素重叠（纯展示、不挡交互）。
- 模型名映射：`deepseek-v4-flash` → flash、`deepseek-v4-pro` → pro，其他模型隐藏。

## License

[MIT](LICENSE)
