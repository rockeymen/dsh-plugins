#dsh-image-preview

内置 DeepSeek Harness `read_image` 工具的内联图像预览。

该插件使用 DSH 的公共会话范围 `tool.call.toolview` 插槽。由于官方工具树通过同一槽分派嵌套子调用，因此一个渲染器涵盖了两者：

- 直接拨打`read_image`；和
- `tools.read_image(...)` 调用嵌套在 `run_code` 代码模式中。

每个加载的预览都包括**复制图像**以及可见的成功或失败反馈。支持时直接复制PNG字节；必要时，其他可接受的格式会在浏览器中转换为 PNG。

## 安全性和生命周期

- 字节仅通过 `ctx.sessions.binding(sessionId).session.readAttachment(attachmentId)` 获取。
- 模型提供的文件路径仅是显示/导航元数据，浏览器插件永远不会重新读取。
- 仅呈现经过身份验证的 PNG、JPEG、WebP 和 GIF 附件响应。
- Blob URL 在替换、重试、卸载和 HMR 处置时被撤销。
- 剪贴板副本使用相同的经过身份验证的附件 blob；有界浏览器内转换永远不会重新读取模型提供的路径或添加网络回退。
- 格式错误/遗留结果和附件 RPC 失败会降级为有界内联错误，没有文件系统或网络回退。

## 设置

该插件在 DSH 设置 → 插件下提供了一张 **图像预览** 卡，其中包含两个实时、持久的选项：

- **启用内联预览** — 禁用它会删除自定义渲染器并恢复 DSH 的通用工具行。
- **自动打开预览** — 禁用后，每个图像开始折叠并仅在单击 **显示预览** 后加载。

## 发展

```sh
pnpm install
pnpm check
```

该包遵循官方[Harness插件指南](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)：它导出一个函数形式的主机插件，声明一个`dsh.bundle`补丁，公开一个Web客户端条目，声明其注入的公共包，并通过生命周期效果进行显式清理。

## 安装到配置文件中

tarball 避免了 git-build 权限，并且在签出路径包含空格时很健壮：

```sh
pnpm pack --pack-destination "$HOME/.dsh/packages"
dsh plugin --profile web add "$HOME/.dsh/packages/dsh-image-preview-0.3.0.tgz"
dsh --profile web --dump-config
```

install 命令添加包依赖项并将 `dsh-image-preview` 附加到配置文件的有序捆绑包列表中。正在运行的Web配置文件加载新包后刷新页面；首次主机安装需要经操作员批准的 Web 重新启动。