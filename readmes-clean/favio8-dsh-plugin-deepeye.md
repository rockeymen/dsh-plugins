# DeepEye Vision for DSH

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 提供视觉能力的原生 Cordis 插件。

让纯文本模型获得"眼睛"：图片描述、OCR 文字提取、视觉问答、UI 布局分析、剪贴板截图分析，以及**粘贴图片自动翻译**（在纯文本模型会话里直接粘贴图片也能发）。

## 特性

- **原生集成** — 直接注册到 `ctx.tools`，无 MCP 中间层开销
- **多后端** — 支持 OpenAI (GPT-4o)、Google Gemini、自定义 OpenAI-compatible 端点
- **智能预处理** — 自动缩放过大图片、转换 JPEG 以节省 token
- **结果缓存** — LRU 缓存减少重复 API 调用
- **System Prompt** — 自动注入提示段落，让模型知道何时使用视觉能力
- **粘贴图片兼容** — 纯文本模型（如 DeepSeek）会话中直接粘贴图片，自动翻译成文字后交给模型（见下文 pasteCompat）

## 安装

本插件是一个标准 dsh **bundle**（声明了 `dsh.bundle.patch`），通过 dsh 的 profile 插件机制安装：

```bash
# 发布后（npm 安装）
dsh plugin --profile web add dsh-plugin-deepeye

# 本地开发时（从插件源码目录的上一级执行）
dsh plugin --profile web add ./dsh-plugin-deepeye
```

安装时 dsh 会：
1. 首次使用自动初始化 profile（含 `@deepseek-ai/dsh-base`）
2. 用 pnpm 把本包链接进 profile 目录
3. 因本包声明了 `dsh.bundle`，自动追加到 `dsh.profile.bundles` 层叠

验证与启动：

```bash
dsh --profile web --dump-config   # 确认出现 dsh-plugin-deepeye 层
dsh web                           # web 是 --profile web 的别名
```

## 配置

### API Key 解析优先级

插件支持多层 API Key 解析，用户可以选择最方便的方式：

1. **cordis.yml 显式配置** — `config.apiKey: !!js process.env.XXX`
2. **自动环境变量回退** — 根据 `provider` 自动匹配对应环境变量
3. **通用变量** — `DEEPEYE_API_KEY`（适用于所有 provider）

| provider | 自动回退的环境变量 |
|---|---|
| `openai` | `OPENAI_API_KEY` |
| `gemini` | `GEMINI_API_KEY` |
| `custom` | `DEEPEYE_API_KEY` |

**最简配置**：只需设置环境变量，无需在 cordis.yml 中显式写 `apiKey`：

```bash
# .env 或系统环境变量
export OPENAI_API_KEY=sk-xxx
```

```yaml
# cordis.yml - 无需 apiKey 字段，自动从 OPENAI_API_KEY 读取
- id: deepeye-vision
  name: 'dsh-plugin-deepeye'
  config:
    provider: openai
```

### 使用 OpenAI

```yaml
- id: deepeye-vision
  name: 'dsh-plugin-deepeye'
  config:
    provider: openai
    # apiKey: !!js process.env.OPENAI_API_KEY  # 可省略，自动回退
    model: gpt-4o                    # 可选，默认 gpt-4o
    # baseUrl: ''                    # 可选，代理或 Azure 端点
```

### 使用 Gemini

```yaml
- id: deepeye-vision
  name: 'dsh-plugin-deepeye'
  config:
    provider: gemini
    model: gemini-2.0-flash          # 可选，默认 gemini-2.0-flash
```

### 使用智谱 GLM-4V（免费）

智谱的 `glm-4v-flash` 是免费视觉模型，走 OpenAI-compatible 端点，对应 `provider: custom`。

把 [`examples/zhipu-glm4v.cordis.patch.yml`](examples/zhipu-glm4v.cordis.patch.yml) 的内容合并到 profile 的用户 patch 层（`%USERPROFILE%\.dsh\profiles\web\cordis.patch.yml`，Linux/macOS 为 `~/.dsh/profiles/web/cordis.patch.yml`）：

```yaml
- id: deepeye-vision
  config:
    provider: custom
    baseUrl: https://open.bigmodel.cn/api/paas/v4
    model: glm-4v-flash
    maxTokens: 1024
```

API Key 通过环境变量提供（`custom` provider 自动读取 `DEEPEYE_API_KEY`）：

```powershell
# PowerShell
$env:DEEPEYE_API_KEY = "<你的智谱 API Key>"
```

### 使用自定义端点

适用于 vLLM、Ollama、LM Studio 等 OpenAI-compatible 服务：

```yaml
- id: deepeye-vision
  name: 'dsh-plugin-deepeye'
  config:
    provider: custom
    baseUrl: http://localhost:8080/v1   # 必填：端点地址
    model: qwen-vl-plus                 # 必填：模型名
    # apiKey: !!js process.env.DEEPEYE_API_KEY  # 可省略
```

### 完整配置参考

```yaml
- id: deepeye-vision
  name: 'dsh-plugin-deepeye'
  config:
    provider: openai              # 'openai' | 'gemini' | 'custom'
    apiKey: ''                    # 留空则自动读 env（见上表）
    baseUrl: ''                   # custom 端点或代理地址
    model: ''                     # 留空使用 provider 默认模型
    cacheEnabled: true            # 结果缓存开关
    cacheMaxSize: 200             # 缓存最大条目
    maxImageDimension: 1536     # 图片最大尺寸（超过自动缩放）
    jpegQuality: 85               # JPEG 压缩质量
    maxTokens: 4096               # OpenAI-compatible 视觉模型最大输出 token
    pasteCompat: auto             # 'off' | 'auto' | 'force'，粘贴图片兼容模式
```

### 粘贴图片兼容（pasteCompat）

DSH 前端原生支持把图片粘贴/拖拽进输入框（以附件形式存储，消息里是一个 `image` 引用块）。但有两道关卡会让带图消息发不出去：

1. **宿主网关准入**：`dsh-host-apiproxy` 在发送时校验模型能力——DeepSeek 等纯文本模型被显式声明为不支持图片（`MODEL_DOES_NOT_SUPPORT_IMAGES`），前端直接提示"当前模型不支持图片"，请求根本不会发出
2. **适配器拒绝**：即使消息提交成功，`dsh-llm-deepseek` 适配器也会拒绝 image 块（`UNSUPPORTED_CONTENT`）

本插件通过两层机制解决：

| 层 | 机制 |
|---|---|
| 准入 | 包装 `ctx.llm.resolveModelInfo`：纯文本模型的 `inputModalities` 报告为"未知"而非"明确不支持"，通过网关准入，图片消息得以进入会话 |
| 翻译 | `llm/stream` 瀑布钩子：把 image 附件交给视觉后端翻译成文字，替换后重放请求——模型以文本形式"看到"图片 |

| 模式 | 行为 |
|---|---|
| `off` | 不介入，粘贴图片行为与未安装插件时一致 |
| `auto`（默认） | 仅当目标模型**不支持图片输入**时自动翻译；支持图片的模型（如 pi-ai）原样放行 |
| `force` | 无论模型是否支持图片，一律翻译后重放 |

- 翻译用的视觉后端与工具共用同一套配置（provider / apiKey / model / 缓存）
- 视觉翻译失败时自动降级为友好提示文本，不会让会话报错
- 仅改写含 `image` 块的请求，重放请求不含图片，不会重复改写
- `resolveModelInfo` 包装有防重复标记（HMR 安全），且不改动模型路由与请求内容
- 已实测：DeepSeek `deepseek-v4-flash` + 智谱 `glm-4v-flash`，粘贴截图后模型正常收到图片的文字翻译

## 启用方式

安装为 bundle 后（见上文「安装」），插件默认以 `provider: openai` 配置随 profile 自动加载。需要换后端或调整参数时，在 profile 的用户 patch 层按 id 定向覆盖其 `config`：

```yaml
# %USERPROFILE%\.dsh\profiles\web\cordis.patch.yml
- id: deepeye-vision
  config:
    provider: openai
    apiKey: !!js process.env.OPENAI_API_KEY
```

开发期也可以不落盘，直接用 `--patch` 临时叠加：

```bash
dsh web --patch ./examples/zhipu-glm4v.cordis.patch.yml
```

## 提供的工具

| 工具名 | 功能 | 必填参数 |
|---|---|---|
| `vision_describe` | 详细描述图片内容 | `image_source` |
| `vision_ocr` | 提取图片文字（OCR） | `image_source` |
| `vision_ask` | 根据图片回答问题 | `image_source`, `question` |
| `vision_layout` | UI 布局结构化分析（JSON） | `image_source` |
| `vision_clipboard` | 分析剪贴板截图 | 无（自动读取剪贴板） |

### 图片来源格式

所有 `image_source` 参数支持三种格式：
- **本地路径**: `/path/to/image.png` 或相对路径
- **HTTP(S) URL**: `https://example.com/screenshot.png`
- **Data URI**: `data:image/png;base64,iVBOR...`

## 环境变量

复制 `.env.example` 为 `.env` 并填入你的 key：

| 变量 | 用途 | 对应 provider |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API Key | `openai` |
| `GEMINI_API_KEY` | Gemini API Key | `gemini` |
| `DEEPEYE_API_KEY` | 通用 Key / 自定义端点 | `custom` / 所有 |

## 开发

```bash
cd dsh-plugin-deepeye
pnpm install
pnpm run typecheck
pnpm run build
```

## 架构

```
src/
├── index.ts          # Cordis 插件入口 (name/inject/Config/apply)
├── config.ts         # 配置 schema (schemastery)
├── engine.ts         # VisionEngine: 统一执行管道
├── cache.ts          # LRU 缓存
├── image-utils.ts    # 图片加载 + 预处理
├── prompts.ts        # 默认提示词
├── paste-compat.ts   # 粘贴图片兼容：resolveModelInfo 能力包装（通过网关准入）+ llm/stream 瀑布钩子（图片→文字翻译重放）
└── vision/
    ├── base.ts       # VisionAdapter 接口
    ├── openai.ts     # OpenAI 适配器
    ├── gemini.ts     # Gemini 适配器
    └── factory.ts    # 适配器工厂
```