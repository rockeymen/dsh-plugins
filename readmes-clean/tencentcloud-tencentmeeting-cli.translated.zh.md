# tencentmeeting-cli

[English](README_EN.md) | 中文

腾讯会议命令行工具（CLI），基于腾讯会议开放平台 OAuth2 授权，支持会议管理、录制管理、参会报告等功能。

## 功能特性

- 🔐 **OAuth2 授权登录** — 设备码授权流程，安全无密码
- 📅 **会议管理** — 创建、查询、更新、取消会议，支持周期性会议，管理受邀成员
- 🎬 **录制管理** — 查询录制列表、获取下载地址、智能纪要、转写详情与搜索
- 📊 **参会报告** — 查询参会人列表、等候室成员记录
- 👥 **通讯录** — 按用户名/职位/部门检索企业通讯录成员
- 🛠️ **问题排查** — 导出本地日志，支持按时间范围过滤，打包为 zip 文件
- 🔒 **安全存储** — 凭证使用 AES-256-GCM 加密，明文不落盘
- 🖥️ **跨平台** — 支持 macOS、Linux、Windows

## 安装

### 第一步：安装 CLI

#### 方式一：通过 npm 安装（推荐）

```bash
npm install -g @tencentcloud/tmeet
```

安装完成后即可直接使用 `tmeet` 命令。

> 💡 如果提示 `npm: command not found`，说明尚未安装 Node.js。请前往 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本（已包含 npm）。

#### 方式二：从源码构建

```bash
git clone https://github.com/TencentCloud/tencentmeeting-cli
cd tencentmeeting-cli
go build -ldflags "-X tmeet/cmd.Version=v1.0.0" -o tmeet .
# 或
make build VERSION=v1.0.0
```

### 第二步：安装 CLI-SKILL

```bash
npx skills add TencentCloud/tencentmeeting-cli -y -g
```

## 快速开始

### 1. 登录授权

```bash
tmeet auth login
```

执行后会自动尝试打开系统默认浏览器跳转到授权 URL；若无默认浏览器，则输出授权 URL，手动在浏览器中打开完成扫码授权。CLI 自动轮询结果（超时 5 分钟），凭证加密保存到本地。

> 如需禁用自动打开浏览器，可使用 `--no-browser` 参数：`tmeet auth login --no-browser`

### 2. 创建会议

```bash
tmeet meeting create \
  --subject "周例会" \
  --start "2026-04-10T10:00+08:00" \
  --end "2026-04-10T11:00+08:00"
```

### 3. 查询会议列表

```bash
# 查询进行中/即将开始的会议
tmeet meeting list

# 查询已结束的会议
tmeet meeting list-ended \
  --start "2026-04-01T00:00+08:00" \
  --end "2026-04-30T23:59+08:00"
```

### 4. 登出

```bash
tmeet auth logout
```

## 全局标志

所有命令均支持以下全局标志：

### 标志 · 简写 · 默认值 · 说明
- **标志**: `--format` · **简写**: — · **默认值**: `json` · **说明**: 输出格式：`json`（紧凑格式）\ · `json-pretty`（缩进格式）
- **标志**: `--compact` · **简写**: — · **默认值**: `false` · **说明**: 精简输出模式：仅保留关键字段，过滤冗余字段以降低响应体积，适用于查询/列表类命令
- **标志**: `--version` · **简写**: `-V` · **默认值**: — · **说明**: 查看版本号

**示例：**

```bash
# 查看版本号
tmeet -V

# 以缩进格式输出响应
tmeet meeting get --meeting-id "6953553464429888300" --format json-pretty

# 以精简模式输出查询结果（仅保留关键字段）
tmeet record list --meeting-id "6953553464429888300" --compact
```

## 分页参数说明

自 `v1.0.5` 起，所有支持分页的命令统一采用 **`--page-token` + `--page-size`** 方案。原先的 `--page` / `--pos` / `--size` 参数被标记为 **deprecated**，仍可使用但不再推荐，未来版本可能移除。

> 说明：`record transcript-get` 的 `--pid` / `--limit` 是该命令用于段落定位的独立参数，**不属于**通用分页参数，未被弃用。

**统一用法：**

### 参数 · 类型 · 说明
- **参数**: `--page-token` · **类型**: string · **说明**: 分页游标。**首次查询不传**；后续翻页请将上一次响应中的 `next_page_token` 传入
- **参数**: `--page-size` · **类型**: int · **说明**: 每页大小，不同命令默认值与上限不同，详见各命令说明

**典型分页流程：**

```bash
# 1) 首次查询（不传 page-token）
tmeet record list --meeting-id "6953553464429888300" --page-size 30

# 2) 从响应中取出 next_page_token，用于下一页
tmeet record list \
  --meeting-id "6953553464429888300" \
  --page-size 30 \
  --page-token "<next_page_token>"

# 3) 重复直到 next_page_token 为空，即已到最后一页
```

**各命令 `--page-size` 默认值/最大值速查：**

### 命令 · 默认值 · 最大值 · 旧参数（已弃用）
- **命令**: `meeting list` · **默认值**: 20 · **最大值**: 20 · **旧参数（已弃用）**: —
- **命令**: `meeting list-ended` · **默认值**: 30 · **最大值**: 30 · **旧参数（已弃用）**: `--page`
- **命令**: `meeting search` · **默认值**: 30 · **最大值**: 30 · **旧参数（已弃用）**: —
- **命令**: `meeting invitees-list` · **默认值**: 30 · **最大值**: 30 · **旧参数（已弃用）**: `--pos`
- **命令**: `record list` · **默认值**: 30 · **最大值**: 30 · **旧参数（已弃用）**: `--page`
- **命令**: `record address` · **默认值**: 30 · **最大值**: 30 · **旧参数（已弃用）**: `--page`
- **命令**: `record search` · **默认值**: 30 · **最大值**: 30 · **旧参数（已弃用）**: —
- **命令**: `report participants` · **默认值**: 100 · **最大值**: 100 · **旧参数（已弃用）**: `--pos` / `--size`
- **命令**: `report waiting-room-log` · **默认值**: 100 · **最大值**: 100 · **旧参数（已弃用）**: `--page`

> `record transcript-get` / `record transcript-paragraphs` / `record transcript-search` 暂不支持基于 `--page-token` 的新分页方案。
>
> 兼容性说明：当未传入 `--page-token` 且同时传入了旧分页参数（如 `--page`、`--pos`）时，CLI 会按旧模式发起请求（`page_type=0`）；否则一律按新模式（`page_type=1`）发起请求。

## 命令总览

```
tmeet [--format json|json-pretty] [--compact] [-V]
├── auth
│   ├── login          # OAuth 授权登录
│   ├── logout         # 登出并清除凭证
│   └── status         # 查看当前登录状态
├── meeting
│   ├── create         # 创建会议（支持普通/周期性）
│   ├── update         # 更新会议信息
│   ├── cancel         # 取消会议
│   ├── get            # 获取会议详情
│   ├── list           # 获取进行中/即将开始的会议列表
│   ├── list-ended     # 获取已结束的会议列表
│   ├── search         # 按关键词/会议号/时间范围搜索会议
│   ├── invitees-list    # 获取会议受邀者列表
│   ├── invitees-add     # 添加会议受邀者
│   ├── invitees-remove  # 移除会议受邀者
│   └── invitees-replace # 替换会议受邀者列表
├── contact
│   ├── search         # 搜索企业通讯录成员
│   ├── lookup-by-email # 通过邮箱反查用户信息
│   └── lookup-by-phone # 通过手机号反查用户信息
├── record
│   ├── list           # 查询录制列表
│   ├── address        # 获取录制文件下载地址
│   ├── search         # 按关键词/会议号/会议ID/时间范围搜索录制
│   ├── smart-minutes  # 获取智能纪要
│   ├── transcript-get          # 获取转写详情
│   ├── transcript-paragraphs   # 获取转写段落列表
│   ├── transcript-search       # 搜索转写内容
│   ├── permission-apply-prepare # 预览录制权限申请信息（申请前确认）
│   └── permission-apply-commit  # 提交录制权限申请（用户确认后执行）
├── report
│   ├── participants         # 获取参会人列表
│   ├── waiting-room-log     # 获取等候室成员列表
│   ├── participants-export  # 导出参会成员明细（异步任务）
│   └── job-result           # 获取异步任务结果
├── control
│   ├── call           # 呼叫成员入会（会中邀请呼叫）
│   ├── kick           # 将成员踢出会议（会中踢人）
│   └── waiting-room   # 等候室管理（移入会议/移回等候室/移出）
└── tshoot
    ├── log               # 导出本地日志（支持按时间范围过滤，可选 --upload 上传至服务器）
    └── feedback          # 上报问题排查反馈到服务器
```

## 命令参考

### auth — 授权管理

#### `auth login`

登录并完成 OAuth2 授权，将凭证加密保存到本地。

```bash
tmeet auth login [选项]
```

### 参数 · 类型 · 必填 · 默认值 · 说明
- **参数**: `--no-browser` · **类型**: bool · **必填**: — · **默认值**: `false` · **说明**: 禁用自动打开浏览器。`false`（默认）会尝试自动打开系统默认浏览器跳转到授权 URL；`true` 则仅输出授权 URL，需用户手动在浏览器中打开

执行后会输出授权 URL，CLI 自动轮询授权结果（超时 5 分钟），凭证加密保存到本地。

#### `auth logout`

登出并清除本地认证凭证。

```bash
tmeet auth logout
```

> 无参数。

#### `auth status`

查看当前登录状态，包括 OpenId、AccessToken / RefreshToken 的过期状态和剩余有效时间。

```bash
tmeet auth status
```

> 无参数。未登录时提示 `Not logged in`，已登录时展示凭证有效期信息。

### meeting — 会议管理

#### `meeting create` — 创建会议

```bash
tmeet meeting create --subject <主题> --start <开始时间> --end <结束时间> [选项]
```

### 参数 · 类型 · 必填 · 默认值 · 说明
- **参数**: `--subject` · **类型**: string · **必填**: ✅ · **默认值**: — · **说明**: 会议主题
- **参数**: `--start` · **类型**: string · **必填**: ✅ · **默认值**: — · **说明**: 会议开始时间，ISO 8601，如 `2026-03-12T14:00+08:00`
- **参数**: `--end` · **类型**: string · **必填**: ✅ · **默认值**: — · **说明**: 会议结束时间，ISO 8601，如 `2026-03-12T15:00+08:00`
- **参数**: `--password` · **类型**: string · **必填**: — · **默认值**: — · **说明**: 会议密码（4~6 位数字）
- **参数**: `--timezone` · **类型**: string · **必填**: — · **默认值**: — · **说明**: 时区，可参见 Oracle-TimeZone 标准，如 `Asia/Shanghai`
- **参数**: `--meeting-type` · **类型**: int · **必填**: — · **默认值**: `0` · **说明**: 会议类型：`0`-普通会议，`1`-周期性会议
- **参数**: `--join-type` · **类型**: int · **必填**: — · **默认值**: `0` · **说明**: 成员入会限制：`1`-所有成员可入会，`2`-仅受邀成员可入会，`3`-仅企业内部成员可入会
- **参数**: `--waiting-room` · **类型**: bool · **必填**: — · **默认值**: `false` · **说明**: 是否开启等候室，`true`-开启，`false`-不开启
- **参数**: `--recurring-type` · **类型**: int · **必填**: — · **默认值**: `0` · **说明**: 周期类型（`--meeting-type=1` 时生效）：`0`-每天，`1`-每周一至周五，`2`-每周，`3`-每两周，`4`-每月
- **参数**: `--until-type` · **类型**: int · **必填**: — · **默认值**: `0` · **说明**: 周期结束类型（`--meeting-type=1` 时生效）：`0`-按日期结束重复，`1`-按次数结束重复
- **参数**: `--until-count` · **类型**: int · **必填**: — · **默认值**: `7` · **说明**: 限定会议次数（`--meeting-type=1` 时生效）：每天/每个工作日/每周最大 500，每两周/每月最大 50
- **参数**: `--until-date` · **类型**: string · **必填**: — · **默认值**: — · **说明**: 周期结束日期（`--meeting-type=1` 时生效），ISO 8601，如 `2026-03-12T15:00+08:00`
- **参数**: `--invitees` · **类型**: strings · **必填**: — · **默认值**: — · **说明**: 邀请成员的 openid 列表，逗号分隔或重复传参（最多 100 人，例如 `--invitees open_id1,open_id2`）
- **参数**: `--water-mark-type` · **类型**: int · **必填**: — · **默认值**: `2` · **说明**: 文字水印：`0`-单排，`1`-双排，`2`-关闭● 个人账号：默认为2● 企业/组织账号：  ✧ 企业设置强制态-使用企业设置作为强制态，入参不生效  ✧ 企业未设置强制态-使用企业设置作为默认值，入参覆盖默认值
- **参数**: `--audio-watermark` · **类型**: bool · **必填**: — · **默认值**: `false` · **说明**: 音频水印：`true`-开启，`false`-关闭● 个人账号：默认为false● 企业/组织账号：  ✧ 企业设置强制态-使用企业设置作为强制态，入参不生效  ✧ 企业未设置强制态-使用企业设置作为默认值，入参覆盖默认值
- **参数**: `--auto-record-type` · **类型**: string · **必填**: — · **默认值**: `none` · **说明**: 主持人入会后自动录制会议：`none`-关，`local`-本地，`cloud`-云录制● 个人账号：默认none● 企业/组织账号：  ✧ 企业设置强制态-使用企业设置作为强制态，入参不生效  ✧ 企业未设置强制态-使用企业设置作为默认值，入参覆盖默认值
- **参数**: `--auto-asr` · **类型**: bool · **必填**: — · **默认值**: `false` · **说明**: 自动文字转写：`true`-开，`false`-关● 个人账号：默认false● 企业/组织账号：  ✧ 企业设置强制态-使用企业设置作为强制态，入参不生效  ✧ 企业未设置强制态-使用企业设置作为默认值，入参覆盖默认值

**示例：**

```bash
# 创建普通会议
tmeet meeting create \
  --subject "项目评审" \
  --start "2026-04-10T14:00+08:00" \
  --end "2026-04-10T16:00+08:00" \
  --password "123456" \
  --waiting-room

# 创建每周重复会议（共 10 次）
tmeet meeting create \
  --subject "每周站会" \
  --start "2026-04-10T09:30+08:00" \
  --end "2026-04-10T10:00+08:00" \
  --meeting-type 1 \
  --recurring-type 2 \
  --until-type 1 \
  --until-count 10

# 创建会议并邀请成员
tmeet meeting create \
  --subject "需求评审" \
  --start "2026-04-10T14:00+08:00" \
  --end "2026-04-10T15:00+08:00" \