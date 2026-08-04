#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
repo_parent=$(CDPATH= cd -- "$repo_root/.." && pwd -P)
generated_root="$repo_root/.generated"
default_private_root="$generated_root/private-build"

if (( $# > 1 )); then
    printf 'usage: %s [private-build-root]\n' "$0" >&2
    exit 64
fi

home_root=""
if [[ -n "${HOME:-}" && -d "$HOME" ]]; then
    home_root=$(CDPATH= cd -- "$HOME" && pwd -P)
fi

private_root=""
if (( $# == 1 )); then
    private_root_input=$1
    if [[ -z "$private_root_input" || "$private_root_input" != /* || ! -d "$private_root_input" ]]; then
        printf 'private root must be an existing absolute directory: %s\n' "$private_root_input" >&2
        exit 64
    fi
    private_root=$(CDPATH= cd -- "$private_root_input" && pwd -P) || {
        printf 'could not canonicalize private root: %s\n' "$private_root_input" >&2
        exit 64
    }
    case "$private_root" in
        /|"$repo_root"|"$repo_parent"|"$home_root")
            printf 'refusing unsafe private root: %s\n' "$private_root" >&2
            exit 64
            ;;
        "$repo_root"/*)
            if [[ "$private_root" != "$default_private_root" ]]; then
                printf 'refusing unsafe private root: %s\n' "$private_root" >&2
                exit 64
            fi
            ;;
    esac
    if [[ "$private_root" != "$default_private_root" ]] &&
        git -C "$private_root" rev-parse --is-inside-work-tree >/dev/null 2>&1
    then
        printf 'refusing private root inside a repository: %s\n' "$private_root" >&2
        exit 64
    fi
    if [[ "$private_root" != "$default_private_root" ]]; then
        marker="$private_root/.miller-avatar-build-root"
        if [[ ! -f "$marker" ]] ||
            [[ "$(sed -n '1p' "$marker")" != "miller-avatar-private-build-root-v1" ]]
        then
            printf 'private root lacks the Miller Avatar build marker: %s\n' "$private_root" >&2
            exit 64
        fi
    fi
fi

remove_declared_root() {
    local target=$1
    printf 'removing declared root: %s\n' "$target"
    local attempt
    for attempt in 1 2 3; do
        [[ -e "$target" || -L "$target" ]] || return 0
        rm -rf -- "$target" 2>/dev/null || true
    done
    printf 'could not remove declared root: %s\n' "$target" >&2
    return 1
}

remove_declared_root "$generated_root"
remove_declared_root "$repo_root/.build"
remove_declared_root "$repo_root/Web/.build"
remove_declared_root "$repo_root/Web/node_modules"
if [[ -n "$private_root" && "$private_root" != "$default_private_root" ]]; then
    remove_declared_root "$private_root"
fi
