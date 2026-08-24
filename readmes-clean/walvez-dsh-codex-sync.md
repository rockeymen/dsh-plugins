# ⚡ dsh-codex-sync

**The ultimate 2-way bridge between OpenAI Codex and DSH: bidirectional chat sync, live Skills mount & auto MCP mirroring.**
*2-way project chat sync · Live Skills mount · Auto MCP mirroring · Native modern UI*

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com/p/Walvez/dsh-codex-sync/)



      🎛️ Native Sync Settings Modal
      ![Codex Sync Settings modal: actions, switches, language](docs/sync-settings-modal.png)


      📍 Sidebar Workspace Trigger
      ![Workspace header Codex quick entry button](docs/sidebar-entry.png)




      📥 Import from Codex by Project
      ![Import picker: projects, chats, and status tags](docs/import-picker.png)


      📤 Export DSH Chats to Codex
      ![Export picker: smart workspace matching, source filter](docs/export-picker.png)



## 🤔 Why dsh-codex-sync?

When using OpenAI Codex, developers build up significant workflow assets:
1. **Rich project chat histories** with complete code contexts, architecture decisions, and debugging steps;
2. **Custom Skills libraries** under `~/.codex/skills` with tailored instructions and scripts;
3. **Configured MCP toolchains** for databases, web searches, and browser automation.

When adopting or exploring **DeepSeek Harness (DSH)**, developers typically face major friction:
- **Lost conversation history**: Incompatible session formats prevent resuming past Codex tasks in DSH;
- **Configuration duplication and drift**: Skills and MCP servers must be manually recreated and maintained in two separate tools;
- **One-way dead ends**: Most migration scripts are one-time destructive copies that offer no clean way to safely bring DSH continuations back to Codex.

**`dsh-codex-sync` eliminates this friction completely.** It is not a throwaway migrator, but a production-grade, continuous two-way bridge between Codex and DSH.

## ✨ Key Highlights

### 1. 💬 Two-Way Safe Project Chat Portability (Codex ⇄ DSH)
- **Import from Codex**:
  - Browse conversations grouped by workspace folder in an intuitive project tree;
  - Preserves user prompts, assistant outputs, reasoning traces, and tool-call trajectories;
  - Automatically attaches imported sessions to matching workspaces for **seamless continuation**;
  - Incremental re-import: Codex conversations continued after the initial import are marked as `updated` and append only new turns without creating duplicate sessions.
- **Export to Codex**:
  - Export DSH native conversations or continuations back into Codex;
  - Automatically matches Codex's workspace catalog, gracefully locking unknown directories to prevent orphan threads;
  - Creates clean, standalone Codex rollouts (`history_mode: legacy`) and SQLite index entries **without modifying or overwriting original Codex histories**;
  - View and continue chats in Codex immediately after restarting the Codex app.
- **Sub-Agent Thread Filtering**:
  - Hides internal sub-agent threads by default to keep the conversation list focused;
  - Easily expand and nest sub-agents under parent threads for selective, independent export.

### 2. ⚡ Live First-Class Skills Mounting
- Mounts `~/.codex/skills/*/SKILL.md` directly into DSH's native skill catalog;
- Full support for nested directory resources and multi-file skill bundles;
- **Zero-restart updates**: Edit a skill file on disk, and DSH recognizes the change on the next turn.

### 3. 🔌 Automated Bidirectional MCP Mirroring
- **Codex → DSH**: Watches `~/.codex/config.toml` live, dynamically mirroring `[mcp_servers.*]` to DSH with conflict avoidance and stderr silencing;
- **DSH → Codex (Reverse Bridge)**: Single-command setup (`npx dsh-codex-sync codex-install`) equips your Codex agent with tools to search, inspect, and install DSH plugins.

### 4. 🎨 Native Modern UI Experience
- **Adaptive Sidebar Trigger**: Sits right beside the workspace header when expanded, and aligns below the search button when collapsed;
- **Centered Modal Panel**: High-contrast, backdrop-blurred settings card with intuitive action cards, real-time switch feedback, and zero UI cutoff;
- **Polished Design Integration**: Uses native DSH design tokens (`--dsw-alias-*`), pure CSS transitions with zero hover artifacts, and responsive text truncation.

## 📦 Quick Start

### 1. Install in DSH

Install via DSH Plugin Market (recommended):
```bash
dsh plugin --profile web add dsh-codex-sync
```

Or configure inside your profile's `cordis.patch.yml`:
```yaml
- insert:
    - id: codex-sync
      name: dsh-codex-sync
      config:
        maxSkills: 30
        mcpMirrorDeny:
          - node_repl
        mcpMirrorSilent:
          - exa
```

### 2. Configure Codex Reverse MCP Bridge (Optional)

```bash
# Register [mcp_servers.dsh-plugins] in ~/.codex/config.toml
npx dsh-codex-sync codex-install

# Run diagnostic health check
dsh-codex-sync doctor
```

## 🎛️ Sync Settings & Toggles

Click the **Codex Icon** in the sidebar to open the centered control modal:

### Section · Item · Command / Config Key · Description
- **Section**: **Actions** · **Item**: Import from Codex · **Command / Config Key**: `/import-all` · **Description**: Open project picker to import chats into DSH
- **Section**:  · **Item**: Export to Codex · **Command / Config Key**: `/export-codex` · **Description**: Export DSH chats into new Codex conversation copies
- **Section**:  · **Item**: Mirror status · **Command / Config Key**: `/mcp-status` · **Description**: Modal overview of MCP servers, health, and statuses
- **Section**:  · **Item**: Refresh states · **Command / Config Key**: `/codex-settings` · **Description**: Re-sync all switch states from the host
- **Section**: **Features** · **Item**: Import commands · **Command / Config Key**: `enableImport` · **Description**: Enable `/import-codex` slash command family
- **Section**:  · **Item**: Auto import · **Command / Config Key**: `autoImport` · **Description**: Automatically import new Codex chats on startup
- **Section**:  · **Item**: Instructions · **Command / Config Key**: `enableInstructions` · **Description**: Inject `instructions.md` / `AGENTS.md` into prompt
- **Section**:  · **Item**: Config summary · **Command / Config Key**: `enableConfig` · **Description**: Inject `config.toml` model settings summary into prompt
- **Section**:  · **Item**: Skills · **Command / Config Key**: `enableSkills` · **Description**: Register `~/.codex/skills` as live DSH skills
- **Section**:  · **Item**: MCP mirror · **Command / Config Key**: `mcpMirror` · **Description**: Auto-mirror `[mcp_servers.*]` (applies immediately)
- **Section**: **Language** · **Item**: Language Switcher · **Command / Config Key**: `Language` · **Description**: Toggle between 简体中文 / English

## 🤖 Built-in Agent Skill (`codex-sync`)

This package bundles a first-class `codex-sync` skill. Your DSH AI Agent can operate synchronization tasks on your behalf:

- *"Dry-run importing my Codex conversations"* → runs `/import-codex --dry-run`
- *"Check current MCP mirror status"* → runs `/mcp-status`
- *"Turn on auto-import"* → runs `/auto-import on`

## 📄 License

[MIT License](LICENSE) © 2026 Walvez