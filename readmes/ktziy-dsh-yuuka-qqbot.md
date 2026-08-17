# 优香 QQ 助手（Yuuka QQ Assistant）

把《蔚蓝档案》的**早濑优香**接入 QQ，做老师的理财会计助手。基于 DeepSeek Harness，fork 自 [@tencent-connect/dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)（MIT）。

## 功能

- **多机器人实例**：一台服务器可跑多个 QQ 机器人账号，互不影响。
- **Web 扫码登录**：在 Harness 设置页点「扫码添加」，手机 QQ 扫码后自动保存凭据并启动。
- **优香的书桌工作区**：所有 QQ 会话归入「优香的书桌」工作区，标题用用户昵称。
- **SQLite 财政预算工具**：记账 / 查明细 / 月度汇总 / 预算 / 搜索，统计全在数据库内完成（省 token）。
- **三档记忆系统**：短期（每日/超 100k 简单压缩）→ 中期（每周、含日期+时段）→ 长期（每 4 周，分「稳定核心事实」与「按周归档」），对话时召回注入。

## 目录结构

```
Yuuka/
├── README.md                 # 本文件
├── .gitignore
├── yuuka-budget/             # 优香人设 + SQLite 预算工具（preset）
│   ├── src/                  #   BudgetService / tools / persona
│   └── preset/yuuka/         #   优香 preset（agent.cordis.yml）
└── yuuka-qqbot/              # QQ 传输 + 多实例 + Web 界面 + 记忆
    ├── src/                  #   gateway / session-manager / qr-login / memory / settings-bridge
    ├── src/client/           #   Web 设置页（React，构建为 lib/client.js）
    ├── lib/client.js         #   已构建的客户端 bundle（随仓库提交，开箱即用）
    └── scripts/build-client.mjs
```

## 安装

两个包都以 `link:`（本地路径）方式装进 Harness profile：

```sh
dsh plugin --profile web add link:/abs/path/Yuuka/yuuka-budget
dsh plugin --profile web add link:/abs/path/Yuuka/yuuka-qqbot
```

> 也可 `dsh plugin --profile web add github:you/yuuka-qq-assistant`（git 安装，需自行先 `pnpm build` 生成 `lib/client.js`）。

## 配置

把 preset 放到可发现位置，并接线（profile 的 `cordis.patch.yml`）：

```sh
mkdir -p "$DSH_HOME/.agent-presets"
cp -r /abs/path/Yuuka/yuuka-budget/preset/yuuka "$DSH_HOME/.agent-presets/yuuka"
```

```yaml
- insert:
    - id: yuuka-budget
      name: 'yuuka-budget'
      config:
        mode: single                 # single | multi | group
        dbPath: '/abs/path/yuuka-budget.sqlite'
        owner: ''
    - id: yuuka-qqbot
      name: 'yuuka-qqbot'
      config:
        preset: yuuka
        cwd: '/abs/path/yuuka-desktop'   # 「优香的书桌」工作区目录
        dataFile: '/abs/path/bots.json'
        memoryDbPath: '/abs/path/memory.sqlite'
```

重启 `dsh web` 后，Web 设置里出现「优香 QQ 机器人」页，扫码即可添加机器人。

## 构建（仅改 client 源码时需要）

```sh
cd yuuka-qqbot
pnpm add -D tsdown
pnpm build          # tsdown && node scripts/build-client.mjs
```

## 说明

- 扫码登录依赖 `@tencent-connect/qqbot-connector`（npm 上标记 UNLICENSED，与官方 dsh-qqbot 用法一致，仅作依赖声明、不打包其源码，见 `yuuka-qqbot/NOTICE`）。
- 重命名机器人不会迁移已有会话目录；如需迁移可自行实现目录搬迁。
- 记忆压缩在消息到达时惰性触发（到点或超阈值）。

## License

MIT（`yuuka-qqbot/LICENSE`）；fork 说明见 `yuuka-qqbot/NOTICE`。
