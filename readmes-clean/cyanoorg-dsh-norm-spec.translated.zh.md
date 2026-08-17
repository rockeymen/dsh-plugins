#dsh-norm-spec

DeepSeek Harness (dsh) Cordis 插件适配器，适用于 [norm-spec](https://github.com/CyanoOrg/norm-spec)
约定：每会话 `.norm` 约定注入和软后期编辑
约定验证，由规范的 Rust 引擎支持。

**状态：`0.1.0-alpha.1` 本地开发。 DSH 主机固定到
`@deepseek-ai/dsh@0.1.0-rc.6`。未发表。**

## 它的作用

- 每个 DSH 代理会话启动一个经过验证的 `dsh-norm-bridge` 子项
  (`agent/session-start`) 针对密封的上游规范规格有效负载。
- 将 `agent/pre-step` 中收集的 `.norm` 约定注入为一个持久的
  `<system-reminder>` 用户消息，SHA-1 摘要抑制，最具体
  首先——与 dsh 自己的 `agent-instructions` 相同的注入习惯。
- 成功调用 `write`/`edit` 工具后，附加有界严格
  通过 `tools/post-execute` 验证反馈（软反馈；从不
  阻止或恢复）。
- 从不编写自定义会话事件类型；永远不会退回到 `norm`
  在`PATH`上。

## 本地开发

```bash
# Rust gates
cargo fmt --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-features

# TypeScript
npm install
npm run typecheck
npm test

# Run the plugin in a real dsh checkout (after packaging exists):
# cordis.yml entry —
#   - id: norm
#     name: './packages/dsh-norm-spec'   # or published package name
#     config:
#       launch:
#         command:
#         args: ["serve", "--payload", <sealed-payload>]
```

在打包存在之前，插件将解析其运行时
`DSH_NORM_BRIDGE` 和 `DSH_NORM_PAYLOAD` 环境变量。

## 文档

- `docs/ARCHITECTURE.md` — Rust/TypeScript 边界和 DSH 主机表面
- `docs/BRIDGE-PROTOCOL.md` — `dsh-norm-spec/bridge/v1` 加工合同
- `docs/decisions.md` — 决策记录 D001–D006
- `docs/planning/status.md` — 实时开发状态
- `ROADMAP.md` — 里程碑计划