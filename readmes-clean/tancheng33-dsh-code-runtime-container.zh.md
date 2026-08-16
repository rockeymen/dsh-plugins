# dsh-code-runtime-container

[English](README.md) | 中文

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 代码执行 seam（`ctx.codeRuntime`）的**容器隔离后端**。Code Mode 程序跑在一个全新容器里：无网络、根文件系统只读、丢弃全部 capability，内存/CPU/进程数上限由内核强制。

## 为什么

seam 声明了三种 isolation，只交付了一种。引自 `@deepseek-ai/dsh-code-runtime` 自己的 README：

> **只有 worker-thread 后端交付了**——`'process'`/`'container'` 是已声明的 well-known `isolation` 值，**没有实现；一个硬安全边界有待容器后端。**

而已交付的那个后端对自己的定位同样直白：

> **是收容，不是安全边界**：信任姿态在设计上等同于 bash。

这个默认是合理的——Code Mode 程序是模型写的代码，`bash` 跑的东西也是。但它意味着一个 `run_code` 程序**在 agent 自己的进程里**执行，拥有 agent 的网络、agent 的文件系统，以及 agent 环境里的一切。本后端是给那些不能接受这一点的部署用的。

###  · worker-thread（官方） · 本后端
- 载体 · **worker-thread（官方）**: agent 进程内的 `Worker` · **本后端**: 每次运行一个新容器
- 网络 · **worker-thread（官方）**: agent 的完整网络 · **本后端**: `--network=none`
- 文件系统 · **worker-thread（官方）**: 整台主机，以 agent 用户身份 · **本后端**: 只读根，无主机挂载
- 权限 · **worker-thread（官方）**: agent 的权限 · **本后端**: `--cap-drop=ALL`、`no-new-privileges`、`nobody`
- CPU 失控 · **worker-thread（官方）**: 实测忙时预算 · **本后端**: 内核 CPU 配额 + 墙钟
- 内存失控 · **worker-thread（官方）**: V8 堆上限 · **本后端**: cgroup 内存限制 → OOM kill
- Fork 炸弹 · **worker-thread（官方）**: — · **本后端**: `--pids-limit`
- 冷启动 · **worker-thread（官方）**: 毫秒级 · **本后端**: 约 200 毫秒

## 安装

```sh
dsh plugin --profile <name> add dsh-code-runtime-container
```

需要主机上有容器引擎，且镜像已就绪：

```sh
docker pull node:22-alpine
```

bundle patch 在插入本行时会**禁用 worker-thread 的 `code-runtime` 行**：`ctx.codeRuntime` 每个 context 只接受一个实现。

不需要构建镜像，也不需要 bind mount——容器内的 runner 是通过命令行传给 `node -e` 的，所以上游原版镜像可以直接用。`podman` 和 `nerdctl` 通过 `dockerPath` 同样可用。

## 配置

每个默认值都是最严格的那个；一个以隔离为卖点的后端，不该是"配置之后才安全"。

### 键 · 默认值 · 含义
- **键**: `dockerPath` · **默认值**: `docker` · **含义**: 容器 CLI。任何与 `docker run` argv 兼容的都行。
- **键**: `image` · **默认值**: `node:22-alpine` · **含义**: 只需要 `PATH` 上有 `node`，别的不需要。
- **键**: `network` · **默认值**: `none` · **含义**: Docker 网络模式。**用本后端的首要理由。**
- **键**: `memory` · **默认值**: `512m` · **含义**: 内存上限；超出是 OOM kill，上报为 `worker-exit`。
- **键**: `cpus` · **默认值**: `1` · **含义**: 内核强制的 CPU 配额。
- **键**: `pidsLimit` · **默认值**: `128` · **含义**: 容器内进程数上限：fork 炸弹撞的是它，不是主机。
- **键**: `user` · **默认值**: `65534:65534` · **含义**: `nobody:nogroup`。留空则用镜像默认。
- **键**: `readOnlyRootfs` · **默认值**: `true` · **含义**: 只读根，`/tmp` 挂 tmpfs。
- **键**: `tmpfsMb` · **默认值**: `64` · **含义**: 该 tmpfs 的大小。
- **键**: `workspacePath` · **默认值**: `''` · **含义**: 挂到 `/workspace` 的主机绝对路径。留空则不挂。
- **键**: `workspaceReadOnly` · **默认值**: `true` · **含义**: 工作区只读挂载。
- **键**: `extraArgs` · **默认值**: `[]` · **含义**: 额外的 `docker run` 参数。**一个能削弱上面所有默认值的逃生舱。**
- **键**: `maxWallMs` · **默认值**: `120000` · **含义**: 单次运行的墙钟上限，含容器启动。
- **键**: `maxOutputBytes` · **默认值**: `4194304` · **含义**: 日志加完成值的合并上限。

需要读项目文件的程序要挂载：

```yaml
- id: code-runtime-container
  config:
    workspacePath: /Users/me/projects/app
    workspaceReadOnly: true
    # …其余键照样重写；patch 会替换整行 config
```

## 威胁模型

seam 明确写了 `isolation` 是**"给部署和诊断用的标签，不是安全声明"**。所以下面是实际的声明，说窄不说宽。

**程序做不到的事（均有针对真实容器的测试验证）：**

- 访问网络（`fetch` 失败；`--network=none`）。
- 写根文件系统（`EROFS`）。
- 看到任何主机路径——不挂载时 `/workspace` 根本不存在。
- 以 root 运行（`uid` 是 `65534`）。
- 观察或影响另一次运行：每次运行都是新容器，上一次设的全局变量在下一次已经没了。
- 活过自己的预算：`while(true){}` 会被杀，而且是**按名字杀容器**，不只是杀 `docker run` 客户端。
- 伪造结果。每个控制帧都带一个每次运行随机的 nonce，经 stdin 送达、只存在于 runner 的模块作用域——不在任何全局上，不在 `argv` 或 `env` 里（这两者程序都能读）。程序往 stdout 写 `{"t":"done","value":"FORGED"}`，那一行会被计为**输出**，不是控制。
- 通过替换内建函数破坏传输：`JSON.stringify` 和 `process.stdout.write` 在程序运行前就已被捕获。

**它防不住的：**

- **内核或容器运行时逃逸。** 这是容器，不是虚拟机。内核、运行时或引擎的本地提权漏洞可以击穿它。如果你的威胁模型包含这个，请用 VM 支撑的引擎（把 `dockerPath` 指向 Kata/Firecracker 兼容的 CLI）或独立主机。
- **你挂进去的东西。** 可写的 `workspacePath` 是一条通往你项目的真实写路径。这正是这个选项的用途，也是唯一一个会实质性放宽边界的设置。
- **`extraArgs` 打开的口子。** 它原样传给 `docker run`；在那里写 `--network=host` 就把招牌特性废掉了。
- **binding 本身。** 程序可以调用 consumer 暴露的每一个宿主函数，在预算内调多少次都行。隔离**程序**不等于收窄**工具**——那是工具注册表的门禁，不是本 seam 的事。工具调用侧见 [`dsh-egress-guard`](https://github.com/tancheng33/dsh-egress-guard)。
- **agent 对 Docker socket 的访问。** 本插件以 agent 用户身份运行 docker 客户端。能访问 Docker socket 的用户通常就能拿到主机 root——那是你 Docker 配置的性质，不是本插件的。

## 语义

seam 契约按原文遵守：

- **错误是结果字段，不是 reject。** 所有程序层面的结局——异常、不可擦除的 TypeScript、超时、中止、OOM、有损完成值、输出超限——都以 `{ logs, error: { kind, message } }` resolve。`run()` **只**在契约误用时 reject：runtime 已销毁，或 binding 命名空间违反可移植标识符规则。
- **可移植标识符规则直接引用 seam 导出的集合**（`PORTABLE_RESERVED_WORDS`、`RESERVED_BINDING_GLOBALS`、`RESERVED_ERROR_MEMBERS`、`DUNDER_MEMBER`），而不是在这里重抄一遍——所以 `lambda` 在这个 TypeScript 后端上也会被拒，和 Python 后端一致；将来集合扩大，升一次依赖就同步了。
- **binding 成员是 null 原型对象的自有属性**，所以名为 `__proto__` 或 `constructor` 的函数就是普通成员。
- **声明的 `errorClass` 会在程序里被真正物化**，所以 `e instanceof ToolCallError` 成立，失败的成员名会落在声明的属性上。
- **顶层 `await` 和 `return` 可用。** 程序先被包裹、再 strip、再按字节偏移切回来（`mode: 'strip'` 保留位置），所以裸 `return` 不是语法错误。
- **只支持可擦除语法**，与官方后端一致：`enum` 和 namespace 是程序失败，不是静默转换。
- **销毁到静默。** 拆卸会把 runtime 标记为不可用、杀掉每个在途容器，并等待各自退出。

### 与 worker 后端的差异

- **`computeMs` 没有等价物。** worker 后端靠实测事件循环忙时来防止热循环藏在一个待决派发后面。跨容器边界拿不到这个测量，所以 CPU 由内核（`--cpus`）限、耗时由 `maxWallMs` 限。这是一处真实的行为差异：一个长时间 sleep 的程序在这里消耗墙钟预算，而 worker 后端只会记它的忙时。
- **每次运行冷启动约 200 毫秒**，worker 大约是 1 毫秒。相对一次 LLM 往返这不算什么，但也不是免费的。
- **`isolation` 报 `'container'`**，seam 视其为信息性字段。

## 测试

63 个测试，其中 26 个跑在**真实容器引擎**上——覆盖上面每一条隔离声明、两种预算、取消、载体死亡，以及两个敌意程序用例（伪造协议帧、替换 `JSON.stringify`）。

```sh
npm test                                  # 仅单元测试

docker pull node:22-alpine
DSH_CONTAINER_TEST=1 npm test             # 加上实盘容器套件
```

## 限制

- **只支持 TypeScript。** `language` 是 `'typescript'`。seam 声明的另一个 well-known 值是 `'python'`，`dsh-tools` 也已经带了 Python SDK 渲染器，但至今没有 Python 后端——包括本插件。
- **一次运行一个容器，不做池化。** 这正是"跨运行状态不可表达"的来源；那 200 毫秒也花在这里。
- **不支持流式日志。** seam 的 `run()` 是一次性的：日志随 resolve 的结果一起到。被杀的程序仍会显示它死前打印的内容。
- **不代管镜像拉取。** 镜像缺失会以 `worker-exit` 失败呈现并带上引擎输出；请提前拉好。
- **stdio 不做多路复用。** 协议与程序输出共用容器 stdout，靠 nonce 区分。程序的字节永远不会丢——它们会变成日志——但一个输出上 GB 的程序撞到的是 `maxOutputBytes`，而不是流背压。

## 许可证

MIT