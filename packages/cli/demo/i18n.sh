#!/usr/bin/env bash
set -euo pipefail

pnpm --filter lingo.dev run build

root_dir=$(git rev-parse --show-toplevel)
cli="$root_dir/packages/cli/bin/cli.mjs"
demo_root="$root_dir/packages/cli/demo"

for demo in "$demo_root"/*/; do
  printf '\n%s\n' "${demo%/}"
  (
    cd "$demo"
    node "$cli" i18n "$@"
  )
 done 