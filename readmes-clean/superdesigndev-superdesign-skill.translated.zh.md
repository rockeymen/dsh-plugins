# Superdesign：Claude Code、Cursor以及任何编码代理的设计技巧

**停止交付 AI-slop UI。** 编码代理编写出色的代码和平庸的界面：通用布局，默认的 shadcn 一切，没有品味。超级设计是赋予你的代理设计判断力的技能，因此它提供的 UI 看起来实际上是经过深思熟虑的。

安装一次，您的代理（Claude Code、Cursor、Codex 和 70 多个其他）就可以找到真正的设计方向，建立设计系统，并在无限画布上生成和迭代高质量的 UI 草稿，所有这些都无需离开您的终端。

> 由 AI 产品设计代理 [superdesign.dev](https://superdesign.dev)] 提供支持。

[！[超设计技能演示](https://i.ytimg.com/vi/AZYJWyWZ6pQ/maxresdefault.jpg)](https://youtu.be/AZYJWyWZ6pQ)

*▶ 观看技能的实际运用。*

## 什么是超级设计？

**Superdesign 是一款 AI 产品设计代理。** 它为编码代理（Claude Code、Cursor、Codex 和 70 多个其他）提供真正的设计判断，因此它们提供的 UI 看起来是经过深思熟虑的，而不是通用的。

- **它的作用** — 找到设计方向，从代码库建立设计系统，并在无限画布上生成和迭代高质量的 UI 草稿，所有这些都可以在您的终端上完成。
- **它适合谁** - 开发人员、独立黑客和产品/UI 设计师，他们希望在不离开编码代理的情况下快速从想法转变为可交付的 UI。
- **有何不同** — 样式预设技能只需在主题或组件库中交换即可。 Superdesign 将设计“融入”您现有的设计系统：它读取您的代码以获取上下文，收集真实的样式参考，并生成您改进的可分支草稿。
- **跨会话连续性** - 在第一次真正的代码库设计之后，该技能会记住项目、草稿、提取的组件和预算的源上下文捆绑包，以便稍后恢复未更改的迭代，而无需重复代码库发现。
- **有两种方式** - 这项技能来自任何编码代理，或 [superdesign.dev](https://superdesign.dev) 的网络应用程序。

> **不是旧版 IDE 扩展。** 存档的开源 `superdesigndev/superdesign` VS Code 扩展是一个较旧的独立项目。该技能和 [superdesign.dev](https://superdesign.dev) 是当前维护的产品。

## 安装

**任何编码代理** — 安装任何 [70+ 支持的编码代理](https://github.com/vercel-labs/skills#supported-agents) 的技能：

```
npx skills add superdesigndev/superdesign-skill
```

**Claude Code** — 将其作为插件安装，因此它保持命名空间并使用 `/plugin update` 进行更新：

```
/plugin marketplace add superdesigndev/superdesign-skill
/plugin install superdesign@superdesign
```

然后该技能将被调用为 `/superdesign:superdesign`。 （也不要在 Claude Code 中运行 `npx skills add` — 这会安装相同技能的第二个未命名空间的副本。）

无论哪种方式，安装它驱动的 CLI：

```
npm install -g @superdesign/cli@latest
superdesign login
```

## 使用它

只需与您的代理人交谈：

```
/superdesign help me redesign this settings page so it doesn't look like default AI slop
```

```
/superdesign set up a design system from my current codebase
```

```
/superdesign improve the design of my dashboard
```

该技能处理剩下的事情：它读取您的代码以获取上下文，收集真实的样式参考，并生成您可以分支和完善的设计草稿。

# 核心场景（该技能处理什么）

1. **帮我设计X**（功能/页面/流程）
2. **设定设计系统**
3. **帮我改进X的设计**（让它看起来不像AI生成的）

## 工具概述

### A) 灵感和风格工具（通用，始终可用）

使用它们来发现风格方向、参考资料和品牌背景。在 Web 应用程序中浏览完整的 [提示库](https://superdesign.dev/library)，或从 CLI 查询：

- **搜索提示库**（样式/组件/页面）

  ```bash
  superdesign search-prompts --query "<keyword>"
  superdesign search-prompts --tags "style"
  superdesign search-prompts --tags "style" --query "<style keyword>"
  ```

- **获取提示详细信息** — 首先阅读紧凑索引，然后仅获取您选择的 slug 的完整正文

  ```bash
  superdesign get-prompts --slugs "<slug1,slug2,...>"          # index
  superdesign get-prompts --slugs "<slug>" --full             # full body of the chosen slug(s)
  ```

- **从 URL 中提取网站的设计 DNA**（风格指南、标记、内容、品牌、克隆）
  ```bash
  superdesign extract-website --url https://example.com --design-md
  ```

### B) 画布设计工具

使用设计代理生成高质量的设计稿：
- 创建项目（可以选择通过 `--template` 从 HTML 模板播种基线草稿）
- 创建设计稿
- 迭代设计稿（替换/分支）
- 规划流程页面→执行流程页面
- 获取具体设计稿

## 在现有应用程序之上设计功能的总体 SOP：
1.调查现有的UI、工作流程
2. 如果尚不存在，则设置设计系统文件
3. 需求收集：使用会话的可用用户输入机制询问用户；如果没有可用的，请在聊天中询问（需要时可以选择使用灵感工具）
4.询问用户是否准备好在superdesign中进行设计或直接实现UI
5. 如果是的话进行超级设计
  5.1 创建/更新我们将在 `.superdesign/replica_html_template/<name>.html` 中设计的当前页面 UI 的像素完美 html 副本（html 应仅包含并反映 UI 现在的外观，实际设计应由超级设计代理处理）
  5.2 使用此副本 html + 设计系统指南创建项目
  5.3 根据项目返回的designDraft ID迭代和分支设计稿开始设计

## 永远在线的规则
- 设计系统应位于：`.superdesign/design-system.md`
- 如果缺少 `.superdesign/design-system.md`，请先运行 **设计系统设置**。
- 使用会话可用的用户输入机制提出有关约束、品味和权衡的高信号问题；如果没有，请在聊天中询问。
- 直接读取每个命令的默认输出 - 它是代理优化的（紧凑的 TOON 加上 `help[]` 下一步提示）。仅当您确实需要完整的机器可读有效负载时才添加 `--json`，仅在扩展截断字段时才添加 `--full`。

##replica_html_template规则（仅限Canvas）

复制 html 模板的目的是创建现有 UI 的轻量级版本，以便设计代理可以在其之上进行迭代（由于超级设计无法直接访问您的代码库，因此这是重要的上下文）

在现有应用程序之上设计功能的总体流程：
1. 识别并理解页面相关的现有 UI
2.在`.superdesign/replica_html_template/<name>.html`中创建/更新像素完美的副本html（仅复制UI现在的外观，不进行设计）
  - 如果设计任务是重新设计个人资料页面，则完美复制当前个人资料页面 UI 像素
  - 如果设计任务是向侧面板添加新按钮，请确定正在使用哪个页面侧面板，然后完美复制该页面 UI 像素

**replica_html_template = BEFORE 状态（现在存在的内容）。** 它为 Superdesign 代理提供上下文。
实际设计将通过超级设计代理通过提示完成

replica_html_template 必须包含 **仅当前存在于代码库中的 UI**。
- **不要**设计或改进replica_html_template中的任何内容
- **不要**添加占位符部分，例如 `<!-- NEW FEATURE - DESIGN THIS -->`
- **DO** 创建当前 UI 状态的像素完美副本
- 保存至：`.superdesign/replica_html_template/<name>.html`

### 命名和重用

**命名约定**
命名replica_html_template以实现可重用性：使用页面路由（例如，`home.html`、`settings-profile.html`、`dashboard.html`）
这样可以轻松识别 page_template 是否已存在。

**创建replica_html_template之前：**
1.检查`.superdesign/replica_html_template/`是否已经包含匹配的文件
2. 如果存在：重用它或更新以反映最新的现有 UI
3.如果不存在：创建neww文件

### 示例：在主页添加“图书演示”部分

**糟糕的方法：**

```html

  ### Book a Demo
  Schedule

```

**好方法：**

```html
```

然后在迭代命令中：
1/ 创建项目并传递此副本 html
2/根据设计稿id创建设计稿

# 1) 设计系统设置

### 步骤 0 — 询问用户（一个问题）

“你想**创建一个新的设计系统**还是**从当前的代码库中提取**？”

### A) 从代码库中提取

1.调查代码库：
   - 产品背景：正在构建的内容、目标用户、核心价值主张、关键用户旅程和页面结构
   - 设计标记、排版、颜色、间距、半径、阴影
   - 运动/动画模式
   - 示例组件使用+实现模式
2. 编写独立设计系统：
   - `.superdesign/design-system.md`
   - 必须可以在没有代码库的情况下实现

### B) 创建一个新的设计系统（以改进当前的 UI）

1. 研究代码库以了解：
   - 产品背景：正在构建的内容、目标用户