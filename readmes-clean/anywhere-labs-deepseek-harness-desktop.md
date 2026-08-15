# DeepSeek Harness Desktop

### 为DeepSeek Harness生态打造的现代化桌面端体验（插件）

<h4 align="center">
  DeepSeek Harness 官方目前通过命令行启动本地 Web UI。本项目将服务启动、运行管理和桌面窗口整合为开箱即用的桌面体验，让用户无需配置 Node.js 或执行命令，即可直接使用。
</h4>

### Download Desktop

  ![DeepSeek Harness Desktop 界面预览](assets/desktop-preview.png)

## 主要功能

<table>
  <tr>
    <td width="50%" valign="top">
      ### Desktop
      把官方 DeepSeek Harness 的本地 Web UI 带到原生桌面。应用自动启动和管理本地 Harness 服务，集成系统托盘与桌面窗口，无需安装 Node.js 或执行命令。
    </td>
    <td width="50%" valign="top">
      通过 iOS 和 Android 远程连接 Desktop，在手机上发起任务、查看 Agent 进度，并在需要时继续跟进。
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      Harness 遵循“一切皆插件”的架构。桌面端插件市场将提供插件的发现、安装、更新和管理，让模型、工具、界面与工作流能力按需组合。
    </td>
    <td width="50%" valign="top">
      接入微信、飞书、Discord、WhatsApp 等 IM 通道，直接在日常聊天工具中向 Agent 发起任务、接收进度并继续对话。
    </td>
  </tr>
</table>

## 插件生态

DeepSeek Harness 基于 [Cordis](https://github.com/cordiverse/cordis) 构建，并采用“一切皆插件”的架构。模型适配器、工具注册表、会话日志和 Agent Loop 等核心能力都以插件参与运行，可以通过配置自由组合或替换；外部插件也可以通过 profile 与 bundle 接入现有运行时。详见官方的[架构说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)和[插件管理文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/cli/reference/README.md#plugin-management)。

我们希望 Desktop 不只是一个独立的桌面封装，而是 DeepSeek Harness 插件生态中的桌面入口。后续计划将桌面能力按官方插件机制重新组织，让服务管理、系统集成和插件市场可以沿用 Harness 的组合方式接入。

> **即将推出：** Desktop 目前还不是以 DeepSeek Harness 插件形式交付，上述插件化能力仍在开发中。

## 与官方项目的关系

本项目基于 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 构建。

DeepSeek Harness 的核心能力、插件系统和 Web UI 来自官方项目。本项目主要负责：

- 桌面应用封装
- 本地服务生命周期管理
- 桌面窗口和系统托盘集成
- macOS、Windows 安装包构建与发布
- 桌面环境下的界面适配

如果你希望通过命令行运行 Harness，或者参与核心功能开发，请优先查看官方仓库。

## 开发

桌面端代码位于：

```text
apps/desktop
```

安装依赖并启动桌面应用：

```sh
pnpm install
pnpm run dev:desktop
```

## 社区交流

可选择常用的平台参与讨论，交流使用问题、插件开发和项目进展。

<table>
  <thead>
    <tr>
      <th align="center">微信群</th>
      <th align="center">QQ群</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">![DeepSeek Harness Desktop 微信群二维码](assets/community-wechat-group.png)</td>
      <td align="center">![DeepSeek Harness Desktop QQ群二维码](assets/community-qq-group.jpg)</td>
    </tr>
  </tbody>
</table>

Discord：[加入 DeepSeek Harness Desktop 社区](https://discord.gg/TJeGqKRNM)

## 友情链接

这里收录 DeepSeek Harness 生态项目及开发者工具。

| 项目 | 简介 | 链接 |
| --- | --- | --- |
| DeepSeek Harness 橙皮书 | DeepSeek Harness 社区实测手册。 | [GitHub](https://github.com/alchaincyf/deepseek-harness-orange-book) |
| Awesome DSH Plugin | DeepSeek Harness 社区插件精选列表。 | [GitHub](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) · [官网](https://awesome-dsh-plugin.com) |
| dsh-web-ui | DeepSeek Harness Web UI 插件与皮肤合集。 | [GitHub](https://github.com/zhu1090093659/dsh-web-ui) · [展示站](https://gallery.dsh-market.com) |
| dsh-TUI | DeepSeek Harness 全屏交互式终端界面。 | [GitHub](https://github.com/ccch1mneyyy/dsh-TUI) |
| Agents-Anywhere | 从手机远程控制电脑上的 Coding Agent。 | [GitHub](https://github.com/anywhere-labs/Agents-Anywhere) |
| MkSaaS · TanStarter（赞助商） | 面向独立开发者的商业 SaaS 启动模板。MkSaaS 基于 Next.js，TanStarter 基于 TanStack Start 与 Cloudflare，内置 AI、认证、支付和后台等常用能力。 | [MkSaaS](https://mksaas.com) · [TanStarter](https://tanstarter.dev) |

<sub>如果希望收录您的项目，欢迎加入微信群并私信 @王博升Benson。</sub>