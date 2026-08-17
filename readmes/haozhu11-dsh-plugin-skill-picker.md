# dsh-plugin-skill-picker

> 面向 **DeepSeek Harness Web 界面**（`dsh web`）的输入栏技能选择器插件：
> 在 composer 工具行（model 选择器旁边）加一个「技能」按钮，像选择模型一样
> 从下拉菜单点选技能，选中后自动把 `/技能名 ` 写入输入框。
> ⚠️ 第三方社区插件，非 DeepSeek 官方产品。
> 基于 [`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness) 构建。

## 功能

-  输入栏工具行右侧「技能」按钮（仿 model 选择器样式），点击弹出技能菜单
-  菜单数据与 `/` slash 菜单同源（`skill.list` RPC），支持搜索过滤（名称/描述，回车选第一项）
-  每个技能名下方显示**中文作用概述**（内置映射表；未收录的新技能自动回退英文原描述）
-  不可被模型调用的技能标注「仅用户 · 」前缀
-  选择后把 `/技能名 ` 写入草稿（自动补空格），可编辑后再发送
-  会话级缓存（single-flight），切换 agent 预设时失效、连接重置时清空
-  中英文双语 UI（跟随 Web 界面当前语言）

## 工作原理

- 纯浏览器端 Cordis client 插件，注册到 composer 工具行插槽 `conversation.input.right`
- 选中的 `/技能名` 是**普通草稿文本**：宿主侧 `dsh-tool-skill` 在 pre-step 手势边界
  按空白分词识别 `/技能名` token，并注入渲染后的 `<skill_content>`
- 因此**无需任何宿主侧改动**：菜单点选与手动键入 `/技能名` 走同一条确定性加载管线

## 环境要求

- 可运行的 `dsh web` profile（DeepSeek Harness ≥ 0.1.0-rc.6）
- `pnpm`（或带可写缓存的 `npm exec`）
- Chromium / Firefox 系浏览器

## 使用

1. 启动 `dsh web` 并打开界面。
2. 点击输入栏右侧的「技能」按钮（model 选择器旁）。
3. 在菜单中搜索或点选技能——输入框出现 `/技能名 `。
4. 补充你的问题内容，发送即可（技能说明会自动加载给模型）。

## 开发

```bash
git clone <仓库地址> && cd dsh-plugin-skill-picker
node build.mjs          # 构建一次 → dist/client.js
node build.mjs --watch  # 监听 src/client.js 变化自动重建
```

- 平时只需改 `src/client.js`（纯 JS + `React.createElement`，无 JSX/TS）。
- `dist/client.js` 有意提交进仓库，用户免构建即可安装。
- 改完 `src/` 后重新构建并重启 `dsh web`（或跑 harness 源码下的 `pnpm run dev:web` watcher 走热更新）。
- **新增技能的中文概述**：在 `src/client.js` 的 `ZH_DESC` 映射表中补一条（技能名 → 中文概述），未收录的技能自动显示英文原描述。

## 卸载

```bash
cd ~/.dsh/profiles/web
pnpm remove dsh-plugin-skill-picker
# 若手动加过，删除 cordis.patch.yml 里的 ui-skill-picker 行，重启 dsh web
```
