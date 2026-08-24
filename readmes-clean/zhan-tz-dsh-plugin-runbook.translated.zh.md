# 运行手册

**DeepSeek Harness (DSH) 的 Jupyter 形研究表面。**

Vibe 编码的研究项目积累脚本、图形、JSON 文件、终端
日志和半成品目录的速度比人重建的速度快
故事。 Runbook 为这项工作提供了一个持久的、由 Git 支持的表面：研究
问题保持可见，脚本保持一个稳定的位置，每次运行都成为一次
执行记录，每个输出都可以作为证据进行追踪。

Runbook 故意不是文件浏览器、第二个聊天记录或
魔术项目总结。这是事实之上的一个小投影层
存在于DSH、Git、项目文档和观察文件中。

## 中心思想

工作单元不是新文件夹或文件名（例如 `final_v7`）。

### 研究意义·运行手册投影·真相来源
- **研究意义**：我们要决定什么？ · **运行手册投影**：问题/决策/开放问题指南针 · **事实来源**：作者 `README.md` 和 `STATUS.md`
- **研究意义**：我们能改变什么？ · **Runbook 投影**：稳定尝试单元 · **真相来源**：脚本路径及其当前的 Git 工作树
- **研究意义**：发生了什么？ · **Runbook 投影**：执行历史记录 · **事实来源**：DSH 运行事实和会话沿袭
- **研究意义**：它产生了什么？ · **Runbook 投影**：证据生成 · **事实来源**：观察到的输出路径、元数据和可选哈希
- **研究意义**：这是哪个版本？ · **Runbook 投影**：分支、提交和代理作者 · **事实来源**：Git

重新运行现有脚本将执行和输出生成添加到
同一个细胞。它不会创建另一个笔记本页面或鼓励另一个约会
目录。 Git 仍然是版本系统；文件名保留地址，而不是
版本。

## 当前表面包含什么

- **研究指南针** — 问题、当前答案和下一个答案
  区分步骤，创作来源仍然可见。
- **活笔记本单元** — 每个稳定脚本一个可读单元。每个细胞
  保留当前源、相关会话上下文、输出和先前的
  一起处决。
- **最近的视觉结果** — 最新的图像、PDF 和 HTML 输出
  活动会话沿袭位于指南针正下方，以便进行快速比较。
- **本地工件** — 对话生成的图像和 PDF 是
  显示在该转弯旁边，因此答案不会与其图形分离。
- **一个证据线程** — 结构主干、会话运行、Git 提交、
  当调查需要更多信息时，子代理和出处事实会扩展到位
  细节。没有竞争的图表页面。
- **安全重新运行** — Runbook 准备清单、显示审核并需要
  在执行支持的脚本之前进行短暂的确认。

## 正常的研究循环

1. 在 DSH 对话中打开 **Runbook / 运行本**。
2. 在打开长长的证据线索之前先阅读指南针。
3. 改进现有Attempt单元，当问题相同时；开始一个
   仅当问题、数据、环境或输出契约满足时才创建新分支
   真正不同。
4. 运行整个支持的入口点，检查计划并确认。
5. 将新证据与前几代证据和当前证据进行比较
   谈话的转折产生了它。
6. 将有意义的检查点保存到 Git。代理可以编写自己的提交；
   人类集成者可以仍然是提交者。

## 投影是如何构建的

```text
authored README.md / STATUS.md ─┐
DSH session + ancestors         ├─► one research workspace
observed executions / outputs  ┤       compass → Attempts → Evidence
Git branch / commits / authors  ┤       + one expandable evidence thread
bounded scan + optional PIPELINE ┘
```

项目事实池是持久的，但默认笔记本是血统感知的：
当前的 DSH 会话看到它自己的执行和祖先；兄弟会
被保留但折叠起来。仍然指向同一个 `cwd` 的两个会话
共享物理工作树和项目事实库。真正的同步文件
隔离需要 Git 工作树或单独的 DSH 工作区目标。

## 安装

来自GitHub：

```bash
dsh plugin --profile web add zhan-tz/dsh-plugin-runbook
```

重新启动选定的DSH表面，然后打开对话并选择
**运行手册/运行本**。

对于本地发展：

```bash
git clone https://github.com/zhan-tz/dsh-plugin-runbook.git
cd dsh-plugin-runbook
dsh plugin --profile web add link:"$PWD"
npm test
npm run check
```

包中声明了`dsh.bundle.patch`，所以正常安装DSH插件
自动安装所需的 Cordis 层。

## Safety and boundaries

- The browser never calls an arbitrary file-serving or shell HTTP route. RPC
  requests are bound to a persisted DSH session, and paths are contained inside
  that session's workspace.
- Text and media previews are bounded. Inline media currently has a 6 MiB
  limit; unsupported or larger files stay visible and can be opened in the
  system application.
- Reruns use the host's runner and session workspace, an environment allowlist,
  output/time bounds, and one-time confirmation. Runbook does not expose an
  arbitrary browser shell or execute fragments cut from a `# %%` file.
- Terminal text is only a fallback observation. Perfect producer/consumer
  provenance requires DSH tools or runners to emit structured artifact events.
- Static I/O inspection and an optional `PIPELINE.md` backbone are hints, not a
  proof of arbitrary dynamic I/O.

## v0.18.0

This release turns the recent notebook work into a coherent public surface:

- one integrated research workspace with a Question → Decision → Open Question
  compass;
- stable whole-script Attempt cells and immutable output generations;
- current-session-plus-ancestors projection, with sibling runs folded away;
- readable step titles while retaining exact paths for auditability;
- agent-aware Git authorship without overwriting the human/integrator identity;
- recent visual results and turn-local image/PDF artifacts restored at the two
  places where a researcher actually looks for them;
- session-bound preview, Git/structure inspection, native DSH subagent facts,
  and prepare → review → confirm reruns.

## 中文说明

Runbook 不是把文件夹再画一遍，也不是把聊天记录压缩成一张“当前态”卡片。它把
DSH 的会话、Git、项目文档和实际观测到的输出，投影成一个适合反复实验的研究工作面：

- 顶部先回答“研究什么、现在判断是什么、下一步怎么判别”；
- 同一个脚本稳定占据同一个 Attempt 格子，重跑只增加历史和 Evidence 代；
- 当前 session 及祖先组成工作线，旁支事实保留但默认收起；
- 最近图片/PDF 在罗盘下方可见，生成它的回合旁边也有缩略图；
- 需要追溯时再展开同一条证据脉络，看运行、Git、subagent 和文件关系；
- 大文件、未知格式或暂时无法内联的结果不会消失，而是交给系统打开。

它鼓励 agent 先复用现有脚本、输出和 Git 历史，但不禁止真正独立的问题另开分支。