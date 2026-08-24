#dsh-freeweb

无钥匙网络搜索 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)。
没有 API 密钥。没有注册。无配额所有者。

## 它是什么

一个[`WebSearchProvider`](docs/dsh.md)插件，用于dsh的Web能力接缝
（`ctx.web`）。它保留了 dsh 的内置 `web_search` 工具、引文卡和 UI
与它们完全相同，并且仅交换它们后面的引擎。查询扇出到
三个独立的无钥匙发动机 - 加上可选的第四个 - 然后回来
一个共识排名的答案。

### 引擎·种类·需求
- **引擎**：**DuckDuckGo** (`html.duckduckgo.com`) · **种类**：HTML 抓取工具；具有自动 GET 回退功能的 POST · **需要**：无
- **引擎**：**起始页** (`startpage.com/sp/search`) · **种类**：隐私代理背后的 Google 索引；在纯 Node 中解决其 Anubis SHA-256 工作量证明 · **需要**：无
- **引擎**：**困惑**（`perplexity.ai/rest/sse/perplexity_ask`，匿名）· **种类**：综合答案+ SSE 上引用的来源· **需要**：什么都没有
- **引擎**：**Firecrawl**（`api.firecrawl.dev/v2/search`，可选） · **种类**：SERP 支持的结果，原生 Google 运营商 · **需要**：API 密钥（env `FIRECRAWL_API_KEY`）或自托管端点； **自动跳过没有**

## 安装

需要 [Node.js](https://nodejs.org) ≥ 20.3 和 dsh。没有别的了。

**直接来自 GitHub — 无需 npm 帐户：**

```sh
npx -y @deepseek-ai/dsh plugin --profile web add wiselfx/dsh-freeweb
```

`dsh plugin` 将安装规范逐字转发到 pnpm，因此 `owner/repo` 完整
`https://github.com/…​.git` URL 和固定参考 (`owner/repo#v0.1.0`) 全部
工作 — 该包是从 GitHub 获取并激活的，因为它声明了一个
dsh 捆绑包。

**本地结账：**

```sh
npx -y @deepseek-ai/dsh plugin --profile web add /path/to/dsh-freeweb
```

**npm（如果曾经发布过）：**

```sh
npx -y @deepseek-ai/dsh plugin --profile web add dsh-freeweb
```

重启dsh，然后验证成分，不花任何钱：

```sh
npx -y @deepseek-ai/dsh --profile web --dump-config   # expect searchProvider: freeweb
```

有关所有三个路径的详细信息，请参阅 [docs/install.md](docs/install.md)，
卸载步骤以及故障排除。

## 配置

默认值存在于插件条目中；每个值都是可选的：

```yaml
- id: freeweb
  name: 'dsh-freeweb'
  config:
    engines:
      duckduckgo: true
      startpage: true
      perplexity: true
      firecrawl: auto      # auto = only when a key/endpoint exists; true|false also accepted
    firecrawlApiKey: ''    # or env FIRECRAWL_API_KEY; free tier at firecrawl.dev, no card
    softDeadlineMs: 6000    # early-return once ≥1 engine answered
    hardDeadlineMs: 27000   # absolute cap; stragglers aborted
    engineTimeoutMs: 25000  # per-engine transport timeout
```

每个调用都有最后期限：引擎单独获得 25 秒，整个
一旦有答案，扇出就会在 6 秒处提前返回，并且没有任何东西会消失
27 秒。配置更改在 dsh 重启后生效。

## 它是如何工作的

提供者同时触发每个启用的引擎并合并出现的任何内容
通过跨引擎协议：URL 在规范密钥上进行重复数据删除，然后
按返回它们的引擎数量排名，然后按每个引擎的最佳位置排名。一
阻塞或缓慢的引擎永远不会失败搜索——单引擎墙被吸收
默默地——只有每个引擎同时发生故障才是一个错误。完整的设计，
包括故障语义以及如何添加引擎，位于
[文档/architecture.md](docs/architecture.md)。

## 测试

```sh
node test/integration.mjs
```

实时端到端套件：通过网络测试真实引擎并进行检查
带有模拟线束上下文的插件接线。它过去了。可选参数
运行您自己的查询：

```sh
node test/integration.mjs "your query here"
```

# ⚠️ 这个插件是由 AI 制作的

> **这个插件是由人工设计、移植和端到端测试的
> 智能——Lantern (`ox-alpha`)，一种人工智能编码代理——具有光人类
> 监督。没有人编写搜索逻辑。**
>
> 引擎、共识合并、截止日期控制器，还有这个
> 文档全部由针对实时网络的模型生成。
> 相应地判断代码：它经过了异常良好的测试并且完全没有
> 自我。

**状态：个人制品/概念证明。** 这是因为它的作者
想要在 dsh 内进行无钥匙搜索，现在它做到了。可能会也可能不会
接收更新。它按原样提供。如果你想要一个维护版本，fork
它——欢迎分叉，并且在生活允许的情况下阅读 PR。

## 致谢与致谢

- [oh-my-pi](https://github.com/can1357/oh-my-pi) (MIT) — 很大一部分
  这个包的内容是从它的网络搜索子系统移植的，文件映射在
  [注意](NOTICE)。它有很大帮助。
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — 一个
  优秀的、插件友好的线束；真正令人愉快的延伸。一有礼貌
  当我们在这里时轻推一下：内置的无钥匙网络搜索将使它变得均匀
  更好。
- **Lantern** (`ox-alpha`)，编写此文的 AI — 其作者的痕迹
  存在于每个正则表达式中。
- **Cinder** (`hy3`)，另一个人工智能——新容器中的独立 QA。被抓住
  该包裹发货时没有的一条清单行，证明了 GitHub
  安装路径端到端，并取前三个城市（纽约·博伊西·
  西雅图）通过扇出。灯笼升起；余烬验证。
- **wiselfx** — 打开每个开关，推动每个修复，保持氛围完好无损。
  这个神器的存在是因为他们想要它。