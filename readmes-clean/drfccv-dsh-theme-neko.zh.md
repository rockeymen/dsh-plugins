# 🐱 neko-theme

DeepSeek Harness Web 界面的 **Nachoneko（甘城猫猫）主题皮肤**。

界面使用 Amashiro Natsuki 的 Nachoneko 画作作为壁纸背景，并应用与之匹配的蓝白配色。

## 截图

![neko-theme 截图](sample/screenshot.png)

## 功能

- Nachoneko 壁纸背景，支持亮色与暗色
- 界面表面（输入框、弹出菜单、设置对话框）采用与画作一致的配色
- 提示框、聚焦状态与按钮的可读性调整

## 环境要求

- DeepSeek Harness，使用 `web` profile

## 安装

将插件安装到你的 profile：

```sh
dsh plugin --profile web add dsh-theme-neko
```

重启 Web 界面以加载插件：

```sh
dsh web
```

重启后主题自动生效。

## 使用

- 插件位于 设置 → 插件，名称为 `dsh-theme-neko`
- 更换壁纸：覆盖 `assets/wallpaper.png` 后重新构建并安装
- 卸载：

```sh
dsh plugin --profile web remove dsh-theme-neko
```

## 开发

```sh
pnpm install
pnpm build
npm publish
```

## 许可

软件采用 MIT 许可，见 [LICENSE](LICENSE)。

内置壁纸不属于软件许可范围，版权归属见 [THIRD-PARTY-NOTICE.md](THIRD-PARTY-NOTICE.md)。

### 背景画作

- **作者：** Amashiro Natsuki (Nachoneko)
- **来源：** <https://amashiro.com/wp-content/uploads/2021/12/10.png>
- **官方画廊：** <https://amashiro.com/gallery/>
- **版权：** © Amashiro Natsuki

该画作不属于本项目的软件许可范围，所有权利归原著作权人所有。