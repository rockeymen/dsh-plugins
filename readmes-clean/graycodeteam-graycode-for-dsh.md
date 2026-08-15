# GrayCode for DeepSeek Harness

把 [Gray Code](https://github.com/Komeiji-Shiki/Gray-Code)（原 VS Code 扩展）重构为
[DeepSeek Harness (DSH)](https://deepseek-harness.github.io/deepseek-harness/) 插件的迁移项目。
DSH 负责 Agent 循环、会话、工具流水线、权限与 Web 宿主；本仓库只保留 Gray Code 的差异化能力。

> 技术预览：DSH 锁定 `0.1.0-rc.6`（npm `next`）。规划见 [`docs/PLAN_V2.md`](docs/PLAN_V2.md)，
> 进度见 [`docs/PROGRESS.md`](docs/PROGRESS.md)，变更见 [`CHANGELOG.md`](CHANGELOG.md)。

## 能力

### 领域 · 工具 · 说明
- **领域**: Workflows · **工具**: `create_design` / `update_design` / `create_progress` / `update_progress` / `record_progress_milestone` / `validate_progress_document` / `create_review` / `record_review_milestone` / `finalize_review` / `reopen_review` / `validate_review_document` / `compare_review_documents` / `create_plan` / `update_plan` · **说明**: Design / Progress / Review / Plan 文档工作流
- **领域**: Memory · **工具**: `memory_wake/note/recall/compress/zoom/forget/config` · **说明**: 永久记忆 + 自动注入
- **领域**: Checkpoints · **工具**: `checkpoint_create/list/preview/restore/delete/verify/gc` · **说明**: 工作区快照（内容寻址 Blob）
- **领域**: Branches · **工具**: `branch_list/create/reroll/edit_retry/switch/rename/delete/restore` · **说明**: 树状分支（Session fork + sidecar）
- **领域**: Prompt · **工具**: `prompt_mode_list/set/preview` · **说明**: 提示词模式编排（D-11=c 文本注入）
- **领域**: Staged diff · **工具**: `staged_diff_stage/list/preview/accept/reject` · **说明**: 延迟文件审阅（默认关闭，写工具适配后启用）
- **领域**: Activity · **工具**: `get_activity_stats` · **说明**: 24h 热力 / 月度 / 连续会话聚合
- **领域**: Media · **工具**: `crop_image` / `resize_image` / `rotate_image` / `generate_image` / `remove_background` · **说明**: 本地图片处理（sharp）+ 可选模型渠道；未注入渠道时模型工具 fail-closed
- **领域**: File · **工具**: `delete_code` · **说明**: 批量行级删除（5MB 护栏 + staged-diff 钩子）
- **领域**: Todo · **工具**: `todo_update` · **说明**: DSH 整表快照上的增量 ops 薄适配
- **领域**: Notifications · **工具**: `notify` · **说明**: Windows 原生 toast + 浏览器通知中心/noop 降级
- **领域**: Subagents · **工具**: — · **说明**: hop 深度、父链寻址与并发守卫
- **领域**: Thoughts · **工具**: — · **说明**: 可选请求构造层（默认关闭，非契约适配）
- **领域**: Settings · **工具**: — · **说明**: DSH 原生设置页「Gray Code」分区（`settings.section`）：Gray-Code 17 分类设置面板，`ctx.settings` 持久化 + `/graycode` 配置通道
- **领域**: Migration · **工具**: `migration_scan/apply` · **说明**: 旧 Gray Code 1.5.4 数据导入（dry-run 优先）
- **领域**: Client · **工具**: `shell.overlay` slot + locale + 10 个可挂接表面 · **说明**: workflow/overview/memory/checkpoint/restore/staged diff/settings/activity/scope/notifications UI；rc.6 管理视图挂载与浏览器 Remote 通道仍受上游 GAP 限制

## 包结构

```
packages/
├── bundle/    # @graycode/dsh        — DSH bundle（cordis.patch.yml 增量层）
├── plugin/    # @graycode/dsh-plugin — 宿主插件（全部领域实现）
└── client/    # @graycode/dsh-client — Client 插件（browser bundle + slot）
```

## 安装

```sh
# 构建并打包
pnpm install
pnpm build
pnpm pack

# 安装到 DSH profile（以本地 tarball 为例，tarball 生成于仓库根）
dsh plugin --profile graycode add ./graycode-dsh-0.1.0.tgz
dsh --profile graycode
```

`@graycode/*` 当前尚未发布到 npm registry；首次发布完成后可改用：

```sh
# bundle 安装：DSH 按 cordis.patch.yml 增量层自动拉取 @graycode/dsh-plugin 与 @graycode/dsh-client
dsh plugin --profile graycode add @graycode/dsh
dsh --profile graycode
```

- 三包：`@graycode/dsh`（bundle 增量层）→ `@graycode/dsh-plugin`（宿主插件）+ `@graycode/dsh-client`（Client UI）。
- 版本锁定：DSH 基线 `0.1.0-rc.6`（npm `next`，见 [ADR-0001](docs/ADR-0001.md)）；升级 DSH 需独立兼容 PR。
- bundle 只钉 `id`（graycode / graycode-client）不复制 DSH 配置，默认值在插件 Schemastery schema。
- 发布检查清单与产物核对见 [`docs/RELEASE.md`](docs/RELEASE.md)。

## 开发

```sh
pnpm install        # 安装依赖（pnpm 11.7.0）
pnpm test           # 全量测试（vitest）
pnpm typecheck      # 全量类型检查（src + tests）
pnpm build          # 构建 plugin
pnpm pack           # 打包全部包
pnpm verify:pack    # 本地 tarball 内容校验（scripts/verify-pack.ps1）
```

环境要求：Node `^22.19 || >=24`、pnpm `11.7.0`（packageManager 固定）。

## 文档索引

### 文档 · 内容
- **文档**: `docs/PLAN_V2.md` · **内容**: 迁移规划（阶段、契约、验收门槛）
- **文档**: `docs/PROGRESS.md` · **内容**: 阶段状态追踪
- **文档**: `docs/ADR-0001~0003.md` · **内容**: 架构决策记录（版本锁定 / 扩展面探针 / staged diff）
- **文档**: `docs/legacy-format.md` · **内容**: 旧 Gray Code 1.5.4 数据格式规范
- **文档**: `docs/memory-format.md` · **内容**: 新记忆存储格式（JSONL 双层）
- **文档**: `docs/PROVIDER_MATRIX.md` · **内容**: 模型渠道能力矩阵
- **文档**: `docs/review/` · **内容**: 审计报告（对照旧实现 + bug 猎人 + 测试质量）与汇总
- **文档**: `docs/CI.md` · **内容**: CI 覆盖与本地验证命令

## 许可

MIT（见 [LICENSE](LICENSE)）。