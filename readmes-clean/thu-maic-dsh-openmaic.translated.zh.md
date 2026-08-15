#dsh-openmaic

把OpenMAIC带进DeepSeek Harness。将OpenMAIC带进DeepSeek Harness。

`dsh-openmaic`是一个DeepSeek Harness插件，注册了四个工具和一个
苏格拉底式教学技巧：

- `openmaic_generate`：告诉你的代理“给我上一堂关于X的课”，插件将需求提交到[open.maic.chat](https://open.maic.chat/)，等待异步生成作业，并返回一个可播放的课堂链接。
- `openmaic_slide`：代理编写一张 OpenMAIC 幻灯片（PPTist 风格的幻灯片 JSON），插件使用 OpenMAIC 的官方渲染器（文本、形状、图像、表格、图表、公式、代码）对其进行渲染。
- `openmaic_widget`：代理根据捆绑合约编写 OpenMAIC 风格的交互式小部件（模拟、游戏或代码）；代码在写入时进行流式传输，然后作为沙盒卡内联呈现。
- `openmaic_render`：代理编写内联 HTML 教学片段（概念卡、测验、演练），插件将其渲染为对话中的沙盒卡。
- `openmaic-teach` 技能：将课程变成苏格拉底式 OpenMAIC 课程，通过引导式提问和引入幻灯片、小部件和卡片作为辅助进行教学。

## 它看起来像什么

```
用户: 帮我做一节量子物理入门课
模型 → openmaic_generate(requirement="量子物理入门课", language="zh-CN")
     ← "Classroom ID: class-abc123
        Classroom URL:
        https://open.maic.chat/classroom/class-abc123"
模型: 课堂已经生成好了，点开就能上课：
     https://open.maic.chat/classroom/class-abc123
```

交互式小部件：

```
用户: 做一个抛体运动模拟器
模型 → 按 openmaic-widget 模板写完整 HTML（流式输出）
     → openmaic_widget(html="<!doctype html>…", widgetType="simulation", title="抛体运动")
     ← "Rendered the simulation widget …"
     对话里就地出现一个可交互的 OpenMAIC 模拟器
```

## 安装

```sh
dsh plugin --profile web add git+https://github.com/THU-MAIC/dsh-openmaic.git
```

然后重启`dsh web`并刷新。该插件附带了编译后的 `lib/`，因此
git install 不需要构建步骤。

## 配置

```yaml
dsh-openmaic:
  baseUrl: https://open.maic.chat
  accessCode: ""     # invite code; not enforced online yet, leave empty
  pollIntervalMs: 5000
  maxWaitMs: 600000
```

### 键·默认值·注释
- **密钥**：`baseUrl` · **默认**：`https://open.maic.chat` · **注释**：API 基础。指向 `http://localhost:3000` 以针对本地 OpenMAIC 进行开发。
- **密钥**：`accessCode` · **默认**：`""` · **注释**：open.maic.chat 的邀请码。尚未在线强制执行，留空；启用后填写。
- **按键**：`pollIntervalMs` · **默认**：`5000` · **注释**：轮询间隔（以毫秒为单位）。生成速度很慢，因此 60000 比默认值更友好。
- **按键**：`maxWaitMs` · **默认**：`600000` · **注释**：一次作业上限，10 分钟。

## API流程

1. 如果设置了 `accessCode`，则设置 `POST /api/access-code/verify` 并在以后的请求中重放 `openmaic_access` cookie。
2. `POST /api/generate-classroom` 满足要求，仅加上您通过的可选标志。返回 `jobId` 和 `pollUrl`。
3. 轮询 `GET {pollUrl}`，直到作业为 `succeeded` 或 `failed`，或者 `maxWaitMs` 耗尽。
4.成功后返回`{baseUrl}/classroom/{classroomId}`（或者服务器提供的`result.url`）。

## 范围

- `openmaic_generate`：生成教室并返回可播放链接。
- `openmaic_slide`：使用官方渲染器渲染一张 OpenMAIC 幻灯片。
- `openmaic_widget`：渲染代理编写的模拟/游戏/代码小部件（完整的 HTML 文档）。它在代理编写代码并在完成后呈现时流式传输代码。
- `openmaic_render`：将内联 HTML 教学片段渲染为沙盒卡。
- `openmaic-teach`：使用上述工具作为辅助的苏格拉底式教学课程。

幻灯片/小部件/渲染工具不进行服务器端生成；他们渲染内容
代理作者针对 OpenMAIC SDK 合约（`@openmaic/dsl`，
`@openmaic/generation`、`@openmaic/renderer`）。

## 路线图

- 连接其余的小部件类型（图表、可视化3d、程序技能）。
- 操作循环回到模型（教学代理交互：突出显示/注释/显示小部件元素）。

## 发展

```sh
./scripts/build.sh  # links host deps, bundles src/ to lib/ with tsdown
./scripts/test.sh   # links host deps, runs the vitest suite
```

脚本在 `PATH` 上找到来自 `dsh` 的线束检查；设置 `DSH_CHECKOUT` 以针对特定结账进行构建。