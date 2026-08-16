#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://dsh-plugin.top';
const context = {};
vm.createContext(context);
const sources = await Promise.all(['plugins-data.js', 'plugin-stars.js'].map(file => fs.readFile(path.join(root, file), 'utf8')));
vm.runInContext(`${sources.join('\n')}; result={plugins,pluginStars};`, context);
const plugins = context.result.plugins.map(plugin => ({...plugin, stars: Number(context.result.pluginStars[plugin.id] || 0)}));
const sorted = [...plugins].sort((a, b) => b.stars - a.stars);
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const formatStars = value => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
const categoryZh = {skills:'技能',tools:'工具','model-adapters':'模型适配',enterprise:'企业',productivity:'生产力',devops:'DevOps',themes:'主题'};

function card(plugin, lang) {
  const zh = lang === 'zh';
  const name = zh ? (plugin.displayNameZh || plugin.name) : (plugin.displayNameEn || plugin.name);
  const summary = zh ? (plugin.summaryZh || plugin.description) : (plugin.summaryEn || plugin.descriptionEn || plugin.name);
  const href = `${zh ? '' : '/en'}/plugin/${encodeURIComponent(plugin.owner)}/${encodeURIComponent(plugin.name)}/`;
  return `<article class="plugin-card" data-id="${escapeHtml(plugin.id)}"><a class="plugin-card-link" href="${href}" aria-label="${escapeHtml(name)}"><div class="card-top"><div class="card-identity"><span class="icon-box ${escapeHtml(plugin.tone)}">${escapeHtml(plugin.icon)}</span><span class="card-readable-name">${escapeHtml(plugin.name)}</span></div><span class="card-stars"><span>★</span> ${formatStars(plugin.stars)}</span></div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(summary)}</p><div class="card-bottom"><span class="tag">${escapeHtml(zh ? categoryZh[plugin.category] : plugin.category)}</span><span class="card-arrow">↗</span></div></a></article>`;
}

function replaceCards(html, lang) {
  const cards = sorted.slice(0, 12).map(plugin => card(plugin, lang)).join('');
  return html.replace(/<!-- STATIC_CARDS_START -->[\s\S]*?<!-- STATIC_CARDS_END -->/, `<!-- STATIC_CARDS_START -->${cards}<!-- STATIC_CARDS_END -->`);
}

function englishHome(zhHtml) {
  const replacements = [
    ['<html lang="zh-CN">', '<html lang="en">'],
    ['content="DeepSeek Harness 插件大全：精选 500+ 热门 DSH plugins、Agent Skills、MCP tools、模型适配、Web UI 主题与 DevOps 工具，按 GitHub Stars 排行，提供中英文介绍和安装命令。"', 'content="Explore 500+ popular DeepSeek Harness plugins, Agent Skills, MCP tools, model adapters, Web UI themes and DevOps tools ranked by GitHub stars, with install commands and curated project summaries."'],
    ['<link rel="canonical" href="https://dsh-plugin.top/" />', '<link rel="canonical" href="https://dsh-plugin.top/en/" />'],
    ['content="DeepSeek Harness 插件大全 — 500+ 热门 DSH Plugins"', 'content="DeepSeek Harness Plugins — 500+ Popular DSH Plugins"'],
    ['content="https://dsh-plugin.top/"', 'content="https://dsh-plugin.top/en/"'],
    ['<title>DeepSeek Harness 插件大全 — 500+ 热门 DSH Plugins、Skills 与 MCP 工具</title>', '<title>DeepSeek Harness Plugins — 500+ DSH Skills, MCP Tools & Themes</title>'],
    ['"name": "DeepSeek Harness 插件大全"', '"name": "DeepSeek Harness Plugin Directory"'],
    ['"url": "https://dsh-plugin.top/"', '"url": "https://dsh-plugin.top/en/"'],
    ['"inLanguage": ["zh-CN", "en"]', '"inLanguage": "en"'],
    ['aria-label="DSH Plugins 首页"', 'aria-label="DSH Plugins home"'],
    ['<a class="brand" href="/"', '<a class="brand" href="/en/"'],
    ['placeholder="搜索插件或关键词…" aria-label="搜索插件"', 'placeholder="Search plugins or keywords…" aria-label="Search plugins"'],
    ['<button class="lang-button active" data-lang="zh" type="button">中文</button><button class="lang-button" data-lang="en" type="button">English</button>', '<button class="lang-button" data-lang="zh" type="button">中文</button><button class="lang-button active" data-lang="en" type="button">English</button>'],
    ['DeepSeek Harness<br />热门插件合集', 'DeepSeek Harness<br />Popular Plugin Collection'],
    ['全网最全的 DeepSeek Harness 插件聚合网站，快速找到你需要的工具。', 'The most comprehensive DeepSeek Harness plugin directory — find the tools you need, fast.'],
    ['id="stats-topic">主题仓库', 'id="stats-topic">topic repositories'],
    ['id="stats-categories">精选分类', 'id="stats-categories">curated categories'],
    ['<button class="category active" data-category="all">全部', '<button class="category active" data-category="all">All'],
    ['data-category="trending">插件涨星榜', 'data-category="trending">Trending'],
    ['data-category="skills">skills', 'data-category="skills">skills'],
    ['aria-label="排序"', 'aria-label="Sort"'],
    ['<option value="stars">按星标排序</option><option value="name">按名称排序</option><option value="new">最近更新</option>', '<option value="stars">Sort by stars</option><option value="name">Sort by name</option><option value="new">Recently updated</option>'],
    ['没有找到匹配的插件。', 'No matching plugins found.'],
    ['>清除筛选</button>', '>Clear filters</button>'],
    ['DSH Plugins 收录 DeepSeek Harness 插件、DeepSeek Agent skills、MCP tools、model adapters、productivity workflows、DevOps runtime 和 Web UI themes。请启用 JavaScript 浏览完整目录。', 'DSH Plugins indexes DeepSeek Harness plugins, Agent Skills, MCP tools, model adapters, productivity workflows, DevOps runtimes and Web UI themes. Enable JavaScript to browse the full directory.'],
    ['按 GitHub stars 排列<br />的社区热度。', 'Ranked by GitHub stars<br />and community momentum.'],
    ['有好的插件？<br /><em>让更多人发现它。</em>', 'Built a plugin?<br /><em>Help more people find it.</em>'],
    ['在 GitHub 上提交', 'Submit on GitHub'],
    ['项目简介', 'Project summary'],
    ['项目 README', 'Project README'],
    ['安装命令', 'INSTALL COMMAND'],
    ['>复制 <span>', '>Copy <span>'],
    ['>查看 GitHub <span>', '>View GitHub <span>']
  ];
  let html = zhHtml;
  for (const [from, to] of replacements) html = html.replace(from, to);
  return replaceCards(html, 'en');
}

const originalHome = await fs.readFile(path.join(root, 'index.html'), 'utf8');
const zhHome = replaceCards(originalHome, 'zh');
await fs.writeFile(path.join(root, 'index.html'), zhHome, 'utf8');
await fs.mkdir(path.join(root, 'en'), {recursive: true});
await fs.writeFile(path.join(root, 'en', 'index.html'), englishHome(zhHome), 'utf8');

const pageStyle = `:root{--ink:#17191d;--muted:#6f7680;--line:#dedfdf;--paper:#f7f8fa;--lime:#cbff4d}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Manrope,"Noto Sans SC",system-ui,sans-serif}.wrap{width:min(920px,calc(100% - 40px));margin:auto}header{height:58px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.brand{font-weight:800;font-size:20px;color:inherit;text-decoration:none}.switch{color:var(--muted);font-size:13px}main{padding:58px 0 90px}.eyebrow{font:11px ui-monospace,monospace;color:#7d838b;text-transform:uppercase;letter-spacing:.08em}h1{font-size:clamp(42px,7vw,72px);line-height:1;letter-spacing:-.065em;margin:18px 0}.lead{font-size:19px;line-height:1.7;color:#59606a;max-width:760px}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);margin:38px 0}.fact{background:var(--paper);padding:18px}.fact b{display:block;font-size:20px}.fact span{font-size:12px;color:var(--muted)}section{margin-top:46px}h2{font-size:28px;letter-spacing:-.04em}h3{font-size:19px;margin-top:30px}p,li{color:#5f6670;line-height:1.85}a{color:#5236cf}.code{background:#20242b;color:#f1f3f5;padding:16px;border-radius:6px;overflow:auto;font:13px ui-monospace,monospace}.callout{border-left:4px solid var(--lime);padding:4px 0 4px 16px}.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.trend-card{display:block;border:1px solid var(--line);border-radius:7px;background:white;padding:20px;color:inherit;text-decoration:none}.trend-card small{color:var(--muted)}.trend-card h2{font-size:20px;margin:8px 0}.growth{color:#2d7c28;font-weight:800}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:35px}.button{background:var(--ink);color:white;text-decoration:none;padding:12px 16px;border-radius:5px;font-weight:700}.button.alt{background:var(--lime);color:var(--ink)}@media(max-width:620px){main{padding-top:38px}.facts,.cards{grid-template-columns:1fr}h1{font-size:43px}}`;

function guidePage(lang) {
  const zh = lang === 'zh';
  const canonical = `${site}${zh ? '' : '/en'}/guide/deepseek-harness/`;
  const alternate = `${site}${zh ? '/en' : ''}/guide/deepseek-harness/`;
  const title = zh ? 'DeepSeek Harness 是什么？安装、GitHub 与插件指南' : 'What Is DeepSeek Harness? Install, GitHub & Plugin Guide';
  const description = zh ? '了解 DeepSeek Harness（DSH）是什么，如何用 npm/npx 安装并启动 Web UI，怎样在 GitHub 查找 dsh-plugin 插件，以及 Cordis、一切皆插件架构和开发者预览注意事项。' : 'Learn what DeepSeek Harness (DSH) is, how to run it with npm and npx, find dsh-plugin repositories on GitHub, and understand its Cordis-powered everything-is-a-plugin architecture.';
  const schema = {'@context':'https://schema.org','@graph':[{'@type':'TechArticle',headline:title,description,url:canonical,inLanguage:zh?'zh-CN':'en',dateModified:new Date().toISOString().slice(0,10),about:{'@type':'SoftwareApplication',name:'DeepSeek Harness',url:'https://github.com/deepseek-ai/deepseek-harness'}},{'@type':'FAQPage',mainEntity:(zh?[
    ['DeepSeek Harness 是什么？','DeepSeek Harness（dsh）是 DeepSeek AI 开发的开源 agent harness，目前处于开发者预览阶段。'],['如何安装 DeepSeek Harness？','安装 Node.js 后，可运行 npx @deepseek-ai/dsh web 启动 Web UI。'],['在哪里找 DeepSeek Harness 插件？','GitHub 使用 dsh-plugin topic 汇总社区插件，本目录按星标、类别和中英文简介整理这些项目。']
  ]:[['What is DeepSeek Harness?','DeepSeek Harness (dsh) is an open-source agent harness developed by DeepSeek AI and currently released as a developer preview.'],['How do I install DeepSeek Harness?','Install Node.js, then run npx @deepseek-ai/dsh web to start the Web UI.'],['Where can I find DeepSeek Harness plugins?','GitHub uses the dsh-plugin topic for community discovery; this directory organizes those repositories by stars, category and curated summaries.']]).map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))}]};
  const content = zh ? `<p class="eyebrow">DeepSeek Harness 指南</p><h1>DeepSeek Harness 是什么？</h1><p class="lead">DeepSeek Harness（简称 DSH）是 DeepSeek AI 开发的开源 agent harness。它把技能、工具、界面和运行能力都组织为插件，适合希望扩展 AI 编程智能体工作流的开发者。</p><div class="facts"><div class="fact"><b>开源</b><span>GitHub / MIT</span></div><div class="fact"><b>开发者预览</b><span>仍在快速迭代</span></div><div class="fact"><b>一切皆插件</b><span>Cordis 驱动</span></div></div><section><h2>快速安装与启动</h2><p>先安装 Node.js，然后在终端运行：</p><div class="code">npx @deepseek-ai/dsh web</div><p>命令会启动 Web UI，默认地址为 <code>http://127.0.0.1:3080</code>。官方 README 提醒当前仍是开发者预览版本，升级时可能出现不兼容变更。</p><h3>从 GitHub 源码运行</h3><div class="code">git clone https://github.com/deepseek-ai/deepseek-harness.git<br>cd deepseek-harness<br>pnpm install<br>pnpm run build<br>pnpm dsh web</div></section><section><h2>DeepSeek Harness 插件在哪里找？</h2><p>官方目前主要通过 GitHub 的 <a href="https://github.com/topics/dsh-plugin">dsh-plugin topic</a> 帮助社区发现插件。DSH Plugins 会定期同步该列表，保留 GitHub 项目名，同时整理更易读的中文名称、项目简介、安装命令、星标和双语详情页。</p><div class="callout"><p>想快速挑选插件，可以先看<a href="/trending/">涨星榜</a>，再按首页的技能、工具、模型适配、企业、生产力、DevOps 和主题分类筛选。</p></div></section><section><h2>“一切皆插件”是什么意思？</h2><p>DSH 的核心架构由 Cordis 驱动。模型能力、工具调用、界面和工作流可以通过插件组合，而不是全部固定在主程序中。这也是 GitHub 上会出现 Skills、MCP 工具、视觉适配、桌面客户端和 Web UI 主题等不同类型扩展的原因。</p></section><section><h2>常见搜索问题</h2><h3>DeepSeek Harness 是官方项目吗？</h3><p>是。官方仓库位于 <a href="https://github.com/deepseek-ai/deepseek-harness">deepseek-ai/deepseek-harness</a>。</p><h3>DSH 和 DeepSeek Harness 是同一个东西吗？</h3><p>是，<code>dsh</code> 是 DeepSeek Harness 的命令与常用简称。</p><h3>插件目录是官方官网吗？</h3><p>不是。DSH Plugins 是独立的社区精选目录，数据来源为 GitHub dsh-plugin topic，并链接回每个原始仓库。</p></section><div class="actions"><a class="button" href="/#directory">浏览热门插件</a><a class="button alt" href="https://github.com/deepseek-ai/deepseek-harness">官方 GitHub ↗</a></div>` : `<p class="eyebrow">DeepSeek Harness guide</p><h1>What is DeepSeek Harness?</h1><p class="lead">DeepSeek Harness (DSH) is an open-source agent harness developed by DeepSeek AI. Its “everything is a plugin” architecture lets developers extend skills, tools, interfaces and agent workflows.</p><div class="facts"><div class="fact"><b>Open source</b><span>GitHub / MIT</span></div><div class="fact"><b>Developer preview</b><span>Rapidly evolving</span></div><div class="fact"><b>Everything is a plugin</b><span>Powered by Cordis</span></div></div><section><h2>Install and run DeepSeek Harness</h2><p>Install Node.js, then run:</p><div class="code">npx @deepseek-ai/dsh web</div><p>The command starts the Web UI at <code>http://127.0.0.1:3080</code> by default. The official README labels DSH a developer preview, so compatibility-breaking changes can still occur.</p><h3>Run from GitHub source</h3><div class="code">git clone https://github.com/deepseek-ai/deepseek-harness.git<br>cd deepseek-harness<br>pnpm install<br>pnpm run build<br>pnpm dsh web</div></section><section><h2>Where can I find DeepSeek Harness plugins?</h2><p>The official ecosystem uses the GitHub <a href="https://github.com/topics/dsh-plugin">dsh-plugin topic</a> for community discovery. DSH Plugins synchronizes that list and adds curated names, summaries, install commands, GitHub stars and bilingual detail pages.</p><div class="callout"><p>Start with the <a href="/en/trending/">plugin growth ranking</a>, then filter the homepage by skills, tools, model adapters, enterprise, productivity, DevOps or themes.</p></div></section><section><h2>What does “everything is a plugin” mean?</h2><p>DSH is powered by Cordis. Model capabilities, tools, UI and workflows can be composed through plugins instead of being fixed in the core application. That is why the ecosystem includes Agent Skills, MCP tools, vision adapters, desktop clients and Web UI themes.</p></section><section><h2>Frequently asked questions</h2><h3>Is DeepSeek Harness an official DeepSeek project?</h3><p>Yes. The official repository is <a href="https://github.com/deepseek-ai/deepseek-harness">deepseek-ai/deepseek-harness</a>.</p><h3>Are DSH and DeepSeek Harness the same?</h3><p>Yes. <code>dsh</code> is the command and common short name for DeepSeek Harness.</p><h3>Is this plugin directory official?</h3><p>No. DSH Plugins is an independent curated directory sourced from the public GitHub dsh-plugin topic and linked back to original repositories.</p></section><div class="actions"><a class="button" href="/en/#directory">Browse plugins</a><a class="button alt" href="https://github.com/deepseek-ai/deepseek-harness">Official GitHub ↗</a></div>`;
  return `<!doctype html><html lang="${zh?'zh-CN':'en'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${zh?'zh-CN':'en'}" href="${canonical}"><link rel="alternate" hreflang="${zh?'en':'zh-CN'}" href="${alternate}"><link rel="alternate" hreflang="x-default" href="${site}/en/guide/deepseek-harness/"><meta property="og:type" content="article"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://opengraph.githubassets.com/1/deepseek-ai/deepseek-harness"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><style>${pageStyle}</style></head><body><header class="wrap"><a class="brand" href="${zh?'/':'/en/'}">dsh plugins</a><a class="switch" href="${alternate}">${zh?'English':'中文'}</a></header><main class="wrap">${content}</main></body></html>`;
}

function trendingPage(lang) {
  const zh = lang === 'zh';
  const canonical = `${site}${zh?'':'/en'}/trending/`;
  const alternate = `${site}${zh?'/en':''}/trending/`;
  const title = zh ? 'DeepSeek Harness 插件涨星榜 — GitHub 热门 DSH Plugins' : 'Trending DeepSeek Harness Plugins — GitHub Star Growth';
  const description = zh ? '查看 DeepSeek Harness 插件在两次同步之间的 GitHub 星标增长，发现近期升温的 DSH skills、MCP tools、模型适配与主题。' : 'Track GitHub star growth between catalog refreshes and discover rising DeepSeek Harness plugins, Agent Skills, MCP tools, model adapters and themes.';
  return `<!doctype html><html lang="${zh?'zh-CN':'en'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${zh?'zh-CN':'en'}" href="${canonical}"><link rel="alternate" hreflang="${zh?'en':'zh-CN'}" href="${alternate}"><link rel="alternate" hreflang="x-default" href="${site}/en/trending/"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><style>${pageStyle}</style></head><body data-lang="${lang}"><header class="wrap"><a class="brand" href="${zh?'/':'/en/'}">dsh plugins</a><a class="switch" href="${alternate}">${zh?'English':'中文'}</a></header><main class="wrap"><p class="eyebrow">${zh?'GitHub Stars 增长趋势':'GitHub star momentum'}</p><h1>${zh?'DeepSeek Harness 插件涨星榜':'Trending DeepSeek Harness Plugins'}</h1><p class="lead">${description}</p><div class="facts"><div class="fact"><b id="trend-period">—</b><span>${zh?'对比周期':'comparison window'}</span></div><div class="fact"><b id="trend-count">—</b><span>${zh?'本期上涨项目':'plugins gaining stars'}</span></div><div class="fact"><b>${plugins.length}</b><span>${zh?'收录项目':'indexed repositories'}</span></div></div><section><h2>${zh?'近期涨星最快':'Fastest-growing plugins'}</h2><div class="cards" id="trending-grid"><p>${zh?'正在读取星标历史…':'Loading star history…'}</p></div></section><div class="actions"><a class="button" href="${zh?'/':'/en/'}#directory">${zh?'浏览完整目录':'Browse full directory'}</a><a class="button alt" href="${zh?'/guide/deepseek-harness/':'/en/guide/deepseek-harness/'}">${zh?'阅读入门指南':'Read the guide'}</a></div></main><script src="/plugins-data.js"></script><script src="/plugin-stars.js"></script><script src="/plugin-star-history.js"></script><script src="/trending.js"></script></body></html>`;
}

for (const [relative, html] of [
  ['guide/deepseek-harness/index.html', guidePage('zh')],
  ['en/guide/deepseek-harness/index.html', guidePage('en')],
  ['trending/index.html', trendingPage('zh')],
  ['en/trending/index.html', trendingPage('en')]
]) {
  const target = path.join(root, relative);
  await fs.mkdir(path.dirname(target), {recursive: true});
  await fs.writeFile(target, html, 'utf8');
}

console.log(`Generated localized home, guide and trending discovery pages with ${Math.min(12, plugins.length)} static plugin links per homepage.`);
