# DeepSeek Harness 的 Tensorlake 沙箱

`@tensorlakeai/dsh-sandbox` 将 DeepSeek Harness 文件、子进程、Bash、终端和 LSP 操作移动到一个短暂的 Tensorlake microVM 中。它是一个可安装的 dsh 捆绑包，不需要更改 Harness 安装。

## 先决条件

- Node.js `^22.19.0` 或 `>=24.0.0`
- `@deepseek-ai/dsh` `0.1.0-rc.6` 或更高版本的兼容版本
- 主机环境中设置了 `TENSORLAKE_API_KEY` 的 Tensorlake 项目
- 在主机环境中为默认 DeepSeek 模型提供程序设置 `DEEPSEEK_API_KEY`

将凭证保存在环境变量或秘密管理器中；不要将它们提交到配置文件或存储库。

## 安装

安装 dsh 并将此捆绑包添加到您运行的配置文件中：

```sh
npm install --global @deepseek-ai/dsh
dsh plugin --profile headless add @tensorlakeai/dsh-sandbox
TENSORLAKE_API_KEY=... DEEPSEEK_API_KEY=... dsh --profile headless "build and test this repo"
```

在开发过程中，从其目录安装本地结账：

```sh
npm install
npm run build
dsh plugin --profile headless add .
```

使用 `dsh --profile headless --dump-config` 验证 `@tensorlakeai/dsh-sandbox` 层是否禁用主机 `subprocess` 和 `fs-sandbox` 提供程序，插入 Tensorlake 运行时、子进程和文件系统行，并保持 `bash-sandbox` 以 `danger-full-access` 模式安装。在该模式下，Harness 的沙箱感知 Bash 执行器直接委托给 Tensorlake 子进程提供者，同时仍然满足权限预设的功能契约。

## 冒烟测试

运行一项无头任务来锻炼子进程和文件系统提供程序：

```sh
dsh --profile headless \
  "Use Bash to run pwd and id. Create smoke-test.txt containing hello, read it back, and report the results."
```

成功运行会报告来自 `pwd` 的 `/home/tl-user/workspace`、来自 `id` 的 `tl-user` 身份，并从文件中读回 `hello`。面向模型的工作目录是相同的远程 Linux 路径，因此响应不应提及或从主机路径回退。

## 配置

该捆绑包在配置文件启动时启动一个临时沙箱，并在 dsh 退出时终止它。运行时模块接受以下 Cordis 配置字段：

每次运行都会在两个生命周期边界打印沙箱 ID。 ID 应匹配：

```text
Tensorlake sandbox created: <sandbox-id>
Tensorlake sandbox terminated: <sandbox-id>
```

### 字段·默认值·含义
- **字段**：`apiKey` · **默认**：`TENSORLAKE_API_KEY` · **含义**：仅由主机 SDK 使用的 Tensorlake API 凭证
- **字段**：`cwd` · **默认**：`/home/tl-user/workspace` · **含义**：文件和进程提供者共享的绝对Linux工作目录
- **字段**：`timeoutSecs` · **默认**：`600` · **含义**：沙箱不活动超时
- **字段**：`cpus` · **默认**：Tensorlake默认 · **含义**：虚拟CPU分配
- **字段**：`memoryMb` · **默认**：Tensorlake 默认 · **含义**：以 MiB 为单位的内存分配
- **字段**：`diskMb` · **默认**：Tensorlake 默认 · **含义**：MiB 中的根磁盘分配

交付的捆绑包从 `DSH_TENSORLAKE_CWD` 派生运行时 cwd 和策略工作区。更改工作区时首选单一设置，这样 Bash 策略和远程提供程序就不会发生变化：

```sh
DSH_TENSORLAKE_CWD=/workspace/project dsh --profile headless "build and test this repo"
```

要直接在配置文件的 `cordis.patch.yml` 中配置行，请将两者一起覆盖。补丁会替换完整的配置，因此请重申您需要的每个非默认字段：

```yaml
- id: sandbox-policy
  config:
    mode: danger-full-access
    workspaceRoot: /workspace/project

- id: tensorlake-runtime
  config:
    cwd: /workspace/project
    timeoutSecs: 1800
    cpus: 2
    memoryMb: 4096
```

`apiKey` 是可选的，通常应省略。该软件包永远不会将 `TENSORLAKE_API_KEY`、`DEEPSEEK_API_KEY`、其他凭证形状的环境变量或 `DSH_*` 变量复制到沙箱进程中。调用者仍然可以通过 Harness 工具或服务请求传递显式环境条目。

## 运行时要求

Tensorlake镜像必须提供`bash`、Node.js和GNU `base64`、`cat`、`chmod`、`env`、`find`、`grep`、`ln`、`mkdir`、`mktemp`、`mv`、 `ps`、`realpath`、`rm`、`stat` 和 `tee`。默认托管的 Ubuntu 映像提供了这些工具。运行时验证配置的 cwd 是否可写，并在必要时使用托管映像的无密码 `sudo` 创建和移交受保护的路径。

该软件包面向 `@deepseek-ai/dsh`、`0.1.0-rc.6` 或更高版本的兼容版本。 dsh 安装通过配置文件模块后备提供其可选的 Cordis、文件系统、子进程和 Schemastery 对等点。该包仅使用公共`ctx.fs`和`ctx.subprocess`服务定义；不需要 DeepSeek Harness 源注册、生成的目录或存储库内配置。

## 已知限制

- `tensorlake@0.5.103`，当前SDK版本，引脚`undici@8.3.0`和`nanoid@3.3.11`； `npm audit --omit=dev` 报告这些传递版本的高严重性建议。当前没有经过审计的 Tensorlake SDK 版本可用，因此在生产使用之前请查看上游建议，并在 Tensorlake 发布时更新 SDK 引脚。

## 开发

```sh
npm install
npm run check
npm pack
```

三个 Loader 入口点是 `@tensorlakeai/dsh-sandbox/runtime`、`@tensorlakeai/dsh-sandbox/filesystem` 和 `@tensorlakeai/dsh-sandbox/subprocess`。每个模块默认导出其服务类；不要将函数插件命名导出添加到这些模块，因为 Cordis 加载器将混合导出形式视为函数插件命名空间。