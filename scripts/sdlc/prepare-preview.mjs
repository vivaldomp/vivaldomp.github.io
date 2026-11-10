#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const cwd = process.cwd();
const output = path.join(cwd, '.sdlc-preview');
if (fs.existsSync(output)) fs.rmSync(output, {recursive: true, force: true});
function existsIndex(dir) { return fs.existsSync(path.join(dir, 'index.html')); }
function run(cmd, args) {
  const p = spawnSync(cmd, args, {cwd, stdio:'inherit', shell: false});
  if (p.error || p.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed`);
}
function copyDir(from) {
  fs.cpSync(from, output, {recursive:true, filter:(src)=> {
    const rel = path.relative(from, src).replaceAll('\\', '/');
    if (!rel) return true;
    const blocked = ['.git', '.github', 'node_modules', '.env', '.env.local', 'secrets'];
    return !rel.split('/').some(segment => blocked.includes(segment));
  }});
}
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (pkg.scripts?.build) {
    const manager = fs.existsSync('pnpm-lock.yaml') ? ['corepack',['pnpm','run','build']] :
      fs.existsSync('yarn.lock') ? ['corepack',['yarn','build']] : ['npm',['run','build']];
    run(...manager);
  }
}
const forced = process.env.SDLC_PREVIEW_DIR;
const candidates = forced ? [forced] : ['dist'];
let source = candidates.find(dir => existsIndex(dir));
if (source) {
  copyDir(path.resolve(source));
} else if (existsIndex(cwd)) {
  fs.mkdirSync(output, {recursive:true});
  for (const entry of fs.readdirSync(cwd, {withFileTypes:true})) {
    if (entry.isFile() && (/\.(html|css|js|mjs|svg|png|jpe?g|webp|ico)$/.test(entry.name) || entry.name === 'robots.txt')) {
      fs.copyFileSync(entry.name, path.join(output, entry.name));
    } else if (entry.isDirectory() && ['assets','css','js','img','images','fonts','media','static'].includes(entry.name)) {
      fs.cpSync(entry.name, path.join(output, entry.name), {recursive:true});
    }
  }
  source = '.';
} else {
  throw new Error('No index.html found. Configure SDLC_PREVIEW_DIR or adjust scripts/sdlc/prepare-preview.mjs for the site generator.');
}
if (!existsIndex(output)) throw new Error('Preview index.html not found after copy');
console.log(`Preview prepared from ${source} → .sdlc-preview/`);
