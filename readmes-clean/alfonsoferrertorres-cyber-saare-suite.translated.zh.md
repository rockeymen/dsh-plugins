#S.A.A.R.E.企业套件-L7人工智能治理

> **LLM 和 DeepSeek Harness (dsh) 生态系统的边界控制、PII 的确定性编辑和加密取证证据。**

## ⚡ 与 DeepSeek Harness (DSH) 集成

该存储库充当 DeepSeek Harness 代理的官方安全插件。在发送令牌之前启用 HMAC-SHA256 加密密封和敏感数据的编辑。

### 安装治理插件

````bash
dsh 插件添加 @saare/dsh-governance-plugin