![Tingly Box Web UI 演示](./docs/hero.png)

> **公告：**这里是【故障记录](https://github.com/tingly-dev/tingly-box/discussions/626)。请更新至最新版本以解决已知问题。感谢您一直以来的支持。

# 刺痛盒

Tingly Box **为客服人员提供服务，协调 AI 模型，优化环境并路由请求**，以实现最高效率 - 具有内置**远程控制和安全、可定制的集成**。

![Tingly Box Web UI 演示](./docs/images/output.gif)

## 主要特点

- **代理优先模型网关** – 代理的统一端点 - 通过自动协议转换和本机代理兼容性无缝桥接 OpenAI、Anthropic、Google Gemini 等
- **代理集成** – Claude Code、OpenCode、Codex、Xcode 等的一键配置 – SDK 和 CLI 工具的透明代理
- **代理配置文件** - 使用单独的配置文件运行 Claude Code 等代理，每个配置文件可以使用不同的模型和代理配置
- **通过 IM Bot 进行远程控制** – 通过 Telegram、钉钉、飞书、Lark、微信、WeCom、Slack 和 Discord 远程控制 AI 代理
- **多租户 API 令牌** – 使用专用 API 令牌隔离每个用户的数据 – 每个用户都可以获得自己的使用情况跟踪、提供商访问和配置
- **智能路由引擎** – 根据成本、速度或自定义策略跨模型和令牌智能路由请求 - 远远超出简单的负载平衡
- **灵活的身份验证** – 支持 API 密钥和 OAuth 提供商（Claude.ai、Codex 等）— 在任何地方使用现有配额
- **视觉控制平面** – 直观的 Web UI，可一目了然地管理提供程序、路由、别名、模型和远程机器人 - 无需配置文件
- **客户端使用分析** – 直接从您的客户端跟踪每个请求的代币消耗、延迟、成本估算和模型选择
- **极快的性能** – 通常增加 **< 1ms** 的开销 – 获得灵活性而无需支付延迟税

## 快速入门

[中文](https://github.com/tingly-dev/tingly-box/issues/678#issuecomment-4273812882) | [中文](https://github.com/tingly-dev/tingly-box/issues/678#issue-4244345496)

### 安装

**来自 npm / npx（推荐）**

````bash
# 安装并运行（在没有任何参数的情况下运行时自动重启、迁移并打开 webui）
# golang 二进制版本，但为了方便使用 npx 来包装 cli
npx tingly-box@最新

# 或 -y 为方便起见
npx -y tingly-box@最新

# 如果出现任何网络问题，请尝试使用内置二进制文件进行捆绑
npx -y tingly-box-bundle@latest

# CN 支持 npm 镜像（以下之一）
npx --registry=https://registry.npmmirror.com -y tingly-box-bundle@latest
npx --registry=https://mirrors.huaweicloud.com/repository/npm/ -y tingly-box-bundle@latest
npx --registry=http://mirrors.tencent.com/npm/ -y tingly-box-bundle@latest
```

> if any trouble, please check tingly-box output, or call for an issue to help.

**Install Node & NPX**

```
#MacOS 和 Linux
## 通过 nvm 安装 Node.js LTS
卷曲-o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh |巴什

## 重启终端或者加载nvm
源~/.nvm/nvm.sh

## 安装 Node.js LTS
nvm安装--lts

## 验证安装
节点-v
npx-v
```

```
# 窗口
## Powershell 与 Winget
winget 安装 OpenJS.NodeJS.LTS

## 重新启动终端，然后验证安装
节点-v
npx-v

## 或者手动下载并安装 Node.js LTS：
https://nodejs.org/en/download
```

**From Docker (GitHub Host)**

```bash
mkdir tingly 数据
docker 运行 -d \
  --名称 tingly-box \
  -p 12580:12580 \
  -v `pwd`/tingly-data:/home/tingly/.tingly-box \
  ghcr.io/tingly-dev/tingly-box
```

**From Docker Compose (Recommend for isolated env)**

```bash
# 以分离模式构建并启动
docker-compose up -d

# 查看日志
docker-compose 日志 -f tingly-box

# 停止服务
docker-compose 下来

# 访问 http://localhost:12581 的 Web UI
#（注：使用12581端口是为了避免与12580上的主机tingly冲突）
````

### 集成指南

代理集成 - Claude Code / Claude Desktop / OpenCode / Codex / Xcode / VSCode / OpenClaw

- Claude Code（支持一键配置）
- OpenCode（支持一键配置）
- Xcode（需要手动配置）
——……

任何应用程序都可以使用。

> 我们在应用程序中提供了详细的配置指南

![代理集成演示](./docs/images/5-claude-code.png)

DeepSeek 最佳兼容性

DeepSeek 针对主流代理工作流程进行了优化，提供跨协议适配器、代理客户端、扩展上下文、视觉、Web 搜索和缓存优化的广泛兼容性。

### 模块·状态·解决什么问题
- **模块**：型号列表 · **状态**：✅ 支持 · **解决什么**：实时更新官方型号列表
- **模块**：协议适配 · **状态**： ✅ 支持 · **解决什么**：支持双向转换的官方 Anthropic/OpenAI API
- **模块**：推理能力 · **状态**：✅ 支持 · **它解决什么**：提供与思考工作流程的兼容性
- **模块**：缓存命中优化 · **状态**：✅ 支持 · **它解决了什么**：提高 DeepSeek 请求的缓存命中率
- **模块**：视觉代理 · **状态**： ✅ 支持 · **它解决什么**：使 DeepSeek 能够理解和处理图像
- **模块**：Web 搜索 · **状态**：✅ 支持 · **解决什么**：通过 Anthropic 端点调用官方 Web 工具
- **模块**：1M 上下文窗口 · **状态**：✅ 支持 · **解决什么**：启用 1M 上下文的一键设置
- **模块**：Codex 适应 · **状态**：✅ 支持 · **它解决什么**：确保与主流代理工作流程的兼容性
- **模块**：Claude Code / 桌面适配 · **状态**： ✅ 支持 · **解决什么**：确保与主流座席工作流程的兼容性

支持一键配置（如果可用）。对于需要手动设置的应用程序，提供了详细的应用内配置指南。

任何兼容的应用程序都可以使用。

> 每个应用程序内都提供详细的配置指南。

通过 IM 机器人远程控制代理 - TG / 钉钉 / 飞书 / Lark / 微信 / WecCom

Tingly Box 现在支持通过流行的 IM 平台进行远程控制。无需直接访问服务器即可与您的 AI 代理远程交互。

**支持的平台**

- ✅ 电报
- ✅ 钉钉
- ✅肺鼠
- ✅ 云雀
- ✅ 微信
- ✅ 微康

**快速设置**

1.像`http://localhost:12580`一样打开Web UI
2. 导航至 **远程** 部分
3. 配置您首选的 IM 平台机器人
4. 开始与您的客服人员远程互动

**用例**

- 从您的手机或任何设备执行任务和查询
- 具有共享代理访问权限的团队协作
- 远离工作站时监视和控制代理

![远程控制演示](./docs/images/7-remote.png)

OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-tingly-model-token",
    base_url="http://localhost:12580/tingly/openai/v1"
)

response = client.chat.completions.create(
    model="tingly-gpt",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response)
```

人择SDK

````蟒蛇
从 anthropic 导入 Anthropic

客户 = 人择（
    api_key="your-tingly-model-token",
    base_url =“http://localhost:12580/tingly/anthropic"”
）

响应 = client.messages.create(
    型号=“叮叮”，
    最大令牌=1024，
    消息=[
        {“角色”：“用户”，“内容”：“您好！”}
    ]
）
打印（响应）
```

> Tingly Box proxies requests transparently for SDKs and CLI tools.

Using OAuth Providers

You can also add OAuth providers (like Claude Code) and use your existing quota in any OpenAI-compatible tool:

```bash
# 1. 在 Web UI 中通过 OAuth 添加 Claude Code (http://localhost:12580)
# 2. 使用 Tingly Box 端点配置您的工具
```

Requests route through your OAuth-authorized provider, using your existing Claude Code quota instead of requiring a separate API key.

This works with any tool that supports OpenAI-compatible endpoints: Cherry Studio, VS Code extensions, or custom AI agents.

![OAuth Provider Demo](./docs/images/3-connect-ai.png)

Web Management UI

Launch the web management interface:

```bash
npx tingly-box@最新
“`

Then open `http://localhost:12580ZXQ3QXZweb_searchZXQ4QXZweb_fetchZXQ5QXZnpm install -g pnpm`
- **Tool**: task · **Version**: latest · **Install**: `go install github.com/go-task/task/v3/cmd/task@latest` 或 https://taskf