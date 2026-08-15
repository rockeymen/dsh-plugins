![COLLEAGUE.SKILL — Distill how they think.](docs/social-preview.png)

# 🧬 dot-skill（同事.skill）

### *"You folks building LLMs are all code-sages! Flesh is weak! Ascend to cyberspace!"*

🧑‍💼  Your colleague quit, your mentor graduated, your teammate transferred — taking their whole playbook and context with them?
💞  Your family, old friends, partner drifting apart — and you want to hold on to the way it felt to be with them?
🌟  Your favorite author, idol, thinker you'll never meet — but you want to know what they'd say about your question?

### ✨ dot-skill solves all three.

Upgraded from **colleague.skill** to **dot-skill** — not just colleagues, **anyone** can be distilled into a Skill

Colleagues · partners · family · old friends · idols · public figures · fictional characters — even yourself

**Source material + your description →  an AI Skill that genuinely thinks like them**
Thinks in their frame, speaks in their voice

[🆕 What's new](#-whats-new-in-this-major-release) · [📦 Data Sources](#-supported-data-sources) · [⚡ Install](#-install) · [🚀 Usage](#-usage) · [✨ Demo](#-demo) · [📝 Citation](#-citation) · [💬 Discord](https://discord.gg/NVX66RxWZv)

[**中文**](docs/lang/README_ZH.md) · [**Español**](docs/lang/README_ES.md) · [**Deutsch**](docs/lang/README_DE.md) · [**日本語**](docs/lang/README_JA.md) · [**Русский**](docs/lang/README_RU.md) · [**Português**](docs/lang/README_PT.md) · [**한국어**](docs/lang/README_KO.md)

### 🎉 2026.08.13 Milestone — **dot-skill has passed 20K ⭐!**

Massive thanks to everyone who starred — we'll keep shipping, keep distilling.

> 🔷 **2026.08.13 Update** — dot-skill now supports **DeepSeek Harness** through its native filesystem Skill discovery. Install it globally at `~/.dsh/skills/dot-skill` or per project at `.dsh/skills/dot-skill`, then invoke `/dot-skill` directly.

> 📝 **2026.06.01 Update** — **[COLLEAGUE.SKILL 技术报告](colleague_skill.pdf) 已上线**；这次最开心的不只是发了篇 paper，而是社区一起把 gallery 推到 215 个 skills、165 位贡献者和 100k+ skill-card 累计 stars，论文 Acknowledgements 也专门收录并感谢了所有社区贡献者。

> 📢 **2026.05.11 Update** — **WeChat group 12 is live!** Come hang out with the dot-skill community — share skills, discuss features, trade tips.
>
> ![dot-skill WeChat group QR](docs/assets/wechat-group-qr-12.png)
>
> QR refreshes every 7 days (expires 2026-05-18) — if expired, ping me on Discord.

> 🗺️ **2026.04.13** — **dot-skill Roadmap is live!** colleague.skill is evolving into **dot-skill** — distill anyone, not just colleagues. 👉 **[Full Roadmap](ROADMAP.md)** · **[💬 Discord](https://discord.gg/NVX66RxWZv)**

> 🌐 **2026.04.07** — Community gallery is live! Any skill / meta-skill can drive traffic directly to your own GitHub repo. No middleman. 👉 **[titanwings.github.io/colleague-skill-site](https://titanwings.github.io/colleague-skill-site/)**

Created by [@titanwings](https://github.com/titanwings) · Powered by **Shanghai AI Lab · AI Safety Center**

## 🆕 What's new in this major release?

### 1️⃣ From colleague-skill to dot-skill

No longer only built around the "colleague" scenario. A unified `/dot-skill` entrypoint sits on a general-purpose skill engine — one engine distills anyone, instead of being a colleague-specific script.

### 2️⃣ Three character families

🧑‍💼 colleague
💞 relationship
🌟 celebrity

<sub>Coworkers · mentors · teammates · up/downstream partners</sub>
<sub>Exes · partners · parents · friends · close family</sub>
<sub>Public figures · creators · public voices · fictional characters</sub>

<sub>Work Skill + Persona two-layer architecture — learns both their technical standards and workflows, and their manner of speaking and workplace posture. Supports Feishu / DingTalk / Slack auto-collection.</sub>
<sub>🆕 Photo-sharing feature coming soon — your distilled relationship won't just reply to messages; it'll send photos and share slices of its day, the way a real person would.</sub>
<sub>Ships with a complete six-dimension research toolchain (subtitles → transcript cleanup → research merge → quality check). Not mimicking tone — reproducing their mental models and decision frameworks.</sub>

Each family has its own prompt pipeline, source-collection strategy, and generation template.

### 3️⃣ More Agent hosts

The old version only ran in Claude Code. Now it's cross-host across five:
Compatible hosts:

### Host · Description
- **Host**: 🟣 **Claude Code** · **Description**: Native slash-command support
- **Host**: 🟠 **Hermes Agent** · **Description**: One-command install, `/dot-skill` works directly
- **Host**: 🔵 **OpenClaw** · **Description**: Fully compatible
- **Host**: ⚫ **Codex** · **Description**: Invoke by skill name
- **Host**: 🔷 **DeepSeek Harness** · **Description**: Native filesystem skill discovery; `/dot-skill` works directly

Generated character Skills can also be installed into any supported host.

## 📦 Supported Data Sources

### Source · Messages · Docs / Wiki · Spreadsheets · Notes
- **Source**: 🟢 Feishu (auto) · **Messages**: ✅ API · **Docs / Wiki**: ✅ · **Spreadsheets**: ✅ · **Notes**: Just enter a name, fully automatic
- **Source**: 🟡 DingTalk (auto) · **Messages**: ⚠️ Browser · **Docs / Wiki**: ✅ · **Spreadsheets**: ✅ · **Notes**: DingTalk API doesn't support message history
- **Source**: 🟣 Slack (auto) · **Messages**: ✅ API · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Requires admin to install Bot; free plan limited to 90 days
- **Source**: 💬 WeChat chat history · **Messages**: ✅ SQLite · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Export first with WeChatMsg / PyWxDump / 留痕
- **Source**: 📄 PDF / Images / Screenshots · **Messages**: — · **Docs / Wiki**: ✅ · **Spreadsheets**: — · **Notes**: Manual upload
- **Source**: 📦 Feishu JSON export · **Messages**: ✅ · **Docs / Wiki**: ✅ · **Spreadsheets**: — · **Notes**: Manual upload
- **Source**: ✉️ Email `.eml` / `.mbox` · **Messages**: ✅ · **Docs / Wiki**: — · **Spreadsheets**: — · **Notes**: Manual upload
- **Source**: 📝 Markdown / direct paste · **Messages**: ✅ · **Docs / Wiki**: ✅ · **Spreadsheets**: — · **Notes**: Manual input

## ⚡ Install

It's 2026 — you have an Agent, let it install itself. Open your Claude Code / Hermes / OpenClaw / Codex / DeepSeek Harness and hand it this line:

> Install the dot-skill skill for me: `https://github.com/titanwings/colleague-skill`

The Agent will detect the current host's skills directory, clone the repo, and register the entrypoint. Once done, type `/dot-skill` in any host to launch.

🛠️ Want to install it yourself? Click for paths

```bash
git clone https://github.com/titanwings/colleague-skill <TARGET>
```

### Host · `<TARGET>` path
- **Host**: Claude Code · **`<TARGET>` path**: `~/.claude/skills/dot-skill`
- **Host**: OpenClaw · **`<TARGET>` path**: `~/.openclaw/workspace/skills/dot-skill`
- **Host**: Codex · **`<TARGET>` path**: `~/.codex/skills/dot-skill`
- **Host**: DeepSeek Harness · **`<TARGET>` path**: `~/.dsh/skills/dot-skill` (global) or `.dsh/skills/dot-skill` (project)
- **Host**: Hermes · **`<TARGET>` path**: After clone, run `python3 tools/install_hermes_skill.py --force`

Generated character Skills can be published with `tools/install_claude_generated_skill.py`,
`tools/install_openclaw_generated_skill.py`, and `tools/install_codex_generated_skill.py`.
On DeepSeek Harness, place a generated Skill directory under `~/.dsh/skills/<skill-name>` or the current project's `.dsh/skills/<skill-name>`; no host-specific wrapper is required.

> For Feishu/DingTalk auto-collection credentials, publishing a generated character Skill to any host, Windows-specific handling, etc., see **[Detailed Install Guide (INSTALL.md)](INSTALL.md)**

## 🚀 Usage

In the host where dot-skill is installed, launch it — type `/dot-skill`, or just tell your Agent "start dot-skill".

It first asks which family you want to distill: `colleague` · `relationship` · `celebrity`.

Then enter alias, basic profile, personality tags, and pick a data source. All fields can be skipped — even a description alone can generate a Skill.

Once created, invoke the generated Skill with `/{character}-{slug}`.

### 🎛️ Commands

### Command · Description
- **Command**: `/dot-skill` · **Description**: Canonical unified entrypoint
- **Command**: `/{character}-{slug}` · **Description**: Invoke full Skill (Persona + Work)
- **Command**: `/{character}-{slug}-work` · **Description**: Work capabilities only
- **Command**: `/{character}-{slug}-persona` · **Description**: Persona only
- **Command**: `python3 tools/skill_writer.py --action list ...` · **Description**: List generated Skills across all three families
- **Command**: `python3 tools/version_manager.py --action rollback ...` · **Description**: Roll back a Skill version

### 🔬 Celebrity Research Toolchain

The `celebrity` family ships with an end-to-end research toolchain, from subtitles to a finished draft:

```bash
# Download video subtitles
bash tools/research/download_subtitles.sh "<video-url>" "./tmp/subtitles"

# Subtitles → transcript
python3 tools/research/srt_to_transcript.py "./tmp/subtitles/example.srt"

# Merge research notes
python3 tools/research/merge_research.py "./skills/celebrity/<slug>"

# Quality check
python3 tools/research/quality_check.py "./skills/celebrity/<slug>/SKILL.md"
```

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

dot-skill uses **Persona** as the universal base, with family-specific modules layered on top:

### Family · Persona Content · Additional Modules
- **Family**: 🧑‍💼 **colleague** · **Persona Content**: 6-layer personality: hard rules → identity → expression → decisions → interpersonal → Correction · **Additional Modules**: ➕ **Work Skill**: scope, workflow, output preferences, experience knowledge base
- **Family**: 💞 **relationship** · **Persona Content**: Expression DNA · emotional triggers · conflict pattern · repair pattern · **Additional Modules**: —
- **Family**: 🌟 **celebrity** · **Persona Content**: Mental models · decision heuristics · expression DNA · external-evaluation contrast · **Additional Modules**: ➕ Six-dimension research dossier (works / interviews / decisions / timeline...)

> **Execution**: Receive task → Persona decides attitude & tone → Additional modules fill in execution detail → Output in their voice

### 🧬 Evolution

- 📥 **Append files** → auto-analyze delta → merge into relevant sections, never overwrite existing conclusions
- 💬 **Conversation correction** → say "they wouldn't do that, they'd be xxx" → writes to the Correction layer, takes effect immediately
- 🕰️ **Version control** → auto-archive on every update, rollback to any previous version
- 🔬 **Celebrity research pipeline** → subtitles → transcript cleanup → six-dimension research → quality check

## 📂 Project Structure

This project follows the [AgentSkills](https://agentskills.io) open standard. The entire repo is a skill directory.
Generated colleague skills live under `./skills/colleague`:

```
dot-skill/
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
│   ├── feishu_auto_collector.py    #   [colleague] Feishu auto-collector
│   ├── dingtalk_auto_collector.py  #   [colleague] DingTalk auto-collector
│   ├── slack_auto_collector.py     #   [colleague] Slack auto-collector
│   ├── email_parser.py             #   [shared] email parser
│   ├── research/                   #   [celebrity] celebrity research toolchain
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
│   ├── relationship/               #   close relationships
│   └── celebrity/                  #   public figures
├── docs/PRD.md
├── requirements.txt
└── LICENSE
```

## ⚠️ Notes

**Source material quality = Skill quality** — and quality sources differ across families:

### Family · Source priority (high → low)
- **Family**: 🧑‍💼 **colleague** · **Source priority (high → low)**: Their **own long-form writing** (design docs / review comments) **›** **decision-making replies** **›** casual group chat
- **Family**: 💞 **relationship** · **Source priority (high → low)**: Complete chat history **›** letters / social posts / diaries **›** third-party descriptions
- **Family**: 🌟 **celebrity** · **Source priority (high → low)**: First-person books / blogs / long interviews **›** decision records (launches, commits, Q&A) **›** third-party commentary

- **colleague** Feishu auto-collection: requires adding the App bot to relevant group chats
- **relationship**: longer time spans are better; material covering both conflict and repair is ideal
- **celebrity**: avoid feeding only second-hand interpretations
- This is still a demo version — please file issues if you find bugs!

## 📄 Technical Report

> **[COLLEAGUE.SKILL: Automated AI Skill Generation via Expert Knowledge Distillation](colleague_skill.pdf)** ([arXiv](https://arxiv.org/abs/2605.31264) · [arXiv PDF](https://arxiv.org/pdf/2605.31264))
>
> This is the paper for **colleague.skill**, dot-skill's predecessor. It covers the Work Skill + Persona two-layer architecture, multi-source data collection, and Skill generation mechanics — the theoretical foundation for today's `colleague` family. Separate papers on the relationship / celebrity family extensions are planned.

## 📝 Citation

If you use **dot-skill** or **colleague.skill** in your research or applications, please cite the technical report:

```bibtex
@misc{zhou2026colleagueskill,
  title        = {COLLEAGUE.SKILL: Automated AI Skill Generation via Expert Knowledge Distillation},
  author       = {Tianyi Zhou and Dongrui Liu and Leitao Yuan and Jing Shao and Xia Hu},
  year         = {2026},
  eprint       = {2605.31264},
  archivePrefix = {arXiv},
  primaryClass = {cs.AI},
  url          = {https://arxiv.org/abs/2605.31264}
}
```

You can also use the machine-readable citation metadata in [CITATION.cff](CITATION.cff).

## ⭐ Star History

 
   
   
   ![](https://star-history.dera.page/svg?repos=titanwings%2Fcolleague-skill&type=date&legend=top-left)
 

**MIT License** © [titanwings](https://github.com/titanwings)