#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'logs/last-sync.json'), 'utf8'));
const context = {};
vm.createContext(context);
const [dataSource, starsSource, historySource] = await Promise.all(['plugins-data.js','plugin-stars.js','plugin-star-history.js'].map(file => fs.readFile(path.join(root, file), 'utf8')));
vm.runInContext(`${dataSource}\n${starsSource}\n${historySource};result={plugins,pluginStars,pluginStarHistory};`, context);
const readCache = {};
const isRelevant = plugin => {
  let readme = '';
  try { readme = requireRead(plugin.readmeRawPath); } catch {}
  const topics = (plugin.topics || []).filter(topic => topic !== 'dsh-plugin').join(' ');
  return /(?:deepseek[\s_-]*harness|@deepseek-ai\/dsh|\bdsh\b|\bdsh[-_][a-z])/i.test([plugin.name,plugin.descriptionEn||'',topics,readme.slice(0,12000)].join('\n'));
};
function requireRead(relative) { return readCache[relative] || ''; }
for (const plugin of context.result.plugins) {
  if (manifest.newIds.includes(plugin.id) && plugin.readmeRawPath) {
    try { readCache[plugin.readmeRawPath] = await fs.readFile(path.join(root, plugin.readmeRawPath), 'utf8'); } catch {}
  }
}
const rejected = context.result.plugins.filter(plugin => manifest.newIds.includes(plugin.id) && !isRelevant(plugin));
const rejectedIds = new Set(rejected.map(plugin => plugin.id));
const plugins = context.result.plugins.filter(plugin => !rejectedIds.has(plugin.id));
const stars = Object.fromEntries(Object.entries(context.result.pluginStars).filter(([id]) => !rejectedIds.has(id)));
const history = context.result.pluginStarHistory;
history.baseline.stars = Object.fromEntries(Object.entries(history.baseline.stars).filter(([id]) => !rejectedIds.has(id)));
for (const snapshot of history.snapshots) snapshot.changes = Object.fromEntries(Object.entries(snapshot.changes || {}).filter(([id]) => !rejectedIds.has(id)));
manifest.newIds = manifest.newIds.filter(id => !rejectedIds.has(id));
manifest.rejectedRepositories = rejected.map(plugin => `${plugin.owner}/${plugin.name}`);
manifest.total = plugins.length;
await fs.writeFile(path.join(root, 'plugins-data.js'), `const plugins = ${JSON.stringify(plugins)};\n`, 'utf8');
await fs.writeFile(path.join(root, 'plugin-stars.js'), `const pluginStars = ${JSON.stringify(stars)};\n`, 'utf8');
await fs.writeFile(path.join(root, 'plugin-star-history.js'), `const pluginStarHistory = ${JSON.stringify(history)};\n`, 'utf8');
await fs.writeFile(path.join(root, 'logs/last-sync.json'), `${JSON.stringify(manifest,null,2)}\n`, 'utf8');
for (const plugin of rejected) {
  for (const relative of [plugin.readmeRawPath, plugin.readmeCleanPath, plugin.readmeZhPath].filter(Boolean)) {
    try { await fs.unlink(path.join(root, relative)); } catch {}
  }
}
console.log(JSON.stringify({rejected: rejected.map(plugin => plugin.id), total: plugins.length}, null, 2));
