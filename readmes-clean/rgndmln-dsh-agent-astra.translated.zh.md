# 阿斯特拉特工

> DeepSeek Harness 的空间对话视图。观察特工穿越时间、触摸工具和文件，并留下可读的痕迹。

`AgentAstra` 是产品名称。 `spatial-trajectory` 保留封装和线束标识符。

![五秒重播：提示→工具调用→回复](assets/spatial-trajectory-demo.gif)

大多数代理 UI 将繁忙的运行变成一长串消息和折叠的工具行。该插件采用了不同的路线：它保留对话本身，但将工作布置为您可以移动的小空间。回复、命令、文件编辑和委派任务不再只是记录中的行，它们具有地点、关系和时间。

![在空间视图中完成运行](assets/spatial-trajectory-overview.png)

## 一目了然

- **语义时间 (Z)** — 遍历有意义的事件而不是每个流令牌。过去逐渐消失，现在被标记，而未来的结构则故意保持不透明。
- **因果通道 (X)** — 输入、控制和结果是分开的，因此更容易发现工具调用的原因及其产生的结果。
- **信息层 (Y)** — 执行、对话和工件占据不同的高度，而不是在一个平面馈送中竞争。
- **活动工作台** - 当代理读取、写入或调用工具时，代理及其真实目标移动到共享工作区域，并通过小型动画绳索连接。
- **对话仍然存在** - 用户消息和最终代理回复被投影为可读卡片。选择其中一个即可打开其完整的 Markdown 内容；没有什么重要的东西被装饰性的可视化所取代。

上面的 GIF 是从新的只读 Flash 模型会话中录制的。它遵循两个简短的提示通过其语义检查点，包括单个 `pwd` 工具调用。没有读取或更改记录的存储库文件。

## 使用它

### 在本地结帐处

```bash
npm install
npm run typecheck
npm test
npm run build
```

对于独立重播视图：

```bash
npm run dev
```

打开`http://127.0.0.1:4173`。独立视图起着确定性的作用，因此它对于 UI 工作很有用，并且不花费模型令牌。

### 在DeepSeek Harness

该插件以 `@deepseek-ai/dsh 0.1.0-rc.6` 为目标并使用 Harness 客户端模块加载器。构建它，然后将本地包安装到 Web 配置文件中：

```bash
dsh plugin --profile web add /absolute/path/to/spatial-trajectory
```

打开对话并选择 **空间**。该视图是会话范围的：它仅渲染当前选定的对话，并在视图卸载时处置其 WebGL 场景。

如果 macOS 在本地 Harness 开发期间达到其文件观察器限制，`CHOKIDAR_USEPOLLING=1 dsh web` 是一种实用的临时解决方法。

## 跑步过程

### 行动·结果
- **操作**：`↑` / `↓` · **结果**：上一个/下一个语义事件
- **操作**：`Shift + ↑` / `Shift + ↓` · **结果**：上一个/下一个可见的用户或代理消息
- **操作**：暂停、拖动导轨或使用 `Home` / `End` · **结果**：检查历史记录而不重置轨道或缩放
- **操作**：单击节点 · **结果**：选择它并打开其浮动详细信息卡
- **动作**：双击节点 · **结果**：故意将相机聚焦在其上
- **操作**：拖动精确的文件快照 · **结果**：将其真实内容放入本机作曲家草稿中

当细节卡与作曲家重叠时，可以拖动它。文件路径在场景中被压缩；完整路径和 Markdown 预览在卡中仍然可用。

## 什么成为节点

投影是有意选择的。它保留了人们认为是工作一部分的东西：

- 代理运行的开始和结束；
- 人工提示和助手可见的回复文本；
- 工具、委托代理、文件和外部资源；
- 显式的读、写、调用、委托和流关系；
- 流式回复的聚合活动记录，因此长答案不会变成数千个小节点。

内部推理、工具参数、使用记录、注入上下文和原始流片段**不会**成为对话气泡。视觉视图应该添加方向，而不是暴露实现碎片。

## 它是如何组合在一起的

```text
Harness session events
        ↓
normalization + semantic projection
        ↓
scene state (entities, relations, activity, checkpoints)
        ↓
React controls + Three.js renderer
```

`src/projection.ts` 是语义的真实来源。 `src/App.tsx` 将选定的时间变成一个有界的、可读的窗口。 `src/spatial-renderer.ts` 只关心渲染和交互。这种分离使重播逻辑无需 WebGL 即可测试，并防止 UI 细节更改事件事实。

## 刻意的界限

- 浏览器视图永远不会自行写入工作区文件。
- 仅当 Harness 事件具有精确的源快照时，才能将历史文件推送至 Composer。仅元数据历史记录保持不可用，而不是发明附件。
- 视图遵循活动会话。当您离开后，后台对话不会继续呈现。
- 画布纹理和动画链接有界；密集的工具突发崩溃成安静的执行轨迹，而不是重复的几何图形云。
- 如果 WebGL 不可用，周围的控件和文本回退仍然可用。

## 开发检查

```bash
npm run typecheck
npm test
npm run build
```

The test suite covers projection, checkpoint compaction, temporal windows, cursor-readable activity, and the React shell. TypeScript also rejects unused locals and parameters, which helps keep the embedded bundle from collecting old entry points.

## Repository map

```text
src/
  projection.ts          semantic event → spatial state
  temporal-window.ts     bounded time-window and message lingering rules
  station-layout.ts      stable semantic coordinates
  spatial-renderer.ts    Three.js scene, interaction, disposal
  harness/               DeepSeek Harness host/client integration
assets/                  the lightweight README demo media
```

## Status

This is an experimental interaction plugin, not an attempt to turn every agent run into a videogame. The goal is simpler: when an agent is busy, you should be able to glance at the space and understand what it is doing, what it is touching, and where the answer came from.

# AgentAstra

> 面向 DeepSeek Harness 的空间化对话视图。让智能体在时间中移动、触碰工具和文件，并留下可以阅读的工作轨迹。

`AgentAstra` 是产品名称；`spatial-trajectory` 仍是技术包和 Harness 标识符。

![五秒回放：用户请求 → 工具调用 → Agent 回复](assets/spatial-trajectory-demo.gif)

多数 Agent 界面会把一次忙碌的运行压成很长的消息列表和折叠的工具行。AgentAstra 想走另一条路：保留完整对话，同时把工作铺展成一个可以穿行的小空间。回复、命令、文件修改和子任务不再只是文本流中的一行——它们都有位置、关系和发生的时刻。

![一次已完成的空间化运行](assets/spatial-trajectory-overview.png)

## 一眼能看到什么

- **语义时间（Z）** — 按有意义的事件而非每个流式 token 穿行。过去渐隐、现在被标出，未来只保留结构，不提前泄露内容。
- **因果通道（X）** — 输入、主控和结果被分开，更容易看出某次工具调用由什么触发，又带来了什么。
- **信息层级（Y）** — 执行、对话和工件位于不同高度，不再挤在单一平面。
- **活动工作区** — Agent 正在读取、写入或调用工具时，它和实际目标会进入共享工作区，并用一条轻量动画连接。
- **对话仍然可读** — 用户消息和最终回复会投影为可阅读卡片；点击即可打开完整 Markdown 内容，重要信息不会被可视化替代。

上方 GIF 来自一个全新的只读 Flash 模型会话。它按语义检查点回放两条短提示，其中包含一次 `pwd` 工具调用；录制过程没有读取或修改任何仓库文件。

## 使用方式

### 本地运行

```bash
npm install
npm run typecheck
npm test
npm run build
```

如需打开独立回放视图：

```bash
npm run dev
```

访问 `http://127.0.0.1:4173`。独立视图播放确定性的 fixture，适合调试 UI，也不会消耗模型 token。

### 接入 DeepSeek Harness

插件目标版本为 `@deepseek-ai/dsh 0.1.0-rc.6`，使用 Harness 客户端模块加载器。先构建，再将本地包安装到 web profile：

```bash
dsh plugin --profile web add /absolute/path/to/spatial-trajectory
```

打开任意对话后，选择 **Spatial**。视图与会话绑定：它只渲染当前选中的对话，并会在视图卸载时释放 WebGL 场景。

如果 macOS 在本地 Harness 开发时达到文件监听数量上限，可临时使用 `CHOKIDAR_USEPOLLING=1 dsh web`。

## 在轨迹中穿行

### 操作 · 效果
- **操作**: `↑` / `↓` · **效果**: 前一个 / 后一个语义事件
- **操作**: `Shift + ↑` / `Shift + ↓` · **效果**: 前一条 / 后一条可见的用户或 Agent 消息
- **操作**: 暂停、拖动时间条，或使用 `Home` / `End` · **效果**: 浏览历史，同时保留你已调整的旋转和缩放视角
- **操作**: 单击节点 · **效果**: 选中节点并打开浮动详情卡
- **操作**: 双击节点 · **效果**: 有意地将镜头聚焦到该节点
- **操作**: 拖动精确文件快照 · **效果**: 将真实内容放入原生聊天框草稿

详情卡可拖动，以免遮住聊天框。场景中会压缩长文件路径；完整路径与 Markdown 预览仍可在详情卡内查看。

## 哪些内容会成为节点

投影层会刻意筛选，只保留人能理解为工作过程一部分的内容：

- 一次 Agent 运行的开始和结束；
- 用户输入，以及 Agent 实际显示给用户的回复文本；
- 工具、子 Agent、文件和外部资源；
- 明确的读取、写入、调用、委派和流转关系；
- 为流式回复聚合出的活动记录，避免一段长回复膨胀成几千个小节点。

内部推理、工具参数、usage、注入上下文和原始流式片段**不会**成为对话气泡。可视化应该帮助定位，而不是展示实现噪声。

## 实现结构

```text
Harness 会话事件
        ↓
规范化 + 语义投影
        ↓
场景状态（实体、关系、活动、检查点）
        ↓
React 控制层 + Three.js 渲染器
```

`src/projection.ts` 负责语义事实；`src/App.tsx` 将选中的时间点转成一个有限、可读的窗口；`src/spatial-renderer.ts` 只处理渲染与交互。这样的分层使回放逻辑无需 WebGL 即可测试，也避免 UI 细节反过来改变事件事实。

## 有意保留的边界

- 浏览器视图不会自行写入工作区文件。
- 历史文件只有在 Harness 事件提供精确源快照时，才可推入聊天框；只有元数据的历史会明确保持不可用，而不是伪造附件。
- 视图跟随当前会话；切换走后，后台对话不会继续渲染。
- Canvas 纹理和动画连接都有上限；密集工具调用会压成安静的执行痕迹，而不是重复几何体组成的云团。
- WebGL 不可用时，周围控制和文本回退仍然可用。

## 开发检查

```bash
npm run typecheck
npm test
npm run build
```

测试覆盖投影、检查点压缩、时间窗口、按游标读取的活动，以及 React 外壳。TypeScript 同时拒绝未使用的局部变量和参数，避免嵌入式 bundle 重新积累旧入口。

## 仓库结构

```te