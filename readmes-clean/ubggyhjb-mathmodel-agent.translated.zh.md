# MathModel Agent — 数学建模竞赛 Agent

专为数学建模竞赛（CUMCM 国赛、MCM/ICM 美赛、APMCM、华为杯、华数杯等）设计的 AI Agent。
在 DeepSeek Harness（DSH）中作为 agent preset 使用：一条指令，从赛题到一篇可直接提交的论文。

工作流（v5，来源 `workflow_spec.yaml`，单一事实源）：
**资产接管 → 头脑风暴 → 赛题分析 → 方法学审查(模型契约) → 验证计划 → 代码与图表 →
结果→Claim 判定 → 论文规划 → 概念图 → 论文撰写 → 编译打包 → 验证验收**。
v5.0 变更与 DoD 核查见 `docs/V50_CHANGES.md`；工作流结构见 `docs/WORKFLOW_v5.md`；
对标差距矩阵见 `docs/MODEX_GAP_MATRIX.md`。

## 功能亮点

- **12 个 skills 完整流水线**：头脑风暴（每子问题 ≥3 条候选路线）、赛题分析、方法学审查、
  编程与图表、概念图、论文撰写、验证验收、环境诊断、参考文献与数据来源纪律。
- **工作流单一事实源（v5）**：`workflow_spec.yaml` 定义全部阶段顺序/输入输出/依赖/失败路由，
  `workflow_spec.py --check` 校验 1start/persona/README/docs/decision_log 与它一致；
  禁止在文档中手写第二份阶段顺序。
- **可执行模型契约（v4）**：`reports/FINAL_MODEL_SPEC.json`——7methodology-review 产出，
  3coding 只实现它、结果 JSON 写 `model_spec_sha256`、methodology 门逐问题核验
  （同一 outcome 跨问题观察机制不一致自动 FAIL）。
- **17 套中英文论文模板**（每套含 Typst 与 LaTeX 两个版本）：CUMCM 国赛、MCM/ICM 美赛、
  APMCM、华为杯、华数杯、电工杯、东三省、华东杯、华中杯、数维杯、五一赛、MathorCup、
  长三角赛、统计建模赛等，另有通用 default 模板。
- **验收引擎（6verity）**：`run_all_gates.py --strict` 一键运行，全部 PASS 才可提交；
  **门禁执行列表唯一事实源 = `workflow_spec.yaml` 的 `gates:` registry**（v4.4：run_all_gates 只解析该表，
  README 不再手写清单；gate 计数/报告路径/required/strict_aware 均由 registry 派生——当前门数与
  roster 以 registry 为准，不在此处维护数字）：
  manifest / layout / text_integrity / trace / style / decision / refs / methodology / leakage /
  figure_story / idea_contracts / visual_review_gate / figure_spec / deployment_utility /
  submission_package / schema_validation / natural_prose / judge_readability / chinese_lint
  （外加聚合器 workflow_order 校验；v5 起新增门见 gate registry 与 docs/V50_CHANGES.md）。
  v4.4 关键新增：T110-T125 反 false-pass 回归（含 G1-G6 坏版本 golden）；每门报告注入
  `input_snapshot_sha256`（同轮一致性校验，P2-02）；schema_validation（JSON Schema，P1-19）。
  v4.5.2 新增：natural_prose（NP-01~22 中文自然文风频率+上下文判定）、judge_readability（JR-01~06
  30 秒可读性）、chinese_lint（CL-01~11 中文标点/符号/全角半角规范，吸收 textlint-zh）——三者只读，
  禁止"出现即 FAIL"禁词化（G-WRITE-6 正常文本必须零命中）。
- **验证器只读（v4）**：run_all_gates 绝不修改被验对象（不刷 decision_log 时间戳）；
  writer updates, verifier verifies。
- **排版规范基于实证**：从官方展示论文全库统计的摘要加粗优先级、图内字号、配色等阈值
  （单一事实源 `skills/6verity/style_policy.json`；官方硬规则与推荐经验分层）。
- **三席盲评陪审团 + 致命否决（v4）**：3 个上下文隔离的评审子代理按固定打分表独立评分，
  ≥70 放行；Reviewer B 的 leakage/wrong likelihood/invalid censoring/invalid test protocol
  任一 Critical、Reviewer C 的 figure blank/table clipped/unresolved reference 任一
  Submission blocker → 总分再高也 FAIL。
- **答辩门（v4）**：attack_questions 每条带 severity/status/answer/evidence；
  P0/P1 open > 0 → FAIL（真正"答辩通过才 final PASS"）。
- **竞赛合规内置**：AI 声明定句、2026 提交格式（无目录、摘要页页码、正文 ≤30 页）、
  组队与纪律规则、检索边界（禁止浏览交流平台讨论赛题）。

## 使用

### 作为 DSH preset 安装

将本仓库放入 DSH 的 agent-presets 目录（如 `~/.dsh/agent-presets/mathmodel`），
会话中选择 `mathmodel` 预设即可：preset.yml 注册名称与描述，agent.cordis.yml 挂载 persona、
工具映射与 12 个 skills，skills 内的技能会出现在会话目录中。

### 独立使用验收引擎

不依赖 DSH 也可以直接把 `skills/6verity/scripts/` 用作论文质检工具（按项目结构约定工作）：

```bash
# 依赖：python 3.10+，pip install pymupdf   # 其余用标准库
python skills/6verity/scripts/run_all_gates.py --workspace <项目目录> --strict
python skills/6verity/scripts/project_manifest.py --workspace <项目目录> --check
python skills/6verity/scripts/workflow_spec.py --check --root <仓库根>  # 单一事实源一致性
```

回归测试（含 fixture 与负向 regression 用例；未提供真实项目时基线用例自动 SKIP，
fixture 用例照常跑）：

```bash
python skills/6verity/tests/run_tests.py                        # 无真实项目：fixture 用例
python skills/6verity/tests/run_tests.py --workspace <项目目录>  # 全量（含基线）
```

## 项目目录约定

一个可用 `run_all_gates.py` 验收的项目工作区布局（与 workflow_spec.yaml 的 inputs/outputs 对齐）：

```
<workspace>/
├── project.manifest.json    # 引擎/入口/HIL_POLICY/工件哈希（singular source of truth）
├── plan.md / todo.md        # 阶段表来源 workflow_spec.yaml
├── state/decision_log.json  # 阶段状态机 + 关键决策（v4 阶段集合）
├── references/              # literature.md / data_sources.md
├── reports/
│   ├── FINAL_MODEL_SPEC.json          # v4 模型契约（3coding/5writing 只消费它）
│   ├── methodology/*.json             # 7methodology-review 审计 7 份
│   ├── figure_story_manifest.json     # Figure Story 唯一清单
│   ├── variables.json                 # v4 单位注册（unit registry）
│   └── gates/                         # 门禁报告
├── code/  results/  figures/          # 结果 JSON 带 model_spec_sha256；正式图带 .meta.json
└── paper/                  # main.tex | main.typ + sections/（generated_values.tex 可选：数值来源二选一）
```

## 许可证

[MIT](./LICENSE)。使用前请遵守各竞赛组委会的规则（如 CUMCM 对 AI 工具使用与检索来源的具体规定），本仓库提供的合规基线以 2026 年国赛口径为准，最终以最新官方文件为准。

### 阶段 · skill · 门禁 · 主要产出 · 目的
- **阶段**: intake · **skill**: 0intake-assets · **门禁**: — · **主要产出**: reports/intake/ASSET_REGISTRY.json, reports/intake/ASSET_CONFLICTS.json, reports/intake/INTAKE_REPORT.md · **目的**: 资产接管：清点已有题目/数据/代码/结果/图/模板，交叉一致性检查（代码vs数据/结果vs图/结果vs旧论文/模板vs官方规则），缺件登记；已有计算产物必须经过…
- **阶段**: brainstorm · **skill**: brainstorm-mathmodel · **门禁**: idea_contracts · **主要产出**: reports/contracts/QUESTION_CONTRACT.json, reports/contracts/PROBLEM_FACTS.json, reports/contracts/IDEA_CANDIDATES.json, reports/contracts/IDEA_DECISION.json · **目的**: 题意契约 + 受约束候选生成（minimal/recommended/advanced 三档）+ 淘汰状态机；禁止实验结论词；不直接形成可执行模型定义
- **阶段**: analysis · **skill**: 2analysis-modeling · **门禁**: — · **主要产出**: reports/ANALYSIS_MODELING_REPORT.md · **目的**: 解析题意、识别变量/约束/数据/评价指标；众数解清单 + 差异化审查
- **阶段**: methodology_review · **skill**: 7methodology-review · **门禁**: methodology · **主要产出**: reports/methodology/*.json, reports/FINAL_MODEL_SPEC.json, figures/figure_manifest.json · **目的**: DGP/假设/删失/退化/必要性/泄露/样本量审计；产出可执行模型契约 FINAL_MODEL_SPEC.json 与唯一 Figure Manifest（dr…
- **阶段**: validation_plan · **skill**: 8validation-plan · **门禁**: — · **主要产出**: reports/VALIDATION_PLAN.json, reports/VALIDATION_PLAN.md · **目的**: 运行前冻结验证证据契约：每条 claim 声明 type/metric/success_rule/failure_rule/priority（feasibili…
- **阶段**: coding_visual · **skill**: 3coding-visual · **门禁**: leakage · **主要产出**: code/*.py, results/*.json, figures/*.pdf, figures/*.meta.json · **目的**: 只实现 FINAL_MODEL_SPEC.json 声明的模型；结果 JSON 写 model_spec_sha256；图写 meta.json；按 VALID…
- **阶段**: schematic · **skill**: 4drawio · **门禁**: — · **主要产出**: figures/*.tex · **目的**: *.mmd · *.drawio · 仅当存在无法用正文/数据图表达的结构关系才画概念图（concept figure ≤1）
- **阶段**: result_review · **skill**: 9result-review · **门禁**: — · **主要产出**: reports/RESULT_INTERPRETATION.json, reports/RESULT_REVIEW.md · **目的**: 结果到底支持什么 Claim：SUPPORTED/PARTIAL/REFUTED/INCONCLUSIVE + 自动路由（SUPPORTED→paper_pla…
- **阶段**: paper_plan · **skill**: 10paper-plan · **门禁**: — · **主要产出**: reports/PAPER_PLAN.json, reports/PAPER_PLAN.md · **目的**: Claims-Evidence Matrix（claim→result→validation→figure/table→section）；无 evidence …
- **阶段**: writing · **skill**: 5writing · **门禁**: figure_story · **主要产出**: paper/main.tex · **目的**: main.typ, paper/sections/* · 数值来源二选一（numeric_source_policy.mode=one_of）：generated_values.tex（recommended）或 re…
- **阶段**: compile_package · **skill**: 11compile-package · **门禁**: — · **主要产出**: paper/main.pdf, reports/compile/COMPILE_REPORT.json, reports/compile/REPAIR_LOG.json · **目的**: 编译 + 错误分类修复（数学环境/LR mode/undefined control sequence/BibTeX 四类，grep parse log 逐条手…
- **阶段**: verification · **skill**: 6verity · **门禁**: run_all_gates · **主要产出**: reports/gates/*.json, reports/VERIFY_REPORT.md · **目的**: 验证器输入=论文/结果/图/清单/契约/方法学 JSON（含 RESULT_INTERPRETATION）——不得把自产的 gates_repo

rt 当输入（无…