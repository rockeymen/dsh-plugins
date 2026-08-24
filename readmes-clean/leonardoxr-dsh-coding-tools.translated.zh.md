#dsh-coding-tools

一个 [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/) 主机插件，带有范围狭窄的设置卡，可在不修改 DSH 的情况下添加紧凑的、有界的编码工具：

- `code_read` — 具有精确字节版本标记的 UTF-8 代码窗口
- `edit_ranges` — 具有操作员可配置批准的原子、观察范围编辑
- `ast_grep` — 将 ast-grep CLI 固定在一个提供程序读取文件快照上，具有分页和只读进程限制
- `lsp` — 使用有界 JSON-RPC 的持久只读语言服务器查询
- 当匹配的 LSP 服务器已处于活动状态时，插件拥有的编辑后的新诊断摘要

`ast_edit` 和 DAP 调试故意**未在安全初始版本中注册**。浏览器捆绑包仅限于“编码工具设置”卡。

## 要求

- Node.js 22.19+ 或 24+
- DeepSeek Harness 0.1.1-rc.2或兼容的公共服务合同
- DSH 配置文件，提供 `tools`、`fs`、`sandboxPolicy`、`sandbox`、`approval`、`spillStore`、`subprocess` 和 `settings`（库存 Web 配置文件提供）
- 由配置文件操作员配置的可选绝对路径语言服务器可执行文件

## 安装

构建本地结帐，然后使用支持的配置文件命令将其注册到 DSH 配置文件中：

```powershell
pnpm install
pnpm check
dsh plugin --profile web add "C:\absolute\path\to\dsh-coding-tools"
```

该包提供 [`cordis.patch.yml`](cordis.patch.yml)，它插入包前缀行 `dsh-coding-tools`。主机插件更改后重新启动 Web 配置文件。原始源补丁本身并不是包注册。

对于已发布或 Git 安装，固定发布或提交而不是浮动分支。

## 配置

可扩展的**编码工具**卡出现在**设置→插件→插件配置**中。它为 `code_read`、`edit_ranges`、`ast_grep` 和 `lsp` 提供开关，以及单独的 **需要编辑批准** 和 **需要流程启动批准** 控件。批准提示默认开启。高级限制和语言服务器计划仍然是配置文件配置。保存的设置保留在 DSH 的用户层中并实时应用：禁用的工具将被取消注册，启用的工具将被注册，并且进程支持的资源将被停止或重新创建，而无需重新启动 DSH Web。重新配置会取消正在进行的读取和查询，排出可能已提交的编辑，并使现有游标和 `code_read` 版本令牌无效。

配置文件补丁层可以使用显式基本配置替换插入的行：

```yaml
- insert:
    - id: dsh-coding-tools
      name: 'dsh-coding-tools'
      config:
        inlineMaxBytes: 8192
        approvals:
          editRanges: true
          processStart: true
        codeRead:
          enabled: true
          defaultLines: 200
          maxLines: 2000
          maxBytes: 262144
          snapshotMaxBytes: 67108864
        versionedEdit:
          enabled: true
          requireObservedRanges: true
          maxOperations: 100
          maxChangedBytes: 1048576
          diagnosticsOnWrite: true
        ast:
          grepEnabled: true
          executable: '' # empty = pinned @ast-grep/cli binary
          maxFileBytes: 2097152
          maxMatchesPerPage: 50
          maxTotalMatches: 5000
          timeoutMs: 30000
        lsp:
          enabled: true
          servers:
            clangd:
              command: '/absolute/path/to/clangd'
              args: ['--background-index=false']
              extensions: ['.c', '.cc', '.cpp', '.h', '.hpp']
              languageId: 'cpp'
              env: {}
          maxOpenDocuments: 64
          maxDocumentBytes: 16777216
          maxDiagnosticBytes: 4194304
        debug:
          enabled: false
```

配置中的可执行路径必须是绝对路径。存储库文件从不选择二进制文件或注入命令行参数。环境条目是明确的； DSH 的子流程提供程序会在应用环境凭据形状变量和 `DSH_*` 变量之前将其删除。

参见【配置参考](docs/CONFIGURATION.md)。

## 工具工作流程

### 精确读取和编辑

1. 用 `file` 调用 `code_read`，可选单索引 `offset` / `limit`。
2. 保留返回的`version`。
3. 使用完全相同的 `file`、`version` 和非重叠操作来调用 `edit_ranges`。
4、在只读会话下，用`sandbox_permissions: workspace-write`和`justification`中的一句话重试一次被拒绝的呼叫；沙箱升级始终需要自己的一键批准。在已可写会话下，仅当启用 `approvals.editRanges` 时才需要普通突变提示。

禁用普通编辑批准不会扩大沙箱策略。标准 DSH 升级字段仅适用于一次呼叫，并且始终保留批准；仅当安装的文件系统报告沙箱强制执行时，才会公布它们。裸文件系统无法升级，并且在只读策略下无法关闭。源更改操作必须仅引用 `code_read` 针对相同所有者、规范目标和确切版本返回的行范围。 `append` 是唯一的观察范围例外，但仍然需要观察版本。所有操作都会在一次提供程序版本保护的原子写入之前进行验证。

线路操作语义：

- `replace`：替换包含整行并保留以下行分隔符
- `delete`：删除包含整行
- `insert_before` / `insert_after`：使用文件的主导分隔符插入线形文本
- `append`：附加文本，当文件缺少最终分隔符时添加一个主要分隔符

BOM、现有未更改的行结尾和 UTF-8 字节将被保留。无效的 UTF-8 和带有 NUL 的二进制文件无法关闭。成功发布总是返回`applied: true`； `intendedVersion` 始终被识别，而 `newVersion` 仅在验证落地读取后才出现。 `landedExact` 和 `postWriteWarning` 使任何提交后验证或诊断问题变得明确，因此调用者不会盲目重试已提交的写入。

### 结构搜索

`ast_grep` 接受一种模式、`paths` 中的一个常规工作区文件、所需的语言、可选的严格性、页面限制和所有者范围的游标。在启动之前：

- 通过 `ctx.fs` 解析文件并证明规范的工作空间包含
- 拒绝显式符号链接和目录
- 执行稳定的、有字节限制的提供程序读取
- 通过 stdin 将不可变快照传递给 ast-grep，而不是作为进程路径
- 强制执行结果、捕获、光标、输出和时间上限
- 当启用 `approvals.processStart` 时请求一次启动该进程，并且始终强制完全只读 DSH 限制

广泛的目录扫描被故意关闭。 DSH 当前不公开原子进程读取白名单/开放句柄合约，因此将工作空间路径传递给后续进程将导致读取端 TOCTOU 竞争。使用显式 `limitReasons` 或 `parseErrors` 报告不完全覆盖。

### 语言服务器

`lsp` 支持 `hover`、`definition`、`references`、`symbols` 和 `diagnostics`。配置的服务器会延迟启动，在启用 `approvals.processStart` 时请求一次性批准，范围保持为所有者 + 规范工作区 + 配置文件，并在空闲超时或插件处置时停止。

客户端不通告任何编辑或命令功能。服务器对 `workspace/applyEdit` 的请求被显式拒绝；动态功能、终端启动、工作区命令和未知服务器请求永远不会执行。会话工作区之外的结果将被丢弃。

仅当服务器提供的版本对应于当前同步文档版本时，诊断才会被标记为最新。无版本诊断永远不会被证明是新鲜的；它们可能会作为覆盖不完整的陈旧证据被退回。诊断已进行重复数据删除并按错误优先顺序排列。

＃＃ 安全

阅读【安全模型](docs/SECURITY.md)和【公共合约矩阵](docs/PUBLIC_CONTRACTS.md)】。默认情况下启用批准提示。操作员可以单独显式禁用普通编辑和流程启动提示；精确版本观察、原子提供程序写入、绝对可执行计划、有界执行和完全只读进程限制仍然是强制性的。沙箱升级审批永远不会被绕过。

## 发展

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
```

该存储库独立于 DSH 源签出。切勿修补 DSH 来安装它。