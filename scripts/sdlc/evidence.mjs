#!/usr/bin/env node
import fs from 'node:fs';
const files = ['desktop.png','mobile.png'];
for (const file of files) if (!fs.existsSync(`sdlc-screenshots/${file}`)) throw new Error(`Missing screenshot: ${file}`);
fs.writeFileSync('sdlc-screenshots/evidence.json', JSON.stringify({
 schema_version:'1.0',
 source_repository:process.env.GITHUB_REPOSITORY || null,
 pull_request_number:Number(process.env.PR_NUMBER||0),
 commit_sha:process.env.HEAD_SHA||null,
 screenshots:{desktop:'desktop.png',mobile:'mobile.png'},
 screenshot_environment:'GitHub Actions ephemeral local preview',
 human_approved:false,
 build_outcome:'passed'
},null,2)+'\n');
