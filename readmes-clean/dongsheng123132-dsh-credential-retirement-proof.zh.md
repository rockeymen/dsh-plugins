# dsh-credential-retirement-proof

离线、确定性的凭据退役证据层：只核验 supplied rotation manifest 是否在全部声明消费者上启用新凭据、拒绝旧凭据、满足重叠窗口，并形成新鲜的零残留闭合。输入和报告只有哈希与有界公开元数据，绝不包含秘密。

它不是第三个密钥轮转器。现有 `dsh-key-rotation`、`dsh-llm-key-rotation` 会做池切换和故障转移；本插件不签发、不分发、不切换、不撤销、不探测、不查询线上系统，只复算回执判决。

DSH 工具为 `dsh_credential_retirement_inspect` 与 `dsh_credential_retirement_verify`，MCP 提供等价的只验证工具。报告明确保留 `authenticatesReceipts: false`、`provesConsumerSetExhaustive: false`、`provesAbsenceOfUndeclaredBindings: false`。