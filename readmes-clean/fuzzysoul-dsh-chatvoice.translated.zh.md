# ChatVoice 🎤🔊 — dsh-chatvoice

> 给 DeepSeek Harness (dsh) 装上「免费、免 API key、开箱即用」的**语音输入 + AI 回复朗读**闭环。
> 全程浏览器原生 Web Speech API —— 零配置、零成本、无任何后端与注册。

  ![语音输入](docs/demo-input.gif)
  <sub>🎤 语音输入：确认句逐句实时入框，中间结果进气泡</sub>

  ![回复朗读](docs/demo-speak.gif)
  <sub>🔊 回复朗读：点小喇叭一键朗读，可随时打断</sub>

  ![边听边改](docs/demo-edit.gif)
  <sub>✏️ 边听边改：聆听中打字修改/全删，语音只追加不回写</sub>

**ChatVoice = Chat + Voice**：一个插件解决「嘴」和「耳朵」——写代码时手不离键盘，用嘴问 AI；懒得看长回复，让 AI 读给你听（听力型学习 / 无障碍 / 摸鱼躺用场景全覆盖）。

## 功能

### # · 功能 · 说明
- **#**: 1 · **功能**: 🎤 语音输入 · **说明**: 输入框旁麦克风按钮：点一下开始说话，**识别结果逐句实时进输入框**（中间结果实时显示在上方气泡）；**聆听中随时可打字改错字、删字**——语音继续实时追加，删掉的内容停止后也不会回填
- **#**: 2 · **功能**: 🔊 回复朗读 · **说明**: 每条助手回复旁小喇叭，一键朗读该条；点击变「停止」随时打断
- **#**: 3 · **功能**: 🔁 自动朗读 · **说明**: 设置页开启后，新回复完成自动朗读（可随时打断）
- **#**: 4 · **功能**: ⚙️ 设置页 · **说明**: dsh 设置 → ChatVoice：识别语言 / 自动朗读 / 音色 / 语速，**保存即生效，无需重启**
- **#**: 5 · **功能**: 🛡 错误提示 · **说明**: 麦克风权限被拒 / 浏览器不支持 / 非安全上下文 / 识别网络失败，全部有可读 toast，绝不静默失败
- **#**: 6 · **功能**: 🇨🇳 中文优先 · **说明**: zh-CN 识别 + 自动选择 Edge 内置 Xiaoxiao Online (Natural) 免费中文自然音色

## 为什么推荐 Edge

### 能力 · Chrome · Edge · 说明
- **能力**: 语音识别 · **Chrome**: ✅（识别走 Google 服务器） · **Edge**: ✅（**识别走 Azure，国内更稳**） · **说明**: 国内网络下 Chrome 可能报 network 错误
- **能力**: 朗读音色 · **Chrome**: 部分在线音色 · **Edge**: ✅ **Xiaoxiao Online (Natural)** 免费中文最自然 · **说明**: 在线音色需联网
- **能力**: 麦克风（安全上下文） · **Chrome**: 仅 localhost/HTTPS · **Edge**: 同左 · **说明**: dsh web 默认 http://127.0.0.1:3080 ✅；LAN IP 访问麦克风不可用（朗读不受影响）

## 安装

```bash
dsh plugin --profile web add dsh-chatvoice
# 或手动: pnpm add dsh-chatvoice（dsh.profile.bundles 会自动 reconcile）
```

重启 dsh web（dsh web），打开 http://127.0.0.1:3080 即可。

> ⚠️ 必须用 127.0.0.1 访问：语音识别需要安全上下文（HTTPS 或 localhost），LAN IP 直连时麦克风会被浏览器禁用（自动禁用输入功能并提示，朗读仍可用）。

## 使用

1. **语音输入**：点输入框工具条上的 🎤 → 浏览器弹麦克风授权（允许）→ 说话（确认句逐句实时进输入框、中间结果实时显示在上方气泡）→ 再点 🎤 停止 → 回车发送；识别中**随时可以打字改错字甚至全删**——语音只往框尾追加、绝不回写，你删掉的内容停止后也不会复活
2. **朗读**：点助手回复旁 🔊 → 开始朗读（按钮变红色 ⏹）→ 再点停止
3. **自动朗读**：设置 → ChatVoice → 勾选「自动朗读新回复」→ 保存，立即生效

## 设置项

### 设置 · 默认 · 说明
- **设置**: 识别语言 · **默认**: zh-CN · **说明**: zh-CN / en-US
- **设置**: 自动朗读 · **默认**: 关 · **说明**: 新回复完成后自动朗读（建议默认关，别太吵）
- **设置**: 音色 · **默认**: 空 = 自动 · **说明**: 自动选最佳中文音色（Xiaoxiao Online (Natural)）；可填任意浏览器音色名
- **设置**: 语速 · **默认**: 1.0 · **说明**: 0.5（慢）～ 2（快）

## 工作原理

- **host**（dsh/index.js）：Config schema + GET/POST /dsh-chatvoice/config 路由，配置持久化到 ~/.dsh/chatvoice.json
- **client**（client/client.js）：MutationObserver 注入麦克风按钮（输入框工具条）与小喇叭（助手回复行）；SpeechRecognition 语音输入；speechSynthesis 朗读
- 全部能力来自浏览器，插件**没有网络请求、没有子进程、没有 API key**

## 已知限制

- Chrome 的语音识别走 Google 服务器，国内网络可能报 network 错误 → 换 Edge（走 Azure）
- Edge 在线音色需要联网；离线时回退到系统本地音色
- Firefox / Safari 不支持 SpeechRecognition（按钮自动置灰提示，朗读仍可用）
- 语音识别准确性取决于浏览器与系统麦克风，与插件无关

## Roadmap（Phase 2）

- 🎙 按住说话（Space 按住识别、松开发送，对标微信语音）
- 🔊 edge-tts 高音质音色（XiaoxiaoNeural，Node 端生成 + 附件路由播放）
- 🗣 语音指令（「保存」「继续」「停止」等口令触发操作）
- 📼 语音备忘：录音转文字存为会话草稿
- 🧩 agent 可调用朗读工具（host 注册 read_aloud，模型可在回答时主动朗读）

## English quick start

**ChatVoice** gives DeepSeek Harness free, keyless voice: speak your prompts (browser SpeechRecognition) and have AI replies read aloud (speechSynthesis). Zero config, zero cost, zero backend — recommend **Edge** for the most stable Chinese recognition (Azure) and the most natural free Chinese voice (Xiaoxiao Online Natural).

```bash
dsh plugin --profile web add dsh-chatvoice
```

Then open http://127.0.0.1:3080, click the 🎤 in the composer toolbar, allow mic permission, and speak. Click 🔊 on any assistant reply to hear it. Configure language / auto-read / voice / rate under Settings → ChatVoice.