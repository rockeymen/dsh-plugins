# iPSS 代理

**[InterPSS Agentic 电力系统仿真代理](https://tinyurl.com/interpss)**，用于交流潮流、基于直流的应急分析和 NERC TPL-001-5 样式报告。此存储库提供了针对 **OpenAI Codex Desktop**、**Claude Code CLI** 和 **Deepseek Harness** 的面向代理的技能（请参阅 [Setup.md](Setup.md)）。其他代理 CLI 可以通过从 `.agents/skills/ipss-sim/` 或 `.claude/skills/ipss-sim/` 复制技能内容来重用相同的工作流程。

它还作为 DSH 插件集成到 Deepseek Harness 中。您可以按照传统的分步方式运行电力系统仿真：

![ipss-dsh-插件](./image/ipss-dsh-plugin.png)

或者以原生AI Chat的方式：

![ipss-agent-聊天](./image/ipss-agent-chat.png)

## 环境设置

提示 Codex、Claude Code 或 Deepseek Harness 安装并设置 ipss.agent。

```text
Install and setup ipss.agent from https://github.com/InterPSS-Project/ipss-agent
```
根据您的网络速度，下载和安装 ipss.agent 可能需要一些时间。

初始化 ipss-sim 技能。
```text
init
```

使用示例案例目录测试设置。
```text
/ipss-sim <simu_case_directory> "<NERC Report Name>"
```

#### DSH 插件设置

提示Deepseek Harness安装InterPSS DSH插件。

```text
Install the InterPSS dsh plugin
```

## 运行模拟并生成报告

设置完成后，通过代理运行（聊天）电力系统模拟。

####技能式模拟

输入文件模式：

```text
/ipss-sim <simu_case_file> <contingency_file> <monitored_file> "<NERC Report Name>"
```

输入目录模式（自动发现`*.RAW` / `*.raw` / `*.ieee`、`*contingency*.json`、`*monitor*.json`）：

```text
/ipss-sim <simu_case_directory> "<NERC Report Name>"
/ipss-sim Aclf only <simu_case_directory> "<Loadflow Report Name>"

/NERC Report HTML         # generate Html report
/NERC Report Slides       # generate PPT report
```

###直接提示模拟

```text
Run ACLF format psse <case_file>
Run CA format psse <case_file> <contingency_file> <monitor_file>
Gen NERC TPL report "<NERC Report Name>" <result_dir>
```

## 探索模拟结果

结果写入 `wspace//result/`（包含案例文件的目录，以及 `result` 子文件夹）下。您可以通过法学硕士来检查它们，例如：

```text
# Load flow
Find the lowest voltage bus
Find the highest loading branch
# Contingency analysis
Find the top N-1 loaded branches
```

## 参考

### 主题·文档
- **主题**：布局、JAR、`config.json`、JVM · **文档**：[Setup.md](Setup.md)
- **主题**：`src/ipss_cmd.py` 用法 · **文档**：[IpssCmd.md](IpssCmd.md)
- **主题**：报告生成器 · **文档**：[GenReport.md](GenReport.md)