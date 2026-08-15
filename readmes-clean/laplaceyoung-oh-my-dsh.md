# oh-my-dsh

**Topics:** `deepseek-harness` · `dsh-plugin` · `dsh-ecosystem` · `oh-my-dsh`

> 从其他开源 harness 中选取有用的能力，重写为适配 DSH（DeepSeek Harness SDK）的插件。
> 所有插件遵循 DSH 的插件规范：只通过扩展接缝（`ctx.effect()` / `ctx.on()` / `ctx.tools` 等）注册，
> **不修改 agent-loop 骨架、不引入热路径开销**。

## 目标

DSH 是一个插件化的 agent harness。opencode、oh-my-pi、Codex CLI、Claude Code、pi、Goose、Aider、
LangGraph、PyRIT 等工具各有成熟能力（编排、记忆、审批、评估、安全护栏、自动化、开发者体验……）。
本项目逐项对照这些工具，把其中对 DSH 用户有用的能力**以插件形态重写并适配 DSH 的接缝与约定**，
形成可直接安装的能力库。

工作流：

```
调研（对照开源 harness，找出可借鉴的能力）
  → 登记差距（GAP-LEDGER.md）
    → 设计插件（遵循 DSH 能力接缝三件套：interface / implementation / consumer）
      → 实现 + vitest 测试
        → e2e 验证（挂载进真实 DSH 环境 + 真实 LLM 冒烟）
```

- **差距登记**：`GAP-LEDGER.md` + `swarm/ledger/` 下的条目，状态机：`open → designing → implementing → verifying → closed`
- **插件纪律**：注册是副作用（`ctx.effect()` / `ctx.on()` 返回 disposer）；能力接缝三件套；显式 > 隐式；配置可调、无硬编码；禁改 `agent-loop`
- **验证**：每个插件 vitest 单测全绿 + typecheck 0 错误；e2e 环境挂载全部插件做注册校验与真实 LLM 冒烟

## 快速开始

```bash
# 1. 安装并运行全部测试
pnpm install
pnpm test

# 2. 单个插件
cd plugins/<gap-id>/ && pnpm install && pnpm test

# 3. e2e 验证（需 DSH_HOME/.env 中的 DEEPSEEK_API_KEY）
bash e2e/run-e2e.sh
```

## 对照项目

### 项目 · 定位 · 借鉴的能力面
- **项目**: [opencode](https://github.com/sst/opencode) · **定位**: 终端 AI 编码代理（Go+TS client-server） · **借鉴的能力面**: 会话模型、MCP 生态、编辑器集成、file-sync
- **项目**: [oh-my-pi](https://github.com/acidsugarx/oh-my-pi) · **定位**: Pi 增强框架 · **借鉴的能力面**: 编排器 prompt、专家子代理、技能注入
- **项目**: [Codex CLI](https://github.com/openai/codex) · **定位**: OpenAI 终端代理（Rust） · **借鉴的能力面**: 审批词表、会话快照、rollout/canary
- **项目**: [Claude Code](https://code.claude.com/) · **定位**: Anthropic 终端代理 · **借鉴的能力面**: 记忆写回、hooks、CLAUDE.md、checkpoint
- **项目**: [pi](https://github.com/earendil-works/pi) · **定位**: 可扩展 coding agent toolkit · **借鉴的能力面**: 插件体系、TUI、provider 抽象
- **项目**: [Goose / Aider / OpenHands](https://github.com/block/goose) · **定位**: 开源 agent 工具 · **借鉴的能力面**: repo map、SEARCH/REPLACE、自动 commit、agent 评估
- **项目**: [LangGraph / CrewAI](https://github.com/langchain-ai/langgraph) · **定位**: 编排框架 · **借鉴的能力面**: checkpointer、时间旅行、任务 DAG、失败策略
- **项目**: [PyRIT / garak / Guardrails](https://github.com/Azure/PyRIT) · **定位**: 对抗安全 · **借鉴的能力面**: 红队编排、输出护栏、PII 复检、越狱检测、安全报告

> 调研材料见 `swarm/ledger/GAP-round*.md` 与 `harness-analysis/analysis/notes/comparison/`。

## 状态

- [x] 第一轮（oh-my-pi / opencode / codex / claude-code / pi 深挖，24 条差距）→ **全部 closed**
- [x] 第二轮（webui / harness，34 条差距）→ **全部 closed**
- [x] 第三轮（collab / automation / experience，23 条差距）→ **全部 closed**
- [x] 第四轮（webui 呈现 / harness 前沿 / 运维安全，30 条差距 0501~0530）→ **全部 closed**
- [x] 第五轮（集成消费端 / 可靠性性能 / 生态前沿，30 条差距 0601~0630）→ **全部 closed**
- [x] 第六轮（体验纵深 / 数据智能 / 企业治理，30 条差距 0701~0730）→ **全部 closed**
- [x] 第七轮（dx 体验 / 安全纵深 / AI 前沿，30 条差距 0801~0830）→ **全部 closed**
- [x] 第八轮（webui 缺口 / 可观测运维 / 生态协作，45 条差距 0831~0875）→ **全部 closed**
- [x] 第八轮扩展（Hermes / Reasonix 对照，20 条差距 0876~0895）→ **全部 closed**
- [x] 第九轮（LangGraph/CrewAI 编排 + webui 深度 + OpenHands/OpenClaw，26 条差距 0900~0925）→ **全部 closed**
- [x] 第十轮（Goose/Aider/OpenCode + IDE 集成 + 可靠性纵深，30 条差距 0926~0955）→ **全部 closed**
- [x] 第十一轮（eval 工具链 / 产品 onboarding / 对抗安全审计，30 条差距 0956~0985）→ **全部 closed**
- [x] 第十二轮（插件作者 DX / 中断恢复 UX / 模型提示词运维 / 自动化事件驱动，32 条差距 0986~1017）→ **全部 closed**
- [x] 第十三轮（WebUI 管理与治理 / 知识库与数据层 / 多模态输入输出 / 测试与质量工程，28 条差距 1018~1045）→ **全部 closed**
- [x] 第十四轮（远程协作多用户 / 可靠性工程纵深 / 供应链与依赖安全 / 会话分析与产品洞察，28 条差距 1046~1073）→ **全部 closed**
- [x] 第十五轮（Git 深度工作流 / 上下文可视化与预算 / 企业合规纵深 / 部署与升级运维，28 条差距 1074~1101）→ **全部 closed**
- [x] 第十六轮（自我改进与学习 / 浏览器驱动自动化 / 生产质量工程 / 数据可视化与叙事，28 条差距 1102~1129）→ **全部 closed**
- [x] 第十七轮（移动/桌面 GUI 自动化 / 代码智能与仓库理解 / 长时程自主任务 / 模型运营与提示词工程，28 条差距 1130~1157）→ **全部 closed**
- [x] 第十八轮（文档与知识工作流自动化 / 性能工程与基准测试 / 个人效率与外部服务集成 / 秘密管理与安全审计纵深，28 条差距 1158~1185）→ **全部 closed**
- [x] 第十九轮（语音与音频处理 / 调试与故障排除 / 表格数据与本地数据处理 / 多智能体模拟与博弈，28 条差距 1186~1213）→ **全部 closed**
- [x] 第二十轮（网络协议与集成工具 / 构建与工具链集成 / 国际化与本地化 / 内容创作与媒体生成，28 条差距 1214~1241）→ **全部 closed**
- [x] 第二十一轮（时间与调度 / 教育与学习 / 本地搜索与发现 / 云服务与 SaaS 集成，28 条差距 1242~1269）→ **全部 closed**
- [x] 第二十二轮（数据隐私与合规工具 / 可观测性体验与诊断可视化 / 财务与记账工具 / 激励与游戏化，28 条差距 1270~1297）→ **全部 closed**
- [x] 第二十三轮（文档格式与互操作 / 自然语言处理工具 / 地理与位置服务 / 数据合成与模拟数据，28 条差距 1298~1325）→ **全部 closed**
- [x] 验证：**687 个插件，5286/5286 测试通过，0 typecheck 错误**；e2e 环境挂载全部 687 插件，`verify-e2e.mjs` 3253/3253 检查通过 + 共享 key 真实 LLM 冒烟通过

## 插件清单（687 个）

> 全量清单与差距映射见 `GAP-LEDGER.md`（逐条 closed）。下表为第一轮 25 个示例。

### 插件 · GAP · 功能
- **插件**: example-hello · **GAP**: 模板 · **功能**: 插件模板（工具 + 瀑布监听器）
- **插件**: orchestrator-prompt · **GAP**: 0001 · **功能**: 编排器 prompt 分节
- **插件**: specialist-agents · **GAP**: 0002 · **功能**: 专家子代理编目 + 按名激活
- **插件**: task-categories · **GAP**: 0003 · **功能**: 分类委托与模型路由
- **插件**: skill-injector · **GAP**: 0004 · **功能**: 技能全文注入（opt-in）
- **插件**: jsonc-config · **GAP**: 0005 · **功能**: JSONC 级联配置
- **插件**: dsh-doctor · **GAP**: 0006 · **功能**: /dsh doctor 诊断命令
- **插件**: tool-catalog · **GAP**: 0007 · **功能**: 提示词内工具目录
- **插件**: memory-writeback · **GAP**: 0010 · **功能**: CLAUDE.md 式记忆写回
- **插件**: checkpoint · **GAP**: 0011 · **功能**: 工作区文件快照回滚
- **插件**: marketplace-install · **GAP**: 0012 · **功能**: 插件交互安装
- **插件**: apply-patch · **GAP**: 0013 · **功能**: unified-diff 编辑工具
- **插件**: compact-hooks · **GAP**: 0015 · **功能**: 压缩边界 hooks
- **插件**: hook-fidelity · **GAP**: 0016 · **功能**: hook 载荷保真审计
- **插件**: statusline · **GAP**: 0017 · **功能**: 状态行组件
- **插件**: session-lifecycle · **GAP**: 0018 · **功能**: /session 生命周期命令
- **插件**: session-share · **GAP**: 0101 · **功能**: 会话分享导出/导入
- **插件**: session-snapshot · **GAP**: 0102 · **功能**: 会话快照 revert/unrevert
- **插件**: permission-vocabulary · **GAP**: 0103 · **功能**: once/always/reject 权限词表
- **插件**: plugin-market · **GAP**: 0104 · **功能**: 插件市场发现
- **插件**: tui-theme · **GAP**: 0105 · **功能**: TUI 主题/快捷键
- **插件**: lsp-observability · **GAP**: 0106 · **功能**: LSP 能力可观测性
- **插件**: agent-profiles · **GAP**: 0107 · **功能**: 声明式 agent 角色档案
- **插件**: provider-router · **GAP**: 0108 · **功能**: 任务类型模型路由
- **插件**: part-metadata · **GAP**: 0109 · **功能**: part 级元数据契约

## 远程

```bash
git remote -v   # origin → https://github.com/dsh-external/oh-my-dsh.git
```