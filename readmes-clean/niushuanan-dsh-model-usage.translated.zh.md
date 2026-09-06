# dsh-model-usage

在设置页按提供方查看模型额度、周期和刷新状态，只在用户打开页面时加载数据。

![多个模型提供方的用量卡片](docs/14-model-usage.webp)

## 安装

1. 打开 [Releases](https://github.com/niushuanan/dsh-model-usage/releases/latest)，下载附带的 ZIP。
2. 把 ZIP 交给能够读取并修改目标 DSH 项目的 AI。
3. 对 AI 说：**先阅读压缩包里的 AGENTS.md、INSTALL.md 和 manifest.json，只安装这个插件，并保留现有插件、数据、对话、附件和设置。**
4. 安装 AI 会按目标 DSH 的当前结构合入代码和 Cordis 行，只验证本插件直接涉及的入口。

## 内容

- `payload/`：从主仓库复制的插件代码和必要运行资源。
- `manifest.json`：插件组成、来源、主仓库 commit 和逐文件 SHA-256。
- `INSTALL.md`：直接安装、冲突适配、失败恢复和最小验证说明。
- `docs/`：当前版本的真实产品截图。

## 来源与许可

本仓库是 [Xiaozhuang DSH](https://github.com/niushuanan/xiaozhuang-dsh) 的单向发布副本，不是独立开发源。当前内容同步自主仓库 commit [`49b1c5207b`](https://github.com/niushuanan/xiaozhuang-dsh/commit/49b1c5207b1556515752c6bf9e7902c1a5964ad9)，版本为 [`xiaozhuang-v0.4.2`](https://github.com/niushuanan/dsh-model-usage/releases/tag/xiaozhuang-v0.4.2)。代码采用 [MIT License](LICENSE)。