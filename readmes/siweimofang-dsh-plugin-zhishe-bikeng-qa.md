# dsh-plugin-zhishe-bikeng-qa

知设装修避坑问答插件 — 基于 3352 条行业知识库的装修施工避坑智能问答。

> 装修行业的 DeepSeek Harness 插件，回答水电、瓦工、木工、油漆、防水、验收等全工种避坑问题，以专业顾问口吻给出可操作建议（含具体数据标准）。

## 功能

| 工具名 | 说明 |
|---|---|
| `bikeng_qa` | 装修避坑问答：输入问题返回结构化避坑建议（回答 + 风险等级 + 相关避坑要点） |
| `bikeng_checklist` | 装修验收清单：按阶段生成标准化验收 checklist（水电/瓦工/木工/油漆/卫浴/地板/竣工） |

## 部署平面

- **目标平面**: 会话级工具插件（形态 A）
- **对外发布服务**: 否，仅注册 DSH 工具
- **兼容版本**: `@deepseek-ai/dsh >= 0.1.0-rc.6`

## 安装

```bash
# 1. 进入插件目录安装依赖
cd dsh-plugin-zhishe-bikeng-qa
npm install

# 2. 注册到 profile
dsh plugin --profile <profile> add ./dsh-plugin-zhishe-bikeng-qa

# 3. 编辑 agent 预设 YAML，追加：
```

```yaml
plugins:
  zhishe-bikeng-qa:
    knowledgePath: data/knowledge.json   # 知识库路径（可选）
    maxResults: 5                        # 最大返回条目数（可选）
    deepAnalysis: true                   # 深度风险分析（可选）
    tone: professional                   # professional=专业顾问 / concise=简洁（可选）
```

> 注意：配置为浅层键值替换，修改配置后需新会话生效（预设树在实例创建时锁定）。

## 配置项

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `knowledgePath` | string | `data/knowledge.json` | 知识库 JSON 文件路径 |
| `maxResults` | number | `5` | 检索最大返回条目数 |
| `deepAnalysis` | boolean | `true` | 是否附加风险提示分析 |
| `tone` | enum | `professional` | 回答风格：`professional`/`concise` |

## 知识库格式

`knowledge.json` 支持两种格式：

1. 数组格式：`[{ "question": "...", "answer": "...", "tags": [...], "category": "..." }]`
2. 对象格式：`{ "分类名": [{ "question": "...", ... }] }`

内置知识库可从 [zhishe-a2a](https://github.com/zhishe-ai/zhishe-a2a) 获取（3352 条装修行业实战条目）。

## 使用示例

用户提问：`防水怎么做才不漏水？`

工具返回：
- **answer**: 基于知识库的避坑回答（专业顾问口吻）
- **risk_level**: 高（命中"漏水"风险词）
- **related_pitfalls**: 相关避坑要点列表
- **source_count**: 参考条目数

## License

MIT
