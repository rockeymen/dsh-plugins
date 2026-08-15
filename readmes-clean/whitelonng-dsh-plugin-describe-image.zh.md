# dsh-plugin-describe-image

[English](README.md) | 中文

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件：面向模型的 `describe_image` 工具，为**纯文本模型**（DeepSeek V4 等）提供识图能力。

工具加载一张图片——本地文件路径、http(s) URL 或持久附件引用——并请求 **OpenAI 兼容端点**上的视觉语言模型（Qwen-VL、GLM-4V、GPT-4o、本地 Ollama 端点……）描述它。只有返回的**文本**跨入对话，图片本身从不进入会话日志。

## 特性

- **三种输入形式**：本地路径、http(s) URL，或 `[image attachment …]` 注记里的 JSON（经 harness 附件服务解析——把注记原样复制进 `image` 即可）。
- **实时配置卡片**：Web GUI「设置 → 插件 → 图像理解」卡片可直接改 `baseURL`、`model` 与 API Key（走凭据缝），保存立即生效、无需重启。
- **每次调用解析 API Key**：内联 `apiKey` → 凭据缝（`apiKeyEnv`，默认 `VISION_API_KEY`）→ 启动环境。
- **安全与边界**：所有请求拒绝重定向，`maxBytes` / `maxOutputTokens` / `timeoutMs` 边界，魔数媒体类型门，错误摘要截断，密钥永不落日志。
- **配套 harness 改动**（随 harness 仓库发布，不在本子树内）：DeepSeek 纯文本路由把图片块展开为可复制的 `[image attachment …]` 注记，主机在纯文本路由上接受带图消息——两者共同打通「给纯文本模型发图」的完整闭环。

## 快速上手（在 DeepSeek Harness 检出中）

```yaml
# cordis.yml
- id: describe-image
  name: '@deepseek-ai/dsh-tool-describe-image'
  config:
    baseURL: https://dashscope.aliyuncs.com/compatible-mode/v1
    model: qwen-vl-max
    apiKey: !!js process.env.VISION_API_KEY
```

## 仓库布局

```
packages/vision/
├── README.md                  # vision 能力家族
└── tool-describe-image/       # 插件包（源码 + 测试 + 文档）
```

本仓库保存插件子树**在 `deepseek-harness` 内的原样**：包依赖保持 `workspace:^`，构建、类型检查与测试都在 harness 检出中完成（见 [INTEGRATION.md](INTEGRATION.md)）。harness 树才是构建环境，而不是本仓库。两边保持同步：

```sh
git subtree push --prefix packages/vision dsh-describe-image main   # 在 harness 检出中执行
```

## 致谢

- [LINUX DO](https://linux.do) — 本项目在 LINUX DO 社区持续分享与讨论。