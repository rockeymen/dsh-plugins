![dshplugin.me icon](assets/brand-icon.png)

# dsh-plugin-radar

**找插件 · 装前安检 · 再安装 —— DSH 插件雷达。**

[English](README.md) | 简体中文

对 DSH 说一句「有没有插件能……」，它从全 GitHub 的 [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) 里按关键词服务端检索候选，对照 [awesome-dsh-plugin](https://awesome-dsh-plugin.com) 与 [dshplugin.me](https://dshplugin.me) 两层精选注册表交叉核对；你选定之后先做一轮**装前安全扫描**——lifecycle 脚本、外联域名、子进程、凭据读取、提示注入——不管有没有发现都汇报一次，你点头才装，装完验证挂载。

也可以反过来用：已经看中某个插件，问一句「XX 安全吗」，它直接跑安检清单出报告。

## 安装

### 作为 DSH bundle（推荐）

```sh
cd <你的 dsh 源码目录>
pnpm dsh plugin --profile  add 'github:dshplugin-me/dsh-plugin-radar'
```

纯 JavaScript、无构建步骤，不需要在 `pnpm-workspace.yaml` 里加 `allowBuilds`。插件会在运行时注册 `plugin-radar` skill。

### 作为普通 skill

把 `skills/plugin-radar/` 整个目录拷到任一 skill 发现根目录：全局用 `$DSH_HOME/skills/`，只给当前项目用 `<项目根>/.dsh/skills/`，跨 agent 共用放 `${DSH_AGENTS_HOME:-~/.agents}/skills/`。目录有 watcher，放进去即生效。

也可以直接把这句话发给 DSH：

```text
请从 https://github.com/dshplugin-me/dsh-plugin-radar 安装 plugin-radar skill
```

## 它和其他 find 类 skill 的差别

1. **检索在服务端过滤**。按任务关键词查 `topic:dsh-plugin <关键词>`、按 star 排序，几 KB 就够——不是把 4000+ 仓库整个灌进上下文。GitHub 搜索有 1000 条硬上限，结果被截断时输出会如实标注 `truncated: true`，不把切片说成全部。
2. **两层精选交叉核对**。topic 池约三分之一是占位仓库和蹭 topic 的项目。候选先对照 awesome-dsh-plugin 的人工收录名单，再查 dshplugin.me 的插件档案页（适用场景、局限、依赖预扫、同类对比），两层都没有才回退到现读仓库。
3. **安检是流程的一部分，不是备注**。bundle 查可执行代码的攻击面，skill 查指令层的提示注入和数据外传，报告贴原文、给结论、附「无发现不等于无风险」——[公开研究](https://github.com/NVIDIA/SkillSpector)显示 26.1% 的 agent skill 含漏洞、5.2% 疑似恶意，这一步省不得。

## 作者徽章

你的插件被收录了？把徽章加进你的 README，读者点击直达你的插件档案页：

```markdown
[![Indexed on dshplugin.me](https://dshplugin.me/badge.svg)](https://dshplugin.me/plugins/<your-slug>/)
```

slug 在 [dshplugin.me](https://dshplugin.me) 搜到你的插件后看档案页 URL 的最后一段。

## 提交你的插件

收录标准：真实可用的 DeepSeek Harness 插件或 skill（`package.json` 里有 `dsh.bundle` 声明、可挂载的 Cordis 插件、或 `SKILL.md` 目录），GitHub 上带 `dsh-plugin` topic，description 说清楚插件做什么。

[提 issue](https://github.com/dshplugin-me/dsh-plugin-radar/issues/new?title=Submit%3A%20owner%2Frepo) 附仓库链接，或直接 PR 编辑 [README.md](README.md) 里的收录列表。每个提交都会过一遍本插件同款的安全审查，结论公开在 issue 里。

## 收录列表

118 个已验证存活的插件，完整列表见 [README.md](README.md#indexed-plugins)，按主类目分组、star 排序，每条链到 dshplugin.me 档案页。