# DSH Image2 生图插件

你是否在 DeepSeek Harness 中遇到无法生成图片的问题？本插件为 DeepSeek Harness
增加 Image2 生图能力，可以通过第三方中转提供的 OpenAI Images 兼容接口调用
`gpt-image-2`。配置很简单，只需填写 `baseURL` 和 `API Key`，即可在对话中使用
文生图和图生图工具。

[English](./README.md)

> **第三方服务推荐（含邀请链接）**
>
> 如果你正在寻找支持 OpenAI 兼容接口的 API 中转服务，可以了解一下
> [WPIronman API 中转站](https://api.wpironman.top/register?aff=JUNE)。这是我的邀请
> 链接；通过该链接注册可能会为我带来邀请奖励，具体活动规则和优惠以服务商页面
> 为准。本插件与该服务相互独立，不要求使用任何指定中转站，请根据价格、稳定性
> 和隐私政策自行选择。

## 其他项目

需要为 DeepSeek Harness 的第三方模型配置独立的推理强度？可以查看我的另一个插件：
[DSH 推理强度设置插件](https://github.com/JuneLearn/dsh-reasoning-settings)。它支持为
自定义 Provider 和模型设置推理档位、默认强度及实际发送给 API 的参数值。

## 功能

- 在“设置 > 插件 > 插件配置”中提供独立的 **Image2 生图**配置卡片。
- 只需配置 `baseURL` 和 `API Key`；默认模型为 `gpt-image-2`。
- `baseURL` 可填写 `https://example.com/v1` 这样的简写，插件会自动补全
  `/images/generations`。
- 图生图端点默认由 `baseURL` 推导为 `/images/edits`，也可以单独配置 `editURL`。
- 提供 `image2-generate` 文生图工具，支持一次顺序生成 1~8 张图片。
- 提供 `image2-edit` 图生图工具，支持 1~8 张 PNG、JPEG 或 WebP 参考图。
- 支持自适应横版、竖版和方图，也支持传入符合约束的自定义尺寸。
- 图片保存到当前会话工作目录的 `outputs/image2/`，遇到重名时自动编号，不会覆盖
  已有文件。
- API Key 只写入 DSH credentials，不进入普通设置文档，也不会由插件状态接口返回。
- 对配置写入、响应大小、超时和参考图文件实施校验；524 和超时不会自动重试，避免
  上游已经生成图片时产生重复计费。

## 安装

### 安装前准备

- 安装 [Node.js](https://nodejs.org/)。DSH 当前支持 Node.js 22.19.x 或 24 及以上
  版本；建议使用 Node.js 24 LTS。Node.js 自带 `npm` 和 `npx`。
- 安装 [Git](https://git-scm.com/)，用于从 GitHub 仓库获取插件。
- 安装 pnpm。两种方法都需要 pnpm，因为 `dsh plugin` 会在 profile 目录中调用
  pnpm 安装或移除插件。
- 网络需要能够访问 `registry.npmjs.org` 和 `github.com`。如果当前网络无法稳定访问
  npm 或 GitHub，需要先配置可用的网络代理。
- 方法一不需要 DeepSeek Harness 源码；方法二还需要准备好该源码仓库。

可先检查环境：

```powershell
node --version
npx --version
git --version
corepack enable
pnpm --version
```

如果 `corepack enable` 因权限不足失败，请用管理员身份打开 PowerShell 后再执行一次。
也可以根据 [pnpm 官方安装说明](https://pnpm.io/installation)选择其他安装方式。

如果下载一直停在旋转符号、出现 `ECONNRESET`、`ETIMEDOUT` 或 GitHub 连接失败，
可在当前 PowerShell 窗口临时设置代理。下面的 `7890` 只是示例，请改成你自己的代理
端口：

```powershell
$proxy = "http://127.0.0.1:7890"
$env:HTTP_PROXY = $proxy
$env:HTTPS_PROXY = $proxy
$env:npm_config_proxy = $proxy
$env:npm_config_https_proxy = $proxy
```

这些环境变量只对当前 PowerShell 窗口有效，关闭窗口后不会继续生效。

### 方法一：使用 npx（普通用户推荐）

不需要克隆 DeepSeek Harness 源码，也不需要全局安装 `dsh`，但仍需先准备好 Git 和
pnpm。首次运行时，`npx` 会下载 `@deepseek-ai/dsh` 及其依赖，因此可能需要几分钟：

```powershell
npx --yes -p @deepseek-ai/dsh dsh plugin --profile web add github:JuneLearn/dsh-image2-draw
```

安装完成后，用同一种方式启动 Web：

```powershell
npx --yes -p @deepseek-ai/dsh dsh web
```

### 方法二：使用 pnpm 和 Harness 源码（开发者推荐）

这种方法适合已经克隆 `deepseek-harness`、希望直接运行源码的人。先确认 pnpm 可用：

```powershell
pnpm --version
```

进入 DeepSeek Harness 源码根目录。第一次使用源码时先安装依赖，然后安装插件：

```powershell
cd D:\deepseek-harness
pnpm install
pnpm dsh plugin --profile web add github:JuneLearn/dsh-image2-draw
```

以后从该源码目录启动 Web：

```powershell
cd D:\deepseek-harness
pnpm dsh web
```

包内的 `dsh.bundle` 声明会让 DSH 自动把插件加入 Web profile；两种安装方式都不需要
手动编辑 `cordis.patch.yml`。Web 默认使用 `http://127.0.0.1:3080`；只有该端口已被
占用或显式传入其他端口时，才会使用不同端口。

### 升级

再次执行对应的安装命令即可升级，无需先卸载，也无需手动维护 profile patch。

npx 方式：

```powershell
npx --yes -p @deepseek-ai/dsh dsh plugin --profile web add github:JuneLearn/dsh-image2-draw
```

pnpm 源码方式：

```powershell
cd D:\deepseek-harness
pnpm dsh plugin --profile web add github:JuneLearn/dsh-image2-draw
```

### 卸载

npx 方式：

```powershell
npx --yes -p @deepseek-ai/dsh dsh plugin --profile web remove dsh-image2-draw
```

pnpm 源码方式：

```powershell
cd D:\deepseek-harness
pnpm dsh plugin --profile web remove dsh-image2-draw
```

DSH 会同时移除依赖和 bundle 层。重启 `dsh web` 后，“插件配置”中的
**Image2 生图**卡片及生图工具即被移除。

## 使用

1. 打开“设置 > 插件 > 插件配置 > Image2 生图”。
2. 在 `API Key` 输入框中填写第三方中转提供的密钥。
3. 在“接口地址”中填写中转地址，例如 `https://example.com/v1`。
4. 按需修改模型、图生图端点和超时时间；通常保留默认值即可。
5. 点击“保存”，等待界面显示“已保存”。
6. 新建会话，让模型调用 `image2-generate` 生成图片，或提供参考图路径并调用
   `image2-edit`。

示例请求：

```text
调用 image2-generate，生成一张竖版的未来城市电影海报，质量设为 high。
```

```text
调用 image2-edit，参考图为 D:\images\room.png，把房间改成日式原木风，保持原有布局。
```

中转服务是否支持 `gpt-image-2`、图生图、自定义尺寸和不同质量档位，取决于服务商
实际实现。如果接口返回 HTTP 400 或 404，请核对服务商文档中的模型名和 Images
端点格式。

## 图片与请求限制

- 文生图每次可请求 1~8 张，插件按顺序逐张生成，不并发调用上游。
- 图生图支持 1~8 张参考图，单张不超过 4MB，总计不超过 32MB。
- 参考图只接受 PNG、JPEG 和 WebP，并根据文件魔数识别实际格式，而不是信任扩展名。
- 相对参考图路径以当前会话工作目录为基准。
- 默认超时为 180 秒，可配置范围为 1~3600 秒。
- 生成结果只接受 PNG、JPEG 或 WebP，远程图片下载上限为 32MB。

## 开发

```powershell
npm install
npm test
```

## 兼容性

基于 DeepSeek Harness `0.1.0-rc.6` 的公开双端插件、设置命名空间、credentials、
工具注册、客户端 slot 和 WebServer 生命周期接口开发。Harness 仍处于 Developer
Preview；升级后若插件不再加载，请先检查这些接口及 `dsh.client.inject` 声明是否发生
变化。