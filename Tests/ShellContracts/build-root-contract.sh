#!/bin/bash

set -euo pipefail

repository_root=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd -P)
temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/miller-avatar-build-contract.XXXXXX")
trap 'rm -rf -- "$temporary_root"' EXIT

copy_root="$temporary_root/repository"
mkdir -p "$copy_root/scripts"
cp "$repository_root/scripts/build.sh" "$copy_root/scripts/build.sh"
chmod +x "$copy_root/scripts/build.sh"

fake_home="$temporary_root/home"
mkdir -p "$fake_home"
if HOME="$fake_home" "$copy_root/scripts/build.sh" "$fake_home"; then
    printf 'build accepted a home directory\n' >&2
    exit 1
fi
test ! -e "$fake_home/.miller-avatar-build-root"

if HOME="$fake_home" "$copy_root/scripts/build.sh" /; then
    printf 'build accepted the filesystem root\n' >&2
    exit 1
fi

existing_unowned="$temporary_root/existing-unowned"
mkdir -p "$existing_unowned"
printf 'preserve me\n' > "$existing_unowned/sentinel.txt"
if HOME="$fake_home" "$copy_root/scripts/build.sh" "$existing_unowned"; then
    printf 'build accepted an existing unowned directory\n' >&2
    exit 1
fi
test "$(cat "$existing_unowned/sentinel.txt")" = 'preserve me'
test ! -e "$existing_unowned/.miller-avatar-build-root"
