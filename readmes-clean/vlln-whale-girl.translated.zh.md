# whale-girl

  DSH Web GUI 内的桌面宠物（QQ 宠物形态）
  右下角悬浮的积累型伙伴：可拖拽、可投喂/玩耍，陪伴你的工作台脉搏——
  完成任务/会话/活跃陪伴时长积累成资历等级、称号与回忆。

  ![license](https://badgen.net/badge/license/MIT/green)
  ![official bundle](https://badgen.net/badge/format/official%20bundle/8257D0)

## 安装

官方 **bundle 插件** 格式（仓库根 `package.json` 的 `dsh.bundle` + `dsh.client`）。经官方 profile 管理：

```sh
dsh plugin --profile web add "github:vlln/whale-girl#main"   # 推荐：git 源一行（构建产物已入库）
# 或本地目录：dsh plugin --profile web add <whale-girl 本地路径>
```

装完 **重启 web**（bundle 层在启动时合成），右下角出现宠物：点击弹出菜单（🍗 喂食 / 🎾 玩耍），拖拽可移动；hover 显示状态条（资历等级/任务数/最近共同回忆）。初始配置/欢迎页（onboarding）宠物隐藏。

更新插件时 `dsh plugin --profile web update whale-girl`（或换 git 源 ref），重启生效。

## 使用

### 你做什么 / 发生什么 · 宠物表现
- **你做什么 / 发生什么**: 拖拽宠物 · **宠物表现**: 被斜向拉扯（`drag`）
- **你做什么 / 发生什么**: 点击菜单 🍗 喂食 / 🎾 玩耍 · **宠物表现**: 啃咬/抛接球（`eat`/`play`）→ 开心（`joy`）
- **你做什么 / 发生什么**: 空闲 ≥60s · **宠物表现**: 打盹（`sleep`）；互动时醒过来（`wake`）
- **你做什么 / 发生什么**: 任务完成 / 升级 / 称号 / 回合完成 · **宠物表现**: 举手欢呼（`celebrate`）
- **你做什么 / 发生什么**: 任务失败 / 请求出错 · **宠物表现**: 惊吓（`error`）→ 失落（`disappointed`）
- **你做什么 / 发生什么**: 新会话开始 · **宠物表现**: 挥手欢迎（`welcome`）
- **你做什么 / 发生什么**: 任一会话运行/思考中 · **宠物表现**: 沉思陪伴（`think`，偶尔 `working` 工作姿态）
- **你做什么 / 发生什么**: 等待批准 · **宠物表现**: 期待等待（`wait`）
- **你做什么 / 发生什么**: 周期游走 · **宠物表现**: 散步（`walk`）
- **你做什么 / 发生什么**: 常态 · **宠物表现**: 待机（`idle`，随机眨眼/转身）

完整状态机（优先级/转换语义/触发源）见 [docs/state-machine.md](docs/state-machine.md)。

## 状态预览

### 状态 · 触发 · 预览
- **状态**: `idle` · **触发**: 常态待机 · **预览**: ![idle](docs/preview/idle.gif)
- **状态**: `working` · **触发**: 会话思考期随机工作插曲 · **预览**: ![working](docs/preview/working.gif)
- **状态**: `celebrate` · **触发**: 任务完成/升级/称号/回合完成 · **预览**: ![celebrate](docs/preview/celebrate.gif)
- **状态**: `error` · **触发**: 任务失败/请求出错 · **预览**: ![error](docs/preview/error.gif)
- **状态**: `disappointed` · **触发**: 失败后短时失落 · **预览**: ![disappointed](docs/preview/disappointed.gif)
- **状态**: `joy` · **触发**: 投喂/玩耍后开心 · **预览**: ![joy](docs/preview/joy.gif)
- **状态**: `eat` · **触发**: 点击投喂 · **预览**: ![eat](docs/preview/eat.gif)
- **状态**: `play` · **触发**: 点击玩耍 · **预览**: ![play](docs/preview/play.gif)
- **状态**: `drag` · **触发**: 拖拽中 · **预览**: ![drag](docs/preview/drag.gif)
- **状态**: `walk` · **触发**: 周期游走 · **预览**: ![walk](docs/preview/walk.gif)
- **状态**: `sleep` · **触发**: 空闲 ≥60s · **预览**: ![sleep](docs/preview/sleep.gif)
- **状态**: `wake` · **触发**: 睡醒过渡 · **预览**: ![wake](docs/preview/wake.gif)
- **状态**: `welcome` · **触发**: 新会话 · **预览**: ![welcome](docs/preview/welcome.gif)
- **状态**: `think` · **触发**: 会话思考陪伴 · **预览**: ![think](docs/preview/think.gif)
- **状态**: `wait` · **触发**: 等待批准 · **预览**: ![wait](docs/preview/wait.gif)

## 配置

参数经宿主 settings 配置，`<dshHome>/settings.yaml` 的 `whale-girl:` section（或设置 UI）修改后**热生效免重启**：

```yaml
whale-girl:
  size: 110          # 宠物尺寸 px（64–160）
  opacity: 1         # 常态透明度（0.2–1）
  walk:
    enabled: true    # 游走开关
  sleepAfterMs: 60000
```

完整配置项清单与语义层（XP/称号）封闭说明见 `.dsh-plugin/src/config.mjs`。**语义层不可配**（改 XP/称号阈值会破坏积累账本一致性）。

## 角色

菜单「🎭 换角色」循环切换角色（或设置 localStorage `whale-girl:character`）。每个角色提供**全部 15 状态**素材（素材全量契约，见 [docs/sprites-spec.md](docs/sprites-spec.md)）；贡献新角色指南见 [docs/adding-a-character.md](docs/adding-a-character.md)。

## 作为参考实现

whale-girl 是官方 repository-plugin 格式的**完整范本**（不绑定具体基线版本，随官方机制演进）——开发新插件可对照：

- **结构**：`.dsh-plugin/`（入口/纯逻辑/client/素材）与 docs/decisions/scripts 分离，见根 [AGENTS.md](AGENTS.md)
- **规范**：门禁（`scripts/gates/run.mjs`）+ 决策记录 + 素材全量契约；开发引导见 plugin-registry 的 [plugin-registry-create skill](https://github.com/vlln/plugin-registry/tree/main/skills/plugin-registry-create) 与 [cookbook](https://github.com/vlln/plugin-registry/blob/main/docs/cookbook/creating-a-repository-plugin.md)，踩过的坑见 [gotchas](https://github.com/vlln/plugin-registry/blob/main/skills/plugin-registry-create/references/gotchas.md)

## 贡献

**欢迎提交 issue 和建议**——你的反馈直接决定宠物的下一步：

- 🐛 **遇到问题**：提交 issue，附复现步骤、浏览器与 dsh 版本；客户端问题附控制台报错更佳
- 💡 **功能建议**：参考 [docs/state-machine.md](docs/state-machine.md) 与 [docs/growth-system.md](docs/growth-system.md) 了解现状，说明期待效果
- 🎨 **新角色**：见 [docs/adding-a-character.md](docs/adding-a-character.md) §贡献角色速览——只读契约，产出 15 张 sheet + manifest 条目，本地 `verify-assets` 验收
- 🔧 **代码贡献**：每个非平凡改动带决策记录（`decisions/`）、门禁自证、单一性质提交（见 [docs/AGENTS.md](docs/AGENTS.md) 与根 [AGENTS.md](AGENTS.md)）

## 致谢

角色形象由 [ZipZipPipe](https://space.bilibili.com/4168597) 创作（《鲸鱼娘》表情包角色），sprites 基于其角色设定生成。