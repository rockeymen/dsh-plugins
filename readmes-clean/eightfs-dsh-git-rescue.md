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
- **条目**: 纯净环境保护 · **约定**: Save-clean 环境拒绝插件注册（防救援基线被破坏）
- **条目**: sudo-key · **约定**: 完全可选，绝不明文显示/存储；不填不影响核心功能
- **条目**: 大版本升级 · **约定**: 卸载旧版→安装新版（带备份回滚），不直接覆盖

## 📚 设计理念

1. **历史即资产**：凡是 DSH 可编辑的状态都进 git，丢了的都能找回来
2. **回退是最终手段，也是自动手段**：手动可回、守护可回、崩溃自动回
3. **token/SSH 双方案、环境自检**：环境不对劲时自动降级，不把鸡蛋放一个篮子里
4. **三层网互不依赖**：专项工具（简单修复）→ git 还原（⑥）→ 纯净 dsh（⑦），每层独立可救
5. **功能完备性**：一项功能不只能靠 skill 或只靠代码——缺哪补哪（skill-code-parity）

## 🧪 测试结果（2026-08-20，测试实例 3083 实测）

- [x] 插件加载：version=2.0.0、backupRepo=.dsh@0.1.0-rc.6.87566bf2a1c8、心跳正常
- [x] .dsh 仓库 init：git init + .gitignore + 基线 commit
- [x] 破坏测试 5/5：篡改配置 / 删文件 / 连环破坏 / kill -9 / 灭门级（cordis.patch.yml 致崩）
- [x] guardian 自动救援 e2e：破坏致无法启动 → 专项工具/git 回退 → 拉起 → 自检通过
- [x] 坏点标记：回退后再次崩溃不会回到同一 commit（bad-* tag 实测）
- [x] 专项工具：plugin_config/boot_symlink/ro_volume/plugin_load/permission/session_repair 诊断命中
- [x] 救援环境：Save-clean 防装插件锁定（拒绝他插件、救援插件放行）
- [x] 代码级修复：OOM 防护 / chown 权限 / import 冒烟（T10）/ corrupt session（session_repair）/ peak-resume
- [x] 自更新：majorUpgrade 大版本换代判定（结构不同=大版本+1，旧结构不自动更新）

## 🧪 测试体系：不测"正常"，专测"搞破坏"

> 救援工具的信任来自反面测试。我们不信"应该没问题"，而是**故意把它弄坏，再让它自己爬起来**——
> 这是本项目的核心测试哲学，也是它敢自称"救援"的底气。

### 破坏矩阵（5 类真实破坏，全部实测通过 ✅）

### # · 破坏手段 · 破坏对象 · 验证的救援能力 · 结果
- **#**: 1 · **破坏手段**: 篡改配置 · **破坏对象**: `settings.yaml` 写入垃圾 · **验证的救援能力**: git 回退恢复原状 · **结果**: ✅
- **#**: 2 · **破坏手段**: 删除文件 · **破坏对象**: 删除被跟踪的 `.gitignore` · **验证的救援能力**: 回退找回文件 · **结果**: ✅
- **#**: 3 · **破坏手段**: 连环破坏 · **破坏对象**: 恢复后**再次**破坏 · **验证的救援能力**: bad 标记防回退死循环 · **结果**: ✅
- **#**: 4 · **破坏手段**: 进程秒杀 · **破坏对象**: `kill -9` dsh web · **验证的救援能力**: guardian 心跳检出 + 自动拉起 · **结果**: ✅
- **#**: 5 · **破坏手段**: 灭门级 · **破坏对象**: `cordis.patch.yml` 引用缺失插件致无法启动 · **验证的救援能力**: 事故识别 + 专项工具/git 回退 + 拉起 + 自检 · **结果**: ✅

### 灭门级测试的完整时间线（真实日志节选）

```
10:21:44  健康检查失败（连续 1/3）
10:21:54  健康检查失败（连续 2/3）
10:22:04  健康检查失败（连续 3/3）→ 触发自动救援
10:22:04  坏点标记: bad-c6a588b            ← 坏提交被标记，防再次踩坑
10:22:04  已回退到 bd6824c（from c6a588b） ← git reset --hard 秒级完成
10:22:04  启动 DSH: <自动拉起命令>
10:22:09  ✅ 救援成功：回退后 DSH 恢复正常  ← 5 秒内满血复活
```

**为什么值得"吹"**：
- **留证**：每次破坏都会留下一个可事后分析的坏提交（pre-rollback snapshot）——不只救回来，还保留完整现场供复盘
- **防死循环**：坏点标记（`bad-*` tag）保证"回退后再次崩溃不会回到同一个坏点"
- **可复现**：整套破坏流程跑在一次性测试实例上，任何人想验证都能安全重放，不碰生产数据

### 独立测试环境：测试随便崩，生产不动摇

```
┌─ 主实例（生产/会话）────────────────────────┐
│  dsh web  127.0.0.1:3081   DSH_HOME=~/.dsh  │
└──────────────────────────────────────────────┘
┌─ 测试实例（插件热开发，随便崩）───────────────┐
│  DSH_HOME=workspace/dsh-test-home（完全隔离）│
│  └ 反代 0.0.0.0:3084（局域网访问）           │
└──────────────────────────────────────────────┘
```

## 🌐 平台能力（2.0.0，代码实证判断）

### 能力 · Linux · Windows · macOS
- **能力**: git 管理 / 远端备份 / 自动更新 · **Linux**: ✅ · **Windows**: ✅ · **macOS**: ✅
- **能力**: 心跳 / 探活 / 现场捕获（stderr） · **Linux**: ✅ · **Windows**: ✅ · **macOS**: ✅
- **能力**: 专项工具（plugin_config/boot_symlink/plugin_load/session_repair） · **Linux**: ✅ · **Windows**: ✅ · **macOS**: ✅
- **能力**: 设备识别（machine-id） · **Linux**: ✅ · **Windows**: ⚠️ UUID 兜底 · **macOS**: ⚠️ UUID 兜底
- **能力**: guardian 守护（进程/端口/拉起） · **Linux**: ✅ · **Windows**: ⚠️ · **macOS**: ⚠️
- **能力**: 系统修复（ro_volume/permission） · **Linux**: ✅ · **Windows**: ❌ · **macOS**: ⚠️
- **能力**: 救援环境启动（setsid/bash） · **Linux**: ✅ · **Windows**: ❌ · **macOS**: ⚠️
- **能力**: 开机自启（rc.local） · **Linux**: ✅ · **Windows**: ❌ · **macOS**: ⚠️

> 完整判断见 `dsh-git-rescue-平台能力判断-20260820.md`。核心救援（git 回退/专项工具/探活）三平台可用；
> 系统级救援（守护/自启/救援环境/权限修复）Linux 完整、Windows 缺失、macOS 部分——非 Linux 均 try-catch 降级不崩溃。

## 📖 设计溯源：从 zip 快照方案学到的原理

> 原独立仓库 `dsh-snapshot-archive` / `dsh-guardian` / `dsh-snapshot-guardian` 已合并入本仓库并从 GitHub 删除。
> 以下是从中提取、迁移到 git 方案的原理要点——**原仓库已不在，这份记录就是永久提醒**，后续开发照此执行。

### 核心思想（三仓库共通）

1. **恢复 = 最朴素的操作**：zip 版恢复 = 解压覆盖；git 版 = `git reset --hard`；网页全崩，命令行也能救
2. **监控不能依赖被监控对象**：guardian 独立进程 + 独立端口，DSH 崩了它照样活着
3. **三层安全网互不依赖**：插件(网页活) → guardian(进程活) → 手动(文件/命令在)，故障域最小化
4. **敏感隔离**：凭据脱敏 / 独立文件 600 权限，绝不进备份
5. **双入口**：设置页按钮 + Agent 工具
6. **回退前保留现场**：先快照/commit 坏状态，再谈回退
7. **连续失败阈值**：连续 N 次失败才触发回退，防单次误判
8. **回退后自证健康**：重启 + 健康检查通过才算恢复成功
9. **撤销即恢复**：不搞撤销栈，从历史选一个点恢复
10. **零依赖可移植**：git 命令 spawn 封装

### 迁移对照（zip 方案 → git 方案）

### 原 zip 方案 · git 方案（本仓库）
- **原 zip 方案**: zip 全量快照（.dsh 原始路径） · **git 方案（本仓库）**: git 增量历史（add -A 自动 commit）
- **原 zip 方案**: 恢复 = unzip 覆盖 · **git 方案（本仓库）**: 恢复 = git reset --hard
- **原 zip 方案**: 敏感文件脱敏 `***REDACTED***` · **git 方案（本仓库）**: token 单独文件 600 + .gitignore 排除
- **原 zip 方案**: guardian 探活 + failThreshold=3 · **git 方案（本仓库）**: 照搬（GUARDIAN_FAIL_THRESHOLD）
- **原 zip 方案**: 回退前 autoSnapshot · **git 方案（本仓库）**: pre-rollback commit 坏现场
- **原 zip 方案**: 重启 + 健康检查自证 · **git 方案（本仓库）**: 照搬（startWaitMs + probe）
- **原 zip 方案**: 手动 unzip 兜底 · **git 方案（本仓库）**: 命令行 git 兜底 + **profile 还原点 zip（v2.5.0）**：提交 git 时自动打包，手动 `unzip -o` 覆盖恢复
- **原 zip 方案**: 快照自带三平台恢复脚本 · **git 方案（本仓库）**: 不需要（git 本身跨平台）

### 增强（git 方案新增，原方案没有）

- **bad 标记**：回退过的提交打 `bad-*` tag，防"回退后又回到同一坏点"死循环
- **心跳文件 + 启动自检**：区分"进程挂了"与"启动即崩"，崩溃检出更细
- **GitHub token/SSH 远端备份 + REST API 降级**：绕开 `git-remote-https` 缺失的环境坑
- **sessions 入库策略**：zstd 二进制直接入库，靠 .gitignore 排除大文件/凭据控体积

## ✅ 三合一合并（历史，已完成）

**结果**：三个原独立仓库（`dsh-snapshot-archive` / `dsh-guardian` / `dsh-snapshot-guardian`）已并入本仓库并从 GitHub 删除。

### 合并来源 · 归入位置 · 状态
- **合并来源**: zip 快照归档 · **归入位置**: `components/snapshot-archive/`（组件 A） · **状态**: ✅ 已合并
- **合并来源**: 守护进程 · **归入位置**: `components/guardian/`（组件 B） · **状态**: ✅ 已合并
- **合并来源**: git 版本管理+救援 · **归入位置**: `components/git-rescue/`（组件 C） · **状态**: ✅ v1.2.0 已开发完成

## ✅ 2.0.0 重构合并（2026-08-20，当前）

**以 2.0.0 重构版为基底**，合并旧版救援功能（守护进程为重点）：

### 合并项 · 状态
- **合并项**: plugin-health（插件树健康体检） · **状态**: ✅ 已合并（lib/plugin-health.js + guardian/index 接入）
- **合并项**: session-link（会话恢复联动） · **状态**: ✅ 已合并（lib/session-link.js + 契约 skill.session-manager.md）
- **合并项**: **自动续跑全局闸门**（guardian ⇄ session-manager 联动） · **状态**: ✅ 已实现（2026-08-20）：guardian 恢复健康置 closed，用户手动对话自动 open；session-manager 侧 `autoContinueGate` 字段 + `auto-continue-gate` API；详见「联动与源码地址」
- **合并项**: 接管式重启 · **状态**: ✅ 保留（takeoverRestart）
- **合并项**: 自动更新（大版本卸载重装） · **状态**: ✅ 2.0.0 起具备 + majorUpgrade
- **合并项**: **Windows 平台守护进程适配** · **状态**: ✅ 已实现（2026-08-20）：findDshPid 用 PowerShell Get-CimInstance、findProxyPid 用 netstat -ano、stopDsh 用 taskkill、启动路径 win32 分支；启动用 CMD（见 windows-process-cmd-start skill）
- **合并项**: **guardian 开启 SSH 功能** · **状态**: ✅ 已实现（2026-08-20）：`POST /api/ssh/enable` + `lib/ssh-enable.js`——Windows 自动装 OpenSSH Server + 启 sshd 服务 + 防火墙放行 22（幂等，非 Windows 返回 noop）；免手动跑脚本
- **合并项**: **管理员密码提权** · **状态**: ✅ 已实现（2026-08-20）：guardian 网页「管理员密码」面板 → 存 `data/sensitive/admin-password`（600、不进 git）→ `POST /api/ssh/enable` 自动用密码提权（Start-Process -Verb RunAs 语义，免 UAC 弹窗）；`GET/POST /api/admin-password`（设置/状态/清除）
- **合并项**: **web 多选备份（会话/skill 定向备份）** · **状态**: ✅ 已实现（2026-08-20）：guardian 网页用 `tools/dir-tree.mjs` 生成目录树供多选（目录级）→ 勾选存 `backup-select.json`（可复用）→ **git 本地按勾选写 .gitignore**（反向白名单 `*`+`!` 逐级放行）→ **git 远端按勾选推送**（`git add -f` 选中 → commit → push 备份仓）；实测会话A推/会话B排除 ✅
- **合并项**: **插件安装门禁（测试闸门代码化）** · **状态**: ✅ 已实现（2026-08-20）：① 检测插件安装（扫描 cordis.patch.yml vs registry）② 复制新插件 skills/ 到 `.dsh/skills/` ③ `git-rescue/plugin-registry.json` 记录测试状态 ④ **未测试插件阻止主环境重启**（`/api/start` 返回 403 强行接管）⑤ 测试通过更新 registry 放行；存量插件默认放行（不误拦）；`/api/plugin-gate`（状态）+ `/api/plugin-gate/scan` + `/api/plugin-gate/pass`
- **合并项**: **web 快照面板（git 快照）** · **状态**: ⏳ 待办（2026-08-20 EIGHTfs 提出，源自旧版「创建快照」入口）：新版 web 加「快照」面板——**手动创建快照 = git commit**（`chore(snapshot): manual`）、**快照列表 = git 提交历史**、**恢复 = git 回退**；不引入 zip 插件，与新版 git 体系一致
- **合并项**: **旧版 unzip 覆盖方案重构** · **状态**: ✅ 已实现（2026-08-21，v2.5.0）：profile 变化提交 git 时自动打包 zip 还原点（原始相对路径、根 = .dsh，手动 unzip 覆盖即恢复），文件名后缀标注触发插件；`/api/git-rescue/restore-points*`（列表/打包/恢复/删除）+ 工具 `git_rescue_restorepoints` / `git_rescue_restorepoint_build` / `git_rescue_restorepoint_restore`；与 git 主通道互补（git 回退 + zip 手动兜底双保险）

## 📜 版本记录（旧版谱系 1.x，保留自 v1.13.0 README）

> X.Y.Z 语义（2026-08-21 更清晰定义）：X=大版本（主功能版本，1 开头，目录结构不兼容=X+1）；Y=提交序号（从 0 开始提交 README，之后每提交一次 +1）；Z=新增子功能数量（全新子功能+子功能修复/更新都计入）。子功能版本线：0 开头=目录结构不兼容，功能缺失导致救援失败 +1；1 开头=结构兼容，新增几种功能 +几。旧版为 components/git-rescue 单组件结构；2.0.0 起为根级单组件结构。

### 版本 · 说明
- **版本**: 1.13.0 · **说明**: 功能13：3080 代理守护（guardian 探测 proxy 进程缺失自动拉起，GUARDIAN_PROXY_ENABLED=0 可关）+ 联动契约 skill（linkage/rescue-env-write/skill.git-push）
- **版本**: 1.12.0 · **说明**: 功能12：救援前插件自更新（guardian recover 开始前先 checkForUpdate，有新版则 applyUpdate 换新磁盘代码再救援——救援逻辑本身保持最新，避免旧版带病救人；测试环境同样允许，自更新≠自动救援；GUARDIAN_SELF_UPDATE=0 可关；任何失败不阻断救援 fail-soft；status 暴露 selfUpdate 开关）
- **版本**: 1.11.0 · **说明**: 功能11：测试环境不自动救援（guardian 探测 DSH_HOME 为 dsh-test-* 即禁用自动 git 回退/拉起，插件崩溃由开发者自行解决，现场保留 + 冷却）+ 活跃对话保护（救援前检测 running\ · \ · continueRunning，存在则落盘 restart-request.json 提交重启申请，不打断对话）+ 手动救援前记录近期变动文件（pre-restart-changes-*.json，默认 10 分钟窗口，防回退丢开发者刚写的文件）
- **版本**: 1.10.0 · **说明**: 功能10：测试环境路径判定（status.self.isTest，DSH_HOME 含 dsh-test-*）+ 沙盒环境能力检测（lib/sandbox.js：NoNewPrivs/CapEff/sudo 可行性/只读挂载，status 暴露 sandbox 字段）
- **版本**: 1.9.0 · **说明**: 功能9：测试环境入口整合（原 dsh-test-env-entry：侧边栏面板 + /api/dsh-test-env/*）
- **版本**: 1.8.0 · **说明**: 功能8：可选 sudo-key（插件配置，绝不明文显示/存储）——系统故障时 guardian 自动 remount rw 修复；无 root 环境不配置则保持"告警人工"
- **