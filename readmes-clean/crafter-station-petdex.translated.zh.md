![Petdex](public/brand/petdex-desktop-icon.png)

#Petdex

  Codex 的动画同伴公共画廊。

  通过一个命令即可浏览、安装和提交宠物。

   ·
   ·
   ·

## 什么是Petdex

Petdex 是三个协同工作的东西：

1. **位于 [petdex.dev](https://petdex.dev)] 的网络画廊**，社区可以在这里提交、评论和展示 Codex sprite 格式的动画宠物。
2. **一个 ​​CLI**，只需一个命令即可在您的计算机上安装任何宠物，并将它们直接发送到 Codex。
3. **桌面应用程序**，可将宠物漂浮在屏幕上并对编码代理的活动做出实时反应。

每只宠物都是一个文件夹。每个文件夹都是一个图鉴条目。每个条目相距 `npx petdex install`。

## 快速开始

按照此清单安装宠物，在 Codex 中可见，并连接到桌面应用程序。

1. 安装一个已知的宠物：

```sh
npx petdex install boba
```

您应该看到 `~/.petdex/pets/boba/` 与 `pet.json` 和 spritesheet。

2. 从[petdex.dev/download](https://petdex.dev/download)]获取桌面应用程序。它
   在 macOS、Linux 和 Windows 上运行。

3. 打开它，然后在宠物上点击 <kbd>Cmd</kbd>+<kbd>,</kbd> 以打开“设置”。
   在 **宠物** 下选择您的宠物，并在 **代理** 下连接您的编码代理
   只需单击一下即可。不涉及终端。

宠物漂浮在您的工作空间上方，并在呼叫您的代理的每个工具上进行动画处理
使。

## 对于用户

### 你想... · 这样做
- **您想要...**：浏览宠物 · **执行此操作**：访问 [petdex.dev](https://petdex.dev)
- **你想...**：安装宠物 · **这样做**：`npx petdex install <slug>`
- **您想要...**：切换活动吉祥物 · **执行此操作**：在桌面应用程序中打开“设置”(<kbd>Cmd</kbd>+<kbd>,</kbd>)
- **您想要...**：运行桌面浮动程序 · **执行此操作**：从 [petdex.dev/download](https://petdex.dev/download) 下载
- **你想...**：制作一只宠物 · **这样做**：使用 Codex 内的 `hatch-pet` 技能，或使用 [Petdex 创建者工具](https://petdex.dev/create) 构建一个宠物
- **您想要...**：提交宠物 · **执行此操作**：`npx petdex submit ./my-pet/` 或通过网络提交器将其删除
- **你想...**：加入社区· **这样做**：[Discord](https://discord.gg/byhubdyBTe)

完整的 CLI 参考：[`packages/petdex-cli/README.md`](./packages/petdex-cli/README.md)。

## 对于构建者

如果您想在 Petdex（桌面客户端、可穿戴设备、SDK、Discord 机器人等任何东西）之上进行构建，您有两个稳定的表面：

- **HTTP API。** `petdex.dev/api/manifest` 返回每个批准的宠物及其 slug、spritesheet URL、动画状态和元数据。
- **宠物包格式。** 每个宠物都是一个 `pet.json` 加上一个 `spritesheet.{webp,png}`，渲染为 192x208 帧的 8x9 网格，或 v2 8x11 网格。

21 个开源和可用源项目已在此基础上构建。请参阅 [petdex.dev/built-with](https://petdex.dev/built-with) 目录，然后 [通过问题模板 ](https://github.com/crafter-station/petdex/issues/new?template=built-with.yml) 提交您的目录。

## 架构

```text
crafter-station/petdex
├── src/
│   ├── app/[locale]/          Public site: gallery, /pets/<slug>, /collections, /built-with, /community, /create, /download, /submit, /u/<handle>, ...
│   ├── app/api/cli/           CLI endpoints: OAuth config, submit (zip → presigned R2), dedup check, register
│   ├── app/api/manifest/      Public manifest: every approved pet with its spritesheet URL
│   ├── app/api/admin/         Admin review surface for submissions, edits, collection requests
│   └── lib/db/schema.ts       Drizzle schema (Postgres)
├── packages/
│   ├── petdex-cli/            npm `petdex` catalog client (auth, list, install, submit)
│   ├── petdex-desktop-native/ Native SDK floating mascot for macOS, Linux and Windows
│   ├── petdex-desktop-windows/ Legacy Tauri Windows implementation (not the release path)
│   └── discord-bot/           Discord.js bot for the Petdex server
├── public/built-with/         Screenshots for the community page
├── public/brand/              Logos, OS icons, Discord icon
└── drizzle/                   SQL migrations (Postgres schema history)
```

**网络堆栈**：Next.js 16、React 19、Tailwind、Drizzle、Postgres、Redis、Clerk、R2。
**CLI**：Bun + TypeScript，作为单个 npm 二进制文件提供。通过 Clerk OAuth + PKCE 进行身份验证。
**桌面**：`127.0.0.1:7777` 上具有进程内 Zig hook 服务器的本机 SDK 应用程序。当前的发布路径没有 WebView 或 Node sidecar。

## 本地开发

支持两条路径。

### 目标·命令·设置
- **目标**：本地完整堆栈 · **命令**：`bun run dev:docker` · **设置**：Docker 或 Podman，约 30 秒预热。
- **目标**：针对真实服务运行 · **命令**：`bun run dev` · **设置**：填充 `.env.local`（仅限维护人员）。

```sh
git clone https://github.com/crafter-station/petdex.git
cd petdex
bun install
bun run dev:docker
```

打开[本地主机：3000](http://localhost:3000)。完整指南在[`CONTRIBUTING.md`](./CONTRIBUTING.md)。

## Pet包格式

每个宠物都是两个文件：

```text
my-pet/
├── pet.json                Metadata: name, slug, tags, vibes, kind, frame size, animation states
└── spritesheet.webp        8x9 or v2 8x11 frame grid of 192x208 px each (or .png)
```

本机渲染器支持九个状态行：`idle`、`running-right`、`running-left`、`waving`、`jumping`、`failed`、`waiting`、`running` 和 `review`。 Codex 和支持的编码代理将其活动挂钩映射到这些状态。 v2 8x11 图集为消费客户端留下了另外两行可用。

## 宠物 IP 和删除

宠物是用户提交的粉丝艺术作品。 Petdex 不主张任何底层 IP 的权利。如果您拥有某个角色的权利并希望删除宠物，请提交 [删除请求](https://github.com/crafter-station/petdex/issues/new?template=takedown.yml)，我们会在 48 小时内进行审核。