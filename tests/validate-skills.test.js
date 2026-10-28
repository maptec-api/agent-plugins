import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateSkill } from '../scripts/validate-skills.js';

async function fixture(t, frontmatter, body = 'Use the connected map tools.') {
  const root = await mkdtemp(join(tmpdir(), 'maptec-skill-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = join(root, 'sample-skill');
  await mkdir(directory);
  await writeFile(join(directory, 'SKILL.md'), `---\n${frontmatter}\n---\n\n${body}\n`);
  return { root, directory };
}

test('accepts multiline YAML and packaged reference files', async t => {
  const { directory } = await fixture(t, 'name: sample-skill\ndescription: >-\n  Search places\n  and plan routes.', 'Read [routing](references/routing.md). See [search][search].\n\n[search]: references/search.md');
  await mkdir(join(directory, 'references'));
  await writeFile(join(directory, 'references/routing.md'), 'Routing guidance.');
  await writeFile(join(directory, 'references/search.md'), 'Search guidance.');
  const metadata = await validateSkill(directory);
  assert.equal(metadata.description, 'Search places and plan routes.');
});

test('rejects duplicate YAML keys', async t => {
  const { directory } = await fixture(t, 'name: sample-skill\nname: sample-skill\ndescription: Search places.');
  await assert.rejects(validateSkill(directory), { name: 'YAMLParseError', code: 'DUPLICATE_KEY' });
});

test('rejects invalid descriptions and names', async t => {
  for (const frontmatter of [
    'name: sample-skill\ndescription: false',
    'name: sample-skill\ndescription: "  "',
    `name: sample-skill\ndescription: ${'x'.repeat(1025)}`,
    'name: another-skill\ndescription: Search places.'
  ]) {
    const { directory } = await fixture(t, frontmatter);
    await assert.rejects(validateSkill(directory), /description|directory/);
  }
});

test('rejects missing references, including code and reference-style links', async t => {
  for (const body of [
    'Read [routing](references/missing.md).',
    'Read `references/missing.md`.',
    'Read [routing][guide].\n\n[guide]: references/missing.md'
  ]) {
    const { directory } = await fixture(t, 'name: sample-skill\ndescription: Search places.', body);
    await assert.rejects(validateSkill(directory), /ENOENT/);
  }
});

test('rejects references escaping the package, including symlinks', async t => {
  const { root, directory } = await fixture(t, 'name: sample-skill\ndescription: Search places.', 'Read [private](../private.md).');
  await writeFile(join(root, 'private.md'), 'Outside the packaged Skill.');
  await assert.rejects(validateSkill(directory), /escapes/);
  await symlink(join(root, 'private.md'), join(directory, 'external.md'));
  await writeFile(join(directory, 'SKILL.md'), '---\nname: sample-skill\ndescription: Search places.\n---\nRead [private](external.md).\n');
  await assert.rejects(validateSkill(directory), /escapes/);
});
