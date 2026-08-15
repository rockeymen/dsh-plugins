![DSH 插件市场头图](https://img.qunq.de/file/1786723993374_header.png)

    <img
      alt="LINUX DO"
      height="18"
    />

面向 DeepSeek Harness 生态的 DSH 插件市场，自动收录并整理 GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) Topic 项目，提供搜索、分类、排序和标签聚合浏览。

[访问 DSH 插件市场（DeepSeek Harness 插件目录）](https://dsh.aitreez.com/)

## 项目截图

展开查看项目截图

![DSH 插件市场首页](<https://img.qunq.de/file/1786723996481_FireShot Capture 033 - DSH 插件市场 - DSH-Plugin Store - [127.0.0.1].png>)

![deepseek-harness 项目详情](<https://img.qunq.de/file/1786723993650_FireShot Capture 034 - deepseek-harness · DSH 插件市场 - [127.0.0.1].png>)

![dsh-plugin 标签页面](<https://img.qunq.de/file/1786723992252_FireShot Capture 037 - dsh-plugin 标签 · DSH 插件市场 - [127.0.0.1].png>)

## 功能

- 自动收录公开的 `dsh-plugin` Topic 仓库
- 根据 GitHub Topics 识别项目类型和功能分类
- 支持名称、作者、描述和标签搜索
- 支持分类、项目类型和更新时间等筛选排序
- 提供项目详情、分类依据和同标签项目页面
- 显示“发现 → 识别 → 结构检查 → 实机验证”进度，并支持按当前验证状态筛选
- 每 30 分钟自动同步 GitHub 仓库数据
- 提供可安装的 DSH Web 插件，通过 `/store`、会话工具栏和设置页浏览同一目录，并在风险确认后支持一键安装

## 数据说明

项目分类优先使用仓库公开的 GitHub Topics，并与站内词典和词根规则比对。标签不足时，项目会保留为“其他”或“待识别”，不会根据名称强行推断。

收录仅表示仓库出现在 `dsh-plugin` Topic，不代表项目已经通过安装、兼容性、安全性或质量验证。本站不会下载、构建或执行第三方仓库代码；可选 DSH Web 插件只会在用户阅读风险提示并明确确认后发起安装。

当前仓库只消费并展示验证结果，不包含执行第三方代码的实机沙箱。

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

默认访问地址：`http://localhost:4321/`。

构建 DSH Web 插件：

```bash
npm run build:plugin
npm pack ./packages/dsh-plugin-store
```

插件安装与卸载方式见 [`packages/dsh-plugin-store/README.md`](packages/dsh-plugin-store/README.md)。

重新同步目录时运行：

```bash
npm run sync
```

同步脚本支持读取 `GITHUB_TOKEN` 或 `GH_TOKEN`。未提供 Token 时会受到 GitHub API 的较低请求限额约束。

## 验证与构建

```bash
npm test
npm run build
```

推送到 `main` 后，GitHub Actions 会自动构建并部署 GitHub Pages。生产服务器每 30 分钟触发一次目录同步；同步、测试和构建成功后，静态站点会原子发布到生产服务器。

## 社区交流

欢迎加入 QQ 群或微信群，与社区成员交流 DSH 插件的使用、开发和生态动态。

### QQ 群 · 微信群
- **QQ 群**: ![DSH 插件社区 QQ 群二维码](https://img.qunq.de/file/1786719353149_qrcode_1786717062979%202.jpg) · **微信群**: ![DSH 插件社区微信群二维码](https://img.qunq.de/file/1786722253271_IMG_6958.jpeg)

## 许可证

项目代码采用 [MIT License](LICENSE)，可自由使用、复制、修改和分发，但必须在软件副本或主要部分中保留原版权声明与许可声明。软件按原样提供，不附带任何明示或暗示的担保。