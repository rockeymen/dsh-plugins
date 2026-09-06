# omdp — 只有我的 DSH 插件

一个 GitHub 存储库，将我的所有 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) 插件收集为 **monorepo**。每个插件都位于其自己的子目录中，并且是一个可独立安装的 DSH 捆绑包。

## 布局

```
omdp/
├── README.md            # this file
├── package.json         # root manifest — keeps bare-git installs functional (see below)
├── dsh-connector/       # unified MCP + Skills manager (Web UI settings tab)
│   ├── index.js         # host half
│   ├── client.js        # client half (Web UI)
│   ├── cordis.patch.yml # bundle activation row
│   ├── package.json
│   └── README.md
├── dsh-vision-bridge/   # vision bridge: let text-only models "see" via a configured multimodal endpoint
│   ├── index.js         # host half
│   ├── client.js        # client half (paste/drop → temp path)
│   ├── cordis.patch.yml # bundle activation row
│   ├── package.json
│   └── README.md
├── archive/             # archived plugins retained for historical reference
│   ├── dsh-gitbash-win/
│   └── resume-stream/
├── _skeleton-client/    # copy-paste template: client + host bundle (Web UI plugin)
├── _skeleton-host/      # copy-paste template: host-only bundle
├── docs/                # research notes, e.g. AI-DSH-plugin-quality.md (community findings)
└── <future plugins>/    # each its own subdirectory + package.json
```

## 插件

### `dsh-connector` → npm 名称 `@omdp/dsh-connector`

一个设置选项卡（“连接器”）可通过 DSH Web UI 管理两件事：

- **MCP 服务器** — 编辑 `cordis.patch.yml` 中的 MCP 块（stdio/streamable-http）。旧版 SSE 服务器（例如知乎）保留为 `mcp-remote --transport sse-only` stdio 桥接器；该插件仅管理该配置文本。
- **用户技能** — `~/.dsh/skills/<name>/SKILL.md` 下的读/写/删除技能。

通过**本地 `link:` 依赖项**安装到配置文件中（有关确切步骤，请参阅其自述文件）：

```json
"@omdp/dsh-connector": "link:D:/WorkSpace/omdp/dsh-connector"
```

### `dsh-key-fallback` → npm 名称 `@omdp/dsh-key-fallback`

最小 API 密钥回退：出现可重试请求错误（`AUTH / 401 / key / rate / timeout` → `agent/request-error`）时，默默地标记当前密钥冷却并**一步使用下一个池密钥重试相同的请求**。提供始终可见的设置部分 (`settings.section → API Key 回退`)，显示 `分nek` 按键计数/光标/冷却/健康（可见性门控轮询，无忙循环）。

在`~/.dsh/settings.yaml`中配置：

```yaml
keyFallback:
  providers:
    ninerouter:   # provider id (e.g. ninerouter / openrouter / a6api)
      env: NINEROUTER_API_KEY
      keys:
        - sk-xxx   # pooled keys
        - sk-yyy
      cooldownMs: 30000
```

**工作原理：** `llm-pi-ai` 提供程序（例如 `ninerouter`）通过凭证域进行身份验证 - 主机写入 `ctx.credentials.set(env, key)` **和** `process.env[env]`，因此重试实际上到达模型调用 **和** UI `settings.section` + `settings.plugin.item` 卡显示 `分nek` 冷却/运行状况良好。旋转受到每回合限制（`turn:step` → ≤ `keys.length` 重试），并有每次失败 30 秒的冷却时间（最多 5 倍）。有关完整参考，请参阅 `dsh-key-fallback/README.md`；有关 ESM 捆绑模式，请参阅 `dsh-vision-bridge` 的 `index.js`。

通过 **本地 `link:` 依赖项** 或从 **npm** 安装到配置文件中：

```json
"@omdp/dsh-key-fallback": "^1.0.7"
```

### `dsh-vision-bridge` → npm 名称 `@omdp/dsh-vision-bridge`

一个零依赖插件，提供**纯文本模型**愿景：它自动检测是否
路由模型支持图像，对于纯文本模型，将粘贴/附加图像转发到
可配置的 OpenAI 兼容多模式端点（默认 Agnes `agnes-2.5-flash`）并馈送
返回文本作为证据。提供 `vision_bridge_read_image` 工具、粘贴/放置 → 临时路径
浏览器处理程序、包装的 `(vision bridge)` 提供程序条目和 `agent/pre-step` 自动读取挂钩。

通过**本地 `link:` 依赖项**安装到配置文件中：

```json
"@omdp/dsh-vision-bridge": "link:D:/WorkSpace/omdp/dsh-vision-bridge"
```

请参阅其自己的 `README.md` 以获取完整的配置参考。

## 已存档的插件

以下插件保留在 [`archive/`](archive/) 下以供历史参考，并且此存储库不再维护或发布：

- `@omdp/dsh-gitbash-win` → [`archive/dsh-gitbash-win/`](archive/dsh-gitbash-win/)
- `@omdp/dsh-resume-stream` → [`archive/resume-stream/`](archive/resume-stream/)

现有的 npm 版本仍然可以从 npm 获得。存档源不会自动从任何 DSH 配置文件中卸载已安装的软件包。

## 从 GitHub 远程安装（替代）

每个活动插件都是一个独立的 npm 包，位于其自己的子目录中，因此它也可以
直接从 GitHub 安装，无需本地结帐：

```sh
dsh plugin --profile web add github:XJungit/omdp#path:dsh-connector
dsh plugin --profile web add github:XJungit/omdp#path:dsh-vision-bridge
```

> **安装命令前提**：上面的 `dsh plugin add` 需要 `dsh` 已在 PATH 中。若你是按官方文档用 `npx` 运行 dsh（没有全局 `dsh` 命令），上面这几行会报 `command not found: dsh` —— 每行前面加 `npx @deepseek-ai/dsh` 即可（不要求 `dsh` 在 PATH 中）。

`#path:<subdir>` 选择器告诉 pnpm 要安装哪个工作区子目录
（它解析为该子包的 `package.json`，而不是存储库根）。

**pnpm ≥10 构建脚本门。** git install 获取 *sources*，而 pnpm 拒绝
运行 git 依赖项的 `prepare`/build 脚本，直到明确允许 -
第一个 `add` 会失败，直到您将其列入配置文件的 `pnpm-workspace.yaml` 中：

```yaml
allowBuilds:
  '@omdp/dsh-connector': true
  '@omdp/dsh-vision-bridge': true
```

然后重新运行`add`。 （这些插件是纯 JavaScript，没有构建步骤，
所以白名单是唯一的障碍——不需要 `prepare` 脚本。请参阅
官方[发布.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
完整的“构建脚本捕获”。）将津贴视为运行
安装时包的代码；对于不受信任的来源，固定提交
（`github:XJungit/omdp#<sha>&path:<subdir>`）。

其他 DSH 插件集合也使用相同的 monorepo 布局，例如
[zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui).

## 从 npm 安装（推荐）

所有三个插件都发布到 **npm** （`@omdp/dsh-connector`、`@omdp/dsh-vision-bridge`、
 `@omdp/dsh-key-fallback`），
通过每个 `v*` 标签上的 GitHub 操作自动进行。这是**首选**安装
路径 — 它避免了 git-`#path:` 标准化、交叉分辨率和
`allowBuilds` GitHub 安装时产生的摩擦（参见历史记录）
`docs/npm-publish.md`）。

```jsonc
// ~/.dsh/profiles/<name>/package.json — you can use three or mix-and-match
"dependencies": {
  "@omdp/dsh-connector": "^0.2.5",
  "@omdp/dsh-vision-bridge": "^0.1.6",
  "@omdp/dsh-key-fallback": "^1.0.7"
}
```

```sh
cd ~/.dsh/profiles/<name>
pnpm install
```

更新的是标准`pnpm update`：

```sh
cd ~/.dsh/profiles/<name>
pnpm update @omdp/dsh-connector @omdp/dsh-vision-bridge @omdp/dsh-key-fallback
```

无 `#path:` 规格，无 `allowBuilds` 门，无一次性修复脚本，无重复
loader-id 陷阱 — npm 包作为干净的包安装。

## 发布新版本（GitHub Actions）

1.在`dsh-connector/package.json`、`dsh-vision-bridge/package.json`中凸点`version`，
 和 `dsh-key-fallback/package.json`（或仅您触摸过的）。
2. 提交，然后标记并推送：
   ```sh
   git tag v1.0.7
   git push origin master && git push origin v1.0.7
   ```
3. `.github/workflows/publish.yml` 将三个包发布到 npm 并注明出处
 （重新发布已发布的版本是无操作的 - 打印跳过消息）。
4. 更新您的个人资料：`pnpm update @omdp/dsh-connector @omdp/dsh-vision-bridge @omdp/dsh-key-fallback`。

有关完整设置，请参阅 [`docs/npm-publish.md`](docs/npm-publish.md)（npm 令牌、
GitHub揭秘，故障排除）。

## 历史：GitHub 和本地链接安装

GitHub 安装 (`dsh plugin add github:XJungit/omdp#path:`) 有效但命中
网络/TLS 摩擦（例如 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`）和 pnpm 的 git-`#path:`
`update` 上的标准化（删除了 `#path:` 规范并可以交叉解析
两个包都到存储库根目录）。一次性修复脚本
(`~/.dsh/profiles/web/update-omdp.ps1`) 处理了这些，但是 npm installs 使所有
那个不必要的。

本地 `link:` 安装（`"@omdp/": "link:<abs-path>/omdp/"`）仍然有效：
`pnpm install` 创建一个连接，因此正在运行的插件**是**存储库源，并且
更新=编辑/拉取+重新启动。在积极开发过程中，它们仍然是一个不错的选择。

## 惯例

- 每个插件子目录都是一个独立的 npm 包，带有 `dsh.bundle`（以及可选的 `dsh.client`）清单。
- 包名称的范围位于 `@omdp/` 下，以避免与 npm 上的上游 `dsh-*` 包发生冲突。
- 此存储库中的插件是纯 JavaScript（无构建步骤），因此都是本地插件