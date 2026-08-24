# @goodandready/dsh-model-sync

DeepSeek Harness 中 API 密钥提供程序的自动模型目录同步。

该插件设计用于：

- API 密钥提供程序已在 DSH 中配置；
- 内置 DSH 目录中提供 API 密钥提供程序，但尚未配置；
- 未来的自定义 API 密钥提供商路线。

OAuth、订阅和纯工具路由有意超出范围。

## 状态

实现了运行时、调度程序、HTTP API、协调和设置 UI。发布和暂存验证在发布之前仍然存在。

## 发展

请参阅“`docs/`` for architecture, research, testing, and release notes.

## API and safety

`GET /dsh-model-sync/status` reports provider state without secrets.

`POST /dsh-model-sync/run”下的项目文档，默认为只读空运行：

```json
{ "provider": "openai", "dryRun": true }
```

apply 是明确的：

```json
{ "provider": "openai", "dryRun": false, "removeMissing": false }
```