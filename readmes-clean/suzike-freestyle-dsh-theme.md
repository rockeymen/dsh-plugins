# freestyle-dsh-theme

  ![freestyle-dsh-theme banner](docs/images/banner.svg)

**freestyle-dsh-theme** 是 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/DeepSeek-Harness) 的 Web GUI 主题体验插件：基于 **OKLCH 色彩模型**，提供「主题提案」与「主题设计器」两大能力，让用户**一键换肤、自由调色**。作为常驻 Web 插件热插拔安装，**跨重启持久化**。

## ✨ 特性

  
    
      ![主题提案](docs/images/proposer.svg)
      主题提案 · 6 套风格预设 + 智能提案，点卡片即应用
    
    
      ![主题设计器](docs/images/designer.svg)
      主题设计器 · 主色 / 副色 / 面板 三通道独立调节
    
  

- 🎨 **OKLCH 配色模型** — 色相 / 彩度 / 明度三通道独立可控，直觉且色彩感知均匀
- 🧭 **配色关系** — 邻近 / 互补 / 分裂互补 / 三角色 一键派生副色与面板色
- 🔒 **通道锁定** — 锁定某通道后，随机与配色关系将跳过它
- ⚡ **快速变体** — 柔和 / 鲜明 / 提亮 / 压暗 / 主副互换
- 🤖 **AI 命名** — 用默认模型为配色生成中文主题名 / 标签 / 介绍
- 📋 **JSON 导入导出** — 主题令牌可复制、可分享、可迁移
- 🖥️ **设置面板放大** — 自动把设置弹框加宽到 1120px，显示更完整
- ♻️ **持久化** — 常驻 Web 插件，重启 DeepSeek Harness 后仍然存在

## 📸 实际界面

> 以下为软件内真实设置页面截图（设置 → 通用 → 主题 → 自定义…）。

  ![主题提案 · 实际界面](docs/images/screenshot-proposer.png)
  主题提案 · 6 套风格预设 + 8 套智能提案，点卡片即应用

  ![主题设计器 · 实际界面](docs/images/screenshot-designer.png)
  主题设计器 · 主色 / 副色 / 面板独立通道 + 实时预览 + 通道锁定 + JSON 导入导出

## 📐 架构

  ![OKLCH 色彩模型](docs/images/oklch-model.svg)

每套主题由三个通道的 OKLCH 值定义，映射到 DSH 的完整 `--dsw-alias-*` / `--dsw-specific-*` 设计令牌（约 85 个，明暗两套），实现**全覆盖换肤**——背景层级、文字层级、边框、按钮、交互态、状态色、侧边栏等全部随主题切换。

### 通道 · 含义 · 映射到
- **通道**: 主色 `th / c1 / l1` · **含义**: 品牌强调色 · **映射到**: `brand-primary`、按钮、交互态
- **通道**: 副色 `th2 / c2 / l2` · **含义**: 次要强调色 · **映射到**: 侧边栏选中态
- **通道**: 面板 `ths / sc / bg` · **含义**: 背景表面色 · **映射到**: 各级背景层级
- **通道**: 文字 `tx` · **含义**: 正文墨色 · **映射到**: `label-primary` 等
- **通道**: 侧边栏 `sb` · **含义**: 左侧栏明度 · **映射到**: `sidebar-fill`（默认与主区一体）

## 📦 安装

> 本插件为「双面」Web 插件：Host 半（AI 命名路由）运行在 DSH 进程，Client 半（主题 UI）加载到浏览器。

### 1. 克隆并构建

```bash
git clone https://github.com/suzike/freestyle-dsh-theme.git
cd freestyle-dsh-theme
pnpm install
pnpm build
```

构建产物：`lib/index.js`（Host 半）、`lib/client.js`（浏览器半）。

### 2. 挂载到你的 DSH profile

在 `~/.dsh/profiles//package.json` 的 `dependencies` 里加入：

```json
{
  "dependencies": {
    "@linxin666/freestyle-dsh-theme": "link:../path/to/freestyle-dsh-theme"
  }
}
```

在 `~/.dsh/profiles//cordis.patch.yml` 末尾追加：

```yaml
- insert:
    - id: theme
      name: '@linxin666/freestyle-dsh-theme'
```

然后：

```bash
cd ~/.dsh/profiles/
pnpm install
```

### 3. 重启 dsh web

重启 DeepSeek Harness（或 `dsh web` 进程），刷新浏览器即可。

## 🚀 使用

1. 打开 **设置 → 通用 → 主题**，点 **「自定义…」**
2. **主题提案** 页签：点任意预设/提案卡片一键应用；「换一批」重新生成；「恢复默认」还原
3. **主题设计器** 页签：切换主色/副色/面板通道，拖色相/彩度/明度滑杆（或点色相色块），实时预览；支持通道锁定、配色关系、快速变体、AI 命名、JSON 导入导出
4. 「应用主题」提交，「恢复默认」还原

## 🗂️ 目录结构

```
freestyle-dsh-theme/
├── src/
│   ├── index.ts              # Host 半：/api/freestyle-dsh-theme/name AI 命名路由
│   └── client/
│       └── index.ts          # Client 半：主题提案 + 设计器 UI
├── shared/                   # 客户端打包预设（tsdown）
├── cordis.patch.yml          # 插件行注册
├── package.json              # 包声明（dsh.client / dsh.bundle）
├── tsdown.config.ts          # 构建配置
├── docs/images/              # 可视化配图
└── README.md
```

## 🔢 版本管理

本项目遵循 [语义化版本 SemVer](https://semver.org/)。每个发布版本打一个 git tag：

```bash
git tag v0.1.0
git push --tags
```

版本历史见 [Releases](https://github.com/suzike/freestyle-dsh-theme/releases)。

## 📄 License

[BSD-3-Clause](LICENSE)