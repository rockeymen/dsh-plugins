# 🦞 Awesome AI Pedia

**一个全面的 AI 知识库与博客平台**

[🔥 在线访问](https://awesome-ai-pedia.github.io/Awesome-AI-Pedia/) · [🚀 快速开始](#-快速开始) · [📚 内容目录](#-知识库分类) · [🤝 联系方式](#-联系方式)

## ✨ 项目简介

**Awesome AI Pedia** 是一个现代化 AI 知识库，
旨在为开发者提供全面的 AI 工具使用指南、最佳实践和实战经验分享。

### 🎯 核心特性

- **📚 全方位覆盖** — 从 Claude Code、Cursor、MCP，到 Agent、Skills、Prompt 工程等主流 AI 方向
- **💡 实战导向** — 从真实项目出发，提供可落地的解决方案
- **🔍 本地搜索** — 内置全文搜索，快速定位所需内容
- **🌙 暗黑主题** — 默认暗色界面，长时间阅读不刺眼
- **🚀 自动部署** — 推送到 `master` 自动构建并发布到 GitHub Pages

## 📂 知识库分类

> 以下分类均对应仓库根目录的实际目录，可直接进入查看原始 Markdown。

### 🤖 AI 编码助手

### 🔌 生态与协议

### 💬 提示词与规则

### 🛠️ 技能与工具

### 📚 学习与实战

## 🚀 快速开始

### 方法一：使用启动脚本（推荐）

```bash
git clone https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia.git
cd Awesome-AI-Pedia

# 首次运行需要授予执行权限
chmod +x start.sh

# 一键启动：自动检查 Node 版本、安装依赖、启动 dev server
./start.sh
```

## 🗂️ 项目结构

```
Awesome-AI-Pedia/
├── docs/                    # VitePress 站点入口
│   ├── .vitepress/          # 配置、主题、侧边栏生成器
│   ├── blog/                # 博客文章
│   └── index.md             # 首页
├── claudeCode/              # 各知识分类目录（会被 VitePress 收录）
├── cursor/
├── mcp/
├── skills/
├── ...                      # 其他分类目录
├── scripts/                 # 构建辅助脚本
├── .github/workflows/       # GitHub Actions 自动部署
├── start.sh                 # 一键启动脚本
└── package.json
```

VitePress 通过 `srcDir: '../'` 将整个仓库根目录作为文档源，
侧边栏由 `docs/.vitepress/utils/sidebar.ts` 自动扫描生成。

## 📞 联系方式

微信搜索 **硬核 AI 社** 回复「加群」，加入 AI 交流群，一起学习 AI。

- GitHub Issues：[提交问题或建议](https://github.com/Awesome-AI-Pedia/Awesome-AI-Pedia/issues)
- 项目主页：<https://awesome-ai-pedia.github.io/Awesome-AI-Pedia/>

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [AI-leader](https://github.com/Awesome-AI-Pedia/)

愿 AI 早点成为你最好的工作伙伴！

  
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://api.star-history.com/svg?repos=Awesome-AI-Pedia/Awesome-AI-Pedia&type=Date&theme=dark&sealed_token=1gibffw3ntz8oBm4RSwf9rZxw6JqYs3bqUUY8fJhCnezWe6PXZ1RQM6spAw-ZTmAv8-nDGRq99kPO5hkveWE2dXFT1ZSDfj5FIQS7qARG1sA6u5ZwflT_w"
    />
    <source
      media="(prefers-color-scheme: light)"
      srcset="https://api.star-history.com/svg?repos=Awesome-AI-Pedia/Awesome-AI-Pedia&type=Date&sealed_token=1gibffw3ntz8oBm4RSwf9rZxw6JqYs3bqUUY8fJhCnezWe6PXZ1RQM6spAw-ZTmAv8-nDGRq99kPO5hkveWE2dXFT1ZSDfj5FIQS7qARG1sA6u5ZwflT_w"
    />
    <img
      alt="Star History Chart"
      src="https://api.star-history.com/svg?repos=Awesome-AI-Pedia/Awesome-AI-Pedia&type=Date&sealed_token=1gibffw3ntz8oBm4RSwf9rZxw6JqYs3bqUUY8fJhCnezWe6PXZ1RQM6spAw-ZTmAv8-nDGRq99kPO5hkveWE2dXFT1ZSDfj5FIQS7qARG1sA6u5ZwflT_w"
      width="720"
    />