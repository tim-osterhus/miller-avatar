#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
pinned_node=/opt/homebrew/Cellar/node@22/22.22.0/bin/node

if [[ -x "$pinned_node" ]]; then
    node_command=$pinned_node
else
    node_command=$(command -v node || true)
fi
if [[ -z "$node_command" ]] || [[ $("$node_command" --version) != "v22.22.0" ]]; then
    printf 'Node 22.22.0 is required for dependency verification\n' >&2
    exit 1
fi

"$node_command" "$repo_root/Web/scripts/verify-dependencies.mjs" \
    --repository-root "$repo_root"
