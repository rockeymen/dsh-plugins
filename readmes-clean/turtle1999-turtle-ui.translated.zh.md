# 海龟用户界面

> 周五下午dsh的第一个UI

该存储库包含以前的 `packages/ui/tui` 实现、其单元和终端快照测试以及 dsh 配置文件捆绑补丁。 TUI拥有终端呈现和输入； DeepSeek Harness 拥有代理、模型、工具、持久性和 `dsh` 启动器。

## 发展

将此存储库和 DeepSeek Harness 作为同级存储库：

```text
~/git/deepseek-harness
~/git/turtle-ui
```

安装并构建同级 Harness，然后安装 Turtle UI：

```sh
(cd ../deepseek-harness && pnpm install && pnpm run build)
pnpm install
pnpm run build
```

对等 API 来自同级 Harness checkout。独立的 TypeScript 和 Vitest 配置有意通过 `../deepseek-harness` 解析这些源； Vitest 使用 Harness 构建目标主机模块，而不是将源模块与传递构建的包混合。修补后的 `@earendil-works/pi-tui` 是在构建时捆绑到 `lib/` 中的 devDependency，因此消费者无需安装 pi-tui，也不需要 `patchedDependencies`。

## 运行

Turtle UI 是一个 dsh 配置文件包：它的 `package.json` 声明了 `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }`，因此将其安装到配置文件中会自动激活补丁层。

从本地签出，构建并安装复制的 `file:` 包，以便其 Harness 对等体通过配置文件的托管回退进行解析。重建后重新运行 add 以刷新副本：

```sh
pnpm run build
dsh plugin --profile tui add file:.
dsh --profile tui
```

来自 git，无需签出：`prepare` 脚本在安装过程中在消费者的计算机上转换 `lib/`。 pnpm ≥10 个块会一直构建，直到您允许为止，因此第一个 `add` 失败并显示 `allowBuilds` 提示；将精确的 pnpm 打印密钥复制到配置文件的 `pnpm-workspace.yaml` 中并重新运行：

```sh
dsh plugin --profile tui add github:deepseek-harness/turtle-ui   # fails with the allowBuilds key
# add the printed key under allowBuilds in ~/.dsh/profiles/tui/pnpm-workspace.yaml
dsh plugin --profile tui add github:deepseek-harness/turtle-ui   # builds and activates
dsh --profile tui
```

`prepare` 构建 (`tsdown.prepare.config.ts`) 无需类型检查即可转译 - 存储库的类型图需要同级线束检查，而消费者没有。 `pnpm run typecheck` 在同级结帐环境中仍然是类型门。

捆绑层位于 `@deepseek-ai/dsh-base` 之上，并将 TUI 和配置的代理绑定到一个持久会话。普通的 `tui-startup` 提供程序注入启动器的不可变 `ctx.cmdlineArgs`，解析 `--resume`、`--session` 和此应用程序的 `--help`，然后提供 `tuiStartup`；会话绑定行注入该服务并从惰性配置中读取它，因此它们无法在错误的会话上激活。裸露的 `dsh --profile tui` 在每次启动时都会生成一个新的会话 ID，`--session ` 显式命名一个新会话，而 `--resume <session>` 则继续保留会话。应用内 `/resume` 切换和退出消息行为仍然需要删除特定于 TUI 的启动器，并且仍然不可用。

## 检查

```sh
pnpm run typecheck
pnpm test
pnpm run build
```