#!/usr/bin/env node

import { cp, mkdir, rm } from 'fs/promises';

const pluginRoot = 'plugins/maptec-maps';

async function main() {
  await mkdir(pluginRoot, { recursive: true });
  await rm(`${pluginRoot}/skills`, { recursive: true, force: true });
  await rm(`${pluginRoot}/assets`, { recursive: true, force: true });
  await rm(`${pluginRoot}/.mcp.json`, { force: true });

  await cp('skills', `${pluginRoot}/skills`, { recursive: true });
  await cp('assets', `${pluginRoot}/assets`, { recursive: true });
  await cp(`${pluginRoot}/mcp.codex.json`, `${pluginRoot}/.mcp.json`);

  console.log(`Built Codex plugin package at ${pluginRoot}/`);
}

main().catch((error) => {
  console.error(`Failed to build Codex plugin package: ${error.message}`);
  process.exit(1);
});
