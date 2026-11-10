import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
test('Astro keeps original page structure', () => {
  const page = read('src/pages/index.astro');
  for (const name of ['Hero', 'About', 'Expertise', 'TechStack', 'Certifications', 'Projects', 'Footer']) {
    assert.match(page, new RegExp(`<${name}\\s*/>`));
  }
  assert.match(page, /<main\s+id="main"/);
});
test('static site configuration remains user page', () => {
  assert.match(read('astro.config.mjs'), /https:\/\/vivaldomp\.github\.io/);
  assert.ok(existsSync('.github/workflows/deploy.yml'));
  assert.match(read('.github/workflows/deploy.yml'), /branches:\s*\[master\]/);
});
test('layout retains accessibility and metadata', () => {
  const layout = read('src/layouts/Layout.astro');
  assert.match(layout, /name="description"/);
  assert.match(layout, /<a\s+href="#main"/);
  assert.match(layout, /name="viewport"/);
});
