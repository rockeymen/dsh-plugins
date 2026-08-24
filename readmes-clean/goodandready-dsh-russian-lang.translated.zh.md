# @goodandready/dsh-russian-lang

DeepSeek Harness Web 界面的俄语本地化。

## 它有什么作用

- 为内核命名空间注册俄语词典（`common`、
  `conversation`、`settings`、`settings.models`、`workspace`、`subagent`、
  `reference` 等 - **30 个内核命名空间，722 个键，100%
  释放表面的涂层** DSH 0.1.1-rc.2) 以及许多第三方
  插件（`dsh-market`、`better-sidebar`、`task-board`、`im-hub` 等 -
  **9 个命名空间，962 个键**)。
- 将**“俄语”添加为母语列表中的第三个位置**
  （**设置→常规→语言**）。选择由标准机制保存
  DSH 设置和体验浏览器。
- 将 `<html lang="ru">` 与活跃俄语同步。

未翻译的键以英语显示（标准后备内核），空
地方不会出现在界面中。

## 它是如何工作的

语言环境的注册表位于浏览器中：该插件将俄语词典报告给外国词典
通过 `ctx.locale.register(ns, 'ru', dict)` 的命名空间 - 可能存在冲突
仅当该对（命名空间，语言）已被占用，并且 `ru` 未被任何人占用时。

标准选择器 (`Настройки → Общие → Язык`) 的语言列表位于快照中
区域设置运行时；菜单是根据它构建的，`setLocale()` 通过以下方式验证选择
给他。在 `ru` 尚未出现在列表中的内核版本上（来自 DSH 0.1.1-rc.2
框），该插件使用“Russian”项目扩展快照 - 内核文件不是
已更正。如果内核自己学习了 `ru`，则不会发生扩展
一切正常。该选择通过其自己的设置记录在设置中
命名空间`russian-lang`（内核主机电路只知道`zh/en`而不知道
接受 `ru`）。

DSH 安装中的任何内容均未修补；删除插件完全返回
界面恢复到原始状态。

## 安装

```bash
dsh plugin --profile web add @goodandready/dsh-russian-lang
```

然后：**设置→常规→语言→俄语**。

## 开发和测试

```bash
python3 extract-dicts.py /node_modules   # обновить *-en.json
python3 check-coverage.py                         # что не переведено / устарело
python3 build.py                                  # собрать lib/client.js
python3 test/test_extract.py                      # smoke для extract-dicts/check-coverage
python3 test/smoke.py                             # E2E против запущенного стенда
```

需要 `websocket-client` (`pip install websocket-client`) 和 Chrome
`/usr/bin/google-chrome` 为 `smoke.py`。默认情况下转到
`https://192.168.1.111:3082`；通过 `DSH_URL` 覆盖。

## 截图

### 什么·文件
- **什么**：俄语界面 · **文件**：`docs/media/ui-russian.png`
- **内容**：设置 → 常规中的语言列表 · **文件**：`docs/media/language-selector.png`

屏幕截图通过 `python3 test/screenshots.py` 更新
安装插件后运行支架。

## 限制

- 仅翻译网络界面。代理和系统提示的说明
  - 不是语言环境，插件不会触及它们。
- 不翻译在没有区域设置插槽的情况下内联绘制文本的插件。
- 由没有 `ctx.locale.register` 的第三方插件添加的文本仍然存在
  插件语言 - 要翻译，您需要更新插件本身。

## 许可证

麻省理工学院