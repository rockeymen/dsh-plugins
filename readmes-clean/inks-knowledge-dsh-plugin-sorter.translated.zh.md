#dsh-plugin-sorter

受 RimCrow 启发的 DeepSeek Harness (DSH) 插件排序器。

使用两栏板管理您的 DSH Web 配置文件插件：

- **启用/禁用**两列拖放用户界面
- 在列之间拖动以启用/禁用
- 拖动以重新排序启用的插件（加载顺序）
- 单击插件即可查看自述文件、作者、存储库、版本、诊断
- 先保存草稿，然后应用更改；重启由用户决定
- 对插件进行分组并添加注释
- 加载程序条目视图：实际 Cordis 加载程序条目的两列列表，受保护的条目显示为灰色，详细信息（id / 名称 / 描述 / 版本 / 存储库）

## 安装

来自GitHub：

```sh
dsh plugin --profile web add github:inks-knowledge/dsh-plugin-sorter
```

来自 npm（发布后）：

```sh
dsh plugin --profile web add dsh-plugin-sorter
```

然后重新启动DSH /桌面应用程序并打开**设置→插件排序**。

## 用法

1. 打开**设置 → 插件排序器**。
2. 在启用/禁用列之间拖动包。
3. 拖动已启用的包以更改加载顺序。
4. 单击包以获取详细信息和诊断信息。
5. 单击“**保存草稿**”保留您的编辑而不应用它们。
6. 单击 **保存** 将更改写入配置文件。
7. 手动重启DSH以使更改生效。

**Loader Entries** 部分显示底层 Cordis 加载器行：

- 活动条目列在左侧，禁用条目列在右侧。
- 受保护的架构条目呈灰色且无法切换。
- 单击条目可查看其 ID、名称、描述、版本和存储库。

## 发展

该插件是一个普通的 ESM DSH 捆绑包：

```text
lib/       host-side routes and profile logic
client/    browser bundle (window.__ModuleLoader__ format)
```

### 本地测试

```sh
# In a built DSH checkout:
node --expose-internals apps/cli/lib/bin.js web --port 3999
```

如果您想避免接触您的真实个人资料，请将 `DSH_HOME` 设置为测试主页。