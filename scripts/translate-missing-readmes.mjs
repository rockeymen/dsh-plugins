import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const dataUrl = new URL('../plugins-data.js', import.meta.url);
const cleanDir = new URL('../readmes-clean/', import.meta.url);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const source = await fs.readFile(dataUrl, 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}; result = plugins;`, context);
const plugins = context.result;
const args = process.argv.slice(2);
const idsFileIndex = args.indexOf('--ids-file');
let targetIds = null;
if (idsFileIndex >= 0 && args[idsFileIndex + 1]) {
  const manifest = JSON.parse(await fs.readFile(new URL(`../${args[idsFileIndex + 1]}`, import.meta.url), 'utf8'));
  targetIds = new Set(manifest.newIds || []);
}
const targetPlugins = targetIds ? plugins.filter(plugin => targetIds.has(plugin.id)) : plugins;

function cjkCount(value = '') {
  return (value.match(/[\u3400-\u9fff]/g) || []).length;
}

function protect(value, plugin) {
  const tokens = [];
  const keep = match => {
    const token = `ZXQ${tokens.length}QXZ`;
    tokens.push(match);
    return token;
  };
  let text = value
    .replace(/```[\s\S]*?```/g, keep)
    .replace(/`[^`]+`/g, keep)
    .replace(/\]\([^)]+\)/g, keep)
    .replace(/https?:\/\/[^\s)]+/g, keep);
  for (const term of [plugin.name, 'DeepSeek Harness', 'Claude Code', 'OpenAI', 'GitHub', 'MCP', 'DSH']) {
    if (!term) continue;
    text = text.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), keep);
  }
  return {text, restore(translated) {
    return translated.replace(/ZXQ\s*(\d+)\s*QXZ/gi, (_, index) => tokens[Number(index)] || '');
  }};
}

async function translateText(value, plugin, sourceLanguage = 'auto') {
  if (!value.trim() || cjkCount(value) > Math.max(12, value.length * 0.08)) return value;
  const {text, restore} = protect(value, plugin);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
      if (!response.ok) throw new Error(`translate ${response.status}`);
      const data = await response.json();
      return restore((data[0] || []).map(item => item[0] || '').join(''));
    } catch (error) {
      if (attempt === 5) throw error;
      await delay(attempt * 900);
    }
  }
}

function chunksFor(markdown, maxLength = 2800) {
  const blocks = markdown.split(/\n{2,}/);
  const chunks = [];
  let current = '';
  for (const block of blocks) {
    if (!block.trim()) continue;
    if (current && current.length + block.length + 2 > maxLength) {
      chunks.push(current);
      current = '';
    }
    if (block.length > maxLength) {
      if (current) { chunks.push(current); current = ''; }
      for (let start = 0; start < block.length; start += maxLength) chunks.push(block.slice(start, start + maxLength));
    } else current += `${current ? '\n\n' : ''}${block}`;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateMarkdown(markdown, plugin) {
  const sourceText = markdown.slice(0, 9000);
  const chunks = chunksFor(sourceText);
  const translated = [];
  for (const chunk of chunks) {
    translated.push(await translateText(chunk, plugin));
    await delay(120);
  }
  return translated.join('\n\n').replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').replace(/[ \t]+\n/g, '\n').trim();
}

function plainText(markdown = '') {
  return markdown.replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, ' ').replace(/[`*_>#|]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function chineseSummary(markdown = '', plugin) {
  const sourceLines = markdown.split('\n');
  const introIndex = sourceLines.findIndex(line => /^#{1,6}\s+.*(?:什么是|项目介绍|项目简介|简介|概述|定位|overview|about)/i.test(line));
  const ordered = introIndex >= 0 ? [...sourceLines.slice(introIndex + 1), ...sourceLines.slice(0, introIndex)] : sourceLines;
  const clauses = ordered.map(line => plainText(line))
    .flatMap(line => line.split(/(?<=[。！？；])/))
    .map(line => line.replace(/^(?:简体中文|繁體中文|English|中文)(?:\s*[·|/]\s*)?/i, '').trim())
    .filter(line => cjkCount(line) >= 6 && line.length >= 10 && line.length <= 260)
    .filter(line => !/(?:更新日志|版本历史|目录|内容导航|语言切换|快速开始|安装|许可证|贡献指南|支持状态)/.test(line))
    .filter(line => !/(?:欢迎|请考虑|点一个|给仓库|关注).*(?:Star|支持|加入|关注)/i.test(line))
    .filter(line => !/^(?:该仓库未提供|来自 GitHub 的)/.test(line));
  const preferred = clauses.find(line => /工具|插件|工作台|平台|客户端|主题|界面|系统|管理器|搜索|浏览器|可视化|技能|代理|助手|服务|扩展|运行时|连接器|开发环境|桌面应用|替代品|蒸馏|编辑器|面板|桥梁|目录|终端|工作空间|智能体|机制|指南|资源|课堂|沙箱|钱包|监控/.test(line));
  const summary = preferred || clauses[0] || '';
  if (summary) return summary.replace(new RegExp(`^${plugin.name}\\s*`, 'i'), '').slice(0, 180);
  const fallback = plugin.descriptionEn || plugin.summaryEn || '';
  return cjkCount(fallback) >= 8 ? fallback.slice(0, 180) : '';
}

function chineseTitle(plugin, translated, summary = '') {
  const sourceLines = translated.split('\n');
  const headings = sourceLines.filter(line => /^#{1,6}\s+/.test(line))
    .filter(line => !/(?:什么是|项目介绍|简介|概述|定位|更新日志|版本历史|目录|内容导航|语言切换|快速开始|安装|许可证|贡献指南|支持状态|现已支持)/i.test(line));
  const introIndex = sourceLines.findIndex(line => /^#{1,6}\s+.*(?:什么是|项目介绍|简介|概述|定位|overview|about)/i.test(line));
  const ordered = introIndex >= 0 ? [...sourceLines.slice(introIndex + 1), ...sourceLines.slice(0, introIndex)] : sourceLines;
  const titleSources = summary.length <= 72
    ? [summary, ...headings.map(line => plainText(line)), ...ordered.map(line => plainText(line))]
    : [...headings.map(line => plainText(line)), summary, ...ordered.map(line => plainText(line))];
  const clauses = titleSources.flatMap(line => line.split(/[。！？；]|\s+[—–-]{2,}\s+/))
    .map(line => line.replace(new RegExp(`^${plugin.name}\\s*`, 'i'), '').replace(/^.*(?:一句话介绍|一句话定位|项目定位|定位)[:：]\s*/, '').replace(/^(?:English|中文|简体中文|繁體中文)\s*/i, '').trim())
    .filter(line => cjkCount(line) >= 3 && line.length >= 4 && line.length <= 110)
    .filter(line => !/(?:更新日志|版本历史|目录|内容导航|语言切换|快速开始|安装|许可证|贡献指南|支持状态|现已支持|\d{4}[.年/-]\d{1,2}|来自 GitHub 的)/.test(line));
  const keyword = /工具|插件|工作台|平台|客户端|主题|界面|系统|管理器|搜索|浏览器|可视化|技能|代理|助手|服务|扩展|运行时|连接器|开发环境|桌面应用|替代品|蒸馏|编辑器|面板|桥梁|目录|终端|工作空间|智能体|沙箱|钱包|监控|课程|教学|看板|桌面端/;
  const titles = clauses.map(line => {
    const parts = line.split(/[；，,:：·]/).map(part => part.trim()).filter(Boolean);
    const meaningful = parts.filter(part => cjkCount(part) >= 3);
    const selected = meaningful.find(part => keyword.test(part)) || meaningful.sort((a, b) => cjkCount(b) - cjkCount(a))[0] || line;
    return selected.replace(/^(?:这是|这是一个|一个|一款|该项目|本项目)\s*/, '').trim();
  })
    .filter(title => cjkCount(title) >= 3 && title.length >= 4);
  const useful = titles.find(title => keyword.test(title)) || titles[0];
  if (useful) return useful;
  return `适用于 DeepSeek Harness 的${({skills:'技能',tools:'工具','model-adapters':'模型适配器',enterprise:'企业工具',productivity:'效率工具',devops:'开发运维工具',themes:'界面主题'}[plugin.category] || '插件')}`;
}

function isGenericDescription(value = '') {
  return !value || /^(?:GitHub repository for the DeepSeek Harness ecosystem\.?|来自 GitHub 的|A dsh plugin\.?|DSH-Desktop)$/i.test(value.trim());
}

function cleanDescriptor(value = '') {
  const localized = value.split(/\s*\|\s*(?=[A-Za-z])/)[0];
  return plainText(localized).replace(/^:[a-z0-9_+-]+:\s*/i, '').replace(/\s+/g, ' ').trim();
}

async function localizedDescriptor(plugin) {
  let source = cleanDescriptor(plugin.descriptionEn || '');
  if (isGenericDescription(source) || source.length < 10) source = cleanDescriptor(plugin.summaryEn || '');
  if (isGenericDescription(source) || source.length < 10) return '';
  if (cjkCount(source) >= 6 && cjkCount(source) / source.length >= 0.14) return source.slice(0, 220);
  const translated = cleanDescriptor(await translateText(source, plugin, 'en'));
  return cjkCount(translated) >= 4 ? translated.slice(0, 220) : '';
}

function descriptorTitle(plugin, description = '') {
  let value = description.replace(new RegExp(`^${plugin.name}\\s*`, 'i'), '').replace(/^[\s·:：—-]+/, '').trim();
  value = value.split(/[🎉🆕📌]/)[0].trim();
  value = value.replace(/^(?:DSH|DeepSeek Harness)\s*(?:的)?\s*插件\s*[:：]\s*/i, '')
    .replace(/^(?:这是|这是一个|是一个|是|向模型暴露|提供一个|提供|用于实现|用于)\s*/, '');
  value = value.split(/[。！？；|]/)[0].trim();
  const boundary = value.match(/^(.{5,36}?)(?:，(?:用于|可|支持|将|让|并|通过)|——| — )/);
  if (boundary) value = boundary[1];
  if (value.length > 38) value = value.split(/[，,:：]/)[0];
  return value.replace(/[，,：:—-]+$/, '').trim();
}

function needsBetterTitle(value = '') {
  return cjkCount(value) < 3 || value.length > 45 || /(?:https?:|\]\(|插件超市|License|开发环境|工具声明|界面预览)/i.test(value)
    || /^(?:是一个|本插件注册|插件不|本插件已|形态|配套|或运行时|依赖服务|插件注册|第三方客户端|官方 bundle)/i.test(value);
}

function needsBetterSummary(value = '') {
  return cjkCount(value) < 6 || /(?:https?:|\]\(|插件超市|License)/i.test(value) || /^[-·]|^(?:来自 GitHub|形态|配套|本插件已|插件不|依赖服务)/i.test(value)
    || /^是一个\s*DeepSeek Harness\s*插件/i.test(value)
    || (value.length > 35 && cjkCount(value) / value.length < 0.16);
}

function projectStyleTitle(plugin) {
  const current = (plugin.displayNameZh || '').replace(/[“”"]/g, '').trim();
  const text = `${current} ${plugin.summaryZh || ''} ${plugin.descriptionEn || ''}`;
  const rules = [
    [/一切都是插件|Everything is a Plugin/i, 'DeepSeek Harness 智能体框架'],
    [/可编辑代码.*设计.*演示.*网站.*视频|self-evolving agent runtime/i, '自进化 AI 工作区'],
    [/架构.*(?:工作流|序列|数据流|生命周期图)|architecture.*workflow/i, '架构可视化技能'],
    [/视觉工具箱|看图.*工具箱|纯文本模型.*(?:视觉|看图|识图)|vision toolkit/i, '智能体视觉工具箱'],
    [/虚拟文件系统|virtual filesystem/i, '智能体虚拟文件系统'],
    [/插件和皮肤集合|Web UI.*(?:任务板|git 图表|右侧面板)/i, 'DSH Web UI 扩展合集'],
    [/VibeSkills|自动路由本地技能/i, '技能路由与编排器'],
    [/(?:插件|生态).*(?:Radar|雷达|自动扫描)/i, 'DSH 插件生态雷达'],
    [/(?:插件).*(?:精选列表|精选清单|目录|catalog)|(?:精选|收集).*(?:插件|生态)/i, 'DSH 插件精选目录'],
    [/插件市场|Plugin Marketplace/i, 'DSH 插件市场'],
    [/AI 代码审查|代码审查/i, 'AI 代码审查工具'],
    [/架构意识|architecture.aware/i, '架构治理助手'],
    [/侧边栏.*工作台|sidebar.*workbench/i, '侧边栏工作台'],
    [/终端.*(?:TUI|交互)|(?:TUI|terminal UI).*(?:Harness|DSH)/i, 'DSH 终端客户端'],
    [/(?:编码能力|coding tools).*MCP|coding-tools-mcp/i, '编码工具 MCP'],
    [/自我进化.*(?:代理操作系统|Agent OS)|self-evolving.*operating system/i, '自进化智能体系统'],
    [/内容发现|内容推荐/i, 'AI 内容发现助手'],
    [/知识图谱.*记忆|graph.*memory/i, '知识图谱记忆插件'],
    [/研究论文|论文工具包|paper toolkit/i, '跨智能体论文工具包'],
    [/900 多种纯 Markdown 技能|自主人工智能研究/i, '自主研究技能库'],
    [/逆向工程|reverse engineer/i, '智能体逆向工程工具'],
    [/腾讯会议.*(?:CLI|命令行)/i, '腾讯会议 CLI'],
    [/桌面宠物|桌宠|QQ 宠物/i, 'DSH 桌面宠物'],
    [/创建你的 AI 角色|角色.*故事世界/i, 'AI 角色互动平台'],
    [/2005年门户网站|模仿广告|假游戏/i, '复古门户广告主题'],
    [/米纳拉|Minara.*华尔街/i, 'AI 金融分析技能包'],
    [/笔记.*代理.*记忆|notes.*agent.*memory/i, '笔记与智能体记忆'],
    [/一站式.*社区发行版|TUI、桌面端与 Web UI/i, 'DSH 社区发行版'],
    [/HarmonyOS NEXT/i, 'HarmonyOS 开发技能包'],
    [/EasyEDA/i, 'EasyEDA 自动化智能体'],
    [/模型配置|model configur/i, 'DSH 模型配置器'],
    [/(?:余额|成本|计费).*(?:监控|统计|面板)|token.*(?:usage|cost)/i, 'DSH 用量与成本面板'],
    [/长期记忆|持久记忆|跨会话.*记忆/i, '跨会话记忆插件'],
    [/任务.*(?:看板|进度|状态条)/i, '任务进度面板'],
    [/搜索.*(?:网页|Web)|web search/i, '网页搜索工具'],
    [/文件.*(?:资源管理器|浏览器|树)|file explorer/i, '工作区文件管理器'],
    [/消息编辑|message edit/i, '会话消息编辑器'],
    [/主题.*(?:合集|集合|皮肤)|皮肤.*(?:合集|系列)/i, 'DSH 界面主题合集'],
    [/(?:桌面端|桌面应用|桌面外壳|desktop shell|desktop app).*(?:DeepSeek Harness|DSH)|(?:DeepSeek Harness|DSH).*(?:桌面端|桌面应用|桌面外壳|desktop)/i, 'DSH 桌面客户端'],
    [/图像上传|image upload/i, '图像上传引擎'],
    [/自动.*(?:继续|续写)|auto.?continue/i, '请求自动续写插件'],
    [/插件.*(?:开发|审核|审计)|plugin.*(?:develop|audit)/i, 'DSH 插件开发工具'],
    [/飞书|Lark.*桥|Feishu/i, '飞书智能体连接器'],
    [/Telegram.*(?:远程|中继|relay)/i, 'Telegram 智能体中继'],
    [/Godot.*(?:桥|bridge|控制)/i, 'Godot 游戏控制桥'],
    [/OpenAPI.*(?:工具|调用)/i, 'OpenAPI 工具连接器']
    ,[/@file|文件引用/i, '工作区文件引用插件']
    ,[/30 秒.*插件|适合你的.*插件/i, 'DSH 插件精选目录']
    ,[/来自 pi 的编码代理|pi.*coding agent/i, 'Pi 编码智能体']
    ,[/搜索、安装并验证插件|find.*install.*plugin/i, 'DSH 插件发现助手']
    ,[/上下文洞察|context.*insight/i, '上下文洞察面板']
    ,[/运行时证据.*热点|runtime.*hotspot/i, '运行时热点分析工具']
    ,[/Deep diving|运行中轮次状态文案|思考状态里那句/i, '运行状态文案插件']
    ,[/Atlas Cloud.*技能|300 多个 AI 模型/i, 'Atlas Cloud 创作技能']
    ,[/AI Inner OS|面向 AI CLI 工具/i, 'AI CLI 工作流插件']
    ,[/账户余额.*会话成本|balance.*session cost/i, '余额与会话成本面板']
    ,[/项目.*AI 代理做好准备|project blueprint/i, 'AI 项目脚手架']
    ,[/吃白饭的大蓝鲸|DeepSeek.*鲸鱼/i, 'DeepSeek 鲸鱼桌宠']
    ,[/SearXNG.*Crawl4AI/i, 'SearXNG 网页搜索插件']
    ,[/连接到 Claude Code.*审查|Claude Code.*审阅/i, 'Claude Code 审阅桥']
    ,[/源码级拆解|中文学习资料/i, 'DSH 源码学习手册']
    ,[/Codex 登录流程|Codex.*OAuth|ChatGPT OAuth/i, 'Codex OAuth 模型连接器']
    ,[/用量热力图|Token.*缓存命中.*余额/i, 'DSH 用量仪表盘']
    ,[/WorkBuddy|CodeBuddy/i, 'WorkBuddy 模型连接器']
    ,[/Office 三件套|docx.*xlsx.*pptx/i, 'Office 文档预览插件']
    ,[/统一管理.*AI 技能|技能.*热开关/i, '多平台技能管理器']
    ,[/agent 跑在手机里|Magisk root/i, 'Android 智能体控制器']
    ,[/Director Toolkit|3D 艺术家|3D artist/i, '3D 创作导演工具箱']
    ,[/侧边栏提问|sidebar.*question/i, '侧边提问面板']
    ,[/会话深度链接|session deeplink/i, '会话深链接插件']
    ,[/AIGC.*无限画布|infinite canvas/i, 'AIGC 无限画布']
    ,[/软件工程工作流程|software engineering workflow/i, '软件工程工作流']
    ,[/Agent Skills.*扩展库|智能体技能.*扩展/i, '智能体扩展与技能库']
    ,[/Tensorlake.*沙箱|tensorlake sandbox/i, 'Tensorlake 沙箱插件']
    ,[/键盘优先命令面板|spotlight/i, 'DSH 命令面板']
    ,[/独奏式.*头脑风暴|Solo Thinking/i, '独立头脑风暴分支']
    ,[/Telegram 移动遥控器|Telegram.*remote control/i, 'Telegram 远程控制器']
    ,[/推理强度|reasoning effort/i, '模型推理强度设置']
    ,[/plugin模板仓库|plugin template/i, 'DSH 插件模板']
    ,[/anydoc|文档转换.*Markdown/i, '通用文档转 Markdown']
    ,[/GrayCode/i, 'GrayCode 编辑器插件']
    ,[/生态热度榜|每日排行榜/i, 'DSH 插件热度榜']
    ,[/git 工作树|worktree/i, 'Git Worktree 管理器']
    ,[/Codex App Server.*模型提供/i, 'Codex App Server 连接器']
    ,[/MCP.*架构开销|MCP.*远程工具/i, 'MCP 工具压缩代理']
    ,[/每轮验证摘要|verification receipt/i, '回合验证摘要']
  ];
  const matched = rules.find(([pattern]) => pattern.test(text));
  if (matched) return matched[1];

  let value = current.replace(/[🥇🥈🥉📖🚀✨⚡🎨🐳🧰]/g, '').replace(/\s+/g, ' ').trim();
  value = value.split(/[｜|]|\s+[—–-]{2,}\s+/)[0].trim();
  value = value.replace(/^(?:世界上第一个|全网第一个|第一个|首个|一个|一款|下一代|轻量级|开源的|本地优先的|本地私有、开源的)\s*/, '');
  value = value.replace(/^(?:为|给|让|把|将|使用|通过|专门为|适用于|面向)[^，。；:：]{0,30}?(?:打造的|设计的|提供的|使用的|带来|变成|实现|用于)?\s*/, '');
  value = value.replace(/^.+?(?:是一个|是一种|是由)\s*/, '');
  value = value.replace(/^[、，,:：]+/, '').trim();

  const nounSuffixes = ['虚拟文件系统','桌面应用程序','桌面应用','桌面客户端','插件市场','视觉工具箱','文件管理器','代码审查工具','模型配置器','工作流代理','智能体框架','代理运行时','桌面外壳','终端客户端','管理器','工作台','工具箱','工具包','生成器','浏览器','客户端','连接器','适配器','路由器','查看器','编辑器','启动器','仪表盘','控制器','运行时','沙箱','终端','技能包','技能','智能体','代理','助手','插件','主题','皮肤','市场','目录','清单','合集','集合','系统','平台','框架','协议','预设','套件','扩展','工具','引擎','画廊','桌宠','伙伴','工作流','可视化'];
  const suffix = nounSuffixes.find(item => value.includes(item));
  if (value.length > 22 && suffix) {
    const end = value.indexOf(suffix) + suffix.length;
    let start = Math.max(0, end - suffix.length - 16);
    while (start > 0 && /[A-Za-z0-9]/.test(value[start]) && /[A-Za-z0-9]/.test(value[start - 1])) start -= 1;
    let phrase = value.slice(start, end);
    phrase = phrase.split(/[，,:：。；]/).pop().replace(/^.*的(?=.{2,16}$)/, '').replace(/^(?:更好的|完整的|统一的|现代化的|自主的|高级的|通用的|纯|可配置的)\s*/, '').trim();
    if (cjkCount(phrase) >= 3 && phrase.length >= 4) value = phrase;
  }
  value = value.replace(/[，,:：。；（(]+$/, '').trim();
  if (value.length > 26) {
    const short = value.split(/[，,:：。；（(]/)[0].trim();
    if (short.length >= 4) value = short;
  }
  return value || current;
}

async function worker(queue, stats) {
  while (queue.length) {
    const plugin = queue.shift();
    const sourcePath = plugin.readmeCleanPath || plugin.readmeRawPath;
    if (!sourcePath) continue;
    const translatedFilename = `${plugin.id}.translated.zh.md`;
    const translatedUrl = new URL(translatedFilename, cleanDir);
    let translated = '';
    try { translated = await fs.readFile(translatedUrl, 'utf8'); } catch {}
    if (!translated || cjkCount(translated) < 20) {
      const english = await fs.readFile(new URL(`../${sourcePath}`, import.meta.url), 'utf8');
      translated = await translateMarkdown(english, plugin);
      if (cjkCount(translated) < 20) {
        const fallback = await translateText(plugin.descriptionEn || plugin.summaryEn || plugin.readmeExcerpt || '', plugin, 'en');
        translated = `# ${plugin.displayNameEn || plugin.name}\n\n${fallback}`.trim();
      }
      await fs.writeFile(translatedUrl, translated, 'utf8');
      stats.translated += 1;
    } else stats.cached += 1;
    plugin.readmeZhPath = `readmes-clean/${translatedFilename}`;
    plugin.readmeZhSource = 'translated';
    const summary = chineseSummary(translated, plugin);
    plugin.summaryZh = summary || plugin.summaryZh;
    plugin.description = plugin.summaryZh;
    plugin.displayNameZh = chineseTitle(plugin, translated, plugin.summaryZh);
    stats.completed += 1;
    if (stats.completed % 20 === 0) console.error(`Chinese fallback ${stats.completed}/${stats.total}`);
  }
}

for (const plugin of targetPlugins) {
  if (plugin.readmeZhPath && !plugin.readmeZhPath.endsWith('.translated.zh.md')) {
    plugin.readmeZhSource = 'repository';
    try {
      const zh = await fs.readFile(new URL(`../${plugin.readmeZhPath}`, import.meta.url), 'utf8');
      if (cjkCount(zh) < 20) {
        plugin.readmeZhPath = '';
        plugin.readmeZhSource = '';
      } else {
        plugin.summaryZh = chineseSummary(zh, plugin) || plugin.summaryZh;
        plugin.description = plugin.summaryZh;
        plugin.displayNameZh = chineseTitle(plugin, zh, plugin.summaryZh);
      }
    } catch {}
  } else if (plugin.readmeZhPath?.endsWith('.translated.zh.md')) {
    plugin.readmeZhSource = 'translated';
  }
}

const queue = targetPlugins.filter(plugin => !plugin.readmeZhPath || plugin.readmeZhPath.endsWith('.translated.zh.md'));
const stats = {total: queue.length, completed: 0, translated: 0, cached: 0};
await Promise.all(Array.from({length: 4}, () => worker(queue, stats)));

const descriptorQueue = [...targetPlugins];
async function descriptorWorker() {
  while (descriptorQueue.length) {
    const plugin = descriptorQueue.shift();
    const descriptor = await localizedDescriptor(plugin);
    if (!descriptor) continue;
    plugin.summaryZh = descriptor;
    plugin.description = descriptor;
    const title = descriptorTitle(plugin, descriptor);
    if (cjkCount(title) >= 3 && title.length >= 4 && !/^(?:来自 GitHub|适用于 DeepSeek Harness)/.test(title)) plugin.displayNameZh = title;
    await delay(60);
  }
}
await Promise.all(Array.from({length: 6}, () => descriptorWorker()));
for (const plugin of targetPlugins) {
  if (!needsBetterTitle(plugin.displayNameZh)) continue;
  const fallbackTitle = descriptorTitle(plugin, plugin.summaryZh || '');
  if (cjkCount(fallbackTitle) >= 3 && fallbackTitle.length >= 4) plugin.displayNameZh = fallbackTitle;
}

const contentOverrides = {
  'devin-axis-ipollowork': {
    displayNameZh: '自进化 AI 工作台',
    summaryZh: '本地优先的可视化 AI 工作台，可生成并继续编辑代码、文档、演示、网站、设计和视频。'
  },
  'nagi-ovo-voyager': {
    displayNameZh: '跨平台 AI 网页增强套件',
    summaryZh: '为 Gemini、Claude、ChatGPT 与 DeepSeek Harness Web UI 提供提示词管理和交互增强。'
  },
  'yaoapp-yao': {
    displayNameZh: '多设备智能体工作台',
    summaryZh: '在桌面、手机、浏览器和 API 中集中管理智能体、工作区与任务看板。'
  },
  'q00-ouroboros': {
    displayNameZh: '自进化智能体运行系统',
    summaryZh: '让智能体根据可验证的执行结果持续改进工作策略，同时隔离评分规则与任务实现。'
  },
  'nexu-io-open-design': {
    displayNameZh: '开源设计工作台',
    summaryZh: '本地优先、开源的 Claude Design 替代品，可让编码智能体生成原型、网页、演示文稿、图片与视频。'
  },
  'titanwings-colleague-skill': {
    displayNameZh: '人格蒸馏 AI Skill',
    summaryZh: '把同事、家人、偶像或自己的思考方式和表达习惯，整理成可复用、可迁移的 AI Skill。'
  },
  'maxeaglet-dsh-bash-terminal': {
    displayNameZh: 'Windows 多终端 Shell 工具',
    summaryZh: '在 Windows 上为 DeepSeek Harness 统一提供 PowerShell、Git Bash 与 WSL 命令执行入口。'
  },
  'rirko-dsh-melody-launcher': {
    displayNameZh: 'DSH 桌面启动器与插件管理器',
    summaryZh: '通过桌面界面启动 DeepSeek Harness，并集中管理本地插件。'
  },
  'sqhao-o-dsh-docs': {
    displayNameZh: '本地文档 OCR 与解析工具',
    summaryZh: '完全在本地解析 PDF、Office 文件、图片和扫描文档，为 DeepSeek Harness 提供离线文档理解能力。'
  },
  'acidmoon-dizzy-dsh': {
    displayNameZh: 'Dizzy DSH 插件合集',
    summaryZh: '一键安装余额、用量、浏览器控制、视觉识别、生成式 UI、桌面通知和 IDE 侧边栏等常用能力。'
  },
  'graycodeteam-graycode-for-dsh': {
    displayNameZh: 'Gray Code 工作流与记忆插件',
    summaryZh: '把 Gray Code 的文档工作流、长期记忆、检查点、分支和审阅能力迁移到 DeepSeek Harness。'
  },
  '6mikao9-dsh-wsl-workspace': {
    displayNameZh: 'WSL 工作区连接器',
    summaryZh: '直接在 DSH 图形界面中添加和使用 WSL 工作区，无需在 WSL 内重复安装 DeepSeek Harness。'
  },
  'limbo947-dsh-recall-plugin': {
    displayNameZh: '消息撤回与状态回溯插件',
    summaryZh: '撤回已发送的消息，并把 DeepSeek Harness 会话恢复到发送该消息时的状态。'
  },
  'tsrigo-dsh-from-scratch': {
    displayNameZh: 'DSH TypeScript 实战教程',
    summaryZh: '通过可运行的 TypeScript 项目，从零构建一个最小的 DeepSeek 风格智能体框架。'
  },
  'festoney8-deepseek-harness-gui': {
    displayNameZh: '轻量 DSH 桌面启动器',
    summaryZh: '基于 Tauri 的轻量 DeepSeek Harness 桌面启动器，支持内核升级和免安装便携版。'
  },
  'william-jin-cmu-dsh-companion': {
    displayNameZh: 'DSH 常驻桌面助手',
    summaryZh: '为 DeepSeek Harness 提供全局唤起、定时自动化、快捷回复和插件市场入口。'
  },
  'tonydua-dsh-web-search-exa': {
    displayNameZh: 'Exa 网页搜索连接器',
    summaryZh: '为 DeepSeek Harness 提供零配置 Exa 搜索，并支持匿名 MCP 回退和带密钥的 REST 接口。'
  },
  'gooodwei-context-vista': {
    displayNameZh: '上下文用量环形面板',
    summaryZh: '通过右侧悬浮栏和 /context 命令展示上下文 Token 分配、压缩效果与费用估算。'
  },
  'micromilo-upstream-radar': {
    displayNameZh: '上游变更风险雷达',
    summaryZh: '持续监控 DeepSeek Harness 插件依赖的漏洞和破坏性变更，并分析受影响范围。'
  },
  'zhangzheng25-dsh-timeline': {
    displayNameZh: '提问时间线导航',
    summaryZh: '把每条提问显示为可跳转的时间线节点，并支持悬停预览。'
  },
  'huashenglian-dsh-her-eyes': {
    displayNameZh: '双 VLM 视觉分析插件',
    summaryZh: '为每个会话提供图像分析工具，并在主、备用 OpenAI 兼容视觉端点之间自动故障转移。'
  },
  'whiteplusms-dsh-input-plus': {
    displayNameZh: '工作区文件引用增强',
    summaryZh: '增强 DSH Web 输入框的工作区文件引用、提示历史和轻量编辑体验。'
  },
  'dasooul03-dsh-plugin-deepseek-pricing': {
    displayNameZh: 'DeepSeek 实时价格监控',
    summaryZh: '监控 DeepSeek 实时定价、峰谷时段自动切换和当前会话费用。'
  },
  'linshule-dsh-balance': {
    displayNameZh: 'DeepSeek 账户余额徽章',
    summaryZh: '在 DSH Web GUI 左下角实时显示可拖拽的 DeepSeek API 账户余额，并提供设置页面。'
  },
  'shinelon-eyes-for-deepseek': {
    displayNameZh: 'DeepSeek MCP 视觉工具集',
    summaryZh: '通过 MCP 为纯文本模型提供识图、OCR、UI 转换、错误诊断、图表理解和双图对比能力。'
  },
  'thu-maic-dsh-openmaic': {
    displayNameZh: '互动课堂与苏格拉底式教学工具',
    summaryZh: '把 OpenMAIC 的互动课堂、幻灯片、小组件和苏格拉底式教学能力接入 DeepSeek Harness。'
  },
  'creght-dev-skills': {
    displayNameZh: 'Codex 与智能体技能合集',
    summaryZh: '面向 Codex 和各类编码智能体整理的可复用技能合集。'
  },
  'libukai-awesome-deepseek-harness': {
    displayNameZh: 'DeepSeek Harness 终极指南',
    summaryZh: '精选 DeepSeek Harness 的优质资料、教程、插件与开发工具。'
  },
  'weirdsky924-agent-handoff-skill': {
    displayNameZh: 'AI 智能体接力机制',
    summaryZh: '把当前目标、进度、关键决策和风险沉淀为可维护文档，让下一位智能体能安全接手工作。'
  },
  'nanmicoder-dsh-agent-teams': {
    displayNameZh: '多智能体团队协作工具',
    summaryZh: '为 DeepSeek Harness 提供团队协议、9 个协作工具、持久化状态和实时 Web 管理界面。'
  },
  'btspoony-mstar-harness': {
    displayNameZh: '技能驱动的智能体工作流',
    summaryZh: '用可复用技能组织 Harness 与 Agent Loop 的工程工作流程。'
  },
  'inference1-clarify-intent-and-establish-shared-understanding': {
    displayNameZh: '意图澄清与共识建立技能',
    summaryZh: '系统澄清意图、挑战假设、解决矛盾，并对齐目标、约束、风险和成功标准。'
  },
  'hsiangnianian-dsh-auto-continue': {
    displayNameZh: '请求中断自动续写',
    summaryZh: '网络错误等非人为原因中断请求时，自动发送“继续”，并支持错误分类、退避与浏览器通知。'
  },
  'crazywoola-dsh-balance': {
    displayNameZh: '设置页余额查询插件',
    summaryZh: '在 DeepSeek Harness 设置页面中查看账户余额。'
  },
  'lehhair-dsh-mobile': {
    displayNameZh: 'PiUI 风格移动端适配',
    summaryZh: '把 DSH WebUI 变成适合窄屏滑动的双页布局，保留完整侧边栏和聊天内容。'
  },
  'w2112515-dsh-plugin-development': {
    displayNameZh: 'DSH 插件开发与审计技能',
    summaryZh: '用于开发和审核 DeepSeek Harness 插件的便携式 Agent Skill，并提供可选 Bundle 适配器。'
  },
  'harcochen-dsh-vsc-integration': {
    displayNameZh: 'VS Code 工作区文件集成',
    summaryZh: '在 DeepSeek Harness 中实时搜索 VS Code 工作区文件，并插入明确的文件引用。'
  },
  'nyasers-dsh-hanako': {
    displayNameZh: 'Hanako 角色主题插件',
    summaryZh: '为 DeepSeek Harness 加入 Hanako 角色主题与可配置的交互体验。'
  },
  'opensetk-dsh-xiaohei': {
    displayNameZh: '罗小黑桌面宠物',
    summaryZh: '住在 DSH Web UI 右下角的罗小黑桌宠，会随智能体运行状态切换姿态并响应点击。'
  },
  'justgenius-s-dsh-plugs': {
    displayNameZh: 'DSH 插件合集',
    summaryZh: '收录一组基于 Cordis 的 DeepSeek Harness 插件及其 Web 客户端模块。'
  },
  'whitelonng-dsh-plugin-describe-image': {
    displayNameZh: '给纯文本模型补上识图能力',
    summaryZh: '通过 OpenAI 兼容的视觉模型端点，让纯文本模型读取本地图片、网页图片和持久附件。'
  },
  'smalldy-godot-bridge': {
    displayNameZh: 'Godot 4 游戏控制桥',
    summaryZh: '通过游戏内 TCP 服务启动并操控 Godot 4.x 游戏，用原生 Agent 工具替代 godot-mcp。'
  },
  'seamas0825-lab-dsh-youmind-plugin': {
    displayNameZh: 'YouMind OpenAPI 工具与技能包',
    summaryZh: '把 YouMind OpenAPI 工具和工作流技能接入 DeepSeek Harness。'
  },
  'liangyin233-dsh-provider-model-configurator': {
    displayNameZh: 'DSH 模型配置管理器',
    summaryZh: '集中查看、创建、复制和编辑模型配置，并一键应用上下文、输出上限和推理档位。'
  },
  'biociao-dsh-science': {
    displayNameZh: 'Claude Science 式科研工作台',
    summaryZh: '面向基因组、病原体、人类健康和生物信息项目的 DeepSeek Harness 科研工作台。'
  },
  'wess09-deepseekharnessdesktop': {
    displayNameZh: 'DeepSeek Harness 桌面客户端',
    summaryZh: '把 DeepSeek Harness 封装为便于安装和使用的桌面客户端。'
  },
  '834063245-creator-hologram': {
    displayNameZh: '3D 代码依赖图生成器',
    summaryZh: '跨语言分析代码耦合关系，生成可交互的 3D 依赖图，并内置 LLM 智能体辅助理解代码。'
  },
  'justgenius-s-dsh-desktop': {
    displayNameZh: 'DeepSeek Harness 桌面外壳',
    summaryZh: '基于 Electron 的 DeepSeek Harness 桌面客户端外壳。'
  },
  'beancookie-awesome-dsh-plugin': {
    displayNameZh: '精选 DSH 插件清单',
    summaryZh: '整理值得关注的 DeepSeek Harness 插件与生态项目。'
  },
  'chen-001-dsh-grok-tui': {
    displayNameZh: 'Grok Build 终端界面',
    summaryZh: '通过 Grok Build 风格的终端界面使用 DeepSeek Harness。'
  },
  'franksong2702-dsh-codex-connect': {
    displayNameZh: 'ChatGPT OAuth 与 Codex 模型连接器',
    summaryZh: '通过 ChatGPT OAuth，把 Codex 模型接入 DeepSeek Harness。'
  },
  'orxz-deepseek-harness-themes': {
    displayNameZh: 'DeepSeek Harness 主题合集',
    summaryZh: '收录多款可切换的 DeepSeek Harness Web UI 主题。'
  },
  'laoyuehanni-dsh-token-usage': {
    displayNameZh: 'DSH 用量与成本统计',
    summaryZh: '按日期和模型统计 Token 用量与成本，并提供趋势图、摘要卡和模型定价明细。'
  },
  'crafter-station-petdex': {
    displayNameZh: 'AI 智能体动画宠物画廊',
    summaryZh: '为 Codex、Claude Code、DeepSeek Harness 等编码智能体提供动画宠物资源与展示画廊。'
  },
  'awesome-dsh-plugin-awesome-dsh-plugin': {
    displayNameZh: 'DeepSeek Harness 插件精选清单',
    summaryZh: '持续整理和推荐 DeepSeek Harness 生态中的优质插件。'
  },
  'liustack-modlens': {
    displayNameZh: 'DeepSeek Harness 视觉桥',
    summaryZh: '为纯文本编码智能体补充 OCR、布局和语义理解能力，并输出结构化视觉证据。'
  },
  'paean-ai-deeptide': {
    displayNameZh: 'Swift 原生 macOS 编码智能体',
    summaryZh: '由 DeepSeek 为 DeepSeek 打造的 Swift 原生 macOS 编码智能体。'
  },
  'omdsh-dev-dsh-mnemon': {
    displayNameZh: '跨智能体持久记忆',
    summaryZh: '为 DeepSeek Harness 提供本地优先的长期记忆，可在多个受支持的智能体之间共享。'
  },
  'omdsh-dev-dsh-advisor': {
    displayNameZh: '第二模型被动审阅助手',
    summaryZh: '为每轮对话搭配第二个模型进行被动审阅，并把审阅意见注入当前会话。'
  },
  'liuup-dsh-latex-tools': {
    displayNameZh: 'LaTeX 公式复制与 SVG 导出',
    summaryZh: '在 DeepSeek Harness 中悬停任意 LaTeX 公式，即可复制 TeX 源码或导出独立 SVG 文件。',
    displayNameEn: 'LaTeX Copy & SVG Export',
    summaryEn: 'Copy TeX source or export a standalone SVG by hovering over any LaTeX formula in DeepSeek Harness.',
    descriptionEn: 'Copy TeX source or export a standalone SVG by hovering over any LaTeX formula in DeepSeek Harness.'
  },
  'xidong-ai-deepseek-harness-web-docker': {
    displayNameZh: 'DSH Web Docker 管理界面',
    summaryZh: '在 Docker 中运行 DeepSeek Harness Web 界面，内置基础身份验证，并持久化配置与项目会话数据。',
    displayNameEn: 'DSH Web Docker Console',
    summaryEn: 'Run the DeepSeek Harness Web UI in Docker with basic authentication and persistent configuration and project sessions.',
    descriptionEn: 'Run the DeepSeek Harness Web UI in Docker with basic authentication and persistent configuration and project sessions.'
  },
  'karbo123-dsh-evoresearch': {
    displayNameZh: '自进化科研工作台',
    summaryZh: '为 DeepSeek Harness 提供可自我迭代的研究工作流，用于组织问题、实验、证据与结论。',
    displayNameEn: 'Evolving Research Workbench',
    summaryEn: 'An evolving research workflow for DeepSeek Harness that organizes questions, experiments, evidence, and conclusions.',
    descriptionEn: 'An evolving research workflow for DeepSeek Harness that organizes questions, experiments, evidence, and conclusions.'
  },
  'yauntyour-dsh-for-vsc': {
    displayNameZh: 'VS Code 内嵌 DSH 客户端',
    summaryZh: '在 VS Code 中直接使用 DeepSeek Harness Web UI，并通过侧边栏控制服务、检查日志与自动恢复离线进程。',
    displayNameEn: 'DSH for VS Code',
    summaryEn: 'Use the DeepSeek Harness Web UI inside VS Code with sidebar controls, logs, and automatic service recovery.',
    descriptionEn: 'Use the DeepSeek Harness Web UI inside VS Code with sidebar controls, logs, and automatic service recovery.'
  }
};
for (const plugin of targetPlugins) {
  const override = contentOverrides[plugin.id];
  if (override) Object.assign(plugin, override, {description: override.summaryZh});
  else plugin.displayNameZh = projectStyleTitle(plugin);
}
const titleOverrides = {
  'xytom-coding-tools-mcp': '智能体编码工具',
  'ccch1mneyyy-working-activity': 'Pi CLI 活动状态扩展',
  'ariestar-sivtr': '统一智能体记忆工作区',
  'leslie-sss-seewxapkg': '微信小程序反编译器',
  'jayden-x-l-forkprobe': '技能对比评测器',
  'c3ll256-dsh-toy': '玩具控制协议',
  'multica-ai-dsh-multica-runtime': 'Multica DSH 运行时',
  'nanmicoder-dsh-auto-mode': '安全自动权限插件',
  'oil-oil-dsh-vision': 'DSH 原生图像理解',
  'kuangre123-iosdev': 'iOS 开发技能包',
  'unitarylab-quantum-practices': '量子算法实践技能',
  'anacondakc-dsh-stock-market': '股票市场助手',
  'goalfyai-goalfydata': '智能体共享数据后端',
  'omdsh-dev-fabric': 'Fabric 风格 Hook 处理器',
  'n0zom1z0-th08': '东方永夜抄源码重构',
  'summersec-sumsec-skills': 'SummerSec 技能库',
  'openma-ai-deepseek-harness-acp': 'DSH ACP 服务器',
  'turtle1999-turtle-ui': 'Turtle UI 客户端',
  'nanki-nn-dsh-answer-pet': 'DSH 回答桌宠',
  'cokiscarazo-rgb-dsh-session-management': 'DSH 会话管理插件',
  'monk233-dsh-plugin-manager': 'DSH 插件管理器',
  '030611-qiushi-dsh-evidence-audit': '哈希链证据审计',
  'ltao0829-dsh-task-notify': '任务完成通知',
  'octoparse-agent-skills': 'Octoparse 智能体技能库',
  'ceelog-dsh-plugins': 'DSH 外部插件工作区',
  'ysr666-dsh-vision-router': '免费视觉路由器',
  'icetomoyo-dsh-workflow': 'UltraCode 工作流',
  'laplaceyoung-oh-my-dsh': 'DSH 插件生态目录',
  'vlln-dsh-navbar': '对话节点导航条',
  'anionex-dsh-computer-use': '电脑控制插件',
  'han-1413141-dsh-cost-meter': '会话费用统计',
  'tyan66666-billion-context-dsh': '模型驱动上下文管理',
  'franksong2702-dsh-codex-connect': 'Codex OAuth 连接器',
  'gusibi-molibot': '记忆型个人 AI 智能体',
  'sulfide2085-dsh-llm-wechat': '微信模型网关',
  'links2008-deepseek-harness-desktop': 'DSH Windows 桌面版',
  '121103qwq-dsh-vision-sidecar': '免费视觉边车',
  'huanlinoto-dsh-plugin-auto-blame': '回合批判建议插件',
  'yejiming-dsh-museai-tavern': 'MuseAI 角色连接器',
  'arcanepivot-dsh-api-balance': 'DeepSeek 余额组件',
  'cindyguyuehu123-dsh-webchatlike': '消息编辑与版本插件',
  'thhoho-resanity': '散户认知管理技能',
  'vim0x3c-dsh-session-manager': '会话管理面板',
  'ztl34245881-commits-dsh-task-planner': '肌肉记忆任务规划器',
  'sanshanya-better-model-provider': '模型能力配置器',
  'electricitysheep-dsh-handbook': 'DSH 中文学习手册',
  'hust-open-atom-club-oh-dsh': 'DSH 社区发行版',
  'whitelonng-dsh-plugin-describe-image': '纯文本模型识图插件'
  ,'spookysandwich-dsh-smooth-stream': 'DSH 流式文字动画'
  ,'laplace-bit-dsh-smooth-stream': 'DSH 丝滑流式渲染'
};
for (const plugin of targetPlugins) {
  if (titleOverrides[plugin.id]) plugin.displayNameZh = titleOverrides[plugin.id];
}
await fs.writeFile(dataUrl, `const plugins = ${JSON.stringify(plugins)};\n`, 'utf8');
console.error(`Chinese details ready: targets=${targetPlugins.length}, translated=${stats.translated}, cached=${stats.cached}`);
