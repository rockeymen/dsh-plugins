# dsh-pi-tui

[pi 的 TUI](https://github.com/earendil-works/pi/tree/main/packages/tui)（`@earendil-works/pi-tui`）驱动的 DeepSeek Harness 终端前端：界面是 pi 的观感（品牌蓝 prompt、流式 Markdown、thinking 折叠、工具调用卡片、微分渲染防闪烁），内核（模型路由、工具、会话持久化、slash 命令、审批）全部由 dsh 官方机制提供。

## 安装

前置：官方 [`dsh`](https://github.com/deepseek-ai/deepseek-harness) CLI（`npm i -g @deepseek-ai/dsh`）与 `pnpm`。

```sh
dsh plugin --profile pi-tui add dsh-pi-tui   # 自动初始化 profile 并挂为 bundle
dsh --profile pi-tui                          # 新会话
dsh --profile pi-tui --resume <session-id>    # 恢复指定会话
dsh --profile pi-tui --resume                 # 从持久化会话列表中选择
dsh --profile pi-tui --preset             # 选择 agent preset（standard/minimal/code）
dsh --profile pi-tui --preset                 # 从 preset 列表中选择
```

会话与 web profile 共享 `~/.dsh/sessions` 持久化存储，两端互通。

## 键位

### 按键 · 功能
- **按键**: `Enter` · **功能**: 提交（`Shift+Enter` 换行）
- **按键**: `Esc` · **功能**: 中断当前 turn / 取消自动补全 / 退出工具卡片浏览 / 清除搜索高亮
- **按键**: `Ctrl+C` · **功能**: 运行中→中断；有文字→清空；已空→再次按下退出
- **按键**: `Ctrl+D` · **功能**: 编辑器为空时退出（非空时删除字符）
- **按键**: `Ctrl+T` · **功能**: 展开/折叠 thinking 块
- **按键**: `Ctrl+O` · **功能**: 展开/折叠工具完整输出 / diff
- **按键**: `Ctrl+F` · **功能**: 在 transcript 内搜索（输入即跳转，↑/↓ 循环，Enter 确认，Esc 关闭）
- **按键**: `Alt+C` · **功能**: 复制最后一条 assistant 消息（OSC 52 三路剪贴板）
- **按键**: `Ctrl+L` · **功能**: 打开模型选择器
- **按键**: `Ctrl+R` · **功能**: 搜索消息历史：本会话 + 最近持久化会话的首条消息（选中载入输入框）
- **按键**: `↑` / `↓` · **功能**: 浏览当前会话的消息历史（恢复/切换后自动载入）
- **按键**: `Ctrl+Z` · **功能**: 挂起到后台（`fg` 恢复）
- **按键**: `Ctrl+G` · **功能**: 用 `$EDITOR` 编辑输入
- **按键**: `Shift+Tab` · **功能**: 循环会话 mode（normal ↔ plan）
- **按键**: `Ctrl+X` · **功能**: 循环思考强度（off→high→max）
- **按键**: `Tab` · **功能**: 补全（slash 命令 / 路径型 token；普通单词不触发）；空编辑器时循环工具卡片焦点（`Enter` 展开）
- **按键**: `@` · **功能**: 文件提及菜单（搜索框 fuzzy 过滤，选中即插入）
- **按键**: `!` / `!!` · **功能**: 直接执行 shell 命令（用户全权；`!!` 输出不进模型上下文）

## 命令

### 命令 · 功能
- **命令**: `/model [query]` · **功能**: 切换模型（无参数弹选择器；下一步生效）
- **命令**: `/thinking off\ · **功能**: high\ · max` · 设置思考强度（下一步生效）
- **命令**: `/skills` · **功能**: 列出人类可调用技能
- **命令**: `/new` · **功能**: 新会话
- **命令**: `/fork` · **功能**: 当前会话末尾 fork（保留历史，记录 lineage）
- **命令**: `/resume [query]` · **功能**: 列出/恢复持久化会话
- **命令**: `/tree` · **功能**: 子代理会话树
- **命令**: `/agents` · **功能**: 列出 live 子代理
- **命令**: `/jobs` · **功能**: 列出后台任务
- **命令**: `/export` · **功能**: 导出 transcript 为 markdown
- **命令**: `/rename <title>` · **功能**: 重命名会话（官方 sessionTitle 服务）
- **命令**: `/copy last\ · **功能**: tool\ · error\ · id\ · resume` · 复制到剪贴板（assistant 文本 / 工具结果 / 错误 / id / resume 命令）
- **命令**: `/retry` · **功能**: turn 失败后重发最后一条人类提示
- **命令**: `/expand-all` · **功能**: 切换长会话折叠（旧消息折叠，显示全部）
- **命令**: `/permission [preset]` · **功能**: 官方权限 preset 切换（workspace-write / danger-full-access…）
- **命令**: `/hotkeys` · **功能**: 显示键位表
- **命令**: `/compact` `/goal` `/plan` `/feedback` · **功能**: 官方 dsh 命令（自动发现）

模型/思考强度切换通过官方 `installModelSelection` 链路（与 web/grok 客户端同款），无需 fork 会话；会话与 web profile 共享 `~/.dsh/sessions` 持久化存储。

## 功能

- 流式渲染：`assistant/chunk` 增量 → Markdown、thinking 折叠标签
- 工具调用卡片：运行/成功/失败三态 + 参数与结果预览；Ctrl+O 展开完整输出；write/edit 结果带**彩色 diff 高亮**（官方 meta.diffs）
- `read_image` 结果在 kitty/iTerm2 终端内联渲染图片（Ctrl+O 展开）
- slash 命令：`/compact` `/goal` `/plan` `/feedback` 等全部来自官方 `ctx.commands` 注册表（自动补全 + 动态发现）
- 权限审批弹窗（`approval/request`）与 `ask_user_question` 交互表单（选项/多选/自由文本；plan-review 特化弹窗）
- 会话管理：创建、恢复、fork、子代理树、选择器（官方持久化后端；resume 选择器显示官方自动标题）
- 转录搜索：`Ctrl+F` 在 transcript 内搜索并跳转（输入即定位 + 高亮，↑/↓ 循环）；`/retry` 一键重发失败 turn；`/copy` 复制 assistant/工具结果/错误/id/resume 命令（OSC 52 三路剪贴板）
- 长会话折叠：消息超过阈值自动折叠旧消息（`/expand-all` 展开）
- 状态栏：provider/model、preset、plan 指示、goal 状态、上下文压力 `ctx N%`、会话 id、git 分支、token 统计、todo 进度、后台任务计数（全部来自官方 projection/jobs 服务）
- 转场提示：compaction 检查点、turn 失败/中止/超长提示
- 启动 banner：品牌蓝 ASCII 鲸鱼 + 会话信息 + 键位提示 + 持久化会话提示（boot 与会话切换时）
- 权限：官方 `/permission `（沙箱模式 + 审批策略捆绑切换），状态栏显示当前 preset

## 支持矩阵

### dsh · node · 状态
- **dsh**: 0.1.0-rc.6 · **node**: >= 22.19（CI 跑 22/24） · **状态**: ✅ 测试通过
- **dsh**: 其他 rc · **node**: — · **状态**: 未验证，欢迎反馈

发布：npm 上的每次发版由 GitHub Actions 经 [npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers)（OIDC）发布，带 provenance 签名——打 `v*` tag 即发布，无任何 token。

## 开发

```sh
npm install && npm run build && npm test
# 本地联调：profile 里是 link: 软链，重新 build 后直接重启即可
```

代码规范（提交时 pre-commit hook 会自动对暂存文件跑 `eslint --fix` + `prettier --write`）：

```sh
npm run lint         # ESLint flat config，含 type-aware recommendedTypeChecked
npm run lint:fix     # 自动修复可修问题
npm run typecheck    # tsc 对 src + test 做类型检查
npm run format       # Prettier 统一格式
npm run format:check # 校验格式
```

CI 对每个 PR 跑 `lint + typecheck + build + test`。详细约定见 [AGENTS.md](AGENTS.md)。