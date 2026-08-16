# Harness 注册表 — DeepSeek Harness 插件注册表

Harness Registry 是一个可供 DSH 用户和插件作者搜索的 DeepSeek Harness 插件注册表。它将社区策划的目录与 GitHub 发现相结合，验证可安装的 `dsh.bundle` 清单合约，并公开类似的插件元数据和复制就绪的安装命令。

> 状态：预发布。该注册表可在 [plugin.dshdesk.com](https://plugin.dshdesk.com/) 上获取，源代码是在 MIT 许可证下发布的。参见[发射准备情况](docs/shipwise-readiness.md)。

![利用注册表浏览经过验证、策划和候选的 DSH 存储库](docs/assets/harness-registry.png)

## 快速入门

要求：Node.js 22 和 npm。

```bash
git clone https://github.com/majiayu000/dsh-plugin-registry.git
cd dsh-plugin-registry
npm ci
npm run dev
```

打开<http://localhost:5173> 来浏览、搜索、过滤和检查注册表。

## 它提供什么

- 可搜索的 Web 目录，其中包含类别、信任标签、星星、叉子和安装命令。
- 从社区注册表导入的精选条目。
- 从 GitHub `dsh-plugin` 主题自动发现。
- 清单验证：发现的存储库必须在 `package.json` 中声明有效的 `dsh.bundle` 对象，并且其引用的补丁文件必须存在。
- 具有架构验证、运行状况门和单独审核队列的公共 JSON 快照。
- 存储库检查器，用于解释插件是否符合自动发现的条件。
- 可选的现场审核表格，可通过受保护的 Cloudflare 页面功能创建分配的公共 GitHub 问题。

## 查询注册表数据

生成的快照位于 [`public/data/plugins.json`](public/data/plugins.json) 并遵循 [`schema/registry.schema.json`](schema/registry.schema.json).

```bash
jq '.stats | {published, curated, automaticallyDiscovered, pendingReview}' public/data/plugins.json
```

检查一个插件：

```bash
jq '.plugins[] | select(.id == "omdsh-dev/dsh-at-file") | {id, trustLevel, install}' public/data/plugins.json
```

验证快照并运行治理测试：

```bash
npm run validate:registry
npm test
```

回填 GitHub 主要语言元数据，无需重新运行完整发现：

```bash
GH_TOKEN=... npm run backfill:languages
```

## 发现如何运作

```text
Curated registry ─┐
                  ├─ normalize ─ verify ─ governance ─ public registry
GitHub topic ─────┘                              └──── audit queue
```

策划的存储库获得 `curated` 信任级别。自动发现的存储库仅当其根 `package.json` 包含有效的 `dsh.bundle` 时才可安装；这些接收 `manifest_verified`。待处理的存储库在没有安装命令的情况下仍可见为 GitHub 候选存储库，而被阻止和隔离的存储库则保持隐藏状态。完整的政策记录在[注册表管理](docs/registry-governance.md)]中。

计划的 GitHub 操作工作流程每两个小时刷新一次快照。当注册表更改时，相同的工作流程会提交快照并将其经过验证的构建工件部署到 GitHub 页面，因此使用 `GITHUB_TOKEN` 创建的同步提交不依赖于第二个 `push` 事件。健康门可防止未经身份验证的部分发现运行或意外较小的完整快照替换健康数据。

## 添加插件

对于自动发现：

1. 发布一个真实的、公开的、非分叉的GitHub存储库。
2. 在根`package.json`中声明一个可安装的`dsh.bundle`对象。
3.添加`dsh-plugin` GitHub主题。
4. 等待下一次注册表同步。

使用 <http://localhost:5173/publish.html>. 的存储库检查器配置 Cloudflare 提交通道后，作者可以在不离开页面的情况下提交可跟踪的审阅请求； GitHub 仍可作为后备方案。请参阅[提交审核设置](docs/submission-review.md)。

## 已知限制

- 清单和补丁文件验证确认安装条目存在；它们不是安装测试、安全审核或插件代码的认可。
- 星星、分叉、描述、主题和主要语言是时间点 GitHub 元数据，可能会滞后到下一次同步。
- 完整的发现刷新需要GitHub令牌；未经身份验证的运行仅检查最近的候选者，并且不能覆盖完整的快照。
- 基于浏览器的存储库检查器使用未经身份验证的 GitHub API，可能会遇到速率限制。
- GitHub Pages 站点跟踪 `main`；正式版本尚未发布。

## 发展

```bash
npm ci
npm test
npm run validate:registry
npm run build
```

要刷新注册表数据，请提供具有公共存储库读取访问权限的 GitHub 令牌：

```bash
GITHUB_TOKEN=... npm run sync:plugins
```

不要提交令牌或生成的凭据。请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解变更工作流程。

### 项目结构

- `assets/` 包含注册表 UI 模块、样式和翻译。
- `public/data/plugins.json` 是生成的公共注册表快照。
- `scripts/` 包含发现、标准化和验证工具。
- `functions/` 包含用于审核提交的 Cloudflare Pages 服务器端路由。
- `schema/registry.schema.json` 定义已发布的快照合约。
- `tests/` 涵盖注册表治理和面向浏览器的行为。

## 支持和安全

- 错误、数据更正和功能请求：[GitHub 问题](https://github.com/majiayu000/dsh-plugin-registry/issues)
- 敏感漏洞：[私密漏洞报告](https://github.com/majiayu000/dsh-plugin-registry/security/advisories/new)
- 安全策略：[SECURITY.md](SECURITY.md)