# dsh-session-deeplink

[中文](#zh-cn) | [English](#english)

## 中文

这是一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端插件，用于通过 URL 直接访问和分享 DSH 会话。

### 功能

- 通过 `/?session=` 直接打开指定会话。
- 切换当前会话时，自动同步浏览器地址栏中的会话 ID。
- 保留 URL 中其他查询参数和 fragment。
- 完全运行在浏览器端，不添加任何 host 服务。

### 从 npm 安装

将插件安装到 `web` profile：

```sh
dsh plugin --profile web add dsh-session-deeplink
```

重启 `dsh web`，然后打开任意会话。浏览器地址会变为：

```text
http://127.0.0.1:3080/?session=session-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

只要该会话仍存在于 DSH 会话列表中，打开此 URL 就会恢复到同一会话。

### 从 GitHub 安装

Git 依赖会通过包内的 `prepare` 脚本在本机完成构建：

```sh
dsh plugin --profile web add github:R3alloc/dsh-session-deeplink
```

pnpm 10 及以上版本可能要求先在对应 profile 的 `pnpm-workspace.yaml` 中明确授权构建，然后重新执行安装命令：

```yaml
allowBuilds:
  dsh-session-deeplink: true
```

日常安装建议使用 npm 包，因为 npm 包已经包含构建好的客户端 bundle，不需要在安装时执行构建代码。

### 开发

```sh
npm install
npm run typecheck
npm test
npm pack --dry-run
```

### 兼容性

当前版本基于 DeepSeek Harness `0.1.0-rc.6` 开发。DeepSeek Harness 目前仍处于开发者预览阶段，后续版本可能需要同步更新插件。

### 许可证

MIT

## English

A web client plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) that makes sessions directly addressable and shareable by URL.

### Features

- Opens `/?session=` directly in the requested session.
- Keeps the address bar synchronized when the active session changes.
- Preserves unrelated query parameters and URL fragments.
- Runs entirely in the browser and adds no host-side service.

### Install from npm

Install the bundle into the `web` profile:

```sh
dsh plugin --profile web add dsh-session-deeplink
```

Restart `dsh web`, then open a session. The browser URL becomes:

```text
http://127.0.0.1:3080/?session=session-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Opening that URL restores the same session as long as it still exists in the DSH session list.

### Install from GitHub

Git dependencies build locally through the package's `prepare` script:

```sh
dsh plugin --profile web add github:R3alloc/dsh-session-deeplink
```

pnpm 10 and later may require explicitly allowing the package build in the profile's `pnpm-workspace.yaml` before retrying the command:

```yaml
allowBuilds:
  dsh-session-deeplink: true
```

Prefer the npm package for normal installation because it already contains the built client bundle and does not execute build code during installation.

### Development

```sh
npm install
npm run typecheck
npm test
npm pack --dry-run
```

### Compatibility

Developed against DeepSeek Harness `0.1.0-rc.6`. DeepSeek Harness is currently a developer preview, so future releases may require plugin updates.