#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const args = process.argv.slice(2);
const valueFor = flag => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : '';
};
const project = path.resolve(valueFor('--project') || process.cwd());
const auditOnly = args.includes('--audit-only');
const skipFetch = args.includes('--skip-fetch');
const skipTranslation = args.includes('--skip-translation');
const allowDirty = args.includes('--allow-dirty');
const strict = args.includes('--strict');
const here = path.dirname(fileURLToPath(import.meta.url));

function run(command, commandArgs, options = {}) {
  console.error(`\n> ${command} ${commandArgs.join(' ')}`);
  const result = spawnSync(command, commandArgs, {cwd: project, stdio: options.capture ? 'pipe' : 'inherit', encoding: 'utf8'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  if (options.capture) return result;
  return result;
}

for (const relative of ['plugins-data.js', 'plugin-stars.js', 'scripts/fetch-dsh-data.mjs', 'scripts/translate-missing-readmes.mjs', 'scripts/curate-english-metadata.mjs']) {
  if (!fs.existsSync(path.join(project, relative))) throw new Error(`Not a DSH plugin catalog project: missing ${relative}`);
}
// plugin-star-history.js is created by the first refresh for older catalog checkouts.

if (!auditOnly && !allowDirty && fs.existsSync(path.join(project, '.git'))) {
  const status = run('git', ['status', '--short'], {capture: true});
  if (status.status !== 0) throw new Error(status.stderr || 'git status failed');
  if (status.stdout.trim()) {
    console.error('Refusing to overwrite generated files in a dirty worktree. Inspect changes or pass --allow-dirty deliberately.');
    process.exit(2);
  }
}

let fetchReport = null;
if (!auditOnly && !skipFetch) {
  const fetched = run(process.execPath, ['scripts/fetch-dsh-data.mjs'], {capture: true});
  if (fetched.stderr) process.stderr.write(fetched.stderr);
  const lines = fetched.stdout.trim().split(/\r?\n/).filter(Boolean);
  try { fetchReport = JSON.parse(lines.at(-1) || '{}'); }
  catch { throw new Error(`Could not parse fetch report: ${fetched.stdout}`); }
}
const contentRefresh = !auditOnly && (skipFetch || Boolean(fetchReport?.newIds?.length));
if (contentRefresh && !skipTranslation) {
  const translationArgs = ['scripts/translate-missing-readmes.mjs'];
  if (!skipFetch) translationArgs.push('--ids-file', 'logs/last-sync.json');
  run(process.execPath, translationArgs);
}
if (contentRefresh) {
  const englishArgs = ['scripts/curate-english-metadata.mjs'];
  if (!skipFetch) englishArgs.push('--ids-file', 'logs/last-sync.json');
  run(process.execPath, englishArgs);
}
if (contentRefresh && fs.existsSync(path.join(project, 'scripts/generate-seo-pages.mjs'))) {
  run(process.execPath, ['scripts/generate-seo-pages.mjs']);
}
if (contentRefresh && fs.existsSync(path.join(project, 'scripts/generate-discovery-pages.mjs'))) {
  run(process.execPath, ['scripts/generate-discovery-pages.mjs']);
}
const auditArgs = [path.join(here, 'audit_catalog.mjs'), '--project', project];
if (strict) auditArgs.push('--strict');
run(process.execPath, auditArgs);

if (fs.existsSync(path.join(project, '.git'))) {
  const status = run('git', ['status', '--short'], {capture: true});
  if (status.stdout.trim()) console.log(`\nChanged files:\n${status.stdout.trimEnd()}`);
  else console.log('\nNo catalog files changed.');
}
