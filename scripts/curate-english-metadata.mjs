import fs from 'node:fs/promises';
import vm from 'node:vm';

const dataUrl = new URL('../plugins-data.js', import.meta.url);
const args = process.argv.slice(2);
const idsFileIndex = args.indexOf('--ids-file');
const source = await fs.readFile(dataUrl, 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}; result = plugins;`, context);
const plugins = context.result;
let targetIds = null;
if (idsFileIndex >= 0 && args[idsFileIndex + 1]) {
  const manifest = JSON.parse(await fs.readFile(new URL(`../${args[idsFileIndex + 1]}`, import.meta.url), 'utf8'));
  targetIds = new Set(manifest.newIds || []);
}
const targets = targetIds ? plugins.filter(plugin => targetIds.has(plugin.id)) : plugins;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const overrides = {
  'deepseek-ai-deepseek-harness': {
    displayNameEn: 'DeepSeek Harness Agent Framework',
    summaryEn: 'An open-source agent harness from DeepSeek AI where models, tools, skills, sessions, and interfaces are all plugins.'
  },
  'nexu-io-open-design': {
    displayNameEn: 'Open-Source Design Workbench',
    summaryEn: 'A local-first, open-source Claude Design alternative that lets coding agents create prototypes, websites, presentations, images, and videos.'
  },
  'titanwings-colleague-skill': {
    displayNameEn: 'Personality Distillation AI Skill',
    summaryEn: 'Turn the thinking patterns, expertise, and voice of colleagues, family, public figures, fictional characters, or yourself into a reusable AI Skill.'
  },
  'maxeaglet-dsh-bash-terminal': {
    displayNameEn: 'Windows Multi-Shell Tool',
    summaryEn: 'Give DeepSeek Harness one Windows command interface for PowerShell, Git Bash, and WSL.'
  },
  'rirko-dsh-melody-launcher': {
    displayNameEn: 'DSH Desktop Launcher & Plugin Manager',
    summaryEn: 'Launch DeepSeek Harness and manage local plugins through a desktop interface.'
  },
  'sqhao-o-dsh-docs': {
    displayNameEn: 'Local Document OCR & Parser',
    summaryEn: 'Parse PDFs, Office files, images, and scanned documents locally for offline document understanding in DeepSeek Harness.'
  },
  'acidmoon-dizzy-dsh': {
    displayNameEn: 'Dizzy DSH Plugin Bundle',
    summaryEn: 'Install balance, usage, browser control, vision, generative UI, desktop notifications, and an IDE sidebar as one bundle.'
  },
  'graycodeteam-graycode-for-dsh': {
    displayNameEn: 'Gray Code Workflow & Memory Plugin',
    summaryEn: 'Bring Gray Code document workflows, persistent memory, checkpoints, branches, and review tools to DeepSeek Harness.'
  },
  '6mikao9-dsh-wsl-workspace': {
    displayNameEn: 'WSL Workspace Connector',
    summaryEn: 'Add and use WSL workspaces directly from the DSH interface without installing another DeepSeek Harness inside WSL.'
  },
  'limbo947-dsh-recall-plugin': {
    displayNameEn: 'Message Recall & State Rewind',
    summaryEn: 'Recall a sent message and restore the DeepSeek Harness session to the state captured before that message.'
  },
  'tsrigo-dsh-from-scratch': {
    displayNameEn: 'DSH TypeScript Tutorial',
    summaryEn: 'Build a minimal DeepSeek-style agent harness from scratch through a runnable TypeScript project.'
  },
  'festoney8-deepseek-harness-gui': {
    displayNameEn: 'Lightweight DSH Desktop Launcher',
    summaryEn: 'A lightweight Tauri desktop launcher for DeepSeek Harness with core upgrades and a portable edition.'
  },
  'william-jin-cmu-dsh-companion': {
    displayNameEn: 'DSH Desktop Companion',
    summaryEn: 'Add global launch, scheduled automation, quick replies, and plugin discovery to DeepSeek Harness.'
  },
  'tonydua-dsh-web-search-exa': {
    displayNameEn: 'Exa Web Search Connector',
    summaryEn: 'Add zero-configuration Exa search to DeepSeek Harness with anonymous MCP fallback and an authenticated REST path.'
  },
  'gooodwei-context-vista': {
    displayNameEn: 'Context Usage Ring Panel',
    summaryEn: 'Visualize context token allocation, compaction effects, and estimated cost through a side panel and /context command.'
  },
  'micromilo-upstream-radar': {
    displayNameEn: 'Upstream Change Risk Radar',
    summaryEn: 'Continuously monitor vulnerabilities and breaking upstream changes, then identify affected DeepSeek Harness plugins.'
  },
  'zhangzheng25-dsh-timeline': {
    displayNameEn: 'Prompt Timeline Navigator',
    summaryEn: 'Display every prompt as a navigable timeline node with click-to-jump and hover previews.'
  },
  'huashenglian-dsh-her-eyes': {
    displayNameEn: 'Dual-VLM Vision Analyzer',
    summaryEn: 'Provide image analysis in every session with automatic failover between primary and backup OpenAI-compatible vision endpoints.'
  },
  'whiteplusms-dsh-input-plus': {
    displayNameEn: 'Workspace Reference Input',
    summaryEn: 'Improve the DSH Web composer with workspace file references, prompt history, and lightweight editing enhancements.'
  },
  'dasooul03-dsh-plugin-deepseek-pricing': {
    displayNameEn: 'DeepSeek Live Price Monitor',
    summaryEn: 'Track DeepSeek pricing, peak and off-peak periods, and estimated cost for the current session.'
  },
  'linshule-dsh-balance': {
    displayNameEn: 'DeepSeek Account Balance Badge',
    summaryEn: 'Show a draggable live DeepSeek API account balance badge in the DSH Web GUI with a dedicated settings page.'
  },
  'shinelon-eyes-for-deepseek': {
    displayNameEn: 'DeepSeek MCP Vision Toolkit',
    summaryEn: 'Give text-only models image analysis, OCR, UI conversion, error diagnosis, chart understanding, and visual comparison through MCP.'
  },
  'tt-a1i-archify': {
    displayNameEn: 'Architecture Visualization Skill',
    summaryEn: 'Generate polished, verifiable architecture, workflow, sequence, data-flow, and lifecycle diagrams as interactive HTML.'
  },
  'devin-axis-ipollowork': {
    displayNameEn: 'Self-Evolving AI Workbench',
    summaryEn: 'A local-first visual AI workbench that turns one goal into editable code, documents, presentations, websites, designs, and videos.'
  },
  'crafter-station-petdex': {
    displayNameEn: 'Animated Agent Pet Gallery',
    summaryEn: 'A public gallery of animated companions for Codex, Claude Code, DeepSeek Harness, Hermes, OpenCode, Gemini CLI, and other coding agents.'
  },
  'foryourhealth111-pixel-vibe-skills': {
    displayNameEn: 'Skill Router & Workflow Orchestrator',
    summaryEn: 'Automatically discover and route local Skills, then orchestrate them into structured, verifiable agent workflows.'
  },
  'imsai-sh-zhuzhiliao': {
    displayNameEn: 'Bamboo Cicada Web Toy',
    summaryEn: 'A mobile-first, single-file Web simulation of the traditional Chinese bamboo cicada toy, with touch, motion, and synthesized sound.'
  },
  'anywhere-labs-deepseek-harness-desktop': {
    displayNameEn: 'DeepSeek Harness Desktop',
    summaryEn: 'A desktop experience that starts and manages the official DeepSeek Harness Web UI without requiring users to run terminal commands.'
  },
  'whiteguo233-openbiliclaw': {
    displayNameEn: 'Personalized Content Discovery Agent',
    summaryEn: 'A private, cross-platform content discovery agent for Bilibili, Xiaohongshu, YouTube, and other media sources.'
  },
  'zhu1090093659-dsh-web-ui': {
    displayNameEn: 'DSH Web UI Extension Suite',
    summaryEn: 'A collection of DeepSeek Harness Web UI plugins and themes for task boards, Git graphs, side panels, remote access, visual tools, pets, and token statistics.'
  },
  'ccch1mneyyy-dsh-tui': {
    displayNameEn: 'DSH Terminal Interface',
    summaryEn: 'A Claude Code-style terminal UI for DeepSeek Harness with streaming thoughts, live status, context progress, time rewind, and TPS metrics.'
  },
  'omdsh-dev-dsh-better-sidebar': {
    displayNameEn: 'DSH Sidebar Workbench',
    summaryEn: 'A service-based sidebar and bottom-panel workbench that lets DeepSeek Harness plugins register pages, file previews, and workspace tools.'
  },
  'adamplatin123-awesome-dsh-plugins': {
    displayNameEn: 'DSH Plugin Ecosystem Radar',
    summaryEn: 'Automatically discovers DeepSeek Harness plugins and verifies installation evidence so users can compare working options before installing.'
  },
  'awesome-dsh-plugin-awesome-dsh-plugin': {
    displayNameEn: 'DeepSeek Harness Plugin Directory',
    summaryEn: 'A continuously maintained directory of noteworthy plugins across the DeepSeek Harness ecosystem.'
  },
  'liustack-modlens': {
    displayNameEn: 'DeepSeek Harness Vision Bridge',
    summaryEn: 'Add OCR, layout analysis, and semantic understanding to text-only coding agents, with structured visual evidence as output.'
  },
  'xiaobright-dsh-anchored-standard': {
    displayNameEn: 'Two-Phase DSH Preset',
    summaryEn: 'A two-phase DeepSeek Harness preset with a minimal aligned bootstrap followed by the full Standard toolset.'
  },
  'picgo-picgo-core': {
    displayNameEn: 'Image Upload Engine',
    summaryEn: 'A lightweight image-uploading engine with both command-line and API support.'
  },
  'anionex-agent-vision-toolkit': {
    displayNameEn: 'Agent Vision Toolkit',
    summaryEn: 'Give text-only coding agents multi-image Q&A, long-screenshot OCR, frontend UI reconstruction, and GUI automation capabilities.'
  },
  'xytom-coding-tools-mcp': {
    displayNameEn: 'Agent Coding Tools MCP',
    summaryEn: 'An MCP toolkit that gives AI agents a broader set of practical coding and repository operations.'
  },
  'small-tailqwq-dsh-deep-whale': {
    displayNameEn: 'DSH Whale Theme Collection',
    summaryEn: 'A collection of whale-themed skins for the DeepSeek Harness Web UI.'
  },
  'hellowind777-helloagents': {
    displayNameEn: 'Autonomous Coding Partner',
    summaryEn: 'A workflow layer for AI coding CLIs with skills, project knowledge, delivery checks, safer configuration writes, and resumable execution.'
  },
  'adoresever-graph-memory': {
    displayNameEn: 'Knowledge Graph Memory Plugin',
    summaryEn: 'A knowledge-graph context engine for OpenClaw that extracts conversation triples, compresses context, and reuses experience across sessions.'
  },
  'superdesigndev-superdesign-skill': {
    displayNameEn: 'Frontend Design Skill',
    summaryEn: 'Turn AI-generated interfaces into polished, shippable frontend designs for Claude Code, Cursor, and other coding agents.'
  },
  'anionex-dsh-vision-toolkit': {
    displayNameEn: 'DSH Vision Toolkit',
    summaryEn: 'A native DeepSeek Harness vision toolkit for image Q&A, long-screenshot OCR, UI reconstruction, grounding, pixel diff, and Artifacts.'
  }
};

function cjkCount(value = '') {
  return (value.match(/[\u3400-\u9fff]/g) || []).length;
}

function plainText(value = '') {
  return value.replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/[`*_>#|]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isUsableEnglish(value = '') {
  const text = plainText(value);
  const letters = (text.match(/[A-Za-z]/g) || []).length;
  if (text.length < 24 || letters < 16 || cjkCount(text) > 0) return false;
  if (/(?:latest release|this project is not open source|license\b|maintained by|support status|quick setup|table of contents|click.*star|give.*star|one prompt\.?$|why auto\??$|^surface\.?$)/i.test(text)) return false;
  if (/https?:|\]\(|\[!\w+\]|&\w+;/.test(text)) return false;
  return true;
}

function cleanSummary(value = '', plugin) {
  let text = plainText(value).replace(/^[:·\-–—\s]+/, '');
  text = text.replace(new RegExp(`^${plugin.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?:[·:：—-]+\\s*)?`, 'i'), '');
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  let result = '';
  for (const sentence of sentences.length ? sentences : [text]) {
    if (result && result.length + sentence.length + 1 > 220) break;
    result += `${result ? ' ' : ''}${sentence}`;
    if (result.length >= 90) break;
  }
  result = (result || text).slice(0, 220).trim().replace(/[·|,:;\-–—\s]+$/, '');
  if (result && !/[.!?]$/.test(result)) result += '.';
  return result;
}

function humanizeRepositoryName(value = '') {
  return value.replace(/[-_]+/g, ' ').replace(/\bdsh\b/gi, 'DSH').replace(/\bmcp\b/gi, 'MCP')
    .replace(/\bui\b/gi, 'UI').replace(/\bapi\b/gi, 'API').replace(/\btui\b/gi, 'TUI')
    .replace(/\b\w/g, character => character.toUpperCase()).trim().slice(0, 58);
}

function cleanTitle(value = '', plugin) {
  let title = plainText(value).replace(/[“”"']/g, '').replace(/^[:·\-–—\s]+|[.!?:;,·\-–—\s]+$/g, '').trim();
  if (!title || title.length > 64 || cjkCount(title) || /(?:latest release|license|not open source|maintained by|features?|quick setup|support status|table of contents|click.*star|one prompt|why auto|readme)/i.test(title)) {
    title = humanizeRepositoryName(plugin.name);
  }
  return title;
}

function protect(value, plugin) {
  const tokens = [];
  const keep = match => {
    const token = `ZXQ${tokens.length}QXZ`;
    tokens.push(match);
    return token;
  };
  let text = value.replace(/`[^`]+`/g, keep).replace(/https?:\/\/[^\s)]+/g, keep);
  for (const term of [plugin.name, 'DeepSeek Harness', 'Claude Code', 'OpenAI', 'GitHub', 'MCP', 'DSH', 'Codex', 'Web UI', 'TUI', 'OAuth', 'API']) {
    if (!term) continue;
    text = text.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), keep);
  }
  return {text, restore(translated) {
    return translated.replace(/ZXQ\s*(\d+)\s*QXZ/gi, (_, index) => tokens[Number(index)] || '');
  }};
}

async function translateToEnglish(value, plugin) {
  if (!value.trim() || cjkCount(value) === 0) return value;
  const {text, restore} = protect(value, plugin);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}});
      if (!response.ok) throw new Error(`translate ${response.status}`);
      const data = await response.json();
      return restore((data[0] || []).map(item => item[0] || '').join('')).trim();
    } catch (error) {
      if (attempt === 5) throw error;
      await delay(attempt * 800);
    }
  }
}

const stats = {targets: targets.length, overridden: 0, translatedTitles: 0, translatedSummaries: 0, sourceEnglish: 0};
const queue = [...targets];
async function worker() {
  while (queue.length) {
    const plugin = queue.shift();
    const override = overrides[plugin.id];
    if (override) {
      Object.assign(plugin, override, {descriptionEn: override.summaryEn});
      stats.overridden += 1;
      continue;
    }

    const titleSource = cjkCount(plugin.displayNameZh || '') >= 2 ? plugin.displayNameZh : humanizeRepositoryName(plugin.name);
    const translatedTitle = await translateToEnglish(titleSource, plugin);
    plugin.displayNameEn = cleanTitle(translatedTitle, plugin);
    if (cjkCount(titleSource)) stats.translatedTitles += 1;

    const description = isUsableEnglish(plugin.descriptionEn || '') ? plugin.descriptionEn : '';
    const existingSummary = isUsableEnglish(plugin.summaryEn || '') ? plugin.summaryEn : '';
    if (description || existingSummary) {
      plugin.summaryEn = cleanSummary(description || existingSummary, plugin);
      stats.sourceEnglish += 1;
    } else {
      const translatedSummary = await translateToEnglish(plugin.summaryZh || plugin.description || '', plugin);
      plugin.summaryEn = cleanSummary(translatedSummary, plugin);
      stats.translatedSummaries += 1;
    }
    if (!isUsableEnglish(plugin.summaryEn)) {
      plugin.summaryEn = `A ${humanizeRepositoryName(plugin.name)} project for the DeepSeek Harness ecosystem.`;
    }
    plugin.descriptionEn = plugin.summaryEn;
    await delay(25);
  }
}

await Promise.all(Array.from({length: 8}, () => worker()));
await fs.writeFile(dataUrl, `const plugins = ${JSON.stringify(plugins)};\n`, 'utf8');
console.error(`English metadata ready: targets=${stats.targets}, overrides=${stats.overridden}, translatedTitles=${stats.translatedTitles}, translatedSummaries=${stats.translatedSummaries}, sourceEnglish=${stats.sourceEnglish}`);
