# dsh-huadongbianzuqi

![SC](https://raw.githubusercontent.com/zjl88858/dsh-huadongbianzuqi/refs/heads/main/screenshot.png)

一个不太严肃、但可以正常工作的 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 前端插件。

它接管输入框中的模型选择控件，将 DeepSeek 模型的 Effort 选项替换为带头像旋钮、机械导轨和刻度盘的三档滑块。

| 实际 Effort ID | 前端显示 | 头像资源 |
|---|---|---|
| `none` / `off` | 牢梁 | `knob-avatar1.png` |
| `high` | 梁子 | `knob-avatar2.png` |
| `max` | 梁圣 | `knob-avatar3.png` |

显示映射只存在于浏览器界面。插件会将 Harness 模型目录提供的原始 Effort ID 原样交回 `session.selectModel`，不会把“牢梁”“梁子”或“梁圣”写入实际模型请求。

## 功能

- 使用三档滑块替换内置 Effort 下拉菜单。
- 支持鼠标拖动、轨道点击和键盘方向键。
- 保留模型选择、加载状态和错误提示。
- 复用 Harness 内置 `modelDirectories` 服务，不自行实现模型调用。
- 通过 `conversation.input.model` 插槽覆盖内置控件，卸载后自动恢复。
- 将三张头像构建为内嵌 data URL，不依赖额外的静态资源服务。

## 安装

以下方式都不需要 clone 仓库。

### 从 GitHub Release 安装（推荐）

从 [Releases](https://github.com/zjl88858/dsh-huadongbianzuqi/releases) 下载对应版本的预构建 tarball，然后直接安装到 Web profile：

```sh
dsh plugin --profile web add https://github.com/zjl88858/dsh-huadongbianzuqi/releases/download/v0.1.0/dsh-huadong-bianzuqi-0.1.0.tgz
dsh --profile web
```

预构建 tarball 已包含 `lib/client.js`，安装时不需要 Bun，也不执行源码构建脚本。发布新版本后，请将命令中的版本号替换为目标 Release 版本。

### 直接从 GitHub tag 安装

也可以让 pnpm 直接下载指定 Git tag 的源码：

```sh
dsh plugin --profile web add github:zjl88858/dsh-huadongbianzuqi#v0.1.0
```

Git 安装需要执行本项目的 `prepare` 脚本来生成 `lib/`，因此 pnpm 10 及以上版本可能拒绝首次构建。按照终端提示，在该 profile 的 `pnpm-workspace.yaml` 中批准构建：

```yaml
allowBuilds:
  dsh-huadong-bianzuqi: true
```

然后重新执行安装命令。批准构建意味着允许本项目的 Bun 脚本在本机运行；请固定可信的 tag 或 commit，不要安装未经审阅的移动分支。

安装完成后启动或重启 Harness，并刷新浏览器页面：

```sh
dsh --profile web
```

卸载：

```sh
dsh plugin --profile web remove dsh-huadong-bianzuqi
```

## 从源码构建

需要 [Bun](https://bun.sh/) 1.2 或更高版本：

```sh
bun run check
```

该命令运行单元测试并生成 `lib/index.js` 与 `lib/client.js`。创建发布 tarball：

```sh
bun pm pack
```

## 兼容性

- 同时识别 DeepSeek Harness 使用的 `off` 与其他模型目录可能提供的 `none`，二者都只显示为“牢梁”。
- 未识别的 Effort ID 仍可使用，并显示适配器提供的原始名称。
- 当前插件针对提供 `conversation.input.model` 和 `modelDirectories` 的 DeepSeek Harness Web profile。
- 本项目使用 Bun 构建，但运行时由 DeepSeek Harness Web Client 加载。

## 玩笑项目与图像声明

**这是一个玩笑项目。** 名称、档位称呼和视觉设计用于幽默表达，不代表图片中人物、DeepSeek 或任何其他个人与组织对本项目的认可、参与或背书。

项目维护者不拥有随仓库提供之头像图像中人物的肖像权，也不通过本仓库授予任何与肖像、姓名、身份、公开权、隐私权、商标、版权或其他第三方权利有关的许可。MIT-0 仅适用于项目维护者有权许可的代码与材料，不会覆盖或取代第三方对图像及其所描绘人物享有的权利。

如果你计划公开传播、商业使用、再分发或制作衍生版本，请自行确认所在司法辖区的适用法律、素材来源及所需授权。如果你是相关权利人并希望移除素材，请通过 [GitHub Issues](https://github.com/zjl88858/dsh-huadongbianzuqi/issues) 联系维护者。

## 协作者

- [神龟](https://github.com/zjl88858)：项目维护者。
- **GPT-5.6 Sol**：实现协作者，参与代码、视觉样式、测试与发布文档制作。
- **Muse Spark 1.2**：代码审阅者。

AI 协作者名称用于说明其参与角色，不表示其拥有独立 GitHub 账号、提交身份或项目所有权。

## 许可证

项目代码采用 [MIT No Attribution（MIT-0）](./LICENSE) 许可证。第三方图像及肖像相关权利不包含在该许可中，详见上方声明。

## 项目地址

<https://github.com/zjl88858/dsh-huadongbianzuqi>
