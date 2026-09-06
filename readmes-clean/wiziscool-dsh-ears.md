![dsh-ears](./assets/banner.jpg)

# dsh-ears

给纯文本 DeepSeek 一对耳朵。

  简体中文 ·

https://github.com/user-attachments/assets/1363768e-a393-44bd-a008-1ce2055cac41

录音时，输入框上方会显示带波形的识别条。转写或润色进行中，可点击丢弃图标取消。

## 安装

前置依赖：[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`0.1.0-rc.6` 至 `0.1.1-rc.2`）和 Node.js `^22.19.0 || >=24.0.0`。

### 通过 npm 安装

```sh
dsh plugin --profile web add dsh-ears
```

### 从源码安装

```sh
git clone https://github.com/WizisCool/dsh-ears.git
cd dsh-ears
pnpm use:platform
pnpm install
pnpm build
dsh plugin --profile web add "$PWD"
# Windows 的 cmd 请使用 "%CD%"；PowerShell 直接使用 $PWD
```

安装完成后刷新 Web UI，输入框右侧会显示麦克风图标。

## 卸载

```sh
dsh plugin --profile web remove dsh-ears
```

卸载后刷新 Web UI。

## 使用

1. 点击麦克风图标，或按下 `Ctrl+Shift+Space`（可在设置页更改）
2. 开始说话
3. 再次按下快捷键或点击麦克风，停止录音并开始转写
4. 开启润色后，原始转写会先写入草稿，润色完成后再更新，期间的手动编辑会被保留
5. 检查内容后手动发送

转写结果始终写入可编辑草稿，不会自动发送。如果所选后端尚未就绪，麦克风图标会变灰，悬停即可查看原因。

## 识别后端

### 后端 · 工作方式 · 需要什么
- **后端**: Web Speech · **工作方式**: 浏览器实时识别 · **需要什么**: Chromium 内核浏览器
- **后端**: 本地 Whisper · **工作方式**: 录音结束后由 Host 本地转写 · **需要什么**: 在设置页下载 GGML 模型
- **后端**: [Groq](https://console.groq.com) · **工作方式**: Host 调用 Groq Whisper API · **需要什么**: API key
- **后端**: [Deepgram](https://deepgram.com) · **工作方式**: [预录音频](https://developers.deepgram.com/docs/pre-recorded-audio)或[实时音频流](https://developers.deepgram.com/docs/live-streaming-audio) · **需要什么**: API key、模型名（如 `nova-3`）
- **后端**: [阿里云百炼](https://www.aliyun.com/product/bailian) · **工作方式**: DashScope 同步转写 · **需要什么**: API key、模型名；单次最长 300 秒
- **后端**: [腾讯云](https://cloud.tencent.com/document/api/1093/37823) · **工作方式**: [录音文件识别](https://cloud.tencent.com/document/api/1093/37823)或[实时语音识别](https://cloud.tencent.com/document/api/1093/48982) · **需要什么**: AppID、SecretID、SecretKey、`engine_type`
- **后端**: 自定义 OpenAI 兼容 · **工作方式**: 发送到指定 `/audio/transcriptions` 端点 · **需要什么**: 端点地址、API key、模型名

所有 API key 和凭据由 Host 保存，浏览器不接触。

## 润色

默认关闭，可在设置页开启。润色模型从 dsh 已配置的模型中选择，LLM 凭据复用 dsh 现有配置。

默认提示词会删除口头禅、修正 ASR 错字、处理自我纠正和口头列举。可在设置页自定义提示词或查看默认内容。润色失败或取消时保留原始转写。

## 本地开发

```sh
pnpm use:platform
pnpm install
dsh plugin --profile web add "$PWD"
# Windows 的 cmd 请使用 "%CD%"；PowerShell 直接使用 $PWD
pnpm check          # 类型检查
pnpm test           # 运行测试
pnpm build          # 构建
pnpm dev:config     # 构建并生成 HMR 配置
pnpm dev:web        # 启动 dsh web
```

开发时在另一个终端运行 `pnpm dev:watch`。

## 文档

- [CHANGELOG](./CHANGELOG.md)
- [CONTRIBUTING](./CONTRIBUTING.md)
- [SECURITY](./SECURITY.md)
- [LICENSE](./LICENSE)

## 友链

- [LINUX DO](https://linux.do) — 新的理想型社区