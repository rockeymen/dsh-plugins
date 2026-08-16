# dsh-ppt-composer

DeepSeek Harness 的 **AI PPT 生成助手** Cordis 插件。在对话中完成 PPT 的创作全流程：内容确认 → 多页结构生成 → 媒体（图片/视频/图表）→ 主题 v2（每页独立配色/字体/SVG 装饰/入场动画）→ 实时浮动预览 → 独立 HTML 导出。

- **Host 端**：按会话存储 PPT、12 个模型工具（`ppt_*`）、`ppt/state` / `ppt/export` RPC、独立 HTML 导出器、工作流系统提示词。
- **Client 端**：`shell.overlay` 中的可拖拽浮动预览面板（可调大小、翻页、缩略图、导出、toast 提示）、全屏演示层、会话头部开关按钮。

---

## 功能特性

| 能力 | 说明 |
| --- | --- |
| 对话式生成 | AI 主动询问主题/受众/结构 → 确认后拆解为多页 → 确认内容 → 询问配色 → 套用 → 导出 |
| 长宽比与过渡 | `16:9` / `4:3`；页间过渡 `fade` / `slide` / `zoom` / `none` |
| 媒体支持 | `image`（URL / data URI）、`video`（控制条播放）、`chart`（CSS 柱状图，导出自包含） |
| 主题 v2 | 文档主题（配色/双字体/圆角）+ **每页局部主题覆盖**（`slide.theme`），各页可不同配色/字体 |
| SVG 装饰 | `slide.decor` 内联 SVG（折线时间线箭头、流程图步骤、几何装饰），viewBox `0 0 1920 1080/1440` 铺满整页、位于内容下层 |
| 入场动画 | `slide.entrance`：`fade` / `rise` / `zoom` / `none`，标题与正文分段错峰 |
| 页面对齐 | `slide.align`：`center` / `top`（带 `decor` 的复杂模板页默认 `top`，标题固定在顶部不与装饰重叠） |
| 实时预览 | 固定逻辑画布（1920×1080 / 1920×1440）`transform: scale` 缩放居中；可拖拽、右下角调整大小、翻页、缩略图跳转、导出 |
| HTML 导出 | 与预览**同画布**的自包含 HTML：键盘翻页、翻页按钮组、窗口自适应缩放、主题/装饰/动画一致 |

---

## 目录结构

```
dsh-ppt-composer/
├── package.json            # dsh 插件包元数据（exports、dsh 字段、Cordis peer 依赖）
├── README.md
├── LICENSE                 # MIT
├── .gitignore
├── src/
│   ├── host.js             # Host 插件体（权威源码，即 code.host 原文）
│   ├── client.js           # Client 插件体（权威源码，即 code.client 原文）
│   └── index.js            # 入口：读取两份源码并以字符串导出，供 cordis_define 使用
└── examples/
    ├── sample-slides.json  # 示例幻灯片结构（含时间线 decor 与每页主题）
    └── demo/               # 测试导出的 HTML（gitignore，可再生成）
```

---

## 安装与加载

本仓库以 **动态 Cordis 插件** 形式分发：`src/host.js` 与 `src/client.js` 就是
`cordis_define` 所需的 `code.host` / `code.client` 原文（已验证可运行），单一事实来源。

### 方式一：动态加载（推荐，开箱即用）

在 DSH 会话中让模型执行 `cordis_define`：

```js
import { definePayload } from './src/index.js'   // 或直接读取 src/host.js / src/client.js

definePayload()
// => { code: { host: <src/host.js 内容>, client: <src/client.js 内容> } }
```

把 `definePayload()` 的返回传给 `cordis_define({ plugin: { kind: 'new', idPrefix: 'pptco' }, …, code })`，
随后 `cordis_run` 激活并批准运行。激活后当前会话即可使用全部 `ppt_*` 工具与预览面板。

### 方式二：静态挂载（需少量适配）

DSH 部署通过 profile 的 `cordis.patch.yml` 挂载插件。`src/host.js` / `src/client.js`
目前使用动态运行器的全局 `harness`（`defineTool` / `registerTool` / `handle`）与
`host.call` 桥。静态挂载时需将：

- `harness.defineTool / harness.registerTool` → `ctx.tools.register(toolDefinition)`；
- `harness.handle('ppt/state'|'ppt/export')` → 通过会话/客户端 RPC 服务暴露；
- Client 的 `host.call('ppt/…')` → 替换为对应静态 RPC 通道。

（后续版本可提供静态适配层；欢迎 PR。）

---

## 使用流程（模型工作流，已内置系统提示词）

1. 用户表示要制作 PPT 或粘贴文案 → AI 确认主题/受众/结构，并确认 **长宽比** 与是否需要 **页间过渡动画**。
2. 确认后 `ppt_create` 一次性创建（**空白默认主题、基础排版**，不上色）。
3. `ppt_slide_add` / `ppt_slide_update` / `ppt_slide_remove` 微调，`ppt_get` 复核。
4. 内容确认后询问配色 → `ppt_theme_create` → `ppt_theme_apply`；不满意 `ppt_theme_update` 微调。
5. 满意后 `ppt_export` 导出独立 HTML 到会话工作区。

---

## 工具参考

| 工具 | 作用 |
| --- | --- |
| `ppt_create` | 创建/重建 PPT（`title`、`slides[]`、`ratio`、`transition`） |
| `ppt_get` | 读取完整状态（含每页 id、当前主题、可用主题） |
| `ppt_update` | 整体修改（标题/整组幻灯片/长宽比/过渡/主题） |
| `ppt_delete` | 删除当前会话 PPT |
| `ppt_slide_add` | 插入一页（`slide`、`index?`） |
| `ppt_slide_update` | 按 `slideId` 局部修改（patch 覆盖） |
| `ppt_slide_remove` | 按 `slideId` 删除 |
| `ppt_theme_create` | 创建主题（colors/fontFamily/fonts/radius） |
| `ppt_theme_update` | 修改主题（部分覆盖；默认主题不可改） |
| `ppt_theme_get` | 读取主题/列表/当前主题 |
| `ppt_theme_apply` | 套用主题到当前 PPT |
| `ppt_export` | 导出独立 HTML 到会话工作区 |

---

## 数据结构

### 幻灯片 `slide`

```js
{
  id: 's1',                       // 可选，唯一标识
  layout: 'cover',                // cover | title | content | two-column | section | closing | blank
  title: '…', subtitle: '…',
  bullets: ['…'],                 // 要点（content）
  paragraphs: ['…'],              // 段落（content）
  columns: [{ heading: '…', bullets: ['…'] }],  // 双栏
  quote: '…', quoteAuthor: '…',   // 引言
  code: '…',                      // 代码块
  image: 'https://… | data:…',    // 图片（content）
  imageAlt: '…',
  video: 'https://…',             // 视频（content）
  chart: { labels: ['Q1'], values: [42] },      // 柱状图（content）
  decor: '<path …/><text …/>…',   // SVG 内联装饰，整页下层
  theme: { colors?: {…}, fontFamily?: '…', fonts?: { heading?, body? }, radius?: 8 },  // 本页主题覆盖
  entrance: 'fade',               // fade | rise | zoom | none
  align: 'center',                // center | top（带 decor 默认 top）
  note: '演讲备注'                 // 不渲染
}
```

### 主题 `theme`

```js
{
  id: 'slate', name: '石板夜',
  colors: {
    background: '#0f172a',   // 背景
    foreground: '#f1f5f9',   // 主文字
    accent: '#60a5fa',       // 强调色
    muted: '#94a3b8',        // 次要文字
    surface: '#1e293b',      // 卡片底色
  },
  fontFamily: '',                      // 可选，正文默认
  fonts: { heading: '…', body: '…' },  // 可选，标题/正文分开
  radius: 8,
}
```

所有颜色必须为十六进制。文档主题 + 每页 `slide.theme` 合并后渲染；预览与导出
（1920×1080 / 1920×1440 固定画布）共用同一套排版规则，所见即所得。

---

## 导出文件说明

`ppt_export` 生成的 HTML：

- 与预览完全相同的 1920×1080（16:9）/ 1920×1440（4:3）画布与排版；
- 自包含（无外部依赖），`<img>`/`<video>` 引用外部 URL 时需联网，data URI 则完全离线；
- 键盘翻页：`← → 空格 PgUp/PgDn Home End`；
- 右下角「上一页 / 下一页」翻页按钮组；窗口缩放自适应居中；
- 主题/装饰/入场动画与预览一致。

---

## 开发与测试

- 纯 JavaScript + React（`React.createElement`），**无需构建步骤**。
- 修改 `src/host.js` / `src/client.js` 后，重新通过动态加载即可生效（更新时用 `cordis_run mode:"update"`）。
- 快速自测：按上文「使用流程」走一遍 创建 → 读取 → 主题 → 导出，并在预览面板核对翻页/缩放/主题。
- 示例结构见 `examples/sample-slides.json`（含折线时间线 decor 与每页独立主题）。

---

## 许可

[MIT](./LICENSE) © 2026 dsh-ppt-composer contributors
