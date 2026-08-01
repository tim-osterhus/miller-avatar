#!/bin/bash

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
repo_parent=$(CDPATH= cd -- "$repo_root/.." && pwd -P)
generated_root="$repo_root/.generated"
default_build_root_input="$generated_root/private-build"
output_app="$generated_root/Miller Avatar Alpha.app"

if (( $# > 1 )); then
    printf 'usage: %s [private-build-root]\n' "$0" >&2
    exit 64
fi

build_root_input=${1:-${MILLER_AVATAR_BUILD_ROOT:-"$default_build_root_input"}}
if [[ -z "$build_root_input" || "$build_root_input" != /* ]]; then
    printf 'private build root must be a non-empty absolute path\n' >&2
    exit 64
fi

build_root_existed=0
if [[ -e "$build_root_input" || -L "$build_root_input" ]]; then
    build_root_existed=1
    if [[ ! -d "$build_root_input" ]]; then
        printf 'private build root must be a directory: %s\n' "$build_root_input" >&2
        exit 64
    fi
fi
mkdir -p "$build_root_input"
build_root=$(CDPATH= cd -- "$build_root_input" && pwd -P) || {
    printf 'could not canonicalize private build root: %s\n' "$build_root_input" >&2
    exit 64
}
mkdir -p "$default_build_root_input"
default_build_root=$(CDPATH= cd -- "$default_build_root_input" && pwd -P)
home_root=""
if [[ -n "${HOME:-}" && -d "$HOME" ]]; then
    home_root=$(CDPATH= cd -- "$HOME" && pwd -P)
fi

case "$build_root" in
    /|"$repo_root"|"$repo_parent"|"$home_root")
        printf 'refusing unsafe private build root: %s\n' "$build_root" >&2
        exit 64
        ;;
    "$repo_root"/*)
        if [[ "$build_root" != "$default_build_root" ]]; then
            printf 'repository-local build root must be %s\n' "$default_build_root_input" >&2
            exit 64
        fi
        ;;
esac

if [[ "$build_root" != "$default_build_root" ]] &&
    git -C "$build_root" rev-parse --is-inside-work-tree >/dev/null 2>&1
then
    printf 'refusing private build root inside a repository: %s\n' "$build_root" >&2
    exit 64
fi

marker="$build_root/.miller-avatar-build-root"
if [[ "$build_root" != "$default_build_root" && "$build_root_existed" == "1" ]] &&
    { [[ ! -f "$marker" ]] ||
        [[ "$(sed -n '1p' "$marker")" != "miller-avatar-private-build-root-v1" ]]; }
then
    printf 'refusing existing unowned private build root: %s\n' "$build_root" >&2
    exit 64
fi
printf 'miller-avatar-private-build-root-v1\n' > "$marker"
run_root=$(mktemp -d "$build_root/.run.XXXXXX")
scratch_path="$run_root/swiftpm"
clang_cache="$run_root/module-cache/clang"
swift_cache="$run_root/module-cache/swift"
stage_root="$run_root/app-stage"
stage_app="$stage_root/Miller Avatar Alpha.app"
previous_app="$run_root/previous.app"
publication_started=0

restore_prior_output() {
    if [[ -e "$output_app" ]] && ! rm -rf -- "$output_app"; then
        printf 'could not remove partial app: %s\n' "$output_app" >&2
        return 1
    fi
    if [[ -e "$previous_app" ]] && ! mv "$previous_app" "$output_app"; then
        printf 'could not restore prior app: %s\n' "$previous_app" >&2
        return 1
    fi
    publication_started=0
}

cleanup_run() {
    local status=$?
    trap - EXIT
    if (( publication_started )) && ! restore_prior_output; then
        status=1
    fi
    if ! rm -rf -- "$run_root"; then
        status=1
    fi
    exit "$status"
}
trap cleanup_run EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

mkdir -p "$scratch_path" "$clang_cache" "$swift_cache" "$run_root/tmp" "$stage_root"

"$repo_root/scripts/verify-toolchain.sh"

swift_build=(
    swift build
    --package-path "$repo_root"
    --scratch-path "$scratch_path"
    --configuration release
    --product MillerAvatarApp
    -Xcc "-fmodules-cache-path=$clang_cache"
    -Xswiftc -module-cache-path
    -Xswiftc "$swift_cache"
)

CLANG_MODULE_CACHE_PATH="$clang_cache" \
SWIFT_MODULE_CACHE_PATH="$swift_cache" \
TMPDIR="$run_root/tmp" \
    "${swift_build[@]}"

binary_directory=$(
    CLANG_MODULE_CACHE_PATH="$clang_cache" \
    SWIFT_MODULE_CACHE_PATH="$swift_cache" \
    TMPDIR="$run_root/tmp" \
        swift build \
        --package-path "$repo_root" \
        --scratch-path "$scratch_path" \
        --configuration release \
        -Xcc "-fmodules-cache-path=$clang_cache" \
        -Xswiftc -module-cache-path \
        -Xswiftc "$swift_cache" \
        --show-bin-path
)

mkdir -p "$generated_root" "$stage_app/Contents/MacOS" "$stage_app/Contents/Resources/Static"
cp "$repo_root/Config/Info.plist" "$stage_app/Contents/Info.plist"
cp "$binary_directory/MillerAvatarApp" "$stage_app/Contents/MacOS/MillerAvatarApp"
cp -R "$repo_root/Resources/Static/." "$stage_app/Contents/Resources/Static/"

find "$stage_app" -exec touch -t 202001010000 {} +
codesign \
    --force \
    --sign - \
    --entitlements "$repo_root/Config/MillerAvatarAlpha.entitlements" \
    "$stage_app"
codesign --verify --deep --strict "$stage_app"
codesign --display --verbose=2 "$stage_app" > "$run_root/post-sign-receipt.txt" 2>&1

if [[ -e "$output_app" ]]; then
    mv "$output_app" "$previous_app"
fi
publication_started=1
if [[ "${MILLER_AVATAR_SIMULATE_PUBLICATION_FAILURE:-}" == "1" ]]; then
    mkdir -p "$output_app"
    : > "$output_app/.partial-publication"
    exit 1
fi

mv "$stage_app" "$output_app"
codesign --verify --deep --strict "$output_app"

rm -rf -- "$previous_app"
publication_started=0
printf 'built %s\n' "$output_app"
