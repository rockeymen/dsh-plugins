# dsh-youmind-plugin

面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 YouMind OpenAPI 插件。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 来源与致谢

本插件的 YouMind 工作流与 Skill 设计参考并适配自
[`YouMind-OpenLab/skills`](https://github.com/YouMind-OpenLab/skills)。感谢 YouMind OpenLab
公开相关 Skill 与 OpenAPI 使用范式。本项目是面向 DeepSeek Harness 的社区适配，不代表 YouMind 官方发布。

它会向 Harness 注册一个 `youmind` Skill 和五个模型工具：

- `youmind_search_api`：搜索可用的 YouMind OpenAPI。
- `youmind_api_info`：读取某个 API 的请求说明。
- `youmind_call_api`：调用任意已确认的 YouMind API。
- `youmind_find`：搜索个人 YouMind 知识库或指定 Board。
- `youmind_web_search`：通过 YouMind 搜索公开互联网。

## 安装

可以直接从 GitHub 安装。为了避免分支更新改变实际安装内容，正式使用时建议把 `main` 替换为具体 commit SHA：

```bash
dsh plugin --profile web add github:seamas0825-lab/dsh-youmind-plugin#main
```

检查组合配置：

```bash
dsh --profile web --dump-config
```

## 配置认证

从 https://youmind.com/settings/api-keys 创建 API Key，然后将它保存到 DSH 的受管凭据文件：

```yaml
# ~/.dsh/.credentials.yaml
YOUMIND_API_KEY: sk-ym-...
```

确保凭据文件只有当前用户可读：

```bash
chmod 600 ~/.dsh/.credentials.yaml
```

插件通过 DSH 原生 `credentials` 服务按调用读取密钥，修改凭据后无需重启 Harness。
不要把 API Key 发到聊天中。插件不会将密钥放入普通设置、工具参数、结果或日志。

如需连接预览或自托管兼容端点，可以额外设置：

```bash
export YOUMIND_ENDPOINT='https://youmind.com'
```

## 测试

在 Web UI 中尝试：

```text
使用 YouMind 搜索我的资料库中关于 AI Agent 的内容。
```

或：

```text
先查找 YouMind 里和 Board 有关的 API，再告诉我有哪些可用操作，不要修改任何内容。
```

## 卸载

```bash
dsh plugin --profile web remove dsh-youmind-plugin
```

## 安全边界

`youmind_call_api` 能访问通用 OpenAPI，因此也可能执行发布、移动、删除或付费操作。随包 Skill 要求 Agent 在这些操作前确认用户意图，但插件仍应只在受信任的 Harness 环境中启用。
