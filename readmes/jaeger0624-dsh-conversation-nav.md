# dsh-conversation-nav

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![CI](https://github.com/Jaeger0624/dsh-conversation-nav/actions/workflows/ci.yml/badge.svg)](https://github.com/Jaeger0624/dsh-conversation-nav/actions/workflows/ci.yml)

Codex 桌面版风格的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI 对话轮次导航插件。

对话区最左侧一条钢琴键导轨，**每条用户消息一个刻度**——悬浮查看详情，点击精准跳转；在还原 Codex 交互的基础上，额外提供**发出时间显示**、**轮次耗时/token 指标**与**多色轮次标记**。

## 功能

- 🎹 **钢琴键导轨**：对话区左缘垂直刻度列，每条用户消息（含 steering）一个刻度，垂直居中聚簇，长对话自动压缩间距
- 🪜 **悬浮阶梯**：悬停刻度伸长变色，上下相邻刻度呈三级阶梯衰减（26/20/14/10px），完全还原 Codex 动效
- 💬 **详情悬浮卡**：用户消息摘要（单行）+ 模型回复预览（最多 3 行）+ meta 行（**发出时间**（今天 `HH:mm` / 今年 `M月d日 HH:mm` / 跨年全日期，与官方格式一致）· 轮次耗时 · 输出 token 数）
- 🖱 **点击跳转**：平滑滚动至该轮（顶对齐），目标行短暂高亮；虚拟滚动未挂载的行按比例预估 + 有界重试兜底
- 📍 **当前轮追踪**：滚动时正在阅读的轮次刻度自动深色高亮
- 🏷 **多色轮次标记**：悬浮卡「☆ 标记」按钮或**右键刻度循环换色**（琥珀/红/蓝/绿），已标记刻度恒显标记色；标记后可写**备注**；按会话持久化（localStorage），刷新不丢
- 🌗 **明暗主题自适应**，支持 `prefers-reduced-motion`

## 安装

```bash
dsh plugin --profile web add github:Jaeger0624/dsh-conversation-nav
```

本地开发：

```bash
dsh plugin --profile web add link:<本仓库路径>
```

## 技术说明

纯客户端插件（host 半面 no-op），零依赖手写单文件 bundle，无构建步骤：

- 数据源：官方 `ctx.sessions` 会话快照（`ConversationSnapshot`，含每条用户消息的 `data.time` epoch 毫秒）
- 挂载：`shell.overlay` 官方槽位（点击穿透层，刻度与悬浮卡自行恢复 pointer-events）
- 锚点：官方 `data-chat-anchor-key` 行属性定位跳转
- 性能：事件驱动（scroll 捕获 / resize / ResizeObserver / 快照订阅），无常驻定时器、无全文档 MutationObserver
- 标记存储：`localStorage["dcn:marks:<sessionId>"]`，数据结构预留 `color`/`note` 扩展字段

需求分析与架构决策见 [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)。

## License

MIT
