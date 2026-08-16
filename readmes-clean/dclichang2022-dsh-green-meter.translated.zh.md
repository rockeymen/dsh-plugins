#dsh-green-meter

**DeepSeek Harness 的能源和碳计量 — 查看您的代理会话费用。**

一个 [dsh-plugin](https://github.com/topics/dsh-plugin)，将每个模型调用转换为 **能源 (J/kWh)**、**碳足迹 (g CO2e)** 和 **电力成本 (CNY)** - 根据代币核算估算，因此它可以与任何 API 支持的提供商（DeepSeek API、OpenAI 兼容端点、本地 vLLM）配合使用，而无需接触硬件。

安装它，像往常一样聊天，并实时查看会话的能源账单。

## ✨ 特点

### 表面 · 你所看到的
- **表面**：**Composer 底座**（在输入框下方始终可见）· **您所看到的**：实时 `能耗 1.5 kJ · 碳 0.2 g` 读数 + 每转能量迷你图
- **表面**：**详细信息面板**（单击读数）·**您所看到的**：每回合能量图表、每个请求能量列表、会话总计（代币/能量/碳/**电力成本**）、**通过缓存节省的碳 ≈ N 棵树每年**
- **表面**：**`/green`** · **您所看到的**：单命令会话能源报告
- **Surface**：**`green_meter`工具** · **所见即所得**：代理商可以随时查询自己的能源、碳、成本和预算
- **表面**：**能源预算** · **您所看到的**：可选的每会话预算 — 超出预算的步骤将被拒绝并发出警告
- **Surface**：**JSONL 账本** · **您所看到的**：记录每个模型调用，准备供您自己分析

## 🚀 快速开始

```bash
# 1. Install into your dsh profile
cd ~/.dsh/profiles/web          # (Windows: %USERPROFILE%\.dsh\profiles\web)
pnpm add dsh-green-meter dsh-client-ui-green-meter

# 2. Mount the plugins in your profile's cordis.patch.yml (see examples/)
```

```yaml
- insert:
    - id: green-meter
      name: 'dsh-green-meter'

    - id: ui-green-meter
      name: 'dsh-client-ui-green-meter'
      config:
        panelPlacement: popover   # popover = zero-config; sidebar = optional patch
```

重启`dsh web`，刷新，在composer下方出现读数。随时输入 `/green`。

### 完整体验：侧边栏面板（可选）

`panelPlacement: sidebar` 在侧边栏的空白区域内渲染细节面板。应用提供的补丁并重建一个 DSH 包：

```bash
cd /path/to/deepseek-harness
git apply /path/to/dsh-green-meter/patches/ui-sidebar-sidebar-energy.patch
pnpm --filter @deepseek-ai/dsh-client-ui-sidebar bundle
```

## ⚙️ 配置

### 键·默认·含义
- **按键**：`profile` · **默认**：`proxy` · **含义**：校准配置文件（`proxy`、`qwen-h20-*`、`gemma-h20-*`、`qwen3-4b-*`）
- **关键**：`carbonFactorKgPerKwh` · **默认**：`0.5777` · **含义**：电网碳强度
- **按键**：`electricityPriceCnyPerKwh` · **默认**：`0.56` · **含义**：电价（元/kWh）
- **密钥**：`dir` · **默认**：`<DSH_HOME>/green-meter` · **含义**：账本目录
- **按键**：`budgetJ` · **默认**：`0`（关闭） · **含义**：会话能量预算（以焦耳为单位）

环境回退：`DSH_GREEN_PROFILE`、`DSH_GREEN_CARBON_FACTOR`、`DSH_GREEN_PRICE_CNY`、`DSH_GREEN_DIR`、`DSH_GREEN_BUDGET_J`。

## 📌 方法说明

- **估计，而不是测量** - 能量是根据代币核算和校准的每个模型配置文件进行建模的；碳和成本是能源×可配置因素。
- **仅限 GPU 运行能源** — CPU、内存、冷却和碳纤维不在范围内。
- **缓存节省是反事实的** — 缓存的令牌否则将被重新计算。

## 💎 最好的泰

**[thebestai](https://thebestai.net)**是我们的人工智能平台。 欢迎大家通过反馈意见可以使用我们的AI Greentoken系列服务。

## 发展

```bash
pnpm install
pnpm test
```