![dsh-plugin-opencode-omo](https://raw.githubusercontent.com/royenheart/dsh-plugin-opencode-omo/main/assets/banner.png)

#@royenheart/dsh-plugin-opencode-omo

一个 DeepSeek Harness 插件，可将 `opencode-omo` 代理预设（模式）添加到 Web 配置文件。该模式复制 **opencode** + **omo** 插件 ([oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)) 的行为，仅限于此模式 - 其他预设 (`standard`/…) 保留默认的 dsh 循环、沙盒 fs 和无 omo 挂钩。

## 该模式提供什么

- **opencode + omo 系统提示** — 真正的 opencode `default.txt` 角色（语气、风格、主动性、约定、代码风格、任务指导）+ omo 的 Sisyphus 协调器身份，声明为 **完整** 系统提示：在此模式下，dsh 线束身份和运行时上下文快照被抑制。循环垫片还预先考虑了 opencode 的**实时环境块**（确切的模型 ID、工作目录、工作空间根目录、git、平台、日期、重新计算的每个步骤）。
- **作曲家中的omo角色选择器** - 在dsh现有的`conversation.input.left`工具行插槽中（在访问/计划芯片之后）：`sisyphus`、`hephaestus`（深度代理）、`prometheus`（计划生成器）、`atlas`（计划执行器）、`sisyphus-junior`， `athena`/`athena-junior`/`council-member`、`metis`、`momus`、`oracle`、`librarian`、`explore`、`multimodal-looker`。选择角色会交换会话的完整系统提示并应用该角色的配置模型。
- dsh 设置面板 (`settings.section`) 中的 **全局“角色设置”**：居中“主要模型”标签下的每个角色主要模型下拉列表（遵循当前/固定）； dsh 风格的圆形“+”按钮可在角色框下方打开后备模型列表（可重复添加，取消/关闭不会添加任何内容），保留在 `opencode-omo-roles` 设置中。当请求失败时，循环填充程序会在线束重试策略运行之前通过角色的后备链前进。
- **开放代码工具链（完整）** — 持久 `bash`、`read`/`write`/`edit`/`read_image`、`apply_patch`、`glob`/`grep`、`todo_write`、`skill`、 `web_fetch`/`web_search`、`lsp`、`exit_plan_mode`（计划）、`ask_user_question`。 `tool-surface.mjs` 使用 opencode 的 `tool/*.txt` 文本覆盖模型可见的描述/参数，并将 `read`/`edit`/`write` 填充为 opencode 的参数名称。
- **omo `task()` 表面** — `task-shim.mjs` 注册 omo 风格的 `task(category/subagent_type/load_skills/run_in_background/task_id)` 调用，将其映射到 dsh 命名子代理 + 通用委托。
- **omo 多角色子代理** — `oracle`（只读顾问）、`librarian`（外部文档/代码搜索）、`explore`（代码库 grep）、`metis`（预规划）、`momus`（计划审阅者）、`multimodal-looker`（媒体）以及通用`subagent`/`subagent_fork` + `workflow`/`ralph`。
- **omo 上下文注入** — AGENTS.md/CLAUDE.md 直接 + `skills/` + omo 的 `rules-injector`（`.omo/rules`、`.cursor/rules`、`.github/instructions`、`copilot-instructions.md`）。
- **omo hooks** - `comment-checker`（拒绝写入/编辑时的 AI-slop 评论），`hashline`（读取标记 `N#HH|content` + `hashline_edit` 过时引用防护）。
- **每个模式执行后端** — 本地文件系统 (`dsh-fs-local`) + 持久 PTY shell，与其他模式的沙盒 fs/shell 隔离。
- **本机接缝环垫片** — 无 dsh 侧驱动接缝。 `

driver.mjs` is an ordinary preset plugin using the shipped seams: a dynamic `ctx.systemPrompt.section({complete: true })` recomputes opencode's env block and the selected omo role prompt per assembly; `system-prompt/assemble` applies opencode's model tool gating; `agent/inbox/claimed`, `agent/pre-step`, `agent/request`, and `agent/request-error`提供ultrawork检测、maxSteps、角色模型路由和后备重试。其他预设不受构造影响。

## 布局

```
cordis.patch.yml                 # bundle patch: self host row
install.py                       # idempotent install/uninstall (incl. user preset root)
src/                             # host + client plugin halves (role registry, settings, picker UI)
lib/                             # built host/client bundles (npm run build)
scripts/build.sh                 # typecheck + tsdown build
presets/opencode-omo/
  agent.cordis.yml               # the composition (tools, roles, hooks, LSP)
  preset.yml                     # display metadata
  persona.md                     # opencode default.txt + omo Sisyphus persona
  roles/*.md                     # subagent personas (also main-role prompts)
  roles/prompts/*.md             # primary-role complete prompts (hephaestus/prometheus/atlas/…)
  skills/                        # omo shared skills
  driver.mjs                     # native-seam loop shim (prompt/route/fallback/maxSteps/ultrawork)
  rules.mjs                      # rules-injector
  comment-checker.mjs            # comment-checker hook
  apply-patch.mjs                # apply_patch tool
  hashline.mjs                   # omo hashline read-tagging + hashline_edit
```

## 安装

首先构建包（主机+客户端包）：

```sh
npm run build
```

然后，`install.py` 幂等地自动安装/卸载 - 它将包符号链接到 `~/.dsh/profiles//node_modules/`，编辑配置文件的 `package.json`（添加/删除依赖项 + 捆绑条目），并通过 dsh 的本机用户预设根作为 `$DSH_HOME/.agent-presets/opencode-omo` 下的真实目录发布预设（符号链接到包中的条目，因此更新保持有效）：

```sh
python3 install.py --profile web              # install (idempotent)
python3 install.py --profile web --uninstall  # remove
```

手动替代方案 - 该包是 dsh **捆绑**：它声明 `dsh.bundle.patch` 并运送预设。将其加载到配置文件中：

```sh
dsh plugin --profile web add link:/path/to/dsh-plugin-opencode-omo
```

然后将其添加到 `$DSH_HOME/profiles/web/package.json` 中配置文件的捆绑列表中，并自行创建用户根预设目录：

```json
"dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "@royenheart/dsh-plugin-opencode-omo"] } }
```

```sh
mkdir -p "$DSH_HOME/.agent-presets/opencode-omo"
for f in /path/to/dsh-plugin-opencode-omo/presets/opencode-omo/*; do
  ln -s "$f" "$DSH_HOME/.agent-presets/opencode-omo/"
done
```

重新启动 dsh 并从模式选择器中选择 **opencode-omo**。

## dsh 侧所需的更改

**此版本依赖于一个 dsh 侧补丁。** 将其应用于 deepseek-harness 以获得完整的 maxSteps 保真度；补丁位于 [`patches/`](patches/README.md) 下，按功能划分：

- `patches/0001-agent-pre-step-assistant-prefill.patch` — 将可选的 `assistantPrefill` 添加到 `PreStepDecision`，让循环在模型请求之前记录助理角色预填充。该插件使用它来恢复 opencode 的 `MAX_STEPS_PROMPT` 助理角色语义。 **运行时兼容性**：主机插件扫描已安装的 `@deepseek-ai/dsh-agent-loop` 包以查找已编译的 `assistantPrefill` 标记。当补丁不存在时，maxSteps会自动降级为等效的合成用户消息（不会默默地删除任何内容），并且ZXQ​​7QXZ响应会将警告传递给浏览器； Web 客户端通过本机 `@deepseek-ai/dsh-client-ui-primitives` `Toast` 在每次页面加载时显示一次（4 秒，非阻塞）。

```sh
cd /path/to/deepseek-harness
git apply /path/to/dsh-plugin-opencode-omo/patches/0001-agent-pre-step-assistant-prefill.patch
npm run build:lib:host
npx vitest run packages/core/agent-loop/tests/interception.spec.ts
```

- 提供商可见的 `format`/`toolChoice` 仍然是一个提案（参见 `DSH_CHANGE_PROPOSALS.md`）； omo 的常规路径不使用它，独立的结构化输出插件覆盖了公共路径。

其他一切都在未修改的 dsh 接缝上运行：预设通过 `$DSH_HOME/.agent-presets` 发布，并且作曲家选择器占用现有的 `conversation.input.left` 插槽（客户端通过 `ctx.slots.inject()` 注册，因此无论树外捆绑应用顺序如何，它都会等待声明父级）。

## 台架实验（等效验证）

跑步者和复制笔记位于 [`tests/benches/`](tests/benches/README.md);报告写入`docs/exps/`。科学方法（配对设计、McNemar/bootstrap/TOST、A/A 噪声基底、迹线对齐、缓存和延迟协议）记录在 [`docs/exps/2026-08-16-scientific-bench-methodology.md`](docs/exps/2026-08-16-scientific-bench-methodology.md).设计亮点：

- 运行隔离端口dsh（`opencode-omo`模式，隔离`$DSH_HOME`）和机器安装的opencode + oh-my-openagent（隔离`XDG_CONFIG_HOME`）。
- 均使用`deepseek-official/deepseek-v4-pro`（dpsk v4 pro）； API密钥来自`DEEPSEEK_API_KEY`环境变量。脚本不会硬编码任何机器路径或秘密。
- 分层工作台：L1 HumanEval、L2 MBPP、L3 SWE-bench-verified-mini（采样）、比较 pass@1、CoT/推理暴露、工具调用链（读/编辑/写/b）