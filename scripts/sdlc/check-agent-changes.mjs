#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
const raw = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { encoding:'utf8' });
const paths = raw.split('\n').filter(Boolean).map(line => line.slice(3).split(' -> ').at(-1));
const allowed = p => /^(src|public|tests)\//.test(p) || /^docs\/product\//.test(p) || p === 'package.json' || p === 'package-lock.json';
const disallowed = paths.filter(p => !allowed(p));
if(disallowed.length) {
  console.error('Agent modified protected paths:\n' + disallowed.join('\n'));
  process.exit(1);
}
if(!paths.length) {
  console.error('No changes produced by agent; refusing empty pull request.');
  process.exit(1);
}
console.log(`Agent changed ${paths.length} allowed path(s): ${paths.join(', ')}`);
