#dsh-plugins

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件。
每个插件一个目录；每个都是一个独立的包，有自己的
`package.json`。

### 插件 · 在 npm 上 · 它的作用
- **插件**：[`dsh-agents-swarm`](./dsh-agents-swarm) · **在 npm 上**：[`@ai4gensteam/dsh-agents-swarm`](https://www.npmjs.com/package/@ai4gensteam/dsh-agents-swarm) · **它的作用**：一个源库 - 72 个每小时定时器、一个带有转录和翻译的阅读器以及一个将其收集的内容转换为播客、摘要或报告的发布者
- **插件**：[`dsh-web-search-serper`](./dsh-web-search-serper) · **在 npm 上**：[`@ai4gensteam/dsh-web-search`](https://www.npmjs.com/package/@ai4gensteam/dsh-web-search) · **它的作用**：在可互换后端上搜索 `ctx.web` 接缝：Serper、Tavily、Brave
- **插件**：[`dsh-brand-mine`](./dsh-brand-mine) · **在 npm** 上： — · **它的作用**：侧边栏和对话英雄插槽中的品牌标记和文字标记
- **插件**：[`dsh-agent-presets`](./dsh-agent-presets) · **在 npm 上**： — · **它的作用**：代理预设保存在 git 中，在启动时发布到可写预设根目录中

搜索插件的目录名称和包名称不同：
当 Serper 是唯一后端时，目录保留了 `-serper`，该包确实
不。线束解析的始终是**包**名称。

## 安装

你首先需要一个工具——这些是一个工具的插件，而不是程序：

```sh
npm install -g @deepseek-ai/dsh
dsh --version                  # verified against 0.1.1-rc.2
```

然后将插件添加到配置文件的 `package.json` 并让线束安装
他们：

```jsonc
{
  "dependencies": {
    "@ai4gensteam/dsh-agents-swarm": "^0.3.2",
    "@ai4gensteam/dsh-web-search": "^0.3.2"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "@ai4gensteam/dsh-agents-swarm",
        "@ai4gensteam/dsh-web-search"
      ]
    }
  }
}
```

```sh
cd ~/.dsh/profiles/web && npm install
dsh web --no-open        # then open http://127.0.0.1:3080
```

捆绑包顺序是加载顺序：补丁只能看到之前应用的内容，因此
放置在它自定义的包之前的包会被它覆盖。

节点 24 或更高版本 — `dsh-agents-swarm` 使用无防护的 `node:sqlite`。

每个插件自己的自述文件涵盖了其设置和所需的密钥。什么都没有
没有它们也可以工作，并且它们都不在这个存储库中。

## 针对结账进行开发

```sh
git clone https://github.com/genesis-agents/dsh-plugins
cd dsh-plugins && ./deploy/setup.sh
```

`setup.sh` 将每个插件链接到 `~/.dsh/profiles/web` 并安装它们
依赖关系。它是幂等的，拉取后可以安全地重新运行，并且它**合并** —
您的个人资料中不属于此存储库的插件将被保留。

一个论点是，唯一真正针对每台机器的选择是源代码在哪里
图书馆生活：

```sh
./deploy/setup.sh                                # this machine owns it
./deploy/setup.sh https://box.tailnet.ts.net     # proxy to the machine that does
./deploy/setup.sh /srv/data/swarm-sources.sqlite # own one at a chosen path
```

然后用`./deploy/doctor.sh`查看结果，`./deploy/release-check.sh`
在相信任何已发布的内容之前。

## 为什么选择`lib/`

git install 获取源代码，而不是构建输出，因此消费者正在运行
否则，`dsh plugin add github:...` 将收到无法加载的包。
另一种方法是一个独立的 `prepare` 脚本 — 请参阅
线束存储库中的 `docs/user/develop/basic/publish.md` 和
[turtle-ui](https://github.com/deepseek-harness/turtle-ui) 示例。

## 文档

- [Architecture](./docs/architecture.md) — 运行内容、管道、
  数据、接缝和未自行公布的故障表
- [在 Mac mini](./docs/mac-mini.md) 上运行它——实际上是一个迁移
  已执行的步骤，包括初稿错误的步骤
- [`deploy/`](./deploy/README.md) — 设置、健康检查、自我更新、发布