#!/usr/bin/env node
import assert from 'node:assert/strict';
import { lstat, readFile } from 'node:fs/promises';
import { destinationPath, listFiles, packageDirectory, readJson, targets } from './marketplace-packages.js';
import { validateSkill } from './validate-skills.js';

const version = (await readJson('package.json')).version;
const claudeMarketplace = await readJson('.claude-plugin/marketplace.json');
assert.equal(claudeMarketplace.name, 'maptec-open-plugins');
assert.equal(claudeMarketplace.owner.name, '云图知行');
assert.deepEqual(claudeMarketplace.plugins.find(plugin => plugin.name === 'maptec-maps')?.source, {
  source: 'github', repo: 'maptec-api/agent-plugins'
});
for (const target of targets) {
  const directory = packageDirectory(target);
  const contentDirectory = target.contentRoot ? `${directory}/${target.contentRoot}` : directory;
  const manifest = await readJson(`${directory}/${target.manifest}`);
  assert.equal(manifest.name, 'maptec-maps');
  assert.equal(manifest.version, version, `${target.id}: version mismatch`);
  if (target.id !== 'gemini') {
    assert.equal(typeof manifest.author === 'string' ? manifest.author : manifest.author.name, '云图知行');
  }
  if (['claude', 'zcode'].includes(target.id)) {
    assert.equal(manifest.repository, 'https://github.com/maptec-api/agent-plugins');
    assert.equal(manifest.userConfig.maptec_api_key.sensitive, true);
    assert.equal(manifest.userConfig.maptec_api_key.required, true);
    assert.equal(manifest.mcpServers.maptec.type, 'http');
    assert.equal(manifest.mcpServers.maptec.headers.Authorization, '${user_config.maptec_api_key}');
  }
  if (target.id === 'codex') {
    const marketplace = await readJson(`${directory}/.agents/plugins/marketplace.json`);
    const source = marketplace.plugins.find(plugin => plugin.name === manifest.name)?.source;
    assert.deepEqual(source, { source: 'local', path: './plugins/maptec-maps' });
    assert.equal(manifest.skills, './skills/');
    assert.equal(manifest.mcpServers, './.mcp.json');
    const mcp = await readJson(`${contentDirectory}/.mcp.json`);
    assert.equal(mcp.mcpServers.maptec.url, 'https://mcp.maptec.com/mcp');
  }
  if (target.id === 'gemini') {
    assert.equal(manifest.mcpServers.maptec.httpUrl, 'https://mcp.maptec.com/mcp');
    assert.equal(manifest.mcpServers.maptec.headers.Authorization, '${MAPTEC_API_KEY}');
    assert(manifest.settings.some(setting => setting.envVar === 'MAPTEC_API_KEY' && setting.sensitive === true));
  }
  if (target.id === 'minimax') {
    assert.equal(manifest.schemaVersion, 1);
    assert.deepEqual(manifest.apps, []);
    assert.deepEqual(manifest.mcpServers, []);
    assert.deepEqual(manifest.skills, ['skills/maptec-maps/SKILL.md']);
  }
  if (target.id === 'kimi') {
    assert.equal(manifest.skills, './skills/');
    assert.equal(manifest.mcpServers, undefined, 'Kimi package uses a separately configured MCP connection');
  }
  if (target.id === 'chatgpt') {
    const openai = manifest.extensions['com.openai'];
    assert.equal(openai.interface.developerName, '云图知行');
    assert(openai.interface.shortDescription.length <= 30);
    assert.deepEqual(openai.interface.capabilities, ['Read']);
    const mcp = await readJson(`${directory}/mcp.json`);
    assert.equal(mcp.mcpServers.maptec.type, 'streamable-http');
    assert.equal(mcp.mcpServers.maptec.url, 'https://mcp.maptec.com/mcp');
    assert.equal(mcp.mcpServers.maptec.headers, undefined);
    assert.deepEqual(mcp.mcpServers.maptec.extensions['com.openai'].auth, {
      type: 'api_key', headerScheme: 'custom_header', headerName: 'Authorization'
    });
  }

  const expectedFiles = ['README.md'];
  for (const source of [...target.files, 'skills', 'assets', 'LICENSE']) {
    const destination = destinationPath(target, source);
    const info = await lstat(source);
    const paths = info.isDirectory() ? (await listFiles(source)).map(file => [file, `${destination}/${file}`]) : [['', destination]];
    for (const [relative, packaged] of paths) {
      const original = relative ? `${source}/${relative}` : source;
      assert.deepEqual(await readFile(`${directory}/${packaged}`), await readFile(original), `${target.id}: stale ${packaged}`);
      expectedFiles.push(packaged);
    }
  }
  assert.deepEqual(await listFiles(directory), expectedFiles.sort(), `${target.id}: unexpected or missing files`);
  assert((await readFile(`${directory}/README.md`, 'utf8')).includes(target.setup));

  for (const path of await listFiles(directory)) {
    if (path.endsWith('.json')) JSON.parse(await readFile(`${directory}/${path}`, 'utf8'));
  }
  await validateSkill(`${contentDirectory}/skills/maptec-maps`);
  for (const file of ['logo.png', 'icon.png', 'logo-dark.png']) {
    const png = await readFile(`${contentDirectory}/assets/${file}`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), png.readUInt32BE(20), `${file}: icon must be square`);
    assert(png.readUInt32BE(16) >= 48 && png.readUInt32BE(16) <= 4096);
    assert(png.length <= 5 * 1024 * 1024);
  }
  console.log(`Validated ${target.id}: identity, configuration, inventory, source copies, JSON, Skill, icons`);
}
console.log('Package checks passed.');
