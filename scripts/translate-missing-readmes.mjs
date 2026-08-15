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

for (const plugin of plugins) {
  if (plugin.readmeZhPath && !plugin.readmeZhPath.endsWith('.translated.zh.md')) {
    plugin.readmeZhSource = 'repository';
    try {
      const zh = await fs.readFile(new URL(`../${plugin.readmeZhPath}`, import.meta.url), 'utf8');
      plugin.summaryZh = chineseSummary(zh, plugin) || plugin.summaryZh;
      plugin.description = plugin.summaryZh;
      plugin.displayNameZh = chineseTitle(plugin, zh, plugin.summaryZh);
    } catch {}
  } else if (plugin.readmeZhPath?.endsWith('.translated.zh.md')) {
    plugin.readmeZhSource = 'translated';
  }
}

const queue = plugins.filter(plugin => !plugin.readmeZhPath || plugin.readmeZhPath.endsWith('.translated.zh.md'));
const stats = {total: queue.length, completed: 0, translated: 0, cached: 0};
await Promise.all(Array.from({length: 4}, () => worker(queue, stats)));

const descriptorQueue = [...plugins];
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
for (const plugin of plugins) {
  if (!needsBetterTitle(plugin.displayNameZh)) continue;
  const fallbackTitle = descriptorTitle(plugin, plugin.summaryZh || '');
  if (cjkCount(fallbackTitle) >= 3 && fallbackTitle.length >= 4) plugin.displayNameZh = fallbackTitle;
}

const contentOverrides = {
  'nexu-io-open-design': {
    displayNameZh: '本地优先的开源设计工作台',
    summaryZh: '本地优先、开源的 Claude Design 替代品，可让编码智能体生成原型、网页、演示文稿、图片与视频。'
  },
  'titanwings-colleague-skill': {
    displayNameZh: '把任何人蒸馏成 AI Skill',
    summaryZh: '把同事、家人、偶像或自己的思考方式和表达习惯，整理成可复用、可迁移的 AI Skill。'
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
  }
};
for (const plugin of plugins) {
  const override = contentOverrides[plugin.id];
  if (!override) continue;
  Object.assign(plugin, override, {description: override.summaryZh});
}
await fs.writeFile(dataUrl, `const plugins = ${JSON.stringify(plugins)};\n`, 'utf8');
console.error(`Chinese details ready: repository=${plugins.length - stats.total}, translated=${stats.translated}, cached=${stats.cached}`);
