#dsh-visualizer

一个[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)插件。 **`visualizer`** 工具在模型编写时将独立的 HTML 文档流式传输到聊天中，并在沙盒内联框架中进行实时预览 - Chart.js、外部 CDN 库，所有这些。没有任何东西触及工作区。

一个软件包包含两部分：面向模型的工具 (`lib/index.js`) 和 Web GUI 卡（`lib/client.js`，通过软件包的 `dsh.client` 清单声明）。安装它并使用捆绑层安装两者。无需手动配置文件补丁编辑。

![计算机架构图流入聊天并在卡中实时渲染](assets/demos/how-computers-work.gif)

![文档流入聊天并在卡中实时渲染](assets/demos/combined-demo.gif)

每一代都可以作为独立的 `.html`（或 `.svg`）文件从卡下载。没有服务器往返。

完整演示，每种工件类型一个：

1.【拉取请求流程概述](assets/demos/bitbucket_datacenter_full.webm)——图
2.【光合作用讲解员](assets/demos/photosynthesis_explainer_trimmed.webm) — 互动
3.【计算机如何工作](assets/demos/how-computers-work.gif)——模型（如上图所示）
4.【插件本身，由插件解释和渲染](assets/demos/plugin_explainer_full.webm)——自托管
5.【流式生成UI亮点](assets/demos/streaming-generative-ui-highlights.webm)——亮点
6. [组合演示](assets/demos/combined-demo.webm) — 一次运行多个用例

## 安装

需要节点 ^22.19 或 >=24 以及 DeepSeek Harness 安装：

```sh
# install into the default web profile
dsh plugin --profile web add 'git+https://github.com/abidhmuhsin/dsh-visualizer.git'

# or install into any custom profile
dsh plugin --profile <your-profile> add 'git+https://github.com/abidhmuhsin/dsh-visualizer.git'
```

第一次运行失败，并显示“将包添加到allowBuilds”提示。这是 pnpm 的供应链大门阻止 `prepare` 构建，直到它被列入许可名单；提示带有确切的键，以代码加载 URL 和已解析的提交为键。将该块粘贴到 `~/.dsh/profiles/<your-profile>/pnpm-workspace.yaml` 中的 `allowBuilds:` 下并重新运行。键固定提交，因此在新的上游推送之后，重新安装会打印新的粘贴提示。

### 或者从本地结账安装

要破解插件（或安装尚未推送的版本），请检查它，构建并通过本地路径添加它：

```sh
git clone https://github.com/abidhmuhsin/dsh-visualizer.git ~/tools/dsh-visualizer
cd ~/tools/dsh-visualizer
pnpm install
pnpm build

cd ~/tools/deepseek-harness
pnpm dsh plugin --profile visualizer add '/home/user/tools/dsh-visualizer'
```

本地路径会跳过 git fetch 和 `allowBuilds` 舞蹈，因为 `pnpm build` 已经生成了 `lib/`。不过，加载程序仍然从配置文件下安装的副本导入。要获取更改：在结帐中重新运行 `pnpm build`，然后再次运行 `remove` 和 `add`。

启动配置文件并要求模型**“可视化......”**；流式文档在写入时以内联方式显示。使用参考片段 (`'git+https://github.com/abidhmuhsin/dsh-visualizer.git#v0.2.0'`) 固定版本。要删除：

```sh
dsh plugin --profile <your-profile> remove dsh-visualizer
```

## 如何安装

该包声明了一个 `dsh.bundle` 清单（`dsh.bundle.patch` → `./cordis.patch.yml`），因此 `dsh plugin add` 将其安装为自己的配置文件补丁层。该层为包插入一个加载行：

- 主机Loader进口`lib/index.js`；其 `apply()` 注册面向模型的 `visualizer` 工具。
- Web GUI 的客户端模块系统扫描声明 `dsh.client` 清单的包的 Loader 条目并为 `lib/client.js` 提供服务，从而呈现流卡和已确定的行。

## 配置

捆绑包层已经插入了加载程序行，因此覆盖配置在配置文件自己的补丁层（`~/.dsh/profiles/<your-profile>/cordis.patch.yml`）中采用一个以 id 为目标的平面补丁条目。不要将其包装在 `insert:` 中 - 这会附加第二行而不是覆盖已安装的行。值在加载时根据架构进行验证，错误会导致安装失败。每个选项都有一个模式默认值，因此覆盖块仅列出正在更改的字段。当前默认的完整选项列表：

```yaml
- id: dsh-visualizer
  config:
    maxHtmlBytes: 262144    # default; per-call render limit, in UTF-8 bytes
    guideTool: true         # default; set false to use only the render tool
    guideModules: [chart, diagram, mockup, interactive, art]   # default; subset to teach and serve;
```

`guideModules`同时缩小两个导轨面。常设系统提示名册仅列出这些类型的单行代码，而 JIT 工具的参数枚举仅接受这些 id，因此在任何代码运行之前，禁用的类型会在参数边界处被拒绝。 `guideTool: false`跳过第二次工具注册；渲染工具和常设提示部分不受影响。未知的模块 ID 或空的 `guideModules` 插件加载失败。默认情况下，所有五种类型（`chart`、`diagram`、`mockup`、`interactive`、`art`）均处于打开状态。

## 它是如何工作的

该工具将 `html` 声明为其最后一个架构参数，因此记录的工具调用参数在模型流式传输时带有不断增长的文档前缀。该卡对该前缀进行解码，并使用透明画布在空源沙盒 iframe 内绘制实时预览；在调度时，最终的 DOM 会被协调，并且脚本会按照文档顺序运行一次。当文档流式传输时，一条苍白的品牌带以 3.6 秒的缓慢节奏沿对角线扫过整个画面（从左上到右下）。它是变换动画的，在减少运动的情况下被禁用。它使实时阶段一目了然，并在文档稳定后立即停止。

面向模型的创作指南位于 `src/guide/` 中：门规则（当视觉对象属于对话时）、通用流媒体合约（样式优先排序、CDN 允许列表、动画限制、主题令牌、高度报告陷阱）以及 `src/guide/modules/` 下的每个工件类型名册，每种类型一个文件，因此每种视觉对象都可以在不影响其他视觉对象的情况下进行调整。此处命名的 CDN 主机与 shell CSP 强制执行的四个相同；一起更改两个列表。

名册中每种类型保留一行，以保持系统提示较小；更深层次的每种类型配方位于每个模块的 `detail` 中。 `visualizer_guide` 工具根据需要返回它。一旦模型选择了工件类型，它就会调用 `visualizer_guide(modules: [...])` 并获取该类型的配方作为工具结果 - 及时的规范注入，可以在不增加常设提示的情况下增加指南。名册以环境轻推关闭（“在对话中第一次渲染类型之前，拉出其配方”），因此即使模型从未打开指南工具的描述，顺序仍然有效。该行仅在启用 `guideTool` 时呈现。

每个 `detail` 都遵循一个骨架：**心智模型**（编码之前的思维顺序 - 编码表、渲染器选择、布局策略）、领域部分（测量、组成、控制、颜色）、**故障模式**（首先是症状，然后是原因和修复），以及最后的**快速参考**清单。规则不是具有精确测量而不是近似值的绝对条件，因为配方是在创作时读取的。引导规格固定骨架；模块内容保留在其自己的文件中。

## 小部件桥

渲染文档的脚本可能会调用 `sendPrompt(text)`。 shell 桥将其发布到主机，主机将其作为 `[widget]` 前缀的用户轮次提交——仪表板可以向代理询问其显示的内容的后续信息。主机验证有效负载（字符串、非空白、≤ 4000 个字符）和每个小部件每 3 秒一次接受的提示的速率限制，因此行为不当的脚本无法循环代理。脚本仅在文档完成后运行，因此桥永远不会在中途触发。

脚本也可能调用 `openLink(url)`。主机自行进行方案检查（仅限 http(s)，使用 `noopener,noreferrer` 打开），因此小部件代码无法到达 `javascript:`、`data:` 或 `file:` 目标。

小部件通过 `await window.storage.get/set/delete(key)` 跨渲染保持状态。请求通过 postMessage 传输，带有每次调用 ID 和 10 秒超时；主机从由文档的 `title` 参数命名的存储中进行应答，因此同一标题（流卡或已解决的行）下重新生成的文档会找到它写入的值。键≤200 个单位（不含空格），值≤64k 单位，一个作用域可容纳 ≤256k 单位。 `get` 拒绝丢失的键而不是返回 null。当可访问时，存储通过 localStorage 保持持久，否则按安装内存（私有模式）。

文档内的锚点单击永远不会导航。该框架是一个空源 `srcdoc`，它从主机继承其基本 URL，因此即使是 `#fragment` 链接也会重新加载卡内的整个应用程序。外壳中的捕获阶段防护装置会阻止每个锚的 d