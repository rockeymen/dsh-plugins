# @ddtcorex/dsh-maestro-govard

[Govard](https://github.com/ddtcorex/govard) 的薄 DeepSeek Harness 桥 — 暴露 Govard 工作区/项目
将工具添加到 DSH 会话作为注册工具。 Govard 引擎本身是一个单独的 Go
代码库和二进制文件；这个包只是桥梁，它不嵌入Go代码。

Maestro Harness 套件 (`dsh-maestro-*`) 的一部分。 Cordis 补丁行 ID：`dsh-maestro-govard`
（元包中的短别名 `maestro-govard`）。

## 它提供什么

- 工具注册，外壳为 `govard` 二进制文件（环境向上/向下，命令
  容器、数据库转储/导入、调试配置）以及模式类型参数。
- 工作区路径分辨率与 Maestro 套件的其余部分一致。

## 安装

```sh
dsh plugin --profile web add @ddtcorex/dsh-maestro-govard
# or everything at once:
dsh plugin --profile web add @ddtcorex/dsh-maestro-meta
```

Go 二进制文件在 `govard` 存储库 (`make build`) 中单独构建；这座桥
期望它在 PATH 或其配置位置可用。

## 发展

```sh
pnpm install
pnpm verify   # tsc --noEmit
pnpm test     # vitest run
pnpm build    # tsc -> lib/
```

在移交之前，必须针对 Govard 管理的真实项目实时验证运行时功能
— 参见 AGENTS.md。