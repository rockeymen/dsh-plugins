#dsh-video-lens

**DeepSeek Harness 的视频理解 — 为纯文本代理提供视频上的眼睛和耳朵。**

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) 插件，可让纯文本 LLM 代理理解本地视频文件。它提供了两个工具：

### 工具·它的作用
- **工具**：`video_probe` · **它的作用**：通过 `ffprobe` 提供廉价、即时的元数据：容器、持续时间、分辨率、fps、编解码器、音轨、字幕。
- **工具**：`video_analyze` · **它的作用**：内容理解：**场景变化感知帧采样**（`ffmpeg scdet`），**可选的 ASR 转录**（带时间戳的语音），与任何 OpenAI 兼容的视觉模型融合为结构化证据 JSON。
- **工具**：`video_ask` · **它的作用**：**时间锚定问答**：解析明确的时间参考（“在3:20”，“第2分钟”）或通过转录关键字匹配定位相关语音，从匹配的窗口中重新采样帧，并用有根据的证据进行回答（答案+置信度+支持时间戳）。

> v0.3.1。该插件永远不会将您锁定到提供者：vision 和 ASR 都是通过 `baseUrl` + `model` + key env var 配置的 OpenAI 兼容端点。

## 它是如何工作的

```
video file ──► video_probe ──► ffprobe ──► compact metadata JSON
           └─► video_analyze ──► scdet scene detection ──► shot boundaries
                                 ├─► ffmpeg frame sampling (one representative frame per shot, capped)
                                 ├─► ffmpeg audio extract ──► ASR transcript (timestamped)   [optional]
                                 └─► OpenAI-compatible vision API ──► evidence JSON
```

- 使用 ffmpeg 的 `scdet` 过滤器检测场景变化（ffmpeg ≥ 6.0）。没有可检测到的剪切的视频会退回到均匀的中点采样。
- ASR **严格附加**：如果未设置 `asrApiKeyEnv` 或提供程序失败，视觉分析仍会完成，并且 `transcript` 为 `null`。
- 所有媒体工作均委托给 `PATH` 上的 `ffmpeg`/`ffprobe` — 代理中没有本机解码。

## 安装

先决条件：Node.js ≥ 20，`ffmpeg` ≥ 6.0（推荐），且 PATH 上有 `ffprobe`（`brew install ffmpeg` / `apt install ffmpeg`）。

### 选项 A — npm（推荐）

```bash
# in your DSH profile directory (the one containing package.json)
pnpm add dsh-video-lens
```

### 选项 B — 来自源头（开发）

克隆存储库，然后通过本地链接将其安装到您的 DSH 配置文件中：

```bash
git clone https://github.com/dundunhan/dsh-video-lens.git
```

无论哪种方式，请在您的配置文件的 `package.json` 中注册该捆绑包 - **这个确切的块是完整的配置文件配置**：

```json
{
  "dependencies": {
    "dsh-video-lens": "^0.3"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-video-lens"
      ]
    }
  }
}
```

然后导出密钥并重新启动配置文件：

```bash
export VIDEO_LENS_API_KEY=sk-...        # vision
export VIDEO_LENS_ASR_KEY=sk-...        # optional, ASR
```

## 配置

所有选项均为 DSH 配置值：

### 键·默认·含义
- **按键**：`visionBaseUrl` · **默认**：`https://api.siliconflow.cn/v1` · **含义**：视觉端点（OpenAI 兼容）
- **按键**：`visionModel` · **默认**：`Qwen/Qwen3-VL-8B-Instruct` · **含义**：视觉型号名称
- **密钥**：`visionApiKeyEnv` · **默认**：`VIDEO_LENS_API_KEY` · **含义**：持有视觉密钥的环境变量
- **按键**：`asrBaseUrl` · **默认**：`https://api.siliconflow.cn/v1` · **含义**：ASR 端点（OpenAI 兼容 `/audio/transcriptions`）
- **按键**：`asrModel` · **默认**：`FunAudioLLM/SenseVoiceSmall` · **含义**：ASR 型号名称
- **密钥**：`asrApiKeyEnv` · **默认**：`VIDEO_LENS_ASR_KEY` · **含义**：保存 ASR 密钥的环境变量
- **关键**：`maxFrames` · **默认**：`12` · **含义**：框架预算上限（1–最大）；实际计数是根据持续时间自适应的（每 30 秒约 1 帧，短视频更密集）
- **按键**：`frameMaxWidth` · **默认**：`768` · **含义**：最大帧宽度；保持较小的有效负载
- **按键**：`frameQuality` · **默认**：`4` · **含义**：JPEG 质量 (ffmpeg `-q:v`)
- **按键**：`sceneThreshold` · **默认**：`10` · **含义**：`scdet` 阈值（0–100）；更高=更少的削减
- **键**：`askPaddingSec` · **默认**：`2` · **含义**：匹配转录片段周围的 `video_ask` 窗口填充
- **按键**：`vlmMaxTokens` · **默认**：`1500` · **含义**：视觉模型最大输出令牌
- **按键**：`vlmTimeoutMs` · **默认**：`90000` · **含义**：视觉调用超时
- **按键**：`asrTimeoutMs` · **默认**：`120000` · **含义**：ASR 调用超时

## 用法

询问代理：

>“/tmp/demo.mp4 中有什么？”

座席首先呼叫 `video_probe`，然后呼叫 `video_analyze`。证据包括：

```json
{
  "metadata": { "container": "mov,mp4,m4a,3gp,3g2,mj2", "durationSec": 268.4, "...": "..." },
  "shots": [{ "timeSec": 12.3, "score": 45.2 }],
  "framesSampled": [{ "timestampSec": 5.5, "jpegBytes": 12345 }],
  "transcript": {
    "text": "…",
    "segments": [{ "start": 0.0, "end": 2.4, "text": "…" }],
    "language": "zh"
  },
  "visionModel": "Qwen/Qwen3-VL-8B-Instruct",
  "analysis": { "overall_summary": "…", "timeline": [{"timestamp_sec": 5.5, "description": "…"}], "on_screen_text": "…", "visual_style": "…", "notable_moments": "…" }
}
```

## 权限和安全

> 使用或重新分发之前请阅读本文。 DSH 插件在**主机进程中作为可信代码**运行，并且**没有官方插件审查** - 作者进行自我审查。请参阅[SECURITY.md](SECURITY.md)。

**这个插件的作用**

- **读取**：代理传递给其工具的任何本地文件路径（通过 `ffprobe`/`ffmpeg`）。
- **执行**：来自 `PATH` 的 `ffprobe` 和 `ffmpeg`（不是 shell - 仅 argv 数组）。
- **网络**：每个 `video_analyze` 向配置的 `visionBaseUrl`（帧 + 视觉键）发出一通出站呼叫，也可以选择向 `asrBaseUrl`（音频 + ASR 键）发出一通呼叫。
- **不**：执行 shell、评估代码、回拨、自动更新或自行读取文件。

**操作员责任**

- 密钥的安全性取决于它们发送到的端点 - 仅配置您信任的端点。
- 真正的访问边界是DSH主机沙箱；插件的可读性检查是用户体验防护，而不是安全边界。
- 有效负载大小有限：每次分析调用 `maxFrames` × ~100–300 KB (768px JPEG)。

## 兼容性

- 使用 DSH 配置文件包 `@deepseek-ai/dsh-base` + `@deepseek-ai/dsh-web-app` 进行测试。
- 节点≥20（使用`AbortSignal.any`/内置`fetch`/`FormData`）。
- `scdet` 的 ffmpeg ≥ 6.0；旧版本降级为统一采样。
- macOS / Linux 已测试； Windows 未经测试。

## 卸载

1. 在您的个人资料 `package.json` 中将 `dsh-video-lens` 从 `dsh.profile.bundles` 中删除。
2. 删除依赖项：`pnpm remove dsh-video-lens` (npm install) — 或者如果您从源安装，则删除 `link:` 条目 — 然后重新安装配置文件。

## 路线图

- v1.0：通过文件哈希进行帧缓存，README 中的评估表（5 个视频类型×指标），发布到 npm（正在进行中）。
- 超越：当配置的 VLM 支持时，本机视频输入模型作为可选的快速路径。