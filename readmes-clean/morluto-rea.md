**English** · [简体中文](README_zh.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [العربية](README_ar.md)

# REA: Reverse Engineer Anything

### Reverse engineer anything with agents, from app behavior down to native binaries.

**See a feature you like. Understand how it works, down to the binary level.**

[Quick start](#quick-start) · [Current status](#current-status) · [Investigation model](#the-investigation-model) · [Tool catalog](#tool-catalog-for-investigation) · [Roadmap](#roadmap) · [How it works](#how-it-works)

`npm install --global rea-agents && rea setup`

![REA launching its analysis bridge inside Hopper while inspecting a native binary](docs/assets/rea-hopper-analysis.png)

See a feature in an app that you want in your own product? Give the app to your agent—even without its source code. With REA, the agent can investigate the feature, explain how it works, show its evidence, and build a version adapted to your stack and requirements.

REA gives agents one consistent way to investigate software. Today that includes deep native analysis and function dossiers through Hopper or bring-your-own Ghidra on Linux, plus an experimental Windows x64 Ghidra P0 for approved native PE applications; execution-free managed PE/CLI triage; reproducible Evidence v2 records; controlled process capture; passive website, Electron page, and Node/Electron V8 Inspector observation; bounded JavaScript/source-map reconstruction; and a versioned domain graph for connecting JavaScript application layers without confusing static inference with runtime observation. The longer-term toolkit extends the same agent workflow to APIs, protocols, mobile artifacts, firmware, richer runtime behavior, and differences between versions.

Reverse engineering normally makes the operator choose a tool, learn its API, move evidence between programs, and decide what to inspect next. REA gives that work to the agent through commands, skills, structured results, and repeatable investigation workflows.

## Just ask your agent

Run setup once. Agent integration installs an aligned MCP registration and the
bundled routing skill together:

```bash
npx rea-agents setup
```

Then ask:

```text
Understand how search works in the Notes app, show me the evidence, and build a
similar feature for my project.
```

Notes is only an example. Name any app you want to understand, or ask the agent to start with an overview.

## The investigation model

Decompile
Open an app and recover readable code, strings, names, and other clues about how it works.

Understand
Follow the code from one part of the app to another until the agent can explain how a feature actually works.

Recreate
Turn what the agent learned into a feature for your own product, adapted to your stack, interface, and requirements.

REA shows how it reached its conclusions. It does not claim to recover original source code or automatically clone an application.

## Why REA

###  · 
- **Built for agents** · Ask what an app does and let your agent inspect it instead of guessing.
- **CLI and MCP** · Run the same reverse-engineering capabilities from your terminal or agent.
- **Complexity handled** · REA installs and manages the reverse-engineering tools behind the scenes.
- **From insight to code** · Understand a feature, then build your own version in the same coding session.
- **Local by design** · Analysis runs on your supported local host. REA does not upload the app to a hosted analysis service.
- **Keeps context** · Investigate several apps without starting over for every question.

## Quick start

### Run setup — recommended

```bash
npx --yes rea-agents@latest setup
```

The npm package-runner prompt, when shown, approves downloading REA for this
invocation; it does not approve any setup changes. The REA wizard separately
shows its complete plan and asks before applying it. Setup does not update
Homebrew, Node.js, or npm. The setup command opens with the work it
enables: investigate local apps from an agent, recover evidence through a
deep-analysis provider, and reuse REA's guided workflow. It summarizes the
detected agents, then asks which capabilities to set up: agent integration
(MCP plus the matching guided workflow) and—when needed—the Hopper provider.
Nothing is preselected. Choosing agent integration opens a second empty
checklist for the specific detected agents that should receive a registration.

`@latest` makes the requested release explicit and asks npm for the release
currently published under that tag. REA does not silently replace the package
version npm selected. Intentional rollbacks therefore remain available through
an exact package request.

REA keeps the journey inline so its history remains in the terminal. Selecting
a capability does not select every detected target or authorize a change.
Before anything changes, REA validates existing configuration, prints exact
paths and external effects, and asks for final approval with **No** as the
default. The screen keeps the available keys visible while you choose; Ctrl-C
and declining leave the system unchanged.

REA detects Claude Code, Claude Desktop, Codex, Cursor, Gemini CLI, Windsurf, and Devin. It configures the first six when detected; Devin is reported but left unchanged because it has no documented local MCP configuration boundary. Registrations are additive, backup-first, and read back after writing. You can safely rerun setup.

Use `rea setup --dry-run` to inspect the plan, repeat `--client` to select exact
agents, and `--accessible` for sequential vertical prompts. Machine output
remains available through `--json`; prompt UI and progress go to stderr.

After a successful setup, REA reports the capabilities now ready to use and a
concrete next step, such as restarting a configured agent before asking it to
investigate an application. It does not claim an integration or provider is
ready unless setup and its final diagnostic check verified it.

An optional curl wrapper installs the same CLI package and starts setup only when a terminal is available:

```bash
curl -fsSL https://raw.githubusercontent.com/morluto/rea/main/install.sh | bash
```

Pass installer options after `bash -s --`, for example `--dry-run`, `--no-setup`, or `--version 1.0.0`. The curl wrapper never installs prerequisites or configures integrations itself. See [Installation and setup](docs/installation.md) for its exact mutation boundary.

### With an agent — recommended

```bash
npx --yes rea-agents@latest setup
```

Choose Agent Integration in the reviewed setup plan. REA installs the pinned MCP
registration and its matching routing skill as one transaction. After setup,
restart the configured agent so it loads the aligned integration.

Review the setup plan, approve it if appropriate, then describe the app or feature you want to understand. Hopper can run in its free demo mode; if it shows a first-run prompt, choose the demo or enter an existing license.

### From Terminal — no installation

```bash
npx --yes rea-agents@latest setup
npx -y rea-agents@latest doctor
npx -y rea-agents@latest analyze /Applications/Notes.app
```

Review the setup plan before confirming it. Restart a configured agent so it loads REA.

### From Terminal — install the `rea` command

```bash
npm install --global rea-agents
rea setup
rea doctor
rea analyze /Applications/Notes.app
```

Update that global installation in place:

```bash
rea upgrade
```

REA checks npm for the latest release and verifies that the running package is
the global installation it will replace. Source, local, and `npx` copies report
the manual `npm install --global rea-agents@latest` command instead of updating
an unrelated global package.

Choose either the no-install commands or the global installation. You do not need both.

`npm install rea-agents` without `--global` installs `rea` only into the
current project's `node_modules/.bin`; it does not add `rea` to your shell
`PATH`. Use the `npx` commands above for one-off runs or `--global` when you
want a shell-visible `rea` command.

### Requirements

- macOS 12 or newer
- Ubuntu 24.04+, Fedora 41+, or 64-bit Arch Linux
- Windows x64 for the experimental, Ghidra-only native PE P0 boundary
- Node.js 22.19+ or 24.11+ (including newer releases)
- npm; REA does not require or install a particular npm version

Deep binary operations use [Hopper](https://www.hopperapp.com/), a separate desktop application with its own license, or a caller-selected Ghidra provider. Ghidra supplies read-only inventory, function metadata, decompilation, assembly, resolved calls, typed references, xrefs, CFG, and function dossiers; GUI state and mutations remain unavailable through that provider. Setup reuses an existing Hopper installation or an operator-supplied Ghidra installation. It never downloads Ghidra or installs Java. If neither provider is ready, interactive setup proposes Hopper; unattended Hopper installation requires `rea setup --yes --install-hopper`.

If something is not working, run:

```bash
npx -y rea-agents@latest doctor
```

`rea doctor --json` is read-only and distinguishes unsupported hosts, missing dependencies, a missing local analysis engine, configuration drift, and healthy checks. Paid-license activation is optional: on Linux, REA runs the supported Hopper demo build on a private Xvfb display and selects Hopper's offered demo mode for each analysis session.

### Linux installation and troubleshooting

On macOS, approved setup downloads Hopper's official DMG, verifies it, and installs the app into `~/Applications` without Homebrew or administrator privileges. Hopper may show its demo or license prompt when first opened; no manual drag-and-drop is required.

On Ubuntu 24.04+, Fedora 41+, and 64-bit Arch Linux, approved setup downloads the pinned official Hopper 6.4.2 package, restricts downloads to Hopper's public origin, verifies the published size and checksum, and invokes `apt-get`, `dnf`, or `pacman` to install Hopper and the Xvfb, Python, X11, and XTEST packages used by demo sessions. When REA is not already running as root, `pkexec` presents the system authorization prompt. REA never invokes `sudo`. Demo sessions run on an isolated 1280×1024 Xvfb display. REA verifies the exact supported Hopper binary, its owned process ancestry, the expected dialog geometry, and bridge state before selecting `Try the Demo`; any mismatch fails closed.

The normal Linux launcher is `/opt/hopper/bin/Hopper`. If Hopper was installed elsewhere:

```bash
export HOPPER_LAUNCHER_PATH=/absolute/path/to/Hopper
rea doctor --json
```

If doctor reports a missing analysis engine even though the file exists, inspect shared-library resolution with:

```bash
ldd /opt/hopper/bin/Hopper | grep 'not found'
```

Install the missing distribution packages and rerun `rea setup`. Linux demo automation requires `Xvfb`, Python 3, `libX11.so.6`, and `libXtst.so.6`; approved setup installs those direct runtime dependencies and does not interact with the user's desktop display. Hopper's free demo supports analysis with vendor-defined limits, and a paid license is optional. The curl installer places the `rea` command in `~/.local/bin` on Linux; add that directory to future shell `PATH` values if it is not already present.

REA defaults `HOPPER_LAUNCHER_PATH` to `/Applications/Hopper Disassembler.app/Contents/MacOS/hopper` on macOS and `/opt/hopper/bin/Hopper` on Linux. Explicit configuration always takes precedence.

### Ghidra read-only analysis provider

The Ghidra adapter supports the exact official Ghidra 12.1.2 release with a 64-bit full JDK 21 on Linux x64. It also provides an experimental Windows x64 P0 limited to approved native x86-64 PE applications. Download and extract those projects yourself, then configure absolute paths:

```bash
export GHIDRA_INSTALL_DIR=/absolute/path/to/ghidra_12.1.2_PUBLIC
export JAVA_HOME=/absolute/path/to/jdk-21 # optional when java and javac resolve from PATH
rea doctor --json
rea setup
rea providers --json
```

Doctor distinguishes missing configuration, a bad installation root, the wrong Ghidra or Java version, a JRE without `javac`, a missing `support/analyzeHeadless`, and an unsupported platform or architecture. Approved setup only copies the verified non-secret paths into detected MCP registrations; it does not modify the Ghidra installation or install/download Ghidra or Java.

On Windows, set the same variables in PowerShell and run `rea doctor --json`; automated `rea setup` and Hopper installation remain unavailable. The P0 target boundary rejects DLLs, managed PE files, non-x86-64 images, mutable/hostile inputs, and non-PE formats. See the [Windows Ghidra P0 operations guide](docs/windows-ghidra-p0.md) for registration, exact limitations, CI evidence, and acceptance gates.

REA loads its packaged Java `HeadlessScript` with `-scriptPath`, copies and digest-verifies the target in an ephemeral runtime, enables `-readOnly` and `-deleteProject`, caps auto-analysis at 300 seconds with two CPUs and a 2 GiB Java heap, and authenticates every request. Linux uses a mode-0600 Unix socket. Windows P0 uses token-authenticated IPv4 loopback and a token-free endpoint record because Node path-based IPC does not connect to Java AF_UNIX sockets on Windows. The bridge verifies Ghidra's imported-byte SHA-256 before serving any operation.

The Ghidra adapter declares 19 direct and enhanced operations. Its ten inventory operations are `list_documents`, `list_procedures`, `list_strings`, `list_names`, `list_segments`, `address_name`, `procedure_address`, `resolve_containing_procedure`, `search_procedures`, and `search_strings`. It also admits `procedure_info`, `procedure_pseudo_code`, `procedure_assembly`, `read_function_instructions`, `procedure_callers`, `procedure_callees`, `procedure_references`, `xrefs`, and `analyze_function`. `read_function_instructions` is the offset-paginated fast path for raw instruction windows: it does not invoke the decompiler or whole-program name/string inventories, and is also exposed as `rea instructions`. These capabilities enable the shared Swift/Objective-C inventory workflows, `binary_overview`, `batch_decompile`, `get_call_graph`, `find_xrefs_to_name`, `trace_feature`, and complete function dossiers. Default-space addresses are lowercase `0x` hexadecimal. Other spaces, including `EXTERNAL`, use `:0x<hex>`. Symbol results identify primary, dynamic, external, type, and source facts; procedures distinguish external functions and thunks; strings identify charset, missing-terminator state, byte length, and value truncation; memory-block ends are exclusive and permissions come directly from Ghidra.

The bridge serves operations only after auto-analysis completes. Each Program owns one persistent `DecompInterface`; a bounded 32-request FIFO serializes Ghidra API access, and every decompile has a 30-second native deadline. Reference results preserve Ghidra's call/jump/data/read/write/indirect/computed/external facts, while unresolved targetless flows remain explicitly unknown. Synthetic entry-point references without actionable memory sources are omitted. Pseudocode and assembly are provider-specific observations, not original source or Hopper-equivalent text. An analysis timeout, scan or inventory safety limit, request timeout, or oversized response fails explicitly instead of returning a partial result labeled complete.

`npm run verify:ghidra` compiles source-owned x86-64 debug and stripped ELF, AArch64 ELF, x86-64 PE, and x86-64 Mach-O fixtures. Against real Ghidra 12.1.2 it validates every admitted operation, direct and indirect calls, imports/exports/thunks, typed references, strings/xrefs, multi-block CFG, cancellation, deadlines, concurrency, malformed inputs, and complete process/project cleanup. Set `REA_CC`, `REA_CLANG`, or `REA_LLD_LINK` only when the corresponding compiler command is not on `PATH`.

`npm run verify:ghidra:windows` uses a deterministic source-owned native x86-64 PE application and requires all 19 operations, target/snapshot/import digest linkage, authenticated loopback transport, and cleanup on a controlled Windows x64 Ghidra 12.1.2 runner. This proof does not establish Job Object ownership, private DACLs, or reparse-point-safe authority.

To remove only REA-owned MCP registrations and the managed skill:

```bash
rea uninstall
rea uninstall --purge-data # also removes only ~/.rea/cache and ~/.rea/state
```

Uninstall preserves Hopper, Node.js, evidence, captures, external evidence roots, unrelated skills, and other MCP servers. It refuses malformed client configuration and never follows purge-data symlinks.

### CLI or agent?

### If you want to… · Use
- **If you want to…**: Ask an agent to investigate an app and build a feature · **Use**: Install the skill, then talk to your agent
- **If you want to…**: Inspect or decompile one part of an app from the Terminal · **Use**: `rea analyze` or `rea decompile`
- **If you want to…**: Validate, canonicalize, or compare Evidence v2 bundles · **Use**: `rea evidence-import`, `rea evidence-export`, or `rea compare`
- **If you want to…**: Run or resume a persistent two-version artifact analysis · **Use**: `rea investigate-versions`
- **If you want to…**: Map a local JavaScript/Electron application without executing it · **Use**: `rea analyze PATH --approved` or `rea analyze-javascript-application`
- **If you want to…**: Reuse immutable analysis results without relaunching a provider · **Use**: Pass `--snapshot /approved/path/analysis.json` to a deep-analysis command
- **If you want to…**: Import source as historical reference · **Use**: `rea import-reference-source`
- **If you want to…**: Capture or compare controlled process behavior · **Use**: `rea capture-process` or `rea compare-process-captures`

Filesystem evidence commands and MCP file tools are disabled until the operator approves absolute roots:

```bash
export REA_EVIDENCE_ROOTS_JSON='["/absolute/path/to/evidence"]'
export REA_INVESTIGATION_INPUT_ROOTS_J