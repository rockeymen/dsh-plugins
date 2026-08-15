# DSH Promotion Toolkit

> 把你的任何想法，变成每个平台原生的宣发内容。

![DSH Promotion Toolkit preview](docs/preview.svg)

## 它解决什么问题

DSH Promotion Toolkit 是一个 DeepSeek Harness 原生插件：把产品、开源项目、文章、课程、活动、个人观点，甚至一段还没整理好的想法，变成可以直接发布的多平台宣发内容。

它先抽取核心观点、可引用证据、需要核验的风险和原始链接，再为每个平台改变阅读入口。不是把一段话缩短 17 次，而是让同一个事实在不同平台用不同的原生结构被读懂：

```text
任何想法 / 原文 / README
            |
            v
核心观点 + 证据 + 风险边界 + 原始链接
            |
            v
17 个平台的原生长文、帖子、视频脚本与 CTA
```

## 平台会真正区分

### 平台 · 输出方式
- **平台**: 小红书 · **输出方式**: 痛点开场、可保存清单、适量 emoji、话题标签和明确 CTA
- **平台**: 知乎 · **输出方式**: Markdown 科普文：结论、背景、方法、限制、原始链接
- **平台**: 公众号 · **输出方式**: 保留完整叙事的长文：标题、导语、章节、案例和结尾
- **平台**: 朋友圈 · **输出方式**: 像朋友分享的短文，有个人语气，不写成硬广告
- **平台**: B 站 / 抖音 / 快手 · **输出方式**: 镜头、时间点、口播、字幕、封面标题和 CTA
- **平台**: 微博 / X / Threads · **输出方式**: 更短、更快、有观点的不同开场和互动问题
- **平台**: LinkedIn · **输出方式**: 职业语境、产品背景、经验总结和讨论式 CTA
- **平台**: Reddit · **输出方式**: 社区语境、问题标题、背景说明和克制的自荐
- **平台**: TikTok / YouTube · **输出方式**: 短视频脚本、画面动作、旁白、字幕和结尾引导
- **平台**: Medium · **输出方式**: 英文长文结构、章节标题、上下文和来源链接
- **平台**: Facebook / Instagram · **输出方式**: 社区分享或视觉化短句、emoji、标签与链接

目前覆盖 17 个平台：`xiaohongshu`、`zhihu`、`wechat`、`wechat_moments`、`weibo`、`bilibili`、`douyin`、`kuaishou`、`x`、`threads`、`linkedin`、`reddit`、`tiktok`、`youtube`、`medium`、`facebook`、`instagram`。

## 用自己的仓库做案例

以下案例使用 `deepseek-v4-pro` 完整跑出：4 个长文主题、中文和英文、每个主题 17 个平台版本。每条宣发都保留这个仓库的原始链接。

**小红书**

```text
📌 一份 README，为什么要改成 17 种内容？

我最近在试一个开源 DSH 插件：把产品、项目、文章或任何想法贴进去，先抽核心观点和可引用证据，再按平台生成真正不同的内容。

它不是把同一段话复制到所有地方：
✅ 小红书：可保存清单 + 适量 emoji
✅ 知乎：Markdown 科普，写清方法和限制
✅ 公众号：保留长文叙事
✅ 朋友圈：像朋友分享，不像广告
✅ B 站 / 抖音：分镜、口播、字幕、CTA
✅ X / LinkedIn / Reddit：各自的原生语气

数字、引用、日期和效果不会被悄悄补出来，发布前还会提醒你回到来源核验。

🔗 源码：https://github.com/lhmd/dsh-promotion-toolkit

#开源 #内容创作 #独立开发 #开发者工具 #效率工具
```

**知乎**

```markdown
# 一份原文，如何变成 17 个平台的原生宣发内容？

## 先说结论

多平台宣发的关键不是把一篇文章压缩成更短的摘要，而是保留观点与证据，重新设计每个平台的阅读路径。

## 它具体怎么做？

1. 从产品故事、项目 README、文章、课程、活动或个人观点中抽取核心论点。
2. 把可引用证据、原始链接和需要人工核验的风险单独列出来。
3. 根据平台习惯改变结构：知乎写成 Markdown 科普，小红书做成可保存清单，公众号保留长文叙事，朋友圈写成朋友分享，视频平台补充分镜与口播。

## 使用边界

它不会替你证明传播效果，也不应该凭空补充用户、收入、日期或数据。发布前仍要核对原文和平台规则。

项目地址：https://github.com/lhmd/dsh-promotion-toolkit
```

**朋友圈**

```text
最近在试一个挺实用的开源插件：把一份产品介绍、文章或 README，改成小红书、知乎、公众号、朋友圈和海外平台各自能用的版本。

它有意思的地方不是“多生成几条”，而是会先把观点、证据和原始链接理清，再让每个平台换一个入口。朋友圈不会变成广告，知乎也不会只剩标题党。

源码放这儿，想看看效果的可以直接复制案例：
🔗 https://github.com/lhmd/dsh-promotion-toolkit
```

**英文 LinkedIn**

```text
One source should not become the same paragraph everywhere.

DSH Promotion Toolkit turns a product story, open-source project, article, course, event, or personal idea into platform-native publicity. It extracts the thesis, evidence, risk flags, and canonical URL first, then changes the reading path for each surface.

Source and live examples: https://github.com/lhmd/dsh-promotion-toolkit
```

完整结果：

- [`examples/live-demos.json`](examples/live-demos.json)：完整结构化 JSON
- [`examples/live-demos.md`](examples/live-demos.md)：每个平台都用代码框展示，方便复制
- [在线双语展示页](https://lhmd.top/dsh-promotion-toolkit/)：可切换中文 / English、4 个案例和 17 个平台
- [`docs/`](docs/)：展示页源文件

## 安装到 DeepSeek Harness

仓库使用 DSH profile-bundle 结构：`cordis.patch.yml` 挂载包，`src/index.js` 导出 `apply(ctx)` 并注册 `viral_kit` 工具，`src/skill.js` 提供运行时 Skill，`skills/viral-kit/SKILL.md` 是可读镜像。

```bash
npm install -g @deepseek-ai/dsh
dsh plugin --profile web add /absolute/path/to/dsh-promotion-toolkit
dsh web
```

本地检查：

```bash
npm test
npm run check:release
npm run demo
```

## 命令行

```bash
node scripts/viral-kit.mjs \
  --text "粘贴你的产品介绍、文章、课程、活动或任何想法" \
  --language auto \
  --platform xiaohongshu \
  --source-url https://github.com/lhmd/dsh-promotion-toolkit \
  --json
```

语言会按平台自动选择：中文平台默认中文，全球平台默认英文；显式传入 `--language zh|en|auto` 时优先使用该设置。`--source-url` 用于传入仓库、产品页、文章页、报名页或其他原始链接，插件会把它放进对应平台的 CTA，不会凭空编造链接。

## 输出结构

每次调用返回结构化 JSON，包含核心观点、证据、传播信号、标题角度、平台成稿、图片提示、标签和风险提醒：

```json
{
  "coreIdea": "从原文抽取的核心观点",
  "evidence": ["需要保留的证据"],
  "shareability": {"score": 0, "signals": []},
  "titles": ["标题角度一", "标题角度二", "标题角度三"],
  "platformDrafts": {
    "xiaohongshu": "可保存的笔记",
    "zhihu": "Markdown 科普文",
    "wechat_moments": "朋友式分享"
  },
  "riskFlags": ["发布前核验"]
}
```

模型只负责润色和平台适配，不应该添加原文没有的用户、客户、指标、日期、价格、结果或链接。发布前请核验归因、数字、时间和绝对化表述。