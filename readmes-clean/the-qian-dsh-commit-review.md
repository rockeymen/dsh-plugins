# dsh-commit-review

一个 [DSH（DeepSeek Harness）](https://github.com/deepseek-ai/deepseek-harness) 插件：为 Web GUI 增加 `/commit` 与 `/review` 两个斜杠命令，**对标 Claude Code 内置的同名命令**，把「分析变更 → 生成 Conventional Commits 提交」和「代码审查」变成一条命令即可触发的标准工作流。

- ✅ 官方 dsh 插件形态（`dsh.bundle.patch`），通过 `dsh plugin add` 一键安装
- ✅ 纯 Host 侧、零依赖、无构建步骤（`lib/index.js` 即最终产物）
- ✅ 预检失败（非 git 仓库 / 工作区干净 / git 未安装）直接返回卡片提示，不浪费一轮模型
- ✅ 提交与审查由模型用自身工具执行，天然走 DSH 的沙箱与审批策略
- ✅ 注册随插件行生命周期自动装卸（`ctx.effect` 包裹）

## 安装

### 方式一：从 GitHub 安装（推荐）

```powershell
dsh plugin --profile web add https://github.com/the-qian/dsh-commit-review.git
```

> 本包没有 `prepare` 构建脚本，pnpm 不会要求 `allowBuilds`，安装即可用。

### 方式二：本地路径安装

```powershell
git clone https://github.com/the-qian/dsh-commit-review.git
dsh plugin --profile web add D:\path\to\dsh-commit-review
```

安装完成后**重启 profile**（bundle 层在 boot 时装配）：

```powershell
dsh web
```

重启后在输入框输入 `/`，即可在命令面板看到 `commit` 和 `review`。包名与仓库名均为 `dsh-commit-review`（与 `cordis.patch.yml` 中的行引用保持一致）。

## 命令

### `/commit [message guidance]`

分析当前 git 变更并**真正创建提交**（不只是给出建议）。可选参数会成为提交消息的引导，例如：

```
/commit
/commit fix the login bug
```

处理流程：

1. 预检：`git status --porcelain=v1 --branch` + 暂存/未暂存 diff 统计（经 `subprocess` 直接调用 git，无 bash 依赖，20s 超时保护）
2. 预检通过后，将完整工作流注入模型：
   - 检查真实 diff 与最近提交风格（`git log`）
   - 选定 Conventional Commits 类型/范围（`feat`/`fix`/`docs`/`style`/`refactor`/`perf`/`test`/`build`/`ci`/`chore`/`revert`，破坏性变更用 `!` 或 `BREAKING CHANGE` footer）
   - 逻辑分组暂存（**永不提交** `.env`、凭据、私钥等密钥）
   - 生成祈使句、一般现在时、≤72 字符的主题行
   - 执行 `git commit` 并用 `git log -1 --stat` 验证后报告哈希与消息
3. 内置 git 安全协议：不改 config、不 force、不跳过 hooks、hooks 失败时修复后新建提交（不 amend）

### `/review [security|performance|simplicity|style|i18n|with-context|guidance]`

审查当前未提交的变更（暂存 + 未暂存），在对话中输出按严重度分级的 markdown 审查报告，**只审查、不修改任何文件**：

```
/review                  # 通用审查
/review security         # 安全优先
/review performance      # 性能优先
/review simplicity       # 简洁性优先
/review style            # 代码风格优先
/review i18n             # 国际化优先
/review with-context     # 结合全仓库上下文审查
```

报告格式：一段总结 → 按 critical / major / minor / nit 排序的发现（每条含 `文件:行号` 引用、原因说明、具体修复建议）→ 正面观察。工作区干净时提示可用 `/review HEAD~1` 审查指定提交。

## 与 Claude Code 的对标

| 维度 | Claude Code | 本插件 |
| --- | --- | --- |
| `/commit` | 分析变更、生成消息并提交 | ✅ 同流程，另加 git 安全协议与预检短路 |
| `/review` | 审查当前变更并输出报告 | ✅ 同流程，支持全部官方修饰词 |
| 修饰词语法 | `/review:security`（冒号） | `/review security`（空格；DSH 命令解析器 `[a-z0-9_-]` 不支持冒号） |
| 提交执行 | 模型直接执行 | 模型经 DSH 沙箱/审批策略执行（更安全） |
| 会话语言 | 跟随用户 | 跟随用户（默认简体中文） |

## 工作原理

```
用户输入 /commit 或 /review
        │
        ▼
commands 注册表执行 handler（dsh-commands，与 /plan 同一机制）
        │
        ├─ 预检：subprocess 直接 spawn git（status + diff --stat）
        │        ├─ 失败/无变更 → 直接返回卡片，不进模型
        │        └─ 通过 → 携带上下文快照
        ▼
agent.steer(用户消息) 把完整工作流注入模型的下一步
        │
        ▼
模型用自身工具（pwsh/read）执行真实 diff 分析、暂存、提交或审查
```

- **注册表**：行只消费 `commands` + `subprocess` 两个服务，不发布服务，因此无需 isolate realm
- **生命周期**：两条注册都用 `ctx.effect(() => commands.register(...))` 包裹，插件行卸载时自动反注册
- **平台无关**：git 通过 `subprocess.resolveExecutable('git')` 解析，Windows/POSIX 通用

## 本地开发

```powershell
# 1. 以链接方式装进 profile（改代码即时生效，重启 profile 后应用）
dsh plugin --profile web add D:\path\to\dsh-commit-review

# 2. 编辑 lib/index.js（纯 JavaScript，无需编译）
# 3. 重启 profile 验证：
dsh web
```

语法检查：`node --check lib/index.js`