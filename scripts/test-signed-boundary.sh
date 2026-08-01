#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
default_app="$repo_root/.generated/Miller Avatar Alpha.app"

if (( $# > 1 )); then
    printf 'usage: %s [app-bundle]\n' "$0" >&2
    exit 64
fi

app_bundle=${1:-"$default_app"}
if [[ ! -d "$app_bundle" ]]; then
    printf 'signed app bundle is missing: %s\n' "$app_bundle" >&2
    exit 1
fi

codesign --verify --deep --strict "$app_bundle"

entitlements=$(mktemp "${TMPDIR:-/tmp}/miller-avatar-entitlements.XXXXXX")
probe_log=$(mktemp "${TMPDIR:-/tmp}/miller-avatar-signed-boundary.XXXXXX")
probe_pid=""

cleanup() {
    if [[ -n "$probe_pid" ]] && kill -0 "$probe_pid" 2>/dev/null; then
        kill "$probe_pid" 2>/dev/null || true
        wait "$probe_pid" 2>/dev/null || true
    fi
    rm -f -- "$entitlements" "$probe_log"
}
trap cleanup EXIT

codesign -d --entitlements :- "$app_bundle" > "$entitlements"
plutil -lint "$entitlements" >/dev/null

actual_keys=$(
    /usr/libexec/PlistBuddy -c Print "$entitlements" |
        sed -nE 's/^[[:space:]]*([^ =]+) = .*/\1/p' |
        LC_ALL=C sort
)
expected_keys=$(printf '%s\n' \
    com.apple.security.app-sandbox \
    com.apple.security.files.user-selected.read-only \
    com.apple.security.network.client | LC_ALL=C sort)
if [[ "$actual_keys" != "$expected_keys" ]]; then
    printf 'unexpected signed entitlement keys:\n%s\n' "$actual_keys" >&2
    exit 1
fi
while IFS= read -r key; do
    if [[ $(/usr/libexec/PlistBuddy -c "Print :$key" "$entitlements") != "true" ]]; then
        printf 'signed entitlement is not true: %s\n' "$key" >&2
        exit 1
    fi
done <<< "$expected_keys"

if rg -n 'stall wrapper|stall scheme|context loss|fake web process|invalid observation' "$app_bundle"; then
    printf 'forbidden fault-hook vocabulary found in signed app\n' >&2
    exit 1
fi
if find "$app_bundle" -type f \( -name '*.vrm' -o -name '*.glb' -o -name '*.vrma' \) -print -quit | grep -q .; then
    printf 'private model fixture found in signed app\n' >&2
    exit 1
fi

MILLER_AVATAR_SIGNED_BOUNDARY_PROBE=1 \
    "$app_bundle/Contents/MacOS/MillerAvatarApp" > "$probe_log" 2>&1 &
probe_pid=$!

deadline=$((SECONDS + 12))
while kill -0 "$probe_pid" 2>/dev/null && (( SECONDS < deadline )); do
    if rg -q '^MILLER_AVATAR_SIGNED_BOUNDARY wrapper_ready$' "$probe_log" &&
        rg -q '^MILLER_AVATAR_SIGNED_BOUNDARY renderer_ready$' "$probe_log"; then
        break
    fi
    sleep 0.1
done

if ! rg -q '^MILLER_AVATAR_SIGNED_BOUNDARY wrapper_ready$' "$probe_log" ||
    ! rg -q '^MILLER_AVATAR_SIGNED_BOUNDARY renderer_ready$' "$probe_log" ||
    rg -q '^MILLER_AVATAR_SIGNED_BOUNDARY failed ' "$probe_log"; then
    printf 'signed production boundary did not reach renderer readiness:\n' >&2
    cat "$probe_log" >&2
    exit 1
fi

if kill -0 "$probe_pid" 2>/dev/null; then
    wait "$probe_pid"
fi
probe_pid=""
printf 'signed production boundary passed\n'
