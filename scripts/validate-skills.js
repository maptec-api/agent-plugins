#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { basename, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export async function validateSkill(directory) {
  const root = await realpath(directory);
  const text = await readFile(resolve(root, 'SKILL.md'), 'utf8');
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert(frontmatter, `${directory}: missing YAML frontmatter`);
  const metadata = parse(frontmatter[1]);
  assert(metadata && typeof metadata === 'object' && !Array.isArray(metadata), `${directory}: frontmatter must be a mapping`);
  assert.equal(metadata.name, basename(root), `${directory}: name must match its directory`);
  assert(typeof metadata.name === 'string' && metadata.name.length <= 64 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.name), `${directory}: invalid skill name`);
  assert(typeof metadata.description === 'string' && metadata.description.trim().length > 0 && metadata.description.length <= 1024, `${directory}: description must be a nonblank string of at most 1024 characters`);
  const body = text.slice(frontmatter[0].length);
  assert(body.trim(), `${directory}: instruction body is empty`);

  const links = [
    ...[...body.matchAll(/!?\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\s*\)/g)].map(match => match[1].replace(/^<|>$/g, '')),
    ...[...body.matchAll(/^\s*\[[^\]]+\]:\s*(<[^>]+>|[^\s]+)/gm)].map(match => match[1].replace(/^<|>$/g, '')),
    ...[...body.matchAll(/`(references\/[^`\n]+)`/g)].map(match => match[1])
  ];
  for (const link of new Set(links)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(link)) continue;
    const path = decodeURIComponent(link.split(/[?#]/)[0]);
    const target = await realpath(resolve(root, path));
    const within = relative(root, target);
    assert(!isAbsolute(within) && within !== '..' && !within.startsWith(`..${sep}`), `${directory}: reference escapes the Skill directory: ${link}`);
    assert((await stat(target)).isFile(), `${directory}: reference is not a file: ${link}`);
  }
  return metadata;
}

async function main() {
  const root = process.argv[2] ?? 'skills';
  const entries = (await readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory());
  assert(entries.length > 0, `${root}: no skills found`);
  for (const entry of entries) {
    await validateSkill(resolve(root, entry.name));
    console.log(`Validated Skill: ${entry.name}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`Skill validation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
