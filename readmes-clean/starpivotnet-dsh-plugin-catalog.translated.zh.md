#dsh-plugin-catalog

[StarPivot 市场](https://github.com/StarPivotNet/dsh-plugins-public) 的官方插件目录。

市场“发现”选项卡获取此文件：

`https://raw.githubusercontent.com/StarPivotNet/dsh-plugin-catalog/main/catalog.json`

## 上市规则

每个条目必须是声明 `dsh.bundle.patch` 的 npm 注册表包。该目录使用市场协议版本 1：

```json
{
  "version": 1,
  "title": "StarPivot",
  "plugins": [
    {
      "name": "@scope/pkg",
      "version": "1.2.3",
      "title": "Display name",
      "description": "Short summary",
      "homepage": "https://example.com",
      "kind": "bundle",
      "updatedAt": "2026-08-16T17:52:31.074Z"
    }
  ]
}
```

不要列出仅 git 签出、技能或安装后需要手写 `cordis.patch.yml` 的软件包。

计划的 GitHub 操作每 30 分钟根据其 npm `latest` 标记检查每个列出的包，并在该发布版本仍然声明 `dsh.bundle.patch` 时固定 `catalog.json`。它写为 `version`，npm 发布时间为 `updatedAt`。标题、描述、主页和类型如此处所写。从“操作”选项卡手动运行工作流即可刷新，无需等待。

如果该作业失败，它将打开一个 GitHub 问题（或对打开的 `catalog-refresh-failure` 问题进行评论）并 @ 提及每个 StarPivotNet 成员。然后，GitHub 通过这些成员自己的通知设置向他们发送电子邮件。如果您需要收件箱副本，请将问题电子邮件通知保持打开状态。

GitHub 无法发送自定义 HTML 邮件。要通过 `fastaicode.top` 上的 Cloudflare 发送一份，请部署 `cf-email-worker/` 并设置存储库机密 `CF_NOTIFY_URL=https://catalog-notify.fastaicode.top` 和 `CF_NOTIFY_TOKEN`。请参阅 [cf-email-worker/README.md](cf-email-worker/README.md)。

## 第一个架子

带电引脚位于 `catalog.json`。预定的Action仅重写`version`和`updatedAt`。

- `@starpivot/dsh-plugin-marketplace`
- `@dsh-plugin/dsh-auxiliary`
- `@dsh-plugin/dsh-thought-buddy`
- `dsh-find-plugin`
- `dsh-mnemon`
- `@starpivot/dsh-session-import`
- `@starpivot/dsh-better-sidebar`