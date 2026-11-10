#!/usr/bin/env bash
set -euo pipefail
# User-level rather than .pi/mcp.json: project MCP requires interactive trust.
# This runner is ephemeral; no keys or project-trust bypasses are written to the repository.
mkdir -p "${GITHUB_WORKSPACE:-$PWD}/sdlc-screenshots"
pi mcp add playwright \
  --exposure direct \
  --description 'Read-only visual inspection of local Astro preview; screenshots and accessibility snapshots' \
  -- npx --yes @playwright/mcp@0.0.79 \
  --headless --no-sandbox --browser chromium \
  --output-dir "${GITHUB_WORKSPACE:-$PWD}/sdlc-screenshots"
# Fail if the configured MCP cannot start: the visual audit must not silently degrade.
pi mcp list
