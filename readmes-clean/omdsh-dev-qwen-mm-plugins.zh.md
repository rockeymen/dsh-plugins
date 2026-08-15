# `@deepseek-ai/dsh-qwen-mm`

[English](README.md) | 中文

Qwen-MM 能力的可安装 DSH profile 组合包。插件在配置的上游 ref 下拉取 Agent Skill，通过现有 DSH MCP client 以 required-initial-discovery 模式启动 MCP server，并且只在工具发现成功后挂载 skill。

## 仓库结构

```text
package.json              # 运行时包和 dsh.bundle 清单
cordis.patch.yml          # 显式 opt-in 的 profile 层
src/                      # Cordis 插件和 invariant companion
lib/                      # 生成的安装产物
legacy/                   # 旧 DSH 快照的宿主接线补丁，仅作迁移资料
tests/                    # 插件和组合测试
```

组合包安装后只加入一个默认禁用的 `qwen-mm` 行。这是有意设计：启用后会进行远程 Git 拉取并启动外部 MCP 进程，因此部署必须在自己的 profile 层明确提供精确 ref、能力列表和环境变量。

```yaml
- id: qwen-mm
  disabled: false
  config:
    source: https://github.com/QwenLM/Qwen-MM-Plugins.git
    ref: <精确 commit 或 tag>
    capabilities:
      - id: core
      - id: video-memory
```

旧宿主补丁只保留在 `legacy/` 中，供尚未提供图像内容块、MCP image result、model modality、token 计价、compaction、replay 和 Web 摘要接缝的 DSH 快照迁移使用；新的 bundle 层不再修改宿主源码。

## 开发

完整 typecheck 需要 sibling checkout：

```text
~/git/deepseek-harness
~/git/Qwen-MM-Plugins
```

```sh
pnpm install
pnpm run typecheck
pnpm test
pnpm run build
```

Git 安装通过 `prepare` 使用不依赖 sibling checkout 的 tsdown 配置生成 `lib/`。pnpm 10 可能要求 profile 允许该 prepare 脚本；只应批准固定且可信的 checkout。

## 已知限制

- 外部能力拉取需要 `git`；默认 MCP 启动需要 `uvx` 和对应的 Python 环境。
- 产生图片的能力需要使用声明支持 image input 的模型 route。
- 插件不会自动转发 credential-shaped 环境变量，能力凭据必须显式配置。
- 真实 Loader 组合测试要求 DSH `mcp-client` 使用异步插件加载并执行 required initial discovery；较旧的同步宿主快照会跳过这些测试，因为它们可能在工具就绪前挂载 skill。