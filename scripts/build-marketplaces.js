#!/usr/bin/env node
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { destinationPath, packageDirectory, readJson, targets } from './marketplace-packages.js';

for (const target of targets) {
  const directory = packageDirectory(target);
  // Only replace this script's fixed, generated target directories.
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  for (const source of [...target.files, 'skills', 'assets', 'LICENSE']) {
    const destination = `${directory}/${destinationPath(target, source)}`;
    await mkdir(dirname(destination), { recursive: true });
    await cp(source, destination, { recursive: true, dereference: false });
  }
  const manifest = await readJson(`${directory}/${target.manifest}`);
  await writeFile(`${directory}/README.md`, [
    '# Maptec Maps',
    '',
    `Publisher: 云图知行. Version: ${manifest.version}.`,
    '',
    'Source: https://github.com/maptec-api/agent-plugins',
    '',
    target.setup,
    '',
    'Endpoint: https://mcp.maptec.com/mcp . Authorization uses the API key itself without Bearer. Enter credentials only through the host credential flow. Never put a real key in this package or chat.',
    '',
    'Usage and installation: https://github.com/maptec-api/agent-plugins#readme',
    ''
  ].join('\n'));
  console.log(`Built ${target.id} package: ${directory}`);
}
