# dsh-ocr-plugin

给 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 加"眼睛"的本地 OCR 插件：
让纯文本模型**真正看到图片内容**——截图、发票、表格、扫描件、多栏文档，全部本地识别，不依赖任何云 OCR。

> 背景：DeepSeek API 当前不接收图片输入，对话里发图只能看到"这是一个图片附件"。
> 本插件在消息序列化时把图片**本地 OCR 成文本**再发给模型，图片从此可被理解。
> 快速通道秒级出结果（rapidocr），深度通道用 DeepSeek-OCR-2 做版面级解析。

## ⚠️ 平台兼容性（先看这里）

本插件在**鸿蒙 PC（HarmonyOS PC）**上开发并实测通过，针对鸿蒙做了部分适配：

- 快速通道（RapidOCR）在鸿蒙 PC 沙箱环境下正常可用；
- Python 运行库可通过 `DSH_OCR_PYTHONPATH` / `DSH_OCR_LD_LIBRARY_PATH` 指向自带依赖（如 brew 安装的 Python 3.12 与 vendored 轮子）；
- 深度通道（llama.cpp）在鸿蒙 PC 上可运行，但 CPU 推理耗时较高；若在受限沙箱（线程即进程）下遇到视觉编码异常慢的性能问题，建议在容器或常规主机上运行深度推理。

**其他系统（Linux / macOS / Windows）**：插件本体是跨平台 Node.js + Python 实现，无鸿蒙专属依赖，满足[前置要求](#前置要求)即可运行。`DSH_OCR_PYTHONPATH` / `DSH_OCR_LD_LIBRARY_PATH` 仅在需要自带 Python 运行库时设置；Windows 不需要 `LD_LIBRARY_PATH`。

## 功能

- **双通道 OCR**
  - 快速：`ocr_image.py` + [RapidOCR](https://github.com/RapidAI/RapidOCR)（onnxruntime，秒级）
  - 深度：DeepSeek-OCR-2（GGUF 量化，llama.cpp `llama-mtmd-cli` 本地推理）——消息里带 `[深度识图]` 即触发
- **版面理解**（移植自 DeepSeek-OCR-2 的版面原理）：
  - 行主序阅读顺序重排（多栏先左后右、栏内自上而下）
  - 网格对齐表格检测 → 还原为 `| 分隔` 的 Markdown 行
  - 每行文本附带左上角坐标 `文本@x,y`，供模型按语义重组
- **缓存**：快速通道内存缓存（128 条），深度通道按附件 ID 磁盘缓存（`$DSH_HOME/attachments/ocr2-cache`），同一图片只算一次
- **即插即用**：以 `ctx.provide('ocr', ...)` 挂到适配器缝上——装上即接管、停用即回退内置实现，无需改适配器代码（前提见下方"前置要求"）

## 工作原理

```
对话消息（含图片块）
   │
   ▼  llm-deepseek 适配器序列化（OCR 缝）
   ├─ 消息含 "深度识图" 且 ocrDeep 可用 ──► llama-mtmd-cli + DeepSeek-OCR-2（磁盘缓存）
   ├─ 否则 ocrImage 可用 ─────────────────► ocr_image.py + RapidOCR（秒级，内存缓存）
   └─ 无 ocr 服务 ────────────────────────► 回退 image_url 直传（原行为）

图片块 → "[图片OCR 附件 <name> ]\n<OCR文本>" 文本块 → DeepSeek API → 模型理解图片
```

## 前置要求

### 组件 · 必需 · 说明
- **组件**: DeepSeek Harness · **必需**: ✅ · **说明**: 部署含 `dsh-llm-deepseek` 适配器
- **组件**: 适配器 OCR 缝 · **必需**: ✅ · **说明**: 见 [docs/adapter-seam.md](docs/adapter-seam.md)（约 30 行本地改动）
- **组件**: Node.js ≥ 18 · **必需**: ✅ · **说明**: 运行 harness
- **组件**: Python 3.10+ · **必需**: ✅ · **说明**: 快速 OCR 通道（`pip install rapidocr_onnxruntime onnxruntime pillow numpy opencv-python`）
- **组件**: llama.cpp（`llama-mtmd-cli`） · **必需**: ⭕ 深度通道 · **说明**: 需支持 `--jinja`（llama.cpp 较新版本）；也可只装快速通道
- **组件**: DeepSeek-OCR-2 模型 · **必需**: ⭕ 深度通道 · **说明**: GGUF 约 1.6GB + mmproj 约 0.5GB

> 只想用快速通道（纯 rapidocr）也可以：跳过模型下载，不设 `DSH_OCR2_*` 即可，深度通道会自动失败并回退快速通道。

## 安装

```bash
git clone https://github.com/CraZY222123/dsh-ocr-plugin.git
cd dsh-ocr-plugin

# 1) 安装 Python 依赖（快速通道）
pip install rapidocr_onnxruntime onnxruntime pillow numpy opencv-python

# 2) 下载深度 OCR 模型（可选，默认 hf-mirror 加速；海外可 HF_BASE=https://huggingface.co）
./scripts/download-models.sh

# 3) 安装插件到 DSH（默认 profile: web；自动打 cordis.patch.yml 补丁行）
./scripts/install.sh --profile web
#    若你的部署 node_modules 在独立目录，可加 --app-root /path/to/deepseek-harness
```

装完后**重启 DSH**，发一张图片试试。移除 `cordis.patch.yml` 里的 `ocr-provider` 行即可停用。

### 手动安装（不想跑脚本）

1. 把 `package.json`、`lib/`、`tools/` 复制到 `~/.dsh/profiles/node_modules/@deepseek-ai/dsh-ocr/`（flat-fallback 解析）。
2. 在 `~/.dsh/profiles/web/cordis.patch.yml` 追加：

```yaml
- id: ocr-provider
  name: '@deepseek-ai/dsh-ocr'
```

3. 重启 DSH。

## 配置（环境变量）

### 变量 · 默认值 · 说明
- **变量**: `DSH_HOME` · **默认值**: `~/.dsh` · **说明**: harness 数据目录
- **变量**: `DSH_OCR_PYTHON` · **默认值**: `python3` · **说明**: 快速通道的 Python 解释器
- **变量**: `DSH_OCR_SCRIPT` · **默认值**: 包内 `tools/ocr_image.py` · **说明**: 快速 OCR 脚本路径
- **变量**: `DSH_OCR_PYTHONPATH` · **默认值**: 未设置 · **说明**: 透传给 Python 子进程的 `PYTHONPATH`
- **变量**: `DSH_OCR_LD_LIBRARY_PATH` · **默认值**: 未设置 · **说明**: 透传 `LD_LIBRARY_PATH`（如 vendored numpy 轮子）
- **变量**: `DSH_OCR2_BIN` · **默认值**: `llama-mtmd-cli` · **说明**: 深度通道二进制（不在 PATH 时给全路径）
- **变量**: `DSH_OCR2_MODEL` · **默认值**: `$DSH_HOME/models/ocr2/DeepSeek-OCR-2-IQ4_NL.gguf` · **说明**: 深度模型
- **变量**: `DSH_OCR2_MMPROJ` · **默认值**: `$DSH_HOME/models/ocr2/mmproj-deepseek-ocr-2-q8_0.gguf` · **说明**: 视觉投影 mmproj
- **变量**: `DSH_OCR2_CACHE` · **默认值**: `$DSH_HOME/attachments/ocr2-cache` · **说明**: 深度结果磁盘缓存目录
- **变量**: `DSH_OCR2_MAX_TOKENS` · **默认值**: `1200` · **说明**: 深度通道最大生成 token
- **变量**: `DSH_OCR2_THREADS` · **默认值**: `6` · **说明**: 深度推理线程数

## 使用（安装之后）

### 快速识别（默认通道，开箱即用）

1. 打开你自己的 DSH Web 界面，**新建一个会话**；
2. 把图片**拖进输入框**（或点附件按钮选择图片；若装了 `tools/paste-image-plugin.json`，也可以直接 Ctrl+V 粘贴截图）；
3. 正常发送消息，模型就能"看到"图片内容了——可以问"这张图里有什么"、"把表格转成 Markdown"、"提取发票上的字段"等。

发图后，模型实际看到的是图片的 OCR 文本块（会话日志/请求体中形如）：

```
[图片OCR 附件 screenshot.png a1b2c3d4e5f6a7b8]
[0.98] 【版面说明】各行末尾 @x,y 为文本框左上角坐标；文本已按阅读顺序重排…
[0.95] DeepSeek Harness @32,58
[0.93] | 会话 | 时长 | @70,461
```

### 深度识别（DeepSeek-OCR-2 通道，可选）

需要版面级解析（复杂表格、发票、扫描件、手写体）时，在消息文本里带上 **[深度识图]** 再发图即可，其余操作相同：

> 这张发票请提取所有字段 [深度识图]

深度通道会调用本地 DeepSeek-OCR-2 做完整版面解析，输出 `[深度OCR 附件 …]` 文本块，精度明显高于快速通道。

### 如何确认插件已生效

- **方法一（最直观）**：发一张带文字的截图，模型能准确复述/理解图片内容，说明 OCR 链路已接管；
- **方法二**：查看会话日志或抓包，图片块应变成 `[图片OCR 附件 …]` / `[深度OCR 附件 …]` 文本块，而不是 `image_url` 直传；
- **方法三（对照）**：把 `cordis.patch.yml` 里的 `ocr-provider` 行移除并重启 DSH，再发同一张图——模型会回到"只看到附件占位、读不出内容"的状态，即为插件在起作用。

### 使用提示

- **支持格式**：PNG / JPEG / WebP / GIF；
- **自动缓存**：同一张图片（按附件 ID）只识别一次，重复发送直接命中缓存秒回；
- **隐私**：图片字节只在本机处理，发给模型的只有 OCR 文本；只有未安装插件（无 `ocr` 服务）时才会回退把图片 base64 直传给 API；
- **注意**：识别出的文本较长时（快速通道上限 8000 字符、深度通道 16000 字符）会被截断，超大图片建议裁剪后再发。

## 常见问题

- **深度通道输出为空/极短**：DeepSeek-OCR-2 对多句 prompt 在非文档图（小图、截图）上会输出空。本插件已固定使用单句 prompt `"Extract all text from this image."`（全尺寸鲁棒）。若仍为空，检查 mmproj 是否匹配、模型文件是否损坏。
- **快速通道识别质量一般**：RapidOCR 是轻量模型，密集版面/手写体可能漏字。这是预期行为——坐标+版面说明让模型能推理修正；需要更高精度请用深度通道。
- **深度推理较慢**：深度通道耗时会高于快速通道，且与机器配置相关；可调大 `DSH_OCR2_THREADS`，有 GPU 时用 llama.cpp 的 GPU 构建可显著加速。
- **Windows**：`LD_LIBRARY_PATH` 相关配置仅 Linux/macOS 需要；onnxruntime 在 Windows 下无需此变量。
- **HarmonyOS 沙箱性能病态**：某些受限内核（线程即进程的沙箱）下 llama.cpp 视觉编码路径可能异常慢，建议在正常 Linux 容器/主机上运行深度通道。

## 许可与致谢

- 插件本体与脚本：MIT License（见 [LICENSE](LICENSE)）
- [DeepSeek-OCR-2](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2)：MIT，由 DeepSeek AI 开发
- GGUF 量化：[SandLogicTechnologies/DeepSeek-OCR-2-GGUF](https://huggingface.co/SandLogicTechnologies/DeepSeek-OCR-2-GGUF)、[sabafallah/DeepSeek-OCR-2-GGUF](https://huggingface.co/sabafallah/DeepSeek-OCR-2-GGUF)
- [RapidOCR](https://github.com/RapidAI/RapidOCR)：Apache-2.0
- [llama.cpp](https://github.com/ggml-org/llama.cpp)：MIT

## 贡献

欢迎 Issue / PR：识别质量改进、版面算法、更多平台的安装脚本、GPU 推理配置等。