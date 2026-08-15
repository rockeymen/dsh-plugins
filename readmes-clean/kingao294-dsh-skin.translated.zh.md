#dsh-skin

DeepSeek Harness的皮肤切换器+自定义壁纸——“换皮肤”
本着法典主题的精神。它注册了一个精心策划的目录
将调色板添加到 DSH 的内置主题运行时中，并添加两行
**设置→常规**（内置外观行下方）：

- ** 皮肤 / Skins** — 选择 7 个精选调色板之一（或 **默认 / 默认**
  遵循内置外观）。
- **背景图片/壁纸** — 设置您自己的背景图片，不透明度和
  模糊控制。

这两种选择在重新加载后仍然存在（localStorage）。

## 它是如何工作的

DSH 的主题系统是基于令牌的：Web shell 附带 `--dsw-*` 设计令牌，
`ThemeRuntime` 允许第三方插件注册覆盖主题
每个配色方案的别名层 (`--dsw-alias-*`)。此套餐为常规套餐
双面插件：

- **主机半** (`lib/index.js`) — 插入一个的 `dsh.bundle` 补丁层
  装载机入口（`skin`）；无操作 `apply`，与附带的 ui-* 包完全相同。
- **浏览器一半** (`lib/client.js`) — `dsh.client` 捆绑包（在
  `/plugins/dsh-skin/client.js`）：
  1.通过`ctx.theme.register(...)`注册7款精选皮肤；
  2.恢复保存的皮肤id并与`ctx.theme.setTheme(...)`一起应用；
  3.将壁纸渲染为固定背景层（`z-index: -1`）并堆叠
     使主画布成为一个令牌覆盖（`ctx.theme.overrideTokens`）
     (`--dsw-alias-bg-base`) 和侧边栏 (`--dsw-specific-sidebar-fill`)
     半透明，因此图像可以透过内表面（卡片、
     输入、气泡）保持不透明和可读；
  4. 保持插槽存储与 `theme/change` 同步（并重新着色
     当活动皮肤或明/暗方案发生变化时使用壁纸）；
  5. 将两排安装到 `settings.general.item` 中。

每个皮肤设置其 `colorScheme` (`light`/`dark`)，驱动
`body[data-ds-dark-theme]`，加上作为内联自定义应用的别名令牌覆盖
`` by ui-layout's ThemePresenter.

## Skins

### id · scheme · vibe
- **id**: `ocean` · **scheme**: dark · **vibe**: DeepSeek-blue deep sea
- **id**: `graphite` · **scheme**: dark · **vibe**: neutral monochrome
- **id**: `forest` · **scheme**: dark · **vibe**: green calm
- **id**: `sunset` · **scheme**: dark · **vibe**: warm purple
- **id**: `midnight` · **scheme**: dark · **vibe**: pure black OLED
- **id**: `paper` · **scheme**: light · **vibe**: warm paper
- **id**: `sakura`上的属性 · **方案**：浅色 · **氛围**：粉色口音

选择**默认/默认**恢复到内置外观（遵循系统）
并清除储存的皮肤。

## 壁纸

在**设置→常规→背景图片/壁纸**中：

- **选择图片 / Choose image** — 选择本地图片（≤2MB，存储为数据
  URL，仅保存在此浏览器中）。
- **透明度/不透明度**和**模糊/模糊**滑块调整图像的位置
  用户界面后面。
- **删除图片/删除**清除它。

壁纸位于 `z-index: -1` 固定图层上，因此它仅可见
透过半透明的主画布和侧边栏；消息表面保持其
坚实的背景以提高可读性。它还会跟随您活跃皮肤的色调
（切换皮肤重新对半透明表面进行着色）。

## 坚持

选择存储在 `localStorage`（`dsh-skin:skin`、`dsh-skin:wallpaper`、
`dsh-skin:wallpaper-opacity`、`dsh-skin:wallpaper-blur`）。
DSH 的主机设置线仅将一组列入白名单的命名空间暴露给
浏览器客户端（`dsh-host-apiproxy`中的`WEB_SETTINGS_NAMESPACES`），所以
第三方命名空间将回答 `settings-not-exposed`；产品本身
将远程浏览器首选项保留为进程本地，并且 localStorage 与之匹配
视觉偏好的边界，同时在同一原点上重新加载。

## 安装

从任何地方，将包添加到 `web` 配置文件中：

```sh
dsh plugin --profile web add -w /path/to/dsh-skin
```

> `-w` 标志是必需的：每个配置文件都附带一个 `pnpm-workspace.yaml`，因此
> pnpm 9 将配置文件目录视为工作空间根目录并拒绝裸露的目录
> `add` 与 `ERR_PNPM_ADDING_TO_ROOT`。

这在 `~/.dsh/profiles/web` 中运行 pnpm，安装包并附加它
到`dsh.profile.bundles`（其补丁层插入`skin`加载器条目）。
正在运行的 Web 服务器必须重新启动才能获取新的捆绑层：

```sh
# stop the running instance, then:
dsh web
```

打开 **设置 → 常规** 以使用这两个功能。

## 发布 (npm)

DSH (rc.6) **没有单独的插件市场** - 插件分发
通道*是* npm 注册表。声明 `dsh.bundle` 的包（主机补丁
层）和 `dsh.client`（浏览器包）正是 `dsh plugin
--profile <name> add ` 安装的，因此将此包发布到 npm 是
“上架”在今天的含义：

1. 选择一个唯一的名称（作用域名称更安全，例如 `@yourscope/dsh-skin`）
   填写 `author`、`repository`、`keywords` 和 CHANGELOG。
2. 确保 `files` 发货 `lib/index.js`、`lib/client.js`、`lib/types`、
   `cordis.patch.yml`（已配置）。
3.发布到**官方npm注册表**（本机默认注册表为
   镜像 — 发布到镜像不会到达 npmjs）：
   ```sh
   npm publish --registry https://registry.npmjs.org
   ```
4. 用户安装：
   ```sh
   dsh plugin --profile web add -w @yourscope/dsh-skin
   ```
   然后重新启动`dsh web`。

为用户记录的已知平台边界：浏览器端首选项是
存储在 localStorage 中（第三方设置命名空间不会暴露在
线尚未），并且客户端捆绑包可能只有 `require` 模块表实体
（平台种子+注册客户端捆绑包）。

## 发展

客户端bundle直接以`__ModuleLoader__`bundle格式编写
（与已发货的 `ui-*` 包发出的 tsdown 形状相同），因此无需构建步骤
是必需的。 `lib/client.js` 可能 `require` 仅模块表实体：平台
种子词（`react`，`react/jsx-runtime`，...）和注册的客户端捆绑包
(`@deepseek-ai/dsh-client-runtime/client`、`@deepseek-ai/dsh-client-ui-theme/client`、
……）。编辑后，重新启动Web服务器（捆绑内容被重新散列并
与新的 `rev` 一起服役；加载器条目在启动时重新扫描）。