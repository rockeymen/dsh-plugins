# dsh-plugins

[English](README.md) | 中文

三个面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面的插件，在该仓库之外开发，以 `@sumomok` 作用域发布到 npm。

Harness 把一切都当作插件，它的仓外扩展路径是一等公民：`$DSH_HOME/profiles/<name>` 下的 profile 在自己的 `package.json` 里列出 bundle 层，任何声明了 `dsh.bundle.patch` 的 npm 包都可以是其中一层。这里的东西不需要 fork 上游检出，也不需要给它打补丁。

## 包

### 包 · npm · 做什么
- **包**: [`packages/quote-message`](packages/quote-message) · **npm**: `@sumomok/dsh-quote-message` · **做什么**: 把当前会话中较早的内容作为原生引用 chip 带进输入框，发送后渲染成消息上方的引用卡片。
- **包**: [`packages/edit-rerun`](packages/edit-rerun) · **npm**: `@sumomok/dsh-edit-rerun` · **做什么**: 编辑较早的问题并从那一点重新运行，运行在 fork 出的子会话里。
- **包**: [`packages/balance`](packages/balance) · **npm**: `@sumomok/dsh-balance` · **做什么**: 显示 DeepSeek 账户余额，以及这套安装花掉了多少。

![编辑更早的一条提问，在 fork 出的子会话里重新运行](https://raw.githubusercontent.com/sumomok/dsh-plugins/main/assets/edit-rerun.gif)

![侧边栏余额 chip、展开的浮层，以及会话消费行](https://raw.githubusercontent.com/sumomok/dsh-plugins/main/assets/balance.gif)

录制中的账户余额已做遮挡；消费数字是真实值。

## 安装

每个包都是普通的 npm 包，声明了 `dsh.bundle.patch`，所以用 Harness 自己的 plugin 命令装进某个 profile：

```sh
dsh plugin --profile <name> add @sumomok/dsh-quote-message
dsh plugin --profile <name> add @sumomok/dsh-edit-rerun
dsh plugin --profile <name> add @sumomok/dsh-balance
```

安装会把这个包追加到 profile 的 `dsh.profile.bundles`，由它的 patch 层挂载插件；不需要往 profile 自己的 `cordis.patch.yml` 里加任何东西。三个插件都贡献浏览器侧 UI，因此 profile 需要一个组合了 Web 界面的 bundle（`@deepseek-ai/dsh-web-app`）——在 headless profile 里没有任何可看的东西。

每个发布的 tarball 都带着预构建的 `lib/`，因此安装现场从不执行构建。

## 兼容性

针对 `@deepseek-ai/*` **0.1.1-rc.2** 构建——该代次的宿主，桌面应用或源码检出均可。Node `^22.19 || >=24`。

peer 范围写成 `>=0.1.0-rc.1 <0.2.0-0` 而不是 `^0.1.0-rc.7`，因为按 semver 规则，跨越预发布版本的 caret 范围匹配不到更后面的预发布版本：`^0.1.0-rc.7` **不**满足 `0.1.1-rc.2`。每个 `@deepseek-ai/*` peer 都是可选的，所以只组合了其中一部分的宿主同样能装。

## 安全摘要

每个包自己的 README 有完整说明，这里是简版。

- **quote-message**——不联网、不碰文件系统、不做任何存储、不写自定义会话事件、不注册宿主路由或服务。被引用的文字只通过你发送的提示词到达模型，宿主把它记录为普通的 `user/message`。
- **edit-rerun**——除了客户端自己的会话 RPC（走 GUI 已有的那条连接）之外不联网，不碰文件系统，不写自定义会话事件，不注册宿主路由，没有宿主逻辑（宿主半边是空的 `apply`）。它渲染进两个已发布的插槽、调用三个已发布的客户端服务；不对宿主渲染的消息做 DOM 手术，也不安装 `MutationObserver`。
- **balance**——出站网络只到配置的服务商 origin，别处一概不去；推导后会离开该 origin 的 base URL 会被拒绝而不是发出请求。API key 每次读取时经宿主凭据缝解析一次，以 `Authorization` 头发送，从不记录、缓存、落盘，也不回传给浏览器。它暴露的两个 RPC 方法都是只读的。唯一的磁盘写入是它自己在 `$DSH_HOME/dsh-balance` 下的花费账本。

三个插件都不写自定义会话事件类型，所以卸载其中任何一个都不会留下宿主拒绝加载的会话。

## 开发

```sh
pnpm install
pnpm run build       # 各包自己的构建：先 tsc，再各自的打包器
pnpm run test        # 对每个包跑 vitest
pnpm run typecheck
pnpm run lint
```

`pnpm run test` 在全新检出上就能跑：`quote-message` 和 `edit-rerun` 的构建冒烟测试会先跑自己的打包器。`balance` 的构建冒烟测试在 `lib/` 不存在时跳过，因此想让每条断言都执行，就先 `pnpm run build` 再 `pnpm run test`。

每个包都拥有自己的整套构建，因为每个都要产出 Web 外壳模块加载器所要求的闭包工厂形式的浏览器包，共享的 node 平台配置产不出这种东西。`pnpm --filter @sumomok/dsh-<name> run build` 可以单独构建其中一个。

```
package.json          工作区根：共享工具链，无运行时依赖
pnpm-workspace.yaml   packages/*
tsconfig.base.json    每个包继承的编译器面
tsconfig.json         solution 文件；每个包一条 reference
eslint.config.js
packages/<name>/
  package.json        @sumomok/dsh-<name>
  tsconfig.json       继承 ../../tsconfig.base.json
  cordis.patch.yml    这个包贡献的 bundle 层
  src/                源码；本地相对导入带 .ts 扩展名
  tests/              vitest 用例
  lib/                构建产物（git 忽略；随 npm tarball 发布）
```

`lib/` 在这里被 git 忽略，同时列在每个 manifest 的 `files` 里，因此仓库只带源码，而每个发布的 tarball 都带着预构建产物。

## 许可

MIT。