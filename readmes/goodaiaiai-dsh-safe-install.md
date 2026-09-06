# dsh-safe-install

> **DSH 插件安全安装全流程自动化**:四重安全检查 → 自动安装 → 自动重启。
> Safe, one-shot installation of DeepSeek Harness plugins: verify → install → restart.

> 🌐 **English docs**: [README.en.md](./README.en.md)

![version](https://img.shields.io/badge/version-0.1.0-blue) ![license](https://img.shields.io/badge/license-MIT-green) ![dsh](https://img.shields.io/badge/DSH-0.1.0--rc.8-orange) ![tests](https://img.shields.io/badge/tests-33%20unit%20%2B%204%20integration%20passing-brightgreen)

装插件有风险(dsh-mask 重复加载器崩溃、工具名冲突、版本不匹配),且装完要手动重启 DSH。本插件把「装插件」变成一句话:
**安检通过 → 打快照 → 安装 → 自动重启 → 新插件生效**,全程无需手动操作。

---

## 功能特性 (Features)

- 🔍 **四重安全检查**(安装前):版本兼容 / patch 冲突 / 工具名冲突 / 供应链
- ⛔ **阻断机制**:任一检查为 `block` 即拒绝安装并说明原因;`warn` 不阻断但提示风险
- 📸 **安装前自动打快照**(集成 dsh-undo-savepoint,可随时回退)
- 🔄 **安装后自动重启 DSH**(Node detached spawn,原进程释放端口后自动拉起)
- 📋 **状态追踪**:最近检查/安装/重启记录,重启后仍可查询
- 👁 **变更检测**:轮询 profile `package.json` bundles,感知外部安装/卸载

## 工作流程 (Flow)

```
用户说"装 XX 插件"
  │
  ├─ ① 四重安全检查
  │     ├─ 版本兼容   peer 要求的 @deepseek-ai/* (minor,patch,rc) ≤ 当前 DSH
  │     ├─ patch 冲突  cordis.patch.yml insert id 不与核心/已装插件重复
  │     ├─ 工具名冲突  注册工具名不与已装插件/内置工具重复
  │     └─ 供应链     npm 已发布 + 维护活跃(<30天) + license 清晰
  │        └─ 有 block? → 拒绝安装,返回报告
  │
  ├─ ② 打快照(undo CLI,失败不阻断)
  ├─ ③ dsh plugin --profile web add <pkg>
  │     └─ 失败 → 返回错误
  ├─ ④ 验证入列(读 profile package.json bundles)
  ├─ ⑤ 自动重启(restart=true 时)
  │     ├─ spawn 独立辅助进程(detached + unref)
  │     ├─ 原进程延迟退出(留时间 flush 工具结果)
  │     └─ 辅助进程等端口释放后拉起新 DSH
  └─ ⑥ 返回报告:检查结果 + 安装结果 + 重启状态
```

## 注册工具 (Tools)

| 工具名 | 功能 | 参数 |
|---|---|---|
| `safe_install_check` | 只做四重安全检查,返回通过/警告/阻断报告 | `{ pkg, source? }` |
| `safe_install` | 检查 → 通过则安装 → (可选)自动重启 | `{ pkg, source?, restart? }` |
| `safe_install_status` | 查询上次检查/安装/重启状态与历史 | `{}` |

- `pkg` — npm 包名,如 `dsh-startup-guard`
- `source` — GitHub 源(推荐,提供后 patch/工具名检查才完整),如 `github:lire1131/dsh-undo-savepoint#master`

## 四重安全检查 (Four Checks)

| # | 检查 | 数据源 | 判定 |
|---|---|---|---|
| ① | **版本兼容**:插件 `peerDependencies` 中 `@deepseek-ai/*` 的要求 `(minor, patch, rc)` 必须 ≤ 当前 DSH(本机 `0.1.0-rc.8`) | npm registry / GitHub raw `package.json` | 超则 **block** |
| ② | **patch 冲突**:`cordis.patch.yml` 的 insert id 不得与核心保留 id(`storage` / `storage-json` / `storage-domain` 等)或已装插件重复 —— 防 `duplicate loader entry id` 崩溃 | GitHub raw `cordis.patch.yml` + 本地扫描 | 重复则 **block** |
| ③ | **工具名冲突**:注册的工具名不得与已装插件/内置工具重复 —— 防工具名冲突崩溃 | GitHub raw `lib/index.js` + 本地扫描 | 冲突则 **block** |
| ④ | **供应链**:npm 有正式发布 + 维护活跃(`pushed_at` < 30 天) + license 清晰(MIT/Apache/BSD/ISC 等) | npm registry + GitHub API | 不满足则 **warn** |

> ⚠️ 未提供 `source` 时 ②③ 无法检查,返回 **warn**(不阻断)。**建议总是提供 GitHub 源**以获得完整检查。

## 架构 (Architecture)

```
dsh-safe-install/
├── package.json          # 插件声明(dsh.bundle.patch)
├── cordis.patch.yml      # 挂载条目(insert id: safe-install,唯一)
├── lib/
│   ├── index.js          # 入口:注册 3 工具 + 事件监听 + 轮询
│   ├── env.js            # 环境事实(profile 路径 / rc 探测 / 已知工具名清单)
│   ├── net.js            # 网络封装(Node https + TLS 绕过 + 自动重试)
│   ├── check.js          # 四重检查汇总(并行执行)
│   ├── checkVersion.js   # ① 版本兼容
│   ├── checkPatch.js     # ② patch 冲突
│   ├── checkTools.js     # ③ 工具名冲突
│   ├── checkSupply.js    # ④ 供应链
│   ├── install.js        # 安装执行(快照 + dsh plugin add + 验证入列)
│   ├── restart.js        # 自动重启(Node detached spawn)
│   ├── detect.js         # 轮询 profile package.json bundles
│   └── state.js          # 状态记录(内存 + 磁盘)
└── tests/
    ├── run-tests.mjs     # 离线单元测试(纯函数,无需网络)
    └── integration.mjs   # 真机集成测试(真实 npm/GitHub 数据)
```

## 快速开始 (Quick Start)

### 安装

```powershell
# 从 GitHub 安装
dsh plugin --profile web add github:goodaiaiai/dsh-safe-install#master

# 或本地源码安装
dsh plugin --profile web add <本目录路径>

# 安装后重启 DSH 生效(或让 AI 用 safe_install 装,它自己会重启)
```

### 在对话中使用

```
safe_install_check { pkg: "dsh-startup-guard" }                          # 只检查
safe_install { pkg: "dsh-better-sidebar", source: "github:omdsh-dev/DSH-better-sidebar" }  # 检查+安装(默认自动重启)
safe_install_status                                                       # 查状态
```

> ⚠️ `safe_install` 默认 `restart: true`,会重启 DSH 进程(响应返回后约 2.5s 退出,辅助进程 3s 后拉起新进程)。测试完整流程前确保有恢复手段。

## 开发与测试 (Development)

```powershell
# 单元测试(离线,无需网络):覆盖 rc 判定 / patch 提取 / 工具名 / license
node tests\run-tests.mjs

# 集成测试(需要网络):对真实插件执行四重检查,验证判定
node tests\integration.mjs
```

当前测试状态:
- 单元测试 **33/33 通过**(含 rc.6/rc.8/rc.9、跨 patch `0.1.1-rc.1`、跨 minor `0.2.0-rc.3`、storage 冲突 patch、undo_* 工具名冲突、license 判定)
- 集成测试 **4/4 通过**(dsh-startup-guard 放行 / 已装插件防重复安装阻断 / dsh-better-sidebar 0.16.1 版本兼容 / dsh-plugin-notify 放行)
- 安全用例:未知供应链包 → warn 不阻断

## 兼容性 (Compatibility)

| 项 | 值 |
|---|---|
| DSH | **0.1.0-rc.8**(peer 要求 ≤ 当前 rc;跨 minor/patch 系列会被拦截) |
| profile | `web`(GUI http://127.0.0.1:3080) |
| Node | ≥ 18(使用 `node:https`、`node:child_process`) |
| 依赖 | 仅 `@deepseek-ai/cordis`、`@deepseek-ai/dsh-tools`(peer) |

> 其他 rc 版本可通过环境变量 `DSH_VERSION` / `DSH_RC` 覆盖探测结果(调试用)。

## 已知限制 (Limitations)

- ②③ 检查依赖 GitHub 源;npm 包在未下载时无法读取其 patch/源码内容
- 工具名清单为内置快照 + 启动时扫描已装插件,新装插件后需重启刷新
- `dsh plugin add` 在 workspace-write 沙箱下可能 EPERM(临时文件权限),需 danger-full-access
- 版本检查覆盖 `(minor, patch, rc)` 三元组;核心模块缺失(如 `dsh-client-ui-slots`)属运行时依赖完整性,不在本插件检查范围(建议配合 dsh-startup-guard)

## 安全说明 (Security)

- 插件运行在你的 DSH 进程中,只安装通过四重检查的插件
- 安装前自动打快照,改错了随时可回退(dsh-undo-savepoint)
- Node 访问网络内置 `NODE_TLS_REJECT_UNAUTHORIZED=0`(本机 CA 链不完整);网络请求带重试(2 次)+ 20s 超时

## 贡献 (Contributing)

1. Fork 本仓库
2. 新增/修改后运行 `node tests\run-tests.mjs` 与 `node tests\integration.mjs`
3. 提交 PR,说明改动与测试结果

## License

[MIT](./LICENSE)
