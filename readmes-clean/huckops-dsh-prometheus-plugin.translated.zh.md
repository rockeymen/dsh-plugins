#dsh-prometheus-plugin

一个 [DeepSeek Harness (`dsh`)](https://github.com/deepseek-ai) 插件，公开了
Prometheus HTTP API 作为 LLM 代理可以调用的一组工具。建立在
[Cordis](https://github.com/cordiverse/cordis)框架和
`@deepseek-ai/dsh-tools`。

## 特点

- **30 个工具** 涵盖完整的 Prometheus HTTP API：即时/范围查询，
  元数据和系列发现、目标、规则/警报/警报管理器、服务器
  状态、实验性搜索 API 和管理 TSDB 端点。
- 具有一致错误格式的单个共享 HTTP 客户端 (`src/client.ts`)
  以及可配置的请求超时（`AbortController`，默认 30 秒）。
- 通过 `@deepseek-ai/dsh-tools` 进行声明性工具定义，方便代理使用。

## 先决条件

- 可通过 HTTP 访问正在运行的 Prometheus 实例。
- 某些端点需要额外的 Prometheus 启动标志：
  - **管理工具**（`admin-snapshot`、`admin-delete-series`、`admin-clean-tombstones`）
    需要`--web.enable-admin-api`。
  - **搜索工具**（`search-metric-names`、`search-label-names`、`search-label-values`）
    需要`--enable-feature=search-api`。
  - 某些端点仅在较新的 Prometheus 版本中可用
    （`format-query`、`parse-query`、`query-exemplars`、`status-tsdb`（3.6.0+）、
    `status-self-metrics`、`features`、……）。将工具指向较旧的服务器
    从 Prometheus 本身返回 HTTP 错误。

## 用法

该插件由 `dsh` 直接从其 TypeScript 源加载 - 无需构建
本地使用需要步骤。将以下内容添加到您的 `dsh` `cordis.yml`
（将 `name` 路径调整为克隆存储库的位置）：

```yaml
- insert:
    - id: promql-plugin
      name: '/path/to/dsh-prometheus-plugin/src/plugin.ts'
      config:
        prometheusEndpoint: http://127.0.0.1:9090
```

省略时，`prometheusEndpoint` 默认为 `http://127.0.0.1:9090`。

对源进行类型检查/构建（例如在贡献之前）：

```bash
npm install
npm run build   # runs tsc, output to lib/
```

> 注：`package.json`将`main`声明为`lib/index.js`，但封装中没有
> `src/index.ts`。对于 `dsh` 使用，条目直接通过 `cordis.yml` 加载
>（如上所述），因此不需要构建。如果您打算发布到 npm，请添加
> 从 `./plugin` 重新导出 `apply` 的 `src/index.ts`。

## 工具

所有工具均以 `promql-` 前缀注册。

＃＃＃ 询问

### 工具·普罗米修斯端点
- **工具**：`promql-query` · **普罗米修斯端点**：`GET /api/v1/query`
- **工具**：`promql-query-range` · **普罗米修斯端点**：`GET /api/v1/query_range`
- **工具**：`promql-format-query` · **普罗米修斯端点**：`GET /api/v1/format_query`
- **工具**：`promql-parse-query` · **普罗米修斯端点**：`GET /api/v1/parse_query`
- **工具**：`promql-query-exemplars` · **普罗米修斯端点**：`GET /api/v1/query_exemplars`

### 元数据和系列

### 工具·普罗米修斯端点
- **工具**：`promql-series` · **普罗米修斯端点**：`GET /api/v1/series`
- **工具**：`promql-labels` · **普罗米修斯端点**：`GET /api/v1/labels`
- **工具**：`promql-label-values` · **普罗米修斯端点**：`GET /api/v1/label/{name}/values`
- **工具**：`promql-metadata` · **普罗米修斯端点**：`GET /api/v1/metadata`

### 目标

### 工具·普罗米修斯端点
- **工具**：`promql-targets` · **普罗米修斯端点**：`GET /api/v1/targets`
- **工具**：`promql-targets-metadata` · **普罗米修斯端点**：`GET /api/v1/targets/metadata`
- **工具**：`promql-scrape-pools` · **普罗米修斯端点**：`GET /api/v1/scrape_pools`

### 规则/警报/警报管理器

### 工具·普罗米修斯端点
- **工具**：`promql-rules` · **普罗米修斯端点**：`GET /api/v1/rules`
- **工具**：`promql-alerts` · **普罗米修斯端点**：`GET /api/v1/alerts`
- **工具**：`promql-alertmanagers` · **普罗米修斯端点**：`GET /api/v1/alertmanagers`

### 状态

### 工具·普罗米修斯端点
- **工具**：`promql-status-config` · **普罗米修斯端点**：`GET /api/v1/status/config`
- **工具**：`promql-status-flags` · **普罗米修斯端点**：`GET /api/v1/status/flags`
- **工具**：`promql-status-runtimeinfo` · **普罗米修斯端点**：`GET /api/v1/status/runtimeinfo`
- **工具**：`promql-status-buildinfo` · **普罗米修斯端点**：`GET /api/v1/status/buildinfo`
- **工具**：`promql-status-tsdb` · **普罗米修斯端点**：`GET /api/v1/status/tsdb`（3.6.0+）
- **工具**：`promql-status-tsdb-blocks` · **普罗米修斯端点**：`GET /api/v1/status/tsdb/blocks`
- **工具**：`promql-status-walreplay` · **普罗米修斯端点**：`GET /api/v1/status/walreplay`
- **工具**：`promql-status-self-metrics` · **普罗米修斯端点**：`GET /api/v1/status/self_metrics`
- **工具**：`promql-features` · **普罗米修斯端点**：`GET /api/v1/features`

### 搜索（实验性，需要 `--enable-feature=search-api`）

### 工具·普罗米修斯端点
- **工具**：`promql-search-metric-names` · **普罗米修斯端点**：`GET /api/v1/search/metric_names`
- **工具**：`promql-search-label-names` · **普罗米修斯端点**：`GET /api/v1/search/label_names`
- **工具**：`promql-search-label-values` · **普罗米修斯端点**：`GET /api/v1/search/label_values`

### 管理员（需要 `--web.enable-admin-api`）

### 工具·普罗米修斯端点
- **工具**：`promql-admin-snapshot` · **普罗米修斯端点**：`POST /api/v1/admin/tsdb/snapshot`
- **工具**：`promql-admin-delete-series` · **普罗米修斯端点**：`POST /api/v1/admin/tsdb/delete_series`
- **工具**：`promql-admin-clean-tombstones` · **普罗米修斯端点**：`POST /api/v1/admin/tsdb/clean_tombstones`

## 项目布局

```
.
├── cordis.yml          # dsh plugin registration (local dev path)
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
└── src/
    ├── client.ts       # shared HTTP client + error handling + timeout
    ├── query.ts        # query / query_range / format_query / parse_query / query_exemplars
    ├── metadata.ts     # series / labels / label_values / metadata
    ├── targets.ts      # targets / targets_metadata / scrape_pools
    ├── rules.ts        # rules / alerts / alertmanagers
    ├── status.ts       # config / flags / runtimeinfo / buildinfo / tsdb / tsdb_blocks / walreplay / self_metrics / features
    ├── search.ts       # search/metric_names / search/label_names / search/label_values
    ├── admin.ts        # admin/tsdb/snapshot / delete_series / clean_tombstones
    └── plugin.ts       # entry: imports and registers all tools
```