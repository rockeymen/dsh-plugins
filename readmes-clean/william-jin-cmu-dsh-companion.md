# Cetus · make dsh your desktop companion

把 dsh，变成常驻桌面的全能助手。

![Cetus：DeepSeek Harness 驱动的原生桌面聊天，含思考过程与流式回复](assets/hero.png)

## 初衷

Agent runtime 越来越强，但它们的家一直在终端和浏览器标签页里——你要主动去找它，而不是它随时在你身边。[Cetus](https://github.com/drewnekota/cetus) 是我一直在维护的开源 macOS 桌面 agent 应用，出发点就是反过来：**让 agent 常驻桌面**——全局快捷键随叫随到、看得到你的屏幕上下文、定点定时替你干活、干完把文件直接递到你手上。它为此打磨出的一整套桌面层（统一的运行时事件模型、全局唤起、定时任务、看板）已经服务过 Claude Code、Codex 等多个 runtime。

这个仓库是 Cetus 的 **DeepSeek Harness 发行版**：会话引擎完全由 dsh 驱动，Cetus 提供 dsh 之外的整个桌面层。

## 为什么是 deepseek-v4-flash

桌面助手和编码终端的调用模式完全不同：**高频、碎片、即时**。全局唤起问一句、划词起草一条回复、每天早上跑一遍日报、每个会话生成标题——这类调用一天几十上百次，每次上下文不大，但要求秒级响应。

这个形态能不能成立，取决于模型能不能同时做到三件事：

- **便宜**——高频调用不心疼，常驻才有意义
- **快**——唤起即答，等待超过几秒的"快捷"功能没人会用第二次
- **高智能**——真能当 agent 使：多步工具调用、读屏理解、按约定交付产物

v4-flash 是第一个把三者同时做到的模型档位——**它让"常驻桌面 agent"从演示变成日常**。需要更深推理时，一个菜单切到 v4-pro 或调高 reasoning effort，上下文无缝保留。

缺的一块是视觉：v4 看不了图，而桌面场景到处是截图。这块我用 [dsh-vision](https://github.com/dsh-external/dsh-vision) 补上了，装完纯文本的 v4 照样看截图、读图表。

## 功能

**完整的原生聊天**
流式回复、思考过程折叠块、工具调用卡片、审批交互（允许/拒绝）、模型主动提问的分步问答卡、模型与 reasoning effort 切换、多会话/工作区、看板视图。

**全局唤起（Quick Launcher）**
双击快捷键在任何界面上呼出，随口一问直接开聊——不用切窗口、不用找应用。

![任意界面双击呼出 → 提问 → 主窗口流式回答](assets/quick-launcher.gif)

**截图问 AI（带上下文唤起）**
另一套手势呼出时自动携带当前屏幕截图、前台应用、选中文本作为上下文——看着什么就问什么：报错弹窗、图表、别人发来的方案。

![双击呼出即带截图与前台应用芯片 → 直接提问](assets/screenshot-ask.gif)

**快捷回复（Quick Reply）**
任意聊天/邮件界面双击右 ⌥，读屏理解对话，一键起草得体的回复草稿。

![飞书消息上双击右 ⌥ → 读屏起草回复](assets/quick-reply.gif)

**定时自动化（Automations）**
cron 表达式定时把 prompt 发给 dsh 会话：晨报、巡检、周期性任务，跑完结果在会话里等你。直接在聊天里说"每天 8 点帮我总结 xx"，agent 会自己调工具建好任务。

![聊天里让 agent 自己创建定时任务](assets/automations.gif)

**文件交付（自带 [dsh-artifact](https://github.com/dsh-external/dsh-artifact)）**
模型写完文档/图片/导出文件后调用 `send_artifact` 正式交付，聊天里直接出现预览卡片——不再是"文件写好了，自己去找"。

**视觉（自带 [dsh-vision](https://github.com/dsh-external/dsh-vision)）**
纯文本的 v4 也能看图：`view_image` 工具桥接 VLM（默认智谱免费档），看截图、读图表、认 UI。

**屏幕记忆（Screen Context）**
可选开启的端上屏幕感知：Apple Vision OCR 本地索引，数据不出本机。问 agent "我今天下午干了啥"，它调 screen_timeline / search_screen_history 工具按真实屏幕轨迹归纳；也可以自己打开 Screen History 面板按时间线翻、全文搜索屏幕上出现过的文字。

![问今天干了啥 → agent 给出时间线；随后手动翻 Screen History 面板](assets/screen-context.gif)

**插件管理（⌘4）**
独立的 Plugins 页：已安装列表、启停开关、精选目录一键安装、git URL 兜底（自动处理宿主依赖链接）。

## 架构

```
Next.js 前端（原生 UI）
  └─ Tauri/Rust：统一 RuntimeEvent 事件模型
       └─ dsh 会话模块：守护一个共享的 headless `dsh web` 宿主
            └─ dsh-bridge/（cordis 插件，随仓库分发）：
               宿主 ApiProxy → 127.0.0.1 HTTP + SSE（token 鉴权）
```

- 每个会话对应一个 dsh session；事件流实时翻译进聊天 UI；会话 id 持久化，重启续聊，换模型不丢上下文
- 壳自选空闲端口传给宿主与桥，不解析任何启动输出；退出时清理整个进程组
- 首次启动自动在 `~/.dsh/config.yaml`（dsh 官方的个人覆盖层）挂载桥和自带插件，带标记块、可随时删除；用户已有的挂载优先

## 运行

```sh
pnpm install && pnpm build        # 前端静态导出 → out/
./dsh-bridge/scripts/build.sh     # 构建桥接插件（需要 dsh 检出）
cd src-tauri && cargo run
```

要求 `dsh` 在 PATH 上。

### 环境变量 · 说明
- **环境变量**: `DSH_COMPANION_BRIDGE_LIB` · **说明**: 覆盖桥接插件 lib 路径（默认取仓库内 `dsh-bridge/lib/index.js`）
- **环境变量**: `DSH_COMPANION_PLUGINS_DIR` · **说明**: 覆盖自带插件目录（默认取仓库内 `plugins/`）

## 状态

聊天主链路（含流式/思考/工具/审批/问答）、模型与 effort 调优、Quick Launcher、快捷回复、定时自动化、插件管理、文件交付与视觉插件均已接通并实测。进行中：打包分发（signed .app）、问答卡多问题体验打磨。