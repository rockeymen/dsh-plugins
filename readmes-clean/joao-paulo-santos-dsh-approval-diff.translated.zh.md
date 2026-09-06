#dsh-approval-diff

一个【DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）
插件：将其与您自己的插件一起安装到配置文件中。

**查看您批准的内容。** 当模型请求更改文件的权限时，
本机卡显示工具参数：`old_string` 和 `new_string` 作为原始
文本，没有文件上下文，没有行号。该插件将询问替换为
真正的差异审查：红线和绿线并排，单词级突出显示
在更改的行内，用真实行号包围文件内容，以及
正好两个按钮。

## 插件价值主张

![](https://github.com/user-attachments/assets/dcd8fc25-db70-4cb4-9ce2-9d7ffb11cfa6)

###替代方案·达不到要求
- **替代**：本机批准卡· **不足**：原始工具参数；每次询问时，你都会在脑海中重建差异
- **替代**：自己读取文件 · **达不到**：您成为差异引擎，并且模型已经读取过一次
- **替代**：自动批准并希望 · **达不到**：根本不进行审查

## 你得到什么

- `edit` 的真实行差异：LCS 行匹配加上字级突出显示；
  编辑操作数内未更改的行呈现为上下文，而不是更改
- 拆分或统一视图（GitHub 样式切换，记住选择）；统一
  将每个更改运行分组为所有删除的行，然后添加所有行
- 新文件（`write`）渲染单面，全绿色；删除（`rm` 和
  朋友）在你决定之前将整个当前文件呈现为红色
- 对同一文件的连续编辑合并为一个差异和一个决策
- 两个按钮，拒绝和允许，范围精确到卡片显示的内容
- 无法成功的请求永远不会显示给您
- 最小化折叠卡片而不做决定；关闭按钮手
  请求返回本机卡

## 如何安装

需要 DeepSeek Harness 结帐和配置文件，此处为 `web`。克隆
插件到插件文件夹中：

```sh
mkdir -p ~/dsh-plugins && cd ~/dsh-plugins
git clone https://github.com/joao-paulo-santos/dsh-approval-diff.git

# from the harness checkout
pnpm dsh plugin --profile web add ~/dsh-plugins/dsh-approval-diff

# verify the profile still composes
pnpm dsh --profile web --dump-config
```

安装后重新启动线束：主机在启动时半加载。的
安装后客户端半热重载。

## 限制

- 仅文件更改批准（`edit`、`write`、仅删除 `bash`）。
  其他一切都是本机卡的工作。
- 删除审查从磁盘读取目标； glob 目标呈现为
  模式。
- 一次批准一项，与本机卡的行为相匹配。

## 依赖关系

无

## 依赖于此的插件

*（还没有）*