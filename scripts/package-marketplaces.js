#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { listFiles, outputRoot, packageDirectory, readJson, targets } from './marketplace-packages.js';

const version = (await readJson('package.json')).version;
for (const target of targets) {
  const directory = packageDirectory(target);
  const archive = resolve(`${outputRoot}/maptec-maps-${target.id}-${version}.zip`);
  await rm(archive, { force: true });
  execFileSync('zip', ['-q', '-X', '-r', archive, '.'], { cwd: directory });
  const entries = execFileSync('unzip', ['-Z', '-1', archive], { encoding: 'utf8' })
    .trim().split('\n').filter(entry => !entry.endsWith('/')).sort();
  // Verify the archive itself, including hidden manifests and every copied byte.
  assert.deepEqual(entries, await listFiles(directory));
  for (const entry of entries) {
    assert(!entry.startsWith('/') && !entry.split('/').includes('..'));
    assert.deepEqual(execFileSync('unzip', ['-p', archive, entry]), await readFile(`${directory}/${entry}`));
  }
  console.log(`Packaged and inspected ${archive}`);
}
