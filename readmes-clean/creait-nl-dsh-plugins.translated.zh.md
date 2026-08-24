#dsh-plugins

[DeepSeek Harness](https://github.com/deepseek-ai) 的插件。一个仓库，七个
软件包，以 `@creait` 独立发布。他们从运行 dsh 中出来
与自托管模型相比，每个模型都弥补了安全带留下的空白。

### 包 · 它的作用 · 为什么
- **包**：**[hookkit](./hookkit)**`@creait/dsh-hookkit` · **它的作用**：配置驱动的生命周期挂钩，**包括上下文注入**。在 YAML 中声明 `event → handler → outcome`。 · **为什么**：dsh 有接缝（`agent/pre-step`、`tools/pre-execute`，...），但达到这些接缝意味着编写一个插件。这会将它们变成配置。
- **包**：**[gen-limit](./gen-limit)**`@creait/dsh-gen-limit` · **它的作用**：每个提供程序/模型并发上限，在子代理生成和流中强制执行，并带有设置卡。 · **为什么**：一个自托管 GPU 确实有上限；子代理的扇出会找到它。拒绝重生会导致孩子不透明地死亡。
- **包**：**[web-search-searxng](./web-search-searxng)**`@creait/dsh-web-search-searxng` · **它的作用**：将 `web_search` 指向自托管的 SearXNG 实例而不是本机路由。 · **为什么**：搜索而不将每个查询交给第三方。
- **包**：**[web-fetch](./web-fetch)**`@creait/dsh-web-fetch` · **它的作用**：`ctx.web` 后面受保护的本地获取提供程序，在解析的地址上具有 SSRF 阻塞。 · **为什么**：dsh 完全实现了 `web_fetch`，但没有提供提供程序，因此该工具存在，并且每次调用都会失败。
- **包**：**[研究模式](./research-mode)**`@creait/dsh-research-mode` · **它的作用**：作为代理进行深入研究 **模式**：一个固定的、经过审查的循环，以自适应并行轮次进行规划、研究、综合和审查。 · **为什么**：模型每次调用重写的循环都会在每次调用时重新产生相同的错误。将其作为预设提供也可以将其排除在非研究之外的每个会话之外。
- **包**：**[think-level](./think-level)**`@creait/dsh-think-level` · **它的作用**：每个提供者和模型的推理工作，加上一个控件来更改您所在的会话。 · **为什么**：dsh 的工作量下拉菜单是每个会话并且不记得的，因此“这个模型应该努力思考”在每个新对话中都会重新输入。根本不会询问子代理。
- **包**：**[工具披露](./tool-disclosure)**`@creait/dsh-tool-disclosure` · **它的作用**：渐进式工具披露：一组延迟的工具消耗一个目录行，直到模型使用 `tool_search` 加载它。 · **为什么**：dsh 在每次请求时都会宣传每个已安装的工具。 MCP 服务器的 24 个浏览器模式约为每个会话收取 4.4k 令牌，包括从不打开浏览器的会话。

hookkit 是通用型的：一种小型引擎，运送时**没有钩子
自己** — 13 个生命周期事件 × 3 种处理程序类型（进程内工具、shell、HTTP）×
3 个结果（注入上下文、拒绝呼叫、即发即弃）。这就是使
像内存这样的东西会调用配置更改而不是插件。其余的是
单一目的。 web-search-searxng 和 web-fetch 都是相同的提供者
`ctx.web` 缝合和组合：它们一起提供代理搜索和页面阅读
无需第三方往返。研究模式需要安装 web-fetch —
如果没有它，研究人员的搜索片段就会受到限制。

## 安装

每个软件包都会单独安装 - 您不需要其他软件包：

```sh
dsh plugin --profile web add @creait/dsh-hookkit
```

每个包都会附带自己的捆绑补丁，因此该命令会挂载该行而不是
而不是仅仅记录依赖关系。安装与开启不同：
两个 `ctx.web` 提供程序自行注册，然后等待被指向
某些东西，并且 hookkit 安装时没有声明任何钩子。每个自述文件都说明了哪个
键完成工作。

## 开发

这些包从您拥有的线束中解决了它们的 dsh 对等依赖关系
安装，而不是从注册表，所以你总是在构建
您实际运行的版本：

```sh
DSH="$(npm root -g)/@deepseek-ai/dsh/node_modules/@deepseek-ai"
mkdir -p node_modules/@deepseek-ai
for p in cordis dsh-llm dsh-settings dsh-web schemastery; do
  ln -sfn "$DSH/$p" "node_modules/@deepseek-ai/$p"
done
```

然后：

```sh
pnpm test        # 531 tests across the seven packages
```

不要在根目录运行 `pnpm install` — 它会将这些符号链接替换为
已发布的副本可能与您的安全带不匹配。

要针对实时线束运行签出，请将包目录链接到
简介：

```jsonc
// ~/.dsh/profiles/web/package.json
"dependencies": {
  "@creait/dsh-hookkit": "link:/path/to/dsh-plugins/hookkit"
}
```

然后在配置文件中添加 `pnpm install` 并重新启动 `dsh web`。启动清单是
在启动时构建，因此添加插件需要重新启动 - 编辑链接的插件
没有。

## 发布

版本独立；仅发布更改的内容：

```sh
cd hookkit && npm publish --access public
```

`pnpm publish-all` 会处理每个有新版本的软件包。范围包
默认为受限制，因此 `--access public` 对包的第一个很重要
发布。

## 警告

所有七个都绑定到 1.0 之前的内部 dsh 接缝，没有兼容性保证。
`peerDependencies` 固定每个版本所针对的版本；线束升级
可以移动他们。每个自述文件都有一个“是什么破坏了这个”部分。