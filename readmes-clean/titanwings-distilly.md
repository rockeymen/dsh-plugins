![Distilly — Distill how they think into Person Profiles for Agents](docs/social-preview-distilly-v7.png)

# 🧬 Distilly

**Formerly: Colleague Skill / colleague-skill.**

### Distill a person's experience, judgment, voice, and ways of working into a reusable Person Profile for AI agents and compatible bots.

**Messages · documents · interviews · public sources → Distilly → Person Profile → Agent / Bot**

🧑‍💼  Your colleague quit, your mentor graduated, your teammate transferred — taking their whole playbook and context with them?
💞  Your family, old friends, partner drifting apart — and you want to hold on to the way it felt to be with them?
🌟  Your favorite author, idol, thinker you'll never meet — but you want to know what they'd say about your question?

### ✨ One project, many kinds of people.

Distilly is the person-modeling layer for agents. It turns the materials you provide into a portable, source-grounded Person Profile built from observable experience, decision patterns, expression, and ways of working; it does not claim to clone the person behind them.

Colleagues · partners · family · old friends · idols · public figures · fictional characters — even yourself

**Source material + your description → a source-grounded Person Profile → your Agent or compatible Bot**

> A Person Profile is the reusable output. The current release packages each profile as an Agent Skill so supported hosts can install and invoke it. The canonical creator Skill is named `distilly`; install it in a `distilly` directory. The former name above remains for search continuity and project history.

[🆕 What Distilly does](#-what-distilly-does-today) · [📦 Data Sources](#-supported-data-sources) · [⚡ Install](#-install) · [🚀 Usage](#-usage) · [✨ Demo](#-demo) · [📝 Citation](#-citation) · [💬 Discord](https://discord.gg/NVX66RxWZv)

[**Chinese**](docs/lang/README_ZH.md) · [**Spanish**](docs/lang/README_ES.md) · [**German**](docs/lang/README_DE.md) · [**Japanese**](docs/lang/README_JA.md) · [**Russian**](docs/lang/README_RU.md) · [**Portuguese**](docs/lang/README_PT.md) · [**Korean**](docs/lang/README_KO.md)

### 🎉 2026.08.13 Milestone — **the project has passed 20K ⭐!**

Massive thanks to everyone who starred — we'll keep shipping, keep distilling.

> 🧬 **2026.08.24 Update** — The creator is now named **Distilly** end to end and documents native local Skill discovery for Claude Code, Hermes, OpenClaw, Codex, DeepSeek Harness, Pi, Grok Build, and OpenCode. Grok Bot is listed separately as a saved-Skill workflow preview.

> 📝 **2026.06.01 Update** — **[The COLLEAGUE.SKILL technical report](https://arxiv.org/pdf/2605.31264) is now available**. The most rewarding part was not simply publishing a paper, but seeing the community grow the gallery to 215 skills contributed by 165 people, with more than 100,000 stars across the skill cards. The paper's Acknowledgements explicitly recognize every community contributor.

> 🗺️ **2026.04.13** — **The Distilly Roadmap is live!** What began as Colleague Skill is growing beyond colleagues: distill people into Skills that Agents can reuse. 👉 **[Full Roadmap](ROADMAP.md)** · **[💬 Discord](https://discord.gg/NVX66RxWZv)**

> 🌐 **2026.04.07** — Community gallery is live! Any skill / meta-skill can drive traffic directly to your own GitHub repo. No middleman. 👉 **[titanwings.github.io/colleague-skill-site](https://titanwings.github.io/colleague-skill-site/)**

Created by [@titanwings](https://github.com/titanwings)

## 🆕 What Distilly does today

### 1️⃣ From Colleague Skill to Distilly

The project is no longer limited to the colleague scenario. Its `distilly` creator builds source-grounded Person Profiles for three person families with one workflow, then packages each profile as an Agent Skill.

### 2️⃣ Three character families

🧑‍💼 colleague
💞 relationship
🌟 celebrity

<sub>Coworkers · mentors · teammates · up/downstream partners</sub>
<sub>Exes · partners · parents · friends · close family</sub>
<sub>Public figures · creators · public voices · fictional characters</sub>

<sub>Builds a Work Skill + Persona from material-derived technical standards, workflows, expression, and workplace behavior. Supports Lark / DingTalk / Slack collection.</sub>
<sub>Organizes material-derived expression patterns, emotional triggers, conflict patterns, and repair patterns into a reusable Persona Skill.</sub>
<sub>Ships with a six-dimension research toolchain (subtitles → transcript cleanup → research merge → quality check) for organizing observable decisions, expression, and mental models.</sub>

Each family has its own source-collection strategy, analysis dimensions, and Person Profile structure.

### 3️⃣ More Agent hosts

The old version only ran in Claude Code. Distilly now supports native local Skill discovery across eight agent hosts.

[![Claude Code](docs/assets/hosts/claude-code-wordmark-light.svg)](https://claude.ai/code)
[![Hermes Agent](docs/assets/hosts/hermes-agent-wordmark.png)](https://github.com/NousResearch/hermes-agent)
[![OpenClaw](docs/assets/hosts/openclaw-wordmark-light.svg)](https://github.com/openclaw/openclaw)
[![Codex](docs/assets/hosts/codex-mark-light.png)](https://github.com/openai/codex)

[![DeepSeek Harness](docs/assets/hosts/deepseek-wordmark-light.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![Pi coding agent](docs/assets/hosts/pi-mark.svg)](https://pi.dev/docs/latest/skills)
[![Grok Build](docs/assets/hosts/grok-build-mark-light.png)](https://docs.x.ai/build/features/skills-plugins-marketplaces)
[![OpenCode](docs/assets/hosts/opencode-wordmark-light.svg)](https://opencode.ai/docs/skills)

<sub>Compatibility does not imply endorsement. [Logo sources](docs/assets/hosts/README.md).</sub>

**Grok Bot preview:** Grok Bot supports saved/private Skills, but its official docs do not describe direct local `SKILL.md` imports. Distilly's workflow can be migrated manually into a saved Skill; direct repo installation is not yet verified.

Each generated Person Profile is packaged as an Agent Skill and can be installed into any supported host.

## 📦 Supported Data Sources

### Source · Messages · Docs / Wiki · Spreadsheets · Notes
- **Source**: 🟢 Lark (auto) · **Messages**: ✅ API · **Docs / Wiki**: ✅ · **Spreadsheets**: ✅ · **Notes**: Just enter a name, fully automatic
- **Source**: 🟡 DingTalk (auto) · **Messages**: ⚠️ Browser · **Docs / Wiki**: ✅ · **Spreadsheets**: ✅ · **Notes**: DingTalk API doesn't support message history
- **Source**: 🟣 Slack (auto) · **Messages**: ✅ API · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Requires admin to install Bot; free plan limited to 90 days
- **Source**: 𝕏 Public X posts · **Messages**: ✅ API · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Optional, bounded celebrity research candidates through metered third-party service Xquik
- **Source**: 💬 WeChat chat history · **Messages**: ✅ SQLite · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Export first with WeChatMsg or PyWxDump
- **Source**: 📄 PDF / Images / Screenshots · **Messages**: — · **Docs / Wiki**: ✅ · **Spreadsheets**: — · **Notes**: Manual upload
- **Source**: 📦 Lark JSON export · **Messages**: ✅ · **Docs / Wiki**: ✅ · **Spreadsheets**: — · **Notes**: Manual upload
- **Source**: ✉️ Email `.eml` / `.mbox` · **Messages**: ✅ · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Manual upload
- **Source**: 📝 Markdown / direct paste · **Messages**: ✅ · **Docs / Wiki**: ✅ · **Spreadsheets**: — · **Notes**: Manual input

## ⚡ Install

It's 2026 — you have an Agent, let it install itself. Open a supported local agent host and hand it this line:

> Install Distilly for me: `https://github.com/titanwings/colleague-skill`

The Agent should install the repository as a Skill named `distilly`, then verify that the host discovers Distilly.

> **Upgrading an old install?** A `git pull` inside a `dot-skill` or legacy
> `~/.codex/skills/...` directory does not rename that discovery directory.
> Install a canonical `distilly` copy, verify that the host discovers Distilly, and only then
> retire the old copy. See the [detailed install and migration guide](INSTALL.md#existing-install-migration).

🛠️ Want to install it yourself? Click for paths

```bash
git clone https://github.com/titanwings/colleague-skill <TARGET>
```

### Host · `<TARGET>` path
- **Host**: Claude Code · **`<TARGET>` path**: `~/.claude/skills/distilly`
- **Host**: OpenClaw · **`<TARGET>` path**: `~/.openclaw/workspace/skills/distilly`
- **Host**: Codex · **`<TARGET>` path**: `~/.agents/skills/distilly` (user) or `.agents/skills/distilly` (project)
- **Host**: DeepSeek Harness · **`<TARGET>` path**: `~/.dsh/skills/distilly` (global) or `.dsh/skills/distilly` (project)
- **Host**: Pi coding agent · **`<TARGET>` path**: `~/.pi/agent/skills/distilly` or `~/.agents/skills/distilly`
- **Host**: Grok Build · **`<TARGET>` path**: `~/.grok/skills/distilly` or `~/.agents/skills/distilly`
- **Host**: OpenCode · **`<TARGET>` path**: `~/.config/opencode/skills/distilly` (user) or `.opencode/skills/distilly` (project)
- **Host**: Hermes · **`<TARGET>` path**: After clone, run `python3 tools/install_hermes_skill.py --force`

Generated character Skills can be published with `tools/install_claude_generated_skill.py`,
`tools/install_openclaw_generated_skill.py`, and `tools/install_codex_generated_skill.py`.
For Hermes, DeepSeek Harness, Pi, Grok Build, and OpenCode, run
`python3 tools/install_generated_skill.py --skill-dir "skills/{character}/{slug}" --host <host> --force`.
The installer writes only the self-contained `SKILL.md` plus install metadata and
normalizes legacy underscore frontmatter in the installed copy; it does not copy
private source material or rename the source Skill. Pass `--skills-dir` for a
project-level target. Hermes scans `~/.agents/skills` only when it is explicitly
added to `skills.external_dirs`.

> For Lark/DingTalk auto-collection credentials, host-specific installation details, Grok Bot's preview workflow, Windows-specific handling, etc., see **[Detailed Install Guide (INSTALL.md)](INSTALL.md)**

> **Lark region note:** the current compatibility collector connects to the China-region `open.feishu.cn` / `feishu.cn` endpoints. International `larksuite.com` tenant routing is not implemented yet.

## 🚀 Usage

Distilly first asks which family you want to distill: `colleague` · `relationship` · `celebrity`.

Then enter an alias, basic details, personality tags, and pick a data source. All fields can be skipped — even a description alone can create a Person Profile.

Once created, the profile is packaged as a Skill named `{character}-{slug}`.

### 🔬 Celebrity Research Toolchain

The `celebrity` family ships with an end-to-end research toolchain, from subtitles to a finished draft:

```bash
# Download video subtitles
bash tools/research/download_subtitles.sh "<video-url>" "./tmp/subtitles"

# Subtitles → transcript
python3 tools/research/srt_to_transcript.py "./tmp/subtitles/example.srt"

# Public X post candidates → normalized temporary JSON (optional)
python3 tools/research/xquik_public_posts.py \
  --username "" \
  --limit 20 \
  --output "/tmp/distilly-x-public-posts.json"

# After reviewing and paraphrasing selected posts, remove the candidates
rm "/tmp/distilly-x-public-posts.json"

# Merge research notes
python3 tools/research/merge_research.py "./skills/celebrity/<slug>"

# Quality check
python3 tools/research/quality_check.py "./skills/celebrity/<slug>/SKILL.md"
```

The optional collector reads `XQUIK_API_KEY` from your shell. Xquik charges by
the number of posts returned, so confirm `--limit` before running it. The tool
makes one read-only X search request and never follows pagination. Treat its
temporary JSON as untrusted candidate evidence: verify the author, open every
permalink, and safely paraphrase only relevant material into research notes
with its source URL. Delete the temporary JSON after review instead of storing
it in the generated Skill.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.

## ✨ Demo

One from each family.

### 🌟 celebrity — distilling Andrej Karpathy

> Six-dimension research: works · interviews · decisions · expression DNA · external evaluations · timeline
> Case adapted from community work [alchaincyf/karpathy-skill](https://github.com/alchaincyf/karpathy-skill)

```
User            ❯ Everyone's talking about Agents now — what do you think the 2026 AI Agent looks like?

celebrity.skill ❯ Everyone's doing demos, nobody's doing eval.
                  The Agent bottleneck was never model intelligence — it's scaffolding:
                  a strict evaluation harness, fine-grained error replay,
                  controllable tool-calling budgets, clean failure-mode analysis.
                  Most products are still stuck at "wrap an API + a few tools + a system prompt."
                  That's a demo, not an agent.
                  In 2026 I'm not betting on the strongest model — I'm betting on the best
                  scaffolding and the strictest eval.
```

### 🧑‍💼 colleague — distilling a ByteDance L2-1 backend

> Input: `ByteDance L2-1 backend engineer, INTJ, blame-shifter, ByteDance-style`

```
User            ❯ Can you review this API design?

colleague.skill ❯ Hold on — what's the impact? You haven't explained the context.
                  (after reading) N+1 query, fix it. Use the standard
                  {code, message, data} response format. That's the spec,
                  don't ask why.

User            ❯ This bug was introduced by you, right?

colleague.skill ❯ Does the timeline match? That feature touched multiple places,
                  there were other changes too.
```

### 💞 relationship — distilling someone you have a crush on

> Upload half a year of chat logs + "sensitive, quiet but stubborn, will actually reply seriously when it matters"

```
User               ❯ Did you think about me today?

relationship.skill ❯ ...I did, a little bit. Why are you asking?
```

📚 More real-world cases in the **[community gallery](https://titanwings.github.io/colleague-skill-site/)** — 100+ skills and counting

## 🔧 Features

### 🧱 Generated Skill Structure

Distilly's current creator uses **Persona** as the universal base, with family-specific modules layered on top:

### Family · Persona Content · Additional Modules
- **Family**: 🧑‍💼 **colleague** · **Persona Content**: 6-layer personality: hard rules → identity → expression → decisions → interpersonal → Correction · **Additional Modules**: ➕ **Work Skill**: scope, workflow, output preferences, experience knowledge base
- **Family**: 💞 **relationship** · **Persona Content**: Expression DNA · emotional triggers · conflict pattern · repair pattern · **Additional Modules**: —
- **Family**: 🌟 **celebrity** · **Persona Content**: Mental models · decision heuristics · expression DNA · external-evaluation contrast · **Additional Modules**: ➕ Six-dimension research dossier (works / interviews / decisions / timeline...)

> **Execution**: Receive task → Persona selects material-derived preferences and tone → Additional modules fill in execution detail → Produce a source-grounded response

### 🧬 Evolution

- 📥 **Append files** → auto-analyze delta → merge into relevant sections, never overwrite existing conclusions
- 💬 **Conversation correction** → say "they wouldn't do that, they'd be xxx" → writes to the Correction layer, takes effect immediately
- 🕰️ **Version control** → auto-archive on every update, rollback to any previous version
- 🔬 **Celebrity research pipeline** → subtitles → transcript cleanup → six-dimension research → quality check

## 📂 Project Structure

This project follows the [AgentSkills](https://agentskills.io) open standard. The entire repo is a skill directory.
Generated colleague skills live under `./skills/colleague`:

```
distilly/
├── SKILL.md                        # skill entry point (official frontmatter)
├── prompts/                        # prompt system across three families
│   ├── intake.md                   #   [colleague] info intake
│   ├── work_analyzer.md            #   [colleague] work capability extraction
│   ├── persona_analyzer.md         #   [colleague] personality extraction
│   ├── work_builder.md             #   [colleague] work.md generation
│   ├── persona_builder.md          #   [colleague] persona.md 6-layer structure
│   ├── merger.md                   #   [shared] incremental merge logic
│   ├── correction_handler.md       #   [shared] conversation correction
│   ├── relationship/               #   [relationship] emotion/conflict/repair prompts
│   └── celebrity/                  #   [celebrity] six-dimension research + mental-model prompts
├── tools/                          # Python tools
│   ├── feishu_auto_collector.py    #   [colleague] Lark-compatible auto-collector
│   ├── dingtalk_auto_collector.py  #   [colleague] DingTalk auto-collector
│   ├── slack_auto_collector.py     #   [colleague] Slack auto-collector
│   ├── email_parser.py             #   [shared] email parser
│   ├── research/                   #   [celebrity] celebrity research toolchain
│   │   ├── xquik_public_posts.py   #     bounded public X post candidates
│   │   ├── download_subtitles.sh   #     subtitle download
│   │   ├── transcribe_audio.py     #     audio → text
│   │   ├── srt_to_transcript.py    #     subtitles → transcript
│   │   ├── merge_research.py       #     six-dimension research merge
│   │   └── quality_check.py        #     quality check
│   ├── install_*_skill.py          #   [shared] multi-host one-shot installers
│   ├── skill_writer.py             #   [shared] skill file management
│   └── version_manager.py          #   [shared] version archive & rollback
├── skills/                         # generated Skills (gitignored)
│   ├── colleague/                  #   colleagues
│   ├── relationship/