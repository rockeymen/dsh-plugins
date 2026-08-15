![dsh-mneme](logo.png)

# dsh-mneme

[中文](#中文) | [English](#english)

# 🇨🇳 dsh-mneme（中文）

> **记忆主权，归还于你** —— 记忆不再是黑盒，而是你读得懂、改得动的 Markdown。

`dsh-mneme` 是一个 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 插件，为 Agent 提供持久的跨会话记忆能力。**Mneme**（Μνήμη）——希腊记忆女神 Mnemosyne 之名，掌管记忆与梦境，正如 autoDream 在后台巩固记忆。

不同于把记忆锁进数据库的插件，Mneme 把记忆**写成你读得懂的 Markdown**——你始终握着记忆的主权：看得见、改得动、删得掉，记忆这回事不该让 Agent 一个人说了算。

## ✨ 特性一览

- **🧠 记忆主权**：SQLite + 可人工编辑的 Markdown 镜像，双向同步——记忆透明、可审查、归你所有
- **autoDream 梦境巩固**：后台自动去重 / 合并 / 归档 / 冲突裁决（fail-safe 校验），越用越精炼
- **6 个模型工具**：`memory_save` / `memory_search` / `memory_list` / `memory_update` / `memory_delete` / `memory_forget`
- **自动注入 + 会话摘要**：新会话自动带入相关记忆，会话结束自动提炼偏好 / 决策 / 教训
- **Web 记忆面板**：官方设置面板内嵌，按类型浏览、全文搜索 + 语义（向量）搜索
- **用户设置 + 自定义指令**：用户画像、行为规则每轮注入；注册斜杠命令
- **向量搜索**：OpenAI 兼容 embeddings API，语义匹配字面不同但意思相近的记忆

## 🔮 语义增强（完全离线，v0.2+）

**完全离线的语义记忆引擎**——embedding、rerank、搜索全在本地，零 API 成本：

- **本地 Embedding**：三后端可选——ONNX（`Xenova/bge-small-zh-v1.5`，离线）/ Ollama / OpenAI 兼容，失败自动逐级降级，最差回退关键词搜索
- **Rerank 精排**：`Xenova/bge-reranker-base` 对召回候选交叉编码精排，提升 Top-K 准确率
- **autoDream 语义增强**：对记忆向量聚类（`clusterMemories`），自动发现主题相近 / 疑似矛盾的记忆，巩固更精准
- **搜索流水线**：混合召回（关键词 + 向量）→ Rerank → Top-K

在 `cordis.patch.yml` 配置 `embedProvider`（默认 `openai` 保持 v0.1 行为，切到 `local` 即完全离线）。无需数据迁移。

> 📖 详见 [语义架构](dsh-mneme/docs/SEMANTIC.md) · [本地模型部署](dsh-mneme/docs/LOCAL_MODEL.md) · [v0.1 迁移](dsh-mneme/docs/MIGRATION.md)

## 📦 安装（DSH）

```bash
# 安装插件（自动注册 bundle 层）
dsh plugin --profile web add @modusensus/dsh-mneme
dsh web
```

> 需要 Node 24+（`node:sqlite`）。安装 / 配置 / 架构详见 [插件完整文档](dsh-mneme/README.md)。

## 📁 仓库结构

```
dsh-mneme/   插件本体（npm 包 @modusensus/dsh-mneme）
docs/        设计文档与实施计划
```

## 🧪 本地开发

```bash
cd dsh-mneme
npm install
npm test          # 198 个测试
npm run stress    # 三轴线压测（长会话检索 / 冲突仲裁 / 多 Agent 并发）
npm run sync      # src → lib 同步（发布时自动执行）
```

## 📄 文档

### 文档 · 路径
- **文档**: 插件完整文档（功能 / 安装 / 配置 / 架构） · **路径**: [dsh-mneme/README.md](dsh-mneme/README.md)
- **文档**: 语义架构 · **路径**: [dsh-mneme/docs/SEMANTIC.md](dsh-mneme/docs/SEMANTIC.md)
- **文档**: 本地模型部署指南 · **路径**: [dsh-mneme/docs/LOCAL_MODEL.md](dsh-mneme/docs/LOCAL_MODEL.md)
- **文档**: v0.1 迁移说明 · **路径**: [dsh-mneme/docs/MIGRATION.md](dsh-mneme/docs/MIGRATION.md)
- **文档**: 插件设计 · **路径**: [docs/superpowers/specs/2026-08-13-dsh-mneme-design.md](docs/superpowers/specs/2026-08-13-dsh-mneme-design.md)
- **文档**: autoDream 设计 · **路径**: [docs/superpowers/specs/2026-08-13-dsh-mneme-autodream-design.md](docs/superpowers/specs/2026-08-13-dsh-mneme-autodream-design.md)
- **文档**: 实施计划（核心插件） · **路径**: [docs/superpowers/plans/2026-08-13-dsh-memory.md](docs/superpowers/plans/2026-08-13-dsh-memory.md)
- **文档**: 实施计划（autoDream） · **路径**: [docs/superpowers/plans/2026-08-13-dsh-memory-autodream.md](docs/superpowers/plans/2026-08-13-dsh-memory-autodream.md)

## 🗺️ 未来版本展望 · Roadmap

> 计划基于社区反馈持续演进，实施周期为估算值。

### 版本 · 内容 · 实施周期
- **版本**: **v0.2.1** · **内容**: autoDream 自我反思 + 可靠审计：新增 `update` 决策类型 + 安全门控（自我修正）；`policy_epoch` 裁决规则版本，规则升级后旧裁决降级为历史证据；召回层 receipt 记录实际召回的候选、相似度、阈值 · **实施周期**: 3-5 天
- **版本**: **v0.2.2** · **内容**: api.js 对接新语义流水线 + 测试补全；per-record 收据链：merge 计数前值/后值、conflict 各方收据，增强可重放性 · **实施周期**: 2-3 天
- **版本**: **v0.2.3** · **内容**: 记忆活跃度与自动衰减：被召回多的记忆 importance 上升，长期不用的自动 archive；冲突冻结选项（可配置"冻结待人工确认"，而非自动合并） · **实施周期**: 1-2 天
- **版本**: **v0.3.0** · **内容**: 轻量级知识图谱：实体关系提取 + 跨记忆查询 · **实施周期**: 待评估
- **版本**: **v0.4.0** · **内容**: 多 Workspace 隔离与协作（等 DSH 支持后） · **实施周期**: 待评估
- **版本**: **v0.5.0** · **内容**: 自进化记忆策略：用户反馈闭环 + 兴趣漂移分析 · **实施周期**: 待评估

## 📜 License

MIT

# 🇬🇧 dsh-mneme (English)

> **Memory sovereignty, returned to you** — memory is no longer a black box, but Markdown you can read and edit.

`dsh-mneme` is a [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) plugin that gives agents persistent cross-session memory. **Mneme** (Μνήμη) — named after Mnemosyne, the Greek goddess of memory and dreams, mirroring how autoDream consolidates memories in the background.

Unlike plugins that lock memory inside a database, Mneme writes memory as **human-readable Markdown** — memory sovereignty stays with you: see it, edit it, delete it. Memory shouldn't be decided by the agent alone.

## ✨ Features

- **🧠内存主权**：SQLite + 人工可编辑的 Markdown 镜像，双向同步 — 内存是透明的、可审计的，是你的
- **autoDream 整合**：后台重复数据删除/合并/存档/冲突解决（故障安全验证），通过使用进行改进
- **6 种模型工具**：`memory_save` / `memory_search` / `memory_list` / `memory_update` / `memory_delete` / `memory_forget`
- **自动注入+会话摘要**：在会话开始时注入相关记忆，在会话结束时提取偏好/决定/课程
- **网络记忆面板**：嵌入官方设置面板——按类型浏览、全文+语义（向量）搜索
- **用户设置+自定义命令**：每轮注入的用户配置文件和行为规则；注册斜杠命令
- **矢量搜索**：OpenAI 兼容的嵌入 API，用于不同措辞但相关的记忆的语义匹配

## 🔮 语义增强（完全离线，v0.2+）

完全离线的语义记忆引擎 — 嵌入、重新排序和搜索均在本地运行，API 成本为零：

- **本地嵌入**：三个可互换的后端 - ONNX（`Xenova/bge-small-zh-v1.5`，离线）/ Ollama / OpenAI 兼容 - 自动降级，最坏的情况下回退到关键字搜索
- **重新排名**：`Xenova/bge-reranker-base` 交叉编码器对召回候选者进行重新排名，以获得更清晰的 Top-K
- **autoDream 语义增强**：向量聚类 (`clusterMemories`) 表面主题接近或潜在冲突的记忆，以实现更精确的整合
- **搜索管道**：混合召回（关键词+向量）→重新排名→Top-K

在`cordis.patch.yml`中配置`embedProvider`（默认`openai`保持v0.1行为；切换到`local`以实现完全离线）。无需数据迁移。

> 📖 参见【语义架构](dsh-mneme/docs/SEMANTIC.md)·【本地模型指南](dsh-mneme/docs/LOCAL_MODEL.md)】·【v0.1迁移](dsh-mneme/docs/MIGRATION.md)】

## 📦 安装 (DSH)

```bash
# Install the plugin (auto-registers the bundle layer)
dsh plugin --profile web add @modusensus/dsh-mneme
dsh web
```

> 需要节点 24+ (`node:sqlite`)。 [插件 README](dsh-mneme/README.md) 中的完整安装/配置/架构文档]

## 📁 存储库结构

```
dsh-mneme/   plugin package (npm @modusensus/dsh-mneme)
docs/        design docs & implementation plans
```

## 🧪 本地发展

```bash
cd dsh-mneme
npm install
npm test          # 198 tests
npm run stress    # three-axis stress test (long-session retrieval / conflict arbitration / concurrent agents)
npm run sync      # src → lib sync (runs automatically on publish)
```

## 📄 文档

### 文档·路径
- **文档**：完整的插件文档（功能/安装/配置/架构）· **路径**：[dsh-mneme/README.md](dsh-mneme/README.md)
- **文档**：语义架构·**路径**：[dsh-mneme/docs/SEMANTIC.md](dsh-mneme/docs/SEMANTIC.md)
- **文档**：本地模型指南·**路径**：[dsh-mneme/docs/LOCAL_MODEL.md](dsh-mneme/docs/LOCAL_MODEL.md)
- **文档**：v0.1 迁移 · **路径**：[dsh-mneme/docs/MIGRATION.md](dsh-mneme/docs/MIGRATION.md)
- **文档**：插件设计·**路径**：[docs/superpowers/specs/2026-08-13-dsh-mneme-design.md](docs/superpowers/specs/2026-08-13-dsh-mneme-design.md)
- **文档**：autoDream设计·**路径**：[docs/superpowers/specs/2026-08-13-dsh-mneme-autodream-design.md](docs/superpowers/specs/2026-08-13-dsh-mneme-autodream-design.md)
- **文档**：实施计划（核心）· **路径**：[docs/superpowers/plans/2026-08-13-dsh-memory.md](docs/superpowers/plans/2026-08-13-dsh-memory.md)
- **文档**：实施计划（autoDream）· **路径**：[docs/superpowers/plans/2026-08-13-dsh-memory-autodream.md](docs/superpowers/plans/2026-08-13-dsh-memory-autodream.md)

## 🗺️ 路线图

> 计划根据社区反馈而发展；时间表是估计。

### 版本·范围·时间表
- **版本**：**v0.2.1** · **范围**：autoDream自我反思+可靠审计：新的`update`决策类型+安全门控（自我纠正）； `policy_epoch`裁判规则版本——规则升级后，旧裁判降级为历史证据；召回层收据记录实际候选人、相似度、阈值· **时间线**：3-5 天
- **版本**：**v0.2.2** · **范围**：将 api.js 连接到新的语义管道 + 测试覆盖率；每条记录收据链：合并计数器之前/之后的值、冲突方收据、增强的可重玩性 · **时间线**：2-3 天
- **版本**：**v0.2.3** · **范围**：记忆活动和自动衰减：经常回忆的记忆变得重要，长期闲置的记忆自动存档；冲突冻结选项（可配置“冻结等待人工确认”而不是自动合并）· **时间线**：1-2 天
- **版本**：**v0.3.0** · **范围**：轻量级知识图谱：实体关系抽取+跨内存查询