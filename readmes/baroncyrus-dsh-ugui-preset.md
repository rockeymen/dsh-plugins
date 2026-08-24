# UGUI制作模式（DSH Agent Preset）

让 AI agent 以视觉稿为起点，在浏览器里生成和编辑语义化 uGUI、模拟运行时状态与交互，并显式构建为 Unity Prefab 的 DSH agent preset。v0.24 的定位是**视觉驱动的 uGUI 语义生成器**：生产交付与预览/测试数据严格分离。

## 实机演示

过程：agent 产出 DSL → 浏览器模拟交互 → 显式构建 Unity Prefab（演示录制于早期版本；v0.24 的生产/Preview 双产物规则以本文为准）。

https://github.com/user-attachments/assets/fae23504-ad3e-40ac-ab31-3ef53a69478b


## 功能

- **多画布设计器**：浏览器内可视化编辑 uGUI DSL（多 Canvas Workspace、稳定 nodeId、结构化验收）。
- **Agent 分析式 PSD 导入**：程序解析图层、把可安全映射的文字转换为 `TMP_Text`、按可配置的末尾标记（默认“原图”）在整份 PSD 中全局查找素材源并暂存 PNG，再产出带 `psdSource` 的初始草稿；标记查找不受 Group 限制。隐藏的非素材组和叶子不是垃圾层，而是潜在运行时状态，必须保留其初始显隐和语义候选信息。随后 UGUI Agent 按运行时职责、动画边界、状态、重复项与交互控件生成可维护 DSL。
- **PPU Profile 与安全文字**：通用 PSD Profile 默认 `Canvas.referencePixelsPerUnit=100`、`Sprite.pixelsPerUnit=100`；项目可在嵌套 `psdImport.ppuProfile` 中配置为 `100/25` 等组合。普通文字安全转换为 TMP，PSD 导入不绑定字体资产，Unity 使用项目 TMP Settings 默认字体；无法可靠还原的文字才栅格化。
- **图片九宫格契约**：`Image.imageType` 支持 `simple|sliced|tiled`，`spriteBorder` 使用原图像素 `[left,bottom,right,top]`，`fillCenter` 控制中心区域；浏览器可直接编辑 border 并预览结果。
- **命名状态与交互**：DSL 顶层 `runtime.stateGroups` / `runtime.interactions` 表达状态族和声明式机械交互。设计器支持设计态下查看当前状态或全部状态，预览器支持运行模拟、选中子树和全屏预览；显式构建时会生成无假数据的 Production runtime 组件，订阅标准 Button/Toggle 并执行同序机械动作。
- **分析进度可见**：UGUI 窗口持续显示“排队 → 读取 → 规划 → 写入 → 验收 → 完成”的进度；摘要只呈现可操作的高层决策，不暴露模型隐藏思维链。
- **显式双产物构建**：PSD 导入始终只暂存，只有显式构建才写入 Unity；每次构建必须提供 `expectedVersion`，并在脚本/图片写入前通过只读 Manifest 三方合并预检。生产 `<Name>.prefab` 不包含 view/test data；仅在存在预览脚本时额外生成 `<Name>.Preview.prefab` 并挂载 view/test data。通用默认把 Preview Prefab 与 view/testdata 源放进 `Assets/Editor/DshUguiPreview/`，避免进入 player/Addressables。
- **所有权与冲突契约**：所有权 Manifest 与三方冲突策略的合同目标是只更新生成器拥有的内容，保留用户节点、用户组件和 UnityEvents，冲突时明确报错而非静默覆盖。缺少或不匹配 Manifest 时一律拒绝接管，当前不暴露可由模型自行设置的采用开关；真实 Unity 集成已覆盖 GUID 保持、用户节点/组件/字段保留、结构化冲突、runtime binding 增删以及失败 Preview 构建的 Prefab/Manifest 回滚。
- **逻辑同步闸门**：`logic.js` 领先 `view.cs` 时构建自动拦截并引导同步，界面徽章可见进度。

## 环境要求

- DSH（DeepSeek Harness）Web 部署
- Node.js 20+ 与 pnpm 10.28.2（插件依赖使用已提交的 frozen lockfile 安装）
- 一个运行中的 Unity 工程（已用 Unity Editor 打开；当前语义缓存钉住 uGUI 2.0.0 / Unity 6000.3，其他版本按文档过期流程重核即可）
- Unity 官方 CLI（`unity` 在 PATH 上）
- **macOS / Linux / Windows 均支持**（macOS/Linux 走 bash 入口；Windows 自动切换到 `unity-cli.py` Python 入口，需要 Python 3；无需 bash/jq）

## 安装

```bash
# 1. 克隆到 DSH preset 目录（DSH 按目录发现 preset）
git clone https://github.com/BaronCyrus/dsh-ugui-preset.git ~/.dsh/.agent-presets/ugui
#    Windows PowerShell: git clone ... "$env:USERPROFILE\.dsh\.agent-presets\ugui"

# 2. 注册浏览器端插件包（跨平台，幂等）
node ~/.dsh/.agent-presets/ugui/setup/install.mjs

# 3. 配置目标 Unity 工程
cd ~/.dsh/.agent-presets/ugui
cp setup/ugui.config.example.json ugui.config.json
#    编辑 ugui.config.json：projectPath 必填；asmdef 工程需把 assemblyName 改成对应程序集名
#    productionPrefabDir/scriptDir 配 Production；previewPrefabDir/previewScriptDir/previewAssemblyName 配 Editor-only Preview
#    psdImport.sourceLayerMarker 配置素材源末尾标记；psdImport.ppuProfile 配置 Canvas/Sprite PPU
#    通用默认值为 100/100；若项目采用放大素材工作流可配置为 100/25
#    defaultPsdTextMode 控制文字默认导入为 editable TMP_Text 或 raster Image
#    PSD 导入的 TMP_Text 使用项目 TMP Settings 默认字体；浏览器 TTF/OTF 仅暂存到工作区
```

重启 DSH 并刷新现有 Web 页面后，可在 `plugins/dsh-ugui-tools/` 运行 `npm run test:runtime-psd`，确认当前 `127.0.0.1:3080` 已启用语义分析协议 v3 和进度路由；随后新建「UGUI制作模式」会话，先让 agent 执行一次 `ugui_setup` 创建工作台场景（UIDslWorkbench），即可开始使用。

## 使用

1. 会话中描述界面需求 → Agent 产出 DSL 并在浏览器设计器/预览器中呈现；或点击「导入 PSD」，选择文件、Sprite PPU、文字模式和可选的设计器预览 TTF/OTF。预览字体只暂存到工作区，Unity 的 `TMP_Text` 使用项目 TMP Settings 默认字体。导入只替换当前 Canvas 为暂存草稿并提交 Agent 分析，不自动生成 Prefab。
2. PSD 中可见效果层负责布局；名称以 `psdImport.sourceLayerMarker`（默认“原图”）结尾的素材层在整份 PSD 中全局参与配对，与效果层是否同组无关。素材保持自身像素尺寸。隐藏但不是素材源的 Group/叶子会作为运行时状态候选保留，不得因初始不可见而删除或强制激活。普通文字安全转换为 TMP；无法可靠还原的特殊文字才回退为 `Image`。隐私边界：PSD 文件名、图层名称和文字元数据会发送给当前 Agent/模型；所选 TTF/OTF 二进制只保留在本机工作区。
3. Agent 可在顶层 `runtime.stateGroups` / `runtime.interactions` 中声明状态与机械交互。设计器切换“当前状态/全部状态”检查结构，预览器进行模拟或全屏预览；业务数据仍属于项目或可选 Preview。
4. 确认 Canvas 版本后显式点击「生成 Prefab」（或调用带必填 `expectedVersion` 的 `ugui_build`）。此时才导入暂存素材。输出始终包含纯生产 `<Name>.prefab`；存在 view/test data 时另在 Editor-only 配置目录生成 `<Name>.Preview.prefab`，生产 Prefab 与 player assembly 都不携带这些预览内容。
5. 更新既有 Prefab 遵循所有权 Manifest/三方冲突合同：用户节点、组件与 UnityEvents 不应被静默覆盖；冲突需处理后重试。没有有效 Manifest 的旧资产当前一律拒绝接管；必须先通过受信任的项目迁移/备份流程建立基线，不能靠删除 `TestData.cs` 作为移交步骤。

## 目录结构

```
├── preset.yml / agent.cordis.yml   # preset 元数据与组合（persona、工具行）
├── ugui.config.json                # 你的工程配置（不入库；参考 setup/ugui.config.example.json）
├── plugins/dsh-ugui-tools/         # 主插件：host 工具/路由 + 浏览器设计器/预览器
├── plugins/dsh-ugui-entry-guard/   # 入口守卫（web profile 常驻）：入口按钮缺失时自动刷新一次页面
│   ├── lib/                        # host.js（工具与构建管线）/ client.js（设计器与预览器）
│   ├── unity/BuildUiWorker.cs      # Unity 侧构建 worker（经 unity-cli 任务在工程内执行）
│   ├── test/                       # 行为测试（npm test）
│   ├── COMPONENTS.md               # DSL 组件契约
│   └── UNITY_SEMANTICS.md          # uGUI 交互语义本地缓存（按组件分节，含版本钉）
├── vendor/unity-cli/               # 内嵌的 Unity Editor 控制通道（bash 入口 + Windows 用 Python 移植入口）
├── setup/install.mjs               # Web Profile link 依赖注册（跨平台 Node 脚本）
├── setup/ugui.config.example.json  # 工程配置样例
└── fixtures/canvases/              # 示例画布（测试背包：DSL + 逻辑 + 视图脚本三件套）
```

## 开发

```bash
cd plugins/dsh-ugui-tools && npm test
```

注意：`ugui.config.json` 存在且指向真实工程时，语义缓存新鲜度测试会对该工程生效。修改 host.js 后需递增 `agent.cordis.yml` 中 host 行的 `?v=` 查询参数并重启 DSH；修改 client.js 后也应递增插件 package 版本。没有运行 `pnpm run dev:web` 时，Client 改动不会自动热更新。

架构与生命周期约定见 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)。

## 商业支持

本 preset 以 MIT 协议免费开放全部功能（含商用）。如果你的团队需要以下服务，欢迎联系洽谈：

- **接入支持**：在你的 DSH + Unity 工程里完成部署、调通首块画布
- **定制开发**：新 DSL 组件、私有交互语义、内部管线对接
- **培训咨询**：uGUI 生产流程与 agent 协作模式落地

联系方式：378905096@qq.com / 微信 codiee_zhang（或 GitHub [@BaronCyrus](https://github.com/BaronCyrus) 私信/Issue）。

社区支持通过 GitHub Issues 进行（尽力而为，不保证时效）。

## 许可

[MIT](LICENSE) © 2026 BaronCyrus。本仓库全部内容（含 `vendor/unity-cli`）均为原创并以同一协议发布。
