#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
build_script="$repo_root/scripts/build.sh"
clean_script="$repo_root/scripts/clean.sh"
generated_app="$repo_root/.generated/Miller Avatar Alpha.app"
executable="$generated_app/Contents/MacOS/MillerAvatarApp"
private_parent=$(mktemp -d "${TMPDIR:-/tmp}/miller-avatar-publication-regression.XXXXXX")
private_root="$private_parent/build"

remove_test_root() {
    local target=$1
    local attempt
    for attempt in 1 2 3; do
        [[ -e "$target" || -L "$target" ]] || return 0
        rm -rf -- "$target" 2>/dev/null || true
    done
    printf 'could not remove test-owned root: %s\n' "$target" >&2
    return 1
}

cleanup() {
    local status=$?
    trap - EXIT
    remove_test_root "$repo_root/.generated" || status=1
    remove_test_root "$private_parent" || status=1
    exit "$status"
}
trap cleanup EXIT

remove_test_root "$repo_root/.generated"
"$build_script" "$private_root"

before_hash=$(shasum -a 256 "$executable" | awk '{ print $1 }')
codesign --verify --deep --strict "$generated_app"

if MILLER_AVATAR_SIMULATE_PUBLICATION_FAILURE=1 "$build_script" "$private_root"; then
    printf 'simulated publication failure unexpectedly succeeded\n' >&2
    exit 1
fi

after_hash=$(shasum -a 256 "$executable" | awk '{ print $1 }')
if [[ "$after_hash" != "$before_hash" ]]; then
    printf 'prior executable hash changed after publication failure\n' >&2
    exit 1
fi

codesign --verify --deep --strict "$generated_app"

if find "$generated_app" -name '.previous.*.app' -print -quit | grep -q .; then
    printf 'rollback nested a saved app inside the canonical app\n' >&2
    exit 1
fi

if find "$repo_root/.generated" -maxdepth 1 -type d -name '.app-stage.*' -print -quit | grep -q .; then
    printf 'publication left an app stage directory behind\n' >&2
    exit 1
fi
