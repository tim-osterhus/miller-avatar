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

simulated_failure_stage=${MILLER_AVATAR_SIMULATE_FAILURE_STAGE:-}
case "$simulated_failure_stage" in
    ""|toolchain|swift|assembly|codesign) ;;
    *)
        printf 'MILLER_AVATAR_SIMULATE_FAILURE_STAGE must be toolchain, swift, assembly, or codesign\n' >&2
        exit 64
        ;;
esac

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
logical_run_root="$generated_root/.logical-build-root"
rm -f -- "$logical_run_root"
ln -s "$run_root" "$logical_run_root"
scratch_path="$logical_run_root/swiftpm"
clang_cache="$logical_run_root/module-cache/clang"
swift_cache="$logical_run_root/module-cache/swift"
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
    if ! rm -f -- "$logical_run_root"; then
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

simulate_failure() {
    local stage=$1
    if [[ "$simulated_failure_stage" == "$stage" ]]; then
        printf 'simulated %s failure\n' "$stage" >&2
        return 1
    fi
}

mkdir -p "$scratch_path" "$clang_cache" "$swift_cache" "$logical_run_root/tmp" "$stage_root"

if [[ "${MILLER_AVATAR_SIMULATE_INTERRUPT:-}" == "1" ]]; then
    kill -TERM "$$"
fi

simulate_failure toolchain
"$repo_root/scripts/verify-toolchain.sh"
simulate_failure swift

swift_build=(
    swift build
    --package-path "$repo_root"
    --scratch-path "$scratch_path"
    --configuration release
    --product MillerAvatarApp
    -Xlinker -no_uuid
    -Xcc "-fmodules-cache-path=$clang_cache"
    -Xswiftc -module-cache-path
    -Xswiftc "$swift_cache"
)

CLANG_MODULE_CACHE_PATH="$clang_cache" \
SWIFT_MODULE_CACHE_PATH="$swift_cache" \
TMPDIR="$logical_run_root/tmp" \
    "${swift_build[@]}"

binary_directory=$(
    CLANG_MODULE_CACHE_PATH="$clang_cache" \
    SWIFT_MODULE_CACHE_PATH="$swift_cache" \
    TMPDIR="$logical_run_root/tmp" \
        swift build \
        --package-path "$repo_root" \
        --scratch-path "$scratch_path" \
        --configuration release \
        -Xcc "-fmodules-cache-path=$clang_cache" \
        -Xswiftc -module-cache-path \
        -Xswiftc "$swift_cache" \
        --show-bin-path
)

simulate_failure assembly
mkdir -p \
    "$generated_root" \
    "$stage_app/Contents/MacOS" \
    "$stage_app/Contents/Resources/Legal" \
    "$stage_app/Contents/Resources/Static"
cp "$repo_root/Config/Info.plist" "$stage_app/Contents/Info.plist"
cp "$binary_directory/MillerAvatarApp" "$stage_app/Contents/MacOS/MillerAvatarApp"
strip -S -x "$stage_app/Contents/MacOS/MillerAvatarApp"
cp "$repo_root/LICENSE" "$stage_app/Contents/Resources/Legal/LICENSE"
cp "$repo_root/NOTICE" "$stage_app/Contents/Resources/Legal/NOTICE"
cp "$repo_root/THIRD_PARTY_NOTICES.md" "$stage_app/Contents/Resources/Legal/THIRD_PARTY_NOTICES.md"
cp -R "$repo_root/Resources/Static/." "$stage_app/Contents/Resources/Static/"
cp -R "$binary_directory/MillerAvatar_MillerAvatarHost.bundle" "$stage_app/Contents/Resources/"

build_manifest="$stage_app/Contents/Resources/build-manifest.json"
manifest_entries="$run_root/build-manifest-entries.txt"
input_manifest_entries="$run_root/build-input-manifest-entries.txt"
executable_input_manifest_entries="$run_root/executable-input-manifest-entries.txt"
(
    cd "$repo_root"
    {
        printf '%s\n' \
            Package.swift \
            Config/Info.plist \
            Config/MillerAvatarAlpha.entitlements \
            LICENSE \
            NOTICE \
            scripts/build.sh \
            scripts/verify-toolchain.sh \
            THIRD_PARTY_NOTICES.md
        find Sources -type f -name '*.swift' -print
        find Resources/Static Sources/MillerAvatarHost/Resources/Web -type f -print
    } | LC_ALL=C sort -u |
        while IFS= read -r relative_path; do
            digest=$(shasum -a 256 "$relative_path" | awk '{print $1}')
            byte_count=$(stat -f %z "$relative_path")
            printf '%s\t%s\t%s\n' "$relative_path" "$byte_count" "$digest"
        done
) > "$input_manifest_entries"
(
    cd "$repo_root"
    {
        printf '%s\n' \
            Package.swift \
            scripts/build.sh \
            scripts/verify-toolchain.sh
        find Sources -type f -name '*.swift' -print
    } | LC_ALL=C sort -u |
        while IFS= read -r relative_path; do
            digest=$(shasum -a 256 "$relative_path" | awk '{print $1}')
            byte_count=$(stat -f %z "$relative_path")
            printf '%s\t%s\t%s\n' "$relative_path" "$byte_count" "$digest"
        done
) > "$executable_input_manifest_entries"
(
    cd "$stage_app"
    find Contents -type f \
        ! -name build-manifest.json \
        ! -path 'Contents/MacOS/MillerAvatarApp' \
        -print | LC_ALL=C sort |
        while IFS= read -r relative_path; do
            digest=$(shasum -a 256 "$relative_path" | awk '{print $1}')
            byte_count=$(stat -f %z "$relative_path")
            printf '%s\t%s\t%s\n' "$relative_path" "$byte_count" "$digest"
        done
) > "$manifest_entries"
source_revision=$(
    git -C "$repo_root" log -1 --format=%H -- \
        Package.swift \
        Config/Info.plist \
        Config/MillerAvatarAlpha.entitlements \
        LICENSE \
        NOTICE \
        THIRD_PARTY_NOTICES.md \
        Sources \
        Resources/Static \
        Sources/MillerAvatarHost/Resources/Web \
        scripts/build.sh \
        scripts/verify-toolchain.sh
)
if [[ ! "$source_revision" =~ ^[0-9a-f]{40}$ ]]; then
    printf 'could not resolve the source-input revision\n' >&2
    exit 1
fi
executable_input_sha256=$(shasum -a 256 "$executable_input_manifest_entries" | awk '{print $1}')
web_bundle_manifest_sha256=$(shasum -a 256 "$repo_root/Sources/MillerAvatarHost/Resources/Web/bundle-manifest.json" | awk '{print $1}')
{
    printf '%s' '{"schema":"miller-avatar.build-manifest/v1"'
    printf '%s' ',"product":{"name":"Miller Avatar Alpha","bundle_identifier":"ai.millrace.miller-avatar.alpha","short_version":"0.0.1","build_version":"1","deployment_target":"15.0"}'
    printf '%s' ',"toolchain":{"command_line_tools":"16.4.0.0.1.1747106510","swift":"6.1.2","clang":"17.0.0","macos_sdk":"15.5","architecture":"arm64"}'
    printf ',"source_revision":"%s"' "$source_revision"
    printf ',"executable_input_sha256":"%s"' "$executable_input_sha256"
    printf ',"web_bundle_manifest_sha256":"%s"' "$web_bundle_manifest_sha256"
    printf ',"inputs":['
    separator=""
    while IFS=$'\t' read -r relative_path byte_count digest; do
        printf '%s{"path":"%s","byte_count":%s,"sha256":"%s"}' \
            "$separator" "$relative_path" "$byte_count" "$digest"
        separator=,
    done < "$input_manifest_entries"
    printf '],"files":['
    separator=""
    while IFS=$'\t' read -r relative_path byte_count digest; do
        printf '%s{"path":"%s","byte_count":%s,"sha256":"%s"}' \
            "$separator" "$relative_path" "$byte_count" "$digest"
        separator=,
    done < "$manifest_entries"
    printf ']}\n'
} > "$build_manifest"

simulate_failure codesign
find "$stage_app" -exec touch -t 202001010000 {} +
codesign \
    --force \
    --sign - \
    --entitlements "$repo_root/Config/MillerAvatarAlpha.entitlements" \
    "$stage_app"
codesign --verify --deep --strict "$stage_app"

signed_entries="$run_root/post-sign-entries.txt"
(
    cd "$stage_app"
    find Contents -type f -print | LC_ALL=C sort |
        while IFS= read -r relative_path; do
            digest=$(shasum -a 256 "$relative_path" | awk '{print $1}')
            byte_count=$(stat -f %z "$relative_path")
            printf '%s\t%s\t%s\n' "$relative_path" "$byte_count" "$digest"
        done
) > "$signed_entries"
signed_tree_hash=$(shasum -a 256 "$signed_entries" | awk '{print $1}')
signed_executable="$stage_app/Contents/MacOS/MillerAvatarApp"
signed_executable_hash=$(shasum -a 256 "$signed_executable" | awk '{print $1}')
signed_executable_bytes=$(stat -f %z "$signed_executable")
post_sign_receipt="$run_root/post-sign-receipt.json"
retained_build_manifest="$run_root/build-manifest.json"
cp "$build_manifest" "$retained_build_manifest"
pre_sign_manifest_hash=$(shasum -a 256 "$retained_build_manifest" | awk '{print $1}')
printf '%s\n' \
    "{\"schema\":\"miller-avatar.post-sign-receipt/v1\",\"pre_sign_manifest_sha256\":\"$pre_sign_manifest_hash\",\"executable\":{\"path\":\"Contents/MacOS/MillerAvatarApp\",\"byte_count\":$signed_executable_bytes,\"sha256\":\"$signed_executable_hash\"},\"app_tree_sha256\":\"$signed_tree_hash\"}" \
    > "$post_sign_receipt"

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
cp "$retained_build_manifest" "$repo_root/Resources/build-manifest.json"
cp "$post_sign_receipt" "$generated_root/Miller Avatar Alpha.post-sign.json"

rm -rf -- "$previous_app"
publication_started=0
printf 'built %s\n' "$output_app"
