# DeepSeek Harness 协作工具集（dsh 插件）

> **话题 / Topics**：`#dsh插件` `#dsh-plugin` `#deepseek-harness` `#codex` `#claude-code`

**定位**：DeepSeek Harness（dsh）的**配套插件式辅助工具**——不是修改 dsh 内核，而是在 dsh 页面智能体之上叠加一层「Codex/Claude 协作协议」：启动器、双向发送桥、通信信箱、可自动加载的协作技能。

让 **Codex / Claude Code** 与 **DeepSeek Harness 页面智能体** 双向协作的开发工具集：agent 负责下达详细任务并独立验收，DeepSeek 负责所有实际修改，通过本地发送桥和文件信箱双向通信，循环修复直到验收通过。

## 功能

- 🚀 **一键启动/安装**：双击启动 DeepSeek Harness 网页服务并自动打开页面（用 Chrome）
- 🔗 **双向通信桥**：agent → DeepSeek 页面发消息（`dsh-send.ps1`）；DeepSeek → agent 通过文件信箱回传
- 🧠 **协作技能**：`deepseek-harness-control`（SKILL.md），Codex / Claude 自动加载
- ✅ **独立验收闭环**：agent 独立检查源码 / git diff / 构建结果 / 未提交改动，发现问题循环派修复任务，通过后才报告"验收通过"
- 🔒 **保护未提交改动**：agent / DeepSeek 均不得重置、覆盖、暂存或提交用户原有改动

## 目录结构

```
DeepSeek Harness/
├── 使用说明.txt                本地导航
├── 工作流介绍.md               工作流与两种用法介绍
├── scripts/                    程序脚本
│   ├── DeepSeek Harness 一键启动.bat / 一键安装.bat
│   ├── dsh-launch.ps1 / dsh-install.ps1
│   ├── dsh-send.ps1            发送桥（agent → DeepSeek 页面）
│   └── 给DeepSeek发消息.bat     发送桥包装
├── docs/                       操作说明
│   ├── 使用步骤.txt
│   └── 告诉agent怎么控制DeepSeek.txt   粘贴给 agent 的协作协议
├── mailbox/                    通信信箱（隐私，不入库）
│   ├── 给codex的消息.txt       收件箱（DeepSeek → agent）
│   └── codex的回复.txt         发件箱（agent → DeepSeek）
├── skill/deepseek-harness-control/   协作技能（SKILL.md + _meta.json）
└── assets/                     图标素材（deepseek.ico、OIP-C.webp）
```

## 环境要求

- Windows + git / Node.js（^22.19 或 >=24）/ pnpm
- DeepSeek Harness 项目本体（`pnpm dsh web` 启动页面，地址一般 http://127.0.0.1:3080）
- Codex CLI 或 Claude Code（需登录各自账号）

## 使用方法（两种）

### 用法一：粘贴说明文件

新开 Codex / Claude 会话后，把 `docs/告诉agent怎么控制DeepSeek.txt` 全文粘贴给它。

### 用法二：技能自动加载

将 `skill/deepseek-harness-control/` 安装到 agent 技能目录：

- Codex：`~/.codex/skills/deepseek-harness-control/`
- Claude Code：`~/.claude/skills/deepseek-harness-control/`

之后直接说需求（如「让 DeepSeek 修当前项目的 xxx bug」），agent 会自动按协议执行。

## 工作流

```
你（用户）在 agent 窗口说需求
  → agent 扩展成【详细 prompt + 验收指标】
  → powershell -File scripts\dsh-send.ps1 "prompt" -Workspace "当前目录" -Wait
  → 消息实时显示在 DeepSeek 页面 → DeepSeek 执行修改（页面可见）
  → 改完写收件箱 mailbox\给codex的消息.txt
  → agent 独立验收（源码/diff/构建/未提交改动）
  → 有问题 → 重新派修复任务 → 循环；全部合格 → 报告验收通过
  → 结果写回发件箱 mailbox\codex的回复.txt → DeepSeek 读取显示在页面
```

## 换电脑部署

1. 拷贝整个文件夹（或便携包）到新电脑
2. 安装 git / Node.js / pnpm + Codex 或 Claude Code 并登录
3. 运行 `scripts/DeepSeek Harness 一键安装.bat` → `一键启动.bat`
4. 安装技能或粘贴说明文件，即可使用

## 说明

- `mailbox/`（信箱对话内容）已被 `.gitignore` 排除，不会入库
- 具体任务的验收数值（频率、毫秒、文件清单）由每次 prompt 规定，本协议只管长期行为
