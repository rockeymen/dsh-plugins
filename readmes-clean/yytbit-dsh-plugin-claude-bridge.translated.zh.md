#dsh-plugin-claude-bridge

将Claude Code的内存、技能和配置桥接到DeepSeek Harness中——零迁移，完全兼容。

## 它的作用

直接读取 Claude Code 的标准文件位置——没有迁移脚本，没有文件复制，没有符号链接：

- `~/.claude/projects//memory/*.md` -- 注入内存作为动态系统提示上下文
- `~/.claude/skills/<name>/SKILL.md` -- 将技能添加到可用目录中
- `~/.claude/CLAUDE.md` -- 将全局指令注入系统提示符中

## 安装

```sh
dsh plugin --profile your-profile add dsh-plugin-claude-bridge
```

## 配置

开箱即用，零配置。所有选项都是可选的：

```yaml
- id: claude-bridge
  name: dsh-plugin-claude-bridge
  config:
    claudeHome: '~/.claude'
    enableMemory: true
    maxMemoryBytes: 8192
    enableSkills: true
    maxSkills: 30
    enableGlobalInstructions: true
    extraSkillDirs:
      - '~/.agents/skills'
```

## 它是如何工作的

### 内存注入

Claude Code 将内存存储为带有 YAML frontmatter 的单独 Markdown 文件。该插件读取所有内存文件，按类型优先级（反馈>项目>参考>用户）对它们进行排序，并将它们作为动态系统提示上下文部分注入。每次请求都会重新读取上下文，因此新的内存会立即生效。

###技能目录

发现 `~/.claude/skills/` 的技能，并将其名称和描述作为目录注入系统提示符中。

### 全局指令

`~/.claude/CLAUDE.md` 的内容作为早期系统提示部分（顺序 5）注入，因此保留了全局指令和模型路由规则。

## 相关桥接插件

- dsh-plugin-codex-bridge -- 桥OpenAI Codex
- dsh-plugin-opencode-bridge -- 桥接 OpenCode
- dsh-plugin-pi-bridge -- Bridge Pi代理
- Awesome-dsh-bridges -- 所有桥接插件的精选列表