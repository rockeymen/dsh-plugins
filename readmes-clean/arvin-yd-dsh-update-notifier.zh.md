# dsh-update-notifier

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）的社区版本徽标插件。

**侧边栏左下角常驻显示当前版本号**（如 `v0.1.0-rc.6`）。点击弹出官方 `Modal`：
当前版本 → 最新版本、上次检查时间；版本最新时显示"已是最新"，当 npm 上
[`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh) 的 `latest` 版本更新时，
徽标亮起红点并提供 [复制更新命令] [忽略此版本] [稍后再说]。

**社区插件，非 DeepSeek 官方产品。**

## 原理

- **服务端**（`src/index.js`）：启动时解析本地 DSH 版本；默认启动 10 秒后首次检查 npm
  registry，之后每 6 小时一次；结果缓存在 `GET /dsh-update-check`（可选 `webServer`
  服务，headless 组合不受影响）。响应附带与你安装方式匹配的 `updateHint`：
  npx 缓存安装为 `npm exec @deepseek-ai/dsh@latest web`，其余为
  `npm install -g @deepseek-ai/dsh@latest`。
- **浏览器端**（`client/client.js`）：注册常驻的 `sidebar.footer.action` 插槽，全部用官方
  `ui-primitives`（`StateDot` / `Button` / `Modal`）渲染。状态语义：红点=有更新、
  绿点=已是最新、黄点=检查中/失败/无法识别。"忽略此版本"存于 `localStorage`，直到出现
  更高版本才再次提醒；"稍后再说"仅隐藏本次红点，下一次新检查结果出现时恢复。

## 展示逻辑

**徽标** —— 常驻侧边栏底部（官方 `sidebar.footer.action` 插槽）。官方 shell 的设计是把脚标
堆叠在 Settings 上方；本插件在运行时测量 Settings 行高，用补偿负 margin 把徽标拉到
**Settings 行的右侧**（宽窄切换时自动重新测量）。侧边栏折叠（rail）态只渲染居中圆点。

### 圆点颜色 · 含义
- **圆点颜色**: 🔴 红（error） · **含义**: 有新版本，且未被"忽略此版本"、未"稍后再说"
- **圆点颜色**: 🟢 绿（done） · **含义**: 已是最新版本
- **圆点颜色**: 🟡 黄（warning） · **含义**: 首次检查未返回 / 检查失败 / 本地版本无法识别 / 有可用更新但当前被忽略或稍后

版本文案：正常显示 `v<当前版本>`；首次检查未返回时显示 `…`；本地版本无法识别时显示 `—`。

**弹窗** —— 点击徽标打开，内容随服务端状态分五种：

### 服务端状态 · 弹窗内容
- **服务端状态**: `checking` · **弹窗内容**: 检查中…
- **服务端状态**: `update-available` · **弹窗内容**: 当前 → 最新、上次检查时间、[立即更新]（主按钮，两步确认）、复制更新命令框，底部：[忽略此版本] [稍后再说]
- **服务端状态**: `up-to-date` · **弹窗内容**: 当前 → 最新、"已是最新版本 ✓"，底部：[立即检查]
- **服务端状态**: `error` · **弹窗内容**: 当前 → 最新、"检查失败：<原因>"，底部：[立即检查]
- **服务端状态**: `unknown` · **弹窗内容**: 当前 → 最新、"无法识别本地 dsh 版本"，底部：[立即检查]

**一键更新** —— 点 [立即更新] → 再点确认 → 服务端按你的安装方式执行更新：

- **npx 缓存安装**（`npm exec @deepseek-ai/dsh web`）：后台拉起一个脱离的
  `npm exec --yes @deepseek-ai/dsh@latest web`（先下载新版本）并退出当前进程，让新服务
  接管端口。页面会断开约 10–60 秒，恢复后刷新即可。
- **全局 npm 安装**：执行 `npm install -g @deepseek-ai/dsh@latest` 并回报结果，仍需你
  手动重启 `dsh web`。

重启必然结束当前进程——进行中的会话保存在磁盘（`~/.dsh/sessions`），重启后可继续。

**检查节奏** —— 服务端：启动 10 秒后首查，之后每 `checkIntervalMs`（默认 6 小时）查一次
npm registry（5 秒超时）；浏览器：每 5 分钟轮询 `/dsh-update-check` 并在切回标签页时立即
刷新；[立即检查] / `?force=1` 穿透缓存实时查（2 秒冷却）。"忽略此版本"存于 `localStorage`，
直到出现更高版本才解除；"稍后再说"在下一次新检查结果到达时解除。

## 安装

## 兼容性

- 已在 **dsh 0.1.0-rc.5**（源码 dev clone，web 完整启动 + 端点 E2E）和 **0.1.0-rc.6**
  （npm 安装，host 正常启动，headless 加载级测试零报错）上验证。最后验证日期：**2026-08-15**。
- 跟随 npm 上 `@deepseek-ai/dsh` 的 `latest` 标签，无需锁定某个 dsh commit。

## 安装 / 卸载

安装（npm 名称、git 地址、本地目录均可）：

```sh
dsh plugin --profile web add dsh-update-notifier
dsh plugin --profile web add https://github.com/arvin-yd/dsh-update-notifier.git
dsh plugin --profile web add /path/to/this/repo
```

卸载：

```sh
dsh plugin --profile web rm dsh-update-notifier
```

安装后需重启 `dsh web` 生效。

## 快速开始

1. 装进 `web` profile（见上）并重启：`dsh --profile web --port `。
2. 检查服务端半区是否工作：

   ```sh
   curl http://127.0.0.1:/dsh-update-check
   # {"state":"up-to-date","current":"0.1.0-rc.6","latest":"0.1.0-rc.6","fetchedAt":...,"error":null,"updateHint":"..."}
   ```

3. 左下角脚标常驻显示当前版本（绿点=已是最新）。当 npm `latest` 高于本地版本时变红点，
   弹窗提供 [复制更新命令] [忽略此版本] [稍后再说]。

## 配置

默认值在 `cordis.patch.yml`；覆盖写进 `$DSH_HOME/profiles/web/cordis.patch.yml`：

```yaml
- id: dsh-update-notifier
  config:
    checkIntervalMs: 21600000   # 服务端复查间隔（默认 6 小时）
    timeoutMs: 5000             # registry 请求超时（毫秒）
```

## 权限与数据

- 读取：你的 dsh 安装位置（解析本地版本）、npm 公共 registry（HTTPS，仅公开元数据，
  不发送任何凭证）。
- 写入：磁盘零写入；浏览器端仅在 `localStorage` 存忽略版本号
  （键 `dsh-update-notifier.ignoredVersion`）。
- **一键更新动作**：仅在你两次点击确认后，服务端才会以你的用户身份运行 npm 命令
  （见"一键更新"），npx 安装还会结束当前 dsh 进程以便新版本接管端口。不读取/转发任何
  凭证；更新端点只在确实存在可用更新时接受请求。
- 无遥测、无统计、除 npm registry 外无任何第三方请求。

## 常见问题

- **徽标一直不出现** —— 版本最新时是预期行为；用上面的端点确认 `state` 为 `update-available`
  才会显示。
- **`current` 为 null / 状态 unknown** —— 请通过常规入口启动 dsh（`dsh web` /
  `npm exec @deepseek-ai/dsh web`）；版本探测会依次从运行 bin、插件目录、外围
  `@deepseek-ai/dsh*` 包向上查找。
- **状态 error** —— registry 请求失败（离线/被拦截）；查看 dsh 日志中的
  `[dsh-update-notifier] check failed: ...`，会按 `checkIntervalMs` 自动重试。
- **回滚** —— `dsh plugin --profile web rm dsh-update-notifier` 即彻底移除。

## 开发

```sh
pnpm install
pnpm test
```

## 许可证与安全

MIT。安全问题请通过 GitHub 的
[私密漏洞报告](https://github.com/arvin-yd/dsh-update-notifier/security/advisories/new) 提交。