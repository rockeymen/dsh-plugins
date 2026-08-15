import fs from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const out = new URL('../plugins-data.js', import.meta.url);
const readmeDir = new URL('../readmes/', import.meta.url);
const perPage = 100;
const wanted = 500;

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
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'")
    .replace(/\r/g, '').split('\n').map(line => line.trim()).filter(Boolean)
    .filter(line => !/^badge|^build status|^license|^中文|^english/i.test(line))
    .join(' ').replace(/\s+/g, ' ').trim();
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

function categoryFor(repo) {
  const haystack = [repo.name, repo.description, ...(repo.topics || [])].join(' ');
  for (const [category, rule] of categoryRules) if (rule.test(haystack)) return category;
  return 'skills';
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
      if (response.ok) return await response.text();
    } catch {}
  }
  return '';
}

const repositories = [];
for (let page = 1; repositories.length < wanted; page += 1) {
  const data = await getJson(`https://api.github.com/search/repositories?q=topic%3Adsh-plugin&sort=stars&order=desc&per_page=${perPage}&page=${page}`);
  repositories.push(...data.items);
  if (data.items.length < perPage) break;
  await sleep(250);
}

const selected = repositories.slice(0, wanted);
let completed = 0;
const records = new Array(selected.length);
let cursor = 0;
async function worker() {
  while (cursor < selected.length) {
    const index = cursor++;
    const repo = selected[index];
    const category = categoryFor(repo);
    const readme = await readmeFor(repo);
    const readmeLanguages = bilingualReadme(readme, repo.description);
    const descriptionEn = (cleanMarkdown(repo.description) || readmeLanguages.en || 'DeepSeek Harness community repository.').slice(0, 360);
    const descriptionZh = /[\u3400-\u9fff]/.test(descriptionEn)
      ? descriptionEn
      : readmeLanguages.zh.startsWith('该仓库未')
        ? `来自 GitHub 的 ${repo.name}，属于${categoryZh(category)}分类。`
        : readmeLanguages.zh.slice(0, 260);
    records[index] = {
      id: `${repo.owner.login}-${repo.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `repo-${index + 1}`,
      name: repo.name,
      owner: repo.owner.login,
      description: descriptionZh,
      descriptionEn,
      readmeExcerpt: excerpt(readme, descriptionEn),
      readmeZh: readmeLanguages.zh,
      readmeEn: readmeLanguages.en,
      category,
      stars: repo.stargazers_count,
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
      readmeRaw: readme,
      homepage: repo.homepage || '',
      language: repo.language || '',
      license: repo.license?.spdx_id || '',
      topics: repo.topics || []
    };
    completed += 1;
    if (completed % 25 === 0) console.error(`README ${completed}/${selected.length}`);
  }
}
await Promise.all(Array.from({length: 20}, worker));
await fs.mkdir(readmeDir, {recursive: true});
await Promise.all(records.map(async record => {
  const raw = record.readmeRaw || '';
  delete record.readmeRaw;
  record.readmeRawPath = `readmes/${record.id}.md`;
  await fs.writeFile(new URL(`${record.id}.md`, readmeDir), raw, 'utf8');
}));
await fs.writeFile(out, `const plugins = ${JSON.stringify(records)};\n`, 'utf8');
console.error(`Wrote ${records.length} repositories to ${out.pathname}`);
