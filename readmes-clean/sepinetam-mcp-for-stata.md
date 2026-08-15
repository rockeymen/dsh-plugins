![MCP-for-Stata: Integrate Stata into your agent](https://example-data.statamcp.com/logo_with_name.jpg)

# MCP-for-Stata: Integrate Stata into your agent

Enable Claude Code, Codex, OpenClaw, and other AI agents to safely invoke Stata on your local device for data analysis.

> Stata is a registered trademark of StataCorp LLC. This project is an independent community-developed tool and is not affiliated with, endorsed by, or sponsored by StataCorp LLC.

[![PyPI Downloads](https://static.pepy.tech/badge/stata-mcp)](https://pepy.tech/projects/stata-mcp)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/SepineTam/mcp-for-stata)

## 🆕 News
- 🚀 **DeepSeek Harness Day 0 Support**: Install MCP-for-Stata in DeepSeek Harness with `uvx stata-mcp install -c dsh`. See the [DeepSeek Harness guide](https://sepinetam.github.io/mcp-for-stata/agents/deepseek_harness/).
- 🧪 **Claude Science Support**: MCP-for-Stata now works in Claude Science with a sandbox allowlist. See the [Claude Science guide](https://sepinetam.github.io/mcp-for-stata/agents/claude_science).
- Find more in WeChat: [Why I made it?](https://mp.weixin.qq.com/s/VYkykdDgfPMa5KN0_1BeFQ), and [8 figures find out Stata-MCP](https://mp.weixin.qq.com/s/RKPKA4OWAM5SeZmGtbMRew)
- 🦞 **OpenClaw Support**: Standalone CLI tools for OpenClaw integration (`stata-mcp tool`), see [OpenClaw guide](https://sepinetam.github.io/mcp-for-stata/agents/openclaw.md)
- ✨ **Claude Code Plugin Support**: Official plugin package with MCP server and Stata LSP integration
- Use MCP-for-Stata in Claude Code, see [Claude Code advanced usage](#advanced-claude-code), or in Codex see [Codex advanced usage](#advanced-codex)

> Finding our **newest research**? [View latest research reports](https://aidea-labs.com/mcp-for-stata/reports).

Looking for others?

> **MCP or AI about Stata**
> - A session based MCP server for Stata, [mcp-stata](https://github.com/tmonk/mcp-stata)
> - IDEs (VScode or Cursor) integrated [stata-mcp for VSCode](https://github.com/hanlulong/stata-mcp). Confused them? 💡 [Comparison](#comparison)
> 
> **Datasets and Information**  
> - [STOP Dataset](https://opendata.ai4cssci.com): StataMCP-Team Opendata Project 📊, we have open-sourced a comprehensive dataset collection for social science research, aiming to enable the future of AI-driven and data-powered research paradigms.

Why AGPL 3.0 License?

The AGPL 3.0 License is a type of open-source license. It does not affect your daily use, and allows you to use, modify, and distribute this software free of charge, provided that you comply with its terms, such as retaining the original copyright notices.

**Notes**: While we strive to make open source accessible to everyone, we regret that we can no longer maintain the Apache-2.0 License. Due to individuals directly copying this project and claiming to be its maintainers, we have decided to change the license to AGPL-3.0 to prevent misuse of the project in ways that go against our original vision.

**Notes**: 尽管我们希望尽可能让所有人都能从开源中获益，但我们很遗憾地宣布无法继续保持 Apache-2.0 License。由于有人直接抄袭本项目并标榜其为项目维护者，我们不得不将 License 更改为 AGPL-3.0，以防止有人滥用本项目进行违背项目初心的事情。

Reason following: 

**Background**: @jackdark425's [repository](https://github.com/jackdark425/aigroup-stata-mcp) directly copied this project and claimed to be the sole maintainer. We welcome open source collaboration based on forks, including but not limited to adding new features, fixing existing bugs, or providing valuable suggestions for the project, but we firmly oppose plagiarism and false attribution.

**Update**: The infringing project has been taken down via GitHub DMCA. [View DMCA takedown details](https://github.com/github/dmca/blob/master/2025/12/2025-12-30-stata-mcp.md).

**背景**: @jackdark425 的[仓库](https://github.com/jackdark425/aigroup-stata-mcp)直接抄袭了本项目并标榜为项目唯一维护者。我们欢迎基于fork的开源协作，包括但不限于添加新的feature、修改已有bug或对项目提出您宝贵的意见，但坚决反对抄袭和虚假署名行为。

**更新**: 侵权项目已通过GitHub DMCA被takedown，[查看DMCA下架详情](https://github.com/github/dmca/blob/master/2025/12/2025-12-30-stata-mcp.md)。

## 💡 Quickly Start
### 🚀 One-click installation for all clients!
No config, no manual JSON editing. Just one command installs MCP-for-Stata for **every supported agent** (Claude Code, Codex, OpenClaw, Cursor, Gemini CLI, and more):

```bash
uvx stata-mcp install --all
```

Supported Agents 🤖
Based on our own experience and testing, we recommend using Claude Code, Codex, and OpenClaw.
We have found that Claude and DeepSeek are the two best models across any framework.

### Agent · Tag · Command
- **Agent**: Claude Desktop · **Tag**: claude · **Command**: uvx stata-mcp install -c claude
- **Agent**: Claude Code · **Tag**: cc · **Command**: uvx stata-mcp install -c cc
- **Agent**: Gemini CLI · **Tag**: gemini · **Command**: uvx stata-mcp install -c gemini
- **Agent**: Cursor · **Tag**: cursor · **Command**: uvx stata-mcp install -c cursor
- **Agent**: Cline (VScode Extension) · **Tag**: cline · **Command**: uvx stata-mcp install -c cline
- **Agent**: Codex CLI & Codex Desktop · **Tag**: codex · **Command**: uvx stata-mcp install -c codex
- **Agent**: OpenCode · **Tag**: opencode · **Command**: uvx stata-mcp install -c opencode
- **Agent**: OpenClaw · **Tag**: openclaw · **Command**: uvx stata-mcp install -c openclaw
- **Agent**: Claude Science · **Tag**: — · **Command**: [Manual config](#advanced-claude-science)

If you don't have `uv`, [see the uv installation guide](https://docs.astral.sh/uv/getting-started/installation) to install it. 
Or, use our beta install script (auto-installs `uv` if missing):

**macOS / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/SepineTam/mcp-for-stata/master/scripts/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/SepineTam/mcp-for-stata/master/scripts/install.ps1 | iex
```

If you don't know how to use them, [download the installation scripts](https://github.com/SepineTam/mcp-for-stata/tree/master/scripts) and double-click it in your device. `install.bat` for Windows users, and `install.command` for macOS users. 

### Advanced - Claude Code
As we find Claude Code is the best agent for MCP-for-Stata as its prefect agentic ability, we recommend using it, and there are lots of advanced usage following:

Before using it, please make sure you have ever install `Claude Code`, if you don't know how to install it, visit on [GitHub](https://github.com/anthropics/claude-code)

Generally, you can install MCP-for-Stata globally for one time, you can run:
```bash
claude mcp add stata-mcp --scope user -- uvx stata-mcp
```

Then, you do not need to watch it again. 

Local and share with your partners

If you want to install it locally only for the certain workspace, you can `cd` to your working directory, and run:
```bash
claude mcp add stata-mcp --env STATA_MCP__CWD=$(pwd) --scope local -- uvx --directory $(pwd) stata-mcp
```

It would nothing happen, you can type `claude` and type `/mcp` to find the status. 

Also, collaboration is an essential part of research. You can share your MCP config with your co-authors using:
```bash
claude mcp add stata-mcp --scope project -- uvx stata-mcp
```
In your working directory, you can find a file named `.mcp.json`, your mcp config will be placed here. 

Then, you can use MCP-for-Stata in Claude Code. Here are some scenarios for using it:

- **Paper Replication**: Replicate empirical studies from economics papers
- **Quick Hypothesis Testing**: Validate economic hypotheses through regression analysis
- **Stata Learning Assistant**: Learn econometrics with step-by-step Stata explanations
- **Code Organization**: Review and optimize existing Stata do-files
- **Result Interpretation**: Understand complex statistical outputs and regression results

If you use Claude Code inside IDEs (either the integrated terminal or the Claude Code Extension), installing our plugin including [MCP-for-Stata](https://github.com/sepinetam/mcp-for-stata) and [Stata LSP](https://github.com/euglevi/stata-language-server) maintained by @euglevi. 

```bash
# Add the MCP-for-Stata marketplace
claude plugin marketplace add SepineTam/mcp-for-stata

# Install the plugin to local, project or user scope
claude plugin install stata-toolbox -s project
```

> The language server gives AI-generated Stata code better syntax awareness and completion, which improves output quality. We package the LSP in compliance with its license and give full attribution to the original author.

### Advanced - Codex
We find that many researchers are using Codex as their agent, therefore we also provide instructions for Codex users. 

I figure that researchers are not using Codex CLI but Codex Desktop, so we can say it is easier to config MCP-for-Stata than other agents. 

You just need to say `Install MCP-for-Stata for yourself globally from https://www.statamcp.com or visit https://github.com/SepineTam/mcp-for-stata` then restart your Codex Desktop after it say ready. 

Also, if you want to install it manually, here are two ways:

#### A. Install in Codex Desktop GUI
1. Open your Codex Desktop APP
2. Click `Settings` in the bottom-left corner
3. Find `MCP servers` on the left side
4. Click `Add server`
5. Fill with the following:
    ```
    Name: stata-mcp
    Command to launch: uvx
    Arguments: stata-mcp
    ```
6. Click `Save`
7. Then, restart your Codex Desktop and enjoy it. 

#### B. Install with Codex CLI
For CLI mode, just run the following command in your terminal
```bash
uvx stata-mcp install -c codex
```

Or use
```bash
codex mcp add stata-mcp -- uvx stata-mcp
```

### Advanced - Claude Science

Claude Science runs MCP servers inside a strict sandbox that blocks access to the home directory (`~`) by default. If you try to launch MCP-for-Stata the standard way, you may see:

```text
Couldn't load tools: MCP error -32000: Connection closed
FileNotFoundError: [Errno 2] No such file or directory
```

To fix this, allowlist the paths where `uv tool install stata-mcp` places its files. Create or edit `~/.claude-science/config.toml`:

```toml
[sandbox]
user_write_paths = [
  "~/.local/bin",
  "~/.local/share/uv/tools/stata-mcp",
]
```

Then add the server in Claude Science:

- **Name**: `stata-mcp`
- **Command**: `~/.local/bin/stata-mcp`

Restart Claude Science and the tools will load. For the full walkthrough, see the [Claude Science guide](https://sepinetam.github.io/mcp-for-stata/agents/claude_science).

### Other Clients
> Standard config requires: please make sure the stata is installed at the default path, and the stata cli (for macOS and Linux) exists.

The standard config json as follows, you can DIY your config via add envs.
```json
{
  "mcpServers": {
    "stata-mcp": {
      "command": "uvx",
      "args": [
        "stata-mcp"
      ]
    }
  }
}
```

For more detailed usage information, visit the [Usage guide](https://sepinetam.github.io/mcp-for-stata/usage).

### Prerequisites
- [uv](https://github.com/astral-sh/uv) - Package installer and virtual environment manager
- Claude Code, Codex, OpenClaw or other Agents
- Stata License
- Your API-KEY from LLM

If you want to check whether your device is supported, you can run:
```bash
uvx stata-mcp doctor
```

It displays basic information about your device and checks whether your setup is supported.

Example output

```
stata-mcp v1.17.0 — Doctor Report

  [PASS] os: macOS (Darwin 25.3.0, arm64)
  [PASS] python: 3.13.5
  [PASS] uv: uv 0.11.13
  [PASS] dependencies: all required packages available
  [PASS] stata_cli: /usr/local/bin/stata-mp (from env)
  [PASS] stata_execution: OK (0.1s)
  [PASS] config: /Users/sepinetam/.statamcp/config.toml (loaded)
  [PASS] working_dir: /Users/sepinetam/Documents/Github/stata-mcp (writable)
  [PASS] guard: enabled, loaded 27 rules
  [PASS] monitor: disabled (psutil available)
  [PASS] pypi: reachable (4.86s)
  [PASS] cleanup: 0 old files (0 B) found; cleanup disabled (CLEAN_LOG_DAYS=-1)

Summary: 12 passed, 0 failed, 0 warning(s), 0 skipped
```

> Notes:
> 1. If you are located in China and package downloads are slow, see the [solution](docs/troubleshooting.md#package-download-is-slow-or-fails).
> 2. Claude is the best choice for MCP-for-Stata, for Chinese, I recommend to use DeepSeek as your model provider as it is cheap and powerful, also the score is highest in China provider, if you are increased in it, visit the report [How to use StataMCP improve your social science research](https://statamcp.com/reports/2025/09/21/stata_mcp_a_research_report_on_ai_assisted_empirical_research).

## Comparison

There are several Stata-related MCP projects. The table below was generated by Claude Code after analyzing each codebase directly.

### Feature · [MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this) · [haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion) · [hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp) · [tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)
- **Feature**: **Best for** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: Agent-driven analysis (Claude Code, Codex, OpenClaw) · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: Interactive sessions, graph export, and curated Stata knowledge · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: Users who write and run Stata code inside VSCode themselves · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: Research workflows (replication, robustness, publication QA)
- **Feature**: **Agents** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: All · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: All · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: VSCode window must stay active · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: All
- **Feature**: **Type** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: MCP Server + CLI toolkit · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: MCP Server + Skill KB + VS Code Extension · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: VSCode Extension (localhost server, not standalone MCP) · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: Session-based MCP Server
- **Feature**: **Execution** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: do-file via subprocess · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: pexpect interactive session + batch fallback · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: IDE-embedded runner via localhost :4000 · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: pystata (Stata 17+)
- **Feature**: **Safety** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: Command guard + RAM monitor · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: Cancel command + session cleanup · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: —
- **Feature**: **Data analysis** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: CSV, DTA, XLSX, SPSS handlers · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: In-session `inspect_data` / `codebook` · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: In-session `describe` / `codebook`
- **Feature**: **Logs** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: Text + SMCL readers · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: In-session `search_log` · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: Built-in log reader
- **Feature**: **Graphs** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: — · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: Auto-detect + `export_graph` PNG/SVG/PDF · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: Export, cache, SVG/PNG
- **Feature**: **CLI Support** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: Native (same tools as MCP server) · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: Basic entry point · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: —
- **Feature**: **Sessions** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: — · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: Multi named sessions with idle timeout · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: Multi-session, background tasks
- **Feature**: **IDE plug-in** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: — · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: Native VS Code / Cursor extension · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: Native VSCode / Cursor · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: Stata Workbench (VS Code)
- **Feature**: **Skill / Knowledge** · **[MCP-for-Stata](https://aidea-labs.com/mcp-for-stata) (this)**: Tool-focused skill for MCP-for-Stata (742 lines) · **[haoyu-haoyu/stata-ai-fusion](https://github.com/haoyu-haoyu/stata-ai-fusion)**: 5,653-line general Stata skill knowledge base · **[hanlulong/stata-mcp](https://github.com/hanlulong/stata-mcp)**: — · **[tmonk/mcp-stata](https://github.com/tmonk/mcp-stata)**: 20+ specialized research skills (causal inference, replication, publication QA, etc.)
- **Feature**: **Install** · 