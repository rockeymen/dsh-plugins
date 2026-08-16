# dsh-browser-agent

给**纯文本模型（DeepSeek 等）**用的浏览器自动化 **+** 视觉识别。

用 [Playwright](https://playwright.dev/) 驱动真实浏览器（Edge / Chrome / Chromium），再通过视觉模型（默认智谱 **GLM-4V**，也支持任意 OpenAI 兼容 / 本地模型）把截图转成文字，给文本模型装上"眼睛"。

提供**两种形态**：

- **独立 CLI** —— `browser-agent`
- **DeepSeek Harness Cordis 插件** —— 注册一组 `browser_*` 原生工具，会话内直接调用

不需要 Python，只需 Node 18+。

## 为什么需要它

[browser-use](https://github.com/browser-use/browser-use) 这类工具要求一个**多模态** LLM 当大脑。如果你用的是纯文本模型（DeepSeek 等），它看不到截图，就无法自己驱动浏览器循环。

本项目把职责按正确的方式拆开：

```
纯文本模型 (DeepSeek)  ← 大脑：读文字、做决策
        ▲
        │  屏幕的 JSON 文字描述
        ▼
视觉模型 (GLM-4V)      ← 眼睛：截图 → 文字
        ▲
        │  截图
        ▼
Playwright 浏览器      ← 手：打开 / 点击 / 输入 / 滚动 / 提取
```

文本模型始终是决策者，视觉模型只负责"把像素翻译成文字"。

## 特性

- **常驻浏览器桥** —— 一个长驻浏览器走本地 HTTP API（登录态跨命令保持）。
- **文本优先定位** —— `snapshot` 返回元素清单（ref、tag、type、id、placeholder、text），多数操作不需要视觉。
- **按需视觉** —— `see` / `vision` 把截图或图片转成结构化描述。
- **三种视觉通道** —— `glm`（免费 GLM-4.6V-Flash / GLM-4.1V-Thinking-Flash）、`custom`（任意 OpenAI 兼容端点）、`local`（Ollama / LM Studio / llama.cpp）。
- **自动识别浏览器** —— 在 Windows / macOS / Linux 上找 Edge / Chrome / Chromium。
- **附加模式（attach）** —— 通过 CDP 驱动已运行的浏览器（适合禁止启动浏览器的沙箱）。
- **结果缓存** —— 按"图片哈希 + prompt + 模型"缓存视觉结果。

## 快速开始（CLI）

```bash
# 1. 安装
npm install        # 唯一依赖 playwright-core（无需下载浏览器）

# 2. 启动桥（在终端 / 后台）
node cli.mjs start
#    → "bridge ready on http://127.0.0.1:9333"

# 3. 驱动它（在任意另一个终端）
node cli.mjs open "https://example.com"
node cli.mjs snapshot
node cli.mjs screenshot ./shot.png
node cli.mjs see "描述这个页面和可点击元素"
```

或链接成全局命令：

```bash
npm link           # 暴露 browser-agent
browser-agent start
browser-agent open https://example.com
```

## DeepSeek Harness Cordis 插件

`plugins/cordis/` 里是一个 Cordis Host 插件，注册 10 个 `browser_*` 模型工具，让 DSH 会话**原生拥有**浏览器控制与视觉能力（无需再手敲 CLI）。

工具一览：

| 工具 | 作用 |
|---|---|
| `browser_status` | 桥是否运行、当前页面 URL/标题 |
| `browser_open` | 打开 URL |
| `browser_snapshot` | 元素清单（ref 编号） |
| `browser_text` | 页面可见文本 |
| `browser_screenshot` | 截图保存 PNG |
| `browser_click` | 按 ref / 文本点击 |
| `browser_type` | 点击并输入 |
| `browser_eval` | 页面内执行 JS |
| `browser_see` | 截图 + 视觉描述（GLM） |
| `browser_vision` | 描述本地图片 |

插件提供两种安装方式，详见 `plugins/cordis/README.md`：

- **正式包 + agent preset（常驻，推荐）**：把 `dsh-browser-agent-cordis` 包**物理复制**进 `${DSH_HOME}/profiles/node_modules/`，再用 `agentPresets.copy('standard', 'browser-agent')` 复制一个 preset 并加一行引用（`name: 'dsh-browser-agent-cordis'` + `config.cliPath`）。之后开会话选该 preset 即自带 10 个工具，免去每次 `cordis_define`。
- **动态插件（单会话，临时）**：把 `plugins/cordis/host.js` 的函数体用 `cordis_define` 填进 `code.host`，`cordis_run` 激活。

> 插件工具内部通过 `shell` 服务调用 `cli.mjs`，因此**桥必须先启动**（`node cli.mjs start` 或 `scripts/start.ps1`）。在沙箱里启动桥若报 `spawn EPERM`，用提权（`danger-full-access`）启动，或用 attach 模式（见下）。

## 命令参考

### 服务端

| 命令 | 说明 |
|---|---|
| `start` | 运行桥（阻塞，后台启动） |
| `stop` | 停止桥 |

### 控制

| 命令 | 说明 |
|---|---|
| `ping` | 桥是否存活 |
| `open <url>` | 导航 |
| `url` / `title` | 当前 URL / 标题 |
| `snapshot` | 带 ref 编号的元素清单 |
| `text` / `html` | 页面文本 / HTML |
| `screenshot <path> [-full]` | 截图 |
| `click <ref>` | 按 ref（来自 snapshot）或文本点击 |
| `type <ref> <text>` | 点击后输入 |
| `press <key>` | 按键（如 `Enter`） |
| `scroll <down\|up\|bottom\|top>` | 滚动 |
| `eval <js>` | 执行 JS 并返回结果 |
| `wait <ms>` | 等待 |
| `back` / `forward` / `tabs` / `newtab` | 导航 |

### 视觉

| 命令 | 说明 |
|---|---|
| `see <prompt...>` | 截图页面并描述 |
| `vision <image> <prompt...>` | 描述本地图片 |

两者都支持 `--provider glm|custom|local`、`--thinking`、`--model <m>`、`--api-key <k>`。

## 视觉配置

### GLM（默认，免费）

```bash
# Windows (PowerShell)
$env:GLM_API_KEY = "你的key"
# macOS / Linux
export GLM_API_KEY="你的key"
```

在 <https://open.bigmodel.cn> 获取 key。默认模型 `glm-4.6v-flash`（免费、快）；加 `--thinking` 用 `glm-4.1v-thinking-flash`（复杂推理）。429 时自动降级到 thinking 模型。

> 若 `GLM_API_KEY` 只在 Windows 用户注册表里、没进进程环境（比如 DSH 启动早于 key 设置），也可以把 key 写进项目根目录的 `.glm-key` 文件——`vlm.mjs` 会作为兜底读取（该文件已在 `.gitignore` 里，不会提交）。

### Custom（任意 OpenAI 兼容端点）

```bash
export VLM_PROVIDER=custom
export VLM_BASE_URL=https://你的代理/v1
export VLM_MODEL=你的视觉模型
export VLM_API_KEY=你的key
```

### Local（Ollama / LM Studio / llama.cpp）

```bash
export VLM_PROVIDER=local
# 可选：export VLM_LOCAL_MODEL=qwen2.5-vl:3b
```

按顺序探测 `127.0.0.1:11434`（Ollama）、`:1234`（LM Studio）、`:8080`（llama.cpp）。

## 环境变量

| 变量 | 默认 | 含义 |
|---|---|---|
| `BA_PORT` | `9333` | 桥监听端口 |
| `BA_HEADLESS` | `0` | `1` = 无头 |
| `BA_BROWSER` | `auto` | `edge` / `chrome` / `chromium` / 完整路径 |
| `BA_PROFILE` | `~/.dsh-browser-agent/profile` | 持久用户数据目录 |
| `BA_CDP_URL` | *(空)* | 附加到已运行的浏览器而非启动新浏览器 |
| `BA_BRIDGE_URL` | `http://127.0.0.1:<BA_PORT>` | CLI 寻找桥的地址 |
| `VLM_PROVIDER` | `glm` | `glm` / `custom` / `local` |
| `GLM_API_KEY` | *(空)* | GLM 通道 key |
| `VLM_BASE_URL` / `VLM_MODEL` / `VLM_API_KEY` | *(空)* | 自定义通道 |
| `VLM_LOCAL_MODEL` | `qwen2.5-vl:3b` | 本地通道模型 |

## 典型循环

```
open 页面 → snapshot 读元素 →（需要看才 see）→ click/type 操作 → snapshot 观察 → ... 直到完成
```

## DeepSeek Harness 集成注意点

见 [`SKILL.md`](SKILL.md)（中文技能说明）。两个 DSH 特有注意点：

1. DSH 沙箱可能禁止启动浏览器（`spawn EPERM`）。用提权启动桥，**或**自己用 `--remote-debugging-port=9222` 启动浏览器并设 `BA_CDP_URL=http://127.0.0.1:9222`（attach 模式无需提权）。
2. PowerShell 的 HTTPS 可能报 `SEC_E_NO_CREDENTIALS`；视觉客户端走 Node 的 TLS，用 `node cli.mjs vision ...`，别用 `Invoke-RestMethod`。

## 原理

```
cli.mjs (客户端) ── HTTP POST {op,...} ──▶ bridge.mjs (常驻 Playwright 浏览器)
                                              │ 截图
                                              ▼
                                          vlm.mjs ── HTTPS ──▶ GLM / custom / local
                                              │
                                              ▼
                                          JSON 描述 → 交回文本模型推理
```

## 目录结构

```
dsh-browser-agent/
├── cli.mjs                 # 统一 CLI 入口
├── src/
│   ├── bridge.mjs          # 常驻浏览器桥
│   ├── client.mjs          # HTTP 客户端
│   └── vlm.mjs             # 视觉调用器
├── plugins/
│   └── cordis/             # DSH Cordis 插件（正式包 index.js + 动态源码 host.js + README）
├── scripts/                # 启动脚本（start.ps1 / start.sh）
├── examples/               # 示例页面
├── SKILL.md                # DSH 技能说明（中文）
└── README.md / README.en.md
```

## 常见问题

- **`bridge not running`** —— 先 `node cli.mjs start`。
- **`spawn EPERM`** —— 环境禁止启动浏览器，用 attach 模式（`BA_CDP_URL`）或给进程授权。
- **`no browser found`** —— 装 Edge/Chrome/Chromium，或 `BA_BROWSER` 设为完整路径。
- **`browser has been closed`** —— 可见浏览器窗口被关掉了，桥会自动退出，重新 `start` 即可。
- **视觉 `401/403`** —— 检查 `GLM_API_KEY`（或 `VLM_API_KEY`）。

## 许可证

[MIT](LICENSE)
