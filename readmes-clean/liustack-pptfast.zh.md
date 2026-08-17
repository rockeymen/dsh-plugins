![pptfast：PPT 不用等，马上就好](assets/banner.png)

# pptfast

PPT 不用等，马上就好。

🥇 全网第一个 DeepSeek Harness PPT 生成插件 🥇

## 交流

欢迎随时提 [issue](https://github.com/liustack/pptfast/issues/new/choose)。也欢迎在 X 关注 **[@liustack](https://x.com/liustack)**，聊聊你用 pptfast 做了什么、在哪个 harness 上运行，以及下一版最该解决什么。新版本也会第一时间在那里发布。

## 亮点

**⚡ 跟 AI 说一句，PPT 就好了。** 你只管说要讲什么，版面、配色、字号、间距全由引擎排好。同一份内容做十遍是同一份，不用一遍遍重来碰运气。

**✏️ 交出来的是真 PPT，不是一张图。** 每个标题、每条要点、每根柱子都能在 PowerPoint 里点开改字改色。图表和表格里的数字是例外，换数字让 AI 重做一版。17 套现成风格，也能把你公司现有 PPT 里的配色和字体抽出来直接用。

**🔌 装进你正在用的 agent。** 一条命令装进 DeepSeek Harness、Claude Code，或任何读 skill 文件夹的 agent（Codex 等），装完就会用。

**🔁 改稿不用重新描述一遍。** 一条命令打开预览网页，翻页看效果，直接在页面上写批注，AI 读了就改，改完网页自动刷新。

**🔒 不用注册、不用配 key、不联网。** 装好就能用，电脑上有 Node 22.19+ 或 Bun 就行。

## 安装

**第一步，交给你的 AI。** 把这行话发给它：

> 按照 https://raw.githubusercontent.com/liustack/pptfast/main/INSTALL.md 安装 pptfast deck 技能，装完跑一遍健康检查，把结果告诉我。

没有第二步。你的 AI 会把 skill 文件夹放到你这个 harness 读取的位置，skill 自带钉死版本的启动器，不需要你手动装 CLI。pptfast 完全在本地渲染：不要 API key、不用注册、无需任何配置，唯一前置是 Node 22.19+（或 Bun）。

**在 DeepSeek Harness 上换成一条命令。** 那里 pptfast 是原生 DSH 插件，不走 skill 文件夹：

```bash
npx -y @deepseek-ai/dsh plugin --profile web add @liustack/pptfast@0.20.0
```

版本号要点名。不点名的话，安装会静默落到一个更旧的版本，拿不到最新能力。`npm view @liustack/pptfast version` 可查当前版本。插件卡片显示为「pptfast」，把整套生成流程的 skill 注册进 DSH 技能系统，驱动的 CLI 就在插件包自己里面。卸载即移除，不留残余。

## 快速开始

IR 就是一份描述整份 PPT 内容的 JSON 文件。写一个最小的，跑一遍 validate → render → preview 回路：

```bash
cat > deck.json <<'EOF'
{
  "filename": "hello.pptx",
  "theme": { "id": "consulting" },
  "slides": [
    { "type": "cover", "heading": "Hello pptfast", "subheading": "A first deck in ten minutes" },
    { "type": "content", "heading": "Why it works", "components": [
      { "type": "bullets", "items": ["Semantic IR in", "Native DrawingML out", "Every shape stays editable"] } ] },
    { "type": "ending", "heading": "Thanks" }
  ]
}
EOF
pptfast validate deck.json                              # → OK — 3 slides, theme "consulting"
pptfast render deck.json -o out/hello.pptx              # → wrote out/hello.pptx (3 slides, ~24 KB)
pptfast render deck.json -o out/tech.pptx --theme tech  # 同一份 deck，换个主题
pptfast preview deck.json -o out/svgs                   # 每页一张 SVG，供人工目检
```

只有一条形状规则：`cover`/`chapter`/`ending` 页只有 heading + subheading，组件都放在 `content` 页上。写混了 `validate` 会原话告诉你。

不想安装也行：`npx -y @liustack/pptfast validate deck.json`。源码仓库里则用 `node dist/cli.js` 代替 `pptfast`，`examples/` 下有现成的 IR 文件可以直接试。

最常用的几条命令：

### 命令 · 作用
- **命令**: `validate <target>` · **作用**: 校验 IR，每条报错都带页码
- **命令**: `render <target> -o <out.pptx> [--theme ]` · **作用**: 渲染出 `.pptx`
- **命令**: `preview <target> -o <dir> [--html]` · **作用**: 每页一张 SVG，外加一个自包含的审阅页
- **命令**: `serve <target>` · **作用**: 随改动自动刷新的实时预览，带批注面板
- **命令**: `audit <target>` · **作用**: 几何审查：溢出、越界、低对比度、重叠
- **命令**: `themes` · **作用**: 列出 17 个内置主题
- **命令**: `doctor` · **作用**: 体检这套安装：运行时、skill 副本、可选能力、自检渲染

完整命令表见 [`docs/cli.zh-CN.md`](./docs/cli.zh-CN.md)。

## 文档

### 文档 · 适用场景
- **文档**: [安装手册](./INSTALL.md) · **适用场景**: 把安装交给 agent，或检查运行前提
- **文档**: [Agent skill](./skills/pptfast/SKILL.zh-CN.md) · **适用场景**: 了解 pptfast 教给 agent 的完整工作流
- **文档**: [CLI 手册](./docs/cli.zh-CN.md) · **适用场景**: 查询命令、参数、审查、预览与健康检查
- **文档**: [IR 参考](./docs/ir.zh-CN.md) · **适用场景**: 用 JSON 编写 deck、页面、组件与叙事
- **文档**: [主题](./docs/themes.zh-CN.md) · **适用场景**: 挑选内置主题，或从自家 PPT 提取品牌
- **文档**: [核心概念](./docs/concepts.md) · **适用场景**: 理解主题、版式、组件、叙事与容量模型
- **文档**: [架构](./docs/architecture.md) · **适用场景**: 修改渲染链，或新增主题、版式与组件
- **文档**: [Deck 项目](./docs/deck-projects.md) · **适用场景**: 用锁定 spec、页面文件、素材与实时审阅制作复杂 PPT
- **文档**: [版式选型与 seed](./docs/selection-and-seed.md) · **适用场景**: 排查版式为何被选中，或保持多次修订稳定
- **文档**: [对比度系统](./docs/contrast-system.md) · **适用场景**: 排查文字颜色、自绘背景与低对比度问题
- **文档**: [测试](./docs/testing.md) · **适用场景**: 选择验证命令、检查快照，或修改导出 XML
- **文档**: [内部 API](./docs/internal-api.md) · **适用场景**: 了解 JavaScript 内部模块为何不承诺 semver 稳定性
- **文档**: [发布手册](./docs/releasing.md) · **适用场景**: 准备并发布 npm 版本
- **文档**: [更新日志](./CHANGELOG.md) · **适用场景**: 查询各版本的变化

## 关注「liustack」

关注微信公众号「liustack」：AI 创业机会、独立开发见解、AI 实战与工具，第一时间推送。微信扫码，或搜一搜「liustack」：

  ![微信公众号 liustack](assets/wechat-qrcode.png)

⭐ 如果 pptfast 对你有用，请给[项目](https://github.com/liustack/pptfast)一个 star，并在 X 关注 **[@liustack](https://x.com/liustack)**。这是让更多开发者找到它最直接的方式。

## 致谢

图标原语抽取自 [lucide](https://lucide.dev)（ISC License）。pptfast 本身从一套生产环境的 AI 出 PPT 系统中抽取而来，从第一天起就针对 CJK 排版做了优化（全角标点宽度、中文换行、雅黑优先字体栈、显式东亚字体槽声明）。