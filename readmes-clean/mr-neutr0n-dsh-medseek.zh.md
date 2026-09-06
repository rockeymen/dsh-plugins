# MedSeek

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的临床文档与参考工具包，以 `dsh` 插件包形式安装。

面向**医生、执业护士、医师助理、护士和住院医师**的日常工作：查房记录、交接班、入院病历、出院小结、患者须知，以及来自 FDA 说明书、MedlinePlus、PubMed 和 ClinicalTrials.gov 的带出处检索。

MedSeek 起草；具名临床人员审阅后才使用。它不是医疗器械。

许可证：[Apache-2.0](LICENSE)。[English](README.md)。

针对 `@deepseek-ai/dsh` 0.1.1-rc.2 测试，Node >= 22.19，pnpm >= 10。安装前请先读 [预期用途](docs/intended-use.md)。

## 工具（11 个）

### 工具 · 回答什么 · 来源 · 网络
- **工具**: `deidentify_text` · **回答什么**: 从粘贴文本中去掉 Safe Harbor 标识符 · **来源**: 45 CFR 164.514(b)(2) 类别 · **网络**: 否
- **工具**: `sbar_handover_draft` · **回答什么**: SBAR 或 I-PASS 结构，再给缺口清单 · **来源**: IHI SBAR、NEJM I-PASS · **网络**: 否
- **工具**: `discharge_summary_draft` · **回答什么**: 出院小结骨架，待出结果为必填 · **来源**: Joint Commission 要素 · **网络**: 否
- **工具**: `progress_note_draft` · **回答什么**: SOAP 或 APSO 每日病程录 · **来源**: Weed, NEJM 1968；AMA CPT E/M 要素 · **网络**: 否
- **工具**: `admission_history_physical_draft` · **回答什么**: 入院 H&P，过敏与用药核对必须明示 · **来源**: Joint Commission 24 小时要求 · **网络**: 否
- **工具**: `patient_instructions_draft` · **回答什么**: 面向患者的结构和可读性评分 · **来源**: Flesch-Kincaid、SMOG；AHRQ 目标 · **网络**: 否
- **工具**: `note_completeness_check` · **回答什么**: 缺段、易错缩写、未决标记 · **来源**: JC Do Not Use、ISMP · **网络**: 否
- **工具**: `drug_label_lookup` · **回答什么**: FDA 说明书章节、DailyMed 链接 · **来源**: openFDA、RxNorm · **网络**: 是
- **工具**: `patient_education_lookup` · **回答什么**: MedlinePlus 英文或西班牙文材料 · **来源**: NLM · **网络**: 是
- **工具**: `pubmed_evidence_search` · **回答什么**: 带摘要的文献和可复现查询 · **来源**: NCBI E-utilities · **网络**: 是
- **工具**: `trial_search` · **回答什么**: 试验编号、状态、期别、申办方 · **来源**: ClinicalTrials.gov v2 · **网络**: 是

起草工具返回结构和检查，不编造临床事实。
检索工具展示原文并附出处、编号和检索日期；查不到就说查不到。
NLM 已于 2024 年 1 月下线免费 RxNav 相互作用接口；MedSeek 不会假装有替代品。

## 安装

```sh
dsh plugin --profile web add dsh-medseek@0.1.2
```

重启 Web GUI 后确认：`dsh --profile web --dump-config` 应显示 `# == dsh-medseek`。

卸载：

```sh
dsh plugin --profile web remove dsh-medseek
```

## 权限与数据

检索工具只向七个许可主机发送术语和编码。PHI 守卫会拦截参数里像标识符的网络调用。

dsh 仍会把工具参数写入本地会话日志。粘贴了可识别病历时，把 `$DSH_HOME/sessions` 当 PHI 存储。保持 telemetry 关闭。

完整表：[docs/permissions-and-data.md](docs/permissions-and-data.md)。

## 人格与预设

Web 默认会话会加入 `medseek-clinical` 预设：即上游 `standard` 组合、仅替换人格文本为 MedSeek 临床立场，标准工具全部保留。该预设随包发布，并在每次启动时原子化写入 `$DSH_HOME/.agent-presets/medseek-clinical/`。该 id 归部署所有：本地修改会在下次启动时恢复（日志会点名被恢复的文件）；想自定义请复制成自己的预设 id。headless 与 TUI 不挂预设，仍使用 cordis.patch.yml 里的部署人格。

## 已知限制

无。侧边栏、英雄区与 favicon 均由 MedSeek 接管（官方品牌行已禁用并经 mount 测试断言）。

## 许可

[Apache License 2.0](LICENSE)。署名见 [NOTICE](NOTICE)。
`dsh-plugin` 话题只是发现标签，不是 DeepSeek 或医疗方面的批准。