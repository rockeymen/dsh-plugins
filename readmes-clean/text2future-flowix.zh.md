![Flowix](./docs/images/app-icon.png)

# 你的笔记，AI 的记忆。

本地 Markdown 笔记本，让你的写作无缝成为 Agent 可以持续使用的上下文。

  Markdown · 开源 · 多 Agent · MCP 与 CLI

![Flowix](./docs/images/readme-introduce.gif)

## Flowix 让笔记成为持续工作的记忆

用 Markdown 记录内容，把需要的上下文交给 Agent，再将结果写回同一篇笔记，方便检查、修改和下次继续使用。

![Flowix 笔记在浅色与深色主题中的界面](./docs/images/home-write.png)

## 让工作持续推进

把产品、开发、研究和个人知识放在一起，让 Agent 不必每次从头开始。

### 场景 · 说明
- **场景**: **产品工作** · **说明**: 集中管理需求、反馈和决策，让产品文档保持最新。
- **场景**: **软件开发** · **说明**: 保存项目背景和约束，让编码 Agent 接着推进。
- **场景**: **课题研究** · **说明**: 将资料、分析和结论放在一起，方便追溯和复用。
- **场景**: **个人知识** · **说明**: 让笔记、计划和个人偏好成为 Agent 可用的上下文。

![Flowix 中的笔记、对话、任务与标签导航](./docs/images/home-nav.png)

## 让不同 Agent 使用同一份记忆

你可以在 Flowix 内使用 Agent，也可以连接 **Codex**、**Claude Code**、**OpenCode**、**Hermes** 及其他 MCP 或 CLI 工具，让它们基于同一套笔记和上下文工作。

![Flowix 将 Codex、Claude Code、OpenCode、Hermes 和 Flowix Agent 连接到同一篇笔记](./docs/images/home-agent.png)

## 笔记留在本地，由你掌控

Flowix 将笔记保存为本地 Markdown 文件。你决定 Agent 能看到什么，也可以自由选择同步和备份方式。

- **保存在本地** — 笔记是普通 Markdown 文件，可以用其他应用打开和编辑。
- **按需连接 Agent** — 使用 Codex、Claude Code、OpenCode 等 Agent 时，只提供你主动选择的内容。
- **自由同步和备份** — 继续使用你熟悉的同步、备份或版本管理工具。

## 快速开始

1. 从 [官网](https://flowix-memo.com/) 下载并安装 Flowix。
2. 新建一个本地文件夹，或将已有文件夹注册为笔记本。
3. 创建一篇文档，记录任务背景、参考资料、目标与约束。
4. 在文档内调用 Agent，或继续用标签与属性组织内容。

## 本地开发

```bash
git clone https://github.com/text2future/flowix.git
cd flowix
npm install

npm run tauri dev
npm run dev
npm run tauri build
```

开发环境要求 Node.js 20+、Rust 1.75+ 与 Tauri v2；桌面应用支持 macOS 14+ 与 Windows 10+。

## 许可协议

Flowix 基于 MIT 协议开源。