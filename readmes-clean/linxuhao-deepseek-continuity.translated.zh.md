#场记/连续性

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件，提供
代理本地图像/语音/音乐/SFX生成**并记住它的制作** - 相同
角色在每次调用中都保持相同的角色，并且绝不允许失败的生成
成功通过。

在本地运行。模型根据请求延迟加载并在空闲时释放，所以**当您
不使用它，GPU 不会受到影响** — 0.21 GiB 驻留，测量。您可以在上面玩游戏
同一张卡。

> 场记是电影片场的连续性主管。他们的整个工作就是两件事：确保
> 镜头之间的服装、头发和道具相匹配，并在拍摄前发现现场的错误
> 切入影片。这正是这个插件的工作。

## 安装

```bash
uvx --from dsh-continuity continuity-setup
```

该命令完成整个后端：预检 → 构建引擎 → 仅获取权重
本机可以使用→启动它们。

> PyPI 发行版是 [**`dsh-continuity`**](https://pypi.org/project/dsh-continuity/)
>（导入名称仍为 `continuity_mcp`）。它*不是* `continuity-mcp`——PyPI 上的那个名字
> 属于不相关的项目，所以不要`uvx continuity-mcp`。
>
> 要从源代码运行：`uvx --from git+https://github.com/linxuhao/Deepseek-Continuity continuity-setup`

然后将该插件添加到您的 dsh 配置文件中。 **`dsh plugin` shells 到 pnpm**，所以安装它
首先，如果你还没有（`corepack enable pnpm`）；如果没有它，命令将停止于
`pnpm not found on PATH`：

```bash
dsh plugin --profile <your-profile> add dsh-plugin-continuity
```

将其添加到已有应用程序包的配置文件中。如果您将其指向*新*配置文件，`dsh`
创建一个仅包含 `@deepseek-ai/dsh-base` 加上此插件的应用程序 - 没有应用程序，因此启动它
不执行任何操作并挂起。自己添加应用程序
`~/.dsh/profiles/<name>/package.json`：

```json
"dsh": { "profile": { "bundles": [
  "@deepseek-ai/dsh-base", "@deepseek-ai/dsh-headless", "dsh-plugin-continuity"
] } }
```

该包从环境中读取其设置，因此导出 `continuity-setup` 打印的内容
在启动配置文件之前为您的机器：

```bash
export CONTINUITY_STATE_DIR=~/.continuity
export CONTINUITY_SD_SERVER=http://127.0.0.1:9020
export CONTINUITY_AUDIO_SERVER=http://127.0.0.1:9021
```

要手动接线 — `continuity-setup` 打印为您的机器填写的此块：

```yaml
- insert:
    - id: continuity
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: continuity
        transport: stdio
        command: uvx
        args: ['--from', 'dsh-continuity', 'continuity-mcp']
        env:
          CONTINUITY_STATE_DIR: !!js process.env.CONTINUITY_STATE_DIR ?? ''
          SD_SERVER: !!js process.env.CONTINUITY_SD_SERVER ?? ''
          AUDIO_SERVER: !!js process.env.CONTINUITY_AUDIO_SERVER ?? ''
```

（完整的行，记录了每个直通：[`bundle/cordis.patch.yml`](https://github.com/linxuhao/Deepseek-Continuity/blob/main/cordis.patch.yml)）

`continuity-setup` 在下载任何内容之前检查机器，并将安装大小调整为
它发现了什么。首先运行 `continuity-setup --check` 看看它会做什么——上面写着
硬件并且没有任何改变：

```
体检结果:
  GPU     AMD Radeon RX 7800 XT (RADV NAVI32)  (16.0 GiB, 此刻可用 15.8 GiB, DISCRETE_GPU, vulkan device 1)
          未选 AMD Radeon RX 7900 XTX (RADV NAVI31) (24.0 GiB, 此刻可用 1.4 GiB)
          跳过 llvmpipe —— 软件渲染, 不是真显卡
  内存    30.9 GiB
  磁盘    3118.4 GiB 可用 / 需要 34 GiB
  生图    启用
  音频    启用
  抠图默认档  best
```

由于天真的版本是错误的，所以存在两个细节：

- **它跳过 `llvmpipe`。** 软件光栅化器宣传 30.9 GiB 的“VRAM”（这是您的
  系统 RAM）并将赢得任何“选择最大的卡”竞赛。然后一切都会继续
  CPU——工作正常，看起来完全正常，而且速度慢得无法使用。
- **它根据可用 VRAM 进行选择，根据总 VRAM 进行门控。** 在 24 GiB 卡以上的机器上
  1.4 GiB 实际上是空闲的，因为另一个进程持有它；按尺寸挑选会选择它并
  然后OOM。但“这张卡足够好吗”是一个硬件问题，因此人们使用总计 -
  否则 16 GiB 卡将因游戏开放而被拒绝。

## 最低要求

### · 最低限度 · 注释
- **GPU** · **最低**：**8 GiB VRAM** · **注释**：峰值为 6.80 GiB（测量值）。请求是序列化的，因此峰值是一个模型，而不是总和。
- **GPU API** · **最低**：**Vulkan 1.2+** · **注释**：**无 CUDA，无 ROCm。** 内核在运行时编译为 SPIR-V。
- **磁盘** · **最小**：**安装期间 34 GiB，安装后 21.8 GiB · **注释**：19.7 权重 + 2.1 运行时映像 + 8.5 构建层（可回收）+ 4 净空。
- **主机 RAM** · **最小**：**16 GiB**（8 GiB 可行 - 见下文） · **注释**：由瞬态峰值驱动，而不是空闲。
- **CPU** · **最低**：任何 x86-64 · **注释**：后台删除在 CPU 上运行。

纯音频安装（见下文）需要 **安装期间 20 GiB，安装后 9.5 GiB **。

本页上的所有 VRAM/RAM 数字均为 **GiB**（2³⁰ 字节），这就是 `rocm-smi` 和
`vulkaninfo` 报告。本自述文件的早期版本将其标记为 GB；那是错误的
使头部空间看起来比实际更紧。

Vulkan 而不是 CUDA 并不是首选——这就是它运行的原因。 ROCm 计算错误
在此 GPU 类上进行 VAE 解码（[ROCm#6633](https://github.com/ROCm/ROCm/issues/6633)）：
相同输入的五次解码返回五个互不相关的结果。 Vulkan/RADV
在运行时编译 SPIR-V，而不是查找每个架构的内核表，并且是正确的
在这里更快。副作用是所有三个供应商之间的可移植性。

### GPU供应商

### · 容器如何获取 GPU · 状态
- **AMD** · **容器如何获取 GPU**：图像内的 `/dev/dri` + mesa RADV · **状态**：**已测试**（RX 7800 XT、RX 7900 XTX）
- **Intel** · **容器如何获取 GPU**：图像内的 `/dev/dri` + mesa ANV — 相同的机制 · **状态**：未经测试
- **NVIDIA** · **容器如何获取 GPU**：`nvidia-container-toolkit` 注入主机驱动程序 (`docker-compose.nvidia.yml`) · **状态**：未经测试

我只有AMD卡，所以我不会要求更多。代码中没有任何内容
AMD 特定的 — 没有 CUDA、没有 ROCm、没有 HIP、没有 `/dev/kfd`、没有 `gfx` 目标 — 以及 ggml 的 Vulkan
后端广泛运行在 NVIDIA 上。但“广泛运行”并不是“我验证过”。

NVIDIA 的路径是真正不同的布线，而不仅仅是不同的卡：NVIDIA 的 Vulkan
ICD 位于主机驱动程序中，必须由 `nvidia-container-toolkit` 注入，
`NVIDIA_DRIVER_CAPABILITIES` 包括 `graphics` — 默认 `compute,utility` 为您提供
Vulkan 中正在运行的 CUDA 和空设备列表。 `continuity-setup`检测到NVIDIA，使用
右键撰写覆盖，并告诉您路径未经验证。无论哪种方式，我们都欢迎报告。

### 主机 RAM 详细信息

空闲可以忽略不计；峰值是机器的尺寸。

###运营·巅峰RSS
- **操作**：空闲 · **峰值 RSS**：0.52 GiB
- **操作**：音乐 · **峰值 RSS**：0.50 GiB
- **操作**：演讲 · **峰值 RSS**：1.63 GiB
- **操作**：图像 (1024²) · **峰值 RSS**：4.94 GiB
- **操作**：`remove_bg` `quality="best"` · **峰值RSS**：**7.74 GiB**
- **操作**：`remove_bg` `quality="fast"` · **峰值 RSS**：1.33 GiB

背景去除是上限，其成本**与输入大小无关** — 256 / 512 /
1024 px 的峰值均约为 6.8 GiB，因为 BiRefNet 以固定的内部分辨率运行。

**在 16 GiB 上一切正常。**低于 12 GiB，`continuity-setup` 将默认设置为
`quality="fast"` (u2netp)：峰值降至 1.33 GiB，运行时间为 0.6 秒，而不是 7.2 秒。上一个
典型的游戏精灵很难用肉眼区分这两个精灵 - 在洋红色上并排检查
边缘放大的背景。在有空间的情况下，`best` 保持默认值，因为
模型在细边缘（头发、半透明边缘）上原则上确实有所不同，但对待 `fast`
作为一个合理的选择而不是一个退化的后备。

## 一条规则，而不是等级列表

作业是序列化的，因此**任何时候都只需要一个模型**。其他一切都是
在工作开始之前释放。这就是整个 VRAM 策略。 （唯一的例外是分裂
部署：如果图像后端与音频后端位于不同的主机上，则它们不是
竞争卡，因此不会发布任何内容 - 释放本地 VRAM 以用于远程作业购买
没有任何东西并且需要重新加载。）

它购买的财产价值不仅仅是节省了几秒钟：**峰值 VRAM 恒定为 6.80 GiB
不管你叫什么，按什么顺序。** 通过交替测量来测量
语音→图像→语音→图像序列：

### · 峰值 · 语音 · 图像 · 6 次调用
- 保持模型驻留 · **峰值**：**10.94 GiB** · **语音**：平均 2.8 秒 · **图像**：11.5 秒 · **6 次调用**：42.9 秒
- 释放不需要的内容 · **峰值**：**6.79 GiB** · **语音**：4.8 秒 · **图像**：11.6 秒 · **6 次调用**：49.2 秒

让它们驻留的速度提高了 16%，并且**不适合 8 GiB 卡** — 并且“说出一句台词，
然后画一些东西”是