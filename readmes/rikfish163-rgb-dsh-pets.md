<p align="center">
  <a href="./README.en.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  <img src="./assets/lulu-spritesheet.webp" alt="dsh-pets 噜噜宠物" width="288">
</p>

# dsh-pets

Codex Pets 风格的 **DeepSeek Harness（DSH）Web UI 插件**：一个可拖拽的原创二次元像素桌宠 + 一个浮在任意页面上的实时任务面板。

- 🐾 **桌面宠物**：精灵图序列帧动画，状态随 Agent 联动（待命 / 思考 / 工作中 / 等你回答 / 已完成 / 失败）。
- 📋 **任务面板**：三个标签页——**进行中**（后台 Job + Goal + 子代理）、**已完成**（含重启后保留的历史记录）、**等你回答**（模型停下提问 / 等待审批时点亮）。
- 🔔 **实时提醒**：有等待你的提问时，宠物亮起红色角标、浏览器标签页标题显示 `([N])`。
- 🖱 **任意页面悬浮**：全局浮层（`shell.overlay`），在任何页面都能点开浏览实时进度，无需切回会话页。
- 🔗 **一键跳转**：任务卡片展开可以看输出 tail / 详情，点「打开会话 →」深链直达对应会话窗口。
- ✨ **现代玻璃拟态 UI**：面板使用毛玻璃、渐变与圆角卡片设计，并可将宠物和面板透明度调至 35%–100%。
- 🎨 **自定义形象**：可直接上传 PNG / WebP / GIF / JPG（最大 8MB），也可随时切回内置精灵图。
- 🚀 **Web 快捷入口**：面板底部可直达 DSH Web 首页、会话界面和插件管理。

> 灵感来源：OpenAI Codex Desktop 的 **Pets** 功能（Codex 会用一只桌面宠物展示正在运行 / 已完成的 Agent 任务，Agent 停下来等你回复时宠物会呼唤你）。本项目是面向 DSH 的同构实现，**不依赖 Codex，也非官方项目**。

## 预览

<!-- 截图占位：安装后，宠物悬浮在 DSH Web GUI 右下角 + 展开的三标签任务面板 -->
<!-- 欢迎 PR 贡献 docs/screenshot.png -->

## 安装

要求：`dsh web`（DeepSeek Harness Web，Node ≥ 20）。

```sh
# 方式一：从 GitHub 安装
dsh plugin --profile web add "github:rikfish163-rgb/dsh-pets"

# 方式二：本地开发安装
dsh plugin --profile web link /path/to/dsh-pets
```

安装后重启 `dsh web`，右下角即出现宠物。管理面板：**设置 → 插件**。

## 使用

| 操作 | 效果 |
| --- | --- |
| 单击宠物 | 展开 / 收起任务面板 |
| 拖拽宠物 / 面板标题栏 | 移动位置（自动记住） |
| 双击宠物 | 重新播放当前动画 |
| 尺寸滑杆 | 调整宠物大小（64–280px） |
| 透明度滑杆 | 同步调整宠物与面板透明度（35%–100%，自动记住） |
| 上传宠物 | 选择 PNG / WebP / GIF / JPG 自定义桌宠图案 |
| 底部快捷入口 | 直达 Web 首页、会话和插件管理界面 |
| 任务卡片点击 | 展开详情 / 输出 tail，再点「打开会话 →」跳转 |
| 浏览器标签页 | 有提问等待时标题显示 `([N])` 角标 |

宠物动画状态含义：

| 状态 | 触发 |
| --- | --- |
| 待命（原地呼吸） | 无任务运行 |
| 思考（歪头） | ——（保留动画位） |
| 工作中（快速起伏） | 任意会话 `running` |
| 等你回答（招手） | 会话 `pendingInteraction`（提问 / 审批） |
| 完成（举手庆祝） | 有任务完成 |
| 失败（垂手） | 有任务失败 |

## 工作原理

插件由两半组成（与官方 `dsh-client-ui-*` 同构）：

1. **宿主半 `lib/index.js`**（Cordis 插件）：注册只读 JSON 路由
   - `GET /plugins/dsh-pets/tasks` — 合并后台 Job、Goal、前台 Task、子代理及活跃/等待中的 Session，兼容不同 DSH 版本的可选服务形态。
   - `GET /plugins/dsh-pets/asks` — 从 `ctx.sessions` 的 `pendingInteraction` / `ctx.userQuestions` 收集「等待你回答」。
   - `GET /dsh-pets-assets/lulu-spritesheet.webp` — 打包的「噜噜」水豚精灵图（9 行 × 8 列）。
   - `GET /dsh-pets-assets/pet-sheet.png` — 兜底的原创像素精灵图。
   - 已完成历史持久化到 `~/.dsh/storages/dsh-pets.json`（重启不丢失，最多 200 条）。
2. **宿主半 `lib/client.js`**（`window.__ModuleLoader__` 客户端 bundle）：通过 `ctx.slots.inject("shell.overlay")` 注册全局浮层，订阅 `sessions.list` store 做 Agent 状态联动，每 1.5s 轮询上述路由刷新面板。

所有服务访问均为可选探测（`ctx.get` + try/catch），某个服务不存在时优雅降级，不会拖垮宿主。

## 目录结构

```
dsh-pets/
├── assets/lulu-spritesheet.webp  # 「噜噜」水豚精灵图（9 行 × 8 列，主图）
├── assets/lulu-pet.json          # 噜噜的 Codex pet.json
├── assets/pet-sheet.png          # 兜底原创像素精灵图（scripts/gen-pet.py 生成）
├── scripts/gen-pet.py            # 精灵图生成脚本（Pillow）
├── lib/index.js              # 宿主半：任务/提问路由 + 历史持久化
├── lib/client.js             # 客户端半：宠物动画 + 任务面板浮层
├── cordis.patch.yml          # bundle patch（激活插件的 loader 条目）
└── package.json              # dsh.bundle.patch + dsh.client 声明
```

## 与原版 Codex Pets 的对比

| 维度 | Codex Desktop Pets | dsh-pets |
| --- | --- | --- |
| 平台 | Codex Desktop 专属 | DeepSeek Harness Web（跨平台浏览器） |
| 任务来源 | Codex Agent / task 线程 | DSH 的 Job + Goal + 子代理 |
| 提问唤起 | Codex 停下来问问题时长鸣提醒 | 宠物招手 + 角标 + `([N])` 标题 |
| 跨页面浏览 | 桌面浮层 | 任意页面 `shell.overlay` 浮层 |
| 历史记录 | Codex 会话存档 | `~/.dsh/storages/dsh-pets.json` |

## 二次开发

更换宠物形象：替换 `assets/lulu-spritesheet.webp`（9 行状态序：`idle / run-right / run-left / wave / jump / failed / waiting / sprint / review`，每帧 162×198）。读不到主图时插件自动回退到 `assets/pet-sheet.png`（原创像素图，可用 `scripts/gen-pet.py` 重新生成）。

## 许可证

[MIT](./LICENSE)。

> ⚠️ 素材版权说明：`assets/lulu-spritesheet.webp` 为 OpenAI Codex 官方宠物「噜噜」资产，由作者应发布者要求打包进本仓库。该图版权归 OpenAI 所有，如你自行分发请注意合规；`assets/pet-sheet.png` 为脚本原创生成，可自由使用。

## 致谢

- 参考了 [skr311/dsh-codex-pet](https://github.com/skr311/dsh-codex-pet)（Codex 风格宠物 + `shell.overlay` 浮层）与 [vlln/dsh-task-status](https://github.com/vlln/dsh-task-status)（任务状态与输出 tail 路由）的实现模式。
- DSH 插件生态：见 [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin)。
