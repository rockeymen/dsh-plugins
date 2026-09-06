# DeepSeek Harness 的 Leppy 循环

Leppy Loop 是一个本机外部 Cordis 捆绑包，它为每个工作线程执行一个跟踪的 Markdown 检查表，其中包含新的 DeepSeek Harness 进程和会话。控制器拥有 Git 同步、工作树、清单转换、关闭、门、持久恢复状态和进程租用。工作人员仅收到当前行、其 `Done:` 合约、允许的路径、适用的存储库指令和明确的禁止。

版本 `0.2.18` 固定到 DeepSeek Harness `0.1.1-rc.2`，上游提交 [`b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`](https://github.com/deepseek-ai/deepseek-harness/commit/b150a551b8d465e31e418e1b2eaf5e79bbb7d28e)。它注册了一个主机端 `/leppy-loop` 命令和一个面向模型的控制器工具，现有的 Web 编写器和代理无需客户端补丁即可发现这些工具。

## 安装

需要节点 `22.19+`、Git 和 pnpm `10.28.1`。 DeepSeek Harness将插件管理转发给`PATH`上的`pnpm`； pnpm 11 需要单独的本机构建批准步骤，并且未声明为 `0.2.18` 的安装兼容组合。为“Harness Models”页面中选择的模型提供程序配置凭据，然后构建 tarball 并将其安装到 Web 主机使用的配置文件中。工作人员自动重用该提供者、模型配置文件和凭证；当选择其他提供商时，不需要 `DEEPSEEK_API_KEY`：

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm pack
npx @deepseek-ai/dsh@0.1.1-rc.2 plugin --profile web add ./leppy-loop-deepseek-0.2.18.tgz
```

更改其配置文件后重新启动现有的 `dsh web` 进程。浏览器刷新无法编写新安装的主机插件。已发布的 GitHub 版本 tarball 可能会替换本地 `.tgz` 路径；插件注册表中没有发布声明。

## 快速入门

创建一个跟踪清单，例如 [`examples/feature.task.md`](examples/feature.task.md)，提交它，启动一个 Web 会话，其工作空间就是干净的签出，然后调用不带参数的命令：

```text
/leppy-loop
```

该命令对 AI 轮流进行排队，检查对话和存储库，解析预期的跟踪清单和权威 Git 库，并调用私有 `leppy_loop_start` 工具。如果目标确实不明确，人工智能会提出一个简洁的问题，而不是猜测。命令后的自然语言作为意图转发，而不是解析为 CLI 参数，例如 `/leppy-loop continue the checklist from this conversation`。

仅当输入以 `--tasks` 等选项开头时，确定性显式形式才保持可用：

```text
/leppy-loop --tasks ./tasks/feature.task.md --sync-branch origin/main --phase-gate-command "pnpm test"
```

相对清单和工件路径从接收会话的工作区解析。显式参数使用非评估引用 argv 语法；大门仍然是一个明确引用的不透明论点。

默认的 `adaptive` 工作线程策略使用 `high` 处的 `gpt-5.6-terra` 来执行普通 OpenAI Codex 任务，然后使用 `low` 处的 `gpt-5.6-sol` 来关闭和恢复停滞的任务。在恢复策略下，零提交的干净普通任务完成会自动重试一次。如果该独立重试证明 `Done:` 合约已经通过确切的终端证据标记得到满足，并留下一个干净的未更改分支，则控制器仅关闭检查表；肮脏的 WIP、缺失的证据以及未经验证的重复零提交结果仍然无法关闭。内联 `model=`/`effort=` 元数据和显式 `--model`/`--effort` 选项优先。使用 `--worker-policy selected`、`terra-high` 或 `sol-low` 选择另一个全局行为。默认转录上限为 8192 KiB，并且仍可通过 `--worker-transcript-limit-kb` 进行配置。恢复收据包括 `--recover-run `，因此即使旧的失败运行仍然存在，恢复仍然具有确定性。提供准确的运行 ID 还可以在其保留的分支/工作树中的下一个打开的清单行上继续完成的选择性运行；永远不会隐式选择已完成的运行。

当 Web 运行处于活动状态时，每个选定的行都会在开始时在聊天中创建一个持久的进度卡。其插件拥有的浏览器渲染器每秒在本地更新一次任务尝试的已用挂钟时间，然后同一张卡根据成功、停滞或失败时的已完成/总计数和最终任务持续时间进行结算（例如，`Task completed — 14/57 — 3m 12s elapsed.`）。恢复的中断行启动新的尝试卡和计时器；内部无提交验证保留在原始卡和持续时间内。只有开始和终端命令生命周期记录是持久的，并且两者都保持从模型上下文中排除，因此实时计时器不写入每秒事件，不消耗令牌，并且不分割工具调用/结果配对。

默认情况下，在每个清单行和门成功后，Web 将在本地完整运行。只有直接的、人工编写的 `--open-pr` 斜杠命令才能使控制器获取并重新定位到远程基地，推送其确切的 Leppy 分支，使用 `gh` 创建或查找 GitHub 拉取请求，存储 URL 并将其返回到聊天。自主模型工具无法发布，工作人员无法推送或使用`gh`。在选择加入之前，请先安装并验证 GitHub CLI (`gh auth status`)。

精确预览选定的一行，无需启动工作程序或读取凭证：

```text
/leppy-loop --tasks ./tasks/feature.task.md --sync-branch origin/main --dry-run
```

## 合同清单

```md
## API phase

- [ ] Add `src/api.ts` | Done: GET /health returns 200 | model=deepseek-v4-pro | effort=high
- [ ] Update docs | Done: README documents /health | paths=README.md
- [?] Closure: inspect API phase | paths=src,README.md
- [~] Gate: focused project gate
```

标记和线型：

### 标记·意义
- **标记**：`[ ]` · **含义**：开启普通worker任务
- **标记**：`[?]` · **含义**：开相合流工
- **标记**：`[~]` · **含义**：打开仅控制器相门
- **标记**：`[x]` · **含义**：任何类型的完成线

普通任务需要非空 `Done:` 和显式的存储库相对路径，通过 `paths=a,b` 或路径形状的反引号跨度。首选规范管道格式，但接受缩进的 Markdown 延续和历史 `[closure]`/`[gate]`、`Paths:`、`Paths EXATOS:`、`Paths permitidos:` 和多行 `Done:` 形式。 `[?] [human]` 或 `[?] [human/live]` 检查点永远不会发送给工作人员：运行以其保留的工作树而停止，直到人类将该行标记为完成并恢复确切的运行。提交功能暂存经过精确验证的更改文件；被忽略的未跟踪文件仅当位于这些显式范围之一之下时才符合资格，从而允许有意进行版本化迁移，而无需清除不相关的被忽略材料。 `--task-match` 是文字子字符串，而不是正则表达式。一个阶段可以省略关闭、门或两者；当两者都存在时，它们必须在自动行中相邻且最终。除了文件现有的换行符约定之外，复选框标记之外的 Markdown 会逐字节保留。

跟踪的根 `.leppy-loop.json` 可能包含字符串 `customInstructions`；它附加在适用于每位工人的 `AGENTS.md`/`CLAUDE.md` 说明中。无效形状无法关闭，文件上限为 64 KiB，指令字符串上限为 32 KiB。试运行结果包括通过面向模型的工具和直接命令文本进行的所有 lint 诊断。

路径通过文件系统标识来解析。遍历、绝对路径和转义工作树的符号链接/连接都会被拒绝。控制清单总是拒绝向工人提供。

＃＃ 选项

### 选项·默认
- **选项**：`--sync-max-seconds` · **默认**：120
- **选项**：`--worker-timeout` · **默认**：30 分钟
- **选项**：`--max-iterations` · **默认**：64
- **选项**：`--worker-output-limit-kb` · **默认**：192 KiB
- **选项**：`--worker-transcript-limit-kb` · **默认**：2048 KiB
- **选项**：`--fetch` / `--no-fetch` · **默认**：获取一次
- **选项**：`--task-match <literal>` · **默认**：第一条开放线
- **选项**：`--recover-existing-wip` · **默认**：禁用
- **选项**：`--provider`、`--model`、`--effort` · **默认**：线束电流选择
- **选项**：`--fallback-model` · **默认**：无
- **选项**：`--artifacts-dir` · **默认**：`<git-common-dir>/leppy-loop/runs`

型号均严格对照`ctx.llm.listModels(provider)`进行校核。根据 `ctx.llm.resolveModelInfo` 返回的确切模型元数据检查工作量。回退最多尝试一次，并且仅针对分类可用性/速率限制故障。

## 执行语义

1. 来源检查和跟踪清单必须干净。
2. 控制器可选择获取一次，将 `--sync-branch` 解析为权威基础，创建 `leppy-loop/<tasks>-<run-id>`，并创建一个同级工作树。