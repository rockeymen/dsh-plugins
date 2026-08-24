# dsh-webui — DeepSeek Harness 会话增强全家桶

一个插件融合视图切换、消息导航、技能管理、供应商管理、辅助视觉、生图/生视频、记忆（hybrid 检索）、AI 浏览器、文件浏览器、Markdown 渲染、工具聚合、用量统计、网页搜索、定时自动化任务引擎、PlanWeave 计划项目、会话产物清单、对话退回与文件回退/修改历史对比、提示音、壳管理更新、网络代理、消息截图、中文思考等能力。纯插件实现，不改动 DSH 源码。

## 一句话安装（DSH）

```bash
dsh plugin --profile web add github:statem-li/dsh-webui
```

重启 DeepSeek Harness 即可。

本包在 package.json 声明了 `dsh.bundle.patch`（DSH rc.2 起的 bundle 契约），`dsh plugin add` 安装完成后 reconcile 会自动把它加入 profile 的 `dsh.profile.bundles` 层，挂载声明由包内 `cordis.patch.yml` 自带——**无需再手动往 `~/.dsh/profiles/web/cordis.patch.yml` 追加 insert**。若你从旧版本升级且之前手动追加过同 id 条目，按 last-write-wins 合并，删除或保留均无害；已安装用户执行一次 `dsh plugin update` 即会自动激活。

> 注：webui 接管了技能 slash 源（`/` 菜单），安装后需在 `~/.dsh/profiles/web/cordis.patch.yml` 禁用内核 ui-skill 插件以避免同名源冲突：

```yaml
- id: ui-skill
  name: "@deepseek-ai/dsh-client-ui-skill"
  disabled: true
```

## 按需启停功能模块

dsh-webui 是全家桶，但每个功能模块都可以单独关闭——不需要的功能不装配（host 不注册对应工具 / provider / HTTP API，client 不注册对应 UI 槽位），界面更干净、加载更轻。

**配置方法**（二选一，改完重启 DSH 生效）：

1. 编辑 `~/.dsh/profiles/web/settings.yaml`，加 `webui-modules` 命名空间，把想关的模块显式写为 `false`（没写的模块全部保持启用，升级新增模块时老配置自动兼容）：

```yaml
webui-modules:
  browser: false      # 不需要 AI 浏览器
  automation: false   # 不需要自动化
  planweave: false    # 不需要 PlanWeave 计划项目
  peakValley: false   # 不需要峰谷时刻卡片
```

2. 调 HTTP API（适合脚本批量开关，部分覆盖合并写入）：

```bash
curl -X POST http://127.0.0.1:3080/api/webui-modules \
  -H "content-type: application/json" \
  -d '{"modules": {"browser": false, "automation": false}}'
```

**生效机制**：host 半身在插件加载时一次性装配，改动后需重启 DSH；client 半身启动时同步读本地缓存立即裁剪，并后台拉取 `/api/webui-modules` 校正缓存——重启后刷新页面，两端即按同一份配置生效。

**模块 key 一览**（`false` = 关闭；缺省全部启用）：

### 分组 · key · 控制的功能
- **分组**: 对话体验 · **key**: `messageWidth` · **控制的功能**: 消息气泡宽度设置
- **分组**:  · **key**: `doneSound` · **控制的功能**: 回合结束提示音 + 完成卡片
- **分组**:  · **key**: `donePill` · **控制的功能**: 对话完成胶囊 + 记录面板
- **分组**:  · **key**: `approvalNotify` · **控制的功能**: 审批等待 toast 提醒
- **分组**:  · **key**: `ctrlEnter` · **控制的功能**: 输入框 Ctrl+Enter 换行
- **分组**:  · **key**: `sessionMotion` · **控制的功能**: 会话切换柔和过渡
- **分组**:  · **key**: `sessionPin` · **控制的功能**: 会话置顶 / 归档 / 右键菜单
- **分组**:  · **key**: `rewind` · **控制的功能**: 对话退回
- **分组**:  · **key**: `screenshot` · **控制的功能**: 单条消息截图 / 会话长图
- **分组**:  · **key**: `promptOptimize` · **控制的功能**: 提示词优化图标
- **分组**:  · **key**: `zhThinking` · **控制的功能**: 中文思考开关
- **分组**:  · **key**: `peakValley` · **控制的功能**: DeepSeek 峰谷时刻卡片
- **分组**:  · **key**: `chatStats` · **控制的功能**: 会话统计条
- **分组**:  · **key**: `toolSummary` · **控制的功能**: 工具调用聚合 + 活动抽屉
- **分组**: 模型与供应商 · **key**: `reasoningSync` · **控制的功能**: `webui_sync_reasoning` 推理等级补全工具
- **分组**:  · **key**: `modelSeats` · **控制的功能**: 模型座位接管 + 推理等级弹出
- **分组**:  · **key**: `providerHub` · **控制的功能**: 供应商管理设置页
- **分组**:  · **key**: `vision` · **控制的功能**: 辅助视觉 + 生图 + 生视频 + 生图画廊
- **分组**:  · **key**: `webSearch` · **控制的功能**: AnySearch 网页搜索
- **分组**:  · **key**: `mail` · **控制的功能**: 邮箱验证码
- **分组**: 技能 · **key**: `skills` · **控制的功能**: 技能 slash 两级导航源 + 技能开关路由
- **分组**: AI 浏览器 · **key**: `browser` · **控制的功能**: 浏览器工具 + dock UI + 设置开关
- **分组**: 自动化与计划 · **key**: `automation` · **控制的功能**: 自动化任务 + 真实执行引擎
- **分组**:  · **key**: `planweave` · **控制的功能**: PlanWeave 计划项目
- **分组**: 记忆 · **key**: `memory` · **控制的功能**: 记忆引擎 + Memory Dream
- **分组**: 用量与统计 · **key**: `usage` · **控制的功能**: 用量工作台
- **分组**: 文件与工作区 · **key**: `fileExplorer` · **控制的功能**: 文件浏览器
- **分组**:  · **key**: `dirPicker` · **控制的功能**: 工作区目录选择器
- **分组**: 外观与系统 · **key**: `appearance` · **控制的功能**: 玻璃质感主题
- **分组**:  · **key**: `sidebarFloat` · **控制的功能**: 悬浮侧边栏
- **分组**:  · **key**: `updater` · **控制的功能**: 壳管理更新
- **分组**:  · **key**: `proxy` · **控制的功能**: 网络代理

**注意事项**：

- 关闭 `skills` 后会失去内置 slash 两级导航源，此时应删除 cordis.patch.yml 里对内核 ui-skill 的 `disabled: true` 以恢复官方 `/` 菜单。
- 关闭 `providerHub` 将失去供应商/视觉/生图/生视频模型的配置入口（已保存的配置仍生效）。
- 核心能力不提供开关、始终启用：视图图块与消息导航、markstream 基础 Markdown 渲染、供应商标签、移动端响应式。

## 功能总览

### 对话体验

### 功能 · 说明
- **功能**: 右上角视图图块 + 消息导航 · **说明**: 对话/轨迹切换图块、消息徽标/弹窗列表、右侧消息横条、弹窗内手动加载更早消息
- **功能**: 会话置顶 · **说明**: 侧边栏会话右键菜单：置顶（置顶组排最前）/ 归档按钮 / 重命名；localStorage 持久化，跨标签页实时同步
- **功能**: 对话退回 · **说明**: 每条用户消息加退回按钮，一键回退工作区文件到该消息发送前 + 原地回退上下文（fork 到该消息之前 turn 边界 → 归档原会话 → 打开子会话）。v2 git 式内容寻址存储：文件内容按 SHA-1 入全局 blob 库（gzip），快照只落「路径 → 指纹」纯索引，体积降两个数量级
- **功能**: 会话产物卡片 · **说明**: host 端独立记账 agent 经 fs 服务的写入产物并落盘（jsonl），重启后消息操作栏「产物」入口仍可打开大卡片：左栏本会话产物清单、右栏应用内展示（图片内嵌 / markdown 渲染 / 代码高亮 / 二进制 hex 兜底），不经系统打开
- **功能**: 单条消息截图 · **说明**: assistant 消息 actions 行截图按钮（渲染会话长图 / 单条樱花主题截图）；host 端 markdown-it + Shiki 渲染管线，支持代码高亮 / emoji 短码 / 任务清单 / 表格对齐 / 图片白名单，浅色 / 深色 / 玻璃 / 玻璃深色四主题
- **功能**: 对话完成胶囊 · **说明**: 顶部悬浮胶囊（常驻、可拖拽、位置持久化）——完成提醒 + 点击直达最新会话 + 运行中任务实时时长；悬停滑出记录面板；健康提醒徽章（时段可配）；空闲轮播开心话术与 AI 小知识；内置文件浏览器入口；胶囊大小 / 字体 / 显隐可调
- **功能**: 提示音 + 完成卡片 · **说明**: 回合结束提示音 + 对话完成卡片
- **功能**: 审批提醒 · **说明**: 有工具调用等待审批时顶部弹 toast
- **功能**: 会话切换柔和过渡 · **说明**: 内容区淡入上浮、面包屑轻淡入、侧边栏高亮 FLIP 式滑动；`prefers-reduced-motion` 自动禁用
- **功能**: 消息气泡宽度 · **说明**: 「发送对话宽度」拖动条（px/% 单位，settings.yaml 持久化），只作用于本人消息气泡
- **功能**: 输入框增强 · **说明**: Ctrl+Enter 换行；移动端响应式
- **功能**: 提示词优化 · **说明**: 对话框「自动优化提示词」图标，用当前选中模型流式优化草稿（loopback-only API，仅本地可调）
- **功能**: 中文思考开关 · **说明**: 设置页「中文思考」

### 模型与供应商

### 功能 · 说明
- **功能**: 供应商管理 · **说明**: 设置 →「供应商」页，统一管理对话供应商（任意 OpenAI 兼容）/ 辅助视觉 / 生图 / 生视频模型
- **功能**: 辅助视觉 + 生图 · **说明**: `vision_describe`（图片→文本）、`generate_image`（提示词→图片）、非多模态贴图降级、浏览器截图兜底
- **功能**: 生视频 · **说明**: `generate_video` 工具（遵循 OpenAI `/videos` 规范：创建异步任务 → 轮询至完成返回 url）；设置页两级下拉选供应商/模型（标注「支持生视频」的模型）
- **功能**: 生图画廊 · **说明**: `generate_image` 结果并排缩略图 + Lightbox + 保存
- **功能**: 模型选择增强 · **说明**: 接管模型座位（纯模型弹出）+ 推理等级滑动式弹出；供应商标签显示当前模型
- **功能**: 上下文窗口/最大输出预设 · **说明**: 模型上下文窗口 / 最大输出 token 改为预设下拉选择（倒序档位，支持手输）
- **功能**: 推理等级自动补全 · **说明**: `webui_sync_reasoning` 工具按供应商模板补全 `reasoningEfforts`
- **功能**: Developer Role 兼容检测 · **说明**: 一键检测：对每个 openai-completions 供应商真实发 `developer`/`system` 角色对照请求，判定网关是否支持新式 developer 角色；不支持则自动写入路由级 `compat.supportsDeveloperRole: false` 热修复（解决中转网关推理模型一律 HTTP 400）
- **功能**: 网页搜索 · **说明**: AnySearch provider + 设置卡
- **功能**: 邮箱验证码 · **说明**: `mail_get_code` 工具 + 设置卡（QQ 邮箱验证码提取，支持字母数字混合）

### 技能

### 功能 · 说明
- **功能**: slash 两级导航 · **说明**: 替代内核 ui-skill 平铺：输入 `/` 先展示技能集合（bundle），选中集合后再选技能；支持集合名过滤、散装技能入口、`/name` chip 装饰
- **功能**: 技能开关 · **说明**: 技能面板中每个技能可单独启用/禁用，整包一键开关；直接改写 `SKILL.md` frontmatter，模型目录、`skill` 工具、`/name` 手势同步生效
- **功能**: 技能管理面板 · **说明**: bundle 分组、上传安装、删除

### Markdown 渲染

markstream 流式渲染 + Shiki 代码高亮 + 悬浮目录（TOC）/ 标题锚点 + 提示块（admonition）/ 脚注 / 定义列表 / 任务列表 / 数学公式（KaTeX）+ 思考 chip。

- **提示块**：`:::note` / `:::tip` / `:::warning` / `:::danger` / `:::error` 围栏容器，支持自定义标题（`:::warning 注意`）。
- **目录 / 锚点**：正文标题 ≥ 3 个时自动在顶部生成可折叠目录，点击平滑滚动。

### AI 浏览器（壳内多标签，零独立浏览器进程）

浏览器不再是独立的 Edge/Chrome 进程，而是 **DeepSeek Harness 壳子内部的多标签 WebContentsView**——桌面永远不会弹出浏览器窗口，任务栏无图标，AI 操作的页面实时内嵌在对话面板右侧滑出的抽屉里（原生渲染 + 鼠标键盘直接命中）。

#### 架构

- 壳子（`main.js`）内置视图宿主：每会话一个 `persist:` 分区（登录态隔离），每标签一个 WebContentsView
- 控制通道 `http://127.0.0.1:3081`（仅回环）：`/view/create-tab|attach|detach|close-tab|close`
- CDP 调试端口**动态协商**：壳子启动时从 9224 起挑空闲端口并写入 `D:\AI\Dsh\.shell-cdp-port`，插件启动后读取该文件连接（不要写死端口——异常退出的壳子会留下僵尸监听）
- 标签 ↔ CDP target 映射：创建时用 URL hash 匹配，再用 `window.name` 持久标记——服务/壳子重启后视图存活可复用
- 抽屉打开 = 视图挂载到画面区（激活标签关闭 JS 节流，全速）；抽屉关闭 = 视图卸下（`visible=false` + 恢复节流，空闲 CPU 趋近 0）

#### 工具速查

### 工具 · 用途
- **工具**: `browser_batch` · **用途**: **一次调用按顺序执行最多 10 个动作**（click/type/select/hover/press/scroll/navigate），只返回最终快照
- **工具**: `browser_navigate` / `_click` / `_type` / `_select` / `_hover` / `_press` / `_scroll` · **用途**: 单步操作（作用于当前激活标签）
- **工具**: `browser_back` / `_forward` · **用途**: 历史导航
- **工具**: `browser_snapshot` · **用途**: 文本 ref 树（元素以 `[ref]` 定位）
- **工具**: `browser_see` / `browser_screenshot` · **用途**: 截图 + 视觉描述（自动降级 renderer 截图，detached 视图不卡死）
- **工具**: `browser_evaluate` · **用途**: 页面执行 JS（处理 ref 定位不到的场景）
- **工具**: `browser_status` / `browser_stop` · **用途**: 状态查询 / 关闭全部标签

#### 效率技巧：连续操作用 browser_batch

逐个调用 `browser_click` / `browser_type` 时，每个动作都要一整轮 LLM 推理（20~40 秒），注册表单这类 10~20 步的任务会拖到 6 分钟以上。改用 `browser_batch` 把整段流程压成一次调用：

```json
{"action": "browser_batch", "actions": [
  {"action": "click", "ref": 12},
  {"action": "type", "ref": 15, "text": "me@example.com"},
  {"action": "type", "ref": 18, "text": "密码123", "pressEnter": false},
  {"action": "click", "ref": 22},
  {"action": "click", "ref": 30}
]}
```

任一步失败立即中止并报「第 N 步失败 + 原因」；全部成功返回最终快照。给 AI 的指令里写一句「用 browser_batch 批量完成」即可触发。

> 提速策略已默认常驻：插件会把「batch / evaluate 优先」的提速策略作为系统提示词自动注入（settings 命名空间 `browser-speed`，默认开启、关闭时零 token 占用），无需每次在指令里点名；开关在 dock 工具条悬停权限卡片里。

#### 元素选取

dock 工具条「选取元素」按钮进入选取模式，点击预览画面任意元素，自动采集唯一 CSS 选择器 + 元素摘要并回填对话框草稿（再点一次或 Esc 退出）。详见 [docs/ELEMENT-PICKER.md](docs/ELEMENT-PICKER.md)。

#### 抽屉 UI

- 标题右侧为**标签页栏**：切换 / 悬停关闭 / ＋ 新建
- 第二行左侧是**快捷站点**（点一下新开标签打开，＋ 可添加/删除，全局共享持久化）；右侧是当前网址 + 一键复制
- 底部悬浮条显示最新一条 AI 操作（一句话），点击展开完整时间线
- 左侧留白区点击或 Esc 收起抽屉；收起后浏览器视图卸下、不占任何资源

### 定时自动化任务引擎

左侧导航「新会话」下方菜单项，点开从菜单右侧滑出 TAB 式浮层卡片（窄屏回退底部 sheet），分「任务计划 / 运行记录」两个 Tab。

- **任务计划**：工具栏「＋ 新建」创建任务（调度类型：单次 at / 固定间隔 every / 5 字段 cron；执行 prompt；绑定模型与推理等级或留空用默认模型）+ **AI 待确认建议区**——Agen