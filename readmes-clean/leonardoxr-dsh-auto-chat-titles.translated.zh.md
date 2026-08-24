#dsh-auto-chat-titles

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).] 的语义、可配置聊天标题。

该插件保留了 DSH 的持久会话标题服务，并仅替换其内置的提供商策略。它补充道：

- 语义法学硕士学位，而不是依赖第一个单词的后备；
- **设置→插件**中的专用标题模型选择器；
- **在对话标题中重新生成标题**；
- 从最近的人类信息背景中再生；
- 实时标题长度、上下文、字节、令牌和超时设置；
- 现有的 DSH 取消、标准化、持久性、出处、固定和投影行为。

## 要求

- DeepSeek Harness 0.1.1-rc.2 或更新的兼容 0.1.x 预发行版
- Node.js 22+
- 具有标准会话标题、设置、命令和客户端运行时捆绑包的 Web 配置文件

## 安装

直接来自GitHub：

```sh
dsh plugin --profile web add github:leonardoxr/dsh-auto-chat-titles
```

发布后来自 npm：

```sh
dsh plugin --profile web add dsh-auto-chat-titles
```

从开发时的结账来看：

```sh
npm install
npm run check
dsh plugin --profile web add "C:/absolute/path/to/dsh-auto-chat-titles"
```

主机或捆绑补丁更改后重新启动 Web 配置文件，然后刷新现有 DSH 网页。对于仅浏览器开发，运行 `npm run watch:client`；当活动 Web 运行时启用其 HMR 链时，DSH 客户端 HMR 可以重新挂载重建的捆绑包。

## 它是如何组成的

捆绑的 `cordis.patch.yml` 仅禁用基本 `session-title-llm` 行并插入此插件。它故意启用核心 `session-title` 服务。 DSH 一次支持一个异步标题提供程序，因此启用两个提供程序行会发生错误。

自动生成使用第一条符合条件的人工消息。单击“重新生成标题”显式调用相同的持久服务，并使用最多配置的最近人工消息数量。手动重命名继续固定标题；显式再生故意取消固定并替换它。

## 设置

打开 **设置 → 插件 → 自动聊天标题**。

- **标题模型** — 继承确切的对话路由或选择主机目录公布的任何模型。
- **标题长度** — 非 CJK 语言的目标词。
- **再生上下文** — 手动再生中包含的最近人类消息的数量。
- **高级生成限制** — CJK 长度、帧输入字节、输出令牌和超时。

当安装标准文件设置提供程序时，这些设置存储在 `auto-chat-titles` 下的 `$DSH_HOME/settings.yaml` 中。

## 命令

UI 操作调用 `/regenerate-title`。也可以直接在composer中输入。该按钮确认命令接纳；对话活动报告最终的生成结果。命令生命周期事件保留在会话审核日志中，生成的标题将保留为 DSH 的标准 `session/title` 事件。

## 发展

```sh
npm install
npm run typecheck
npm test
npm run build
node scripts/preflight.mjs
npm pack --dry-run
```

主机部分编译为 `lib/`。浏览器一半编译为 `client/client.js` 中的 DSH 惰性 CJS 模块。