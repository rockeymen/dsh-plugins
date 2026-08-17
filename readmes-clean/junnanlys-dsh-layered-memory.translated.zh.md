# Layered memory plugin for DeepSeek Harness (dsh)

DeepSeek Harness (dsh) 的分层内存插件 — 自动将对话提取到 L0-L3 内存中（原始对话 → 原子事实 → 场景 → 角色），并在每个模型步骤之前注入相关上下文。 Pipeline从MemoryCore（TencentDB-Agent-Memory）移植而来。