# @picgo/dsh-plugin

从 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)，由 [PicGo](https://picgo.app/) 提供支持] 上传图像和文件到您的图像主机。

Harness 可以向您的代理显示屏幕截图，但它无法将本地文件转换为链接。因此，当代理编写自述文件、呈现图表或捕获屏幕截图时，图像会保留在磁盘上，而 `![](./out.png)` 在您推送时就会成为死链接。这个插件弥补了这一差距。

它通过 **您已在 PicGo 中配置的任何图像主机上传 - PicGo Cloud、GitHub、S3、腾讯 COS、七牛或您安装的任何第三方上传器插件。无需重新配置。如果您从未使用过 PicGo，它会带您进入 PicGo Cloud 的免费套餐。

## 安装

```sh
dsh plugin --profile web add @picgo/dsh-plugin
```

然后像往常一样启动：

```sh
dsh --profile web
```

## 你得到什么

**`picgo_upload`** - 当本地文件需要成为链接时模型自行调用的工具。返回结构化结果，因此在代码模式下可以直接使用它：

```js
const { uploaded } = await tools.picgo_upload({ paths: ['/tmp/chart.png'] })
console.log(uploaded[0].imgUrl)
```

**`/picgo`** — 无需花费模型回合即可上传的命令：

### 命令·它的作用
- **命令**：`/picgo` · **它的作用**：上传剪贴板图像
- **命令**：`/picgo ...` · **作用**：上传一个或多个文件
- **命令**：`/picgo status` · **作用**：显示活动主机和登录状态
- **命令**：`/picgo login [token]` · **作用**：登录 PicGo Cloud
- **命令**：`/picgo logout` · **它的作用**：注销

**一项捆绑技能**，教导模型*何时*上传（主要情况是在文档中插入屏幕截图）以及何时不上传（您指定了特定目的地，您想要本地副本）。

## 第一次运行

如果您从未配置过 PicGo，则默认上传到 **PicGo Cloud**，这需要一次性登录。免费套餐涵盖休闲使用。

```
/picgo login
```

这将打开您的浏览器并在完成时报告。如果您已经从 PicGo Cloud 仪表板获得了令牌，则 `/picgo login <token>` 是即时的。

该模型永远不会为您运行此操作：如果没有令牌，登录会阻止等待浏览器回调，这将挂起会话。它转发指令并等待。

已经在 PicGo 中使用 GitHub、S3 或其他主机？这些都不适用 - 您现有的配置按原样使用，并且不涉及登录。

## 配置

每个字段都有一个工作默认值。从您的个人资料的 `cordis.patch.yml` 覆盖它们：

```yaml
- id: picgo
  name: '@picgo/dsh-plugin'
  config:
    silent: true
    timeoutMs: 120000
```

### 字段·默认值·含义
- **字段**：`configPath` · **默认**：`''` · **含义**：PicGo 配置文件；空使用PicGo自己的默认值（`~/.picgo/config.json`）
- **字段**：`silent` · **默认**：`true` · **含义**：禁止PicGo的控制台输出及其`picgo.log`写入
- **字段**：`timeoutMs` · **默认**：`120000` · **含义**：一次上传等待多长时间
- **字段**：`registerSkill` · **默认**：`true` · **含义**：注册绑定的`picgo-upload`技能
- **字段**：`registerCommand` · **默认**：`true` · **含义**：注册`/picgo`命令
- **字段**：`announceSignIn` · **默认**：`true` · **含义**：启动时，将已注销的 PicGo Cloud 用户指向 `/picgo login`

补丁会替换一行的**整个** `config`，而不是合并键，因此请重申您要保留的每个字段。

## 注释

**上传的链接是公开的。**知道该 URL 的任何人都可以打开它，并且已删除的文件可能会保留缓存。适合屏幕截图和文档图像；上传合同 PDF 或内部档案之前请三思。捆绑技能告诉模型首先确认任何看起来敏感的东西。

**您的 PicGo 配置被视为只读**，但有一个例外超出此插件的控制范围：当 PicGo Cloud 拒绝存储的令牌时，PicGo 本身会从 `~/.picgo/config.json` 中清除它。正如您所期望的，通过 `/picgo login` / `/picgo logout` 登录和注销也会写入令牌。

**剪贴板上传需要桌面会话**并且只能通过 `/picgo` 访问 - 该模型从未提供上传剪贴板的方法，因为它不知道上面有什么。

## 发展

```sh
pnpm install
pnpm build
pnpm test
```

要在不打包的情况下针对 dsh 源签出运行它，请编写 `cordis.dev.yml` （gitignored - 路径特定于您的计算机）：

```yaml
- insert:
    - id: picgo
      name: '/absolute/path/to/dsh-plugin/lib/index.js'
```

然后，从dsh结帐：

```sh
pnpm dsh web --patch /absolute/path/to/dsh-plugin/cordis.dev.yml
```

该路径必须是绝对路径：补丁添加配置但不会移动加载程序的解析根。

### 释放

`@picgo/bump-version` 一步升级版本、写入变更日志、提交和标签：

```sh
pnpm release          # patch: 0.1.0 -> 0.1.1
pnpm release:minor    # 0.1.0 -> 0.2.0
pnpm release:major    # 0.1.0 -> 1.0.0
pnpm release:beta     # 0.1.0 -> 0.1.1-beta.0
pnpm release:dry      # print what would happen, change nothing
```

然后推送标签——这就是触发发布的原因：

```sh
pnpm push-release
```

`release` 工作流程在发布前运行类型检查、测试和构建，如果标签与 `package.json` 不匹配，则拒绝发布。预发行标签选择自己的发行标签（`-beta.x`→`beta`，`-alpha.x`→`alpha`，任何其他预发行→`next`），因此`npm install @picgo/dsh-plugin`永远不会解析为预发行。

#### npm 身份验证

npm 无法为尚不存在的包配置受信任的发布者，因此第一个版本和以后的每个版本的身份验证都不同。

**首次发布** — 需要 `NPM_TOKEN` 存储库机密（具有 `@picgo` 范围发布权限的粒度令牌）：

```sh
gh secret set NPM_TOKEN --repo PicGo/dsh-plugin
```

**第一个版本发布后**，切换到可信发布，这样就不会涉及长期存在的令牌。在 npmjs.com 上，打开包 → 设置 → 受信任的发布者，然后注册：

### 字段·值
- **字段**：发布者 · **值**：GitHub 操作
- **字段**：组织或用户 · **值**：`PicGo`
- **字段**：存储库·**值**：`dsh-plugin`
- **字段**：工作流程文件名 · **值**：`release.yml`（仅文件名，不是路径）
- **字段**：环境名称 · **值**：留空
- **字段**：允许的操作 · **值**：`npm publish`

工作流程已经设置了 `id-token: write`，因此这方面没有任何变化 - npm 自动选择 OIDC 而不是令牌。可信发布发布成功后，删除 `NPM_TOKEN` 密钥并撤销令牌，然后将“设置”→“发布访问权限”设置为“需要双因素身份验证并禁止令牌”。

可信发布需要 npm ≥ 11.5.1，因此发布工作流在 Node 24（附带 npm 11.x）上运行。 Node 22 附带 npm 10.x，并失败并显示误导性的 404。该选择仅影响执行发布的机器 - 包本身仍然支持 Node `^22.19.0 || >=24.0.0` 以及针对 22 的 CI 测试。

## 兼容性

针对 DeepSeek Harness `0.1.0-rc.5`（提交 `47f9438`，2026-08-13）和 PicGo Core 3.0.1 进行测试。需要节点 `^22.19.0 || >=24.0.0`。

Harness 是开发者预览版，其 API 经常变化。如果某个版本破坏了此插件，请[打开问题](https://github.com/PicGo/dsh-plugin/issues)。