# dsh-openapi

**让 DeepSeek Harness 通过安全、结构化的工具调用任意 OpenAPI 3.x API。**

[English](README.md) · [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)

`dsh-openapi` 是 DeepSeek Harness 原生 bundle，会索引配置好的 OpenAPI 文档，并注册三个模型工具：

- `openapi_list`：列出 API、搜索 operation。
- `openapi_describe`：查看某个 operation 的参数、请求体、服务器和响应。
- `openapi_call`：校验并调用 operation，限制返回大小。

项目直接使用 ESM JavaScript，因此从 GitHub 安装时不会执行构建或 `prepare` 脚本。

## 为什么需要它

Harness 已经有 Shell，但 API 更适合更窄、更可控的接口：无需把巨大的规范塞进模型上下文；只允许规范声明的参数；凭据来自环境变量；默认只读；校验 SSRF 风险；限制响应大小。本插件通过 Harness 官方扩展点实现这些能力，不修改 agent loop。

## 安装

```sh
dsh plugin --profile web add github:Degurechaff57/dsh-openapi
```

安装后的 API 目录为空。在 profile 的 `cordis.patch.yml` 中加入配置：

```yaml
- id: openapi
  config:
    apis:
      - id: petstore
        source: https://petstore3.swagger.io/api/v3/openapi.json
        baseUrl: https://petstore3.swagger.io/api/v3
        allowedMethods: [GET, HEAD]
```

启动 Harness 后可以直接说：

> 用 `openapi_list` 找到列出宠物的接口，先描述参数，再调用它。

本地源码安装：

```sh
dsh plugin --profile web add /absolute/path/to/dsh-openapi
```

## 凭据配置

不要把密钥写入 YAML。将请求头映射到环境变量：

```yaml
- id: openapi
  config:
    apis:
      - id: internal-api
        source: ./openapi/internal.yml
        baseUrl: https://api.example.com/v1
        headers:
          Accept: application/json
        credentials:
          - header: Authorization
            env: INTERNAL_API_TOKEN
            prefix: 'Bearer '
        allowedMethods: [GET, HEAD, POST]
```

凭据请求头最后写入，模型参数无法覆盖；环境变量缺失时会在发出网络请求前失败。

## 配置项

顶层配置：

### 字段 · 默认值 · 用途
- **字段**: `apis` · **默认值**: `[]` · **用途**: API 文档列表
- **字段**: `timeoutMs` · **默认值**: `30000` · **用途**: 单次调用超时
- **字段**: `maxSpecBytes` · **默认值**: `2097152` · **用途**: 本地或远程规范大小上限
- **字段**: `maxResponseBytes` · **默认值**: `262144` · **用途**: 返回给模型的响应体上限
- **字段**: `maxRedirects` · **默认值**: `3` · **用途**: 重定向上限；每一跳都会重新校验
- **字段**: `maxOperationsPerApi` · **默认值**: `1000` · **用途**: 单个 API 的 operation 上限

每个 `apis` 条目支持：

### 字段 · 默认值 · 用途
- **字段**: `id` · **默认值**: 必填 · **用途**: 工具调用使用的稳定 id
- **字段**: `source` · **默认值**: 必填 · **用途**: HTTP(S) URL、`file:` URL、绝对路径，或相对 Harness 进程的路径
- **字段**: `baseUrl` · **默认值**: 规范中的 server · **用途**: 显式覆盖 API 服务器
- **字段**: `headers` · **默认值**: `{}` · **用途**: 静态非敏感请求头
- **字段**: `credentials` · **默认值**: `[]` · **用途**: 请求头与环境变量映射
- **字段**: `allowedMethods` · **默认值**: `[GET, HEAD]` · **用途**: 工具允许调用的方法
- **字段**: `allowPrivateNetwork` · **默认值**: `false` · **用途**: 显式允许回环/私网目标

## 安全默认值

- 规范只能由管理员配置，模型不能在运行时任意加载 URL。
- 默认只开放 `GET`、`HEAD`。
- 只接受 operation 声明过的参数。
- 默认阻止 URL 内凭据、localhost、私网 IP，以及 DNS 解析到私网的主机；每次重定向都会重新检查，跨域重定向会移除凭据。
- 响应体有硬上限，`set-cookie` 等敏感响应头不会返回给模型。
- 密钥来自环境变量，覆盖调用参数，永远不会出现在工具结果中。

本地开发服务需要设置 `allowPrivateNetwork: true`。这是明确的信任选择，不是网络沙箱。DNS 在校验和连接之间仍可能变化；高安全场景不要使用不可信的 OpenAPI 文档或恶意 DNS 环境。

## 当前范围

- OpenAPI 3.0 / 3.1，JSON / YAML
- 本地 `#/...` 引用
- 常见 path、query、header、cookie 参数序列化
- JSON 与文本响应

暂不跟随远程 `$ref`，也不猜测 `deepObject` 等特殊序列化；遇到不明确的输入会直接失败。

DeepSeek Harness 仍处于开发者预览期。本版本已测试当前源码 CLI（`0.1.0-rc.5`）和 npm 预发布版（`0.1.0-rc.6`），上游发生破坏性变更后会快速跟进。

## 开发与测试

```sh
npm install
npm run check
```

测试覆盖解析、引用、operation 索引、请求构造、凭据优先级、方法限制、私网阻止、重定向检查、输出截断和插件注册。

## 许可证

[MIT](LICENSE)