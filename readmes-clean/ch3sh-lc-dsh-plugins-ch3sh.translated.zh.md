# dsh-plugins-CH3SH

我（[CH3SH-LC](https://github.com/CH3SH-LC)）为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）开发的插件目录。

本仓库仅作索引，不含插件代码；各插件的源码与使用说明在各自的独立仓库中。

## 插件列表

### 插件 · 仓库 · 说明
- **插件**: dsh-enter · **仓库**: [CH3SH-LC/dsh-enter](https://github.com/CH3SH-LC/dsh-enter) · **说明**: DSH Web GUI 客户端插件：在输入框按**左 Ctrl+Enter** 插入换行（与 Shift+Enter 一致），右 Ctrl+Enter / Cmd+Enter 仍保持加速发送。
- **插件**: dsh-auto · **仓库**: [CH3SH-LC/dsh-auto](https://github.com/CH3SH-LC/dsh-auto) · **说明**: DSH 的 `auto` 权限档位插件：在 read / write / full 之外新增一档，write 及以下的请求直接放行，write 以上的升级请求交给独立分类器模型自动审批；分类器不可用时失败关闭，绝不静默放行。

## 计划中

- 待补充