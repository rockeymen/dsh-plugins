# Humanizer-ru - 人性化的俄语 AI 文本

[！[GitHub 星星](https://badgen.net/github/stars/Vladimir-Human/humanizer-ru)](https://github.com/Vladimir-Human/humanizer-ru/stargazers)

人工智能代理的技能：查找并消除俄语文本中机器生成的痕迹。它以人性化的方式重写了“gpt-shny”文本，没有扭曲含义，并且不触及生物：这里的误报比通行证更昂贵。

有 38 个模式（25 个基本模式和 13 个扩展模式）和 39 个 A 类和 B 类可检查的正则表达式标记。检查由 CI 执行。目录 [skills.sh](https://skills.sh/vladimir-human/humanizer-ru/humanizer-ru) 报告成功的 Gen Agent Trust Hub 和 Socket 检查；关于红色 Snyk 徽章 - 在“安全”部分。

**之前：**

> 🚀 **创新：** 我们添加了批处理、热键和离线模式。这无疑证明了我们对质量的承诺。此外，这些功能还提供无缝、直观且强大的用户体验，从而确保效率。专家认为这是一场革命。

**之后：**

> 我们添加了批处理、热键和离线模式。

技巧消除了陈词滥调，但没有为作者添加事实。在上面的示例中，“After”选项中的所有内容都已经在源中。

## 给他什么

给技能一个完整的片段。他会根据要求找到生成的痕迹
将重写文本。 SKILL.md - 代理指令：它被加载到任务中
分析或编辑以及 `references/` 中必要的参考书。
PERSONA.md - 其他：对话的活泼语气的简短规则，不是
检查文本。不要将整个 SKILL.md 放入系统提示符中
聊天客户端：这会减慢响应速度，但不会使对话变得更加活跃。

## 同名项目 - 不要混淆它们

GitHub 中还有其他名为 `humanizer-ru` 的存储库，与
这个项目。他们的立场不同：

### 项目·焦点·探测器定位
- **项目**：[Vladimir-Human/humanizer-ru](https://github.com/Vladimir-Human/humanizer-ru) - 此项目· **焦点**：俄语文本编辑器：38 个模式、39 个正则表达式标记，带有证据注册 37/39、36 个 CI 门、盲配对运行· **检测器上的位置**：检测器未被绕过，其下方的文本未自定义；目标是自然文本，而不是检测器的绿色判决
- **项目**：[smixs/humanizer-ru](https://github.com/smixs/humanizer-ru) · **焦点**：技能“人性化和探测器”：使用一种工具进行编辑和检查 · **探测器上的位置**：—
- **项目**：[ilyautov/humanizer-ru](https://github.com/ilyautov/humanizer-ru) · **重点**：人性化技能；描述中指出它与 GPTZero、DivEye、RuBERT 测量的内容相匹配（困惑度和突发性） · **检测器上的位置**：绕过检测器在描述中公开说明
- **项目**：[blader/ humanizer](https://github.com/blader/humanizer) · **焦点**：同一类型的英语语言技能，三天前发布 · **检测器的位置**：—

我们不隶属于他们中的任何一个。该项目的宣言是：“不
探测器旁路装置”；有关更多详细信息，请参阅“安全”部分。

## 30秒内安装

```sh
npx skills add https://github.com/vladimir-human/humanizer-ru --skill humanizer-ru
```

安装程序将提供选择代理：Claude Code、Codex、Cursor、Gemini CLI、OpenCode 和其他支持代理技能格式的环境。该技能本身由文本指令组成，工作时并不执行代码。 `npx`团队推出第三方Skills CLI；如果您想在安装前检查每个文件，请使用[“手动安装”](#установка-вручную)]部分。

## 手动安装

humanizer-ru 技能安装在 Claude.ai 和本地 CLI Claude Code 中。对于团队，请通过组织管理员按照自己的方式行事（请参阅第 2 节）。

### 0.安装前检查

该技能在激活时不会执行代码：工作部分只是文本标记文件。该存储库具有用于测试和 CI 的辅助 Python 脚本 (`scripts/`) - 它们只能手动启动或在 GitHub 操作中启动。任何技能都有一个规则：**先读，然后放**。

1.直接在GitHub上打开`SKILL.md`和`references/`，并确保您对内容满意。
2. 仅发布来自 **Releases** 页面的版本（带注释的标签，如 `vX.Y.Z`），而不是任意分支状态。

### 1.Claude.ai（网页界面）

1. 打开此存储库的 **Releases** 页面，选择最新版本并下载附加的 `humanizer-ru.zip` 存档。这是该技能的编译存档 - 组成在步骤 0 中列出。 `Source code (zip)`，GitHub 添加到每个版本 - 完整的存储库树以及 `.github/`、`research/` 和 `tests/`；只有那些要运行验证器的人才需要它。
2. 登录您的 Claude.ai 帐户并转到 **设置** > **技能**。
3. 点击**上传技能**并选择下载的存档。

> **注意。** 在 `humanizer-ru.zip` 中，`SKILL.md` 文件位于存档的根目录中，因此无需重新打包。仅当您使用 `Source code (zip)` 时才可能需要它：所有内容都嵌套在像 `humanizer-ru-<номер версии>` 这样的文件夹中。

### 2. 组织（企业&团队）

组织管理员检查版本（请参阅步骤 0）并将其上传到共享库 - 该技能可供整个团队使用。

### 3.API和本地代理（Claude Code）

如果您通过 API（端点 `/v1/messages` 或类似端点）工作 - 使用 container.skills 参数传递技能。详细信息位于您客户的文档中。

本地安装 - 固定到发布标签以获得准确的验证状态：

```sh
mkdir -p ~/.claude/skills
git clone --branch v3.13.0 --depth 1 https://github.com/Vladimir-Human/humanizer-ru.git ~/.claude/skills/humanizer-ru
```

或者最低限度——只有一张技能图（没有`references/`参考书；检查的深度会更低）：

```sh
mkdir -p ~/.claude/skills/humanizer-ru
cp SKILL.md ~/.claude/skills/humanizer-ru/
```

如果您不需要手动检查每个步骤，则使用目录 [skills.sh](https://skills.sh/vladimir-human/humanizer-ru/humanizer-ru) - 请参阅上面的“30 秒内安装””中的一个命令进行安装会更快。

### 4.DeepSeek Harness（dsh）

dsh 在自己的目录中寻找技能。使用 dsh 0.1.0-rc.6 进行测试。这是开发者预览版：承诺进行重大更改，因此对于其他版本，请检查其文档。

全局安装（所有项目和配置文件代理）：

```sh
mkdir -p ~/.agents/skills
git clone --branch v3.13.0 --depth 1 https://github.com/Vladimir-Human/humanizer-ru.git ~/.agents/skills/humanizer-ru
```

在dsh中搜索技能的顺序（最接近的目录优先）：`<проект>/.dsh/skills`、`<проект>/.agents/skills`、`~/.dsh/skills`、`~/.agents/skills`。不扫描 `~/.claude/skills` dsh 目录：根据上述 Claude Code 说明安装在那里的技能在 dsh 中不可见。

## 用法

在Claude Code或其他代理处：

```text
/humanizer-ru [вставьте текст]
```

或者直接：

```text
Очеловечь этот текст: [ваш текст]
```

## 它有什么作用

通过 38 种机器书写模式（25 种基本模式和 13 种俄语扩展）和 39 个 A 类和 B 类检查的正则表达式标记运行俄语文本，然后删除痕迹。基于[维基百科：AI 书写的迹象](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) 和[维基百科：生成文本的迹象](https://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BA%D0%B8%D0%BF%D0%B5%D0%B4%D0%B8%D1%8F%3A%D0%9F%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D0%BA%D0%B8_%D1%81%D0%B3%D0%B5%D0%BD%D0%B5%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8_%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0)]。

从 2.3 版本开始，SKILL.md 是一个带有决策树的映射。模式和检查的完整描述位于包含的文件 `references/` 中。

从3.8版本开始，软层变得可数。 `scripts/scan_soft_signals.py` 根据四类特征查找候选者，对每个文本的每个模式进行一次计数，并应用决策树阈值；类型例外取自 `references/false-positives.md`。该脚本会打印引用和编辑量的建议，但不会对作者身份做出判断 - 主要规则仍然由代理决定。在人类控制语料库上，剧本是沉默的：单一的文学破折号和重复切断了类型例外。在俄罗斯模型的输出中，它找到了正则表达式层看不到任何内容的候选者。只有机械轴才会消失：删除标记、事实纯洁性、错误编辑（[LEADERBOARD.md](LEADERBOARD.md)）。可读性由其自己的评审小组进行评估，但我们将其数字保留给自己：该小组是单一家庭，并且位置噪声在运行中进行了描述。

### 架构

````
humanizer-ru/
├── SKILL.md # 地图、决策树、清单
├── CHANGELOG.md # 完整版本历史记录
├── LEADERBOARD.md # 机械轴：探测器运行
├── PERSONA.md # 实时对话的紧凑规则
├── SECURITY.md / SECURITY.en.md
├── CITATION.cff # 奖状卡
├── 许可证# MIT
├── dsh/ # DeepSeek Harness 的捆绑包（供应商 SKILL.md + 引用/）
├── CODE_OF_CONDUCT.md / 贡献