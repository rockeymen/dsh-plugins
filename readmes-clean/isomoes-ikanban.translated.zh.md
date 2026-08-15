#iKanban

Monorepo 用于 DeepSeek Harness 的 iKanban 插件包。

## 套餐

- [`@isomoes/dsh-ikanban`](packages/ikanban) - 库存DSH Web重新包装和键盘优先定制基础
- [`packages/ui-layout`](packages/ui-layout) - 三列 Web shell 的私人源代码
- [`packages/ui-sidebar`](packages/ui-sidebar) - 品牌侧边栏外壳的私人来源
- [`packages/ui-workspace`](packages/ui-workspace) - 工作区和会话浏览器的私有源

## 发展

```bash
pnpm install
pnpm typecheck
pnpm build
```

构建链接的结账，并将其安装到独立的 `ikanban` DSH 配置文件中，并且
运行它：

```bash
pnpm dev
```

`pnpm dev` 自动创建或刷新配置文件。使用
`pnpm dev:config` 无需启动即可检查生成的合成。

详见软件包【开发指南](packages/ikanban/README.md#local-development)
用于重建行为和配置文件清理。

请参阅 [CHANGELOG.md](CHANGELOG.md) 了解项目历史记录。