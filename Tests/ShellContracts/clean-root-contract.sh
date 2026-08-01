#!/bin/bash

set -euo pipefail

repository_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd -P)
temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/miller-avatar-clean-contract.XXXXXX")
trap 'rm -rf -- "$temporary_root"' EXIT

copy_root="$temporary_root/repository"
mkdir -p "$copy_root/scripts"
cp "$repository_root/scripts/clean.sh" "$copy_root/scripts/clean.sh"
chmod +x "$copy_root/scripts/clean.sh"

fake_home="$temporary_root/home"
mkdir -p "$fake_home"
printf 'miller-avatar-private-build-root-v1\n' > "$fake_home/.miller-avatar-build-root"

if HOME="$fake_home" "$copy_root/scripts/clean.sh" "$fake_home"; then
    printf 'clean accepted a home directory\n' >&2
    exit 1
fi
test -d "$fake_home"

unresolved_root="$temporary_root/unresolved"
if HOME="$fake_home" "$copy_root/scripts/clean.sh" "$unresolved_root"; then
    printf 'clean accepted an unresolved root\n' >&2
    exit 1
fi
