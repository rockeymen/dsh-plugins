固定提交的资产/（jsDelivr 测试速度更快/更可靠）
     GitHub 上的存储库相对路径 — 保留 CDN，不要切换到相对路径）。
     ART 仍然是占位符：当最终的艺术作品落地时，替换 SVG
     文件内容（相同的文件名），提交，并在这些文件中添加 @<sha>
     新提交的 URL。 -->

#

[![](assets/associations.svg)](#)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/mod.svg)](https://www.reddit.com/user/inventor_black/)![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/open-source-irl.svg)](https://luma.com/OpenSourceIRL)]![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/anthropic-ambassador.svg)](https://wilfred.md)]![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@9f12c0442100e0485adcad811a25d20198e29956/assets/cerebras-ambassador.svg)](https://wilfred.md)]

**将任何文本字段变成双向 LLM 通道。** 它会读取您所写的内容并填写您所询问的内容：在您键入时捕获纸条，或者在您以 `_` 结束一行时回答。 Claude Code、OpenCode、Gemini CLI、shell 和 Chrome 的插件。与模型无关，您在发送之前查看输出，这是一个没有聊天窗口的开放标准。

模型会以两种方式出现在您的光标处。 **提示**会对您已经编写的内容做出反应，并在无提示的情况下显示修复或更清晰的内嵌线条。 **空白**按需操作：以 `_` 结束一行，模型将填充其余部分。没有聊天窗口，没有复制粘贴，没有上下文切换。

     GitHub 托管资产（内联渲染）： ![demo](https://github.com/opencues/opencues/assets/.../demo.mp4)
     YouTube（GitHub 不会内嵌嵌入它 - 而是链接缩略图）：
     [！[演示](assets/hero-thumb.png)](https://youtu.be/VIDEO_ID) -->

OpenCues 与平台、模型和提供商无关，从头开始设计，以实现原生内联 AI。

### 你输入 · 你得到
- **您输入**：让我们在 19 号星期四发货 · **您得到**：↳ 19 号是星期五
- **你输入**：我们应该继续重构这个· **你得到**：↳我们应该重构这个
- **您输入**：嘿，当您有时间正式填写时，您可以向我发送该报告_ · **您得到**：您能在方便时尽早向我发送该报告吗？
- **您输入**：4 + 4 = _ · **您得到**：4 + 4 = 8
- **你输入**：hello world翻译成日语_·**你得到**：こんにちは世界
- **您输入**：起草一封电子邮件给我的房东，要求减租_·**您收到**：（书面电子邮件）
- **您输入**：ffmpeg命令将视频转换为网络就绪的mp4 _ · **您得到**：ffmpeg -i input.mov -c:v libx264 -preset Slow -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4

带有 `_` 的行是**空白**：您询问，模型会填写。没有的行是**提示**：模型会说出您所写的内容，没有提示。

#

[！[](assets/license.svg)](LICENSE)[！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Ownership-05.svg)](spec/README.md)]！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Ownership-06.svg)](spec/blank-spec.md)]！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Ownership-07.svg)](spec/cue-spec.md)]

# 快速入门

```bash
npm install -g opencues              # needs Node 22+ and git
opencues set-key cerebras csk-...    # cerebras.ai — free tier, lowest latency
opencues install claude-code         # or: opencode | gemini-cli | chrome | shell | dsh
claude-cues                          # launch — native `claude` is untouched
```

完整演练、先决条件和每个主机的详细信息：[`docs/install.md`](docs/install.md)。 `opencues doctor` 诊断任何看起来有问题的情况。

     一旦可用即可真正嵌入。 -->

#

[！[](assets/opencues-cli.svg)](docs/guides/cli-reference.md#the-5-youll-actually-use)[！[](assets/features.svg)](docs/features/README.md)

# 集成

### 主机·状态·安装
- **主机**：Claude Code · **状态**：可用 · **安装**：`opencues install claude-code`
- **主机**：OpenCode · **状态**：可用 · **安装**：`opencues install opencode`
- **主机**：Gemini CLI · **状态**：测试版 · **安装**：`opencues install gemini-cli`
- **主机**：Chrome · **状态**：测试版 · **安装**：`opencues install chrome`
- **主机**：Shell · **状态**：测试版 · **安装**：`opencues install shell`
- **主机**：DeepSeek Harness · **状态**：测试版 · **安装**：`dsh plugin --profile web add @opencues/dsh`

每个都固定自己的上游分支，并且永远不会触及您的本机主机安装。
DeepSeek Harness 是个例外：它有一个真正的插件系统，所以没有
叉到销，无 OpenCues CLI 步骤 — 请参阅
[`integrations/dsh/README.md`](integrations/dsh/README.md)。

> ⚠️ **Windows**：本机不支持，在 WSL2 内运行（请参阅 [`docs/install.md`](docs/install.md)）。

#

[！[](assets/supports.svg)](#integrations)[！[](https://cdn.jsdelivr.net/gh/opencues/opencues@62dc0d205460b8610dd4825be196e01ef281dc7a/assets/Supports-09.svg)](integrations/opencode/README.md)！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Supports-10.svg)](integrations/claude-code/README.md)]！[](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/Supports-11.svg)](integrations/gemini-cli/README.md)![](https://cdn.jsdelivr.net/gh/opencues/opencues@43ac7ab68de968a183aa0340593aac926f26587a/assets/spacer.svg)[![](assets/chrome.svg)](integrations/chrome/README.md)[![](assets/shell.svg)](integrations/shell/README.md)]

# 你得到什么

### 功能·它的作用
- **功能**：**空白** · **作用**：键入 `_` 进行自由格式生成、翻译、格式化、完全重写或关键字绑定系统操作（`volume _`、`weather _`）。
- **功能**：**句子重写** · **它的作用**：无缝地将整个句子循环到不同的寄存器（正式，简洁，...），不需要 `_`。
- **功能**：**单词提示** · **它的作用**：导航到单个单词并循环使用法学硕士建议的较小替代方案。
- **功能**：**实时执行器** · **它的作用**：`volume _` 读取真实电平并留下一个可以转动的旋钮：`Ctrl+Alt+↑/↓` 或裸机 `_` 移动它，设备跟随。
- **功能**：**关闭提示** · **它的作用**：只告诉您某些内容的提示可以从其自身的音符中静音：`_` 一旦使其安静一段时间，`_` 会再次永远忘记它。 `opencues dismissals` 列出您忘记的内容并将其重新打开。
- **功能**：**会话矛盾提示**（选择加入）· **作用**：在任何具有记录的主机上标记与同一编码会话中先前做出的决定相悖的草稿。
- **功能**：**询问提示**（选择加入）· **作用**：使用助手自己的澄清提示，将模糊的句子变成具有可循环答案的内联问题。
- **功能**：**个人+环境上下文**（选择加入）· **它的作用**：`my email _` 替换您的真实地址；流畅的查找可以读取您所在的页面。
- **功能**：**热重载** · **它的作用**：每个 `.md` 配置都会在大约 2 秒内进行编辑，无需重新启动。

完整功能目录（44 个概念）：[`docs/features/README.md`](docs/features/README.md)。
一次运行很多这样的东西？ `opencues usage` 为每个致电您的 LLM 定价
主机已经制作了各种功能，因此总数不是猜测。

     真正的嵌入可用后发表评论。 -->

# 配置和 LLM 提供商

配置位于 `~/.cues/` — 一个用于运行时设置的 `OPENCUES.md`，以及每个表面的源文件夹。支持七家提供商；设置一个 env key 或 `opencues set-key` 就完成了。

完整参考：[`docs/configuration.md`](docs/configuration.md)·[`docs/guides/llm-providers.md`](docs/guides/llm-providers.md)（切换提供商/模型、免费模式、故障转移）。

#

![](assets/providers.svg)[![](assets/cerebras-systems.svg)](https://cloud.cerebras.ai)[![](assets/groq.svg)](https://groq.com)[![](assets/gemini.svg)](https://ai.google.dev)[![](assets/anthropic.svg)](https://www.anthropic.com)[![](assets/openai.svg)](https://openai.com)]

# 安全

OpenCues 没有用于 LLM 的工具处理程序或执行层