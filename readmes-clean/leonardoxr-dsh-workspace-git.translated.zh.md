#dsh-workspace-git

直接从 Git URL 添加 DeepSeek Harness 工作区。

该插件扩展了 Harness 现有的 **添加工作区** 流程。打开它会显示两个选项卡：

- **现有文件夹** — 通常选择文件夹或输入其绝对路径。
- **克隆 Git 存储库** — 输入 Git URL、现有父文件夹和新存储库文件夹名称。

主机在没有 shell 的情况下运行 `git clone`，并将完整的路径返回到 Harness 的标准工作区创建流程。克隆发生在私有暂存目录中，因此失败的克隆永远不会删除或覆盖现有目标。

## 要求

- DeepSeek Harness `0.1.1-rc.2` 或兼容版本
- Node.js 22+
- `git` 可在 Harness 主机的 `PATH` 上使用

## 从结账处安装

```sh
pnpm install
pnpm pack
dsh plugin --profile default add /absolute/path/to/dsh-workspace-git-0.1.1.tgz
```

使用 Windows 上的 Harness `0.1.1-rc.2`，包含空格的本地包路径在转发到 pnpm 时可能会被分割。如有必要，请在运行 `dsh plugin add` 之前将 tarball 复制到无空间的路径，例如 `$env:TEMP\dsh-workspace-git-0.1.1.tgz`。

使用该配置文件重新启动 `dsh web` 并刷新 Web UI。客户端包元数据在启动时进行扫描，因此在 GUI 运行时安装包是不够的。

## 从 Git 安装

该软件包遵循[官方 Harness 插件打包指南](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)，并包含 Git 安装所需的 `prepare` 脚本：

```sh
dsh plugin --profile default add github:YOUR_ORG/dsh-workspace-git#COMMIT_SHA
```

默认情况下，pnpm 10 会阻止依赖项构建脚本。如果第一次安装要求构建批准，请将其报告的确切包密钥添加到配置文件的 `pnpm-workspace.yaml`：

```yaml
allowBuilds:
  dsh-workspace-git: true
```

然后重复安装。仅允许并固定您信任的代码：`prepare` 在安装过程中执行。

## 配置

这两个字段都可以在 **设置 → 插件 → Git 工作区** 中找到。更改将暂存直至保存，通过 DSH 设置保留，并在 DSH Web 重新启动后生效。配置文件行仍然是保存的用户覆盖下方的基本配置。

该捆绑包添加了一排 `workspace-git`。在配置文件补丁中覆盖它以调整基本配置：

```yaml
- insert:
    - id: workspace-git
      name: dsh-workspace-git
      config:
        timeoutMs: 600000
        maxOutputBytes: 65536
```

- `timeoutMs` — 克隆超时；默认 10 分钟，范围 1 秒 - 60 分钟。
- `maxOutputBytes` — 失败时返回的最大捕获的 Git 输出；默认 64 KiB，范围 1 KiB–64 MiB。

交互式 Git 提示被禁用，因此请求无法挂起等待终端输入。 SSH 代理和配置的凭据帮助程序仍然有效。克隆路由仅在正常浏览器操作中接受同源 JSON 请求。

## 发展

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

该包装是双面的：

- `src/index.ts` 是 Host Cordis 插件和克隆端点；
- `src/client/index.ts` 占用两个标准的添加工作区目录流槽以及选项卡式文件夹/Git 对话框；
- `package.json#dsh.client` 和 `./client` 导出让 Harness 发现 `lib/client.js`；
- `cordis.patch.yml` 在配置文件中注册程序包。

对于完整的浏览器集成，请将构建的包安装或链接到配置文件中。仅源 `--patch` 行仅加载主机一半，因为客户端模块注册表从包清单中发现浏览器捆绑包。