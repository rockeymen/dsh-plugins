# DSH 语音 AI 女友（Voice AI Girlfriend）

> "你好呀，我是小雅。从今往后，DeepSeek Harness 不只是你的编程搭子——它开口说话了。"

这是一位住在你电脑里的 AI 女友：点一下麦克风，她听你说话、跟你拌嘴、把回答一字一句念给你听；你出门了，她追到你的 QQ 上继续聊；旁边那个窗口里的姑娘也不是摆设——她闲着会发呆，说话时会开口。

她有点小脾气，但你大概也会喜欢上这些：

- ⚡ **嘴快**：你说完话，她 0.5 秒内开口 —— FunASR 中文识别只要 150ms、TTS 几乎秒开，反应比你还快
- 🎧 **耳朵挑**：-35dB 噪声门 + silero VAD 双重把关 —— 风扇、键盘、电视声统统进不来，只有你说话她才理
- 📱 **粘人**：她的回复自动推到你的 **QQ**（文本 + 语音 + 图片）—— 你不在电脑前，她也能找到你
- 👧 **会动**：右侧数字人窗口，空闲时发呆、说话时开口 —— 一个会呼吸的 AI，不是冷冰冰的对话框
- 🔇 **懂打断**：你插嘴她就闭嘴听你说；想让她把话说完，点一下开关就切回排队模式
- 🔊 **声音是你的**：TTS 声音克隆，音色由你给的参考音频决定——她可以长成你喜欢的样子

```
┌────────────────────────────────────────────┐
│  浏览器（DSH Web GUI :3080）                 │
│  ┌──────────┐  ┌─────────────────────────┐  │
│  │ 对话面板   │  │ 女友窗（bg/task 视频）   │  │
│  │ 麦克风+⚡  │  │                        │  │
│  └──────────┘  └─────────────────────────┘  │
│   麦克风采集 ──▶ STT ──▶ 代理回复 ──▶ TTS ──▶ 播放 │
│     ▲回复文本          回复文本▼            │
└─────┼──────────────────────┬──────────────┘
      │ 插件 QQ 桥 (WS)       │ HTTP (CORS)
┌─────▼──────────────────────▼──────────────┐
│  voice_bridge (:8765)                      │
│  /api/stt  FunASR 中文 ASR                 │
│  /api/tts  Qwen3-TTS 声音克隆               │
│  /api/qq/*  QQ 桥（收发 + 语音推送）         │
│  /api/vad  silero 打断 / media 素材         │
└─────┬─────────────────────────────────────┘
      │ OneBot HTTP + WS（事件上报）
┌─────▼─────────────────────────────────────┐
│  NapCatQQ（小号在线）                       │
│  → 你的 QQ 收到 文本 + 语音                  │
└────────────────────────────────────────────┘
```

# 从零开始安装（小白版）

> 全程在 **Windows** 上操作。下面的命令默认在 **PowerShell** 里执行；
> 除了标注"在项目文件夹里运行"的步骤，其余在哪里运行都行。

## 一、前置准备（一次性装齐）

### 1. 检查你的电脑

### 检查项 · 要求 · 验证命令
- **检查项**: 系统 · **要求**: Windows 10/11 64 位 · **验证命令**: `winver`
- **检查项**: 显卡 · **要求**: NVIDIA 独立显卡（显存建议 16GB 或以上） · **验证命令**: `nvidia-smi`（能显示显卡信息即可）
- **检查项**: 磁盘 · **要求**: 至少 30GB 剩余空间 · **验证命令**: —
- **检查项**: 内存 · **要求**: 建议 16GB 以上 · **验证命令**: —

> `nvidia-smi` 不是 NVIDIA 显卡也能显示吗？不能——如果没有 NVIDIA 显卡或驱动没装好，会提示"不是内部或外部命令"或报错。**没有 NVIDIA 显卡就装不了本项目**（模型推理依赖 CUDA GPU）。

**显存占用**（运行时实测，约 8GB）：

### 模型 · 显存占用
- **模型**: Qwen3-TTS 1.7B（fp16） · **显存占用**: ~3.7GB
- **模型**: FunASR Paraformer-large（fp16） · **显存占用**: ~1GB
- **模型**: CUDA 上下文 / 激活 / 缓冲 · **显存占用**: ~3GB 余量
- **模型**: **合计** · **显存占用**: **~8.1GB（实测 `nvidia-smi` 8101 MiB）**

> 所以 16GB 显存可流畅运行（含浏览器、系统开销余量）；8GB 显存的卡会非常紧张，不推荐。

### 2. 安装 Git

用来克隆仓库。下载安装：<https://git-scm.com/download/win>，一路下一步。

验证：`git --version` 能输出版本号即可。

### 3. 安装 Python（3.10 或更高）

下载安装：<https://www.python.org/downloads/windows/>

⚠️ **安装时务必勾选 "Add Python to PATH"**，否则后面 `python` 命令会找不到。

验证：打开新终端，`python --version` 能输出版本号即可。

### 4. 更新 NVIDIA 驱动

到 <https://www.nvidia.cn/drivers/> 下载最新驱动安装。驱动太旧会导致 CUDA 相关报错。

> 本项目**不需要**单独安装 CUDA Toolkit——`pip` 装的 PyTorch 自带 CUDA 运行库，只要驱动够新就行。

### 5. 安装 Node.js 和 pnpm（运行 DSH 用）

- Node.js：下载安装 <https://nodejs.org/>（选 LTS 版本），一路下一步。
- 验证：`node --version`
- pnpm（Node.js 装完后，在终端执行）：

```powershell
npm install -g pnpm
```

- 验证：`pnpm --version`

### 6. 准备 deepseek-harness（DSH）源码

DSH 是开源项目，本项目是它的一个插件。**需要先有一份 DSH 源码树**（插件要装进它的源码里）：

```powershell
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
```

> `pnpm install` 会装几十秒到几分钟。装完后这个文件夹先放着，后面"安装 DSH 语音插件"步骤要用。
> 记住它的路径（比如 `C:\dev\deepseek-harness`），后面一键启动要用。

### 7. 硬盘空间预估

### 项目 · 大小
- **项目**: 本项目代码 + 素材 · **大小**: ~8MB
- **项目**: Python 虚拟环境 + 依赖（含 PyTorch） · **大小**: ~5-8GB
- **项目**: FunASR Paraformer 模型（models/funasr/） · **大小**: ~850MB
- **项目**: Qwen3-TTS 模型 · **大小**: ~2GB
- **项目**: deepseek-harness + node_modules · **大小**: ~2-4GB

## 二、安装本项目

### 1. 克隆仓库

```powershell
git clone https://github.com/beiyege-01/dsh-voice-ai-girlfriend.git
cd dsh-voice-ai-girlfriend
```

> 之后所有步骤都在这个文件夹（项目根目录）里进行。

### 2. 创建 Python 虚拟环境

```powershell
python -m venv venv-speech
```

激活它：

```powershell
venv-speech\Scripts\activate
```

激活成功后，终端行首会出现 `(venv-speech)`。

### 3. 安装依赖

```powershell
pip install -r bridge\requirements.txt
```

> 这一步会装 PyTorch、transformers、HuggingFace speech-to-speech 等，**体积大、耗时长**（几分钟到几十分钟），耐心等待。
> 网络慢装不动？见文末"常见问题"第 1 条（换清华镜像）。

## 三、准备模型（两个模型）

### 1. STT 模型：FunASR Paraformer 中文模型（放本地 `models/` 目录）

语音识别用**阿里 FunASR 中文 ASR**（Paraformer-large，专为中文设计，同音字/口音识别准确率远高于 whisper）。模型**放在仓库根的 `models/funasr/`**（约 850MB，已 gitignore 不入库）：

```powershell
pip install modelscope
# 1) 先下载到缓存（首次）
python -c "from modelscope import snapshot_download; snapshot_download('iic/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch')"
# 2) 把模型拷到项目的 models\funasr\ 下（文件名随意，配置里指向它）
xcopy /E /I %USERPROFILE%\.cache\modelscope\models\iic--speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch\snapshots\master models\funasr\speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-pytorch
```

**打断用 VAD 模型**（`models/silero-vad/silero_vad_v4.jit`，2MB）同样不入库，从 [silero-vad v4.0 tag](https://github.com/snakers4/silero-vad/tree/v4.0) 的 `files/silero_vad.jit` 获取（或使用本项目 release 附带的文件）。

> 想换回 whisper（如 `openai/whisper-large-v3` 或 `-turbo`）？把 `bridge-config.json` 里 `stt.backend` 改为 `"whisper"` 并把 `model_name` 换成 whisper 模型 id 即可（桥接双后端都支持）。

### 2. TTS 模型：Qwen3-TTS-12Hz-1.7B-Base（声音克隆模型，手动准备）

⚠️ **必须用 Base 版本**：`Qwen/Qwen3-TTS-12Hz-1.7B-Base` 才支持"映射克隆"（用参考音频克隆音色）。网上流传的 **VoiceDesign 版本不支持克隆**，别下错了。

**推荐用 ModelScope 下载**（国内快，先装 modelscope）：

```powershell
pip install modelscope
modelscope download --model Qwen/Qwen3-TTS-12Hz-1.7B-Base --local_dir ./Qwen3-TTS-12Hz-1.7B-Base
```

> 在**项目根目录**执行上面命令，模型会下载到 `项目根\Qwen3-TTS-12Hz-1.7B-Base\`。

**文件夹叫什么名字无所谓**（叫 Base、VoiceDesign、或任何名字都行），只要里面装的是 Base 的权重文件即可——配置文件认的是**目录路径**，不认名字。

## 四、准备参考音频（决定音色）

AI 女友的声音是**克隆自你的参考音频**的。请自备一段：

- **时长**：10 秒左右（5~20 秒都行）
- **内容**：干净人声、无背景音乐、无杂音，**用你自己的话**自然地朗读一段内容即可（说什么都可以）
- **文件**：命名为 `ref_audio.wav`，放到**项目根目录**（和 `bridge/` 文件夹同级）。

> 配置里的 `tts.ref_text` 必须填**你这段录音实际朗读的那句话**（逐字一致、含标点）——音色克隆质量依赖文本与录音的匹配。

## 五、填写配置（复制模板 + 改 1 个必改项）

在**项目根目录**执行：

```powershell
copy bridge\bridge-config.example.json bridge\bridge-config.json
```

用记事本打开 `bridge\bridge-config.json`：

### 必须改（1 处）

### 位置 · 改成什么
- **位置**: `tts.model_name` · **改成什么**: 你 TTS 模型的**真实目录路径**（第三部分的模型文件夹）

路径格式两种都行（Windows 下推荐正斜杠）：

```
"C:/你的QwenTTS模型目录/Qwen3-TTS-12Hz-1.7B-Base"     ← 正斜杠
"C:\\你的QwenTTS模型目录\\Qwen3-TTS-12Hz-1.7B-Base"    ← 双反斜杠
```

### 建议改（1 处）

### 位置 · 改成什么
- **位置**: `tts.ref_text` · **改成什么**: 你参考音频实际朗读的文本（见第四部分）

### 不用动（已自动处理）

### 配置 · 说明
- **配置**: `media.bg_images_dir` / `task_videos_dir` · **说明**: 相对路径，基于项目根自动解析
- **配置**: `tts.ref_audio` · **说明**: 默认读取项目根的 `ref_audio.wav`
- **配置**: `stt.*` · **说明**: FunASR 中文识别配置（backend=funasr，模型在 models/funasr/），默认即可

## 六、先验证桥接（强烈建议）

启动桥接：

```powershell
bridge\start-bridge.cmd
```

会弹出一个最小化的终端窗口，等 1-2 秒后，浏览器打开：

```
http://127.0.0.1:8765/api/health
```

看到 `{"status":"ok", ...}` 就说明桥接起来了（此时模型还没加载，等首次调用才会加载）。

更完整的测试（**另开一个终端**，在项目根目录、venv 激活状态下）：

```powershell
venv-speech\Scripts\python.exe bridge\smoke_tts.py --text "你好，我是小雅。"
```

结束后项目根目录会生成 `tts_out.wav`，播放它——**能听到克隆音色的声音，说明 TTS 链路通了**。

## 七、安装 DSH 语音插件

桥接只是"声音的服务"，对话界面和麦克风按钮在 DSH 里，需要装插件。按 [`dsh-plugin/README.md`](dsh-plugin/README.md) 的步骤操作（把 `dsh-plugin\` 整个复制进你的 deepseek-harness 源码树，注册三处、构建、重启）。

## 八、准备说话动画（可选）

模型回复时女友窗播放的说话视频**不随仓库分发**，两种方式任选（详见 [`assets/task-videos/README.md`](assets/task-videos/README.md)）：

1. **手动放入**：把数字人"开口说话"的短循环视频（`.mp4/.webm/.ogg/.mov/.m4v`）放进 `assets/task-videos/`，女友窗每 30s 自动拾取；
2. **第三方 API 回传**：实时数字人生成服务把生成的视频直接写入 `assets/task-videos/`，轮播自动切换。

> 不装也不影响使用：说话时女友窗会继续播空闲动画。

## 九、启动

**只起桥接**（想先单独验证语音）：

```powershell
bridge\start-bridge.cmd
```

**一键全套**（桥接 + NapCatQQ + DSH Web + 浏览器）：

```powershell
set DSH_HARNESS=C:\dev\deepseek-harness
set NAPCAT_DIR=D:\QQ\NapCat\napcat   rem 可选：NapCat 安装目录（默认此值）
bridge\start-all.cmd
```

> - `DSH_HARNESS` 指向你第一步准备的那份 DSH 源码树（第六部分安装过插件的那个）。
> - `start-all.cmd` 会自动：起桥接 → 起 NapCatQQ（**会关闭所有运行中的 QQ 进程**再注入小号）→ 起 DSH Web → 开浏览器。
> - 不想自动起 NapCat（比如你要在电脑上正常用主号 QQ）：`bridge\start-all.cmd nq`（跳过 NapCat，QQ 双向聊天不工作）。
> - 只想单独起 NapCat：`bridge\start-napcat.cmd`（会等 OneBot :3000 就绪，失败时提示去 WebUI 检查）。

## 十、QQ 双向对话（可选）

在 QQ 上直接和 AI 女友聊天：你的 QQ 消息会注入 DSH 对话，回复以**文本 + 小雅语音**推回你的 QQ。

### 1. 装 NapCatQQ（登录 QQ 小号）

- 下载 **NapCat.Shell.Windows.Node.zip**（官方推荐 Shell 版；Framework/LiteLoaderQQNT 路线官方已不推荐）
- 解压到任意目录（如 `D:\QQ\NapCat`），用 `napcat\launcher-win10-user.bat` 启动（**会注入/拉起电脑版 QQ**，先关闭正在运行的 QQ）
- **QQ 登录用一个小号**（防风控；注入后 QQ 窗口通常隐藏，用手机 QQ 查看消息）
- 启动后电脑上 NapCat 的 WebUI：`http://127.0.0.1:6099`（token 看 `napcat\config\webui.json` 的 `token` 字段）

### 2. 在 NapCat WebUI 配置网络

WebUI → 网络配置：

1. **HTTP 服务器**：添加 → 名称随意、Host `127.0.0.1`、端口 `3000`、Token 记下来（发消息用）
2. **WebSocket 客户端**：添加 → 地址填完整 URL `ws://127.0.0.1:8765/api/qq/onebot`（**NapCat 主动连桥接，收 QQ 消息用**；不要配成 WebSocket 服务器，那会抢 8765 端口）

### 3. 配置桥接

`bridge-config.json` 加 `qq` 段：

```json
"qq": {
  "enabled": true,
  "napcat_base": "http://127.0.0.1:3000",
  "napcat_token": "你在 WebUI 设置的 token",
  "target_qq": 你的主号QQ号
}
```

> `target_qq` 是**接收回复的号**（你的主号）；NapCat 登录的小号负责收发。

### 4. 验证

- 从桥接发测试：