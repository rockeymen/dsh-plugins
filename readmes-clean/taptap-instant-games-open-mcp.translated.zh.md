# TapTap Open API MCP 服务器

> 基于 Model Context Protocol (MCP) 的 **TapTap 小游戏和 H5 游戏**服务器，提供排行榜、分享、多人联机、云存档，以及当前游戏 DC 数据查询、统计概览与评价操作能力，并支持 **OAuth 2.0 零配置认证**。

🔐 **零配置 OAuth** | 📚 **完整文档** | 🎯 **丰富 Tools & Resources** | 🌍 **小游戏 & H5** | 📦 **单文件 Bundle**

## ✨ 核心特性

- **🔐 零配置认证** - OAuth 2.0 Device Code Flow，扫码即用
- **📖 完整 API 文档** - 6 个排行榜 API + 详细代码示例
- **⚙️ 服务端管理** - 创建/管理排行榜，自动处理 ID
- **🎮 H5 游戏支持** - 上传、发布、状态查询
- **🧭 当前游戏 DC 能力** - 商店/评价/社区统计概览、商店快照、论坛内容、评价列表、评价点赞、官方回复
- **🦞 OpenClaw Plugin** - 提供一个原生 OpenClaw plugin 子包，内部复用 TapTap MCP 运行时并暴露 raw JSON 工具 + bundled skill
- **🚀 三种传输模式** - stdio（本地）、SSE（远程/实时）、HTTP（兼容）
- **🔌 多客户端并发** - 独立会话管理，无限并发
- **📦 单文件 Bundle** - 零依赖，包体积减少 96%（567 KB）
- **🤖 智能引导** - AI Agent 自动验证前置条件，主动询问用户选择

**NPM**: [@taptap/instant-games-open-mcp](https://www.npmjs.com/package/@taptap/instant-games-open-mcp)
**Maker NPM**: [@taptap/maker](https://www.npmjs.com/package/@taptap/maker)

## TapTap Maker 客户端插件

[`plugins/taptap-maker`](plugins/taptap-maker) 是插件专属安装与下载页面。Codex 和 WorkBuddy
插件共用独立插件版本，当前值读取 `config/maker-plugin-version.json`；内置 Maker MCP 版本读取
`config/maker-version-policy.json`，两条版本线互不覆盖。插件内置 Maker MCP 单文件运行时、CLI、
Skills 和排障文档，不通过 npm/npx 下载或启动 Maker。

对外安装应把对应渠道的 GitHub Release 页面交给 AI，由页面中的统一安装指南选择客户端 ZIP、
校验并执行安装前后的旧 MCP 兼容检查。下面的仓库 marketplace 命令仅用于维护者从源码验证；
执行 `marketplace add` 前，必须用刚生成的插件 CLI 完成下文同样的安装前检查和迁移。

```bash
npm run maker:codex-plugin:prepare
node plugins/taptap-maker/dist/maker.js plugin inspect --client codex --json
node plugins/taptap-maker/dist/maker.js plugin migrate --client codex --confirm --json
node plugins/taptap-maker/dist/maker.js plugin inspect --client codex --json
codex plugin marketplace add taptap/instant-games-open-mcp --ref main \
  --sparse .agents/plugins --sparse plugins/taptap-maker
codex plugin add taptap-maker@taptap-maker
node plugins/taptap-maker/dist/maker.js plugin migrate --client codex --confirm --json
node plugins/taptap-maker/dist/maker.js plugin inspect --client codex --json
```

插件 manifest 和 marketplace 版本读取 `config/maker-plugin-version.json`；bundle 运行时身份继续读取
`config/maker-version-policy.json`。运行 GitHub Actions 中的 `Prepare Maker Plugin Release` 会自动把
插件 patch 加一、重新生成两端产物并创建 PR；合并后 `Publish Maker Plugin` 自动发布两份 ZIP、
`INSTALL.md`、`SHA256SUMS` 和机器可读发布清单，不触发 npm 发布。

旧用户安装插件前，先用 ZIP 解压目录或本地生成目录中的插件 CLI 执行
`taptap-maker plugin inspect --client codex --json`。如果旧的独立 Maker MCP 仍启用，向用户说明
已发现重复注册并直接执行
`taptap-maker plugin migrate --client codex --confirm --json`。迁移只写入 `enabled = false`，保留
原配置、最近备份、PAT、项目绑定和游戏文件；插件安装请求即为这次兼容迁移的授权，不再单独询问，
重复执行也是幂等的。检查返回 `ambiguous` 时必须在安装前停止；安装完成后必须再次迁移并检查，
只有状态为 `disabled` 或 `not_found` 才能报告插件可用。需要卸载插件并恢复旧 MCP 时，仍要先取得明确确认，再执行
`taptap-maker plugin restore --client codex --confirm --json`。
如果本次安装中任一次迁移实际禁用了旧注册，但插件安装或验证失败，则用同一 restore 命令自动回滚；
回滚前先移除本次已安装的插件并确认其不再启用，不能在插件仍启用时恢复旧 MCP。原本已禁用、未找到
或不是本次迁移的注册不恢复。安装前迁移失败时立即停止，不进入插件安装。

插件模式初始化使用 `taptap-maker init --skip-mcp-install`，避免 CLI 再写一份独立 MCP 配置。
插件更新通过插件内专用 `update-taptap-mcp` Skill 和 Codex marketplace 完成，不执行 npm/npx
或独立 `taptap-maker upgrade`。旧 MCP 恢复前会核对迁移时记录的注册指纹，同名注册已被替换时
保持禁用并返回 `not_owned`。插件故障上报读取插件自己的 `.mcp.json` 并验证当前 bundle；独立
Maker MCP 仍沿用原有用户配置和 self runtime 诊断。

WorkBuddy 插件是独立产物，位于
[`plugins/workbuddy/taptap-maker`](plugins/workbuddy/taptap-maker)，通过共享的 CodeBuddy 插件
规范聚合 Maker MCP、CLI、Skills 和两个快捷命令：

```text
/taptap-maker:create-project
/taptap-maker:sync-project
```

两个入口都要求当前 WorkBuddy workspace 为空目录。插件启动器优先解析 WorkBuddy managed
Node.js（包括 Windows 上未加入 PATH 的 `node.exe`），必要时才回退系统 Node.js；运行插件内
`${CODEBUDDY_PLUGIN_ROOT}/dist/maker.js`，不依赖 npm/npx。仓库 marketplace 位于
`.codebuddy-plugin/marketplace.json`：

```text
/plugin marketplace add <REPOSITORY_ROOT>
/plugin install taptap-maker@taptap-maker
/reload-plugins
```

WorkBuddy 旧独立 MCP 的迁移使用 `--client workbuddy`，只把旧注册的 `disabled` 设为 `true`，
同时支持幂等检查和确认式恢复。插件更新通过 WorkBuddy `/plugin` 完成。

## 🦞 OpenClaw Plugin（实验中）

仓库内提供了一个可独立使用的 OpenClaw plugin 子包：

- [`packages/openclaw-dc-plugin`](packages/openclaw-dc-plugin)

这个子包的设计目标是：

- 让 OpenClaw 用户只安装一个 plugin
- plugin 内部复用 `@taptap/instant-games-open-mcp` 运行时
- 对 OpenClaw 暴露 raw JSON 工具
- 同时内置 `taptap-dc-ops-brief` skill，让模型自己做简报解读

说明：

- 主包里的 `*_raw` tools 默认不会暴露给普通 MCP 客户端
- 只有设置 `TAPTAP_MCP_ENABLE_RAW_TOOLS=true` 时才会注册
- OpenClaw plugin 会自动打开这个开关，因此插件用户不需要额外配置

详见：

- [OpenClaw Plugin 说明](docs/OPENCLAW_PLUGIN.md)

## 🛠️ TapTap Maker 本地开发（CLI-first）

Maker 本地开发独立发布为 `@taptap/maker`。首次配置推荐直接运行：

```bash
npx -y @taptap/maker init
```

CLI 负责一次性流程：Git 检查、Python 和 maker-lua-lsp 本地 Lua 诊断环境检查、CLI 登录、
TapTap token 换取、app 列表选择或新建 Maker 项目、Maker Git clone、AI dev kit 准备、MCP 配置写入与基础验证。Python 环境准备连续 3 次失败时，
初始化会暂停在登录、项目拉取和 MCP 配置之前；修复后重新运行 `taptap-maker init`。首次安装，或 Maker MCP 包/
静态工具 schema 发生变化后，Claude Code / Codex / Cursor / Trae / OpenCode / WorkBuddy 通常需要重连或刷新一次 MCP，
才能加载新的 MCP tools；DeepSeek Harness（DSH）会监听用户补丁并热重载，不要求重启 IDE。单纯绑定或切换 Maker 项目
不会修改用户级 MCP 配置，也不需要重启会话或新开对话。当前终端里的
CLI 初始化流程可以继续完成到 PAT 鉴权和项目绑定。

常用 CLI：

```bash
taptap-maker init
taptap-maker login
taptap-maker doctor
taptap-maker apps --json
taptap-maker install
taptap-maker agents update
taptap-maker upgrade
taptap-maker mcp verify
npx -y --package @taptap/maker@<exact-version> taptap-maker mcp report --ide <client> --target-dir  --context-stdin --consent --json
taptap-maker dev-kit update
```

普通初始化、clone、下载或拉取远端项目的标准命令是 `taptap-maker init`，CLI 会展示 app 列表，
让用户选择已有 app 或 `0`/`new`。`--create` 只用于用户明确要求创建新 Maker 项目的场景。
如果需要创建新 Maker 项目，仍从 `taptap-maker init` 进入。app 列表底部会固定显示
`0. Create a new Maker project`，输入 `0` 或 `new` 后填写项目名称；自动化场景可用
`taptap-maker init --create --name "my-local-game"`。当前目录已绑定 Maker 项目时，不允许在同一目录
创建并覆盖绑定；请先切到一个新的独立目录再运行 `taptap-maker init`。

`taptap-maker login` 是 CLI 登录入口；它会按需打开 Maker 授权页，CLI 轮询授权结果并完成本地鉴权配置。
`taptap-maker init` 缺 PAT 时会自动进入该流程。`taptap-maker pat set` 保留为兼容入口；
自动化场景可用 `--pat-stdin` 从标准输入读取。`taptap-maker install` 是
`taptap-maker mcp install` 的快捷别名。二者都会先用最终启动命令完成 MCP
`initialize` 和 `tools/list`，验证成功后才写入 AI 客户端 MCP 配置；失败不会改动配置或备份。
默认 launcher 会把当前精确版本的 Maker bundle、skills 和排障文档复制到用户 Maker 目录下的
版本化 `mcp-runtime`，配置使用绝对 Node 路径直接启动，不依赖 npx 缓存、网络或客户端 PATH。
只有明确需要 npm 启动链路时才使用 `--launcher npx`；该模式固定当前包版本并使用专用可写缓存。
`taptap-maker init` 写入多个客户端配置时会继续尝试其余目标；只要任一目标失败，init 就记录
`mcp_install_failed`、以非零状态结束且不报告初始化完成。已经成功写入的客户端配置会保留，
修复失败项后重新运行 `taptap-maker install` 即可自动检测并幂等重试。
默认会写入 Codex、Cursor、Claude，并自动检测本机已有的 Trae、OpenCode、WorkBuddy、DSH
配置文件；命中后会合并安装 `taptap-maker`。Trae Solo 是重点支持目标，CLI 会在 Solo
或 Solo CN 的 `User/` 目录存在时创建或合并 `User/mcp.json`；普通 Trae/Trae CN 仍作为
候选路径保留，但只有 `mcp.json` 已存在时才合并写入。WorkBuddy 在 macOS 和 Windows 都优先检测
并合并用户目录下已有的 `.workbuddy/mcp.json`。legacy `.workbuddy/.mcp.json` 仅在官方配置文件不存在且
自身已存在时作为 fallback 合并；写入的 WorkBuddy MCP server 会包含 `disabled: false`。
WorkBuddy 账号维度的启用/信任状态在 `.workbuddy/connectors/<account-id>/connector-states.json`
中维护，不在 `mcp.json` 中；CLI 只做只读诊断，并在安装结果中提示用户到 WorkBuddy MCP 设置里
启用/信任 `taptap-maker`，不会自动修改账号信任状态。
普通 `doctor` 不会因为发现 `.workbuddy` 就输出 WorkBuddy 诊断。OpenCode 只在
`~/.config/opencode/opencode.jsonc` 已存在时写入。
DSH 使用 `@deepseek-ai/dsh-mcp-client` 插件，不使用 `mcp.json`。检测到 `$DSH_HOME`
（默认 `~/.dsh`）后，普通 `taptap-maker install` 会自动创建或合并用户级 `cordis.patch.yml`，
写入稳定 self launcher、`failOnStartupError: true` 和 1 小时 `toolCallTimeoutMs`，并保留其它插件。
新增项使用 DSH Cordis `insert` patch；若已经存在 profile 级 Maker registration，CLI 会就地更新
对应 profile，避免全局和 profile 出现重复 `serverName`。
默认 home 级补丁适用于 DSH 的不同 profile；检测到已有 profile 级注册时则只更新对应 profile。
两者都可由 DSH HMR 热重载。配置不写项目 `cwd`；DSH 当前
不广播 MCP Roots，因此 AI 必须在具体 Maker tool 调用中把当前游戏项目作为 `target_dir` 传入。
需要把 Maker 技能（工作流 + 广告/云存档/排行榜指南）一并打包进 DSH 时，可用 bundle 插件
`@taptap/dsh-maker`（源码 `packages/dsh-maker/`），通过 1024Store 或 GitHub 子目录源
`github:taptap/instant-games-open-mcp#path:packages/dsh-maker` 一键安装，详见
[docs/DSH_PLUGIN.md](docs/DSH_PLUGIN.md)。该无 ref 源跟随 `main`；固定版本使用 `dsh-maker-v*`
GitHub Release tarball。该插件与 L1 的裸 MCP 行不要同时启用。
其它 AI 编辑器应优先让本地 AI 复用 `taptap-maker mcp install` 已验证的绝对 command/args。
只有无法复用安装器时，才使用下面固定精确版本的 npx 兼容片段：

```json
{
  "mcpServers": {
    "taptap-maker": {
      "command": "npx",
      "args": ["-y", "-p", "@taptap/maker@<exact-version>", "taptap-maker"]
    }
  }
}
```

TapTap Maker 的用户配置不需要设置服务环境。预览、构建、测试二维码和本地开发都使用官方服务配置。

`taptap-maker init`、`mcp install` 和 `upgrade` 写入的用户级 MCP 配置永远不包含项目 `cwd`，
避免多个客户端、对话或 Maker 项目争用同一个全局路径。支持 MCP Roots 的客户端会用当前
workspace root 识别项目；不支持 Roots 时，由 Agent 在具体 Maker tool 调用中传入 `target_dir`。
MCP 进程自身的 cwd 只作为最后兜底和诊断信息，不应通过重写用户配置来切换项目。
若 cwd fallback 没有绑定项目，Maker MCP 仍正常启动并保留 status/tools/list，但项目相关 proxy tool
会快速失败，明确返回实际评估目录和上下文来源，避免把其它目录的 `not_initialized` 当成当前项目状态。
安装器会先比较现有 `taptap-maker` 条目；内容一致时不写文件，Claude 也不会重复执行
`claude mcp add`。因此后续项目 `init` 或无配置变化的 `upgrade` 不会触发配置重载。
从旧 beta 升级时，安装器会移除现有 `taptap-maker` 条目中的历史 `cwd`，同时保留配置里的
其它 MCP server；这次必要迁移完成后，切换项目不再修改用户级配置。
`taptap-maker upgrade` 会刷新当前机器的 Maker MCP 配置，并在当前目录已绑定 Maker 项目时
同步项目 `AGENTS.md` 的 TapTap Maker 受管策略块。`maker://status`、`maker_status_lite`
和 `taptap-maker doctor` 会检查老项目 `AGENTS.md` 是否缺失或过期，并提示运行
`tap