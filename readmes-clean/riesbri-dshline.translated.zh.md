![dshline：DeepSeek Harness 的终端本机前端。利用插件通过功能合约流入本机终端 UI.](.github/assets/dshline-hero.svg)

#dshline

**[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件生态系统的终端本机前端。**

## 安装

```sh
dsh plugin --profile dshline add @dshline/dshline
dsh --profile dshline
```

请参阅 [Install](docs/install.md) 了解要求、验证、`dshline` 启动器和源安装。

> [!警告]
> 沙箱和工具权限由活动的 Harness 配置文件控制；普通工具调用可以在没有每次调用审查的情况下运行。在重要代码上使用dshline之前请参阅[权限和沙箱](docs/usage.md#permissions-and-the-sandbox)。

## 为什么是dshline？

利用插件发布功能； dshline 在终端中呈现本机支持的功能。它在进程内运行并使用 Harness 合约，而不是创建单独的提供程序运行时、状态存储或策略。

`Harness plugin → standard capability → dshline presentation adapter → native terminal UI`

Harness 拥有功能、状态、运行时、持久性和策略。 dshline拥有终端演示。

  ![从 DeepSeek Harness 插件通过标准功能界面和 dshline 适配器到具有真正回滚功能的本机终端 UI 的功能流。](.github/assets/dshline-architecture.svg)

### 通用能力集成

dshline 通过标准 Harness 功能而不是提供商特定的代码进行集成。工作消耗`ctx.jobs`和`ctx.subagents`；会话使用`ctx.sessionQuery`； `/connect` 使用 Harness 的模型、设置、凭证和授权服务； `/plugins`通过`ctx.agentPresets`读取并切换运行代理的组成。因此，新的提供程序可以流经现有接口，而不需要专用的 dshline 实现。

它不提供提供者列表，也没有登录协议：`/connect` 提供安装的适配器声明的可配置的任何内容，并运行 Harness 注册的任何流程，因此可以通过一个设置文档和一个凭证存储从终端和官方 Web 模型页面访问相同的提供者。

有关功能模型和当前适配器边界，请参阅[Architecture](docs/architecture.md)]。

### 本机终端设计

完成的输出被提交给真正的终端回滚并且永远不会被重写。正常滚动、选择和复制继续工作，而 dshline 仅重绘有界的活动区域。独立于 Harness 的渲染器保持较小、依赖性较轻，并专注于终端正确性：宽度、Unicode、转义、键和安全重绘。

请参阅 [Design](docs/design.md) 了解终端不变量和 [Comparison](docs/comparison.md) 了解权衡。

## 使用dshline

键入 `/` 以发现活动 Harness 配置文件中可用的命令和功能。

- `/sessions` — 浏览并恢复 Harness 会话
- `/work` — 检查工作和子代理
- `/connect` — 通过 Harness 配置提供商
- `/plugins` — 浏览、搜索和自定义正在运行的代理的 Harness 预设组合
- `/todos` — 检查预计的 Todo 状态
- `/model` — 切换注册型号

[用法](docs/usage.md) 涵盖密钥、会话、命令和权限指导。

## 文档

- [安装](docs/install.md)
- [用法](docs/usage.md)
- [架构](docs/architecture.md)
- [设计](docs/design.md)
- [路线图](ROADMAP.md)
- [比较](docs/comparison.md)
- [投稿](CONTRIBUTING.md)
- [安全](SECURITY.md)