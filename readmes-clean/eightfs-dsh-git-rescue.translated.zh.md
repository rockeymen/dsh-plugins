# 🛟 dsh-git-rescue

**DSH 救援恢复插件**——守护进程 + `.dsh` git 仓库管理 + 远端备份 + 救援环境 + 专项恢复工具。

把 `.dsh` 用户目录（sessions 会话、settings、profiles 配置、skills）纳入 git 版本管理，
用 commit 历史做精细回退；harness 崩溃时由独立守护进程按「专项工具 → git 还原 → 纯净 dsh 协助」三层兜底恢复。
远端备份支持 **GitHub token / SSH key 双方案**。从 2.0.0 起具备版本自动更新（含大版本换代升级）。

> ## 🥇 最好的 dsh 恢复插件，永远是 dsh 本体！
>
> 2026-08-19 崩溃主机救援实战铁律：插件（包括本插件）只能做 git 回退/拉起这类**本机兜底**；
> 真正把一台起不来的 DSH 救回来、把 8 插件 + 上百会话完整恢复的，往往是**另一台还在跑的 DSH**
> （跨机部署救援实例 + SSH 拉起纯净环境 + 可覆盖式恢复包）。本机插件救不了的场景，永远记得：
> **再开一个 DSH 来救这个 DSH**——训练有素的 AI + 另一份 .dsh + 一份权威 skill 文档，比任何单个插件都可靠。

**功能总览**（当前 2.0.0 合并版）：

### 功能 · 版本 · 一句话
- **功能**: .dsh 单仓库管理 · **版本**: v2.0.0 · **一句话**: `.dsh` 本地 git 仓库（会话/skill 不因启动失败丢失），自动 commit、心跳、崩溃检测
- **功能**: 远端备份 · **版本**: v2.0.0 · **一句话**: **GitHub token / SSH key 双方案**，私有仓名 `.dsh@<dsh版本>.<设备ID>`
- **功能**: 开机自启守护进程 · **版本**: v2.0.0 · **一句话**: 启动命令在 `.dsh` 目录这一层（git 仓库根），写系统自启
- **功能**: 救援环境 · **版本**: v2.0.0 · **一句话**: `<dsh版本>@Save-clean`（纯净，防装插件锁定）+ `<dsh版本>@Save-test`（测试）
- **功能**: 专项恢复工具 · **版本**: v2.0.0 · **一句话**: 代码级诊断修复：plugin_config / boot_symlink / ro_volume / plugin_load / permission / session_repair
- **功能**: git 还原恢复 · **版本**: v2.0.0 · **一句话**: 故障分类 → 保留现场 → 坏点标记 → reset 到好提交 → 拉起 → 自检
- **功能**: 纯净 dsh 协助兜底 · **版本**: v2.0.0 · **一句话**: 无法恢复时唤起 Save-clean，纯净 dsh 加载插件 skills 目录协助
- **功能**: **自动更新** · **版本**: v2.0.0 · **一句话**: 强制跟随 GitHub 最新稳定版 + **大版本换代升级**（卸载旧版→安装新版，代码级判断）
- **功能**: guardian 守护 · **版本**: v2.0.0 · **一句话**: 独立进程探活 + git 回退 + 拉起 + 自检（坏点标记防死循环）+ OOM 防护（自适应，env 可覆盖）+ OOM 故障识别（跳过无用回退直接拉起）+ peak-resume
- **功能**: **内置 LLM 自治诊断** · **版本**: v2.0.0 · **一句话**: guardian 直连 LLM（`.credentials.yaml` 的 DEEPSEEK_API_KEY 调 deepseek API）分析故障 + 建议动作（结构化 JSON），校验后执行；**纯代码修复优先**（plugin-health/repair-tools 先跑），LLM 作增强兜底
- **功能**: **profile 还原点 zip** · **版本**: v2.5.0 · **一句话**: profile/配置变化**提交 git 时自动打包** zip（原始相对路径，根 = .dsh）；手动 `unzip -o` 覆盖即恢复（不依赖 git）；**文件名后缀标注触发插件**（`profile-restore-<时间>-<插件 · config>.zip`），API/工具可列表/手动打包/覆盖恢复/删除
- **功能**: 插件树健康体检 · **版本**: 合并自旧版 · **一句话**: plugin-health：声明/产物一致性检查（00:22 崩溃类型），拉起前自动修复
- **功能**: 会话恢复联动 · **版本**: 合并自旧版 · **一句话**: 崩溃后自动调 session-manager 续跑中断会话（装了才调）**+ 自动续跑全局闸门**：DSH 刚启动默认关闭续跑（防崩溃恢复后批量建空壳），用户手动开启或第一次手动对话后自动放行
- **功能**: 接管式重启 · **版本**: 合并自旧版 · **一句话**: 独立脚本 TERM→轮询恢复→验证，会话中断也能安全完成
- **功能**: 救援积分 / sudo-key / flapping / 现场捕获 · **版本**: 合并评估 · **一句话**: 旧版能力按重构规范评估后纳入
- **功能**: **目录结构查看（dir-tree）** · **版本**: v2.0.0 · **一句话**: 独立工具 `tools/dir-tree.mjs`：零依赖、全平台兼容 Node.js（不依赖 shell tree），默认只列目录 2 层（项目文件夹那一层），可 CLI 运行或 import 调用（详见 `skills/dsh-dir-tree.md`）

![体系架构](docs/screenshots/architecture.svg)

## ✨ 为什么需要它？

DeepSeek Harness 改配置、装插件、跑长任务都是家常便饭，风险也随之而来：

- 😱 **改崩了** —— `cordis.patch.yml` 写错、插件冲突，DSH 启动失败白屏
- 😱 **会话丢了** —— sessions 目录误删/损坏，几天的对话留档没了
- 😱 **反复改反复崩** —— 不知道回退到哪一步才是好的，只能凭记忆重做
- 😱 **单机无备份** —— 机器坏了/重装，全部配置与工作留档烟消云散

**dsh-git-rescue 的思路：一切历史都是 git 历史。** 版本管理交给 git，救援恢复就是回退，
远端备份交给 GitHub（token/SSH）。与现有的 zip 快照方案（dsh-snapshot-guardian）互补：

### 方案 · 手段 · 特点 · 适用
- **方案**: dsh-snapshot-guardian · **手段**: zip 全量快照 + 解压恢复 · **特点**: 零依赖、快照间无关联、恢复 = 解压 · **适用**: 启动失败/网页崩了的手动兜底
- **方案**: **dsh-git-rescue（本插件）** · **手段**: git 增量历史 + commit 回退 · **特点**: 可 diff、可溯源、自动触发、可远端备份 · **适用**: 日常版本管理 + 崩溃自动恢复

## 🧭 设计原理

### 原理一：版本管理 = `.dsh` git 仓库 + 自动 commit

### 管理对象 · 路径 · 说明
- **管理对象**: 用户目录 · **路径**: `.dsh/`（`settings.yaml`、`profiles/`、`sessions/`、`storages/`、`skills/`） · **说明**: DSH 全部可编辑状态（**2.0.0 单仓库，workspace 不再纳入**）

**触发时机**（任一命中即 commit）：
- 🚀 启动时（恢复现场，记录"上次结束时长什么样"）
- 💥 崩溃检测到时（先记坏状态，再谈回退）
- ⏱️ 定时（默认每 30 分钟，可配置）
- 👆 手动（设置页一键备份）

**commit 规范**：`chore(guard): <触发原因> | <自检摘要>`，例如
`chore(guard): crash-detected | pre-rollback snapshot of broken state` —— 每个 commit 都能回溯"当时发生了什么"。

**入库边界**（安全第一）：
- ❌ 凭据永不入库：`.credentials.yaml`、`.env`、`.anonymous-user-id`、`git-rescue/`（token/heartbeat/events）
- ❌ 大文件不入库：`node_modules/`、`profiles/*/node_modules/`
- ⚠️ sessions/storages 为 zstd 压缩二进制 → **定期全量基线 + 常规增量排除**（默认每天一次基线）
- ✅ `.gitignore` 规则由插件首次初始化时自动生成并提交

### 原理二：救援恢复 = 专项工具 → git 回退 → 纯净协助（三层兜底）

```
崩溃检测 → ① 故障分类（系统/引导/插件/数据）
        → ② 专项恢复工具（⑤，简单修复优先，修复后探活）
        → ③ 不能修复 → git 回退（⑥）
        → ④ 保留坏现场 commit → 坏点标记 → reset 到最后一个好提交
        → ⑤ 重启 DSH → 健康自检
        → ⑥ 仍失败 → 唤起纯净环境（⑦，纯净 dsh 加载 skills 协助）
```

- **坏点标记**：回退过的 commit 打 `bad` 标记，防止"回退后又回到同一个坏点"的死循环
- **回退动作可逆**：回退前有全量副本，误回退也能再恢复

### 原理三：远端备份 = GitHub + token / SSH key 双方案

- 🔑 **认证双方案**（任一可用）：
  1. **SSH key 优先**（`~/.ssh/id_*`）：本地 git remote + push，走 git 原生 SSH 传输
  2. **GitHub token 兜底**：REST API 快照推送（`git-remote-https` 缺失环境仍可用）
- 🔒 **token 只存本地**，权限 `600`，绝不写入任何 commit；仅用于 push 认证
- ⚠️ **环境自检**：初始化时检测系统 git 是否可用。已知坑：本机 git 缺少 `git-remote-https` 助手，HTTPS git 操作直接失败 —— 插件检测到该情况时**自动降级为 GitHub REST API 直连**
- ☁️ **远端仓库名**：`.dsh@<dsh版本>.<设备ID>`（如 `.dsh@0.1.0-rc.6.87566bf2a1c8`），**每台设备一个备份仓**；GitHub 不允许 `.` 开头时自动降级 `dsh-at-...`
- 🪪 **设备身份 = 设备稳定指纹，不是主机名**：默认基于 `/etc/machine-id`（Linux 系统级唯一 ID，兜底为持久化 UUID）；dsh 版本由守护进程读取主实例 `@deepseek-ai/dsh` 包版本

### 原理四：崩溃检测与自动回退

### 检测手段 · 判定 · 说明
- **检测手段**: 进程探活 · **判定**: dsh web 进程消失 · **说明**: guardian 独立进程周期探活（每 10s）
- **检测手段**: 心跳文件 · **判定**: 心跳超时（默认 60s） · **说明**: DSH 内插件定期写心跳，guardian 读
- **检测手段**: 启动自检 · **判定**: 端口未监听 / 白屏 / 插件未加载 · **说明**: 重启后健康检查不通过 = 判定为坏状态

检测到崩溃 → 走原理二的三层兜底流程 → 回退后自动拉起 DSH → 自检通过则通知恢复完成。

## 🔄 工作流程总览

```
┌─────────────┐   ┌──────────────────────────┐   ┌─────────────────┐
│  DSH 启动    │──▶│ ① 检测运行机器有无 git     │──▶│ ② 检查插件配置   │
└─────────────┘   │    (git --version)        │   │    (token/SSH)  │
                  └──────────────────────────┘   └────────┬────────┘
                                                          ▼
                  ┌─────────────────────────────────────────────┐
                  │ ③ 初始化 .dsh git 仓库 + .gitignore + 首 commit │
                  └─────────────────────────────────────────────┘
                                                          │
                  ┌───────────────┐   每 30min / 事件触发    ▼
                  │ ④ 自动 commit  ◀───────────────────── 版本快照
                  └───────┬───────┘
                          │
                  ┌───────▼───────┐   push (token/SSH)   ┌──────────────────┐
                  │ ⑤ 远端备份     │────────────────────▶│ GitHub 私有库      │
                  └───────┬───────┘   .dsh@<版本>.<设备ID>│ .dsh@...          │
                          │                              └──────────────────┘
                  ┌───────▼───────┐
                  │ ⑥ 崩溃监控     │──崩溃?──▶ ⑦ 故障分类 → ⑧ 专项工具
                  └───────────────┘        → ⑨ git 回退 → ⑩ 拉起自检
                                           → ⑪ 失败? → ⑫ 唤起纯净环境协助
```

## 📦 组件规划

### 组件一：dsh-git-rescue 插件（DSH 进程内，2.0.0 单组件根级结构）

```
dsh-git-rescue/
├── package.json              # 2.0.0
├── cordis.patch.yml          # 插件注册（bundle patch 自注册）
├── lib/
│   ├── index.js              # 插件入口（API + Agent 工具）
│   ├── git.js / github.js / device.js    # git 管理 + 远端备份 + 设备识别
│   ├── probe.js / flapping.js / process-capture.js / fault-classify.js
│   ├── rescue-env.js         # 救援环境（<版本>@Save-clean / @Save-test）
│   ├── save-lock.js          # 纯净环境防装插件锁定
│   ├── repair-tools.js       # 专项恢复工具（⑤，6 个工具）
│   ├── plugin-health.js      # 插件树健康体检（合并自旧版）
│   ├── session-link.js       # 会话恢复联动（合并自旧版）
│   ├── boot-startup.js       # 开机自启（③）
│   └── self-update.js        # 自动更新 + 大版本换代升级
├── guardian/
│   ├── server.js             # 独立守护进程（②-⑦ 全部）
│   ├── guardian-boot.sh      # 开机自启脚本
│   └── public/               # 控制台网页（含 token/SSH 配置面板）
├── skills/                   # 插件 skill 档案（含联动契约）
├── tools/
│   └── dir-tree.mjs          # 独立目录结构查看工具（零依赖、全平台兼容 Node.js）
├── docs/
│   ├── harness-startup-failure-log.md   # ⭐ 启动失败原因/解决方案（按类型）
│   └── screenshots/architecture.svg     # 体系架构图
└── test-git-rescue.mjs       # 单测
```

**Agent 工具**：`git_rescue_status` / `git_rescue_init` / `git_rescue_backup` / `git_rescue_log` / `git_rescue_rollback` / `git_rescue_push` / `git_rescue_restart` / `git_rescue_repair` / `git_rescue_rescue_env` / `git_rescue_boot_autostart` / `git_rescue_link_recovery` / `git_rescue_restorepoints` / `git_rescue_restorepoint_build` / `git_rescue_restorepoint_restore`

### 组件二：guardian 独立进程

- **为什么独立？** 网页崩了恢复按钮就没了 —— 监控与回退必须活在 DSH 之外
- 周期探活 + 崩溃自动救援（专项工具 → git 回退 → 拉起）+ 纯净环境唤起
- **OOM 防护**：拉起 DSH 时带 `NODE_OPTIONS=--max-old-space-size=4096`（2026-08-20 教训）
- **peak-resume**：救援成功后自动恢复高峰暂停的自动续跑（**受自动续跑全局闸门约束**：闸门 closed 时不恢复，等用户手动对话后放行）
- **自动续跑闸门**：DSH 恢复健康时置 `autoContinueGate=closed`（防批量建空壳），用户手动开启或第一次手动对话后放行（联动 dsh-session-manager，见「联动与源码地址」）
- **插件树体检**：git 回退后、拉起前自动修复带病插件（合并自旧版）
- 网页（默认 3082）：状态 / 手动控制 / **🔑 远端认证配置（token/SSH）** / git 历史 / 日志

### 组件三：手动兜底（零依赖）

- 什么都不装也能用：`cd ~/.dsh && git log --oneline`、`git reset --hard <commit>`
- 崩溃到连 guardian 都起不来时，命令行 git 就是最后一张网

## 🔒 安全边界

### 条目 · 约定
- **条目**: token 存储 · **约定**: 本地文件 600 权限（data/sensitive/），仅 push 用，绝不提交
- **条目**: 远端仓库 · **约定**: 只含版本历史与快照，不含任何凭据明文
- **条目**: 回退安全 · **约定**: 回退前全量副本 + 坏点标记 + 最大回退步数
- **条目**: 大文件 · **约定**: 一律 gitignore，仓库只保留文本/配置/小体积留档
- **条目**: 纯净环境保护 · **约定**: