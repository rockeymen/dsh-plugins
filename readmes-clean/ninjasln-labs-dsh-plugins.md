# DSH 插件集

## ⭐ 原创声明

本项目所有插件均为**自研原创开发**，非第三方插件的聚合或转载。

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 社区插件合集。所有插件均为公开 npm 包，可通过 `dsh plugin add <name>` 安装。

## 插件

### 插件 · 说明 · 状态
- **插件**: [dsh‑session‑health](./dsh-session-health) · **说明**: **会话健康 v0.6.0**：· 响应式徽章（投影驱动）+ `/health` 命令 + `session_health` 工具· 多会话健康总览面板（"健康一览"）· 官方峰谷双币定价（CNY/USD，jsdelivr 主源 + GitHub raw 回退）· 主题自适应四档配色 · 缓存感知窗口经济档位· 计费金额/token 切换 · 交接清单自动化 · **状态**: ✅ 已发布（GitHub + npm）
- **插件**: [dsh‑knowledge‑sqlite](./dsh-knowledge-sqlite) · **说明**: **跨会话知识库 v0.1.2**：· `ctx.knowledge` 服务 + `knowledge_*` 工具· SQLite FTS5 trigram 索引 + L1 查询扩展（V1.11 契约）· 零 LLM 写入 · 即时可检索 · **状态**: ✅ 已发布（GitHub + npm）
- **插件**: [dsh‑subagent‑router](./dsh-subagent-router) · **说明**: **子代理模型路由 v0.1.1**：· `subagent_model`：每次调用可指定 provider/model/max_tokens· 内置 `model: "auto"` 路由策略（锚定父模型 · 任务分档升级 · 失败升档 · 全程可审计）· `subagent_models` 目录工具 · **状态**: ✅ 已发布（GitHub + npm）
- **插件**: [dsh‑imgdraw](./dsh-imgdraw) · **说明**: **AI 生图 v0.1.0**：· `draw_image` 工具 + 输入框"生图"按钮/弹窗（异步生成 · 四格网格 · 下载/保留/删除）· `/imgdraw` 图片路由 · 历史持久化· 后端：默认免费百炼 wan2.7-image · 可选 SiliconFlow Qwen-Image · **状态**: 🚧 开发中（bundle 完成 · 未发布）

## 约定

- 每个插件一个目录，各自是独立 npm 包（`dsh.bundle` 清单）
- 安装：`dsh plugin add `
- 发现：[`dsh-plugin`](https://github.com/topics/dsh-plugin) GitHub 主题
- 仓库保持脱敏：无本地路径、无密钥、noreply git 邮箱

## 开发流程（强制）

**所有插件开发必须遵循敏捷迭代流程**：[DEVELOPMENT.md](./DEVELOPMENT.md)

- 用户故事写需求（体验导向）→ 一个功能一个迭代 → DoD 全绿才交付 → 交付即试用 → 回顾沉淀
- 动态插件高频坑速查表见该文档附录（client half 完整性、沙箱禁用全局、契约预检、事件格式等）