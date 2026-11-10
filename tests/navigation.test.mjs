import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const hero = read('src/components/Hero.astro');
const layout = read('src/layouts/Layout.astro');
const certs = read('src/components/Certifications.astro');

const certLinkPattern = /<a\b[^>]*href="#certifications"[^>]*>([\s\S]*?)<\/a>/g;
const visibleText = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const srcComponents = readdirSync('src/components').filter((f) => f.endsWith('.astro'));

test('Hero exposes a visible "Certifications" navigation link to the existing section', () => {
  const matches = [...hero.matchAll(certLinkPattern)];
  assert.equal(matches.length, 1, 'exactly one #certifications link expected in the Hero');
  const [link] = matches;
  assert.equal(visibleText(link[1]), 'Certifications', 'link must have the accessible text "Certifications"');
  assert.doesNotMatch(link[0], /aria-label/, 'visible text must not be overridden by aria-label');
  assert.doesNotMatch(link[0], /target="_blank"|rel="noopener/, 'internal anchor must not open a new tab');
  assert.match(link[0], /class="btn ghost"/, 'link reuses the existing secondary button style');
});

test('Hero keeps a single primary CTA', () => {
  assert.equal((hero.match(/class="btn primary"/g) ?? []).length, 1);
  assert.match(hero, /<a class="btn primary" href="#projects">/);
});

test('the certifications anchor target exists exactly once across components', () => {
  const ids = srcComponents
    .map((f) => read(`src/components/${f}`))
    .flatMap((src) => src.match(/id="certifications"/g) ?? []);
  assert.equal(ids.length, 1);
  assert.match(certs, /id="certifications"/);
  assert.match(certs, /title="Certifications"/);
});

test('layout provides a visible keyboard focus indicator for links and buttons', () => {
  assert.match(layout, /a:focus-visible[\s\S]*?\{[\s\S]*?outline:\s*2px solid var\(--accent\)/);
  assert.match(layout, /outline-offset:\s*3px/);
  for (const file of ['src/layouts/Layout.astro', 'src/components/Hero.astro']) {
    assert.doesNotMatch(read(file), /outline:\s*(none|0)\b/, `${file} must not suppress focus outlines`);
  }
});

test('layout design tokens are unchanged', () => {
  for (const token of ['--bg: #0a0e1a', '--text: #e6ebf5', '--accent: #22d3ee', '--maxw: 1120px']) {
    assert.ok(layout.includes(token), `missing design token ${token}`);
  }
});

test('built page contains one certifications anchor and one link to it', { skip: !existsSync('dist/index.html') }, () => {
  const html = read('dist/index.html');
  assert.equal((html.match(/id="certifications"/g) ?? []).length, 1);
  const matches = [...html.matchAll(certLinkPattern)];
  assert.equal(matches.length, 1);
  assert.equal(visibleText(matches[0][1]), 'Certifications');
});
