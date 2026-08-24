# DeepSeek Harness 用于 VS 代码 (dsh-vcode)

> **使用此扩展之前**：首先从终端启动 DeepSeek Harness 服务器 - 扩展在 VS Code 内连接到它。
>
> ```bash
> npx @deepseek-ai/dsh web
> ```

[更新](#chinese) |出版商： Jager · 最新：

直接在 VS Code 中使用 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`)，以及 ChatGPT/Copilot：内置 `@dsh` 聊天参与者、辅助侧边栏/独立聊天窗口、工作区/作业/轨迹/设置面板、回合级 Git 回滚和 **多语言 UI**（字典/葡萄牙语/英语/中文/葡萄牙语/德语/法语/西班牙语/葡萄牙语/ ไทย / Bahasa Indonesia / Türkçe / Русский / 阿拉伯语 — 遵循 VS Code 显示语言或手动切换）。

![VS 代码的 DeepSeek Harness](https://raw.githubusercontent.com/NEXTINDIE/DeepSeek-Harness-for-VS-Code/main/media/home.jpg)

## 特点

- **内置聊天参与者 `@dsh`**：在本机聊天面板中键入 `@`（Ctrl+Alt+I）；通过工具调用和批准按钮进行流式回复；斜杠命令 `/new`、`/session `、`/preset <name>`。
- **辅助侧边栏选项卡**：容器出现在 VS Code ≥ 1.106 上的辅助侧边栏中（在旧版本上回退到活动栏）。
- **独立聊天窗口**：`DSH: Open Standalone Chat Window`。
- **现代聊天用户界面**：大型圆形输入框，药丸工具栏（思考深度/模型/预设/权限），会话统计线（回合·步骤·LLM/工具时间·第一个令牌·tok/s·缓存命中·输入/输出令牌），上下文使用栏。
- **每条消息的操作**（最小行图标）：复制（双矩形图标）/分支（叉线图标；菜单：逆时针箭头“在此处倒带”·叉形图标“从此处分支”·左上折叠“分支并倒带”·左上箭头“返回主”）/竖起大拇指/向下（行图标，官方`/feedback`）/消息标题显示模型·思考时间·每步标记。
- **回合级Git回滚**（每个助手回合上的↩按钮+分支菜单条目）：DSH服务器端插件`dsh-git-rollback`在每个回合开始时将工作区的git状态（跟踪+未跟踪文件）快照为隐藏引用（`refs/dsh/checkpoints/<sid>`，分支历史记录零污染）并将其记录在`.dsh/rollback`下；该按钮将工作区恢复到该回合之前的状态。命令 `/rollback [N]`、`/redo`、`/checkpoints` 在 Web 命令面板和 VS Code 聊天中都有效（回滚是非破坏性的：首先保存预回滚状态，`/redo` 恢复它，忽略的文件永远不会被触及）。每条消息的 ⋯/分支菜单还提供 **“撤消本回合的文件更改”**（预览并确认审阅对话框，仅反转已更改的文件 - 您自己的提交和 HEAD 保持不变），**“查看检查点”** 和“撤消本回合的更改并从此处分支”。网络聊天具有相同的 Copilot 风格转弯分隔线和开箱即用的浮动恢复对话框（插件 Web 部分，通过 DSH 客户端模块管道提供服务）。

![撤消回合的更改审核对话框](https://raw.githubusercontent.com/NEXTINDIE/DeepSeek-Harness-for-VS-Code/main/media/git.jpg)

![具有撤消/检查点/分支的消息操作](https://raw.githubusercontent.com/NEXTINDIE/DeepSeek-Harness-for-VS-Code/main/media/git-2.jpg)
- **可折叠推理**（默认隐藏）和每回合工具摘要（“本回合调用了 N 个工具”）。
- **可交付成果框**：对话结束时列出的每轮生成的文件，单击即可打开。
- **会话管理**：⋯ 带有分叉/重命名（预填充标题）/存档的菜单。
- **目标**：进度卡+带有编辑/完成/清除功能的🎯芯片。
- **计划模式**：`/plan`后出现📝芯片，点击退出。
- **附件**：自动附加活动编辑器文件（遵循编辑器开关）+添加文件/文件夹（单独的选择器）；上下文已注入模型但显示折叠。
- **子代理**：带有最近回复预览的状态芯片。
- **技能**：`/`菜单（官方技能列表）中列出的可用技能。
- **.claude / .codex / GitHub Copilot 目录**：由 DSH 核心自动加载的 CLAUDE.md / AGENTS.md； `.claude/commands`、`.claude/skills`、`.codex/skills` (SKILL.md)、`.github/copilot-instructions.md`、`.github/instructions`、`.github/agents` 和 `.github/prompts` 列在 `/` 菜单中并且可插入。
- **权限**：只读/工作区写入/完全访问切换（官方`/permission`命令）。
- **跨项目会话**：每个文件夹@dsh 会话；多根跟随活动编辑器； `dsh.participantSessionMode: global` 共享一会话。
- **工作区浏览器**（📁按钮，Web工作区奇偶校验）：按工作区分组的会话；添加/重命名/删除/重新排序工作区；每组会话排序和存档；会话内容搜索（即时标题匹配+服务器内容搜索，当索引被禁用时使用本地回退）；行显示等待批准/计划审查/问题/运行状态。
- **后台作业面板**（⚙️ 按钮）：当前会话的 bash / pwsh / 子代理作业，包含状态、计时和详细信息，来自会话/作业框架。
- **轨迹视图**（🧭按钮，网络轨迹奇偶校验）：回合感知事件分类账（seq·时间·类型·摘要·代币使用），单击展开完整事件JSON，输入过滤器。
- **设置面板**（⚙️ 按钮、Web 设置奇偶校验）：常规设置（每个命名空间的模式驱动表单、重新启动徽章、每个命名空间重置）、模型和提供程序（提供程序路径目录 + 模型目录 + 端点模型发现）、凭证管理（API 密钥设置/清除）、代理预设创作（查看组合/复制/打开目录以编辑 cordis.yml/删除用户预设）。

![设置面板](https://raw.githubusercontent.com/NEXTINDIE/DeepSeek-Harness-for-VS-Code/main/media/setting.jpg)

- **子代理对话**：点击子代理芯片即可打开其记录；连续子级接受提示（subagent.prompt）和中断（subagent.interrupt）。
- **图片附件**：🖼️在发送和历史播放中添加图片（官方图片内容块通道）。
- **排队消息操作**：可以编辑/删除/引导排队消息（官方 session.updateQueue）。
- **目标创建**：当不存在目标时，🎯芯片会创建一个目标（具有目标和圆形上限的goal.create）。
- **一键提交消息**：源代码管理标题栏 (`DSH: Generate Commit Message`) 中的 ✨ 按钮读取暂存/未暂存的 git diff，并使用轻量级模型（默认 `deepseek-v4-flash` + 省力；可通过 `dsh.commitModel` / `dsh.commitReasoningEffort` 配置）在一次性会话中生成常规提交样式消息（立即存档，从未显示在会话列表中），将结果写入 SCM 输入框并自动取消超时或模型请求额外交互时。
- **i18n**：简体中文/繁体中文/英语/日语/韩语/德语/法语/西班牙语/葡萄牙语/泰语/印尼语/土耳其语/俄语/阿拉伯语 - 遵循 VS Code 显示语言，或通过设置面板的 `dsh.language` / 🌐 部分进行切换。

## 安装

```bash
cd
npm install
npm run package          # outputs Releases/dsh-vscode-<version>.vsix
```

VS Code → 扩展 → `…` → 从 VSIX 安装 → 选择 `Releases\` 中的文件 → 重新加载。

先决条件：VS Code ≥ 1.90（内置聊天≥ 1.95；辅助侧边栏容器≥ 1.106）； DSH CLI 或 npx 后备；配置的模型凭据（与 `dsh web` 相同）。

## 使用亮点

- Enter 发送，Shift+Enter 换行；运行时，发送按钮（纸平面线图标）变为停止（方形线图标），键入会将其恢复为发送（排队发送）。
- `/` 按钮（左下角）：命令菜单（计划/紧凑/目标/反馈/权限/技能/.claude）— 将命令插入输入；按 Enter 运行。
- 旁边的`+`按钮：添加文件/添加文件夹；蓝色芯片是自动附加的活动文件。
- 消息操作：单击分叉线图标打开分支/倒带菜单 - 逆时针箭头“在此处倒带”、分​​叉图标“从此处分支”、左上折叠“提前分支并倒带”，以及当 git-rollback 插件处于活动状态时“撤消本回合的文件更改”/“查看检查点”；分支会话还显示左上箭头“返回主”。每个助手回合上的逆时针箭头（当 DSH 服务器端插件处于活动状态时）会将工作区恢复到该回合之前的状态。
- 会话⋯菜单：分叉/重命名/存档；右上角预设药丸（仅限新会话）；思维/模型药丸位于右下角。
- 源代码控制标题栏：✨ 按钮根据当前差异生成常规提交消息并填充 SCM 输入框（打开多个存储库时会出现一个选择器）。
- 上下文菜单：选择→`DSH: Send Selection to @dsh`；文件 → `DSH: Ask @dsh About This File`。

## 配置

### 键·默认值·说明
- **按键**：`dsh.url` · **默认**：`http://127.0.0.1:3080`