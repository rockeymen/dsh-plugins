#deepseek-peak

一个插入式 dsh 插件
[`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness)
显示 DeepSeek V4 API 当前高峰/非高峰定价的 Web UI
状态，让您可以在高峰时段暂停 LLM 并排空队列
单独监视您的帐户余额，并在出现异常情况时向您发出警告
余额低于您设置的阈值。

![高峰时段插件显示高峰药丸以及队列和
余额卡下方展开](./docs/pill-preview.png)

*会话标题中的 PEAK 药丸、BALANCE 行以及
刷新和充值操作，以及每个型号的 30 天高峰/非高峰
条形图（v4-pro 和 v4-flash）。当服药时药丸呈琥珀色
余额低于配置的 `lowBalanceWarningUsd`
阈值。*

## 它的作用

- **Pill** （始终可见，位于会话旁边的会话标题中
  日志按钮）。从浏览器时钟读取当前相位
  内置 UTC 时间表：
  - 非高峰时段绿色
  - 高峰时段呈红色（非高峰费率的 2 倍）
  - 预览新赛程时获得 `PRE-CUTOVER` 徽章
  - 下一阶段边界的实时倒计时
  - 预切换时的 `→ live` 目标箭头，或 `→ next phase HH:MM`
    切换后的箭头
  - 药丸右边缘的暂停开关：打开时和阶段
    达到峰值时，LLM 流被门控，用户消息队列而不是
    跑步
  - **当账户余额低于时琥珀色边框+点+标签
    配置的 `lowBalanceWarningUsd` 阈值**（默认 1.00 美元）。
    覆盖相位颜色，因此低平衡一目了然。

- **工具提示**（悬停在药丸打开时）。下展开
  药丸：
  - **BALANCE** 行显示当前 DeepSeek 账户余额
    （主机通过 `/api/peak-hours/balance` 路由，因此 API 密钥永远不会
    离开线束流程）。右边有两个作用药丸：
    - **刷新** — 绕过 5 分钟主机缓存和浏览器缓存
      因此，刚刚充值的用户无需等待即可看到新号码
      自然刷新。
    - **充值** — 在中打开 `https://platform.deepseek.com/top_up`
      新标签。
  - 用户在其中运行的每个模型的每个模型图表卡
    过去 30 天（v4-pro、v4-flash）。每张卡片都有一个微小的内联线
    SVG 每日条形图，30 天宽，顶部有峰值（红色）
    非高峰（绿色）。分割是根据每个事件的 UTC 计算的
    对照时间表的时间戳。
  - 一个小图例，以便高峰/非高峰的划分清晰易读，无需
    工具提示。
  - 当法学硕士被门控并且队列中有项目时，**队列卡**
    出现在图表下方，其中每条排队消息占一行，并且
    每行 **发送箭头** 分派该单个消息
    立即（绕过全局暂停）。

- **设置**（在现有的 `peak-hours` 命名空间上注册
  主机的设置平面，通过 `Settings → Plugins →
  Plugin configuration → Peak hours` 公开）：
  - `paused` — 布尔值，与药丸切换写入的值相同。两个
    将路径写入同一字段；最后写入获胜。
  - `lowBalanceWarningUsd` — 数字，阈值，低于该阈值
    药丸变成琥珀色。默认`$1.00`。允许零（始终
    警告）；否定被模式拒绝。

- **后台刷新**：
  - 状态轮询在浏览器上每 2 秒运行一次（Pill 的 `usePeakHoursState`
    钩子），因此切换/阈值/队列/平衡更改会传播
    不到两个刻度。
  - 余额在服务器端获取并缓存 5 分钟，并带有
    对暂时性错误进行 30 秒快速重试，因此短暂的故障不会造成影响
    缓存。
  - 图表的每日存储桶来自主机
    `/api/peak-hours/usage`路线，走会话保持
    日志。浏览器内的轨迹行走是
    线束未运行的情况。

> 事实来源：[`api-docs.deepseek.com/quick_start/pricing/`](https://api-docs.deepseek.com/quick_start/pricing/)。
> 计划窗口和切换日期作为常量嵌入
> 在`src/client/domain.ts`。 `PRE-CUTOVER` 窗口是周期
> 在“新时间表已公布”和“新时间表已公布”之间
> 强制执行”；药丸会显示持续时间，并且门是
> 无论切换状态如何，只要 `paused && peak` 就接合。

这个仓库包含两件事：

1. **`harness-plugin/`** — `dsh-plugin` Cordis 客户端包，适用于
   利用网络用户界面。这才是真正的融合。

2. **`widget.html`** + **`serve.js`** — 一个独立的浏览器小部件
   您可以在任何浏览器中固定为选项卡，无需使用安全带。有用作为
   不运行该工具的用户的后备。它不包括
   暂停/队列/平衡功能；这是一个阶段+倒计时显示
   仅。

harness 插件很丰富。独立的小部件是
“在第二台显示器上安排”显示。

## 安装（线束插件）

要求：
- 签出的 `deepseek-harness` 工作树（任何最近的提交）
- `node` ≥ 22.19
- `pnpm` ≥ 11（与`npm i -g pnpm`一起安装一次）

```sh
# Clone this repo
git clone https://github.com/YMRYMR/deepseek-peak.git
cd deepseek-peak

# One-liner installer: takes your harness clone as the argument
./install.sh /path/to/deepseek-harness
```

安装程序的作用（每个步骤都是幂等的，如果已经完成，则跳过）：

1. 复制 `harness-plugin/` → `<harness>/packages/client/ui-peak-hours/`
2. 将 `ui-peak-hours` 行添加到 `packages/bundle/web-app/cordis.patch.yml`
3.将工作区dep添加到`packages/bundle/web-app/package.json`
4.添加`tsconfig.client.json`的项目引用
5.添加`tsconfig.base.json`的路径映射
6. 在安全带中运行 `pnpm install`
7. 运行`pnpm run build:lib:host`（生成Typert合约所需）
8.运行`pnpm --filter @deepseek-ai/dsh-client-ui-peak-hours run bundle`
9. 运行线束验证门（仅警告）

然后启动线束：
```sh
cd /path/to/deepseek-harness
pnpm dsh web
```

打开`http://127.0.0.1:3080/`。药丸出现在右上角
会话标头，**会话日志按钮左侧**。

第一次硬刷新浏览器 (Ctrl+Shift+R)，以便新的
`__DSH_BOOT__` 名单加载。

### 你应该看到什么

一个紧凑的药丸，宽约 180 像素，形状如下（从左到右）：

```
[●] PEAK PRE-CUTOVER  08h 11m  →  live   [pause-switch]
```

- `[●]` 是彩色点 — 绿色表示非高峰，红色表示高峰，**琥珀色
  当余额低于配置的阈值**（覆盖
  相色）
- 阶段标签和 `PRE-CUTOVER` 徽章（仅在阶段期间）
  预切换窗口）
- 下一个阶段边界的倒计时（1 Hz 刻度）
- 目标箭头：`→ live`，预切换时，`→ next phase HH:MM`
  割接后
- 右侧边缘的暂停开关（打开时为红色，关闭时为灰色）

### 将药丸悬停

卡片在药丸下展开：

- **BALANCE** 行 — 您的 DeepSeek 账户余额，带有 **REFRESH**
  和右侧的 **充值** 操作
- **每个模型图表卡** 适用于您在尾随中使用的每个模型
  30 天（通常是 v4-pro 和 v4-flash）。微小的内联-SVG 每日栏
  图表，30 天宽，峰值（红色）位于非峰值（绿色）上方。日总计
  显示在每张卡的右上角。
- 图表下的一个小**图例**：红色 = 高峰，绿色 = 非高峰
- 如果队列有项目，则一张**队列卡**，每个队列一行
  消息和用于手动调度的每行发送箭头

### 高峰工作流程暂停

1. 单击倒计时右侧药丸的暂停开关。
2. 当开关打开且相位达到峰值时，下一个 LLM 流
   （用户消息或子代理工具调用）被门控。线束显示
   请求已排队，工具提示会展开以显示队列
   卡。
3.队列是先进先出的。每个项目都会在切换时发送
   翻转或相位离开峰值。
4. 要分派单个项目而不翻转全局暂停，请单击
   队列卡中该行的每行**发送箭头**。

### 低余额警告

打开**设置→插件→插件配置→高峰时间**并设置
`lowBalanceWarningUsd` 到您首选的楼层（默认 `1.00`）。的
当真实账户余额低于以下时，药丸会切换为琥珀色
值。直接在`~/.dsh/settings.yaml`中覆盖相同的字段：

```yaml
peak-hours:
  paused: false
  lowBalanceWarningUsd: 1.5
```

接下来的 2 秒状态轮询将自动获取新值。

### 卸载

```sh
./uninstall.sh /path/to/deepseek-harness
```

该脚本删除插件目录并打印四个小
您需要手动删除的连线条目（每行一行）
`cordis.patch.yml`、`package.json` 和两个 tsconfig 文件）。

## 安装（独立小部件）

无需安全带。只是一个提供静态 HTML 页面的 Node 服务器。

```sh
cd deepseek-peak
node serve.js
```

在默认浏览器中打开 `http://127.0.0.1:3737/`。固定选项卡。
在终端中按 Ctrl+C 停止。

独立小部件包括 24 小时峰值窗口时间线、
V4-Flash/V4-Pro型号选择器，以及实际$