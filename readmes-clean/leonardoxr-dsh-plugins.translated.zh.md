# DSH 插件

DeepSeek Harness 插件的主存储库。每个插件仍然是一个独立的 Git 存储库，并作为 Git 子模块包含在此处，因此插件历史记录、分支、版本和 CI 保持隔离。

## 插件

### 插件·存储库·目的
- **插件**：[dsh-自动聊天标题](./dsh-auto-chat-titles) · **存储库**：[leonardoxr/dsh-自动聊天标题](https://github.com/leonardoxr/dsh-auto-chat-titles) · **用途**：语义、可配置的聊天标题
- **插件**：[dsh-better-sidebar](./dsh-better-sidebar) · **存储库**：[leonardoxr/DSH-better-sidebar](https://github.com/leonardoxr/DSH-better-sidebar) · **用途**：侧边栏工作台和扩展 API
- **插件**：[dsh-codex-usage](./dsh-codex-usage) · **存储库**：[leonardoxr/dsh-codex-usage](https://github.com/leonardoxr/dsh-codex-usage) · **用途**：Codex 使用 UI
- **插件**：[dsh-companion](./dsh-companion) · **存储库**：[leonardoxr/dsh-companion](https://github.com/leonardoxr/dsh-companion) · **用途**：只读工作区/会话 API 和通知
- **插件**：[dsh-native](./dsh-native) · **存储库**：[leonardoxr/dsh-native](https://github.com/leonardoxr/dsh-native) · **用途**：用于 DSH Web 服务器的本机桌面和移动 shell
- **插件**：[dsh-routed-subagent](./dsh-routed-subagent) · **存储库**：[leonardoxr/dsh-routed-subagent](https://github.com/leonardoxr/dsh-routed-subagent) · **目的**：复杂性路由子代理委托
- **插件**：[dsh-workspace-git](./dsh-workspace-git) · **存储库**：[leonardoxr/dsh-workspace-git](https://github.com/leonardoxr/dsh-workspace-git) · **用途**：工作区 Git 集成

## 存储库模型

- 该存储库协调插件集合；它不会合并他们的历史。
- 插件目录是独立的Git存储库。使用 `git -C  ...` 进行插件工作。
- 使用 `git -C  pull` 更新主存储库中的固定插件版本，然后使用 `git add `。
- 不要在此处或插件内提交 DSH 源代码更改。插件必须通过 DSH 配置文件和 `cordis.patch.yml` 机制安装。
- 代码更改遵循每个插件的贡献规则；可以在此处进行仅文档集合更改。

## DSH 插件行为

插件是带有可选主机和客户端部分的 Cordis 模块。包清单声明了 DSH 捆绑补丁和客户端注入元数据。主机代码必须使用公共DSH服务/路由；客户端代码必须使用注入的服务并且必须干净地卸载。

对于更好的侧边栏集成，请参阅[`dsh-better-sidebar/AGENTS.md`](./dsh-better-sidebar/AGENTS.md)。关键规则：使用 `inject = ['betterSidebar']`，通过 `ctx.betterSidebar` 注册选项卡/查看器，在 `ctx.effect()` 中包装注册，以便处理程序是 HMR 安全的，使用包前缀 ID，并将 `dsh-better-sidebar` 保留为可选的对等依赖项。该服务仅存在于客户端。

## 本地开发

```sh
# Clone this collection with plugin repositories
git clone --recurse-submodules <master-repository-url> dsh-plugins

# Initialize plugins after a normal clone
git submodule update --init --recursive

# Work inside one plugin
cd dsh-better-sidebar
pnpm install
pnpm build
```

使用官方插件机制将本地插件安装到 DSH Web 配置文件中，然后刷新现有的 DSH UI。请勿修改 DSH 结帐。

## 文档参考

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
- [DSH插件注册表](https://github.com/dsh-external/plugin-registry)
- [better-sidebar消费指南](./dsh-better-sidebar/AGENTS.md)