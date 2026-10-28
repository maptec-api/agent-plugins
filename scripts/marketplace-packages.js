import assert from 'node:assert/strict';
import { lstat, readFile, readdir } from 'node:fs/promises';

export const outputRoot = 'dist/marketplaces';
export const targets = [
  {
    id: 'codex',
    manifest: 'plugins/maptec-maps/.codex-plugin/plugin.json',
    files: ['.agents/plugins/marketplace.json', 'plugins/maptec-maps/.codex-plugin/plugin.json', 'plugins/maptec-maps/mcp.codex.json'],
    destinations: { 'plugins/maptec-maps/mcp.codex.json': 'plugins/maptec-maps/.mcp.json' },
    contentRoot: 'plugins/maptec-maps',
    setup: 'Extract this archive, then run codex plugin marketplace add . from the extracted directory. Install maptec-maps from Maptec Open Plugins and configure your Maptec key through the host credential flow.'
  },
  {
    id: 'kimi',
    manifest: 'kimi.plugin.json',
    files: ['kimi.plugin.json'],
    setup: 'This package contains the Maptec Skill. Connect and authenticate Maptec MCP in your host before using it; installing the Skill does not create the MCP connection.'
  },
  {
    id: 'claude',
    manifest: '.claude-plugin/plugin.json',
    files: ['.claude-plugin/plugin.json'],
    setup: 'Load this directory as a Claude Code plugin and configure maptec_api_key through the host secure prompt.'
  },
  {
    id: 'zcode',
    manifest: '.zcode-plugin/plugin.json',
    files: ['.zcode-plugin/plugin.json'],
    setup: 'This package requires host support for sensitive plugin settings. Configure maptec_api_key through a supported secure credential flow. If your ZCode version cannot enter sensitive settings, use a separately authenticated Maptec MCP connection with the Skill.'
  },
  {
    id: 'gemini',
    manifest: 'gemini-extension.json',
    files: ['gemini-extension.json'],
    setup: 'Install this directory or archive as a Gemini CLI extension and configure Maptec API Key through the sensitive extension setting.'
  },
  {
    id: 'minimax',
    manifest: '.minimax-plugin/plugin.json',
    files: ['.minimax-plugin/plugin.json'],
    setup: 'This package contains the Maptec Skill. Use it with an authenticated Maptec connection provided by your host. Installing the Skill does not create a Connector.'
  },
  {
    id: 'chatgpt',
    manifest: 'plugin.json',
    files: ['plugins/maptec-maps/plugin.json', 'plugins/maptec-maps/mcp.json'],
    flatten: true,
    setup: 'This package requires a host that supports custom-header API-key authentication. Configure your Maptec key through that host. Standard ChatGPT remote MCP setup does not currently provide this API-key configuration flow.'
  }
];

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export function packageDirectory(target) {
  return `${outputRoot}/${target.id}/maptec-maps`;
}

export function destinationPath(target, source) {
  if (target.destinations?.[source]) return target.destinations[source];
  if (target.contentRoot && ['skills', 'assets'].includes(source)) return `${target.contentRoot}/${source}`;
  return target.flatten ? source.split('/').at(-1) : source;
}

export async function listFiles(directory, prefix = '') {
  const files = [];
  for (const name of (await readdir(directory)).sort()) {
    const relative = `${prefix}${name}`;
    const path = `${directory}/${name}`;
    const info = await lstat(path);
    assert(!info.isSymbolicLink(), `Symlink is not allowed: ${path}`);
    if (info.isDirectory()) files.push(...await listFiles(path, `${relative}/`));
    else {
      assert(info.isFile(), `Special file is not allowed: ${path}`);
      files.push(relative);
    }
  }
  return files.sort();
}
