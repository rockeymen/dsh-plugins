#dsh-plugin-lookatstudy

将任何 Markdown 文档、本地文件夹或 GitHub 学习存储库转变为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 内的指导课程 — 您的 dsh 代理将成为一名完整的 AI 导师，其交互设计为 [LookatStudy](https://github.com/Kaiji-Z/LookatStudy)：每个概念的知识跟踪、掌握驱动的进展、间隔重复、掌握建议、摩擦意识、学习者记忆、康奈尔笔记本和聊天中的求婚卡。学习引擎模块由 LookatStudy (MIT) 提供。

## 安装

```sh
dsh plugin add dsh-plugin-lookatstudy        # from npm
# or from a tarball:
dsh plugin add ./dsh-plugin-lookatstudy-0.2.1.tgz
```

适用于任何配置文件。在 `web` 配置文件中，插件还提供学习选项卡的 HTTP API 并加载其浏览器一半；无头型材获得平坦的工具表面。

## 两个表面

**1.导师（聊天）。** 与代理交谈：*“导入 https://github.com/microsoft/AI-For-Beginners 并教我第 1 课”*，*“今天应提交哪些评论？”*。导师角色（稳定核心+三个灵魂之一 - `guide` 引导 / `direct` 精讲 / `practice` 实战）驱动整个 LookatStudy 循环：

- **知识成分 (KC)** — 在第一次教授课程时，导师得出 2-7 个概念 (`study_define_concepts`)；每个评分答案都有归属（`study_record_answer` 和 `concept`）；按概念 BKT 运行，**课程掌握程度是最弱的概念** — 测验首先针对较弱的概念。
- **掌握驱动的进展** — ≥50% 提前解锁下一课； ≥90%毕业生并安排第一次SM-2审核；答案也会推动审查时间表。
- **掌握建议（建议 → 应用）** — ≥85% 加上令人信服的费曼式解释，导师建议提前毕业并 **等待学习者是/否**；只有明确的决定才适用它。
- **摩擦意识** - 困惑/阻碍/沮丧会被默默地记录下来 (`study_report_friction`) 并作为 ⚡😣 弱点出现。
- **学习者记忆** — 三个插槽（全局样式/每门课程模式/每课间隙），读取-合并-写入 (`study_remember`)。
- 动态的**学习者快照**（焦点、策略带、弱概念、摩擦、记忆、到期计数、待决提案）每轮都会作为运行时上下文注入。

**2. “学习”选项卡 (`dsh.client`)。 ** 整个插件位于一个对话视图选项卡中 - 「学习」 - 一个简化的 LookatStudy，分为三列，完全采用 dsh 的 `--dsw-*` 令牌进行样式设计；选项卡之外的任何内容都不会修改 dsh chrome：

###专栏·你得到什么
- **栏**：左·课程·**你得到什么**：课程选择器，进度，一键复习开始的到期框，课程树（门控，掌握条，⚡😣弱点，可点击焦点），空时一键演示导入
- **专栏**：中·老师·**你得到什么**：实时导师对话的只读迷你记录（通过插件的markdown管道呈现的助理回复，作为芯片的工具调用，包括流媒体）加上灵魂丸（直讲/引导/实战），焦点课程的开场白和掌握提案横幅（接受/练再练）。键入发生在选项卡下方的 dsh 自己的编辑器中 - 该插件从不发送自己的输入；每个按钮都会将其文本放入本机编辑器中，并通过与“发送”按钮相同的路径提交
- **专栏**：右·黑板·**你得到什么**：焦点课程的讲解（服务器清理的markdown）和康奈尔笔记三个区域

导师栏是一个学习界面，而不是一般的聊天：导师的测验选项（A-D）在最新回复下呈现为可点击的答案按钮（点击通过本地作曲家发送答案），评分答案显示为带有测试概念的✓/✗芯片，每个课程树字形、标签和掌握栏都带有一个悬停工具提示解释其含义。所有内容文本均以 dsh 聊天记录自己的 16 像素运行。

所有研究状态均来自对 `/lookatstudy/api/state` 的一项共享 3 秒民意调查；输入是 dsh 第一回合的原生作曲家（无激活步骤）。列堆叠低于 1024 像素。

## 工具表面 (19)

导入：`study_import_markdown` / `study_import_folder`（9 个文档 + 30 多种代码格式；不支持 PDF/PPTX）/`study_import_github`（jsDelivr CDN，在 github.com 无法访问的情况下工作）
学习：`study_courses`、`study_map`、`study_lesson`
进度：`study_define_concepts`、`study_record_answer`、`study_complete_lesson`
建议：`study_propose_mastery`、`study_resolve_proposal`
评论：`study_due_reviews`、`study_record_review`
认识：`study_report_friction`、`study_remember`、`study_notes`、`study_note_save`
其他：`study_set_mode`、`study_delete_course`

## 配置（cordis.yml 补丁层）

```yaml
- id: lookatstudy
  name: dsh-plugin-lookatstudy
  config:
    mode: guide          # direct | guide | practice — initial soul; persists in state afterwards
    statePath: ''        # default: $DSH_HOME/lookatstudy-plugin/state.json
```

## 故意不恢复的内容

LookatStudy 的 Electron-native 体验在 dsh 中没有宿主表面：使用 DOM 锚点、庆祝粒子、条纹/XP 游戏化（其效果取决于 UI）、考试模式和多模式课程图像持续突出显示文本。其他一切——引擎、合约、数据模型——都被移植了。

＃＃ 发展

```sh
pnpm exec tsdown        # build lib/ (host + client entries, peers external)
pnpm test               # 48 node:test cases over the real source (no key needed)

# iterate against a live dsh (this repo lives beside a deepseek-harness checkout):
pnpm dsh web --patch ../dsh-plugin-lookatstudy/cordis.dev.yml   # run from the harness checkout
# then open http://127.0.0.1:3080/ and switch to the 学习 tab
```

布局：`src/index.ts`中的角色+快照上下文，`src/tools.ts`中的工具，`src/state.ts`中的状态转换，`src/dashboard.ts`中的研究选项卡的HTTP API，`src/markdown.ts`中的清理标记（由主机路由和客户端包共享），`src/client/`中的浏览器一半（`index.ts`选项卡注册，`views.tsx`三列选项卡）加上纯 `transcriptRows` 折叠、`data.ts` 共享投票存储、`styles.ts` 注入的 `--dsw-*` 样式表）、`src/cards.ts` 中的 UI 卡投影、`src/vendor/` 中供应的零依赖引擎（请参阅每个文件的出处标头；对文件夹扫描仪的重复数据删除密钥的一个本地修改记录在此处）。

发布说明：`exports` 必须保留 `"./package.json": "./package.json"` — Web 捆绑包的客户端模块扫描程序会解析它以发现 `dsh.client` 浏览器一半。将重建的 tarball 重新安装到配置文件中时，请先删除旧的 tarball 或升级版本（pnpm 重复使用相同规格的 tarball）。