# dsh-experience-library — 更有经验的 DeepSeek

> **meow-memory 让你的 AI 记住,我让你的 AI 记住"对的做法"。**
>
> 本项目的方法论与调度机制深受 [dsh-meow-memory](https://github.com/Phant0Meow/dsh-meow-memory)(@Phant0Meow) 启发:
> 全自动空闲派发机制参考了它的 dream 调度(窗口表 + idleMinutes + 租约防重),并作为**适配器**对接它的 lesson 层。
> 思路起点:记忆插件解决"记住",而本插件解决"记住**对的做法**"——验证过滤幻觉,固化可复用的操作流程。

## 为什么需要它

- meow-memory 解决"**记住**"(陈述性记忆);经验库解决"**记住对的做法**"(程序性经验,验证过滤幻觉)
- **三层检验**:层1 清单可见 → 层2 触发翻书 → 层3 至少 3 个新会话抽样且成功率 ≥2/3 = "已验证"
- **双轨判定**:结果导向为主(行为正确 + 一次成功即通过)+ 措辞指纹为辅(技能书签名句,如"先查地图,再下铲子")
- **Benchmark 验证**:复杂任务上经验库成功率 100% vs 裸环境 60%、耗时快 4.7 倍、thinking 降 77%(详见 Benchmark 章节)

## 经验分层(重要)

### 层级 · 内容 · 说明
- **层级**: **核心经验(机制)** · **内容**: locate-index-guide(按索引找文件,即"读 index.js 那个")+ 未来将加入的"偷懒 skill"(路由:任务先翻经验目录再决定调用哪本) · **说明**: 经验库**运行机制本身**依赖的经验,项目自带
- **层级**: **试验经验(示例)** · **内容**: `skills/` 下 10 本技能书(YAML 引号/会话日志修复/插槽注册/信封/沙箱/晨报/壁纸/插件三关/benchmark 设计/位置索引) · **说明**: **供复现 benchmark 与演示**,内容来自本项目开发实战;你可以在 `~/.dsh/skills/` 积累自己的经验,机制会帮你自动沉淀

**核心思路**:经验库不限定技能书内容——它提供"采集 → 加工 → 验证 → 固化 → 翻书"的闭环,书本身由你的使用过程自动积累。仓库里的 10 本只是**试验经验**(可复现的样例),你自己的经验库会随使用增长。

## 功能(零件图)

### 零件 · 说明
- **零件**: 1 实时采集 · **说明**: `session/event` 全量事件流,每轮 turn/end 打标落盘(零 token)
- **零件**: 2 定时聚合 · **说明**: 30s 全量重算 `stats.json`,GET /experience-library/stats 现算
- **零件**: 3 半自动加工 · **说明**: `experience_refine` 工具(list/done)把 pending 队列提炼成技能书
- **零件**: 3b 全自动派活 · **说明**: 空闲检测(借鉴 meow-memory dream 调度,独立重写),error/search 攒批自动发任务提炼
- **零件**: 位置索引 · **说明**: `locate-index.json` + read offset/limit 局部读,砍重复定位(基线 21.3%)
- **零件**: 技能书库 · **说明**: 10 本试验经验,层1 清单可见 ✅
- **零件**: 适配器 · **说明**: 对接任意 memory 插件的"教训层",meow-memory 已实现

## 安装

1. 把插件目录放进 profile 的 `plugins/`(或通过 dshmarket 安装)
2. profile `package.json` 的 bundles 加入 `@libiwolve/dsh-experience-library`(或 `cordis.patch.yml` 补丁)
3. 重启 DSH,设置页出现"经验库"选项卡

## 配置(设置页选项卡可调)

### 配置项 · 默认 · 含义
- **配置项**: enabled · **默认**: true · **含义**: 全自动派活总开关
- **配置项**: windowStart / windowEnd · **默认**: 0 / 7 · **含义**: 夜间派活窗口(小时)
- **配置项**: idleMinutes · **默认**: 30 · **含义**: 全局空闲阈值(距最后活动 N 分钟才派活)
- **配置项**: checkMinutes · **默认**: 5 · **含义**: 守门员检查周期
- **配置项**: minErrorBatch / minSearchBatch · **默认**: 3 / 3 · **含义**: 错误/搜索样本攒够 N 条自动提炼

## 接口

- `GET /experience-library/skills` — 技能书清单(层1 检验)
- `GET /experience-library/stats` — 聚合统计(token/翻书/重试/犹豫)
- `GET /experience-library/dispatch?force=1` — 手动触发一次派活检查(调试/benchmark 用)
- `GET /experience-library/pending` — 待加工队列(按分类分组)
- `PUT /experience-library/skills` — 技能书编辑写回(watcher 即时生效)

## Benchmark(2026-08-24 完成)

四组对照实验,验证方法论增益(统一口径:experience-audit.mjs 五分类 exec/correct/know/locate + reasoning 统计):

### 组 · 组合
- **组**: bare · **组合**: 仅有 deepseek-harness
- **组**: meow · **组合**: deepseek-harness + meow-memory
- **组**: experience · **组合**: deepseek-harness + 经验库(技能书)
- **组**: full · **组合**: deepseek-harness + meow-memory + 经验库

**结果**:

### 场景 · 关键数据
- **场景**: 简单任务(领域内 6 + HumanEval 10) · **关键数据**: 64/64 全 PASS —— 经验库/meow **不拖后腿**(H4)
- **场景**: 翻书机制 · **关键数据**: experience/full 领域内 **6/6 精准命中**对应技能书(层2)
- **场景**: **复杂任务(会话日志修复 ×5)** · **关键数据**: **experience 100% vs bare 60%**,耗时 86s vs 405s(**快 4.7 倍**),thinking 降 **77%**

**结论:经验库增益 ∝ 任务陌生度**——对模型"本来就会"的任务翻书无增益;对未知领域的坑(zstd 多帧、信封协议、插槽注册),经验库是"救命稻草":把成功率从 60% 拉到 100%,时间减半以上。

## 适配器机制(与记忆插件结合)

经验库**不绑定任何记忆插件**,通过**适配器(Adapter)**对接:从任意 memory 插件的"教训层"抓取原料 → 经验库验证过滤(去幻觉)→ 固化成技能书。

### 为什么用适配器

- meow-memory 负责"记住"(反思轮自动产 lesson),经验库负责"记住对的做法"(验证 + 固化)
- 换记忆插件 = 换适配器,经验库核心逻辑零改动
- **没有记忆插件也能独立工作**(信号采集 + 模型主动沉淀两条入口不受影响)

### 统一接口约定

任何 memory 插件适配器只需实现一个接口:

```ts
interface MemoryAdapter {
  listLessons(): Promise<Lesson[]>
}
interface Lesson {
  id: string; content: string;
  importance: number; corrected: boolean;
  project?: string; keywords?: string;
}
```

### 当前适配器:meow-memory

- 读取 meow-memory 的 SQLite(`<workspace>/.dsh-meow/memory.db`,路径自动解析,不依赖本机布局)的 `lesson` 表(active 且 importance≥3 或 corrected=1)
- 导入动作:`experience_import` 工具(list 查看 / import 导入)→ 教训写入待加工队列(source=`adapter-meow`)
- 导入过的 lesson 记入 processed,**不重复导入**
- 教训经加工轮提炼成技能书,完成"lesson → 经验库 → 技能书"闭环

### 适配新插件

1. 实现 `listLessons()`(读该插件的教训存储)
2. 在 `fetchMeowLessons` 旁加对应读取函数,工具里按插件选择
3. 导入流程(去重/打标/入队)完全复用

### 原料三层入口(适配器是第二层)

### 入口 · 原理 · 例子
- **入口**: ① 信号采集(零 token 自动) · **原理**: 工具失败/重试/搜索/客户端渲染错误 · **例子**: 徽标调试、TDZ 白屏
- **入口**: ② 记忆层抓取(适配器) · **原理**: 从记忆插件 lesson 抓"AI 反思教训" · **例子**: meow-memory lesson
- **入口**: ③ 模型主动沉淀(人工兜底) · **原理**: 用户口述症状/识别高价值 → 主动写 pending · **例子**: 手填技能书

## Credits

- **特别感谢 [dsh-meow-memory](https://github.com/Phant0Meow/dsh-meow-memory)(@Phant0Meow)**:本项目"全自动空闲派发"机制的设计思路源自其 dream 调度(窗口表 + idleMinutes + 租约防重),适配器机制直接对接其 lesson 层;本插件为**独立重写实现**,不包含 meow-memory 代码
- 项目方法论"经验 = 被验证的可行记忆"由用户 libiwolve 提出