English · [简体中文](./README_ZH.md)

  ![dsh-agent-teams turns one DeepSeek Harness session into a coordinated multi-agent team](./assets/readme/hero.svg)

## One prompt. A working team.

`dsh-agent-teams` turns the current DeepSeek Harness session into a captain that can assemble durable sub-agents, split a goal into dependency-aware tasks, and coordinate work through direct messages.

Ask in natural language. The plugin provides the team protocol, nine coordination tools, persistent state, and a live Web UI—without requiring a separate workflow engine.

  ![DeepSeek Harness conversation with the AgentTeams live activity panel, members, tasks, dependencies, and reports](./assets/ui.png)

## Why AgentTeams?

### Capability · What it changes
- **Capability**: **Captain-led delegation** · **What it changes**: The current session creates the team, assigns roles, and consolidates the final result.
- **Capability**: **Durable members** · **What it changes**: Members are continuable DSH sub-agents that can be woken for focused follow-up turns.
- **Capability**: **Dependency-aware tasks** · **What it changes**: Tasks move through explicit states and cannot be claimed before their dependencies finish.
- **Capability**: **Direct messaging** · **What it changes**: Members send durable mailbox messages directly to teammates or the captain—no relay required.
- **Capability**: **Live activity panel** · **What it changes**: The Web UI shows roles, current work, unread messages, task dependencies, and archived team history.

## Install

> [!NOTE]
> Requires an existing [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) installation.

Choose either plugin source.

### npm

```sh
dsh plugin --profile web add @nanmicoder/dsh-agent-teams
```

### GitHub `main`

```sh
dsh plugin --profile web add 'git+https://github.com/NanmiCoder/dsh-agent-teams.git#main'
```

Validate the composed profile, restart DSH, and refresh the Web UI:

```sh
dsh --profile web --dump-config
dsh web
```

Then ask for a team directly:

> Use AgentTeams to review the commits after v0.5.3 from performance, security, and product perspectives. Return one consolidated report.

## How it works

1. The current session creates a team and becomes its captain.
2. The captain adds role-specific members backed by continuable sub-agents.
3. The goal becomes tasks with owners and explicit dependencies.
4. Claimed tasks are dispatched through durable mailbox messages that wake each member.
5. Members work, update task state, and report directly to the captain or one another.
6. The captain presents the combined result, then archives the complete team record.

Team state is stored under `<workspace>/.agent-teams/`; the Web panel reads that disk truth and combines it with live sub-agent activity.

## Configuration

Defaults work without extra setup. A trusted profile can override member behavior:

```yaml
- id: agent-teams
  config:
    stateDir: .agent-teams
    memberProvider: spawn
    memberModel: deepseek-v4
    memberMaxDepth: 1
    maxMembers: 8
```

## Boundaries

- One captain leads one active team at a time.
- Members act only after they are woken; mail remains durable while a participant is idle.
- State is file-backed and serialized within one DSH process; concurrent processes editing the same team are not coordinated.
- The activity panel reports persisted state as-is. Models may occasionally finish work without performing the expected task-state update.

See [docs/usage.md](./docs/usage.md) for the full tool reference, state model, Web UI behavior, configuration, and known limits.

## Plugin development Skill

The repository also ships the open Agent Skills package [`dsh-plugin-development`](./skills/dsh-plugin-development/SKILL.md):

```sh
npx skills add NanmiCoder/dsh-agent-teams --skill dsh-plugin-development
```

## Documentation

### Guide · Covers
- **Guide**: [Usage](./docs/usage.md) · **Covers**: Architecture, UI behavior, tools, configuration, limits, and validation
- **Guide**: [Verification](./docs/verification-guide.md) · **Covers**: Offline, composition, real e2e, and GUI verification
- **Guide**: [Plugin development](./docs/developing-dsh-plugins.md) · **Covers**: Human-readable guide built from this plugin
- **Guide**: [README writing](./docs/readme-writing-guide.md) · **Covers**: Repository documentation conventions

## Development

```sh
pnpm install
pnpm build
pnpm verify
```