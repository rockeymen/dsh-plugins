#dshbase-catalog

从 DeepSeek Harness 内部查询 [dshbase](https://dshbase.com) 插件目录 - 搜索、列出并获取 1,100 多个社区插件的安装命令，而无需离开会话。

## 安装

```bash
dsh plugin add dshbase-catalog
```

## 工具

### 工具·说明
- **工具**：`search_dsh_plugins` · **描述**：跨插件名称+描述的全文搜索
- **工具**：`get_dsh_plugin` · **描述**：查找一个插件：安装命令、验证状态、统计信息
- **工具**：`list_dsh_plugins` · **描述**：按类别列出插件
- **工具**：`get_dsh_stats` · **描述**：目录总数（插件、npm vs git、验证）
- **工具**：`get_dsh_categories` · **描述**：所有带有计数的类别

## 数据

目录快照每天从实时 [dshbase](https://dshbase.com) 目录（请参阅 `scripts/sync-catalog.py`）重新生成，因此内置索引保持最新状态。