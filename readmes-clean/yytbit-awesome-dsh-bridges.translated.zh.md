# 很棒的 DSH 桥接插件

将您最喜爱的 AI 编码工具桥接到 DeepSeek Harness 中——零迁移，完全兼容。

## 桥接插件

- dsh-plugin-claude-bridge -- Claude Code（记忆+技能+全局CLAUDE.md）
- dsh-plugin-codex-bridge -- OpenAI Codex（技能+说明+配置）
- dsh-plugin-opencode-bridge -- OpenCode（技能+配置）
- dsh-plugin-pi-bridge -- Pi Agent (技能)

## 实用插件

- dsh-plugin-vision-toolkit -- 用于纯文本代理的视觉工具包（扫视/地面/检测/裁剪）
- dsh-plugin-meta-memory -- 结构化长期记忆系统（基于单元的简短/完整对）

## 快速安装

```sh
dsh plugin --profile your-profile add dsh-plugin-claude-bridge
dsh plugin --profile your-profile add dsh-plugin-codex-bridge
dsh plugin --profile your-profile add dsh-plugin-opencode-bridge
dsh plugin --profile your-profile add dsh-plugin-pi-bridge
```

## 它是如何工作的

这些插件直接从其他人工智能编码工具读取配置文件——无需迁移脚本。技能、记忆和指令作为上下文注入到 dsh 系统提示符中。