# dsh-peak-valley

DeepSeek Harness (DSH) 静态插件：**峰谷时间提醒悬浮窗**。

- 左下角悬浮胶囊显示当前时段：**谷时**（绿点）/ **峰时**（橙点）/ **未配置**（灰点）；
- 带「Xh Ym 后转峰/谷」倒计时，每 30 秒自动刷新；
- 峰时/谷时区间可配置，并**持久化到 DSH `settings.yaml`**。

## 安装

```bash
dsh plugin --profile web add github:CreateCN/dsh-peak-valley
```

或一键脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/CreateCN/dsh-peak-valley/main/install.sh | bash
```

安装后**重启 DeepSeek Harness** 生效。

## 配置

在胶囊「设置」面板里改，或直接编辑 `~/.dsh/settings.yaml`（命名空间 `dsbal-peakvalley`）：

```yaml
dsbal-peakvalley:
  timezone: Asia/Shanghai     # 可选，留空 = 本机时间
  peakRanges:
    - 00:30-16:30            # 峰时区间（每行一个 HH:MM-HH:MM，可跨午夜）
  valleyRanges:
    - 16:30-00:30            # 谷时区间
```

区间格式 `HH:MM-HH:MM`，结束时间早于开始时间表示跨午夜（如 `16:30-00:30`）。

## 卸载

```bash
dsh plugin --profile web rm dsh-peak-valley
# 重启 DSH
```

## 目录结构

```
package.json        # dsh.bundle.patch → cordis.patch.yml；dsh.client → client 半端
cordis.patch.yml    # 插入插件行的 bundle patch
lib/index.js        # Host 半端（配置读写 / RPC 路由）
lib/client.js       # Client 半端（悬浮窗 UI）
install.sh          # 一键安装
uninstall.sh        # 卸载
```
