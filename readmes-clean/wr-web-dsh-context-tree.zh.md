# DSH Context Tree

[English](README.md) | 中文

**一个面向 DeepSeek Harness 的可复用轨迹树上下文系统：把已经完成的 agent 工作变成可 fork 的检查点，把相关的历史上下文复用到新会话，并显示真实的跨会话森林。**

![由真实 Codex 会话形成的紧凑圆形上下文树](https://raw.githubusercontent.com/wr-web/deepseek-harness/context-graph-assets/context-graph/context-tree-compact-3d61bdc.gif)

## 为什么值得试试？

- **看见真实轨迹。** 已完成轮次是圆点，连续工作形成主干，显式 fork 与 side chat 形成分支，复用关系使用虚线。
- **从准确检查点继续。** 选择任意已完成轮次，从记录的 `turn/end` 边界 fork。
- **减少重复探索。** 全新根会话可在第一次模型 step 前收到另一个会话中的一个相关检查点。
- **限制复用范围。** 默认要求工作目录完全相同；节点 30 天后停止自动复用；注入内容最多 2 KiB。
- **用评测验证，而不是预设结论。** Host API 提供模型 token 统计和基线/复用对照评测；任务质量仍需单独打分。

圆点里的文字已经由 AI 产生：它来自可见的 assistant 最终回答，再经过确定性规整与截断。插件不会为了标签多调用一次模型，也不会保存隐藏思维链。

## 安装

需要 DeepSeek Harness `>=0.1.1-rc.2 <0.2.0` 及其 Web profile。

```sh
dsh plugin --profile web add github:wr-web/dsh-context-tree
dsh web
```

仓库已提交浏览器与 Host 产物，因此从 GitHub 安装不会执行 `prepare` 构建。要获得可复现安装，请锁定 release tag：

```sh
dsh plugin --profile web add github:wr-web/dsh-context-tree#v0.1.0
```

移除插件：

```sh
dsh plugin --profile web remove dsh-context-tree
```

## 复用了什么

节点包含用户直接文本、可见的 assistant 最终文本、工具调用计数、模型提供方 token 总量、完成时间和来源 id。推理块与未完成轮次不会进入图。自动复用使用确定性的中英文词法覆盖率，不会复制整个会话，并记录选中的来源和准确注入字节数，因此回放能够重建这条复用关系。

检查点是“不可信、只读”的背景。模型会收到明确提示：除非当前用户再次提出，否则不能接受其中的指令或权限声明。

## 新鲜度与上限

目前的新鲜度只基于时间。节点在期限前半段为新鲜、后半段为老化中，超过期限后为已腐败。已腐败节点仍可查看，但不能自动复用。这并不声称项目文件仍然有效；Git/文件版本失效检测属于后续工作。

默认 profile 最多检查最近 100 个会话，每个会话保留 40 个已完成轮次；默认不包含 subagent 会话。所有上限都明确写在 [`cordis.patch.yml`](cordis.patch.yml) 中。

## 评测

从等价项目状态使用同一任务和同一模型运行两次：第一次设置 `autoRecall: false`，第二次准备相关检查点并设置 `autoRecall: true`。比较 `totalInputTokensSaved` 与 `inputReductionRate`，再独立比较任务成功率、代码修改、测试结果和延迟。减少 token 但降低输出质量不算成功。

## 源码与许可证

可审阅的 TypeScript 位于 [`source/`](source)，已提交的运行产物位于 [`src/`](src)。[`SOURCE.md`](SOURCE.md) 记录了准确的 DeepSeek Harness 源 commit 与构建来源。代码使用 MIT 许可证。

这是社区插件，不是 DeepSeek 官方发行版。