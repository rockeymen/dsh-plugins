# dsh-mnemon

    ![dsh-mnemon Sidebar Memory System with Memory Space catalog and relationship graph](./docs/assets/media/dsh-mnemon-memory-system-demo-poster.jpg)

Local, layered, supervised memory for DeepSeek Harness—with cross-agent sharing through Mnemon.

`dsh-mnemon` integrates [Mnemon](https://github.com/mnemon-dev/mnemon) with DeepSeek Harness (DSH). It brings hot memory needed every turn, full project Documents, and on-demand long-term Memory Spaces into one workbench. Other agents can share DSH's long-term memory when they also integrate Mnemon and use the same accessible local Mnemon storage.

- **Local first**: memory stays in local SQLite, JSON, and Markdown; no remote memory service is required.
- **Cross-agent sharing**: Mnemon-enabled agents can read and reuse DSH's Mnemon Memory Spaces.
- **Three cooperating tiers**: Runtime Memory, Project Documents, and Memory Spaces retain information at the right granularity.
- **Supervised writes**: isolated memory subagents make semantic decisions; the Host enforces paths, permissions, capacity, locks, and revisions.
- **Native DSH experience**: a Sidebar workbench by default, turn memory, a Save-to-memory dialog, bilingual copy, and global themes.

Current user instructions, repository files, and live tool results always take precedence over historical memory.

## Live demo

![dsh-mnemon Sidebar Memory System and in-conversation interaction demo](./docs/assets/media/dsh-mnemon-memory-system-demo.gif)

See the [Sidebar and conversation UI guide](./docs/en/ui-guide.md) for the complete visual walkthrough.

## Start in five minutes

### 1. Install Mnemon

```sh
# macOS
brew install --cask mnemon-dev/tap/mnemon

# macOS / Linux via Go
go install github.com/mnemon-dev/mnemon@latest

mnemon --version
```

### 2. Install the plugin

```sh
dsh plugin --profile web add dsh-mnemon
dsh --profile web
```

Use an absolute path for a local development checkout:

```sh
dsh plugin --profile web add "link:/absolute/path/to/dsh-mnemon"
```

### 3. Open Memory System

New installations use `sidebar` by default. Click **Memory System** in the DSH sidebar, then follow this first-run path:

1. Confirm the Mnemon CLI, Runtime, Memory Spaces, and Documents are healthy under **Status**.
2. Create a narrowly scoped Memory Space under **Memory Spaces → Overview**.
3. Submit one stable, future-useful item through **Remember**.
4. Verify it with a focused question under **Recall**.
5. Return to the conversation and expand **Turn memory** below the answer.

See [Getting Started](./docs/en/getting-started.md) for provider requirements and complete verification.

## One workbench, three memory tiers

### Tier · Best for · How it reaches context
- **Tier**: **Runtime** · **Best for**: User preferences, collaboration rules, project conventions, environment facts · **How it reaches context**: Compact `USER.md` / `MEMORY.md` projections on every turn
- **Tier**: **Documents** · **Best for**: Designs, investigations, procedures, postmortems, and handoffs · **How it reaches context**: Deterministic search of active Documents, then full text on demand
- **Tier**: **Memory Spaces** · **Best for**: Cross-session facts, decisions, entities, and relations · **How it reaches context**: Bounded evidence recalled on demand from active spaces only

The tiers are not simple copies of the same content. Knowledge is routed by frequency, narrative length, and retrieval needs. See [Storage and the three-tier model](./docs/en/storage-model.md).

### Share long-term memory with other agents

Cross-agent sharing applies to the **Memory Spaces** backed by Mnemon. Another Mnemon-enabled agent can recall from or contribute to the same durable facts, entities, and relations when it targets the same `storageRoot` and Store. DSH-managed Runtime Memory and Project Documents are not automatically exposed to other agents.

The default `global` scope uses `~/.mnemon`, making it the simplest shared memory root for local agents. `custom` and `workspace` roots can also be shared, but every participant must align its directory explicitly. A shared root is shared data: establish a trust boundary first, and avoid incompatible offline migration or directory operations while another process is using it.

## Sidebar workbench

### Page · Main purpose
- **Page**: **Status** · **Main purpose**: Inspect connection, storage root, tier summaries, and Mnemon / dsh-mnemon versions
- **Page**: **Runtime** · **Main purpose**: Inspect USER / MEMORY capacity; filter, add, edit, or remove hot memory
- **Page**: **Memory Spaces** · **Main purpose**: Manage activation; switch among Overview, Recall, Content, and Entities; open Remember
- **Page**: **Documents** · **Main purpose**: Search, read, create, edit, and archive managed Markdown documents

Add and edit use consistent dialogs, destructive actions require confirmation, long collections expose filters and progressive loading, and Documents use a dedicated reader.

### Memory inside conversations

### Turn memory · Save to memory
- **Turn memory**: [![Expanded Turn memory with exact tool links](./docs/assets/screenshots/conversation-turn-memory.png)](./docs/assets/screenshots/conversation-turn-memory.png) · **Save to memory**: [![Confirm save to memory dialog](./docs/assets/screenshots/conversation-save-dialog.png)](./docs/assets/screenshots/conversation-save-dialog.png)

- **Turn memory** summarizes recalls, writes, and Document searches for the turn; expand it to jump to the matching page.
- **Save to memory** loads an editable candidate. Only confirmation sends it to the memory subagent for qualification, deduplication, distillation, and writing.

Both are on by default. Disable them independently under **Settings → Memory System → Conversation interface**; saved changes apply live.

## Display and storage

Configuration lives in `$DSH_HOME/settings.yaml` (commonly `~/.dsh/settings.yaml`):

```yaml
mnemon:
  displayMode: sidebar # sidebar | buildin; sidebar by default
  storageScope: global # global | workspace | custom
```

### Choice · Behavior
- **Choice**: `sidebar` · **Behavior**: Default dedicated workbench aligned with official DSH panel styling
- **Choice**: `buildin` · **Behavior**: Preserves the original conversation-area presentation and visuals
- **Choice**: `global` · **Behavior**: Shares `~/.mnemon` (or `MNEMON_DATA_DIR`) across workspaces
- **Choice**: `workspace` · **Behavior**: Uses `<workspace>/.mnemon`; the workbench may inspect another workspace while the Agent still follows the current session
- **Choice**: `custom` · **Behavior**: Uses an absolute or `~/...` path supplied through `dataDir`

Saved settings apply live without a manual refresh. Changing scope never migrates, merges, or deletes old data. If the inspected workspace differs from the session's effective workspace, the header explains the mismatch and offers one-click alignment.

## Common commands

```text
/mnemon status
/mnemon recall <query>
/mnemon related <full memory ID>
/mnemon remember <stable, self-contained durable insight>
/mnemon forget <full memory ID>
```

Recommended lookup order: Runtime Memory → active Documents → active Memory Spaces → archived original referenced by a hit.

## Data and security boundaries

- The plugin reaches durable memory through the local `mnemon` CLI. The WebUI neither reads SQLite directly nor starts processes.
- CLI calls use argument arrays with shell disabled, bounded output, timeouts, and cancellation.
- The plugin stores no API keys. Subagent inference uses the provider already configured in DSH.
- There is no deterministic secret scanner yet. Never store keys, tokens, private keys, or raw sensitive logs in any tier.
- Uninstalling the plugin does not remove data under `~/.mnemon`, workspace `.mnemon` roots, or custom directories.

See [Operations, security, and troubleshooting](./docs/en/operations.md) for complete boundaries, backup, recovery, and diagnostics.

## Documentation

### I want to… · Start here
- **I want to…**: Install and complete first-run verification · **Start here**: [Getting Started](./docs/en/getting-started.md)
- **I want to…**: Learn every page and conversation entry · **Start here**: [Sidebar and conversation UI guide](./docs/en/ui-guide.md)
- **I want to…**: Understand the three tiers and complete flow · **Start here**: [Project overview](./docs/en/project-overview.md) · [Lifecycle and workflows](./docs/en/workflows.md)
- **I want to…**: Choose storage scope or advanced switches · **Start here**: [Configuration reference](./docs/en/configuration.md)
- **I want to…**: Back up, update, or troubleshoot · **Start here**: [Operations, security, and troubleshooting](./docs/en/operations.md)
- **I want to…**: Integrate tools, commands, or RPC · **Start here**: [Interface reference](./docs/en/interfaces.md)
- **I want to…**: Develop, test, or publish · **Start here**: [Development and verification](./docs/en/development.md)

See the [documentation hub](./docs/en/README.md) for the full map.

## Development

```sh
pnpm install
pnpm run verify
```

`verify` runs TypeScript checks, Vitest, and the production build. Generated artifacts are committed under `lib/`.