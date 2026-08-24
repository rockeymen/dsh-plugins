# dsh-session-health

DeepSeek Harness 插件：「会话健康度提醒」（Session Health Monitor）。

在右下角提供一个**可拖动**的悬浮按钮，点击后在按钮上方弹出当前会话的健康度报告，帮助你判断是否需要写 handoff、重开新会话。

## 效果预览



      ![健康状态下的会话健康度报告面板](assets/session-health-panel-healthy.png)
      <sub>健康（90%）：只展示各项指标</sub>


      ![亚健康状态下的面板，额外出现生成 handoff 按钮](assets/session-health-panel-warning.png)
      <sub>亚健康（45%）：额外出现「生成 handoff 并重开会话」按钮</sub>



点击按钮后，总结 prompt 会被送入当前会话，由 Agent 生成 handoff 文件并回报落盘路径：

  ![点击按钮后 Agent 生成 HANDOFF.md 并返回文件路径](assets/handoff-generated.png)

## 功能

- **可拖动按钮**：长按（约 260ms）拖动定位，快速点击在按钮上方弹出报告面板
- **健康度评分**（0–100%，绿/黄绿/橙/红四档）：三因子加权
  - 上下文占用（40%）
  - 压缩次数（30%）
  - 缓存命中率（30%）
- **上下文窗口使用情况**：红=已用 / 绿=未用的进度条 + 百分比 + 窗口大小
- **压缩次数** + **距上次压缩折线图**（下降趋势，横轴=压缩序号，纵轴=距上次压缩的轮次）
- **每轮调用趋势折线图**：每轮工具调用总次数 / 累计平均工具调用、每轮步骤总次数 / 累计平均步骤
- **Token 消耗**：未缓存输入 / 缓存读 / 输出 / 推理 / 总计（整会话累计）
- **耗时**：LLM 生成 / 工具执行 / 活跃总耗时
- **步骤明细**：倒序（最新在上），含每步耗时与调用的工具
- **Token 大户 / 耗时大户**：按 tool 排名
- **亚健康一键生成 handoff**：健康度 < 60 时显示「生成 handoff 并重开会话」按钮，自动把总结 prompt 发入当前会话

## 健康度算法

```
健康度 = 100 − 上下文占用扣分(40%) − 压缩次数扣分(30%) − 缓存命中率扣分(30%)
```

- **上下文占用**：占用率 > 30% 后线性扣分，100% 扣满 40 分
- **压缩次数**：0–5 次线性扣分，≥5 次扣满 30 分
- **缓存命中率**：< 50% 直接扣满 30 分（50%–100% 线性，100% 不扣）
- **分级**：≥80 健康 · 60–79 尚可 · 40–59 亚健康 · <40 不健康

## 安装（DSH bundle）

本插件是一个 DSH bundle（`dsh.bundle.patch` + `dsh.client`），通过 `dsh plugin` 安装到 profile：

```sh
# 从 GitHub 安装（发布后）
dsh plugin --profile web add github:CJL-1995/dsh-session-health

# 或从本地目录安装
dsh plugin --profile web add file:/path/to/dsh-session-health
```

安装后重启对应的 web profile（重启 `dsh web` 进程），右下角即出现「会话健康度提醒」按钮。

## 架构

- **Host**（`index.js`）：通过 `sessionProjections` 注册 `sessionHealth` projection，把会话事件增量折叠成健康度报告（纯 fold，状态为 plain JSON），由框架自动同步给客户端。
- **Client**（`client.js`，`window.__ModuleLoader__` 加载）：注册到 `shell.overlay`，从 `useSessions().byId[current].projectionValues.sessionHealth` 响应式读取报告并渲染。
- **发消息**：客户端 `sessions.binding(id).session.prompt([{type:'text', text}], 'queue')` 发送 handoff prompt。

## 文件结构

- `index.js` — Host 半边（projection 单元）
- `client.js` — Client 半边（ModuleLoader bundle）
- `cordis.patch.yml` — bundle patch 层（插入插件行）
- `package.json` — bundle 元数据（`dsh.bundle.patch` / `dsh.client`）
- `assets/` — 文档配图
- `README.md` — 本文档