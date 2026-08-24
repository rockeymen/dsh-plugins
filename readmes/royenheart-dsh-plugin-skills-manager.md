# `@royenheart/dsh-plugin-skills-manager`

dsh 插件：按 **会话 > 工作区 > 全局** 三个作用域启用/禁用 skills。作用域之间的覆盖关系是「更近的作用域覆盖更远的」：`session > workspace > global > default(enabled)`；禁用对模型目录与用户 `/skill` 调用都生效。

---

<center> <img style="width:95%;border-radius: 0.3125em; box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" src="./assets/global-skill-manage.png"> <br> <div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #999; padding: 2px;margin-bottom:1em">全局技能设置</div> </center>

<center> <img style="width:95%;border-radius: 0.3125em; box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" src="./assets/session-skill-manage.png"> <br> <div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #999; padding: 2px;margin-bottom:1em">对话级技能设置</div> </center>

---

## ⚠️ 前置条件：必须先给 deepseek-harness 打四个补丁

标准 dsh（当前 rc.8 / master）还缺四个插件侧的通用 seam，本插件需要它们才能完整工作：

| 缺口 | 补丁 |
|---|---|
| 工作区三点菜单没有 per-workspace 子 slot，插件无法加「技能管理」入口 | `patches/0001`（对应 Discussion #1413） |
| `skill.list` 不返回 `source`、也只能按 `sessionId` 寻址；跨层 deny 不生效 | `patches/0002`（对应 Discussion #1427 的 source/cwd，外加「fully-disabled = deny wins across layers」） |
| 宿主 skill registry 会发 `skills/change`，但浏览器不转发，`/` picker 的 per-session 缓存不失效 | `patches/0003` |
| 冷会话的 `skill.list` 只带 preset standing scope（无 session 身份），session 级禁用无法解析 | `patches/0004` |

> rc.8 已把 settings 面改为「所有已注册 namespace 都可被 Web settings 面读取/写入」，因此旧的 `settings.register({ expose: 'web' })` 补丁不再需要。

`patches/` 下就是这四个 dsh 补丁，必须在构建/运行 dsh 之前应用：

```bash
cd /path/to/deepseek-harness          # 建议基于 master / rc.8 附近的干净 worktree
git am /path/to/dsh-plugin-skills-manager/patches/0001-feat-add-sidebar-workspaces.entry.patch
git am /path/to/dsh-plugin-skills-manager/patches/0002-fix-skill-listing-source-cwd-and-plugin-enforcement-seams.patch
git am /path/to/dsh-plugin-skills-manager/patches/0003-fix-forward-skills-change-to-web-clients.patch
git am /path/to/dsh-plugin-skills-manager/patches/0004-feat-pass-addressed-session-id-through-skill-lookups.patch

# 用补丁后的源码构建
pnpm install
pnpm run build
```

补丁内容说明：

- `0001`：`ui-workspace` 新增通用 `sidebar.workspaces.entry` **list slot**（`id/label/order/icon` 语义，`icon` 为 list slot 新增的通用可选字段），工作区三点菜单把插件条目排在「重命名」与「删除」之间，并渲染插件提供的 leading icon；选中后在通用 `Modal` 里渲染该 slot；label 完全来自插件自己的 locale，dsh 侧没有硬编码文案。
- `0002`：`skill.list` 支持 `{ sessionId }` 或 `{ cwd }` 寻址，wire 行新增 `source`；skill registry 把「完全禁用」的候选作为跨层硬阻断，较近层不得复活。
- `0003`：把宿主既有的 `skills/change` 加入 `API_REMOTE_FORWARDED_EVENTS`，`ui-skill` 订阅后清空全部 session 缓存；禁用/重启用后 `/` picker 无需刷新即可收敛。
- `0004`：`SkillLookupOptions` 增加 informational `sessionId`（并纳入 registry 缓存键），`apiproxy` 与 `dsh-tool-skill` 透传；冷会话的 `skill.list` 也能按 session 解析覆盖。
- 补丁里 **不含** 任何 `skills-manager` 专属字符串或专属样式；settings 已随 rc.8 全量暴露，弹窗宽度由插件自己的 CSS 解决。

> 后续跟进：等 [#1413](https://github.com/deepseek-ai/deepseek-harness/discussions/1413)（workspace slot）、[#1427](https://github.com/deepseek-ai/deepseek-harness/discussions/1427)（source/cwd）、`skills/change` 转发与 `sessionId` 透传都落地上游后，才可以去掉本地 dsh 补丁、纯插件侧安装。

## 功能

1. **全局技能设置** — 在 dsh 设置里启用/禁用技能，写入 `settings.yaml` 的 `skills-manager` namespace；技能清单跟随当前会话发现（复用 `skill.list` RPC）。
2. **工作区覆盖** — 工作区三点菜单里的「技能管理」入口（补丁 0001），以及设置页内的「工作区」页签；技能发现走 `skill.list({ cwd })`，不依赖该工作区已有会话。
3. **会话覆盖** — 会话「轨迹」右侧的「技能」页签；支持 Shift 连续多选 / Ctrl 独立多选后批量启用/禁用。

## 技能识别范围

只识别来自 `.agents` 通用目录与 dsh 自身技能目录的技能：

| source | 路径 | 含义 |
|---|---|---|
| `project-dsh` | `<project>/.dsh/skills` | dsh 自身项目目录 |
| `project-agents` | `<project>/.agents/skills` | `.agents` 通用目录 |
| `user-dsh` | `$DSH_HOME/skills` | dsh 自身用户目录 |
| `user-agents` | `~/.agents/skills` | 用户 `.agents` |

其它 agent 的技能目录（`.claude/skills`、`.codex/skills`、`.cursor/rules` 等）以及 `bundled`/`runtime`/`custom` 来源不识别、不管理，见 `src/core/skill-filter.ts`。

## 安装 / 卸载

插件是 **dsh profile bundle**（`package.json` 的 `dsh.bundle.patch` 指向
`cordis.patch.yml`，后者插入插件自身 host 行）。`dsh plugin add` 成功后会把
插件自动 reconcile 进 `dsh.profile.bundles`，因此**不再需要手写 bundle /
`cordis:include` 配置**。

```bash
cd dsh-plugin-skills-manager

# 重新构建当前 checkout，并本地安装到 profile（符号链接 + package.json 条目）
python3 install.py install

# 卸载
python3 install.py uninstall
```

环境变量：`DSH_PROFILE`（默认 `web`）、`DSH_HOME`（默认 `~/.dsh`）。
`install` 每次都会重新 `npm run build`（仅当 `node_modules/.bin/tsdown` 不存在时才先 `npm install`），
然后把当前 checkout 软链到 profile 的 `node_modules/@royenheart/dsh-plugin-skills-manager`，
并写入 profile `package.json` 的 `dependencies` 与 `dsh.profile.bundles`。
不经过 `dsh plugin add`，也不支持远程 spec 安装。

## 目录结构

```
dsh-plugin-skills-manager/
├── install.py               # 自动安装/卸载（默认构建当前 checkout 并 file: 安装）
├── cordis.patch.yml         # dsh.bundle.patch 指向它，插入插件自身 host 行
├── patches/                 # 使用前必须打到 deepseek-harness 的补丁
│   ├── 0001-feat-add-sidebar-workspaces.entry.patch
│   ├── 0002-fix-skill-listing-source-cwd-and-plugin-enforcement-seams.patch
│   ├── 0003-fix-forward-skills-change-to-web-clients.patch
│   └── 0004-feat-pass-addressed-session-id-through-skill-lookups.patch
├── package.json             # dsh 插件清单: main/./client + dsh.bundle + dsh.client.inject + peerDeps
├── tsconfig.json
├── build.mjs                # tsdown → lib/index.js (host) + lib/client.js (client)
├── src/
│   ├── index.ts             # host: ctx.skillManager + settings namespace + enforcement provider
│   ├── client.ts            # client: locale + settings.section (含工作区页签) / conversation.view
│   ├── core/                # 纯逻辑, 不 import 任何 dsh 包 (可独立单测)
│   └── locales/             # zh / en i18n 字典
├── docs/
│   └── operation-timing.md  # 三层作用域覆盖语义与操作时序
└── tests/                   # node --test 单测
```

## i18n

复用 dsh 自带的 locale 框架（`@deepseek-ai/dsh-client-locale`）：`src/locales/` 定义 `skills-manager` 命名空间的 zh / en 两套扁平字典，host 端 `ctx.locale.register('skills-manager', dicts)` 注册，client 端 `ctx.locale.bind('skills-manager')` 取翻译函数；所有 UI 文案都走这个 API。双语键集合与占位符对称性由 `tests/i18n.test.ts` 强制。

## 数据流

client 不引入自定义 RPC（自定义 Typert Remote 需要在 dsh 仓库内 codegen），而是复用两个现成 wire 面：

- **覆盖读写** — `ctx.settingsScope.bind({ namespace: 'skills-manager' })`，`global` / `workspaces` / `sessions` 三块都存进 `settings.yaml`；rc.8 的 settings 面服务所有已注册 namespace，因此 host 侧注册 namespace 即可，无需任何补丁。
- **技能清单** — `ctx.connection.api.skills.list({ sessionId | cwd })`（补丁 0002 的 source/cwd 扩展），再与 settings 里已有的覆盖名取并集，保证被禁用的技能仍以「禁用」行出现、可重新启用。

## 强制机制

host 注册 rank-50 的 enforcement provider，把解析为 disabled 的技能以 `modelInvocable: false, userInvocable: false` 的候选屏蔽。web profile 的 filesystem provider 在 preset 层、enforcement provider 在全局层，因此依赖补丁 0002 的「fully-disabled = deny wins across layers」；否则 nearer preset 层会复活被禁用的同名技能。registry 运行时会把这个 lookup 的 `scope` 原样转发给 provider，agent 的 scope key 就是 Agent 本身（`scope.id` 即 session id）；补丁 0004 还让 `apiproxy` 把 `sessionId` 作为 informational 字段透传，冷会话（scope 只是 preset standing key）也能解析 session 覆盖，所以 provider 能按 `session > workspace > global` 全链解析，且 catalog 缓存按 scope 链 + sessionId 隔离。

## 兼容性检测与降级

插件在浏览器端运行时逐项探测上述补丁缺口，不假设补丁一定存在：

| 检测点 | 未打补丁/异常时的降级行为 | 用户可见通知 |
|---|---|---|
| `sidebar.workspaces.entry` slot 不存在 | 工作区三点菜单入口不注册；设置页的「工作区」页签与全局/会话入口照常工作 | 无（静默降级） |
| settings namespace 未被提供（`settingsScope` 状态为 `unavailable`） | 面板仍可浏览技能清单，但启用/禁用/重置/添加不执行，避免假装保存成功 | 原生 `Toast` 顶部横幅提示一次，面板内同时显示说明 |
| `skill.list` 返回的行没有 `source` | 不再按 `.agents`/dsh 来源过滤，列出当前会话发现的全部技能 | 同上 |
| `skill.list({ cwd })` 被未打补丁的 host 拒绝 | 工作区面板先尝试复用该工作区下的会话按 `{ sessionId }` 列出；仍失败则回退为「覆盖名 + 手动添加」 | 同上 |
| 已禁用技能仍出现在 `skill.list` 结果中（跨层 deny 缺 0002 / realm-mount registry / 冷会话缺 0004） | 面板照常显示/管理覆盖，并明确警告禁用可能对模型与用户调用不生效 | 同上 |

也就是说，缺哪个补丁，插件就退化成哪种形态：

- **缺 workspace slot**：只剩「设置页工作区页签 + 全局设置页 + 会话页签」入口，工作区三点菜单入口不出现；
- **缺 settings 提供**：面板变成只读浏览（能看到技能清单，但任何覆盖写操作不执行、不假装保存成功）；
- **缺 `skill.list` source**：退化为「不过滤来源的合并清单」（`.agents`/dsh 来源区分与全局页过滤都关闭）；
- **缺 `skill.list` cwd**：工作区清单退化为「复用该工作区下会话的 `{sessionId}` 列表」，再不行就是「已存覆盖名 + 按名称手动添加」；
- **缺跨层 deny / 冷会话身份 / realm-mount registry**：覆盖照常可管理，但插件只能警告「禁用可能对模型与用户调用仍生效」，无法在宿主侧强制执行。

通知走 dsh 原生的 `@deepseek-ai/dsh-client-ui-primitives` `Toast`（顶部居中、自动消失、不阻塞操作），同一缺失项整页只提示一次；面板内另有一条常驻 warning 条，Toast 消失后用户仍能看到当前降级状态。

## 开发与测试

```bash
npm test            # node --test tests/*.test.ts（纯逻辑单测，无需 dsh 运行时）
npm run build       # tsdown 打包 host/client
```

## 已知限制

- **必须使用打过 `patches/` 四个补丁的 dsh**；标准 rc.8 构建下，工作区三点菜单入口缺失、skill.list 无 source/cwd、禁用对模型不生效；缺 0003 时 `/` picker 缓存不随禁用失效，缺 0004 时冷会话的 session 级禁用无法进入 picker 过滤。
- **`/` 菜单失效依赖 `skills/change` 的浏览器转发（补丁 0003）** — 禁用写入后，打开中的菜单会在下一次查询时重新拉取；宿主调用路径（手工输入 `/name`）始终由 `dsh-tool-skill` 的 `isUserInvocable` 检查兜底。
- **技能清单只含 user-invocable 项** — `skill.list` 只返回 user-invocable 目录，`userInvocable: false` 的「仅模型」技能不会出现在管理列表里；标准 profile 中这类技能很少。
- **无会话时的工作区/全局列表按默认 preset 解析** — 没有 live agent 可借用时，使用默认 preset 的 standing scope（与补丁 0002 中 `skill.list({ cwd })` 的行为一致）。
