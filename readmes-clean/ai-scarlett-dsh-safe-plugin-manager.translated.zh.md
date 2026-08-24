# DSH-Store｜DSH 第三方插件商城
![](https://github.com/user-attachments/assets/2b03ff48-a39b-427d-87c1-62190560a496)

DSH-Store 是一个运行在 DeepSeek Harness（DSH）设置页中的第三方
插件商城与安全生命周期管理器。它使用标准 DSH Bundle + Host Plugin + Client Bundle
结构，不开发独立桌面端，不修改 DSH 源码，也不替换任何 `@deepseek-ai/*` 官方包。

> **想把插件上架到 DSH-Store？** [提交一个公开 GitHub 项目地址](https://github.com/AI-Scarlett/dsh-safe-plugin-manager/issues/new?template=plugin-submission.yml) 即可。机器人会自动读取必要文件，不再要求手填整份 Catalog。开发或提交前，建议先用 [`build-dsh-plugin`](https://github.com/AI-Scarlett/build-dsh-plugin) 制作或执行只读商城预检。

[打开在线插件商城](https://dsh.store/) ·
[提交项目上架](https://github.com/AI-Scarlett/dsh-safe-plugin-manager/issues/new?template=plugin-submission.yml) ·
[使用 build-dsh-plugin](https://github.com/AI-Scarlett/build-dsh-plugin) ·
[查看机器目录](registry/catalog.json) ·
[目录准入规则](registry/README.md) ·
[安全说明](SECURITY.md)

## 安装插件商城

### 前置条件

- DeepSeek Harness `0.0.1-rc.5`、`0.1.0-rc.6`、`0.1.0-rc.7`、`0.1.0-rc.8` 或 `0.1.1-rc.1`，并且官方 `dsh` CLI 可用；
- Node.js `22.13.0` 或更高版本；
- 一个启用了 Web 客户端的目标 Profile。下面以 `web` 为例，如果你的 Profile 名称不同，
  请替换命令中的 `web`。

首次安装发生在本管理器尚未运行之前，因此还没有计划确认、自动备份、健康检查和失败
回滚保护。运行命令前，请先备份目标 Profile 的 `package.json`、`pnpm-lock.yaml`、
`pnpm-workspace.yaml` 和 `cordis.patch.yml`（文件存在时）。

### 使用固定 GitHub Commit 安装

通过 DSH 官方 CLI 安装经过目录固定的 GitHub Commit：

```bash
dsh plugin --profile web add 'git+https://github.com/AI-Scarlett/dsh-safe-plugin-manager.git#b63118fc20d315fb484f40a92e43c3ab59121904'
```

这条命令会修改目标 Profile 的依赖、锁文件、工作区文件、`node_modules` 和 Bundle 列表。
不要把 Commit 换成 `main` 等浮动分支，也不要绕过 DSH CLI 直接运行 pnpm 或手工编辑
Profile。命令失败时请保留完整错误和安装前备份，不要连续重复执行。

### 重启与验收

1. 运行 `dsh --profile web --dump-config`，确认配置可以成功合成；
2. 在商城中用独立计划安装随包提供的 DSH Guardian；它由 macOS launchd 在 DSH 进程外运行，
   不是另一个普通 DSH 插件。安装器会先验证新 Guardian 的独立心跳，再在 HTTP 响应返回后交接旧
   Host；验证失败会恢复 Guardian 文件且不关闭当前 Host；
3. 包操作完成后，商城会明确标记“待重启”。只有 Guardian 心跳正常时才允许生成一次性的
   `RESTART DSH ` 计划；
4. Guardian 是 DSH web Profile 的唯一启动所有者。启用后不要再手工运行 `pnpm dsh web` 或
   `dsh web`，否则第二个实例会因争抢 `127.0.0.1:3080` 而以 `EADDRINUSE` 退出；
5. Guardian 同时验证首页 HTTP、商城 runtime API、Profile 和 Boot ID；只有身份一致并持续稳定
   30 秒才判定健康。连续探测失败才执行有界重启，5 分钟内最多失败 3 次；
6. 页面检测到新的 Boot ID 后重新读取插件清单与健康报告，只有通过才显示“已重启并生效”；
7. 如果安装、重启或页面显示异常，请在
   [GitHub Issues](https://github.com/AI-Scarlett/dsh-safe-plugin-manager/issues) 提交原始错误，
   不要提交凭据、完整 Profile 文件或环境变量。

安装完成后，从商城发起的安装、更新、迁移、停用、启用和卸载才会进入一次性计划、
精确确认、Profile 前置哈希、备份、健康检查和失败回滚流程。

## 当前概况

### 项目 · 当前状态
- **项目**: 商城版本 · **当前状态**: `0.8.2`
- **项目**: 收录条目 · **当前状态**: 400 个
- **项目**: 可安装 · **当前状态**: 393 个
- **项目**: 商城不可安装 · **当前状态**: 5 个，保留 GitHub 手动安装入口和风险原因；另有 2 个 unlisted 条目不公开展示
- **项目**: 分类 · **当前状态**: 22 个
- **项目**: 推荐 · **当前状态**: 3 个：DSH-Store、Build DSH Plugin、Agent Workflow
- **项目**: 目录来源 · **当前状态**: GitHub 仓库 + 不可变 Commit

`0.8.2` 延续每页 24 条的有界加载和来源排序，并新增动态 DSH 兼容矩阵：最新版本从官方 npm Registry 读取，失败时退回目录版本且不阻塞插件列表；只有精确目录证据显示“兼容”，仅命中声明范围的新版本显示“范围支持·待验证”，生命周期证据继续保持未知。该版本还新增所有标签页常驻的 Boot Guard：插件更新或 Guardian 重启后先校验新 Boot ID、Guardian `healthy` 状态和首页资源，连续稳定后再用带 Boot 参数的新 URL 恢复；`BroadcastChannel` 同步多标签页，轮询作为降级，同一 Boot 只导航一次；推荐条目在默认排序中置顶，可信安装支持“只看推荐”筛选，同版本源仓库提交不再误报为插件升级阻断。

商城已经在真实 DSH `web` Profile 中完成只读扫描、GitHub 在线目录刷新、配置合成、
Host API 和设置页显示验证。单元、契约和事务测试已通过；真实生产 Profile 的完整
“安装—重启—停用—启用—更新—卸载—回滚”闭环仍是独立验收项，不能由测试结果替代。
![](https://github.com/user-attachments/assets/2070b56a-fa3a-4fc1-b7fd-5926015887e4)
![](https://github.com/user-attachments/assets/dff94448-5dcd-4542-b5d5-39b040b8cd41)
![](https://github.com/user-attachments/assets/5eb4f589-21c5-4ced-8133-a22bc6baeb49)

## 功能介绍

### 插件发现与分类

- 将 `registry/candidates.json` 候选发现库与 `registry/catalog.json` 可信安装库物理隔离；候选条目没有包名、安装路径、入口 ID、权限或安装动作，必须经过固定 Commit 审核后才能晋级；
- 从 GitHub 在线目录读取插件，网络失败时只回退到随包发布的已知快照；
- 按名称、包名、分类或 GitHub 仓库搜索；
- DSH 内嵌商城由 Host 每次最多返回 24 个条目，搜索、分类和翻页都使用有界响应；候选发现库只在打开候选视图后读取；
- 公共商城使用 24 条一页的上一页、页码、下一页导航；完整目录不再内嵌到 HTML，避免首屏解析兆字节级脚本数据；
- 支持 22 个分类筛选、推荐置顶、可信安装中的“只看推荐”筛选、上架、商城不可安装和下架；
- 默认按照 approved、推荐、官方最新 DSH 的精确兼容证据、范围支持待验证、GitHub 固定来源更新时间和安装量依次排序；范围不支持、证据未知或长期未更新的条目依次排在后面；
- 目录中的安装目标固定到 40 位 Git Commit，不接受 npm-only、任意下载地址或浮动分支；
- 商城页面和 DSH 内置界面共享同一个 `registry/catalog.json` 数据源。

### 四级可信证据

- **Discovered**：只证明项目已被发现或进入可信目录，不代表能够安装；
- **Installable**：必须有固定 Commit、标准 Bundle、明确入口和可复现的静态安装证据；
- **Runtime Verified**：必须绑定具体 DSH 版本、系统、Profile、时间和公开证据，单元测试不能替代；
- **Security Reviewed**：只表示指定方法和证据范围内完成了代码风险审查，不承诺代码绝对安全；
- 任何缺少公开证据的状态都保持 `unknown`，`approved`、作者声明、Stars、推荐或推广位都不会自动提高证据等级；
- `promotionIndependentOfVerification` 是目录的强制信任策略：推广只能改变曝光，不能改变审核结论、兼容性或安全状态。

### 安装与生命周期管理

- 安装 GitHub 目录中的标准 DSH Bundle；
- 不依赖商城服务端巡检全部仓库：仅在用户本机按需检查已安装插件或用户主动选择的插件；
- 从插件 GitHub 默认分支解析最新完整 Commit，绝不直接安装浮动 `main`；
- 安装前在该 Commit 上核对版本、许可证、Bundle Patch、入口 ID、生命周期脚本和变更中的权限信号；
- 更新差异展示旧/新 Commit、提交跨度、文件新增/删除/修改、增删行、网络主机、文件/命令/凭据风险信号和 DSH 官方目录触碰；页面不返回源码 Patch 正文；
- 低风险候选可以生成固定 SHA 更新计划；高风险候选在本机展示权限、脚本、依赖和代码变化，由用户逐次确认是否更新；
- 修改 DSH 原生代码、冒用 `@deepseek-ai/*`、停用/覆盖受保护组件或来源与安装契约不可验证的候选，商城禁止安装/更新，只显示不受商城保护的 GitHub 外部入口；
- 停用、启用和卸载第三方插件；
- 识别 `link:`、`file:`、`workspace:` 等本地开发来源，并单独提供“迁移到商城版”；
- 识别并标记不是通过本商城安装、来源漂移或与目录 Commit 不一致的插件；
- 商城自身仅允许更新，禁止停用和卸载。

### DSH 版本检测

- 商城标题右侧显示当前运行中的 `@deepseek-ai/dsh` 版本，并按需读取 npm 官方 Registry 的最新版本；
- 检测使用 10 分钟缓存、请求超时、响应大小与包身份校验，失败不会阻断插件目录；
- 发现旧版本时提供官方 Release 和固定目标版本的 `npm install --global @deepseek-ai/dsh@<version>` 复制入口；
- 官方 DSH CLI 尚无自升级子命令，因此商城不会静默执行全局 npm/pnpm，也不会对源码工作区运行 `git pull` 或修改 DSH 源码。

### 安全事务与失败回滚

- 所有页面加载、搜索、目录刷新、健康检查和计划生成均为只读操作；
- 每次写操作都先生成一次性计划，展示目标 Profile、固定 Commit、生命周期脚本、
  影响文件和精确确认语；
- 执行前检查 Profile 文件哈希并获取文件锁，防止并发修改；
- 通过官方 DSH CLI 使用固定参数数组执行包操作，不拼接 Shell 命令；
- 写入前创建备份，完成后执行配置健康检查，失败时自动回滚；
- 永久保护 DSH 源码、官方包、官方插件清单、用户 Patch 区块、会话、设置和凭据。

### 商城内置 DSH Guardian

- Guardian 随商城发布，但复制到商城自己的持久状态目录并由 launchd 独立运行；DSH
  启动失败时不依赖 Host Plugin 或设置页存活；
- 安装 Guardian 仍需一次性计划、精确确认和文件哈希预条件，并明确展示将替换的启动任务；先验证
  新 Guardian 的 launchd 注册、随包文件哈希和新鲜心跳，HTTP 响应成功后才延迟交接旧 Host；
  验证失败会恢复原 Guardian 文件且不关闭当前 Host；
- 使用固定参数数组启动 DSH，不使用 `bash -c`，记录心跳、启动状态、失败次数和熔断状态；
- 将管理器验证过的命令 PATH 固化到 Guardian 配置；即使 launchd 与 Node 运行时 PATH 中没有
  Homebrew，启动与离线依赖恢复仍能从全局 DSH CLI 安装位置找到可执行的 `pnpm`；
- Guardian 是 DSH web Profile 的唯一启动所有者；商城不再提供会启动第二个实例的复制命令；
- 健康判定要求首页 HTTP 和 `/api2/dsh-safe-plugin-manager/runtime` 同时成功，并核对 Profile 与
  Boot ID。单纯能连接 3080 端口不再代表 DSH 健康；
- 端口若由外部 DSH 或未知进程占用，Guardian 会明确报告未持有所有权并停止启动，不会杀死、
  冒充接管或再启动一个 DSH；
- 重启前扫描 Profile Patch 与所有已安装 Bundle Patch 的入口 ID；发现重复入口时将包操作
  判为不健康并立即恢复事务备份，不关闭当前 Host；
- Guardian 连续失败会打开熔断并保留脱敏故障摘要，不会把“端口暂时出现”误报成插件已健康。
- Guardian 将端口、首页 HTTP、runtime 身份、耗时、响应字节数和重启判断写入商城自己的
  `probe-log.jsonl`。失败探测逐次记录，健康探测每分钟采样；不保存响应正文、Profile 内容或
  凭据。日志仅保留 24 小时，并额外限制为 4 MiB，清理失败不会中断 Host 监督。
- 商城会比较随包 Guardian 与已部署守护文件的 SHA-256；版本漂移时禁用一键重启，并要求
  用户通过新的单次计划和精确确认升级 Guardian。

### 健康检查与来源识别

- 检查 Profile 清单、依赖、管理器托管 Patch、DSH 配置合成与冷启动入口 ID 冲突；
- 合并 Bundle 和依赖信息，显示已安装版本、声明来源和官方/第三方属性；
- 区分“已验证”“部分验证”“商城不可安装”和“尚未验证”，不把声明态当成运行态；
- 运行态 Loader/Fiber 状态继续以 DSH 官方清单为权威，商城不直接控制官方运行时。

### 插件详情与权限画像

- DSH rc.5–`0.1.1-rc.1` 中使用同一套官方 `ModuleLoader`、`settings.plugins.tab`、Slots 和 Modal 契约；rc.5 的真实包版本是 `0.0.1-rc.5`，新 rc.1 使用完整版本键避免歧义；
- 使用紧凑的响应式卡片、状态圆点、清晰的操作区、无障碍列表语义和每页 24 条的分页导航；
- 每张商城卡片可打开详情弹窗，集中显示插件类型、安装来源和许可证；
- 列表与详情均显示由 GitHub 仓库链接可靠派生的发布者账号；组织仓库显示组织账号，
  不把它误写成具体个人开发者；
- 展示权限等级，以及文件、网络、命令和凭据访问范围；
- 展示外部依赖、审核状态、DSH/Node.js 版本、系统和 Profile 兼容性；
- 保留 rc.5、rc.6、rc.7、rc.8 的历史别名，后续发布使用完整 SemVer；卡片实时展示最近三个完整版本，详情展示目录已知版本及安装、启动、卸载、回滚证据；缺少精确真实验收时显示未知；
- 字段来自 GitHub 目录固定 Commit 的 manifest、README 与代码信号；无法确认时显示
  “未知”或“未声明”，不会用本地猜测覆盖目录数据；
- 自动扫描、人工检查和作者认证只表示元数据核验层级，均不等于安全审计。

### 上下架、推荐与安装计数

- `approved`：正常上架并允许生成安装计划；
- `blocked`：商城中继续展示并提供 GitHub 手动安装入口，但不提供商城安装操作；
- `unlisted`：公共商城隐藏，已安装用户仍可停用或卸载；
- `featured: true`：在全部视图和所属分类中优先显示；可信安装还可以切换“只看推荐”，但不会提高任何可信证据；当前推荐 DSH-Store、
  Build DSH Plugin、Agent Workflow 和 Settings Hub；
- 可选安装回执只发送插件 ID 和版本，不发送设备、Profile 或用户标识；默认关闭；
- GitHub Pages 不能直接写回 `catalog.json`，真实计数需要独立匿名聚合服务。
- `0.4.7` 内置幂等安装回执与 Cloudflare Worker + D1 聚合器；只在商城安装、健康检查通过后提交插件 ID、版本和随机事务 ID，不提交账号、设备或 Profile。计数服务未部署或未配置时保持关闭，不显示虚假安装量。

## 使用方式

安装并启动管理器后，在 DSH 中打开：

```text
设置 → 插件 → 插件商城
```

界面包含三个视图：

1. **插件市场**：搜索、分类筛选、查看推荐、安装、更新或迁移；
2. **已安装**：查看来源、版本、商城托管状态，并停用、启用或卸载；
3. **健康检查**：检查 Profile、依赖、托管 Patch 和配置合成状态。

健康检查不会自动替用户批准权限。有待选项时，顶部操作会定位到逐插件权限列表；只有
所有声明权限均明确选择“允许”或“拒绝”后，底部重新检查按钮才会启用，并显示检查中、
完成时间或失败原因。审核选择只保存在当前浏览器，并绑定包名、已安装版本、固定来源、
目录身份和权限声明；版本、固定 Commit 或权限声明变化后会自动失效并要求重新确认。

刷新按钮会重新读取 GitHub `main` 分支上的在线目录。以本地开发链接安装的管理器或
插件不会被普通“更新”静默覆盖；需要先生成并确认“迁移到商城版”计划。迁移只切换
目标 Profile 的依赖来源，不删除或修改原本地项目。

## 开发历程

### 阶段 · 关键提交 · 完成内容
- **阶段**: 只读原型 · **关键提交**: [`5df2f80`](https://github.com/AI-Scarlett/dsh-safe-plugin-manager/commit/5df2f80) · **完成内容**: 建立标准 DSH Bundle、Profile 只读扫描、Host API 和设置页入口。
- **阶段**: 客户端接入修复 · **关键提交**: [`e579c18`](https://github.com/AI-Scarlett/dsh-safe-plugin-manager/commit/e579c18) · **完成内容**: 修复 Client ModuleLoader 初始化并完成真实 DSH 页面验收。
- **阶段**: 受控生命周期 · **关键提交**: [`ba168e3`](https://github.com/AI-Scarlett/dsh-safe-plugin-manager/commit/ba168e3) · **完成内容**: 加入安装、更新、启停、卸载的计划/确认/备份/健康检查/回滚事务。
- **阶段**: GitHub 目录发布 · **关键提交**: [`60f97d8`](http