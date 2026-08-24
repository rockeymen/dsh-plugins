#dsh-trading

作为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) 插件构建的交易**研究**工作台。无分叉，无补丁核心 — 只是您堆叠在库存 `web` 或 `headless` 配置文件上的捆绑包。

> **状态：早期脚手架。** dsh 本身处于开发者预览阶段，并且进展很快；预计双方都会发生重大变化。

## 工作台

在带有可选外壳框架的 `dsh web` 下，应用程序变为图表优先：
持久的实时图表栏位于左侧，对话位于右侧。

```
┌──┬────────────────────────────────────┬─────────────────────────┐
│  │  CC.BTCUSDT   1m 5m [15m] 1h 1d    │  ⌄ Market Analyst       │
│▸ │  ┌──────────────────────────────┐  │                         │
│  │  │        ╱╲    ╱╲              │  │  MU is coiling under    │
│s │  │  ╱╲   ╱  ╲__╱  ╲_ ── 118,400 │  │  118.4k; the 15m ADX …  │
│e │  │ ╱  ╲_╱          ╲ ── 116,900 │  │                         │
│s │  │▁▂▃▁▂▄▃▁▂▃▅▂▁▃▂▁▄▃▁▂▃         │  │  ▸ annotate_chart       │
│s │  └──────────────────────────────┘  │    ✎ 6 marks — Show     │
│  │  ● live · 15m · 5:05:10 PM   📌    │                         │
└──┴────────────────────────────────────┴─────────────────────────┘
   rail        the chart you drive          the agent you talk to
```

该列是**您的**：输入一个交易品种，选择一个时间范围，然后它会在
环回通道根本不经过模型。它还**遵循
对话** - 当代理绘制某些内容时，该列会加载该内容
仪器*实时*而不是镜像代理的冻结快照。感人
图表——一个符号、一个时间框架——**固定**它，📌芯片这么说；
从那时起，代理商的图纸将作为药丸的**展示**报价送达
将图表从你身下取出。点击芯片开始关注
再次。

绘图在两个方向上的工作方式相同。 `annotate_chart` 级别、区域
路径落在活动柱上；同一分析的*散文*一半——
水平表、牛市/熊市情景卡 - 留在聊天中，阅读
文本所属。循环结束：面板发布它所显示的内容
到主机，以便代理可以读取您的图表（`get_chart_view`，加上
每回合一行上下文注入）而不是要求您对其进行屏幕截图。

## 演示

![图表栏固定为美光科技，而代理商的标记为比特币，所以什么也没有落地；一颗药丸就能提供这些信息，只需点击一下即可加载带有六个标记的图表](media/workbench-preview.gif)

该色谱柱固定在 Micron 上。代理人的六分是比特币——a
不同的工具，因此谓词拒绝合并并且**没有任何内容
在错误的图表上**。他们以药丸的形式提供；一键加载
带有标记的图表。右上角的时钟是实时反馈的
本地 OpenD，勾选整个剪辑。

▶ **[观看完整的 90 秒演示（带旁白）](https://www.youtube.com/watch?v=ULeROBoBGTc)** —
上面的循环是其中的一个节拍。全切也走贝壳，
符号框和时间范围行、实时列上的代理绘图，以及
每回合上下文线，使其无需请求即可读取您的图表
截图。

这些都不是模型：剧作家以 1920x1080 的分辨率捕捉真实场景
对阵现场 Futu OpenD 的比赛，图表在每场比赛中不断滴答作响
射击。

早期的 v0.2 演示 — 聊天提要中的图表卡

▶ **[YouTube 上带旁白的 80 秒演示](https://www.youtube.com/watch?v=9KLpy-jPtKY)**

在图表优先 shell 存在之前记录的，仍然是 `web` 的样子
表面行为*没有* `@dsh-trading/client-frame`：代理回答
交互式图表卡，筹码从精确的每条柱中绘制指标窗格
系列模型读取，`annotate_chart` 通过
信任门 — 强制出处，价格根据真实蜡烛进行验证
窗口。

[！[dsh 网络中的交互式图表卡：根据模型自己的数字绘制的筹码切换指示器窗格； annotate_chart绘制出处门控级别](media/demo-preview.gif)](https://www.youtube.com/watch?v=9KLpy-jPtKY)

## 设计

八个包，一个依赖方向：

````
@dsh-trading/工具市场面向模型的工具（list_symbols、get_ohlcv、
                              市场快照、注释图表、渲染图表）
                              + 指标库
        │ 消耗
        ▼
@dsh-trading/market-data 接缝：ctx.marketData — 类型化蜡烛/符号接口
        ▲ 农具
        │
@dsh-trading/provider-csv 参考提供者：本地CSV文件
@dsh-trading/provider-futu 直播提供商：港股/美股/A股股票及
                              24/7 加密货币对，来自本地 Futu OpenD

@dsh-trading/risk-guard Independent：拒绝执行形状的工具名称
                              从任何插件，在 dsh 的工具/预执行门

@dsh-trading/verdict 评估工具：audit_backtest 验证
                              填充真正的蜡烛，运行种子
                              随机基线和样本量功效检查；
                              lint_strategy_code 寻找先行泄漏。
                              老实说，判决可能未经证实。

@dsh-trading/client-chart 仅网络卡 + 持久图表列和
                              为其提供信号的环回通道；主机端，
                              get_chart_view 工具和每回合
                              让代理读取该列的上下文行
        │ 填补图表席位
        ▼
@dsh-trading/client-frame web-only：外壳框架。替换 dsh 的库存
                              三列布局行，其中图表在前 —
                              侧边栏 |图表|对话 |详细信息，
                              默认情况下为 70/30，侧栏有栏杆 — 并且
                              声明 `trading.chart` 席位
```

- **`market-data`** defines the seam and nothing else (its only peer is cordis). Every consumer talks to `ctx.marketData`; every data source hides behind `MarketDataProvider`.
- **`provider-csv`** is the *bring-your-own-data* template: ~100 lines, local `<根>/<符号>/<时间范围>.csv ` files. Copy it to put ClickHouse, a broker API, or CCXT behind the same interface — tools upstream never change.
- **`provider-futu`** is that template filled in against a real broker gateway: HK / US / A-share equities and crypto pairs (`CC.BTCUSDT`), the last being the only instrument that keeps moving at 3am, which makes it the honest way to check that "live" is live. It reads `Qot_GetKL` rather than `Qot_RequestHistoryKL` on purpose: GetKL rides the subscription quota and serves the most recent bars (≤1000), while RequestHistoryKL spends a scarce historical quota OpenD rations by account assets. The trade is stated in the provider's own `description` and honoured in its behaviour — `start` / `end` **过滤**获取的窗口，它们不查找，因此对较旧范围的查询会诚实地返回空而不是悄悄错误。设置请参见【实时数据](#live-data-futu-opend)；请注意，OpenD 是一种帐户绑定的个人网关，这是一项许可事实，而不是配置事实。

`futu-api` 是一个**对等**依赖项，故意取消固定。 SDK 的版本与*您*安装的 OpenD 耦合，而不是与此包耦合，Futu 直接声明其包版本遵循自己的方案而不是 semver - 因此没有范围表示“兼容”，并且两者必须手动对齐。安装与您的 OpenD 匹配的 `futu-api`（`10.9.x` SDK for a `10.9.x` OpenD）。提供商通过 `GetGlobalState` 在连接时自行检查这一点，并在协议行不同时记录一条警告，命名两个版本 - 否则会表现为被拒绝的 handshake 或空解码，没有任何可指出的。
- **`tool-market`** 在`ctx.tools`上注册只读分析工具。 `market_snapshot` 在一次调用中返回完整的多时间框架指标体系（RSI、慢速随机指标、ADX/DI、MACD、MFI、ATR、SMA/EMA 态势、布林线）以及粗略状态标签；当结构很重要时，`get_ohlcv` 供应生棒。指标数学是纯粹且确定性的 - 教科书定义与 Wilder 平滑（Wilder 定义的地方） - 因此值可以与任何图表平台协调一致，并且会话日志重播会重新计算相同的模型可见数字。
- **`client-chart`** 绘制图表，并从两个独立的端驱动它们。模型的 `market_snapshot` / `annotate_chart` 结果通过 `tool.call.toolview` 接缝渲染为卡片。用户直接驱动持久列：符号框和时间范围行通过包的主机一半发布的环回 RPC 通道与 `ctx.marketData` 通信。第二条路径是重点——工作台的唯一输入是“希望代理调用正确的工具”，当代理宁愿聊天时，工作台就会停止工作，这正是发生的情况。