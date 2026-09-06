![Awesome DSH Plugins — evidence-backed plugin radar](docs/assets/awesome-dsh-plugins-hero.png)

# Awesome DSH Plugins

> Discover installable DeepSeek Harness plugins, inspect the evidence behind each listing, and explore the 2Origin plugin lab.

[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)

## Start here

### I want to… · Go to
- **I want to…**: Find an installable DSH profile bundle · **Go to**: [Radar](#radar)
- **I want to…**: Estimate the work needed to port an Agent Skill · **Go to**: [Capability Port Score](#capability-port-score)
- **I want to…**: Search plugins offline from a terminal · **Go to**: [CLI search](#search-from-the-terminal)
- **I want to…**: Inspect plugins with reproducible runtime evidence · **Go to**: [Runtime compatibility layer](#runtime-compatibility-layer)
- **I want to…**: Explore evidence-first plugins built in this lab · **Go to**: [2Origin plugin lab](#2origin-plugin-lab)

Normal CLI searches use the committed snapshot and need no GitHub token:

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
```

This repository deliberately distinguishes a repository that mentions DSH from an installable DSH profile bundle. A plugin receives the **Verified Bundle** mark only when the scanner finds both:

1. a `package.json` declaration at `dsh.bundle.patch`; and
2. the declared patch file in the same Git tree.

This is structural verification, not a security audit or a promise that the plugin works with today's DSH main branch.
Categories are heuristic navigation aids; manifest and patch evidence, not the category label, determines verification.

## Radar

**1098** verified bundles / **1003** topic repositories examined / **11490** reported by GitHub

Other: 329 · UI / TUI: 225 · Token & Cost: 68 · Browser: 67 · MCP Bridge: 63 · Security: 61 · Memory: 55 · Model & Routing: 54 · Coding: 34 · Office: 32 · Developer Tools: 28 · Finance: 28 · Long-running: 22 · Writing / Novel: 19 · Research: 12 · Provenance & Lineage: 1

### Plugin · Category · Stars · License · Evidence · Install
- **Plugin**: [@open-design/dsh-runtime](https://github.com/nexu-io/open-design)<sub>nexu-io/open-design</sub> · **Category**: Office · **Stars**: 91246 · **License**: Apache-2.0 · **Evidence**: `packages/dsh-runtime/package.json` → `packages/dsh-runtime/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume)<sub>amruthpillai/reactive-resume</sub> · **Category**: MCP Bridge · **Stars**: 41696 · **License**: MIT · **Evidence**: `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@openviking/dsh-memory-plugin](https://github.com/volcengine/OpenViking)<sub>volcengine/OpenViking</sub> · **Category**: Memory · **Stars**: 33116 · **License**: AGPL-3.0 · **Evidence**: `examples/dsh-memory-plugin/package.json` → `examples/dsh-memory-plugin/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@wxg-prc-cpg/dsh-weknora](https://github.com/Tencent/WeKnora)<sub>Tencent/WeKnora</sub> · **Category**: Office · **Stars**: 20577 · **License**: NOASSERTION · **Evidence**: `packages/dsh-weknora/package.json` → `packages/dsh-weknora/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [dsh-plugin-desktop](https://github.com/anywhere-labs/dsh-desktop)<sub>anywhere-labs/dsh-desktop</sub> · **Category**: Other · **Stars**: 19998 · **License**: MIT · **Evidence**: `dsh-plugin-desktop/package.json` → `dsh-plugin-desktop/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@tt-a1i/archify-dsh](https://github.com/tt-a1i/archify)<sub>tt-a1i/archify</sub> · **Category**: Long-running · **Stars**: 15658 · **License**: MIT · **Evidence**: `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@memtensor/memos-local-plugin](https://github.com/MemTensor/MemOS)<sub>MemTensor/MemOS</sub> · **Category**: Token & Cost · **Stars**: 10966 · **License**: Apache-2.0 · **Evidence**: `apps/memos-local-plugin/package.json` → `apps/memos-local-plugin/adapters/deepseek-harness/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@dsh-external/dsh-super-injector](https://github.com/yjh051108/dsh-routing-suite)<sub>yjh051108/dsh-routing-suite</sub> · **Category**: Model & Routing · **Stars**: 6777 · **License**: MIT · **Evidence**: `injector/package.json` → `injector/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@dsh-web/files](https://github.com/zhu1090093659/dsh-web)<sub>zhu1090093659/dsh-web</sub> · **Category**: Browser · **Stars**: 6005 · **License**: Apache-2.0 · **Evidence**: `market/shell/packages/dsh-web-files/package.json` → `market/shell/packages/dsh-web-files/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [dsh-ouroboros](https://github.com/Q00/ouroboros)<sub>Q00/ouroboros</sub> · **Category**: Long-running · **Stars**: 5657 · **License**: MIT · **Evidence**: `integrations/dsh-plugin/package.json` → `integrations/dsh-plugin/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [deepseek-idesign](https://github.com/Devin-AXIS/iPolloWork)<sub>Devin-AXIS/iPolloWork</sub> · **Category**: Other · **Stars**: 4774 · **License**: NOASSERTION · **Evidence**: `external-plugins/deepseek-harness/design-studio/package.json` → `external-plugins/deepseek-harness/design-studio/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@petdex/dsh-plugin](https://github.com/crafter-station/petdex)<sub>crafter-station/petdex</sub> · **Category**: Other · **Stars**: 3974 · **License**: MIT · **Evidence**: `packages/petdex-desktop-native/integrations/dsh/package.json` → `packages/petdex-desktop-native/integrations/dsh/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@liustack/modlens](https://github.com/liustack/modlens)<sub>liustack/modlens</sub> · **Category**: MCP Bridge · **Stars**: 3644 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:liustack/modlens`
- **Plugin**: [@struktoai/mirage-dsh](https://github.com/strukto-ai/mirage)<sub>strukto-ai/mirage</sub> · **Category**: Other · **Stars**: 3563 · **License**: Apache-2.0 · **Evidence**: `typescript/packages/dsh/package.json` → `typescript/packages/dsh/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@agentscope-ai/reme](https://github.com/agentscope-ai/ReMe)<sub>agentscope-ai/ReMe</sub> · **Category**: Memory · **Stars**: 3344 · **License**: Apache-2.0 · **Evidence**: `packages/typescript/package.json` → `packages/typescript/dsh/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<sub>omdsh-dev/DSH-better-sidebar</sub> · **Category**: UI / TUI · **Stars**: 2861 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar`
- **Plugin**: [dsh-codex-taskboard](https://github.com/chuspeeism/dashi-taskboard)<sub>chuspeeism/dashi-taskboard</sub> · **Category**: Other · **Stars**: 2541 · **License**: Apache-2.0 · **Evidence**: `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@deepseek-harness-tui/dsh-tui](https://github.com/ccch1mneyyy/dsh-TUI)<sub>ccch1mneyyy/dsh-TUI</sub> · **Category**: UI / TUI · **Stars**: 2511 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:ccch1mneyyy/dsh-TUI`
- **Plugin**: [@zilliz/memsearch-dsh](https://github.com/zilliztech/memsearch)<sub>zilliztech/memsearch</sub> · **Category**: Memory · **Stars**: 2503 · **License**: MIT · **Evidence**: `plugins/dsh/package.json` → `plugins/dsh/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [dshmarket](https://github.com/dsh-market/dsh-market)<sub>dsh-market/dsh-market</sub> · **Category**: Finance · **Stars**: 2299 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:dsh-market/dsh-market`
- **Plugin**: [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<sub>Small-tailqwq/dsh-deep-whale</sub> · **Category**: UI / TUI · **Stars**: 1696 · **License**: — · **Evidence**: `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill)<sub>Tencent/BrowserSkill</sub> · **Category**: Browser · **Stars**: 1310 · **License**: MIT · **Evidence**: `packages/dsh-plugin-browserskill/package.json` → `packages/dsh-plugin-browserskill/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@mem9/dsh-plugin](https://github.com/mem9-ai/mem9)<sub>mem9-ai/mem9</sub> · **Category**: Memory · **Stars**: 1199 · **License**: Apache-2.0 · **Evidence**: `dsh-plugin/package.json` → `dsh-plugin/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [aegis](https://github.com/GanyuanRan/Aegis)<sub>GanyuanRan/Aegis</sub> · **Category**: Coding · **Stars**: 1129 · **License**: MIT · **Evidence**: `package.json` → `extensions/dsh/cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:GanyuanRan/Aegis`
- **Plugin**: [@open-pets/dsh](https://github.com/alvinunreal/openpets)<sub>alvinunreal/openpets</sub> · **Category**: Coding · **Stars**: 1115 · **License**: MIT · **Evidence**: `packages/dsh/package.json` → `packages/dsh/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq)<sub>agentrq/agentrq</sub> · **Category**: Long-running · **Stars**: 1088 · **License**: Apache-2.0 · **Evidence**: `plugins/deepseek-harness/package.json` → `plugins/deepseek-harness/cordis.patch.yml` · **Install**: See package docs
- **Plugin**: [dsh-context](https://github.com/bowenliang123/dsh-context)<sub>bowenliang123/dsh-context</sub> · **Category**: Browser · **Stars**: 1018 · **License**: Apache-2.0 · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:bowenliang123/dsh-context`
- **Plugin**: [@nanmicoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<sub>NanmiCoder/dsh-agent-teams</sub> · **Category**: Long-running · **Stars**: 980 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams`
- **Plugin**: [dsh-vision-router](https://github.com/ysr666/dsh-vision-router)<sub>ysr666/dsh-vision-router</sub> · **Category**: Model & Routing · **Stars**: 969 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:ysr666/dsh-vision-router`
- **Plugin**: [dsh-whale-widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)<sub>MeteorNOX/DeepSeek-Balance-Whale-Widget</sub> · **Category**: Other · **Stars**: 934 · **License**: MIT · **Evidence**: `package.json` → `cordis.patch.yml` · **Install**: `dsh plugin --profile web add github:MeteorNOX/DeepSeek-Balance-Whale-Widget`

The homepage shows the top 30 repositories once each; multi-bundle repositories and all records remain in [data/plugins.json](data/plugins.json). Snapshot: 2026-08-25T08:59:38.471Z.

The full machine-readable records live in [`data/plugins.json`](data/plugins.json). Topic-tagged repositories that do not yet pass bundle verification remain visible in [`data/candidates.json`](data/candidates.json); they are never silently presented as installable plugins.

## Capability Port Score

This second radar finds public `SKILL.md` candidates from Claude, Codex, shared `.agents`, OpenClaw, and SkillHub-oriented searches. It does not copy or republish their instructions. Each record pins the repository commit, file path, Git blob, content SHA-256, observed license source, and line-level adaptation signals before assigning one evidence-backed path:

- `copy`: self-contained instructions with no observed runtime, bundled-resource, executable, or permission dependency;
- `wrapper`: instructions that need a command, bundled resource, network, secret, write, or shell adapter;
- `bridge`: a harness hook, plugin protocol, or runtime-specific configuration must be translated;
- `unclassified`: required identity evidence is missing.

**49** revision-pinned candidates: Copy 15 · Wrapper 30 · Bridge 2 · Unclassified 2

### Capability · Source · Port path · Score · License · Pinned evidence
- **Capability**: [code-conventions](https://github.com/iflytek/skillhub/blob/d2403bb5911953b8f53e62c3f0a9edc291363944/.agents/skills/code-conventions/SKILL.md)<sub>iflytek/skillhub:.agents/skills/code-conventions/SKILL.md</sub> · **Source**: agents · **Port path**: copy · **Score**: 100/100 · **License**: Apache-2.0 · **Pinned evidence**: `d2403bb59119` / `2add2e311e6c`
- **Capability**: [fix](https://github.com/motiondivision/motion/blob/adaf7a4e5368d704ea350669f6ac674fb26ff270/.agents/skills/fix/SKILL.md)<sub>motiondivision/motion:.agents/skills/fix/SKILL.md</sub> · **Source**: agents · **Port path**: copy · **Score**: 95/100 · **License**: MIT · **Pinned evidence**: `adaf7a4e5368` / `a00ab8442e03`
- **Capability**: [fix-pr](https://github.com/questdb/questdb/blob/6610ab113b84528a73388b0722a38b97f9df78c2/.codex/skills/fix-pr/SKILL.md)<sub>questdb/questdb:.codex/skills/fix-pr/SKILL.md</sub> · **Source**: codex · **Port path**: copy · **Score**: 95/100 · **License**: Apache-2.0 · **Pinned evidence**: `6610ab113b84` / `e2293795c80c`
- **Capability**: [pr](https://github.com/GetStream/Vision-Agents/blob/3a8eec104f90ad3dbf76069ab99b40bac577f41b/.claude/skills/pr/SKILL.md)<sub>GetStream/Vision-Agents:.claude/skills/pr/SKILL.md</sub> · **Source**: claude · **Port path**: copy · **Score**: 95/100 · **License**: Apache-2.0 · **Pinned evidence**: `3a8eec104f90` / `85f841bbc968`
- **Capability**: [review](https://github.com/ailyProject/aily-blockly/blob/03989eedeae06c95ad9fbe31472db2091bb7ac10/.codex/skills/review/SKILL.md)<sub>ailyProject/aily-blockly:.codex/skills/review/SKILL.md</sub> · **Source**: codex · **Port path**: copy · **Score**: 95/100 · **License**: GPL-3.0 · **Pinned evidence**: `03989eedeae0` / `c417789bb49b`
- **Capability**: [seo](https://github.com/gridaco/grida/blob/5909675470e89f793becbd6d556c56485bcef7f9/.agents/skills/seo/SKILL.md)<sub>gridaco/grida:.agents/skills/seo/SKILL.md</sub> · **Source**: agents · **Port path**: copy · **Score**: 95/100 · **License**: Apache-2.0 · **Pinned evidence**: `5909675470e8` / `51350f506838`
- **Capability**: [pr](https://github.com/meshtastic/Meshtastic-Android/blob/42b07b22d7f2ed10d0ecc876796d8102d27631e6/.claude/skills/pr/SKILL.md)<sub>meshtastic/Meshtastic-Android:.claude/skills/pr/SKILL.md</sub> · **Source**: claude · **Port path**: copy · **Score**: 95/100 · **License**: GPL-3.0 · **Pinned evidence**: `42b07b22d7f2` / `7a332c807d86`
- **Capability**: [qa](https://github.com/wp-media/wp-rocket/blob/d103284e1931f34e8c078ad92dbb1c6912e3cfed/.claude/skills/qa/SKILL.md)<sub>wp-media/wp-rocket:.claude/skills/qa/SKILL.md</sub> · **Source**: claude · **Port path**: copy · **Score**: 95/100 · **License**: GPL-2.0 · **Pinned evidence**: `d103284e1931` / `dc958f2e1d97`
- **Capability**: [pr](https://github.com/woocommerce/woocommerce-ios/blob/8193985dbb9e1e05b3f0720fdff3b90ff1f658ea/.claude/skills/pr/SKILL.md)<sub>woocommerce/woocommerce-ios:.claude/skills/pr/SKILL.md</sub> · **Source**: claude · **Port path**: copy · **Score**: 95/100 · **License**: GPL-2.0 · **Pinned evidence**: `8193985dbb9e` / `f075eba0d630`
- **Capability**: [zod](https://github.com/hashintel/hash/blob/840ac684fbbad14fe07a8b27389cd90ad5210938/.codex/skills/zod/SKILL.md)<sub>hashintel/hash:.codex/skills/zod/SKILL.md</sub> · **Source**: codex · **Port path**: copy · **Score**: 90/100 · **License**: AGPL-3.0 · **Pinned evidence**: `840ac684fbba` / `a117ffc26060`
- **Capability**: [jna](https://github.com/JetBrains/intellij-community/blob/d698802bc0c02ef5816678a219f9fb3d158b6ee1/.agents/skills/jna/SKILL.md)<sub>JetBrains/intellij-community:.agents/skills/jna/SKILL.md</sub> · **Source**: agents · **Port path**: copy · **Score**: 85/100 · **License**: — · **Pinned evidence**: `d698802bc0c0` / `a27c2e6d5151`
- **Capability**: [s](https://github.com/RyanCodrai/turbovec/blob/8202f194a0cbbd52213a004290401e180e5c123d/.claude/skills/s/SKILL.md)<sub>RyanCodrai/turbovec:.claude/skills/s/SKILL.md</sub> · **Source**: claude · **Port path**: copy · **Score**: 85/100 · **License**: MIT · **Pinned evidence**: `8202f194a0cb` / `97d5d955a57a`
- **Capability**: [pr](https://github.com/liferay/liferay-portal/blob/4210365ab97e95a46106e7807dcb07199084dc60/.claude/skills/pr/SKILL.md)<sub>liferay/liferay-portal:.claude/skills/pr/SKILL.md</sub> · **Source**: claude · **Port path**: copy · **Score**: 85/100 · **License**: — · **Pinned evidence**: `4210365ab97e` / `3e71624f776d`
- **Capability**: [go](https://github.com/nevalang/neva/blob/bb7b3301b461c1d6ad8bc0199d51b6c4437855c3/.codex/skills/go/SKILL.md)<sub>nevalang/neva:.codex/skills/go/SKILL.md</sub> · **Source**: codex · **Port path**: copy · **Score**: 85/100 · **License**: MIT · **Pinned evidence**: `bb7b3301b461` / `675bccd70ae5`
- **Capability**: [pr](https://github.com/EverMind-AI/EverOS/blob/b078f72138ebd0148de5a24c4ce0283e2ebde8b7/.claude/skills/pr/SKILL.md)<sub>EverMind-AI/EverOS:.claude/skills/pr/SKILL.md</sub> · **Source**: claude · **Port path**: wrapper · **Score**: 79/100 · **License**: Apache-2.0 · **Pinned evidence**: `b078f72138eb` / `d24a3217df00`

Full records, score components, and line-level signals live in [data/capabilities.json](data/capabilities.json). Snapshot: 2026-08-