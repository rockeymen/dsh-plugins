# dsh-auto

DSH（DeepSeek Harness）的 `auto` 权限档位插件：在 read / write / full 三档之外新增一档，让 write 及以下的请求直接放行，write 以上的请求交给独立的分类器模型判断，不再打扰用户。

## 这是什么

参考 Claude Code 的 auto 权限语义：`auto` = workspace-write 沙箱 + 自动审批。相比 full 档的"无条件放行"，多了一层模型判断；相比手动审批，省去了每次升级都要等人点确认。

## 功能

- **write 及以下**：在 workspace-write 沙箱内直接执行，与平时无异。
- **write 以上**：模型用 `sandbox_permissions: "danger-full-access"` + `justification` 请求升级时，插件在命令分发前把**完整调用参数**和**最近对话上下文**（最近若干条用户/助手消息，条数与字符预算可配）一起交给分类器模型判断——允许则一次性放行，拒绝则命令不执行，模型直接看到拒绝理由（`Auto permission policy denied this escalation: ...`）。
- **情景判断，而非固定规则**：分类器根据上下文判断指令的可靠性，没有"无条件一律拒绝"的操作清单——用户明确、具体地给出路径或目标（如"删除 C:\xxx 文件夹"）时，不可逆操作也会被批准；用户意图模糊时只放行确定安全的部分（如删除用户点名的应用及其数据），范围之外的操作不予授权。
- **敏感操作 = 最高证据门槛**：向机器外发送凭据/密钥/个人数据、获取并运行不可信远程代码、修改安全/网络/系统级配置、提权类操作，只有在对话上下文显示用户明确点名要求该行为时才放行，否则拒绝——门槛更高，但不是固定清单。
- **其他审批询问**（如其他门禁返回的 ask）：同样由分类器按工具名 + 理由 + 上下文判断。
- **失败关闭**：分类器不可用时默认拒绝，绝不静默放行。
- 非 auto 会话完全不受影响。
- 分类器默认复用发起请求的 agent 的 provider/model，可用 `classifierProvider` / `classifierModel` 指定独立模型；上下文窗口可用 `classifierContextMessages` / `classifierContextChars` 调整。

## 安装

以 Windows + Web profile 为例（其他平台把 `%USERPROFILE%` 换成 `$HOME`）。

1. 克隆仓库并链接进 profile 的 node_modules（仓库自带预构建 `lib/`，开箱即用）：

   ```powershell
   git clone https://github.com/CH3SH-LC/dsh-auto.git
   New-Item -ItemType Junction -Path "$env:USERPROFILE\.dsh\profiles\web\node_modules\dsh-auto" -Target "<仓库路径>"
   ```

2. 在 `$DSH_HOME\cordis.patch.yml`（home 层，热重载）追加插件行和 `auto` 预设。patch 会**整体替换** `permission` 行的 config，预设表必须写全：

   ```yaml
   - insert:
       - id: dsh-auto
         name: dsh-auto

   - id: permission
     name: '@deepseek-ai/dsh-permission-presets'
     config:
       presets:
         read-only:
           sandbox: read-only
           approval: ask
         workspace-write:
           sandbox: workspace-write
           approval: ask
         auto:
           sandbox: workspace-write
           approval: ask
           name: auto
           description: Workspace writes run directly; escalations are judged by a classifier model.
         danger-full-access:
           sandbox: danger-full-access
           approval: never
   ```

3. 无需重启：在会话权限弹窗选择 **auto**，或发送 `/permission auto`。想让新会话默认 auto，在 `$DSH_HOME\settings.yaml` 加：

   ```yaml
   permission:
     defaultPreset: auto
   ```

## License

MIT
