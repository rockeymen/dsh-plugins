# dsh-plugin-installer

在 WebUI 设置里无感安装 / 卸载 DSH 插件的插件：给「设置 → 插件」新增「插件安装」标签页，填入 npm 包名 / git 地址 / tarball 地址 / 本地目录即可安装并激活，无需手工 `git clone → npm build → dsh plugin add`。

![插件安装标签页](assets/plugin-installer.png)

## 安装本插件

本插件是「单插件」：`dsh plugin add` 只装依赖、不注册单插件，装完还需补一行注册。以下以默认 profile `web` 为例，`$DSH_HOME` 默认为 `~/.dsh`。

**方式一：从 GitHub 安装**

```sh
dsh plugin --profile web add github:showlibia/dsh-plugin-installer
```

**方式二：从源码安装**

```sh
git clone https://github.com/showlibia/dsh-plugin-installer
cd dsh-plugin-installer
pnpm install && pnpm build
dsh plugin --profile web add "link:$PWD"
```

**注册（必须）——整段复制粘贴即可**

```sh
cat >> "$DSH_HOME/profiles/web/cordis.patch.yml" <<'EOF'
- insert:
    - id: plugin-installer
      name: 'dsh-plugin-installer'
EOF
```

`watchUserPatches` 立即热挂载宿主半边，刷新页面即可在 设置 → 插件 → 插件安装 里使用。git/tarball 安装若被 pnpm 拦构建脚本，按提示把 `dsh-plugin-installer` 加进 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 后重跑。

## 功能

- **安装 / 卸载**：后端走原生 `dsh plugin add/remove`（本地目录自动转 `link:`，其余交给 pnpm 解析），实时输出日志。
- **验证门**：注册前在沙箱子进程里验证入口 / peer / 可加载性，坏插件不写入启动配置，防止拖垮 Harness。
- **注册**：单插件写入 `cordis.patch.yml` 并热挂载；bundle 写入 `dsh.profile.bundles`。
- **预设**：包内含 `agent.cordis.yml`（根目录、顶层 `preset/` 目录，或用 `"dsh": { "preset": "./dir" }` 显式指定）时按 Agent 预设安装，整目录复制到 `$DSH_HOME/.agent-presets//`，无需重启即可在 Agent 预设选择器中选用；发布预设包时需把 `agent.cordis.yml`、`preset.yml` 及相对引用的文件一并打包进 `files`。
- **热重载**：「重载」按钮或 `/reload` 命令，bundle 与插件变更无需重启进程、无需整页刷新。若新装 bundle 带原生 addon（如 `node-pty`），reload 会尝试用 `process.dlopen` 把 `.node` 注入当前进程并自动重试一次；ABI/系统库不匹配时仍会提示重启。
- **激活 / 列表**：已装未注册的插件可一键「激活」；列表如实显示 已激活 / 需重启 / 未注册 等状态。

## 使用

打开 设置 → 插件 → 插件安装，输入内容点「安装」即可（本地目录用「选择目录…」或填绝对路径）。bundle 装完后点「重载」生效。若显示「验证失败」，查看日志中的具体原因（入口缺失 / peer 不满足 / import 抛错），修复后重装或卸载。

## 开发

```sh
pnpm install && pnpm build   # 需要 pnpm 11+；构建产物在 lib/
pnpm test                    # vitest 单测
pnpm rescue                  # node scripts/rescue.mjs（救援 CLI）
```

Harness 起不来时用 `node scripts/rescue.mjs --profile web --list/--prune/--remove <name>` 移除坏插件的注册（`--disable <entry-id>` 可临时禁用保留配置）。

## 安全

`/plugin-installer/*` 路由与 `/api` 网关一致走浏览器信任栅栏（回环 Host / `trustedHosts`，拒绝跨站）；插件加载验证在独立子进程完成，第三方代码不进入安装器主进程。