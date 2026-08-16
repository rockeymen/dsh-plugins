# dsh-chinese-mode

DeepSeek Harness Web 全局中文模式插件：在输入框权限选择后提供一个「中」字开关，开启后向**任意 preset** 的 system prompt 注入中文要求。

## 功能

- **全局且持久化**：开关存于宿主侧设置（`dsh-chinese-mode` 命名空间），对所有会话生效。
- **无条件注入**：开启即注入，不做「已有中文」检测；注入位置在 persona 之前。
- **任意 preset 均生效**，包括 complete persona。
- **锚定模式感知**：梁神 / 锚定 preset 首轮晋升前跳过注入，晋升后自动生效。
- **关闭即移除**：关闭开关后从后续组装中移除该 section；不翻译历史消息，也不插入可见聊天内容。

## 安装

插件市场上架后可一键安装，或命令行：

```bash
dsh plugin --profile web add github:dawnliming/dsh-chinese-mode
```

安装后重启 `dsh web`，在输入框权限选择后拨动「中」开关即可。

## 设置字段

### 字段 · 默认 · 说明
- **字段**: `enabled` · **默认**: `false` · **说明**: 总开关（「中」滑块）。
- **字段**: `text` · **默认**: （中文要求文案） · **说明**: 注入 system prompt 的具体文本。
- **字段**: `anchoredPresetKeywords` · **默认**: `liangshen, 梁神, anchored, 锚定` · **说明**: 视为锚定模式的 preset 名称关键词。
- **字段**: `skipAnchoredFirstRound` · **默认**: `true` · **说明**: 锚定 preset 首轮（晋升前）跳过注入。
- **字段**: `force` / `customKeywords` · **默认**: — · **说明**: 兼容保留，已不再参与注入逻辑（注入为无条件）。

## 原理

宿主侧包装 `systemPrompt.assemble` 并监听官方 `system-prompt/assemble` waterfall 事件，在组装完成后把 `dsh-chinese-mode:language` section 插到 persona 之前（或追加到末尾），从而保证发给模型的 `system` 消息始终携带中文要求。客户端渲染绑定到 `dsh-chinese-mode` 设置命名空间的「中」开关。

## 开发

- 宿主：`lib/index.js`
- 客户端：`lib/client.js`（ModuleLoader bundle，修改后需重新构建）
- 本地安装到 profile（`file:` 依赖）：

```bash
cd ~/.dsh/profiles/web
pnpm add file:../../plugins/dsh-chinese-mode
# 并在 package.json 的 dsh.profile.bundles 加入 "dsh-chinese-mode"（或让 dsh 自动 reconcile）
```