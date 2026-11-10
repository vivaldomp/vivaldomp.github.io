#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
function run(cmd,args){
  const result=spawnSync(cmd,args,{stdio:'inherit',shell:false});
  if(result.error || result.status!==0) throw new Error(`Failed: ${cmd} ${args.join(' ')}`);
}
if (fs.existsSync('package.json')) {
  const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
  const manager = fs.existsSync('pnpm-lock.yaml') ? ['corepack','pnpm'] : fs.existsSync('yarn.lock') ? ['corepack','yarn'] : ['npm',null];
  for(const step of ['lint','test','typecheck']){
    if(!pkg.scripts?.[step]) continue;
    const args=manager[1] ? [manager[1], 'run', step] : ['run', step];
    console.log(`Executing ${step}...`);
    run(manager[0],args);
  }
}
run('node',['scripts/sdlc/prepare-preview.mjs']);
console.log('Astro build and site tests PASS. Screenshot workflow is a separate required check.');
