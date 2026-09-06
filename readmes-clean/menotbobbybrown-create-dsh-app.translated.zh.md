#create-dsh-app

> **适用于 DeepSeek Harness (`dsh`) 的 1 行 AI 代理生成器**

通过预连线的 MCP 工具、长期内存和网页浏览，在几秒钟内搭建一个由 **DeepSeek Harness** 提供支持的生产就绪型自主 AI 代理。

## ⚡ 快速入门

```bash
# 1-Line Scaffolding
npx create-dsh-app my-agent

# Enter project directory
cd my-agent

# Install dependencies and start
npm install
cp .env.example .env
npm start
```

## 🧩 开箱即用

每个生成的项目都预先配置有：
- 🔌 **`dsh-plugin-mcp`**：通用模型上下文协议工具和一键式服务器目录（GitHub、Postgres、SQLite、Brave Search 等）
- 🧠 **`dsh-plugin-memory`**：持久的长期知识图和用户偏好回忆
- 🌐 **`dsh-plugin-browser`**：本机无头网络浏览器导航和 Markdown 提取
- ⚡ **TypeScript 和 Cordis Lifecycle**：具有快速热重载的干净架构 (`tsx`)

## 选项

```bash
# Exclude specific plugins if not needed:
npx create-dsh-app my-minimal-agent --no-browser --no-memory
```