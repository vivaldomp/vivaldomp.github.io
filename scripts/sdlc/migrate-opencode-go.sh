#!/usr/bin/env bash
set -euo pipefail
# Use after applying the overlay over an older Pi/DeepSeek gh-aw package.
# Remove ONLY known obsolete files to avoid triggering both orchestrators.
rm -f \
  .github/workflows/prd-refine.md \
  .github/workflows/prd-implement.md \
  .github/workflows/prd-review.md \
  .github/workflows/prd-refine.lock.yml \
  .github/workflows/prd-implement.lock.yml \
  .github/workflows/prd-review.lock.yml \
  README-SDLC-DEEPSEEK.md
printf 'Migrated previous gh-aw PRD files. Review git status before committing.\n'
