![Flowix](./docs/images/app-icon.png)

# Notes for you,Memory for your agents.

The Markdown notebook where your words seamlessly become durable context for AI agents.

  Markdown · Open Source · Multi Agent · MCP &amp; CLI

![Flowix](./docs/images/readme-introduce.gif)

## Flowix turns notes into working memory

Write in Markdown, point an agent to the context it needs, and save the result back to the same note — ready to review, edit, and reuse next time.

![Flowix notes shown across light and dark themes](./docs/images/home-write.png)

## Keep work moving

Keep product work, development, research, and personal knowledge together, so agents can continue without starting over.

### Use case · What it does
- **Use case**: **Product work** · **What it does**: Keep requirements, feedback, decisions, and PRDs up to date.
- **Use case**: **Software development** · **What it does**: Give coding agents the context to continue your project.
- **Use case**: **Research** · **What it does**: Keep sources, analysis, and conclusions together and reusable.
- **Use case**: **Personal knowledge** · **What it does**: Turn notes, plans, and preferences into useful agent context.

![Flowix navigation for notes, conversations, tasks, and tags](./docs/images/home-nav.png)

## Connect every agent to the same memory

Use agents inside Flowix or connect **Codex**, **Claude Code**, **OpenCode**, **Hermes**, and other MCP or CLI tools — all working from the same notes and context.

![Flowix connecting Codex, Claude Code, OpenCode, Hermes, and Flowix Agent to the same note](./docs/images/home-agent.png)

## Your notes stay local and under your control

Flowix keeps your work as plain Markdown files on your device. You choose what agents can access, when context is sent, and how your files are synced, backed up, or versioned.

- **Files you can open anywhere** — Your notes are saved as plain Markdown on your device, so you can read and edit them with other apps.
- **Agents see only what you choose** — Share a single note, a folder, or a whole notebook — only when you want an agent to use it.
- **Use the agents you already trust** — Connect Codex, Claude Code, OpenCode, or another external agent. Flowix shares only the context you choose, when you start a task.
- **Sync and back up your way** — Use the sync, backup, or version-control tools you already trust. There's nothing to export.

## Quick start

1. Download and install Flowix from [the website](https://flowix-memo.com/).
2. Create a new local folder, or register an existing folder as a notebook.
3. Create a document and write down the task background, reference materials, goals and constraints.
4. Call an agent from within the document, or keep organizing content with tags and properties.

## Local development

```bash
git clone https://github.com/text2future/flowix.git
cd flowix
npm install

npm run tauri dev
npm run dev
npm run tauri build
```

The development environment requires Node.js 20+, Rust 1.75+ and Tauri v2; the desktop app supports macOS 14+ and Windows 10+.