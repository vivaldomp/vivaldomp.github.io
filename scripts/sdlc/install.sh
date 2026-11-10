#!/usr/bin/env bash
set -euo pipefail
if [[ ! -f package.json ]]; then
  echo 'No package.json: site may be static/Jekyll.'
  exit 0
fi
if [[ -f pnpm-lock.yaml ]]; then
  corepack enable
  corepack pnpm install --frozen-lockfile
elif [[ -f yarn.lock ]]; then
  corepack enable
  corepack yarn install --immutable
elif [[ -f package-lock.json ]]; then
  npm ci
else
  echo '::error::A Node project must commit a lockfile before CI is reproducible.'
  exit 1
fi
