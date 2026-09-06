# dsh-skills

Personal skill collection for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness).
Each skill is a directory containing a `SKILL.md` (YAML frontmatter: `name` + `description`), drop into
`$DSH_HOME/skills/` to load locally.

## Skills

### Skill · 说明
- **Skill**: [dsh-plugin-npm-publish](dsh-plugin-npm-publish/SKILL.md) · **说明**: DSH 插件开发与发布（本地插件 → npm + GitHub + 市场可发现）：包结构、宿主/客户端 API、defineTool schema DSL、会话级 tools.restrict、npm 自动发布 pipeline、踩坑清单

## 本地加载

```bash
# 把仓库内容放进用户 skill 根目录（本仓库即从该目录初始化的，保持同步）
# Windows: C:\Users\<you>\.dsh\skills\<skill-name>\SKILL.md
```

技能会被 dsh 的 skill-filesystem watcher 实时发现（无需重启）。