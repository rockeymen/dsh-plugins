![xskill — One solves it. Everyone gets it.](docs/assets/header.png)

[English](./README.md) · **简体中文**

  ![一个 coding agent 列出 xskill 从过往会话里蒸馏出的 Skill](docs/assets/demo.gif)

## 动态

- **2026-08-17** — `v0.6.32a1`：流水线按新轨迹先拆先归；看板可热改席位和配额比；generate 等大模型时硬优先；已达触发条件的 import 技能优先占编辑座。详见 [Release notes](https://github.com/SkillNerds/xskill/releases/tag/v0.6.32a1)。
- **2026-08-14** — `v0.6.31`：`xskill rebuild --force` 不再因 `.git/objects` 非空中断；全量 rebuild 会留下 `xskill import` 纳入的技能。详见 [Release notes](https://github.com/SkillNerds/xskill/releases/tag/v0.6.31)。
- **2026-08-14** — `v0.6.30`：team `xskill import` 后钉到发起人推荐列表；技能库登录后可点空心星 pin 进自己的推荐流，并标出推给我、已钉状态。详见 [Release notes](https://github.com/SkillNerds/xskill/releases/tag/v0.6.30)。
- **2026-08-03** — `v0.6.29a6`：`pymilvus` 改为可选（`xskill[milvus]`），修复 client 自动更新；「我的」页支持推给我 N 个 SKILL / 上传使用去向 / skill commit 状态。详见 [Release notes](https://github.com/SkillNerds/xskill/releases/tag/v0.6.29a6)。
- **2026-07-07** — `v0.6.2a2`：修复 Windows Group Policy 环境下 `schtasks` 拒绝访问的问题，自动降级到开机启动文件夹，`connect` 无需管理员权限即可后台常驻。
- **2026-07-07** — `v0.6.2`：用户画像 + skill 推荐引擎（`--name` 稳定身份、多兴趣聚类、80/20 质量+相关性混合推荐、staging 优先达量灰度）；三方 skillhub 纳入检索池；ux 得分 RESTful 查询；Windows 计划任务后台常驻。详见 [Release notes](https://github.com/SkillNerds/xskill/releases/tag/v0.6.2)。
- **2026-05-29** — Trae IDE / Trae Agent 适配：读取 workspaceStorage 会话、Skill 安装至 `~/.trae-cn/skills` / `~/.trae/skills`。
- **2026-05-23** — 正式开源，发布 `v0.5.0`：团队模式（client-server）、隐私脱敏、Python 3.9 支持、无需 `git`依赖。详见 [Release notes](https://github.com/SkillNerds/xskill/releases/tag/v0.5.0)。
- **2026-05-20** — MIT 开源，PyPI 上架：`pip install xskill`。
- **2026-05-12** — Claude Code、Codex、OpenCode 支持；OpenClaw、Cursor对接。

## 解决什么问题

agent 每次撞上同一个问题，都会把同一套解法重推一遍。你要么再讲一遍，要么自己维护一份 prompt 库——而这份库没人看的时候就慢慢腐烂。

xskill 跑起来之后，这件事不用你管了：

- 跑通过的解题套路自动沉淀成 Skill 文件，agent 自己加载。
- 你照常用 agent 干活，Skill 库自己长出来——没有审核队列，没人需要去"挑选最佳实践"。
- 你手改某个 Skill，xskill 会立即借鉴重点学习。
- 新版本只有真的把用户服务得更好，才会顶掉老版本（用户体验驱动进行进化，而非简单 LLM 开环评价）。

## 上手

```bash
pip install xskill          # 需要 Python 3.9+
xskill serve                # 生成 ~/.xskill/config.yaml 模板后退出
```

打开 `~/.xskill/config.yaml`，填好两个模型 endpoint：

```yaml
skill_dir: ~/.xskill/skill

llm:
  base_url: https://api.deepseek.com
  model:    deepseek-v4-flash
  api_key:  YOUR_KEY

embedding:
  base_url: https://api.deepseek.com
  model:    deepseek-embedding
  api_key:  YOUR_KEY
  dim:      0
```

再跑一次 `xskill serve`，它会自动扫机器上装好的所有 agent（Claude Code、Codex、OpenCode、OpenClaw、Cursor、Trae）开始监听。如果还有一份历史轨迹归档想一起吃进来：

```bash
xskill registry add /path/to/trajectories
```

## 团队模式：真正的杀手场景

xskill 真正想在组织里铺开的形态是团队模式：一台机器当 server，其他人作为瘦客户端接入，共用 server 上长出来的同一份 Skill 库。

```bash
xskill serve --server                        # 启动后打印 join token
xskill connect <host:port> --token <token>
```

- **无感蒸馏大佬员工** 一个人在自己工作里跑通的解法，自动可以让全团队复用，不需要任何人做任何事。（能力民主化）
- **兼容各种 coding 方式** 用 codex、clade 还是 cursor IDE？ 都能加入，多端同步。
- **轨迹隐私** 轨迹上传前先脱敏，agent 隐私功能。
- **灰度测试驱动的进化** 一个 Skill 的改动会先在每个人身上分别衡量，赢了再扩散，人越多进化越准越快。
- **专家指导的手动进化** 专家本地直接修改 skill，会被学习进服务器远程 `user-staging/<client_id>` 分支，作为下一步进化参考。

### 常驻运行

`xskill connect` 默认**直连** server、绕开公司代理（华为 SWG 之类），内网同事无需手动设 `NO_PROXY`；只有当本机唯一出网路径就是代理时才加 `--use-proxy`。

Windows 下 `connect` 会自动把自己装成「计划任务」后台常驻（登录自启、崩溃自愈、不限时长），并提供生命周期命令：

```bash
xskill connect <host:port> --token <token>   # 首次:握手 + 自动拉起后台常驻
xskill status                                  # 查看常驻状态
xskill stop / xskill start                     # 停止 / 重新拉起(需先 connect 过)
```

macOS / Linux 的原生常驻（launchd / systemd --user）仍在路上，当前用自己的 init 系统托管 `xskill connect --foreground` 即可。

### 按需搜索 / 分享技能（skillhub）

```bash
xskill search docker compose        # 只返回精简元信息和 skill ID
xskill search docker --download     # 命中写入 10 槽 LRU 并自动安装
xskill download <skill-id>          # 交互多选安装 harness
xskill download <skill-id> --agent claude-code --agent codex -y
xskill upload ./my-skill            # 打包上传一个 skill 目录(含 SKILL.md),全队立即可搜到
```

`search` 使用 BM25 关键词+语义向量混合检索、与推荐画像无关；语义服务不可用时自动退化为 BM25。默认只输出精简元信息、排名和 ID，不修改本机；`search --download` 保留原来的 **10 个槽位**滚动淘汰逻辑。`download` 按 ID 持久下载，人类可交互多选 harness，agent/脚本应重复传 `--agent` 并加 `-y`。`upload` 在 server 端落到 `skillhub/user_skill_hub/<你的用户名>/` 下。本机轨迹/技能的语义搜索已从 CLI 移除（不再有 `xskill search traj|skill <query>`），改用 dashboard 或 API（`POST /api/v1/skills/search`）。

## 架构图

  ![xskill 架构：agent 生态 → 轨迹监听 → Atom 切分 → Skill 路由 → Skill 编辑 Agent → Canary A/B → Skill 仓库 ↔ 团队模式](docs/assets/architecture.svg)

## 工作原理

几个职责单一的 LLM agent 各管一摊：一个把轨迹切成单一意图的 Atom；一个把每个 Atom 路由到对应 Skill；一个等某个 Skill 攒够素材了就重写它的 `SKILL.md`；一个在真实流量上 A/B 测试新版本，留下赢家。每个 Skill 本身就是一个独立 git 仓库，改了什么、谁改的、能不能回退都有据可查。细节见 [`docs/agent.md`](docs/agent.md)。

## 支持哪些 agent

### Agent · 状态 · 轨迹采集 · Skill 安装
- **Agent**: **Claude Code** · **状态**: ✅ 已验证 · **轨迹采集**: 扫 `~/.claude/projects/` · **Skill 安装**: symlink → `~/.claude/skills/<name>/`
- **Agent**: **Codex CLI** · **状态**: ✅ 已验证 · **轨迹采集**: 扫 `~/.codex/sessions/` · **Skill 安装**: symlink → `~/.agents/skills/<name>/`
- **Agent**: **OpenCode** · **状态**: ✅ 已验证 · **轨迹采集**: 读 SQLite `~/.local/share/opencode/opencode.db` · **Skill 安装**: symlink → `~/.agents/skills/<name>/`
- **Agent**: **OpenClaw** · **状态**: 🟡 已对接，not well tested · **轨迹采集**: 扫 `~/.openclaw/agents/` · **Skill 安装**: 拷贝 → `~/.agents/skills/<name>/`
- **Agent**: **Cursor** · **状态**: 🟡 已对接，not well tested · **轨迹采集**: 扫 `~/.cursor/projects/*/agent-transcripts/` · **Skill 安装**: symlink → `~/.cursor/skills/<name>/`
- **Agent**: **Trae** · **状态**: 🟡 已对接，not well tested · **轨迹采集**: IDE：读 `%APPDATA%/Trae*/User/workspaceStorage/*/state.vscdb`；CLI：扫 `~/trajectories/trajectory_*.json` · **Skill 安装**: symlink → `~/.trae-cn/skills/` 与/或 `~/.trae/skills/`
- **Agent**: **DeepSeek Harness (dsh)** · **状态**: 🟡 已对接，not well tested · **轨迹采集**: 扫 `~/.dsh/sessions/*/*/session.jsonl[.zstd]`（明文与默认 zstd 会话均可） · **Skill 安装**: symlink → `~/.dsh/skills/<name>/`
- **Agent**: **其他 agent** · **状态**: 手动 · **轨迹采集**: SDK：`xskill.adapters.submit_trajectory` · **Skill 安装**: 自己拷贝 / symlink `SKILL.md` 目录

## 几个名词

### 术语 · 含义
- **术语**: **Trajectory（轨迹）** · **含义**: 一次 agent 执行——一段 session 的完整记录，存成 `traj_*.md`。
- **术语**: **Atom** · **含义**: 轨迹里单一意图的最小片段。路由判断发生在这一级。
- **术语**: **Skill** · **含义**: 一个 `SKILL.md` 加可选脚本，住在自己的 git 仓库里，带版本。
- **术语**: **Canary（灰度）** · **含义**: 现有 Skill 与候选版本在真实流量上做 A/B。
- **术语**: **UX score** · **含义**: 某个 Skill 在某个 Atom 上服务用户的好坏，从交互本身打 1–10 分。灰度按这个分数选赢家。

## Roadmap

- 更多 agent adapter：Goose、OpenHands、Aider
- 原生 MCP server 接口（把 Skill 暴露成 tool）
- Web UI：浏览 Skill 库、看灰度数据
- Skill marketplace：导入 / 导出可移植 bundle
- 多租户 Skill 库（每个团队独立 `skill_dir`）