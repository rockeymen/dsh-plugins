# dsh-pattern-search

对当前 DSH 会话做正则模式搜索：一个 `/pattern-search` 浮层窗口 + 一个模型可调用的 `pattern_search` 会话工具。用正则检索会话任意部分（助手正文、reasoning/思考、用户消息、工具结果），并给出匹配统计与分页高亮明细表。最初动机：DeepSeek 模型常输出类似 **"Actually, wait, let me …"** 的自我修正式表述——本插件让这类行为可计数、可观察。

## 安装

```bash
dsh plugin --profile web add github:yzhangjy/dsh-pattern-search
```

重启 `dsh web` 并硬刷新浏览器。

## 更新

```bash
dsh plugin --profile web up dsh-pattern-search
```

重启 `dsh web` 并硬刷新浏览器。若 profile 固定了 commit，则改为重装：

```bash
dsh plugin --profile web remove dsh-pattern-search
dsh plugin --profile web add github:yzhangjy/dsh-pattern-search
```

## 特性

- **`/pattern-search` 命令** —— 客户端自有 '/' 触发器源：打开浮层窗口，**无宿主往返、不写会话日志、不进入模型可见内容**（不留痕）。
- **正则 + flags** —— `i`/`s`/`m` 开关（`g` 固定开启），非法正则内联报错，显式「搜索」按钮（输入过程绝不自动搜索）。
- **匹配统计** —— 匹配总数、去重匹配串、命中轮数/命中消息数（带窗口分母）、按消息口径的命中率、来源分布与按轮分布（hover ⓘ 有说明）。
- **分页明细表** —— 带边框表头，每页 10/20/50/100 条，`<mark>` 高亮命中 + 前后 60 字符上下文。
- **partial 开关** —— 可纳入进行中的流式输出（以点击搜索时刻的快照为准）。
- **主题自适应** —— 全部颜色取自 dsh web 的 `--dsw-alias-*` token，白天/黑夜自动跟随。
- **`pattern_search` 会话工具** —— 同一套检索逻辑以宿主工具形式供模型调用，基于当前会话持久化事件日志，用于会话内自我观察。

## 使用

**GUI 内**：输入 `/pattern-search` + 回车 → 打开窗口 → 粘贴正则（如 `Actually,?\\s*wait,?\\s*let me\\b`，`i` 默认开）→ 点「搜索」。

**模型侧**：调用 `pattern_search` 工具：

```json
{ "pattern": "Actually,?\\s*wait,?\\s*let me\\b", "flags": "i", "source": "assistant", "context": 60, "limit": 20 }
```

## 统计口径

- **窗口内轮数 / 窗口内消息数** —— 客户端快照只保留最近一段*窗口*；长会话的早期轮次不在窗口内、不计入。
- **命中率 = 命中消息数 ÷ 窗口内消息数** —— 按消息口径、窗口范围。
- **去重匹配串** —— 命中的不同字符串，重复只计一次，**按原文大小写区分**（开启 `i` 时 `wait`/`Wait`/`WAIT` 仍各计一次）。

## 开发

```bash
npm install          # 开发依赖（tsdown、typescript、react 类型、dsh 类型包）
npm run build        # tsdown → lib/index.js（宿主）+ lib/client.js（浏览器 bundle）
npm test            # vitest（共享搜索核心、提取、worker 一致性）
npm run register     # dsh plugin --profile web add .（构建后执行）
```

客户端 bundle 重建后运行中的应用会直接提供新内容——硬刷新（Cmd+Shift+R）即可，纯客户端改动无需重启服务器；宿主半区（工具）改动需重启。

## 架构

```
src/
├── host/
│   ├── index.ts        # 注册 pattern_search 会话工具（defineTool）
│   └── search.ts       # 事件日志上的核心检索
└── client/
    ├── index.ts        # 客户端插件体：命令 + 窗口注册
    ├── command.ts      # /pattern-search inputTriggers 触发器源
    ├── store.ts        # 窗口/结果状态 + 每页条数
    ├── extract.ts      # ConversationSnapshot → 可检索文本段
    ├── search.ts       # 正则执行（客户端）
    ├── stats.ts        # 统计（窗口口径）
    ├── i18n.ts         # zh/en 文案
    └── ui/             # PatternWindow + ResultList（主题自适应）
```

设计文档见 [PRD.md](./PRD.md)。