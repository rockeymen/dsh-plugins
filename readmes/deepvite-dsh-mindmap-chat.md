# dsh-mindmap-chat

> 聊天分支树插件 · DeepSeek Harness 对话分支思维导图
>
> Chat branch tree plugin · Mind-map of conversation branches for DeepSeek Harness

**中文** | [English](README.en.md)

---

**dsh-mindmap-chat（聊天分支树）是一款 DeepSeek Harness 对话分支管理插件：它把同一棵对话树上的所有分支以思维导图方式实时展出——主干是一条贯穿所有轮次的主线，分叉在同一水平线上发芽，每个分支占用独立一列；新分支只显示分叉后的内容，兄妹分支完全并行时对齐在同一水平线上。它还支持按「组」归档管理、分支归属到组、压缩前内容回看、关键词搜索与会话归档/删除。**

**dsh-mindmap-chat (Chat Branch Tree) is a conversation-branch manager for DeepSeek Harness: it renders every branch of the same conversation tree as a live mind-map. The trunk is the main vertical line spanning all rounds; forks sprout on the same horizontal line; each branch occupies its own column and a new branch shows only its post-fork content; fully-parallel siblings align on the same horizontal line. It also features group-level archiving, re-parenting branches into groups, pre-compaction review, keyword search, and session archive/delete.**

---

## ✨ 功能介绍

### 1. 思维导图视图（Flowith 风格实时树）
- 主干 = 主线，贯穿所有轮次；分叉在**同一水平线**上生长
- 分支一列只占一列，列头显示分支编号，按创建时间排布
- 新分支只显示**分叉后的内容**；主干归档后最原生的分支自动成为新主干
- 完全平行的兄妹分支对齐在同一水平线；重叠时后面的分支自动下移

### 2. 左侧会话管理树（组）
- 会话按「组」聚合，两个成员以上的组显示为可折叠的组文件夹
- 「更多」菜单可将任意会话**归属到组**：选择合并全部相关分支（是）或仅移动当前会话（否），子会话自动顶替原位
- 支持归档、删除（终端软删除）与压缩前内容折叠块（默认展开/折叠可切换）

### 3. 压缩支持
- 压缩后的历史以「压缩前摘要」折叠块展示，默认展开还是折叠可配置
- 「压缩这个节点」可在导图中直接触发会话压缩（需对话环境已挂载压缩服务）

### 4. 搜索与提示
- 关键词搜索会话，快速定位并跳转
- 导图提供加载性能提示：分支越多，加载与渲染越慢；约 7–8 个分支时完整加载渲染可能长达 20 秒

---

## 🚀 安装（一键）

要求：已安装 DSH 且使用 web profile。

```bash
# 通过 npm（推荐）
npm exec -- dsh plugin --profile web add dsh-mindmap-chat

# 或通过 GitHub 仓库
npm exec -- dsh plugin --profile web add https://github.com/DeepVite/dsh-mindmap-chat.git
```

安装后**刷新浏览器**即可看到效果。若 git 安装提示 pnpm 拦截构建脚本，按提示把包名加入 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 后再试。

> 本插件源码为纯 JavaScript 单文件（client / host 各一份，无构建步骤），`src/` 与 `lib/` 内容一致。

## 🔄 更新

```bash
npm exec -- dsh plugin --profile web update dsh-mindmap-chat
```

---

## 📸 界面预览

- **侧栏**：会话管理树，含组文件夹、分叉标记与运行状态圆点
- **导图**：顶栏「放大」旁点击可打开思维导图画布；点击「提示」可查看加载性能说明
- **对话头部**：「导图视图」与「对话详情」按钮分别打开画布和详情抽屉

---

## 📄 许可证

本项目采用 **Apache License 2.0**，详情见 [LICENSE](LICENSE)。

© 2026 DeepVite · ibronfree@gmail.com
