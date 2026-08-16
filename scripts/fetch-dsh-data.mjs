import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const out = new URL('../plugins-data.js', import.meta.url);
const starsOut = new URL('../plugin-stars.js', import.meta.url);
const starHistoryOut = new URL('../plugin-star-history.js', import.meta.url);
const readmeDir = new URL('../readmes/', import.meta.url);
const cleanReadmeDir = new URL('../readmes-clean/', import.meta.url);
const syncLog = new URL('../logs/last-sync.json', import.meta.url);
const perPage = 100;
const wanted = 500;

async function loadExistingPlugins() {
  try {
    const source = await fs.readFile(out, 'utf8');
    const context = {};
    vm.createContext(context);
    vm.runInContext(`${source}; result = plugins;`, context);
    return Array.isArray(context.result) ? context.result : [];
  } catch {
    return [];
  }
}

async function loadExistingStars(plugins) {
  try {
    const source = await fs.readFile(starsOut, 'utf8');
    const context = {};
    vm.createContext(context);
    vm.runInContext(`${source}; result = pluginStars;`, context);
    if (context.result && typeof context.result === 'object') return context.result;
  } catch {}
  return Object.fromEntries(plugins.map(plugin => [plugin.id, Number(plugin.stars || 0)]));
}

async function loadStarHistory(existingStars) {
  try {
    const source = await fs.readFile(starHistoryOut, 'utf8');
    const context = {};
    vm.createContext(context);
    vm.runInContext(`${source}; result = pluginStarHistory;`, context);
    if (context.result?.baseline?.stars && Array.isArray(context.result.snapshots)) return context.result;
  } catch {}
  return {
    version: 1,
    baseline: {date: new Date().toISOString().slice(0, 10), stars: {...existingStars}},
    snapshots: []
  };
}

function reconstructHistory(history, through = history.snapshots.length) {
  const stars = {...history.baseline.stars};
  for (const snapshot of history.snapshots.slice(0, through)) {
    for (const [id, value] of Object.entries(snapshot.changes || {})) stars[id] = Number(value || 0);
  }
  return stars;
}

function updateStarHistory(history, currentStars) {
  const date = new Date().toISOString().slice(0, 10);
  const previousSnapshots = history.snapshots.filter(snapshot => snapshot.date !== date);
  const previous = reconstructHistory({...history, snapshots: previousSnapshots});
  const changes = Object.fromEntries(Object.keys(currentStars).sort().flatMap(id => {
    const value = Number(currentStars[id] || 0);
    return Number(previous[id] || 0) === value ? [] : [[id, value]];
  }));
  return {
    version: 1,
    baseline: history.baseline,
    snapshots: changes && Object.keys(changes).length
      ? [...previousSnapshots, {date, changes}].slice(-104)
      : previousSnapshots.slice(-104)
  };
}

async function writeIfChanged(url, content) {
  let previous = '';
  try { previous = await fs.readFile(url, 'utf8'); } catch {}
  if (previous === content) return false;
  await fs.writeFile(url, content, 'utf8');
  return true;
}

const categoryRules = [
  ['skills', /skill|agent|harness|prompt|workflow/i],
  ['model-adapters', /model|adapter|vision|ocr|llm|inference|embedding|multimodal/i],
  ['enterprise', /enterprise|team|workspace|desktop|cloud|platform|os|managed/i],
  ['devops', /deploy|devops|runtime|sandbox|docker|container|infra|terminal|shell|ci|cd/i],
  ['productivity', /productivity|memory|knowledge|research|paper|note|workflow|calendar|task|project/i],
  ['themes', /theme|ui|web|desktop|visual|skin|pet|appearance/i],
  ['tools', /tool|mcp|browser|search|api|connector|integration|plugin/i]
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function getJson(url) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {headers: {'Accept': 'application/vnd.github+json', 'User-Agent': 'dsh-plugin-directory'}});
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      return response.json();
    } catch (error) {
      if (attempt === 4) throw error;
      await sleep(attempt * 1000);
    }
  }
}

function cleanMarkdown(value = '') {
  value = value || '';
  return value.replace(/^---[\s\S]*?---\s*/m, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '').replace(/^#+\s*/gm, '').replace(/[\*_>#]/g, '')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/\r/g, '').split('\n').map(line => line.trim()).filter(Boolean)
    .filter(line => !/^badge|^build status|^license|^中文|^english/i.test(line))
    .join(' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(value = '') {
  return value.replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function excerpt(readme, fallback) {
  const text = cleanMarkdown(readme);
  return (text || fallback || 'GitHub repository for the DeepSeek Harness ecosystem.').slice(0, 520);
}

function bilingualReadme(readme, fallback) {
  const lines = cleanMarkdown(readme).split(/(?<=[.!?。！？])\s+/).filter(Boolean);
  const zh = lines.filter(line => /[\u3400-\u9fff]/.test(line)).join(' ');
  const en = lines.filter(line => /[A-Za-z]/.test(line) && !/[\u3400-\u9fff]/.test(line)).join(' ');
  return {
    zh: (zh || '该仓库未提供中文 README，以下为 GitHub 原始项目说明。').slice(0, 520),
    en: (en || fallback || 'GitHub repository for the DeepSeek Harness ecosystem.').slice(0, 520)
  };
}

function cleanReadme(readme = '') {
  const sourceLines = decodeEntities(readme).replace(/\r/g, '').split('\n');
  const lines = [];
  for (let i = 0; i < sourceLines.length; i += 1) {
    if (/^\s*\|/.test(sourceLines[i]) && /^\s*\|?\s*:?-{2,}/.test(sourceLines[i + 1] || '')) {
      const headers = sourceLines[i].split('|').slice(1, -1).map(cell => cell.trim());
      i += 2;
      lines.push(`### ${headers.join(' · ')}`);
      while (i < sourceLines.length && /^\s*\|/.test(sourceLines[i])) {
        const cells = sourceLines[i].split('|').slice(1, -1).map(cell => cell.trim());
        lines.push(`- ${cells.map((cell, index) => headers[index] ? `**${headers[index]}**: ${cell}` : cell).join(' · ')}`);
        i += 1;
      }
      i -= 1;
    } else lines.push(sourceLines[i]);
  }
  const output = [];
  let skipSection = false;
  for (let line of lines) {
    const trimmed = line.trim();
    line = line.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (_, level, title) => `${'#'.repeat(Number(level))} ${title.replace(/<[^>]+>/g, '')}`);
    if (/^\s*<a\b/i.test(line) || /^\s*<\/a>/i.test(line)) continue;
    if (/^#{1,6}\s+/.test(trimmed)) {
      const heading = trimmed.replace(/^#{1,6}\s+/, '').toLowerCase();
      skipSection = /^(contribut|license|star history|sponsor|acknowledg|changelog|change log|contributors|made with|目录|table of contents|contents|索引)/i.test(heading);
      if (skipSection) continue;
    }
    if (skipSection) continue;
    if (/^<!--|^<\/comment/i.test(trimmed)) continue;
    if (/<b>English<\/b>|README\.[a-z]{2}(?:-[A-Z]{2})?\.md/i.test(line)) continue;
    if (/shields\.io|img\.shields\.io|badge\.fury|github\.com\/.*\/actions|github\.com\/.*\/workflows/i.test(trimmed)) continue;
    line = line.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
    line = line.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)');
    line = line.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    line = line.replace(/<code>(.*?)<\/code>/gi, '`$1`');
    line = line.replace(/<\/?(?:p|div|span|br|center|section|details|summary|picture|source|b|strong|i|em)[^>]*>/gi, '');
    line = line.replace(/<\/?(?:table|thead|tbody|tfoot|tr|th|td)[^>]*>/gi, '');
    if (/^\s*[-*_]{3,}\s*$/.test(line)) continue;
    output.push(line);
  }
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 18000);
}

function projectSummary(markdown, fallback, language = 'en') {
  const text = cleanMarkdown(markdown).replace(/\s+/g, ' ').trim();
  const source = text || cleanMarkdown(fallback);
  const sentences = source.split(/(?<=[。！？.!?])\s+/).filter(Boolean);
  const preferred = language === 'zh'
    ? sentences.find(sentence => /[\u3400-\u9fff]/.test(sentence))
    : sentences.find(sentence => /[A-Za-z]/.test(sentence) && !/[\u3400-\u9fff]/.test(sentence));
  return (preferred || sentences[0] || source || '').slice(0, 180).trim();
}

function readableName(summary, repoName) {
  const normalized = (summary || '').replace(new RegExp(`^${repoName}\\s*`, 'i'), '').replace(/^.*一句话定位[:：]\s*/, '');
  const name = normalized.split(/[：:，,。.!?！？———]/)[0].trim();
  if (name && name.length >= 4 && name.length <= 50 && name.toLowerCase() !== repoName.toLowerCase()) return name;
  return repoName.replace(/[-_]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase()).slice(0, 34);
}

function categoryFor(repo) {
  const haystack = [repo.name, repo.description, ...(repo.topics || [])].join(' ');
  for (const [category, rule] of categoryRules) if (rule.test(haystack)) return category;
  return 'skills';
}

function isDshRelevant(repo, readme = '') {
  const supportingTopics = (repo.topics || []).filter(topic => topic !== 'dsh-plugin').join(' ');
  const evidence = [repo.name, repo.description || '', supportingTopics, readme.slice(0, 12000)].join('\n');
  return /(?:deepseek[\s_-]*harness|@deepseek-ai\/dsh|\bdsh\b|\bdsh[-_][a-z])/i.test(evidence);
}

function categoryZh(category) {
  return {skills:'技能',tools:'工具','model-adapters':'模型适配',enterprise:'企业',productivity:'生产力',devops:'DevOps',themes:'主题'}[category];
}

async function readmeFor(repo) {
  const branches = [repo.default_branch, 'main', 'master'].filter((branch, index, all) => branch && all.indexOf(branch) === index);
  for (const branch of branches) {
    const url = `https://raw.githubusercontent.com/${repo.full_name}/${branch}/README.md`;
    try {
      const response = await fetch(url, {headers: {'User-Agent': 'dsh-plugin-directory'}});
      if (response.ok) {
        const raw = await response.text();
        let zh = '';
        const linkedChineseFiles = [...raw.matchAll(/\[[^\]]*(?:简体|繁体|中文|chinese|zh|cn)[^\]]*\]\(([^)]+)\)/gi)]
          .map(match => match[1].split('#')[0].trim()).filter(file => file.toLowerCase().endsWith('.md'));
        const candidates = ['README.zh-CN.md', 'README.zh.md', 'README.cn.md', 'README-zh.md', 'README_ZH.md', 'README_zh.md', 'README_CN.md', 'docs/lang/README_ZH.md', 'docs/lang/README_zh.md', 'docs/i18n/README.zh-CN.md', ...linkedChineseFiles];
        for (const filename of [...new Set(candidates)]) {
          try {
            let localizedUrl = filename.startsWith('http') ? filename : new URL(filename.replace(/^\//, ''), url).href;
            localizedUrl = localizedUrl.replace(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\//, 'https://raw.githubusercontent.com/$1/$2/$3/');
            const localized = await fetch(localizedUrl, {headers: {'User-Agent': 'dsh-plugin-directory'}});
            if (localized.ok) {
              const body = await localized.text();
              if (!/^\s*<!doctype html|^\s*<html/i.test(body)) { zh = body; break; }
            }
          } catch {}
        }
        return {raw, zh, branch};
      }
    } catch {}
  }
  return {raw: '', zh: '', branch: repo.default_branch || 'main'};
}

const repositories = [];
for (let page = 1; repositories.length < wanted; page += 1) {
  const data = await getJson(`https://api.github.com/search/repositories?q=topic%3Adsh-plugin&sort=stars&order=desc&per_page=${perPage}&page=${page}`);
  repositories.push(...data.items);
  if (data.items.length < perPage) break;
  await sleep(250);
}

const selected = repositories.slice(0, wanted);
const existingPlugins = await loadExistingPlugins();
const existingStars = await loadExistingStars(existingPlugins);
const starHistory = await loadStarHistory(existingStars);
const nextStars = {...existingStars};
const existingByRepository = new Map(existingPlugins.map(plugin => [`${plugin.owner}/${plugin.name}`.toLowerCase(), plugin]));
const selectedRepositories = new Set(selected.map(repo => repo.full_name.toLowerCase()));
const retained = existingPlugins.filter(plugin => !selectedRepositories.has(`${plugin.owner}/${plugin.name}`.toLowerCase()));
let completed = 0;
let starsUpdated = 0;
const rejectedRepositories = [];
const records = new Array(selected.length);
let cursor = 0;
async function worker() {
  while (cursor < selected.length) {
    const index = cursor++;
    const repo = selected[index];
    const existing = existingByRepository.get(repo.full_name.toLowerCase());
    if (existing) {
      records[index] = existing;
      if (Number(existingStars[existing.id] ?? existing.stars ?? 0) !== repo.stargazers_count) starsUpdated += 1;
      nextStars[existing.id] = repo.stargazers_count;
      continue;
    }
    const category = categoryFor(repo);
    const readmeResult = await readmeFor(repo);
    const readme = readmeResult.raw;
    if (!isDshRelevant(repo, readme)) {
      records[index] = null;
      rejectedRepositories.push(repo.full_name);
      continue;
    }
    const readmeLanguages = bilingualReadme(readme, repo.description);
    const descriptionEn = (cleanMarkdown(repo.description) || readmeLanguages.en || 'DeepSeek Harness community repository.').slice(0, 360);
    const descriptionZh = (readmeLanguages.zh.match(/[\u3400-\u9fff]/g) || []).length > 20
      ? descriptionEn
      : (repo.description && (repo.description.match(/[\u3400-\u9fff]/g) || []).length > 10)
        ? repo.description.slice(0, 260)
        : readmeLanguages.zh.startsWith('该仓库未')
        ? `来自 GitHub 的 ${repo.name}，属于${categoryZh(category)}分类。`
        : `来自 GitHub 的 ${repo.name}，属于${categoryZh(category)}分类。`;
    const summaryEn = projectSummary(descriptionEn, cleanReadme(readme), 'en') || descriptionEn;
    const summaryZh = (readmeResult.zh || readmeLanguages.zh).match(/[\u3400-\u9fff]/)
      ? projectSummary(cleanReadme(readmeResult.zh || readme), descriptionZh, 'zh')
      : (/[㐀-鿿]/.test(descriptionZh) ? projectSummary('', descriptionZh, 'zh') : `这是一个用于 ${repo.name} 的 DeepSeek Harness 插件。`);
    records[index] = {
      id: `${repo.owner.login}-${repo.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `repo-${index + 1}`,
      name: repo.name,
      owner: repo.owner.login,
      description: descriptionZh,
      descriptionEn,
      summaryZh,
      summaryEn,
      displayNameZh: readableName(summaryZh, repo.name),
      displayNameEn: readableName(summaryEn, repo.name),
      readmeExcerpt: excerpt(readme, descriptionEn),
      readmeZh: readmeLanguages.zh,
      readmeEn: readmeLanguages.en,
      category,
      _stars: repo.stargazers_count,
      forks: repo.forks_count,
      icon: ['✦','⌬','✳','◉','◇','▱','◫'][index % 7],
      tone: ['lav','blue','lime','peach','pink'][index % 5],
      updated: repo.updated_at.slice(0, 10),
      createdAt: repo.created_at.slice(0, 10),
      pushedAt: repo.pushed_at ? repo.pushed_at.slice(0, 10) : repo.updated_at.slice(0, 10),
      defaultBranch: repo.default_branch || 'main',
      command: `dsh plugin --profile web add github:${repo.full_name}`,
      repo: repo.html_url,
      readme: `https://github.com/${repo.full_name}#readme`,
      readmeBase: `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch || 'main'}/`,
      readmeRaw: readme,
      readmeZhRaw: readmeResult.zh,
      homepage: repo.homepage || '',
      language: repo.language || '',
      license: repo.license?.spdx_id || '',
      topics: repo.topics || []
    };
    records[index]._isNew = true;
    completed += 1;
    if (completed % 25 === 0) console.error(`New README ${completed}`);
  }
}
await Promise.all(Array.from({length: 20}, worker));
await fs.mkdir(readmeDir, {recursive: true});
await fs.mkdir(cleanReadmeDir, {recursive: true});
const newRecords = records.filter(record => record?._isNew);
await Promise.all(newRecords.map(async record => {
  const raw = record.readmeRaw || '';
  const zhRaw = record.readmeZhRaw || '';
  const clean = cleanReadme(raw);
  const cleanZh = cleanReadme(zhRaw);
  delete record.readmeRaw;
  delete record.readmeZhRaw;
  record.readmeRawPath = `readmes/${record.id}.md`;
  record.readmeCleanPath = `readmes-clean/${record.id}.md`;
  record.readmeZhPath = zhRaw ? `readmes-clean/${record.id}.zh.md` : '';
  record.readmeHasChinese = Boolean(zhRaw) || (raw.match(/[\u3400-\u9fff]/g) || []).length > 30;
  await fs.writeFile(new URL(`${record.id}.md`, readmeDir), raw, 'utf8');
  await fs.writeFile(new URL(`${record.id}.md`, cleanReadmeDir), clean, 'utf8');
  if (zhRaw) await fs.writeFile(new URL(`${record.id}.zh.md`, cleanReadmeDir), cleanZh, 'utf8');
}));
for (const record of newRecords) delete record._isNew;
for (const record of newRecords) {
  nextStars[record.id] = record._stars;
  delete record._stars;
}
const merged = existingPlugins.length ? [...existingPlugins, ...newRecords] : newRecords;
for (const plugin of merged) delete plugin.stars;
const normalizedStars = Object.fromEntries([...merged].sort((a, b) => a.id.localeCompare(b.id)).map(plugin => [plugin.id, Number(nextStars[plugin.id] || 0)]));
const starsChanged = await writeIfChanged(starsOut, `const pluginStars = ${JSON.stringify(normalizedStars)};\n`);
const nextStarHistory = updateStarHistory(starHistory, normalizedStars);
const starHistoryChanged = await writeIfChanged(starHistoryOut, `const pluginStarHistory = ${JSON.stringify(nextStarHistory)};\n`);
await fs.mkdir(new URL('../logs/', import.meta.url), {recursive: true});
if (!existingPlugins.length || newRecords.length) await writeIfChanged(out, `const plugins = ${JSON.stringify(merged)};\n`);
const report = {
  generatedAt: new Date().toISOString(),
  listed: selected.length,
  starsUpdated,
  starsFileChanged: starsChanged,
  starHistoryFileChanged: starHistoryChanged,
  newIds: newRecords.map(record => record.id),
  retainedIds: retained.map(record => record.id),
  rejectedRepositories: rejectedRepositories.sort(),
  total: merged.length
};
if (newRecords.length) await fs.writeFile(syncLog, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.error(`Incremental sync: listed=${selected.length}, star-changes=${starsUpdated}, new=${newRecords.length}, retained=${retained.length}, total=${merged.length}`);
console.log(JSON.stringify(report));
