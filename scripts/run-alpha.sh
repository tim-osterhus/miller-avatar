#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
application="$repo_root/.generated/Miller Avatar Alpha.app"
executable="$application/Contents/MacOS/MillerAvatarApp"

if [[ ! -d "$application" || ! -x "$executable" ]]; then
    printf 'built application is missing: %s\n' "$application" >&2
    exit 1
fi

"$executable" >/dev/null 2>&1 &
host_pid=$!
printf '%s\n' "$host_pid"
