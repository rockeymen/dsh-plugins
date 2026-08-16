# dsh-客户端-ui-语音输入

用于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的作曲家 **语音控制**：作曲家工具行中的一个最小线性麦克风按钮，可将您的语音转换为文本 - 具有 **点击监视** 模式（连续、实时逐字流、随时发送）和 **按住说话 ** 语音聊天模式（释放发送，回复大声朗读）。零后端、零 API 密钥 — 识别和 TTS 通过 Web Speech API 完全在浏览器中运行。

`dsh-plugin` · TypeScript · React

## 特点

- **点击监听**：点击麦克风，说话——文本实时流入草稿（逐字输入），麦克风即使在安静状态下也能持续聆听，您可以随时发送或继续添加语音。再次点击即可停止。
- **按住通话**：按住可录制语音聊天消息，松开可发送；大声朗读助理的回复（浏览器 TTS，更喜欢自然/边缘神经语音）。
- **在沉默中连续**：每个识别段都会自动重新启动，因此监控永远不会丢失。
- **尊重作曲家**：演讲附加到草稿中（保留基础）；发送干净地清除草稿，无需重新填写旧文本；在新的识别器上发送后，监视继续进行。
- **DeepSeek-蓝色聆听状态**：聆听时图标以 DeepSeek 品牌蓝色闪烁；无边框线性图标，没有杂乱。
- **可配置**：识别语言（默认 `zh-CN`）和临时结果。

## 安装

将包添加到您的 DSH Web 组合中。如果您从 [DeepSeek Harness checkout](https://github.com/deepseek-ai/deepseek-harness) 开发，请将其安装在 Web 应用程序浏览器名册 (`packages/bundle/web-app/cordis.patch.yml`) 中：

```yaml
- id: ui-voice-input
  name: '@zhangbo-cn/dsh-client-ui-voice-input'
```

然后使用存储库的 tsdown 预设构建客户端包：

```sh
pnpm --filter @zhangbo-cn/dsh-client-ui-voice-input run bundle
```

## 用法

刷新 Web UI 后，编写器工具行会显示一个线性麦克风按钮。

### 语音输入（点击）

1. **单击**麦克风 → 图标变为 DeepSeek 蓝色并发出脉冲（收听）。
2. **说出** → 文本逐字实时出现在输入框中。
3.使用作曲家的发送按钮随时发送；继续交谈以添加更多内容。
4. **再次单击麦克风**停止监听。

### 语音聊天（按住）

1. **按住**麦克风（超过约 250 毫秒）并讲话。
2. **发布** → 您的消息已发送。
3.自动朗读助理的回复。

### 配置

```yaml
- id: ui-voice-input
  name: '@zhangbo-cn/dsh-client-ui-voice-input'
  config:
    language: 'zh-CN'      # Web Speech recognition language tag
    interimResults: true   # stream live interim transcript into the draft
```

## 它是如何工作的

```
MicButton (conversation.input.left)
  ├─ tap → beginMonitoring()
  │     → SpeechRecognition (continuous:false, interimResults)  // reliable results
  │     → onresult → TranscriptAccumulator → inputActions.setDraft(base + transcript)
  │     → onend (silence) → auto-restart (keep monitoring)      // continuous
  │     → tap again → stop
  └─ hold → submitChat()
        → on release: stop + inputActions.setDraft(text) + inputActions.submit()
        → reply → createBrowserSpeaker() → speechSynthesis (prefers natural voice)
```

- 识别从指针向下开始（用户手势 - Web Speech API 所需）；点击与按住取决于释放。
- 每个分段的 `continuous: false` 是故意的：Chrome 的 `continuous: true` 无法传递 `onresult`，因此通过自动重新启动分段来实现监控。
- 当外部草稿发生变化时，追加基础会重置，因此发送永远不会让过时的语音文本重新填充该框。

## 兼容性

### 浏览器·麦克风（输入、语音识别）·回复播放（语音合成）
- **浏览器**：Chrome / Edge (Windows) · **麦克风（输入、语音识别）**： ✅ 网络语音 · **回复播放（语音合成）**： ✅ 自然（Google / Edge 神经）声音
- **浏览器**：Safari · **麦克风（输入、语音识别）**： ✅ webkitSpeechRecognition（每个手势重新触发） · **回复播放（语音合成）**： ✅ 自然的操作系统声音
- **浏览器**：Firefox · **麦克风（输入、语音识别）**：⚠️ **不支持 - 浏览器限制**（Mozilla 尚未发布 `SpeechRecognition`；本地设备上识别仍处于早期阶段）· **回复播放（语音合成）**：⚠️ `speechSynthesis` **支持**（回复可以朗读），但语音为操作系统默认/不太自然

注意事项：
- **Firefox 麦克风输入**：这是真正的浏览器限制，而不是插件问题。该插件功能可检测并禁用麦克风，并显示“此浏览器不支持”提示。跨浏览器回退将需要 `MediaRecorder` + 外部转录服务（超出零后端插件的范围）。
- **回复播放**：`speechSynthesis` 适用于 Firefox；只是语音质量不同（它回落到操作系统默认语音而不是自然的神经语音）。
- 需要麦克风和带有 `speechSynthesis` 的浏览器才能进行回复播放。

## 测试

```sh
npx vitest run   # 19 tests: tap monitoring, hold submit, auto-restart, send-clear, chat controller
```