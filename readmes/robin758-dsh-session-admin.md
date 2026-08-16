# dsh-session-admin

DeepSeek Harness（DSH）会话管理插件：在 Web 设置面板统一管理所有会话（现存 + 归档），支持**归档 / 取消归档 / 永久删除 / 搜索 / 批量操作**。

## 功能特性

- 📋 **查看全部会话**：一次列出磁盘上的所有会话（现存 + 已归档），含标题、工作区、时间；
- 🗄️ **归档 / 取消归档**：一键归档不常用的会话，或随时从归档中恢复；
- 🗑️ **永久删除**：删除会话目录（不可恢复），操作前有二次确认，防止误删；
- 🔍 **搜索**：按关键词快速过滤会话列表；
- ☑️ **批量操作**：多选后批量归档 / 取消归档 / 删除。

## 适用场景

DSH Web（`dsh web`）的会话存储在 `~/.dsh/sessions/<工作区编码>/<会话id>/` 下，官方界面只能看到当前工作区的会话，且缺少批量管理能力。本插件在 **设置 → 会话管理** 面板提供全局视图与管理操作。

## 安装

从 GitHub 源码安装（推荐）：

```sh
dsh plugin --profile web add github:robin758/dsh-session-admin
# 指定版本（推荐，便于锁定）：
dsh plugin --profile web add "github:robin758/dsh-session-admin#v0.0.6"
```

本地开发安装：

```sh
cd dsh-session-admin
pnpm pack
dsh plugin --profile web add ./dsh-session-admin-0.0.6.tgz
```

安装后重启 web 服务加载插件：

```sh
launchctl kickstart -k gui/$(id -u)/com.deepseek.dsh
```

## 使用

1. 启动 DSH Web；
2. 进入 **设置 → 会话管理**；
3. 浏览所有会话：顶部输入框搜索；勾选会话后可批量归档 / 取消归档 / 删除；
4. 删除会弹出二次确认；**删除为永久删除，不可恢复**。

## HTTP API

| Method | Path | 说明 |
| --- | --- | --- |
| GET | `/plugins/dsh-session-admin/list` | 列出磁盘上的全部会话（现存 + 归档） |
| POST | `/plugins/dsh-session-admin/archive` | 归档一个会话 |
| POST | `/plugins/dsh-session-admin/unarchive` | 取消归档一个会话 |
| POST | `/plugins/dsh-session-admin/delete` | 永久删除一个会话 |
| POST | `/plugins/dsh-session-admin/batch` | 批量归档 / 取消归档 / 删除 |

变更类接口仅接受 loopback + 同源请求（Origin 与 Host 一致），否则返回 403，防止第三方网站误触发。

## 配置

bundle patch 中的 `config` 可覆盖（profile 层可再覆盖）：

```yaml
- insert:
    - id: dsh-session-admin
      name: dsh-session-admin
      config: {}
```

## 从源码开发

```sh
git clone <repo-url>
cd dsh-session-admin
pnpm install          # 仅需 peerDependency @deepseek-ai/cordis
```

插件为纯 ESM、无构建步骤，`lib/index.js`（host 端）+ `lib/client.js`（Web 端）直接运行。

## License

MIT
