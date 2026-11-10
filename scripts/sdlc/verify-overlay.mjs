#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
const files = [
  '.github/ISSUE_TEMPLATE/prd.yml',
  '.github/workflows/prd-refine.yml',
  '.github/workflows/prd-implement.yml',
  '.github/workflows/prd-review.yml',
  '.github/workflows/sdlc-ci.yml',
  '.github/workflows/sdlc-preview.yml',
  '.github/workflows/deploy.yml',
  '.github/agents/prd-analyst.md',
  '.github/agents/prd-developer.md',
  '.github/agents/prd-reviewer.md',
  'scripts/sdlc/check-agent-changes.mjs',
  'scripts/sdlc/setup-pi.sh',
  'scripts/sdlc/setup-playwright-mcp.sh',
  'scripts/sdlc/check-mcp-preview.mjs',
  '.github/agents/prd-visual-reviewer.md',
  'docs/agentic-sdlc/GH_AW_PI_MCP_REFERENCE.md',
  'scripts/sdlc/prepare-preview.mjs',
  'astro.config.mjs',
  'src/pages/index.astro'
];
for(const file of files) assert.ok(fs.existsSync(file), `Missing: ${file}`);
for(const p of ['prd-refine','prd-implement','prd-review']) {
  const text = fs.readFileSync(`.github/workflows/${p}.yml`, 'utf8');
  assert.match(text, /OPENCODE_API_KEY/);
  assert.match(text, /opencode-go\/deepseek-v4\.1-flash/);
  assert.match(text, /--no-session/);
  assert.match(text, /setup-pi\.sh/);
  assert.doesNotMatch(text, /DEEPSEEK_API_KEY|api\.deepseek\.com|OPENAI_API_KEY/);
  assert.ok(!fs.existsSync(`.github/workflows/${p}.md`),'Old gh-aw workflows must be migrated: run bash scripts/sdlc/migrate-opencode-go.sh');
}
const implement=fs.readFileSync('.github/workflows/prd-implement.yml','utf8');
assert.match(implement,/sdlc:approved/);
assert.match(implement,/SDLC_BOT_TOKEN/);
assert.match(implement,/check-agent-changes\.mjs/);
const prev=fs.readFileSync('.github/workflows/sdlc-preview.yml','utf8');
assert.match(prev,/desktop\.png/);
assert.match(prev,/mobile\.png/);
assert.match(prev,/mcp__playwright__browser_navigate/);
assert.match(prev,/setup-playwright-mcp\.sh/);
assert.match(prev,/check-mcp-preview\.mjs/);
assert.match(fs.readFileSync('scripts/sdlc/setup-pi.sh','utf8'),/pi install npm:pi-lens@4\.4\.11/);
assert.match(fs.readFileSync('scripts/sdlc/setup-playwright-mcp.sh','utf8'),/@playwright\/mcp@0\.0\.79/);
assert.match(fs.readFileSync('.github/workflows/deploy.yml','utf8'),/branches: \[master\]/);
console.log('OpenCode Go / Pi SDLC checks: PASS');
