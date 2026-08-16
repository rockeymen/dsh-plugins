#WhaleHarness

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) 的插件商店：深海中的一组插件。

**站点：https://whaleharness.com** — 双语（EN/中文），每个插件在发货前都在真实的 DSH 会话中进行验证。

## Pod 成员 (5)

### 插件 · 工具 · 它的作用
- **插件**：鲸鱼赞美 · **工具**：`whale_praise` · **它的作用**：对任何命名行为的鲸类级赞美。
- **插件**：鲸鱼财富 · **工具**：`whale_fortune` · **它的作用**：按需提供深海警句。
- **插件**：鲸鱼提交 · **工具**：`whale_submit` · **它的作用**：打包您自己的插件并将其放入公共提交框 - 从 DSH 会话内部。
- **插件**：鲸鱼状态 · **工具**：`whale_status` · **它的作用**：站点检查：HTTPS、DNS、TLS 过期、每个已发布 tarball 的 sha256 完整性。
- **插件**：鲸鱼品牌检查 · **工具**：`whale_brand_check` · **它的作用**：根据鲸鱼品牌语音规则进行分数复制。

## 安装

```sh
dsh plugin --profile web add -w https://whaleharness.com/plugins/whale-praise-0.1.0.tgz?src=install
```

站点上的所有安装命令都是简单的，在 [plugins.json](dist/plugins.json) 中具有 `?src=install` 归属和 sha256 校验和。

## 技能

- `whale-brand` — 品牌声音（深沉、冷静、机智）
- `whale-marketing` — 促销手册

安装：`mkdir -p "$DSH_HOME/skills" && curl -fsSL https://whaleharness.com/skills/whale-brand-0.1.0.tar.gz | tar xz -C "$DSH_HOME/skills"`

## 在这里发布你的插件

1. 检查 [docs/REVIEW.md](docs/REVIEW.md) 的格式和安全红线。
2. 将您的 tarball 放入公共提交框，或者安装鲸鱼提交并从会话中执行此操作。
3. 评审透明：提交的内容可供公开阅读；判决结果公开发​​布。

## 帮助改进它

这家商店是在公共场所建造的，需要工作人员反馈：

- 想法和问题：[讨论](https://github.com/WhaleHarness/WhaleHarness/discussions)（想法/问答）
- 错误和问题：[Issues](https://github.com/WhaleHarness/WhaleHarness/issues)
- 修复和改进：打开 PR — 审核与插件提交是相同的透明过程
- 审查上诉：每张拒绝通知都准确列出了需要修复的内容；完成后重新提交

## 存储库布局

- `plugins/` — cordis 捆绑包源（每个三个文件：package.json、cordis.patch.yml、lib/index.js）
- `skills/` — SKILL.md 来源
- `dist/plugins.json` — 实时商店清单（经过 sha256 检查）
- `deploy/` — nginx 站点配置、统计聚合器、新闻页面生成器
- `docs/REVIEW.md` — 每次提交时使用的审核清单
- `ROUNDS.md` — 公共构建日志：每一轮工作，包括错误

## 构建日志

该网站是逐轮实时构建的，整个过程记录在 [ROUNDS.md](ROUNDS.md) 中，并在 https://whaleharness.com/live.html 上作为异步文本直播重播——记录的每个陷阱实际上都破坏了启动。