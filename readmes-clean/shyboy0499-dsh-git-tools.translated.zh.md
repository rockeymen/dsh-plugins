#dsh-git-tools

> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) 的本地 git 工具。

`dsh-git-tools` 是一个无依赖的 DeepSeek Harness 插件，它为编码代理提供了
四个本地 git 工具 — **`git_status`**、**`git_diff`**、**`git_log`** 和 **`git_commit`** —
因此它可以检查会话工作区中的存储库并创建提交，所有这些都通过
官方工具API。无 UI，仅主机端。

## 特点

### 工具·它的作用
- **工具**：`git_status` · **它的作用**：分支、前/后以及暂存/未暂存/未跟踪文件
- **工具**：`git_diff` · **它的作用**：统计摘要或完整补丁、暂存或未暂存、可选路径过滤器
- **工具**：`git_log` · **它的作用**：最近提交为 `{ hash, author, date, subject }`
- **工具**：`git_commit` · **它的作用**：暂存特定路径（或全部）并使用所需消息提交

## 安装

```sh
dsh plugin --profile web add dsh-git-tools
```

需要 `PATH` 上的 `git`（存在于任何开发环境中）。该插件是
发布在 [npm](https://www.npmjs.com/package/dsh-git-tools) 上并从
注册表一旦发布。

## 截图

## 工具参考

所有工具都接受可选的 `cwd`（默认为会话工作区）。

### `git_status`

检查工作树和分支状态。

```json
{
  "branch": "main",
  "ahead": 0,
  "behind": 2,
  "staged": [{ "path": "src/index.ts", "status": "M" }],
  "unstaged": [],
  "untracked": ["scratch.txt"]
}
```

### `git_diff`

查看变化。 `staged` 比较索引，`statOnly: true`（默认）返回统计摘要，
`statOnly: false` 返回完整补丁。 `path` 过滤到单个文件。

```json
{
  "stat": [{ "file": "src/index.ts", "added": 3, "deleted": 1 }],
  "total": { "files": 1, "insertions": 3, "deletions": 1 },
  "patch": null
}
```

### `git_log`

列出最近的提交。 `count` 默认为 10（最大 100）； `path` 过滤到文件。

```json
{
  "commits": [
    {
      "hash": "a1b2c3d4e5f67890abcdef1234567890abcdef12",
      "author": "Shyboy0499",
      "date": "2026-08-26",
      "subject": "Fix typo"
    }
  ],
  "total": 1
}
```

### `git_commit`

创建提交。 `message` 是**必填**（非空）。使用 `paths` 暂存特定文件，
或 `all: true` 的一切。绝不隐式上演。

```json
{
  "success": true,
  "hash": "e5f6g7h0123456789abcdef0123456789abcdef01",
  "branch": "main",
  "filesStaged": 2
}
```

## 安全

- 所有 git 调用都通过 `execFile` 运行，参数以数组形式传递 — 无 shell
  插值，因此用户/模型控制的值是注入安全的。
- `git_commit` 需要显式 `message` 并且从不单独暂存文件
  （通过 `paths` 或 `all: true`）。
- 核心范围内无破坏性操作（`--amend`、`--force`、变基、重置）。

## 发展

```sh
pnpm install
pnpm run build        # tsdown → lib/
pnpm test             # vitest against real throwaway git repos
pnpm run lint         # oxlint
pnpm run format       # prettier --write .
```