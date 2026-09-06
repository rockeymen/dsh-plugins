# dsh-opencode-go-models

补齐 DSH 的 OpenCode Go 模型选择目录，不修改 `deepseek-harness`。扩展保留 `llm-pi-ai` 的原有路由；缺失模型通过独立的 pi-ai 适配器发送，请求仍使用 `opencode-go` 作为外部 provider。

## 安装

```bash
npx @deepseek-ai/dsh plugin --profile web add github:sd1g1/dsh-opencode-go-models
```

## 配置

扩展默认读取 `OPENCODE_API_KEY`。可在 `cordis.patch.yml` 的扩展行修改 `apiKeyEnv`，或确保该引用由 DSH credentials 服务提供。

扩展按 [OpenCode Go 官方文档](https://opencode.ai/docs/go) 的当前模型列表补充 DSH 未收录的模型：

| 模型 | API |
| --- | --- |
| `deepseek-v4-flash-vision-exp` | openai-completions |
| `qwen3.8-max` | anthropic-messages |
| `glm-5.3` | openai-completions |
| `gpt-5.6-luna` | openai-responses |
| `muse-spark-1.2-contributor` | openai-responses |
| `longcat-2.0` | openai-completions |
| `ox-alpha-free` | openai-completions |

## 验证

```bash
npx @deepseek-ai/dsh plugin --profile web ls | grep opencode-go-models
```

插件挂载后，模型选择器中会出现上述补充模型。

## 卸载

```bash
npx @deepseek-ai/dsh plugin --profile web remove @local/dsh-opencode-go-models
```
