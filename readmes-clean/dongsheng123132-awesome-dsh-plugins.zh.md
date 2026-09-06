![Awesome DSH Plugins——有证据的插件雷达](docs/assets/awesome-dsh-plugins-hero.png)

# Awesome DSH Plugins

> 发现真正可安装的 DeepSeek Harness 插件，查看每条收录背后的证据，并探索 2Origin 插件实验室。

[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)

[English](README.md) · [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness) · [浏览已验证 Bundle](#插件雷达) · [终端搜索](#在终端里搜索) · [2Origin 插件实验室](#2origin-插件实验室)

## 从这里开始

### 我想…… · 去这里
- **我想……**: 找一个真正可安装的 DSH profile bundle · **去这里**: [插件雷达](#插件雷达)
- **我想……**: 估算把 Agent Skill 移植进 DSH 的工作量 · **去这里**: [能力移植评分](#能力移植评分)
- **我想……**: 在终端离线搜索插件 · **去这里**: [CLI 搜索](#在终端里搜索)
- **我想……**: 查看带可复现运行证据的插件 · **去这里**: [运行时兼容性层](#运行时兼容性层)
- **我想……**: 探索本实验室孵化的证据优先插件 · **去这里**: [2Origin 插件实验室](#2origin-插件实验室)

普通 CLI 搜索只读仓库内已提交的快照，不需要 GitHub token：

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
```

本仓刻意区分“提到了 DSH 的仓库”和“DSH 真正能激活的 profile bundle”。扫描器只有同时找到下面两项，才授予 **Verified Bundle**：

1. `package.json` 中存在 `dsh.bundle.patch` 声明；
2. 同一 Git tree 中确实存在该声明指向的 patch 文件。

这是结构验证，不是安全审计，也不等于插件一定兼容今天的 DSH main 分支。
分类只是启发式导航；决定验证状态的是 manifest 与 patch 证据，不是分类标签。

## 插件雷达

**1098** 个 Verified Bundle / 检查 **1003** 个 topic 仓库 / GitHub 报告总数 **11490**

Other: 329 · UI / TUI: 225 · Token & Cost: 68 · Browser: 67 · MCP Bridge: 63 · Security: 61 · Memory: 55 · Model & Routing: 54 · Coding: 34 · Office: 32 · Developer Tools: 28 · Finance: 28 · Long-running: 22 · Writing / Novel: 19 · Research: 12 · Provenance & Lineage: 1

### 插件 · 分类 · Stars · License · 证据 · 安装
- **插件**: [@open-design/dsh-runtime](https://github.com/nexu-io/open-design)<sub>nexu-io/open-design</sub> · **分类**: Office · **Stars**: 91246 · **License**: Apache-2.0 · **证据**: `packages/dsh-runtime/package.json` → `packages/dsh-runtime/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume)<sub>amruthpillai/reactive-resume</sub> · **分类**: MCP Bridge · **Stars**: 41696 · **License**: MIT · **证据**: `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@openviking/dsh-memory-plugin](https://github.com/volcengine/OpenViking)<sub>volcengine/OpenViking</sub> · **分类**: Memory · **Stars**: 33116 · **License**: AGPL-3.0 · **证据**: `examples/dsh-memory-plugin/package.json` → `examples/dsh-memory-plugin/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@wxg-prc-cpg/dsh-weknora](https://github.com/Tencent/WeKnora)<sub>Tencent/WeKnora</sub> · **分类**: Office · **Stars**: 20577 · **License**: NOASSERTION · **证据**: `packages/dsh-weknora/package.json` → `packages/dsh-weknora/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [dsh-plugin-desktop](https://github.com/anywhere-labs/dsh-desktop)<sub>anywhere-labs/dsh-desktop</sub> · **分类**: Other · **Stars**: 19998 · **License**: MIT · **证据**: `dsh-plugin-desktop/package.json` → `dsh-plugin-desktop/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@tt-a1i/archify-dsh](https://github.com/tt-a1i/archify)<sub>tt-a1i/archify</sub> · **分类**: Long-running · **Stars**: 15658 · **License**: MIT · **证据**: `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@memtensor/memos-local-plugin](https://github.com/MemTensor/MemOS)<sub>MemTensor/MemOS</sub> · **分类**: Token & Cost · **Stars**: 10966 · **License**: Apache-2.0 · **证据**: `apps/memos-local-plugin/package.json` → `apps/memos-local-plugin/adapters/deepseek-harness/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@dsh-external/dsh-super-injector](https://github.com/yjh051108/dsh-routing-suite)<sub>yjh051108/dsh-routing-suite</sub> · **分类**: Model & Routing · **Stars**: 6777 · **License**: MIT · **证据**: `injector/package.json` → `injector/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@dsh-web/files](https://github.com/zhu1090093659/dsh-web)<sub>zhu1090093659/dsh-web</sub> · **分类**: Browser · **Stars**: 6005 · **License**: Apache-2.0 · **证据**: `market/shell/packages/dsh-web-files/package.json` → `market/shell/packages/dsh-web-files/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [dsh-ouroboros](https://github.com/Q00/ouroboros)<sub>Q00/ouroboros</sub> · **分类**: Long-running · **Stars**: 5657 · **License**: MIT · **证据**: `integrations/dsh-plugin/package.json` → `integrations/dsh-plugin/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [deepseek-idesign](https://github.com/Devin-AXIS/iPolloWork)<sub>Devin-AXIS/iPolloWork</sub> · **分类**: Other · **Stars**: 4774 · **License**: NOASSERTION · **证据**: `external-plugins/deepseek-harness/design-studio/package.json` → `external-plugins/deepseek-harness/design-studio/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@petdex/dsh-plugin](https://github.com/crafter-station/petdex)<sub>crafter-station/petdex</sub> · **分类**: Other · **Stars**: 3974 · **License**: MIT · **证据**: `packages/petdex-desktop-native/integrations/dsh/package.json` → `packages/petdex-desktop-native/integrations/dsh/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@liustack/modlens](https://github.com/liustack/modlens)<sub>liustack/modlens</sub> · **分类**: MCP Bridge · **Stars**: 3644 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:liustack/modlens`
- **插件**: [@struktoai/mirage-dsh](https://github.com/strukto-ai/mirage)<sub>strukto-ai/mirage</sub> · **分类**: Other · **Stars**: 3563 · **License**: Apache-2.0 · **证据**: `typescript/packages/dsh/package.json` → `typescript/packages/dsh/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@agentscope-ai/reme](https://github.com/agentscope-ai/ReMe)<sub>agentscope-ai/ReMe</sub> · **分类**: Memory · **Stars**: 3344 · **License**: Apache-2.0 · **证据**: `packages/typescript/package.json` → `packages/typescript/dsh/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<sub>omdsh-dev/DSH-better-sidebar</sub> · **分类**: UI / TUI · **Stars**: 2861 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar`
- **插件**: [dsh-codex-taskboard](https://github.com/chuspeeism/dashi-taskboard)<sub>chuspeeism/dashi-taskboard</sub> · **分类**: Other · **Stars**: 2541 · **License**: Apache-2.0 · **证据**: `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@deepseek-harness-tui/dsh-tui](https://github.com/ccch1mneyyy/dsh-TUI)<sub>ccch1mneyyy/dsh-TUI</sub> · **分类**: UI / TUI · **Stars**: 2511 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:ccch1mneyyy/dsh-TUI`
- **插件**: [@zilliz/memsearch-dsh](https://github.com/zilliztech/memsearch)<sub>zilliztech/memsearch</sub> · **分类**: Memory · **Stars**: 2503 · **License**: MIT · **证据**: `plugins/dsh/package.json` → `plugins/dsh/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [dshmarket](https://github.com/dsh-market/dsh-market)<sub>dsh-market/dsh-market</sub> · **分类**: Finance · **Stars**: 2299 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:dsh-market/dsh-market`
- **插件**: [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<sub>Small-tailqwq/dsh-deep-whale</sub> · **分类**: UI / TUI · **Stars**: 1696 · **License**: — · **证据**: `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill)<sub>Tencent/BrowserSkill</sub> · **分类**: Browser · **Stars**: 1310 · **License**: MIT · **证据**: `packages/dsh-plugin-browserskill/package.json` → `packages/dsh-plugin-browserskill/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@mem9/dsh-plugin](https://github.com/mem9-ai/mem9)<sub>mem9-ai/mem9</sub> · **分类**: Memory · **Stars**: 1199 · **License**: Apache-2.0 · **证据**: `dsh-plugin/package.json` → `dsh-plugin/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [aegis](https://github.com/GanyuanRan/Aegis)<sub>GanyuanRan/Aegis</sub> · **分类**: Coding · **Stars**: 1129 · **License**: MIT · **证据**: `package.json` → `extensions/dsh/cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:GanyuanRan/Aegis`
- **插件**: [@open-pets/dsh](https://github.com/alvinunreal/openpets)<sub>alvinunreal/openpets</sub> · **分类**: Coding · **Stars**: 1115 · **License**: MIT · **证据**: `packages/dsh/package.json` → `packages/dsh/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq)<sub>agentrq/agentrq</sub> · **分类**: Long-running · **Stars**: 1088 · **License**: Apache-2.0 · **证据**: `plugins/deepseek-harness/package.json` → `plugins/deepseek-harness/cordis.patch.yml` · **安装**: 需看包说明
- **插件**: [dsh-context](https://github.com/bowenliang123/dsh-context)<sub>bowenliang123/dsh-context</sub> · **分类**: Browser · **Stars**: 1018 · **License**: Apache-2.0 · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:bowenliang123/dsh-context`
- **插件**: [@nanmicoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<sub>NanmiCoder/dsh-agent-teams</sub> · **分类**: Long-running · **Stars**: 980 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams`
- **插件**: [dsh-vision-router](https://github.com/ysr666/dsh-vision-router)<sub>ysr666/dsh-vision-router</sub> · **分类**: Model & Routing · **Stars**: 969 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:ysr666/dsh-vision-router`
- **插件**: [dsh-whale-widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)<sub>MeteorNOX/DeepSeek-Balance-Whale-Widget</sub> · **分类**: Other · **Stars**: 934 · **License**: MIT · **证据**: `package.json` → `cordis.patch.yml` · **安装**: `dsh plugin --profile web add github:MeteorNOX/DeepSeek-Balance-Whale-Widget`

首页按仓库去重展示 Stars 前 30 项；同仓多 bundle 与全部结果见 [data/plugins.json](data/plugins.json)。快照：2026-08-25T08:59:38.471Z。

完整机器可读记录在 [`data/plugins.json`](data/plugins.json)。只贴了 topic、尚未通过 bundle 验证的仓库保留在 [`data/candidates.json`](data/candidates.json)，不会悄悄混进“可安装插件”。

## Capability Port Score

第二张雷达从 Claude、Codex、共享 `.agents`、OpenClaw 与 SkillHub 定向搜索中发现公开 `SKILL.md` 候选，但不复制或重新发布其指令正文。每条记录先钉死仓库 commit、文件路径、Git blob、内容 SHA-256、许可证证据来源和逐行适配信号，再给出有证据的迁移路径：

- `copy`：未观察到运行时、随包资源、可执行命令或权限依赖的自包含指令；
- `wrapper`：需要命令、随包资源、网络、密钥、写入或 Shell 适配层；
- `bridge`：必须翻译 Harness hook、插件协议或运行时专属配置；
- `unclassified`：缺少必要的身份信息，保持未分类。

**49** 条固定 revision 候选：Copy 15 · Wrapper 30 · Bridge 2 · 未分类 2

### 能力 · 来源 · 移植路径 · 分数 · License · 固定证据
- **能力**: [code-conventions](https://github.com/iflytek/skillhub/blob/d2403bb5911953b8f53e62c3f0a9edc291363944/.agents/skills/code-conventions/SKILL.md)<sub>iflytek/skillhub:.agents/skills/code-conventions/SKILL.md</sub> · **来源**: agents · **移植路径**: copy · **分数**: 100/100 · **License**: Apache-2.0 · **固定证据**: `d2403bb59119` / `2add2e311e6c`
- **能力**: [fix](https://github.com/motiondivision/motion/blob/adaf7a4e5368d704ea350669f6ac674fb26ff270/.agents/skills/fix/SKILL.md)<sub>motiondivision/motion:.agents/skills/fix/SKILL.md</sub> · **来源**: agents · **移植路径**: copy · **分数**: 95/100 · **License**: MIT · **固定证据**: `adaf7a4e5368` / `a00ab8442e03`
- **能力**: [fix-pr](https://github.com/questdb/questdb/blob/6610ab113b84528a73388b0722a38b97f9df78c2/.codex/skills/fix-pr/SKILL.md)<sub>questdb/questdb:.codex/skills/fix-pr/SKILL.md</sub> · **来源**: codex · **移植路径**: copy · **分数**: 95/100 · **License**: Apache-2.0 · **固定证据**: `6610ab113b84` / `e2293795c80c`
- **能力**: [pr](https://github.com/GetStream/Vision-Agents/blob/3a8eec104f90ad3dbf76069ab99b40bac577f41b/.claude/skills/pr/SKILL.md)<sub>GetStream/Vision-Agents:.claude/skills/pr/SKILL.md</sub> · **来源**: claude · **移植路径**: copy · **分数**: 95/100 · **License**: Apache-2.0 · **固定证据**: `3a8eec104f90` / `85f841bbc968`
- **能力**: [review](https://github.com/ailyProject/aily-blockly/blob/03989eedeae06c95ad9fbe31472db2091bb7ac10/.codex/skills/review/SKILL.md)<sub>ailyProject/aily-blockly:.codex/skills/review/SKILL.md</sub> · **来源**: codex · **移植路径**: copy · **分数**: 95/100 · **License**: GPL-3.0 · **固定证据**: `03989eedeae0` / `c417789bb49b`
- **能力**: [seo](https://github.com/gridaco/grida/blob/5909675470e89f793becbd6d556c56485bcef7f9/.agents/skills/seo/SKILL.md)<sub>gridaco/grida:.agents/skills/seo/SKILL.md</sub> · **来源**: agents · **移植路径**: copy · **分数**: 95/100 · **License**: Apache-2.0 · **固定证据**: `5909675470e8` / `51350f506838`
- **能力**: [pr](https://github.com/meshtastic/Meshtastic-Android/blob/42b07b22d7f2ed10d0ecc876796d8102d27631e6/.claude/skills/pr/SKILL.md)<sub>meshtastic/Meshtastic-Android:.claude/skills/pr/SKILL.md</sub> · **来源**: claude · **移植路径**: copy · **分数**: 95/100 · **License**: GPL-3.0 · **固定证据**: `42b07b22d7f2` / `7a332c807d86`
- **能力**: [qa](https://github.com/wp-media/wp-rocket/blob/d103284e1931f34e8c078ad92dbb1c6912e3cfed/.claude/skills/qa/SKILL.md)<sub>wp-media/wp-rocket:.claude/skills/qa/SKILL.md</sub> · **来源**: claude · **移植路径**: copy · **分数**: 95/100 · **License**: GPL-2.0 · **固定证据**: `d103284e1931` / `dc958f2e1d97`
- **能力**: [pr](https://github.com/woocommerce/woocommerce-ios/blob/8193985dbb9e1e05b3f0720fdff3b90ff1f658ea/.claude/skills/pr/SKILL.md)<sub>woocommerce/woocommerce-ios:.claude/skills/pr/SKILL.md</sub> · **来源**: claude · **移植路径**: copy · **分数**: 95/100 · **License**: GPL-2.0 · **固定证据**: `8193985dbb9e` / `f075eba0d630`
- **能力**: [zod](https://github.com/hashintel/hash/blob/840ac684fbbad14fe07a8b27389cd90ad5210938/.codex/skills/zod/SKILL.md)<sub>hashintel/hash:.codex/skills/zod/SKILL.md</sub> · **来源**: codex · **移植路径**: copy · **分数**: 90/100 · **License**: AGPL-3.0 · **固定证据**: `840ac684fbba` / `a117ffc26060`
- **能力**: [jna](https://github.com/JetBrains/intellij-community/blob/d698802bc0c02ef5816678a219f9fb3d158b6ee1/.agents/skills/jna/SKILL.md)<sub>JetBrains/intellij-community:.agents/skills/jna/SKILL.md</sub> · **来源**: agents · **移植路径**: copy · **分数**: 85/100 · **License**: — · **固定证据**: `d698802bc0c0` / `a27c2e6d5151`
- **能力**: [s](https://github.com/RyanCodrai/turbovec/blob/8202f194a0cbbd52213a004290401e180e5c123d/.claude/skills/s/SKILL.md)<sub>RyanCodrai/turbovec:.claude/skills/s/SKILL.md</sub> · **来源**: claude · **移植路径**: copy · **分数**: 85/100 · **License**: MIT · **固定证据**: `8202f194a0cb` / `97d5d955a57a`
- **能力**: [pr](https://github.com/liferay/liferay-portal/blob/4210365ab97e95a46106e7807dcb07199084dc60/.claude/skills/pr/SKILL.md)<sub>liferay/liferay-portal:.claude/skills/pr/SKILL.md</sub> · **来源**: claude · **移植路径**: copy · **分数**: 85/100 · **License**: — · **固定证据**: `4210365ab97e` / `3e71624f776d`
- **能力**: [go](https://github.com/nevalang/neva/blob/bb7b3301b461c1d6ad8bc0199d51b6c4437855c3/.codex/skills/go/SKILL.md)<sub>nevalang/neva:.codex/skills/go/SKILL.md</sub> · **来源**: codex · **移植路径**: copy · **分数**: 85/100 · **License**: MIT · **固定证据**: `bb7b3301b461` / `675bccd70ae5`
- **能力**: [pr](https://github.com/EverMind-AI/EverOS/blob/b078f72138ebd0148de5a24c4ce0283e2ebde8b7/.claude/skills/pr/SKILL.md)<sub>EverMind-AI/EverOS:.claude/skills/pr/SKILL.md</sub> · **来源**: claude · **移植路径**: wrapper · **分数**: 79/100 · **License**: Apache-2.0 · **固定证据**: `b078f72138eb` / `d24a3217df00`

完整记录、分项得分与逐行信号见 [data/capabilities.json](data/capabilities.json)。快照：2026-08-13T22:47:12.754Z。分数只衡量观测到的适配工作量，不代表兼容、安全、质量或许可证已获准。

## 命令行搜索

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
npx github:dongsheng123132/awesome-dsh-plugins runtime skillport
npx github:dongsheng123132/awesome-dsh-plugins risk process-execution
npx github:dongsheng123132/awesome-dsh-plugins ports cad
```

CLI 读取仓库已经提交的快照，普通搜索不需要 GitHub Token。

## 静态审查信号

雷达还会读取每个已验证 bundle 的 patch 和运行依赖，标记秘密配置、进程执行、文件系统、网络/浏览器、MCP 外部工具与 Web 客户端扩展等审查信号。第一轮 488 个 bundle 中有 163 个至少命中一项；这些信号带有 `patch` 或 `dependencies` 来源，只用于决定人工审查优先级，**不是漏洞结论，也不是安全认证**。完整记录在 [`data/plugins.json`](data/plugins.json)，命令行可用 `risk [signal]` 查询。

## 运行时兼容证据层

`Verified Bundle` 只证明仓库同时存在 `dsh.bundle.patch` 声明和它引用的 patch 文件。真正的运行证据单独放在 [`data/runtime-compat.json`](data/runtime-compat.json)：每份报告钉死 DSH commit 与 Node 运行时，在全新的临时 profile 中安装、组合 patch 栈，再真实启动 Web profile，直到 DSH 自己打印 readiness URL。

第一次审计已经说明为什么必须分层：审计时 `@dsh-skillport/bundle` 尚未出现在 npm，因此 README 中的 registry 安装路径真实失败；但同一源码 commit 本地构建后，在 Node 24.19.0、已有构建产物的 DSH `47f943859bef` 检出上完成安装、组合并启动到真实 readiness URL。干净 detached DSH 检出能安装、组合插件，但因缺少 DSH Web client bundle 被阻塞；继续构建该检出又先在 DSH 自身的 `tsdown` 缺 `unrun` 处失败。因此目前证据只支持“兼容已有构建产物的检出”，还不支持“干净源码可复现”。Node 22.14 那次另记为 `blocked-environment`，因为它不满足 DSH 自己声明的最低引擎要求，不能算插件失败。

下一层现已机器化：[`data/runtime-targets.json`](data/runtime-targets.json) 同时钉死 0.1.1 之前的兼容锚点与官方 `dsh-v0.1.1-rc.2` 两条具名 DSH 基线、四个观察型社区插件 commit 和一个必须通过的 2Origin 阳性对照。[运行时兼容矩阵](.github/workflows/runtime-compat.yml) 在 Ubuntu 与 Windows 上运行完整的“基线 × OS × package”笛卡尔积，先启动每条 stock DSH Web 基线作为仪器阳性对照，再在全新 `DSH_HOME` 中逐一安装、组合和启动各元组。基线 ID、固定 revision、报告路径、缓存键与 artifact 名互相隔离，升级证据不能覆盖旧锚点。基线生命周期脚本由各固定 DSH commit 自己的失败闭合 `strictDepBuilds` 与逐项审核 `allowBuilds` 策略管控，插件侧仍只精确放行目标声明的一个固定包。报告还会解析已安装包声明的入口；若构建产物缺失，则记为 `package-artifact-missing`，不再与 Harness 启动故障混为一谈。每次运行都会在移除凭据形与 CI 控制环境变量后上传只创建不覆盖、内容寻址的报告。`observe` 目标的有效负报告会记录生态兼容事实但不会把仪器本身判红；`required` 目标必须通过，证据缺失或格式错误始终失败。通过只证明指定组合兼容，不是安全认证。

可复跑命令：

```bash
node scripts/runtime-verify.mjs --spec <包名或已构建检出目录> \
  --dsh-repo /path/to/deepseek-harness \
  --node /path/to/node-24 \
  --record data/runtime-compat.json
```

## 2Origin 插件实验室

### 项目 · 状态 · 分类 · 要解决的问题 · 证据

实验状态必须有证据才能升级：

- `planned`：已有问题定义和验收目标，但还没有可运行仓库。
- `experimental`：已有可运行仓库，但兼容性尚未得到证明。
- `verified`：在明确的 DSH revision 上观察到安装成功，并跑过声明的 smoke test。
- `deprecated`：实验不再维护。

正式插件运行时代码继续独立分仓。本仓只负责发现、证据、比较和实验状态，不把几十个插件塞进一个大仓库。

## 自动维护

定时工作流每 4 小时扫描公开 [`dsh-plugin`](https://git