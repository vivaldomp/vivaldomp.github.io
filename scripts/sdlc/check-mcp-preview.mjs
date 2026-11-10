#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const dir = 'sdlc-screenshots';
const required = ['desktop.png','mobile.png','evidence.json','visual-audit.md','mcp-desktop.png','mcp-mobile.png'];
for (const file of required) {
  const name = path.join(dir,file);
  if (!fs.existsSync(name) || fs.statSync(name).size === 0) {
    console.error(`Missing or empty visual evidence: ${name}`);
    process.exitCode = 1;
  }
}
if(!process.exitCode) console.log('Desktop/mobile deterministic + MCP screenshots and audit are present. Human approval still required.');
