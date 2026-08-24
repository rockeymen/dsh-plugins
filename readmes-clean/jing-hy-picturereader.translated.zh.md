# picturereader

> **v3.1.0** — 给纯文本模型（DeepSeek / text-only）的全能「看图 / 读文档」能力：**粘贴即用、原生缩略图**。
> 融合 **视觉孪生 adapter**（把任意文本模型原位包装成「支持图片」→ DSH 原生缩略图 + 图片块自动分析）、**三模式路由**、**本地像素级工具链**（scan / OCR×3 引擎 / crop / palette / compare / batch）、**文档转图片**（pdf / word / excel / ppt）与**可选外部 VLM 桥**。一个插件全包，无需另装。
>
> **v3.1.0 新增**：`read_image` 工具拦截 — 当 LLM 调用 DSH 内置的 `read_image` 工具时，如果返回了 image block，会自动替换为文本引导，避免后续请求因 image block 导致 `UNSUPPORTED_CONTENT` 错误。内置 `image-reading` 技能注册。

[![dsh-plugin](https://awesome-dsh-plugin.com/badge.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)

## 定位

DeepSeek 等纯文本模型没有视觉编码器，无法直接看图片；DSH 原生缩略图也需要模型被声明为「支持图片」才会渲染。

> ⭐ **已支持外部视觉 API（OpenAI 兼容端点 / LM Studio / 云端 VLM），由 LLM 自行按需调用**：配置好端点后，模型会在智能/严谨模式下自主判断"这张图值不值得外呼视觉模型"，需要时用 `vision_analyze` 调外部 API 做语义理解，简单内容则本地像素/OCR 搞定——**外部 API 是即插即用的增强能力，不是必须依赖**。

picturereader 解决两件事：

1. **把「看图/读文档」翻译成纯文本模型能理解的结构化证据**（像素级 huel/结构/材质分析 + OCR 实读 + 可选 VLM 语义描述），并沉淀为读图方法论 skill。
2. **通过「视觉孪生 adapter」让纯文本模型在 DSH 里获得原生缩略图体验**：勾选模型即生成「(视觉)」变体，粘贴图片显示原生缩略图、图片块进会话、并被自动分析成文本路径 + 本地证据再交给模型——模型拿到的永远是纯文本，不会触发 `UNSUPPORTED_CONTENT`。

> **版本兼容性**：本版本专门兼容 **dsh 0.1.1-rc.2** 及 **dsheac 5.1.0**，已针对这两个版本进行适配测试与优化，确保稳定运行。同时兼容 DeepSeek Harness EAC 4.2.0 与 `@deepseek-ai/dsh-client-ui-workspace` rc.7。

> 🚀 **后续将作为 DeepSeek Harness EAC 的内置视觉插件**：本插件计划替换内置的 `dsh-tool-vision`，随 DSH EAC 桌面版直接捆绑发布，开箱即用（见上游 PR）。作为独立包发布的目的，是让非 EAC / 旧版用户也能通过 `dsh plugin add picturereader` 或 Git/npm 安装获得同等「看图 / 读文档」能力。

## 功能总览

### ① 视觉孪生 adapter（原生缩略图 + 自动分析）

- **Proxy 原位包装**：对被勾选的模型所属 provider，用 `Proxy` 把其 adapter 包装成「孪生」并原位替换（`registerTwinAdapters`，卸载经 `ctx.effect` 还原），不重复注册。
- **`listModels` / `resolveModel`**：对被勾选模型声明 `inputModalities: ['text','image']`、名称加「(视觉)」后缀 → DSH 认为它支持图片 → **原生缩略图渲染、图片块进会话、粘贴准入**全部解锁。
- **`stream` 拦截**：捕获请求里的 `image` block → 导出到 `~/.dsh/picturereader-vision/images/` → 替换成文本路径 + 本地工具链引导 → 转发给原始 adapter。**pi-ai 收到的是纯文本，不会报 `UNSUPPORTED_CONTENT`**；`opencode-go` 等走 `@earendil-works/pi-ai` 的 provider 同样经此孪生获得原生缩略图能力。
- 隐私模式下分析只走本地工具，绝不外发。

### ② 智能路由（隐私 / 智能 / 严谨 三模式）

**这是 picturereader 的"大脑"**：统一在 `routing.js` + `runtime.js` 收敛「什么时候走外部 VLM、什么时候只用本地、要不要交叉验证」，供各工具 / 图片桥 / 视觉孪生 `stream` / `vision_analyze` 共享，保证整条图链都遵守同一套路由策略。

#### 路由决策原理

每次看图，模型面对的问题其实是同一个：「这张图，值得花什么成本、用哪条路线读懂它？」picturereader 把答案预置成三种策略，模型据此自主决策，同时 host 侧做硬约束兜底：

```
图片进来 → 孪生 stream 拦截 / 工具被调用
        → 读入当前「模式」→ 得到该模式的路由策略
        → 模型 / 工具按策略选路线：
            本地像素分析（image_scan / image_sample）
            本地文字识别（image_ocr：windows / paddle / rapid）
            外部语义理解（vision_analyze include_vlm=true → VLM）
            交叉验证（多路证据对照）
```

核心决策函数 `visionAnalyzeDefaults(mode)` 定义各模式"默认的证据组合"：

### 模式 · 默认 include_scan · 默认 include_ocr · 默认 include_vlm · allow_low_info
- **模式**: **隐私（privacy）** · **默认 include_scan**: ✅ · **默认 include_ocr**: ✅ · **默认 include_vlm**: ❌（硬禁） · **allow_low_info**: ❌
- **模式**: **智能（smart）** · **默认 include_scan**: ✅ · **默认 include_ocr**: ❌（按需） · **默认 include_vlm**: ✅（值得才调） · **allow_low_info**: ❌
- **模式**: **严谨（strict）** · **默认 include_scan**: ✅ · **默认 include_ocr**: ✅ · **默认 include_vlm**: ✅ · **allow_low_info**: ❌

#### 三种模式的路线策略

**🕶 隐私模式（Privacy）——零外呼硬门禁**
- **绝不调用**任何外部视觉端点，即使你在设置卡配了 API。
- 约束是 host 侧强制：`runtime.js` 使 `isVlmConfigured()` 恒为 `false`，`vision_analyze` 强制 `include_vlm=false`，视觉孪生 `stream` 的降级文本也明确"只用本地工具"。
- 模型只能用本地工具：`image_scan` / `image_ocr` / `image_sample` / `image_crop` / `image_palette` / `image_compare`。图片字节不出本机。
- 适用：敏感图片（身份证、合同、私人截图）、离线、零外部流量审计场景。

**⚡ 智能模式（Smart）——省轮数、省时间（默认）**
- 目标：**先把成本压到最低，复杂内容才值得外呼**。
- 决策流程：先 `image_scan` 快速看整体 → 自行判断：
  1. 图片以文字为主 → `image_ocr` 读文字即可，**不必调 VLM**；
  2. 普通图表 / 界面 / 简单内容 → `image_scan` + `image_sample` 自己看就能说清，**不必调 VLM**；
  3. 仅当内容复杂、需语义理解（照片、抽象画面）**且配置了端点**时，才 `vision_analyze(include_vlm=true)` 走外部 VLM。
- 视觉孪生死活都会先把图片导出成本地路径，模型可随时本地深挖，不会被困在"必须外呼"的死路。

**🎯 严谨模式（Strict）——交叉验证、细看细节**
- 目标：**可靠性优先**，不贪省。
- 决策：先 `image_scan` 了解整体 → 必要时 `image_ocr` 读文字、`image_sample` 细看细节 → 对关键判断做**交叉验证**（把像素证据、OCR 证据、（可选）VLM 语义描述相互对照，不轻信单一来源）。
- 允许使用外部 VLM（需配置），但强度更高、可追溯。
- 适用：需要高准确率与可复现结论的场景（审图、校对、数据分析）。

> **隐私硬门禁贯穿所有入口**：无论走哪个工具/桥，`runtime.js` 的模式快照都会在调用点做校验，`routePolicyText(mode)` 还会把当前策略注入给模型的提示里，双保险。

#### 与视觉孪生 adapter 的协同

三模式不仅约束 `vision_analyze`，也约束视觉孪生 `registerTwinAdapters` 的 `stream` 拦截：图片块总是被**无条件**替换成文本（路径 + 本地证据引导，这是模型能读懂的前提），但**是否/何时进一步外呼 VLM** 由当前模式决定——隐私模式恒不透传图片、不发起外部调用；智能/严谨模式在需要且已配置时才走外部语义理解。因此"原生缩略图"与"隐私零外呼"可以同时成立，互不冲突。

### ③ 本地工具链（纯本地、纯 JS 像素级）

### 工具 · 作用
- **工具**: `image_scan` · **作用**: 全局/区域扫描：颜色网格 + regions 色块 + shade diversity + texture + structure + hue families；支持 `focus`/`region`/`px_per_cell` 定向放大
- **工具**: `image_ocr` · **作用**: 文字识别**三引擎**：`windows`（内置）/ `paddle`（选装，发光/弯曲/游戏字更强）/ `rapid`（选装，轻量快速），失败自动降级不崩溃
- **工具**: `image_sample` · **作用**: N×N 精确像素取样，判断材质/纹理
- **工具**: `image_crop` · **作用**: 按 region 裁剪并导出 PNG
- **工具**: `image_palette` · **作用**: 颜色提取：主色列表（hex + 命名单 + 占比）+ 色相家族
- **工具**: `image_compare` · **作用**: 两图/两区域像素对比：mean_diff / diff_ratio / diff_box / verdict，可选差异可视化预览
- **工具**: `image_batch` · **作用**: 批量规模/上下文验证：批量扫描 + 类型判定 + 自动全量 OCR + 是否值得深入建议
- **工具**: `vision_analyze` · **作用**: 统一入口：低信息拦截 + 可选像素扫描 / OCR / VLM，按模式路由，返回多路证据

### ④ 文档转图片 `document_to_image`

把 **pdf / docx / doc / xlsx / xls / pptx / ppt** 逐页转成 PNG（LiberOffice headless → PDF → PyMuPDF），供模型逐页 OCR / 扫描分析。纯本地、零网络；支持 `dpi` / `max_pages` / `out_dir` / 批量 `file_paths`。

### ⑤ 外部 VLM 桥（已支持，由 LLM 自行调用）

**已支持外部视觉 API，且调用时机完全交给 LLM 自主判断**：配置好 OpenAI 兼容端点后（LM Studio / llama-server / 云端网关 / GLM-4V-Flash 免费模型），模型在**智能 / 严谨模式**下会自行判断"这张图是否值得外呼视觉模型"——简单内容用本地像素/OCR 就够，复杂内容（照片、抽象画面、需语义理解）才通过 `vision_analyze(include_vlm=true)` 调 `sendVisionRequest` 以 data URI 送图给外部 VLM，取回语义描述。**baseURL 自动补 `/v1/chat/completions`**（无需手写完整路径）。

- LLM 自行调用 = 你不用手动切模型/手动发图，模型按模式策略在该外呼时自己调外部 API。
- 隐私模式仍为硬门禁：即使配置了外部 API 也绝不调用、绝不外发图片字节。

### ⑥ 设置卡片「图片阅读」

Web 设置页注册「图片阅读」卡片：使用模式、外部视觉 API、视觉桥模型多选、高级设置（详见「设置卡字段」）。改动写 `~/.dsh/settings.yaml` 即时生效。

### ⑦ 粘贴即用 + 缩略图

开启视觉孪生并选择「(视觉)」模型变体后：粘贴/拖入图片 → 原生缩略图 → 图片块进会话 → 被孪生 `stream` 拦截 → 导出文本路径 + 本地证据 → 纯文本模型拿到结果，可继续用 `image_scan` / `image_ocr` 深挖。

## 与主流多模态插件的差异 / 优势

对比常见方案（`dsh-tool-vision`、`dsh-image-paste`、`dsh-vision-bridge` 等）：

1. **不绑定单一厂商**：视觉孪生对任意 provider 生效（含 `opencode-go` / xiaomi / qiu 等 pi-ai 系），不是只适配某一家 API。
2. **全链路可离线**：隐私模式零外呼；本地纯 JS 像素工具 + 3 引擎 OCR，不依赖云端。
3. **工具链完整**：裁剪 / 取色 / 对比 / 批量 / 文档转图，一个插件全覆盖。
4. **原生缩略图**：真正 DSH 原生图片块（`inputModalities` 声明），非文本路径模拟。
5. **快**：本地工具毫秒级；可控 VLM 调用（低信息拦截 + 智能模式"值得才调"）省轮数与耗时。
6. **只写不读 key、隐私硬门禁**：API Key 以 `role:'secret'` 保存、只写不读不回显；隐私模式经 `runtime.js` 强制 `isVlmConfigured()=false`。

### 能力 · **picturereader** · dsh-tool-vision · dsh-image-paste · dsh-vision-bridge
- **能力**: 原生缩略图（文本模型） · ****picturereader****: ✅ 视觉孪生 adapter · **dsh-tool-vision**: ❌ · **dsh-image-paste**: ⚠️ 部分 · **dsh-vision-bridge**: ❌
- **能力**: 任意 provider（含 pi-ai 系） · ****picturereader****: ✅ · **dsh-tool-vision**: 绑定厂商 · **dsh-image-paste**: — · **dsh-vision-bridge**: —
- **能力**: 隐私模式硬门禁 · ****picturereader****: ✅ · **dsh-tool-vision**: — · **dsh-image-paste**: — · **dsh-vision-bridge**: ❌
- **能力**: 本地像素工具链（scan/ocr/crop/palette/compare） · ****picturereader****: ✅ 全内置 · **dsh-tool-vision**: ⚠️ 基础 · **dsh-image-paste**: ❌ · **dsh-vision-bridge**: ❌
- **能力**: 文档转图片（pdf/word/excel/ppt） · ****picturereader****: ✅ · **dsh-tool-vision**: ❌ · **dsh-image-paste**: ❌ · **dsh-vision-bridge**: ❌
- **能力**: 批量/上下文验证 · ****picturereader****: ✅ · **dsh-tool-vision**: ❌ · **dsh-image-paste**: ❌ · **dsh-vision-bridge**: ❌
- **能力**: 外部 VLM 桥（可选，OpenAI 兼容） · ****picturereader****: ✅ · **dsh-tool-vision**: ✅ · **dsh-image-paste**: ❌ · **dsh-vision-bridge**: ✅
- **能力**: 全离线可用 · ****picturereader****: ✅ · **dsh-tool-vision**: ⚠️ · **dsh-image-paste**: ✅ · **dsh-vision-bridge**: ❌

## 快速上手

```sh
# 1. 安装插件
dsh plugin --profile web add picturereader        # npm 包；或从源码: dsh plugin --profile web add .
dsh plugin --profile headless add picturereader

# 2.（推荐）安装读图方法论 skill
copy skills\image-reading.md %USERPROFILE%\.dsh\skills\          # Windows
# cp skills/image-reading.md ~/.dsh/skills/                      # macOS / Linux

# 3.（可选）增强 OCR 引擎
node scripts/setup-ocr.mjs       # PaddleOCR（发光/弯曲/游戏字更强）
node scripts/setup-rapid.mjs     # RapidOCR（轻量快速）

# 4.（可选）文档转图片依赖（需已装 LibreOffice）
node scripts/setup-doc-venv.mjs  # 建 doc_venv 装 PyMuPDF
```

重启 DSH Desktop 后：模型工具列表出现全部工具，设置页出现「图片阅读」卡片。

### 启用视觉孪生（原生缩略图）

1. 在设置页「图片阅读」勾选要作为视觉孪生的文本模型，保存后**重启 DSH**。
2. 模型选择器中选择对应模型的「(视觉)」变体（如 `deepseek-v4-flash (视觉)`）。
3. 粘贴 / 拖入图片 → 原生缩略图 → 图片块自动分析为文本证据。

### 使用示例

```text
用 image_scan 看一下 <路径> 这张图，细看感兴趣的部分
（复杂场景可接着用 vision_analyze；如有文字先 image_ocr；一批图用 image_batch；
  文档用 document_to_image 逐页转成图片再看）
```

## Code Mode（工具折叠）兼容说明

DSH 的 `tools` 呈现有三种 `mode`：`native`（默认，模型可直呼所有工具）、`code`（只允许模型直呼 `run_code`，其它工具折叠进 `run_code` 的生成 SDK 内调用）、`both`（两种都能用）。

- **picturereader 所有工具与 mode 无关**：`native` / `both` 下全部可直呼；`code` 下也**完全可用**，只是要经 `run_code` 程序内调用（`await tools.image_scan(...)` / `await tools.vision_analyze(...)`）。工具会被自动投影进 `run_code` 生成的 SDK，一个都不少。
- *