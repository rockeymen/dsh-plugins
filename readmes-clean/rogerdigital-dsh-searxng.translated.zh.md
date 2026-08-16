#dsh-searxng

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 插件，注册一个
[SearXNG](https://docs.searxng.org/) 支持的搜索提供商进入网络能力接缝
(`ctx.web`)，通过**免费、自托管、无密钥**元搜索为您的代理提供 `web_search`
实例 — 而不是付费的 Exa/Perplexity API。

## 安装

```sh
dsh plugin add dsh-searxng
```

（具有命名配置文件：`dsh plugin --profile <name> add dsh-searxng`。）

## 快速开始

1. **运行启用 JSON 格式的 SearXNG 实例**（一条命令，一分钟）：

   ```sh
   cd examples/docker && docker compose up -d
   # verify: curl 'http://127.0.0.1:8080/search?q=test&format=json'
   ```

   捆绑的撰写文件是仅环回的并且是预先配置的
   [`search.formats`](examples/docker/searxng/settings.yml) 与 `json` — 最重要的一项设置
   公共实例故意禁用。

2. **将插件指向它。** 在启动 dsh 之前设置一个环境变量：

   ```sh
   export SEARXNG_BASE_URL=http://127.0.0.1:8080
   dsh
   ```

   ...或覆盖您的个人资料 `cordis.patch.yml` 中的插件行
   （`$DSH_HOME/profiles/<name>/cordis.patch.yml`）：

   ```yaml
   - id: web-search-searxng
     config:
       baseURL: http://127.0.0.1:8080
       language: zh-CN
   ```

3. **向您的代理询问需要网络的信息。** 如果这是您拥有的唯一搜索提供商
   安装后，接缝会自动选择它。如果您还安装了 Exa/Perplexity，请选择它
   显式使用 `export DSH_WEB_SEARCH_PROVIDER=searxng` （或在中设置 `searchProvider: searxng`
   网络行的配置）。

在设置 `baseURL` 之前，提供程序将注册为不可用 — 假定没有公共实例，
因为大多数都严重禁用 JSON 格式和速率限制。

## 配置

所有按键都是可选的；全部住在 `web-search-searxng` 排的 `config` 上。

### 键·默认·含义
- **密钥**：`baseURL` · **默认**：`$SEARXNG_BASE_URL` · **含义**：实例的基本 URL，例如`http://127.0.0.1:8080`。必须是http(s)并且ZXQ​​20QXZ中有`json`。
- **键**：`language` · **默认**：无 · **含义**：作为 SearXNG 的 `language` 参数传递的区域设置，例如`zh-CN`、`en-US`。
- **密钥**：`engines` · **默认**：无 · **含义**：以逗号分隔的引擎白名单，例如`bing,duckduckgo`。
- **键**：`categories` · **默认**：无 · **含义**：逗号分隔的类别过滤器，例如`general,it`。
- **密钥**：`authHeader` · **默认**：无 · **含义**：授权标头值，对于以 API 密钥门为前端的实例。逐字发送。

结果计数此处不可配置：`dsh-tool-web` 拥有边界（`searchMaxResults`，
默认值 8) 并且接缝会截断到它。

## 故障排除

- **HTTP 403** — 实例未启用 JSON 格式。将 `json` 添加到 `search.formats`
  它是 `settings.yml`（请参阅捆绑的示例），然后重新启动实例。
- **HTTP 429** — 实例的速率限制器。对于本地实例设置 `limiter: false`，或提高
  它的极限。
- **提供商不可用/从未选择** — `baseURL` 未设置或不是绝对 http(s) URL。
- **`WEB_PROVIDER_AMBIGUOUS`** — 安装并可用多个搜索提供商；选择
  一个通过 `DSH_WEB_SEARCH_PROVIDER=searxng`。

## 兼容性

dsh 处于开发者预览版，预计会有重大变化。该表跟踪测试的配对：

### 插件版本·`@deepseek-ai/dsh-web`·注释
- **插件版本**：0.1.0 · **`@deepseek-ai/dsh-web`**：`>=0.1.0-rc.1 <0.2.0`（针对 `0.1.0-rc.6` 进行测试） · **注释**：初始版本

## 开发

```sh
pnpm install
pnpm test    # vitest
pnpm build   # tsdown → lib/
```

针对实时实例的集成检查：

```sh
cd examples/docker && docker compose up -d
node -e "import('./lib/index.mjs').then(m => new m.SearxngSearchProvider({ baseURL: 'http://127.0.0.1:8080' }).search({ query: 'deepseek harness' }).then(r => console.log(r.sources.slice(0, 3))))"
```