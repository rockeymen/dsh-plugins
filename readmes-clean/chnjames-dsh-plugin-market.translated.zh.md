# DSH 插件市场

在 DeepSeek Harness「设置 → 插件」里发现、确认并安装社区插件；另有公开目录站供浏览与复制安装命令。

![设置 → 插件 → 插件市场](website/public/images/settings-market.png)

公开浏览：[https://dsh-plugin-market.vercel.app](https://dsh-plugin-market.vercel.app)

## 功能

- 设置内「插件市场」Tab：搜索、分类、展开说明、确认后安装 / 卸载
- 安装走官方 `dsh plugin add/remove`，不执行第三方安装脚本
- 公开目录站：浏览、⌘K 搜索、中英 / 亮暗主题、复制安装命令
- 对话 Agent 工具：搜索、详情、安装、列出已装插件

## 安装

```bash
dsh plugin --profile web add github:chnjames/dsh-plugin-market
# 或
npx @deepseek-ai/dsh plugin --profile web add github:chnjames/dsh-plugin-market
```

安装后**重启** `dsh web`，打开 **设置 → 插件 → 插件市场**。

> Web profile 通常关闭配置热重载；改完插件后请重启再强刷页面。

## 使用

设置内卡片：

1. 标题行：名称 · 星标 · 展开
2. 简介（最多两行）
3. 底栏：已安装 / 作者 / 提示 · **查看仓库** · **安装**（安装前确认）

卸载本市场插件：

```bash
dsh plugin --profile web remove dsh-plugin-market
```

## 公开目录站

线上目录：[https://dsh-plugin-market.vercel.app](https://dsh-plugin-market.vercel.app)

- 首页：安装命令终端、热门 / 分类 / 最近更新
- 分类页：排序、分页（`?sort=` / `?page=`）
- 详情页：复制 `dsh plugin add`、README 摘要
- 顶栏：⌘K / Ctrl+K、中英、亮暗主题

本站**只浏览与复制命令**；真正安装在本机 DSH 设置里完成。
本地开发与 Vercel 部署见 [`website/README.md`](website/README.md)；设计约束见 [`website/design.md`](website/design.md)。

## 配置

常用项（写入 `cordis.patch.yml` 中本插件的 `config`）：

### 键 · 说明
- **键**: `install.dshCommand` · **说明**: npx 用户设为 `"npx @deepseek-ai/dsh"`
- **键**: `catalog.urls` · **说明**: 自定义 `registry.json` 地址（自建域名时）
- **键**: `catalog.fallbackToSearch` · **说明**: 目录全失败时是否回退本机 GitHub / npm 搜索
- **键**: `ui.showRiskLevel` · **说明**: 是否显示外观类 / 高权限等启发式提示

完整默认块见 [`cordis.yml`](cordis.yml)。

完整配置示例

```yaml
- insert:
    - id: plugin-market
      name: dsh-plugin-market
      config:
        catalog:
          fallbackToSearch: true
          # urls: ["https://your-domain/registry.json"]
        sources:
          github:
            enabled: true
            topic: "dsh-plugin"
          npm:
            enabled: true
            keyword: "dsh-plugin"
        cache:
          ttl: 21600
          autoRefresh: true
          refreshInterval: 21600
        ui:
          showRiskLevel: true
        install:
          defaultProfile: "web"
          confirmBeforeInstall: true
          # dshCommand: "npx @deepseek-ai/dsh"
```

## Agent 工具

需插件已加载：

### 工具 · 用途
- **工具**: `plugin_market_search` · **用途**: 按关键词搜索目录
- **工具**: `plugin_market_detail` · **用途**: 查看单条插件详情
- **工具**: `plugin_market_install` · **用途**: 经官方 CLI 安装（带确认策略）
- **工具**: `plugin_market_list_installed` · **用途**: 列出本机已装插件

## 安全

- 目录只含公开元数据，不上传用户信息；**目录不构成推荐**
- 安装走官方 `dsh plugin add/remove`，确认后才调用；不执行第三方安装脚本
- 设置 Tab 用 React 文本节点渲染摘要，不 `dangerouslySetInnerHTML`
- `permissionLevel` 是文案启发式，默认「未评估」，**不是**权限审计；只安装你信任的来源

故障排除

### 现象 · 处理
- **现象**: 设置里没有「插件市场」Tab · **处理**: 确认 `package.json` 的 `dsh.client.immediately`；重启 DSH；检查 `lib/client.js` 是否已构建
- **现象**: 列表为空 · **处理**: 等同步；或 `npm run build:registry` 后提交 `website/public/registry.json`；检查 `catalog.urls`
- **现象**: 安装失败（Windows） · **处理**: 确认调用的是 `dsh.cmd` / `npx.cmd`；npx 用户设 `install.dshCommand`
- **现象**: 日志仍出现 `Web UI running at :3789` · **处理**: 旧 profile 残留 `ui.webPort`：从 `cordis.patch.yml` 删掉并重启（本机已不再提供独立 HTTP 面板）

**手动挂载**：若 `dsh plugin add` 未自动写入 patch，把仓库里的 [`cordis.yml`](cordis.yml) 追加到 `<DSH_HOME>/profiles/web/cordis.patch.yml`。

**本地 `file:` 挂载**（路径按本机调整）：

```bash
dsh plugin --profile web add file:C:/path/to/dsh-plugin-market
```

本地目录缓存：`<DSH_HOME>/plugin-market.db`（删除后下次启动会重新拉目录）。

架构

```
GitHub Actions ──► registry.json ──► Vercel 网站（浏览 / CORS）
                         └──► DSH host（sql.js 缓存 + Typert Remote）
                                    └──► 设置 → 插件 → 插件市场（本机安装）
```

### 层 · 说明
- **层**: Host · **说明**: `PluginMarketService`（服务名 `pluginMarket`）；安装 Remote 方法为 **`installPlugin`**（不能叫 `install`）
- **层**: Client · **说明**: 设置 Tab（`settings.plugins.tab`）；经嵌套 inject 调用 `remote.pluginMarket`
- **层**: 分类 / 风险 · **说明**: `src/utils/classifier.ts` 与 `shared/classifier.mjs` 须保持同步
- **层**: README 摘要 · **说明**: Host 截断下发；UI 再摘成可读段落（设置 Tab **不做**完整 Markdown 渲染）

本机拉取目录顺序：Vercel → jsDelivr → GitHub raw → 包内 `lib/registry.snapshot.json` →（可选）本机搜索。

## 开发

```bash
npm install
npm run build          # tsc + 复制 client + registry snapshot
npm run typecheck
npm run build:registry # 生成 website/public/registry.json

cd website && npm install && npm run dev   # http://localhost:3000
```

CI：`.github/workflows/ci.yml`（构建）、`registry.yml`（定时刷新目录）。

自测清单

重启 DSH 后：

- [ ] 设置 → 插件 出现「插件市场」Tab（在「插件配置」「插件列表」之后）
- [ ] 列表来自 catalog（Network 可见 `registry.json`，而非 GitHub Search）
- [ ] 搜索、分类可用；展开说明为摘要段落，完整 README 链到仓库
- [ ] 多数卡片无风险标签；主题类可显示「外观类」；明确高权限关键词才显示「高权限提示」
- [ ] 安装 / 卸载先确认，确认后 `dsh plugin list` 可见变化
- [ ] 「同步目录」会重新拉 registry；日志无 `:3789`
- [ ] 公开站 `cd website && npm run build` 成功；复制命令与 `/registry.json` CORS 正常
- [ ] Agent：搜索 / 列出已装插件工具可走通

已知限制

- 无单元测试；Client 与 Host 的 README 摘要实现可能漂移
- 约四成插件仍落在分类 `other`（关键词启发式）
- 无版本更新检测（需卸了再装）
- 本机缓存需「同步目录」或重启后才吃到新风险分数

## 文档

### 文档 · 内容
- **文档**: [website/README.md](website/README.md) · **内容**: 公开站本地开发与 Vercel
- **文档**: [website/design.md](website/design.md) · **内容**: 公开站设计系统
- **文档**: [cordis.yml](cordis.yml) · **内容**: 插件默认配置

## 许可证

MIT