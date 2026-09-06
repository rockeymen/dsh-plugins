#dsh-pr-checks

[DSH](https://github.com/deepseek-ai/deepseek-harness) 插件（主机 + Web 客户端），在侧边栏页脚中显示开放 PR 的检查**状态和进度（GitHub 操作），按 **工作区 → 项目 → PR** 分组。

- 每个 PR 的进度条 (`done/total`)、每个检查的彩色点（带有名称的工具提示）和“PR 检查”标题。
- 仅显示带有检查**仍在运行**（`IN_PROGRESS`/`QUEUED`/`PENDING`）的 PR：当它们完成时，PR 会从列表中删除 - 并且没有任何运行，整个小部件**隐藏**（当检查再次开始运行时它会回来）。
- 侧边栏折叠时隐藏。
- **耐用**：完整的配置文件插件，无需对 DSH 运行时文件进行修补 - 在 DSH 更新中仍然存在。

## 安装

该软件包是一个 DSH **捆绑**（清单 `dsh.bundle`）：它附带自己的 `cordis.patch.yml` 层，因此安装它还会注册插件行。在 npm 上发布为 `dsh-pr-checks`。要将其安装在配置文件中：

```bash
dsh plugin --profile <name> add dsh-pr-checks
# or directly from the git repository:
# dsh plugin --profile <name> add github:pauloapoloni/dsh-pr-checks
```

或者，直接安装软件包（例如，对于现有的手动设置）：

```bash
cd ~/.dsh/profiles/web
npm install github:pauloapoloni/dsh-pr-checks
```

并在配置文件的 `cordis.patch.yml` 中注册该条目（仅在不使用捆绑层时需要）：

```yaml
- insert:
    - id: dsh-pr-checks
      name: dsh-pr-checks
      config:
        cacheMs: 10000            # response cache (ms)
        includeAllAuthors: false  # true = all open PRs, not only yours
```

> 如果您之前手动添加了条目并切换到捆绑安装，请删除手动插入以避免重复行。

重新启动 `dsh web` 并重新加载 GUI。

> 先决条件：`gh` CLI 通过 `repo`/`workflow` 范围进行身份验证。

## 配置

### 键·默认值·说明
- **密钥**：`cacheMs` · **默认**：`10000` · **描述**：端点响应缓存（毫秒）
- **密钥**：`includeAllAuthors` · **默认**：`false` · **描述**：`true` = 所有开放的 PR，而不仅仅是您的
- **密钥**：`authors` · **默认**： — · **描述**：过滤依据的登录名（默认：经过身份验证的 `gh` 用户）
- **密钥**：`repos` · **默认**：— · **描述**：工作区之外的额外存储库（例如 `["org/repo"]`）

## 它是如何工作的

- **主机** (`lib/index.js`)：cordis 插件公开 `GET /api/pr-checks`。它发现 DSH 工作区 (`~/.dsh/storages/workspace.json`) 中的 git 存储库，通过 `gh pr list` 查询打开的 PR 并返回 `{ generatedAt, workspaces: [{ id, title, projects: [{ name, repo, prs: [{ number, title, url, draft, headRefName, checks: [{name,status,conclusion}], done, total }] }] }] }`。
- **客户端**（`lib/client.js`）：将小部件注册到库存 `sidebar.footer.action` 插槽中的客户端捆绑包（采用 `window.__ModuleLoader__.load` 格式） - 不需要对侧边栏捆绑包进行修补。它每 30 秒轮询一次 `/api/pr-checks`。

布局细节：`sidebar.footer.action`插槽为Flex行；该包注入了一个 CSS 规则，该规则在容器的散列类 (`.hHd-Xa_footerActions`) 上启用 `flex-wrap`，因此小部件会占据整行，并且图标（例如 cordis 面板）会换行到下一行。如果 DSH 更新重命名该类，则小部件将继续呈现 - 只是没有换行。

## 发展

- 该条目从 `cordis.patch.yml`（配置 HMR）应用。对 `lib/*.js` 中的 **代码** 进行更改需要重新启动 `dsh web`（加载程序不会重新加载已导入的模块；客户端模块注册表会缓存每个进程的解析失败）。