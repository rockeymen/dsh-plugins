# 把世界书拖进输入框，DSH 就是长篇创作台

> **luxueliu-dsh-story** — DeepSeek Harness（DSH）创作四件套：**拖资料 · 接剧情 · 出成稿 · 存卡片**，外加打字即展开的写作指令。一个插件全配齐。

[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-%2300b4ff)](https://github.com/topics/dsh-plugin)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 这是什么

用 VS Code Continue 写长篇时，你靠的是四件事：

1. 把世界书 / 角色卡 **拖进输入框**，正文作为 context 发出去（不是只丢一个 `@路径` 让模型自己去读）
2. 上下文炸了，用 **剧情总结** 交接，关掉旧窗、新开窗接着写
3. 导出一份 **干净对话稿**（没有工具调用、没有代码噪音）
4. 把长期可复用的 **角色卡 / 世界书** 写成带日期的 Markdown，丢回资料包

DSH 默认不会做第 1 件：原生 `@path` 只是提示模型去 `read`。浏览器从资源管理器拖文件时也 **没有盘符路径**，只有文件名和字节。

本插件补上这四件，并且 **绝不** 在 `document` capture 阶段拦截 `drop`——那样会把 DSH 冻在「图片拖动到此处即可添加」。

## 安装

```powershell
dsh plugin --profile web add luxueliu/luxueliu-dsh-story
```

重启 DSH web 后浏览器硬刷新（`Ctrl+Shift+R`）即可。

本地开发：把包装进 web profile 的 **`bundles`** 列表（本插件自带 client），用 link 指向源码：

```json
"luxueliu-dsh-story": "link:D:/DSH/plugins/luxueliu-dsh-story"
```

**不要**再在 `cordis.patch.yml` 里 `insert id: story`——bundle 补丁已经做了。需要额外搜索根就按 id 叠加配置：

```yaml
- id: story
  config:
    roots:
      - /path/to/your/writing/workspace
    provider: gateway
    model: gemini3.7
```

`roots` 只用来把拖进来的 **文件名** 映射回 `@路径`；文件正文由浏览器直接递进来，不走这条。

## 命令总览

DSH 命令名必须是 ASCII，中文写在说明里。

| 命令 | Continue 里对应 | 干什么 |
|---|---|---|
| 拖入 `.md` / `.txt` / `.yml` | context items | 输入框插入 `@路径`（若解析得到）+ 围栏正文。图片忽略。 |
| `/gemini-sum` | `/压缩` | 剧情 **交接** 摘要：谁在哪、发生了什么、悬而未决、最后一拍。不是卡片。 |
| `/out` | 会话导出 | 干净的 `#### _User_` / `#### _Assistant_` + `>` 引用，没有工具噪音。 |
| `/out 名字` | 导出存档 | 写入 `资料包/` 旁边的 `成品/名字.md` |
| `/sum 角色卡：描述` | 角色卡 | `资料包/continue/角色卡_描述_vYYYYMMDD.md` |
| `/sum 世界书：描述` | 世界书 | `资料包/continue/世界书_描述_vYYYYMMDD.md` |
| `/cue` | 自定义斜杠指令 | 列出内置写作指令 |
| `/cue forum you brit` | 同上 | 论坛体 + 第二人称 + 英伦 一包打出 |
| 输入框打 `[论坛体]` | 同上 | 标签展开成完整规范 |
| `/gemini <提示>` | 一次性调用 | 走 `config.provider` / `config.model`（默认 `gateway` / `gemini3.7`） |

可选：`@模型名` 前缀、`--dir <绝对路径>`、`--save`、取最后 `N` 条消息。

**剧情摘要 ≠ 卡片。** 摘要给下一个窗口看，卡片是长期成型的设定。

## 写作指令 `/cue`

SillyTavern 预设是巨大的开关板；本插件只保留你真正会反复手打的那几条短规范，指令正文全部原创（未搬任何第三方 ST JSON）。Continue 式的开场一条打齐：

```
[第二人称：西西莉亚家主] [英伦] [禁止抢话]
当前场景：……
```

或 `/cue rp --as 西西莉亚家主`。格式标签：`[论坛体]` `[群聊]` `[纯对白]` `[3A]` `[3B]`；文风标签：`[英伦]` `[电影感]` `[轻小说]` `[网文]`。`/cue` 不带参数打印完整清单。

典型回路：选好模型 → 拖卡 → 打标签或直接开写；上下文炸了 `/gemini-sum` 接到新窗；读本 `/out`；设定 `/sum` 回资料包。

## 拖放规则（不要"优化"它）

ComposerAttachments 监听 **bubble** 阶段 `drop` 来关图片浮层，本插件因此立下规矩：

- 只在 **bubble** 阶段监听 `drop`
- 绝不 `preventDefault` / `stopPropagation` / `stopImmediatePropagation`
- 忽略 `image/*`
- 用 `File.text()` 读文稿
- 浮层复位后 `setTimeout(0)` 再插入
- 处理器包 `try/catch`

谁把 capture 拦截加回来，DSH 就会再次冻在「图片拖动到此处即可添加」。

## 配置

| 键 | 默认 | 含义 |
|---|---|---|
| `roots` / `root` | `DSH_CWD`, `DSH_WORKSPACE`, `process.cwd()` | 扫描这些目录，把拖入的文件名映射回磁盘路径 |
| `provider` | `gateway` | `/gemini` `/gemini-sum` `/sum` 用的 DSH provider id |
| `model` | `gemini3.7` | 上述命令的默认模型 |
| `maxTokens` | `8192` | 生成上限 |

落盘目标 `资料包/continue` 与 `成品/` 必须已存在；`--dir` 可以现场建目录；文件系统根目录会被拒。

## 可选 agent 预设

`preset/continue/` 是一份 **人格 + 文件系统工具** 预设（无 shell）。想要「Continue 模式」的会话形态，把它拷到 `~/.dsh/.agent-presets/continue/`。拖进来的文件正文已经在消息里，所以不需要 shell。

不要在预设或别的插件里 capture 拦截输入框 drop。

## License

MIT © 2026 luxueliu
