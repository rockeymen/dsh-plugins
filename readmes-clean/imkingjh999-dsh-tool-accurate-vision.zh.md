# dsh-tool-accurate-vision

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的
`accurate_vision` 工具:通过 OpenAI 兼容视觉模型对图片文件做精确空间推理。
从 [`pi-accurate-vision`](https://github.com/imkingjh999/pi-accurate-vision) 移植。

视觉模型读取图片后返回结构化笔记加 **归一化到 0–1000 的包围盒图元**,
本工具将其格式化为 `<vision-context>` 块供下一轮模型读取——
让纯文本 agent 获得精确的对象位置、布局和 OCR,而不丢失空间保真度。

[English](README.md) | 中文

## 安装

```sh
dsh plugin --profile web add dsh-tool-accurate-vision
```

或从源码安装:

```sh
dsh plugin --profile web add github:你的用户名/dsh-tool-accurate-vision
```

设置视觉 API key(与 `DEEPSEEK_API_KEY` 相互独立):

```sh
export VISION_API_KEY=sk-...
```

## 工作原理

```
图片文件 ──► base64 data URL ──► 视觉 chat/completions ──► JSON 笔记 + 图元
                                                                    │
                                                        <vision-context> XML ──► 下一轮模型
```

纯视觉核心([`src/bridge.ts`](src/bridge.ts))与供应商无关:
任何 OpenAI 兼容的多模态 `chat/completions` 端点均可。
Cordis 宿主([`src/index.ts`](src/index.ts))负责配置、凭据解析和工具注册。

每次调用还会把「原图 + 全部包围盒与名字标签」写成一份自包含 SVG,
路径经结果字段 `annotatedImage` 返回——方框可以亲眼核对而不是盲信
(配置 `annotate: false` 可关闭)。

## 案例:严谨的距离计算

问一个可验证的图像问题——*在这张手绘物理学家关系图中,不考虑连线,
哪个节点离居里夫人的物理距离最近?*——裸视觉模型与本工具的差距立刻可测。
测试图片即下面这张泛黄的物理学家关系图:

![测试图片:手绘物理学家关系图](https://raw.githubusercontent.com/imkingjh999/dsh-tool-accurate-vision/main/docs/image.png)

1. **直接问多模态模型**:得到的是视觉印象而非测量——
   「郎之万在左下方,间隔看起来最小」。无凭无据,而且(如下所示)是错的。

   ![裸 VLM 凭直觉作答](https://raw.githubusercontent.com/imkingjh999/dsh-tool-accurate-vision/main/docs/image-gpt.png)

2. **无结构化图元的视觉文本**可能比没有数字更糟:模型在散文里编出
   看似合理的坐标,又自相矛盾——自称间距约 15,按它给出的两个框算却是
   59——最终给出同一个错误答案。

   ![无结构输出会编造坐标](https://raw.githubusercontent.com/imkingjh999/dsh-tool-accurate-vision/main/docs/image-without-primitive.png)

3. **使用本工具的归一化图元**:每个节点都有可校验的 0–1000 包围盒,
   agent 用代码计算真实的边缘到边缘距离:皮卡尔德 25.96 对 郎之万 58.00。
   正确答案皮卡尔德 (Piccard) 连同证明它的数字一起交付。

   ![结构化图元支撑精确距离计算](https://raw.githubusercontent.com/imkingjh999/dsh-tool-accurate-vision/main/docs/image-with-primitive.png)

这就是核心优势:包围盒图元把视觉印象转化为几何。位置、距离、布局变成
纯文本 agent 可以计算并验证的事实,而不是只能相信的猜测。距离问题的规范
算法是按轴配对**相向的边**(`dx = max(a.x1 - b.x2, b.x1 - a.x2, 0)`,y 轴
同理,再取 hypot);本包自带经过测试的 `bboxEdgeDistance(a, b)` 帮助函数,
让下游 agent 永远不会配错边。

## 配置

在 profile 的 `cordis.patch.yml` 中覆盖:

```yaml
- id: tool-accurate-vision
  config:
    model: gpt-4o              # 任意 OpenAI 兼容多模态模型
    baseURL: https://api.openai.com/v1
    apiKeyEnv: VISION_API_KEY  # 凭据引用
    primitives: true           # 是否请求包围盒图元
    annotate: true             # 同时写出带框 SVG(annotatedImage 字段返回路径)
    maxTokens: 8192
    timeoutSecs: 120
    temperature: 0
    disableThinking: true     # 跳过思考阶段(MiniMax):更快更稳
```

## 起源

忠实移植自 `pi-accurate-vision`(后者又提取自 DeepSeek-TUI 的
`crates/tui/src/vision/bridge.rs`)。
解析、提示词和格式化逻辑逐字保留;仅宿主集成迁移到 Cordis `ctx.tools` 注册表,
辅以 schemastery 配置和 credentials 缝。

## 许可证

MIT