#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://dsh-plugin.top';
const source = await fs.readFile(path.join(projectRoot, 'plugins-data.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}; result = plugins;`, context);
const plugins = context.result;

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const safeSegment = value => String(value).replace(/[^a-zA-Z0-9._-]+/g, '-');
const categoryZh = {skills: '技能', tools: '工具', 'model-adapters': '模型适配', enterprise: '企业', productivity: '生产力', devops: 'DevOps', themes: '主题'};

function stripMarkdown(markdown = '', lang = 'zh') {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*\|.*\|\s*$/gm, ' ')
    .replace(/^\s*[-*_]{3,}\s*$/gm, ' ')
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/^\s*[-*+>]\s*/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .replace(/[ \t]+/g, ' ');
  const paragraphs = text.split(/\n{2,}/).map(item => item.replace(/\s+/g, ' ').trim())
    .filter(item => item.length >= 45 && item.length <= 500)
    .filter(item => !/(?:table of contents|quick start|installation|license|contributing|目录|快速开始|安装|许可证|贡献指南)/i.test(item));
  const localized = paragraphs.filter(item => lang === 'zh' ? /[\u3400-\u9fff]/.test(item) : /[a-z]{4}/i.test(item));
  return (localized.length ? localized : paragraphs).slice(0, 3).join('\n\n').slice(0, 1200);
}

async function readOverview(plugin, lang) {
  const relative = lang === 'zh' ? plugin.readmeZhPath : (plugin.readmeCleanPath || plugin.readmeRawPath);
  if (!relative) return '';
  try { return stripMarkdown(await fs.readFile(path.join(projectRoot, relative), 'utf8'), lang); }
  catch { return ''; }
}

function pluginPath(plugin, lang = 'zh') {
  const prefix = lang === 'en' ? '/en' : '';
  return `${prefix}/plugin/${safeSegment(plugin.owner)}/${safeSegment(plugin.name)}/`;
}

function pageTemplate(plugin, lang, overview) {
  const zh = lang === 'zh';
  const name = zh ? (plugin.displayNameZh || plugin.displayNameEn || plugin.name) : (plugin.displayNameEn || plugin.name);
  const summary = zh ? (plugin.summaryZh || plugin.description || plugin.summaryEn) : (plugin.summaryEn || plugin.descriptionEn || plugin.description);
  const category = zh ? (categoryZh[plugin.category] || plugin.category) : plugin.category;
  const canonical = `${siteUrl}${pluginPath(plugin, lang)}`;
  const alternate = `${siteUrl}${pluginPath(plugin, zh ? 'en' : 'zh')}`;
  const title = zh ? `${name} — ${plugin.name} | DeepSeek Harness 插件` : `${name} — DeepSeek Harness Plugin`;
  const description = String(summary || `${plugin.name} DeepSeek Harness plugin`).replace(/\s+/g, ' ').slice(0, 158);
  const labels = zh ? {
    back: '返回热门插件目录', intro: '项目简介', details: '项目信息', install: '安装命令', github: '查看 GitHub 仓库', stars: 'GitHub 星标', forks: '分支', updated: '最近更新', language: '开发语言', license: '许可证', switcher: 'English'
  } : {
    back: 'Back to popular plugin directory', intro: 'Project overview', details: 'Project details', install: 'Install command', github: 'View GitHub repository', stars: 'GitHub stars', forks: 'Forks', updated: 'Last updated', language: 'Language', license: 'License', switcher: '中文'
  };
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {'@type': 'WebPage', name, url: canonical, description, inLanguage: zh ? 'zh-CN' : 'en', dateModified: plugin.updated},
      {'@type': 'SoftwareSourceCode', name: plugin.name, alternateName: name, description, codeRepository: plugin.repo, programmingLanguage: plugin.language || undefined, license: plugin.license || undefined, dateModified: plugin.updated, keywords: ['DeepSeek Harness plugin', 'DSH plugin', 'dsh-plugin', plugin.category, ...(plugin.topics || []).slice(0, 8)]},
      {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'DSH Plugins', item: `${siteUrl}/`},
        {'@type': 'ListItem', position: 2, name: category, item: `${siteUrl}/#directory`},
        {'@type': 'ListItem', position: 3, name, item: canonical}
      ]}
    ]
  };
  const overviewHtml = escapeHtml(overview || summary || description).split(/\n{2,}/).map(item => `<p>${item}</p>`).join('');
  return `<!doctype html>
<html lang="${zh ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="keywords" content="${escapeHtml(`DeepSeek Harness plugin, DSH plugin, dsh-plugin, ${plugin.name}, ${name}, ${category}`)}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="${zh ? 'en' : 'zh-CN'}" href="${alternate}" />
  <link rel="alternate" hreflang="x-default" href="${siteUrl}${pluginPath(plugin, 'en')}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="DSH Plugins" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="https://opengraph.githubassets.com/1/${encodeURIComponent(plugin.owner)}/${encodeURIComponent(plugin.name)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  <style>:root{--ink:#17191d;--muted:#747a83;--line:#dedfdf;--paper:#f7f8fa;--lime:#cbff4d}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,Manrope,"Noto Sans SC",system-ui,sans-serif}.wrap{width:min(840px,calc(100% - 40px));margin:auto}header{height:60px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.brand{font-weight:800;font-size:20px;text-decoration:none;color:inherit}.switch{font-size:13px;color:var(--muted)}main{padding:58px 0 80px}.back{font-size:13px;color:var(--muted);text-decoration:none}h1{font-size:clamp(36px,7vw,64px);line-height:1.02;letter-spacing:-.065em;margin:32px 0 12px}.repo{font:13px ui-monospace,monospace;color:var(--muted)}.summary{font-size:18px;line-height:1.65;color:#5f656d;margin:28px 0}.facts{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid var(--line);margin:36px 0}.fact{padding:18px 12px;border-right:1px solid var(--line)}.fact:nth-child(3n){border:0}.fact b{display:block;font-size:19px}.fact span{font-size:11px;color:var(--muted)}section{margin-top:38px}h2{font-size:22px;letter-spacing:-.035em}.overview p{color:#626871;line-height:1.85}.install{background:#20242b;color:#f3f5f7;padding:15px;border-radius:6px;overflow:auto;font:13px ui-monospace,monospace}.actions{display:flex;gap:12px;margin-top:34px;flex-wrap:wrap}.button{display:inline-block;padding:13px 17px;border-radius:5px;background:var(--ink);color:white;text-decoration:none;font-weight:700}.button.alt{background:var(--lime);color:var(--ink)}@media(max-width:600px){main{padding-top:36px}.facts{grid-template-columns:repeat(2,1fr)}.fact:nth-child(3n){border-right:1px solid var(--line)}.fact:nth-child(2n){border-right:0}}</style>
</head>
<body>
  <header class="wrap"><a class="brand" href="${siteUrl}/">dsh plugins</a><a class="switch" href="${alternate}">${labels.switcher}</a></header>
  <main class="wrap">
    <a class="back" href="${siteUrl}/#directory">← ${labels.back}</a>
    <h1>${escapeHtml(name)}</h1>
    <div class="repo">${escapeHtml(plugin.owner)}/${escapeHtml(plugin.name)} · ${escapeHtml(category)}</div>
    <p class="summary">${escapeHtml(summary || description)}</p>
    <div class="facts">
      <div class="fact"><b>★ ${Number(plugin.stars || 0).toLocaleString()}</b><span>${labels.stars}</span></div>
      <div class="fact"><b>${Number(plugin.forks || 0).toLocaleString()}</b><span>${labels.forks}</span></div>
      <div class="fact"><b>${escapeHtml(plugin.updated || '—')}</b><span>${labels.updated}</span></div>
      <div class="fact"><b>${escapeHtml(plugin.language || '—')}</b><span>${labels.language}</span></div>
      <div class="fact"><b>${escapeHtml(plugin.license || '—')}</b><span>${labels.license}</span></div>
    </div>
    <section class="overview"><h2>${labels.intro}</h2>${overviewHtml}</section>
    <section><h2>${labels.install}</h2><div class="install">${escapeHtml(plugin.command || `git clone ${plugin.repo}`)}</div></section>
    <div class="actions"><a class="button" href="${escapeHtml(plugin.repo)}" rel="noreferrer">${labels.github} ↗</a><a class="button alt" href="${siteUrl}/#directory">${labels.back}</a></div>
  </main>
</body>
</html>\n`;
}

const sitemapEntries = [{loc: `${siteUrl}/`, lastmod: new Date().toISOString().slice(0, 10), priority: '1.0'}];
for (const plugin of plugins) {
  for (const lang of ['zh', 'en']) {
    const relative = pluginPath(plugin, lang).replace(/^\//, '');
    const targetDir = path.join(projectRoot, relative);
    await fs.mkdir(targetDir, {recursive: true});
    await fs.writeFile(path.join(targetDir, 'index.html'), pageTemplate(plugin, lang, await readOverview(plugin, lang)), 'utf8');
    sitemapEntries.push({loc: `${siteUrl}${pluginPath(plugin, lang)}`, lastmod: plugin.updated || new Date().toISOString().slice(0, 10), priority: '0.7'});
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map(entry => `  <url>\n    <loc>${escapeHtml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(projectRoot, 'sitemap.xml'), sitemap, 'utf8');

const sorted = [...plugins].sort((a, b) => b.stars - a.stars);
const categoryCounts = Object.entries(categoryZh).map(([key, label]) => `- ${label} (${key}): ${plugins.filter(plugin => plugin.category === key).length}`).join('\n');
const llms = `# DSH Plugins\n\n> A bilingual directory of popular DeepSeek Harness plugins, DSH skills, MCP tools, model adapters, productivity workflows, DevOps runtimes and themes.\n\n- Website: ${siteUrl}/\n- Sitemap: ${siteUrl}/sitemap.xml\n- GitHub topic source: https://github.com/topics/dsh-plugin\n- Catalog size: ${plugins.length}\n\n## Categories\n\n${categoryCounts}\n\n## Popular plugins\n\n${sorted.slice(0, 30).map(plugin => `- [${plugin.displayNameEn || plugin.name}](${siteUrl}${pluginPath(plugin, 'en')}): ${plugin.summaryEn || plugin.descriptionEn || plugin.name} (${plugin.stars} GitHub stars)`).join('\n')}\n\n## Full catalog\n\nSee [llms-full.txt](${siteUrl}/llms-full.txt) for every indexed plugin.\n`;
const llmsFull = `# Complete DSH Plugin Catalog\n\n${sorted.map(plugin => `- [${plugin.owner}/${plugin.name}](${siteUrl}${pluginPath(plugin, 'en')}): ${plugin.summaryEn || plugin.descriptionEn || plugin.name} | ${plugin.category} | ${plugin.stars} stars`).join('\n')}\n`;
await fs.writeFile(path.join(projectRoot, 'llms.txt'), llms, 'utf8');
await fs.writeFile(path.join(projectRoot, 'llms-full.txt'), llmsFull, 'utf8');
console.log(`Generated ${plugins.length * 2} localized plugin pages and ${sitemapEntries.length} sitemap URLs.`);
