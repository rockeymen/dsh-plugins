# Project Blueprint 🏗️

> **One command to make any project AI-agent-ready.**
> 一键为新项目建立完整 AI 编程规范体系。

**Topics** ·

[中文文档](README_CN.md)

## What is this?

Project Blueprint is a reusable AI agent skill that transforms any new project into an AI-ready codebase in one sentence. It's not a static template — it's an **autonomous discovery engine**: scan your project files, intelligently classify dependencies, and dynamically assemble a customized AGENTS.md, documentation skeleton, CI/CD pipeline, and testing policy from a 70+ component knowledge base.

Just say: **"Initialize this project's development standards"** and the agent does the rest.

## Quick Install

```bash
# Global (GitHub)
npx skills add shuguang1994/project-blueprint

# China (Gitee mirror, no proxy needed)
npx skills add https://gitee.com/shuguang1994/project-blueprint.git

# Update later
npx skills update project-blueprint
```

**DeepSeek Harness (dsh) plugin**:

```bash
dsh plugin --profile web add 'github:shuguang1994/project-blueprint'
```

Supported agents: Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, Trae, OpenCode, DeepSeek Harness, and 28+ more.

## Why

**AGENTS.md is now an industry standard in 2026** — used by 60,000+ open-source repos, co-promoted by OpenAI, Google, Anthropic, and Microsoft. 76% of developers use AI coding assistants (Stack Overflow 2025), but without AGENTS.md, AI agents are like "new hires with no onboarding" — producing inconsistent code styles, broken architecture, and failing CI.

**Industry data**: Anthropic benchmarks show AGENTS.md reduces wrong-pattern rewrites by **40-60%**. But writing a quality AGENTS.md by hand takes half a day to a full day — repeated for every new project.

**Project Blueprint's approach**: No preset templates. Autonomous scanning → intelligent classification → dynamic assembly. The AGENTS.md you get reflects your project's actual tech stack. And it's the only tool that generates AGENTS.md + docs skeleton + CI pipeline + testing policy + Git conventions — all from one sentence.

## Core Capabilities

### Capability · Description
- **Capability**: **Autonomous File Discovery** · **Description**: Scan and classify 30+ file patterns — no preset file checklist
- **Capability**: **Project Structure Detection** · **Description**: Auto-identify monorepo, 2/3-tier frontend-backend, or single project
- **Capability**: **Intelligent Dep Classification** · **Description**: 3-tier: knowledge base exact match → 29 heuristic patterns → web search
- **Capability**: **Business Type Inference** · **Description**: 2-tier heuristic (structure + config features), 13 business types
- **Capability**: **Dynamic AGENTS.md** · **Description**: Assembled from 70+ component knowledge base, not a template
- **Capability**: **Module Table Generation** · **Description**: Reads actual source dirs, infers responsibilities via file patterns, web search fallback
- **Capability**: **Documentation System** · **Description**: A/B/C/D/E 5-tier classification, generated per business type
- **Capability**: **Testing Policy** · **Description**: Phase-appropriate layered strategy, not forced example files
- **Capability**: **Multi-IDE Support** · **Description**: Auto-generates CLAUDE.md, .cursor/rules, copilot-instructions, and more
- **Capability**: **Incremental Mode** · **Description**: Only fills gaps on existing projects, never overwrites
- **Capability**: **MCP Tool Recommendation** · **Description**: Recommends MCP tool list + combinations from detected stack, generates `docs/B/B-05-MCP工具清单.md` with install commands (MD only, minimal intrusion)
- **Capability**: **Self-Evolving** · **Description**: Generated AGENTS.md includes auto-maintenance rules — updates module table, tech stack, and decisions as the project grows
- **Capability**: **Real Coding Conventions** · **Description**: Writes base coding conventions at init (naming/structure/error handling/logging/security/performance 6 categories), B-01 as real 8-chapter doc, not a placeholder
- **Capability**: **AI Mistake Prevention** · **Description**: Built-in 7-category 27-item AI common-mistakes KB, injected into core rules at init, iterated via BUG feedback loop

## What It Generates

### Output · Description
- **Output**: `AGENTS.md` · **Description**: Project conventions (governed by architecture principles)
- **Output**: `docs/` · **Description**: A/B/C/D/E classified documentation skeleton + README maintenance guides (incl. B-01-开发规范, real 8-chapter conventions)
- **Output**: `.github/workflows/ci.yml` · **Description**: CI pipeline (auto-adapts to language + platform)
- **Output**: `.gitignore` · **Description**: Curated rules per language
- **Output**: `.husky/pre-commit` · **Description**: Pre-commit lint hook (JS/TS only)
- **Output**: `CLAUDE.md` · **Description**: Claude Code vendor breadcrumb
- **Output**: `.cursor/rules/project.mdc` · **Description**: Cursor vendor breadcrumb
- **Output**: `docs/B/B-03-测试指南.md` · **Description**: Testing policy (layers, timing, framework-specific patterns)
- **Output**: `docs/B/B-05-MCP工具清单.md` · **Description**: MCP tool list + combination suggestions + install commands (on demand)

## Autonomous Discovery Engine

Project Blueprint doesn't check a fixed list of files. It scans your project and discovers everything.

### Dependency Classification: 3-Tier

```
All detected dependencies
    ↓
Tier 1: Knowledge Base Exact Match
  Hit in 70+ component KB → instant
    ↓
Tier 2: Name Pattern Heuristic
  29 patterns covering 100+ keywords → auto-classify
  e.g. winston → logging, antdv-next → ui, mysql2 → database
    ↓
Tier 3: Web Search
  Truly unknown → real-time search for latest info
```

### Tech Stack Coverage

### Layer · Components
- **Layer**: **Languages** (7) · **Components**: TypeScript/JavaScript, Go, Python, Java, Rust, Ruby, PHP
- **Layer**: **Frameworks** (15) · **Components**: NestJS, Next.js, Vue 3, React, Express, FastAPI, Flask, Django, Gin, Spring Boot, SvelteKit, Nuxt 3, Laravel, Hono, uni-app
- **Layer**: **ORMs** (6) · **Components**: Prisma, TypeORM, Drizzle, GORM, SQLAlchemy, JPA/Hibernate
- **Layer**: **CSS** (5) · **Components**: Tailwind CSS, CSS Modules, Scoped CSS, Styled Components, SCSS
- **Layer**: **UI Libraries** (4) · **Components**: Ant Design Vue, Element Plus, Naive UI, Vant
- **Layer**: **Testing** (6) · **Components**: Vitest, Jest, Pytest, Go testing, JUnit 5, Playwright
- **Layer**: **Linting** (5) · **Components**: ESLint, Prettier, Biome, Ruff, golangci-lint
- **Layer**: **Deployment** (5) · **Components**: PM2, Docker, Vercel, Docker Compose, GitHub Pages
- **Layer**: **Databases** (2) · **Components**: MySQL, PostgreSQL
- **Layer**: + State(3) + Package Mgmt(5) + Conventions(4) + Doc Patterns(12) = **70+**

## Web Search Fallback

Every dimension has a web search fallback — not just language/framework, but CSS, lint, package manager, deployment, UI libraries, database, and state management:

```
Unknown dep: @shadcn/ui not in knowledge base
→ Heuristic: contains "shadcn" + "ui" → dimension: ui
→ WebSearch: "shadcn/ui component library conventions 2026"
→ Extracts: registration patterns, theming, Tailwind integration
→ Writes into AGENTS.md
```

> Web fallback covers two phases: **generation** (web search for unknown deps/modules) + **coding** (the generated AGENTS.md requires verifying third-party library APIs/versions against official docs before writing code).

## Unique Innovations

> Verified via web search — no existing AGENTS.md generation tool implements these.

### Innovation · Description · Competitor Status
- **Innovation**: **Full-Lifecycle Generation** · **Description**: One sentence → AGENTS.md + docs + CI/CD + testing policy + Git conventions · **Competitor Status**: Competitors only generate AGENTS.md
- **Innovation**: **Autonomous Discovery Engine** · **Description**: 3-tier classification (exact→heuristic→web search), not just reading package.json · **Competitor Status**: Competitors use fixed templates or basic scanning
- **Innovation**: **Self-Evolving Mechanism** · **Description**: Generated AGENTS.md includes auto-maintenance rules, grows with the project · **Competitor Status**: Competitors produce static files
- **Innovation**: **Business Type Awareness** · **Description**: 13 business type inferences drive different documentation structures · **Competitor Status**: No competitor infers project type
- **Innovation**: **Incremental Quality Detection** · **Description**: Auto-evaluates existing AGENTS.md quality, tiered handling (complete→skip / partial→supplement / none→full) · **Competitor Status**: Competitors overwrite or start fresh
- **Innovation**: **Multi-IDE Ecosystem** · **Description**: Auto-generates CLAUDE.md, .cursor/rules, copilot-instructions, and more · **Competitor Status**: No competitor provides this
- **Innovation**: **Module Table Auto-Generation** · **Description**: Reads actual source directories, infers responsibilities via file patterns, web search fallback · **Competitor Status**: No competitor provides this
- **Innovation**: **MCP Tool Auto-Recommendation** · **Description**: Auto-matches MCP tools from detected stack via 3-tier matching, outputs combo suggestions (must/recommended/optional) + an installable MD doc; dual-layer web search keeps commands fresh · **Competitor Status**: Competitors (e.g. Project Genesis Phase 9) only wire preset MCP config — no autonomous recommendation from tech stack
- **Innovation**: **7-Language 15-Framework KB** · **Description**: 70+ components with Commands + Conventions + CI, Chinese-first · **Competitor Status**: Competitors cover JS/TS ecosystem at most

## What Makes It Different

- **Autonomous discovery, not preset** — scans what your project actually has
- **3-tier classification** — exact match → pattern heuristic → web search
- **Full-stack coverage** — AGENTS.md + docs + CI + testing policy + Git, one sentence
- **Incremental-friendly** — auto-detects existing projects, adds only what's missing
- **Self-evolving** — generated AGENTS.md is not a dead file; it teaches the AI to maintain itself as the project grows
- **MCP-ready tooling** — auto-recommends MCP tools + combos from your stack, with an installable doc that never ships outdated commands
- **AI mistake prevention + BUG→conventions feedback loop** — built-in 7-category 27-item AI common-mistakes KB injected at init; conventions-deficiency bugs auto-feed back into AGENTS.md and B-01, so conventions evolve with real practice
- **Chinese-first** — 7 languages, 15 frameworks, 70+ components natively in Chinese

## How It Works

```
User says: "Initialize this project"
    ↓
Step 1: Autonomous scan → file classification → dep inference (3-tier)
    ↓
Step 2: Rule engine assembles AGENTS.md from 70+ component KB
    ↓ (unknown stack → WebSearch fallback)
Step 3: Dynamic docs skeleton by business type (13 types) + MCP tool recommendation (B-05)
    ↓
Step 4: Configure Git (.gitignore + branch strategy)
    ↓
Step 5: Configure CI/CD (language + platform adaptive)
    ↓
Step 6: Establish testing policy (phase-appropriate, not forced)
    ↓
Step 7: Inject continuous self-maintenance instructions
    ↓
Done: 15+ files generated, project is AI-ready
```

## Requirements

- Any AI coding agent that supports SKILL.md format
- Node.js (for `npx skills add` installation)