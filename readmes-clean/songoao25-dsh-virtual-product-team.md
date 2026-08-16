# Product Team Mode

Turn DeepSeek Harness into your virtual product development team. Say "I have an idea" and the AI walks you through the full pipeline — Product Manager → Engineer → QA → Release Engineer — from idea to shippable product. You only talk and make decisions. No technical knowledge required.

## What it is

**Product Team Mode** is a conversation mode (agent preset) for DeepSeek Harness (DSH). Inside this mode:

- **You say**: "I have an idea, I want to build XX"
- **The AI automatically starts the pipeline**: it interviews you like a product manager to clarify the idea → writes a requirements document for your review → designs the technical plan → implements it → runs QA and security audit → prepares release materials
- **Each stage finishes with a report to you**; you approve before it moves to the next stage (stage-gate control)

From start to finish, you never write code, never learn the process, and never need to remember technical jargon.

## The eight stages (all 12 phases covered)

### Stage · What happens · Output
- **Stage**: 1. Idea validation · **What happens**: Research market / competitors / feasibility · **Output**: Validation conclusion
- **Stage**: 2. Product definition & requirements · **What happens**: Positioning + concrete requirements with acceptance criteria · **Output**: Product definition + PRD
- **Stage**: 3. Technical design · **What happens**: Technical plan and task breakdown · **Output**: Tech design + task list
- **Stage**: 4. Development & quality · **What happens**: Implement + test + security audit · **Output**: Code + audit report
- **Stage**: 5. Release & deploy · **What happens**: Prepare distributable artifacts (GitHub standards) + go live · **Output**: README / version / Release / deploy check
- **Stage**: 6. Promotion & cold start · **What happens**: Launch kit (video script / article / channels) · **Output**: Promo materials
- **Stage**: 7. Operations & growth · **What happens**: Metrics dashboard, feedback channels, growth actions · **Output**: Operations plan
- **Stage**: 8. Iteration & maintenance · **What happens**: Feedback pool, roadmap, then loop to the next round · **Output**: Roadmap

## Installation

Prerequisites: DeepSeek Harness installed (`dsh` available in PATH).

```bash
git clone https://github.com/songoao25/dsh-virtual-product-team.git
cd dsh-virtual-product-team
./install.sh
```

Then **start a new conversation**, pick **Product Team Mode** in the mode picker, and simply say: "I have an idea…".

> Note: DSH only allows switching modes in a blank conversation, so start a new one first.

## Uninstall

```bash
cd dsh-virtual-product-team
./uninstall.sh
```

After uninstalling, new conversations return to the default mode. No leftovers, other modes are untouched.

## FAQ

**Q: Is it a plugin?** A: No, it's a conversation mode (preset). It changes how the AI behaves (becoming your product team); it doesn't change any existing DSH functionality.

**Q: Do I need to know tech?** A: No. The AI makes all technical decisions. You just answer questions and approve.

**Q: Does it affect my existing conversations/modes?** A: No. It's just one additional mode. Standard, Creator, and other modes remain unchanged.

**Q: What are the v1 limitations?** A: Conversation-only, no visual progress panel. For GitHub publishing, the release stage asks you which local AI assistant to use and then handles the commit/tag/Release with it.

**Q: Can it develop DSH modes/plugins (like Creator mode)?** A: Yes, since v1.1.0. The mode ships the same self-modification toolset and the two official Cordis authoring skills as Creator mode, so your product team can build new DSH modes and plugins too. That toolset carries shell-level trust and is only used when you explicitly ask for a DSH-specific product.