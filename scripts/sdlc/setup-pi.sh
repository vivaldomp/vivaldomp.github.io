#!/usr/bin/env bash
set -euo pipefail
# Pi packages installed at user scope on this *ephemeral* Actions runner.
# Package is pinned and has extension + skills; review updates before changing.
npm install --global --ignore-scripts @earendil-works/pi-coding-agent
pi install npm:pi-lens@4.4.11
pi list
