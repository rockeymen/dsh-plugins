# dsh-plugin-dev

  DeepSeek Harness 插件开发中踩过的坑与验证过的做法。
  记录自 DSH 公测期间（dsh-external 组织）的插件开发实践：vendor cordis 双副本、tsconfig 三件套、Windows junction、多帧 zstd API……每个坑都有发生时的现象、确认的根因与最终修法。公测结束后相关仓库已迁移至 [omdsh-dev](https://github.com/omdsh-dev) 组织并公开。

  ![MIT](https://badgen.net/badge/license/MIT/blue)

## 这是什么

一份**经验档案**（skill + 文档）：记录插件开发流程、踩过的坑、验证过能用的做法。

## 怎么用

1. 把 `skills/dsh-plugin-dev` 放进 skills 目录（或在 agent 会话中引用）；
2. 从 [SKILL.md](skills/dsh-plugin-dev/SKILL.md) 的流程与踩坑速查表入手；
3. 构建前看 [references/build-pitfalls.md](skills/dsh-plugin-dev/references/build-pitfalls.md)——第一条就是 cordis 双副本。

## 档案地图

### 文档 · 记录内容
- **文档**: [SKILL.md](skills/dsh-plugin-dev/SKILL.md) · **记录内容**: 开发流程 + 踩坑速查表 + 交付前验证闭环
- **文档**: [overview.md](skills/dsh-plugin-dev/references/overview.md) · **记录内容**: 形态选择（bundle）+ 扫描过的生态地图
- **文档**: [tool-plugin.md](skills/dsh-plugin-dev/references/tool-plugin.md) · **记录内容**: defineTool 契约、参数 schema、输出模式
- **文档**: [build-pitfalls.md](skills/dsh-plugin-dev/references/build-pitfalls.md) · **记录内容**: 踩坑全集（cordis 双副本 / tsconfig / junction / 多帧 API）
- **文档**: [bundle-patch.md](skills/dsh-plugin-dev/references/bundle-patch.md) · **记录内容**: profile/bundle 机制、`dsh plugin add`、`dsh run` 验证
- **文档**: [testing.md](skills/dsh-plugin-dev/references/testing.md) · **记录内容**: 契约测试 / 逻辑测试 / 差分测试模式
- **文档**: [publish.md](skills/dsh-plugin-dev/references/publish.md) · **记录内容**: description、topic、hub 收录、collection 打包

## 环境基线

> 排查/复现问题、评估"坑是否还适用"时，先对照本表确认环境一致；报告问题时附上 `dsh --version` 与 `readlink ~/.dsh/source/current` 输出。

### 运行时与工具版本

### 项 · 版本/值 · 说明
- **项**: OS · **版本/值**: Windows 11 Pro（build 26200），git-bash（MSYS2 3.5.7） · **说明**: 本文档的 Windows 特例均在此环境实测
- **项**: Node · **版本/值**: **v24.18.1**（`~/node24` 便携版） · **说明**: dsh wrapper 优先使用；系统 node 22.15 不可用
- **项**: dsh（npm） · **版本/值**: **npm @deepseek-ai/dsh@0.1.0-rc.6（lib 生产模式）** · **说明**: 通过 `npx -p @deepseek-ai/dsh@0.1.0-rc.6 dsh web` 启动（lib 生产模式；勿 `install -g` 全局安装）
- **项**: TypeScript / Vitest · **版本/值**: **各仓库 devDependencies 自包含（typescript/vitest/@types/node + lockfile）** · **说明**: 独立 checkout 可 `npm install` → `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **项**: pnpm · **版本/值**: **11.18.0** · **说明**: `dsh plugin` 内部转发用（profile 目录内）
- **项**: gh CLI · **版本/值**: **2.97.0**（2026-07-31），账号 whiteicey，scopes `gist, read:org, repo` · **说明**: API 操作与仓库创建/可见性管理
- **项**: @types/node · **版本/值**: `.pnpm` 下 22.20.0 / 25.9.3 / 26.1.2 并存，**构建用 22.20.0** · **说明**: junction 直达 `.pnpm/@types+node@22.20.0/node_modules/@types/node`

### 关键路径

### 路径 · 内容
- **路径**: `~/.dsh`（`$DSH_HOME`） · **内容**: profiles / sessions / source / settings.yaml / web.log
- **路径**: `~/.dsh/source/current` · **内容**: → DSH 0.1.0-rc.6（npm）—— 快照 junction 时代产物（npm 模式下不存在）
- **路径**: `<monorepo>/vendor/cordis` · **内容**: **构建期 cordis 唯一合法解析源**（坑 1）
- **路径**: `<monorepo>/packages/core/tools` · **内容**: `@deepseek-ai/dsh-tools`（defineTool/工具管道）
- **路径**: `<monorepo>/node_modules/.pnpm/@types+node@22.20.0/...` · **内容**: @types/node 真实路径（坑 3）
- **路径**: `~/.dsh/profiles/{web,headless}` · **内容**: profile 目录（`dsh.profile.bundles` + cordis.yml + patch 层）
- **路径**: `~/.dsh/sessions/<cwd 编码>/<session-id>/session.jsonl.zstd` · **内容**: 多帧 zstd 会话文件（坑 6）
- **路径**: `~/node24`、`~/.local/bin/dsh` · **内容**: 便携 Node、dsh 启动 wrapper

### 环境变量与启动方式

### 变量 · 值 · 说明
- **变量**: `DSH_PERMISSION_MODE` · **值**: `danger-full-access` · **说明**: **⚠️ 高风险模式（审查 PD-04）**：Windows 无沙箱后端（bwrap/Landlock/Seatbelt），仅此模式可启动，且**禁用审批提示**——只应在可信的本地开发机临时使用；**不要**写进项目模板、CI 或共享机器，也不要复制为常规建议
- **变量**: `DSH_TELEMETRY_DISABLED` · **值**: `1` · **说明**: 用户选择关闭遥测
- **变量**: `DSH_HOME` · **值**: `C:\Users\admin\.dsh` · **说明**: 未显式设置时默认 `~/.dsh`
- **变量**: `DSH_*` 特殊变量 · **值**: 一律由启动环境（wrapper/export）传入 · **说明**: 放 `~/.dsh/.env` 会启动报错（坑 7）

启动：`npx -p @deepseek-ai/dsh@0.1.0-rc.6 dsh web`（npm 0.1.0-rc.6，lib 生产模式；勿 `install -g` 全局安装）。旧快照方式的 wrapper 已弃用：`~/.local/bin/dsh`（不要直接跑 `bin/dsh`——Windows 下 MSYS 路径转换触发 `ERR_UNSUPPORTED_ESM_URL_SCHEME`，issue #388；wrapper 用 `file://` URL 启动 tsx 规避）。

### 平台行为差异（与"标准做法"文档对照）

### 行为 · 本机实测
- **行为**: junction 创建 · **本机实测**: `ln -s` 与 `cmd mklink /J` 均失败，**PowerShell `New-Item -ItemType Junction` 可用**（坑 1b）
- **行为**: 仓库可见性 · **本机实测**: **公测期间 dsh-external 默认全 private**；2026-08-13 公测结束后，本档案涉及的 15 个仓库已迁移至 [omdsh-dev](https://github.com/omdsh-dev) 组织并公开
- **行为**: headless 一次性任务 · **本机实测**: 0807 有 #376（无输出/退出码 1）；**0808 起用 `dsh run "task"`**，已修复
- **行为**: Web GUI · **本机实测**: `dsh web` 监听 `127.0.0.1:3080`；插件安装后需重启 GUI 才加载新工具

### 自查命令速查

```sh
dsh --version && readlink ~/.dsh/source/current     # 快照
node -v                                              # Node
gh --version && gh auth status                       # gh 与认证
node <mono>/node_modules/typescript/bin/tsc --version  # TS（<mono> 换成 current 真实路径）
node <mono>/node_modules/vitest/vitest.mjs --version   # Vitest
```

## 维护

- 坑清单随 dsh 快照演化持续补充（如 0808 的 `dsh run`、凭据迁移、200ms 批量持久化）；
- 新的坑记录后会追加（含非 Windows 平台的经验，如有）。

### 构建依赖分层（审查 PD-05）

### 层级 · 方式 · 适用
- **层级**: 首选（当前方式） · **方式**: 各仓库 devDependencies 自包含（typescript/vitest/@types/node + lockfile），独立 checkout 可 `npm install` → `npm run typecheck` → `npm test` → `npm run build` → `npm pack` · **适用**: 可复现构建/CI
- **层级**: 旧场景（out-of-tree） · **方式**: `DSH_MONOREPO` 指向 current snapshot，用 monorepo 的 tsc/vitest · **适用**: 快照时代的本机插件开发（历史记录）
- **层级**: 环境 fallback · **方式**: `.pnpm/@types+node@*` 内部路径（**版本会变**，用 `ls .pnpm/@types+node@* \ · **适用**: sort -V \ · tail -1` 自动发现） · 仅当前机器