#dsh-chatgpt-web

实验性独立 DeepSeek Harness 提供程序，通过本地 Chrome 扩展程序使用已经过身份验证的普通 ChatGPT Web 会话。

```text
DSH native chat
  -> chatgpt-web/auto
  -> localhost WebSocket bridge (127.0.0.1:8765)
  -> bundled Chrome MV3 extension
  -> one extension-owned ChatGPT worker tab
  -> chatgpt.com
```

此插件不需要 OpenAI API 密钥、OpenAI 平台推理积分或安全 MCP 隧道。它会自动执行用户已登录的正常 `chatgpt.com` Web UI。

## 状态

**v0.1 实施和发布验收已完成。 Market/npm 发布仍在进行中。**

核心 DSH -> 桥 -> Chrome 扩展 -> 托管 ChatGPT 对话路径功能齐全。之前观察到的过早完成错误（ChatGPT 可能会在 Stop 消失后、在答案完全呈现之前暴露出稳定的部分答案）已得到解决：除了 Stop 消失和稳定性之外，完成现在还需要语义完成响应操作控件（包括 `data-testid="copy-turn-action-button"`）。

浏览器的接受度已在所有核心场景中得到验证（多轮重用、不同的会话 URL、切换回恢复、完整的权威文本提取、有意不确定的中止处理 -> 新鲜的再水化安全语义、重新启动持久性和安全丢失聊天恢复）。

本地单元/回归测试 (56/56)、类型检查、构建、`npm pack --dry-run` 和打包安装验证已通过。生成的 tarball 成功安装到隔离的 DSH 配置文件中，并注册了预期的 `chatgpt-web/auto` 捆绑包/模型，而不依赖于源签出。

参见：

- [`docs/2026-08-26-progress-and-debugging-log.md`](docs/2026-08-26-progress-and-debugging-log.md) 用于实现/调试历史记录；
- [`docs/manual-smoke.md`](docs/manual-smoke.md) 用于手动浏览器接受矩阵和打包安装过程；
- [`docs/superpowers/specs/2026-08-26-chatgpt-web-v0.1-design.md`](docs/superpowers/specs/2026-08-26-chatgpt-web-v0.1-design.md) 用于已建成的 v0.1 架构并解决了过早完成的问题；
- [`docs/superpowers/plans/2026-08-26-chatgpt-web-v0.1-implementation.md`](docs/superpowers/plans/2026-08-26-chatgpt-web-v0.1-implementation.md) 用于实施计划和历史发布清单。

## v0.1 范围

已实施或实质实施：

- 纯文本 `chatgpt-web/auto` 提供商；
- 每个 DSH 会话一个由插件创建的托管 ChatGPT 对话；
- 一个专用的 Chrome 工作选项卡；
- 浏览器各代的 FIFO 序列化；
- DSH取消->ChatGPT停止生成；
- 持久保存 DSH-session-to-ChatGPT-URL 映射和同步摘要；
- 当托管 ChatGPT 对话消失时安全的预发送恢复；
- 含糊的调度失败后的保守不确定状态；
- 运行时上下文感知响应目标，因此 DSH 插件快照不会成为明显的人类请求；
- 环回桥上稳定的 Chrome 扩展身份和精确的扩展来源验证。

v0.1 有意限制：

- 纯文本输入/输出；
- DSH 工具模式可以被适配器接受，但在 v0.1 中不能从 ChatGPT 调用它们；
- 需要带有捆绑的解压扩展程序的外部 Chrome/Chromium 浏览器；
- ChatGPT Web DOM 更改可能需要更新 `extension/chatgpt-page-adapter.js`；
- `reasoningEffort`、`temperature`、`maxTokens`、`stop` 和 DSH 辅助 `purpose` 呼叫因不受支持而被拒绝；
- 没有 GitHub 操作或 CI 工作流程；
- 没有自动安装 Chrome 扩展程序。

### 重要的输出语义

在当前 v0.1 实现中，浏览器 `delta` 事件仅是**内部传输观察**。它们不会作为用户可见的增量文本发送到 DSH。

浏览器 DOM 是可变的：React 可以重新挂载或重写旧的对话内容，而 DSH `text-delta` 输出只能追加。真正的第二轮回归证明，在正确的最终答案出现之前，旧的助理答案会作为增量跨越浏览器边界。

因此，适配器目前仅在权威 `generation-complete` 之后才将文本发布到 DSH：

```text
browser delta(s)
  -> internal only

generation-complete(fullText)
  -> block-start(text)
  -> text-delta(fullText)
  -> block-end(fullText)
  -> finish(stop)
```

这故意牺牲了逐个令牌的 DSH 流来保证 v0.1 的正确性。通过在发出 `generation-complete` 之前要求语义完成响应操作标记（`data-testid="copy-turn-action-button"` 等），提前完成错误已得到解决。

## 要求

——DeepSeek Harness `0.1.1-rc.2`；
- Node.js `^22.19.0 || >=24.0.0`；
- Chrome/Chromium 可访问 `https://chatgpt.com`；
- 登录的 ChatGPT Web 会话；
- `dsh plugin` 在 DSH 安装上所需的包管理器先决条件。

## 开发安装

```bash
npm install
npm run check
npm test
npm run build

dsh plugin --profile web add .
```

然后启动DSH：

```bash
dsh web
```

启动时，插件会记录环回桥和捆绑的扩展目录：

```text
[dsh-chatgpt-web] bridge listening on ws://127.0.0.1:8765
[dsh-chatgpt-web] Chrome extension directory: /absolute/path/to/dsh-chatgpt-web/extension
[dsh-chatgpt-web] expected Chrome extension origin: chrome-extension://...
```

打开`chrome://extensions`，启用开发者模式，选择**加载解压**，然后选择`extension`目录。编辑扩展源文件后手动重新加载解压的扩展。

在DSH中选择：

```text
chatgpt-web/auto
```

并使用正常的 DSH 聊天 UI。

## 已发布安装

npm 发布后的预期安装命令是：

```bash
dsh plugin --profile web add dsh-chatgpt-web
```

v0.1版本验收完成；此 README 尚未声明 npm 版本可用。

## 对话模型

DSH 仍然是规范的持久转录本。托管 ChatGPT 对话仅是提供商端对话缓存。

对于正常延续，适配器仅发送尚未同步的 DSH 历史后缀。它永远不会将 ChatGPT 之前的助理输出作为新用户消息发送回同一个 ChatGPT 对话中。

DSH 可以将运行时上下文附加为 `role=user` 消息，其结构源是插件快照。 Bridge 提示将这些消息保留为上下文，但明确将其 `source.kind === "user"` 作为人类请求的最新消息作为目标。后来的用户角色插件/工具消息是上下文，而不是新的人类转向。

如果托管 ChatGPT 对话在发送之前丢失，适配器可以安全地清除映射并从规范的 DSH 历史记录中执行一次新的补充尝试。如果提交后生成中止或分派后失败使提供者状态不明确，则会话被标记为 `uncertain`；稍后的对话会重新进行新的管理对话，而不是盲目地重播模棱两可的请求。

持久状态仅包含操作映射/摘要。它不存储 ChatGPT cookie、登录令牌、完整的 DSH 记录或个人 ChatGPT 聊天的副本。

`/c/WEB:...` 形式的临时 ChatGPT 路由将被拒绝，并且永远不会保留为托管对话 URL。

## 实际的桥接协议

协议：

```text
dsh-chatgpt-web-v1
```

插件 -> 当前实现的扩展消息：

- `generate`
- `abort`
- `ping`

当前实现的扩展 -> 插件消息：

- `hello`
- `request-state`
- `session-ready`
- `delta`
- `generation-complete`
- `generation-aborted`
- `error`
- `pong`

请求范围的事件携带 `requestId` 和单调递增的 `seq`。 `sessionId` 和可选的托管 `conversationUrl` 在 `generate` 上行驶。

关键的重试边界是发送。被证明在发送之前发生的显式失败可能是重试安全的；发送提示后，禁止自动重发，歧义变为`CHATGPT_WEB_UNCERTAIN`。

## Worker-tab 隐私模型

该扩展程序从不枚举 ChatGPT 侧边栏，也从不搜索或采用任意现有的 ChatGPT 选项卡。

它仅在 `chrome.storage.session` 中存储其专用工作选项卡的 id。如果该选项卡消失，它会创建另一个工作选项卡，而不是搜索用户的现有选项卡。它仅导航到新会话/重新水化会话的 ChatGPT 主页或插件提供的托管对话 URL。

预先存在的个人 ChatGPT 对话超出了插件的范围。

## 本地安全边界

桥固定在：

```text
ws://127.0.0.1:8765/
```

它仅绑定环回并验证由捆绑清单公钥生成的确定性 `chrome-extension://...` Origin。公钥是身份密码，而不是秘密或加密身份验证令牌。

这会阻止对网桥的普通远程/网页访问。已经以同一本地用户身份运行的恶意进程可以伪造 We