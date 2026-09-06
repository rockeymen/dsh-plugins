# dsh-minimal-mode-compaction

为 DeepSeek Harness 的极简风格 agent 增加长会话所需的三种压缩路径：

- `compaction-basic` 的 token 压力自动压缩和上下文溢出恢复；
- 人工 `/compact`；
- 模型在任务中调用 `compact_now`，由插件排队到当前回合结束后执行。

本项目不复制官方压缩引擎。它只提供一个用户 preset 和一个调度工具，底层复用 DSH 自带的 `dsh-compaction-basic`、`dsh-command-compact` 和 `dsh-compaction-tool-result-pruner`。

它还注册一个 `/context` 命令：直接输入 `/context` 显示当前有效上下文窗口，输入 `/context 256k`、`/context 1m` 或纯 token 数值时写入 DeepSeek 模型设置。命令写入的是 DSH 原生 `llm-deepseek` 设置，后续请求实时使用新容量；自动压缩仍按 preset 的阈值比例计算。

## 和现有项目的区别

公开生态里已经有相近项目：

- `wangxiang0605qvq/dsh-auto-compact` 只有模型主动调度工具，要求 preset 已经挂载 `compaction-basic`；
- `songoao25/dsh-auto-compact` 只给已有压缩引擎调整阈值，并跳过出厂 `minimal`；
- `KitDoesIt/dsh-compaction-instant` 是另一个无模型压缩引擎，也需要用户把压缩能力挂进 preset。

本项目的目标是把官方 `minimal` 的工具组合原样保留，只增加一个可选择的 `minimal-compaction` 用户 preset，因此不修改 DSH 出厂文件，也不替换摘要引擎。

## 安装

### 一键安装

用户只需要执行一次下面的命令：

```bash
npx --yes github:wicm84266964/dsh-minimal-mode-compaction
```

安装器会自动完成以下步骤：

- 将插件加入 DSH 的 `web` profile；
- 安装插件的官方 peer dependencies；
- 安装或更新 `minimal-compaction` preset；
- 将 `agent-presets.default` 设置为 `minimal-compaction`。

安装结束后重启 DeepSeek Harness。已有会话不会中途切换 preset，重启后新建的会话会默认使用 `minimal-compaction`。用户不需要再手动执行 `dsh plugin`、`pnpm install` 或 preset 安装命令。

安装器默认把 profile 依赖指向 GitHub 仓库，而不是 `npx` 的临时目录；因此 Linux/WSL 使用 `npx` 部署不会因为 npx 缓存清理而失效。系统有 `dsh` 时会复用它；没有独立 `dsh` 命令时会自动调用 `npx @deepseek-ai/dsh`。如果没有可直接调用的 `pnpm`，还会自动回退到 `npx pnpm`。

如果不希望安装器修改默认 preset，可执行：

```bash
npx --yes github:wicm84266964/dsh-minimal-mode-compaction --no-default
```

这时安装仍然自动完成，但需要在 Harness 中手动选择 `minimal-compaction`。

### 本地源码开发

从源码运行安装器时，默认使用当前 checkout：

```bash
node scripts/install.mjs
```

也可以显式指定 profile、DSH_HOME 或安装来源：

```bash
node scripts/install.mjs --profile web --dsh-home "$DSH_HOME" \
  --source file:/mnt/c/saveproject/LBJ-workspace/open-source/dsh-minimal-mode-compaction
```

重复安装时，已有 preset 会先改名为带时间戳的 `.backup-*` 目录，再安装新版本。若要保留已有 preset 内容，增加 `--keep-preset`；先预览将使用的路径可以执行 `node scripts/install.mjs --dry-run`。

### 手动排错

只有在一键安装失败、需要逐步查看 profile 状态时，才需要手动执行：

```bash
dsh plugin --profile web add github:wicm84266964/dsh-minimal-mode-compaction
cd "$DSH_HOME/profiles/web"
pnpm install --config.auto-install-peers=true
node /path/to/dsh-minimal-mode-compaction/scripts/install-preset.mjs \
  --dsh-home "$DSH_HOME" --force
```

然后重启 DSH，在 agent preset 选择 `minimal-compaction`（显示名：`DeepSeek Harness 极简模式长会话`）。

## 发布渠道

DeepSeek Harness 当前没有独立的官方插件市场或审核提交入口。官方插件机制以 GitHub/npm 包为分发来源，用户通过 `dsh plugin add` 安装；本项目优先使用 GitHub 发布，后续如有需要再同步发布 npm 包。

## 上下文窗口设置

插件不会把模型上下文强行设成 1M，也不会覆盖用户的模型设置。`compaction-basic` 使用 DSH 最终解析的模型容量：

1. `llm-deepseek.models[]` 中该模型的 `contextWindow`；
2. 没有精确模型条目时使用 `llm-deepseek.defaultContextWindow`；
3. 两者都省略时才使用 DeepSeek 适配器默认的 1,000,000。

Web UI 中的位置是：`设置 → 模型 → DeepSeek → 编辑模型 → 容量/高级 → 上下文窗口`。

也可以直接参考 [`settings.example.yaml`](settings.example.yaml)，例如把 V4 Pro 的有效窗口设为 256K：

```yaml
llm-deepseek:
  defaultContextWindow: 262144
  models:
    - id: deepseek-v4-pro
      contextWindow: 262144
      maxTokens: 65536
```

注意：`models` 是模型目录配置；如果原设置中还有其他模型，编辑时要保留它们。精确模型的 `contextWindow` 优先于默认值，随后自动压缩按这个容量计算。
`contextWindow` 是输入和输出的合计预算；如果把它降到 256K，建议同时把 `maxTokens` 调到一个和任务相容的值，避免输出上限本身占满预算。插件不会擅自修改这两个模型设置。

## 压缩默认值

生成的 preset 默认配置为：

| 设置 | 默认值 |
|---|---:|
| 自动压缩阈值 | 有效上下文窗口的 75% |
| 原文保留尾部 | 有效上下文窗口的 20% |
| 摘要输出上限 | 8192 tokens |
| 上下文溢出恢复 | 最多重试 1 次 |

这些值位于用户 preset 的 `agent.cordis.yml`，可以按需调整。工具结果剪枝默认保留 4096 字符头部和 1024 字符尾部。

## 开发检查

```bash
npm test
npm run check
```

当前包只要求 DSH 运行时提供官方 peer dependencies；不要在本项目内复制官方 `compaction-basic` 源码。

## 发布流程

维护者发布新版本时：

1. 更新 `package.json` 的版本号，例如 `0.3.0`；
2. 新增 `docs/releases/0.3.0.md`，填写本版本说明；
3. 推送到 `main`，等待 GitHub Actions 的 CI 通过；
4. 在 GitHub 的 `Actions > Create release` 中运行 workflow，填写 `v0.3.0` 和是否为预发布版本。

发布 workflow 会拒绝重复的 tag/release，并检查当前 commit 的 CI check-runs；通过后由 GitHub Actions 创建不可变 tag 和 Release。不要直接在本地手动创建 release。
