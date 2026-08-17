# dsh-plugin-market 插件市场

[English](README.md) | 中文

装在 DeepSeek Harness 侧边栏里的插件市场，**带时间榜单**。四大类人话分类 ×
日榜 / 周榜 / 月榜 / 新秀榜，7 日涨星曲线，中英双语一句话简介，一键安装 /
更新 / 卸载——全部在 `dsh web` 里完成。

> 状态：v0.1 骨架。榜单数据由配套的
> [`dsh-market-data`](https://github.com/Tasihi89/dsh-market-data) 数据管道
> （GitHub Actions，零服务器）每日产出；管道上线前插件使用内置离线快照。

## 安装

```sh
dsh plugin --profile web add @changeme/dsh-plugin-market
```

重启 `dsh web`（或热加载生效）后，侧边栏「新会话」下方出现「**插件市场**」
入口，与任务看板并列。

## 功能

- **真榜单，不是排序**：日 / 周 / 月三个时间窗的 star 增量榜，基于真实时间
  序列计算；新秀榜收录 7 天内新上榜插件。每张榜单卡片带 7 日涨星曲线。
- **四大类人话分类**：更能干 / 更好看 / 更省心 / 接得更多（悬浮显示正式
  分类注释）。
- **完整市场**：搜索、详情、一键安装（热加载）、更新（处理 pnpm 新版本
  等待期）、两步确认卸载；npm 周下载量作为第二热度指标。
- **中英双语**：界面文案和插件简介都有中英两份，跟随 DSH 界面语言。
- **数据诚实**：目录覆盖整个 `dsh-plugin` GitHub topic；没有可验证安装目标
  的条目显示「仅收录」并给出可复制的命令行，不放安装按钮。

## 安全模型

沿用 dsh-market 的基线：所有变更端点仅接受同源 POST；安装目标必须是目录内
条目且经服务端重新校验；构建脚本默认被 pnpm 拦截、需显式放行；重启仅限
本机回环请求。

## 开发

```sh
pnpm install
npm run typecheck
npm run build      # lib/（tsc）+ client/client.js（tsdown 工厂产物）
npm test           # vitest
```

改 npm scope：见 [RENAME.md](RENAME.md)。

## 许可证

MIT。包含改编自
[dsh-market](https://github.com/dsh-market/dsh-market)（MIT）与
[dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)（Apache-2.0）
的代码，详见 [NOTICE](NOTICE)。