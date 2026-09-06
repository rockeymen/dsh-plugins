![CloudBase AI Toolkit](https://raw.githubusercontent.com/TencentCloudBase/CloudBase-AI-Toolkit/main/mcp/icon.png)

# CloudBase AI Toolkit

**AI writes the code. CloudBase runs the backend.**

The CloudBase integration layer for AI coding tools: Plugin installs the stack, Skills steer how code is written, MCP operates databases, functions, storage, and deploys from chat.

[![][npm-version-shield]][npm-link]
[![][npm-downloads-shield]][npm-link]
[![][github-stars-shield]][github-stars-link]
[![][github-forks-shield]][github-forks-link]
[![][github-issues-shield]][github-issues-link]
![][github-license-shield]
![][github-contributors-shield]
[![][cnb-shield]][cnb-link]
[![][deepwiki-shield]][deepwiki-link]

## Recent updates

**v2.32.x** (2026-08)

- Mini Program: `queryMessagePush` / `manageMessagePush` for event and message-type subscriptions (virtual-pay defaults, idempotent merge, optional appid)
- Mini Program: message push aware of cloudfunction vs container mode (`ensureContainerMode` / `setContainerCallback`, function-existence check)
- Gateway: `manageGateway` verifies HTTP service before custom-domain / route create, with certificate auto-select and clearer DNS guidance
- Skills: message-push / customer-service reference plus layered Chinese localization for miniprogram-development

**v2.31.x** (2026-08)

- CloudRun: `getDeployLog` failures (CODING login / image deploy with no build) now rewrite to `getProcessLog` / `getDeployRecords` next steps instead of raw English errors

[Releases][changelog] · [Star][github-stars-link] · Watch → Releases

## What it is

AI IDEs (Cursor, Claude Code, Codex, CodeBuddy, and others) are strong at generating code. What usually blocks you is the backend: schemas, permissions, functions, storage, environments, and release.

[CloudBase](https://docs.cloudbase.net/) is Tencent Cloud’s AI-native all-in-one backend (database, storage, auth, cloud functions, Cloud Run, and more). This repo is the Toolkit that connects that backend to AI tools:

### Piece · Role
- **Piece**: **Plugin** · **Role**: Installs MCP Server, Agent Skills, and Hooks together—less per-IDE wiring
- **Piece**: **Agent Skills** · **Role**: Scenario skills (Web / Mini Program / database / auth / functions, etc.) toward workable CloudBase practice
- **Piece**: **MCP** · **Role**: Login, query and change data, manage functions and hosting, read logs—from the conversation

This repository ships the npm package `@cloudbase/cloudbase-mcp`, Skills, and AI plugins.

You still need your own CloudBase environment, and you should confirm sensitive actions the AI proposes. The Toolkit provides capability and path—not judgment.

### Related repositories

Publishing and sync repos live under [TencentCloudBase](https://github.com/TencentCloudBase). Directly related to this Toolkit:

### Repository · Contents · Typical entry
- **Repository**: [CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) (this repo) · **Contents**: MCP Server source; marketplace source for Claude Code / Codex · **Typical entry**: `npx @cloudbase/cloudbase-mcp@latest`
- **Repository**: [dsh-plugin](./dsh-plugin) · **Contents**: DeepSeek Harness plugin (`@cloudbase/dsh-plugin`): MCP bridge + DB/Storage/Auth panel · **Typical entry**: `dsh plugin add @cloudbase/dsh-plugin`
- **Repository**: [cloudbase-plugin](https://github.com/TencentCloudBase/cloudbase-plugin) · **Contents**: Open Plugin Spec publish repo (CI-synced): MCP + Skills + Hooks · **Typical entry**: `npx plugins add TencentCloudBase/cloudbase-plugin` · CNB fallback: `npx plugins add https://cnb.cool/tencent/cloud/cloudbase/cloudbase-plugin.git`
- **Repository**: [cloudbase-sites-plugin](https://github.com/TencentCloudBase/cloudbase-sites-plugin) · **Contents**: Sites plugin: Vite Web create & deploy · **Typical entry**: `npx plugins add TencentCloudBase/cloudbase-sites-plugin` · CNB: `https://cnb.cool/tencent/cloud/cloudbase/cloudbase-sites-plugin.git`
- **Repository**: [cloudbase-skills](https://github.com/TencentCloudBase/cloudbase-skills) · **Contents**: Agent Skills collection · **Typical entry**: `npx skills add TencentCloudBase/cloudbase-skills` · CNB: `https://cnb.cool/tencent/cloud/cloudbase/cloudbase-skills.git`
- **Repository**: [skills](https://github.com/TencentCloudBase/skills) · **Contents**: Per-skill install catalog (also on [skills.sh](https://skills.sh)) · **Typical entry**: `npx skills add tencentcloudbase/skills --skill <name>`
- **Repository**: [awesome-cloudbase-examples](https://github.com/TencentCloudBase/awesome-cloudbase-examples) · **Contents**: CloudBase examples and case studies · **Typical entry**: Browse / clone examples
- **Repository**: [OpenVibeCoding](https://github.com/TencentCloudBase/OpenVibeCoding) · **Contents**: Vibecoding template on CloudBase · **Typical entry**: Use as a project starter

Prefer Plugin for the full stack; Skills alone when you only need knowledge constraints. For marketplace IDEs use this repo—do not also run `npx plugins add` on the same tool.

## Quick start

### Fastest way to get started

Copy this AI prompt into your AI IDE. The agent reads `skill.md` and completes the setup:

```
Set up CloudBase for me:
1. Open https://docs.cloudbase.net/skill.md and complete the setup following its instructions.
2. Tell me when you're done, and suggest the most relevant next step.
```

Pick one default path for your tool (Plugin / CLI / MCP)

### Your tool · Suggested path
- **Your tool**: Claude Code / Codex (native marketplace) · **Suggested path**: Add this repo as marketplace, then install the `cloudbase` plugin ([plugin docs](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins))
- **Your tool**: Open Plugin Spec tools · **Suggested path**: `npx plugins add TencentCloudBase/cloudbase-plugin`
- **Your tool**: Prefer one CLI for many tools · **Suggested path**: [CloudBase AI CLI](https://docs.cloudbase.net/cli-v1/ai/introduce): `npm i -g @cloudbase/cli && tcb ai`
- **Your tool**: CodeBuddy / WorkBuddy / ZCode (built-in) · **Suggested path**: Use the IDE’s built-in CloudBase plugin or connector; for CodeBuddy you can also [install via plugin marketplace](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy)
- **Your tool**: Other MCP-capable IDEs · **Suggested path**: MCP config only (below)

#### Plugin

```bash
npx plugins add TencentCloudBase/cloudbase-plugin
```

Details and IDE differences: [AI plugin docs](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins).

#### MCP only

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

Hosted HTTP, self-hosted Cloud Mode, and plugin scoping: [Install & connect](#install--connect).

### First prompts

```
Login to CloudBase
```

```
Use CloudBase Skills to build a todo app with login, database and permissions, then deploy
```

Skills shape structure and practice; MCP handles environment and resources. You should be able to verify data and APIs in your own environment—not only get local source files.

### Supported AI IDEs

![](https://raw.githubusercontent.com/TencentCloudBase/CloudBase-AI-Toolkit/main/scripts/assets/ide-support-grid.png)

### Tool · Platform · Guide
- **Tool**: [CloudBase AI CLI](https://docs.cloudbase.net/cli-v1/ai/introduce) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/cli-v1/ai/introduce)
- **Tool**: [OpenClaw](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openclaw) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openclaw)
- **Tool**: [WorkBuddy](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/workbuddy) · **Platform**: Standalone IDE · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/workbuddy)
- **Tool**: [ZCode](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/zcode) · **Platform**: Standalone IDE (≥ 3.4.1 built-in) · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/zcode)
- **Tool**: [Codex App](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codex) · **Platform**: App · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codex)
- **Tool**: [Cursor](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cursor) · **Platform**: Standalone IDE · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cursor)
- **Tool**: [WindSurf](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/windsurf) · **Platform**: IDE / plugins · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/windsurf)
- **Tool**: [CodeBuddy](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy) · **Platform**: Standalone IDE (built-in) · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy)
- **Tool**: [CLINE](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cline) · **Platform**: VS Code plugin · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/cline)
- **Tool**: [GitHub Copilot](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/github-copilot) · **Platform**: VS Code plugin · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/github-copilot)
- **Tool**: [Trae](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/trae) · **Platform**: Standalone IDE · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/trae)
- **Tool**: [Tongyi Lingma](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/tongyi-lingma) · **Platform**: IDE / plugins · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/tongyi-lingma)
- **Tool**: [RooCode](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/roocode) · **Platform**: VS Code plugin · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/roocode)
- **Tool**: [Baidu Comate](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/baidu-comate) · **Platform**: Plugins · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/baidu-comate)
- **Tool**: [Augment Code](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/augment-code) · **Platform**: Plugins · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/augment-code)
- **Tool**: [Claude Code](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/claude-code) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/claude-code)
- **Tool**: [Gemini CLI](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/gemini-cli) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/gemini-cli)
- **Tool**: [Codex CLI](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openai-codex-cli) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/openai-codex-cli)
- **Tool**: [OpenCode](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/opencode) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/opencode)
- **Tool**: [Qwen Code](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/qwen-code) · **Platform**: CLI · **Guide**: [Guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/qwen-code)

Full setup: [IDE guides](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/).

## Capabilities

After setup, the AI can do typical backend work in your environment (confirm critical steps):

- **Database**: PostgreSQL and document DB, data models, CRUD, permissions and security rules
- **Compute**: author, deploy, invoke, and debug cloud functions / Cloud Run
- **Auth & storage**: login methods, object storage, permission linkage with data
- **Release & ops**: static hosting / Mini Program publish; inspect logs and redeploy

Fits Web, WeChat Mini Programs, and backend services. Platform overview: [CloudBase docs](https://docs.cloudbase.net/).

### Evaluation

Under controlled conditions, the same Todo application brief and frontend scaffold were used to compare two backend paths: a traditional cloud VM (self-managed runtime, process, and network exposure) and CloudBase (managed database, anonymous auth, and related backend services). An AI agent performed end-to-end development and verification. Given the model and task setup, the CloudBase path was more favorable in completion latency, token usage, and tool-call count. These outcomes are conditioned on the model, agent framework, and task definition, and should not be generalized beyond that scope.

Methods, data, and limits: [Same-task evaluation: cloud VM vs CloudBase](https://docs.cloudbase.net/solutions/vibe-coding-platform/vm-vs-cloudbase-comparison)

## Install & connect

### Prerequisites

- Node.js v18.15.0+
- A [CloudBase environment](https://tcb.cloud.tencent.com/dev)
- An AI tool that supports Plugin / Skills / MCP

### Setup options

1. **Plugin** (when the tool supports it)  
   `npx plugins add TencentCloudBase/cloudbase-plugin`
2. **CloudBase AI CLI**  
   `npm i -g @cloudbase/cli && tcb ai`
3. **Manual MCP** (write the IDE config file)

Cursor (.cursor/mcp.json)

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

WindSurf (.windsurf/settings.json)

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
    }
  }
}
```

CodeBuddy

CloudBase is built in (MCP / Skills); manual config is usually unnecessary.

You can also install via the plugin marketplace: see the [CodeBuddy setup guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy).

Others: [IDE setup guide](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/).

### MCP connection modes

**Local** (default): `npx` on your machine—full features, including local filesystem upload/templates.

**Hosted**: IDE connects over HTTP to Tencent Cloud MCP; no local Node. Some local-file features are unavailable.

```json
{
  "mcpServers": {
    "cloudbase": {
      "type": "http",
      "url": "https://tcb-api.cloud.tencent.com/mcp/v1?env_id=<env_id>",
      "headers": {
        "X-TencentCloud-SecretId": "<Tencent Cloud Secret ID>",
        "X-TencentCloud-SecretKey": "<Tencent Cloud Secret Key>"
      }
    }
  }
}
```

Hosted URLs can use `site` (`domestic` / `intl`) to pick the login site (e.g. domestic-site Singapore needs `site=domestic`), plus `enable_plugins` / `disable_plugins` to trim tools. Canonical names live in `mcp/src/server.ts`.

**Self-hosted Cloud Mode**: set `CLOUDBASE_MCP_CLOUD_MODE=true` (or `MCP_CLOUD_MODE=true`) so local file and process tools are disabled for remote callers.

### Scenario · Suggestion
- **Scenario**: Personal · **Suggestion**: Local `npx`
- **Scenario**: Team / zero ops · **Suggestion**: Hosted HTTP
- **Scenario**: Self-hosted MCP · **Suggestion**: Cloud Mode required

## Example

**Online Gomoku**: describe the need; get Web + cloud database / realtime and deploy.  
Demo: [Gomoku](https://cloud1-5g39elugeec5ba0f-1300855855.tcloudbaseapp.com/gobang/#/) · More: [tutorials](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/tutorials)

## Docs

- [MCP tools](doc/mcp-tools.md) ([tools.json](scripts/tools.json))
- [Getting started](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/getting-started)
- [IDE setup](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/)
- [AI plugins](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins)
- [Templates](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/templates)
- [FAQ](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/faq)

## FAQ

How is this different from Vercel / Netlify?

Those focus on shipping frontends or containers. CloudBase provides backend building blocks (database, auth, functions). The Toolkit lets AI tools use them in chat. Deploy is only part of the path.

Can I use this without a GUI IDE?

Yes. Any tool that can configure an MCP Server or install the matching Plugin / Skills works—including Claude Code, Gemini CLI, OpenCode. [Support list](#supported-ai-ides)

Where does my code go?

Deploy targets your own CloudBase environment. In local mode MCP runs on your machine; code need not leave until you deploy. Cloud traffic uses HTTPS.

Is self-hosting the MCP server safe?

Local `npx` is equivalent to running tools yourself. For remote hosts, set `CLOUDBASE_MCP_CLOUD_MODE=true` to disable local file/process tools. Tencent Cloud hosted HTTP includes this protection.

Cost?

The Toolkit (including MCP) is open source under MIT. CloudBase has free quotas; usage beyond that is billed—see [billing](https://cloud.tencent.com/document/product/876/39095).

Login says environment does not exist?

Confirm an environment exists and is healthy in the [console](https://tcb.cloud.tencent.com/), then login again and pick the right one.

Domestic site env at `ap-singapore` is treated as international?

Both the domestic site (cloud.tencent.com) and the international site (tencentcloud.com) offer the `ap-singapore` region, so region alone is ambiguous. Without an explicit site, MCP defaults to `intl` for `ap-singapore` (backward compatible). Domestic-site Singapore users must set `TCB_SITE=domestic` (together with `TCB_REGION=ap-singapore`) in the MCP `env`, or add a `.cloudbase/project.json` at the project root:

```json
{ "site": "domestic", "region": "ap-singapore", "envId": "your-env-id" }
```

Credentials are stored per site (`credential.domestic` / `credential.intl`) so domestic and international logins can coexist; legacy single-slot `auth.json` is read as `domestic` and migrated on first write.

*