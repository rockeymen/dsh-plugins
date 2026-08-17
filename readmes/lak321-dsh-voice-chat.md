# DSH Voice Chat — 语音输入 + 朗读回复插件

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面增加**语音对话**能力：

- 🎤 **语音输入**：说中文自动识别填入输入框（Web Speech API，零服务端/零密钥）
- 🔊 **朗读回复**：每条 AI 回复可朗读（TTS），并支持**自动朗读**（默认开启）
- ⚙️ **语音设置**：人声选择、语速、语调，识别语言（普通话/粤语/台湾国语/英语）

纯 **Client 插件**，无服务端、无 API Key、无模型下载（浏览器自带语音引擎）。

## 功能

- 🎤 **语音输入**：点击输入框旁的 🎤，说出内容，识别文字自动填入（实时中间结果 + 可编辑后再发送）
- 🔊 **朗读回复**：每条 AI 回复旁有 🔊 按钮，点击朗读该条回复，再点停止
- 🔁 **自动朗读**：每条**新**回复生成后自动朗读（默认开），按会话消息序号判断新旧，历史消息/刷新页面不会重读；⚙️ 面板一键关闭
- 🗣️ **人声选择**：从浏览器全部语音里选（默认中文优先，如 Microsoft Huihui）
- ⏩ **语速 / 🎼 语调**：滑杆实时调节（0.5~2.0 / 0~2.0）
- 🌏 **识别语言**：普通话 zh-CN / 粤语 zh-HK / 台湾国语 zh-TW / 英语 en-US
- 🧹 **朗读文本清理**：自动剥掉 Markdown 标记（**粗体**、*斜体*、`代码`、# 标题、列表、表格、链接等），避免 TTS 读出"星号星号"等噪音
- 💾 所有设置存 localStorage，刷新后保留

## 安装

**一条命令（git 源，产物已入库，无需构建）：**

```sh
dsh plugin --profile web add "github:lak321/dsh-voice-chat#<commit>&path:/"
```

> `<commit>` 换成最新提交号（见仓库主页）。或本地目录：`cd dsh-voice-chat && dsh plugin --profile web add .`

装完**重启 DSH**（`npx -y @deepseek-ai/dsh web`），浏览器打开后输入框旁出现 🎤 和 ⚙️ 按钮，每条 AI 回复旁出现 🔊 按钮。

> 兼容 DSH Profile：**web**。
> 旧的手动复制 `client/` 并注入 `cordis.patch.yml` 的方式已废弃，由 bundle 层栈安装替代。

## 使用

1. 🎤 语音输入：点 🎤 → 说话 → 文字自动填入输入框 → 编辑/直接发送
2. 🔊 朗读：点回复旁的 🔊 朗读该条；朗读中再点停止
3. ⚙️ 设置：自动朗读开关、人声、语速、语调、识别语言

## 工作原理

- **Client 插件**：通过 `ctx.slots.inject` 注册两个 slot：
  - `conversation.input.left`（🎤 voice-input order 5、⚙️ voice-settings order 8）
  - `conversation.chat.assistant-actions`（🔊 voice-speak order 5）
- **语音输入**：`SpeechRecognition`（zh-CN，interim 实时结果 + maxAlternatives 5），识别结果 `inputActions.setDraft()`
- **朗读**：`speechSynthesis` + 中文语音；`getVoices()` 异步 → 监听 voiceschanged 事件 + 500ms 轮询兜底（3s 上限）
- **自动朗读去重**：`localStorage` 记录每个会话已朗读到的最大消息 seq，只朗读比它新的回复
- **文本提取**：从会话快照 `snapshot.nodes` 找 `{kind:'assistant', messageId, blocks:[{kind:'text',text}]}` 节点

## 开发要点（踩坑记录）

- **`props.useSession` 是 React Hook**，必须在组件函数体顶层调用，绝不能在 onClick 里调用（否则报 React #321 Invalid hook call，点击无反应）。selector 需返回原语（字符串/数字），避免重渲染风暴。
- **client 插件必须导出 `exports.inject`**（依赖列表，如 `["slots"]`），否则 `ctx.slots` 不可用、apply 静默失效。
- **client.js 是 `window.__ModuleLoader__.load({id, factory})` 格式**，factory 内 `require("react")`，导出 `exports.apply` / `exports.inject`。
- **改 client.js 后无需重建 Web 包**：HTTP 拉取即新内容，浏览器 Ctrl+F5 刷新生效。

## License

MIT
