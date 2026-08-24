#dsh-cliproxy

通过一个本地 [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) 实例，在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)] 中通过 Antigravity OAuth** 路由 Claude、OpenAI/Codex 和 **Gemini。

Gemini 路线使用您的 Google/Antigravity 帐户 - **不是 Gemini API 密钥**。 CLIProxyAPI 拥有浏览器登录、刷新令牌、Google 项目、本机请求指纹和翻译；该插件是其 OpenAI 兼容的 DSH 客户端。

### DSH 提供商 · CLIProxyAPI 拥有的身份验证
- **DSH 提供商**：`cliproxy-claude` · **CLIProxyAPI 拥有的身份验证**：Claude Code 订阅
- **DSH 提供商**：`cliproxy-openai` · **由 CLIProxyAPI 拥有的身份验证**：Codex/OpenAI 订阅
- **DSH 提供商**：`cliproxy-gemini` · **由 CLIProxyAPI 拥有的身份验证**：Google Antigravity OAuth

## 安装

```bash
dsh plugin --profile web add github:DevViking-Persike/dsh-cliproxy
```

重启DSH。所有三个路线都会出现在模型目录中。

## 双子座/反重力登录

CLIProxyAPI 7.x 已经实现了公共 Antigravity OAuth 客户端。运行一次：

```bash
cliproxyapi -config /opt/homebrew/etc/cliproxyapi.conf -antigravity-login
```

在浏览器中授权Google帐户。 CLIProxyAPI 在其配置的 `auth-dir`（通常为 `~/.cli-proxy-api`）下写入 `antigravity-.json` 并自行刷新。这个 DSH 插件永远不会读取 Google 访问或刷新令牌。

下面命名的key只是DSH和`127.0.0.1:8317`之间本地代理的访问控制；它**不是** Gemini API 密钥。对于环回端点，插件默认从本地 CLIProxyAPI 配置读取第一个 `api-keys` 条目，因此不需要环境变量，并且从不显示密钥。

## 要求

- 正在运行的 CLIProxyAPI 实例；默认端点 `http://127.0.0.1:8317/v1`。
- 对于 Gemini，完成的 `-antigravity-login`。
- 线束凭证存储 / `CLIPROXY_API_KEY` 中的代理访问密钥，或可读的本地代理配置。仅允许环回 URL 进行本地配置发现；本地密钥永远不会隐式发送到远程端点。

## 配置

每个字段都是可选的。

### 字段·默认值·含义
- **字段**：`baseURL` · **默认**：`http://127.0.0.1:8317/v1` · **含义**：包括 `/v1` 的端点。
- **字段**：`apiKeyEnv` · **默认**：`CLIPROXY_API_KEY` · **含义**：代理访问密钥的可选凭据参考/环境变量。
- **字段**：`proxyConfigPath` · **默认**：`/opt/homebrew/etc/cliproxyapi.conf` · **含义**：可以从中读取第一个代理访问密钥的本地 CLIProxyAPI YAML。
- **字段**：`readLocalProxyKey` · **默认**：`true` · **含义**：仅允许环回端点的本地配置发现。
- **字段**：`claudeModels` · **默认**：六个 Claude 条目 · **含义**：`cliproxy-claude` 的目录；提供的数组替换默认数组。
- **字段**：`openaiModels` · **默认**：五个 GPT 条目 · **含义**：`cliproxy-openai` 的目录。
- **字段**：`geminiModels` · **默认**：八个双子座条目 · **含义**：`cliproxy-gemini` 的反重力目录。
- **字段**：`streamIdleTimeoutMs` · **默认**：`300000` · **含义**：流读取之间的预算。
- **字段**：`defaultContextWindow` · **默认**：`200000` · **含义**：为未编目模型假定的上下文。
- **字段**：`maxTokens` · **默认**：`32000` · **含义**：默认输出上限。
- **字段**：`retryPolicy` · **默认**：正常，重试 3 次 · **含义**：合并到与线束兼容的默认值上。

```yaml
- id: dsh-cliproxy
  name: dsh-cliproxy
  config:
    baseURL: http://127.0.0.1:8317/v1
    geminiModels:
      - id: gemini-pro-agent
        name: Gemini 3.1 Pro High
        contextWindow: 1048576
        maxTokens: 65535
```

## 为什么代理拥有反重力

直接客户端不仅仅是 OAuth 不记名令牌。上游线路需要：

- Google OAuth 范围和注册的 Antigravity 公共客户端；
- 通过 `loadCodeAssist` 发现/加入项目；
- `daily-cloudcode-pa.googleapis.com` / `cloudcode-pa.googleapis.com` 路由；
- `antigravity/hub/<version>` 用户代理和 HTTP/1.1 指纹；
- 嵌套在反重力信封内的双子座主体，带有项目、请求和会话 ID；
- 工具模式清理、加密推理重放、特定于模型的输出上限和令牌刷新。

CLIProxyAPI 已经拥有并测试了这些事实。在这里复制它们将产生两个令牌编写器和第二个独立的漂移协议实现。因此，该插件将 OpenAI 兼容的流请求发送到环回代理，并且永远不会复制 Google 的客户端密钥或帐户令牌。

## 模特经历

适配器对模型是透明的：它注册提供者路由并流响应，不添加任何工具、提示部分或上下文。使用计数是不相交的 — `inputTokens` 不包括 `prompt_tokens` 内已计数的缓存读取。

仅文本。尽管某些反重力模型支持上游，但图像、音频和视频在发送请求之前会被拒绝；该适配器的串行器尚未保留这些输入。

## 安全

- Google 访问/刷新令牌完全保留在 CLIProxyAPI 的 `auth-dir` 内。
- 根据请求读取代理访问密钥，并且永远不会输入错误或日志。对于非环回目标，本地配置发现会自动禁用。
- 截断的流会引发 `STREAM_CLOSED`，而不是看起来完整。
- `retry-after`到达线束重试插件；空闲超时衡量的是服务器的沉默，而不是缓慢的消费者。
- 在加载时根据固定有效负载检查块字段，因此利用协议漂移拒绝安装，而不是默默地破坏工具调用。

## 已知限制

- 模型目录是从 CLIProxyAPI 的反重力注册表复制的静态默认值；当显式命名时，未编目模型仍然可以解析。提供 `geminiModels` 替换默认值。
- 还没有图像/音频/视频序列化。
- 该插件没有设置目录条目；由`cordis.yml`配置。
- 测试使用本地 HTTP 服务器并记录线束转换器/序列化器输出。真正的 OAuth 和模型可用性仍然由供应商控制。

## 测试

```bash
npm install && node --test test/*.test.js
```

64 项测试，无需网络，无需凭据。