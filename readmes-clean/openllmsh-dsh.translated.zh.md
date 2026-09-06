![](./assets/openllm.svg)


@openllmsh/dsh — 通过 OpenLLM 路由 DeepSeek Harness。

一个[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(`dsh`)
将线束指向 [OpenLLM](https://openllm.sh) 网关并
交给 OpenLLM 的 MCP 工具。它是一个 **纯配置 Cordis 补丁层** —
从 dsh 端安装，没有运行时代码 - 它做了两件事：

- **LLM 路由器** — 将 `openllm` 提供程序添加到 dsh 的内置 `llm-pi-ai`
  适配器 (`openai-completions`) 指向守护程序的**本地优先网关**
  (`http://127.0.0.1:8787/v1`) 并使其成为默认模型。没有适配器代码，
  和 **没有 API 密钥**：环回表面没有身份验证门；守护进程获取
  使用自己的 `~/.openllm/.env` 凭证签署计划并向上游转发。
- **MCP** — 注册 `openllm mcp` stdio 服务器（`openllm`，
  `claude-context`、`supermemory` 工具组）。 `openllm` 二进制文件解析
  `~/.openllm/.env`本身，所以它也不需要dsh的任何东西。

dsh 持有**无密钥且无来源** - 它只是与 `127.0.0.1:8787` 通信，因此
它唯一需要的是 **`openllmd` 正在运行**。安装 OpenLLM 是
先决条件（如下）——安装程序为您启动守护进程；这个捆绑包确实
不安装、提示或载入它。运行在主机DeepSeek Harness上——
服务补丁
(`@deepseek-ai/dsh-llm-pi-ai`、`@deepseek-ai/dsh-mcp-client`) 发货
`@deepseek-ai/dsh-base`。

## 先决条件 — 安装 OpenLLM

执行此操作**一次** — dsh 路由到本地 OpenLLM 守护进程，并且安装程序设置
它会为您启动（macOS / Linux）：

```sh
curl -fsSL https://www.openllm.sh/install | bash
```

> 这是**OpenLLM 自己的官方安装程序**（规范来源：
> <https://openllm.sh/install>);它对下载的二进制文件进行摘要验证。如果
> 您的策略需要它，在将脚本传输到 shell 之前获取并读取脚本。
> 该捆绑包仅记录先决条件 - 它从不运行它。

无需运行、粘贴或导出任何其他内容 - 安装程序将启动守护进程
并将您的密钥保存到 `~/.openllm/.env`，守护进程从那里为 dsh 提供服务。

## 安装捆绑包

安装到您实际运行的表面的配置文件中。 dsh型材是
单独的捆绑包堆栈，因此添加到一个配置文件的捆绑包对于其他人来说是不可见的
其他 - **浏览器 UI 仅存在于 `web` 配置文件中**（`web` 安装
`dsh-base`+`dsh-web-app`； `headless` 安装 `dsh-base` + `dsh-headless`）。
裸露的 `default` 型材仅是 `dsh-base` — 无腹板表面 — 因此添加
那里的包永远不会到达 Web UI。

浏览器UI（`web`配置文件）：

```sh
dsh plugin --profile web add github:openllmsh/dsh
```

无头/CLI（`headless` 配置文件）：

```sh
dsh plugin --profile headless add github:openllmsh/dsh
```

然后**重新启动配置文件**。从 GitHub 分发 — 无 npm 包。所建的
`lib/` 已提交，因此 git install 无需构建步骤即可加载（并且没有 pnpm
`allowBuilds` 提示）。使用 `github:openllmsh/dsh#<tag>` 固定版本。

## 自托管/自定义端口

路由器底座（`http://127.0.0.1:8787/v1`）固定在`cordis.patch.yml`中。至
通过自托管 OpenLLM 进行路由，当您
安装它 - dsh 仍然只是与 `127.0.0.1:8787` 对话。自定义守护进程端口
(`OPENLLM_DAEMON_PORT`)表示编辑`cordis.patch.yml`中的`baseURL`来匹配。

## 开发

```sh
pnpm install
pnpm build            # tsdown → lib/index.mjs (+ .d.mts) — commit the result
pnpm typecheck        # tsc --noEmit

dsh plugin --profile demo add .          # link this bundle into a scratch profile
dsh --profile demo --dump-config         # inspect the composed plugin tree
```

该捆绑包的物质是 `cordis.patch.yml`（通过 `dsh.bundle.patch` 解析）
清单字段）； `src/index.ts` 是一个 `export {}` 占位符，没有运行时 API，
匹配`@deepseek-ai/dsh-base`。

> `lib/` 已承诺（GitHub 是唯一的分销渠道），因此 **重建并
> 每当 `src/` 更改时就提交它** — git 安装的是过时的 `lib/`。

> 开发者预览版 — dsh 为 1.0 之前版本；引脚并针对每个 `dsh` 凸块重新测试。