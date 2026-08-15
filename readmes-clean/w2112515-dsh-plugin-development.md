# DSH Plugin Development

DSH Plugin Development is a portable Agent Skill for designing, implementing, packaging, reviewing, and diagnosing [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugins. The same canonical Skill directory works with Codex, Claude Code, and DSH. An optional DSH bundle adapter adds profile-scoped installation and reversible removal without creating another copy of the workflow.

> Beta and unofficial. This community project is not affiliated with or endorsed by DeepSeek. DeepSeek Harness is in developer preview, so current repository instructions, executable constraints, types, manifests, and Loader behavior remain authoritative.

## Project shape

### Part · Purpose
- **Part**: [`skills/dsh-plugin-development`](skills/dsh-plugin-development) · **Purpose**: Canonical portable Skill and its on-demand references and script.
- **Part**: [`skills/dsh-plugin-development/agents/openai.yaml`](skills/dsh-plugin-development/agents/openai.yaml) · **Purpose**: Optional Codex UI metadata; it does not fork the Skill instructions.
- **Part**: [`index.js`](index.js) and [`cordis.patch.yml`](cordis.patch.yml) · **Purpose**: Thin optional adapter that registers the canonical Skill in a DSH profile.
- **Part**: `.codex-plugin` / `.claude-plugin` · **Purpose**: Intentionally absent. Neither host requires a plugin to use the Skill.

The Skill distinguishes live dynamic Cordis plugins, source-backed DSH workspace packages, and out-of-tree installable bundles before applying mode-specific rules. It adds no MCP server, account, credential, or remote-service dependency.

## Codex

Install or link the canonical directory as either:

- a personal Skill at `~/.codex/skills/dsh-plugin-development`; or
- a repository Skill at `<repo>/.agents/skills/dsh-plugin-development`.

You can also ask `$skill-installer` to install this GitHub directory:

```text
https://github.com/w2112515/dsh-plugin-development/tree/main/skills/dsh-plugin-development
```

Invoke it explicitly with `$dsh-plugin-development`, or let its description trigger it for matching DSH plugin work. A Codex plugin is not required.

## Claude Code

Install or link the same canonical directory as either:

- a personal Skill at `~/.claude/skills/dsh-plugin-development`; or
- a repository Skill at `<repo>/.claude/skills/dsh-plugin-development`.

Invoke it with `/dsh-plugin-development`, or let Claude load it automatically for matching work. The directory uses the portable Agent Skills frontmatter subset and does not depend on Claude-only arguments, shell injection, subagent fields, or path variables. A Claude Code plugin is not required.

## DeepSeek Harness

DSH can discover the same directory directly from:

- `<repo>/.dsh/skills/dsh-plugin-development`;
- `<repo>/.agents/skills/dsh-plugin-development`; or
- `<dshHome>/skills/dsh-plugin-development`.

The repository `.agents/skills` location is shared by Codex and DSH, so those two hosts can consume one checked-in copy.

### Optional DSH bundle adapter

Use the bundle only when you want `dsh plugin` to own profile-scoped installation, versioning, composition, and removal:

The command below installs the current `v0.2.0-beta.1` adapter. The previous `v0.1.0-beta.1` release remains immutable.

```sh
dsh plugin --profile web add https://github.com/w2112515/dsh-plugin-development/releases/download/v0.2.0-beta.1/dsh-plugin-development-0.2.0-beta.1.tgz
dsh --profile web --dump-config
```

The dumped configuration should contain the `dsh-plugin-development` layer and row ID `dsh-plugin-development-skill`. The adapter reads metadata and instructions from the packaged canonical Skill, registers it through `ctx.skills`, and disposes that registration when removed.

For local adapter development:

```sh
dsh plugin --profile web add .
```

Git installation also needs no `prepare` or pnpm `allowBuilds` because the package ships plain JavaScript and Markdown:

```sh
dsh plugin --profile web add github:w2112515/dsh-plugin-development#v0.2.0-beta.1
```

Use a reviewed commit SHA instead of a movable branch for higher-assurance Git installs.

## Portable compatibility contract

The canonical directory follows the [Agent Skills specification](https://agentskills.io/specification):

- `SKILL.md` uses only the shared `name` and `description` frontmatter fields;
- the directory name matches the Skill name;
- references and scripts use paths relative to the Skill directory;
- detailed mode guidance loads on demand; and
- host-specific UI metadata does not alter the workflow.

Format compatibility does not make unavailable tools appear. Dynamic runtime work still requires live Cordis inspection, definition, and run tools. Without them, the Skill must stop at source-backed design or diagnosis and report that activation was not verified.

## What the Skill covers

### DSH plugin mode · Typical request · Completion evidence
- **DSH plugin mode**: Dynamic runtime Cordis plugin · **Typical request**: Define process-local Host or Client behavior with live Cordis tools · **Completion evidence**: Live provider and Slot inspection, define/run state, and final diagnostics
- **DSH plugin mode**: DSH workspace plugin · **Typical request**: Add or modify packages shipped in the DSH repository · **Completion evidence**: Current repository authority, focused tests, real Loader composition, lifecycle proof, and snapshots when product-visible
- **DSH plugin mode**: Installable DSH bundle · **Typical request**: Ship an external package with `dsh.bundle` and `cordis.patch.yml` · **Completion evidence**: Packed files, isolated profile installation, `--dump-config`, packaged boot, and cleanup evidence

The workflow also covers Loader export failures, Service Definition/Provider/Consumer ownership, model-visible logging, Client Slots, CLI surfaces, configuration, lifecycle disposal, profile precedence, Git build risk, and audit-only authorization.

## Precedence and lifecycle

Direct project Skills remain under the host's normal discovery and precedence rules. In DSH, project-local entries can override the optional runtime registration by name. Removing the bundle disposes only its registration; it does not delete separately installed personal or project Skill directories.

## Validate

Run the self-contained checks and inspect the packed DSH adapter:

```sh
npm test
npm pack --dry-run
```

Codex maintainers can additionally run the built-in Skill validator against the canonical directory:

```sh
python path/to/skill-creator/scripts/quick_validate.py skills/dsh-plugin-development
```

The runtime consumer check accepts a built DeepSeek Harness checkout and exercises both direct filesystem discovery and the optional bundle registration:

```sh
node scripts/verify-dsh-runtime.mjs path/to/deepseek-harness
```

For release evidence, install the exact packed tarball into an isolated DSH home, inspect `--dump-config`, load the installed entry, and verify registration, disposal, and removal. Static checks never replace those consumer paths.

The packaged read-only helper provides two early checks for plugin authors:

```sh
node skills/dsh-plugin-development/scripts/check-artifact.mjs workspace-function path/to/index.ts
node skills/dsh-plugin-development/scripts/check-artifact.mjs bundle path/to/package
```

## Discoverability

The repository uses the GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) and Agent Skill topics. It does not claim membership in a separate DSH registry that the project has not defined.

## Community

- [LINUX DO](https://linux.do/) — community discussion and open-source sharing.

## FAQ

### Is this a Skill or a DSH plugin?

The maintained product is one portable Agent Skill. The repository also ships an optional DSH bundle adapter for users who prefer profile-managed installation.

### Are there separate Codex, Claude Code, and DSH versions?

No. All three consume the same `skills/dsh-plugin-development` source. Only discovery paths, optional UI metadata, and the DSH installation adapter differ.

### Does installation execute package build scripts?

No. The DSH adapter has no `prepare`, `install`, or `postinstall` script. Always inspect third-party source and the exact artifact before installation.

### How should a compatibility problem be reported?

Open an issue with the host and version, DSH version or commit, selected plugin mode, target entry path, exact request or command, observed result, and unavailable evidence. Do not include credentials or private runtime data.