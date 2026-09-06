#dsh-plugin-browser

> **适用于 DeepSeek Harness (`dsh`) 的本机无头和可见 Web 浏览器自动化代理插件**

`dsh-plugin-browser`为DeepSeek Harness代理提供原生网页浏览、实时页面内容提取、DOM解析、表单交互和可视化截图验证等功能。

## 特点

- 🌐 **网络导航和探索**：导航到任何公共或内部网站 URL。
- 📄 **语义 Markdown 和链接提取**：将复杂的 HTML 页面转换为干净、高效的 Markdown。
- 📸 **视觉屏幕截图**：捕获高分辨率视觉快照以进行多模式验证。
- 💻 **CLI 实用程序 (`dsh-browser`)**：直接终端命令（`open`、`extract`、`screenshot`）。
- 🧩 **Cordis Native**：自动公开 `browser_navigate`、`browser_extract` 和 `browser_screenshot` 工具。

## 安装

```bash
# Add from GitHub
dsh plugin --profile web add "github:menotbobbybrown/dsh-plugin-browser"
```

## CLI 用法

```bash
# Navigate to a URL and inspect HTTP status
npx dsh-browser open https://news.ycombinator.com

# Extract clean Markdown and hyperlinks
npx dsh-browser extract https://github.com/deepseek-ai/deepseek-harness

# Capture a screenshot
npx dsh-browser screenshot https://github.com my_screenshot.png
```

## 编程使用（Cordis API）

```typescript
import { Context } from 'cordis';
import * as BrowserPlugin from 'dsh-plugin-browser';

const ctx = new Context();
ctx.plugin(BrowserPlugin);

// Navigate to a URL
await ctx.browser.navigate('https://deepseek.com');

// Extract clean markdown
const { markdown, links } = await ctx.browser.extract();

// Capture screenshot
const screenshot = await ctx.browser.screenshot();
```