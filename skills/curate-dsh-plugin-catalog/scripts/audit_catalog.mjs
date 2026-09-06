#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const args = process.argv.slice(2);
const valueFor = flag => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : '';
};
const project = path.resolve(valueFor('--project') || process.cwd());
const strict = args.includes('--strict');
const json = args.includes('--json');
const dataPath = path.join(project, 'plugins-data.js');
const starsPath = path.join(project, 'plugin-stars.js');
const starHistoryPath = path.join(project, 'plugin-star-history.js');
const categories = new Set(['skills', 'tools', 'model-adapters', 'enterprise', 'productivity', 'devops', 'themes']);
const required = ['id', 'name', 'owner', 'repo', 'category', 'displayNameZh', 'displayNameEn', 'summaryZh', 'summaryEn', 'readmeRawPath', 'readmeCleanPath', 'readmeZhPath'];

function loadPlugins() {
  if (!fs.existsSync(dataPath)) throw new Error(`Missing ${dataPath}`);
  const source = fs.readFileSync(dataPath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}; result = plugins;`, context, {filename: dataPath});
  if (!Array.isArray(context.result)) throw new Error('plugins-data.js did not define an array named plugins');
  return context.result;
}

function loadStars() {
  if (!fs.existsSync(starsPath)) throw new Error(`Missing ${starsPath}`);
  const source = fs.readFileSync(starsPath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}; result = pluginStars;`, context, {filename: starsPath});
  if (!context.result || typeof context.result !== 'object' || Array.isArray(context.result)) throw new Error('plugin-stars.js did not define an object named pluginStars');
  return context.result;
}

function loadStarHistory() {
  if (!fs.existsSync(starHistoryPath)) return null;
  const source = fs.readFileSync(starHistoryPath, 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}; result = pluginStarHistory;`, context, {filename: starHistoryPath});
  return context.result;
}

const errors = [];
const warnings = [];
const plugins = loadPlugins();
const pluginStars = loadStars();
const pluginStarHistory = loadStarHistory();
const ids = new Map();
const repos = new Map();
const namesZh = new Map();
const namesEn = new Map();
const categoryCounts = Object.fromEntries([...categories].map(category => [category, 0]));
const sourceCounts = {repository: 0, translated: 0, missing: 0};
const badEntity = /&(?:nbsp|quot|amp|lt|gt|#\d+|#x[\da-f]+);/i;
const rawHtml = /<\/?(?:div|span|p|table|tr|td|th|img|a|picture|source|details|summary)\b/i;
const genericZh = /^(?:来自 GitHub 的|这是一个用于 .* 的 DeepSeek Harness 插件|这是一个 DeepSeek Harness 插件|适用于 DeepSeek Harness 的(?:技能|工具|插件))/i;
const sentenceTitle = /^(?:为|给|让|把|将|使用|通过|专门为|适用于|面向).{4,}(?:设计|打造|提供|实现|使用|工具箱|插件)/;
const englishNoise = /(?:latest release|this project is not open source|license\b|maintained by|support status|quick setup|table of contents|click.*star|give.*star|one prompt\.?$|why auto\??$|^surface\.?$)/i;

function add(map, key, id) {
  const values = map.get(key) || [];
  values.push(id);
  map.set(key, values);
}

function checkFile(plugin, field) {
  const relative = plugin[field];
  if (!relative) return;
  const absolute = path.join(project, relative);
  if (!fs.existsSync(absolute)) {
    errors.push(`${plugin.id}: ${field} points to missing file ${relative}`);
    return;
  }
  if (field === 'readmeZhPath') {
    const text = fs.readFileSync(absolute, 'utf8').slice(0, 20000);
    if (badEntity.test(text)) warnings.push(`${plugin.id}: Chinese README contains an HTML entity`);
    if (/<a\s+href=|<img\b/i.test(text)) warnings.push(`${plugin.id}: Chinese README still contains raw HTML links or images`);
    if ((text.match(/[\u3400-\u9fff]/g) || []).length < 20) warnings.push(`${plugin.id}: Chinese README has very little Chinese content`);
  }
}

for (const plugin of plugins) {
  const id = plugin.id || '(missing-id)';
  for (const field of required) if (plugin[field] === undefined || plugin[field] === null || plugin[field] === '') errors.push(`${id}: missing ${field}`);
  if (!categories.has(plugin.category)) errors.push(`${id}: invalid category ${plugin.category}`);
  else categoryCounts[plugin.category] += 1;
  add(ids, plugin.id, id);
  add(repos, plugin.repo, id);
  add(namesZh, plugin.displayNameZh, id);
  add(namesEn, plugin.displayNameEn, id);
  if ('stars' in plugin) errors.push(`${id}: stars must live in plugin-stars.js, not plugins-data.js`);
  if (!Object.hasOwn(pluginStars, plugin.id)) errors.push(`${id}: missing star snapshot`);
  else if (!Number.isInteger(Number(pluginStars[plugin.id])) || Number(pluginStars[plugin.id]) < 0) errors.push(`${id}: invalid star snapshot ${pluginStars[plugin.id]}`);

  const title = String(plugin.displayNameZh || '').trim();
  const summary = String(plugin.summaryZh || plugin.description || '').trim();
  const visible = `${title}\n${summary}`;
  if ((title.match(/[\u3400-\u9fff]/g) || []).length < 2) warnings.push(`${id}: Chinese display name lacks a meaningful Chinese label (${title})`);
  if (title.length > 38) warnings.push(`${id}: Chinese display name is too long (${title.length})`);
  if (sentenceTitle.test(title)) warnings.push(`${id}: Chinese display name reads like a sentence (${title})`);
  if (genericZh.test(summary)) warnings.push(`${id}: Chinese summary is generic (${summary.slice(0, 80)})`);
  if (summary.length < 12) warnings.push(`${id}: Chinese summary is too short`);
  if (summary.length > 220) warnings.push(`${id}: Chinese summary is too long (${summary.length})`);
  if (badEntity.test(visible)) errors.push(`${id}: visible Chinese copy contains an HTML entity`);
  if (rawHtml.test(visible)) errors.push(`${id}: visible Chinese copy contains raw HTML`);

  const titleEn = String(plugin.displayNameEn || '').trim();
  const summaryEn = String(plugin.summaryEn || plugin.descriptionEn || '').trim();
  const visibleEn = `${titleEn}\n${summaryEn}`;
  const englishLetters = (summaryEn.match(/[A-Za-z]/g) || []).length;
  if (titleEn.length < 3) warnings.push(`${id}: English display name is too short`);
  if (titleEn.length > 64) warnings.push(`${id}: English display name is too long (${titleEn.length})`);
  if ((titleEn.match(/[\u3400-\u9fff]/g) || []).length > 0) errors.push(`${id}: English display name contains Chinese copy (${titleEn})`);
  if (englishNoise.test(titleEn)) warnings.push(`${id}: English display name contains README noise (${titleEn})`);
  if (summaryEn.length < 24) warnings.push(`${id}: English summary is too short`);
  if (summaryEn.length > 240) warnings.push(`${id}: English summary is too long (${summaryEn.length})`);
  if (englishLetters < 16 || (summaryEn.match(/[\u3400-\u9fff]/g) || []).length > 0) errors.push(`${id}: English summary is not meaningfully English`);
  if (englishNoise.test(summaryEn)) warnings.push(`${id}: English summary contains README noise (${summaryEn.slice(0, 80)})`);
  if (badEntity.test(visibleEn)) errors.push(`${id}: visible English copy contains an HTML entity`);
  if (rawHtml.test(visibleEn)) errors.push(`${id}: visible English copy contains raw HTML`);

  checkFile(plugin, 'readmeRawPath');
  checkFile(plugin, 'readmeCleanPath');
  checkFile(plugin, 'readmeZhPath');

  if (plugin.readmeZhSource === 'repository') sourceCounts.repository += 1;
  else if (plugin.readmeZhSource === 'translated') sourceCounts.translated += 1;
  else sourceCounts.missing += 1;
  if (plugin.readmeZhSource === 'translated' && !String(plugin.readmeZhPath || '').endsWith('.translated.zh.md')) warnings.push(`${id}: translated source does not use translated.zh.md path`);
  if (plugin.readmeZhSource === 'repository' && String(plugin.readmeZhPath || '').endsWith('.translated.zh.md')) errors.push(`${id}: repository source points to a translated README`);
}

for (const [id, values] of ids) if (id && values.length > 1) errors.push(`duplicate id ${id}: ${values.join(', ')}`);
for (const [repo, values] of repos) if (repo && values.length > 1) errors.push(`duplicate repository ${repo}: ${values.join(', ')}`);
for (const id of Object.keys(pluginStars)) if (!ids.has(id)) errors.push(`orphan star snapshot ${id}`);
if (!pluginStarHistory?.baseline?.stars || !Array.isArray(pluginStarHistory?.snapshots)) {
  errors.push('plugin-star-history.js is missing or has an invalid baseline/snapshots structure');
} else {
  const historyStars = {...pluginStarHistory.baseline.stars};
  let previousDate = String(pluginStarHistory.baseline.date || '');
  for (const snapshot of pluginStarHistory.snapshots) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.date || '')) errors.push(`invalid star-history date ${snapshot.date}`);
    if (previousDate && snapshot.date < previousDate) errors.push(`star-history snapshots are out of order at ${snapshot.date}`);
    previousDate = snapshot.date;
    for (const [id, value] of Object.entries(snapshot.changes || {})) {
      if (!ids.has(id)) warnings.push(`star history contains retired or unknown plugin ${id}`);
      if (!Number.isInteger(Number(value)) || Number(value) < 0) errors.push(`invalid historical star value for ${id}: ${value}`);
      historyStars[id] = Number(value);
    }
  }
  for (const [id, value] of Object.entries(pluginStars)) {
    if (Number(historyStars[id] || 0) !== Number(value || 0)) errors.push(`${id}: latest star history does not match plugin-stars.js`);
  }
}
for (const [name, values] of namesZh) if (name && values.length > 2) warnings.push(`Chinese display name reused ${values.length} times: ${name}`);
for (const [name, values] of namesEn) if (name && values.length > 3) warnings.push(`English display name reused ${values.length} times: ${name}`);
for (const [category, count] of Object.entries(categoryCounts)) if (count === 0) errors.push(`category ${category} has no plugins`);

const report = {project, total: plugins.length, starRecords: Object.keys(pluginStars).length, starHistorySnapshots: pluginStarHistory?.snapshots?.length || 0, categoryCounts, sourceCounts, errors, warnings};
if (json) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`Catalog: ${plugins.length} plugins`);
  console.log(`Star snapshot: ${Object.keys(pluginStars).length} records`);
  console.log(`Star history: ${pluginStarHistory?.snapshots?.length || 0} incremental snapshots`);
  console.log(`Categories: ${Object.entries(categoryCounts).map(([key, value]) => `${key}=${value}`).join(', ')}`);
  console.log(`Chinese README: repository=${sourceCounts.repository}, translated=${sourceCounts.translated}, missing=${sourceCounts.missing}`);
  console.log(`Errors: ${errors.length}; warnings: ${warnings.length}`);
  for (const error of errors) console.error(`ERROR ${error}`);
  for (const warning of warnings) console.warn(`WARN  ${warning}`);
}
if (errors.length || (strict && warnings.length)) process.exitCode = 1;
