# dsh-gov-portal · Deepseek Harness 综合智能办事平台

一个以**中国地方政务网站视觉规范**为设计基准的独立 WebUI 插件：在独立端口（默认 **3081**）提供政务风办事大厅界面，通过宿主进程内的 **apiProxy 网关** 1:1 对接 DeepSeek Harness 的会话、模型、模式、权限、统计等**全部真实 Agent 能力**（零业务硬编码）。

界面采用可复用的政务服务门户设计语言，完整设计规范见 [`docs/design-system.md`](docs/design-system.md)；宿主集成面调研见 [`docs/harness-integration.md`](docs/harness-integration.md)。

## 功能总览

### 页面架构（严格政务风）
- **顶部工具条**（政务网站深蓝底白字 + WindowsXP 原版像素点阵字体：宋体 12px 点阵关闭抗锯齿）：`[设为首页] [加入收藏] [无障碍浏览]` + 居中红色标语（可配置）+ 右侧实时日期时间（精确到秒）+ **访问次数统计「本站已被访问：xxxxxx 次」**（服务端持久化计数，6 位补零，`/plugin/visits` 端点，存于 `~/.dsh/gov-portal.json`）。
- **主 Header**：红色公章徽标（预设红/蓝/绿/金印章或上传图片）+ 平台名/副标题 + 政务搜索框（蓝色 `[查询]`）+ 绿色状态圆点 `系统状态: 正常运行`。
- **主导航**：经典深蓝渐变（`#1874cd → #0d47a1`）白字黑体，`平台首页 / 业务大厅 / 电子卷宗 / 督办流水 / 参数配置 / 政策法规`，Hover 高亮。
- **双通道跑马灯**：左侧【重要通知】与右侧【行情指数】反向滚动，速度/方向/内容/真实轮询 API 均可配。
- **80/20 主布局**：左侧直办大厅（工单编号条 → 交互回执窗口 → 统计行 → 公文输入表单），右侧支撑侧栏（常用办事通道 / 便民服务提示）。
- **动态飘窗 ×2**（DVD 屏保匀速碰撞反弹，悬停暂停、`[×]` 销毁）：红头重要通知弹窗 + 官方矩阵二维码弹窗。
- **办结盖章**：流式输出完成时右上角盖半透明 `【准予办结】` 红色印章动画（可关闭）。

### 与 DeepSeek Harness 的真实对接（1:1，不硬编码）
### 界面元素 · 宿主能力 · 说明
- **界面元素**: 模型下拉 + 推理强度 · **宿主能力**: `session.models` / `session.selectModel` · **说明**: 按 provider 分组动态枚举，推理强度随模型动态刷新
- **界面元素**: 模式下拉（标准/创造/PTC/极简/自定义 preset） · **宿主能力**: `agentPreset.list` / `agentPreset.select` · **说明**: 全量动态枚举，创建工单时随 `session.create` 传入
- **界面元素**: 权限下拉（read-only / workspace-write / danger-full-access） · **宿主能力**: `settings.describe` + `settings.update('permission', {defaultPreset})` · **说明**: 从 settings schema 动态枚举；所选权限在新建工单时写入宿主「新会话默认」，由宿主初始化（零 Token 消耗，不向会话发送权限消息）
- **界面元素**: 回执流（文本/思考/工具/轨迹/todo） · **宿主能力**: `events.mux` → `session/event` 帧 · **说明**: 与主 GUI 同一事件源
- **界面元素**: 统计行（轮/步/LLM时长/工具时长/首token/速度/缓存命中/输入输出/TPS） · **宿主能力**: `sessionStats` 投影 + `assistant/message` usage 聚合 · **说明**: 全实时计算
- **界面元素**: 沙箱审批弹窗（准予执行/不予批准） · **宿主能力**: `approval/requested` 帧 + `POST /api/respond` · **说明**: 与权限预设联动
- **界面元素**: 系统咨询弹窗（问题答复） · **宿主能力**: `question/requested` 帧 + `respond` · **说明**: 多选支持
- **界面元素**: 电子卷宗（会话索引/查阅/导出 JSONL） · **宿主能力**: `session.list` / `session.history` / `session.search` / `GET /api/session.export` · **说明**: —
- **界面元素**: 督办流水（轨迹事件表） · **宿主能力**: `session/event` 实时追加 · **说明**: chunk 级可过滤
- **界面元素**: DSH 原生系统设置（模型/凭据/沙箱等全部命名空间） · **宿主能力**: `settings.describe`（schemastery schema 驱动表单）/ `settings.update` · **说明**: 可调整原版 Harness 的全部配置

### 参数配置面板（全维度热修改 + 持久化）
漂浮弹窗与公告控制、跑马灯与滚动条、界面视觉与个性化（4 套预设主题 + 自定义全站主色/渐变/边框色 + 单位落款与文案 + 徽标上传）、Agent 运行与通信（端口/WS/工单前缀/默认模型/温度/上下文轮数/权限确认等级/盖章开关）、DSH 原生系统参数、存储与重置（保存 / 导出 JSON 卷宗 / 导入 / 恢复出厂）。前端配置存 `localStorage`（键 `dsh.govPortal.v1`），插件端口等存 `~/.dsh/gov-portal.json`。

## 安装与启用

```bash
# 1. 安装到 web profile（pnpm link + 自动 reconcile 进 dsh.profile.bundles）
cd <本目录>
dsh plugin --profile web add link:<本目录绝对路径>

# （如遇 pnpm 写入 package.json 的 EPERM，可手动补：
#   dependencies: "dsh-gov-portal": "link:../../../Desktop/test/Dsh_GovUI"（按实际相对路径）
#   dsh.profile.bundles 末尾追加 "dsh-gov-portal"）

# 2. 重启 dsh web（插件在 dsh 进程内，需重启生效）
dsh web

# 3. 访问
#    http://127.0.0.1:3081/         政务办事大厅（本插件）
#    http://127.0.0.1:3080/         DeepSeek Harness 主控台
```

## 验证

```bash
node test/server-smoke.mjs      # 静态资源 + API 桥分发 + SSE + respond + 导出（mock ctx）
node test/e2e-check.mjs         # 浏览器运行时 17 项检查（需 3081 在线）
node test/e2e-chat.mjs          # 真实对话：创建会话→提交→事件链→统计（消耗少量 API 额度）
node test/screenshot.mjs        # 各面板截图（输出 shots/*.png）
```

已验证记录：
- 模式下拉动态枚举出 `standard 标准模式 / code PTC 模式 / minimal 极简模式 / cordis 创造模式 / liangshen 梁神模式`；
- 权限下拉动态枚举出 `read-only / workspace-write / danger-full-access` 三档；
- `settings.describe` 动态渲染 11 个宿主命名空间表单；
- 真实对话事件链 `turn/start → user/message → assistant/chunk → assistant/message → turn/end(completed)` 与 `sessionStats` 投影（turns/steps/llmMs/toolMs/ttftMs/decodeMs/decodeTokens）全部通过。

## 注意事项
- 修改端口后需重启 dsh（监听参数在插件启动时读取）。
- 事件通道默认使用本插件与宿主同进程的 SSE 桥（最稳）；配置面板保留 WebSocket 地址/重试间隔项。
- 插件仅在宿主进程（dsh web）内运行；3081 页面不能脱离 dsh 单独使用。
- 测试会话会真实写入 `~/.dsh/sessions`，可在电子卷宗中查阅或删除。